/* =========================================================================
   Pharmaceutical, biochemistry and literature views
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const ui = Sci.ui;
  const V = (Sci.views = Sci.views || {});

  function quickChips(items, attr) {
    return h`<div class="example-row">${items.map(
      (x) => h`<button class="example-chip" ${raw(`${attr}="${U.esc(x)}"`)}>${x}</button>`
    )}</div>`;
  }

  /* ======================================================================
     Pharma explorer
     ====================================================================== */
  V.pharma = {
    title: "Dược phẩm",
    render(ctx) {
      const tab = ctx.query.get("tab") || "fda";
      const q = ctx.query.get("q") || "";
      const tabs = [
        { id: "fda", label: "Nhãn thuốc FDA" },
        { id: "rxnorm", label: "RxNorm concepts" },
        { id: "chembl", label: "ChEMBL molecules" },
      ];
      return h`<div class="view-container">
        ${U.sectionHead(
          "Pharmaceuticals",
          "Dược phẩm & thông tin quản lý",
          "Nhãn thuốc FDA (openFDA), từ vựng RxNorm và phân tử ChEMBL. Thông tin quản lý được tách khỏi dữ liệu nghiên cứu và báo cáo biến cố."
        )}
        ${ui.safetyNotice(
          "Nội dung dược lý trên website chỉ mang tính tham khảo, không phải hướng dẫn chẩn đoán hay kê đơn. Không tự thay đổi liều hoặc ngừng thuốc."
        )}
        <div class="panel-grid three">
          <a class="panel panel-link" href="#/pharma?tab=fda">
            <h2>openFDA</h2>
            <p>Nhãn thuốc đã phê duyệt, cảnh báo khung, chỉ định, chống chỉ định, thu hồi và báo cáo biến cố bất lợi.</p>
            <span class="panel-cta">Tra nhãn FDA →</span>
          </a>
          <a class="panel panel-link" href="#/pharma?tab=rxnorm">
            <h2>RxNorm / RxNav</h2>
            <p>RxCUI, thành phần hoạt chất, dạng bào chế, nồng độ, quan hệ generic–thương mại và lớp thuốc.</p>
            <span class="panel-cta">Tra RxNorm →</span>
          </a>
          <a class="panel panel-link" href="#/pharma?tab=chembl">
            <h2>ChEMBL</h2>
            <p>Phân tử giống thuốc, target sinh học, hoạt tính IC50/Ki/EC50 và giai đoạn phát triển.</p>
            <span class="panel-cta">Tra ChEMBL →</span>
          </a>
        </div>
        ${U.pillTabs(tabs, tab, 'id="pharmaTabs"')}
        <div class="tab-panel">
          <form class="inline-search" id="pharmaForm">
            <input name="q" value="${q}" placeholder="${tab === "fda" ? "Tên generic hoặc brand (aspirin, metformin…)" : tab === "rxnorm" ? "Tên thuốc (metformin, Lipitor…)" : "Tên phân tử (imatinib, aspirin…)"}" aria-label="Tra cứu dược phẩm" />
            <button class="btn btn-sm" type="submit">Tra cứu</button>
          </form>
          ${quickChips(
            tab === "fda" ? ["aspirin", "metformin", "atorvastatin", "insulin"] : tab === "rxnorm" ? ["metformin", "warfarin", "amoxicillin", "lisinopril"] : ["imatinib", "aspirin", "penicillin G", "sofosbuvir"],
            "data-pharma-example"
          )}
          <div id="pharmaOut" class="mt-md"></div>
        </div>
        <section class="record-section">
          <h2>Góc y dược lâm sàng (biên soạn)</h2>
          <p>Dược lý nền tảng, điện giải, xét nghiệm, antidote, toxidrome, tương tác CYP và phác đồ cấp cứu được biên soạn riêng, tách khỏi dữ liệu quản lý ở trên.</p>
          <div class="link-row">
            <a class="btn" href="#/pharma/clinical">Mở góc y dược →</a>
            <a class="btn btn-ghost" href="#/search?q=pharmacokinetics">Tra dược động học →</a>
          </div>
        </section>
      </div>`;
    },
    after(ctx) {
      const tab = ctx.query.get("tab") || "fda";
      const form = ctx.mount.querySelector("#pharmaForm");
      const out = ctx.mount.querySelector("#pharmaOut");
      ctx.mount.querySelectorAll("#pharmaTabs [data-tab]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const q = form.querySelector("input").value.trim();
          ctx.navigate(`#/pharma?tab=${btn.dataset.tab}${q ? "&q=" + encodeURIComponent(q) : ""}`);
        })
      );

      async function run(term) {
        if (!term) return;
        out.innerHTML = U.spinner("Đang truy vấn nguồn dược phẩm…");
        try {
          if (tab === "fda") {
            const [labels, count, recalls] = await Promise.allSettled([
              Sci.adapters.openfda.labels(term, 3),
              Sci.adapters.openfda.eventCount(term),
              Sci.adapters.openfda.recalls(term),
            ]);
            const rows = labels.status === "fulfilled" ? labels.value : [];
            out.innerHTML = rows.length
              ? h`${ui.dataNotice(Sci.adapters.openfda.disclaimer)}
                <div class="result-list">${rows.map((r) => {
                  const rec = Sci.adapters.openfda.parse(r);
                  return h`<article class="result-card">
                    <div class="rc-top">${ui.kindBadge("drug")}<span class="rc-source">openFDA label</span></div>
                    <h3 class="rc-title"><a href="#/pharma/drug/${encodeURIComponent(rec.title)}">${rec.title}</a></h3>
                    <p class="rc-sub">${rec.subtitle || ""}</p>
                    <p class="small muted">NDC: ${(rec.identifiers.ndc || "—")} · Hiệu lực: ${rec.extra.effective_time || "—"}</p>
                    ${rec.extra.boxedWarning ? h`<p class="small"><b>Cảnh báo khung:</b> ${U.truncate(rec.extra.boxedWarning, 220)}</p>` : raw("")}
                  </article>`;
                })}</div>
                ${count.status === "fulfilled" && count.value != null
                  ? h`<p class="small muted">FAERS: ${U.num(count.value)} báo cáo có chứa tên thuốc này. Đây là báo cáo tự nguyện — <b>không</b> chứng minh thuốc gây ra biến cố.</p>`
                  : raw("")}
                ${recalls.status === "fulfilled" && recalls.value.length
                  ? h`<p class="small">Có ${recalls.value.length} bản ghi thu hồi liên quan (hiển thị tối đa 3 trong hồ sơ thuốc).</p>`
                  : raw("")}`
              : U.emptyState("Không có nhãn phù hợp", "openFDA chỉ chứa sản phẩm được phân phối tại Hoa Kỳ.");
          } else if (tab === "rxnorm") {
            const [rec, classes] = await Promise.allSettled([Sci.adapters.rxnorm.record(term), Sci.adapters.rxnorm.classes(term)]);
            if (rec.status !== "fulfilled" || !rec.value) {
              out.innerHTML = U.emptyState("Không có khái niệm RxNorm", "Thử tên generic hoặc tên thương mại khác.");
              return;
            }
            const r = rec.value;
            out.innerHTML = h`<div class="result-list">${[r].map((x) => Sci.ui.resultCard({
              source: "rxnorm",
              kind: "drug",
              title: x.title,
              subtitle: x.subtitle,
              identifiers: x.identifiers,
              why: "Khái niệm RxNorm chuẩn hóa",
              route: "#/pharma/drug/" + encodeURIComponent(x.title),
            }))}</div>
            <div class="panel">
              <h3>Khái niệm theo loại (TTY)</h3>
              ${ui.propertiesBlock(r, { limit: 20 })}
            </div>
            ${classes.status === "fulfilled" && classes.value.length
              ? h`<div class="panel"><h3>Lớp thuốc (RxClass)</h3><ul class="link-list">${classes.value.slice(0, 10).map(
                  (c) => h`<li><span>${c.className}</span> <span class="muted small">${c.classType || ""}</span></li>`
                )}</ul></div>`
              : raw("")}`;
          } else {
            const hits = await Sci.adapters.chembl.search(term, { max: 6 });
            out.innerHTML = hits.length
              ? h`<div class="result-list">${hits.map((x) => Sci.ui.resultCard(x))}</div>
                <p class="muted small">ChEMBL · CC BY-SA 3.0. Hoạt tính in vitro không đồng nghĩa hiệu quả lâm sàng.</p>`
              : U.emptyState("Không có phân tử ChEMBL", "Thử tên khác hoặc tra theo ChEMBL ID.");
          }
        } catch (e) {
          out.innerHTML = U.errorBox(e, { hint: "Nguồn có thể đang giới hạn tần suất. Thử lại sau ít phút." });
        }
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const term = new FormData(form).get("q").trim();
        ctx.navigate(`#/pharma?tab=${tab}${term ? "&q=" + encodeURIComponent(term) : ""}`);
        run(term);
      });
      ctx.mount.querySelectorAll("[data-pharma-example]").forEach((b) =>
        b.addEventListener("click", () => {
          form.querySelector("input").value = b.dataset.pharmaExample;
          run(b.dataset.pharmaExample);
        })
      );
      const initial = ctx.query.get("q");
      if (initial) run(initial);
    },
  };

  /* ======================================================================
     Drug record
     ====================================================================== */
  V.drugRecord = {
    title: "Hồ sơ dược chất",
    render() {
      return h`<div class="view-container record-view" id="drugRecord">${U.spinner("Đang tổng hợp hồ sơ thuốc từ openFDA, RxNav và ChEMBL…")}</div>`;
    },
    after(ctx) {
      const host = ctx.mount.querySelector("#drugRecord");
      const name = decodeURIComponent(ctx.params[0] || "");
      let cancelled = false;
      ctx.cleanup(() => (cancelled = true));

      const curated = (root.DRUGS || []).find((d) => {
        const a = Sci.search.fold(String(d.n).replace(/\(.*?\)/g, "")).trim();
        const b = Sci.search.fold(name).trim();
        return a === b || a.includes(b) || b.includes(a);
      });

      Promise.allSettled([
        Sci.adapters.openfda.drug(name),
        Sci.adapters.openfda.eventCount(name),
        Sci.adapters.openfda.recalls(name),
        Sci.adapters.rxnorm.record(name),
        Sci.adapters.rxnorm.classes(name),
        Sci.adapters.chembl.search(name, { max: 1 }).then((r) => (r.length ? Sci.adapters.chembl.molecule(r[0].identifiers.chembl) : null)),
      ]).then(([fdaR, countR, recallsR, rxR, classesR, chemblR]) => {
        if (cancelled) return;
        const fda = fdaR.status === "fulfilled" ? fdaR.value : null;
        const rx = rxR.status === "fulfilled" ? rxR.value : null;
        const chembl = chemblR.status === "fulfilled" ? chemblR.value : null;
        const count = countR.status === "fulfilled" ? countR.value : null;
        const recalls = recallsR.status === "fulfilled" ? recallsR.value : [];
        const classes = classesR.status === "fulfilled" ? classesR.value : [];

        if (!fda && !rx && !chembl && !curated) {
          host.innerHTML = U.emptyState(
            "Không tìm thấy thuốc",
            "Không có bản ghi khớp trong openFDA, RxNorm, ChEMBL hoặc dữ liệu biên soạn.",
            h`<a class="btn" href="#/pharma">← Tra cứu dược phẩm</a>`
          );
          return;
        }

        const merged = fda || (rx ? rx : chembl);
        const title = (fda && fda.title) || (rx && rx.title) || name;
        host.innerHTML = h`<header class="record-head">
          <div class="rh-main">
            ${ui.kindBadge("drug")}
            <h1>${title}</h1>
            <p class="rh-sub">${[fda && fda.subtitle, rx && rx.subtitle].filter(Boolean).join(" · ")}</p>
            <div class="rh-actions">
              <a class="btn btn-sm btn-ghost" href="#/pharma">← Tra cứu</a>
              ${fda ? U.extLink("https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=" + encodeURIComponent(title), "DailyMed") : raw("")}
              ${rx ? U.extLink("https://mor.nlm.nih.gov/RxNav/search?searchBy=String&searchTerm=" + encodeURIComponent(title), "RxNav") : raw("")}
              ${chembl ? U.extLink("https://www.ebi.ac.uk/chembl/compound_report_card/" + chembl.identifiers.chembl + "/", "ChEMBL") : raw("")}
            </div>
          </div>
        </header>
        ${ui.safetyNotice(
          "Thông tin dưới đây là dữ liệu quản lý/nghiên cứu, không phải chỉ định điều trị cho cá nhân. Không dùng để tự dùng thuốc, tự đổi liều hoặc xử lý cấp cứu."
        )}
        <div class="record-grid">
          <div class="record-main">
            ${ui.section(
              "drug-label",
              "Nhãn thuốc đã phê duyệt (openFDA)",
              fda
                ? h`${fda.extra.boxedWarning ? h`<div class="boxed-warning"><b>Cảnh báo khung:</b> ${fda.extra.boxedWarning}</div>` : raw("")}
                  ${[
                    ["Chỉ định", fda.extra.indications],
                    ["Liều & cách dùng (nguyên văn nhãn)", fda.extra.dosage],
                    ["Chống chỉ định", fda.extra.contraindications],
                    ["Cảnh báo & thận trọng", fda.extra.warnings],
                    ["Phản ứng bất lợi", fda.extra.adverseReactions],
                    ["Tương tác thuốc", fda.extra.interactions],
                  ]
                    .filter((x) => x[1])
                    .map(
                      (x) => h`<details class="fold" ${x[0] === "Chỉ định" ? raw("open") : raw("")}>
                        <summary>${x[0]}</summary>
                        <p>${U.truncate(x[1], 2400)}</p>
                      </details>`
                    )}
                  <p class="muted small">Nguồn: openFDA drug label (public domain). Nội dung nguyên văn từ nhãn, không được biên tập lại thành khuyến cáo.</p>`
                : h`<p class="muted">Không có nhãn openFDA khớp tên này (openFDA bao phủ sản phẩm lưu hành tại Hoa Kỳ).</p>`
            )}
            ${ui.section(
              "drug-rxnorm",
              "RxNorm · khái niệm & lớp thuốc",
              rx
                ? h`${ui.propertiesBlock(rx, { limit: 16 })}
                  ${classes.length
                    ? h`<h3 class="sub-h">Lớp thuốc (RxClass)</h3><ul class="link-list">${classes.slice(0, 12).map(
                        (c) => h`<li>${c.className} <span class="muted small">${c.classType || ""}${c.relation ? " · " + c.relation : ""}</span></li>`
                      )}</ul>`
                    : raw("")}`
                : h`<p class="muted">Không có khái niệm RxNorm cho tên này.</p>`
            )}
            ${ui.section(
              "drug-chembl",
              "ChEMBL · phân tử & hoạt tính",
              chembl
                ? h`<p><a href="#/compounds/chembl-${chembl.identifiers.chembl}">${chembl.title}</a> <span class="mono small">${chembl.identifiers.chembl}</span></p>
                  ${ui.propertiesBlock(chembl, { limit: 12 })}
                  ${chembl.extra.activities && chembl.extra.activities.length
                    ? h`<h3 class="sub-h">Hoạt tính sinh học</h3><div class="table-wrap"><table class="data-table">
                        <thead><tr><th>Loại</th><th>Giá trị</th><th>Đơn vị</th><th>Target</th></tr></thead>
                        <tbody>${chembl.extra.activities.slice(0, 10).map(
                          (a) => h`<tr><td class="mono">${a.standard_type || "—"}</td><td class="num">${a.standard_value != null ? U.num(a.standard_value) : "—"}</td><td>${a.standard_units || "—"}</td><td class="small">${a.target_pref_name || "—"}</td></tr>`
                        )}</tbody></table></div>`
                    : raw("")}`
                : h`<p class="muted">Không có bản ghi ChEMBL khớp tên.</p>`
            )}
            ${ui.section(
              "drug-safety",
              "Tín hiệu an toàn & thu hồi",
              h`${count != null
                ? h`<p><b>${U.num(count)}</b> báo cáo biến cố bất lợi (FAERS) có chứa tên thuốc này. <span class="muted">Báo cáo tự nguyện, không đại diện tỷ lệ và không chứng minh nhân quả.</span></p>`
                : h`<p class="muted">Không truy vấn được số báo cáo FAERS.</p>`}
              ${recalls.length
                ? h`<h3 class="sub-h">Thu hồi / enforcement</h3><ul class="link-list">${recalls.map(
                    (r) => h`<li>${r.product_description || r.reason_for_recall || "—"} <span class="muted small">${r.recall_initiation_date || ""} · ${r.classification || ""}</span></li>`
                  )}</ul>`
                : h`<p class="muted small">Không có bản ghi thu hồi khớp trong openFDA enforcement.</p>`}`
            )}
            ${curated
              ? ui.section(
                  "drug-editorial",
                  "Ghi chú biên soạn (không phải nguồn quản lý)",
                  h`${ui.kv([
                    ["Nhóm dược lý", curated.cls],
                    ["Năm", curated.y],
                    ["Cơ chế (biên soạn)", curated.mech],
                    ["Ghi chú lịch sử", curated.note],
                  ])}<p class="muted small">Phần này do dự án biên soạn cho mục đích học tập; không phải nhãn FDA và không dùng để ra quyết định điều trị.</p>`
                )
              : raw("")}
          </div>
          <aside class="record-side">
            <div class="side-card"><h3>Định danh</h3>${merged ? ui.identifierBlock(merged) : h`<p class="muted small">Không có.</p>`}</div>
            <div class="side-card"><h3>Nguồn</h3>${merged ? ui.provenanceBlock(merged) : raw("")}</div>
          </aside>
        </div>
        <div class="record-footer">${merged ? ui.citationBlock(merged) : raw("")}</div>`;
        Sci.ui.wireCopy(host);
      });
    },
  };

  /* ======================================================================
     Biochemistry explorer
     ====================================================================== */
  V.biochem = {
    title: "Hóa sinh",
    render(ctx) {
      const tab = ctx.query.get("tab") || "uniprot";
      const q = ctx.query.get("q") || "";
      return h`<div class="view-container">
        ${U.sectionHead(
          "Biochemistry",
          "Hóa sinh & protein",
          "UniProt cho protein/enzyme (CC BY 4.0) và Reactome cho pathway (CC BY 4.0). Liên kết enzyme–phản ứng đi qua Rhea/EC number."
        )}
        ${U.pillTabs(
          [
            { id: "uniprot", label: "UniProt · protein" },
            { id: "reactome", label: "Reactome · pathway" },
          ],
          tab,
          'id="bioTabs"'
        )}
        <div class="tab-panel">
          <form class="inline-search" id="bioForm">
            <input name="q" value="${q}" placeholder="${tab === "uniprot" ? "Tên protein, gene hoặc accession (insulin, p53, P01308…)" : "Tên pathway hoặc ID (glycolysis, R-HSA-109582…)"}" aria-label="Tra cứu hóa sinh" />
            <button class="btn btn-sm" type="submit">Tra cứu</button>
          </form>
          ${quickChips(tab === "uniprot" ? ["insulin", "hemoglobin", "p53", "CYP3A4"] : ["glycolysis", "apoptosis", "R-HSA-109582", "TCA cycle"], "data-bio-example")}
          <div id="bioOut" class="mt-md"></div>
        </div>
        <section class="record-section">
          <h2>Phản ứng enzyme</h2>
          <p>Rhea liên kết ChEBI (chất) với UniProt (enzyme) qua EC number — nền tảng để đi từ protein sang phản ứng và ngược lại.</p>
          <div class="link-row"><a class="btn" href="#/reactions/explore?tab=rhea">Tra Rhea →</a></div>
        </section>
      </div>`;
    },
    after(ctx) {
      const tab = ctx.query.get("tab") || "uniprot";
      const form = ctx.mount.querySelector("#bioForm");
      const out = ctx.mount.querySelector("#bioOut");
      ctx.mount.querySelectorAll("#bioTabs [data-tab]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const q = form.querySelector("input").value.trim();
          ctx.navigate(`#/biochem?tab=${btn.dataset.tab}${q ? "&q=" + encodeURIComponent(q) : ""}`);
        })
      );
      async function run(term) {
        if (!term) return;
        out.innerHTML = U.spinner("Đang truy vấn " + (tab === "uniprot" ? "UniProt" : "Reactome") + "…");
        try {
          const hits = tab === "uniprot" ? await Sci.adapters.uniprot.search(term, { max: 10 }) : await Sci.adapters.reactome.search(term, { max: 8 });
          out.innerHTML = hits.length
            ? h`<div class="result-list">${hits.map((x) => Sci.ui.resultCard(x))}</div>
              <p class="muted small">${tab === "uniprot" ? "UniProt · CC BY 4.0" : "Reactome · CC BY 4.0"}</p>`
            : U.emptyState("Không có kết quả", "Thử tên gene/accession hoặc ID pathway khác.");
        } catch (e) {
          out.innerHTML = U.errorBox(e, { hint: "Kiểm tra kết nối tới EMBL-EBI." });
        }
      }
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const term = new FormData(form).get("q").trim();
        ctx.navigate(`#/biochem?tab=${tab}${term ? "&q=" + encodeURIComponent(term) : ""}`);
        run(term);
      });
      ctx.mount.querySelectorAll("[data-bio-example]").forEach((b) =>
        b.addEventListener("click", () => {
          form.querySelector("input").value = b.dataset.bioExample;
          run(b.dataset.bioExample);
        })
      );
      const initial = ctx.query.get("q");
      if (initial) run(initial);
    },
  };

  V.proteinRecord = {
    title: "Protein",
    render() {
      return h`<div class="view-container record-view" id="proteinRecord">${U.spinner("Đang tải UniProt entry…")}</div>`;
    },
    after(ctx) {
      const host = ctx.mount.querySelector("#proteinRecord");
      const acc = decodeURIComponent(ctx.params[0] || "");
      let cancelled = false;
      ctx.cleanup(() => (cancelled = true));
      Sci.adapters.uniprot
        .entry(acc)
        .then((rec) => {
          if (cancelled) return;
          const seq = rec.extra.sequence || "";
          const chunks = [];
          for (let i = 0; i < seq.length; i += 60) chunks.push({ start: i + 1, text: seq.slice(i, i + 60) });
          host.innerHTML = h`<header class="record-head">
            <div class="rh-main">
              ${ui.kindBadge("protein")}
              <h1>${rec.title}</h1>
              <p class="rh-sub">${rec.subtitle}</p>
              <div class="rh-actions">
                <a class="btn btn-sm btn-ghost" href="#/biochem">← Tra cứu hóa sinh</a>
                ${U.extLink(rec.links.uniprot, "UniProt")}
                ${U.extLink("https://www.ebi.ac.uk/interpro/protein/UniProt/" + rec.identifiers.uniprot + "/", "InterPro")}
              </div>
            </div>
          </header>
          <div class="record-grid">
            <div class="record-main">
              ${ui.section("prot-fn", "Chức năng", rec.summary ? h`<p>${rec.summary}</p>` : h`<p class="muted">UniProt không cung cấp mô tả chức năng cho entry này.</p>`)}
              ${ui.section("prot-props", "Thông tin phân tử", ui.propertiesBlock(rec, { limit: 20 }))}
              ${ui.section(
                "prot-seq",
                "Trình tự",
                seq
                  ? h`<div class="seq-block mono">${chunks.map(
                      (c) => h`<div class="seq-line"><span class="seq-no">${c.start}</span><span>${c.text.replace(/(.{10})/g, "$1 ")}</span></div>`
                    )}</div>
                    <button class="btn btn-sm" data-copy="${seq}">Sao chép trình tự</button>
                    <p class="muted small">Trình tự nguyên văn từ UniProt. Không chuyển đổi hay dự đoán cấu trúc tại đây.</p>`
                  : h`<p class="muted">Không có trình tự trong bản ghi.</p>`
              )}
              ${rec.extra.rhea && rec.extra.rhea.length
                ? ui.section(
                    "prot-rhea",
                    "Phản ứng Rhea được annotate",
                    h`<ul class="link-list">${rec.extra.rhea.slice(0, 15).map(
                      (id) => h`<li><a href="#/reactions/rhea/${encodeURIComponent(id)}">${id}</a></li>`
                    )}</ul>`
                  )
                : raw("")}
              ${rec.extra.pdb && rec.extra.pdb.length
                ? ui.section(
                    "prot-pdb",
                    "Cấu trúc PDB",
                    h`<div class="chip-grid">${rec.extra.pdb.map(
                      (id) => h`<a class="compound-chip" href="https://www.rcsb.org/structure/${id}" target="_blank" rel="noopener">
                        <span class="cc-name">PDB ${id}</span><span class="cc-formula">xem cấu trúc ↗</span></a>`
                    )}</div>`
                  )
                : raw("")}
            </div>
            <aside class="record-side">
              <div class="side-card"><h3>Định danh</h3>${ui.identifierBlock(rec)}</div>
              <div class="side-card"><h3>Từ khóa</h3><div class="chip-grid small-chips">${(rec.extra.keywords || []).map(
                (k) => h`<span class="tag">${k}</span>`
              )}</div></div>
              <div class="side-card"><h3>Provenance</h3>${ui.provenanceBlock(rec)}</div>
            </aside>
          </div>
          <div class="record-footer">${ui.citationBlock(rec)}</div>`;
          Sci.ui.wireCopy(host);
        })
        .catch((err) => {
          if (cancelled) return;
          host.innerHTML = U.errorBox(err, { hint: "Kiểm tra UniProt accession (ví dụ P01308).", retry: false });
        });
    },
  };

  V.pathwayRecord = {
    title: "Pathway",
    render() {
      return h`<div class="view-container record-view" id="pathwayRecord">${U.spinner("Đang tải Reactome entry…")}</div>`;
    },
    after(ctx) {
      const host = ctx.mount.querySelector("#pathwayRecord");
      const id = decodeURIComponent(ctx.params[0] || "");
      let cancelled = false;
      ctx.cleanup(() => (cancelled = true));
      Sci.adapters.reactome
        .entry(id)
        .then((rec) => {
          if (cancelled) return;
          host.innerHTML = h`<header class="record-head">
            <div class="rh-main">
              ${ui.kindBadge("pathway")}
              <h1>${rec.title}</h1>
              <p class="rh-sub">${rec.subtitle}</p>
              <div class="rh-actions">
                <a class="btn btn-sm btn-ghost" href="#/biochem?tab=reactome">← Reactome</a>
                ${U.extLink(rec.links.reactome, "Reactome")}
              </div>
            </div>
          </header>
          <div class="record-grid">
            <div class="record-main">
              ${ui.section("path-desc", "Mô tả", rec.summary ? h`<p>${rec.summary}</p>` : h`<p class="muted">Không có mô tả.</p>`)}
              ${ui.section("path-props", "Thông tin", ui.propertiesBlock(rec, { limit: 20 }))}
            </div>
            <aside class="record-side"><div class="side-card"><h3>Provenance</h3>${ui.provenanceBlock(rec)}</div></aside>
          </div>`;
        })
        .catch((err) => {
          if (cancelled) return;
          host.innerHTML = U.errorBox(err, { hint: "Kiểm tra Reactome stable ID (R-HSA-…).", retry: false });
        });
    },
  };

  /* ======================================================================
     Literature
     ====================================================================== */
  V.literature = {
    title: "Tài liệu khoa học",
    render(ctx) {
      const tab = ctx.query.get("tab") || "epmc";
      const q = ctx.query.get("q") || "";
      return h`<div class="view-container">
        ${U.sectionHead(
          "Scientific Literature",
          "Tài liệu khoa học",
          "Europe PMC, PubMed (metadata) và Crossref (DOI). Chỉ hiển thị metadata/abstract khi nguồn cho phép — không sao chép toàn văn có bản quyền."
        )}
        ${U.pillTabs(
          [
            { id: "epmc", label: "Europe PMC" },
            { id: "pubmed", label: "PubMed (metadata)" },
            { id: "crossref", label: "Crossref (DOI)" },
          ],
          tab,
          'id="litTabs"'
        )}
        <div class="tab-panel">
          <form class="inline-search" id="litForm">
            <input name="q" value="${q}" placeholder="Từ khóa, DOI, PMID… (ví dụ: aspirin biosynthesis)" aria-label="Tra tài liệu" />
            <button class="btn btn-sm" type="submit">Tìm</button>
          </form>
          ${quickChips(["aspirin", "CRISPR", "perovskite stability", "10.1038/nature14539"], "data-lit-example")}
          <div id="litOut" class="mt-md"></div>
        </div>
        <div class="notice notice-info"><span class="notice-icon">ℹ</span><div>
          Europe PMC cung cấp metadata mở và đánh dấu open access; bản quyền nội dung bài thuộc nhà xuất bản/tác giả.
          PubMed được dùng để lấy metadata và liên kết chính thức. Crossref dùng để xác thực DOI.
        </div></div>
      </div>`;
    },
    after(ctx) {
      const tab = ctx.query.get("tab") || "epmc";
      const form = ctx.mount.querySelector("#litForm");
      const out = ctx.mount.querySelector("#litOut");
      ctx.mount.querySelectorAll("#litTabs [data-tab]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const q = form.querySelector("input").value.trim();
          ctx.navigate(`#/literature?tab=${btn.dataset.tab}${q ? "&q=" + encodeURIComponent(q) : ""}`);
        })
      );

      async function run(term) {
        if (!term) return;
        out.innerHTML = U.spinner("Đang tìm tài liệu…");
        try {
          const hits =
            (await (tab === "epmc"
              ? Sci.adapters.literature.search(term, { max: 12 })
              : tab === "pubmed"
              ? Sci.adapters.literature.pubmedSearch(term, { max: 12 })
              : Sci.adapters.literature.crossrefSearch(term, { max: 12 }))) || [];
          out.innerHTML = hits.length
            ? h`<div class="result-list">${hits.map((x) => Sci.ui.resultCard(x))}</div>`
            : U.emptyState("Không có kết quả", "Thử từ khóa rộng hơn hoặc DOI cụ thể.");
        } catch (e) {
          out.innerHTML = U.errorBox(e, { hint: "Kiểm tra kết nối tới Europe PMC/NCBI/Crossref." });
        }
      }
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const term = new FormData(form).get("q").trim();
        ctx.navigate(`#/literature?tab=${tab}${term ? "&q=" + encodeURIComponent(term) : ""}`);
        run(term);
      });
      ctx.mount.querySelectorAll("[data-lit-example]").forEach((b) =>
        b.addEventListener("click", () => {
          form.querySelector("input").value = b.dataset.litExample;
          run(b.dataset.litExample);
        })
      );
      const initial = ctx.query.get("q");
      if (initial) run(initial);
    },
  };

  V.publicationRecord = {
    title: "Công bố khoa học",
    render() {
      return h`<div class="view-container record-view" id="pubRecord">${U.spinner("Đang tải metadata bài báo…")}</div>`;
    },
    after(ctx) {
      const host = ctx.mount.querySelector("#pubRecord");
      const idType = ctx.params[0];
      const id = decodeURIComponent(ctx.params.slice(1).join("/"));
      let cancelled = false;
      ctx.cleanup(() => (cancelled = true));

      Sci.adapters.literature
        .byId(id, idType === "doi" ? "doi" : "pmid")
        .then(async (rec) => {
          if (cancelled) return;
          let crossref = null;
          if (rec.identifiers.doi) {
            try {
              crossref = await Sci.adapters.literature.crossrefDoi(rec.identifiers.doi);
            } catch (e) {
              crossref = null;
            }
          }
          if (cancelled) return;
          host.innerHTML = h`<header class="record-head">
            <div class="rh-main">
              ${ui.kindBadge("publication")}
              <h1>${rec.title}</h1>
              <p class="rh-sub">${rec.subtitle}</p>
              <div class="rh-actions">
                <a class="btn btn-sm btn-ghost" href="#/literature">← Tài liệu</a>
                ${rec.links.doi ? U.extLink(rec.links.doi, "DOI") : raw("")}
                ${rec.links.pubmed ? U.extLink(rec.links.pubmed, "PubMed") : raw("")}
                ${rec.links.europepmc ? U.extLink(rec.links.europepmc, "Europe PMC") : raw("")}
              </div>
            </div>
          </header>
          <div class="record-grid">
            <div class="record-main">
              ${ui.section(
                "pub-abstract",
                "Abstract",
                rec.extra.abstract
                  ? h`<p class="abstract">${U.truncate(rec.extra.abstract, 4000)}</p>
                    <p class="muted small">Abstract hiển thị theo chính sách của nguồn; bản quyền thuộc tác giả/nhà xuất bản.</p>`
                  : h`<p class="muted">Nguồn không cung cấp abstract cho bản ghi này.</p>`
              )}
              ${crossref
                ? ui.section(
                    "pub-crossref",
                    "Metadata Crossref",
                    ui.kv([
                      ["Tạp chí", crossref.journal],
                      ["Nhà xuất bản", crossref.publisher],
                      ["Loại", crossref.type],
                      ["Năm", crossref.year],
                      ["Giấy phép", (crossref.license || []).join(", ") || "Không công bố"],
                    ]) + (crossref.references && crossref.references.length
                      ? h`<h3 class="sub-h">Tham chiếu (Crossref)</h3><ul class="ref-list">${crossref.references.slice(0, 12).map(
                          (r) => h`<li class="small">${r.unstructured || [r["article-title"], r["journal-title"]].filter(Boolean).join(" · ") || "—"}</li>`
                        )}</ul>`
                      : raw(""))
                  )
                : raw("")}
            </div>
            <aside class="record-side">
              <div class="side-card"><h3>Định danh</h3>${ui.identifierBlock(rec)}</div>
              <div class="side-card"><h3>Truy cập</h3>${ui.kv([
                ["Open access", rec.extra.openAccess ? "Có" : "Không / không rõ"],
                ["Số trích dẫn", rec.extra.citedBy != null ? U.num(rec.extra.citedBy) : "—"],
                ["Loại bài", rec.extra.pubType],
              ])}</div>
              <div class="side-card"><h3>Provenance</h3>${ui.provenanceBlock(rec)}</div>
            </aside>
          </div>
          <div class="record-footer">${ui.citationBlock(rec)}</div>`;
          Sci.ui.wireCopy(host);
        })
        .catch((err) => {
          if (cancelled) return;
          host.innerHTML = U.errorBox(err, {
            hint: "Kiểm tra DOI/PMID, hoặc mở trực tiếp trên doi.org / PubMed.",
            retry: false,
          });
        });
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
