# Phạm vi dữ liệu — Global Scientific Encyclopedia V2.0

> Sinh tự động ngày **2026-11-06** từ các tệp dữ liệu thực tế và `js/core/registry.js`.
> Mọi con số dưới đây được đếm tại thời điểm sinh tài liệu; giao diện đếm lại at runtime.

## 1. Chỉ mục cục bộ (dữ liệu đi kèm website)

| Tập dữ liệu | Số bản ghi | Tệp | Ghi chú |
|---|---:|---|---|
| Nguyên tố hóa học | 118 | `js/elements.js` | 118 nguyên tố đã biết |
| Nguyên tố lý thuyết | 29 | `js/elements.js` | Z > 118, chưa tổng hợp — được ghi rõ |
| Phản ứng biên soạn | 794 | `js/reactions.js` | Phương trình + ghi chú, không bịa điều kiện |
| Vật liệu biên soạn | 257 | `js/materials.js` | Bảo tàng vật liệu, thuộc tính mô tả |
| Dược chất biên soạn | 270 | `js/medicine.js` | Nhóm, cơ chế, ghi chú lịch sử |
| Hợp chất tham chiếu PubChem | 596 | `data/compounds.json` | Có CID, công thức, khối lượng, SMILES |
| Bản ghi phản ứng kiểu ORD | 822 | `data/reactions.json` | Dữ liệu nội bộ mô phỏng cấu trúc ORD; **không** phải ORD chính thức |
| Hồ sơ thuốc kiểu DrugBank | 270 | `data/drugs.json` | Dữ liệu nội bộ; **không** nhập từ DrugBank |
| Định luật & lịch sử | 20 định luật · 38 mốc | `js/knowledge.js` | Nội dung biên soạn |
| Xét nghiệm & phân tích | 18 | `js/advanced.js` | Nội dung biên soạn |

Tổng chỉ mục cục bộ được `Sci.search.localCounts()` tính lại khi chạy: **3156 bản ghi** (chưa gồm định luật/timeline vì chúng không phải thực thể tra cứu).

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

```bash
node --test tests/           # unit + adapter contract tests
node scripts/check.mjs       # cấu trúc shell, tài nguyên, dữ liệu
node scripts/build-docs.mjs  # sinh lại ba tài liệu này
```

Trạng thái `live` chỉ được gán sau khi gọi API thành công từ trình duyệt và ghi ngày
kiểm thử trong registry (hiện tại: 2026-11-06).
