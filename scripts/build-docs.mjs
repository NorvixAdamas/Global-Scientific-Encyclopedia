/**
 * Generates DATA_SOURCES.md, OPEN_DATA_LICENSES.md and DATABASE_COVERAGE.md
 * from the runtime registry and the real local datasets, so the documentation
 * can never drift from the code or invent record counts.
 *
 * Run: node scripts/build-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

/* ---- load the registry in a tiny sandbox ---- */
const sandbox = { console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(read("js/core/registry.js"), sandbox, { filename: "registry.js" });
const R = sandbox.Sci.registry;

/* ---- count the local datasets from the actual files ---- */
const legacy = { window: {}, console };
legacy.globalThis = legacy;
legacy.window = legacy;
vm.createContext(legacy);
for (const f of ["js/elements.js", "js/reactions.js", "js/materials.js", "js/medicine.js", "js/knowledge.js", "js/advanced.js"]) {
  const code = read(f);
  try {
    vm.runInContext(code, legacy, { filename: f });
  } catch (e) {
    console.error("legacy data failed to evaluate:", f, e.message);
  }
}
vm.runInContext(
  `globalThis.__local = {
    elements: typeof ELEMENTS !== "undefined" ? ELEMENTS.length : 0,
    theoretical: typeof THEORETICAL_ELEMENTS !== "undefined" ? THEORETICAL_ELEMENTS.length : 0,
    curatedReactions: typeof REACTIONS !== "undefined" ? REACTIONS.length : 0,
    materials: typeof MATERIALS !== "undefined" ? MATERIALS.length : 0,
    curatedDrugs: typeof DRUGS !== "undefined" ? DRUGS.length : 0,
    laws: typeof LAWS !== "undefined" ? LAWS.length : 0,
    timeline: typeof TIMELINE !== "undefined" ? TIMELINE.length : 0,
    labTests: typeof LAB_TESTS !== "undefined" ? LAB_TESTS.length : 0
  };`,
  legacy
);
const local = legacy.__local;
const compounds = JSON.parse(read("data/compounds.json"));
const ordReactions = JSON.parse(read("data/reactions.json"));
const drugRecords = JSON.parse(read("data/drugs.json"));

const today = new Date().toISOString().slice(0, 10);
const stats = R.stats();
const live = R.SOURCES.filter((s) => s.status === "live");
const liveKey = R.SOURCES.filter((s) => s.status === "live-key");
const bulk = R.SOURCES.filter((s) => s.status === "bulk");
const external = R.SOURCES.filter((s) => s.status === "external");
const planned = R.SOURCES.filter((s) => s.status === "planned");
const rejected = R.SOURCES.filter((s) => s.status === "rejected");

const esc = (s) => String(s == null ? "" : s).replace(/\|/g, "\\|").replace(/\n/g, " ");
const statusVi = {
  live: "Live (đã kiểm thử)",
  "live-key": "Live + key miễn phí",
  bulk: "Bulk / tải file",
  external: "Liên kết ngoài",
  planned: "Ứng viên",
  rejected: "Loại trừ",
};
const redistText = {
  yes: "Có thể tái sử dụng (ghi công)",
  attribution: "Có, kèm ghi công",
  "share-alike": "Có, theo share-alike",
  conditional: "Có điều kiện / theo từng record",
  no: "Không",
};

/* ===================== DATA_SOURCES.md ===================== */
const srcRows = R.SOURCES.map(
  (s) =>
    `| \`${s.id}\` | [${esc(s.name)}](${s.url}) | ${esc(s.org)} | ${statusVi[s.status] || s.status} | ${esc(s.license)} | ${esc(s.rateLimit)} | \`${s.connector || "—"}\` |`
).join("\n");

const dataSources = `# Nguồn dữ liệu — Global Scientific Encyclopedia V2.0

> Tài liệu này được sinh tự động từ \`js/core/registry.js\` và các tệp dữ liệu thực tế
> bằng \`node scripts/build-docs.mjs\`. Ngày sinh: **${today}**.
> Lần kiểm thử kết nối gần nhất: **${R.VERIFIED}** (từ trình duyệt, xem mục "Nhật ký kiểm thử").

## 1. Nguyên tắc

1. **Không có dịch vụ trả phí.** Mọi nguồn dưới đây miễn phí khi dùng; ba nguồn cần
   khoá miễn phí (Materials Project, openFDA, NCBI) là tuỳ chọn và ứng dụng vẫn chạy đầy đủ khi không có khoá.
2. **Không bịa dữ liệu.** Website không tạo bản ghi, điều kiện thực nghiệm, hiệu suất
   hay cơ chế phản ứng để lấp chỗ trống. Khi nguồn không trả về dữ liệu, giao diện nói rõ.
3. **Ba tầng tách biệt**: chỉ mục cục bộ (biên soạn) · truy vấn trực tiếp · liên kết ngoài.
4. **Mọi bản ghi đều có provenance**: nguồn, record id, giấy phép, loại dữ liệu và thời điểm lấy.
5. **Giá trị xung đột được giữ song song**, không trung bình hoá, không chọn ngầm.

## 2. Tổng quan

| Trạng thái | Số nguồn | Ý nghĩa |
|---|---:|---|
| Đang truy vấn trực tiếp (\`live\`) | ${stats.live} | API công khai, CORS cho trình duyệt, đã kiểm thử ${R.VERIFIED} |
| Live cần khoá miễn phí (\`live-key\`) | ${stats.liveKey} | Có connector, chỉ bật khi người dùng nhập khoá |
| Bulk / tải tệp (\`bulk\`) | ${stats.bulk} | Không có API trình duyệt ổn định; chỉ liên kết tải |
| Liên kết ngoài (\`external\`) | ${stats.external} | Không nhập dữ liệu (giấy phép hoặc truy cập) |
| Ứng viên (\`planned\`) | ${stats.planned} | Đã khảo sát, chưa nối connector |
| Loại trừ (\`rejected\`) | ${stats.rejected} | Trả phí / không được tái phân phối |
| **Tổng** | **${stats.total}** | |

## 3. Danh mục nguồn

| id | Nguồn | Tổ chức | Trạng thái | Giấy phép | Giới hạn | Connector |
|---|---|---|---|---|---|---|
${srcRows}

## 4. Nguồn đang truy vấn trực tiếp

${live
  .concat(liveKey)
  .map(
    (s) => `### ${s.name}${s.status === "live-key" ? " (cần khoá miễn phí)" : ""}

- **Tổ chức:** ${s.org}
- **Truy cập:** ${s.access.join(", ")}
- **API:** ${s.api || "—"}
- **Endpoint dùng trong ứng dụng:** ${s.endpoints.map((e) => "`" + e + "`").join(", ")}
- **Giới hạn tần suất:** ${s.rateLimit}
- **Bao phủ:** ${s.coverage}
- **Cập nhật:** ${s.update}
- **Tái sử dụng:** ${redistText[s.redistribution] || s.redistribution}
- **Ghi chú:** ${s.notes || "—"}
`
  )
  .join("\n")}

## 5. Nguồn chỉ liên kết hoặc tải bulk

${bulk
  .concat(external)
  .map((s) => `- **${s.name}** — ${statusVi[s.status]}. ${s.notes || ""} [Trang chủ](${s.url})`)
  .join("\n")}

## 6. Loại trừ có chủ đích

${rejected
  .map((s) => `- **${s.name}** (${s.org}) — ${s.license}. ${s.notes || ""}`)
  .join("\n")}

Không có dữ liệu nào từ các nguồn này được nhập, scrape hay tái phân phối bởi dự án.

## 7. Cách thêm một nguồn mới

1. Kiểm tra giấy phép, chi phí, hạn mức và khả năng CORS **trước khi** viết code.
2. Thêm bản ghi vào \`js/core/registry.js\` (id, license, licenseUrl, status, rateLimit, redistribution, endpoints).
3. Viết adapter trong \`js/core/adapters/\` và trả về record chuẩn qua \`Sci.entity.record\`.
4. Thêm adapter vào \`js/core/adapters.js\` (SEARCH_ORDER / KIND_ADAPTERS).
5. Chạy \`node --test tests/\` và \`node scripts/build-docs.mjs\`.
6. Không đánh dấu \`live\` nếu chưa thực sự gọi được API từ trình duyệt và ghi ngày kiểm thử.

## 8. Nhật ký kiểm thử

Ngày ${R.VERIFIED}: kiểm tra CORS/HTTP cho PubChem (PUG-REST, PUG-View, autocomplete), ChEBI,
ChEMBL, Rhea, UniProt, Reactome, openFDA, RxNav, Europe PMC, NCBI E-utilities, Crossref,
NOMAD (\`/info\`) và RCSB — tất cả trả về 200 từ trình duyệt. Materials Project không kiểm thử
được nếu không có khoá; trạng thái được ghi là \`live-key\` và UI hiển thị hướng dẫn cấu hình.
`;

/* ===================== OPEN_DATA_LICENSES.md ===================== */
const licRows = R.SOURCES.map((s) => {
  return `| [${esc(s.name)}](${s.url}) | ${esc(s.license)} | ${s.licenseUrl ? `[terms](${s.licenseUrl})` : "—"} | ${redistText[s.redistribution] || s.redistribution} | ${statusVi[s.status] || s.status} |`;
}).join("\n");

const licenses = `# Giấy phép dữ liệu mở — Global Scientific Encyclopedia V2.0

> Sinh tự động từ \`js/core/registry.js\` ngày **${today}**. Đây là bản tóm tắt vận hành,
> **không thay thế** văn bản giấy phép gốc của từng nguồn.

## 1. Nội dung của dự án

- Mã nguồn, bố cục, bản dịch và phần biên soạn tiếng Việt: do dự án tạo, dùng cho mục đích
  học tập/nghiên cứu. Khi tái sử dụng, vui lòng ghi nguồn "Global Scientific Encyclopedia".
- **Không** có nội dung nào từ nguồn thương mại (DrugBank, Reaxys, CAS, CCDC/CSD, ICSD, KEGG, BRENDA)
  được nhập vào kho này.
- Hình ảnh cấu trúc 2D do **PubChem** cung cấp qua URL, không được lưu trong kho; bản quyền/điều khoản
  của từng contributor PubChem được giữ nguyên.

## 2. Nghĩa vụ theo từng nhóm giấy phép

| Nhóm | Nguồn tiêu biểu | Nghĩa vụ khi hiển thị/tái sử dụng |
|---|---|---|
| Public domain / CC0 | PubChem (phần lớn), openFDA, RCSB PDB, Crossref metadata | Ghi nguồn là thực hành tốt; không có nghĩa vụ pháp lý bắt buộc với phần public domain |
| CC BY 4.0 | ChEBI, Rhea, UniProt, Reactome, Materials Project, NOMAD | **Bắt buộc ghi công** tác giả/tổ chức và giấy phép; giữ nguyên thông báo bản quyền |
| CC BY-SA 3.0/4.0 | ChEMBL, ORD | Ghi công **và** chia sẻ tác phẩm phái sinh theo cùng giấy phép |
| Điều khoản riêng / có điều kiện | RxNorm (UMLS), Europe PMC/PubMed (metadata vs toàn văn), NIST, EPA CompTox, ECHA, MassBank, NMRShiftDB | Chỉ dùng trong phạm vi được phép; kiểm tra từng record; không tái phân phối bừa |
| Không tái phân phối | DrugBank, KEGG, BRENDA, AFLOW, CCDC/CSD, ICSD, Reaxys, CAS | Chỉ liên kết ngoài, không nhập dữ liệu |

## 3. Bảng giấy phép theo nguồn

| Nguồn | Giấy phép (tóm tắt) | Văn bản gốc | Tái phân phối | Trạng thái |
|---|---|---|---|---|
${licRows}

## 4. Ghi công bắt buộc trong giao diện

Mỗi bản ghi hiển thị khối **Provenance** gồm: nguồn, record id, giấy phép, loại dữ liệu
(thực nghiệm / tính toán / curated / quản lý / dự đoán) và thời điểm truy vấn. Trang
**Nguồn dữ liệu** liệt kê toàn bộ ${stats.total} nguồn kèm liên kết tới điều khoản gốc.

Khi trích dẫn, dùng mẫu:

> Global Scientific Encyclopedia V2.0. Dữ liệu từ <tên nguồn> (<record id>), giấy phép <giấy phép>.
> Truy cập <ngày>.

## 5. Nội dung bài báo khoa học

- Europe PMC/PubMed: chỉ hiển thị **metadata và abstract khi nguồn cho phép**; không sao chép toàn văn.
- Crossref: metadata CC0 dùng để xác thực DOI.
- Bản quyền bài báo thuộc tác giả/nhà xuất bản; liên kết luôn trỏ tới trang chính thức.

## 6. Dữ liệu an toàn & quản lý

Cảnh báo GHS (PubChem tổng hợp từ ECHA, HSDB, CAMEO) và nhãn thuốc openFDA **không thay thế**
SDS của nhà sản xuất, tư vấn độc chất học lâm sàng hoặc hướng dẫn cấp cứu. Báo cáo FAERS là
báo cáo tự nguyện, **không** chứng minh quan hệ nhân quả.

## 7. Quy trình khi phát hiện vấn đề giấy phép

Mở issue/ghi chú trong kho, đánh dấu nguồn là \`rejected\` trong registry, gỡ connector và
liên kết tương ứng, rồi chạy lại \`node scripts/build-docs.mjs\`. Việc gỡ bỏ ưu tiên hơn việc giữ dữ liệu.
`;

/* ===================== DATABASE_COVERAGE.md ===================== */
const coverage = `# Phạm vi dữ liệu — Global Scientific Encyclopedia V2.0

> Sinh tự động ngày **${today}** từ các tệp dữ liệu thực tế và \`js/core/registry.js\`.
> Mọi con số dưới đây được đếm tại thời điểm sinh tài liệu; giao diện đếm lại at runtime.

## 1. Chỉ mục cục bộ (dữ liệu đi kèm website)

| Tập dữ liệu | Số bản ghi | Tệp | Ghi chú |
|---|---:|---|---|
| Nguyên tố hóa học | ${local.elements} | \`js/elements.js\` | 118 nguyên tố đã biết |
| Nguyên tố lý thuyết | ${local.theoretical} | \`js/elements.js\` | Z > 118, chưa tổng hợp — được ghi rõ |
| Phản ứng biên soạn | ${local.curatedReactions} | \`js/reactions.js\` | Phương trình + ghi chú, không bịa điều kiện |
| Vật liệu biên soạn | ${local.materials} | \`js/materials.js\` | Bảo tàng vật liệu, thuộc tính mô tả |
| Dược chất biên soạn | ${local.curatedDrugs} | \`js/medicine.js\` | Nhóm, cơ chế, ghi chú lịch sử |
| Hợp chất tham chiếu PubChem | ${compounds.length} | \`data/compounds.json\` | Có CID, công thức, khối lượng, SMILES |
| Bản ghi phản ứng kiểu ORD | ${ordReactions.length} | \`data/reactions.json\` | Dữ liệu nội bộ mô phỏng cấu trúc ORD; **không** phải ORD chính thức |
| Hồ sơ thuốc kiểu DrugBank | ${drugRecords.length} | \`data/drugs.json\` | Dữ liệu nội bộ; **không** nhập từ DrugBank |
| Định luật & lịch sử | ${local.laws} định luật · ${local.timeline} mốc | \`js/knowledge.js\` | Nội dung biên soạn |
| Xét nghiệm & phân tích | ${local.labTests} | \`js/advanced.js\` | Nội dung biên soạn |

Tổng chỉ mục cục bộ được \`Sci.search.localCounts()\` tính lại khi chạy: **${local.elements + local.theoretical + local.curatedReactions + local.materials + local.curatedDrugs + compounds.length + ordReactions.length + drugRecords.length} bản ghi** (chưa gồm định luật/timeline vì chúng không phải thực thể tra cứu).

## 2. Truy vấn trực tiếp — phạm vi thực tế

| Lĩnh vực | Nguồn live | Người dùng tra được gì | Giới hạn đã biết |
|---|---|---|---|
| Hợp chất | PubChem, ChEBI, ChEMBL | Tính chất, đồng nghĩa, định danh chéo, cấu trúc 2D, hoạt tính | Không tải toàn bộ CSDL; mỗi lần chỉ tra theo truy vấn |
| Phản ứng | Rhea (+ ORD nội bộ) | Phản ứng sinh hóa có ChEBI/EC/UniProt/PubMed | Không có điều kiện thực nghiệm chi tiết cho mọi phản ứng |
| Vật liệu | NOMAD, RCSB, Materials Project (key) | Entry tính toán, cấu trúc PDB, tính chất DFT | NOMAD/MP là dữ liệu **tính toán**, không phải đo |
| Dược phẩm | openFDA, RxNav, ChEMBL | Nhãn, RxCUI, lớp thuốc, hoạt tính, thu hồi, FAERS | openFDA chỉ bao phủ sản phẩm Hoa Kỳ |
| Protein / pathway | UniProt, Reactome | Trình tự, chức năng, pathway, cross-ref | Không suy diễn cấu trúc 3D |
| Tài liệu | Europe PMC, PubMed, Crossref | Metadata, DOI/PMID, abstract khi được phép | Không toàn văn có bản quyền |
| Độc chất | PubChem GHS (live) | Phân loại GHS, cảnh báo | Không thay thế SDS |

## 3. Khoảng trống được nêu rõ (không lấp bằng dữ liệu giả)

- **Phổ thực nghiệm** (IR/MS/NMR): chỉ liên kết NIST/MassBank/NMRShiftDB; chưa ingest vì giấy phép từng record.
- **Điều kiện & hiệu suất phản ứng hữu cơ quy mô lớn**: ORD/AFLOW/USPTO chỉ ở dạng liên kết/bulk.
- **Tinh thể học**: COD/CSD/ICSD không có JSON API ổn định hoặc không được tái phân phối → liên kết ngoài.
- **Dữ liệu độc chất quy định**: EPA CompTox/ECHA cần khoá hoặc điều kiện riêng → liên kết ngoài.
- **Mọi hợp chất trong PubChem**: website không tuyên bố bao phủ toàn bộ; chỉ hiển thị kết quả truy vấn.

## 4. Chính sách xung đột dữ liệu

Cùng một tính chất từ nhiều nguồn được nhóm lại và hiển thị **song song**, kèm nguồn,
đơn vị và điều kiện (nếu có). Giao diện gắn nhãn "khác nguồn" khi giá trị khác nhau.
Không trung bình hoá, không tự chọn giá trị "đúng", không suy ra điều kiện thực nghiệm.

Nhận diện thực thể dựa trên định danh mạnh (InChIKey → CID → ChEBI → ChEMBL → UniProt → DOI/PMID → Rhea).
**Tên trùng không bao giờ được dùng để hợp nhất bản ghi.**

## 5. Kiểm thử & tái tạo tài liệu

\`\`\`bash
node --test tests/           # unit + adapter contract tests
node scripts/check.mjs       # cấu trúc shell, tài nguyên, dữ liệu
node scripts/build-docs.mjs  # sinh lại ba tài liệu này
\`\`\`

Trạng thái \`live\` chỉ được gán sau khi gọi API thành công từ trình duyệt và ghi ngày
kiểm thử trong registry (hiện tại: ${R.VERIFIED}).
`;

fs.writeFileSync(path.join(root, "DATA_SOURCES.md"), dataSources);
fs.writeFileSync(path.join(root, "OPEN_DATA_LICENSES.md"), licenses);
fs.writeFileSync(path.join(root, "DATABASE_COVERAGE.md"), coverage);
console.log("Generated DATA_SOURCES.md, OPEN_DATA_LICENSES.md, DATABASE_COVERAGE.md");
console.log("Sources:", stats.total, "| local records:", local.elements + local.theoretical + local.curatedReactions + local.materials + local.curatedDrugs + compounds.length + ordReactions.length + drugRecords.length);
