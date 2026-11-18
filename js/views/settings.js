/* =========================================================================
   Runtime settings — optional free API keys, proxy, cache
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const V = (Sci.views = Sci.views || {});

  const FIELDS = [
    {
      key: "mpKey",
      label: "Materials Project API key",
      hint: "Miễn phí khi đăng ký tài khoản Materials Project. Dùng cho tab vật liệu trực tuyến.",
      link: "https://next-gen.materialsproject.org/api",
      type: "password",
    },
    {
      key: "openfdaKey",
      label: "openFDA API key",
      hint: "Không bắt buộc. Tăng hạn mức từ 240 → 240.000 request/ngày. Đăng ký miễn phí.",
      link: "https://open.fda.gov/apis/authentication/",
      type: "password",
    },
    {
      key: "ncbiKey",
      label: "NCBI API key",
      hint: "Không bắt buộc. Tăng tốc E-utilities (3 → 10 request/giây).",
      link: "https://www.ncbi.nlm.nih.gov/account/settings/",
      type: "password",
    },
    {
      key: "mailto",
      label: "Email liên hệ (Crossref polite pool)",
      hint: "Không bắt buộc. Giúp Crossref xếp yêu cầu vào nhóm ưu tiên.",
      type: "email",
    },
    {
      key: "proxyBase",
      label: "Proxy URL (Netlify Function)",
      hint: "Chỉ dùng khi tự triển khai proxy để giữ khoá phía máy chủ, ví dụ https://your-site.netlify.app/.netlify/functions/api",
      type: "url",
    },
  ];

  V.settings = {
    title: "Cấu hình",
    render() {
      const cfg = Sci.config.all();
      const flags = Sci.config.configured();
      return h`<div class="view-container settings-view">
        ${U.sectionHead(
          "Configuration",
          "Cấu hình & khoá API",
          "Website hoạt động đầy đủ mà không cần khoá. Các trường dưới đây chỉ dành cho nguồn yêu cầu khoá miễn phí hoặc để tăng hạn mức."
        )}
        ${ui.safetyNotice(
          "Khoá được lưu trong localStorage của chính trình duyệt này và chỉ gửi tới API chính thức (hoặc proxy do bạn cấu hình). Không dùng máy tính công cộng để lưu khoá."
        )}
        <form id="settingsForm" class="settings-form">
          ${FIELDS.map(
            (f) => h`<div class="field-row">
              <div class="field-meta">
                <label for="set-${f.key}">${f.label} ${flags[f.key] ? h`<span class="status-pill status-live">đã đặt</span>` : raw("")}</label>
                <p class="small muted">${f.hint} ${f.link ? U.extLink(f.link, "Lấy khoá ↗") : raw("")}</p>
              </div>
              <input id="set-${f.key}" name="${f.key}" type="${f.type}" value="${cfg[f.key] || ""}" autocomplete="off" spellcheck="false" placeholder="${f.type === "password" ? "chưa cấu hình" : ""}" />
            </div>`
          )}
          <div class="form-actions">
            <button class="btn" type="submit">Lưu cấu hình</button>
            <button class="btn btn-ghost" type="button" id="settingsClear">Xoá toàn bộ khoá</button>
          </div>
          <p class="small muted">Cấu hình chỉ tồn tại trên thiết bị này. Khi triển khai chung, hãy dùng proxy Netlify Function để khoá không nằm trong trình duyệt.</p>
        </form>
        <section class="record-section">
          <h2>Bộ nhớ đệm &amp; nhật ký yêu cầu</h2>
          <div id="cachePanel">${cacheMarkup()}</div>
          <button class="btn btn-sm btn-ghost" id="cacheClear" type="button">Xoá bộ nhớ đệm</button>
        </section>
        <section class="record-section">
          <h2>Nguyên tắc cấu hình</h2>
          <ul class="plain-list">
            <li>Không có khoá nào được ghi vào mã nguồn, tệp tĩnh hay kho lưu trữ.</li>
            <li>Materials Project bắt buộc khoá; nếu chưa có, website hiển thị hướng dẫn thay vì dữ liệu giả.</li>
            <li>openFDA, NCBI, Crossref hoạt động không cần khoá nhưng bị giới hạn tần suất thấp hơn.</li>
            <li>Proxy chỉ cần khi muốn giấu khoá khỏi trình duyệt; xem <code>netlify/functions/README</code> trong kho.</li>
          </ul>
        </section>
      </div>`;
    },
    after(ctx) {
      const form = ctx.mount.querySelector("#settingsForm");
      const panel = ctx.mount.querySelector("#cachePanel");
      const toast = (m) => U.toast(m);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        FIELDS.forEach((f) => Sci.config.set(f.key, String(data.get(f.key) || "").trim()));
        toast("Đã lưu cấu hình trên trình duyệt này");
        panel.innerHTML = cacheMarkup();
        const first = form.querySelector('input[name="mpKey"]');
        if (first) first.blur();
      });
      ctx.mount.querySelector("#settingsClear").addEventListener("click", () => {
        FIELDS.forEach((f) => Sci.config.set(f.key, ""));
        FIELDS.forEach((f) => {
          const input = form.querySelector(`[name="${f.key}"]`);
          if (input) input.value = "";
        });
        toast("Đã xoá khoá khỏi trình duyệt");
        panel.innerHTML = cacheMarkup();
      });
      ctx.mount.querySelector("#cacheClear").addEventListener("click", () => {
        Sci.net.clearCache();
        panel.innerHTML = cacheMarkup();
        toast("Đã xoá bộ nhớ đệm");
      });
    },
  };

  function cacheMarkup() {
    let info = { entries: 0, bytes: 0 };
    try {
      info = Sci.net.cacheInfo();
    } catch (e) {
      /* ignore */
    }
    const recent = (Sci.net.recent && Sci.net.recent(8)) || [];
    return h`<div class="stat-inline">
        <span><b>${info.entries}</b> mục đệm</span>
        <span><b>${U.bytes(info.bytes)}</b></span>
      </div>
      ${recent.length
        ? h`<ul class="request-log">${recent.map(
            (r) => h`<li><span class="status-dot ${r.ok ? "ok" : "err"}"></span><span class="mono small">${r.status || "—"}</span> <span class="small">${U.truncate(r.url, 90)}</span> <span class="muted small">${r.ms != null ? r.ms + " ms" : ""}</span></li>`
          )}</ul>`
        : h`<p class="muted small">Chưa có yêu cầu nào trong phiên này.</p>`}`;
  }
})(typeof window !== "undefined" ? window : globalThis);
