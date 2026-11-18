/* =========================================================================
   Applied-science adapters
   openFDA (labels / recalls / FAERS counts) · RxNav (+RxClass) ·
   NOMAD · Materials Project (optional free key) · RCSB PDB · reference-only
   adapters for COD and ORD (no browser API).
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const E = Sci.entity;
  const net = Sci.net;
  const A = (Sci.adapters = Sci.adapters || {});
  const enc = encodeURIComponent;
  const NOW = () => new Date().toISOString();

  function prov(source, recordId, url, dataType, note) {
    const meta = Sci.registry.byId[source] || {};
    return E.provenance({ source, recordId, url, license: meta.license, dataType: dataType || "regulatory", retrievedAt: NOW(), note });
  }

  /* =======================================================================
     openFDA
     ======================================================================= */
  const FDA = "https://api.fda.gov";
  const FDA_DISCLAIMER =
    "Dữ liệu openFDA là thông tin quản lý và báo cáo tự nguyện, KHÔNG được xác thực cho quyết định chăm sóc cá nhân và không chứng minh quan hệ nhân quả.";

  function fdaUrl(path, params) {
    const qs = new URLSearchParams(params).toString();
    const base = `${FDA}${path}?${qs}`;
    return Sci.config.withKey(base, "openfdaKey", "api_key");
  }

  function fdaSearchExpr(field, term) {
    const t = String(term || "").replace(/[+&|!(){}\[\]^"~*?:\\/]/g, " ").trim();
    if (!t) return "";
    return `${field}:"${t}"`;
  }

  function labelRecord(r) {
    const of = r.openfda || {};
    const generic = (of.generic_name || [])[0] || null;
    const brand = (of.brand_name || [])[0] || null;
    const id = (of.product_ndc || [])[0] || (r.set_id ? "SET:" + r.set_id : generic || "label");
    const ids = {};
    if (of.product_ndc && of.product_ndc[0]) ids.ndc = of.product_ndc[0];
    if (of.rxcui && of.rxcui[0]) ids.rxcui = of.rxcui[0];
    if (of.unii && of.unii[0]) ids.unii = of.unii[0];
    if (of.spl_id && of.spl_id[0]) ids.spl = of.spl_id[0];

    const props = [
      ["Tên generic", generic],
      ["Tên thương mại", brand],
      ["Hoạt chất", (of.substance_name || []).join("; ")],
      ["Đường dùng", (of.route || []).join("; ")],
      ["Nhà sản xuất", (of.manufacturer_name || []).join("; ")],
      ["Dạng bào chế", (of.dosage_form || [])[0]],
      ["NDC", ids.ndc],
    ]
      .filter((x) => x[1])
      .map((x) =>
        E.property({
          name: x[0],
          value: x[1],
          kind: "regulatory",
          source: "openfda",
          recordId: id,
          url: `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${enc(generic || brand || "")}`,
        })
      );

    return E.record({
      kind: "drug",
      id: "fda:" + U.slugify((generic || brand || "drug") + "-" + (ids.ndc || id)),
      title: generic || brand || "Nhãn thuốc FDA",
      subtitle: [brand, (of.route || [])[0], (of.manufacturer_name || [])[0]].filter(Boolean).join(" · "),
      identifiers: ids,
      properties: props,
      provenance: [prov("openfda", r.set_id || id, "https://open.fda.gov/apis/drug/label/", "regulatory", "FDA drug label (SPL)")],
      links: { openfda: "https://open.fda.gov/apis/drug/label/" },
      extra: {
        set_id: r.set_id,
        effective_time: r.effective_time,
        boxedWarning: (r.boxed_warning || [])[0] || null,
        indications: (r.indications_and_usage || [])[0] || null,
        dosage: (r.dosage_and_administration || [])[0] || null,
        contraindications: (r.contraindications || [])[0] || null,
        warnings: (r.warnings || r.warnings_and_cautions || [])[0] || null,
        adverseReactions: (r.adverse_reactions || [])[0] || null,
        interactions: (r.drug_interactions || [])[0] || null,
        pregnancy: (r.pregnancy || [])[0] || null,
        disclaimer: FDA_DISCLAIMER,
      },
    });
  }

  async function fdaLabels(name, limit) {
    const expr = fdaSearchExpr("openfda.generic_name", name);
    const exprBrand = fdaSearchExpr("openfda.brand_name", name);
    const search = expr ? `${expr}+OR+${exprBrand}` : fdaSearchExpr("openfda.substance_name", name);
    try {
      const j = await net.getJSON(fdaUrl("/drug/label.json", { search, limit: limit || 3 }), {
        sourceId: "openfda",
        ttl: 24 * 3600 * 1000,
      });
      return (j && j.results) || [];
    } catch (err) {
      /* openFDA answers 404 with NOT_FOUND when a search has no matches. */
      if (err && err.status === 404) return [];
      throw err;
    }
  }

  async function fdaSearch(q, opts) {
    const results = await fdaLabels(q, (opts && opts.max) || 5);
    return results.map((r) => {
      const rec = labelRecord(r);
      return {
        source: "openfda",
        sourceLabel: "openFDA",
        kind: "drug",
        title: rec.title,
        subtitle: rec.subtitle,
        identifiers: rec.identifiers,
        why: "Khớp tên thuốc trong nhãn FDA (openFDA drug label)",
        route: "#/pharma/drug/" + enc(rec.title),
        score: 52,
        raw: r,
      };
    });
  }

  async function fdaDrug(name) {
    const results = await fdaLabels(name, 3);
    if (!results.length) return null;
    const records = results.map(labelRecord);
    const merged = records[0];
    records.slice(1).forEach((r) => {
      if (r.extra.indications && !merged.extra.indications) merged.extra.indications = r.extra.indications;
      E.merge(merged, r);
    });
    return merged;
  }

  async function fdaEventCount(name) {
    const search = fdaSearchExpr("patient.drug.medicinalproduct", name);
    if (!search) return null;
    try {
      const j = await net.getJSON(fdaUrl("/drug/event.json", { search, limit: 1 }), { sourceId: "openfda", ttl: 24 * 3600 * 1000 });
      const total = j && j.meta && j.meta.results && j.meta.results.total;
      return typeof total === "number" ? total : null;
    } catch (err) {
      if (err && err.status === 404) return null;
      throw err;
    }
  }

  async function fdaRecalls(name) {
    const search = fdaSearchExpr("product_description", name);
    if (!search) return [];
    try {
      const j = await net.getJSON(fdaUrl("/drug/enforcement.json", { search, limit: 3 }), { sourceId: "openfda", ttl: 24 * 3600 * 1000 });
      return (j && j.results) || [];
    } catch (e) {
      return [];
    }
  }

  A.openfda = {
    id: "openfda",
    label: "openFDA",
    kinds: ["drug"],
    search: fdaSearch,
    drug: fdaDrug,
    labels: fdaLabels,
    eventCount: fdaEventCount,
    recalls: fdaRecalls,
    parse: labelRecord,
    disclaimer: FDA_DISCLAIMER,
    pageUrl: (name) => `https://open.fda.gov/apis/drug/label/`,
  };

  /* =======================================================================
     RxNav / RxClass  (ToS: cache 12–24h, ≤20 req/s)
     ======================================================================= */
  const RX = "https://rxnav.nlm.nih.gov/REST";
  const RX_TTL = 12 * 3600 * 1000;

  const TTY_LABELS = {
    IN: "Thành phần hoạt chất",
    PIN: "Thành phần chính xác",
    BN: "Tên thương mại",
    SBD: "Thương mại + dạng bào chế",
    SCD: "Lâm sàng + dạng bào chế",
    GPCK: "Gói generic",
    BPCK: "Gói thương mại",
    DF: "Dạng bào chế",
    DFG: "Nhóm dạng bào chế",
    SCDC: "Lâm sàng + dạng + nồng độ",
  };

  function rxSearch(q) {
    return net.getJSON(`${RX}/drugs.json?name=${enc(q)}`, { sourceId: "rxnorm", ttl: RX_TTL });
  }

  function rxConcepts(json) {
    const groups = (json && json.drugGroup && json.drugGroup.conceptGroup) || [];
    const out = [];
    groups.forEach((g) => {
      (g.conceptProperties || []).forEach((c) => {
        out.push({
          rxcui: c.rxcui,
          name: c.name,
          synonym: c.synonym || null,
          tty: c.tty,
          ttyLabel: TTY_LABELS[c.tty] || c.tty,
        });
      });
    });
    return out;
  }

  async function rxNavSearch(q, opts) {
    const j = await rxSearch(q);
    const concepts = rxConcepts(j);
    return concepts.slice(0, (opts && opts.max) || 8).map((c) => ({
      source: "rxnorm",
      sourceLabel: "RxNav",
      kind: "drug",
      title: c.name,
      subtitle: [c.ttyLabel, "RxCUI " + c.rxcui].filter(Boolean).join(" · "),
      identifiers: { rxcui: c.rxcui },
      why: "Khớp khái niệm thuốc chuẩn hóa (RxNorm)",
      route: "#/pharma/drug/" + enc(c.name),
      score: 50,
      raw: c,
    }));
  }

  async function rxClasses(name) {
    try {
      const j = await net.getJSON(`${RX}/rxclass/class/byDrugName.json?drugName=${enc(name)}`, { sourceId: "rxnorm", ttl: RX_TTL });
      const info = (j && j.rxclassDrugInfoList && j.rxclassDrugInfoList.rxclassDrugInfo) || [];
      return info.map((i) => {
        const item = i.rxclassMinConceptItem || {};
        return { classId: item.classId, className: item.className, classType: item.classType, relation: i.rela };
      });
    } catch (e) {
      return [];
    }
  }

  async function rxRecord(name) {
    const j = await rxSearch(name);
    const concepts = rxConcepts(j);
    if (!concepts.length) return null;
    const byTty = {};
    concepts.forEach((c) => {
      byTty[c.tty] = byTty[c.tty] || [];
      if (!byTty[c.tty].some((x) => x.rxcui === c.rxcui)) byTty[c.tty].push(c);
    });
    const ingredient = (byTty.IN || [])[0] || concepts[0];
    const ids = { rxcui: ingredient.rxcui };
    const props = [];
    Object.keys(byTty).forEach((tty) => {
      const list = byTty[tty].slice(0, 6).map((c) => `${c.name} (${c.rxcui})`).join("; ");
      props.push(
        E.property({
          name: "RxNorm · " + (TTY_LABELS[tty] || tty),
          value: list,
          kind: "curated",
          source: "rxnorm",
          recordId: ingredient.rxcui,
          url: `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${ingredient.rxcui}`,
        })
      );
    });

    return E.record({
      kind: "drug",
      title: ingredient.name,
      subtitle: [TTY_LABELS[ingredient.tty], "RxCUI " + ingredient.rxcui].filter(Boolean).join(" · "),
      identifiers: ids,
      properties: props,
      provenance: [prov("rxnorm", ingredient.rxcui, `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${ingredient.rxcui}`, "curated", "RxNorm concept")],
      links: { rxnav: `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${ingredient.rxcui}` },
      extra: { concepts, byTty, ingredients: byTty.IN || [], brands: byTty.BN || [], clinical: byTty.SCD || [] },
    });
  }

  A.rxnorm = {
    id: "rxnorm",
    label: "RxNav / RxNorm",
    kinds: ["drug"],
    search: rxNavSearch,
    record: rxRecord,
    classes: rxClasses,
    concepts: async (q) => rxConcepts(await rxSearch(q)),
    ttyLabel: (tty) => TTY_LABELS[tty] || tty,
    pageUrl: (rxcui) => `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${rxcui}`,
  };

  /* =======================================================================
     NOMAD
     ======================================================================= */
  const NOMAD = "https://nomad-lab.eu/prod/v1/api/v1";

  async function nomadInfo() {
    return net.getJSON(`${NOMAD}/info`, { sourceId: "nomad", ttl: 24 * 3600 * 1000, timeout: 20000 });
  }

  function nomadEntrySummary(e) {
    const res = e.results || {};
    const material = res.material || {};
    const props = res.properties || {};
    const formula = material.chemical_formula_hill || material.chemical_formula_reduced || e.entry_name || "—";
    const entryId = e.entry_id || e.calc_id || e.id;
    const bandGap = props.electronic && props.electronic.band_gap;
    const energy = props.energy;
    const out = {
      entry_id: entryId,
      upload_id: e.upload_id || null,
      formula,
      elements: material.elements || [],
      spaceGroup: (material.symmetry && material.symmetry.space_group_symbol) || null,
      cellVolume: material.structure && material.structure.cell_volume ? material.structure.cell_volume : null,
      bandGap: bandGap && bandGap.value !== undefined ? bandGap.value : null,
      bandGapUnit: bandGap && bandGap.unit ? bandGap.unit : null,
      energyTotal: energy && energy.total && energy.total.value !== undefined ? energy.total.value : null,
      energyUnit: energy && energy.total && energy.total.unit ? energy.total.unit : null,
      raw: e,
    };
    return out;
  }

  async function nomadSearch(formula, opts) {
    const body = {
      query: formula && formula !== "*" ? { "results.material.chemical_formula_hill": formula } : { "results.material.chemical_formula_hill": { "*": "*" } },
      pagination: { page_size: (opts && opts.max) || 8 },
      required: {
        results: {
          material: {
            chemical_formula_hill: "*",
            elements: "*",
            symmetry: { space_group_symbol: "*" },
            structure: { cell_volume: "*" },
          },
          properties: {
            electronic: { band_gap: { value: "*", unit: "*" } },
            energy: { total: { value: "*", unit: "*" } },
          },
        },
      },
    };
    const j = await net.postJSON(`${NOMAD}/entries/query`, body, { sourceId: "nomad", ttl: 6 * 3600 * 1000, timeout: 22000 });
    const data = (j && j.data) || [];
    return data.map(nomadEntrySummary);
  }

  A.nomad = {
    id: "nomad",
    label: "NOMAD",
    kinds: ["material"],
    info: nomadInfo,
    search: nomadSearch,
    pageUrl: (entryId) => `https://nomad-lab.eu/prod/v1/gui/search/entries?entryId=${entryId}`,
  };

  /* =======================================================================
     Materials Project (optional free API key)
     ======================================================================= */
  const MP = "https://api.materialsproject.org";

  async function mpSearch(formula, opts) {
    const key = Sci.config.get("mpKey");
    if (!key) {
      throw net.error("Chưa cấu hình API key Materials Project (miễn phí).", {
        sourceId: "materials-project",
        code: "key-required",
        status: 401,
      });
    }
    const fields = "material_id,formula_pretty,formation_energy_per_atom,energy_above_hull,band_gap,density,is_stable,symmetry,crystal_system,nsites,volume";
    const url = `${MP}/materials/summary/?formula=${enc(formula || "*")}&_fields=${fields}&_limit=${(opts && opts.max) || 8}`;
    const j = await net.getJSON(url, { sourceId: "materials-project", ttl: 6 * 3600 * 1000, headers: { "X-API-KEY": key } });
    return (j && j.data) || [];
  }

  A.materialsproject = {
    id: "materials-project",
    label: "Materials Project",
    kinds: ["material"],
    search: mpSearch,
    configured: () => !!Sci.config.get("mpKey"),
    pageUrl: (id) => `https://next-gen.materialsproject.org/materials/${id}`,
  };

  /* =======================================================================
     RCSB PDB
     ======================================================================= */
  const PDB = "https://data.rcsb.org/rest/v1/core/entry";

  function pdbRecord(j, id) {
    const s = j.struct || {};
    const info = j.rcsb_entry_info || {};
    const methods = (j.exptl || []).map((m) => m.method).filter(Boolean);
    const props = [
      ["Phương pháp", methods.join("; ")],
      ["Độ phân giải", info.resolution_combined ? U.num(info.resolution_combined[0], 2) + " Å" : null],
      ["Số chuỗi polymer", info.polymer_entity_count],
      ["Số nguyên tử", info.deposited_atom_count],
      ["Ngày công bố", j.rcsb_accession_info && j.rcsb_accession_info.initial_release_date],
      ["Tác giả", (j.audit_author || []).map((a) => a.name).join(", ")],
    ]
      .filter((x) => x[1])
      .map((x) =>
        E.property({
          name: x[0],
          value: x[1],
          kind: "experimental",
          source: "rcsb-pdb",
          recordId: id,
          url: `https://www.rcsb.org/structure/${id}`,
        })
      );

    const citation = j.rcsb_primary_citation || {};
    return E.record({
      kind: "protein",
      id: "pdb:" + id,
      title: s.title || "PDB " + id,
      subtitle: [id, methods[0], info.resolution_combined ? U.num(info.resolution_combined[0], 2) + " Å" : null].filter(Boolean).join(" · "),
      identifiers: { pdb: id, doi: citation.pdbx_database_id_doi || null },
      properties: props,
      provenance: [prov("rcsb-pdb", id, `https://www.rcsb.org/structure/${id}`, "experimental", "wwPDB entry")],
      links: {
        pdb: `https://www.rcsb.org/structure/${id}`,
        viewer: `https://www.rcsb.org/3d-view/${id}`,
        doi: citation.pdbx_database_id_doi ? "https://doi.org/" + citation.pdbx_database_id_doi : null,
      },
      extra: {
        method: methods,
        resolution: info.resolution_combined ? info.resolution_combined[0] : null,
        citation: citation.title || null,
        journal: citation.rcsb_journal_abbrev || null,
        year: citation.year || null,
        keywords: (j.struct_keywords && j.struct_keywords.pdbx_keywords) || null,
        experimentalMethod: info.experimental_method || null,
      },
    });
  }

  async function pdbEntry(id) {
    const up = String(id).trim().toUpperCase();
    const j = await net.getJSON(`${PDB}/${enc(up)}`, { sourceId: "rcsb-pdb", ttl: 30 * 24 * 3600 * 1000 });
    return pdbRecord(j, up);
  }

  A.rcsb = {
    id: "rcsb-pdb",
    label: "RCSB PDB",
    kinds: ["protein", "structure"],
    entry: pdbEntry,
    record: pdbEntry,
    pageUrl: (id) => `https://www.rcsb.org/structure/${id}`,
  };

  /* =======================================================================
     Reference-only adapters (no browser API): COD, ORD, AFLOW, NIST
     ======================================================================= */
  A.cod = {
    id: "cod",
    label: "Crystallography Open Database",
    external: true,
    kinds: ["crystal"],
    searchUrl: (formula) => `https://www.crystallography.net/cod/result.php?${formula ? "formula=" + enc(formula) + "&" : ""}text=&cell=&volume=&title=&journal=&authors=&year=&spacegroup=&sg_number=&lmSearch=Search&orderby=year&format=html`,
    pageUrl: () => "https://www.crystallography.net/cod/",
    note: "COD không cung cấp JSON API ổn định cho trình duyệt. Dữ liệu CC0 — tải bulk/CIF tại trang chính thức.",
  };

  A.ord = {
    id: "ord",
    label: "Open Reaction Database",
    external: true,
    kinds: ["reaction"],
    searchUrl: () => "https://open-reaction-database.org/client/search",
    pageUrl: () => "https://open-reaction-database.org/",
    note: "ORD phân phối dữ liệu dạng protobuf qua GitHub/HuggingFace; chưa có REST API công khai cho trình duyệt.",
  };

  A.aflow = {
    id: "aflow",
    label: "AFLOW",
    external: true,
    kinds: ["material"],
    searchUrl: () => "https://aflow.org/",
    note: "AFLOW giới hạn mục đích khoa học/học thuật phi thương mại — chỉ liên kết, không nhập dữ liệu.",
  };

  A.nist = {
    id: "nist-webbook",
    label: "NIST Chemistry WebBook",
    external: true,
    kinds: ["compound", "spectrum"],
    searchUrl: (q) => `https://webbook.nist.gov/cgi/cbook.cgi?Name=${enc(q || "")}&Units=SI`,
    note: "Dữ liệu phổ/nhiệt hóa theo từng record với điều kiện bản quyền riêng — chỉ liên kết.",
  };
})(typeof window !== "undefined" ? window : globalThis);
