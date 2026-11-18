/* =========================================================================
   Adapter registry / capability map
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const A = (Sci.adapters = Sci.adapters || {});

  /** Adapters that answer free-text queries, in display order. */
  const SEARCH_ORDER = ["pubchem", "chebi", "chembl", "rhea", "uniprot", "reactome", "openfda", "rxnorm", "europe-pmc", "pubmed", "crossref"];

  /** Entity-type → adapters used by the global search when a filter is active. */
  const KIND_ADAPTERS = {
    compound: ["pubchem", "chebi", "chembl"],
    reaction: ["rhea"],
    protein: ["uniprot"],
    pathway: ["reactome"],
    drug: ["openfda", "rxnorm"],
    publication: ["europe-pmc", "pubmed", "crossref"],
  };

  function get(id) {
    return A[id] || null;
  }

  function searchable() {
    return SEARCH_ORDER.map((id) => A[id]).filter((a) => a && typeof a.search === "function");
  }

  function forKind(kind) {
    return (KIND_ADAPTERS[kind] || []).map((id) => A[id]).filter(Boolean);
  }

  /** Human-readable capability matrix used by the Data Sources page. */
  function capabilities() {
    return Object.keys(A)
      .filter((id) => A[id] && !A[id].external)
      .map((id) => {
        const a = A[id];
        const meta = Sci.registry.byId[id] || Sci.registry.byId[a.id] || {};
        return {
          id,
          label: a.label,
          kind: meta.status || "live",
          search: typeof a.search === "function",
          record: typeof a.record === "function" || typeof a.entry === "function" || typeof a.compound === "function",
        };
      });
  }

  Sci.sources = { get, searchable, forKind, capabilities, SEARCH_ORDER, KIND_ADAPTERS };
  Sci.adapters = A;
})(typeof window !== "undefined" ? window : globalThis);
