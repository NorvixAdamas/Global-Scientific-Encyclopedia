/* =========================================================================
   Data source directory: licence, access, status, health, cache
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const ui = Sci.ui;
  const V = (Sci.views = Sci.views || {});

  const STATUS_OPTIONS = [
    ["all", "Tất cả trạng thái"],
    ["live", "Đang truy vấn trực tiếp"],
    ["live-key", "Live, cần key miễn phí"],
    ["bulk", "Chỉ bulk tải file"],
    ["external", "Liên kết ngoài"],
    ["planned", "Ứng viên"],
    ["rejected", "Không tích hợp"],
  ];

  const LICENSE_OPTIONS = [
    ["all", "Tất cả giấy phép"],
    ["public-domain", "Public domain / CC0"],
    ["attribution", "CC BY"],
    ["share-alike", "CC BY-SA"],
    ["conditional", "Có điều kiện"],
    ["proprietary", "Thương mại"],
  ];

  function sourceCard(s) {
    const domains = (s.domains || []).slice(0, 4).map((d) => h`<span class="tag">${Sci.registry.domainLabel(d)}</span>`);
    return h`<details class="source-card" id="src-${s.id}">
      <summary>
        <div class="scard-main">
          <div class="scard-title">
            <h3>${s.name}</h3>
            ${ui.statusBadge(s.status)}
          </div>
          <p class="scard-org">${s.org}</p>
          <p class="scard-desc">${s.description}</p>
          <div class="scard-tags">${domains}${h`<span class="tag tag-license">${s.license}</span>`}</div>
        </div>
        <div class="scard-side">
          <span class="scard-cost">${Sci.registry.COST_LABELS[s.cost] || s.cost}</span>
          <span class="scard-more">Chi tiết ▾</span>
        </div>
      </summary>
      <div class="scard-body">
        <dl class="kv">
          <div class="kv-row"><dt>Tổ chức</dt><dd>${s.org}</dd></div>
          <div class="kv-row"><dt>Lĩnh vực</dt><dd>${(s.domains || []).map((d) => Sci.registry.domainLabel(d)).join(", ")}</dd></div>
          <div class="kv-row"><dt>Giấy phép</dt><dd>${s.license}${s.licenseUrl ? raw(" · ") : raw("")}${s.licenseUrl ? U.extLink(s.licenseUrl, "điều khoản") : raw("")}</dd></div>
          <div class="kv-row"><dt>Chi phí</dt><dd>${Sci.registry.COST_LABELS[s.cost] || s.cost}</dd></div>
          <div class="kv-row"><dt>Xác thực</dt><dd>${s.auth === "none" ? "Không cần" : s.auth}</dd></div>
          <div class="kv-row"><dt>Giới hạn tần suất</dt><dd>${s.rateLimit}</dd></div>
          <div class="kv-row"><dt>Phạm vi</dt><dd>${s.coverage}</dd></div>
          <div class="kv-row"><dt>Cập nhật</dt><dd>${s.update}</dd></div>
          <div class="kv-row"><dt>Tái phân phối</dt><dd>${redistributionLabel(s.redistribution)}</dd></div>
          <div class="kv-row"><dt>Truy cập</dt><dd>${(s.access || []).join(" · ")}</dd></div>
          ${s.connector ? h`<div class="kv-row"><dt>Connector</dt><dd class="mono">${s.connector}</dd></div>` : raw("")}
          <div class="kv-row"><dt>Kiểm thử gần nhất</dt><dd>${U.fmtDate(s.verified)}</dd></div>
        </dl>
        ${(s.endpoints || []).length
          ? h`<div class="endpoint-list"><span class="small muted">Endpoint đã dùng:</span>${s.endpoints.map(
              (e) => h`<code>${e}</code>`
            )}</div>`
          : raw("")}
        ${s.notes ? h`<p class="scard-note"><b>Ghi chú:</b> ${s.notes}</p>` : raw("")}
        <div class="link-row">
          ${U.extLink(s.url, "Website chính thức")}
          ${s.api ? U.extLink(s.api, "Tài liệu API") : raw("")}
          <a class="btn btn-sm btn-ghost" href="#/search?q=${encodeURIComponent(s.name)}">Tra thử nguồn này</a>
        </div>
      </div>
    </details>`;
  }

  function redistributionLabel(r) {
    return {
      yes: "Được phép (giữ attribution)",
      attribution: "Được phép khi ghi công",
      "share-alike": "Được phép, phải chia sẻ cùng giấy phép",
      conditional: "Có điều kiện / theo từng record",
      no: "Không được phép",
    }[r] || r;
  }

  /* Licence matrix rendered from the registry itself: the same facts as the
     markdown files, but readable inside the site instead of a download. */
  function licenseMatrix() {
    const list = Sci.registry.list({});
    const rows = list.map(
      (s) => h`<tr>
        <td><a class="cell-link" href="#src-${s.id}">${s.name}</a></td>
        <td class="small">${s.license}</td>
        <td class="small">${redistributionLabel(s.redistribution)}</td>
        <td class="small">${Sci.registry.COST_LABELS[s.cost] || s.cost}</td>
        <td>${ui.statusBadge(s.status)}</td>
      </tr>`
    );
    return h`<section class="record-section">
      <div class="rs-head"><h2>Ma trận giấy phép &amp; tái phân phối</h2></div>
      <p class="muted small">Bảng dựng trực tiếp từ registry của website — cùng dữ liệu với tệp tài liệu, đọc được ngay tại chỗ, không cần mở tab khác.</p>
      <div class="table-wrap"><table class="data-table small-table">
        <thead><tr><th>Nguồn</th><th>Giấy phép</th><th>Tái phân phối</th><th>Chi phí</th><th>Trạng thái</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </section>`;
  }

  /* What the site shows in-place vs. what it can only link to, with the reason. */
  function coveragePanel() {
    const groups = [
      ["live", "Hiển thị trực tiếp trong trang"],
      ["live-key", "Hiển thị trực tiếp khi có khoá miễn phí"],
      ["bulk", "Chỉ tải tệp bulk (không truy vấn từ trình duyệt)"],
      ["external", "Chỉ liên kết ngoài — nêu rõ lý do"],
      ["rejected", "Không tích hợp"],
    ];
    const blocks = [];
    groups.forEach((g) => {
      const items = Sci.registry.list({ status: g[0] });
      if (!items.length) return;
      blocks.push(h`<div class="source-group">
        <h3 class="sub-h">${g[1]} <span class="muted small">(${items.length})</span></h3>
        <ul class="link-list">${items.map(
          (s) => h`<li><a href="#src-${s.id}">${s.name}</a> <span class="muted small">${s.notes || s.coverage || ""}</span></li>`
        )}</ul>
      </div>`);
    });
    return h`<section class="record-section">
      <h2>Nguồn nào hiển thị tại chỗ, nguồn nào chỉ liên kết</h2>
      <p class="muted small">Nội dung của mọi nguồn “hiển thị trực tiếp” được dựng ngay trong trang bản ghi của website này. Nguồn chỉ liên kết được nêu lý do cụ thể, thay vì đẩy người đọc sang trang khác mà không giải thích.</p>
      ${blocks}
    </section>`;
  }

  function healthPanel() {
    const cache = Sci.net.cacheInfo();
    const recent = Sci.net.recent().slice(0, 8);
    return h`<section class="record-section">
      <div class="rs-head"><h2>Trạng thái kết nối &amp; cache</h2>
        <div class="rs-aside"><button class="btn btn-sm btn-ghost" id="clearCacheBtn">Xoá cache</button></div>
      </div>
      <p class="muted small">Cache lưu tại trình duyệt để tôn trọng giới hạn tần suất (RxNorm yêu cầu cache 12–24 giờ). Không có dữ liệu nào được gửi tới máy chủ của dự án.</p>
      <div class="health-grid">
        <div class="health-stat"><b>${cache.entries}</b><span>entry trong cache</span></div>
        <div class="health-stat"><b>${U.bytes(cache.bytes)}</b><span>dung lượng ước tính</span></div>
        <div class="health-stat"><b>${Sci.config.configured().proxy ? "Có" : "Không"}</b><span>proxy serverless</span></div>
      </div>
      ${recent.length
        ? h`<div class="table-wrap"><table class="data-table small-table">
            <thead><tr><th>Nguồn</th><th>Host</th><th>HTTP</th><th>Thời gian</th><th>Khi</th></tr></thead>
            <tbody>${recent.map(
              (r) => h`<tr>
                <td>${ui.sourceName(r.sourceId || "") || "—"}</td>
                <td class="mono small">${r.host}</td>
                <td>${r.status || "ERR"}</td>
                <td>${r.ms} ms</td>
                <td class="muted small">${U.relative(r.at)}</td>
              </tr>`
            )}</tbody></table></div>`
        : h`<p class="muted small">Chưa có truy vấn nào trong phiên này. Mở một bản ghi hợp chất để xem nhật ký kết nối.</p>`}
    </section>`;
  }

  V.sources = {
    title: "Nguồn dữ liệu mở",
    render(ctx) {
      const q = ctx.query.get("q") || "";
      const status = ctx.query.get("status") || "all";
      const license = ctx.query.get("license") || "all";
      const st = Sci.registry.stats();
      const list = Sci.registry.list({ q, status, license });
      return h`<div class="view-container">
        ${U.sectionHead(
          "Open Data Registry",
          "Nguồn dữ liệu & giấy phép",
          "Danh mục đầy đủ các nguồn đã kiểm tra: giấy phép, chi phí, giới hạn truy cập, phạm vi dữ liệu và trạng thái connector. Nguồn không tương thích được liệt kê công khai thay vì che giấu."
        )}
        <div class="stat-grid">
          ${[
            ["Nguồn đã đánh giá", st.total],
            ["Truy vấn trực tiếp", st.live],
            ["Live + key miễn phí", st.liveKey],
            ["Chỉ bulk", st.bulk],
            ["Liên kết ngoài", st.external],
            ["Bị loại trừ", st.rejected],
          ]
            .map(
              (x) => h`<div class="stat-card"><b>${x[1]}</b><span>${x[0]}</span></div>`
            )}
        </div>
        <form class="source-filters" id="sourceFilters">
          <input type="search" name="q" value="${q}" placeholder="Lọc theo tên, tổ chức, lĩnh vực…" aria-label="Lọc nguồn dữ liệu" />
          <select name="status" aria-label="Trạng thái">
            ${STATUS_OPTIONS.map((o) => h`<option value="${o[0]}" ${o[0] === status ? raw("selected") : raw("")}>${o[1]}</option>`)}
          </select>
          <select name="license" aria-label="Giấy phép">
            ${LICENSE_OPTIONS.map((o) => h`<option value="${o[0]}" ${o[0] === license ? raw("selected") : raw("")}>${o[1]}</option>`)}
          </select>
          <button class="btn btn-sm" type="submit">Lọc</button>
          <span class="muted small">${list.length}/${st.total} nguồn</span>
        </form>
        <div class="source-list">${list.length ? list.map(sourceCard) : U.emptyState("Không có nguồn phù hợp", "Thử bỏ bộ lọc.")}</div>
        ${licenseMatrix()}
        ${coveragePanel()}
        ${healthPanel()}
        <section class="record-section">
          <h2>Tài liệu giấy phép &amp; phạm vi</h2>
          <p>Chi tiết nghĩa vụ tái sử dụng, yêu cầu ghi công và các nguồn bị loại trừ được ghi trong tài liệu của dự án:</p>
          <div class="link-row">
            ${U.extLink("DATA_SOURCES.md", "DATA_SOURCES.md", { plain: true })}
            ${U.extLink("OPEN_DATA_LICENSES.md", "OPEN_DATA_LICENSES.md", { plain: true })}
            ${U.extLink("DATABASE_COVERAGE.md", "DATABASE_COVERAGE.md", { plain: true })}
          </div>
          <div class="notice notice-info"><span class="notice-icon">ℹ</span><div>
            Website không tuyên bố đã nhập toàn bộ bất kỳ cơ sở dữ liệu bên ngoài nào. Số bản ghi cục bộ được đếm từ dữ liệu thực tế tại thời điểm chạy,
            và các nguồn chỉ liên kết được ghi rõ là “liên kết ngoài”.
          </div></div>
        </section>
      </div>`;
    },
    after(ctx) {
      const form = ctx.mount.querySelector("#sourceFilters");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const params = new URLSearchParams();
        ["q", "status", "license"].forEach((k) => {
          const v = data.get(k);
          if (v && v !== "all" && v !== "") params.set(k, v);
        });
        ctx.navigate("#/sources" + (params.toString() ? "?" + params.toString() : ""));
      });
      const clear = ctx.mount.querySelector("#clearCacheBtn");
      if (clear)
        clear.addEventListener("click", () => {
          Sci.net.clearCache();
          U.toast("Đã xoá cache trình duyệt");
          ctx.navigate("#/sources");
        });
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
