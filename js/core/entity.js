/* =========================================================================
   Canonical scientific entities + provenance
   -------------------------------------------------------------------------
   Design rules enforced here:
   * every property carries its own source, record id, url, licence and type
   * entities are merged ONLY on strong identifiers (InChIKey / CID / ChEBI /
     ChEMBL / UniProt / DOI / PMID) — never on display names
   * conflicting measurements are kept side by side, never averaged
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});

  const KINDS = {
    element: "Nguyên tố",
    compound: "Hợp chất",
    reaction: "Phản ứng",
    material: "Vật liệu",
    crystal: "Cấu trúc tinh thể",
    drug: "Dược chất",
    protein: "Protein",
    enzyme: "Enzyme",
    pathway: "Con đường sinh học",
    publication: "Công bố khoa học",
    assay: "Assay sinh học",
    organism: "Sinh vật",
  };

  const DATA_TYPES = {
    experimental: { label: "Thực nghiệm", cls: "exp" },
    computed: { label: "Tính toán", cls: "calc" },
    curated: { label: "Curated", cls: "curated" },
    predicted: { label: "Dự đoán", cls: "calc" },
    regulatory: { label: "Quản lý", cls: "reg" },
    reported: { label: "Nguồn báo cáo", cls: "reported" },
    unknown: { label: "Không rõ", cls: "unknown" },
  };

  function provenance(p) {
    return {
      source: p.source || "unknown",
      recordId: p.recordId != null ? String(p.recordId) : null,
      url: p.url || null,
      license: p.license || null,
      datasetVersion: p.datasetVersion || null,
      retrievedAt: p.retrievedAt || new Date().toISOString(),
      dataType: p.dataType || "unknown",
      transformation: p.transformation || null,
      note: p.note || null,
    };
  }

  function property(p) {
    return {
      name: p.name,
      value: p.value,
      unit: p.unit || null,
      kind: p.kind || "reported",
      source: p.source || "unknown",
      recordId: p.recordId != null ? String(p.recordId) : null,
      url: p.url || null,
      license: p.license || null,
      conditions: p.conditions || null,
      retrievedAt: p.retrievedAt || new Date().toISOString(),
      note: p.note || null,
    };
  }

  function identifiers(obj) {
    const ids = Object.assign({}, obj || {});
    Object.keys(ids).forEach((k) => {
      if (ids[k] === null || ids[k] === undefined || ids[k] === "") delete ids[k];
      else ids[k] = String(ids[k]).trim();
    });
    return ids;
  }

  /** Normalise a display name for *matching only* — never for identity. */
  function normalizeName(name) {
    return String(name || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[®™©]/g, "")
      .replace(/\b(acid|axit)\b/g, "acid")
      .replace(/[^a-z0-9α-ω]+/g, " ")
      .trim();
  }

  function inchiKeySkeleton(key) {
    const s = String(key || "").trim().toUpperCase();
    return /^[A-Z]{14}-[A-Z]{10}-[A-Z]$/.test(s) ? s.split("-")[0] : null;
  }

  /** Build a canonical record. */
  function record(spec) {
    const kind = spec.kind || "compound";
    const ids = identifiers(spec.identifiers);
    return {
      kind,
      id: spec.id || canonicalKey(kind, ids) || Sci.util.slugify(spec.title || "record-" + Math.random().toString(36).slice(2, 8)),
      title: spec.title || "(không tên)",
      subtitle: spec.subtitle || null,
      summary: spec.summary || null,
      identifiers: ids,
      synonyms: Sci.util.uniq((spec.synonyms || []).filter(Boolean)),
      formula: spec.formula || null,
      properties: (spec.properties || []).map(property),
      provenance: (spec.provenance || []).map(provenance),
      links: spec.links || {},
      extra: spec.extra || {},
      _provenanceSeen: new Set((spec.provenance || []).map((p) => p.source + ":" + p.recordId)),
    };
  }

  /** Strong-identifier key. Returns null when no strong identifier exists. */
  function canonicalKey(kind, ids) {
    ids = ids || {};
    if (ids.inchikey) return "inchikey:" + String(ids.inchikey).toUpperCase();
    if (ids.cid) return "pubchem:" + ids.cid;
    if (ids.chebi) return "chebi:" + String(ids.chebi).replace(/^CHEBI:/i, "");
    if (ids.chembl) return "chembl:" + String(ids.chembl).toUpperCase();
    if (ids.uniprot) return "uniprot:" + String(ids.uniprot).toUpperCase();
    if (ids.rhea) return "rhea:" + String(ids.rhea).toUpperCase();
    if (ids.doi) return "doi:" + String(ids.doi).toLowerCase();
    if (ids.pmid) return "pmid:" + ids.pmid;
    if (ids.pdb) return "pdb:" + String(ids.pdb).toUpperCase();
    if (ids.rxcui) return "rxcui:" + ids.rxcui;
    if (ids.drugbank) return "drugbank:" + String(ids.drugbank).toUpperCase();
    if (kind === "element" && ids.z) return "element:" + ids.z;
    return null;
  }

  /**
   * Same-substance test across sources. Names alone never make substances equal:
   * a shared name with different InChIKeys is reported as ambiguous.
   */
  function sameSubstance(a, b) {
    const ia = (a && a.identifiers) || {};
    const ib = (b && b.identifiers) || {};
    if (ia.inchikey && ib.inchikey) return ia.inchikey.toUpperCase() === ib.inchikey.toUpperCase();
    if (ia.cid && ib.cid) return String(ia.cid) === String(ib.cid);
    if (ia.chebi && ib.chebi) return String(ia.chebi).replace(/\D/g, "") === String(ib.chebi).replace(/\D/g, "");
    if (ia.chembl && ib.chembl) return String(ia.chembl).toUpperCase() === String(ib.chembl).toUpperCase();
    if (ia.uniprot && ib.uniprot) return String(ia.uniprot).toUpperCase() === String(ib.uniprot).toUpperCase();
    if (ia.doi && ib.doi) return String(ia.doi).toLowerCase() === String(ib.doi).toLowerCase();
    if (ia.pmid && ib.pmid) return String(ia.pmid) === String(ib.pmid);
    if (ia.rhea && ib.rhea) return String(ia.rhea).toUpperCase() === String(ib.rhea).toUpperCase();
    if (ia.rxcui && ib.rxcui) return String(ia.rxcui) === String(ib.rxcui);
    return false;
  }

  /** Merge another record into a canonical one, keeping all provenance. */
  function merge(target, incoming) {
    if (!target || !incoming) return target;
    target.identifiers = Object.assign({}, incoming.identifiers || {}, target.identifiers || {});
    if (!target.formula && incoming.formula) target.formula = incoming.formula;
    if (!target.summary && incoming.summary) target.summary = incoming.summary;
    target.synonyms = Sci.util.uniq((target.synonyms || []).concat(incoming.synonyms || []));
    (incoming.provenance || []).forEach((p) => {
      const key = p.source + ":" + p.recordId;
      if (!target._provenanceSeen.has(key)) {
        target._provenanceSeen.add(key);
        target.provenance.push(provenance(p));
      }
    });
    (incoming.properties || []).forEach((p) => {
      const dup = target.properties.some(
        (q) =>
          q.name === p.name &&
          String(q.value) === String(p.value) &&
          (q.unit || "") === (p.unit || "") &&
          q.source === p.source
      );
      if (!dup) target.properties.push(property(p));
    });
    target.links = Object.assign({}, target.links || {}, incoming.links || {});
    target.extra = Object.assign({}, incoming.extra || {}, target.extra || {});
    return target;
  }

  /** Group the same property reported by several sources for side-by-side display. */
  function groupProperties(properties) {
    const groups = new Map();
    (properties || []).forEach((p) => {
      const key = normalizeName(p.name);
      if (!groups.has(key)) groups.set(key, { name: p.name, key, values: [] });
      const g = groups.get(key);
      const existing = g.values.find(
        (v) => String(v.value) === String(p.value) && (v.unit || "") === (p.unit || "") && v.source === p.source
      );
      if (!existing) g.values.push(p);
    });
    return Array.from(groups.values());
  }

  function hasConflict(group) {
    if (!group || group.values.length < 2) return false;
    const vals = new Set(group.values.map((v) => String(v.value) + "|" + (v.unit || "")));
    return vals.size > 1;
  }

  /** Extract cross-database identifiers from an open link map. */
  function xrefs(ids) {
    const labels = {
      cid: "PubChem CID",
      chebi: "ChEBI",
      chembl: "ChEMBL",
      inchikey: "InChIKey",
      inchi: "InChI",
      smiles: "SMILES",
      formula: "Công thức",
      uniprot: "UniProt",
      rhea: "Rhea",
      ec: "EC number",
      pdb: "PDB",
      doi: "DOI",
      pmid: "PMID",
      pmcid: "PMCID",
      rxcui: "RxCUI",
      drugbank: "DrugBank",
      ndc: "NDC",
      unii: "UNII",
      cas: "CAS",
      kegg: "KEGG",
      hmdb: "HMDB",
      atc: "ATC",
    };
    return Object.keys(ids || {})
      .filter((k) => labels[k])
      .map((k) => ({ key: k, label: labels[k], value: ids[k] }));
  }

  Sci.entity = {
    KINDS,
    DATA_TYPES,
    record,
    property,
    provenance,
    identifiers,
    canonicalKey,
    sameSubstance,
    merge,
    groupProperties,
    hasConflict,
    normalizeName,
    inchiKeySkeleton,
    xrefs,
    kindLabel: (k) => KINDS[k] || k,
    dataTypeLabel: (t) => (DATA_TYPES[t] || DATA_TYPES.unknown).label,
    dataTypeClass: (t) => (DATA_TYPES[t] || DATA_TYPES.unknown).cls,
  };
})(typeof window !== "undefined" ? window : globalThis);
