/* =========================================================================
   Unified search view — local index + streaming live sources + identifier
   resolution, with per-source status and result explanations.
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const ui = Sci.ui;
  const V = (Sci.views = Sci.views || {});

  const EXAMPLES = ["aspirin", "caffeine", "InChIKey BSYNRYMUTXBXSQ-UHFFFAOYSA-N", "RHEA:11752", "insulin", "10.1038/nature14539"];

  function externalSearchLinks(q) {
    const e = encodeURIComponent(q);
    return [
      ["PubChem", `https://pubchem.ncbi.nlm.nih.gov/#query=${e}`],
      ["ChEBI", `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${e}`],
      ["ChEMBL", `https://www.ebi.ac.uk/chembl/g/#search_results/all/query=${e}`],
      ["Rhea", `https://www.rhea-db.org/rhea?query=${e}`],
      ["UniProt", `https://www.uniprot.org/uniprotkb?query=${e}`],
      ["openFDA", `https://open.fda.gov/apis/`],
      ["Europe PMC", `https://europepmc.org/search?query=${e}`],
      ["PubMed", `https://pubmed.ncbi.nlm.nih.gov/?term=${e}`],
      ["Crossref", `https://search.crossref.org/?q=${e}`],
      ["NIST WebBook", `https://webbook.nist.gov/cgi/cbook.cgi?Name=${e}&Units=SI`],
    ];
  }

  function resultCard(r) {
    const ids = r.identifiers || {};
    const idChips = Object.keys(ids)
      .filter((k) => ["cid", "chebi", "chembl", "rhea", "uniprot", "doi", "pmid", "rxcui", "ndc", "formula"].includes(k))
      .slice(0, 4)
      .map((k) => h`<span class="id-chip">${k.toUpperCase()}: ${U.idShort(ids[k], 26)}</span>`);
    return h`<article class="result-card">
      <div class="rc-top">
        ${ui.kindBadge(r.kind)}
        <span class="rc-source">${ui.sourceName(r.source)}</span>
      </div>
      <h3 class="rc-title"><a href="${r.route}">${r.title}</a></h3>
      ${r.subtitle ? h`<p class="rc-sub">${r.subtitle}</p>` : raw("")}
      <p class="rc-why">${r.why}</p>
      ${idChips.length ? h`<div class="rc-ids">${idChips}</div>` : raw("")}
      <div class="rc-actions">
        <a class="btn btn-sm" href="${r.route}">Mở bản ghi</a>
        ${externalSearchLinks(r.title)
          .slice(0, 3)
          .map((l) => U.extLink(l[1], l[0]))
          .reduce((a, b) => h`${a} ${b}`, raw(""))}
      </div>
    </article>`;
  }
  Sci.ui.resultCard = resultCard;

  V.search = {
    title: "Tìm kiếm khoa học",
    render(ctx) {
      const q = ctx.query.get("q") || "";
      const kind = ctx.query.get("kind") || "all";
      const kinds = [{ id: "all", label: "Tất cả" }].concat(
        Sci.search.KIND_ORDER.map((k) => ({ id: k, label: Sci.search.kindLabel(k) }))
      );
      return h`<div class="view-container search-view">
        ${U.sectionHead(
          "Global Search",
          "Tìm kiếm khoa học toàn cầu",
          "Một truy vấn, nhiều cơ sở dữ liệu: tên chất, IUPAC, đồng nghĩa, công thức, SMILES, InChIKey, CID, DOI, PMID, protein, phản ứng. Kết quả nêu rõ nguồn và lý do khớp."
        )}
        <div class="search-page-field" id="searchField"></div>
        <div class="facet-row" role="group" aria-label="Lọc theo loại thực thể">
          ${kinds.map(
            (k) => h`<a class="facet-pill ${k.id === kind ? "active" : ""}"
              href="#/search?q=${encodeURIComponent(q)}&kind=${k.id}">${k.label}</a>`
          )}
        </div>
        <div id="identifierCard"></div>
        <div class="search-layout">
          <section class="search-col">
            <div class="col-head"><h2>Chỉ mục cục bộ</h2><span id="localCount" class="muted small"></span></div>
            <div id="localResults">${q ? U.spinner("Đang tìm trong chỉ mục…") : raw("")}</div>
          </section>
          <section class="search-col">
            <div class="col-head"><h2>Nguồn trực tiếp</h2><span id="liveStatus" class="muted small"></span></div>
            <div id="liveResults"></div>
          </section>
        </div>
        <section class="record-section" id="externalSection"></section>
      </div>`;
    },
    async after(ctx) {
      const q = (ctx.query.get("q") || "").trim();
      const kind = ctx.query.get("kind") || "all";
      const fieldMount = ctx.mount.querySelector("#searchField");
      const box = Sci.searchBox.create(fieldMount, { value: q, placeholder: "Nhập tên, CID, InChIKey, DOI, PMID hoặc SMILES…" });
      const localEl = ctx.mount.querySelector("#localResults");
      const liveEl = ctx.mount.querySelector("#liveResults");
      const identEl = ctx.mount.querySelector("#identifierCard");
      const extEl = ctx.mount.querySelector("#externalSection");
      const liveStatus = ctx.mount.querySelector("#liveStatus");
      let token = 0;
      ctx.cleanup(() => token++);

      if (!q) {
        localEl.innerHTML = U.emptyState(
          "Bắt đầu tra cứu",
          "Nhập tên chất, định danh hoặc DOI. Hệ thống tìm trong chỉ mục cục bộ trước, rồi truy vấn song song các nguồn mở.",
          h`<div class="example-row">${EXAMPLES.map(
            (e) => h`<a class="example-chip" href="#/search?q=${encodeURIComponent(e)}">${e}</a>`
          )}</div>`
        );
        liveEl.innerHTML = "";
        extEl.innerHTML = "";
        return;
      }

      /* identifier detection */
      const ident = Sci.search.detectIdentifier(q);
      if (ident.type !== "text" && ident.type !== "ambiguous-number" && ident.type !== "formula") {
        identEl.innerHTML = h`<div class="identifier-card">
          <div class="ic-head"><span class="ic-label">Nhận diện định danh: <b>${ident.label}</b></span></div>
          <p class="ic-value mono">${ident.value}</p>
          ${ident.hint ? h`<p class="muted small">${ident.hint}</p>` : raw("")}
          <div class="ic-actions"><button class="btn btn-sm" id="resolveBtn">Tra định danh này</button></div>
          <div id="resolveOut"></div>
        </div>`;
        identEl.querySelector("#resolveBtn").addEventListener("click", async (ev) => {
          const out = identEl.querySelector("#resolveOut");
          ev.target.disabled = true;
          out.innerHTML = U.spinner("Đang tra định danh…");
          const my = token;
          try {
            const r = await Sci.search.resolve(q);
            if (my !== token) return;
            out.innerHTML = r.results.length
              ? h`<div class="resolve-list">${r.results.map(resultCard)}</div>${
                  r.notes.length ? h`<ul class="note-list">${r.notes.map((n) => h`<li>${n}</li>`)}</ul>` : raw("")
                }`
              : U.emptyState("Không phân giải được", r.notes.join(" ") || "Định danh không tồn tại trong nguồn đã truy vấn.");
          } catch (e) {
            if (my !== token) return;
            out.innerHTML = U.errorBox(e, { hint: "Kiểm tra lại định danh hoặc thử nguồn khác." });
          } finally {
            ev.target.disabled = false;
          }
        });
      } else if (ident.type === "ambiguous-number") {
        identEl.innerHTML = h`<div class="notice notice-info"><span class="notice-icon">ℹ</span><div>
          <b>${ident.hint}</b>
          <div class="example-row">
            <a class="example-chip" href="#/search?q=${encodeURIComponent("cid:" + q)}">CID ${q}</a>
            <a class="example-chip" href="#/search?q=${encodeURIComponent("pmid:" + q)}">PMID ${q}</a>
          </div></div></div>`;
      }

      /* local results */
      const local = Sci.search.local(q, { kind, limit: 60 });
      ctx.mount.querySelector("#localCount").textContent = local.results.length + " kết quả";
      localEl.innerHTML = local.results.length
        ? h`<div class="result-list">${local.results.map(resultCard)}</div>`
        : U.emptyState("Không có trong chỉ mục cục bộ", "Chuyển sang kết quả từ nguồn trực tiếp bên cạnh, hoặc thử tên khoa học khác.");

      /* live results */
      const adapterCount = kind === "all" ? Sci.sources.searchable().length : Sci.sources.forKind(kind).length;
      liveStatus.textContent = `đang truy vấn ${adapterCount} nguồn…`;
      liveEl.innerHTML = h`<div class="source-status-list" id="sourceStatuses"></div>`;
      const statusEl = liveEl.querySelector("#sourceStatuses");

      const my = token;
      let settled = 0;
      const statusMap = new Map();

      function renderStatuses(list) {
        statusEl.innerHTML = list
          .map((s) => {
            const cls = s.status === "ok" ? "ok" : s.status === "error" ? "fail" : "warn";
            const count = s.results ? s.results.length : 0;
            return h`<span class="ss-chip ss-${cls}" title="${s.message ? U.esc(s.message) : ""}">
              <span class="ss-dot" aria-hidden="true"></span>${s.label || s.source}
              <span class="ss-count">${s.status === "ok" ? count : s.status === "timeout" ? "timeout" : "lỗi"}</span>
            </span>`;
          })
          .join("");
      }

      renderStatuses(
        (kind === "all" ? Sci.sources.searchable() : Sci.sources.forKind(kind)).map((a) => ({
          source: a.id,
          label: (Sci.registry.byId[a.id] || {}).name || a.label,
          status: "pending",
          results: [],
        }))
      );

      const resultsHost = document.createElement("div");
      resultsHost.className = "live-groups";
      liveEl.appendChild(resultsHost);

      try {
        const r = await Sci.search.remote(q, {
          kind,
          onUpdate: (upd, all) => {
            if (my !== token) return;
            settled++;
            statusMap.set(upd.source, upd);
            renderStatuses(all.map((s) => (s.status === "ok" || s.status === "error" || s.status === "timeout" ? s : { source: s.source, label: s.label, status: "pending" })));
            liveStatus.textContent = `${settled}/${all.length} nguồn đã phản hồi`;
            const ok = all.filter((s) => s.status === "ok" && s.results.length);
            resultsHost.innerHTML = ok
              .map(
                (s) => h`<div class="live-group">
                  <div class="lg-head">
                    <span>${s.label}</span>
                    <span class="muted small">${s.results.length}</span>
                  </div>
                  <div class="result-list compact">${s.results.map(resultCard)}</div>
                </div>`
              )
              .join("");
            const failures = all.filter((s) => s.status === "error" || s.status === "timeout");
            if (failures.length) {
              resultsHost.innerHTML += h`<div class="source-failures">
                <p class="small muted">${failures.length} nguồn không phản hồi: ${failures.map((f) => f.label || f.source).join(", ")}. Các nguồn còn lại vẫn hoạt động.</p>
              </div>`;
            }
          },
        });
        if (my !== token) return;
        renderStatuses(r.sources.map((s) => ({ source: s.source, label: s.label, status: s.status === "ok" ? "ok" : s.status, results: s.results, message: s.message })));
        liveStatus.textContent = `${r.results.length} kết quả trực tiếp`;
        if (!r.results.length) {
          resultsHost.innerHTML = U.emptyState(
            "Không có kết quả trực tiếp",
            "Các nguồn đã phản hồi nhưng không khớp truy vấn. Thử tên khác, hoặc dùng liên kết tra cứu bên dưới."
          );
        }
      } catch (e) {
        if (my !== token) return;
        liveStatus.textContent = "lỗi";
        liveEl.innerHTML = U.errorBox(e, { hint: "Kiểm tra kết nối mạng. Chỉ mục cục bộ vẫn dùng được." });
      }

      /* external deep links */
      extEl.innerHTML = h`<h2>Truy vấn tại nguồn gốc</h2>
        <p class="muted">Mở trực tiếp trên website chính thức của từng cơ sở dữ liệu — hữu ích khi cần toàn bộ bản ghi, hình ảnh cấu trúc hoặc công cụ chuyên sâu.</p>
        <div class="link-grid">${externalSearchLinks(q).map(
          (l) => h`<a class="link-tile" href="${l[1]}" target="_blank" rel="noopener noreferrer">
            <span class="lt-name">${l[0]}</span><span class="lt-glyph" aria-hidden="true">↗</span>
            <span class="lt-url mono">${U.truncate(l[1].replace(/^https?:\/\//, ""), 46)}</span>
          </a>`
        )}</div>`;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
