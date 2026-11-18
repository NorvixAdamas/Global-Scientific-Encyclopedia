/* =========================================================================
   Life-science adapters: UniProt · Reactome · Europe PMC · PubMed · Crossref
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
    return E.provenance({ source, recordId, url, license: meta.license, dataType: dataType || "curated", retrievedAt: NOW(), note });
  }

  /* =======================================================================
     UniProt
     ======================================================================= */
  const UP = "https://rest.uniprot.org";

  function uniprotName(r) {
    const pd = r.proteinDescription || {};
    const rec = pd.recommendedName && pd.recommendedName.fullName && pd.recommendedName.fullName.value;
    const sub = pd.submissionNames && pd.submissionNames[0] && pd.submissionNames[0].fullName && pd.submissionNames[0].fullName.value;
    return rec || sub || (r.uniProtkbId || r.primaryAccession);
  }

  function uniprotGene(r) {
    const g = (r.genes || [])[0];
    if (!g) return null;
    return (g.geneName && g.geneName.value) || (g.orderedLocusNames && g.orderedLocusNames[0] && g.orderedLocusNames[0].value) || null;
  }

  function uniprotFunction(r) {
    const comments = r.comments || [];
    const fn = comments.find((c) => c.commentType === "FUNCTION");
    if (!fn) return null;
    const texts = (fn.texts || []).map((t) => t.value).filter(Boolean);
    return texts.join(" ");
  }

  function uniprotRecord(r) {
    const acc = r.primaryAccession;
    const gene = uniprotGene(r);
    const org = (r.organism && r.organism.scientificName) || null;
    const seq = r.sequence || {};
    const props = [];
    const add = (name, value, unit, kind) => {
      if (value === undefined || value === null || value === "") return;
      props.push(E.property({ name, value, unit, kind: kind || "curated", source: "uniprot", recordId: acc, url: `https://www.uniprot.org/uniprotkb/${acc}/entry` }));
    };
    add("Chiều dài chuỗi", seq.length, "aa");
    add("Khối lượng phân tử", seq.molWeight, "Da");
    add("Organism", org);
    add("Gene", gene);
    add("Protein existence", r.proteinExistence);
    add("Reviewed", /reviewed/i.test(r.entryType || "") ? "Swiss-Prot (reviewed)" : "TrEMBL (unreviewed)");

    const ecNumbers = [];
    (r.proteinDescription && r.proteinDescription.recommendedName && r.proteinDescription.recommendedName.ecNumbers || []).forEach((e) => ecNumbers.push(e.value));
    if (ecNumbers.length) add("EC number", ecNumbers.join("; "));

    const xrefs = r.uniProtKBCrossReferences || [];
    const pick = (db) => xrefs.filter((x) => x.database === db).map((x) => x.id);
    const pdb = pick("PDB").slice(0, 8);
    const chembl = pick("ChEMBL");
    const drugbank = pick("DrugBank");
    const rhea = pick("Rhea");
    const ids = { uniprot: acc };
    if (pdb.length) ids.pdb = pdb[0];
    if (chembl.length) ids.chembl = chembl[0];

    return E.record({
      kind: "protein",
      id: "uniprot:" + acc,
      title: uniprotName(r),
      subtitle: [acc, gene, org].filter(Boolean).join(" · "),
      summary: uniprotFunction(r),
      identifiers: ids,
      properties: props,
      provenance: [prov("uniprot", acc, `https://www.uniprot.org/uniprotkb/${acc}/entry`, "curated")],
      links: { uniprot: `https://www.uniprot.org/uniprotkb/${acc}/entry` },
      extra: {
        gene,
        organism: org,
        lineage: (r.organism && r.organism.lineage) || [],
        sequence: seq.value || null,
        length: seq.length,
        pdb,
        chembl,
        drugbank,
        rhea,
        keywords: (r.keywords || []).map((k) => k.name).slice(0, 20),
        entryType: r.entryType,
        reviewed: /reviewed/i.test(r.entryType || ""),
        ecNumbers,
      },
    });
  }

  async function uniprotSearch(q, opts) {
    const size = (opts && opts.max) || 8;
    const j = await net.getJSON(
      `${UP}/uniprotkb/search?query=${enc(q)}&format=json&size=${size}&fields=accession,id,protein_name,gene_names,organism_name,length,cc_function,ec,keyword`,
      { sourceId: "uniprot", ttl: 12 * 3600 * 1000 }
    );
    return (j.results || []).map((r) => {
      const rec = uniprotRecord(r);
      return {
        source: "uniprot",
        sourceLabel: "UniProt",
        kind: "protein",
        title: rec.title,
        subtitle: rec.subtitle,
        identifiers: rec.identifiers,
        why: "Khớp tên protein/gene trong UniProtKB",
        route: "#/biochem/protein/" + encodeURIComponent(rec.identifiers.uniprot),
        score: 55,
        raw: r,
      };
    });
  }

  async function uniprotEntry(acc) {
    const id = String(acc).trim().toUpperCase();
    const j = await net.getJSON(`${UP}/uniprotkb/search?query=accession:${enc(id)}&format=json&size=1`, {
      sourceId: "uniprot",
      ttl: 7 * 24 * 3600 * 1000,
      timeout: 20000,
    });
    if (!j.results || !j.results.length) throw net.error("Không tìm thấy UniProt entry " + id + ".", { status: 404, sourceId: "uniprot" });
    return uniprotRecord(j.results[0]);
  }

  A.uniprot = {
    id: "uniprot",
    label: "UniProt",
    kinds: ["protein"],
    search: uniprotSearch,
    entry: uniprotEntry,
    record: uniprotEntry,
    pageUrl: (acc) => `https://www.uniprot.org/uniprotkb/${acc}/entry`,
  };

  /* =======================================================================
     Reactome
     ======================================================================= */
  const RE = "https://reactome.org/ContentService";

  function reactomeRecord(j) {
    const stId = j.stId || j.dbId;
    const props = [];
    if (j.speciesName) props.push(E.property({ name: "Loài", value: j.speciesName, source: "reactome", recordId: stId }));
    if (j.compartmentName) props.push(E.property({ name: "Compartment", value: j.compartmentName, source: "reactome", recordId: stId }));
    if (j.summation) props.push(E.property({ name: "Mô tả", value: U.truncate(j.summation, 400), source: "reactome", recordId: stId }));
    return E.record({
      kind: "pathway",
      id: "reactome:" + stId,
      title: j.displayName || stId,
      subtitle: [stId, j.speciesName, j.schemaClass].filter(Boolean).join(" · "),
      summary: j.summation ? U.truncate(j.summation, 320) : null,
      identifiers: { reactome: stId },
      properties: props,
      provenance: [prov("reactome", stId, `https://reactome.org/content/detail/${stId}`, "curated")],
      links: { reactome: `https://reactome.org/content/detail/${stId}` },
      extra: j,
    });
  }

  async function reactomeSearch(q, opts) {
    const j = await net.getJSON(`${RE}/search/query?query=${enc(q)}&species=Homo%20sapiens`, { sourceId: "reactome", ttl: 12 * 3600 * 1000 });
    const groups = (j && j.results) || [];
    const out = [];
    groups.forEach((g) => {
      (g.entries || []).slice(0, 3).forEach((e) => {
        out.push({
          source: "reactome",
          sourceLabel: "Reactome",
          kind: "pathway",
          title: e.name,
          subtitle: [e.stId, e.speciesName || g.species].filter(Boolean).join(" · "),
          identifiers: { reactome: e.stId },
          why: "Khớp tên pathway/reaction trong Reactome",
          route: "#/biochem/pathway/" + encodeURIComponent(e.stId),
          score: 40,
          raw: e,
        });
      });
    });
    return out.slice(0, (opts && opts.max) || 6);
  }

  async function reactomeEntry(stId) {
    const j = await net.getJSON(`${RE}/data/query/${enc(stId)}`, { sourceId: "reactome", ttl: 7 * 24 * 3600 * 1000 });
    return reactomeRecord(j);
  }

  A.reactome = {
    id: "reactome",
    label: "Reactome",
    kinds: ["pathway"],
    search: reactomeSearch,
    entry: reactomeEntry,
    record: reactomeEntry,
    pageUrl: (stId) => `https://reactome.org/content/detail/${stId}`,
  };

  /* =======================================================================
     Literature — Europe PMC, PubMed (E-utilities), Crossref
     ======================================================================= */
  const EPMC = "https://www.ebi.ac.uk/europepmc/webservices/rest";

  function epmcRecord(r) {
    const doi = r.doi || null;
    const pmid = r.pmid || null;
    const ids = {};
    if (doi) ids.doi = doi;
    if (pmid) ids.pmid = String(pmid);
    if (r.pmcid) ids.pmcid = r.pmcid;
    const authors = r.authorString || (r.authorList && (r.authorList.author || []).map((a) => a.fullName).join(", ")) || null;
    const props = [
      ["Tạp chí", r.journalTitle || (r.journalInfo && r.journalInfo.journal && r.journalInfo.journal.title)],
      ["Năm", r.pubYear],
      ["Tác giả", authors],
      ["Loại bài", r.pubType],
      ["Open access", r.isOpenAccess === "Y" ? "Có" : r.isOpenAccess === "N" ? "Không" : null],
      ["Số trích dẫn", r.citedByCount],
    ]
      .filter((x) => x[1] !== undefined && x[1] !== null && x[1] !== "")
      .map((x) =>
        E.property({
          name: x[0],
          value: x[1],
          kind: "reported",
          source: "europe-pmc",
          recordId: r.id || pmid || doi,
          url: pmid ? `https://europepmc.org/article/MED/${pmid}` : null,
        })
      );

    return E.record({
      kind: "publication",
      id: "epmc:" + (pmid || doi || r.id),
      title: (r.title || "(không tiêu đề)").replace(/<[^>]+>/g, ""),
      subtitle: [r.journalTitle, r.pubYear, pmid ? "PMID " + pmid : null].filter(Boolean).join(" · "),
      summary: r.abstractText ? r.abstractText.replace(/<[^>]+>/g, "") : null,
      identifiers: ids,
      properties: props,
      provenance: [
        prov(
          "europe-pmc",
          r.id || pmid || doi,
          pmid ? `https://europepmc.org/article/MED/${pmid}` : doi ? `https://doi.org/${doi}` : null,
          "reported",
          r.isOpenAccess === "Y" ? "Open access" : "Metadata only"
        ),
      ],
      links: {
        europepmc: pmid ? `https://europepmc.org/article/MED/${pmid}` : null,
        pubmed: pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : null,
        doi: doi ? `https://doi.org/${doi}` : null,
      },
      extra: {
        authors,
        journal: r.journalTitle,
        year: r.pubYear,
        abstract: r.abstractText || null,
        openAccess: r.isOpenAccess === "Y",
        citedBy: r.citedByCount,
        pubType: r.pubType,
        source: r.source,
      },
    });
  }

  async function epmcSearch(q, opts) {
    const size = (opts && opts.max) || 10;
    const j = await net.getJSON(
      `${EPMC}/search?query=${enc(q)}&format=json&pageSize=${size}&resultType=core`,
      { sourceId: "europe-pmc", ttl: 6 * 3600 * 1000 }
    );
    const results = (j && j.resultList && j.resultList.result) || [];
    return results.map((r) => {
      const rec = epmcRecord(r);
      return {
        source: "europe-pmc",
        sourceLabel: "Europe PMC",
        kind: "publication",
        title: rec.title,
        subtitle: rec.subtitle,
        identifiers: rec.identifiers,
        why: "Khớp từ khóa trong tiêu đề/abstract (Europe PMC)",
        route: rec.identifiers.doi
          ? "#/literature/doi/" + encodeURIComponent(rec.identifiers.doi)
          : rec.identifiers.pmid
          ? "#/literature/pmid/" + rec.identifiers.pmid
          : "#/search?q=" + enc(q),
        score: 35,
        raw: r,
      };
    });
  }

  async function epmcRecordById(id, idType) {
    const query = idType === "doi" ? `DOI:"${id}"` : `EXT_ID:${id}`;
    const j = await net.getJSON(`${EPMC}/search?query=${enc(query)}&format=json&pageSize=1&resultType=core`, {
      sourceId: "europe-pmc",
      ttl: 12 * 3600 * 1000,
    });
    const first = j && j.resultList && j.resultList.result && j.resultList.result[0];
    if (!first) throw net.error("Không tìm thấy bài báo trong Europe PMC.", { status: 404, sourceId: "europe-pmc" });
    return epmcRecord(first);
  }

  /* ---- PubMed E-utilities (metadata only) ---- */
  const NCBI = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

  async function pubmedSearchIds(term, max) {
    const url = Sci.config.withKey(`${NCBI}/esearch.fcgi?db=pubmed&term=${enc(term)}&retmode=json&retmax=${max || 8}`, "ncbiKey", "api_key");
    const j = await net.getJSON(url, { sourceId: "pubmed", ttl: 6 * 3600 * 1000 });
    return (j && j.esearchresult && j.esearchresult.idlist) || [];
  }

  async function pubmedSummaries(ids) {
    if (!ids || !ids.length) return [];
    const url = Sci.config.withKey(`${NCBI}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`, "ncbiKey", "api_key");
    const j = await net.getJSON(url, { sourceId: "pubmed", ttl: 12 * 3600 * 1000 });
    const result = (j && j.result) || {};
    return ids
      .map((id) => {
        const r = result[id];
        if (!r) return null;
        return {
          pmid: id,
          title: (r.title || "").replace(/<[^>]+>/g, ""),
          authors: (r.authors || []).map((a) => a.name).join(", "),
          journal: r.fulljournalname || r.source,
          pubdate: r.pubdate,
          doi: (r.articleids || []).find((a) => a.idtype === "doi")?.value || null,
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        };
      })
      .filter(Boolean);
  }

  async function pubmedSearch(q, opts) {
    const ids = await pubmedSearchIds(q, (opts && opts.max) || 8);
    const rows = await pubmedSummaries(ids);
    return rows.map((r) => ({
      source: "pubmed",
      sourceLabel: "PubMed",
      kind: "publication",
      title: r.title,
      subtitle: [r.journal, r.pubdate, "PMID " + r.pmid].filter(Boolean).join(" · "),
      identifiers: { pmid: r.pmid, doi: r.doi || null },
      why: "Khớp truy vấn trong PubMed (metadata)",
      route: r.doi ? "#/literature/doi/" + encodeURIComponent(r.doi) : "#/literature/pmid/" + r.pmid,
      score: 34,
      raw: r,
    }));
  }

  /* ---- Crossref ---- */
  async function crossrefSearch(q, opts) {
    const mail = Sci.config.get("mailto");
    const rows = (opts && opts.max) || 8;
    const url = `https://api.crossref.org/works?query.bibliographic=${enc(q)}&rows=${rows}${
      mail ? "&mailto=" + enc(mail) : ""
    }&select=DOI,title,author,container-title,issued,type,publisher`;
    const j = await net.getJSON(url, { sourceId: "crossref", ttl: 12 * 3600 * 1000 });
    const items = (j && j.message && j.message.items) || [];
    return items.map((it) => {
      const title = (it.title && it.title[0]) || "(không tiêu đề)";
      const year = it.issued && it.issued["date-parts"] && it.issued["date-parts"][0] && it.issued["date-parts"][0][0];
      const authors = (it.author || []).map((a) => [a.given, a.family].filter(Boolean).join(" ")).join(", ");
      return {
        source: "crossref",
        sourceLabel: "Crossref",
        kind: "publication",
        title,
        subtitle: [(it["container-title"] || [])[0], year, it.DOI].filter(Boolean).join(" · "),
        identifiers: { doi: it.DOI },
        why: "Khớp metadata DOI qua Crossref",
        route: "#/literature/doi/" + encodeURIComponent(it.DOI),
        score: 32,
        raw: Object.assign({}, it, { authors }),
      };
    });
  }

  async function crossrefDoi(doi) {
    const j = await net.getJSON(`https://api.crossref.org/works/${enc(doi)}`, { sourceId: "crossref", ttl: 30 * 24 * 3600 * 1000 });
    const m = j.message || j;
    return {
      doi: m.DOI || doi,
      title: (m.title && m.title[0]) || "(không tiêu đề)",
      authors: (m.author || []).map((a) => [a.given, a.family].filter(Boolean).join(" ")),
      journal: (m["container-title"] || [])[0] || null,
      year: m.issued && m.issued["date-parts"] && m.issued["date-parts"][0] && m.issued["date-parts"][0][0],
      publisher: m.publisher || null,
      type: m.type || null,
      url: m.URL || `https://doi.org/${doi}`,
      license: (m.license || []).map((l) => l.URL).filter(Boolean),
      references: (m.reference || []).slice(0, 15),
    };
  }

  A.literature = {
    id: "literature",
    label: "Europe PMC / PubMed / Crossref",
    kinds: ["publication"],
    search: epmcSearch,
    byId: epmcRecordById,
    pubmedSearch,
    crossrefSearch,
    crossrefDoi,
    record: epmcRecordById,
    render: epmcRecord,
    pageUrl: (pmid) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
  };
})(typeof window !== "undefined" ? window : globalThis);
