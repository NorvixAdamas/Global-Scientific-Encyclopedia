/* =========================================================================
   Application shell: header, hash router, legacy mounting, search dialog
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = root.Sci;
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;

  const SITE = "Global Scientific Encyclopedia";

  /* ---------------------------------------------------------------------
     Routes. Order matters: more specific patterns first.
     `legacy` renders the preserved v1 section instead of a V2 view.
     --------------------------------------------------------------------- */
  const ROUTES = [
    { re: /^$/, view: "atlas" },
    { re: /^search$/, view: "search" },
    { re: /^sources$/, view: "sources" },
    { re: /^graph$/, view: "graph" },
    { re: /^tools$/, view: "tools" },
    { re: /^learn$/, view: "learn" },
    { re: /^settings$/, view: "settings" },
    { re: /^topics\/([^/]+)$/, view: "topic" },
    { re: /^elements$/, legacy: "tuan-hoan", title: "Nguyên tố hóa học" },
    { re: /^elements\/(\d+)$/, view: "elementRecord" },
    { re: /^compounds$/, view: "compounds" },
    { re: /^compounds\/([^/]+)$/, view: "compoundRecord" },
    { re: /^reactions$/, legacy: "phan-ung", title: "Phản ứng hóa học" },
    { re: /^reactions\/explore$/, view: "reactionsExplore" },
    { re: /^reactions\/i\/(\d+)$/, view: "curatedReaction" },
    { re: /^reactions\/ord\/(.+)$/, view: "ordReaction" },
    { re: /^reactions\/rhea\/([^/]+)$/, view: "rheaReaction" },
    { re: /^materials$/, legacy: "vat-lieu-moi", title: "Khoa học vật liệu" },
    { re: /^materials\/live$/, view: "materialsLive" },
    { re: /^materials\/([^/]+)$/, view: "materialRecord" },
    { re: /^pharma$/, view: "pharma" },
    { re: /^pharma\/clinical$/, legacy: "y-duoc", title: "Y dược lâm sàng" },
    { re: /^pharma\/drug\/(.+)$/, view: "drugRecord" },
    { re: /^biochem$/, view: "biochem" },
    { re: /^biochem\/protein\/([^/]+)$/, view: "proteinRecord" },
    { re: /^biochem\/pathway\/([^/]+)$/, view: "pathwayRecord" },
    { re: /^literature$/, view: "literature" },
    { re: /^literature\/(doi|pmid)\/(.+)$/, view: "publicationRecord" },
    { re: /^knowledge$/, legacy: "kien-thuc", title: "Thư viện kiến thức" },
    { re: /^research$/, legacy: "chuyen-sau", title: "Nghiên cứu chuyên sâu" },
    { re: /^data$/, legacy: "du-lieu-mo", title: "Dữ liệu mở" },
  ];

  /* Old v1 anchors → canonical V2 routes (so bookmarks keep working). */
  const LEGACY_ALIAS = {
    "tuan-hoan": "#/elements",
    "phan-ung": "#/reactions",
    "vat-lieu-moi": "#/materials",
    "y-duoc": "#/pharma/clinical",
    "chuyen-sau": "#/research",
    "du-lieu-mo": "#/data",
    "kien-thuc": "#/knowledge",
    top: "#/",
  };

  const LEGACY_TITLES = {
    "tuan-hoan": "Nguyên tố hóa học",
    "phan-ung": "Phản ứng hóa học",
    "vat-lieu-moi": "Khoa học vật liệu",
    "y-duoc": "Y dược lâm sàng",
    "chuyen-sau": "Nghiên cứu chuyên sâu",
    "du-lieu-mo": "Dữ liệu mở",
    "kien-thuc": "Thư viện kiến thức",
  };

  let viewRoot = null;
  let legacyRoot = null;
  let legacySections = [];
  let cleanups = [];
  let searchOverlay = null;
  let current = "";

  /* ---------------------------------------------------------------------
     Theme
     --------------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* storage may be blocked */
    }
    const btn = document.getElementById("themeToggleV2");
    if (btn) {
      const dark = theme === "dark";
      btn.setAttribute("aria-label", dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.innerHTML = dark ? "☀" : "◐";
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0f14" : "#f6f8f7");
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (e) {
      /* ignore */
    }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
  }

  function toggleTheme() {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  }

  /* ---------------------------------------------------------------------
     Header + footer
     --------------------------------------------------------------------- */
  function navGroupMarkup(group) {
    if (group.items.length === 1) {
      const it = group.items[0];
      return h`<a class="nav-single" href="${it.route}" title="${it.vi}"><span aria-hidden="true">${it.icon}</span> ${it.vi}</a>`;
    }
    return h`<div class="nav-group">
      <button class="nav-group-btn" type="button" aria-expanded="false" aria-haspopup="true">
        ${group.label}<span class="caret" aria-hidden="true">▾</span>
      </button>
      <div class="nav-menu" role="group" aria-label="${group.label}">
        ${group.items.map(
          (it) => h`<a class="nav-item" href="${it.route}" data-route="${it.route}" title="${it.desc}">
            <span class="nav-icon" aria-hidden="true">${it.icon}</span>
            <span class="nav-text"><span class="nav-item-label">${it.vi}</span>
              <span class="nav-item-vi">${it.label}</span>
              <span class="nav-item-desc">${it.desc}</span></span>
          </a>`
        )}
      </div>
    </div>`;
  }

  function buildHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    header.innerHTML = h`<a class="skip-link" href="#viewRoot">Bỏ qua điều hướng</a>
      <div class="header-bar">
        <a class="brand" href="#/" aria-label="${SITE} — trang chủ">
          <span class="brand-mark" aria-hidden="true">⚗</span>
          <span class="brand-text">
            <b>Global Scientific Encyclopedia</b>
            <small>Hóa học · Vật liệu · Dược &amp; Sinh</small>
          </span>
        </a>
        <nav class="main-nav" aria-label="Điều hướng chính">
          ${Sci.nav.GROUPS.map(navGroupMarkup).reduce((a, b) => h`${a}${b}`, raw(""))}
        </nav>
        <div class="header-actions">
          <button class="search-trigger" id="searchTrigger" type="button" aria-label="Mở tìm kiếm toàn cầu">
            <span aria-hidden="true">⌕</span><span class="st-label">Tìm kiếm</span><kbd>Ctrl K</kbd>
          </button>
          <a class="icon-btn" href="#/settings" title="Cấu hình &amp; khoá API" aria-label="Cấu hình">⚙</a>
          <button class="icon-btn" id="themeToggleV2" type="button" aria-label="Đổi giao diện">◐</button>
          <button class="icon-btn menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Mở menu">☰</button>
        </div>
      </div>
      <nav class="mobile-nav" id="mobileNav" aria-label="Điều hướng di động" hidden>
        ${Sci.nav.GROUPS.map(
          (g) => h`<details class="mobile-group">
            <summary>${g.label} <span class="muted small">${g.items.length}</span></summary>
            ${g.items.map(
              (it) => h`<a class="mobile-nav-link" href="${it.route}" data-route="${it.route}">
                <span aria-hidden="true">${it.icon}</span> ${it.vi}<span class="muted small"> · ${it.label}</span>
              </a>`
            )}
          </details>`
        ).reduce((a, b) => h`${a}${b}`, raw(""))}
      </nav>`;

    document.getElementById("themeToggleV2").addEventListener("click", toggleTheme);
    document.getElementById("searchTrigger").addEventListener("click", openSearch);

    const menuBtn = document.getElementById("menuBtn");
    const mobile = document.getElementById("mobileNav");
    menuBtn.addEventListener("click", () => {
      const open = mobile.hidden;
      mobile.hidden = !open;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    });

    header.querySelectorAll(".nav-group").forEach((group) => {
      const btn = group.querySelector(".nav-group-btn");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = btn.getAttribute("aria-expanded") !== "true";
        header.querySelectorAll(".nav-group-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        group.classList.toggle("open", open);
      });
      group.addEventListener("mouseleave", () => {
        if (document.activeElement && group.contains(document.activeElement)) return;
        btn.setAttribute("aria-expanded", "false");
        group.classList.remove("open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-group")) {
        header.querySelectorAll(".nav-group-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
        header.querySelectorAll(".nav-group").forEach((g) => g.classList.remove("open"));
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        header.querySelectorAll(".nav-group-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
        if (!mobile.hidden) {
          mobile.hidden = true;
          menuBtn.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  function buildFooter() {
    const footer = document.getElementById("siteFooter");
    if (!footer) return;
    let stats = { total: Sci.registry.stats().total };
    let docs = 0;
    try {
      docs = Sci.search.localCounts().total;
    } catch (e) {
      docs = 0;
    }
    footer.innerHTML = h`<div class="footer-inner">
      <div class="footer-brand">
        <span class="brand-mark" aria-hidden="true">⚗</span>
        <div>
          <b>${SITE}</b>
          <p class="small muted">Bách khoa toàn thư khoa học mở, song ngữ Việt–Anh. Dữ liệu sống truy vấn trực tiếp từ nguồn quốc tế; nội dung biên soạn được ghi rõ nguồn gốc.</p>
        </div>
      </div>
      <div class="footer-cols">
        <div><h4>Khám phá</h4>
          <a href="#/elements">Nguyên tố</a><a href="#/compounds">Hợp chất</a><a href="#/reactions">Phản ứng</a><a href="#/materials">Vật liệu</a><a href="#/pharma">Dược phẩm</a>
        </div>
        <div><h4>Dữ liệu</h4>
          <a href="#/sources">Nguồn &amp; giấy phép</a><a href="#/graph">Đồ thị tri thức</a><a href="#/tools">Công cụ</a><a href="#/settings">Cấu hình API</a>
        </div>
        <div><h4>Học tập</h4>
          <a href="#/learn">Thư viện học tập</a><a href="#/literature">Tài liệu khoa học</a><a href="#/knowledge">Kiến thức nền</a><a href="#/research">Nghiên cứu</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="small muted">© ${new Date().getFullYear()} Global Scientific Encyclopedia · ${U.num(stats.total)} nguồn được kiểm kê · ${U.num(docs)} bản ghi trong chỉ mục cục bộ</span>
      <span class="small muted">Không dùng cho chẩn đoán, kê đơn hay quyết định pháp lý. Số liệu đo chỉ có giá trị trong điều kiện công bố kèm theo.</span>
    </div>`;
  }

  /* ---------------------------------------------------------------------
     Search overlay
     --------------------------------------------------------------------- */
  function buildSearchOverlay() {
    const dialog = document.getElementById("searchDialog");
    if (!dialog) return;
    dialog.innerHTML = h`<div class="sd-inner">
      <div class="sd-head">
        <span class="sd-title">Tìm kiếm toàn cầu</span>
        <button class="sd-close" type="button" aria-label="Đóng tìm kiếm">✕</button>
      </div>
      <div class="sd-mount" id="sdMount"></div>
      <p class="sd-hint small muted">Tên, IUPAC, công thức, SMILES, InChI, InChIKey, CID, ChEBI, ChEMBL, Rhea, UniProt, DOI, PMID — kết quả cục bộ hiện ngay, kết quả trực tiếp tải sau.</p>
    </div>`;
    dialog.querySelector(".sd-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      dialog.close();
    });
    searchOverlay = Sci.searchBox.create(dialog.querySelector("#sdMount"), {
      placeholder: "aspirin, C9H8O4, BSYNRYMUTXBXSQ-UHFFFAOYSA-N, 10.1038/…",
      onSubmit(q) {
        dialog.close();
        navigate("#/search?q=" + encodeURIComponent(q));
      },
      onNavigate(href) {
        dialog.close();
        navigate(href);
      },
    });
  }

  function openSearch() {
    const dialog = document.getElementById("searchDialog");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    setTimeout(() => searchOverlay && searchOverlay.focus(), 30);
  }

  function closeSearch() {
    const dialog = document.getElementById("searchDialog");
    if (dialog && dialog.open) dialog.close();
  }

  /* ---------------------------------------------------------------------
     Legacy mounting
     --------------------------------------------------------------------- */
  function hideLegacySections() {
    legacySections.forEach((s) => s.classList.add("legacy-hidden"));
  }

  function renderLegacy(id) {
    runCleanups();
    closeSearch();
    viewRoot.hidden = true;
    viewRoot.innerHTML = "";
    legacyRoot.hidden = false;
    hideLegacySections();
    const target = document.getElementById(id);
    if (target) target.classList.remove("legacy-hidden");
    const title = LEGACY_TITLES[id] || "";
    document.title = title ? `${title} · ${SITE}` : SITE;
    announce(title || SITE);
    window.scrollTo(0, 0);
  }

  function hideLegacy() {
    if (!legacyRoot.hidden) {
      hideLegacySections();
      legacyRoot.hidden = true;
    }
  }

  /* ---------------------------------------------------------------------
     Rendering
     --------------------------------------------------------------------- */
  function runCleanups() {
    cleanups.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        /* a cleanup must never break navigation */
      }
    });
    cleanups = [];
  }

  function announce(msg) {
    const live = document.getElementById("routeAnnouncer");
    if (live) live.textContent = msg;
  }

  function parseHash() {
    let rawHash = location.hash || "#/";
    if (rawHash.charAt(0) === "#") rawHash = rawHash.slice(1);
    if (!rawHash) rawHash = "/";
    if (rawHash.charAt(0) !== "/") {
      const alias = LEGACY_ALIAS[rawHash];
      if (alias) {
        location.replace(alias);
        return null;
      }
      rawHash = "/" + rawHash;
    }
    const qIndex = rawHash.indexOf("?");
    const path = (qIndex === -1 ? rawHash : rawHash.slice(0, qIndex)).replace(/^\/+|\/+$/g, "");
    const query = new URLSearchParams(qIndex === -1 ? "" : rawHash.slice(qIndex + 1));
    return { path, query };
  }

  function activeRouteFor(path) {
    for (const r of ROUTES) {
      if (r.re.test(path)) return r;
    }
    return null;
  }

  function markActive(path) {
    const matched = activeRouteFor(path);
    document.querySelectorAll("[data-route]").forEach((a) => {
      const routePath = a.dataset.route.replace(/^#\/?/, "").replace(/\/$/, "");
      const isActive =
        !!matched &&
        !!matched.view &&
        ((routePath === "" && path === "") || (routePath !== "" && (path === routePath || path.startsWith(routePath + "/"))));
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function navigate(hash) {
    if (!hash) return;
    if (!hash.startsWith("#")) hash = "#" + hash;
    const dialog = document.getElementById("searchDialog");
    if (dialog && dialog.open) dialog.close();
    if (location.hash === hash) {
      render();
    } else {
      location.hash = hash;
    }
  }

  function notFound(path) {
    viewRoot.innerHTML = h`<div class="view-container">
      ${U.emptyState(
        "Không tìm thấy trang",
        `Đường dẫn “#/${U.esc(path)}” không tồn tại trong phiên bản này.`,
        h`<a class="btn" href="#/">Về Bản đồ khoa học</a> <a class="btn btn-ghost" href="#/search">Tìm kiếm</a>`
      )}
    </div>`;
  }

  function renderView(route, ctx, path) {
    const view = Sci.views[route.view];
    if (!view) {
      notFound(path);
      return;
    }
    hideLegacy();
    viewRoot.hidden = false;
    runCleanups();
    const ctxObj = {
      mount: viewRoot,
      params: ctx,
      query: currentQuery,
      navigate,
      cleanup(fn) {
        if (typeof fn === "function") cleanups.push(fn);
      },
    };
    try {
      U.setHTML(viewRoot, view.render(ctxObj));
    } catch (err) {
      viewRoot.innerHTML = h`<div class="view-container">${U.errorBox(err, {
        hint: "Lỗi hiển thị đã được cô lập; các trang khác vẫn hoạt động.",
      })}</div>`;
      return;
    }
    const label = view.title || route.view;
    document.title = `${label} · ${SITE}`;
    announce(label);
    window.scrollTo(0, 0);
    if (typeof view.after === "function") {
      Promise.resolve()
        .then(() => view.after(ctxObj))
        .catch((err) => {
          const box = document.createElement("div");
          box.className = "view-container";
          box.innerHTML = U.errorBox(err, { hint: "Tương tác trên trang có thể bị giới hạn." });
          viewRoot.appendChild(box);
        });
    }
  }

  let currentQuery = new URLSearchParams();

  function render() {
    const parsed = parseHash();
    if (!parsed) return;
    currentQuery = parsed.query;
    const path = parsed.path;
    current = path;
    const route = activeRouteFor(path);
    const ctx = route ? path.match(route.re).slice(1) : [];
    markActive(path);
    const mobile = document.getElementById("mobileNav");
    if (mobile) mobile.hidden = true;
    const menuBtn = document.getElementById("menuBtn");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");

    if (!route) {
      hideLegacy();
      notFound(path);
      return;
    }
    if (route.legacy) {
      renderLegacy(route.legacy);
      return;
    }
    renderView(route, ctx, path);
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  function boot() {
    viewRoot = document.getElementById("viewRoot");
    legacyRoot = document.getElementById("legacyRoot");
    if (!viewRoot || !legacyRoot) {
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<div class="error-box" style="margin:1rem">Không tìm thấy khung ứng dụng (#viewRoot / #legacyRoot).</div>'
      );
      return;
    }
    legacySections = Array.from(legacyRoot.querySelectorAll(".section, .hero"));
    initTheme();
    buildHeader();
    buildFooter();
    buildSearchOverlay();

    window.addEventListener("hashchange", render);
    document.addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || "") || (e.target && e.target.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        openSearch();
      }
    });

    window.addEventListener("error", (e) => {
      if (e && e.message) U.toast("Có lỗi không mong đợi: " + U.truncate(e.message, 90), "error");
    });
    window.addEventListener("unhandledrejection", (e) => {
      const msg = (e.reason && e.reason.message) || "";
      if (msg) U.toast("Yêu cầu dữ liệu thất bại: " + U.truncate(msg, 90), "error");
    });

    render();
    document.documentElement.classList.add("app-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : globalThis);
