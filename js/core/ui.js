/* =========================================================================
   Shared record UI: provenance, properties, citations, safety notices
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const E = Sci.entity;
  const h = U.html;
  const raw = U.raw;

  const SOURCE_SHORT = {
    pubchem: "PubChem",
    "pubchem-ghs": "PubChem GHS",
    chebi: "ChEBI",
    chembl: "ChEMBL",
    rhea: "Rhea",
    uniprot: "UniProt",
    reactome: "Reactome",
    openfda: "openFDA",
    rxnorm: "RxNav",
    "europe-pmc": "Europe PMC",
    pubmed: "PubMed",
    crossref: "Crossref",
    nomad: "NOMAD",
    "materials-project": "Materials Project",
    "rcsb-pdb": "RCSB PDB",
    local: "Biên soạn nội bộ",
  };

  function sourceName(id) {
    return SOURCE_SHORT[id] || (Sci.registry.byId[id] && Sci.registry.byId[id].name) || id;
  }

  function kindBadge(kind) {
    return h`<span class="kind-badge kind-${kind}">${E.kindLabel(kind)}</span>`;
  }

  function dataTypeBadge(kind) {
    const cls = E.dataTypeClass(kind);
    return h`<span class="dtype dtype-${cls}" title="Phân loại nguồn dữ liệu">${E.dataTypeLabel(kind)}</span>`;
  }

  function sourceBadge(sourceId) {
    const meta = Sci.registry.byId[sourceId] || {};
    const license = meta.license ? ` · ${meta.license}` : "";
    return h`<a class="source-badge" href="${meta.url || "#/sources"}" ${
      meta.url ? raw('target="_blank" rel="noopener noreferrer"') : raw("")
    } title="${sourceName(sourceId)}${license}">${sourceName(sourceId)}</a>`;
  }

  /** Provenance table: source, record id, licence, retrieval time, data type. */
  function provenanceBlock(record) {
    const list = (record && record.provenance) || [];
    if (!list.length) {
      return h`<p class="muted small">Bản ghi này chưa có metadata provenance đầy đủ.</p>`;
    }
    return h`<div class="table-wrap"><table class="data-table provenance-table">
      <thead><tr><th>Nguồn</th><th>Record ID</th><th>Giấy phép</th><th>Loại dữ liệu</th><th>Thời điểm lấy</th></tr></thead>
      <tbody>${list.map(
        (p) =>
          h`<tr>
            <td>${sourceBadge(p.source)}</td>
            <td class="mono">${p.url ? U.extLink(p.url, p.recordId || "xem", { plain: true }) : p.recordId || "—"}</td>
            <td class="small">${p.license || "—"}</td>
            <td>${dataTypeBadge(p.dataType)}</td>
            <td class="small muted" title="${p.retrievedAt || ""}">${U.relative(p.retrievedAt)}</td>
          </tr>`
      )}</tbody></table></div>`;
  }

  /** Property table grouped by property name, keeping conflicting sources apart. */
  function propertiesBlock(record, opts) {
    const o = opts || {};
    const groups = E.groupProperties(record.properties)
      .filter((g) => {
        if (o.exclude && o.exclude.some((re) => re.test(g.name))) return false;
        if (o.include && !o.include.some((re) => re.test(g.name))) return false;
        return true;
      })
      .slice(0, o.limit || 80);
    if (!groups.length) return U.emptyState("Chưa có tính chất", "Nguồn dữ liệu hiện tại không trả về tính chất cho bản ghi này.");

    return h`<div class="property-groups">${groups.map((g) => {
      const conflict = E.hasConflict(g);
      return h`<div class="property-group ${conflict ? "has-conflict" : ""}">
        <div class="pg-name">${g.name}${conflict ? raw(' <span class="conflict-tag" title="Các nguồn báo giá trị khác nhau — không trung bình hóa">khác nguồn</span>') : raw("")}</div>
        <div class="pg-values">${g.values.map(
          (v) =>
            h`<div class="pg-value">
              <span class="pg-num">${v.unit ? h`${U.num(v.value)} <small>${v.unit}</small>` : h`${typeof v.value === "number" ? U.num(v.value) : v.value}`}</span>
              <span class="pg-meta">${sourceBadge(v.source)}${dataTypeBadge(v.kind)}${
                v.conditions ? h`<span class="pg-cond" title="${v.conditions}">điều kiện</span>` : raw("")
              }</span>
            </div>`
        )}</div>
      </div>`;
    })}</div>${
      o.footnote
        ? h`<p class="muted small">${o.footnote}</p>`
        : h`<p class="muted small">Giá trị được giữ nguyên theo từng nguồn. Giá trị khác nhau giữa các nguồn được hiển thị song song, không hợp nhất hay trung bình hóa.</p>`
    }`;
  }

  function identifierBlock(record) {
    const refs = E.xrefs(record.identifiers).filter((x) => x.key !== "smiles" && x.key !== "inchi");
    if (!refs.length) return raw("");
    return h`<dl class="id-grid">${refs.map(
      (r) => h`<div class="id-row"><dt>${r.label}</dt><dd class="mono">${r.value}</dd>
        <button class="icon-btn" data-copy="${r.value}" title="Sao chép ${r.label}" aria-label="Sao chép ${r.label}">⧉</button></div>`
    )}</dl>`;
  }

  function citationBlock(record) {
    const first = (record.provenance || [])[0];
    const title = record.title || "Bản ghi";
    const ids = E.xrefs(record.identifiers).slice(0, 4).map((x) => `${x.label}: ${x.value}`).join("; ");
    const text = `${title}. ${sourceName(first ? first.source : "local")}${
      first && first.recordId ? " (" + first.recordId + ")" : ""
    }. ${ids}. Truy cập ${U.fmtDate(new Date().toISOString())}.`;
    return h`<div class="cite-box">
      <p class="cite-label">Trích dẫn bản ghi này</p>
      <p class="cite-text" id="citeText">${text}</p>
      <button class="btn btn-sm" data-copy="${text}">Sao chép trích dẫn</button>
    </div>`;
  }

  function safetyNotice(text) {
    return h`<div class="notice notice-warn" role="note">
      <span class="notice-icon" aria-hidden="true">⚠</span>
      <div><b>Lưu ý an toàn.</b> ${text}</div>
    </div>`;
  }

  function dataNotice(text) {
    return h`<div class="notice notice-info" role="note">
      <span class="notice-icon" aria-hidden="true">ℹ</span><div>${text}</div>
    </div>`;
  }

  function section(id, title, body, opts) {
    const o = opts || {};
    return h`<section class="record-section" id="${id}">
      <div class="rs-head"><h2>${title}</h2>${o.aside ? h`<div class="rs-aside">${o.aside}</div>` : raw("")}</div>
      ${body}
    </section>`;
  }

  /** Small source status pill used in headers and the sources page. */
  function statusBadge(status) {
    const cls = {
      live: "ok",
      "live-key": "warn",
      bulk: "neutral",
      external: "neutral",
      planned: "muted",
      rejected: "danger",
    }[status] || "neutral";
    return h`<span class="status-pill status-${cls}" title="${Sci.registry.statusLabel(status)}">${Sci.registry.statusLabel(status)}</span>`;
  }

  /** "Live data" banner so users always know where a number came from. */
  function liveBanner(sourceIds, note) {
    return h`<div class="live-banner">
      <span class="live-dot" aria-hidden="true"></span>
      <span>Truy vấn trực tiếp: ${sourceIds.map((s) => sourceBadge(s)).reduce((a, b) => h`${a} ${b}`, raw(""))}</span>
      ${note ? h`<span class="muted small">${note}</span>` : raw("")}
    </div>`;
  }

  function tabs(items, active, attrs) {
    return U.pillTabs(items, active, attrs);
  }

  function emptySource(sourceId, err, retry) {
    return h`<div class="source-failure">${U.errorBox(err, {
      retry: retry !== false,
      hint: `Nguồn ${sourceName(sourceId)} có thể đang tạm thời không phản hồi. Các phần khác của trang vẫn hoạt động bình thường.`,
    })}</div>`;
  }

  Sci.ui = {
    kv: U.kv,
    table: U.table,
    pager: U.pager,
    sourceName,
    kindBadge,
    dataTypeBadge,
    sourceBadge,
    provenanceBlock,
    propertiesBlock,
    identifierBlock,
    citationBlock,
    safetyNotice,
    dataNotice,
    section,
    statusBadge,
    liveBanner,
    tabs,
    emptySource,
  };
})(typeof window !== "undefined" ? window : globalThis);
