# 🗄️ HƯỚNG DẪN DỮ LIỆU MỞ — Scale từ curated lên hàng triệu bản ghi

Trang web này đọc 3 file JSON trong `data/` theo schema chuẩn quốc tế:

| File | Schema tham chiếu | Hiện tại | Có thể mở rộng tới |
|------|------------------|----------|--------------------|
| `data/reactions.json` | Open Reaction Database (ORD) / USPTO | 822 | **2.000.000 – 3.700.000** phản ứng |
| `data/compounds.json` | PubChem Compound | 596 | **>115.000.000** hợp chất |
| `data/drugs.json` | DrugBank / ChEMBL | 270 | **~15.230 thuốc** · >2,4M hoạt chất ChEMBL |

Cấu trúc mỗi file đúng như schema mẫu; file `.data.js` song song chỉ để web tĩnh chạy được qua `file://`.

---

## 1) PHẢN ỨNG — Open Reaction Database + USPTO

- ORD GitHub: https://github.com/open-reaction-database/ord-data (file `.pb` protobuf + JSON)
- USPTO extracted reactions: tìm "USPTO reaction dataset" ( Lowe 2012/2017, ~1,8–3,7 triệu phản ứng trích từ bằng sáng chế Mỹ)

Tải ORD:
```bash
git clone https://github.com/open-reaction-database/ord-data.git
pip install ord-schema   # có công cụ convert .pb → json
```

## 2) HỢP CHẤT — PubChem (NIH, miễn phí)

- FTP: `ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/` (hoặc https://ftp.ncbi.nlm.nih.gov/pubchem/Compound/)
- Mỗi thư mục CID2xxxx chứa file `.sdf.gz`; dùng PUG-REST cho tra cứu lẻ:
```bash
# Ví dụ lấy SMILES của aspirin theo CID
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/property/IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES/TXT"
```

### 📥 Tự động tải hợp chất thật từ PubChem
Đã có sẵn script `data/fetch-pubchem.js` — tải 302 hợp chất thật (SMILES, khối lượng mol, IUPAC) từ NIH:
```bash
node data/fetch-pubchem.js     # tạo data/pubchem-fetched.json
node data/build-data.js        # merge vào compounds.json/js
```
Sửa danh sách `NAMES` trong script để mở rộng — mỗi tên được lookup riêng lẻ + retry/backoff chống rate-limit.

Materials Project (cấu trúc tinh thể/vật liệu, cần đăng ký miễn phí):
```python
from mp_api.client import MPRester
with MPRester("API_KEY_CUA_BAN") as mpr:
    docs = mpr.materials.summary.search(elements=["Li","Fe"], fields=["material_id","formula_pretty","band_gap"])
```

## 3) THUỐC — DrugBank Academic / ChEMBL

- DrugBank: đăng ký Academic (email sinh viên/nghiên cứu, duyệt 1-2 ngày) → tải `drugbank_all_full_database.xml.zip` (~1,5 GB)
- ChEMBL: https://www.ebi.ac.uk/chembl/downloads → dump PostgreSQL/MySQL (>2,4M hoạt chất)

---

## ⚙️ KIẾN TRÚC SCALE LÊN TRIỆU BẢN GHI

Web tĩnh không nhét nổi hàng chục GB. Hai lựa chọn thực tế:

**A. Giữ web tĩnh — nạp tập con chọn lọc**
- Viết ETL (Node/Python) lọc dataset đầy đủ xuống 5.000–50.000 bản ghi liên quan nhất (VD: chỉ thuốc approved, phản ứng có yield ≥60%)
- Chia JSON thành nhiều chunk 5MB, trang load lazy theo tab

**B. Thêm backend nhẹ (khuyến nghị cho full-scale)**
```
DrugBank.xml ──ETL──▶ SQLite/PostgreSQL ◀── Express/FastAPI API ──▶ fetch() từ site
PubChem SDF ─┘                         /api/search?q=aspirin
ORD pb      ─┘
```
Ví dụ endpoint tối thiểu:
```js
// server.js (Node + better-sqlite3)
app.get("/api/search", (req,res)=>{
  const rows = db.prepare("SELECT * FROM drugs WHERE name LIKE ? LIMIT 50")
                 .all("%"+req.query.q+"%");
  res.json(rows);
});
```

## ⚠️ Lưu ý pháp lý & kỹ thuật
- **CAS** là dịch vụ thương mại — KHÔNG scrape; dùng các nguồn open ở trên thay thế
- **DrugBank Academic** chỉ cho mục đích phi thương mại/học thuật
- PubChem/ORD/ChEMBL là open — vẫn nên ghi nguồn khi sử dụng lại
- File lớn: dùng streaming parser (`sax`, `ijson`) tránh treo RAM
