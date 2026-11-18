# Nguồn dữ liệu — Global Scientific Encyclopedia V2.0

> Tài liệu này được sinh tự động từ `js/core/registry.js` và các tệp dữ liệu thực tế
> bằng `node scripts/build-docs.mjs`. Ngày sinh: **2026-11-06**.
> Lần kiểm thử kết nối gần nhất: **2026-11-06** (từ trình duyệt, xem mục "Nhật ký kiểm thử").

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
| Đang truy vấn trực tiếp (`live`) | 15 | API công khai, CORS cho trình duyệt, đã kiểm thử 2026-11-06 |
| Live cần khoá miễn phí (`live-key`) | 1 | Có connector, chỉ bật khi người dùng nhập khoá |
| Bulk / tải tệp (`bulk`) | 2 | Không có API trình duyệt ổn định; chỉ liên kết tải |
| Liên kết ngoài (`external`) | 11 | Không nhập dữ liệu (giấy phép hoặc truy cập) |
| Ứng viên (`planned`) | 4 | Đã khảo sát, chưa nối connector |
| Loại trừ (`rejected`) | 6 | Trả phí / không được tái phân phối |
| **Tổng** | **39** | |

## 3. Danh mục nguồn

| id | Nguồn | Tổ chức | Trạng thái | Giấy phép | Giới hạn | Connector |
|---|---|---|---|---|---|---|
| `pubchem` | [PubChem](https://pubchem.ncbi.nlm.nih.gov/) | NCBI / U.S. National Library of Medicine | Live (đã kiểm thử) | Public domain (U.S. Government work) + điều khoản riêng của từng contributor | ≈5 request/giây; tự giới hạn 220 ms/request | `js/core/adapters/chemistry.js` |
| `chebi` | [ChEBI](https://www.ebi.ac.uk/chebi/) | EMBL-EBI | Live (đã kiểm thử) | CC BY 4.0 | Không công bố; dùng cache và giới hạn ~10 req/giây | `js/core/adapters/chemistry.js` |
| `chembl` | [ChEMBL](https://www.ebi.ac.uk/chembl/) | EMBL-EBI | Live (đã kiểm thử) | CC BY-SA 3.0 | Không công bố; giới hạn ~8 req/giây ở client | `js/core/adapters/chemistry.js` |
| `pubchem-bioassay` | [PubChem BioAssay](https://pubchem.ncbi.nlm.nih.gov/) | NCBI / NLM | Live (đã kiểm thử) | Public domain + điều khoản contributor | ≈5 request/giây | `js/core/adapters/chemistry.js` |
| `nist-webbook` | [NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/) | NIST (U.S. Department of Commerce) | Liên kết ngoài | Hỗn hợp: dữ liệu NIST public domain, dữ liệu contributor giữ bản quyền | Không có API công khai | `—` |
| `rhea` | [Rhea](https://www.rhea-db.org/) | SIB Swiss Institute of Bioinformatics / EMBL-EBI | Live (đã kiểm thử) | CC BY 4.0 | Không công bố | `js/core/adapters/chemistry.js` |
| `ord` | [Open Reaction Database (ORD)](https://open-reaction-database.org/) | ORD Consortium (Google, ACS, MIT và cộng đồng) | Bulk / tải file | CC BY-SA 4.0 | Tải file, không có REST API công khai | `—` |
| `usp-to` | [USPTO reaction dataset (Lowe)](https://figshare.com/articles/dataset/Chemical_reactions_from_US_patents_1976-Sep2016_/5104873) | Daniel Lowe / NextMove Software | Liên kết ngoài | CC0 1.0 (kiểm tra lại trên trang figshare trước khi phân phối) | n/a | `—` |
| `cod` | [Crystallography Open Database](https://www.crystallography.net/cod/) | COD Consortium | Bulk / tải file | CC0 1.0 / public domain | không có REST JSON ổn định | `—` |
| `nomad` | [NOMAD](https://nomad-lab.eu/) | FAIRmat / Humboldt-Universität zu Berlin | Live (đã kiểm thử) | CC BY 4.0 | không công bố; dùng phân trang nhỏ | `js/core/adapters/applied.js` |
| `materials-project` | [Materials Project](https://materialsproject.org/) | LBNL / UC Berkeley | Live + key miễn phí | CC BY 4.0 (dữ liệu đóng góp có thể có điều kiện riêng) | theo tài khoản; mặc định khá thấp | `js/core/adapters/applied.js` |
| `aflow` | [AFLOW](https://www.aflow.org/) | Duke University | Liên kết ngoài | Chỉ cho mục đích khoa học/học thuật, phi thương mại | tuỳ điều kiện sử dụng | `—` |
| `rcsb-pdb` | [RCSB Protein Data Bank](https://www.rcsb.org/) | RCSB PDB / wwPDB | Live (đã kiểm thử) | CC0 1.0 | không công bố | `js/core/adapters/applied.js` |
| `oqmd` | [OQMD](https://oqmd.org/) | Northwestern University | Liên kết ngoài | Miễn phí cho nghiên cứu; kiểm tra điều kiện trước khi phân phối lại | không công bố | `—` |
| `openfda` | [openFDA](https://open.fda.gov/) | U.S. Food and Drug Administration | Live (đã kiểm thử) | Public domain (U.S. Government work) | 240 req/phút/IP, 1.000 req/ngày không key; key miễn phí nâng lên 120.000/ngày | `js/core/adapters/applied.js` |
| `rxnorm` | [RxNorm / RxNav](https://www.nlm.nih.gov/research/umls/rxnorm/) | U.S. National Library of Medicine | Live (đã kiểm thử) | Điều khoản UMLS/NLM; một số từ vựng thành phần có điều kiện riêng | 20 req/giây/IP; khuyến nghị cache 12–24 giờ | `js/core/adapters/applied.js` |
| `dailymed` | [DailyMed](https://dailymed.nlm.nih.gov/dailymed/) | NLM | Liên kết ngoài | Public domain (U.S. Government work) | không công bố | `—` |
| `drugbank` | [DrugBank](https://go.drugbank.com/) | Wishart Group, University of Alberta | Loại trừ | Academic non-commercial; bản commercial phải trả phí | n/a | `—` |
| `zinc` | [ZINC20](https://zinc20.docking.org/) | Irwin & Shoichet Labs, UCSF | Liên kết ngoài | Miễn phí sử dụng; xem điều kiện trên trang dự án | n/a | `—` |
| `uniprot` | [UniProt](https://www.uniprot.org/) | UniProt Consortium (EMBL-EBI, SIB, PIR) | Live (đã kiểm thử) | CC BY 4.0 | không công bố; giới hạn ~5 req/giây ở client | `js/core/adapters/life.js` |
| `europe-pmc` | [Europe PMC](https://europepmc.org/) | EMBL-EBI | Live (đã kiểm thử) | Metadata mở; nội dung bài theo giấy phép từng bài | không công bố | `js/core/adapters/life.js` |
| `pubmed` | [PubMed / NCBI E-utilities](https://pubmed.ncbi.nlm.nih.gov/) | NCBI / NLM | Live (đã kiểm thử) | Metadata miễn phí; abstract/toàn văn theo bản quyền nhà xuất bản | 3 req/giây không key, 10 req/giây với key miễn phí | `js/core/adapters/life.js` |
| `crossref` | [Crossref](https://www.crossref.org/) | Crossref | Live (đã kiểm thử) | Metadata CC0 |  polite pool: gửi mailto trong query | `js/core/adapters/life.js` |
| `reactome` | [Reactome](https://reactome.org/) | Reactome Consortium / OICR | Live (đã kiểm thử) | CC BY 4.0 (kiểm tra tại reactome.org/license) | không công bố | `js/core/adapters/life.js` |
| `gene-ontology` | [Gene Ontology](https://geneontology.org/) | GO Consortium | Ứng viên | CC BY 4.0 | không công bố | `—` |
| `open-targets` | [Open Targets Platform](https://platform.opentargets.org/) | Open Targets (EMBL-EBI, GSK, Pfizer, Sanofi, Bristol Myers Squibb) | Ứng viên | CC BY 4.0 | không công bố | `—` |
| `kegg` | [KEGG](https://www.kegg.jp/) | Kanehisa Laboratories | Loại trừ | Academic license có điều kiện; dữ liệu không được tái phân phối tự do | theo license | `—` |
| `brenda` | [BRENDA](https://www.brenda-enzymes.org/) | TU Braunschweig | Liên kết ngoài | Miễn phí cho học thuật, hạn chế thương mại; cần đăng ký | theo tài khoản | `—` |
| `comptox` | [EPA CompTox Chemicals Dashboard](https://comptox.epa.gov/dashboard/) | U.S. Environmental Protection Agency | Liên kết ngoài | Public domain (U.S. Government work) | theo key | `—` |
| `pubchem-ghs` | [PubChem GHS / Hazard](https://pubchem.ncbi.nlm.nih.gov/) | NCBI / NLM (tổng hợp từ ECHA, HSDB, CAMEO) | Live (đã kiểm thử) | Tổng hợp từ nhiều nguồn; quyền tái sử dụng theo từng record | ≈5 req/giây | `js/core/adapters/chemistry.js` |
| `echa` | [ECHA CHEM](https://chem.echa.europa.eu/) | European Chemicals Agency | Liên kết ngoài | Điều kiện tái sử dụng của ECHA; một số dữ liệu hạn chế | n/a | `—` |
| `massbank` | [MassBank](https://massbank.eu/MassBank/) | MassBank Consortium / riken | Liên kết ngoài | Từng record có giấy phép riêng (thường CC BY-SA hoặc CC BY) | n/a | `—` |
| `nmrshiftdb` | [NMRShiftDB2](https://nmrshiftdb.nmr.uni-koeln.de/) | Universität Köln | Liên kết ngoài | CC BY-SA / điều kiện đóng góp từng record | n/a | `—` |
| `wikidata` | [Wikidata](https://www.wikidata.org/) | Wikimedia Foundation | Ứng viên | CC0 1.0 | 60 giây query; khuyến nghị User-Agent rõ ràng | `—` |
| `zenodo` | [Zenodo](https://zenodo.org/) | CERN | Ứng viên | Metadata CC0; từng dataset có license riêng | theo chính sách | `—` |
| `cas-registry` | [CAS Registry / SciFinder](https://www.cas.org/) | American Chemical Society | Loại trừ | Thương mại, trả phí, cấm scrape | n/a | `—` |
| `reaxys` | [Reaxys](https://www.reaxys.com/) | Elsevier | Loại trừ | Thuê bao thương mại | n/a | `—` |
| `ccdc-csd` | [Cambridge Structural Database](https://www.ccdc.cam.ac.uk/) | Cambridge Crystallographic Data Centre | Loại trừ | Thương mại (một phần miễn phí cho học thuật) | n/a | `—` |
| `icsd` | [ICSD](https://icsd.fiz-karlsruhe.de/) | FIZ Karlsruhe / NIST | Loại trừ | Thuê bao | n/a | `—` |

## 4. Nguồn đang truy vấn trực tiếp

### PubChem

- **Tổ chức:** NCBI / U.S. National Library of Medicine
- **Truy cập:** PUG-REST, PUG-View, autocomplete, bulk FTP
- **API:** https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest
- **Endpoint dùng trong ứng dụng:** `/rest/pug/compound/name/{name}/property/.../JSON`, `/rest/pug/compound/cid/{cid}/JSON`, `/rest/autocomplete/compound/{q}/json`, `/rest/pug_view/data/compound/{cid}/JSON`
- **Giới hạn tần suất:** ≈5 request/giây; tự giới hạn 220 ms/request
- **Bao phủ:** >115 triệu compound, >300 triệu substance
- **Cập nhật:** liên tục (hằng tuần)
- **Tái sử dụng:** Có điều kiện / theo từng record
- **Ghi chú:** Dữ liệu tổng hợp từ nhiều contributor: giữ provenance ở cấp record và kiểm tra quyền tái sử dụng của từng trường thay vì coi toàn bộ là public domain.

### ChEBI

- **Tổ chức:** EMBL-EBI
- **Truy cập:** REST (Elasticsearch backend), ontology OBO/OWL download
- **API:** https://www.ebi.ac.uk/chebi/tools
- **Endpoint dùng trong ứng dụng:** `/es_search/?term={q}`, `/compound/{chebiId}/`
- **Giới hạn tần suất:** Không công bố; dùng cache và giới hạn ~10 req/giây
- **Bao phủ:** ≈60.000 thực thể hóa học đã curate
- **Cập nhật:** hằng tháng
- **Tái sử dụng:** Có, kèm ghi công
- **Ghi chú:** Bắt buộc ghi công EMBL-EBI/ChEBI khi hiển thị hoặc phân phối lại.

### ChEMBL

- **Tổ chức:** EMBL-EBI
- **Truy cập:** REST, PostgreSQL/MySQL/SQLite dump
- **API:** https://www.ebi.ac.uk/chembl/api/data/docs
- **Endpoint dùng trong ứng dụng:** `/molecule/search.json?q={q}`, `/molecule/{chemblId}.json`, `/activity?molecule_chembl_id={id}`
- **Giới hạn tần suất:** Không công bố; giới hạn ~8 req/giây ở client
- **Bao phủ:** >2,4 triệu phân tử, >20 triệu hoạt tính
- **Cập nhật:** 2–3 lần/năm
- **Tái sử dụng:** Có, theo share-alike
- **Ghi chú:** CC BY-SA 3.0: nội dung phái sinh phải chia sẻ theo cùng giấy phép và ghi công. Giá trị pChEMBL/hoạt tính do ChEMBL tính toán có điều kiện riêng.

### PubChem BioAssay

- **Tổ chức:** NCBI / NLM
- **Truy cập:** PUG-REST (assay endpoints)
- **API:** https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest
- **Endpoint dùng trong ứng dụng:** `/rest/pug/assay/aid/{aid}/summary/JSON`
- **Giới hạn tần suất:** ≈5 request/giây
- **Bao phủ:** >1,5 triệu assay
- **Cập nhật:** liên tục
- **Tái sử dụng:** Có điều kiện / theo từng record
- **Ghi chú:** Hiển thị kèm cảnh báo: kết quả assay thô không phải kết luận lâm sàng.

### Rhea

- **Tổ chức:** SIB Swiss Institute of Bioinformatics / EMBL-EBI
- **Truy cập:** REST (TSV/RXN/RD), SPARQL, FTP
- **API:** https://www.rhea-db.org/help/rest-api
- **Endpoint dùng trong ứng dụng:** `/rhea/?query={q}&columns=rhea-id,equation,chebi-id,ec,uniprot,pubmed&format=tsv`
- **Giới hạn tần suất:** Không công bố
- **Bao phủ:** ≈16.000 phản ứng
- **Cập nhật:** hằng tháng
- **Tái sử dụng:** Có, kèm ghi công
- **Ghi chú:** API trả TSV cho bảng kết quả; phương trình hóa học lấy từ cột equation.

### NOMAD

- **Tổ chức:** FAIRmat / Humboldt-Universität zu Berlin
- **Truy cập:** REST, Python client, OASIS
- **API:** https://docs.nomad-lab.eu/nomad-lab-api/
- **Endpoint dùng trong ứng dụng:** `/info`, `/entries/query (POST)`
- **Giới hạn tần suất:** không công bố; dùng phân trang nhỏ
- **Bao phủ:** >15 triệu entry tính toán
- **Cập nhật:** liên tục
- **Tái sử dụng:** Có, kèm ghi công
- **Ghi chú:** Truy vấn entry theo công thức hóa học; mỗi entry giữ id, upload_id và metadata nguồn.

### RCSB Protein Data Bank

- **Tổ chức:** RCSB PDB / wwPDB
- **Truy cập:** REST, GraphQL, file download
- **API:** https://data.rcsb.org/redoc/
- **Endpoint dùng trong ứng dụng:** `/entry/{pdbId}`
- **Giới hạn tần suất:** không công bố
- **Bao phủ:** >220.000 cấu trúc
- **Cập nhật:** hằng tuần
- **Tái sử dụng:** Có thể tái sử dụng (ghi công)
- **Ghi chú:** Hiển thị metadata entry và liên kết viewer chính thức; không nhúng toạ độ vào bundle.

### openFDA

- **Tổ chức:** U.S. Food and Drug Administration
- **Truy cập:** REST, bulk download
- **API:** https://open.fda.gov/apis/
- **Endpoint dùng trong ứng dụng:** `/drug/label.json`, `/drug/ndc.json`, `/drug/enforcement.json`, `/drug/event.json`
- **Giới hạn tần suất:** 240 req/phút/IP, 1.000 req/ngày không key; key miễn phí nâng lên 120.000/ngày
- **Bao phủ:** hàng chục nghìn nhãn thuốc, hàng triệu báo cáo FAERS
- **Cập nhật:** hằng tuần
- **Tái sử dụng:** Có thể tái sử dụng (ghi công)
- **Ghi chú:** openFDA không được xác thực cho quyết định chăm sóc cá nhân. Báo cáo biến cố bất lợi KHÔNG chứng minh quan hệ nhân quả.

### RxNorm / RxNav

- **Tổ chức:** U.S. National Library of Medicine
- **Truy cập:** RxNav REST, RxClass, bulk (UMLS)
- **API:** https://lhncbc.nlm.nih.gov/RxNav/APIs/
- **Endpoint dùng trong ứng dụng:** `/drugs.json?name={name}`, `/rxcui/{rxcui}/properties.json`, `/rxclass/class/byDrugName.json`
- **Giới hạn tần suất:** 20 req/giây/IP; khuyến nghị cache 12–24 giờ
- **Bao phủ:** ≈100.000 khái niệm lâm sàng
- **Cập nhật:** hằng tháng
- **Tái sử dụng:** Có điều kiện / theo từng record
- **Ghi chú:** Cache 12 giờ được thực thi trong client. Không phân phối lại từ vựng bên thứ ba bị hạn chế khi chưa có phép.

### UniProt

- **Tổ chức:** UniProt Consortium (EMBL-EBI, SIB, PIR)
- **Truy cập:** REST, SPARQL, FTP
- **API:** https://www.uniprot.org/help/api
- **Endpoint dùng trong ứng dụng:** `/uniprotkb/search?query={q}&format=json`, `/uniprotkb/{accession}.json`
- **Giới hạn tần suất:** không công bố; giới hạn ~5 req/giây ở client
- **Bao phủ:** >250 triệu entry (incl. TrEMBL)
- **Cập nhật:** 8 tuần/lần
- **Tái sử dụng:** Có, kèm ghi công
- **Ghi chú:** Chỉ số Swiss-Prot/TrEMBL giữ nguyên accession và ngày cập nhật của entry.

### Europe PMC

- **Tổ chức:** EMBL-EBI
- **Truy cập:** REST, OAI-PMH, bulk
- **API:** https://europepmc.org/RestfulWebService
- **Endpoint dùng trong ứng dụng:** `/search?query={q}&format=json`
- **Giới hạn tần suất:** không công bố
- **Bao phủ:** >40 triệu bản ghi
- **Cập nhật:** hằng ngày
- **Tái sử dụng:** Có điều kiện / theo từng record
- **Ghi chú:** Không sao chép toàn văn có bản quyền. Chỉ hiển thị metadata/abstract khi nguồn cho phép và luôn dẫn link gốc.

### PubMed / NCBI E-utilities

- **Tổ chức:** NCBI / NLM
- **Truy cập:** E-utilities, FTP
- **API:** https://www.ncbi.nlm.nih.gov/books/NBK25501/
- **Endpoint dùng trong ứng dụng:** `/esearch.fcgi?db=pubmed`, `/esummary.fcgi?db=pubmed`
- **Giới hạn tần suất:** 3 req/giây không key, 10 req/giây với key miễn phí
- **Bao phủ:** >37 triệu trích dẫn
- **Cập nhật:** hằng ngày
- **Tái sử dụng:** Có điều kiện / theo từng record
- **Ghi chú:** Chỉ dùng metadata; không lưu toàn văn.

### Crossref

- **Tổ chức:** Crossref
- **Truy cập:** REST
- **API:** https://api.crossref.org/
- **Endpoint dùng trong ứng dụng:** `/works?query={q}`, `/works/{doi}`
- **Giới hạn tần suất:**  polite pool: gửi mailto trong query
- **Bao phủ:** >150 triệu DOI
- **Cập nhật:** liên tục
- **Tái sử dụng:** Có thể tái sử dụng (ghi công)
- **Ghi chú:** Dùng để xác thực DOI và bổ sung metadata; không thay thế nội dung bài báo.

### Reactome

- **Tổ chức:** Reactome Consortium / OICR
- **Truy cập:** ContentService REST, bulk
- **API:** https://reactome.org/ContentService/
- **Endpoint dùng trong ứng dụng:** `/data/query/{id}`, `/search/query?query={q}`
- **Giới hạn tần suất:** không công bố
- **Bao phủ:** >2.700 pathway người
- **Cập nhật:** hằng quý
- **Tái sử dụng:** Có, kèm ghi công
- **Ghi chú:** Giữ stable ID (R-HSA-…) và phiên bản khi trích dẫn.

### PubChem GHS / Hazard

- **Tổ chức:** NCBI / NLM (tổng hợp từ ECHA, HSDB, CAMEO)
- **Truy cập:** PUG-View
- **API:** https://pubchem.ncbi.nlm.nih.gov/docs/pug-view
- **Endpoint dùng trong ứng dụng:** `/rest/pug_view/data/compound/{cid}/JSON?heading=GHS+Classification`
- **Giới hạn tần suất:** ≈5 req/giây
- **Bao phủ:** hàng chục nghìn chất có dữ liệu GHS
- **Cập nhật:** liên tục
- **Tái sử dụng:** Có điều kiện / theo từng record
- **Ghi chú:** Hiển thị kèm cảnh báo an toàn và link nguồn gốc; không thay thế SDS hoặc tư vấn cấp cứu chuyên nghiệp.

### Materials Project (cần khoá miễn phí)

- **Tổ chức:** LBNL / UC Berkeley
- **Truy cập:** REST + API key miễn phí, MPContribs, bulk
- **API:** https://docs.materialsproject.org/downloading-data/using-the-api/getting-started
- **Endpoint dùng trong ứng dụng:** `/materials/summary/?formula={formula} (X-API-KEY)`
- **Giới hạn tần suất:** theo tài khoản; mặc định khá thấp
- **Bao phủ:** >150.000 vật liệu
- **Cập nhật:** liên tục
- **Tái sử dụng:** Có, kèm ghi công
- **Ghi chú:** Connector là tuỳ chọn: ứng dụng chạy đầy đủ khi không có key, và hiển thị rõ trạng thái 'chưa cấu hình key'.


## 5. Nguồn chỉ liên kết hoặc tải bulk

- **Open Reaction Database (ORD)** — Bulk / tải file. Chưa có endpoint tìm kiếm công khai ổn định: hiển thị như nguồn tải/bulk và liên kết UI chính thức. Không tạo số liệu phản ứng giả để lấp chỗ trống. [Trang chủ](https://open-reaction-database.org/)
- **Crystallography Open Database** — Bulk / tải file. Dữ liệu CC0 nhưng website không cung cấp JSON API ổn định cho trình duyệt; dùng liên kết tìm kiếm và mô tả tải bulk. Giữ acknowledgement tác giả cấu trúc gốc. [Trang chủ](https://www.crystallography.net/cod/)
- **NIST Chemistry WebBook** — Liên kết ngoài. Không bulk-import vào chỉ mục lõi. Liên kết ngoài kèm ghi chú provenance từng record; chỉ tái sử dụng dữ liệu NIST khi xác định được quyền cho record đó. [Trang chủ](https://webbook.nist.gov/chemistry/)
- **USPTO reaction dataset (Lowe)** — Liên kết ngoài. Nguồn bulk; chưa ingest vì cần pipeline protobuf/CSV riêng và kiểm tra license tại thời điểm tải. [Trang chủ](https://figshare.com/articles/dataset/Chemical_reactions_from_US_patents_1976-Sep2016_/5104873)
- **AFLOW** — Liên kết ngoài. Không nhập vào chỉ mục phân phối lại của dự án. Chỉ hiển thị như tài nguyên nghiên cứu bên ngoài kèm điều kiện sử dụng. [Trang chủ](https://www.aflow.org/)
- **OQMD** — Liên kết ngoài. Ứng viên mở rộng cho vật liệu vô cơ; chưa ingest do điều kiện tái sử dụng chưa rõ ràng. [Trang chủ](https://oqmd.org/)
- **DailyMed** — Liên kết ngoài. Nhãn tương đương đã có qua openFDA label; giữ DailyMed như nguồn đối chiếu. [Trang chủ](https://dailymed.nlm.nih.gov/dailymed/)
- **ZINC20** — Liên kết ngoài. Nguồn tham chiếu cho screening; chưa ingest vì khối lượng và điều kiện tái sử dụng. [Trang chủ](https://zinc20.docking.org/)
- **BRENDA** — Liên kết ngoài. Không tái phân phối dữ liệu; chỉ liên kết và mô tả. [Trang chủ](https://www.brenda-enzymes.org/)
- **EPA CompTox Chemicals Dashboard** — Liên kết ngoài. Cần key miễn phí nên chưa nối live; có thể bật qua Netlify Function proxy khi cấu hình. [Trang chủ](https://comptox.epa.gov/dashboard/)
- **ECHA CHEM** — Liên kết ngoài. Chưa có API công khai ổn định; chỉ liên kết tra cứu chính thức. [Trang chủ](https://chem.echa.europa.eu/)
- **MassBank** — Liên kết ngoài. Giấy phép khác nhau theo record: không bulk-import khi chưa kiểm tra từng phổ. Liên kết ngoài kèm ghi chú. [Trang chủ](https://massbank.eu/MassBank/)
- **NMRShiftDB2** — Liên kết ngoài. Không nhập vào chỉ mục lõi; cần kiểm tra điều kiện đóng góp của từng phổ. [Trang chủ](https://nmrshiftdb.nmr.uni-koeln.de/)

## 6. Loại trừ có chủ đích

- **DrugBank** (Wishart Group, University of Alberta) — Academic non-commercial; bản commercial phải trả phí. KHÔNG nhập vào cơ sở dữ liệu có thể tái phân phối: giấy phép học thuật không cho phép phân phối lại. Chỉ liên kết ngoài.
- **KEGG** (Kanehisa Laboratories) — Academic license có điều kiện; dữ liệu không được tái phân phối tự do. Không ingest vào chỉ mục công khai. Chỉ liên kết ngoài.
- **CAS Registry / SciFinder** (American Chemical Society) — Thương mại, trả phí, cấm scrape. Không tích hợp, không scrape. Dùng InChIKey/CID/PubChem làm định danh thay thế.
- **Reaxys** (Elsevier) — Thuê bao thương mại. Loại trừ: cần thuê bao trả phí, không được tái sử dụng dữ liệu.
- **Cambridge Structural Database** (Cambridge Crystallographic Data Centre) — Thương mại (một phần miễn phí cho học thuật). Loại trừ khỏi chỉ mục tái phân phối; COD là lựa chọn mở thay thế.
- **ICSD** (FIZ Karlsruhe / NIST) — Thuê bao. Loại trừ: dữ liệu không thể tái phân phối.

Không có dữ liệu nào từ các nguồn này được nhập, scrape hay tái phân phối bởi dự án.

## 7. Cách thêm một nguồn mới

1. Kiểm tra giấy phép, chi phí, hạn mức và khả năng CORS **trước khi** viết code.
2. Thêm bản ghi vào `js/core/registry.js` (id, license, licenseUrl, status, rateLimit, redistribution, endpoints).
3. Viết adapter trong `js/core/adapters/` và trả về record chuẩn qua `Sci.entity.record`.
4. Thêm adapter vào `js/core/adapters.js` (SEARCH_ORDER / KIND_ADAPTERS).
5. Chạy `node --test tests/` và `node scripts/build-docs.mjs`.
6. Không đánh dấu `live` nếu chưa thực sự gọi được API từ trình duyệt và ghi ngày kiểm thử.

## 8. Nhật ký kiểm thử

Ngày 2026-11-06: kiểm tra CORS/HTTP cho PubChem (PUG-REST, PUG-View, autocomplete), ChEBI,
ChEMBL, Rhea, UniProt, Reactome, openFDA, RxNav, Europe PMC, NCBI E-utilities, Crossref,
NOMAD (`/info`) và RCSB — tất cả trả về 200 từ trình duyệt. Materials Project không kiểm thử
được nếu không có khoá; trạng thái được ghi là `live-key` và UI hiển thị hướng dẫn cấu hình.
