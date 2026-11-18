/* =========================================================================
   Global Scientific Encyclopedia — core utilities
   Namespace: window.Sci (classic script, no build step, Netlify-compatible)
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});

  const RAW = Symbol("raw");

  /** Mark a string as trusted markup (never pass user/external data here). */
  function raw(s) {
    return { [RAW]: String(s == null ? "" : s) };
  }

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Tagged template that escapes every interpolation unless it is raw(), a
   * fragment produced by html itself, or an array of fragments. The result is a
   * String object carrying the RAW marker so fragments can be nested safely
   * without being escaped twice (while ordinary data is still escaped).
   */
  function html(strings, ...vals) {
    let out = strings[0];
    for (let i = 0; i < vals.length; i++) {
      const v = vals[i];
      if (v == null || v === false) out += "";
      else if (v && v[RAW] !== undefined) out += v[RAW];
      else if (Array.isArray(v)) out += v.map((x) => (x && x[RAW] !== undefined ? x[RAW] : esc(x))).join("");
      else out += esc(v);
      out += strings[i + 1];
    }
    const fragment = new String(out);
    fragment[RAW] = out;
    return fragment;
  }

  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function on(el, type, handler, opts) {
    if (el) el.addEventListener(type, handler, opts);
    return el;
  }

  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms || 180);
    };
  }

  function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        return fn.apply(this, args);
      }
    };
  }

  /** Format a number with a given number of significant decimals (locale-neutral). */
  function num(v, digits) {
    if (v === null || v === undefined || v === "") return "—";
    const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, "."));
    if (!isFinite(n)) return String(v);
    if (digits === undefined) digits = Math.abs(n) >= 100 ? 2 : Math.abs(n) >= 1 ? 3 : 5;
    let s = n.toFixed(digits);
    s = s.replace(/\.?0+$/, "");
    return s === "" || s === "-0" ? "0" : s;
  }

  /** Scientific notation that stays readable in tables. */
  function sci(v, digits) {
    if (v === null || v === undefined || v === "") return "—";
    const n = Number(v);
    if (!isFinite(n)) return String(v);
    if (n !== 0 && (Math.abs(n) < 1e-3 || Math.abs(n) >= 1e5)) {
      return n.toExponential(digits === undefined ? 2 : digits).replace("e", "×10^");
    }
    return num(n, digits);
  }

  const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  function fmtDate(iso) {
    if (!iso) return "—";
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`;
  }

  function fmtDateTime(iso) {
    if (!iso) return "—";
    const d = iso instanceof Date ? iso : new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return `${fmtDate(d)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function relative(iso) {
    if (!iso) return "—";
    const t = new Date(iso).getTime();
    if (!isFinite(t)) return "—";
    const diff = Date.now() - t;
    const mins = Math.round(diff / 60000);
    if (mins < 1) return "vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    const days = Math.round(hrs / 24);
    if (days < 31) return `${days} ngày trước`;
    return fmtDate(iso);
  }

  function bytes(n) {
    if (!n && n !== 0) return "—";
    const u = ["B", "KB", "MB", "GB"];
    let i = 0;
    let v = Number(n);
    while (v >= 1024 && i < u.length - 1) {
      v /= 1024;
      i++;
    }
    return `${num(v, v < 10 ? 1 : 0)} ${u[i]}`;
  }

  function slugify(s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function truncate(s, n) {
    s = String(s == null ? "" : s);
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /** Render a chemical formula with true subscripts (already-escaped input). */
  function formulaHtml(formula) {
    if (!formula) return "—";
    const safe = esc(formula);
    return raw(
      safe
        .replace(/([A-Za-z\)\]])(\d+)/g, "$1<sub>$2</sub>")
        .replace(/([+-])(\d*)(?=$|[^A-Za-z0-9])/g, (m, sign, d) => `<sup>${sign}${d || ""}</sup>`)
    );
  }

  function copy(text) {
    const t = String(text == null ? "" : text);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(t).then(
        () => true,
        () => fallbackCopy(t)
      );
    }
    return Promise.resolve(fallbackCopy(t));
  }

  function fallbackCopy(t) {
    try {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch (e) {
      return false;
    }
  }

  let toastHost = null;
  function toast(message, kind) {
    if (!document.body) return;
    if (!toastHost) {
      toastHost = document.createElement("div");
      toastHost.className = "toast-host";
      toastHost.setAttribute("role", "status");
      toastHost.setAttribute("aria-live", "polite");
      document.body.appendChild(toastHost);
    }
    const node = document.createElement("div");
    node.className = "toast toast-" + (kind || "info");
    node.textContent = message;
    toastHost.appendChild(node);
    setTimeout(() => node.classList.add("in"), 10);
    setTimeout(() => {
      node.classList.remove("in");
      setTimeout(() => node.remove(), 250);
    }, 3200);
  }

  /* ---------- small UI fragments ---------- */
  function extLink(url, label, opts) {
    if (!url) return raw("");
    const o = opts || {};
    return html`<a class="ext-link" href="${url}" target="_blank" rel="noopener noreferrer nofollow"${
      o.title ? html` title="${o.title}"` : raw("")
    }>${label || url}${o.plain ? raw("") : raw(' <span class="ext-glyph" aria-hidden="true">↗</span>')}</a>`;
  }

  function chip(label, kind, title) {
    return html`<span class="chip chip-${kind || "neutral"}"${title ? html` title="${title}"` : raw("")}>${label}</span>`;
  }

  function spinner(label) {
    return html`<div class="loading-block"><span class="spinner" aria-hidden="true"></span><span>${label ||
      "Đang truy vấn nguồn dữ liệu…"}</span></div>`;
  }

  function emptyState(title, detail, actions) {
    return html`<div class="empty-state"><div class="empty-glyph" aria-hidden="true">◌</div><h3>${title}</h3>${
      detail ? html`<p>${detail}</p>` : raw("")
    }${actions ? html`<div class="empty-actions">${actions}</div>` : raw("")}</div>`;
  }

  function errorBox(err, opts) {
    const o = opts || {};
    const src = err && err.sourceLabel ? ` · nguồn: ${err.sourceLabel}` : "";
    const status = err && err.status ? `HTTP ${err.status}` : "";
    const detail = (err && err.message) || "Lỗi không xác định";
    return html`<div class="error-box" role="alert">
      <div class="error-head"><b>Không tải được dữ liệu</b><span class="muted">${[status, src].filter(Boolean).join("")}</span></div>
      <p>${detail}</p>
      ${o.hint ? html`<p class="muted small">${o.hint}</p>` : raw("")}
      ${o.retry ? html`<button class="btn btn-sm" data-retry="1">Thử lại</button>` : raw("")}
    </div>`;
  }

  function kv(rows, cls) {
    return html`<dl class="kv ${cls || ""}">${rows
      .filter((r) => r && r[1] !== undefined && r[1] !== null && r[1] !== "")
      .map(
        (r) => html`<div class="kv-row"><dt>${r[0]}</dt><dd>${r[1] && r[1][RAW] !== undefined ? r[1] : esc(r[1])}</dd></div>`
      )}</dl>`;
  }

  function sectionHead(eyebrow, title, desc, actions) {
    return html`<div class="view-head">
      ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : raw("")}
      <h1>${title}</h1>
      ${desc ? html`<p class="view-desc">${desc}</p>` : raw("")}
      ${actions ? html`<div class="view-actions">${actions}</div>` : raw("")}
    </div>`;
  }

  function pillTabs(items, activeId, attrs) {
    return html`<div class="pill-tabs" role="tablist" ${raw(attrs || "")}>${items.map(
      (it) =>
        html`<button role="tab" class="pill-tab ${it.id === activeId ? "active" : ""}" data-tab="${it.id}"
          aria-selected="${it.id === activeId ? "true" : "false"}">${it.label}${
          it.count ? html` <span class="tab-count">${it.count}</span>` : raw("")
        }</button>`
    )}</div>`;
  }

  function pager(page, totalPages, attrs) {
    if (totalPages <= 1) return raw("");
    return html`<nav class="pager" ${raw(attrs || "")}>
      <button class="btn btn-sm" data-page="${Math.max(1, page - 1)}" ${page <= 1 ? raw("disabled") : raw("")}>← Trước</button>
      <span class="pager-info">Trang ${page} / ${totalPages}</span>
      <button class="btn btn-sm" data-page="${Math.min(totalPages, page + 1)}" ${
      page >= totalPages ? raw("disabled") : raw("")
    }>Sau →</button>
    </nav>`;
  }

  /** Accessible table builder. cols: [{key,label,cls,render}] */
  function table(cols, rows, opts) {
    const o = opts || {};
    if (!rows || !rows.length) return emptyState(o.emptyTitle || "Không có bản ghi", o.emptyDetail || "");
    return html`<div class="table-wrap"><table class="data-table ${o.cls || ""}">
      <thead><tr>${cols.map((c) => html`<th scope="col" class="${c.cls || ""}">${c.label}</th>`)}</tr></thead>
      <tbody>${rows.map(
        (r, i) =>
          html`<tr>${cols.map((c) => {
            const v = typeof c.render === "function" ? c.render(r, i) : r[c.key];
            return html`<td class="${c.cls || ""}">${v && v[RAW] !== undefined ? v : esc(v == null ? "—" : v)}</td>`;
          })}</tr>`
      )}</tbody>
    </table></div>`;
  }

  function setHTML(el, content) {
    if (!el) return;
    if (content && content[RAW] !== undefined) el.innerHTML = content[RAW];
    else if (Array.isArray(content)) el.innerHTML = content.map((c) => (c && c[RAW] !== undefined ? c[RAW] : esc(c))).join("");
    else el.innerHTML = String(content || "");
  }

  function safeHref(url) {
    if (!url) return "#";
    try {
      const u = new URL(url, location.href);
      if (["http:", "https:", "mailto:"].includes(u.protocol)) return u.href;
    } catch (e) {
      /* ignore */
    }
    return "#";
  }

  function idShort(s, n) {
    s = String(s || "");
    return s.length > (n || 18) ? s.slice(0, (n || 18) - 1) + "…" : s;
  }

  Sci.util = {
    RAW,
    raw,
    esc,
    html,
    qs,
    qsa,
    on,
    debounce,
    throttle,
    num,
    sci,
    fmtDate,
    fmtDateTime,
    relative,
    bytes,
    slugify,
    truncate,
    uniq,
    chunk,
    sleep,
    formulaHtml,
    copy,
    toast,
    extLink,
    chip,
    spinner,
    emptyState,
    errorBox,
    kv,
    sectionHead,
    pillTabs,
    pager,
    table,
    setHTML,
    safeHref,
    idShort,
  };
})(typeof window !== "undefined" ? window : globalThis);
