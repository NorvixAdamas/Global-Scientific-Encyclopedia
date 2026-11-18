# Global Scientific Encyclopedia V2.0

Bách khoa toàn thư khoa học mở, song ngữ Việt–Anh: **hóa học · vật liệu · dược học · sinh học**.
Website tĩnh, không build, không framework, không dịch vụ trả phí; dữ liệu biên soạn đi kèm
được kết nối với các cơ sở dữ liệu khoa học mở quốc tế truy vấn trực tiếp từ trình duyệt.

- Bản đang chạy: https://norvixadamas.github.io/To-n-Th-H-a-H-c-V-t-Li-u/
- Kiến trúc: HTML + CSS + JavaScript thuần (`window.Sci`), publish trực tiếp thư mục gốc.
- Nguồn dữ liệu & giấy phép: [`DATA_SOURCES.md`](DATA_SOURCES.md), [`OPEN_DATA_LICENSES.md`](OPEN_DATA_LICENSES.md), [`DATABASE_COVERAGE.md`](DATABASE_COVERAGE.md).

## Tính năng

- **24 khu vực tri thức** trong 6 nhóm điều hướng: bản đồ khoa học, hóa học, vật liệu, dược & sinh,
  nghiên cứu, học tập.
- **Tìm kiếm toàn cầu**: tên, IUPAC, đồng nghĩa, công thức, SMILES, InChI/InChIKey, CID,
  ChEBI, ChEMBL, Rhea, UniProt, DOI, PMID; nhận diện loại định danh trước khi tra cứu,
  gợi ý tức thời từ chỉ mục cục bộ, kết quả trực tiếp tải song song kèm trạng thái từng nguồn.
- **Hồ sơ hợp chất**: tính chất từ nhiều nguồn hiển thị song song, định danh chéo, cấu trúc 2D
  (PubChem), hoạt tính ChEMBL, GHS, phản ứng Rhea, nhãn openFDA, tài liệu Europe PMC.
- **Phản ứng**: thư viện biên soạn, bản ghi kiểu ORD nội bộ (dán nhãn rõ), phản ứng sinh hóa Rhea.
- **Vật liệu**: bảo tàng vật liệu biên soạn, tra NOMAD/RCSB, Materials Project khi có khoá miễn phí.
- **Dược phẩm**: nhãn FDA, RxNorm/RxClass, ChEMBL, thu hồi, FAERS — tách khỏi góc y dược lâm sàng biên soạn.
- **Hóa sinh & tài liệu**: UniProt (trình tự, chức năng, PDB, Rhea), Reactome, Europe PMC/PubMed/Crossref.
- **Công cụ**: khối lượng mol & thành phần nguyên tố, cân bằng phương trình, đơn vị, dung dịch,
  giải mã định danh, xem cấu trúc. Mọi kết quả tính toán được dán nhãn "do công cụ tính".
- **Đồ thị tri thức** từ dữ liệu cục bộ (canvas, không thư viện ngoài).
- **Minh bạch dữ liệu**: mỗi bản ghi có nguồn, record id, giấy phép, loại dữ liệu và thời điểm lấy;
  giá trị xung đột không bị trung bình hóa; bản ghi không bao giờ được hợp nhất chỉ vì trùng tên.

## Chạy cục bộ

```bash
node server.js          # http://127.0.0.1:8765
# hoặc
npm run serve
```

Không cần cài dependency, không cần bước build. Node ≥ 20 chỉ dùng cho server tĩnh và kiểm thử.

## Kiểm thử & kiểm tra

```bash
node --test tests/      # unit + adapter contract tests (không gọi mạng)
node scripts/check.mjs  # shell, tài nguyên, id legacy, cú pháp JS/CSS, registry, tài liệu
node scripts/build-docs.mjs   # sinh lại 3 tài liệu dữ liệu từ registry + dữ liệu thật
npm run verify          # check + tests
```

Bộ test chạy các script cổ điển trong `node:vm` với `fetch`/`localStorage` giả lập, nên không
phụ thuộc mạng và không cần trình duyệt.

## Cấu trúc

```
index.html                 shell V2 (sinh bởi scripts/build-shell.mjs), chứa #legacyRoot
css/style.css              giao diện v1 được giữ nguyên
css/v2.css                 thiết kế V2 (token, shell, view mới, tinh chỉnh legacy)
legacy/index.v1.html       bản gốc v1 (nguồn để tái tạo shell)
js/core/                   registry, net, entity, adapters, search, tools, graph, ui, nav
js/views/                  atlas, search, sources, graph, chemistry, reactions, pharma, tools, settings
js/app.js                  header, hash router, mount legacy, hộp thoại tìm kiếm
data/                      dữ liệu tham chiếu (compounds, reactions, drugs) + topics
scripts/                   build-shell, build-docs, check
tests/                     node:test + helper vm
```

### Vì sao giữ kiến trúc không build?

Dữ liệu và renderer v1 (`js/elements.js`, `reactions.js`, `materials.js`, `medicine.js`,
`knowledge.js`, `advanced.js`, `main.js`) thực thi ngay khi tải và gắn với các id DOM cụ thể.
Thay vì viết lại (rủi ro mất nội dung), V2 **giữ nguyên toàn bộ markup cũ** trong `#legacyRoot`
và chỉ hiển thị đúng section khi route tương ứng. `js/core/data-bridge.js` chuyển các dataset
khai báo bằng `const` sang `window` để chỉ mục tìm kiếm và đồ thị đọc được.

Các route cũ (`#tuan-hoan`, `#phan-ung`, `#vat-lieu-moi`, `#y-duoc`, `#chuyen-sau`, `#du-lieu-mo`,
`#kien-thuc`) được tự động chuyển sang route V2 tương ứng, nên bookmark cũ vẫn dùng được.

## Khoá API (tuỳ chọn)

Website hoạt động đầy đủ khi không có khoá. Ba nguồn có khoá **miễn phí**:

| Nguồn | Bắt buộc? | Tác dụng |
|---|---|---|
| Materials Project | Chỉ cho tab vật liệu trực tuyến | Tính chất DFT |
| openFDA | Không | Tăng hạn mức request/ngày |
| NCBI E-utilities | Không | Tăng request/giây |

Nhập tại `#/settings`; khoá lưu trong `localStorage` của **chính trình duyệt người dùng**.
Không có khoá nào trong mã nguồn hay tệp tĩnh. `.env.example` chỉ dành cho proxy Netlify Function
tuỳ chọn (giữ khoá phía máy chủ); xem `netlify/functions/README.md`.

> Cảnh báo: không nhập khoá trên máy tính công cộng. Khoá trong `localStorage` chỉ gửi tới API
> chính thức (hoặc proxy do bạn cấu hình).

## Triển khai GitHub Pages

Workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) tự động publish
trang lên GitHub Pages mỗi khi push vào `main` (hoặc chạy tay từ tab Actions).

- Địa chỉ: https://norvixadamas.github.io/To-n-Th-H-a-H-c-V-t-Li-u/
- Không có bước build: workflow sao chép đúng các tệp tĩnh của trang (`index.html`, `css/`, `js/`,
  `data/`, `legacy/`, các tệp `.md`) và bỏ qua `.git`, `.github`, `tests/`, `scripts/`, `netlify/`.
- Trong **Settings → Pages**, mục **Source** phải là **GitHub Actions** (workflow tự bật khi repo
  cho phép; nếu chưa bật, chọn GitHub Actions một lần là xong).
- Trang là project site nên đường dẫn gốc có tiền tố `/To-n-Th-H-a-H-c-V-t-Li-u/`; mọi tài nguyên
  trong `index.html` đều dùng đường dẫn tương đối và điều hướng bằng hash (`#/...`) nên chạy đúng.

## Triển khai Netlify (tuỳ chọn)

`netlify.toml` đã cấu hình publish tại thư mục gốc, không build command, kèm CSP/security headers.
Chỉ cần kéo thả hoặc nối repo; không cần biến môi trường cho bản tĩnh.

## Chính sách dữ liệu

- Không bịa bản ghi, điều kiện thực nghiệm, hiệu suất hay cơ chế.
- Không hiển thị số lượng bản ghi của nguồn ngoài như thể đã nhập toàn bộ.
- Phân biệt rõ: dữ liệu **thực nghiệm**, **tính toán**, **curated**, **quản lý**, **dự đoán**.
- Dữ liệu thương mại/không tái phân phối (DrugBank, Reaxys, CAS, CSD, ICSD, KEGG, BRENDA)
  chỉ được liên kết ngoài, không nhập.
- Nội dung y dược không dùng để chẩn đoán, kê đơn hay cấp cứu.

## Giới hạn đã biết

- Không có phổ thực nghiệm (IR/MS/NMR) trong chỉ mục; chỉ liên kết NIST/MassBank/NMRShiftDB.
- ORD/AFLOW/USPTO ở dạng liên kết/bulk, chưa ingest.
- Materials Project cần khoá; nếu chưa cấu hình, UI nêu rõ thay vì hiển thị dữ liệu giả.
- openFDA chỉ bao phủ sản phẩm lưu hành tại Hoa Kỳ.
- Báo cáo FAERS là báo cáo tự nguyện, không chứng minh nhân quả.

## Ghi công

Dữ liệu thuộc về các tổ chức tương ứng: PubChem/NCBI, EMBL-EBI (ChEBI, ChEMBL, Rhea, Europe PMC,
UniProt, Reactome), NLM (RxNorm, PubMed), U.S. FDA (openFDA), RCSB PDB, Crossref, NOMAD,
Materials Project, và các cộng đồng khoa học mở khác. Xem chi tiết trong
[`OPEN_DATA_LICENSES.md`](OPEN_DATA_LICENSES.md).
