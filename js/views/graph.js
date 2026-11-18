/* =========================================================================
   Knowledge graph explorer
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const V = (Sci.views = Sci.views || {});

  let renderer = null;

  V.graph = {
    title: "Đồ thị tri thức",
    render(ctx) {
      const g = Sci.graph.build();
      const q = ctx.query.get("q") || "";
      return h`<div class="view-container graph-view">
        ${U.sectionHead(
          "Knowledge Graph",
          "Đồ thị tri thức khoa học",
          "Khám phá quan hệ giữa nguyên tố, hợp chất, phản ứng, thuốc và target sinh học. Mỗi cạnh ghi rõ cách suy ra quan hệ — liên kết theo tên được dán nhãn riêng, không phải bằng chứng cấu trúc."
        )}
        <div class="graph-stats">
          <span><b>${U.num(g.stats.nodes)}</b> nút</span>
          <span><b>${U.num(g.stats.edges)}</b> cạnh</span>
          ${Object.keys(g.stats.byKind)
            .map((k) => h`<span class="gstat"><i class="dot dot-${k}"></i>${Sci.graph.KIND_LABELS[k] || k}: ${g.stats.byKind[k]}</span>`)
            .reduce((a, b) => h`${a}${b}`, raw(""))}
        </div>
        <div class="graph-toolbar">
          <div class="graph-search-wrap"><input id="graphSearch" type="search" placeholder="Tìm nút: aspirin, graphene, Fe…" value="${q}" aria-label="Tìm nút trong đồ thị" /></div>
          <label class="graph-ctl">Độ sâu
            <select id="graphDepth">
              <option value="1">1</option>
              <option value="2" selected>2</option>
              <option value="3">3</option>
            </select>
          </label>
          <div class="graph-kinds" id="graphKinds">
            ${Object.keys(Sci.graph.KIND_LABELS)
              .map(
                (k) => h`<label class="kind-toggle"><input type="checkbox" value="${k}" ${k === "element" ? raw("") : raw("checked")} /> <i class="dot dot-${k}"></i>${Sci.graph.KIND_LABELS[k]}</label>`
              )
              .reduce((a, b) => h`${a}${b}`, raw(""))}
          </div>
          <button class="btn btn-sm btn-ghost" id="graphReset">Về mặc định</button>
        </div>
        <div class="graph-layout">
          <div class="graph-canvas-wrap">
            <canvas id="graphCanvas" aria-label="Đồ thị tri thức tương tác" role="img"></canvas>
            <p class="graph-hint muted small">Kéo để di chuyển · lăn chuột để zoom · bấm vào nút để xem chi tiết</p>
          </div>
          <aside class="graph-panel" id="graphPanel">
            <h2>Chi tiết nút</h2>
            <p class="muted small">Chọn một nút trên đồ thị để xem quan hệ và mở bản ghi.</p>
          </aside>
        </div>
        <div class="notice notice-info"><span class="notice-icon">ℹ</span><div>
          <b>Cách hình thành cạnh:</b> công thức hóa học (nguyên tố → hợp chất/vật liệu), tên chất tham gia trong bản ghi phản ứng
          (hợp chất ↔ phản ứng, khớp theo tên chứ không theo cấu trúc), và target do nguồn công bố (thuốc → target).
          Các cạnh “khớp tên” được ghi rõ trong phần chi tiết để tránh hiểu nhầm là quan hệ hóa học đã được xác lập.
        </div></div>
      </div>`;
    },
    after(ctx) {
      const canvas = ctx.mount.querySelector("#graphCanvas");
      const panel = ctx.mount.querySelector("#graphPanel");
      const searchInput = ctx.mount.querySelector("#graphSearch");
      const depthSel = ctx.mount.querySelector("#graphDepth");
      const kindsHost = ctx.mount.querySelector("#graphKinds");
      const q = (ctx.query.get("q") || "").trim();

      function activeKinds() {
        return Array.from(kindsHost.querySelectorAll("input:checked")).map((i) => i.value);
      }

      function draw(seedId) {
        if (renderer) renderer.destroy();
        const seeds = seedId ? [seedId] : [];
        const data = Sci.graph.subgraph(seeds, {
          depth: Number(depthSel.value),
          kinds: activeKinds(),
          maxNodes: 150,
        });
        renderer = Sci.graph.render(canvas, data, {
          selected: seedId,
          onSelect(node) {
            showPanel(node);
          },
        });
        ctx.cleanup(() => {
          if (renderer) renderer.destroy();
          renderer = null;
        });
        if (!data.nodes.length) {
          panel.innerHTML = U.emptyState("Không có nút nào", "Thử đổi bộ lọc loại thực thể hoặc từ khóa khác.");
        }
      }

      function showPanel(node) {
        const g = Sci.graph.build();
        const neigh = [];
        g.edges.forEach((e) => {
          if (e.source === node.id) {
            const other = g.index.get(e.target);
            if (other) neigh.push({ node: other, dir: "→", relation: e.relation, match: e.match });
          } else if (e.target === node.id) {
            const other = g.index.get(e.source);
            if (other) neigh.push({ node: other, dir: "←", relation: e.relation, match: e.match });
          }
        });
        neigh.sort((a, b) => b.node.degree - a.node.degree);
        const shown = neigh.slice(0, 24);
        panel.innerHTML = h`<div class="gp-head">
            <span class="kind-badge kind-${node.kind}">${Sci.graph.KIND_LABELS[node.kind] || node.kind}</span>
            <h2>${node.title}</h2>
            <p class="muted small">${U.num(node.degree)} quan hệ trực tiếp</p>
          </div>
          ${node.route ? h`<a class="btn btn-sm" href="${node.route}">Mở bản ghi →</a>` : raw("")}
          <h3 class="gp-sub">Quan hệ</h3>
          <ul class="neighbor-list">${shown.map(
            (n) => h`<li>
              <button class="neighbor-btn" data-id="${n.node.id}">
                <span class="nb-dir">${n.dir}</span>
                <span class="nb-body"><span class="nb-title">${n.node.title}</span><span class="nb-rel">${n.relation}${
                  n.match === "name" ? " · khớp tên" : ""
                }</span></span>
                <span class="nb-kind">${Sci.graph.KIND_LABELS[n.node.kind] || n.node.kind}</span>
              </button></li>`
          )}</ul>
          ${neigh.length > shown.length ? h`<p class="muted small">… và ${neigh.length - shown.length} quan hệ khác.</p>` : raw("")}`;
        panel.querySelectorAll("[data-id]").forEach((btn) =>
          btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            draw(id);
            const node2 = Sci.graph.build().index.get(id);
            if (node2) showPanel(node2);
          })
        );
      }

      const initial = q ? Sci.graph.searchNodes(q, 1)[0] : Sci.graph.build().nodes.slice().sort((a, b) => b.degree - a.degree)[0];
      draw(initial ? initial.id : null);
      if (initial) showPanel(initial);

      U.on(searchInput, "keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const found = Sci.graph.searchNodes(searchInput.value, 1)[0];
        if (!found) {
          U.toast("Không tìm thấy nút phù hợp", "warn");
          return;
        }
        draw(found.id);
        showPanel(found);
      });

      depthSel.addEventListener("change", () => draw(initial ? initial.id : null));
      kindsHost.addEventListener("change", () => draw(initial ? initial.id : null));
      ctx.mount.querySelector("#graphReset").addEventListener("click", () => {
        searchInput.value = "";
        depthSel.value = "2";
        ctx.navigate("#/graph");
      });
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
