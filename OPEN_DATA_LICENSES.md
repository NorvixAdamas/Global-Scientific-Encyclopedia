# Giấy phép dữ liệu mở — Global Scientific Encyclopedia V2.0

> Sinh tự động từ `js/core/registry.js` ngày **2026-11-06**. Đây là bản tóm tắt vận hành,
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
| [PubChem](https://pubchem.ncbi.nlm.nih.gov/) | Public domain (U.S. Government work) + điều khoản riêng của từng contributor | [terms](https://pubchem.ncbi.nlm.nih.gov/docs/programmatic-access) | Có điều kiện / theo từng record | Live (đã kiểm thử) |
| [ChEBI](https://www.ebi.ac.uk/chebi/) | CC BY 4.0 | [terms](https://www.ebi.ac.uk/chebi/aboutChebiForward) | Có, kèm ghi công | Live (đã kiểm thử) |
| [ChEMBL](https://www.ebi.ac.uk/chembl/) | CC BY-SA 3.0 | [terms](https://www.ebi.ac.uk/chembl/aspects) | Có, theo share-alike | Live (đã kiểm thử) |
| [PubChem BioAssay](https://pubchem.ncbi.nlm.nih.gov/) | Public domain + điều khoản contributor | [terms](https://pubchem.ncbi.nlm.nih.gov/docs/programmatic-access) | Có điều kiện / theo từng record | Live (đã kiểm thử) |
| [NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/) | Hỗn hợp: dữ liệu NIST public domain, dữ liệu contributor giữ bản quyền | [terms](https://www.nist.gov/open/copyright-fair-use-and-licensing-statements-srd-data-software-and-technical-series-publications) | Có điều kiện / theo từng record | Liên kết ngoài |
| [Rhea](https://www.rhea-db.org/) | CC BY 4.0 | [terms](https://www.rhea-db.org/help/license-disclaimer) | Có, kèm ghi công | Live (đã kiểm thử) |
| [Open Reaction Database (ORD)](https://open-reaction-database.org/) | CC BY-SA 4.0 | [terms](https://github.com/open-reaction-database/ord-data/blob/main/LICENSE) | Có, theo share-alike | Bulk / tải file |
| [USPTO reaction dataset (Lowe)](https://figshare.com/articles/dataset/Chemical_reactions_from_US_patents_1976-Sep2016_/5104873) | CC0 1.0 (kiểm tra lại trên trang figshare trước khi phân phối) | [terms](https://figshare.com/articles/dataset/Chemical_reactions_from_US_patents_1976-Sep2016_/5104873) | Có điều kiện / theo từng record | Liên kết ngoài |
| [Crystallography Open Database](https://www.crystallography.net/cod/) | CC0 1.0 / public domain | [terms](https://www.crystallography.net/cod/) | Có thể tái sử dụng (ghi công) | Bulk / tải file |
| [NOMAD](https://nomad-lab.eu/) | CC BY 4.0 | [terms](https://nomad-lab.eu/about/legal) | Có, kèm ghi công | Live (đã kiểm thử) |
| [Materials Project](https://materialsproject.org/) | CC BY 4.0 (dữ liệu đóng góp có thể có điều kiện riêng) | [terms](https://materialsproject.org/about) | Có, kèm ghi công | Live + key miễn phí |
| [AFLOW](https://www.aflow.org/) | Chỉ cho mục đích khoa học/học thuật, phi thương mại | [terms](https://www.aflow.org/) | Không | Liên kết ngoài |
| [RCSB Protein Data Bank](https://www.rcsb.org/) | CC0 1.0 | [terms](https://www.rcsb.org/pages/policies) | Có thể tái sử dụng (ghi công) | Live (đã kiểm thử) |
| [OQMD](https://oqmd.org/) | Miễn phí cho nghiên cứu; kiểm tra điều kiện trước khi phân phối lại | [terms](https://oqmd.org/) | Có điều kiện / theo từng record | Liên kết ngoài |
| [openFDA](https://open.fda.gov/) | Public domain (U.S. Government work) | [terms](https://open.fda.gov/terms/) | Có thể tái sử dụng (ghi công) | Live (đã kiểm thử) |
| [RxNorm / RxNav](https://www.nlm.nih.gov/research/umls/rxnorm/) | Điều khoản UMLS/NLM; một số từ vựng thành phần có điều kiện riêng | [terms](https://lhncbc.nlm.nih.gov/RxNav/TermsofService.html) | Có điều kiện / theo từng record | Live (đã kiểm thử) |
| [DailyMed](https://dailymed.nlm.nih.gov/dailymed/) | Public domain (U.S. Government work) | — | Có thể tái sử dụng (ghi công) | Liên kết ngoài |
| [DrugBank](https://go.drugbank.com/) | Academic non-commercial; bản commercial phải trả phí | [terms](https://go.drugbank.com/legal/terms_of_use) | Không | Loại trừ |
| [ZINC20](https://zinc20.docking.org/) | Miễn phí sử dụng; xem điều kiện trên trang dự án | — | Có điều kiện / theo từng record | Liên kết ngoài |
| [UniProt](https://www.uniprot.org/) | CC BY 4.0 | [terms](https://www.uniprot.org/help/license) | Có, kèm ghi công | Live (đã kiểm thử) |
| [Europe PMC](https://europepmc.org/) | Metadata mở; nội dung bài theo giấy phép từng bài | [terms](https://europepmc.org/terms) | Có điều kiện / theo từng record | Live (đã kiểm thử) |
| [PubMed / NCBI E-utilities](https://pubmed.ncbi.nlm.nih.gov/) | Metadata miễn phí; abstract/toàn văn theo bản quyền nhà xuất bản | [terms](https://www.ncbi.nlm.nih.gov/home/about/policies/) | Có điều kiện / theo từng record | Live (đã kiểm thử) |
| [Crossref](https://www.crossref.org/) | Metadata CC0 | [terms](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) | Có thể tái sử dụng (ghi công) | Live (đã kiểm thử) |
| [Reactome](https://reactome.org/) | CC BY 4.0 (kiểm tra tại reactome.org/license) | [terms](https://reactome.org/license) | Có, kèm ghi công | Live (đã kiểm thử) |
| [Gene Ontology](https://geneontology.org/) | CC BY 4.0 | [terms](https://geneontology.org/docs/go-citation-policy/) | Có, kèm ghi công | Ứng viên |
| [Open Targets Platform](https://platform.opentargets.org/) | CC BY 4.0 | [terms](https://platform.opentargets.org/terms) | Có, kèm ghi công | Ứng viên |
| [KEGG](https://www.kegg.jp/) | Academic license có điều kiện; dữ liệu không được tái phân phối tự do | [terms](https://www.kegg.jp/kegg/legal.html) | Không | Loại trừ |
| [BRENDA](https://www.brenda-enzymes.org/) | Miễn phí cho học thuật, hạn chế thương mại; cần đăng ký | [terms](https://www.brenda-enzymes.org/terms_of_use.php) | Không | Liên kết ngoài |
| [EPA CompTox Chemicals Dashboard](https://comptox.epa.gov/dashboard/) | Public domain (U.S. Government work) | [terms](https://www.epa.gov/web-policies-and-procedures) | Có thể tái sử dụng (ghi công) | Liên kết ngoài |
| [PubChem GHS / Hazard](https://pubchem.ncbi.nlm.nih.gov/) | Tổng hợp từ nhiều nguồn; quyền tái sử dụng theo từng record | [terms](https://pubchem.ncbi.nlm.nih.gov/docs/programmatic-access) | Có điều kiện / theo từng record | Live (đã kiểm thử) |
| [ECHA CHEM](https://chem.echa.europa.eu/) | Điều kiện tái sử dụng của ECHA; một số dữ liệu hạn chế | — | Có điều kiện / theo từng record | Liên kết ngoài |
| [MassBank](https://massbank.eu/MassBank/) | Từng record có giấy phép riêng (thường CC BY-SA hoặc CC BY) | — | Có điều kiện / theo từng record | Liên kết ngoài |
| [NMRShiftDB2](https://nmrshiftdb.nmr.uni-koeln.de/) | CC BY-SA / điều kiện đóng góp từng record | — | Có điều kiện / theo từng record | Liên kết ngoài |
| [Wikidata](https://www.wikidata.org/) | CC0 1.0 | [terms](https://www.wikidata.org/wiki/Wikidata:Licensing) | Có thể tái sử dụng (ghi công) | Ứng viên |
| [Zenodo](https://zenodo.org/) | Metadata CC0; từng dataset có license riêng | — | Có điều kiện / theo từng record | Ứng viên |
| [CAS Registry / SciFinder](https://www.cas.org/) | Thương mại, trả phí, cấm scrape | — | Không | Loại trừ |
| [Reaxys](https://www.reaxys.com/) | Thuê bao thương mại | — | Không | Loại trừ |
| [Cambridge Structural Database](https://www.ccdc.cam.ac.uk/) | Thương mại (một phần miễn phí cho học thuật) | — | Không | Loại trừ |
| [ICSD](https://icsd.fiz-karlsruhe.de/) | Thuê bao | — | Không | Loại trừ |

## 4. Ghi công bắt buộc trong giao diện

Mỗi bản ghi hiển thị khối **Provenance** gồm: nguồn, record id, giấy phép, loại dữ liệu
(thực nghiệm / tính toán / curated / quản lý / dự đoán) và thời điểm truy vấn. Trang
**Nguồn dữ liệu** liệt kê toàn bộ 39 nguồn kèm liên kết tới điều khoản gốc.

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

Mở issue/ghi chú trong kho, đánh dấu nguồn là `rejected` trong registry, gỡ connector và
liên kết tương ứng, rồi chạy lại `node scripts/build-docs.mjs`. Việc gỡ bỏ ưu tiên hơn việc giữ dữ liệu.
