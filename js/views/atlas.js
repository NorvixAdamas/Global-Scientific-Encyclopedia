/* =========================================================================
   Scientific Atlas (home), topic landing pages and learning library
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const ui = Sci.ui;
  const V = (Sci.views = Sci.views || {});

  const HERO_SOURCES = ["pubchem", "chebi", "chembl", "rhea", "uniprot", "openfda", "rxnorm", "nomad", "rcsb-pdb", "europe-pmc", "pubmed", "crossref"];

  function featuredCompounds() {
    const wanted = ["2244", "2519", "3672", "1983", "702", "1176"];
    const list = root.OPEN_COMPOUNDS || [];
    return wanted
      .map((cid) => list.find((c) => String(c.compound_cid) === cid))
      .filter(Boolean)
      .map((c) => ({
        cid: c.compound_cid,
        name: c.common_name,
        formula: c.molecular_formula,
        mw: c.molecular_weight,
      }));
  }

  function stats() {
    const local = Sci.search.localCounts();
    const reg = Sci.registry.stats();
    const g = Sci.graph.build().stats;
    return {
      localDocs: local.total,
      sourcesTotal: reg.total,
      sourcesLive: reg.live + reg.liveKey,
      sourcesFree: reg.total - reg.rejected,
      graphNodes: g.nodes,
      graphEdges: g.edges,
      elements: (root.ELEMENTS || []).length,
      reactions: (root.REACTIONS || []).length,
      materials: (root.MATERIALS || []).length,
      compounds: (root.OPEN_COMPOUNDS || []).length,
      dbReactions: (root.OPEN_REACTIONS || []).length,
      drugs: (root.OPEN_DRUGS || []).length + (root.DRUGS || []).length,
    };
  }

  function heroSection() {
    return h`<section class="atlas-hero">
      <div class="atlas-hero-bg" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="atlas-hero-inner">
        <p class="eyebrow">Global Scientific Encyclopedia · V2.0</p>
        <h1>Một hệ tri thức <span class="grad-text">hóa học, vật liệu &amp; dược học</span> có thể kiểm chứng</h1>
        <p class="atlas-lede">
          Tra cứu nguyên tố, hợp chất, phản ứng, vật liệu, protein và công bố khoa học trên một chỉ mục thống nhất —
          kết nối dữ liệu đã biên soạn với các nguồn mở quốc tế đang truy vấn trực tiếp.
        </p>
        <div class="hero-search" id="heroSearch"></div>
        <div class="hero-examples">
          <span class="muted small">Thử:</span>
          ${["aspirin", "graphene", "InChIKey=BSYNRYMUTXBXSQ-UHFFFAOYSA-N", "RHEA:11752", "10.1038/nature14539"]
            .map(
              (q) =>
                h`<a class="example-chip" href="#/search?q=${encodeURIComponent(q.replace("InChIKey=", ""))}">${q}</a>`
            )
            .reduce((a, b) => h`${a}${b}`, raw(""))}
        </div>
        <div class="hero-stats" id="heroStats"></div>
      </div>
    </section>`;
  }

  function tiersSection(s) {
    return h`<section class="atlas-block">
      <div class="block-head">
        <h2>Ba tầng dữ liệu — luôn phân biệt rõ</h2>
        <p>Mỗi con số trên website đều thuộc một trong ba tầng dưới đây. Không có bản ghi nào được tạo ra để lấp chỗ trống.</p>
      </div>
      <div class="tier-grid">
        <article class="tier-card">
          <span class="tier-num">1</span>
          <h3>Chỉ mục cục bộ</h3>
          <p class="tier-value">${U.num(s.localDocs)} bản ghi</p>
          <p>Dữ liệu biên soạn đi kèm website (nguyên tố, phản ứng, vật liệu, ghi chú dược lý) và bản ghi tham chiếu PubChem đã lưu sẵn. Tìm kiếm tức thời, không cần mạng.</p>
        </article>
        <article class="tier-card">
          <span class="tier-num">2</span>
          <h3>Truy vấn trực tiếp</h3>
          <p class="tier-value">${s.sourcesLive} nguồn</p>
          <p>PubChem, ChEBI, ChEMBL, Rhea, UniProt, Reactome, openFDA, RxNav, NOMAD, RCSB, Europe PMC, PubMed, Crossref. Kết quả hiển thị kèm nguồn và thời điểm truy vấn.</p>
        </article>
        <article class="tier-card">
          <span class="tier-num">3</span>
          <h3>Liên kết ngoài</h3>
          <p class="tier-value">${Sci.registry.list({ status: "external" }).length + Sci.registry.list({ status: "bulk" }).length} nguồn</p>
          <p>Nguồn cần tải bulk, cần key riêng hoặc có điều kiện tái sử dụng (ORD, COD, AFLOW, NIST, EPA CompTox…). Website chỉ liên kết, không nhập dữ liệu.</p>
        </article>
      </div>
    </section>`;
  }

  function domainsSection() {
    return h`<section class="atlas-block">
      <div class="block-head">
        <h2>24 khu vực tri thức</h2>
        <p>Điều hướng theo lĩnh vực. Mỗi khu vực có trang giới thiệu, bản ghi liên quan và điểm tra cứu trực tiếp.</p>
      </div>
      ${Sci.nav.GROUPS.filter((g) => g.id !== "atlas")
        .map(
          (g) => h`<div class="domain-group">
            <h3 class="domain-group-title">${g.label}</h3>
            <div class="domain-grid">${g.items.map(
              (it) => h`<a class="domain-card" href="${it.route}">
                <span class="domain-icon" aria-hidden="true">${it.icon}</span>
                <span class="domain-body">
                  <span class="domain-label">${it.label}</span>
                  <span class="domain-vi">${it.vi}</span>
                  <span class="domain-desc">${it.desc}</span>
                </span>
              </a>`
            )}</div>
          </div>`
        )
        .reduce((a, b) => h`${a}${b}`, raw(""))}
    </section>`;
  }

  function featuredSection() {
    const compounds = featuredCompounds();
    const rxns = (root.REACTIONS || []).slice(0, 3);
    const mats = (root.MATERIALS || []).filter((m) => ["graphene", "mxene", "quantum-dot"].includes(m.id));
    return h`<section class="atlas-block">
      <div class="block-head">
        <h2>Bản ghi tiêu biểu</h2>
        <p>Mở một bản ghi để xem cấu trúc, tính chất, định danh chéo, phản ứng liên quan và nguồn dữ liệu.</p>
      </div>
      <div class="feature-grid">
        <div class="feature-col">
          <h3 class="feature-title">Hợp chất <a class="mini-link" href="#/compounds">xem tất cả →</a></h3>
          <ul class="feature-list">${compounds.map(
            (c) => h`<li><a href="#/compounds/${c.cid}">
              <span class="fl-name">${c.name}</span>
              <span class="fl-meta">${c.formula || ""}${c.mw ? " · " + U.num(c.mw) + " g/mol" : ""}</span>
              <span class="fl-id mono">CID ${c.cid}</span>
            </a></li>`
          )}</ul>
        </div>
        <div class="feature-col">
          <h3 class="feature-title">Phản ứng <a class="mini-link" href="#/reactions">thư viện →</a></h3>
          <ul class="feature-list">${rxns.map(
            (r, i) => h`<li><a href="#/reactions/i/${i}">
              <span class="fl-name">${r.t}</span>
              <span class="fl-eq mono">${r.e}</span>
            </a></li>`
          )}</ul>
        </div>
        <div class="feature-col">
          <h3 class="feature-title">Vật liệu <a class="mini-link" href="#/materials">bảo tàng →</a></h3>
          <ul class="feature-list">${mats.map(
            (m) => h`<li><a href="#/materials/${m.id}">
              <span class="fl-name">${m.icon} ${m.name}</span>
              <span class="fl-meta">${m.sub}</span>
            </a></li>`
          )}</ul>
        </div>
      </div>
    </section>`;
  }

  function sourcesStrip() {
    return h`<section class="atlas-block">
      <div class="block-head">
        <h2>Nguồn mở đang kết nối</h2>
        <p>Tất cả đều miễn phí. Không có API trả phí, không có dataset độc quyền trong chỉ mục lõi.</p>
      </div>
      <div class="source-strip">${HERO_SOURCES.map((id) => {
        const s = Sci.registry.byId[id];
        if (!s) return raw("");
        return h`<a class="source-chip" href="#/sources?q=${encodeURIComponent(s.name)}" title="${s.license}">
          <span class="sc-name">${s.name}</span>
          <span class="sc-license">${s.license}</span>
        </a>`;
      })}</div>
      <p class="small muted">
        Giấy phép và điều kiện tái sử dụng của từng nguồn được ghi tại
        <a href="#/sources">Nguồn dữ liệu mở</a>. Nguồn bị loại trừ (trả phí hoặc không cho tái phân phối) được liệt kê minh bạch.
      </p>
    </section>`;
  }

  function methodSection() {
    return h`<section class="atlas-block method-block">
      <div class="block-head">
        <h2>Nguyên tắc khoa học &amp; dữ liệu</h2>
      </div>
      <div class="method-grid">
        ${[
          ["Không bịa dữ liệu", "Không có phản ứng, yield, cơ chế hay con số nào được tạo ra khi nguồn không cung cấp. Trường trống được ghi rõ là chưa có."],
          ["Provenance bắt buộc", "Mỗi giá trị giữ nguồn, record ID, giấy phép, loại dữ liệu (thực nghiệm/tính toán/curated) và thời điểm truy vấn."],
          ["Không hợp nhất mù", "Hai chất chỉ được coi là một khi khớp định danh mạnh (InChIKey, CID, ChEBI, ChEMBL). Tên giống nhau không đủ."],
          ["Xung đột được giữ lại", "Khi các nguồn báo giá trị khác nhau, chúng được hiển thị song song — không trung bình hóa, không chọn ngầm."],
          ["Không thay thế chuyên gia", "Thông tin an toàn, dược lý và lâm sàng chỉ mang tính tham khảo; không dùng để tự điều trị hay xử lý cấp cứu."],
        ]
          .map(
            (x) => h`<article class="method-card"><h3>${x[0]}</h3><p>${x[1]}</p></article>`
          )}
      </div>
    </section>`;
  }

  V.atlas = {
    title: "Scientific Atlas — Bản đồ khoa học",
    render() {
      const s = stats();
      return h`${heroSection()}
        <div class="view-container">
          ${tiersSection(s)}
          ${domainsSection()}
          ${featuredSection()}
          ${sourcesStrip()}
          ${methodSection()}
        </div>`;
    },
    after(ctx) {
      const mount = ctx.mount.querySelector("#heroSearch");
      if (mount) Sci.searchBox.create(mount, { placeholder: "Tìm hợp chất, CID, InChIKey, DOI, SMILES, protein…" });
      const s = stats();
      const statsEl = ctx.mount.querySelector("#heroStats");
      statsEl.innerHTML = h`${[
        ["bản ghi cục bộ", s.localDocs],
        ["nguồn dữ liệu", s.sourcesTotal],
        ["đang truy vấn trực tiếp", s.sourcesLive],
        ["nút đồ thị tri thức", s.graphNodes],
        ["cạnh quan hệ", s.graphEdges],
      ]
        .map(
          (x) => h`<span class="hero-stat"><b>${U.num(x[1])}</b><span>${x[0]}</span></span>`
        )}`;
    },
  };

  /* ======================================================================
     Topic landing pages
     ====================================================================== */
  function topicBySlug(slug) {
    return (root.SCI_TOPICS || []).find((t) => t.slug === slug) || null;
  }

  V.topic = {
    title: "Chủ đề",
    render(ctx) {
      const slug = ctx.params[0];
      const t = topicBySlug(slug);
      if (!t) return U.emptyState("Không tìm thấy chủ đề", "Đường dẫn không tồn tại trong chỉ mục chủ đề.", h`<a class="btn" href="#/">Về bản đồ khoa học</a>`);
      const related = Sci.nav.ALL.find((n) => n.route === "#/topics/" + slug);
      const preset = t.presets && t.presets[0];
      return h`<div class="view-container topic-view">
        ${U.sectionHead(
          t.eyebrow || "Chủ đề",
          h`${t.icon || ""} ${t.title}`,
          t.summary,
          related ? h`<a class="btn btn-sm" href="#/search?q=${encodeURIComponent(preset || t.title)}">Tra cứu trực tiếp</a>` : raw("")
        )}
        <div class="topic-layout">
          <div class="topic-main">
            <section class="record-section">
              <h2>Khái niệm cốt lõi</h2>
              <div class="concept-grid">${(t.concepts || []).map(
                (c) => h`<article class="concept-card"><h3>${c.title}</h3><p>${c.text}</p></article>`
              )}</div>
            </section>
            <section class="record-section">
              <h2>Câu hỏi nghiên cứu mở</h2>
              <ul class="question-list">${(t.questions || []).map((q) => h`<li>${q}</li>`)}</ul>
            </section>
            <section class="record-section">
              <div class="rs-head"><h2>Bản ghi liên quan</h2>
                <div class="rs-aside">${(t.presets || []).map(
                  (p, i) => h`<button class="mini-tab ${i === 0 ? "active" : ""}" data-preset="${p}">${p}</button>`
                )}</div>
              </div>
              <div id="topicResults">${U.spinner("Đang tìm trong chỉ mục cục bộ…")}</div>
              <div id="topicLive"></div>
            </section>
          </div>
          <aside class="topic-side">
            <div class="side-card">
              <h3>Nguồn dữ liệu</h3>
              <ul class="side-list">${(t.sources || []).map((id) => {
                const s = Sci.registry.byId[id];
                if (!s) return raw("");
                return h`<li><a href="#/sources?q=${encodeURIComponent(s.name)}">${s.name}</a>${ui.statusBadge(s.status)}</li>`;
              })}</ul>
            </div>
            <div class="side-card">
              <h3>Công cụ</h3>
              <ul class="side-list">${(t.tools || []).map((tool) => h`<li><a href="${tool.route}">${tool.label} →</a></li>`)}</ul>
            </div>
            <div class="side-card">
              <h3>Nguyên tắc</h3>
              <p class="small muted">Trang chủ đề là phần dẫn nhập khái niệm. Số liệu cụ thể chỉ hiển thị khi có nguồn tương ứng — không suy diễn từ kiến thức chung.</p>
            </div>
          </aside>
        </div>
      </div>`;
    },
    after(ctx) {
      const t = topicBySlug(ctx.params[0]);
      if (!t) return;
      const resultsEl = ctx.mount.querySelector("#topicResults");
      const liveEl = ctx.mount.querySelector("#topicLive");
      const tabs = Array.from(ctx.mount.querySelectorAll("[data-preset]"));
      let seq = 0;

      async function show(preset) {
        const mySeq = ++seq;
        const local = Sci.search.local(preset, { limit: 6 });
        if (mySeq !== seq) return;
        resultsEl.innerHTML = local.results.length
          ? h`<div class="result-list compact">${local.results.map(resultRow)}</div>`
          : U.emptyState("Không có bản ghi cục bộ", "Thử tra cứu trực tiếp các nguồn mở bên dưới.");
        liveEl.innerHTML = h`<div class="block-head small-head"><h3>Kết quả trực tiếp</h3><p class="muted small">Truy vấn nguồn mở cho “${preset}”.</p></div>
          <div id="topicLiveBody">${U.spinner()}</div>`;
        const body = liveEl.querySelector("#topicLiveBody");
        try {
          const r = await Sci.search.remote(preset, {
            kinds: null,
            onUpdate: (upd, all) => {
              if (mySeq !== seq) return;
              body.innerHTML = renderLiveGroups(all);
            },
          });
          if (mySeq !== seq) return;
          body.innerHTML = renderLiveGroups(r.sources);
        } catch (e) {
          if (mySeq === seq) body.innerHTML = U.errorBox(e, { hint: "Có thể thử lại sau." });
        }
      }

      tabs.forEach((btn) =>
        btn.addEventListener("click", () => {
          tabs.forEach((b) => b.classList.toggle("active", b === btn));
          show(btn.dataset.preset);
        })
      );
      if (t.presets && t.presets[0]) show(t.presets[0]);
    },
  };

  function resultRow(r) {
    return h`<a class="result-row" href="${r.route}">
      <span class="rr-kind">${Sci.search.kindLabel(r.kind)}</span>
      <span class="rr-body">
        <span class="rr-title">${r.title}</span>
        ${r.subtitle ? h`<span class="rr-sub">${r.subtitle}</span>` : raw("")}
        <span class="rr-why">${r.why}</span>
      </span>
      <span class="rr-source">${ui.sourceName(r.source)}</span>
    </a>`;
  }

  function renderLiveGroups(sources) {
    const groups = sources
      .filter((s) => s.status === "ok" && s.results.length)
      .map(
        (s) => h`<div class="live-group">
          <div class="lg-head"><span>${s.label}</span><span class="muted small">${s.results.length} kết quả</span></div>
          <div class="result-list compact">${s.results.slice(0, 4).map(resultRow)}</div>
        </div>`
      );
    return groups.length ? groups : h`<p class="muted small">Không có kết quả trực tiếp cho truy vấn này.</p>`;
  }

  /* ======================================================================
     Learning library
     ====================================================================== */
  V.learn = {
    title: "Thư viện học tập",
    render() {
      const tracks = [
        {
          title: "Nền tảng phổ thông",
          items: [
            ["Bảng tuần hoàn & tính chất", "#/elements"],
            ["Định luật, hằng số, dãy hoạt động", "#/knowledge"],
            ["Phản ứng cơ bản & bài tập cân bằng", "#/reactions"],
            ["Công cụ tính khối lượng mol", "#/tools?tab=formula"],
          ],
        },
        {
          title: "Đại học & chuyên ngành",
          items: [
            ["Hóa hữu cơ: cơ chế & lập thể", "#/topics/organic"],
            ["Hóa lý: nhiệt động & động học", "#/topics/physical"],
            ["Hóa phân tích: sắc ký & phổ", "#/topics/analytical"],
            ["Dược lý nền tảng", "#/pharma/clinical"],
          ],
        },
        {
          title: "Nghiên cứu & chuyên sâu",
          items: [
            ["Tầng chuyên sâu: bài báo & bài toán mở", "#/research"],
            ["Vật liệu tiên tiến & tinh thể học", "#/materials"],
            ["Khoa học tính toán", "#/topics/computational"],
            ["Tài liệu khoa học & DOI", "#/literature"],
          ],
        },
      ];
      return h`<div class="view-container">
        ${U.sectionHead("Learning Library", "Thư viện học tập", "Lộ trình từ nền tảng đến nghiên cứu, kèm công cụ và bản ghi thật để luyện tập.")}
        <div class="track-grid">${tracks.map(
          (t) => h`<article class="track-card"><h2>${t.title}</h2><ul class="track-list">${t.items.map(
            (i) => h`<li><a href="${i[1]}">${i[0]} <span aria-hidden="true">→</span></a></li>`
          )}</ul></article>`
        )}</div>
        <section class="record-section">
          <h2>Chủ đề khoa học</h2>
          <div class="domain-grid">${(root.SCI_TOPICS || []).map(
            (t) => h`<a class="domain-card slim" href="#/topics/${t.slug}">
              <span class="domain-icon" aria-hidden="true">${t.icon || "◆"}</span>
              <span class="domain-body"><span class="domain-label">${t.title}</span><span class="domain-desc">${U.truncate(t.summary, 110)}</span></span>
            </a>`
          )}</div>
        </section>
        <section class="record-section">
          <h2>Kho kiến thức biên soạn</h2>
          <p>Toàn bộ bảng tra cứu gốc (nhóm chức, định luật, hằng số, lịch sử, Nobel, thuật ngữ, giáo trình) vẫn được giữ nguyên trong thư viện.</p>
          <div class="link-row">
            <a class="btn" href="#/knowledge">Mở kho kiến thức →</a>
            <a class="btn btn-ghost" href="#/research">Tầng chuyên sâu →</a>
            <a class="btn btn-ghost" href="#/pharma/clinical">Góc y dược lâm sàng →</a>
          </div>
        </section>
      </div>`;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
