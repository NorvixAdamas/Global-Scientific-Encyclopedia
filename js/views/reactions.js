/* =========================================================================
   Reaction views (Rhea live, ORD-style local records, curated library detail)
   and materials views (record + live materials sources)
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const ui = Sci.ui;
  const V = (Sci.views = Sci.views || {});

  function reactionParticipantsRecord(equation) {
    if (!equation) return [];
    return equation.split(/\s*=\s*/).map((s) => s.trim());
  }

  /* ======================================================================
     Reaction explorer (tabs)
     ====================================================================== */
  V.reactionsExplore = {
    title: "Khám phá phản ứng",
    render(ctx) {
      const tab = ctx.query.get("tab") || "rhea";
      const q = ctx.query.get("q") || "";
      const tabs = [
        { id: "rhea", label: "Rhea · phản ứng sinh hóa" },
        { id: "local", label: "Bản ghi nội bộ (ORD-style)" },
        { id: "ord", label: "Open Reaction Database" },
      ];
      return h`<div class="view-container">
        ${U.sectionHead(
          "Chemical Reactions",
          "Khám phá phản ứng",
          "Rhea cho phản ứng enzyme đã curate (CC BY 4.0); bản ghi nội bộ theo schema ORD; ORD là nguồn bulk riêng. Thư viện phản ứng biên soạn nằm ở trang Phản ứng."
        )}
        ${U.pillTabs(tabs, tab, 'id="rxnTabs"')}
        <div class="tab-panel">
          ${tab === "rhea" ? rheaPanel(q) : tab === "local" ? localPanel(ctx) : ordPanel()}
        </div>
      </div>`;
    },
    after(ctx) {
      const tab = ctx.query.get("tab") || "rhea";
      const tabsHost = ctx.mount.querySelector("#rxnTabs");
      tabsHost.querySelectorAll("[data-tab]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const q = ctx.query.get("q") || "";
          ctx.navigate(`#/reactions/explore?tab=${btn.dataset.tab}${q ? "&q=" + encodeURIComponent(q) : ""}`);
        })
      );

      if (tab === "rhea") {
        const form = ctx.mount.querySelector("#rheaForm");
        const out = ctx.mount.querySelector("#rheaOut");
        const run = async (term) => {
          if (!term) return;
          out.innerHTML = U.spinner("Đang truy vấn Rhea…");
          try {
            const rows = await Sci.adapters.rhea.search(term, { max: 15 });
            out.innerHTML = rows.length
              ? h`<div class="table-wrap"><table class="data-table">
                  <thead><tr><th>Rhea ID</th><th>Phương trình</th><th>EC</th><th></th></tr></thead>
                  <tbody>${rows.map(
                    (r) => h`<tr>
                      <td class="mono"><a href="${r.route}">${r.identifiers.rhea}</a></td>
                      <td class="eq">${r.title}</td>
                      <td class="mono small">${r.identifiers.ec || "—"}</td>
                      <td><a class="btn btn-xs" href="${r.route}">Chi tiết</a></td>
                    </tr>`
                  )}</tbody></table></div>
                <p class="muted small">Nguồn: Rhea (SIB/EMBL-EBI), CC BY 4.0. Phản ứng hai chiều được hiển thị đúng như nguồn.</p>`
              : U.emptyState("Không có phản ứng khớp", "Rhea tìm theo tên chất tham gia, ChEBI ID và EC number.");
          } catch (e) {
            out.innerHTML = U.errorBox(e, { hint: "Rhea REST trả bảng TSV; nếu mạng chậm hãy thử lại." });
          }
        };
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const term = new FormData(form).get("q").trim();
          ctx.navigate("#/reactions/explore?tab=rhea" + (term ? "&q=" + encodeURIComponent(term) : ""));
          run(term);
        });
        ctx.mount.querySelectorAll("[data-rhea-example]").forEach((b) =>
          b.addEventListener("click", () => {
            ctx.navigate("#/reactions/explore?tab=rhea&q=" + encodeURIComponent(b.dataset.rheaExample));
            run(b.dataset.rheaExample);
          })
        );
        const initial = ctx.query.get("q") || "";
        if (!initial) run("CHEBI:15377");
      }

      if (tab === "local") {
        const input = ctx.mount.querySelector("#ordFilter");
        const tableWrap = ctx.mount.querySelector("#ordTable");
        const pageSize = 25;
        let page = 1;
        function paint() {
          const q = input.value.trim().toLowerCase();
          const rows = (root.OPEN_REACTIONS || []).filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q));
          const pages = Math.max(1, Math.ceil(rows.length / pageSize));
          page = Math.min(page, pages);
          const slice = rows.slice((page - 1) * pageSize, page * pageSize);
          tableWrap.innerHTML = h`${U.table(
            [
              { label: "ID", cls: "mono", render: (r) => h`<a href="#/reactions/ord/${encodeURIComponent(r.reaction_id)}">${r.reaction_id}</a>` },
              {
                label: "Phản ứng",
                cls: "small",
                render: (r) =>
                  h`${(r.reactants || []).map((x) => x.name).join(" + ")} <span class="arrow">→</span> ${(r.products || []).map((x) => x.name).join(" + ")}`,
              },
              { label: "Loại", cls: "small", render: (r) => r.type || "—" },
              { label: "Yield", cls: "small", render: (r) => r.yield_percent || "—" },
              { label: "Điều kiện", cls: "small", render: (r) => (r.conditions ? [r.conditions.temperature, r.conditions.solvent, r.conditions.catalyst].filter(Boolean).join(" · ") : "—") },
            ],
            slice,
            { emptyTitle: "Không có bản ghi", emptyDetail: "Bộ dữ liệu nội bộ đang trống cho bộ lọc này." }
          )}<p class="muted small">${rows.length} bản ghi · trang ${page}/${pages}</p>
          ${U.pager(page, pages, 'id="ordPager"')}`;
          tableWrap.querySelectorAll("[data-page]").forEach((btn) =>
            btn.addEventListener("click", () => {
              page = Number(btn.dataset.page);
              paint();
            })
          );
        }
        input.addEventListener("input", U.debounce(paint, 160));
        paint();
      }
    },
  };

  function rheaPanel(q) {
    return h`<section class="record-section">
      <h2>Tra cứu Rhea</h2>
      <p class="muted">Tìm theo tên chất, ChEBI ID hoặc EC number. Ví dụ: <code>ATP</code>, <code>CHEBI:15377</code>, <code>EC:3.5.1.50</code>.</p>
      <form class="inline-search" id="rheaForm" role="search">
        <input type="search" name="q" value="${q}" placeholder="ATP, glucose, CHEBI:15377, EC:1.1.1.1…" aria-label="Tra Rhea" />
        <button class="btn btn-sm" type="submit">Tra Rhea</button>
      </form>
      <div class="example-row">
        ${["ATP", "glucose", "CHEBI:15377", "EC:3.5.1.50"].map(
          (x) => h`<button class="example-chip" data-rhea-example="${x}">${x}</button>`
        )}
      </div>
      <div id="rheaOut" class="mt-md">${U.spinner("Đang truy vấn Rhea…")}</div>
    </section>`;
  }

  function localPanel() {
    const total = (root.OPEN_REACTIONS || []).length;
    return h`<section class="record-section">
      <h2>Bản ghi phản ứng nội bộ <span class="muted small">(${U.num(total)})</span></h2>
      <div class="notice notice-info"><span class="notice-icon">ℹ</span><div>
        Đây là bộ dữ liệu <b>biên soạn nội bộ</b> theo cấu trúc tham chiếu ORD (reactants, products, conditions, yield).
        Đây <b>không phải</b> bản trích xuất từ Open Reaction Database. Trường nào thiếu được hiển thị là “—”.
      </div></div>
      <div class="inline-search"><input id="ordFilter" type="search" placeholder="Lọc theo chất, điều kiện, loại phản ứng…" aria-label="Lọc bản ghi nội bộ" /></div>
      <div id="ordTable">${U.spinner()}</div>
    </section>`;
  }

  function ordPanel() {
    return h`<section class="record-section">
      <h2>Open Reaction Database (ORD)</h2>
      <p>ORD là dataset phản ứng hữu cơ có cấu trúc (protobuf) do cộng đồng xây dựng, phân phối qua GitHub/HuggingFace theo giấy phép <b>CC BY-SA 4.0</b>.</p>
      <div class="notice notice-warn"><span class="notice-icon">⚠</span><div>
        <b>Chưa nhập dữ liệu ORD vào chỉ mục cục bộ.</b> ORD không cung cấp REST API công khai cho trình duyệt; việc ingest cần pipeline protobuf và kiểm tra giấy phép.
        Vì vậy website chỉ liên kết tới công cụ chính thức thay vì hiển thị dữ liệu không kiểm chứng.
      </div></div>
      <div class="link-row">
        ${U.extLink("https://open-reaction-database.org/client/search", "Tìm kiếm trên ORD")}
        ${U.extLink("https://github.com/open-reaction-database/ord-data", "ord-data trên GitHub")}
        ${U.extLink("https://docs.open-reaction-database.org/", "Tài liệu schema")}
        ${U.extLink("https://huggingface.co/datasets?search=open+reaction+database", "Bản mirror trên HuggingFace")}
      </div>
      <ul class="fact-list">
        <li><b>Định dạng:</b> Protocol Buffers (.pb.gz) + JSON schema.</li>
        <li><b>Nội dung mỗi record:</b> reactant, product, điều kiện phản ứng, thiết bị, yield, tham chiếu.</li>
        <li><b>Giấy phép:</b> CC BY-SA 4.0 — nội dung phái sinh phải chia sẻ cùng giấy phép.</li>
        <li><b>Trạng thái trong dự án:</b> liên kết ngoài (xem DATABASE_COVERAGE.md).</li>
      </ul>
    </section>`;
  }

  /* ======================================================================
     Curated reaction detail (legacy library record)
     ====================================================================== */
  V.curatedReaction = {
    title: "Phản ứng",
    render(ctx) {
      const i = Number(ctx.params[0]);
      const r = (root.REACTIONS || [])[i];
      if (!r) return U.emptyState("Không tìm thấy phản ứng", "Chỉ mục không có bản ghi này.", h`<a class="btn" href="#/reactions">Thư viện phản ứng</a>`);
      const cat = (root.RXN_CATS || []).find((c) => c.id === r.c);
      const terms = String(r.e)
        .replace(/[→⇌]|--[^>]*-->/g, " ")
        .split(/[+\s,;]+/)
        .filter((t) => t.length > 2);
      const related = (root.OPEN_COMPOUNDS || []).filter((c) =>
        terms.some((t) => (c.common_name || "").toLowerCase() === t.toLowerCase().replace(/[()]/g, ""))
      );
      const formulas = (String(r.e).match(/(?:[A-Z][a-z]?\d*){2,}/g) || []).slice(0, 6);
      return h`<div class="view-container record-view">
        <header class="record-head">
          <div class="rh-main">
            ${ui.kindBadge("reaction")}
            <h1>${r.t}</h1>
            <p class="rh-sub">${cat ? cat.icon + " " + cat.name : ""} · Bản ghi biên soạn nội bộ</p>
            <div class="rh-actions">
              <a class="btn btn-sm btn-ghost" href="#/reactions">← Thư viện phản ứng</a>
              <a class="btn btn-sm btn-ghost" href="#/search?q=${encodeURIComponent(r.t)}">Tra tài liệu liên quan</a>
            </div>
          </div>
        </header>
        <div class="record-grid">
          <div class="record-main">
            ${ui.section("rxn-eq", "Phương trình", h`<p class="equation-block">${r.e}</p>
              <p class="muted small">Ký hiệu, nhiệt độ và điều kiện được giữ đúng như bản biên soạn. Không bổ sung yield hay điều kiện chưa có nguồn.</p>`)}
            ${ui.section("rxn-note", "Ghi chú thực tế", h`<p>${r.n || "Chưa có ghi chú."}</p>`)}
            ${related.length
              ? ui.section(
                  "rxn-related",
                  "Hợp chất liên quan trong chỉ mục",
                  h`<div class="chip-grid">${related.slice(0, 12).map(
                    (c) => h`<a class="compound-chip" href="#/compounds/${c.compound_cid}">
                      <span class="cc-name">${c.common_name}</span>
                      <span class="cc-formula mono">${c.molecular_formula || ""}</span>
                    </a>`
                  )}</div>`
                )
              : raw("")}
            ${formulas.length
              ? ui.section(
                  "rxn-formulas",
                  "Tính khối lượng mol các chất",
                  h`<div class="table-wrap"><table class="data-table">
                    <thead><tr><th>Công thức</th><th>M (g/mol)</th><th>Ghi chú</th></tr></thead>
                    <tbody>${formulas.map((f) => {
                      try {
                        const p = Sci.tools.parseFormula(f);
                        return h`<tr><td class="mono">${f}</td><td class="num">${U.num(p.molarMass)}</td><td class="small muted">tính bởi công cụ</td></tr>`;
                      } catch (e) {
                        return h`<tr><td class="mono">${f}</td><td>—</td><td class="small muted">không phân tích được</td></tr>`;
                      }
                    })}</tbody></table></div>`
                )
              : raw("")}
          </div>
          <aside class="record-side">
            <div class="side-card">
              <h3>Nguồn</h3>
              <p class="small">Bản ghi biên soạn nội bộ của dự án (không phải dữ liệu ORD/Rhea). Giá trị mang tính giáo dục.</p>
            </div>
            <div class="side-card">
              <h3>Tra cứu mở rộng</h3>
              <ul class="side-list">
                <li>${U.extLink("https://www.rhea-db.org/rhea?query=" + encodeURIComponent(r.t), "Rhea")}</li>
                <li>${U.extLink("https://pubchem.ncbi.nlm.nih.gov/#query=" + encodeURIComponent(terms[0] || r.t), "PubChem")}</li>
                <li>${U.extLink("https://open-reaction-database.org/client/search", "ORD search")}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>`;
    },
  };

  /* ======================================================================
     ORD-style local record detail
     ====================================================================== */
  V.ordReaction = {
    title: "Bản ghi phản ứng",
    render(ctx) {
      const id = decodeURIComponent(ctx.params[0]);
      const r = (root.OPEN_REACTIONS || []).find((x) => x.reaction_id === id);
      if (!r) return U.emptyState("Không tìm thấy bản ghi", "Mã phản ứng " + id + " không có trong bộ dữ liệu nội bộ.", h`<a class="btn" href="#/reactions/explore?tab=local">Danh sách phản ứng</a>`);
      const rows = [];
      (r.reactants || []).forEach((x) => rows.push({ side: "Chất phản ứng", name: x.name, smiles: x.smiles }));
      (r.products || []).forEach((x) => rows.push({ side: "Sản phẩm", name: x.name, smiles: x.smiles }));
      const cond = r.conditions || {};
      return h`<div class="view-container record-view">
        <header class="record-head">
          <div class="rh-main">
            ${ui.kindBadge("reaction")}
            <h1>${(r.reactants || []).map((x) => x.name).join(" + ")} → ${(r.products || []).map((x) => x.name).join(" + ")}</h1>
            <p class="rh-sub mono">${r.reaction_id}${r.type ? " · " + r.type : ""}${r.yield_percent ? " · yield " + r.yield_percent : ""}</p>
            <div class="rh-actions">
              <a class="btn btn-sm btn-ghost" href="#/reactions/explore?tab=local">← Danh sách</a>
              <a class="btn btn-sm btn-ghost" href="#/search?q=${encodeURIComponent((r.reactants && r.reactants[0] && r.reactants[0].name) || r.reaction_id)}">Tra cứu chất tham gia</a>
            </div>
          </div>
        </header>
        <div class="record-grid">
          <div class="record-main">
            ${ui.section(
              "ord-participants",
              "Chất tham gia",
              U.table(
                [
                  { label: "Vai trò", cls: "small", render: (x) => x.side },
                  { label: "Tên", render: (x) => x.name },
                  { label: "SMILES", cls: "mono small", render: (x) => x.smiles || "—" },
                  {
                    label: "Tra cứu",
                    render: (x) =>
                      h`<a class="btn btn-xs" href="#/search?q=${encodeURIComponent(x.name)}">Tra</a>`,
                  },
                ],
                rows
              )
            )}
            ${ui.section(
              "ord-conditions",
              "Điều kiện phản ứng",
              ui.kv([
                ["Nhiệt độ", cond.temperature],
                ["Dung môi", cond.solvent],
                ["Xúc tác", cond.catalyst],
                ["Yield", r.yield_percent],
              ]) || h`<p class="muted">Nguồn không cung cấp điều kiện.</p>`
            )}
          </div>
          <aside class="record-side">
            <div class="side-card">
              <h3>Nguồn &amp; giấy phép</h3>
              <dl class="kv">
                <div class="kv-row"><dt>Bộ dữ liệu</dt><dd>Biên soạn nội bộ (ORD-style schema)</dd></div>
                <div class="kv-row"><dt>Loại</dt><dd>${r.source || "curated"}</dd></div>
                <div class="kv-row"><dt>Giấy phép dữ liệu</dt><dd>Nội bộ, giáo dục</dd></div>
              </dl>
              <p class="small muted">Bản ghi này mô phỏng cấu trúc ORD nhưng không phải dữ liệu từ ORD. Không trích dẫn như nguồn ORD.</p>
            </div>
            <div class="side-card">
              <h3>Kiểm tra nhanh</h3>
              <p class="small muted">Điều kiện và yield do bản biên soạn cung cấp; không kiểm chứng độc lập trong phiên bản này.</p>
            </div>
          </aside>
        </div>
      </div>`;
    },
  };

  /* ======================================================================
     Rhea reaction detail
     ====================================================================== */
  V.rheaReaction = {
    title: "Phản ứng Rhea",
    render() {
      return h`<div class="view-container record-view" id="rheaRecord">${U.spinner("Đang tải phản ứng Rhea…")}</div>`;
    },
    after(ctx) {
      const host = ctx.mount.querySelector("#rheaRecord");
      const id = decodeURIComponent(ctx.params[0]);
      let cancelled = false;
      Sci.adapters.rhea
        .reaction(id)
        .then((rec) => {
          if (cancelled) return;
          host.innerHTML = h`<header class="record-head">
            <div class="rh-main">
              ${ui.kindBadge("reaction")}
              <h1>${rec.identifiers.rhea}</h1>
              <p class="rh-sub">Phản ứng sinh hóa · Rhea</p>
              <div class="rh-actions">
                <a class="btn btn-sm btn-ghost" href="#/reactions/explore?tab=rhea">← Tra Rhea</a>
                ${U.extLink(rec.links.rhea, "Rhea")}
                ${rec.identifiers.ec ? U.extLink("https://www.expasy.org/enzyme/" + rec.identifiers.ec.replace("EC:", ""), "ExPASy ENZYME") : raw("")}
              </div>
            </div>
          </header>
          <div class="record-grid">
            <div class="record-main">
              ${ui.section("rhea-eq", "Phương trình", h`<p class="equation-block">${rec.extra.equation}</p>
                <p class="muted small">Hiển thị nguyên văn từ Rhea. “=” biểu thị phản ứng có thể xảy ra hai chiều hoặc chưa xác định hướng.</p>`)}
              ${ui.section(
                "rhea-parts",
                "Chất tham gia (ChEBI)",
                rec.extra.chebiIds && rec.extra.chebiIds.length
                  ? h`<div class="chip-grid">${rec.extra.chebiIds.map(
                      (cid, i) =>
                        h`<a class="compound-chip" href="#/compounds/chebi-${String(cid).replace(/\D/g, "")}">
                          <span class="cc-name">${(rec.extra.participants || [])[i] || String(cid)}</span>
                          <span class="cc-formula mono">${cid}</span>
                        </a>`
                    )}</div>`
                  : h`<p class="muted">Rhea không trả danh sách ChEBI cho bản ghi này.</p>`
              )}
              ${ui.section(
                "rhea-enzyme",
                "Enzyme liên kết (UniProt)",
                rec.extra.enzymes && rec.extra.enzymes.length
                  ? h`<ul class="link-list">${rec.extra.enzymes.slice(0, 20).map((acc) =>
                      h`<li><a href="#/biochem/protein/${encodeURIComponent(acc)}">${acc}</a>
                        ${U.extLink("https://www.uniprot.org/uniprotkb/" + acc + "/entry", "UniProt")}</li>`
                    )}</ul>`
                  : h`<p class="muted">Chưa có enzyme được curate cho phản ứng này.</p>`
              )}
              ${ui.section(
                "rhea-pubmed",
                "Tham chiếu PubMed",
                rec.extra.pubmed && rec.extra.pubmed.length
                  ? h`<ul class="link-list">${rec.extra.pubmed.slice(0, 15).map(
                      (pmid) => h`<li><a href="#/literature/pmid/${pmid}">PMID ${pmid}</a> ${U.extLink("https://pubmed.ncbi.nlm.nih.gov/" + pmid + "/", "PubMed")}</li>`
                    )}</ul>`
                  : h`<p class="muted">Không có tham chiếu PubMed trong bản ghi.</p>`
              )}
            </div>
            <aside class="record-side">
              <div class="side-card"><h3>Provenance</h3><div id="rheaProv"></div></div>
              <div class="side-card"><h3>Giấy phép</h3><p class="small">Rhea · CC BY 4.0 · SIB / EMBL-EBI</p></div>
            </aside>
          </div>`;
          host.querySelector("#rheaProv").innerHTML = ui.provenanceBlock(rec);
        })
        .catch((err) => {
          if (cancelled) return;
          host.innerHTML = U.errorBox(err, {
            hint: "Rhea có thể đang bảo trì. Thử lại hoặc mở trực tiếp trên rhea-db.org.",
            retry: true,
          });
        });
      ctx.cleanup(() => (cancelled = true));
    },
  };

  /* ======================================================================
     Materials
     ====================================================================== */
  V.materialRecord = {
    title: "Vật liệu",
    render(ctx) {
      const id = ctx.params[0];
      const m = (root.MATERIALS || []).find((x) => x.id === id);
      if (!m) return U.emptyState("Không tìm thấy vật liệu", "Mã vật liệu không tồn tại trong bảo tàng.", h`<a class="btn" href="#/materials">Bảo tàng vật liệu</a>`);
      const cat = (root.MAT_CATS || []).find((c) => c.id === m.cat);
      const formulaMatch = String(m.name).match(/[A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)+/);
      const formula = formulaMatch ? formulaMatch[0] : null;
      const elements = formula ? Sci.tools.elementsInFormula(formula) : [];
      const relatedCompounds = (root.OPEN_COMPOUNDS || []).filter((c) => {
        const f = c.molecular_formula || "";
        return formula ? f === formula : false;
      });
      return h`<div class="view-container record-view">
        <header class="record-head">
          <div class="rh-main">
            ${ui.kindBadge("material")}
            <h1>${m.icon || ""} ${m.name}</h1>
            <p class="rh-sub">${m.sub || ""}${cat ? " · " + cat.name : ""}</p>
            <div class="rh-actions">
              <a class="btn btn-sm btn-ghost" href="#/materials">← Bảo tàng</a>
              ${formula ? h`<a class="btn btn-sm" href="#/materials/live?formula=${encodeURIComponent(formula)}">Tra dữ liệu vật liệu cho ${formula}</a>` : raw("")}
            </div>
          </div>
        </header>
        <div class="record-grid">
          <div class="record-main">
            ${ui.section("mat-facts", "Điểm chính", h`<div class="fat-grid">${(m.facts || []).map(
              (f) => h`<div class="fat-card">${f}</div>`
            )}</div>`)}
            ${ui.section("mat-content", "Nội dung", U.raw(m.content || ""))}
            ${ui.section(
              "mat-elements",
              "Nguyên tố & hợp chất liên quan",
              h`<div class="chip-grid">${elements.map(
                (sym) => {
                  const el = (root.ELEMENTS || []).find((e) => e.sym === sym);
                  return el ? h`<a class="compound-chip" href="#/elements/${el.z}"><span class="cc-name">${el.name}</span><span class="cc-formula mono">${sym}</span></a>` : raw("");
                }
              )}${relatedCompounds.map(
                (c) => h`<a class="compound-chip" href="#/compounds/${c.compound_cid}"><span class="cc-name">${c.common_name}</span><span class="cc-formula mono">${c.molecular_formula}</span></a>`
              )}</div>
              ${!elements.length && !relatedCompounds.length ? h`<p class="muted">Không xác định được công thức hóa học từ tên vật liệu — không tự suy đoán thành phần.</p>` : raw("")}`
            )}
          </div>
          <aside class="record-side">
            <div class="side-card">
              <h3>Nguồn dữ liệu</h3>
              <p class="small">Nội dung biên soạn nội bộ của dự án, mang tính giáo dục. Không phải dữ liệu đo lường từ phòng thí nghiệm.</p>
            </div>
            <div class="side-card">
              <h3>Tra cứu cấu trúc</h3>
              <ul class="side-list">
                ${formula ? h`<li>${U.extLink("https://www.crystallography.net/cod/result.php?formula=" + encodeURIComponent(formula), "COD (CIF)")}</li>` : raw("")}
                <li>${U.extLink("https://next-gen.materialsproject.org/", "Materials Project")}</li>
                <li>${U.extLink("https://nomad-lab.eu/prod/v1/gui/search/entries", "NOMAD")}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>`;
    },
  };

  V.materialsLive = {
    title: "Dữ liệu vật liệu trực tiếp",
    render(ctx) {
      const formula = ctx.query.get("formula") || "";
      const mp = Sci.config.configured().mpKey;
      return h`<div class="view-container">
        ${U.sectionHead(
          "Materials Science · Live",
          "Dữ liệu vật liệu trực tiếp",
          "NOMAD (CC BY 4.0) truy vấn được ngay; Materials Project cần API key miễn phí; COD/ORD/AFLOW chỉ liên kết do giới hạn API hoặc giấy phép."
        )}
        <div class="panel-grid">
          <section class="panel">
            <h2>NOMAD · tính toán DFT</h2>
            <form class="inline-search" id="nomadForm">
              <input name="formula" value="${formula}" placeholder="Công thức Hill, ví dụ: LiFePO4" aria-label="Công thức cho NOMAD" />
              <button class="btn btn-sm" type="submit">Tra NOMAD</button>
            </form>
            <div id="nomadOut" class="mt-sm"></div>
          </section>
          <section class="panel">
            <h2>Materials Project</h2>
            ${mp
              ? h`<form class="inline-search" id="mpForm">
                  <input name="formula" value="${formula}" placeholder="Ví dụ: Si, LiFePO4" aria-label="Công thức cho Materials Project" />
                  <button class="btn btn-sm" type="submit">Tra MP</button>
                </form>
                <div id="mpOut" class="mt-sm"></div>`
              : h`<p class="muted small">Chưa cấu hình API key (miễn phí).</p>
                  <div class="link-row">
                    <a class="btn btn-sm" href="#/settings">Cấu hình key</a>
                    ${U.extLink("https://materialsproject.org/", "Đăng ký Materials Project")}
                  </div>`}
          </section>
          <section class="panel">
            <h2>RCSB PDB · cấu trúc 3D</h2>
            <form class="inline-search" id="pdbForm">
              <input name="pdb" placeholder="PDB ID, ví dụ 1A2B" aria-label="PDB ID" />
              <button class="btn btn-sm" type="submit">Tra PDB</button>
            </form>
            <div id="pdbOut" class="mt-sm"></div>
          </section>
          <section class="panel">
            <h2>Crystallography Open Database</h2>
            <p class="small">COD cung cấp hơn 500.000 cấu trúc tinh thể (CC0) nhưng không có JSON API ổn định cho trình duyệt. Dùng tìm kiếm chính thức:</p>
            <div class="link-row">
              ${U.extLink("https://www.crystallography.net/cod/result.php" + (formula ? "?formula=" + encodeURIComponent(formula) : ""), "Tìm cấu trúc COD")}
              ${U.extLink("https://www.crystallography.net/cod/", "Trang COD")}
            </div>
          </section>
          <section class="panel">
            <h2>AFLOW</h2>
            <p class="small">AFLOW giới hạn sử dụng cho mục đích khoa học/học thuật phi thương mại, nên dự án <b>không nhập dữ liệu</b>. Liên kết tham khảo:</p>
            <div class="link-row">${U.extLink("https://aflow.org/", "AFLOW")}${U.extLink("https://aflow.org/API/aflux/", "AFLUX API")}</div>
          </section>
        </div>
      </div>`;
    },
    after(ctx) {
      const nomadForm = ctx.mount.querySelector("#nomadForm");
      const out = ctx.mount.querySelector("#nomadOut");
      let cancelled = false;
      ctx.cleanup(() => (cancelled = true));

      async function runNomad(formula) {
        out.innerHTML = U.spinner("Đang truy vấn NOMAD (có thể mất vài giây)…");
        try {
          const rows = await Sci.adapters.nomad.search(formula, { max: 8 });
          if (cancelled) return;
          out.innerHTML = rows.length
            ? h`<div class="table-wrap"><table class="data-table">
                <thead><tr><th>Công thức</th><th>Space group</th><th>Band gap</th><th>Cell volume</th><th>Entry</th></tr></thead>
                <tbody>${rows.map(
                  (r) => h`<tr>
                    <td class="mono">${r.formula}</td>
                    <td class="small">${r.spaceGroup || "—"}</td>
                    <td>${r.bandGap != null ? U.num(r.bandGap) + " " + (r.bandGapUnit || "") : "—"}</td>
                    <td>${r.cellVolume ? U.num(r.cellVolume) + " Å³" : "—"}</td>
                    <td class="mono small">${U.extLink("https://nomad-lab.eu/prod/v1/gui/search/entries?entryId=" + r.entry_id, U.idShort(r.entry_id, 14))}</td>
                  </tr>`
                )}</tbody></table></div>
              <p class="muted small">NOMAD · CC BY 4.0. Giá trị là kết quả tính toán, không phải đo thực nghiệm.</p>`
            : U.emptyState("NOMAD không trả kết quả", "Thử công thức Hill khác (ví dụ: LiFePO4, TiO2) hoặc bỏ trống để xem entry mới nhất.");
        } catch (e) {
          if (!cancelled) out.innerHTML = U.errorBox(e, { hint: "NOMAD query có thể cần thời gian; thử lại sau." });
        }
      }
      nomadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        runNomad(new FormData(nomadForm).get("formula").trim());
      });
      if (ctx.query.get("formula")) runNomad(ctx.query.get("formula"));
      else out.innerHTML = h`<p class="muted small">Nhập công thức để tra entry tính toán mới nhất.</p>`;

      const mpForm = ctx.mount.querySelector("#mpForm");
      if (mpForm) {
        const mpOut = ctx.mount.querySelector("#mpOut");
        mpForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const f = new FormData(mpForm).get("formula").trim();
          mpOut.innerHTML = U.spinner("Đang truy vấn Materials Project…");
          try {
            const rows = await Sci.adapters.materialsproject.search(f, { max: 8 });
            mpOut.innerHTML = rows.length
              ? h`<div class="table-wrap"><table class="data-table">
                  <thead><tr><th>ID</th><th>Công thức</th><th>E_form</th><th>E above hull</th><th>Band gap</th></tr></thead>
                  <tbody>${rows.map(
                    (m) => h`<tr>
                      <td class="mono">${U.extLink("https://next-gen.materialsproject.org/materials/" + m.material_id, m.material_id)}</td>
                      <td class="mono">${m.formula_pretty}</td>
                      <td>${m.formation_energy_per_atom != null ? U.num(m.formation_energy_per_atom) : "—"}</td>
                      <td>${m.energy_above_hull != null ? U.num(m.energy_above_hull) : "—"}</td>
                      <td>${m.band_gap != null ? U.num(m.band_gap) + " eV" : "—"}</td>
                    </tr>`
                  )}</tbody></table></div>
                <p class="muted small">Materials Project · CC BY 4.0. Giá trị DFT, không phải đo thực nghiệm.</p>`
              : U.emptyState("Không có vật liệu khớp", "Thử công thức khác.");
          } catch (err) {
            mpOut.innerHTML = U.errorBox(err, { hint: err.code === "key-required" ? "Cần API key miễn phí trong Cấu hình." : "" });
          }
        });
      }

      const pdbForm = ctx.mount.querySelector("#pdbForm");
      const pdbOut = ctx.mount.querySelector("#pdbOut");
      pdbForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = new FormData(pdbForm).get("pdb").trim();
        if (!id) return;
        pdbOut.innerHTML = U.spinner("Đang tải PDB " + id.toUpperCase() + "…");
        try {
          const rec = await Sci.adapters.rcsb.entry(id);
          pdbOut.innerHTML = h`<div class="mini-record">
            <h3>${rec.title}</h3>
            <p class="small">${rec.subtitle}</p>
            ${ui.propertiesBlock(rec, { limit: 8 })}
            <div class="link-row">
              ${U.extLink("https://www.rcsb.org/structure/" + rec.identifiers.pdb, "RCSB entry")}
              ${U.extLink("https://www.rcsb.org/3d-view/" + rec.identifiers.pdb, "Trình xem 3D")}
            </div>
          </div>`;
        } catch (err) {
          pdbOut.innerHTML = U.errorBox(err, { hint: "Kiểm tra mã PDB (4 ký tự)." });
        }
      });
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
