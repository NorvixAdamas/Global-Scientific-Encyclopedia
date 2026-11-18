/* =========================================================================
   Chemistry & reaction adapters
   PubChem PUG-REST / PUG-View · ChEBI REST · ChEMBL REST · Rhea REST (TSV)
   All endpoints are free and were verified reachable from a browser.
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const E = Sci.entity;
  const net = Sci.net;
  const A = (Sci.adapters = Sci.adapters || {});

  const NOW = () => new Date().toISOString();
  const enc = encodeURIComponent;

  function sourceMeta(id) {
    const s = Sci.registry.byId[id] || {};
    return { license: s.license, url: s.url, api: s.api };
  }

  function prov(source, recordId, url, dataType, note) {
    const meta = sourceMeta(source);
    return E.provenance({
      source,
      recordId,
      url,
      license: meta.license,
      dataType: dataType || "reported",
      retrievedAt: NOW(),
      note,
    });
  }

  /* =======================================================================
     PubChem
     ======================================================================= */
  const REST = "https://pubchem.ncbi.nlm.nih.gov/rest";
  const PUB = REST + "/pug";

  const PUBCHEM_PROPS = [
    "MolecularFormula",
    "MolecularWeight",
    "ExactMass",
    "MonoisotopicMass",
    "CanonicalSMILES",
    "IsomericSMILES",
    "IUPACName",
    "InChI",
    "InChIKey",
    "XLogP",
    "TPSA",
    "HBondDonorCount",
    "HBondAcceptorCount",
    "RotatableBondCount",
    "HeavyAtomCount",
    "Charge",
    "Complexity",
  ].join(",");

  function cidList(arr) {
    return (arr || []).filter(Boolean).slice(0, 40).join(",");
  }

  /** Flatten PUG-View JSON into {heading, path, text} records. */
  function flattenPugView(record, out, path) {
    out = out || [];
    path = path || [];
    if (!record) return out;
    if (Array.isArray(record)) {
      record.forEach((r) => flattenPugView(r, out, path));
      return out;
    }
    if (typeof record !== "object") return out;
    const heading = record.TOCHeading || record.Name || null;
    const nextPath = heading ? path.concat(heading) : path;
    if (record.StringWithMarkup) {
      const text = record.StringWithMarkup.map((s) => (s && s.String) || "").join(" ");
      if (text.trim()) out.push({ heading: heading || path[path.length - 1] || "", path: nextPath, text: text.trim() });
    }
    if (record.String) out.push({ heading: heading || "", path: nextPath, text: String(record.String) });
    if (record.Number !== undefined && record.Number !== null) {
      out.push({ heading: heading || "", path: nextPath, text: String(record.Number), unit: record.Unit });
    }
    if (record.Section) flattenPugView(record.Section, out, nextPath);
    if (record.Information) flattenPugView(record.Information, out, nextPath);
    if (record.Value) flattenPugView(record.Value, out, nextPath);
    return out;
  }

  const REF_PATTERNS = {
    chebi: { re: /CHEBI:\s*(\d+)/i, label: "ChEBI" },
    chembl: { re: /(CHEMBL\d+)/i, label: "ChEMBL" },
    drugbank: { re: /\b(DB\d{5})\b/, label: "DrugBank" },
    kegg: { re: /\b(C\d{5}|D\d{5}|G\d{5})\b/, label: "KEGG" },
    hmdb: { re: /\b(HMDB\d+)\b/i, label: "HMDB" },
    cas: { re: /\b(\d{2,7}-\d{2}-\d)\b/, label: "CAS" },
    unii: { re: /\b([A-Z0-9]{10})\b/, label: "UNII" },
    atc: { re: /\b([A-Z]\d{2}[A-Z]{2}\d{2})\b/, label: "ATC" },
    rxcui: { re: /\b(\d{3,8})\b/, label: "RxCUI" },
  };

  /** Pull cross-database identifiers out of a PubChem PUG-View record. */
  function crossRefsFromPugView(json) {
    const flat = flattenPugView(json && json.Record, []);
    const found = {};
    flat.forEach((row) => {
      const h = row.heading || "";
      Object.keys(REF_PATTERNS).forEach((key) => {
        if (found[key]) return;
        const label = REF_PATTERNS[key].label;
        if (h.toLowerCase().indexOf(label.toLowerCase()) === -1) return;
        const m = row.text.match(REF_PATTERNS[key].re);
        if (m) found[key] = m[1];
      });
    });
    return found;
  }

  function pubchemUrl(cid) {
    return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
  }

  async function pubchemCidsByName(name, max) {
    try {
      const j = await net.getJSON(`${PUB}/compound/name/${enc(name)}/cids/JSON`, {
        sourceId: "pubchem",
        ttl: 24 * 3600 * 1000,
      });
      return ((j && j.IdentifierList && j.IdentifierList.CID) || []).slice(0, max || 12);
    } catch (err) {
      if (err && err.status === 404) return [];
      throw err;
    }
  }

  async function pubchemProps(cids) {
    if (!cids || !cids.length) return [];
    const j = await net.getJSON(`${PUB}/compound/cid/${cidList(cids)}/property/${PUBCHEM_PROPS}/JSON`, {
      sourceId: "pubchem",
      ttl: 24 * 3600 * 1000,
    });
    return (j && j.PropertyTable && j.PropertyTable.Properties) || [];
  }

  function propKind(dtype) {
    const s = String(dtype || "").toLowerCase();
    if (s.includes("experimental")) return "experimental";
    if (s.includes("computed") || s.includes("predicted")) return "computed";
    return "reported";
  }

  function pubchemRecordFromProps(p, extra) {
    const cid = String(p.CID);
    const ids = {
      cid,
      formula: p.MolecularFormula || null,
      smiles: p.CanonicalSMILES || (p.ConnectivitySMILES || null),
      isomericSmiles: p.IsomericSMILES || null,
      inchi: p.InChI || null,
      inchikey: p.InChIKey || null,
    };
    (extra || []).forEach((kv) => {
      if (kv[1]) ids[kv[0]] = kv[1];
    });
    const props = [
      ["Phân tử khối", p.MolecularWeight, "g/mol", "reported"],
      ["Khối lượng chính xác", p.ExactMass || p.MonoisotopicMass, "Da", "reported"],
      ["Công thức phân tử", p.MolecularFormula, null, "reported"],
      ["XLogP3", p.XLogP, null, "computed"],
      ["TPSA", p.TPSA, "Å²", "computed"],
      ["H-bond donor", p.HBondDonorCount, null, "computed"],
      ["H-bond acceptor", p.HBondAcceptorCount, null, "computed"],
      ["Liên kết quay được", p.RotatableBondCount, null, "computed"],
      ["Số nguyên tử nặng", p.HeavyAtomCount, null, "computed"],
      ["Điện tích", p.Charge, null, "reported"],
      ["IUPAC name", p.IUPACName, null, "reported"],
    ]
      .filter((x) => x[1] !== undefined && x[1] !== null && x[1] !== "")
      .map((x) =>
        E.property({
          name: x[0],
          value: x[1],
          unit: x[2],
          kind: x[3],
          source: "pubchem",
          recordId: cid,
          url: pubchemUrl(cid),
          license: sourceMeta("pubchem").license,
        })
      );

    return E.record({
      kind: "compound",
      id: "pubchem:" + cid,
      title: p.IUPACName || p.Title || "CID " + cid,
      subtitle: p.MolecularFormula ? p.MolecularFormula + (p.MolecularWeight ? " · " + U.num(p.MolecularWeight) + " g/mol" : "") : null,
      identifiers: ids,
      formula: p.MolecularFormula || null,
      properties: props,
      provenance: [prov("pubchem", cid, pubchemUrl(cid), "reported")],
      links: { pubchem: pubchemUrl(cid), structure2d: imageUrl(cid, 320) },
      extra: { cid, synonymsLoaded: false },
    });
  }

  function imageUrl(cid, size) {
    return `${PUB}/compound/cid/${cid}/PNG?record_type=2d&image_size=${size || 300}x${size || 300}`;
  }

  async function pubchemSearch(q, opts) {
    const o = opts || {};
    const cids = o.cid ? [o.cid] : await pubchemCidsByName(q, o.max || 10);
    if (!cids.length) return [];
    const props = await pubchemProps(cids);
    return props.map((p) => {
      const ids = { cid: String(p.CID), inchikey: p.InChIKey || null, formula: p.MolecularFormula || null };
      return {
        source: "pubchem",
        sourceLabel: "PubChem",
        kind: "compound",
        title: p.IUPACName || "CID " + p.CID,
        subtitle: [p.MolecularFormula, p.MolecularWeight ? U.num(p.MolecularWeight) + " g/mol" : null].filter(Boolean).join(" · "),
        identifiers: ids,
        why: o.cid ? "Bản ghi PubChem theo CID" : `Khớp tên trong PubChem (CID ${p.CID})`,
        route: "#/compounds/" + p.CID,
        score: 60,
        raw: p,
      };
    });
  }

  async function pubchemAutocomplete(q) {
    try {
      const j = await net.getJSON(`${PUB}/autocomplete/compound/${enc(q)}/json?limit=10`, {
        sourceId: "pubchem",
        ttl: 7 * 24 * 3600 * 1000,
      });
      const terms = (j && j.dictionary_terms && j.dictionary_terms.compound) || [];
      return terms;
    } catch (e) {
      return [];
    }
  }

  async function pubchemSynonyms(cid) {
    const j = await net.getJSON(`${PUB}/compound/cid/${enc(cid)}/synonyms/JSON`, {
      sourceId: "pubchem",
      ttl: 24 * 3600 * 1000,
    });
    const info = (j && j.InformationList && j.InformationList.Information) || [];
    const list = [];
    info.forEach((i) => (i.Synonym || []).forEach((s) => list.push(s)));
    return U.uniq(list);
  }

  async function pubchemView(cid, heading) {
    const suffix = heading ? `?heading=${enc(heading)}` : "";
    return net.getJSON(`${REST}/pug_view/data/compound/${enc(cid)}/JSON${suffix}`, {
      sourceId: "pubchem-ghs",
      ttl: 24 * 3600 * 1000,
    });
  }

  /** GHS / hazard statements, grouped by their PubChem subsection. */
  function parseGhs(json) {
    const flat = flattenPugView(json && json.Record, []);
    const out = [];
    const seen = new Set();
    flat.forEach((row) => {
      const path = row.path.join(" › ");
      if (!/GHS|Hazard|Pictogram|Signal|Precautionary/i.test(path)) return;
      const key = path + "|" + row.text;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ section: row.heading || row.path[row.path.length - 1] || "GHS", path, text: row.text });
    });
    return out.slice(0, 40);
  }

  async function pubchemCompound(cid) {
    const id = String(cid).replace(/^cid:/i, "");
    const props = await pubchemProps([id]);
    if (!props.length) throw net.error("Không tìm thấy CID " + id + " trong PubChem.", { status: 404, sourceId: "pubchem" });
    const p = props[0];
    const rec = pubchemRecordFromProps(p);
    rec.links.pubchem = pubchemUrl(id);
    rec.links.structure2d = imageUrl(id, 340);
    rec.extra = { cid: id };

    /* Enrich with synonyms + cross references; a failure here must not break the page. */
    try {
      const synonyms = await pubchemSynonyms(id);
      rec.synonyms = synonyms.slice(0, 80);
      rec.extra.synonymCount = synonyms.length;
    } catch (e) {
      rec.extra.synonymsError = true;
    }
    try {
      const view = await pubchemView(id);
      const refs = crossRefsFromPugView(view);
      Object.keys(refs).forEach((k) => {
        if (!rec.identifiers[k]) rec.identifiers[k] = refs[k];
      });
      rec.extra.crossRefs = refs;
      rec.extra.ghs = parseGhs(view);
      if (rec.extra.ghs.length) {
        rec.provenance.push(prov("pubchem-ghs", id, pubchemUrl(id), "regulatory", "Phần GHS/Hazard của PUG-View"));
      }
    } catch (e) {
      rec.extra.viewError = true;
    }
    return rec;
  }

  async function pubchemBySmiles(smiles) {
    const j = await net.getJSON(`${PUB}/compound/smiles/${enc(smiles)}/cids/JSON`, { sourceId: "pubchem", ttl: 24 * 3600 * 1000 });
    return ((j.IdentifierList && j.IdentifierList.CID) || []).slice(0, 10);
  }

  async function pubchemByInchiKey(key) {
    const j = await net.getJSON(`${PUB}/compound/inchikey/${enc(key)}/cids/JSON`, { sourceId: "pubchem", ttl: 30 * 24 * 3600 * 1000 });
    return ((j.IdentifierList && j.IdentifierList.CID) || []).slice(0, 10);
  }

  A.pubchem = {
    id: "pubchem",
    label: "PubChem",
    kinds: ["compound"],
    search: pubchemSearch,
    autocomplete: pubchemAutocomplete,
    compound: pubchemCompound,
    synonyms: pubchemSynonyms,
    ghs: async (cid) => parseGhs(await pubchemView(cid, "GHS Classification")),
    crossRefs: async (cid) => crossRefsFromPugView(await pubchemView(cid)),
    imageUrl,
    bySmiles: pubchemBySmiles,
    byInchiKey: pubchemByInchiKey,
    pageUrl: pubchemUrl,
  };

  /* =======================================================================
     ChEBI
     ======================================================================= */
  const CHEBI = "https://www.ebi.ac.uk/chebi/backend/api/public";

  function chebiAcc(v) {
    if (!v) return null;
    const s = String(v);
    return /^\d+$/.test(s) ? s : (s.match(/(\d+)/) || [])[1] || null;
  }

  function chebiEntityRecord(j) {
    const acc = chebiAcc(j.chebi_accession || j.id);
    const ids = { chebi: acc };
    if (j.default_structure && j.default_structure.smiles) ids.smiles = j.default_structure.smiles;
    if (j.default_structure && j.default_structure.inchi) ids.inchi = j.default_structure.inchi;
    if (j.default_structure && j.default_structure.inchi_key) ids.inchikey = j.default_structure.inchi_key;

    let formula = null;
    let mass = null;
    const cd = Array.isArray(j.chemical_data) ? j.chemical_data : j.chemical_data ? [j.chemical_data] : [];
    cd.forEach((d) => {
      if (!d || typeof d !== "object") return;
      const f = d.FORMULA || d.formula;
      const m = d.MASS || d.mass;
      if (f && !formula) formula = String(f);
      if (m && !mass) mass = String(m);
    });

    const synonyms = ((j.names && j.names.SYNONYM) || []).map((s) => s.name).filter(Boolean);
    const xrefs = {};
    ((j.database_accessions || []) || []).forEach((x) => {
      const src = String((x && (x.source_name || x.database)) || "").toLowerCase();
      const value = (x && (x.database_accession || x.accession)) || null;
      if (!value) return;
      if (src.includes("pubchem")) xrefs.cid = String(value);
      else if (src.includes("chembl")) xrefs.chembl = String(value);
      else if (src.includes("kegg")) xrefs.kegg = String(value);
      else if (src.includes("hmdb")) xrefs.hmdb = String(value);
      else if (src.includes("unii")) xrefs.unii = String(value);
      else if (src.includes("drugbank")) xrefs.drugbank = String(value);
    });
    Object.assign(ids, xrefs);

    const props = [];
    if (formula) props.push(E.property({ name: "Công thức phân tử", value: formula, source: "chebi", recordId: acc, url: `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${acc}` }));
    if (mass) props.push(E.property({ name: "Phân tử khối", value: mass, unit: "g/mol", source: "chebi", recordId: acc }));

    const roles = ((j.roles_classification || []) || []).map((r) => r.name || r.label || r).filter(Boolean);

    return E.record({
      kind: "compound",
      id: "chebi:" + acc,
      title: j.name || "CHEBI:" + acc,
      subtitle: [formula, roles.slice(0, 2).join(", ")].filter(Boolean).join(" · ") || "ChEBI entity",
      summary: j.definition || null,
      identifiers: ids,
      formula,
      synonyms,
      properties: props,
      provenance: [
        prov("chebi", acc, `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${acc}`, "curated", "Ontology entry"),
      ],
      links: {
        chebi: `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${acc}`,
        pubchem: ids.cid ? "https://pubchem.ncbi.nlm.nih.gov/compound/" + ids.cid : null,
      },
      extra: {
        stars: j.stars,
        roles,
        ontologyRelations: (j.ontology_relations || []).slice(0, 25),
        modifiedOn: j.modified_on,
        isReleased: j.is_released,
      },
    });
  }

  async function chebiSearch(q, opts) {
    const size = (opts && opts.max) || 8;
    const j = await net.getJSON(`${CHEBI}/es_search/?term=${enc(q)}&size=${size}`, { sourceId: "chebi", ttl: 12 * 3600 * 1000 });
    const hits = (j && (j.results || j.hits)) || [];
    return hits
      .map((hit) => {
        const src = hit._source || hit;
        const acc = chebiAcc(src.chebi_accession || src.accession || src._id);
        if (!acc) return null;
        const formula = (Array.isArray(src.chemical_data) && src.chemical_data[0] && (src.chemical_data[0].FORMULA || src.chemical_data[0].formula)) || null;
        return {
          source: "chebi",
          sourceLabel: "ChEBI",
          kind: "compound",
          title: src.name || src.chebi_name || "CHEBI:" + acc,
          subtitle: ["ChEBI:" + acc, formula].filter(Boolean).join(" · "),
          identifiers: { chebi: acc },
          why: "Khớp tên/đồng nghĩa trong ontology ChEBI",
          route: "#/compounds/chebi-" + acc,
          score: 58,
          raw: src,
        };
      })
      .filter(Boolean);
  }

  async function chebiEntity(acc) {
    const id = chebiAcc(acc);
    const j = await net.getJSON(`${CHEBI}/compound/${enc(id)}/`, { sourceId: "chebi", ttl: 24 * 3600 * 1000 });
    return chebiEntityRecord(j);
  }

  A.chebi = {
    id: "chebi",
    label: "ChEBI",
    kinds: ["compound"],
    search: chebiSearch,
    entity: chebiEntity,
    record: chebiEntity,
    pageUrl: (acc) => `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${chebiAcc(acc)}`,
  };

  /* =======================================================================
     ChEMBL
     ======================================================================= */
  const CH = "https://www.ebi.ac.uk/chembl/api/data";

  function chemblRecordFromMolecule(j, activities) {
    const id = j.molecule_chembl_id;
    const st = j.molecule_structures || {};
    const pr = j.molecule_properties || {};
    const ids = { chembl: id };
    if (pr.full_molformula) ids.formula = pr.full_molformula;
    if (st.standard_inchi_key) ids.inchikey = st.standard_inchi_key;
    if (st.standard_inchi) ids.inchi = st.standard_inchi;
    if (st.canonical_smiles) ids.smiles = st.canonical_smiles;
    ((j.cross_references || []) || []).forEach((x) => {
      const src = String(x.xref_src || "").toLowerCase();
      if (src.includes("pubchem") && x.xref_id) ids.cid = String(x.xref_id);
      if (src.includes("chebi") && x.xref_id) ids.chebi = String(x.xref_id).replace(/\D/g, "");
      if (src.includes("drugbank") && x.xref_id) ids.drugbank = String(x.xref_id);
    });

    const props = [];
    const add = (name, value, unit, kind) => {
      if (value === undefined || value === null || value === "") return;
      props.push(E.property({ name, value, unit, kind: kind || "computed", source: "chembl", recordId: id, url: `https://www.ebi.ac.uk/chembl/compound_report_card/${id}/` }));
    };
    add("Công thức phân tử", pr.full_molformula, null, "reported");
    add("Phân tử khối", pr.full_mwt, "g/mol", "reported");
    add("ALogP", pr.alogp, null, "computed");
    add("H-bond donor", pr.hbd, null, "computed");
    add("H-bond acceptor", pr.hba, null, "computed");
    add("Polar surface area", pr.psa, "Å²", "computed");
    add("QED", pr.qed_weighted, null, "computed");
    add("Số vòng thơm", pr.aromatic_rings, null, "computed");
    add("Vi phạm Lipinski", pr.num_ro5_violations, null, "computed");

    (activities || []).slice(0, 12).forEach((a) => {
      const val = a.standard_value;
      const unit = a.standard_units;
      const target = (a.target_pref_name || a.target_chembl_id || "").toString();
      const type = a.standard_type || "activity";
      if (val === undefined || val === null) return;
      props.push(
        E.property({
          name: `Bioactivity · ${type} · ${target}`,
          value: val,
          unit,
          kind: "experimental",
          source: "chembl",
          recordId: a.activity_id || id,
          url: a.activity_id ? `https://www.ebi.ac.uk/chembl/explore/activity/${a.activity_id}` : null,
          conditions: a.assay_chembl_id ? `assay ${a.assay_chembl_id}${a.assay_type ? " · " + a.assay_type : ""}` : null,
          note: a.document_chembl_id ? `Tài liệu ${a.document_chembl_id}` : null,
        })
      );
    });

    return E.record({
      kind: "compound",
      id: "chembl:" + id,
      title: j.pref_name || id,
      subtitle: [id, pr.full_molformula, pr.full_mwt ? U.num(pr.full_mwt) + " g/mol" : null].filter(Boolean).join(" · "),
      identifiers: ids,
      formula: pr.full_molformula || null,
      synonyms: ((j.molecule_synonyms || []) || []).map((s) => s.molecule_synonym).filter(Boolean).slice(0, 40),
      properties: props,
      provenance: [
        prov("chembl", id, `https://www.ebi.ac.uk/chembl/compound_report_card/${id}/`, "curated", "ChEMBL molecule"),
      ],
      links: { chembl: `https://www.ebi.ac.uk/chembl/compound_report_card/${id}/` },
      extra: {
        maxPhase: j.max_phase,
        moleculeType: j.molecule_type,
        firstApproval: j.first_approval,
        atc: j.atc_classifications,
        blackBox: j.black_box_warning,
        withdrawn: j.withdrawn_flag,
        activities: activities || [],
      },
    });
  }

  async function chemblSearch(q, opts) {
    const limit = (opts && opts.max) || 8;
    const j = await net.getJSON(`${CH}/molecule/search.json?q=${enc(q)}&limit=${limit}`, { sourceId: "chembl", ttl: 12 * 3600 * 1000 });
    return ((j && j.molecules) || []).map((m) => {
      const pr = m.molecule_properties || {};
      const st = m.molecule_structures || {};
      return {
        source: "chembl",
        sourceLabel: "ChEMBL",
        kind: "compound",
        title: m.pref_name || m.molecule_chembl_id,
        subtitle: [m.molecule_chembl_id, pr.full_molformula, pr.full_mwt ? U.num(pr.full_mwt) + " g/mol" : null]
          .filter(Boolean)
          .join(" · "),
        identifiers: { chembl: m.molecule_chembl_id, inchikey: st.standard_inchi_key || null, formula: pr.full_molformula || null },
        why: "Khớp tên phân tử trong ChEMBL (dữ liệu hoạt tính sinh học)",
        route: "#/compounds/chembl-" + m.molecule_chembl_id,
        score: 55,
        raw: m,
      };
    });
  }

  async function chemblMolecule(id, opts) {
    const cid = String(id).replace(/^chembl[-:]/i, "");
    const withActs = !opts || opts.activities !== false;
    const j = await net.getJSON(`${CH}/molecule/${enc(cid)}.json`, { sourceId: "chembl", ttl: 24 * 3600 * 1000 });
    let acts = [];
    if (withActs) {
      try {
        const a = await net.getJSON(`${CH}/activity.json?molecule_chembl_id=${enc(cid)}&limit=12`, { sourceId: "chembl", ttl: 24 * 3600 * 1000 });
        acts = (a && a.activities) || [];
      } catch (e) {
        acts = [];
      }
    }
    return chemblRecordFromMolecule(j, acts);
  }

  async function chemblMechanisms(id) {
    const j = await net.getJSON(`${CH}/mechanism.json?molecule_chembl_id=${enc(id)}&limit=10`, { sourceId: "chembl", ttl: 24 * 3600 * 1000 });
    return (j && j.mechanisms) || [];
  }

  async function chemblByInchiKey(key) {
    const j = await net.getJSON(`${CH}/molecule.json?molecule_structures__standard_inchi_key=${enc(key)}&limit=3`, {
      sourceId: "chembl",
      ttl: 30 * 24 * 3600 * 1000,
    });
    return ((j && j.molecules) || []).map((m) => m.molecule_chembl_id);
  }

  A.chembl = {
    id: "chembl",
    label: "ChEMBL",
    kinds: ["compound", "bioactivity"],
    search: chemblSearch,
    molecule: chemblMolecule,
    record: chemblMolecule,
    mechanisms: chemblMechanisms,
    byInchiKey: chemblByInchiKey,
    pageUrl: (id) => `https://www.ebi.ac.uk/chembl/compound_report_card/${String(id).replace(/^chembl[-:]/i, "")}/`,
  };

  /* =======================================================================
     Rhea — the REST API returns TSV tables
     ======================================================================= */
  const RHEA = "https://www.rhea-db.org/rhea";
  const RHEA_COLS = "rhea-id,equation,chebi-id,ec,uniprot,pubmed,chebi";

  function parseTsv(text) {
    const lines = String(text || "").replace(/\r/g, "").split("\n").filter((l) => l.trim() !== "");
    if (!lines.length) return { header: [], rows: [] };
    const header = lines[0].split("\t").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const cells = line.split("\t");
      const obj = {};
      header.forEach((h, i) => (obj[h] = (cells[i] || "").trim()));
      return obj;
    });
    return { header, rows };
  }

  function rheaRecordFromRow(row) {
    const id = row["Reaction identifier"] || row["rhea-id"] || "";
    const equation = row["Equation"] || row.equation || "";
    const chebiIds = (row["ChEBI identifier"] || row["chebi-id"] || "").split(";").filter(Boolean);
    const ec = (row["EC number"] || row.ec || "").split(";").filter(Boolean);
    const enzymes = (row["Enzymes"] || row.uniprot || "").split(";").filter(Boolean);
    const pubmed = (row["PubMed"] || row.pubmed || "").split(";").filter(Boolean);
    const names = (row["ChEBI name"] || row.chebi || "").split(";").filter(Boolean);

    const sides = equation.split(/\s*=\s*|\s*<=>\s*/);
    const props = [];
    if (ec.length) props.push(E.property({ name: "EC number", value: ec.join("; "), source: "rhea", recordId: id, url: `https://www.rhea-db.org/rhea/${(id.split(":")[1] || id)}` }));
    if (enzymes.length)
      props.push(
        E.property({
          name: "Enzyme (UniProt)",
          value: enzymes.slice(0, 8).join("; "),
          source: "rhea",
          recordId: id,
          dataType: "curated",
          kind: "curated",
        })
      );
    if (names.length) props.push(E.property({ name: "Chất tham gia (ChEBI)", value: names.slice(0, 6).join("; "), source: "rhea", recordId: id, kind: "curated" }));

    return E.record({
      kind: "reaction",
      id: "rhea:" + id,
      title: id + " — " + U.truncate(equation, 90),
      subtitle: [ec.join(" · "), sides.length === 2 ? "Phản ứng hai chiều / có hướng" : ""].filter(Boolean).join(" · ") || "Phản ứng sinh hóa",
      identifiers: { rhea: id.replace(/^RHEA:/i, "RHEA:"), ec: ec[0] || null },
      properties: props,
      provenance: [
        prov("rhea", id, `https://www.rhea-db.org/rhea/${(id.split(":")[1] || id)}`, "curated", "Rhea reaction table row"),
      ],
      links: { rhea: `https://www.rhea-db.org/rhea/${(id.split(":")[1] || id)}` },
      extra: {
        equation,
        left: sides[0] || null,
        right: sides[1] || null,
        chebiIds,
        ec,
        enzymes,
        pubmed,
        participants: names,
      },
    });
  }

  async function rheaQuery(query, limit) {
    const url = `${RHEA}/?query=${enc(query)}&columns=${RHEA_COLS}&format=tsv&limit=${limit || 10}`;
    const text = await net.getText(url, { sourceId: "rhea", ttl: 12 * 3600 * 1000, timeout: 18000 });
    return parseTsv(text).rows;
  }

  async function rheaSearch(q, opts) {
    const rows = await rheaQuery(q, (opts && opts.max) || 8);
    return rows.map((row) => {
      const rec = rheaRecordFromRow(row);
      return {
        source: "rhea",
        sourceLabel: "Rhea",
        kind: "reaction",
        title: rec.extra.equation,
        subtitle: [rec.identifiers.rhea, rec.identifiers.ec].filter(Boolean).join(" · "),
        identifiers: rec.identifiers,
        why: "Khớp chất tham gia / EC number trong Rhea",
        route: "#/reactions/rhea/" + encodeURIComponent(rec.identifiers.rhea),
        score: 50,
        raw: row,
      };
    });
  }

  async function rheaReaction(id) {
    const rid = String(id).replace(/^RHEA:?/i, "");
    const rows = await rheaQuery("RHEA:" + rid, 1);
    if (!rows.length) throw net.error("Không tìm thấy phản ứng Rhea " + rid + ".", { status: 404, sourceId: "rhea" });
    return rheaRecordFromRow(rows[0]);
  }

  async function rheaByChebi(chebiId) {
    const acc = String(chebiId).replace(/\D/g, "");
    const rows = await rheaQuery("CHEBI:" + acc, 12);
    return rows.map(rheaRecordFromRow);
  }

  A.rhea = {
    id: "rhea",
    label: "Rhea",
    kinds: ["reaction"],
    search: rheaSearch,
    reaction: rheaReaction,
    record: rheaReaction,
    byChebi: rheaByChebi,
    parseTsv,
    pageUrl: (id) => `https://www.rhea-db.org/rhea/${String(id).replace(/^RHEA:?/i, "")}`,
  };
})(typeof window !== "undefined" ? window : globalThis);
