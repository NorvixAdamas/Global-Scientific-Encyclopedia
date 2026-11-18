/* =========================================================================
   Scientific tools — deterministic calculations, clearly labeled as computed
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;
  const ui = Sci.ui;
  const V = (Sci.views = Sci.views || {});

  const TABS = [
    { id: "formula", label: "Công thức & khối lượng" },
    { id: "balance", label: "Cân bằng phương trình" },
    { id: "units", label: "Đơn vị" },
    { id: "solution", label: "Dung dịch & pha loãng" },
    { id: "resolve", label: "Giải mã định danh" },
    { id: "structure", label: "Cấu trúc 2D" },
  ];

  function computedNote() {
    return h`<p class="computed-note">⚙ Giá trị do công cụ tính toán tại trình duyệt từ khối lượng nguyên tử IUPAC — không phải số liệu đo hay dữ liệu nguồn.</p>`;
  }

  V.tools = {
    title: "Công cụ khoa học",
    render(ctx) {
      const tab = ctx.query.get("tab") || "formula";
      return h`<div class="view-container">
        ${U.sectionHead(
          "Scientific Tools",
          "Công cụ khoa học",
          "Tính toán cục bộ, không gửi dữ liệu đi đâu. Kết quả tính toán được dán nhãn rõ, tách khỏi số liệu đo từ nguồn."
        )}
        ${U.pillTabs(TABS, tab, 'id="toolTabs"')}
        <div class="tool-panel" id="toolPanel">${panel(tab)}</div>
      </div>`;
    },
    after(ctx) {
      const tab = ctx.query.get("tab") || "formula";
      ctx.mount.querySelectorAll("#toolTabs [data-tab]").forEach((btn) =>
        btn.addEventListener("click", () => ctx.navigate("#/tools?tab=" + btn.dataset.tab))
      );
      const host = ctx.mount.querySelector("#toolPanel");
      if (tab === "formula") wireFormula(host);
      if (tab === "balance") wireBalance(host);
      if (tab === "units") wireUnits(host);
      if (tab === "solution") wireSolution(host);
      if (tab === "resolve") wireResolve(host);
      if (tab === "structure") wireStructure(host);
    },
  };

  function panel(tab) {
    if (tab === "balance") {
      return h`<section class="tool-card">
        <h2>Cân bằng phương trình hóa học</h2>
        <p class="muted small">Dùng dấu <code>+</code> có khoảng trắng giữa các chất. Hỗ trợ ngoặc, hydrat (·) và công thức thường.</p>
        <form id="balanceForm" class="tool-form">
          <label>Công thức thô
            <input name="eq" value="C3H8 + O2 -> CO2 + H2O" aria-label="Phương trình chưa cân bằng" />
          </label>
          <button class="btn" type="submit">Cân bằng</button>
        </form>
        <div class="example-row">
          ${["H2 + O2 -> H2O", "Fe + O2 -> Fe2O3", "C3H8 + O2 -> CO2 + H2O", "Al + Fe2O3 -> Al2O3 + Fe", "CaCO3 -> CaO + CO2"].map(
            (e) => h`<button class="example-chip" data-balance-example="${e}">${e}</button>`
          )}
        </div>
        <div id="balanceOut"></div>
      </section>`;
    }
    if (tab === "units") {
      const cats = Object.keys(Sci.tools.UNITS);
      return h`<section class="tool-card">
        <h2>Chuyển đổi đơn vị khoa học</h2>
        <form id="unitForm" class="tool-form grid-form">
          <label>Nhóm
            <select name="category">${cats.map(
              (c) => h`<option value="${c}" ${c === "concentration" ? raw("selected") : raw("")}>${Sci.tools.UNITS[c].label}</option>`
            )}</select>
          </label>
          <label>Giá trị<input name="value" type="number" step="any" value="1" /></label>
          <label>Từ<select name="from" id="unitFrom"></select></label>
          <label>Sang<select name="to" id="unitTo"></select></label>
          <button class="btn" type="submit">Chuyển đổi</button>
        </form>
        <div id="unitOut"></div>
      </section>`;
    }
    if (tab === "solution") {
      return h`<div class="tool-split">
        <section class="tool-card">
          <h2>Nồng độ mol từ khối lượng</h2>
          <form id="molarityForm" class="tool-form">
            <label>Khối lượng chất tan (g)<input name="mass" type="number" step="any" value="5.844" /></label>
            <label>Công thức<input name="formula" value="NaCl" /></label>
            <label>Thể tích dung dịch (mL)<input name="volume" type="number" step="any" value="1000" /></label>
            <button class="btn" type="submit">Tính</button>
          </form>
          <div id="molarityOut"></div>
        </section>
        <section class="tool-card">
          <h2>Pha loãng (C₁V₁ = C₂V₂)</h2>
          <form id="dilutionForm" class="tool-form">
            <label>C₁ (mol/L)<input name="c1" type="number" step="any" value="1" /></label>
            <label>V₁ (mL)<input name="v1" type="number" step="any" value="10" /></label>
            <label>C₂ (mol/L)<input name="c2" type="number" step="any" value="0.1" /></label>
            <label>V₂ (mL)<input name="v2" type="number" step="any" placeholder="để trống để tính" /></label>
            <button class="btn" type="submit">Tính</button>
          </form>
          <div id="dilutionOut"></div>
        </section>
      </div>`;
    }
    if (tab === "resolve") {
      return h`<section class="tool-card">
        <h2>Giải mã định danh hóa học</h2>
        <p class="muted small">Nhập tên chất, CID, ChEBI, ChEMBL, InChIKey, InChI, DOI, PMID hoặc SMILES. Công cụ nhận diện loại định danh rồi tra đúng nguồn.</p>
        <form id="resolveForm" class="tool-form">
          <label>Định danh<input name="q" value="BSYNRYMUTXBXSQ-UHFFFAOYSA-N" aria-label="Định danh" /></label>
          <button class="btn" type="submit">Giải mã</button>
        </form>
        <div class="example-row">
          ${["aspirin", "CID 2244", "CHEBI:15377", "CHEMBL25", "RHEA:11752", "P01308", "CC(=O)OC1=CC=CC=C1C(=O)O"].map(
            (e) => h`<button class="example-chip" data-resolve-example="${e}">${e}</button>`
          )}
        </div>
        <div id="resolveOut"></div>
      </section>`;
    }
    if (tab === "structure") {
      return h`<section class="tool-card">
        <h2>Xem cấu trúc 2D</h2>
        <p class="muted small">Ảnh cấu trúc lấy từ PubChem (không tự vẽ lại). Với SMILES/InChI, công cụ tra CID trước rồi mới hiển thị.</p>
        <form id="structureForm" class="tool-form">
          <label>Tên / CID / SMILES / InChIKey<input name="q" value="caffeine" aria-label="Tra cấu trúc" /></label>
          <button class="btn" type="submit">Hiển thị</button>
        </form>
        <div id="structureOut"></div>
      </section>`;
    }
    /* formula */
    return h`<section class="tool-card">
      <h2>Khối lượng mol &amp; thành phần nguyên tố</h2>
      <p class="muted small">Hỗ trợ ngoặc, hydrat (CuSO₄·5H₂O), điện tích (SO₄²⁻).</p>
      <form id="formulaForm" class="tool-form">
        <label>Công thức<input name="formula" value="C9H8O4" aria-label="Công thức hóa học" /></label>
        <button class="btn" type="submit">Tính</button>
      </form>
      <div class="example-row">
        ${["C9H8O4", "CuSO4·5H2O", "Ca(OH)2", "C6H12O6", "Fe2(SO4)3", "C55H72MgN4O5"].map(
          (e) => h`<button class="example-chip" data-formula-example="${e}">${e}</button>`
        )}
      </div>
      <div id="formulaOut"></div>
    </section>`;
  }

  function wireFormula(host) {
    const form = host.querySelector("#formulaForm");
    const out = host.querySelector("#formulaOut");
    const run = (value) => {
      try {
        const p = Sci.tools.parseFormula(value);
        out.innerHTML = h`<div class="tool-result">
          <h3 class="tr-main">${U.formulaHtml(p.normalized)}</h3>
          <div class="tr-grid">
            <div><b>${U.num(p.molarMass, 4)}</b><span>g/mol (khối lượng mol)</span></div>
            <div><b>${p.exactMass ? U.num(p.exactMass, 5) : "—"}</b><span>Da (monoisotopic, nếu có dữ liệu)</span></div>
            <div><b>${p.atomCount}</b><span>nguyên tử</span></div>
            <div><b>${p.charge === 0 ? "0" : p.charge > 0 ? "+" + p.charge : p.charge}</b><span>điện tích</span></div>
          </div>
          ${p.hydrates.length ? h`<p class="small muted">Hydrat: ${p.hydrates.map((x) => `${x.multiplier}×${x.body}`).join(", ")}</p>` : raw("")}
          <table class="data-table"><thead><tr><th>Nguyên tố</th><th>Số nguyên tử</th><th>Khối lượng (g/mol)</th><th>% khối lượng</th></tr></thead>
            <tbody>${p.compositionPercent.map(
              (c) => h`<tr><td><b>${c.element}</b></td><td class="num">${c.count}</td><td class="num">${U.num(c.mass, 4)}</td><td class="num">${U.num(c.percent, 2)}%</td></tr>`
            )}</tbody></table>
          ${computedNote()}
        </div>`;
      } catch (e) {
        out.innerHTML = h`<div class="error-box"><b>Không phân tích được công thức</b><p>${e.message}</p></div>`;
      }
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      run(new FormData(form).get("formula"));
    });
    host.querySelectorAll("[data-formula-example]").forEach((b) =>
      b.addEventListener("click", () => {
        form.querySelector("input").value = b.dataset.formulaExample;
        run(b.dataset.formulaExample);
      })
    );
    run(form.querySelector("input").value);
  }

  function wireBalance(host) {
    const form = host.querySelector("#balanceForm");
    const out = host.querySelector("#balanceOut");
    const run = (value) => {
      try {
        const r = Sci.tools.balanceEquation(value);
        if (!r.ok) {
          out.innerHTML = h`<div class="error-box"><b>Không cân bằng được</b><p>${r.message}</p>${r.elements ? h`<p class="small muted">Nguyên tố: ${r.elements.join(", ")}</p>` : raw("")}</div>`;
          return;
        }
        out.innerHTML = h`<div class="tool-result">
          <p class="balanced-equation">${r.balanced}</p>
          <div class="table-wrap"><table class="data-table">
            <thead><tr><th>Chất</th><th>Vế</th><th>Hệ số</th><th>M (g/mol)</th></tr></thead>
            <tbody>${r.species.map(
              (s) => h`<tr><td class="mono">${U.formulaHtml(s.formula)}</td><td>${s.side === "reactant" ? "Chất phản ứng" : "Sản phẩm"}</td><td class="num">${s.coefficient}</td><td class="num">${U.num(s.molarMass, 3)}</td></tr>`
            )}</tbody></table></div>
          <details class="fold" open><summary>Kiểm tra cân bằng nguyên tố</summary>
            <table class="data-table small"><thead><tr><th>Nguyên tố</th><th>Trái</th><th>Phải</th><th></th></tr></thead>
              <tbody>${r.check.map(
                (c) => h`<tr><td>${c.element}</td><td class="num">${c.left}</td><td class="num">${c.right}</td><td>${c.left === c.right ? "✓" : "✗"}</td></tr>`
              )}</tbody></table>
          </details>
          ${computedNote()}
          <p class="muted small">Công cụ chỉ cân bằng nguyên tố, không cân bằng điện tích/electron cho bán phản ứng redox trong môi trường axit–bazơ.</p>
        </div>`;
      } catch (e) {
        out.innerHTML = h`<div class="error-box"><b>Lỗi</b><p>${e.message}</p></div>`;
      }
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      run(new FormData(form).get("eq"));
    });
    host.querySelectorAll("[data-balance-example]").forEach((b) =>
      b.addEventListener("click", () => {
        form.querySelector("input").value = b.dataset.balanceExample;
        run(b.dataset.balanceExample);
      })
    );
    run(form.querySelector("input").value);
  }

  function wireUnits(host) {
    const form = host.querySelector("#unitForm");
    const catSel = form.querySelector('[name="category"]');
    const fromSel = host.querySelector("#unitFrom");
    const toSel = host.querySelector("#unitTo");
    const out = host.querySelector("#unitOut");

    function fillUnits() {
      const cat = Sci.tools.UNITS[catSel.value];
      const keys = Object.keys(cat.units);
      fromSel.innerHTML = keys.map((k) => h`<option>${k}</option>`).join("");
      toSel.innerHTML = keys.map((k) => h`<option ${k === keys[keys.length - 1] ? raw("selected") : raw("")}>${k}</option>`).join("");
    }
    catSel.addEventListener("change", () => {
      fillUnits();
      run();
    });
    function run() {
      try {
        const data = new FormData(form);
        const v = Number(data.get("value"));
        const res = Sci.tools.convert(v, data.get("category"), data.get("from"), data.get("to"));
        out.innerHTML = h`<div class="tool-result big-result">
          <span class="br-val">${U.num(v, 6)} ${data.get("from")}</span>
          <span class="br-eq">=</span>
          <span class="br-val accent">${U.num(res, 6)} ${data.get("to")}</span>
          ${computedNote()}
        </div>`;
      } catch (e) {
        out.innerHTML = h`<div class="error-box"><p>${e.message}</p></div>`;
      }
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      run();
    });
    fillUnits();
    run();
  }

  function wireSolution(host) {
    const mf = host.querySelector("#molarityForm");
    const mo = host.querySelector("#molarityOut");
    mf.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(mf);
      try {
        const mass = Number(data.get("mass"));
        const formula = data.get("formula");
        const volumeL = Number(data.get("volume")) / 1000;
        const m = Sci.tools.mass(0, formula);
        const n = mass / m.molarMass;
        const c = n / volumeL;
        mo.innerHTML = h`<div class="tool-result">
          <div class="tr-grid">
            <div><b>${U.num(m.molarMass, 4)}</b><span>g/mol</span></div>
            <div><b>${U.num(n, 5)}</b><span>mol</span></div>
            <div><b>${U.num(c, 5)}</b><span>mol/L (M)</span></div>
            <div><b>${U.num(c * 1000, 4)}</b><span>mmol/L</span></div>
          </div>
          ${computedNote()}
        </div>`;
      } catch (err) {
        mo.innerHTML = h`<div class="error-box"><p>${err.message}</p></div>`;
      }
    });
    mf.requestSubmit && mf.requestSubmit();

    const df = host.querySelector("#dilutionForm");
    const dout = host.querySelector("#dilutionOut");
    df.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(df);
      const num = (k) => (data.get(k) === "" ? null : Number(data.get(k)));
      try {
        const c1 = num("c1");
        const v1 = num("v1");
        const c2 = num("c2");
        const v2 = num("v2");
        const known = [c1, v1, c2, v2].filter((x) => x !== null).length;
        if (known < 3) throw new Error("Cần ít nhất 3 giá trị để tính giá trị còn lại.");
        const missing = [c1, v1, c2, v2].indexOf(null);
        const val = Sci.tools.dilution(c1, v1, c2, v2);
        const labels = ["C₁ (mol/L)", "V₁ (mL)", "C₂ (mol/L)", "V₂ (mL)"];
        dout.innerHTML = h`<div class="tool-result">
          <p class="big-result"><span class="br-val accent">${U.num(val, 5)}</span> <span>${labels[missing]}</span></p>
          <p class="small muted">C₁V₁ = C₂V₂ · ${U.num(c1 != null ? c1 : val, 4)} × ${U.num(v1 != null ? v1 : val, 4)} = ${U.num(c2 != null ? c2 : val, 4)} × ${U.num(v2 != null ? v2 : val, 4)}</p>
          ${computedNote()}
        </div>`;
      } catch (err) {
        dout.innerHTML = h`<div class="error-box"><p>${err.message}</p></div>`;
      }
    });
    df.requestSubmit && df.requestSubmit();
  }

  function wireResolve(host) {
    const form = host.querySelector("#resolveForm");
    const out = host.querySelector("#resolveOut");
    let token = 0;
    async function run(q) {
      if (!q) return;
      const my = ++token;
      const ident = Sci.search.detectIdentifier(q);
      out.innerHTML = U.spinner("Đang nhận diện và truy vấn…");
      try {
        const r = await Sci.search.resolve(q);
        if (my !== token) return;
        out.innerHTML = h`<div class="identifier-card">
          <div class="ic-head"><span class="ic-label">Loại định danh: <b>${ident.label || ident.type}</b></span></div>
          <p class="ic-value mono">${ident.value || q}</p>
          ${ident.hint ? h`<p class="muted small">${ident.hint}</p>` : raw("")}
        </div>
        ${r.results.length ? h`<div class="result-list">${r.results.map((x) => Sci.ui.resultCard(x))}</div>` : U.emptyState("Không phân giải được", r.notes.join(" ") || "Không tìm thấy bản ghi.")}
        ${r.notes.length ? h`<ul class="note-list">${r.notes.map((n) => h`<li>${n}</li>`)}</ul>` : raw("")}`;
      } catch (e) {
        if (my !== token) return;
        out.innerHTML = U.errorBox(e, { hint: "Thử lại hoặc nhập định danh khác." });
      }
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      run(new FormData(form).get("q").trim());
    });
    host.querySelectorAll("[data-resolve-example]").forEach((b) =>
      b.addEventListener("click", () => {
        form.querySelector("input").value = b.dataset.resolveExample;
        run(b.dataset.resolveExample);
      })
    );
  }

  function wireStructure(host) {
    const form = host.querySelector("#structureForm");
    const out = host.querySelector("#structureOut");
    async function run(q) {
      if (!q) return;
      out.innerHTML = U.spinner("Đang tra cấu trúc trên PubChem…");
      try {
        const ident = Sci.search.detectIdentifier(q);
        let cid = null;
        if (ident.type === "cid") cid = ident.value;
        else if (ident.type === "inchikey") cid = (await Sci.adapters.pubchem.byInchiKey(ident.value))[0];
        else if (ident.type === "smiles") cid = (await Sci.adapters.pubchem.bySmiles(ident.value))[0];
        else {
          const cids = await Sci.adapters.pubchem.search(q, { max: 1 });
          cid = cids[0] && cids[0].identifiers.cid;
        }
        if (!cid) {
          out.innerHTML = U.emptyState("Không tìm thấy cấu trúc", "PubChem không trả về CID cho truy vấn này.");
          return;
        }
        const props = await Sci.adapters.pubchem.compound(cid);
        out.innerHTML = h`<div class="structure-result">
          <figure class="structure-figure large">
            <img src="${Sci.adapters.pubchem.imageUrl(cid, 420)}" alt="Cấu trúc 2D của ${U.esc(props.title)} từ PubChem" loading="lazy" />
            <figcaption>${props.title} · CID ${cid} · ${props.formula || ""}</figcaption>
          </figure>
          <div class="structure-meta">
            ${ui.propertiesBlock(props, { limit: 10, include: [/khối lượng|SMILES|InChI|LogP|TPSA|donor|acceptor/i] })}
            <div class="link-row">
              ${U.extLink("https://pubchem.ncbi.nlm.nih.gov/compound/" + cid, "Bản ghi PubChem")}
              ${U.extLink("https://pubchem.ncbi.nlm.nih.gov/compound/" + cid + "#section=3D-Conformer", "Mô hình 3D")}
              <a class="btn btn-sm" href="#/compounds/${cid}">Hồ sơ đầy đủ →</a>
            </div>
          </div>
        </div>`;
      } catch (e) {
        out.innerHTML = U.errorBox(e, { hint: "PubChem có thể đang giới hạn tần suất." });
      }
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      run(new FormData(form).get("q").trim());
    });
    run(form.querySelector("input").value);
  }
})(typeof window !== "undefined" ? window : globalThis);
