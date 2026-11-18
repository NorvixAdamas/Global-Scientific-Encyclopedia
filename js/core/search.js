/* =========================================================================
   Unified scientific search
   -------------------------------------------------------------------------
   Layer 1: local index over the curated datasets shipped with the site
   Layer 2: live adapters (PubChem, ChEBI, ChEMBL, Rhea, UniProt, openFDA…)
   Layer 3: identifier resolution (InChIKey, CID, DOI, PMID, ChEBI, SMILES)
   Every result carries an explicit "why" explanation and its source.
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;

  const KIND_ORDER = ["compound", "reaction", "element", "drug", "material", "protein", "pathway", "publication", "topic"];

  const KIND_LABELS = {
    compound: "Hợp chất",
    reaction: "Phản ứng",
    element: "Nguyên tố",
    drug: "Thuốc",
    material: "Vật liệu",
    protein: "Protein",
    pathway: "Pathway",
    publication: "Công bố",
    topic: "Chủ đề",
  };

  function fold(s) {
    return String(s == null ? "" : s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d")
      .toLowerCase();
  }

  function stripHtml(s) {
    return String(s == null ? "" : s)
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&[a-z]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ----------------------------------------------------------------------
     Identifier detection
     ---------------------------------------------------------------------- */
  const ID_PATTERNS = [
    {
      type: "inchikey",
      label: "InChIKey",
      test: (q) => /^[A-Z]{14}-[A-Z]{10}-[A-Z]$/i.test(q),
      source: "pubchem",
      hint: "Định danh cấu trúc chuẩn IUPAC — tra cứu trực tiếp PubChem.",
    },
    {
      type: "inchi",
      label: "InChI",
      test: (q) => /^InChI=1S?\//i.test(q),
      source: "pubchem",
      hint: "InChI string — chuyển sang PubChem để lấy CID và tính chất.",
    },
    {
      type: "doi",
      label: "DOI",
      test: (q) => /^10\.\d{4,9}\/\S+$/i.test(q) || /^doi:\s*10\./i.test(q),
      normalize: (q) => q.replace(/^doi:\s*/i, "").trim(),
      source: "europe-pmc",
      hint: "DOI bài báo — tra metadata qua Europe PMC/Crossref.",
    },
    { type: "pmid", label: "PMID", test: (q) => /^pmid:\s*\d{5,9}$/i.test(q), normalize: (q) => q.replace(/\D/g, ""), source: "pubmed" },
    { type: "chebi", label: "ChEBI ID", test: (q) => /^chebi:\s*\d+$/i.test(q), normalize: (q) => q.replace(/\D/g, ""), source: "chebi" },
    { type: "chembl", label: "ChEMBL ID", test: (q) => /^chembl[-:\s]?\d+$/i.test(q), normalize: (q) => q.replace(/[^0-9]/g, ""), source: "chembl" },
    { type: "rhea", label: "Rhea ID", test: (q) => /^rhea:\s*\d+$/i.test(q), normalize: (q) => q.replace(/\D/g, ""), source: "rhea" },
    { type: "cid", label: "PubChem CID", test: (q) => /^cid[-:\s]?\s*\d+$/i.test(q), normalize: (q) => q.replace(/\D/g, ""), source: "pubchem" },
  ];

  const ORGANIC_SUBSET = /^[A-Za-z0-9@+\-\[\]\(\)=#$:\/\\%.]+$/;

  function looksLikeSmiles(q) {
    if (!q || q.length < 2 || q.length > 220) return false;
    if (/\s/.test(q)) return false;
    if (!ORGANIC_SUBSET.test(q)) return false;
    if (!/[BCNOPSFIcnops]/.test(q)) return false;
    /* require SMILES-ish syntax so plain words like "Aspirin" are excluded */
    const syntax = [/[=#]/, /\[[A-Za-z@]/, /\([A-Za-z0-9]/, /[cnos]\d/, /[A-Z][a-z]?\d?[A-Z]/, /\d[A-Z(]/];
    return syntax.filter((re) => re.test(q)).length >= 2 && /^[A-Za-z0-9@+\-\[\]\(\)=#$:\/\\%.]+$/.test(q) && /[=#()\[\]@]/.test(q);
  }

  function looksLikeFormula(q) {
    if (!q || q.length > 60) return false;
    /* Leading zeros are rejected so accessions such as P01308 are not read as formulas. */
    return /^(?:[A-Z][a-z]?(?:[1-9]\d*)?|\((?:[A-Z][a-z]?(?:[1-9]\d*)?)+\)(?:[1-9]\d*)?|[·\.\*](?:[1-9]\d*)?)+$/.test(q) && /^[A-Z]/.test(q) && /\d/.test(q);
  }

  function detectIdentifier(raw) {
    const q = String(raw || "").trim();
    if (!q) return { type: "empty" };
    for (const p of ID_PATTERNS) {
      if (p.test(q)) {
        return {
          type: p.type,
          label: p.label,
          value: p.normalize ? p.normalize(q) : q,
          source: p.source,
          hint: p.hint || null,
        };
      }
    }
    /* PMID / CID as bare numbers are ambiguous: ask instead of guessing. */
    if (/^\d{1,9}$/.test(q)) {
      return {
        type: "ambiguous-number",
        label: "Số không có tiền tố",
        value: q,
        hint: "Số thuần có thể là CID, PMID hoặc mã khác. Dùng tiền tố: cid:, pmid:, chebi:, chembl: để tra chính xác.",
      };
    }
    if (/^rhea[-:\s]?\d+$/i.test(q)) {
      return { type: "rhea", label: "Rhea ID", value: q.replace(/\D/g, ""), source: "rhea" };
    }
    if (looksLikeSmiles(q)) {
      return {
        type: "smiles",
        label: "SMILES",
        value: q,
        source: "pubchem",
        hint: "Chuỗi giống SMILES — tra cấu trúc trên PubChem (không tự động coi là tên chất).",
      };
    }
    if (looksLikeFormula(q)) {
      return { type: "formula", label: "Công thức hóa học", value: q, hint: "Tra theo công thức phân tử (có thể khớp nhiều đồng phân)." };
    }
    /* Accession / PDB checks come last: formulas and SMILES are more specific. */
    if (/^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/i.test(q)) {
      return { type: "uniprot", label: "UniProt accession", value: q, source: "uniprot" };
    }
    if (/^(?=.*[A-Za-z])[0-9][A-Za-z0-9]{3}$/.test(q)) {
      return { type: "pdb", label: "PDB ID", value: q, source: "rcsb-pdb", hint: "Có thể là PDB ID (4 ký tự) — hệ thống sẽ thử tra RCSB." };
    }
    return { type: "text", value: q };
  }

  /* ----------------------------------------------------------------------
     Local index
     ---------------------------------------------------------------------- */
  let INDEX = null;
  let INDEX_META = null;

  function doc(d) {
    const ids = d.ids || {};
    return {
      id: d.id,
      kind: d.kind,
      title: d.title,
      subtitle: d.subtitle || "",
      text: d.text || "",
      ids,
      route: d.route,
      sourceId: d.sourceId || "local",
      provenance: d.provenance || null,
      props: d.props || null,
      _foldTitle: fold(d.title),
      _foldSub: fold(d.subtitle || ""),
      _foldText: fold(d.text || ""),
      _foldIds: fold(Object.keys(ids).map((k) => k + " " + ids[k]).join(" ")),
    };
  }

  function buildLocalIndex(force) {
    if (INDEX && !force) return INDEX;
    const docs = [];
    const els = (root.ELEMENTS || []).concat(root.THEORETICAL_ELEMENTS || []);
    els.forEach((el) => {
      const theoretical = Number(el.z) > 118;
      docs.push(
        doc({
          kind: "element",
          id: "element:" + el.z,
          title: `${el.name} (${el.sym})`,
          subtitle: `Nguyên tố Z=${el.z} · ${(root.CAT_LABELS && root.CAT_LABELS[el.cat]) || el.cat || ""}`,
          text: [el.sym, el.config, el.use, theoretical ? "chưa tổng hợp lý thuyết" : ""].join(" "),
          ids: { z: String(el.z), formula: el.sym },
          route: "#/elements/" + el.z,
          props: el,
        })
      );
    });

    (root.REACTIONS || []).forEach((r, i) => {
      const cat = (root.RXN_CATS || []).find((c) => c.id === r.c);
      docs.push(
        doc({
          kind: "reaction",
          id: "curated-rxn:" + i,
          title: r.t,
          subtitle: [cat && cat.name, "phản ứng biên soạn"].filter(Boolean).join(" · "),
          text: [r.e, r.n].join(" "),
          ids: { equation: r.e },
          route: "#/reactions/i/" + i,
          props: r,
        })
      );
    });

    (root.MATERIALS || []).forEach((m) => {
      const text = stripHtml(m.content);
      docs.push(
        doc({
          kind: "material",
          id: "material:" + m.id,
          title: m.name,
          subtitle: [m.sub, (root.MAT_CATS || []).find((c) => c.id === m.cat)?.name].filter(Boolean).join(" · "),
          text: [(m.facts || []).join(" "), text].join(" "),
          ids: { slug: m.id },
          route: "#/materials/" + m.id,
          props: m,
        })
      );
    });

    (root.DRUGS || []).forEach((d) => {
      docs.push(
        doc({
          kind: "drug",
          id: "curated-drug:" + U.slugify(d.n),
          title: d.n,
          subtitle: [d.cls, d.y].filter(Boolean).join(" · "),
          text: [d.mech, d.note].join(" "),
          ids: { name: d.n },
          route: "#/pharma/drug/" + encodeURIComponent(d.n),
          props: d,
        })
      );
    });

    (root.OPEN_COMPOUNDS || []).forEach((c) => {
      docs.push(
        doc({
          kind: "compound",
          id: "compound:" + (c.compound_cid || c.common_name),
          title: c.common_name || c.iupac_name || "CID " + c.compound_cid,
          subtitle: [c.molecular_formula, c.molecular_weight ? U.num(c.molecular_weight) + " g/mol" : null, c.compound_cid ? "CID " + c.compound_cid : null]
            .filter(Boolean)
            .join(" · "),
          text: [c.iupac_name, c.note, c.smiles_string].filter(Boolean).join(" "),
          ids: { cid: c.compound_cid, formula: c.molecular_formula, cmpd: c.iupac_name || "", name: c.common_name },
          route: c.compound_cid ? "#/compounds/" + c.compound_cid : "#/search?q=" + encodeURIComponent(c.common_name || ""),
          props: c,
        })
      );
    });

    (root.OPEN_REACTIONS || []).forEach((r) => {
      const left = (r.reactants || []).map((x) => x.name).join(" + ");
      const right = (r.products || []).map((x) => x.name).join(" + ");
      docs.push(
        doc({
          kind: "reaction",
          id: "db-rxn:" + r.reaction_id,
          title: `${left} → ${right}`,
          subtitle: [r.reaction_id, r.type, r.yield_percent].filter(Boolean).join(" · "),
          text: [r.reaction_id, (r.conditions && JSON.stringify(r.conditions)) || "", r.type].join(" "),
          ids: { reaction: r.reaction_id },
          route: "#/reactions/ord/" + encodeURIComponent(r.reaction_id),
          props: r,
        })
      );
    });

    (root.OPEN_DRUGS || []).forEach((d) => {
      docs.push(
        doc({
          kind: "drug",
          id: "db-drug:" + (d.drugbank_id || d.name),
          title: d.name,
          subtitle: [d.drug_class, d.year].filter(Boolean).join(" · "),
          text: [d.indication, (d.targets || []).map((t) => t.target_name).join(" "), (d.groups || []).join(" ")].join(" "),
          ids: { drugbank: d.drugbank_id },
          route: "#/pharma/drug/" + encodeURIComponent(d.name),
          props: d,
        })
      );
    });

    (root.SCI_TOPICS || []).forEach((t) => {
      docs.push(
        doc({
          kind: "topic",
          title: t.title,
          id: "topic:" + t.slug,
          subtitle: t.eyebrow || "Chủ đề",
          text: [t.summary, (t.concepts || []).join(" "), (t.questions || []).join(" ")].join(" "),
          ids: { topic: t.slug },
          route: "#/topics/" + t.slug,
          props: t,
        })
      );
    });

    INDEX = {
      docs,
      counts: docs.reduce((acc, d) => {
        acc[d.kind] = (acc[d.kind] || 0) + 1;
        return acc;
      }, {}),
    };
    INDEX_META = {
      builtAt: new Date().toISOString(),
      total: docs.length,
      counts: INDEX.counts,
    };
    return INDEX;
  }

  function localCounts() {
    const idx = buildLocalIndex();
    return { total: idx.docs.length, counts: Object.assign({}, idx.counts), builtAt: INDEX_META && INDEX_META.builtAt };
  }

  /* ----------------------------------------------------------------------
     Scoring
     ---------------------------------------------------------------------- */
  function trigrams(s) {
    const t = [];
    const p = "  " + fold(s) + "  ";
    for (let i = 0; i < p.length - 2; i++) t.push(p.slice(i, i + 3));
    return t;
  }

  function trigramSimilarity(a, b) {
    if (!a.length || !b.length) return 0;
    const map = new Map();
    a.forEach((t) => map.set(t, (map.get(t) || 0) + 1));
    let inter = 0;
    b.forEach((t) => {
      const c = map.get(t) || 0;
      if (c > 0) {
        inter++;
        map.set(t, c - 1);
      }
    });
    return (2 * inter) / (a.length + b.length);
  }

  function scoreDoc(d, fq, tokens, idInfo) {
    let score = 0;
    const reasons = [];

    if (idInfo && idInfo.type !== "text" && idInfo.type !== "formula" && idInfo.type !== "ambiguous-number") {
      const idVal = fold(String(idInfo.value || ""));
      Object.keys(d.ids).forEach((k) => {
        const v = fold(String(d.ids[k] || ""));
        if (v && (v === idVal || v.replace(/^(cid|pmid|chebi|chembl|doi|rhea)[:\s]*/i, "") === idVal)) {
          score += 1200;
          reasons.push(`Khớp chính xác ${idInfo.label} (${d.ids[k]})`);
        }
      });
    }

    if (!score) {
      if (d._foldTitle === fq) {
        score += 900;
        reasons.push("Tên trùng khớp hoàn toàn");
      } else if (d._foldTitle.startsWith(fq)) {
        score += 620;
        reasons.push("Tên bắt đầu bằng truy vấn");
      } else if (d._foldTitle.includes(fq)) {
        score += 430;
        reasons.push("Tên chứa truy vấn");
      }

      let titleHits = 0;
      let subHits = 0;
      let textHits = 0;
      tokens.forEach((t) => {
        if (d._foldTitle.includes(t)) titleHits++;
        if (d._foldSub.includes(t)) subHits++;
        if (d._foldText.includes(t)) textHits++;
      });
      if (titleHits && titleHits === tokens.length) {
        score += 300;
        reasons.push("Khớp toàn bộ từ khóa trong tên");
      } else if (titleHits) {
        score += 120 * titleHits;
        reasons.push(`Khớp ${titleHits}/${tokens.length} từ khóa trong tên`);
      }
      if (subHits) score += 60 * subHits;
      if (textHits) {
        score += 25 * textHits;
        if (!titleHits) reasons.push("Khớp từ khóa trong mô tả/ghi chú");
      }

      const idHits = tokens.filter((t) => d._foldIds.includes(t)).length;
      if (idHits) {
        score += 180 * idHits;
        reasons.push("Khớp định danh phụ (" + Object.values(d.ids).filter(Boolean).slice(0, 2).join(", ") + ")");
      }

      if (score < 260 && fq.length >= 3) {
        const sim = trigramSimilarity(trigrams(fq), trigrams(d.title + " " + d.subtitle));
        if (sim > 0.3) {
          score += Math.round(sim * 240);
          reasons.push(`Tên gần giống (độ tương đồng ${Math.round(sim * 100)}%)`);
        }
      }
    }

    if (!score) return null;
    /* Prefer substances over descriptions, but never hide other types. */
    score += { compound: 12, element: 10, reaction: 6, drug: 8, material: 5, topic: 2, publication: 1 }[d.kind] || 0;
    return { doc: d, score, why: reasons[0] || "Khớp truy vấn", reasons };
  }

  function local(query, opts) {
    const o = opts || {};
    const idx = buildLocalIndex();
    const q = String(query || "").trim();
    if (!q) return { results: [], facets: {}, total: 0, query: q };
    const idInfo = detectIdentifier(q);
    const fq = fold(q);
    const tokens = fq.split(/\s+/).filter((t) => t.length > 1 || /^\d+$/.test(t)).slice(0, 8);
    let scored = [];
    idx.docs.forEach((d) => {
      if (o.kind && o.kind !== "all" && d.kind !== o.kind) return;
      const s = scoreDoc(d, fq, tokens, idInfo);
      if (s) scored.push(s);
    });
    scored.sort((a, b) => b.score - a.score);
    const limit = o.limit || 40;
    const results = scored.slice(0, limit).map((s) => ({
      source: "local",
      sourceLabel: "Dữ liệu biên soạn",
      kind: s.doc.kind,
      title: s.doc.title,
      subtitle: s.doc.subtitle,
      identifiers: s.doc.ids,
      why: s.why,
      reasons: s.reasons,
      route: s.doc.route,
      score: s.score,
      local: true,
      raw: s.doc.props,
    }));
    const facets = {};
    scored.forEach((s) => (facets[s.doc.kind] = (facets[s.doc.kind] || 0) + 1));
    return { results, facets, total: scored.length, query: q, identifier: idInfo };
  }

  function suggestLocal(q, limit) {
    const idx = buildLocalIndex();
    const fq = fold(q);
    if (!fq) return [];
    const out = [];
    idx.docs.forEach((d) => {
      if (d._foldTitle.includes(fq) || d._foldSub.includes(fq)) {
        out.push({ label: d.title, kind: d.kind, route: d.route, sub: d.subtitle });
      }
    });
    return out.slice(0, limit || 8);
  }

  /* ----------------------------------------------------------------------
     Remote orchestration
     ---------------------------------------------------------------------- */
  const SOURCE_TIMEOUT = 14000;

  function timeout(ms) {
    return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
  }

  async function runAdapter(adapter, q, opts) {
    if (!adapter || typeof adapter.search !== "function") return { source: adapter && adapter.id, status: "unsupported", results: [] };
    const meta = Sci.registry.byId[adapter.id] || {};
    try {
      const results = await Promise.race([adapter.search(q, opts || {}), timeout(SOURCE_TIMEOUT)]);
      return { source: adapter.id, label: meta.name || adapter.label, status: "ok", results: results || [] };
    } catch (err) {
      return {
        source: adapter.id,
        label: meta.name || adapter.label,
        status: err && err.message === "timeout" ? "timeout" : "error",
        results: [],
        error: err,
        message: err && err.message,
      };
    }
  }

  /**
   * Query every relevant live source in parallel.
   * onUpdate(update) fires as each source settles so the UI can stream results.
   */
  async function remote(q, opts) {
    const o = opts || {};
    const adapters = o.kind && o.kind !== "all" ? Sci.sources.forKind(o.kind) : Sci.sources.searchable();
    const list = adapters.filter((a) => !o.sources || o.sources.includes(a.id));
    const settled = [];
    const tasks = list.map((a) =>
      runAdapter(a, q, o).then((r) => {
        settled.push(r);
        if (o.onUpdate) o.onUpdate(r, settled.slice());
        return r;
      })
    );
    const all = await Promise.all(tasks);
    const results = [];
    all.forEach((r) => r.results.forEach((x) => results.push(x)));
    return { results, sources: all, query: q };
  }

  /** Resolve a detected identifier to concrete records/routes. */
  async function resolve(query) {
    const id = detectIdentifier(query);
    const out = { identifier: id, results: [], notes: [] };
    const add = (r) => out.results.push(r);
    try {
      if (id.type === "inchikey") {
        const cids = await Sci.adapters.pubchem.byInchiKey(id.value);
        if (!cids.length) {
          out.notes.push("InChIKey không tìm thấy trong PubChem.");
        } else {
          const hits = await Sci.adapters.pubchem.search(null, { cid: cids[0] });
          hits.forEach(add);
          try {
            const chemblIds = await Sci.adapters.chembl.byInchiKey(id.value);
            chemblIds.forEach((cid) =>
              add({
                source: "chembl",
                sourceLabel: "ChEMBL",
                kind: "compound",
                title: cid,
                subtitle: "Khớp InChIKey trong ChEMBL",
                identifiers: { chembl: cid, inchikey: id.value },
                why: "Khớp InChIKey (định danh cấu trúc) với ChEMBL",
                route: "#/compounds/chembl-" + cid,
                score: 900,
              })
            );
          } catch (e) {
            out.notes.push("ChEMBL: " + (e.message || "không truy vấn được"));
          }
        }
      } else if (id.type === "cid") {
        (await Sci.adapters.pubchem.search(null, { cid: id.value })).forEach(add);
      } else if (id.type === "doi") {
        const rec = await Sci.adapters.literature.byId(id.value, "doi");
        add({
          source: "europe-pmc",
          sourceLabel: "Europe PMC",
          kind: "publication",
          title: rec.title,
          subtitle: rec.subtitle,
          identifiers: rec.identifiers,
          why: "Khớp DOI chính xác",
          route: "#/literature/doi/" + encodeURIComponent(id.value),
          score: 900,
        });
        try {
          const cr = await Sci.adapters.literature.crossrefDoi(id.value);
          out.notes.push("Crossref: " + (cr.journal || "metadata") + (cr.year ? " · " + cr.year : ""));
        } catch (e) {
          /* metadata enrichment is optional */
        }
      } else if (id.type === "pmid") {
        const rec = await Sci.adapters.literature.byId(id.value, "pmid");
        add({
          source: "pubmed",
          sourceLabel: "PubMed",
          kind: "publication",
          title: rec.title,
          subtitle: rec.subtitle,
          identifiers: rec.identifiers,
          why: "Khớp PMID chính xác",
          route: "#/literature/pmid/" + id.value,
          score: 900,
        });
      } else if (id.type === "chebi") {
        const rec = await Sci.adapters.chebi.entity(id.value);
        add({
          source: "chebi",
          sourceLabel: "ChEBI",
          kind: "compound",
          title: rec.title,
          subtitle: rec.subtitle,
          identifiers: rec.identifiers,
          why: "Khớp ChEBI ID chính xác",
          route: "#/compounds/chebi-" + id.value,
          score: 900,
        });
      } else if (id.type === "chembl") {
        add({
          source: "chembl",
          sourceLabel: "ChEMBL",
          kind: "compound",
          title: "CHEMBL" + id.value,
          subtitle: "ChEMBL molecule",
          identifiers: { chembl: "CHEMBL" + id.value },
          why: "Khớp ChEMBL ID chính xác",
          route: "#/compounds/chembl-CHEMBL" + id.value,
          score: 900,
        });
      } else if (id.type === "rhea") {
        add({
          source: "rhea",
          sourceLabel: "Rhea",
          kind: "reaction",
          title: "RHEA:" + id.value,
          subtitle: "Phản ứng Rhea",
          identifiers: { rhea: "RHEA:" + id.value },
          why: "Khớp Rhea ID chính xác",
          route: "#/reactions/rhea/RHEA:" + id.value,
          score: 900,
        });
      } else if (id.type === "uniprot") {
        const rec = await Sci.adapters.uniprot.entry(id.value);
        add({
          source: "uniprot",
          sourceLabel: "UniProt",
          kind: "protein",
          title: rec.title,
          subtitle: rec.subtitle,
          identifiers: rec.identifiers,
          why: "Khớp UniProt accession",
          route: "#/biochem/protein/" + encodeURIComponent(id.value),
          score: 900,
        });
      } else if (id.type === "smiles") {
        const cids = await Sci.adapters.pubchem.bySmiles(id.value);
        if (!cids.length) out.notes.push("Không có CID khớp cấu trúc SMILES trong PubChem.");
        else {
          const hits = await Sci.adapters.pubchem.search(null, { cid: cids[0] });
          hits.forEach((h) => {
            h.why = "Khớp cấu trúc SMILES trên PubChem";
            add(h);
          });
        }
      } else if (id.type === "formula") {
        /* Formula search is ambiguous by nature: run text search across compound sources. */
        const r = await remote(id.value, { kind: "compound" });
        r.results.slice(0, 10).forEach((x) => add(Object.assign({}, x, { why: "Khớp công thức phân tử: " + id.value })));
        out.notes.push("Công thức có thể ứng với nhiều đồng phân — kiểm tra InChIKey trước khi kết luận.");
      } else {
        out.notes.push("Không nhận diện được định danh chuyên biệt — đang tìm theo văn bản.");
      }
    } catch (err) {
      out.notes.push("Lỗi truy vấn: " + (err.message || "không xác định"));
    }
    return out;
  }

  Sci.search = {
    buildLocalIndex,
    localCounts,
    local,
    suggestLocal,
    remote,
    resolve,
    detectIdentifier,
    fold,
    KIND_LABELS,
    KIND_ORDER,
    kindLabel: (k) => KIND_LABELS[k] || k,
    looksLikeSmiles,
    looksLikeFormula,
  };
})(typeof window !== "undefined" ? window : globalThis);
