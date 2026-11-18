/* =========================================================================
   Compound encyclopedia + element records
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const ui = Sci.ui;
  const V = (Sci.views = Sci.views || {});

  function fill(el, promise, render, opts) {
    const o = opts || {};
    if (!el) return promise;
    el.innerHTML = U.spinner(o.label);
    return promise
      .then((data) => {
        el.innerHTML = render(data);
      })
      .catch((err) => {
        el.innerHTML = U.errorBox(err, { hint: o.hint, retry: false });
      });
  }

  /* ======================================================================
     Compound index
     ====================================================================== */
  V.compounds = {
    title: "Bách khoa hợp chất",
    render(ctx) {
      const q = ctx.query.get("q") || "";
      const page = Number(ctx.query.get("page") || 1);
      const all = root.OPEN_COMPOUNDS || [];
      const filtered = q
        ? all.filter((c) =>
            [c.common_name, c.iupac_name, c.molecular_formula, c.compound_cid, c.smiles_string]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(q.toLowerCase())
          )
        : all;
      const perPage = 40;
      const pages = Math.max(1, Math.ceil(filtered.length / perPage));
      const rows = filtered.slice((page - 1) * perPage, page * perPage);

      return h`<div class="view-container">
        ${U.sectionHead(
          "Compound Encyclopedia",
          "Bách khoa hợp chất",
          `${U.num(all.length)} hợp chất tham chiếu đã lưu cục bộ (CID, công thức, SMILES) — mở bất kỳ bản ghi nào để truy vấn trực tiếp PubChem, ChEBI và ChEMBL.`
        )}
        <div class="search-row">
          <form class="inline-search" id="compFilter" role="search">
            <input type="search" name="q" value="${q}" placeholder="Lọc theo tên, công thức, CID, SMILES…" aria-label="Lọc hợp chất" />
            <button class="btn btn-sm" type="submit">Lọc</button>
          </form>
          <button class="btn btn-sm btn-ghost" id="liveLookup">Tra PubChem trực tiếp…</button>
        </div>
        <div id="liveLookupOut"></div>
        ${U.table(
          [
            {
              label: "Hợp chất",
              render: (c) => h`<a class="cell-link" href="#/compounds/${c.compound_cid}">${c.common_name || c.iupac_name}</a>`,
            },
            { label: "Công thức", cls: "mono", render: (c) => U.formulaHtml(c.molecular_formula || "—") },
            { label: "M (g/mol)", cls: "num", render: (c) => (c.molecular_weight ? U.num(c.molecular_weight) : "—") },
            { label: "IUPAC", cls: "small", render: (c) => c.iupac_name || "—" },
            { label: "CID", cls: "mono", render: (c) => c.compound_cid || "—" },
          ],
          rows,
          { emptyTitle: "Không có hợp chất khớp bộ lọc", emptyDetail: "Thử từ khóa khác hoặc tra trực tiếp PubChem." }
        )}
        ${U.pager(page, pages, `data-route="compounds" data-q="${U.esc(q)}"`)}
        <p class="muted small">Bảng này là chỉ mục tham chiếu cục bộ. Tính chất chi tiết chỉ hiển thị khi lấy được từ nguồn tương ứng và luôn kèm provenance.</p>
      </div>`;
    },
    after(ctx) {
      const form = ctx.mount.querySelector("#compFilter");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = new FormData(form).get("q").trim();
        ctx.navigate("#/compounds" + (q ? "?q=" + encodeURIComponent(q) : ""));
      });
      ctx.mount.querySelectorAll("[data-page]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const q = btn.dataset.q || "";
          ctx.navigate(`#/compounds?page=${btn.dataset.page}${q ? "&q=" + encodeURIComponent(q) : ""}`);
        })
      );

      const liveBtn = ctx.mount.querySelector("#liveLookup");
      const out = ctx.mount.querySelector("#liveLookupOut");
      liveBtn.addEventListener("click", () => {
        out.innerHTML = h`<form class="inline-search" id="pcForm">
            <input type="search" name="q" placeholder="Tên chất, CID hoặc InChIKey…" aria-label="Tra PubChem" />
            <button class="btn btn-sm" type="submit">Tra PubChem</button>
            <button class="btn btn-sm btn-ghost" type="button" id="pcClose">Đóng</button>
          </form>
          <div id="pcOut"></div>`;
        out.querySelector("#pcClose").addEventListener("click", () => (out.innerHTML = ""));
        out.querySelector("#pcForm").addEventListener("submit", async (e) => {
          e.preventDefault();
          const q = new FormData(e.target).get("q").trim();
          if (!q) return;
          const host = out.querySelector("#pcOut");
          host.innerHTML = U.spinner("Đang truy vấn PubChem…");
          try {
            const ident = Sci.search.detectIdentifier(q);
            const hits =
              ident.type === "cid"
                ? await Sci.adapters.pubchem.search(null, { cid: ident.value })
                : ident.type === "inchikey"
                ? await Sci.adapters.pubchem.search(null, { cid: (await Sci.adapters.pubchem.byInchiKey(ident.value))[0] })
                : await Sci.adapters.pubchem.search(q, { max: 8 });
            host.innerHTML = hits.length
              ? h`<div class="result-list compact">${hits.map((r) => Sci.ui.resultCard(r))}</div>`
              : U.emptyState("PubChem không có kết quả", "Kiểm tra lại tên hoặc dùng CID/InChIKey.");
          } catch (err) {
            host.innerHTML = U.errorBox(err, { hint: "PubChem có thể đang giới hạn tần suất." });
          }
        });
      });
    },
  };

  /* ======================================================================
     In-house computation: molar mass + elemental composition from the formula.
     Rendered inside the page so the reader does not need an external
     calculator; the reported value from the source is kept side by side.
     ====================================================================== */
  function computedBlock(rec) {
    const props = rec.properties || [];
    const pick = (re) => props.find((x) => re.test(String(x.name || ""))) || null;
    const formulaProp = pick(/công thức|formula/i);
    const massProp = pick(/khối lượng mol|phân tử khối|molecular weight/i);
    const formula = (rec.identifiers && rec.identifiers.formula) || (formulaProp && formulaProp.value) || null;
    if (!formula) return h`<p class="muted small">Bản ghi không có công thức phân tử nên không thể tính tại chỗ.</p>`;

    let parsed;
    try {
      parsed = Sci.tools.parseFormula(String(formula));
    } catch (e) {
      return h`<p class="muted small">Không phân tích được công thức “${String(formula)}” để tính tại chỗ. ${U.extLink(
        "#/tools?tab=formula",
        "Mở công cụ công thức",
        { plain: true }
      )}</p>`;
    }

    const comp = parsed.composition || {};
    const elements = Object.keys(comp).sort();
    const total = parsed.molarMass;
    const rows = elements.map((el) => {
      const w = (Sci.tools.ATOMIC_WEIGHTS[el] || 0) * comp[el];
      return h`<tr>
        <td class="mono">${el}</td>
        <td class="num">${comp[el]}</td>
        <td class="num">${U.num(w, 3)}</td>
        <td class="num">${total ? U.num((w / total) * 100, 2) : "—"}</td>
      </tr>`;
    });
    const atoms = elements.reduce((s, el) => s + comp[el], 0);
    const reported = massProp && massProp.value != null ? Number(String(massProp.value).replace(/[^0-9.]/g, "")) : null;
    const diff = reported && isFinite(reported) && reported > 0 ? Math.abs(reported - total) / reported : null;

    return h`<div class="table-wrap"><table class="data-table">
        <thead><tr><th>Nguyên tố</th><th class="num">Số nguyên tử</th><th class="num">Khối lượng (g/mol)</th><th class="num">% khối lượng</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th>Tổng</th><th class="num">${atoms}</th><th class="num">${U.num(total, 3)}</th><th class="num">100</th></tr></tfoot>
      </table></div>
      <p class="small">Khối lượng mol và phần trăm khối lượng được <b>tính tại chỗ</b> từ công thức ${String(formula)} bằng khối lượng nguyên tử IUPAC 2021 — đây là giá trị tính toán, không phải phép đo của dự án.
      ${reported && isFinite(reported)
        ? diff != null && diff > 0.005
          ? h`Giá trị nguồn ghi ${U.num(reported, 3)} g/mol; chênh lệch ${U.num(diff * 100, 2)}% được giữ nguyên thay vì ghi đè.`
          : h`Khớp với giá trị nguồn (${U.num(reported, 3)} g/mol).`
        : raw("")}</p>`;
  }

  /* ======================================================================
     Compound record
     ====================================================================== */
  function parseCompoundId(id) {
    if (/^\d+$/.test(id)) return { type: "cid", value: id };
    const chebi = id.match(/^chebi[-:]?(\d+)$/i);
    if (chebi) return { type: "chebi", value: chebi[1] };
    const chembl = id.match(/^chembl[-:]?(chembl\d+)$/i);
    if (chembl) return { type: "chembl", value: chembl[1].toUpperCase() };
    return { type: "unknown", value: id };
  }

  V.compoundRecord = {
    title: "Bản ghi hợp chất",
    render(ctx) {
      const id = ctx.params.join("/");
      const parsed = parseCompoundId(id);
      return h`<div class="view-container record-view" id="compoundRecord" data-id="${id}">
        <div id="recordHead">${U.spinner("Đang tải bản ghi hợp chất…")}</div>
        <div id="recordBody"></div>
      </div>`;
    },
    after(ctx) {
      const id = ctx.params.join("/");
      const parsed = parseCompoundId(id);
      const head = ctx.mount.querySelector("#recordHead");
      const body = ctx.mount.querySelector("#recordBody");
      let cancelled = false;

      async function load() {
        let rec;
        let primarySource;
        try {
          if (parsed.type === "cid") {
            rec = await Sci.adapters.pubchem.compound(parsed.value);
            primarySource = "pubchem";
          } else if (parsed.type === "chebi") {
            rec = await Sci.adapters.chebi.entity(parsed.value);
            primarySource = "chebi";
          } else if (parsed.type === "chembl") {
            rec = await Sci.adapters.chembl.molecule(parsed.value);
            primarySource = "chembl";
          } else {
            throw new Error("Định danh hợp chất không hợp lệ.");
          }
        } catch (err) {
          head.innerHTML = U.errorBox(err, { hint: "Kiểm tra CID / ChEBI / ChEMBL ID.", retry: false });
          return;
        }
        if (cancelled) return;

        /* cross-source enrichment, each independent so one failure cannot blank the page */
        const enrich = {};
        const tasks = [];
        if (rec.identifiers.chebi && primarySource !== "chebi") {
          tasks.push(
            Sci.adapters.chebi
              .entity(rec.identifiers.chebi)
              .then((r) => (enrich.chebi = r))
              .catch((e) => (enrich.chebiError = e))
          );
        }
        if (rec.identifiers.chembl && primarySource !== "chembl") {
          tasks.push(
            Sci.adapters.chembl
              .molecule(rec.identifiers.chembl)
              .then((r) => (enrich.chembl = r))
              .catch((e) => (enrich.chemblError = e))
          );
        }
        if (rec.identifiers.cid && primarySource !== "pubchem") {
          tasks.push(
            Sci.adapters.pubchem
              .compound(rec.identifiers.cid)
              .then((r) => (enrich.pubchem = r))
              .catch((e) => (enrich.pubchemError = e))
          );
        }

        head.innerHTML = compoundHead(rec, primarySource);
        wireCopy(ctx.mount);
        body.innerHTML = h`
          <div class="record-grid">
            <div class="record-main">
              ${ui.section("properties", "Tính chất & định danh", h`<div id="propsBlock"></div>`)}
              ${ui.section("computed", "Tính toán tại chỗ từ công thức", h`<div id="computedBlock"></div>`)}
              ${ui.section("bioactivity", "Hoạt tính sinh học (ChEMBL)", h`<div id="bioBlock">${U.spinner("Đang tải hoạt tính…")}</div>`)}
              ${ui.section("safety", "An toàn & phân loại GHS (PubChem)", h`<div id="ghsBlock">${U.spinner("Đang tải dữ liệu GHS…")}</div>`)}
              ${ui.section("reactions", "Phản ứng liên quan", h`<div id="rxnBlock">${U.spinner("Đang tra Rhea…")}</div>`)}
              ${ui.section("regulatory", "Thông tin quản lý dược (openFDA)", h`<div id="fdaBlock">${U.spinner("Đang tra openFDA…")}</div>`)}
              ${ui.section("literature", "Tài liệu khoa học (Europe PMC)", h`<div id="litBlock">${U.spinner("Đang tra Europe PMC…")}</div>`)}
            </div>
            <aside class="record-side">
              <div class="side-card">
                <h3>Định danh chéo</h3>
                <div id="xrefBlock"></div>
              </div>
              <div class="side-card">
                <h3>Nguồn &amp; cấp dữ liệu</h3>
                <div id="provBlock"></div>
              </div>
              <div class="side-card">
                <h3>Liên kết ngoài</h3>
                <ul class="side-list" id="linkBlock"></ul>
              </div>
            </aside>
          </div>`;

        ctx.mount.querySelector("#propsBlock").innerHTML = ui.propertiesBlock(rec, { limit: 40 });
        ctx.mount.querySelector("#computedBlock").innerHTML = computedBlock(rec);
        ctx.mount.querySelector("#xrefBlock").innerHTML =
          ui.identifierBlock(rec) || h`<p class="muted small">Chưa có định danh chéo.</p>`;
        wireCopy(ctx.mount);
        ctx.mount.querySelector("#provBlock").innerHTML = ui.provenanceBlock(rec);
        ctx.mount.querySelector("#linkBlock").innerHTML = Object.keys(rec.links || {})
          .filter((k) => rec.links[k])
          .map((k) => h`<li>${U.extLink(rec.links[k], linkLabel(k))}</li>`)
          .join("");

        await Promise.all(tasks);
        if (cancelled) return;

        /* merge enrichment into a unified view */
        const allRecords = [rec].concat(Object.keys(enrich).filter((k) => !k.endsWith("Error") && enrich[k]).map((k) => enrich[k]));
        const merged = allRecords[0];
        allRecords.slice(1).forEach((r) => Sci.entity.merge(merged, r));
        if (allRecords.length > 1) {
          ctx.mount.querySelector("#propsBlock").innerHTML = ui.propertiesBlock(merged, { limit: 60 });
          ctx.mount.querySelector("#computedBlock").innerHTML = computedBlock(merged);
          ctx.mount.querySelector("#xrefBlock").innerHTML = ui.identifierBlock(merged);
          ctx.mount.querySelector("#provBlock").innerHTML = ui.provenanceBlock(merged);
          wireCopy(ctx.mount);
        }

        /* bioactivity */
        const chemblRec = enrich.chembl || (primarySource === "chembl" ? rec : null);
        const bioEl = ctx.mount.querySelector("#bioBlock");
        if (chemblRec && chemblRec.extra && chemblRec.extra.activities && chemblRec.extra.activities.length) {
          bioEl.innerHTML = h`<div class="table-wrap"><table class="data-table">
            <thead><tr><th>Loại</th><th>Giá trị</th><th>Đơn vị</th><th>Target</th><th>Assay</th></tr></thead>
            <tbody>${chemblRec.extra.activities.map(
              (a) => h`<tr>
                <td class="mono">${a.standard_type || a.type || "—"}</td>
                <td class="num">${a.standard_value != null ? U.num(a.standard_value) : "—"}</td>
                <td>${a.standard_units || "—"}</td>
                <td class="small">${a.target_pref_name || a.target_chembl_id || "—"}</td>
                <td class="mono small">${a.assay_chembl_id || "—"}</td>
              </tr>`
            )}</tbody></table></div>
            <p class="muted small">Hoạt tính là dữ liệu thực nghiệm/curated từ ChEMBL (CC BY-SA 3.0). Không suy ra hiệu lực lâm sàng từ IC50/Ki in vitro.</p>`;
        } else if (enrich.chemblError) {
          bioEl.innerHTML = ui.emptySource("chembl", enrich.chemblError);
        } else if (chemblRec) {
          bioEl.innerHTML = h`<p class="muted">ChEMBL chưa trả về bản ghi hoạt tính cho chất này. ${U.extLink(
            "https://www.ebi.ac.uk/chembl/g/#search_results/all/query=" + encodeURIComponent(merged.title),
            "Tra trên ChEMBL"
          )}</p>`;
        } else {
          bioEl.innerHTML = h`<p class="muted">Không tìm thấy bản ghi ChEMBL tương ứng. ${U.extLink(
            "https://www.ebi.ac.uk/chembl/g/#search_results/all/query=" + encodeURIComponent(merged.title),
            "Tra ChEMBL theo tên"
          )}</p>`;
        }

        /* GHS */
        const ghsEl = ctx.mount.querySelector("#ghsBlock");
        const ghs = (merged.extra && merged.extra.ghs) || [];
        if (ghs.length) {
          ghsEl.innerHTML = h`${ghs.map(
            (g) => h`<div class="ghs-row"><span class="ghs-section">${g.section}</span><span>${g.text}</span></div>`
          )}<p class="muted small">Nguồn: PubChem PUG-View (tổng hợp từ ECHA/HSDB/CAMEO và contributor khác). Luôn kiểm tra SDS chính thức trước khi làm việc với hóa chất.</p>
          ${ui.safetyNotice("Thông tin GHS chỉ mang tính tham khảo, không thay thế SDS của nhà sản xuất hoặc tư vấn cấp cứu chuyên nghiệp.")}`;
        } else if (merged.extra && merged.extra.cid) {
          ghsEl.innerHTML = h`<p class="muted">PubChem không cung cấp mục GHS Classification cho CID này. ${U.extLink(
            "https://pubchem.ncbi.nlm.nih.gov/compound/" + merged.extra.cid + "#section=Safety-and-Hazards",
            "Xem mục an toàn trên PubChem"
          )}</p>`;
        } else {
          ghsEl.innerHTML = h`<p class="muted">Chưa có CID để truy vấn GHS.</p>`;
        }

        /* Rhea reactions + local name matches */
        const rxnEl = ctx.mount.querySelector("#rxnBlock");
        const localMatches = (root.OPEN_REACTIONS || []).filter((r) => {
          const names = (r.reactants || []).concat(r.products || []).map((x) => (x.name || "").toLowerCase());
          return names.includes(String(merged.title).toLowerCase());
        });
        const parts = [rec].concat(allRecords.slice(1));
        const chebiIds = parts.map((r) => r.identifiers && r.identifiers.chebi).filter(Boolean);
        let rheaRows = [];
        if (chebiIds.length) {
          try {
            rheaRows = await Sci.adapters.rhea.byChebi(chebiIds[0]);
          } catch (e) {
            rheaRows = [];
          }
        }
        if (cancelled) return;
        rxnEl.innerHTML = h`
          ${localMatches.length
            ? h`<h3 class="sub-h">Bản ghi phản ứng cục bộ</h3><ul class="link-list">${localMatches.slice(0, 8).map(
                (r) => h`<li><a href="#/reactions/ord/${encodeURIComponent(r.reaction_id)}">${(r.reactants || []).map((x) => x.name).join(" + ")} → ${(r.products || [])
                  .map((x) => x.name)
                  .join(" + ")}</a> <span class="muted small">${r.reaction_id}</span></li>`
              )}</ul>`
            : raw("")}
          ${rheaRows.length
            ? h`<h3 class="sub-h">Phản ứng sinh hóa (Rhea)</h3><ul class="link-list">${rheaRows.slice(0, 8).map(
                (r) => h`<li><a href="#/reactions/rhea/${encodeURIComponent(r.identifiers.rhea)}">${r.extra.equation}</a>
                  <span class="muted small">${r.identifiers.rhea}${r.identifiers.ec ? " · " + r.identifiers.ec : ""}</span></li>`
              )}</ul>`
            : raw("")}
          ${!localMatches.length && !rheaRows.length
            ? h`<p class="muted">Không tìm thấy phản ứng chứa chất này trong dữ liệu cục bộ hoặc Rhea. ${U.extLink(
                "https://www.rhea-db.org/rhea?query=" + encodeURIComponent(merged.title),
                "Tra Rhea theo tên"
              )}</p>`
            : raw("")}`;

        /* openFDA */
        const fdaEl = ctx.mount.querySelector("#fdaBlock");
        try {
          const drug = await Sci.adapters.openfda.drug(merged.title);
          if (cancelled) return;
          if (drug) {
            fdaEl.innerHTML = h`${ui.dataNotice("openFDA: dữ liệu quản lý, không dùng cho quyết định điều trị cá nhân.")}
              <h3 class="sub-h">${drug.title}</h3>
              <p class="small">${drug.subtitle || ""}</p>
              ${drug.extra.boxedWarning ? h`<div class="boxed-warning"><b>Cảnh báo khung (boxed warning):</b> ${U.truncate(drug.extra.boxedWarning, 700)}</div>` : raw("")}
              ${drug.extra.indications ? h`<details class="fold"><summary>Chỉ định</summary><p>${U.truncate(drug.extra.indications, 1600)}</p></details>` : raw("")}
              ${drug.extra.contraindications ? h`<details class="fold"><summary>Chống chỉ định</summary><p>${U.truncate(drug.extra.contraindications, 1200)}</p></details>` : raw("")}
              ${drug.extra.warnings ? h`<details class="fold"><summary>Cảnh báo</summary><p>${U.truncate(drug.extra.warnings, 1400)}</p></details>` : raw("")}
              <p class="small">${U.extLink("#/pharma/drug/" + encodeURIComponent(drug.title), "Mở hồ sơ dược chất đầy đủ →", { plain: true })}</p>`;
          } else {
            fdaEl.innerHTML = h`<p class="muted">Không có nhãn thuốc FDA khớp tên này — hợp chất có thể không phải dược chất hoặc dùng tên khác. ${U.extLink(
              "https://open.fda.gov/apis/drug/label/",
              "Tra openFDA"
            )}</p>`;
          }
        } catch (e) {
          if (!cancelled) fdaEl.innerHTML = ui.emptySource("openfda", e);
        }

        /* literature */
        const litEl = ctx.mount.querySelector("#litBlock");
        try {
          const pub = await Sci.adapters.literature.search(merged.title, { max: 5 });
          if (cancelled) return;
          litEl.innerHTML = pub.length
            ? h`<ul class="pub-list">${pub.map(
                (p) => h`<li><a href="${p.route}">${p.title}</a><span class="pub-meta">${p.subtitle}</span></li>`
              )}</ul><p class="muted small">Metadata từ Europe PMC. Không sao chép toàn văn có bản quyền.</p>`
            : h`<p class="muted">Không có bài báo khớp tên chất này trong Europe PMC.</p>`;
        } catch (e) {
          if (!cancelled) litEl.innerHTML = ui.emptySource("europe-pmc", e);
        }

        /* citation */
        body.insertAdjacentHTML(
          "beforeend",
          `<div class="record-footer" id="citeFoot">${ui.citationBlock(merged)}</div>`
        );
        wireCopy(ctx.mount);
      }

      load();
      ctx.cleanup(() => (cancelled = true));
    },
  };

  function compoundHead(rec, primarySource) {
    const img = rec.links && rec.links.structure2d;
    const cid = rec.identifiers && rec.identifiers.cid;
    return h`<header class="record-head">
      <div class="rh-main">
        ${ui.kindBadge("compound")}
        <h1>${rec.title}</h1>
        <p class="rh-sub">${rec.subtitle || ""}</p>
        <div class="rh-ids">
          ${ui.identifierBlock(rec)}
        </div>
        <div class="rh-actions">
          ${cid ? U.extLink("https://pubchem.ncbi.nlm.nih.gov/compound/" + cid, "PubChem") : raw("")}
          ${rec.identifiers && rec.identifiers.chebi ? U.extLink("https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:" + rec.identifiers.chebi, "ChEBI") : raw("")}
          ${rec.identifiers && rec.identifiers.chembl ? U.extLink("https://www.ebi.ac.uk/chembl/compound_report_card/" + rec.identifiers.chembl + "/", "ChEMBL") : raw("")}
          <a class="btn btn-sm btn-ghost" href="#/graph?q=${encodeURIComponent(rec.title)}">Xem trong đồ thị</a>
        </div>
      </div>
      ${img
        ? h`<figure class="structure-figure">
            <img src="${img}" alt="Cấu trúc 2D của ${U.esc(rec.title)} (ảnh từ PubChem)" loading="lazy" decoding="async" />
            <figcaption>Cấu trúc 2D · ${U.extLink("https://pubchem.ncbi.nlm.nih.gov/compound/" + (cid || ""), "nguồn PubChem")}</figcaption>
            ${cid ? h`<a class="small" href="https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=3D-Conformer" target="_blank" rel="noopener">Xem mô hình 3D trên PubChem ↗</a>` : raw("")}
          </figure>`
        : raw("")}
    </header>`;
  }

  function linkLabel(k) {
    return {
      pubchem: "PubChem",
      structure2d: "Ảnh cấu trúc 2D",
      chebi: "ChEBI",
      chembl: "ChEMBL",
      uniprot: "UniProt",
      pdb: "RCSB PDB",
      viewer: "Trình xem 3D",
      doi: "DOI",
      europepmc: "Europe PMC",
      pubmed: "PubMed",
      rhea: "Rhea",
      reactome: "Reactome",
      rxnav: "RxNav",
      openfda: "openFDA",
    }[k] || k;
  }

  function wireCopy(scope) {
    scope.querySelectorAll("[data-copy]").forEach((btn) => {
      if (btn._wired) return;
      btn._wired = true;
      btn.addEventListener("click", async () => {
        const ok = await U.copy(btn.dataset.copy);
        U.toast(ok ? "Đã sao chép" : "Không sao chép được", ok ? "info" : "warn");
      });
    });
  }
  Sci.ui.wireCopy = wireCopy;

  /* ======================================================================
     Element record
     ====================================================================== */
  V.elementRecord = {
    title: "Nguyên tố",
    render(ctx) {
      const z = Number(ctx.params[0]);
      const els = (root.ELEMENTS || []).concat(root.THEORETICAL_ELEMENTS || []);
      const el = els.find((e) => Number(e.z) === z);
      if (!el) return U.emptyState("Không tìm thấy nguyên tố", "Z = " + z + " không có trong bảng.", h`<a class="btn" href="#/elements">Bảng tuần hoàn</a>`);
      const theoretical = z > 118;
      const catLabel = (root.CAT_LABELS && root.CAT_LABELS[el.cat]) || el.cat;
      const compounds = (root.OPEN_COMPOUNDS || []).filter((c) => {
        const elsIn = Sci.tools.elementsInFormula(c.molecular_formula || "");
        return elsIn.includes(el.sym);
      });
      const materials = (root.MATERIALS || []).filter((m) => new RegExp(`${el.sym}\\d`).test(m.content || ""));
      return h`<div class="view-container record-view">
        <header class="record-head element-head">
          <div class="element-hero cat-${el.cat}">
            <span class="eh-z">${el.z}</span>
            <span class="eh-sym">${el.sym}</span>
            <span class="eh-mass">${el.mass}</span>
          </div>
          <div class="rh-main">
            ${ui.kindBadge("element")}
            <h1>${el.name} (${el.sym})</h1>
            <p class="rh-sub">${catLabel} · ${theoretical ? "Chưa tổng hợp — dự đoán lý thuyết" : `Chu kỳ ${el.period}, nhóm ${el.group}`}</p>
            <div class="rh-actions">
              <a class="btn btn-sm btn-ghost" href="#/elements">← Bảng tuần hoàn</a>
              ${U.extLink(`https://pubchem.ncbi.nlm.nih.gov/periodic-table/#${el.sym}`, "PubChem Periodic Table")}
              ${U.extLink(`https://webbook.nist.gov/cgi/cbook.cgi?Name=${encodeURIComponent(el.name)}&Units=SI`, "NIST WebBook")}
            </div>
          </div>
        </header>
        <div class="record-grid">
          <div class="record-main">
            ${ui.section(
              "el-props",
              "Tính chất nguyên tử",
              ui.propertiesBlock(
                {
                  properties: [
                    ["Khối lượng nguyên tử", el.mass, "u", "reported"],
                    ["Cấu hình electron", el.config, null, "reported"],
                    ["Nhiệt độ nóng chảy", el.mp, "°C", "reported"],
                    ["Nhiệt độ sôi", el.bp, "°C", "reported"],
                    ["Chu kỳ", el.period, null, "reported"],
                    ["Nhóm", el.group, null, "reported"],
                  ]
                    .filter((p) => p[1] !== null && p[1] !== undefined && p[1] !== "")
                    .map((p) =>
                      Sci.entity.property({
                        name: p[0],
                        value: p[1],
                        unit: p[2],
                        kind: p[3],
                        source: "local",
                        recordId: "element:" + el.z,
                        sourceLabel: "Dữ liệu biên soạn",
                      })
                    ),
                  provenance: [{ source: "local", recordId: "element:" + el.z, dataType: "curated" }],
                },
                { footnote: "Dữ liệu nguyên tố được biên soạn nội bộ (giá trị tham chiếu phổ thông). Với số liệu nghiên cứu, đối chiếu NIST/PubChem." }
              )
            )}
            ${ui.section("el-use", "Ứng dụng", h`<p>${el.use || "Chưa có ghi chú."}</p>`)}
            ${ui.section(
              "el-compounds",
              `Hợp chất chứa ${el.sym} trong chỉ mục cục bộ`,
              compounds.length
                ? h`<div class="chip-grid">${compounds.slice(0, 24).map(
                    (c) => h`<a class="compound-chip" href="#/compounds/${c.compound_cid}">
                      <span class="cc-name">${c.common_name}</span>
                      <span class="cc-formula mono">${c.molecular_formula}</span>
                    </a>`
                  )}</div>${compounds.length > 24 ? h`<p class="muted small">… và ${compounds.length - 24} hợp chất khác.</p>` : raw("")}`
                : h`<p class="muted">Không có hợp chất nào chứa ${el.sym} trong tập cục bộ. ${U.extLink(
                    "https://pubchem.ncbi.nlm.nih.gov/#query=" + encodeURIComponent(el.sym),
                    "Tra PubChem"
                  )}</p>`
            )}
            ${materials.length
              ? ui.section(
                  "el-materials",
                  "Vật liệu liên quan",
                  h`<ul class="link-list">${materials.slice(0, 10).map(
                    (m) => h`<li><a href="#/materials/${m.id}">${m.icon} ${m.name}</a></li>`
                  )}</ul>`
                )
              : raw("")}
          </div>
          <aside class="record-side">
            <div class="side-card">
              <h3>Vị trí bảng tuần hoàn</h3>
              <p>${catLabel}${theoretical ? "" : ` · khối ${el.cat === "lanthanide" || el.cat === "actinide" ? "f" : el.group <= 2 ? "s" : el.group >= 13 ? "p" : "d"}`}</p>
              <a class="btn btn-sm btn-ghost" href="#/elements">Xem trong bảng đầy đủ</a>
            </div>
            <div class="side-card">
              <h3>Ghi chú dữ liệu</h3>
              <p class="small muted">Bảng tuần hoàn là dữ liệu biên soạn nội bộ. Các giá trị nhiệt độ và khối lượng là giá trị tham chiếu, không phải phép đo của dự án.</p>
            </div>
          </aside>
        </div>
      </div>`;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
