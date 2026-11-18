/* ===== BẢNG TUẦN HOÀN ===== */
const table = document.getElementById("periodicTable");
const legend = document.getElementById("legend");
const catFilter = document.getElementById("categoryFilter");
const elFilter = document.getElementById("elementFilter");
const stateChk = document.getElementById("stateAt25");

Object.entries(CAT_LABELS).forEach(([k, v]) => {
  catFilter.insertAdjacentHTML("beforeend", `<option value="${k}">${v}</option>`);
});

Object.entries(CAT_LABELS).forEach(([k, v]) => {
  legend.insertAdjacentHTML(
    "beforeend",
    `<span class="legend-item" data-cat="${k}"><span class="legend-dot cat-${k}"></span>${v}</span>`
  );
});

function buildTable() {
  const frag = [];
  const placeholders = { "6-3": "57–71", "7-3": "89–103" };
  ELEMENTS.forEach(el => {
    let row = el.period, col = el.group;
    if (el.cat === "lanthanide") { row = 9; col = 2 + (el.z - 56); }
    if (el.cat === "actinide")   { row = 10; col = 2 + (el.z - 88); }
    el._row = row; el._col = col;
  });
  Object.entries(placeholders).forEach(([pos, label]) => {
    const [r, c] = pos.split("-").map(Number);
    frag.push(`<div class="el-cell placeholder" style="grid-row:${r};grid-column:${c};font-size:.55rem;display:flex;align-items:center;justify-content:center;color:var(--muted);visibility:visible;">${label}</div>`);
  });
  ELEMENTS.forEach(el => {
    frag.push(
      `<div class="el-cell cat-${el.cat}" data-z="${el.z}" title="${el.name}"
        style="grid-row:${el._row};grid-column:${el._col};">
        <span class="num">${el.z}</span><span class="sym">${el.sym}</span><span class="nm">${el.name}</span>
      </div>`
    );
  });
  table.innerHTML = frag.join("");
}
buildTable();

/* Vùng nguyên tố lý thuyết Z=119+ (xếp dãy tuần tự 9 ô/hàng) */
const ALL_ELEMENTS = ELEMENTS.concat(THEORETICAL_ELEMENTS);
(function buildExtTable() {
  const ext = document.getElementById("extTable");
  if (!ext) return;
  ext.innerHTML = THEORETICAL_ELEMENTS.map((el, i) => {
    const row = Math.floor(i / 9) + 1;
    const col = (i % 9) + 1;
    return `<div class="el-cell cat-${el.cat} theo" data-z="${el.z}" title="${el.name}"
      style="grid-row:${row};grid-column:${col};">
      <span class="num">${el.z}</span><span class="sym">${el.sym}</span><span class="nm">${el.name.split(" ")[0]}</span>
    </div>`;
  }).join("");
})();

function applyFilters() {
  const q = elFilter.value.trim().toLowerCase();
  const cat = catFilter.value;
  const solidOnly = stateChk.checked;
  document.querySelectorAll(".el-cell[data-z]").forEach(cellEl => {
    const el = ELEMENTS.find(e => e.z === +cellEl.dataset.z);
    let show = true;
    if (q) show = el.name.toLowerCase().includes(q) || el.sym.toLowerCase() === q || el.sym.toLowerCase().startsWith(q);
    if (cat && el.cat !== cat) show = false;
    if (solidOnly && !(el.mp !== null && el.mp > 25)) show = false;
    cellEl.classList.toggle("dimmed", !show);
  });
}
[elFilter, catFilter, stateChk].forEach(ctrl => ctrl.addEventListener("input", applyFilters));

legend.addEventListener("click", e => {
  const item = e.target.closest(".legend-item");
  if (!item) return;
  catFilter.value = item.dataset.cat === catFilter.value ? "" : item.dataset.cat;
  applyFilters();
});

/* Modal */
const modal = document.getElementById("elementModal");
function openElementModal(z) {
  const el = ALL_ELEMENTS.find(x => x.z === +z);
  if (!el) return;
  const theo = el.z > 118;
  document.getElementById("mSymbol").textContent = el.sym;
  document.getElementById("mSymbol").className = "big-symbol cat-" + el.cat;
  document.getElementById("mName").textContent = `${el.name} (${el.sym})`;
  document.getElementById("mMeta").textContent = `Nguyên tố số ${el.z} — ${CAT_LABELS[el.cat]}${theo ? " · CHƯA TỔNG HỢP" : ""}`;
  document.getElementById("mPos").textContent = theo
    ? `Dự đoán: chu kỳ 8, nhóm ${el.group} — đảo ổn định`
    : `Chu kỳ ${el.period}, nhóm ${el.group}${el.cat==="lanthanide"||el.cat==="actinide" ? " (khối f)" : ""}`;
  document.getElementById("mMass").textContent = (theo ? "dự đoán ~" : "") + el.mass + (theo ? " u" : " u");
  document.getElementById("mConfig").textContent = el.config;
  const fmt = t => t === null ? "?" : t + " °C";
  document.getElementById("mTemp").textContent = `${fmt(el.mp)} / ${fmt(el.bp)}`;
  document.getElementById("mUse").textContent = el.use;
  modal.classList.remove("hidden");
}
table.addEventListener("click", e => {
  const cell = e.target.closest(".el-cell[data-z]");
  if (cell) openElementModal(cell.dataset.z);
});
document.getElementById("extTable")?.addEventListener("click", e => {
  const cell = e.target.closest(".el-cell[data-z]");
  if (cell) openElementModal(cell.dataset.z);
});
document.getElementById("modalClose").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.classList.add("hidden"); });

/* ===== PHẢN ỨNG ===== */
document.getElementById("rxnCount").textContent = REACTIONS.length;
const rxnCatSel = document.getElementById("reactionCat");
RXN_CATS.forEach(c => rxnCatSel.insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.icon} ${c.name}</option>`));

const rxnWrap = document.getElementById("reactionCards");
function renderReactions() {
  const q = document.getElementById("reactionFilter").value.trim().toLowerCase();
  const cat = rxnCatSel.value;
  rxnWrap.innerHTML = "";
  REACTIONS.filter(r => (!cat || r.c === cat) &&
      (!q || (r.t + r.e + r.n).toLowerCase().includes(q)))
    .forEach(r => {
      const c = RXN_CATS.find(x => x.id === r.c);
      rxnWrap.insertAdjacentHTML(
        "beforeend",
        `<div class="card">
          <h3>${c ? c.icon : "⚗️"} ${r.t}</h3>
          <p class="tagline">${r.n}</p>
          <div class="rxn">${r.e}</div>
        </div>`
      );
    });
}
renderReactions();
[document.getElementById("reactionFilter"), rxnCatSel].forEach(el =>
  el.addEventListener("input", renderReactions));
rxnWrap.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (card) card.style.transform = "";
});

/* ===== VẬT LIỆU ===== */
document.getElementById("matCount").textContent = MATERIALS.length;
const matNav = document.getElementById("materialNav");
const matDetail = document.getElementById("materialDetail");
const matCatSel = document.getElementById("materialCatFilter");

MAT_CATS.forEach(c => matCatSel.insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.name}</option>`));

function renderMatNav(filterCat = "") {
  matNav.innerHTML = "";
  MATERIALS.filter(m => !filterCat || m.cat === filterCat).forEach(m => {
    const catName = MAT_CATS.find(c => c.id === m.cat)?.name || "";
    matNav.insertAdjacentHTML(
      "beforeend",
      `<li><button data-id="${m.id}">${m.icon} ${m.name}<br><small style="opacity:.65;font-weight:400;">${catName}</small></button></li>`
    );
  });
}
function showMaterial(id) {
  const m = MATERIALS.find(x => x.id === id);
  if (!m) return;
  const catName = MAT_CATS.find(c => c.id === m.cat)?.name || "";
  matDetail.innerHTML = `
    <h3>${m.icon} ${m.name}</h3>
    <p class="mat-sub">${m.sub} · ${catName}</p>
    <div class="mat-facts">${m.facts.map(f => `<span class="fact-chip">${f}</span>`).join("")}</div>
    ${m.content}`;
  matNav.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.id === id));
}
renderMatNav();
showMaterial(MATERIALS[0].id);
matNav.addEventListener("click", e => {
  const btn = e.target.closest("button[data-id]");
  if (btn) showMaterial(btn.dataset.id);
});
matCatSel.addEventListener("change", () => {
  renderMatNav(matCatSel.value);
  const first = matNav.querySelector("button[data-id]");
  if (first) showMaterial(first.dataset.id); else matDetail.innerHTML = "";
});

/* ===== KIẾN THỨC ===== */
const KT_TABS = [
  ["nhom-chuc", "⛓️ Nhóm chức"],
  ["dinh-luat", "⚖️ Định luật"],
  ["hang-so", "🔢 Hằng số"],
  ["hoat-dong", "🪜 Dãy hoạt động"],
  ["do-tan", "💧 Độ tan"],
  ["ion-da-nguyen", "⚛️ Ion đa nguyên tử"],
  ["axit-bazo", "⚖️ Axit–bazơ"],
  ["phan-tich-kt", "🔬 Phân tích"],
  ["nhanh-hoa", "🗺️ Nhánh hóa học"],
  ["ly-thuyet-kt", "🧠 Khái niệm lý thuyết"],
  ["sieu-nang", "🔮 Siêu nặng Z=119+"],
  ["nobel", "🏆 Nobel"],
  ["danh-nhan", "👨‍🔬 Danh nhân"],
  ["so-do", "📊 Số liệu"],
  ["tinh-the", "💎 Tinh thể"],
  ["don-vi", "📐 Đơn vị"],
  ["lich-su", "📜 Lịch sử"]
];
const ktTabsEl = document.getElementById("ktTabs");
KT_TABS.forEach(([id, label], i) =>
  ktTabsEl.insertAdjacentHTML("beforeend", `<button data-panel="${id}" class="${i===0?"active":""}">${label}</button>`));

ktTabsEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-panel]");
  if (!btn) return;
  ktTabsEl.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
  document.querySelectorAll(".kt-panel").forEach(p =>
    p.classList.toggle("hidden", p.dataset.panel !== btn.dataset.panel));
});

// Nhóm chức
document.getElementById("fgTable").innerHTML =
  "<tr><th>Nhóm</th><th>Công thức</th><th>Ví dụ</th><th>Tính chất</th><th>Ứng dụng</th></tr>" +
  FUNC_GROUPS.map(g => `<tr><td><b>${g.g}</b></td><td><code>${g.f}</code></td><td>${g.ex}</td><td>${g.feat}</td><td>${g.app}</td></tr>`).join("");

// Định luật
document.getElementById("lawsGrid").innerHTML =
  LAWS.concat(LAWS_EXTRA).map(l => `<div class="law-card"><h4>${l.n}</h4>
    <div><span class="law-year">${l.y}</span> · ${l.w}</div>
    <div class="law-formula">${l.t}</div>
    <p>${l.d}</p></div>`).join("");

// Hằng số
document.getElementById("constTable").innerHTML =
  "<tr><th>Ký hiệu</th><th>Tên</th><th>Giá trị</th><th>Ý nghĩa</th></tr>" +
  CONSTANTS.map(c => `<tr><td><code>${c.s}</code></td><td><b>${c.n}</b></td><td>${c.v}</td><td>${c.d}</td></tr>`).join("");

// Dãy hoạt động
document.getElementById("activityStrip").innerHTML =
  ACTIVITY_SERIES.order.map(s =>
    s === "(H)"
      ? `<span class="act-h">(H)</span>`
      : `<span class="act-chip" style="background:hsl(${Math.max(0, 120 - ACTIVITY_SERIES.order.indexOf(s)*8)},70%,45%)">${s}</span>`
  ).join('<span style="color:var(--muted)">›</span>');
document.getElementById("activityNote").textContent = ACTIVITY_SERIES.note;
document.getElementById("activityDetail").innerHTML =
  ACTIVITY_SERIES.detail.map(d => `<li>${d}</li>`).join("");

// Độ tan
document.getElementById("solubilityTable").innerHTML =
  "<tr><th>Nhóm muối</th><th>Độ tan</th><th>Ghi chú</th></tr>" +
  SOLUBILITY_RULES.map(r => `<tr><td><b>${r.r}</b></td><td>${sBadge(r.s)}</td><td>${r.note}</td></tr>`).join("");
function sBadge(s) {
  const green = s.includes("Tan") && !s.includes("KHÔNG");
  return `<span style="color:#fff;background:${green ? "#22a06b" : "#d64550"};padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:600;">${s}</span>`;
}

// Timeline (gộp bổ sung)
function tlYear(y) {
  let n = parseFloat(y.replace(/[^\d.]/g, ""));
  if (isNaN(n)) return 0;
  return y.includes("TCN") ? -n : n;
}
document.getElementById("timelineList").innerHTML =
  TIMELINE.concat(TIMELINE_EXTRA)
    .sort((a, b) => tlYear(a.y) - tlYear(b.y))
    .map(t => `<div class="tl-item"><span class="tl-year">${t.y}</span><h4>${t.t}</h4><p>${t.d}</p></div>`).join("");

// Ion đa nguyên tử
document.getElementById("ionTable").innerHTML =
  "<tr><th>Ion</th><th>Tên</th><th>Ghi chú thực tế</th></tr>" +
  POLYATOMIC_IONS.map(i => `<tr><td><code>${i.i}</code></td><td><b>${i.n}</b></td><td>${i.note}</td></tr>`).join("");

// Axit-bazơ
document.getElementById("acidTable").innerHTML =
  "<tr><th>Chất</th><th>Loại</th><th>pKa / pKb</th><th>Ghi chú</th></tr>" +
  ACID_BASE_TABLE.map(a =>
    `<tr><td><code>${a.s}</code></td>
     <td><span style="color:#fff;background:${a.type==="axit"?"#d64550":"#2563eb"};padding:2px 10px;border-radius:999px;font-size:.75rem;font-weight:600;">${a.type}</span></td>
     <td>${a.pk}</td><td>${a.note}</td></tr>`).join("");

// Kỹ thuật phân tích
document.getElementById("techCards").innerHTML =
  ANALYTICAL_TECHNIQUES.map(t =>
    `<div class="card"><h3>${t.t}</h3><p class="tagline">${t.what}</p>
     <div class="rxn-extra" style="display:block;margin-top:8px;">${t.info}</div>
     <div class="rxn-extra" style="display:block;color:var(--accent);">💡 ${t.fun}</div></div>`).join("");

// Nhánh hóa học
document.getElementById("branchGrid").innerHTML =
  CHEM_BRANCHES.map(b =>
    `<div class="law-card"><h4>${b.b}</h4><p>${b.d}</p><p><span class="hint-tag">${b.ex}</span></p></div>`).join("");

// Khái niệm lý thuyết
document.getElementById("theoryGrid").innerHTML =
  THEORY_CONCEPTS.map(t =>
    `<div class="law-card"><h4>${t.c}</h4><div class="law-formula">${t.e}</div><p>${t.w}</p></div>`).join("");

// Siêu nặng
document.getElementById("superheavyGrid").innerHTML =
  SUPERHEAVY_THEORY.map(s =>
    `<div class="law-card"><h4><code>${s.sym}</code> ${s.name} <span class="law-year">Z=${s.z}</span></h4>
     <p><b>Nhóm dự đoán:</b> ${CAT_LABELS[s.cat]} · chu kỳ ${s.period}, nhóm ${s.group}</p>
     <p>${s.pred}</p></div>`).join("");

// Nobel (gộp bổ sung, sắp theo năm)
document.getElementById("nobelList").innerHTML =
  NOBEL_CHEMISTRY.concat(NOBEL_EXTRA)
    .sort((a, b) => a.y - b.y)
    .map(n =>
      `<div class="tl-item"><span class="tl-year">${n.y}</span><h4>${n.w}</h4>
       <p style="color:var(--text);"><b>${n.c}</b></p><p>${n.n || ""}</p></div>`).join("");

// Danh nhân
document.getElementById("chemistGrid").innerHTML =
  CHEMISTS_GALLERY.map(p =>
    `<div class="law-card chemist-card">
      <div class="avatar">${p.i}</div>
      <h4>${p.n}</h4>
      <div class="law-year">${p.y} · ${p.c}</div>
      <p>${p.q}</p>
    </div>`).join("");

// Bảng số liệu
function twoColTable(rows, h1, h2, extraHeader) {
  return `<tr><th>${h1}</th><th>${h2}</th>${extraHeader ? "<th>" + extraHeader + "</th>" : ""}</tr>` +
    rows.map(r => `<tr><td><code>${r[0]}</code></td><td>${r[1]}</td>${r[2] ? `<td>${r[2]}</td>` : ""}</tr>`).join("");
}
document.getElementById("e0Table").innerHTML = twoColTable(E0_SERIES.rows, "Cặp oxi hóa-khử", "E° (V)", "Ghi chú");
document.getElementById("kspTable").innerHTML = twoColTable(KSP_TABLE, "Hợp chất", "Ksp (25°C)", "Ứng dụng/ghi chú");
document.getElementById("bondTable").innerHTML = twoColTable(BOND_ENERGY, "Bond", "kJ/mol", "Ghi chú");
document.getElementById("isotopeTable").innerHTML = twoColTable(ISOTOPES_TABLE, "Đồng vị", "Tên/đặc điểm", "Ứng dụng");
document.getElementById("phTable").innerHTML = twoColTable(PH_COMMON, "Chất", "pH", "Ghi chú");

// Cấu trúc tinh thể
document.getElementById("crystalGrid").innerHTML =
  CRYSTAL_STRUCTURES.map(c =>
    `<div class="law-card"><h4>${c.c}</h4><div class="law-formula">${c.e}</div><p>${c.d}</p></div>`).join("");

// Đơn vị
document.getElementById("unitTable").innerHTML =
  "<tr><th>Thuật ngữ</th><th>Định nghĩa</th><th>Ví dụ</th></tr>" +
  UNITS_GLOSSARY.map(u => `<tr><td><code>${u.u}</code></td><td>${u.d}</td><td>${u.ex}</td></tr>`).join("");

// Giáo trình + danh pháp
document.getElementById("learnList").innerHTML =
  LEARN_PATH.map(l => `<div class="tl-item"><span class="tl-year">${l.lv}</span><h4>${l.t}</h4><p>${l.k}</p></div>`).join("");
document.getElementById("nomTable").innerHTML =
  "<tr><th>Quy tắc</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>" +
  NOMENCLATURE.map(n => `<tr><td><code>${n[0]}</code></td><td>${n[1]}</td><td>${n[2]}</td></tr>`).join("");

/* ===== GÓC Y DƯỢC ===== */
document.getElementById("medDrugCount").textContent = DRUGS.length;
const MED_TABS = [
  ["thuoc", "💊 Thuốc huyền thoại"],
  ["duoc-ly", "🧬 Dược lý"],
  ["co-the", "🩸 Hóa học cơ thể"],
  ["xet-nghiem", "🧪 Xét nghiệm"],
  ["giai-doc", "☠️ Giải độc"],
  ["khang-sinh", "🦠 Kháng sinh"],
  ["he-co-quan", "🗺️ Theo hệ cơ quan"],
  ["vaccine", "💉 Vaccine"],
  ["toxidrome", "🧬 Toxidrome"],
  ["cyp", "🔁 Tương tác CYP"],
  ["tinh-lieu", "🧮 Tính liều"],
  ["doi-tuong", "⚠️ Đối tượng đặc biệt"],
  ["vw", "🫀 Antiarrhythmic"],
  ["cap-cuu", "🚨 Cấp cứu"],
  ["tu-vung", "📖 Từ điển"]
];
const medTabsEl = document.getElementById("medTabs");
MED_TABS.forEach(([id, label], i) =>
  medTabsEl.insertAdjacentHTML("beforeend", `<button data-mpanel="${id}" class="${i===0?"active":""}">${label}</button>`));
medTabsEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-mpanel]");
  if (!btn) return;
  medTabsEl.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
  document.querySelectorAll("[data-mpanel]").forEach(p => {
    if (p.classList.contains("kt-panel")) p.classList.toggle("hidden", p.dataset.mpanel !== btn.dataset.mpanel);
  });
});

// Thuốc + filter
const drugClassSel = document.getElementById("drugClassSel");
[...new Set(DRUGS.map(d => d.cls))].sort().forEach(c =>
  drugClassSel.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
function renderDrugs() {
  const q = document.getElementById("drugFilter").value.trim().toLowerCase();
  const cls = drugClassSel.value;
  document.getElementById("drugCards").innerHTML = DRUGS
    .filter(d => (!cls || d.cls === cls) && (!q || (d.n + d.mech + d.note).toLowerCase().includes(q)))
    .map(d =>
      `<div class="card">
        <h3><span class="drug-year">${d.y}</span>${d.n}</h3>
        <p style="margin:2px 0 6px;"><span class="drug-class-badge" style="background:${clsColor(d.cls)};">${d.cls}</span></p>
        <div class="rxn">${d.mech}</div>
        <div class="rxn-extra" style="display:block;">${d.note}</div>
      </div>`).join("");
}
function clsColor(cls) {
  let h = 0; for (const ch of cls) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${h},62%,42%)`;
}
renderDrugs();
[document.getElementById("drugFilter"), drugClassSel].forEach(el => el.addEventListener("input", renderDrugs));

// Dược lý + định luật y
document.getElementById("pharmaGrid").innerHTML =
  PHARMA_CONCEPTS.map(p =>
    `<div class="law-card"><h4>${p.t}</h4><div class="law-formula">${p.e}</div><p>${p.d}</p></div>`).join("");
document.getElementById("lawMedGrid").innerHTML =
  LAWS_MED.map(l => `<div class="law-card"><h4>${l.n}</h4>
    <div><span class="law-year">${l.y}</span> · ${l.w}</div>
    <div class="law-formula">${l.t}</div><p>${l.d}</p></div>`).join("");

// Cơ thể
function rows3(rows, headers) {
  return `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>` +
    rows.map(r => `<tr>${r.map((c, j) => j === 0 ? `<td><code>${c}</code></td>` : `<td>${c}</td>`).join("")}</tr>`).join("");
}
document.getElementById("electroTable").innerHTML = rows3(ELECTROLYTES, ["Ion", "Khoảng bình thường", "Vai trò", "Bất thường lâm sàng"]);
document.getElementById("neuroTable").innerHTML = rows3(NEUROTRANSMITTERS, ["Chất", "Vai trò", "Liên quan thuốc/bệnh"]);
document.getElementById("hormoneTable").innerHTML = rows3(HORMONES_CLASS, ["Nhóm hóa học", "Ví dụ", "Đặc điểm"]);
document.getElementById("bioelementTable").innerHTML = rows3(BIOELEMENTS, ["Nguyên tố", "Hàm lượng", "Vai trò sinh học"]);
document.getElementById("vitaminTable").innerHTML = rows3(VITAMINS, ["Vitamin", "Chức năng", "Thiếu → bệnh"]);

// Xét nghiệm
document.getElementById("labTable2").innerHTML = rows3(LAB_TESTS, ["Xét nghiệm", "Bình thường", "Ý nghĩa lâm sàng"]);

// Giải độc
document.getElementById("antidoteTable").innerHTML =
  `<tr><th>Chất độc</th><th>Antidote</th><th>Cơ chế & ghi chú</th></tr>` +
  ANTIDOTES.map(a =>
    `<tr class="danger-row"><td><b>${a[0]}</b></td><td><code>${a[1]}</code></td><td>${a[2]}</td></tr>`).join("");

// Kháng sinh
document.getElementById("abTable2").innerHTML =
  `<tr><th>Nhóm kháng sinh</th><th>Cơ chế</th><th>Ghi chú lâm sàng</th></tr>` +
  AB_CLASSES.map(a => `<tr><td><b>${a[0]}</b></td><td>${a[1]}</td><td>${a[2]}</td></tr>`).join("");

// Theo hệ cơ quan
document.getElementById("organTable").innerHTML =
  `<tr><th>Hệ cơ quan</th><th>Thuốc đại diện</th><th>Điểm chốt dược lý</th></tr>` +
  ORGAN_PHARM.map(o => `<tr><td style="white-space:nowrap;"><b>${o[0]}</b></td><td>${o[1]}</td><td>${o[2]}</td></tr>`).join("");

// Vaccine + miễn dịch
document.getElementById("vaccineTable").innerHTML =
  `<tr><th>Vaccine</th><th>Năm</th><th>Loại</th><th>Tác động / điểm hay</th></tr>` +
  VACCINES.map(v => `<tr><td><b>${v[0]}</b></td><td>${v[1]}</td><td>${v[2]}</td><td>${v[3]}</td></tr>`).join("");
document.getElementById("immuneGrid").innerHTML =
  IMMUNE_CONCEPTS.map(c =>
    `<div class="law-card"><h4>${c.t}</h4><div class="law-formula">${c.e}</div><p>${c.d}</p></div>`).join("");

// Từ điển y dược (có filter)
function renderGloss() {
  const q = (document.getElementById("glossFilter")?.value || "").trim().toLowerCase();
  document.getElementById("glossTable").innerHTML =
    `<tr><th>Tiếng Việt</th><th>English</th><th>Ghi nhớ nhanh</th></tr>` +
    MED_GLOSSARY.filter(g => !q || (g[0] + g[1] + g[2]).toLowerCase().includes(q))
      .map(g => `<tr><td><b>${g[0]}</b></td><td><code>${g[1]}</code></td><td>${g[2]}</td></tr>`).join("");
}
renderGloss();
document.getElementById("glossFilter")?.addEventListener("input", renderGloss);

// Toxidrome
document.getElementById("toxidromeTable").innerHTML =
  "<tr><th>Toxidrome</th><th>Dấu hiệu kinh điển</th><th>Chất gây</th><th>Giải độc</th></tr>" +
  TOXIDROMES.map(t => `<tr class="danger-row"><td><b>${t[0]}</b></td><td>${t[1]}</td><td>${t[2]}</td><td>${t[3]}</td></tr>`).join("");

// CYP
document.getElementById("cypTable").innerHTML =
  "<tr><th>Enzyme/Transporter</th><th>Vai trò</th><th>Ức chế / Cảm ứng điển hình</th><th>Substrate lâm sàng quan trọng</th></tr>" +
  CYP_TABLE.map(c => `<tr><td><b><code>${c[0]}</code></b></td><td>${c[1]}</td><td>${c[2]}</td><td>${c[3]}</td></tr>`).join("");

// Tính liều
document.getElementById("calcGrid").innerHTML =
  CLINICAL_CALC.map(c =>
    `<div class="law-card"><h4>${c[0]}</h4><div class="law-formula">${c[1]}</div><p>${c[2]}</p></div>`).join("");

// Đối tượng đặc biệt
document.getElementById("specialTable").innerHTML =
  "<tr><th>Đối tượng</th><th>Nguyên tắc điều chỉnh</th><th>Ghi nhớ lâm sàng</th></tr>" +
  SPECIAL_POP.map(s => `<tr><td><b>${s[0]}</b></td><td>${s[1]}</td><td>${s[2]}</td></tr>`).join("");

// Vaughan-Williams
document.getElementById("vwTable").innerHTML =
  "<tr><th>Lớp</th><th>Thuốc</th><th>Cơ chế điện sinh lý</th><th>Lâm sàng & cảnh báo</th></tr>" +
  VW_CLASSES.map(v => `<tr><td><b>${v[0]}</b></td><td>${v[1]}</td><td>${v[2]}</td><td>${v[3]}</td></tr>`).join("");

// Cấp cứu
document.getElementById("emergCards").innerHTML =
  EMERGENCY_PROTOCOLS.map(e =>
    `<div class="card"><h3>🚨 ${e[0]}</h3>
     <div class="rxn">${e[1]}</div>
     <div class="rxn-extra" style="display:block;">${e[2]}</div></div>`).join("");

/* ===== TẦNG CHUYÊN SÂU ===== */
document.getElementById("advFieldCount").textContent = RESEARCH_FIELDS.length;
const ADV_TABS = [
  ["linh-vuc", "🗺️ Lĩnh vực PhD"],
  ["bai-bao", "📄 Bài báo kinh điển"],
  ["bai-toan-mo", "🔓 Bài toán mở"],
  ["hoa-xanh", "🌿 Hóa xanh 12"],
  ["cao-hoc", "🧠 Chủ đề cao học"],
  ["modality", "💊 Modality mới"]
];
const advTabsEl = document.getElementById("advTabs");
ADV_TABS.forEach(([id, label], i) =>
  advTabsEl.insertAdjacentHTML("beforeend", `<button data-apanel="${id}" class="${i===0?"active":""}">${label}</button>`));
advTabsEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-apanel]");
  if (!btn) return;
  advTabsEl.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
  document.querySelectorAll("[data-apanel]").forEach(p => {
    if (p.classList.contains("kt-panel")) p.classList.toggle("hidden", p.dataset.apanel !== btn.dataset.apanel);
  });
});

// Lĩnh vực nghiên cứu
function listJoin(arr) { return arr.map(x => `<li>${x}</li>`).join(""); }
document.getElementById("fieldGrid").innerHTML =
  RESEARCH_FIELDS.map(f =>
    `<div class="law-card">
      <h4>${f.icon} ${f.f}</h4>
      <div class="law-year">Câu hỏi lớn</div>
      <p style="color:var(--text);margin-top:2px;">${f.q}</p>
      <div class="law-year" style="margin-top:10px;">Kỹ thuật chủ lực</div>
      <ul style="font-size:.85rem;color:var(--muted);padding-left:18px;margin:2px 0;">${listJoin(f.tech)}</ul>
      <div class="law-year" style="margin-top:8px;">Landmark</div>
      <ul style="font-size:.85rem;color:var(--muted);padding-left:18px;margin:2px 0;">${listJoin(f.land)}</ul>
      <div class="law-year" style="margin-top:8px;">Bài toán đang mở</div>
      <ul style="font-size:.85rem;color:var(--muted);padding-left:18px;margin:2px 0;">${listJoin(f.open)}</ul>
    </div>`).join("");

// Bài báo kinh điển
document.getElementById("paperList").innerHTML =
  LANDMARK_PAPERS.filter(p => !p.skip).sort((a, b) => a.y - b.y)
    .map(p => `<div class="tl-item"><span class="tl-year">${p.y}</span><h4>${p.a}</h4>
      <p style="color:var(--text);"><b>${p.t}</b></p><p>${p.why}</p></div>`).join("");

// Bài toán mở
document.getElementById("openCards").innerHTML =
  OPEN_PROBLEMS.map((o, i) =>
    `<div class="card"><h3><span class="hint-tag">#${i + 1}</span>Bài toán mở</h3>
     <div class="rxn-extra" style="display:block;color:var(--text);">${o}</div></div>`).join("");

// Hóa xanh
document.getElementById("greenTable").innerHTML =
  "<tr><th>#</th><th>Nguyên tắc</th><th>Ý nghĩa</th><th>Ví dụ trong site</th></tr>" +
  GREEN_12.map(g => `<tr><td><b>${g[0]}</b></td><td><b>${g[1]}</b></td><td>${g[2]}</td><td>${g[3]}</td></tr>`).join("");

// Cao học
document.getElementById("gradGrid").innerHTML =
  GRAD_TOPICS.map(g =>
    `<div class="law-card"><h4>${g.t}</h4><div class="law-formula">${g.e}</div><p>${g.w}</p></div>`).join("");

// Modality
document.getElementById("modalityTable").innerHTML =
  "<tr><th>Modality</th><th>Cấu trúc / nguyên lý</th><th>Cơ chế đặc biệt</th><th>Ví dụ thực tế</th></tr>" +
  MODERN_MODALITIES.map(m => `<tr><td><b>${m[0]}</b></td><td>${m[1]}</td><td>${m[2]}</td><td>${m[3]}</td></tr>`).join("");

/* ===== CƠ SỞ DỮ LIỆU MỞ (ORD / PubChem / DrugBank schema) ===== */
const OPEN_RXN = window.OPEN_REACTIONS || [];
const OPEN_COMP = window.OPEN_COMPOUNDS || [];
const OPEN_DRUG = window.OPEN_DRUGS || [];
document.getElementById("cntRxn").textContent = OPEN_RXN.length;
document.getElementById("cntComp").textContent = OPEN_COMP.length;
document.getElementById("cntDrug").textContent = OPEN_DRUG.length;

const DB_TABS = [["rxn","⚗️ Phản ứng"],["comp","🧪 Hợp chất"],["drug","💊 Thuốc"],["links","🌐 Tải dữ liệu gốc"]];
const dbTabsEl = document.getElementById("dbTabs");
DB_TABS.forEach(([id, label], i) =>
  dbTabsEl.insertAdjacentHTML("beforeend", `<button data-dbpanel="${id}" class="${i===0?"active":""}">${label}</button>`));
dbTabsEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-dbpanel]");
  if (!btn) return;
  dbTabsEl.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
  document.querySelectorAll("[data-dbpanel]").forEach(p => {
    if (p.classList.contains("kt-panel")) p.classList.toggle("hidden", p.dataset.dbpanel !== btn.dataset.dbpanel);
  });
});

function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

function renderOpenRx() {
  const q = (document.getElementById("openRxFilter")?.value || "").toLowerCase();
  const rows = OPEN_RXN.filter(r =>
    !q || JSON.stringify(r).toLowerCase().includes(q)).slice(0, 60);
  document.getElementById("openRxTable").innerHTML =
    "<tr><th>ID</th><th>Reactants → Products</th><th>Điều kiện</th><th>Yield</th><th>Type</th></tr>" +
    rows.map(r => {
      const rea = r.reactants.map(x => x.name || x.smiles).join(" + ");
      const pro = r.products.map(x => x.name || x.smiles).join(" + ");
      const cond = [r.conditions?.temperature, r.conditions?.solvent, r.conditions?.catalyst].filter(Boolean).join(" · ");
      return `<tr><td><code>${esc(r.reaction_id)}</code></td><td>${esc(rea)} <b>→</b> ${esc(pro)}</td><td>${esc(cond)}</td><td>${esc(r.yield_percent)}</td><td><span class="hint-tag">${esc(r.type)}</span></td></tr>`;
    }).join("") || "<tr><td colspan=5 class=muted>Không có kết quả</td></tr>";
}
function renderOpenComp() {
  const q = (document.getElementById("openCompFilter")?.value || "").toLowerCase();
  const rows = OPEN_COMP.filter(c =>
    !q || JSON.stringify(c).toLowerCase().includes(q)).slice(0, 60);
  document.getElementById("openCompTable").innerHTML =
    "<tr><th>CID</th><th>Tên</th><th>Công thức</th><th>MW</th><th>SMILES</th><th>Nhóm</th></tr>" +
    rows.map(c => `<tr><td>${c.compound_cid ? `<code>${c.compound_cid}</code>` : '<span class="muted">—</span>'}</td><td><b>${esc(c.common_name)}</b></td><td><code>${esc(c.molecular_formula||"")}</code></td><td>${c.molecular_weight ?? "—"}</td><td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;"><code>${esc(c.smiles_string||"")}</code></td><td>${esc(c.category||"")}</td></tr>`).join("") || "<tr><td colspan=6 class=muted>Không có kết quả</td></tr>";
}
function renderOpenDrug() {
  const q = (document.getElementById("openDrugFilter")?.value || "").toLowerCase();
  const rows = OPEN_DRUG.filter(d =>
    !q || JSON.stringify(d).toLowerCase().includes(q)).slice(0, 60);
  document.getElementById("openDrugTable").innerHTML =
    "<tr><th>DrugBank ID</th><th>Tên</th><th>Type</th><th>Lớp</th><th>Target / cơ chế</th></tr>" +
    rows.map(d => `<tr><td>${String(d.drugbank_id).startsWith("DB") ? `<code>${d.drugbank_id}</code>` : `<span class="muted">${d.drugbank_id}</span>`}</td><td><b>${esc(d.name)}</b></td><td>${esc(d.type)}</td><td>${esc(d.drug_class||"")}</td><td>${esc((d.targets||[]).map(t=>t.target_name).join("; ").slice(0,140))}</td></tr>`).join("") || "<tr><td colspan=5 class=muted>Không có kết quả</td></tr>";
}
renderOpenRx(); renderOpenComp(); renderOpenDrug();
["openRxFilter","openCompFilter","openDrugFilter"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", () => ({ openRxFilter: renderOpenRx, openCompFilter: renderOpenComp, openDrugFilter: renderOpenDrug }[id]()));
});

/* ===== THỐNG KÊ HERO ===== */
(function fillStats() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("statEl", ALL_ELEMENTS.length);
  set("statRxn", REACTIONS.length);
  set("statMat", MATERIALS.length);
  set("statLaw", LAWS.length + LAWS_EXTRA.length + LAWS_MED.length);
  set("statDrug", DRUGS.length);
  set("statTl", TIMELINE.length + TIMELINE_EXTRA.length + (typeof TIMELINE_MED !== "undefined" ? TIMELINE_MED.length : 0));
})();

/* ===== TÌM KIẾM TOÀN CỤC ===== */
const gSearch = document.getElementById("globalSearch");
const hintBox = document.getElementById("searchHint");
let activeIdx = -1;

gSearch.addEventListener("input", () => {
  const q = gSearch.value.trim().toLowerCase();
  activeIdx = -1;
  hintBox.innerHTML = "";
  hintBox.classList.toggle("hidden", q.length < 1);
  if (!q) return;

  const results = [];
  ELEMENTS.filter(el =>
    el.name.toLowerCase().includes(q) ||
    el.sym.toLowerCase().startsWith(q) ||
    el.use.toLowerCase().includes(q)
  ).slice(0, 4).forEach(el =>
    results.push({ type: "nguyên tố", label: `${el.name} (${el.sym})`, href: "#tuan-hoan", z: el.z })
  );
  REACTIONS.filter(r => (r.t + r.e + r.n).toLowerCase().includes(q))
    .slice(0, 5)
    .forEach(r => results.push({ type: "phản ứng", label: r.t, href: "#phan-ung", eq: r.e }));
  MATERIALS.filter(m => (m.name + m.sub + m.content).toLowerCase().includes(q))
    .slice(0, 4)
    .forEach(m => results.push({ type: "vật liệu", label: m.name, href: "#vat-lieu-moi", mid: m.id }));
  DRUGS.filter(d => (d.n + d.cls + d.mech + d.note).toLowerCase().includes(q))
    .slice(0, 5)
    .forEach(d => results.push({ type: "thuốc", label: `${d.n} (${d.cls})`, href: "#y-duoc" }));
  OPEN_COMP.filter(c => (c.common_name + c.molecular_formula).toLowerCase().includes(q))
    .slice(0, 4)
    .forEach(c => results.push({ type: "hợp chất DB", label: `${c.common_name} ${c.molecular_formula ? "· " + c.molecular_formula : ""}`, href: "#du-lieu-mo" }));
  OPEN_RXN.filter(r => JSON.stringify(r).toLowerCase().includes(q))
    .slice(0, 4)
    .forEach(r => results.push({ type: "phản ứng DB", label: r.reaction_id, href: "#du-lieu-mo" }));
  LAB_TESTS.filter(l => (l[0] + l[2]).toLowerCase().includes(q))
    .slice(0, 3)
    .forEach(l => results.push({ type: "xét nghiệm", label: l[0], href: "#y-duoc" }));
  LAWS.filter(l => (l.n + l.t + l.w).toLowerCase().includes(q))
    .slice(0, 3)
    .forEach(l => results.push({ type: "định luật", label: l.n, href: "#kien-thuc" }));
  TIMELINE.filter(t => (t.t + t.d).toLowerCase().includes(q))
    .slice(0, 2)
    .forEach(t => results.push({ type: "lịch sử", label: `${t.y} — ${t.t}`, href: "#kien-thuc" }));

  if (!results.length) {
    hintBox.innerHTML = `<a>Không tìm thấy kết quả cho "${gSearch.value.trim()}"</a>`;
    return;
  }
  hintBox.innerHTML = results
    .map(r =>
      `<a href="${r.href}" data-z="${r.z || ""}" data-mid="${r.mid || ""}"><span class="hint-tag">${r.type}</span>${r.label}</a>`
    ).join("");
});

hintBox.addEventListener("click", e => {
  const a = e.target.closest("a");
  if (!a) return;
  const z = a.dataset.z, mid = a.dataset.mid;
  hintBox.classList.add("hidden");
  gSearch.value = "";
  if (z) setTimeout(() => document.querySelector(`.el-cell[data-z="${z}"]`)?.click(), 400);
  else if (mid) setTimeout(() => { showMaterial(mid); }, 400);
});
document.addEventListener("click", e => {
  if (!e.target.closest(".search-wrap")) hintBox.classList.add("hidden");
});
document.addEventListener("keydown", e => {
  if (hintBox.classList.contains("hidden")) return;
  const items = [...hintBox.querySelectorAll("a")];
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    activeIdx = e.key === "ArrowDown"
      ? (activeIdx + 1) % items.length
      : (activeIdx - 1 + items.length) % items.length;
    items.forEach((it, i) => it.classList.toggle("active", i === activeIdx));
  } else if (e.key === "Enter" && activeIdx >= 0) {
    items[activeIdx].click();
  }
});

/* ===== LIÊN KẾT DỮ LIỆU GỐC ===== */
(function renderExternalLinks() {
  const el = document.getElementById("externalLinksGrid");
  if (!el) return;
  const links = [
    {"ChEMBL EMBL-EBI":"https://www.ebi.ac.uk/chembl/","desc":"CSDL hoạt chất sinh học ~2,4M chất. API REST miễn phí, không cần key."},
    {"ChEMBL FTP (tải dump SQL)":"https://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBLdb/latest/","desc":"Tải PostgreSQL/MySQL/SQLite 35GB. File .gz chứa toàn bộ dữ liệu sinh học phân tử."},
    {"ChEMBL Web API Docs":"https://www.ebi.ac.uk/chembl/api/data/docs","desc":"Tài liệu REST API: /molecule, /target, /mechanism, /drug... phân trang JSON."},
    {"PubChem NIH (trang chính)":"https://pubchem.ncbi.nlm.nih.gov/","desc":">115 triệu hợp chất. Tra cứu theo tên, SMILES, CID, cấu trúc vẽ."},
    {"PubChem PUG-REST API":"https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest","desc":"API tra cứu: name→CID, CID→properties, substructure, similarity searches."},
    {"PubChem FTP bulk download":"https://ftp.ncbi.nlm.nih.gov/pubchem/Compound/","desc":"Tải SDF/XML gzipped theo CID range. Hàng trăm GB; compound/substance/bioassay."},
    {"Open Reaction Database (ORD)":"https://open-reaction-database.org/","desc":"CSDL phản ứng mở quốc tế — Protocol Buffers schema. Google/MIT/ACS backed."},
    {"ORD GitHub (ord-data)":"https://github.com/open-reaction-database/ord-data","desc":"Clone repo toàn bộ dataset .pb.gz. Git LFS. Có mirror trên Hugging Face."},
    {"ORD Search Interface":"https://open-reaction-database.org/client/search","desc":"Tìm kiếm phản ứng trực tuyến — filter by yield, solvent, catalyst, reactants."},
    {"ORD schema (ord-schema)":"https://github.com/open-reaction-database/ord-schema","desc":"Python package — parse/validate reaction messages. pip install ord-schema."},
    {"USPTO Reaction Dataset (Lowe)":"https://figshare.com/articles/dataset/Chemical_reactions_from_US_patents_1976-Sep2016_/5104873","desc":"~3,7M phản ứng từ bằng sáng chế Mỹ 1976–2016. Daniel Lowe extract."},
    {"Materials Project":"https://next-gen.materialsproject.org/","desc":">150.000 cấu trúc tinh thể. DFT tính toán band gap, elasticity. Đăng ký free."},
    {"DrugBank Academic":"https://go.drugbank.com/academic","desc":"~15.230 thuốc. Đăng ký email .edu, duyệt 1–2 ngày. XML ZIP 1.5GB. Phi thương mại."},
    {"DrugBank Online (tra cứu)":"https://go.drugbank.com/drugs","desc":"Tra cứu nhanh thuốc online miễn phí. Không cần đăng nhập cho cơ bản."},
    {"PDBe / RCSB Protein Data Bank":"https://www.rcsb.org/","desc":"Cấu trúc 3D protein tinh thể/NMR/Cryo-EM. Dữ liệu mở hoàn toàn."},
    {"ZINC20 Database":"https://zinc20.docking.org/","desc":"~1.4 tỷ hợp chất thương mại để virtual screening docking. Free."},
  ];
  el.innerHTML = links.map((l,i) => {
    const [name, url] = Object.entries(l)[0];
    const desc = l.desc;
    return `<a href="${url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">
      <div class="law-card">
        <h4>🔗 ${name}</h4>
        <div class="law-formula" style="font-size:12px;color:var(--accent);">🌐 ${url}</div>
        <p>${desc}</p>
      </div></a>`;
  }).join("");
})();

/* ===== THEME ===== */
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || (!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.textContent = "☀️";
}
themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  document.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
  localStorage.setItem("theme", dark ? "light" : "dark");
  themeToggle.textContent = dark ? "🌙" : "☀️";
});
