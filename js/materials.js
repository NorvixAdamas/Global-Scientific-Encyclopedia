/* ===== BẢO TÀNG VẬT LIỆU TIÊN TIẾN ===== */
const MAT_CATS = [
  { id: "nano",     name: "Nano & 2D" },
  { id: "nang-luong", name: "Pin & Năng lượng" },
  { id: "polymer",  name: "Polymer & Composite" },
  { id: "kim-loai", name: "Kim loại & Hợp kim" },
  { id: "gom",      name: "Gốm & Kính kỹ thuật" },
  { id: "y-te",     name: "Y tế & Sinh học" },
  { id: "thong-minh", name: "Vật liệu thông minh" },
  { id: "sieu-dan", name: "Siêu dẫn" },
  { id: "ban-dan",  name: "Bán dẫn & Quang điện tử" },
  { id: "tu-tinh",  name: "Từ tính & Spintronics" },
  { id: "tu-nhien", name: "Sinh học & Tự nhiên" },
  { id: "lop-phu",  name: "Lớp phủ & Kết dính" },
  { id: "ly-thuyet", name: "Vật liệu lý thuyết & Siêu kỳ" },
  { id: "lich-su-vl", name: "Lịch sử & Cổ đại" },
  { id: "y-duoc-vl", name: "Y dược & Implant" },
  { id: "moi-truong-vl", name: "Môi trường & Tái chế" },
  { id: "duoc-pham-vl", name: "Bào chế & Phát hành thuốc" }
];

const MATERIALS = [
/* ---------- NANO & 2D ---------- */
{id:"graphene", cat:"nano", icon:"⬡", name:"Graphene", sub:"Vật liệu 2D kỳ diệu",
 facts:["Độ bền ~200× thép","Dày 1 nguyên tử","Dẫn điện vượt đồng","Nobel 2010"],
 content:`<p>Graphene là lớp carbon dày <b>một nguyên tử</b> xếp mạng lục giác, vật liệu 2D đầu tiên được tách ra (Geim & Novoselov, băng keo 2004 — Nobel Vật lý 2010).</p>
 <h4>Tính chất</h4><ul>
 <li><b>Cơ:</b> mô đun Young ≈ 1 TPa — bền nhất từng đo.</li>
 <li><b>Điện:</b> electron "vô khối", di chuyển gần tốc độ ánh sáng trong tinh thể.</li>
 <li><b>Nhiệt:</b> ~5.000 W/m·K, gấp ~10 lần đồng.</li>
 <li>Hấp thụ đúng 2,3% ánh sáng — gần như trong suốt.</li></ul>
 <h4>Ứng dụng</h4><ul>
 <li>Màn cảm ứng & điện cực minh bạch thay ITO</li>
 <li>Sensor sinh học phát hiện phân tử đơn lẻ</li>
 <li>Màng lọc nước graphene oxide tách muối & kim loại nặng</li>
 <li>Composite siêu nhẹ hàng không; siêu tụ sạc nhanh</li></ul>`},

{id:"cnt", cat:"nano", icon:"🧶", name:"Carbon nanotube (CNT)", sub:"Ống nano mạnh hơn cả graphene kéo",
 facts:["CNT bền ~63 GPa","Đơn vách/multi-walled","Dẫn điện kim loại/bán dẫn","Iijima 1991"],
 content:`<p>CNT là graphene cuộn tròn thành ống đường kính ~1 nm. Chỉ số (n,m) quyết định dẫn điện như kim loại hay bán dẫn.</p>
 <h4>Ứng dụng</h4><ul>
 <li>Vật liệu composite thân máy bay F-35, xe đạp đua</li>
 <li>Sợi CNT "vũ khí bí mật" chống gián điệp — áo giáp thế hệ mới</li>
 <li>Transistor CNT thử nghiệm vượt silicon về mật độ dòng</li>
 <li>Chân điện cực não — giao diện thần kinh mảnh như mạng nhện</li></ul>
 <p>Mục tiêu tương lai: <b>thang máy vũ trụ</b> — sợi CNT dài hàng km chịu lực riêng đủ lớn.</p>`},

{id:"fullerene", cat:"nano", icon:"⚽", name:"Fullerene C₆₀", sub:"Quả bóng buckyball Nobel 1996",
 facts:["60 nguyên tử C","Hình quả bóng đá","Siêu dẫn khi pha K₃C₆₀","Kroto/Curl/Smalley 1985"],
 content:`<p>C₆₀ gồm 20 hình lục giác + 12 ngũ giác ghép thành quả bóng giống kiến trúc geodesic của Buckminster Fuller. Được phát hiện trong hơi carbon của laser bắn graphite.</p>
 <h4>Ứng dụng</h4><ul>
 <li>Kem chống nắng (absorb UV, radical scavenger)</li>
 <li>Drug delivery — khoán thuốc trong lòng rỗng</li>
 <li>K₃C₆₀ siêu dẫn ở 18K — fulleride đầu tiên</li>
 <li>Dầu nhớt fullerene giảm ma sát động cơ</li></ul>`},

{id:"mxene", cat:"nano", icon:"📐", name:"MXene", sub:'"Graphene thế hệ mới" từ gốm MAX',
 facts:["2D carbide/nitride","Dẫn điện tốt","Hydrophilic","2011 — Drexel Univ."],
 content:`<p>MXene là họ >30 vật liệu 2D (Ti₃C₂Tₓ phổ biến nhất) ăn mòn lớp A từ pha MAX tạo "lá phồng" nhiều tầng. Dẫn điện tốt + hydrophilic = combo hiếm có.</p>
 <h4>Ứng dụng</h4><ul>
 <li>Antenna EMI shielding mỏng như giấy bạc cho smartphone foldable</li>
 <li>Siêu tụ volumetric cao kỷ lục</li>
 <li>Màng lọc nước lọc vi nhựa & muối</li>
 <li>Sensor đeo tay đo mồ hôi, nhịp tim</li></ul>`},

{id:"quantum-dot", cat:"nano", icon:"🔮", name:"Quantum dot", sub:"Tinh thể nano phát màu theo kích thước",
 facts:["Nobel Hóa 2023","CdSe, InP, perovskite QD","Màu chỉnh bằng nm","TV QLED"],
 content:`<p>Lượng tử giới hạn: hạt < 10 nm có bandgap phụ thuộc kích thước — cùng một chất, hạt to đỏ, hạt nhỏ xanh lam. Bawendi, Brus, Ekimov nhận Nobel Hóa 2023.</p>
 <h4>Ứng dụng</h4><ul>
 <li>TV QLED màu rực, tiết kiệm điện</li>
 <li>Sinh ảnh huỳnh quang đánh dấu tế bào ung thư</li>
 <li>PIN mặt trời QD hiệu suất đang leo nhanh</li>
 <li>Máy dò hồng ngoại cho camera đêm</li></ul>`},

{id:"borophene", cat:"nano", icon:"🔷", name:"Borophene", sub:"Người em 2D của bo — siêu dẫn tiềm năng",
 facts:["2D boron 2015","Kim loại thật (khác graphene)","Anisotropic conductivity","Giàu electron"],
 content:`<p>Borophene là màng boron một nguyên tử, khác graphene ở chỗ <b>dẫn điện như kim loại thực sự</b> và có tính hướng (anisotropic). Dự đoán có thể siêu dẫn ở nhiệt độ cao hơn graphene.</p>
 <h4>Triển vọng</h4><ul><li>Interconnect chip siêu nhanh</li><li>PIN linh hoạt trong suốt</li><li>Nano sensor hydrogen</li></ul>`},

/* ---------- PIN & NĂNG LƯỢNG ---------- */
{id:"perovskite", cat:"nang-luong", icon:"☀️", name:"Perovskite halide", sub:"Ngôi sao pin mặt trời thế hệ mới",
 facts:["Hiệu suất >26%","Rẻ hơn silicon","Bandgap tunable","Tandem >34%"],
 content:`<p>Perovskite halide (MAPbI₃…) có cấu trúc ABX₃. Từ 3,8% năm 2009 lên <b>>26%</b> — tăng trưởng nhanh nhất lịch sử quang điện.</p>
 <h4>Vì sao đáng chú ý</h4><ul>
 <li>Hấp thụ mạnh → màng vài trăm nm là đủ</li>
 <li>Tổng hợp dung dịch nhiệt độ thấp → chi phí thấp</li>
 <li>Ghép tandem với silicon đạt >34%</li></ul>
 <h4>Thách thức</h4><ul><li>Ổn định trước ẩm/nhiệt/UV (encapsulation)</li><li>Thay Pb bằng Sn hoặc giảm hàm lượng chì</li></ul>`},

{id:"solid-state", cat:"nang-luong", icon:"🔋", name:"Pin thể rắn", sub:"Thế hệ pin EV an toàn hơn",
 facts:["Electrolyte rắn","400–500 Wh/kg","Không cháy","Sạc nhanh hơn"],
 content:`<p>Thay electrolyte lỏng dễ cháy bằng chất rắn dẫn ion (sulfide glass, garnet LLZO, polymer). Cho phép anode lithium kim loại → mật độ năng lượng gấp đôi Li-ion.</p>
 <h4>Lợi ích / thách thức</h4><ul>
 <li>An toàn cháy nổ; tuổi thọ chu kỳ cao</li>
 <li>Kháng trở interface electrode–electrolyte</li>
 <li>Dendrite lithium xuyên qua khi sạc nhanh</li>
 <li>Sản xuất quy mô lớn — các hãng dự kiến thương mại cuối 2020s</li></ul>`},

{id:"lfp", cat:"nang-luong", icon:"🪫", name:"LFP (LiFePO₄)", sub:"Pin an toàn của xe điện đại chúng",
 facts:["An toàn tuyệt đối","~3.000–5.000 cycles","Không Co/Ni","Tesla BYD dùng rộng rãi"],
 content:`<p>Lithium iron phosphate (Goodenough 1996) hy sinh chút mật độ năng lượng để đổi lấy <b>an toàn, tuổi thọ và giá rẻ</b> — lý do xe điện giá rẻ Trung Quốc bùng nổ.</p>
 <h4>Ưu điểm</h4><ul><li>Không thermal runaway khi va đập/kim xuyên</li><li>2× vòng đời NMC</li><li>Không cobalt — tránh vấn đề đạo đức khai thác DRC</li></ul>`},

{id:"fuel-cell", cat:"nang-luong", icon:"💧", name:"PEM fuel cell", sub:"Pin nhiên liệu hydrogen",
 facts:["Hiệu suất ~60%","Chỉ thải nước","Pt catalyst","Hyundai Nexo, Toyota Mirai"],
 content:`<p>Membrane electrode assembly: H₂ bị oxy hóa tại anode, proton qua màng Nafion, O₂ khử tại cathode → nước + điện. Tàu Apollo đã dùng làm nguồn điện & uống nước.</p>
 <h4>Thách thức</h4><ul><li>Giá platinum — nghiên cứu Fe-N-C catalyst không quý kim</li><li>Hạ tung hạ tầng trạm hydrogen</li><li>Durability membrane 5000+ giờ</li></ul>`},

{id:"metal-hydride", cat:"nang-luong", icon:"🧲", name:"Metal hydride lưu hydrogen", sub:"'Bình ga' rắn an toàn",
 facts:["LaNi₅H₆, MgH₂","Mật độ H cao hơn khí lỏng","Sạc/xả nhiệt điều khiển","Không nổ áp suất cao"],
 content:`<p>Kim loại liên kết hydrogen thành hợp chất rắn — lưu H ở mật độ <b>cao hơn cả hydrogen lỏng</b>, giải phóng bằng gia nhiệt.</p>
 <h4>Ứng dụng</h4><ul><li>Pin NiMH (âm cực LaNi₅H₆)</li><li>Lưu trữ hydrogen cho forklift & submarine</li><li>Máy nén nhiệt hydride</li></ul>`},

{id:"thermo-electric", cat:"nang-luong", icon:"🌡️", name:"Bi₂Te₃ thermoelectric", sub:"Biến nhiệt trực tiếp thành điện",
 facts:["Seebeck effect","ZT ≈ 1","Không bộ phận chuyển động","Radioisotope heater backup"],
 content:`<p>Hiệu ứng Seebeck: gradient nhiệt sinh điện áp. Bi₂Te³ hoạt động quanh nhiệt độ phòng — chuẩn công nghiệp.</p>
 <h4>Ứng dụng</h4><ul><li>Tủ lạnh mini không compressor</li><li>Thu hồi nhiệt ống xả ô tô</li><li>Nguồn điện Voyager từ Pu-238 (thermoelectric radioisotope)</li></ul>`},

/* ---------- POLYMER & COMPOSITE ---------- */
{id:"kevlar", cat:"polymer", icon:"🛡️", name:"Kevlar® (aramid)", sub:"Sợi polymer bền hơn thép",
 facts:["Bền gấp 5× thép/cân nặng","Chịu 400°C+","Nhẹ","Kwolek 1965"],
 content:`<p>Polyamide thơm với chuỗi polymer song song cực trật tự + liên kết hydro chặt. Stephanie Kwolek phát minh tại DuPont.</p>
 <h4>Ứng dụng</h4><ul>
 <li>Áo giáp chống đạn, mũ bảo hộ quân đội</li>
 <li>Vỏ lốp đua, cáp treo, rope cứu hộ</li>
 <li>Composite thân máy bay & thuyền buồm</li>
 <li>Găng tay chống cắt cấp 5</li></ul>
 <p>"Anh em": Nomex® chống cháy phi công, Zylon (PBO) bền hơn nữa.</p>`},

{id:"self-healing", cat:"polymer", icon:"🩹", name:"Vật liệu tự phục hồi", sub:'Polymer, bê tông "chữa lành"',
 facts:["Microcapsule","Vi khuẩn Bacillus","Kéo dài tuổi thọ","Giảm bảo trì"],
 content:`<p>Vật liệu tự vá vết nứt vi mô lấy cảm hứng cơ thể sống.</p>
 <h4>Chiến lược</h4><ul>
 <li><b>Microcapsule:</b> vết nứt vỡ viên nano chứa keo tự trám</li>
 <li><b>Bê tông sinh học:</b> Bacillus ngủ đông gặp nước tạo CaCO₃ vá khe</li>
 <li><b>Liên kết động:</b> polymer tái tạo bond khi ép sát</li></ul>
 <h4>Ứng dụng</h4><ul><li>Sơn ô tô tự xóa xước nhẹ</li><li>Cầu đường bê tông tuổi thọ ×2</li><li>Vỏ pin, bao bì điện tử linh hoạt</li></ul>`},

{id:"carbon-fiber", cat:"polymer", icon:"🕸️", name:"Composite carbon fiber", sub:"CFRP — nhẹ như nhựa, cứng như thép",
 facts:["Tỷ lệ strength/weight cao","Boeing 787 ~50% CFRP","PAN precursor","Không ăn mòn"],
 content:`<p>Sợi carbon đường kính 5–7 µm (từ PAN nung 2000°C+) nhúng matrix epoxy. Kết hợp stiffness kim loại với trọng lượng polymer.</p>
 <h4>Ứng dụng</h4><ul><li>Thân Boeing 787, A350, fighter jets</li><li>Khung xe đạp, vợt tennis, F1 monocoque</li><li>Cánh turbine gió offshore khổng lồ</li></ul>`},

{id:"pla-phb", cat:"polymer", icon:"🌱", name:"Bioplastic (PLA/PHB)", sub:"Nhựa phân hủy sinh học",
 facts:["Từ ngô/mía/vi khuẩn","Compostable","Giảm microplastic","Chi phí đang giảm"],
 content:`<p>PLA tổng hợp từ lactic acid lên men tinh bột; PHB do vi khuẩn tích tụ như 'chất béo dự trữ'. Phân hủy hoàn toàn trong compost công nghiệp 90 ngày.</p>
 <h4>Ứng dụng</h4><ul><li>Cốc cafe, hộp take-away compostable</li><li>Filament 3D printing PLA</li><li>Stitch y tế tự tiêu PHB/PCL</li></ul>`},

{id:"pdms", cat:"polymer", icon:"🫧", name:"Silicone (PDMS)", sub:"Cao su vô cơ mềm mại đa dụng",
 facts:["Nền Si-O không phải C-C","−50 đến 250°C","Biocompatible","Trong suốt"],
 content:`<p>Polydimethylsiloxane có backbone siloxane Si–O bền hơn C–C — chịu nhiệt, oxy hóa tốt hơn cao su hữu cơ.</p>
 <h4>Ứng dụng</h4><ul><li>Khuôn bánh, keo chịu nhiệt nhà bếp</li><li>Implant ngực, catheter y tế</li><li>Chip microfluidics organ-on-chip</li><li>Cách nhiệt điện tử cao áp</li></ul>`},

/* ---------- KIM LOẠI & HỢP KIM ---------- */
{id:"nitinol", cat:"kim-loai", icon:"🔁", name:"Nitinol (Ni-Ti)", sub:"Kim loại trí nhớ hình dạng",
 facts:["Shape memory","Siêu đàn hồi 8-10%","Biocompatible","Naval Ordnance Lab 1961"],
 content:`<p>Hợp kim NiTi chuyển pha martensite ⇌ austenite: uốn cong ở nhiệt thường, hơ nóng qua ngưỡng là <b>tự trở về hình gốc</b>.</p>
 <h4>Ứng dụng</h4><ul>
 <li><b>Y tế:</b> stent mạch máu tự giãn, dây nieng, guide wire nội soi, kính gập không gãy</li>
 <li><b>Robot:</b> actuator robot mềm thay motor</li>
 <li><b>Hàng không:</b> ăng-ten vệ tinh tự triển khai, cánh thích ứng</li></ul>`},

{id:"superalloy", cat:"kim-loai", icon:"✈️", name:"Superalloy nickel", sub:"Kim loại của cánh tuabin phản lực",
 facts:["Vận hành 1000°C+","Single-crystal blade","Creep resistance","Nimonic → CMSX"],
 content:`<p>Nickel-based superalloy với γ′ phase Ni₃(Al,Ti) giữ strength tới 0,9 T_m. Cánh tuabin single-crystal không grain boundary — không creep.</p>
 <h4>Ứng dụng</h4><ul><li>Cánh tuabin máy bay dân sự & quân sự</li><li>Turbine khí phát điện</li><li>Rocket engine chamber</li></ul>
 <p>Không superalloy → không du lịch hàng không giá rẻ như hôm nay.</p>`},

{id:"high-entropy", cat:"kim-loai", icon:"🎲", name:"High-entropy alloy (HEA)", sub:"Hợp kim 5+ nguyên tố 'hỗn loạn'",
 facts:["CoCrFeMnNi Cantor","Entropy ổn định pha","Strength-ductility combo","Chống mòn & irradiation"],
 content:`<p>HEA phá vỡ triết lý "một nguyên tố nền + phụ gia": trộn ≥5 kim loại gần đều nhau, entropy trộn ổn định pha đơn.</p>
 <h4>Triển vọng</h4><ul><li>Vật liệu lò phản ứng chịu neutron damage</li><li>Dụng cụ cắt siêu cứng</li><li>Cryogenic strength tăng thay vì giảm!</li></ul>`},

{id:"amorphous-metal", cat:"kim-loai", icon:"💧", name:"Metallic glass", sub:"Kim loại 'kính' không tinh thể",
 facts:["Amorphous structure","Elastic limit 2%","Chống trầy","Vitreloy, Liquidmetal alloy"],
 content:`<p>Làm nguội cực nhanh (>10⁶ K/s) giữ nguyên tử ở vị trí hỗn loạn như thủy tinh — không grain boundary nên không có chỗ khởi phát vết nứt.</p>
 <h4>Ứng dụng</h4><ul><li>Khớp nối golf club & tennis racket transfer energy tối đa</li><li>Vỏ điện thoại chống trầy Apple Watch series thử nghiệm</li><li>Transformer core amorphous giảm tổn hao 70%</li></ul>`},

{id:"titanium-alloy", cat:"kim-loai", icon:"🔩", name:"Titanium Ti-6Al-4V", sub:"Kim loại aerospace & y tế vạn năng",
 facts:["Density 4,5 vs thép 7,9","Chống ăn mặn biển","Osseointegration","SR-71 Blackbird"],
 content:`<p>Hợp kim titan chủ đạo chiếm ~50% sản lượng Ti. Tương thích sinh học + tỷ lệ strength/weight xuất sắc.</p>
 <h4>Ứng dụng</h4><ul><li>Implant khớp háng, xương hàm (xương bám trực tiếp!)</li><li>Động cơ & khung F-22, SR-71</li><li>Vỏ tàu ngầm sâu, thiết bị hóa chất</li><li>Khuôn 3D printing kim loại</li></ul>`},

{id:"ndfeb", cat:"kim-loai", icon:"🧿", name:"NdFeB nam châm", sub:"Nam châm mạnh nhất nhân loại",
 facts:["BHmax ~400 kJ/m³","Neodymium 1984","Động cơ EV & tua-bin gió","Dễ gỉ cần phủ Ni"],
 content:`<p>Nd₂Fe₁₄B có anisotropy field khổng lồ — năng lượng riêng gấp ~10× ferrite. Nhờ đó động cơ điện nhỏ gọn, tai nghe bass sâu.</p>
 <h4>Ứng dụng</h4><ul><li>Động cơ xe điện Tesla/BYD</li><li>Generator tua-bin gió offshore</li><li>Ổ cứng HDD voice coil, tai nghe</li><li>MRI scanner, maglev train</li></ul>`},

/* ---------- GỐM & KÍNH KỸ THUẬT ---------- */
{id:"zirconia", cat:"gom", icon:"💎", name:"Zirconia (ZrO₂)", sub:"'Kim cương nhân tạo' của nha khoa",
 facts:["Transformation toughening","Răng sứ cao cấp","Cảm biến O₂ ô tô","Cubic zirconia trang sức"],
 content:`<p>ZrO₂ ổn định pha tetragonal bằng Y₂O₃: vết nứt kích hoạt chuyển pha nở thể tích <b>'chặn đứng' vết nứt</b> — gốm duy nhất dẻo như kim loại.</p>
 <h4>Ứng dụng</h4><ul><li>Răng sứ, crown nha khoa CAD/CAM</li><li>Oxygen sensor lambda xe hơi</li><li>Ceramic knife sắc không gỉ</li><li>Nhiên cell SOFC electrolyte</li></ul>`},

{id:"sic", cat:"gom", icon:"🔺", name:"Silicon carbide (SiC)", sub:"Gốm cứng thứ 2 sau kim cương",
 facts:["Mohs 9,25","Chịu 1600°C+","Wide bandgap 3,26 eV","Carborundum Acheson 1891"],
 content:`<p>SiC vừa là abrasive kinh điển vừa là semiconductor wide-bandgap cho điện tử công suất.</p>
 <h4>Ứng dụng</h4><ul><li>Inverter xe điện Tesla Model 3 — tăng range 10%</li><li>Đĩa phanh ceramic composite Porsche</li><li>Armor xe tăng, bulletproof plate</li><li>Mirror telescope James Webb phủ SiC!</li></ul>`},

{id:"uhpc", cat:"gom", icon:"🏗️", name:"UHPC & bê tông tự lành", sub:"Bê tông thế hệ mới",
 facts:["Compressive 150-250 MPa","Sợi thép/PVA","Tuổi thọ 100+ năm","Bacillus self-healing"],
 content:`<p>Ultra-High Performance Concrete dùng silica fume + sợi thép micro đạt strength gấp 5× bê tông thường; thêm vi khuẩn Bacillus pasteurii tự tạo CaCO₃ vá vết nứt.</p>
 <h4>Ứng dụng</h4><ul><li>Cầu dây văng mỏng như giấy</li><li>Tòa nhà supertall Burj Khalifa foundation</li><li>Công trình biển chống chloride attack</li></ul>`},

{id:"gorilla-glass", cat:"gom", icon:"📱", name:"Gorilla Glass", sub:"Kính cường lực ion-exchange",
 facts:["Chem tempering","Corning 1962→2007 iPhone","Kích nén bề mặt","Foldable ultra-thin"],
 content:`<p>Ngâm kính aluminosilicate trong muối KNO₃ nóng: ion Na⁺ nhỏ bị thay bằng K⁺ lớn → lớp bề mặt <b>nén</b> — chặn vết nứt lan truyền.</p>
 <h4>Ứng dụng</h4><ul><li>Màn hình smartphone/tablet hàng tỷ thiết bị</li><li>Gorilla Glass Victus chịu rơi 2m</li><li>Kính gập 30µm cho foldable phone</li></ul>`},

{id:"aerogel", cat:"gom", icon:"🌫️", name:"Aerogel", sub:'Chất rắn nhẹ nhất — "khói đóng băng"',
 facts:["99,8% không khí","λ = 0,013 W/m·K","Mật độ ~1 mg/cm³","15 Guinness records"],
 content:`<p>Aerogel silica: gel thay solvent bằng supercritical CO₂ — giữ khung xốp mà không co. Chất cách nhiệt tốt nhất đại trà.</p>
 <h4>Ứng dụng</h4><ul><li>Insulation rover Sao Hỏa & spacesuit gloves</li><li>Vest lạnh dầu khí Bắc Cực</li><li>Thu hồi dầu tràn aerogel hydrophobic</li><li>Windows cách nhiệt super-insulating</li></ul>`},

/* ---------- Y TẾ & SINH HỌC ---------- */
{id:"hydrogel", cat:"y-te", icon:"🫧", name:"Hydrogel", sub:"Polyme hút nước 99% như mô sống",
 facts:["Water content 70–99%","Soft tissue-like","Contact lens","Injectable drug depot"],
 content:`<p>Mạng polymer hydrophilic (PEG, PVA, alginate) trương nước — mô phỏng độ mềm của da, cartilage.</p>
 <h4>Ứng dụng</h4><ul><li>Kính áp tròng silicone hydrogel</li><li>Bandage ẩm giúp vết thương lành nhanh</li><li>Cartilage engineering knee implant</li><li>Liều thuốc giải phóng chậm dưới da</li></ul>`},

{id:"peg", cat:"y-te", icon:"💉", name:"PEGylation", sub:'"Tàng hình hóa" thuốc bằng PEG',
 facts:["PEG 2000 lipid","COVID mRNA vaccine","Stealth liposome","Giải phóng kéo dài"],
 content:`<p>Gắn chuỗi polyethylene glycol vào protein/liposome khiến hệ miễn dịch 'không nhìn thấy' — kéo dài half-life từ phút lên tuần.</p>
 <h4>Ứng dụng</h4><ul><li>Vaccine mRNA COVID-19 (lipid nanoparticle PEG)</li><li>Interferon PEGylated viêm gan C</li><li>Adagen trị SCID 'bubble boy'</li></ul>`},

{id:"bioactive-glass", cat:"y-te", icon:"🦴", name:"Bioactive glass (45S5)", sub:"Kính 'biến thành xương'",
 facts:["Hench 1969","HAp layer forming","Bond with bone","Diệt khuẩn Ag-doped"],
 content:`<p>Bioglass 45S5 (SiO₂-Na₂O-CaO-P₂O₅) khi tiếp xúc dịch cơ thể tạo lớp hydroxyapatite — <b>xương sống bám trực tiếp</b> vào kính.</p>
 <h4>Ứng dụng</h4><ul><li>Filler xương nha khoa, spinal fusion</li><li>Novamin toothpaste sensitivity (dùng lại men răng)</li><li>Scaffold tissue engineering 3D printed</li></ul>`},

{id:"antimicrobial-cu", cat:"y-te", icon:"🚪", name:"Bề mặt kháng khuẩn đồng", sub:"Kim loại giết virus/vi khuẩn",
 facts:["Cu kills in hours","Oligodynamic effect","Hospital door handles","COVID research"],
 content:`<p>Ion Cu⁺/Cu²⁺ phá màng tế bào & DNA vi sinh — hiệu ứng oligodynamic biết từ 1800s. Nghiên cứu SARS-CoV-2 sống <2 giờ trên đồng vs 72 giờ trên nhựa.</p>
 <h4>Ứng dụng</h4><ul><li>Tay nắm cửa, giường bệnh viện đồng/hợp kim</li><li>Vải cotton pha Cu oxide (Cupron)</li><li>Mặt bàn bếp chống khuẩn</li></ul>`},

{id:"shape-polymer", cat:"y-te", icon:"🧬", name:"4D printing material", sub:"Vật liệu 'tự lắp ráp' theo thời gian",
 facts:["Printed shape memory","Stimulus-responsive","Self-folding stent","Skylar Tibbits MIT 2013"],
 content:`<p>4D printing = 3D printing + thời gian: vật liệu in sẵn tự biến hình khi gặp nhiệt/nước/điện trường — stent cuộn nhỏ rồi tự giãn đúng vị trí mạch.</p>
 <h4>Ứng dụng</h4><ul><li>Stent tự giãn, capsule drug delivery</li><li>Cấu trúc vệ tinh tự triển khai</li><li>Valve tim mô phỏng nhịp đập</li></ul>`},

/* ---------- VẬT LIỆU THÔNG MINH ---------- */
{id:"electrochromic", cat:"thong-minh", icon:"🕶️", name:"Kính electrochromic", sub:"Cửa sổ 'tự nhuộm' một nút bấm",
 facts:["WO₃ redox","Dim 5%–60% transmittance","Tiết kiệm HVAC 20%","Boeing 787 windows"],
 content:`<p>Lớp WO₃ thay đổi màu khi áp điện áp thấp (redox intercalation Li⁺/H⁺) — kính tự sậm/tới như photochromic nhưng <b>điều khiển được</b>.</p>
 <h4>Ứng dụng</h4><ul><li>Cửa sổ skyscraper View Inc tự tối giữa trưa</li><li>Cửa sổ Boeing 787 thay rèm che</li><li>Gương chiếu hậu auto-dimming ô tô</li></ul>`},

{id:"piezoelectric", cat:"thong-minh", icon:"⚡", name:"Piezoelectric (PZT)", sub:"Vật liệu 'biến rung thành điện'",
 facts:["Curie brothers 1880","PZT, PVDF, ZnO","Sonar, lighter, ultrasound","Energy harvesting"],
 content:`<p>Tinh thể bất đối xứng sinh điện tích khi nén — ngược lại cũng co giãn khi áp điện (actuator).</p>
 <h4>Ứng dụng</h4><ul><li>Lighter gas 'bấm phát lửa'</li><li>Ultrasound imaging & sonar tàu ngầm</li><li>Inkjet printhead droplet chính xác picoliter</li><li>Sàn nhảy harvest energy nightclub Rotterdam!</li></ul>`},

{id:"pcm", cat:"thong-minh", icon:"🌡️", name:"Phase-change material (PCM)", sub:'"Pin nhiệt" lưu lạnh/nóng',
 facts:["Paraffin, salt hydrate","Latent heat 200 kJ/kg","Isothermal storage","Textile Outlast astronaut"],
 content:`<p>PCM tan/đông ở nhiệt độ thiết kế, hấp thụ/giải phóng latent heat lớn — 'pin nhiệt' không điện.</p>
 <h4>Ứng dụng</h4><ul><li>Áo Outlast gốc NASA giữ nhiệt độ da ổn định</li><li>Tường building passive cooling</li><li>Chuỗi lạnh vaccine vận chuyển không điện</li><li>Battery pack EV thermal buffer</li></ul>`},

{id:"oled", cat:"thong-minh", icon:"💡", name:"OLED", sub:"Điện phát sáng hữu cơ màn hình cong",
 facts:["Tang/Van Slyke 1987","Self-emissive pixel","Flexible rollable TV","Nobel? Không — nhưng đổi đời display"],
 content:`<p>Lớp polymer/phosphorescent small molecule phát sáng khi dòng điện qua. Mỗi pixel tự phát — không cần backlight → đen tuyệt đối, màn cuộn được.</p>
 <h4>Ứng dụng</h4><ul><li>iPhone Samsung flagship OLED panel</li><li>TV OLED LG wallpaper mỏng như tranh</li><li>Wearable flexible health monitor dán da</li><li>AR glasses microdisplay siêu sáng</li></ul>`},

{id:"liquid-crystal", cat:"thong-minh", icon:"📺", name:"Liquid crystal (LC)", sub:"Trạng thái thứ tư hiển thị LCD",
 facts:["Reinitzer 1888 cholesteryl","Nematic/Smetic","Twisted nematic TFT","Reinitzer phát hiện từ carrot!"],
 content:`<p>Liquid crystal có trật tự hướng như tinh thể nhưng chảy như chất lỏng — điện trường xoay phân tử, kiểm soát polarization ánh sáng.</p>
 <h4>Ứng dụng</h4><ul><li>Màn hình laptop/monitor LCD billions</li><li>Thermochromic mood ring & thermometer</li><li>Smart window PDLC privacy glass</li><li>Optical switch telecom</li></ul>`},

{id:"magnetocaloric", cat:"thong-minh", icon:"❄️", name:"Magnetocaloric refrigerant", sub:"Lạnh từ trường không gas Freon",
 facts:["Gd metal, La(Fe,Si)₁₃H","Adiabatic demagnetization","No HFC refrigerant","40% efficiency gain potential"],
 content:`<p>Hiệu ứng magnetocaloric: từ hóa material tỏa nhiệt, khử từ hấp thụ nhiệt — chu trình làm lạnh <b>không môi chất gây hiệu ứng nhà kính</b>.</p>
 <h4>Triển vọng</h4><ul><li>Tủ lạnh gia đình không Freon</li><li>Ultra-low temp lab cryocooler</li><li>Space cryogenics helium replacement</li></ul>`},

/* ---------- SIÊU DẪN ---------- */
{id:"ybco", cat:"sieu-dan", icon:"🌀", name:"YBCO siêu dẫn", sub:"Siêu dẫn nhiệt độ cao đầu tiên",
 facts:["Tc = 92 K","Bednorz-Müller 1986","Nobel 1987 chỉ 1 năm sau!","Liquid nitrogen cooling"],
 content:`<p>YBa₂Cu₃O₇ là gốm cuprate siêu dẫn trên 77 K — ranh giới nitrogen lỏng, mở kỷ nguyên "siêu dẫn giá rẻ". Cơ chế vẫn chưa được giải thích trọn vẹn sau ~40 năm!</p>
 <h4>Ứng dụng</h4><ul><li>Cáp điện siêu dẫn pilot grid Korea/US</li><li>Nam châm MRI & maglev thế hệ mới</li><li>SQUID sensor não tim cực nhạy</li><li>Fusion magnet tokamak compact</li></ul>`},

{id:"mgb2", cat:"sieu-dan", icon:"🧲", name:"MgB₂", sub:"Siêu dẫn 'đơn giản' 39K bất ngờ",
 facts:["Tc = 39 K (2001)","Hợp chất đơn giản nhất","Akimitsu tình cờ","Wire dễ sản xuất"],
 content:`<p>Magnesium diboride — cấu trúc lục giản đơn giản nhất trong siêu dẫn, bị bỏ sót suốt 50 năm vì 'quá đơn giản để kiểm tra'. BCS conventional nhưng Tc cao bất thường.</p>
 <h4>Ứng dụng</h4><ul><li>MRI open-system magnet không cần helium lỏng đắt đỏ</li><li>Detector microwave astronomy</li><li>Fault current limiter grid bảo vệ</li></ul>`},

{id:"nbti", cat:"sieu-dan", icon:"🏥", name:"Nb-Ti & Nb₃Sn", sub:"Xương sống MRI & máy gia tốc",
 facts:["Nb-Ti Tc=9.2K","Nb₃Sn Tc=18.3K","LHC 1.232 dipole magnets","Workhorse since 1960s"],
 content:`<p>Hợp kim niobi-titan dẻo dễ kéo thành dây — vật liệu siêu dẫn thương mại chủ lực từ 60 năm nay. Nb₃Sn chịu field cao hơn cho máy gia tốc thế hệ mới.</p>
 <h4>Ứng dụng</h4><ul><li>>30.000 MRI scanner toàn cầu</li><li>LHC bending magnet 8,3 Tesla</li><li>Fusion ITER TF coil</li></ul>`},

{id:"hydride-sc", cat:"sieu-dan", icon:"🔬", name:"Hydride siêu áp suất (H₃S, LaH₁₀)", sub:'"Siêu dẫn nhiệt độ phòng" dưới 1 triệu atm',
 facts:["H₃S 203K (-70°C)","LaH₁₀ 250-260K","Áp suất ~170 GPa","Dias group 2015-2020"],
 content:`<p>Hydrogen-rich compounds nén trong diamond anvil cell siêu dẫn gần nhiệt độ phòng — kỷ lục tuyệt đối, nhưng chỉ tồn tại ở áp suất tâm Trái Đất. Cuộc đua tìm cách 'giữ' áp suất bằng chemical pre-compression.</p>
 <p>Đây là frontier nóng nhất vật liệu học hiện nay; kết quả nhiều nhóm đang được kiểm chứng lại.</p>`},

{id:"lk99", cat:"sieu-dan", icon:"⚠️", name:"LK-99 (bị bác bỏ)", sub:"Bài học khoa học về claim siêu dẫn",
 facts:["2023 Korea viral","Cu-doped lead apatite","Không tái lập được","Case study scientific method"],
 content:`<p>Tháng 7/2023, LK-99 được tuyên bố là siêu dẫn nhiệt độ phòng — internet bùng nổ trong 2 tuần. Các lab lớn (Berkeley, Princeton, CSIR) tái lập nhanh chóng và chứng minh <b>chỉ là ferromagnet + resistance drop do Cu₂S tạp chất</b>, không phải siêu dẫn.</p>
 <p>Bài học quý: peer review & replication hoạt động đúng vai trò, cộng đồng khoa học tự sửa sai trong vài tuần.</p>`},

/* ---------- BÁN DẪN & QUANG ĐIỆN Tử ---------- */
{id:"gaas", cat:"ban-dan", icon:"📡", name:"GaAs", sub:"Bán dẫn của RF & laser",
 facts:["Electron mobility ×6 Si","Direct bandgap 1.42 eV","Satellite & phone RF","LED đầu tiên 1962"],
 content:`<p>Gallium arsenide di chuyển electron nhanh hơn silicon 6× — vua của mạch RF tần số cao & laser diode. Đắt hơn Si ~10× nhưng đáng tiền ở chỗ silicon không làm nổi.</p>
 <h4>Ứng dụng</h4><ul><li>Amplifier 5G mmWave smartphone</li><li>Satellite solar cell hiệu suất cao</li><li>Laser CD/DVD/lidar</li><li>Radar quân sự AESA</li></ul>`},

{id:"gan", cat:"ban-dan", icon:"💡", name:"GaN", sub:"Bán dẫn LED xanh & sạc nhanh",
 facts:["Bandgap 3.4 eV","Blue LED Nobel 2014","Fast charger GaN","Power electronics revolution"],
 content:`<p>Gallium nitride giải bài toán khó nhất quang học — <b>LED xanh lam</b> (Akasaki, Amano, Nakamura Nobel 2014), mở đường đèn LED trắng tiết kiệm 90% điện.</p>
 <h4>Ứng dụng</h4><ul><li>Sạc laptop 65-240W cỡ củ sạc nhỏ</li><li>Inverter xe điện tăng range</li><li>Radar F-35 GaN AESA</li><li>UV-C disinfection LED</li></ul>`},

{id:"asi", cat:"ban-dan", icon:"🔲", name:"Amorphous silicon", sub:"Bán dẫn vô trật tự cho màn hình & pin mỏng",
 facts:["No crystal lattice","Thin-film transistor (TFT)","Solar thin film","Cheap large-area"],
 content:`<p>a-Si lắng đọng hơi trên kính lớn giá rẻ — không cần tinh thể hoàn hảo. Mobility thấp nhưng đủ cho pixel switching TFT.</p>
 <h4>Ứng dụng</h4><ul><li>Màn hình LCD TFT hàng tỷ unit</li><li>PIN mặt trời mỏng calculator/máy đo</li><li>X-ray flat panel detector y tế</li></ul>`},

{id:"organic-semi", cat:"ban-dan", icon:"🧴", name:"Organic semiconductor", sub:"Bán dẫn 'in ấn được' như mực",
 facts:["Pentacene, P3HT","Solution-processable","Flexible OPV/OFET","Heeger Nobel 2000"],
 content:`<p>Polymer & small molecule dẫn điện khi pha tạp — in được trên nhựa cuộn (roll-to-roll) giá rẻ. Heeger/MacDiarmid/Shirakawa Nobel Hóa 2000 cho polyacetylene dẫn điện.</p>
 <h4>Ứng dụng</h4><ul><li>OPV pin hữu cơ bán trong suốt cửa sổ</li><li>RFID tag in rẻ như tem</li><li>Sensor sinh học dùng một lần</li><li>OFET flexible display backplane</li></ul>`},

{id:"nv-center", cat:"ban-dan", icon:"💎", name:"Kim cương NV center", sub:"Quantum sensor ở nhiệt độ phòng",
 facts:["Nitrogen-vacancy defect","Single spin readout","MRI nano-scale","Room temperature qubit"],
 content:`<p>Khiếm khuyết nitrogen-vacancy trong kim cương là 'nguyên tử giả' có spin có thể đọc bằng laser — quantum sensor hoạt động trên bàn lab, đo từ trường của <b>một electron đơn</b>.</p>
 <h4>Ứng dụng</h4><ul><li>MRI cấp phân tử nghiên cứu protein</li><li>Compass quantum không GPS</li><li>Neuroscience ghi nhận neuron đơn</li><li>Qubit solid-state ổn định</li></ul>`},

/* ---------- TỪ TÍNH & SPINTRONICS ---------- */
{id:"ferrite", cat:"tu-tinh", icon:"🍩", name:"Ferrite mềm MnZn", sub:"Nam châm gốm của mọi transformer",
 facts:["MnZnFe₂O₄","High permeability","Cheap & insulating","1950s → mọi adapter"],
 content:`<p>Ferrite gốm từ tính vừa dẫn từ vừa cách điện — tổn hao eddy-current gần như bằng không. Chiếc sạc adapter nào cũng có core ferrite bên trong.</p>
 <h4>Ứng dụng</h4><ul><li>Transformer switch-mode power supply</li><li>EMI bead chống nhiễu cáp điện tử</li><li>Antenna AM radio ferrite rod cổ điển</li></ul>`},

{id:"permalloy", cat:"tu-tinh", icon:"🧭", name:"Permalloy", sub:"Hợp kim Ni-Fe 'độ từ thẩm vua'",
 facts:["Ni₈₀Fe₂₀","µr ~100.000","Magnetic shielding","Spintronics pioneer"],
 content:`<p>Permalloy dẫn từ trường tốt đến mức chặn được từ trường yếu như tấm chắn — dùng bảo vệ MRI room & electron microscope. Là vật liệu đầu tiên của spintronics GMR.</p>
 <h4>Ứng dụng</h4><ul><li>Magnetic shield phòng MRI/lab</li><li>Read head HDD cũ (GMR Nobel 2007)</li><li>Transformer audio chất lượng cao</li></ul>`},

{id:"heusler", cat:"tu-tinh", icon:"🎭", name:"Heusler alloy", sub:"Hợp kim 'từ tính bất ngờ' không từ nguyên tố",
 facts:["Cu₂MnAl (1903)","Non-magnetic elements → ferromagnet!","Half-metallic spin 100%","Spintronics candidate"],
 content:`<p>Heusler là phép màu hóa trạng thái rắn: hợp kim các nguyên tố <b>không từ tính</b> (Cu, Mn, Al) lại ferromagnetic nhờ cấu trúc tinh thể đặc biệt. Half-metallicity cho spintronics hoàn hảo.</p>
 <h4>Triển vọng</h4><ul><li>MRAM magnetic memory non-volatile</li><li>Spin filter transistor</li><li>Topological quantum computing substrate</li></ul>`},

{id:"cr13-magnet", cat:"tu-tinh", icon:"🧊", name:"CrI₃ — nam châm 2D", sub:"Từ tính xuống một lớp nguyên tử",
 facts:["2017 first 2D magnet","Monolayer ferromagnet","Layer-dependent switching","van der Waals heterostructure"],
 content:`<p>Trước 2017, người ta tin vật liệu 2D không thể giữ từ tính (Mermin-Wagner). CrI₃ phá quy luật — mở lĩnh vực <b>magnetism 2D</b> cho data storage mật độ nguyên tử.</p>
 <h4>Triển vọng</h4><ul><li>Hard drive mật độ cực đại</li><li>Van der Waals spintronics stack</li><li>Magnonics — tính toán bằng spin wave</li></ul>`},

/* ---------- SINH HỌC & TỰ NHIÊN ---------- */
{id:"spider-silk", cat:"tu-nhien", icon:"🕸️", name:"Tơ nhện", sub:"Vật liệu bền nhất sinh giới",
 facts:["Tensile ~1.3 GPa","Tougher than Kevlar","Elastic 40%","Spidroin protein biotech"],
 content:`<p>Tơ nhện dragline: strength như thép cao cấp, độ dai vượt Kevlar, co giãn 40% — combo mà polymer tổng hợp chưa đạt. Không nuôi được nhện hàng loạt → dùng <b>vi khuẩn genetically modified</b> sản spidroin.</p>
 <h4>Ứng dụng</h4><ul><li>Spiber (Nhật) áo khoác protein Moon Parka</li><li>Suture & nerve guide y tế</li><li>Parachute lightweight military research</li></ul>`},

{id:"nacre", cat:"tu-nhien", icon:"🐚", name:"Nacre (xà cừ)", sub:"Bài học thiết kế composite từ vỏ sò",
 facts:["95% CaCO₃ brittle → tough 3000×","Brick-and-mortar architecture","Self-healing interface","Bio-inspired materials king"],
 content:`<p>Nacre là calcite giòn vụn xếp thành gạch 500 nm với lớp protein 'vữa' — vết nứt phải đi đường vòng zigzag tiêu tán năng lượng. Vật liệu nhân tạo bắt chước (nacre-mimetic) đang ra lò.</p>
 <h4>Triển vọng</h4><ul><li>Body armor bio-inspired nhẹ hơn</li><li>Glass stronger nacre-like Berkeley 2014</li><li>Dental implant coating</li></ul>`},

{id:"chitosan", cat:"tu-nhien", icon:"🦐", name:"Chitin & Chitosan", sub:"Polysaccharide từ vỏ tôm cua",
 facts:["Second most abundant biopolymer","Wound healing FDA","Water purification flocculant","Antimicrobial food coating"],
 content:`<p>Chitin là polymer số 2 hành tinh (sau cellulose) — khung xương ngoài tôm cua & thành tế bào nấm. Deacetylate thành chitosan hòa tan được, kháng khuẩn tự nhiên.</p>
 <h4>Ứng dụng</h4><ul><li>Băng gạc cầm máu hemostat quân đội</li><li>Lọc nước keo tụ thay phèn nhôm</li><li>Màng phủ trái cây kéo dài tươi</li><li>Seed coating nông nghiệp organic</li></ul>`},

{id:"nanocellulose", cat:"tu-nhien", icon:"🌲", name:"Cellulose nanocrystal", sub:"Gỗ nano mạnh hơn thép theo trọng lượng",
 facts:["CNC/CNF from wood","E modulus ~150 GPa","Transparent film","Abundant renewable"],
 content:`<p>Tách tinh thể cellulose 3-20 nm từ bột gỗ — strength riêng ngang Kevlar. Transparent paper, flexible electronics substrate xanh.</p>
 <h4>Ứng dụng</h4><ul><li>Biodegradable packaging film</li><li>Reinforcement epoxy composite</li><li>Battery separator cellulose</li><li>Transparent wood window insulation</li></ul>`},

{id:"mycelium", cat:"tu-nhien", icon:"🍄", name:"Mycelium composite", sub:"Vật liệu trồng được từ nấm",
 facts:["Grow in 7 days","Compostable 30 days","Insulation λ~0.04","IKEA/Dell packaging"],
 content:`<p>Sợi nấm (mycelium) ăn qua chất nền nông nghiệp (vỏ trấu, mạt cưa) rồi tự liên kết — 'trồng' packaging & panel cách nhiệt thay EPS foam nhựa.</p>
 <h4>Ứng dụng</h4><ul><li>Packaging Dell/IKEA compostable</li><li>Acoustic panel âm nhạc studio</li><li>Mycelium brick Biomanufacturing tower MoMA</li></ul>`},

{id:"lotus", cat:"tu-nhien", icon:"🪷", name:"Lotus-effect surface", sub:"Siêu kỵ nước bắt chước lá sen",
 facts:["Contact angle >150°","Micro+nano hierarchy","Self-cleaning rain wash","Barthlott 1997 discovery"],
 content:`<p>Lá sen có cấu trúc micro-bump phủ wax nano → nước viên cầu lăn mang theo bụi. Bioinspired coating 'tự vệ sinh' cho mặt kính, vải, sơn.</p>
 <h4>Ứng dụng</h4><ul><li>Sơn nhà tự sạch Sto/Lotusan</li><li>Vải áo mưa không thấm PFAS-free</li><li>Turbine blade anti-icing</li><li>Toilet ceramic TOTO self-clean</li></ul>`},

/* ---------- LỚP PHỦ & KẾT DÍNH ---------- */
{id:"dlc", cat:"lop-phu", icon:"🖤", name:"Diamond-like carbon (DLC)", sub:"'Kim cương giả' chống mòn siêu mỏng",
 facts:["sp³ carbon amorphous","Hardness 10-40 GPa","Friction coefficient 0.05-0.2","Razor blade & engine coating"],
 content:`<p>DLC là màng carbon chứa nhiều bond sp³ như kim cương nhưng amorphous — cứng, trượt, trơ hóa học. Mỏng vài µm biến bề mặt thép thành 'gần-kim-cương'.</p>
 <h4>Ứng dụng</h4><ul><li>Lưỡi dao cạo Gillette Fusion</li><li>Camshaft & piston ring động cơ race</li><li>Joint implant wear-resistant</li><li>Watch case đen sang trọng</li></ul>`},

{id:"ysz-tbc", cat:"lop-phu", icon:"🔥", name:"YSZ thermal barrier", sub:"'Áo giáp nhiệt' cho cánh tuabin",
 facts:["Y₂O₃-stabilized ZrO₂","λ = 1-2 W/m·K at 1200°C+","Plasma spray / EB-PVD","Lowers metal temp ~150°C"],
 content:`<p>Lớp zirconia ổn định pha vài trăm µm giữ cánh tuabin nickel sống sót sau khí cháy 1600°C — không TBC thì không có động cơ phản lực hiện đại.</p>
 <h4>Ứng dụng</h4><ul><li>Cánh tuabin GE/Rolls-Royce</li><li>Combustor liner rocket engine</li><li>Diesel piston crown thermal coat</li></ul>`},

{id:"ti02-selfclean", cat:"lop-phu", icon:"🪟", name:"TiO₂ photocatalytic coating", sub:"Kính tự sạch + xử lý ô nhiễm ánh sáng",
 facts:["UV → e⁻/h⁺ pairs","Break organics & NOx","Superhydrophilic rain sheet","Fujishima-Honda effect 1972"],
 content:`<p>TiO₂ anatase dưới UV tạo radical OH· phân hủy chất bẩn hữu cơ & NOx khói xe — mưa rửa trôi. 'Photocatalysis' là green tech kinh điển.</p>
 <h4>Ứng dụng</h4><ul><li>Kính tự sạch Pilkington Activ™</li><li>Sơn facade giảm NOx thành phố</li><li>Bê tông khử smog TX Active®</li><li>Đường ống nước UV-TiO₂ disinfection</li></ul>`},

{id:"cyanoacrylate", cat:"lop-phu", icon:"🩹", name:"Superglue cyanoacrylate", sub:"Keo 502 phát minh do... tai nạn chiến tranh",
 facts:["Coover 1942 failed gun sight","Anion polymerization instant","Medical tissue adhesive","CSI fingerprint fuming"],
 content:`<p>Harry Coover tìm keo sightsung WWII thất bại — 9 năm sau nhận ra 'lỗi' chính là keo dính mọi thứ. Cyanoacrylate polymerize tức thì khi gặp hơi nước da.</p>
 <h4>Ứng dụng</h4><ul><li>Khâu vết thương Dermabond y tế</li><li>CSI cyanoacrylate fuming vân tay</li><li>Woodworking instant bond</li></ul>`},

{id:"mo2-lube", cat:"lop-phu", icon:"⚙️", name:"MoS₂ dry lubricant", sub:"Bôi trơn rắn không cần dầu",
 facts:["Layered like graphite","Vacuum/space capable","−200 to 400°C","Apollo lunar rover axle"],
 content:`<p>MoS₂ tầng van der Waals trượt dễ dàng — bôi trơn nơi dầu bay hơi chết (chân không vũ trụ!). NASA dùng cho rover Mặt Trăng vì không có khí quyển.</p>
 <h4>Ứng dụng</h4><ul><li>Vệ tinh mechanism lifetime lubrication</li><li>Lock de-icer powder khô</li><li>Metal forming extreme pressure</li><li>2D transistor MoS₂ monolayer bonus!</li></ul>`},

{id:"anodize", cat:"lop-phu", icon:"🔋", name:"Anodized aluminum oxide", sub:"Lớp oxide 'trồng' trên nhôm",
 facts:["Electrolytic Al₂O₃ growth","Corrosion + wear resistant","Dyeable color Apple MacBook","Sealed microporous structure"],
 content:`<p>Anodizing đảo cực electrochemistry: thay vì mạ thêm, nó <b>dày lên lớp oxide tự nhiên</b> của nhôm 1000× — cứng, bền màu, nhuộm được mọi sắc.</p>
 <h4>Ứng dụng</h4><ul><li>Vỏ MacBook/iPhone anodized finish</li><li>Cửa nhôm kiến trúc bãi biển muối</li><li>Nonstick cookware hard-anodized</li><li>Memory card case aerospace</li></ul>`},

/* ---------- VẬT LIỆU LÝ THUYẾT & SIÊU KỲ ---------- */
{id:"topological-insulator", cat:"ly-thuyet", icon:"🔮", name:"Topological insulator (Bi₂Se₃)", sub:"Vỏ dẫn điện, ruột cách điện",
 facts:["Bulk insulator + metallic surface","Time-reversal protected","Spin-momentum locking","Quantum computing candidate"],
 content:`<p>Vật liệu 'nghịch lý': bên trong là cách điện, nhưng bề mặt bắt buộc dẫn điện nhờ topology — electron không thể tán xạ ngược (miễn nhiễm nhiễu loạn).</p>
 <h4>Triển vọng</h4><ul><li>Low-power spintronics</li><li>Majorana qubit topological quantum computer</li><li>Thermoelectric Bi₂Te₃ cousin!</li></ul>`},

{id:"weyl-semimetal", cat:"ly-thuyet", icon:"🌀", name:"Weyl semimetal (TaAs)", sub:"Quasiparticle 'không khối lượng' thực nghiệm",
 facts:["Weyl fermions as quasiparticles","TaAs confirmed 2015","Chiral anomaly transport","Ultrafast electronics potential"],
 content:`<p>Trong tinh thể TaAs, electron behave như Weyl fermion — hạt từng chỉ tồn tại trên giấy toán 1929. Band structure 'chạm nhau' tại điểm Weyl tạo electron vô khối tốc độ cao.</p>
 <h4>Triển vọng</h4><ul><li>Transistor terahertz siêu nhanh</li><li>Quantum optics nonlinear giant response</li><li>Chiral battery? Fundamental physics playground</li></ul>`},

{id:"dna-origami", cat:"ly-thuyet", icon:"🧬", name:"DNA origami", sub:"Lập trình DNA gấp hình bất kỳ",
 facts:["Rothemund 2006 Caltech","2nm precision folding","Drug delivery robot","Nano factory scaffold"],
 content:`<p>Thiết kế sequence DNA 'staple' khiến sợi dài 7000 base tự gấp thành smiley, hộp, gear — độ chính xác 2 nm không công nghệ nào bằng. 'Programmable matter' thật sự bằng phân tử sống.</p>
 <h4>Ứng dụng</h4><ul><li>Nanorobot drug delivery target cancer cell (Nature 2020)</li><li>Lipid nanoparticle vaccine scaffold</li><li>Single-molecule biosensor</li><li>Data storage DNA archival</li></ul>`},

{id:"bronze", cat:"lich-su-vl", icon:"⚔️", name:"Đồng thau Bronze Age", sub:"Hợp kim đầu tiên con người 'thiết kế'",
 facts:["Cu + Sn ~10%","~3300 TCN","Cứng hơn đồng nguyên chất ×3","Khai sinh nghề đúc khuôn"],
 content:`<p>Pha thiếc vào đồng hạ nhiệt độ nóng chảy và tăng độ cứng — hợp kim có chủ đích đầu tiên của nhân loại, đặt tên cả một thời đại. Thiếc phải đi buôn xuyên lục địa (Cornwall → Địa Trung Hải) — supply chain đầu tiên lịch sử.</p>
 <h4>Di sản</h4><ul><li>Dao gươm, giáo mác thay đổi chiến tranh</li><li>Chuông & nhạc cụ (đồng thanh âm đẹp)</li><li>Tượng đúc rỗng kỹ thuật cire perdue</li></ul>`},

{id:"damascus-steel", cat:"lich-su-vl", icon:"🗡️", name:"Thép Damascus / Wootz", sub:"Lưỡi kiếm huyền thoại Ấn Độ - Syria",
 facts:["Wootz ingot India ~300 TCN","Carbon nanotube trong lưỡi!","Pattern 'watered silk'","Công thức thất truyền ~1700"],
 content:`<p>Thép wootz nấu trong nồi đất sét Ấn Độ, rèn lại ở Damascus tạo vân sóng nước độc nhất. Nghiên cứu SEM hiện đại phát hiện <b>carbon nanotube tự nhiên</b> trong vi cấu trúc — công nghệ nano... thế kỷ III TCN!</p>
 <p>Công thức thất truyền thế kỷ XVIII (quặng Wolfram/vanadium cạn) — đến nay vẫn chưa tái tạo đúng 100%.</p>`},

{id:"roman-concrete", cat:"lich-su-vl", icon:"🏛️", name:"Bê tông La Mã", sub:"Opus caementicium sống sót 2000 năm biển",
 facts:["Volcanic ash + lime","Pantheon dome chưa đổ 1900 năm","Self-healing lime clasts","MIT nghiên cứu 2023 giải mã"],
 content:`<p>Bê tông tro núi lửa (pozzolana) + vôi nóng: seawater phản ứng tạo phyllosilicate tinh thể bền hơn — cả các 'lime clast' nóng chảy tự vá vết nứt khi gặp nước (MIT 2023). Cầu La Mã vẫn xe chạy hôm nay.</p>
 <p>Công thức bền hơn Portland concrete hiện đại trong môi trường biển — đang được reverse-engineer cho xây dựng ven biển.</p>`},

{id:"porcelain", cat:"lich-su-vl", icon:"🏺", name:"Sứ Trung Hoa", sub:'"White gold" mà châu Âu săn 1000 năm',
 facts:["Kaolin + petuntse ~1300°C","Translucent vitrified body","Jingdezhen capital 1000 năm","Meissen crack 1708 (Böttger)"],
 content:`<p>Sứ là gốm nung tới 1300°C với cao lanh — thân vitrified bán trong suốt, rung như kim khí. Châu Âu trả giá vàng mua; alchemist Böttger bị nhốt bởi Augustus II và... phát minh sứ Meissen 1708 trong tù!</p>
 <h4>Khoa học</h4><ul><li>Mullite needle phase gia cố như sợi composite</li><li>Glassy phase lấp pore — không thấm</li><li>Cobalt underglaze xanh lam nổi tiếng triều Minh</li></ul>`},

{id:"tyrian-purple", cat:"lich-su-vl", icon:"👑", name:"Tyrian purple", sub:"Màu tím đắt hơn vàng từ ốc biển",
 facts:["Murex snail glands","12.000 ốc = 1,4 g dye","Phoenicia ~1500 TCN","6,6′-dibromoindigo"],
 content:`<p>Tím hoàng gia La Mã — chỉ hoàng đế được mặc. Thu từ tuyến ốc murex: ngâm màng trong muối 10 ngày, oxy hóa ánh sáng chuyển từ trắng → vàng → xanh → tím cuối cùng. Hóa học enzymatic + photooxidation cổ xưa nhất công nghiệp màu.</p>
 <p>Paul Friedländer tổng hợp tổng 1909 xác định cấu trúc dibromoindigo — 3000 năm sau khi loài người dùng nó.</p>`},

{id:"indigo", cat:"lich-su-vl", icon:"🟦", name:"Indigo & denim", sub:"Thuốc nhuộm xanh nuôi cả nền kinh tế",
 facts:["Indicum India, áo Jeans Genoa","Fermentation indican → indoxyl","Synthesis Baeyer 1878 Nobel 1905","Vat dyeing chemistry"],
 content:`<p>Indigo không tan — phải khử về leuco-indigo (vàng nhạt hòa tan), nhúng vải rồi <b>phơi oxy hóa</b> trở lại xanh đặc trưng. Mỗi lớp nhúng = một tầng màu; jeans fade theo cơ chế abrasion of dye particles.</p>
 <p>Baeyer tổng hợp tổng 1882 (Nobel 1905) — BASF thương mại 1897 giết ngành trồng chàm thuộc địa.</p>`},

{id:"bakelite", cat:"lich-su-vl", icon:"☎️", name:"Bakelite", sub:"Nhựa đầu tiên của nhân loại (1907)",
 facts:["Leo Baekeland","Phenol + formaldehyde thermoset","'Material of 1000 uses'","Radio, điện thoại, trang sức Art Deco"],
 content:`<p>Nhựa tổng hợp đầu tiên hoàn toàn — phenol-formaldehyde network không thể nấu lại. Trước Bakelite, nhựa chỉ là biến tính cellulose/nitrocellulose. Mở kỷ nguyên Age of Plastics thế kỷ XX.</p>
 <h4>Đặc điểm</h4><ul><li>Thermoset: nóng cháy chứ không mềm lại</li><li>Cách điện tuyệt vời — cách mạng electrical industry</li><li>Ngày nay là đồ collectible vintage đắt đỏ</li></ul>`},

{id:"cellophane", cat:"lich-su-vl", icon:"🍬", name:"Cellophane", sub:"Màng trong suốt từ gỗ (1908)",
 facts:["Brandenberger Switzerland 1908","Regenerated cellulose film","Viscose process","First 'clear wrap' packaging"],
 content:`<p>Cellophane thực chất là <b>cellulose tái sinh</b> — hòa tan gỗ trong CS₂/NaOH (viscose), ép qua khe thành màng, hồi sinh thành cellulose trong suốt. Bao bì nhìn thấy sản phẩm — cách mạng marketing bán lẻ thập niên 1930.</p>
 <p>Chị em ruột: rayon sợi viscose, màng nhựa 'silk paper' — cùng hóa học xanthate.</p>`},

{id:"tamahagane", cat:"lich-su-vl", icon:"🇯🇵", name:"Tamahagane", sub:"Thép katana tatara Nhật Bản",
 facts:["Satetsu iron sand","Tatara furnace 72 hours","High/low carbon layers","Folding ×15 = 32,768 layers"],
 content:`<p>Cát sắt sa khoáng nung trong lò tatara 3 ngày đêm — thợ rèn gấp uốn hàng nghìn lớp tách tạp chất & phối carbon. Lưỡi katana: lõi thép mềm chịu va, vỏ thép cứng giữ mài, clay tempering tạo hamon sóng tuyết.</p>
 <p>Metallurgy empirical tinh túy — trước khi khoa học vật liệu giải thích vì sao hoạt động.</p>`},

{id:"paper-history", cat:"lich-su-vl", icon:"📜", name:"Giấy", sub:"Phát minh Trung Quốc đổi thay văn minh",
 facts:["Cai Lun 105 CN","Cellulose fiber suspension → mat → dry","Arabic spread via Samarkand 751","Wood pulp industrial 1840s Keller"],
 content:`<p>Giấy là composite nano tự nhiên: sợi cellulose 20 nm liên kết hydrogen khi khô. Từ lụa/bamboo → giấy → in ấn Gutenberg → báo chí — mỗi bước là cuộc cách mạng thông tin.</p>
 <h4>Hóa học giấy hiện đại</h4><ul><li>Lignin removal bleaching (kraft process)</li><li>Acid paper 1850-1980 đang tự phân hủy — deacidification mass treatment</li><li>Nanocellulose: giấy thế hệ mới siêu bền trong suốt</li></ul>`},

/* ---------- HIỆN ĐẠI BỔ SUNG ---------- */
{id:"dyneema", cat:"polymer", icon:"🪢", name:"Dyneema (UHMWPE)", sub:"Sợi polymer bền nhất thương mại",
 facts:["Strength-to-weight ×15 steel","Floats on water!","UV & chemical resistant","Armor, ropes, nets"],
 content:`<p>Polyethylene siêu phân tử lượng (UHMWPE) kéo sợi gel-spinning — chuỗi polymer gần như hoàn toàn định hướng dọc sợi. Bền hơn kevlar 40%, nhẹ đến mức <b>bơi trên nước</b>.</p>
 <h4>Ứng dụng</h4><ul><li>Dây neo giàn khoan biển thay dây thép</li><li>Áo chống dao & insert ballistic</li><li>Cầu dây treo pedestrian thử nghiệm</li><li>Vải cắt-resistant cấp 5 công nghiệp</li></ul>`},

{id:"memory-foam", cat:"polymer", icon:"🛏️", name:"Memory foam (viscoelastic)", sub:"Từ ghế phi hành gia NASA ra đệm ngủ",
 facts:["Temper foam NASA 1966","Slow recovery viscoelastic","Body-contouring pressure relief","Open-cell PU derivative"],
 content:`<p>Polyurethane viscoelastic: mềm theo nhiệt độ cơ thể, hồi phục chậm vài giây — 'nhớ' hình dáng. Chân phi công NASA sống sót va chạm tốt hơn nhờ ghế absorb shock.</p>
 <h4>Vật lý thú vị</h4><ul><li>Glass transition engineered gần RT → viscoelastic sweet spot</li><li>Memory 'fake': thật ra là slow elastic, không phải shape memory nitinol</li><li>Gel-infused cooling phiên bản mới</li></ul>`},

{id:"neoprene", cat:"polymer", icon:"🤿", name:"Neoprene (chloroprene)", sub:"Cao su tổng hợp đầu tiên thương mại (1930)",
 facts:["DuPont 1931 (Carothers team)","Oil/ozone resistant","Wetsuit foam closed-cell","Gaskets & hoses"],
 content:`<p>Polychloroprene — cao su tổng hợp đầu tiên bán ra, ra đời TRƯỚC nylon. Chlorine substituent kháng dầu mỡ & ozone tốt hơn natural rubber — cứu ngành điện & ô tô thời kỳ khủng hoảng cao su.</p>
 <h4>Ứng dụng</h4><ul><li>Áo lặn neoprene foam giữ nhiệt dưới nước</li><li>Ống dẫn nhiên liệu ô tô</li><li>Laptop sleeve, knee brace thể thao</li></ul>`},

{id:"alon", cat:"gom", icon:"🪟", name:"ALON — 'nhôm trong suốt'", sub:"Aluminum oxynitride kính armor",
 facts:["Al₂₃O₂₇N₅","Transparent 0.2–5.5 µm","Hardness ×4 glass","Stops .50 cal bullet 1.6\" thick"],
 content:`<p>ALON là gốm spinel trong suốt — 'kim loại nhìn xuyên qua' từng viral internet. Cứng gấp 4 thủy tinh, chịu nhiệt 2100°C, xuyên hồng ngoại — cửa sổ tank & domes sensor quang học quân sự.</p>
 <p>Sản xuất: powder AlON nung 1950°C + HIP pressure — đắt gấp nhiều lần bulletproof glass thường nhưng mỏng hơn đáng kể cùng độ bảo vệ.</p>`},

{id:"b4c", cat:"gom", icon:"🛑", name:"Boron carbide B₄C", sub:"Gốm cứng thứ 3 — áo giáp & điều khiển hạt nhân",
 facts:["Mohs ~9.5","Density 2.52 g/cm³ light!","Neutron absorber control rods","Tank armor & vest plates"],
 content:`<p>'Black diamond' — chỉ sau kim cương & BN cubic về độ cứng, nhưng nhẹ hơn nhôm oxide gần một nửa. Bắt neutron mạnh nên làm thanh điều khiển lò phản ứng.</p>
 <h4>Ứng dụng</h4><ul><li>SAPI plate áo giáp quân đội Mỹ</li><li>Nozzle phun cát & blast abrasive</li><li>Control rod & shielding Chernobyl-era reactors</li><li>Brake pads xe đua endurance</li></ul>`},

{id:"tungsten-carbide", cat:"gom", icon:"🔩", name:"Tungsten carbide WC-Co", sub:"Cermet 'cemented carbide' của mọi lưỡi cắt",
 facts:["WC 90% + Co binder","Hardness 1600-2400 HV","Keeps edge ×100 steel","Drill bits, end mills, dies"],
 content:`<p>Composite gốm-kim loại: hạt WC cứng cực đoan 'dán' bằng cobalt dẻo — cứng như gốm, không giòn như gốm. Sản xuất bằng powder metallurgy sintering 1400°C.</p>
 <h4>Ứng dụng</h4><ul><li>Mũi khoan & milling cutter CNC mọi nhà máy</li><li>Ring cưới 'tungsten' scratch-proof</li><li>Rollers mill dây thép áp lực khủng</li><li>Ballpoint tip viết 5 km chữ!</li></ul>`},

{id:"inconel", cat:"kim-loai", icon:"🏭", name:"Inconel 718", sub:"Siêu hợp kim nickel-chromium 'quái vật' ăn mòn",
 facts:["Ni-Cr-Fe-Nb-Mo","Service to 700°C+","Oxidation resistant extreme","Rocket engine & nuclear"],
 content:`<p>Inconel hình thành lớp oxide Cr₂O₃ bảo vệ kiên cường — 'chậm rãi oxy hóa chứ không gỉ'. SpaceX Merlin engine chạy LOX/kerosene nhờ Inconel chamber; khó hàn là nổi tiếng với thợ cơ khí.</p>
 <h4>Ứng dụng</h4><ul><li>Rocket combustion chamber Merlin Raptor</li><li>Turbine shafts & fasteners tuabin gas</li><li>Nuclear reactor core components</li><li>Exhaust system Formula 1!</li></ul>`},

{id:"maraging", cat:"kim-loai", icon:"🏋️", name:"Maraging steel", sub:"Thép siêu cường không carbon",
 facts:["18Ni-8Co-5Mo","Age hardening intermetallic","2500 MPa tensile!","Machined soft → aged hard"],
 content:`<p>Paradox metallurgy: thép gần NHƯ KHÔNG CARBON nhưng mạnh nhất thế giới — strength từ precipitate Ni₃Mo/Ti intermetallic khi age 480°C. Gia công ở trạng thái mềm rồi 'lão hóa' lên cứng — workflow độc đáo.</p>
 <h4>Ứng dụng</h4><ul><li>Falcon 9 booster walls (SpaceX version)</li><li>Fencing blade Olympic an toàn gãy sạch</li><li>Die & mold tooling cao cấp</li></ul>`},

{id:"ndyag", cat:"ban-dan", icon:"🔦", name:"Nd:YAG laser crystal", sub:"Tinh thể laser công nghiệp vạn năng",
 facts:["Nd³⁺ in Y₃Al₅O₁₂ garnet","1064 nm fundamental","Flash diode pumped","Cutting, medicine, rangefinder"],
 content:`<p>Garnet yttrium aluminum pha neodymium 1% — ion Nd³⁺ 4f electron cung cấp transition laser 1064 nm ổn định nhiệt tuyệt vời. Laser solid-state kinh điển từ 1964 đến nay vẫn vua công nghiệp.</p>
 <h4>Ứng dụng</h4><ul><li>Cắt hàn kim loại precision automotive</li><li>Lasik eye surgery (frequency-doubled 532)</li><li>Military rangefinder & designator</li><li>Tattoo removal dermatology Q-switched</li></ul>`},

{id:"scintillator", cat:"ban-dan", icon:"✨", name:"Scintillator NaI(Tl)/LSO", sub:'Vật liệu "biến photon gamma thành ánh sáng"',
 facts:["NaI(Tl) classic 1948","LSO/LYSO PET standard","~40,000 photons/MeV","Radiation detector backbone"],
 content:`<p>Tinh thể kích hoạt thallium/cerium: gamma ray ionize lattice → electron-hole recombine phát photon visible — PMT đọc thành tín hiệu điện. Cửa sổ 'mắt thấy bức xạ' của y học & an toàn hạt nhân.</p>
 <h4>Ứng dụng</h4><ul><li>PET scanner ring LSO crystals</li><li>Customs portal radiation detection container</li><li>Gamma spectroscopy isotope ID handheld</li><li>High energy physics calorimeter CMS!</li></ul>`},

{id:"uo2-fuel", cat:"nang-luong", icon:"☢️", name:"UO₂ nuclear fuel pellet", sub:'"Than" hạt nhân nhỏ bằng ngón tay',
 facts:["Enriched 3-5% U-235","Pellet ≈ 1 ton coal energy","Zircaloy cladding rods","Melting point 2865°C"],
 content:`<p>Viên UO₂ sintering ceramic — một viên đường kính 1 cm tỏa năng lượng tương đương 1 tấn than. Ceramic fluoride salt future molten reactor đang cạnh tranh; accident-tolerant fuels thế hệ mới đang thử nghiệm.</p>
 <h4>Vòng đời</h4><ul><li>Yellowcake → UF₆ enrichment centrifuge → UO₂ powder</li><li>Pellet → rod zircaloy → assembly 264 rods</li><li>Spent fuel pool 5 năm → dry cask 100 năm</li></ul>`},

{id:"heavy-water", cat:"nang-luong", icon:"💧", name:"Nước nặng D₂O", sub:"Isotope material của lò phản ứng",
 facts:["Deuterium oxide","Neutron moderator (không hút neutron)","10.6 g/cm³? No — 1.106 g/mL","WWII Norwegian sabotage famous"],
 content:`<p>D₂O khác H₂O ở hai neutron thêm mỗi phân tử — đông ở 3,8°C, sôi 101,4°C, uống hơi toxic (biolog effect isotope). Cho phép lò phản ứng dùng natural uranium không cần enrichment — lý do WWII Đức & Pháp tranh giành nhà máy Norway.</p>
 <h4>Hiện tại</h4><ul><li>CANDU reactor Canada heavy-water moderated</li><li>NMR solvent deuterated chuẩn lab</li><li>Tritium production for fusion breeding</li></ul>`},

{id:"pica-ablator", cat:"nang-luong", icon:"🚀", name:"PICA heat shield ablative", sub:"Khiên nhiệt 'hy sinh mình' đưa tàu về nhà",
 facts:["Phenolic Impregnated Carbon Ablator","Stardust entry 12.4 km/s record","SpaceX Dragon PICA-X","Pyrolysis gas carry heat away"],
 content:`<p>Ablative shield: phenolic resin decompose endothermic, char layer radiate, pyrolysis gas push boundary layer — 'cháy có kiểm soát' mang nhiệt bay đi. Dragon capsule tái sử dụng PICA-X giảm 90% chi phí so NASA original.</p>
 <h4>Physics</h4><ul><li>Entry plasma 7000°C+ hotter than sun surface</li><li>Char mechanical erosion + sublimation cooling</li><li>Mars Science Laboratory Curiosity landing proof</li></ul>`},

{id:"ml-gold-foil", cat:"nang-luong", icon:"🥇", name:"Multi-layer insulation (MLI)", sub:"'Chăn vàng' cách nhiệt chân không vũ trụ",
 facts:["Aluminized Mylar/Kapton ×25 layers","Vacuum no conduction/convection","Radiative barrier only","James Webb tennis-court sunshield"],
 content:`<p>Vũ trụ không đối lưu — chỉ còn bức xạ. MLI xếp chồng 25 lớp mạ nhôm cách nhau spacer, mỗi lớp reflect ~95% IR: tổng transmission cực tiểu. JWST 5 lớp Kapton coated silicon lớn sân tennis giữ -233°C instrument side.</p>
 <h4>Xuống đất</h4><ul><li>Emergency blanket mylar cứu hộ marathon</li><li>Insulated lunch bag & cooler liner</li><li>Cryogenic tank insulation LNG ships</li></ul>`},

{id:"eink", cat:"thong-minh", icon:"📖", name:"E-Ink electrophoretic display", sub:"Mực điện tử 'giấy thật' không glare",
 facts:["Titanium dioxide charged particles","Bistable — zero power static image","Sunlight readable reflective","Kindle/e-reader standard since 2007"],
 content:`<p>Microcapsule 40µm chứa hạt trắng TiO₂ (dương) & đen carbon (âm) trong dầu — điện trường kéo hạt lên xuống. Bistable nghĩa là trang sách đứng im KHÔNG TỐN ĐIỆN — pin e-reader kéo tuần.</p>
 <h4>Biến thể</h4><ul><li>Color e-ink Kaleido generation mới</li><li>Luggage tag & shelf label retail</li><li>Phone dual-screen YotaPhone history</li><li>E-ink watchface Pebble nostalgia</li></ul>`},

{id:"graphene-aerogel", cat:"nano", icon:"☁️", name:"Graphene aerogel", sub:"Vật liệu rắn nhẹ nhất thế giới đã ghi nhận",
 facts:["0.16 mg/cm³ Zhejiang 2013","99.99% air","Elastic recoverable","Oil absorption ×900 weight"],
 content:`<p>'Aerographene' nhẹ hơn không khí? Gần bằng — chỉ nặng hơn hydrogen balloon shell. Freeze-drying graphene oxide gel tạo sponge đàn hồi hấp thụ dầu gấp 900 lần trọng lượng — cứu oil spill thần kỳ.</p>
 <h4>Triển vọng</h4><ul><li>Phase change heat storage composite battery</li><li>Conductive sponge EMI shielding</li><li>Catalyst support ultra-light electrode</li></ul>`},

{id:"metal-foam", cat:"kim-loai", icon:"🧽", name:"Metal foam (aluminum)", sub:"Kim loại bọt biển — nhẹ & hấp thụ va đập",
 facts:["Density 0.2-1 g/cm³","Crush energy absorption","Sound damping + fireproof","Crash box & heat exchanger"],
 content:`<p>Nhôm/gốm foamed bằng TiH₂ blowing agent hoặc space holder — cấu trúc cell mở/đóng. Crush zone xe hơi hấp thụ động năng như crumple zone nhựa nhưng fireproof metal.</p>
 <h4>Ứng dụng</h4><ul><li>Crash absorber high-speed train front</li><li>Heat exchanger fin surface ×1000</li><li>Acoustic panel studio fireproof</li><li>Bone implant scaffold porous titanium!</li></ul>`},

{id:"geopolymer", cat:"gom", icon:"🧱", name:"Geopolymer", sub:"'Bê tông xanh' không cần clinker CO₂",
 facts:["Fly ash/metakaolin + alkaline activator","80% lower CO₂ than OPC","Acid & fire resistant","Roman concrete modern cousin"],
 content:`<p>Geopolymer polymerize alumino-silicate bằng NaOH/waterglass thay vì calcine limestone — bỏ qua bước phát thải CO₂ lớn nhất của xi măng. Phụ phẩm than đá (fly ash) trở thành nguyên liệu quý.</p>
 <h4>Triển vọng</h4><ul><li>Precast panel & paver thương mại Úc</li><li>Fire tunnel lining chịu 1200°C</li><li>Nuclear waste immobilization matrix</li></ul>`},

/* ---------- Y DƯỢC & IMPLANT ---------- */
{id:"liposome", cat:"y-duoc-vl", icon:"🫧", name:"Liposome", sub:"'Bong bóng lipid' chở thuốc đến đúng nơi",
 facts:["Phospholipid bilayer vesicle","Aqueous core + lipid shell","Doxil Doxil® 1995 first nano-drug","PEG 'stealth'kéo dài half-life"],
 content:`<p>Liposome bắt chước màng tế bào: lớp kép phospholipid ôm lấy thuốc — ưa nước nằm trong lõi, kỵ nước nằm trong lớp màng. PEGylation biến thành 'vô hình' với hệ miễn dịch.</p>
 <h4>Ứng dụng</h4><ul><li>Doxil doxorubicin giảm độc tim ung thư vú</li><li>Amphotericin B liposomal ít độc thận</li><li>mRNA vaccine lipid nanoparticle anh em ruột</li></ul>`},

{id:"hydroxyapatite", cat:"y-duoc-vl", icon:"🦴", name:"Hydroxyapatite (HAp)", sub:"Khoáng xương răng nhân tạo",
 facts:["Ca₁₀(PO₄)₆(OH)₂","60-70% weight of bone","Osseointegration direct bond","Nanocrystal bone regeneration"],
 content:`<p>HAp là khoáng tự nhiên của xương người — implant phủ HAp khiến xương sống <b>bám trực tiếp</b> không cần mô xơ. Nano-HAp trong kem đánh răng tái khoáng men răng (mimic enamel).</p>
 <h4>Ứng dụng</h4><ul><li>Coating implant khớp háng titanium</li><li>Bone graft filler spinal fusion</li><li>Kem đánh răng remineralizing (NHAP Apagard)</li><li>Protein chromatography column</li></ul>`},

{id:"pmma-cement", cat:"y-duoc-vl", icon:"🦴", name:"PMMA bone cement", sub:"'Xi măng xương' của phẫu thuật chỉnh hình",
 facts:["Poly(methyl methacrylate)","Cold curing exothermic ~60°C","Charnley hip 1960","Antibiotic-loaded PMMA beads"],
 content:`<p>Khớp háng nhân tạo Charnley gắn bằng PMMA tự trùng hợp tại chỗ — monomer + powder nhào như bột nhào bánh, đông cứng 15 phút. Trộn kháng sinh gentamicin vào cement chống nhiễm trùng prosthesis.</p>
 <h4>Vấn đề đang giải quyết</h4><ul><li>Exothermic heat necrosis mô — kỹ thuật làm mát</li><li>Methyl methacrylate vapor gây tụt huyết áp mổ</li><li>Cementless press-fit implant thế hệ mới</li></ul>`},

{id:"pyrolytic-carbon", cat:"y-duoc-vl", icon:"🖤", name:"Pyrolytic carbon vanh tim", sub:"Vanh cơ học 'chống máu đóng cục' nhất",
 facts:["Isotropic carbon LTI","Thromboresistance exceptional","Bileaflet valve 300,000 cycles/min","50+ năm durability"],
 content:`<p>Vanh tim cơ học làm từ carbon pyrolytic low-temperature isotropic — bề mặt hấp thu protein nhanh tạo lớp 'giả' mà máu không nhận ra là vật lạ. Vanh đập 40 triệu lần/năm suốt đời không mòn.</p>
 <p>Đánh đổi: bệnh nhân phải uống warfarin suốt đời chống đông (tiếng 'click' nghe rõ mỗi nhịp!).</p>`},

{id:"silicone-hydrogel-lens", cat:"y-duoc-vl", icon:"👁️", name:"Silicone hydrogel lens", sub:"Kính áp tròng 'thở được' qua đêm",
 facts:["Oxygen Dk/t >100","Si-O backbone breathable","Surface treated wettable","Continuous wear 30 ngày"],
 content:`<p>Hydrogel truyền thống mềm nhưng nghẹt oxy → giác mạc phù nề. Silicone hydrogel: nền siloxane dẫn O₂ ×6, xử lý bề mặt hydrophilic để giữ ẩm — kính ngủ qua đêm an toàn hơn nhiều.</p>
 <h4>Chemistry trick</h4><ul><li>Plasma treatment surface wettability</li><li>Internal wetting agents (Aquaform technology)</li><li>UV-blocking monomer copolymerized in</li></ul>`},

{id:"dialyzer-membrane", cat:"y-duoc-vl", icon:"🩸", name:"Màng lọc dialysis", sub:"'Thận nhân tạo' polysulfone lọc máu",
 facts:["Polysulfone hollow fiber ~1M fibers","MW cutoff ~10-15 kDa","Urea/creatinine out · protein cells stay","4 hours × 3 lần/tuần cứu sống"],
 content:`<p>Máy chạy thận lọc máu qua bó 10.000 sợi rỗng polysulfone — diffusion + ultrafiltration tách urea, kali, phosphate dư thừa. Bán thấm chọn lọc theo kích thước phân tử là cả nghệ thuật vật liệu.</p>
 <h4>Tiến hóa</h4><ul><li>Cuprophan cellulose cũ → bioincompatible complement activation</li><li>Polysulfone/PES high-flux hiện đại chuẩn</li><li>Wearable artificial kidney đang prototype</li></ul>`},

{id:"drug-eluting-stent", cat:"y-duoc-vl", icon:"❤️", name:"Drug-eluting stent (DES)", sub:"Ống stent 'phóng thích thuốc' chống hẹp lại",
 facts:["Metal scaffold + polymer + sirolimus/paclitaxel","Restenosis 30%→<5%","BVS biodegradable scaffold generation mới","Nobel-ish interventional cardiology"],
 content:`<p>Stent kim loại mở động mạch vành nhưng cơ thể 'sẹo hóa' bao quanh → hẹp lại 30%. DES phủ polymer phóng thích antiproliferative drug chậm trong 90 ngày — restenosis xuống dưới 5%.</p>
 <h4>Thế hệ mới</h4><ul><li>Bioresorbable scaffold tan hết sau 2 năm</li><li>Polymer-free coating technology</li><li>DCB drug-coated balloon no implant</li></ul>`},

{id:"pga-suture", cat:"y-duoc-vl", icon:"🪡", name:"Suture tự tiêu PGA/PLLA", sub:"Chỉ khâu 'biến mất' trong cơ thể",
 facts:["Polyglycolic acid 1970 first synthetic absorbable","Hydrolysis ester bond","Tensile 60% at 3 weeks gone by 90 days","No removal visit needed"],
 content:`<p>Chỉ PGA/vicryl thủy phân ester bond thành glycolide tự nhiên metabolize CO₂ + H₂O — vết mổ trong miệng, nội soi không cần quay lại rút chỉ. Tốc độ mất lực kéo engineered theo tốc độ lành thương.</p>
 <h4>Họ hàng</h4><ul><li>PLLA chậm hơn cho ligament augmentation</li><li>PDO mono filamentmềm mại</li><li>Barbed suture self-anchoring no knot!</li></ul>`},

{id:"alum-adjuvant", cat:"y-duoc-vl", icon:"💉", name:"Alum adjuvant (Al(OH)₃)", sub:"Phụ gia 'đánh thức' miễn dịch của vaccine",
 facts:["Aluminum hydroxide/phosphate gel 1926","Adsorb antigen slow release","Innate immunity alarm (NLRP3)","~100 năm vẫn chưa hiểu hết cơ chế!"],
 content:`<p>Glaser 1926 thấy ngựa tiêm diphtheria + alum phản ứng mạnh hơn — phụ gia rẻ tiền này trở thành adjuvant phổ cập nhất mọi thời đại. Antigen bám gel giải phóng chậm + DAMP signal kích hoạt innate immunity.</p>
 <h4>Nhà máy khác</h4><ul><li>MF59 squalene oil-in-water flu</li><li>AS01 MPL + QS-21 shingles/malaria</li><li>CpG 1018 toll-like receptor 9 COVID Covishield? No — Novavax</li></ul>`},

{id:"dental-composite", cat:"y-duoc-vl", icon:"🦷", name:"Composite trám răng Bis-GMA", sub:'"Trám thẩm mỹ" ánh sáng đông cứng',
 facts:["Bis-GMA resin + silica filler 70%","Camphorquinone photoinitiator 468nm blue light","Bond via acid etching micromechanical","Mercury amalgam replacement"],
 content:`<p>Trám răng hiện đại: resin paste đặt vào lỗ sâu, chiếu đèn xanh lam kích hoạt camphorquinone radical polymerization — đông cứng 20 giây đúng chỗ, màu giống men thật. Acid etch tạo micro-pores bám cơ học.</p>
 <h4>Khoa học thú vị</h4><ul><li>Shrinkage polymerization 2-3% — kỹ thuật incremental layering chống vi khe</li><li>Filler size nano hybrid polish retention</li><li>Amalgam mercury phase-out WHO</li></ul>`},

{id:"transdermal-patch", cat:"y-duoc-vl", icon:"🩹", name:"Miện dán qua da transdermal", sub:"Thuốc xuyên da từ từ 24 giờ",
 facts:["Fick diffusion through stratum corneum","Nicotine/fentanyl/scopolamine patches","Rate-controlled membrane matrix","Avoid first-pass GI metabolism"],
 content:`<p>Miện dán là 'bơm thuốc không kim': reservoir thuốc khuếch tán qua màng điều khiển tốc độ, xuyên lớp sừng hóa da vào tuần hoàn — bỏ qua first-pass gan, nồng độ phẳng không spike.</p>
 <h4>Enhancement tricks</h4><ul><li>Ethanol/oleic acid permeation enhancers</li><li>Iontophoresis điện trường đẩy ion drug</li><li>Microneedle dissolving array vaccine painless!</li></ul>`},

{id:"ptfe-graft", cat:"y-duoc-vl", icon:"🧵", name:"PTFE vascular graft (Gore-Tex)", sub:"'Mạch máu nhân tạo' ePTFE vi xốp",
 facts:["Expanded PTFE node-fibril structure","Microporous 30 µm internodal","Bypass leg/heart dialysis access","Neointimal ingrowth healing"],
 content:`<p>Gore-Tex y tế là PTFE kéo giãn tạo vi lỗ khí — máu không đông trong lòng ống nhưng mô xung quanh mọc xuyên neo giữ. Cánh tay chạy thận 'fistula' nhân tạo & bypass chân dùng nhiều nhất.</p>
 <h4>Biên giới</h4><ul><li>Heparin-bonded surface chống thrombosis</li><li>Tissue-engineered vascular graft cell-seeded</li><li>4-branch arch graft aortic dissection surgery</li></ul>`},

{id:"glass-ionomer", cat:"y-duoc-vl", icon:"🦷", name:"Glass ionomer cement", sub:"Trám răng 'thả fluor' bảo vệ lâu dài",
 facts:["Fluoro-aluminosilicate glass + polyacid","Chemical bond to dentin","Sustained fluoride release years","Pediatric ART minimal intervention"],
 content:`<p>GIC đông cứng bằng phản ứng acid-base (không cần đèn): polyacrylic acid chelate Ca²⁺ dentin bám hóa học thật. Fluoride thoát ra từ từ tái khoáng men quanh viền trám — 'vaccine của trám răng'.</p>
 <h4>Vị trí</h4><ul><li>Trám răng sữa trẻ em không cần máy khoan ART</li><li>Lining base dưới composite sâu</li><li>Cement crowns orthodontic bands</li></ul>`},

{id:"dental-amalgam", cat:"y-duoc-vl", icon:"⚗️", name:"Amalgam bạc", sub:"150 năm tranh cãi thủy ngân trong răng",
 facts:["Ag₃Sn powder + Hg liquid → γ phase set","Trituration alloying reaction","Mercury vapor debate WHO","Phase-out Minamata Convention"],
 content:`<p>Amalgam là hợp kim hình thành TRỰC TIẾP trong miệng: hạt Ag-Sn trộn thủy ngân tạo phase γ Ag₂Hg₃ cứng bền 15+ năm. Mercury elemental bound trong alloy — nhưng WHO vẫn hướng dẫn giảm dần thay bằng composite.</p>
 <h4>Khoa học thú vị</h4><ul><li>Trituration 8 giây quyết định microstructure strength</li><li>Corrosion products actually seal margins!</li><li>Scandinavia banned 2008 — dental history turning point</li></ul>`},

{id:"collagen-sponge", cat:"y-duoc-vl", icon:"🧽", name:"Collagen sponge / Gelfoam", sub:"'Bọt biển' cầm máu sinh học",
 facts:["Bovine/porcine collagen scaffold","Platelet adhesion hemostasis","Absorbed in 4-6 weeks","Dental extraction socket standard"],
 content:`<p>Sponge collagen cung cấp khung cho tiểu cầu bám & activate cascade đông máu tại chỗ — cầm máu răng nhổ/bướu máu mổ không cần đốt điện. Tự phân hủy hoàn toàn trong vài tuần.</p>
 <h4>Họ hàng sinh học</h4><ul><li>Fibrin glue tissue sealant hai xi phông</li><li>Oxidized regenerated cellulose Surgicel</li><li>Chitosan hemostat military combat gauze</li></ul>`},

/* ===== ĐỢT +100 VẬT LIỆU ===== */
{id:"black-phosphorus", cat:"nano", icon:"⬛", name:"Black phosphorus", sub:"Phosphorene 2D bán dẫn anisotropy",
 facts:["Layered P semiconductor","Thickness-tunable bandgap 0.3-2 eV","Anisotropic transport","Degradation challenge encapsulation"],
 content:`<p>Phosphorene là graphene 'đen': bandgap mở được giữa graphene (0) và MoS₂ (1.9 eV) — transistor on/off lý tưởng; tính hướng cho polarized photodetector. Dễ oxy hóa cần lớp phủ AlO₃ bảo vệ.</p>`},
{id:"silicene-family", cat:"nano", icon:"🪜", name:"Silicene/Stanene", sub:'Anh em buckled của Si/Sn',
 facts:["Buckled honeycomb Si/Sn","Dirac cone predicted","Substrate-sensitive growth","Topological insulator stanene claim"],
 content:`<p>Silicene & stanene 'gấp nếp' thay vì phẳng — tương tác substrate mạnh khiến nhiều dự đoán chưa xác nhận ngoài epitaxial layer. Cuộc đua tìm substrate trung tính vẫn tiếp diễn.</p>`},
{id:"graphyne", cat:"nano", icon:"🕸️", name:"Graphyne / graphdiyne", sub:"Carbon 2D có bond acetylene",
 facts:["sp + sp² hybrid network","γ-graphyne semiconducting","Synthesized 2010 Li group","Directional charge transport"],
 content:`<p>Thay một phần bond C-C bằng acetylene (-C≡C-) tạo mạng carbon mới với porosity điều khiển được — 'graphene có lỗ' cho sieving & electronics phân biệt hướng.</p>`},
{id:"carbon-qd-waste", cat:"nano", icon:"♻️", name:"Carbon dots từ rác", sub:"Quantum dot xanh từ vỏ cam, tro xương",
 facts:["Hydrothermal biomass waste","Low-toxicity bioimaging","Down/up conversion luminescence","Fertilizer tracer applications"],
 content:`<p>Carbon quantum dot tổng hợp từ vỏ trái cây, giấy vụn — fluorescent probe giá rẻ ít độc thay Cd-based QD trong bioimaging & anti-counterfeit mực in.</p>`},
{id:"nanodiamond", cat:"nano", icon:"💠", name:"Nanodiamond detonation", sub:"Kim cương nano từ... thuốc nổ",
 facts:["4-5 nm from TNT detonation soot","Polishing/slurry drug carrier seed","NV center quantum cousin","Fluorescent bio-label non-blinking"],
 content:`<p>Trong vụ nổ TNT, carbon kịp kết tinh thành hạt kim cương nano. Nay dùng đánh bóng wafer, chở thuốc, và làm marker huỳnh quang ổn định trong tế bào.</p>`},
{id:"gold-nanorod", cat:"nano", icon:"🟡", name:"Gold nanorod plasmonic", sub:"Rod vàng đốt tế bào ung thư bằng NIR",
 facts:["Localized surface plasmon resonance","Tunable λ by aspect ratio","Photothermal therapy 808 nm","CT imaging contrast companion"],
 content:`<p>Nanorod vàng cộng hưởng plasma hồng ngoại gần — chiếu laser NIR làm nóng rod gắn khối u tiêu diệt chọn lọc ('photothermal ablation') mà mô lành gần như không hấp thu.</p>`},
{id:"fe3o4-nano", cat:"nano", icon:"🧲", name:"Iron oxide nanoparticle", sub:"Nano sắt từ: MRI & hyperthermia",
 facts:["Fe₃O₄/γ-Fe₂O₃ superparamagnetic","MRI T2 negative contrast","AC magnetic field heating tumor","Magnetoferritin biomimetic synthesis"],
 content:`<p>Hạt sắt từ siêu thuận (không dính nhau khi tắt trường): vừa là thuốc tương phản MRI âm, vừa 'nấu' khối u khi đặt trong từ trường xoay chiều — hyperthermia magnetic đã vào trial lâm sàng.</p>`},
{id:"upconversion-np", cat:"nano", icon:"🔆", name:"Upconversion nanoparticle", sub:'"Gộp" 2 photon hồng ngoại thành ánh sáng nhìn thấy',
 facts:["NaYF₄:Yb,Er host-dopant","Anti-Stokes emission","Deep tissue imaging NIR-II","Anti-counterfeit ink security"],
 content:`<p>Tinh thể fluoride pha Yb/Er hấp thụ 2 photon NIR yếu phát ra photon visible mạnh — xuyên sâu mô không autofluorescence, đồng thời là mực chống giả đổi màu laser.</p>`},
{id:"msn", cat:"nano", icon:"🍯", name:"Mesoporous silica MSN", sub:"'Bể chứa nano' lỗ rỗng có nắp cửa",
 facts:["MCM-41/SBA-15 ordered pores 2-10 nm","Surface area >1000 m²/g","Gatekeeper stimuli-responsive caps","Oral insulin research carrier"],
 content:`<p>MSN có hệ thống lỗ rỗng đều như tổ ong — nạp thuốc rồi bịt cổng bằng cap mở khi gặp pH/enzyme/light tại vị trí bệnh. Ordered mesoporosity nhờ surfactant template CTAB.</p>`},
{id:"halloysite", cat:"nano", icon:"🏺", name:"Halloysite nanotube", sub:"Ống đất sét tự nhiên chở thuốc/sơn",
 facts:["Natural aluminosilicate tubular clay","Lumen loading pesticides/self-healing agents","Cheap abundant mining New Zealand","Slow release agrochemical carrier"],
 content:`<p>Đất sét hiếm hoi hình ống nano sẵn có trong tự nhiên — nhồi hoạt chất vào lòng ống cho giải phóng chậm trong nông nghiệp, sơn tự phục hồi, polymer reinforcement giá rẻ.</p>`},
{id:"pcbm", cat:"nano", icon:"🔌", name:"PCBM fullerene acceptor", sub:"C₆₀ derivative của solar hữu cơ thế hệ đầu",
 facts:["[6,6]-phenyl-C61-butyric acid methyl ester","Electron acceptor OPV classic","Ballistic transport ball shape","Replaced by Y6 NFAs modern era"],
 content:`<p>PCBM là 'chân hút electron' kinh điển ghép với polymer donor P3HT — cặp bài trùng OPV 1995-2015 trước khi non-fullerene acceptor vượt hiệu suất.</p>`},
{id:"black-silicon", cat:"nano", icon:"🌑", name:"Black silicon", sub:"Si nano-textured 'ăn sạch' ánh sáng",
 facts:["Etched needle-like surface AR","Absorption >90% broad spectrum","ICP-RIE or MACE fabrication","Sensors & photodiode low-light"],
 content:`<p>Gờ nano trên bề mặt silic bắt photon phản xạ nhiều lần — mặt pin 'đen tuyền' giảm reflectance dưới 1%, cải thiện dòng ngắn mạch cell thương mại.</p>`},
{id:"aerographite", cat:"nano", icon:"🌫️", name:"Aerographite", sub:"Graphite aerogel đen nhẹ nhất từng đo",
 facts:["0.18 mg/cm³ Kiel 2012","Conducts electricity elastic compressible","ZnO template CVD growth","Electrode & EMI shielding ultra-light"],
 content:`<p>Mạng ống carbon oxit kẽm template — vật liệu cơ khí nhẹ nhất từng báo cáo lúc ra đời, đàn hồi nén-thả về hình gốc, dẫn điện tốt bất thường cho vật liệu xốp.</p>`},
{id:"porous-si", cat:"nano", icon:"🕳️", name:"Porous silicon", sub:"Si 'phát sáng' cho biosensor & drug delivery",
 facts:["HF etch p-Si photonic porous","Visible PL quantum confined","Biodegradable resorbable implant","Brugsch-Drew? Lehmann discovery 1950s revival 1990"],
 content:`<p>Khiếm khuyết nano trong silic tạo phát sáng khả kiến — dùng làm chip biosensor label-free và mảnh tải thuốc tan hết trong cơ thể (resorbable optics).</p>`},

{id:"na-ion", cat:"nang-luong", icon:"🧂", name:"Pin sodium-ion thương mại", sub:"CATL 2023 — lithium 'giá rẻ' hóa thực tế",
 facts:["Na hard-carbon anode · Prussian/oxide cathode","Energy ~160 Wh/kg rising","-20°C vận hành tốt","Abundant Na thay scarce Li/Co"],
 content:`<p>Pin Na-ion dùng nguyên liệu dồi dào mọi đại dương — xe điện mini EV & storage grid Trung Quốc đã chạy. Chemistry giống Li-ion nhưng ion lớn hơn cần electrode redesign thông minh.</p>`},
{id:"vrfb", cat:"nang-luong", icon:"🔋", name:"Vanadium redox flow battery", sub:"Pin chảy 'bình riêng' lưu điện hàng giờ",
 facts:["V²⁺/V³⁺ | V⁴⁺/V⁵⁺ electrolyte tanks","Power ↔ energy decoupled scaling","20,000 cycles no degradation","Grid long-duration storage 4-12h"],
 content:`<p>Flow battery tách 'năng lượng' (thùng dung dịch vanadium) khỏi 'công suất' (stack) — muốn thêm giờ chỉ cần đổ thêm bình. Vanadium cả hai bên nên không cross-contamination fade.</p>`},
{id:"li-sulfur", cat:"nang-luong", icon:"☁️", name:"Pin lithium–sulfur", sub:'Giấc mơ hàng không: 600 Wh/kg',
 facts:["Sulfur cathode cheap abundant","Theoretical 2600 Wh/kg","Polysulfide shuttle problem","Lyten/Li-S Energy aviation pilots"],
 content:`<p>Lưu huỳnh rẻ bèo thay NMC kim loại hiếm — nhưng polysulfide 'trốn' qua electrolyte gây chai. Nano-host carbon + separator coating đang khóa shuttle để bay cao hơn pin Li-ion.</p>`},
{id:"si-anode", cat:"nang-luong", icon:"📈", name:"Anode silicon EV", sub:"Si phồng ×4 — bài toán đã giải một nửa",
 facts:["Specific capacity 4200 vs graphite 372 mAh/g","Volume expansion ~300% cycle","SiOx blend commercial Tesla/Porsche","Nano-porous & binder engineering"],
 content:`<p>Thay graphite bằng silicon tăng mật độ năng lượng pin ~30%, nhưng Si nở toái sau vài chu kỳ. Giải pháp: SiOx oxide blend, particle nano rỗng, binder polymer đàn hồi — đã lên xe sản xuất.</p>`},
{id:"sofc", cat:"nang-luong", icon:"🏭", name:"SOFC nhiên liệu rắn oxide", sub:"Fuel cell gốm 700°C hiệu suất 60%+",
 facts:["YSZ electrolyte oxygen conductor","CH₄/H₂/NH₃ fuel flexible","Combined heat power datacenter","Bloom Energy server commercial"],
 content:`<p>Solid oxide fuel cell chạy ở nhiệt cao — không cần Pt quý, ăn luôn methane tự nhiên, nhiệt thải tận dụng triệt để (CHP >85%) cho datacenter & tàu biển hybrid.</p>`},
{id:"molten-salt-csp", cat:"nang-luong", icon:"🌞", name:"Molten salt CSP tower", sub:"'Pin muối nóng' mặt trời sau hoàng hôn",
 facts:["Nitrate salt 290→565°C two-tank","Steam turbine overnight dispatch","Ivanpah/Noor/Crescent Dunes","Thermal storage cheaper than batteries per kWh"],
 content:`<p>Hàng nghìn mirror tập trung ánh sáng nung muối nitrat 565°C — muối nóng tích trong bể cách nhiệt, đêm vẫn quay turbine phát điện 8-10 giờ. Solar không còn 'đêm tắt'.</p>`},
{id:"green-h2-pem", cat:"nang-luong", icon:"💧", name:"PEM electrolyzer hydrogen xanh", sub:"Điện tái tạo → H₂ sạch (bài toán iridium)",
 facts:["PEM stack Ir/Pt catalyst","~55 kWh/kg H₂ efficiency","Iridium scarcity bottleneck","AML/X38 iridium-free research race"],
 content:`<p>Electrolyser màng PEM chuyển điện gió/mặt trời thành hydrogen — nút thắt là iridium cực hiếm ở anode OER. Các công ty đang thử Fe-N-C & oxide hỗn hợp thay iridium.</p>`},
{id:"fusion-wall-w", cat:"nang-luong", icon:"🔥", name:"Tungsten divertor fusion", sub:"Wolfram chịu 10 MW/m² plasma tokamak",
 facts:["Highest melting metal 3422°C","ITER first wall divertor target","Recrystallization embrittlement issue","Monoblock W-Cu joint technology"],
 content:`<p>Mặt trời thu nhỏ nung thành lò tới hàng chục MW/m² — chỉ wolfram sống sót. Monoblock wolfram hàn với copper heat sink là linh kiện đắt nhất ITER từng miếng.</p>`},
{id:"diamond-beta-battery", cat:"nang-luong", icon:"☢️", name:"Diamond beta-voltaic battery", sub:"'Pin kim cương' từ chất thải hạt nhân",
 facts:["¹⁴C diamond p-n junction betavoltaic","Decades micro-watt continuous output","Pacemaker/sensor space niche","Arkenlight UK spin-out"],
 content:`<p>Kim cương nhân tạo chứa carbon-14 (từ thanh graphite lò phản ứng cũ) phát beta nuôi junction — pin 'hết hạn' theo chu kỳ C-14 5.730 năm, không sạc không thay.</p>`},

{id:"peek-implant", cat:"polymer", icon:"🦴", name:"PEEK implant-grade", sub:"Polymer 'giả xương' của spinal surgery",
 facts:["Polyetheretherketone 143°C Tg","Elastic modulus near cortical bone","Radiolucent imaging friendly","CFR-PEEK load bearing grade"],
 content:`<p>PEEK cứng vừa đủ giống xương — tránh stress-shielding của titan cứng quá. Spinal cage & skull implant CFR-PEEK (pha sợi carbon) là chuẩn ngành hiện nay.</p>`},
{id:"kapton-polyimide", cat:"polymer", icon:"🟨", name:"Kapton polyimide film", sub:'Film vàng "không chết" của vũ trụ',
 facts:["−269 đến +400°C stable dielectric","James Webb 5-layer sunshield base","Flexible PCB spacecraft wiring","DuPont 1960s aerospace heritage"],
 content:`<p>Polyimide thơm giữ tính cơ khí từ heli lỏng đến lửa — JWST dùng màng Kapton phủ silicon dày 25 µm làm khiên tennis-court che nắng cho kính thiên văn lạnh rung.</p>`},
{id:"pvdf-film", cat:"polymer", icon:"🎸", name:"PVDF piezoelectric film", sub:"Plastic cảm biến áp lực guitar pickup",
 facts:["β-phase piezo coefficient","Flexible thin-film transducer","Hydrophone sonar lightweight","Battery binder dual-use Li-ion"],
 content:`<p>PVDF kéo dãn định hướng β-phase biến áp lực thành tín hiệu điện — pickup acoustic guitar, hydrophone tàu ngầm, và 70% anode binder pin lithium hiện nay!</p>`},
{id:"eva-foam", cat:"polymer", icon:"👟", name:"EVA foam midsole", sub:"Bọt EVA của mọi đôi running shoe",
 facts:["Ethylene-vinyl acetate crosslinked foam","Compression set recovery metric","Solar encapsulant UV shield dual","Nitrogen-infused superfoam evolution"],
 content:`<p>EVA foamed azodicarbonamide blowing agent — midsole giày chạy 40 năm chuẩn. Nike ZoomX/Vaporfly là EVA-PEBA hybrid pushing energy return >80%.</p>`},
{id:"sbs-elastomer", cat:"polymer", icon:"🦶", name:"SBS styrenic block copolymer", sub:"Cao su 'tan được' đế giày & đường nhựa",
 facts:["Hard PS domains physical crosslink","Soluble re-moldable thermoplastic","Shoe soles roofing bitumen modifier","Living anionic polymerization heritage"],
 content:`<p>SBS có domain polystyrene cứng nối chuỗi polybutadiene mềm — crosslink vật lý tan khi nung: đúc lại được như nhựa, đàn hồi như cao su. Bitumen đường trộn SBS không nứt mùa đông.</p>`},
{id:"nylon12-3dp", cat:"polymer", icon:"🖨️", name:"Nylon-12 SLS printing", sub:"Powder nylon của máy in 3D công nghiệp",
 facts:["Selective laser sintering powder bed","No support structure needed","Hinges living functional print","Prosthetics & drone frames production"],
 content:`<p>In 3D SLS rắc bột nylon-12, laser nung thiêu kết từng lớp — chi tiết lồng nhau, bản lề sống in liền khối; prosthetics & phụ kiện drone sản xuất thật hàng nghìn chiếc.</p>`},
{id:"tpu-case", cat:"polymer", icon:"📱", name:"TPU elastomer", sub:"Nhựa dẻo case điện thoại & dây giày",
 facts:["Soft-hard segment urethane blocks","Shore A hardness tunable 60A-75D","Abrasion oil resistant","Filament flexible 3D printing favorite"],
 content:`<p>TPU = 'cao su in được': block cứng urethane + block mềm polyether — case phone chống shock, dây giày, ống y tế, filament 3D flexible mọi nơi.</p>`},
{id:"vectran-mars", cat:"polymer", icon:"🛬", name:"Vectran LCP Mars airbag", sub:"Sợi tinh thể lỏng hạ cánh Sao Hỏa",
 facts:["Liquid crystal polyester aromatic","High strength low creep","Mars Pathfinder airbag tether","Bowstring violin & sailcloth too"],
 content:`<p>Vectran bền giữ form tuyệt đối không giãn (low creep) — NASA chọn làm dây neo airbag bounce-down Sao Hỏa 1997; cũng là dây đàn violin cao cấp & dây cầu đi bộ.</p>`},
{id:"pan-precursor", cat:"polymer", icon:"➰", name:"PAN precursor carbon fiber", sub:"Polyacrylonitrile 'cha' của sợi carbon",
 facts:["Acrylonitrile polymer spun fiber","Stabilize 250°C oxidize → carbonize 1500°C","90% carbon yield route","Textile acrylic sweater same polymer different draw"],
 content:`<p>Sợi carbon bắt đầu từ... len acrylic! PAN kéo mảnh, oxy hóa vàng-đen, nung than hóa thành carbon fiber — quy trình 3 nhiệt độ quyết định độ bền tỷ USD ngành composite.</p>`},
{id:"cellulose-acetate-filter", cat:"polymer", icon:"🚬", name:"Cellulose acetate filter", sub:"'Bông lọc' thuốc lá — vi nhựa legacy",
 facts:["Acetylated cellulose tow","Photodegrade decades not months","Microplastic litter #1 ocean beach count","Bio-based alternative research wave"],
 content:`<p>Bông lọc thuốc lá là cellulose acetate — 'plastic đầu tiên' từ gỗ nhưng phân hủy chậm kinh khủng: đầu mẩu thuốc lá là rác nhiều nhất bãi biển toàn cầu 30 năm liền.</p>`},

{id:"brass-dezincification", cat:"kim-loai", icon:"🎺", name:"Brass & dezincification", sub:"Đồng thau 'mất kẽm' đường nước nóng",
 facts:["Cu-Zn alloy plumbing history","Dezincification plug corrosion mode","Arsenic-inhibited DZR brass fix","Cartridge brass 70/30 workhorse"],
 content:`<p>Brass kẽm giàu bị nước nóng 'rút kẽm' để lại đồng xốp vỡ — thêm trace As hoặc Sn tạo DZR brass sống sót ngành nước. Trumpet/bell brass acoustic alloy art.</p>`},
{id:"phosphor-bronze", cat:"kim-loai", icon:"🎵", name:"Phosphor bronze spring", sub:"Đồng thanh phosphor của dây đàn & relay",
 facts:["Cu-Sn + 0.1-0.35% P deoxidizer","Fatigue resistance spring contacts","Dây đàn guitar acoustic tone","Marine hardware seaworthy"],
 content:`<p>Thêm chút phosphor vào bronze tăng đàn hồi & kháng mỏi — contact spring điện tử, bushing chịu mài, dây guitar tone ấm; đứng vững nước biển tàu thuyền.</p>`},
{id:"duralumin-1910", cat:"kim-loai", icon:"✈️", name:"Duralumin age-hardening", sub:"Hợp kim Al-Cu khai sinh hàng không",
 facts:["Al-4Cu-Mg age hardening 1906 Wilm","Zeppelin frames & Junkers first all-metal","Precipitation strengthening science born","2024-T3 riveted aircraft skin legacy"],
 content:`<p>Alfred Wilm để quên hợp kim trên kệ cuối tuần — đo lại thì cứng lên gấp đôi! Age-hardening precipitation Al₂Cu mở kỷ nguyên máy bay kim loại toàn phần thập niên 1920.</p>`},
{id:"mg-alloy-chassis", cat:"kim-loai", icon:"🪶", name:"Magnesium alloy chassis", sub:"Kim loại cấu trúc nhẹ nhất laptop/camera",
 facts:["Density 1.74 lightest structural metal","Thixomolding semi-solid net shape","Flammability machining caution AZ91","Automotive steering wheel armrest frames"],
 content:`<p>Magnesium nhẹ hơn nhôm 33% — vỏ laptop premium & khung vô lăng ô tô; gia công cần cẩn thận vì bụi Mg dễ cháy (Class D extinguisher only!).</p>`},
{id:"be-cu-tools", cat:"kim-loai", icon:"🛠️", name:"Beryllium copper tools", sub:"Dụng cụ 'không tia lửa' dầu khí & X-ray window",
 facts:["Cu-2Be strength of steels","Non-sparking explosive atmosphere safe","X-ray transparent windows Be foil","Toxic fumes welding strict controls"],
 content:`<p>Be-Cu cứng như thép mà va đập không tia lửa — dụng cụ bắt buộc khu vực nổ; Be foil mỏng cửa sổ ống X-ray. Bụi Be gây bệnh phổi mãn — xử lý cực nghiêm ngặt.</p>`},
{id:"ta-capacitor", cat:"kim-loai", icon:"🔩", name:"Tantalum capacitor", sub:"Tụ tantalum bé xíu trong mọi điện thoại",
 facts:["Ta₂O₅ dielectric high-k volumetric efficiency","Solid MnO₂/polymer cathode no dry-out","Tantalum conflict mineral ethics supply chain","Failure short-mode derating design rule"],
 content:`<p>Tụ tantalum lưu điện lượng lớn nhất mỗi cm³ — smartphone chứa hàng chục viên nhỏ li ti. Khoáng coltan Congo đưa vấn đề đạo đức chuỗi cung ứng vào bảng dữ liệu thiết kế.</p>`},
{id:"nb-rf-cavity", cat:"kim-loai", icon:"🌀", name:"Niobium RF cavity", sub:"Buồng siêu dẫn Nb đẩy hạt trong collider",
 facts:["RRR niobium pure >300 residual resistivity","TESLA shape cavity 1.3 GHz 2K helium","LHC/Fermilab/SHINE accelerator heart","Sputtered Nb-on-Cu alternative LHC-He"],
 content:`<p>Buồng cộng hưởng niobium siêu dẫn ở 2K mất năng lượng cực nhỏ — chuỗi hàng trăm cavity đẩy proton/electron gần tốc độ ánh sáng trong mọi collider & FEL laser-X thế giới.</p>`},
{id:"hf-control-rod", cat:"kim-loai", icon:"🚢", name:"Hafnium control rods", sub:"Hf 'nuốt neutron' tàu ngầm hạt nhân",
 facts:["Hf thermal neutron capture σ≈104 barn","Corrosion-free hot water no cladding needed","Byproduct of zirconium refining pair","Naval reactor compact design enabler"],
 content:`<p>Zirconium & hafnium là 'anh em song sinh' hóa học — nhưng Zr trong suốt neutron còn Hf nuốt gọn. Phân tách hai anh em (muốn Zr phải bỏ Hf) quyết định cả ngành reactor.</p>`},
{id:"ga-liquid-metal", cat:"kim-loai", icon:"🌡️", name:"Gallium liquid metal cooling", sub:"Kim loại lỏng an toàn tản nhiệt PC/linh kiện",
 facts:["Ga melts 29.8°C non-toxic mercury-free","Thermal conductivity ~40 W/m·K ×65 water","Galinstan In-Ga-Sn alloy commercial","Soft robot circuits self-healing wires"],
 content:`<p>Gallium tan 30°C — alloy Galinstan thay thủy ngân độc trong thermometer; nay là coolant CPU overclock & 'mạch lỏng' robot mềm tự lành khi đứt.</p>`},
{id:"cdte-thinfilm", cat:"kim-loai", icon:"🔲", name:"CdTe thin-film solar", sub:"Pin màng mỏng telluride cạnh tranh silicon",
 facts:["First Solar module cost leader era","Direct bandgap 1.5 eV ideal","Glass-glass laminate utility farms","Te scarcity & recycling program closed-loop"],
 content:`<p>CdTe màng mỏng vài µm thay silicon 200 µm — First Solar từng là hãng PV rẻ nhất thế giới. Tellurium稀缺 giới thiệu quy mô; chương trình thu hồi module đóng vòng kín.</p>`},

{id:"cordierite-honeycomb", cat:"gom", icon:"🍯", name:"Cordierite honeycomb substrate", sub:"Tổ ong gốm của mọi catalytic converter",
 facts:["Mg₂Al₄Si₅O₁₈ low CTE thermal shock king","Extruded 600 cpsi wall 0.1mm","Washcoat alumina + Pt/Pd/Rh loaded","Gasoline exhaust 900°C survival"],
 content:`<p>Gốm cordierite nở nhiệt gần bằng 0 — chênh lệch nhiệt đột ngột khói xe không nứt. Tổ ong mỏng tường tối đa diện tích xúc tác, giảm khí thải 98% kể từ 1975.</p>`},
{id:"aln-substrate", cat:"gom", icon:"📡", name:"Aluminum nitride substrate", sub:"Gốm dẫn nhiệt ×8 alumina cho LED/radio",
 facts:["AlN 170-200 W/m·K insulating substrate","CTE matched Si chip bonding","RF power amp & laser diode carriers","Carbothermal reduction synthesis route"],
 content:`<p>AlN vừa cách điện vừa dẫn nhiệt như nhôm — nền gốm cho chip RF 5G & laser diode tỏa nhiệt nhanh không short circuit. Gốm 'tản nhiệt' đắt nhất thương mại phổ cập.</p>`},
{id:"hbn-white-graphite", cat:"gom", icon:"⬜", name:"Hexagonal boron nitride", sub:'"Graphite trắng" bôi trơn & 2D substrate',
 facts:["h-BN layered lubricant white","Dielectric constant ~4 flat substrate","c-BN cubic hardness second diamond","Cosmetic loose powder shimmer additive"],
 content:`<p>h-BN tầng van der Waals như graphite nhưng cách điện — 'thảm' hoàn hảo đặt graphene/MoS₂ 2D lên trên giữ mobility nguyên bản; c-BN mài thay kim cương thép ferrous.</p>`},
{id:"sapphire-substrate", cat:"gom", icon:"💎", name:"Sapphire wafer LED substrate", sub:"Corundum đơn tinh thể nền của mọi đèn LED",
 facts:["α-Al₂O₃ single crystal C-axis wafer","Blue GaN epilayer lattice match","Watch glass scratch-proof luxury","Chemical vapor growth Kyropoulos boule"],
 content:`<p>Mọi đèn LED trắng đều bắt đầu từ phiến sapphire trong suốt — corundum cứng thứ 3 hành tinh chịu 2000°C epitaxy; đồng hồ sang trọng dùng làm kính không xước.</p>`},
{id:"opal-photonic", cat:"gom", icon:"🌈", name:"Opal photonic crystal", sub:"Cầu vồng trong đá opal — diffraction silica spheres",
 facts:["Amorphous hydrated SiO₂ sphere arrays","Play-of-color Bragg diffraction order","Synthetic opal photonic paper security","Water content crack sensitivity care"],
 content:`<p>Opal không có màu sắc thật — những quả cầu silica đều nhau nhiễu xạ ánh sáng theo góc nhìn. Nature invented photonic crystal; security paper & paint học theo.</p>`},
{id:"jade-mineralogy", cat:"gom", icon:"🪢", name:"Jade nephrite/jadeite", sub:"Ngọc bích — gốm 'không vỡ' văn minh Á Đông",
 facts:["Nephrite Ca₂(Mg,Fe)₅Si₈O₂₂(OH)₂ felted amphibole","Jadeite NaAlSi₂O₆ pyroxene interlocked grain","Toughness exceeds steel impact","Neolithic axe heads pre-metal tools jade!"],
 content:`<p>Ngọc bích 'mềm' nhưng dai hơn thép do cấu trúc sợi đan xen — thời đồ đá con người đã biết chặt cây bằng rìu ngọc trước khi luyện kim tồn tại.</p>`},
{id:"flint-knapping", cat:"gom", icon:"🗿", name:"Flint & obsidian knapping", sub:"Kỹ thuật đá Age of Silicon... literal",
 facts:["Conchoidal fracture predictable flakes","SiO₂ amorphous cryptocrystalline hardness 7","Stone Age cutting edge nanometers sharp","Heat treatment improves flint workability!"],
 content:`<p>Flint vỡ kiểu vỏ sò cho lưỡi dao sắc nano — tổ tiên chúng ta thậm chí 'nung flint' 400°C cải thiện độ dẻo vỡ. Materials science bắt đầu từ 2,6 triệu năm trước.</p>`},

{id:"mems-accelerometer", cat:"thong-minh", icon:"📱", name:"MEMS accelerometer", sub:'Con chip "gyro" trong mọi smartphone',
 facts:["Micromachined Si proof mass capacitive sense","Airbag deploy decision 15 ms","Gyro tuning fork Coriolis effect","iPhone 2007 mainstreamed billions units"],
 content:`<p>Cục si-li-con rung nhỏ hơn hạt gạo đo gia tốc bằng khoảng cách capacitor — túi khí ô tô, bước chân đếm, camera gimbal stabilization đều nhờ MEMS này.</p>`},
{id:"photochromic-lens", cat:"thong-minh", icon:"🕶️", name:"Transitions photochromic lens", sub:"Kính đổi màu nắng bằng silver halide",
 facts:["AgCl ⇌ Ag⁰ + Cl⁰ UV reversible","Embedded lens bulk not coating","Darkens seconds clears minutes temperature sensitive","1962 Corning photochromic glass heritage"],
 content:`<p>Cùng chemistry phim ảnh bạc: UV tách Ag nguyên tử màu xám, nhiệt độ tái hợp trở lại trong suốt — kính trong nhà, đeo ra nắng tự thành sunglasses.</p>`},
{id:"mr-fluid", cat:"thong-minh", icon:"🏎️", name:"Magnetorheological fluid damper", sub:"Chất lỏng 'cứng tức thì' treo xe Cadillac",
 facts:["Carbonyl iron particles in silicone oil","B-field chains solidify ms response","Seat prosthetics & building dampers","Lord Corporation commercial pioneer"],
 content:`<p>Dầu chứa vi hạt sắt: bật nam châm → hạt xếp hàng thành chuỗi → chất lỏng cứng như gel trong vài mili-giây. Treo thích ứng đọc đường 1000 lần/giây — 'magic carpet ride'.</p>`},
{id:"sam-coating", cat:"thong-minh", icon:"🧱", name:"Self-assembled monolayer SAM", sub:"'Thảm phân tử' tự xếp lớp một phân tử dày",
 facts:["Thiol-on-gold alkyl chain ordering","Surface wettability/charge programming","Biosensor capture layer SPR/QCM","Whitesides soft lithography heritage"],
 content:`<p>Nhúng vàng vào dung dịch thiol — các phân tử tự đứng thẳng hàng thành lớp đúng 2 nm kiểm soát độ ướt, độ tích điện, gắn protein. Nanotech 'rẻ nhất' nhưng quyền lực nhất.</p>`},

{id:"electroless-nickel", cat:"lop-phu", icon:"⚗️", name:"Electroless nickel plating", sub:"Mạ nickel KHÔNG cần điện — góc khuất cũng phủ đều",
 facts:["Autocatalytic hypophosphite reduction","Uniform thickness complex geometry bores","Ni-P hardening heat treat 1000 Hv","Oil valve & mold wear industry standard"],
 content:`<p>Mạ hóa học tự xúc tác: hypophosphite khử Ni²⁺ ngay trên bề mặt — mọi ngóc ngách lỗ sâu phủ đều thickness mà mạ điện không làm nổi. Thêm P rồi nung lên cứng 1000 Hv.</p>`},
{id:"chrome-trivalent", cat:"lop-phu", icon:"🚫", name:"Chrome VI → III transition", sub:"Bài học môi trường của mạ crôm đẹp",
 facts:["Cr(VI) carcinogen hexavalent legacy baths","Cr(III) trivalent greener replacement","RoHS/ELV regulation forced industry pivot","Decorative bright + hard engineering chrome"],
 content:`<p>Cr⁶⁺ đẹp & bền nhưng gây ung thư — luật RoHS ép toàn ngành chuyển Cr³⁺ trong thập niên 2010. Ví dụ kinh điển 'green chemistry by regulation'.</p>`},
{id:"powder-coat", cat:"lop-phu", icon:"🎨", name:"Powder coating electrostatic", sub:' Sơn "bột khô" bám tĩnh điện nướng lò',
 facts:["Epoxy/polyester powder charged gun","Faraday cage edge coverage oven cure 180°C","Zero VOC vs liquid paint regulation driver","Outdoor furniture appliance standard finish"],
 content:`<p>Bột sơn mang điện bám mọi mặt kim loại như nam châm, nướng lò chảy thành lớp dày đều — không solvent bay hơi, overspray thu hồi tái dùng 95%. Chuẩn sơn đồ nội thất ngoài trời.</p>`},
{id:"anti-fog-solgel", cat:"lop-phu", icon:"🥽", name:"Anti-fog sol-gel coating", sub:"Lớp phủ 'kính không mờ' goggles & camera",
 facts:["Hydrophilic SiO₂/TiO₂ spread condensation","Film instead of droplets scatter-free","Swim mask & endoscope clarity","Durability abrasion trade-off ongoing R&D"],
 content:`<p>Sương mù = giọt nước散射 ánh sáng. Coating hydrophilic kéo giọt thành mảng mỏng trong suốt — kính bơi, nội soi, VR headset thấy rõ dù hít thở hơi nóng.</p>`},
{id:"marine-silicone-foul", cat:"lop-phu", icon:"🚢", name:"Silicone foul-release hull", sub:"Vỏ tàu 'trượt rêu' tiết kiệm nhiên liệu 10%",
 facts:["PDMS elastomer low adhesion biofoul","Slime slides at 10+ knots shear","TBT tributyltin ban disaster legacy","Fuel saving CO₂ cut shipping green"],
 content:`<p>Sơn chống rêu cũ dùng độc tố TBT phá hoại sinh biển bị cấm toàn cầu 2008. Silicone mềm khiến rêu không bám chắc — chạy nhanh thì tự trôi sạch, dầu tàu tiết kiệm hàng tỷ đô/năm.</p>`},
{id:"graphene-corrosion-barrier", cat:"lop-phu", icon:"🛡️", name:"Graphene anticorrosion coating", sub:"Một lớp nguyên tử chắn nước & oxy thép",
 facts:["Impermeable sp² barrier theory","Galvanic acceleration defect caveat!","Multilayer GO practical coatings","Cu foil preservation museum demo"],
 content:`<p>Graphene 'không thấm gì' — lý tưởng chống gỉ; nhưng single-layer có lỗ khuyết tạo pin galvanic làm THÂU更快. Giải pháp: multilayer GO hybrid polymer — bài học scale-up kinh điển.</p>`},
{id:"mos2-semiconductor", cat:"nano", icon:"🔻", name:"MoS₂ monolayer transistor", sub:"Bán dẫn 2D thay silicon chip cực mỏng",
 facts:["Bandgap 1.8 eV single layer","Valleytronics spin-valley coupling","Flexible electronics substrate friendly","CVD growth wafer-scale progress"],
 content:`<p>MoS₂ một lớp nguyên tử có bandgap thật (graphene không có) — transistor 1 nm gate đã demo; tương lai điện tử siêu mỏng dán da.</p>`},
{id:"stober-silica-np", cat:"nano", icon:"⚪", name:"Stöber silica nanoparticle", sub:'Hạt silicа "tròn đều" chuẩn lab 1968',
 facts:["TEOS ammonia ethanol one-pot monodisperse","Size tunable 50-1000 nm precise","Dye/drug encapsulation shell platform","Colloid science teaching classic"],
 content:`<p>Phản ứng Stöber cho hạt silicа tròn tuyệt đối cùng kích thước — nền mọi nghiên cứu colloid, chở thuốc, làm chuẩn đo kích thước kính hiển vi.</p>`},
{id:"ceria-nano", cat:"nano", icon:"🧯", name:"Ceria nanoparticle CeO₂", sub:"Nano xeri 'bộ hút radical' đa dụng",
 facts:["Ce³⁺/Ce⁴⁺ oxygen buffer cycling","UV filter sunscreen dual use","Diesel fuel catalyst polish emissions","Regenerative antioxidant research biology"],
 content:`<p>CeO₂ tự 'làm mới' bằng chu trình Ce³⁺↔Ce⁴⁺ trao đổi oxy — lọc UV kem chống nắng, xúc tác khói diesel, và đang nghiên cứu như chất chống oxy hóa y tế.</p>`},
{id:"clay-nylon-nano", cat:"nano", icon:"🚗", name:"Nylon-clay nanocomposite", sub:"Toyota 'phát minh nano' trước cả graphene hot",
 facts:["Exfoliated montmorillonite 2-5 wt%","Barrier heat distortion ↑ Toyota 1989","First commercial nanocomposite timing","Gas barrier beer bottle PET variant"],
 content:`<p>Trước graphene 15 năm, Toyota đã trộn đất sét nano vào nylon làm bộ phận động cơ nhẹ hơn chịu nhiệt hơn — nanocomposite thương mại đầu tiên lịch sử.</p>`},
{id:"dendrimer-carrier", cat:"nano", icon:"🌟", name:"Dendrimer star polymer", sub:"Polymer 'cây thông' phân nhánh chở thuốc",
 facts:["Generation-branched monodisperse architecture","Interior cavities guest encapsulation","PAMAM drug/gene delivery vectors","Contrast agent Gd multivalent surface"],
 content:`<p>Dendrimer mọc nhánh thế hệ từ tâm — mỗi thế hệ gấp đôi chức năng bề mặt: khoán thuốc trong lõi, treo targeting ligand ngoài da, chở Gd cho MRI.</p>`},
{id:"li-air-battery", cat:"nang-luong", icon:"🌬️", name:"Pin lithium–air", sub:'"Thở oxy" mật độ ngang xăng lý thuyết',
 facts:["O₂ cathode from air open system","Theoretical 3500 Wh/kg rival gasoline","Li₂O₃/Li₂O₂ discharge product clogging","Aprotic/aqueous/solid variants research"],
 content:`<p>Cathode là không khí miễn phí — năng lượng lý thuyết ngang xăng. Nhưng sản phẩm Li₂O₂ bít cathode & O₂ hơi nước phá lithium: bài toán 20 năm chưa lời giải trọn vẹn.</p>`},
{id:"fe-air-grid", cat:"nang-luong", icon:"🪨", name:"Pin sắt–không khí grid", sub:"'Rỉ sét có kiểm soát' lưu điện hàng ngày",
 facts:["Fe → Fe(OH)₂ reversible rust cycle","Form Energy 100-hour duration cheap","Reversible rust oxidation chemistry","Grid seasonal backup utility pilots 2023+"],
 content:`<p>Form Energy dùng SẮT RỈ có thể đảo ngược: nạp = khử rỉ, xả = rỉ lại. Rẻ nhất kWh từng thấy — pin 'hàng trăm giờ' cho lưới điện gió đêm mùa đông.</p>`},
{id:"edlc-supercap", cat:"nang-luong", icon:"⚡", name:"Supercapacitor EDLC", sub:"Siêu tụ điện tích lớp kép không hóa học",
 facts:["Helmholtz double layer charge storage","Millions cycles vs battery thousands","Low energy density complement pairing","Bus braking energy recovery China fleets"],
 content:`<p>EDLC tích điện thuần vật lý tại bề mặt than xốp — sạc 30 giây, sống 1 triệu chu kỳ; xe bus điện Trung Quốc sạc tại mỗi trạm đèn đỏ!</p>`},
{id:"nickel-iron-edison", cat:"nang-luong", icon:"🕰️", name:"Pin sắt–niken Edison", sub:"Pin 1901 'bất tử' hồi sinh cho grid",
 facts:["Edison 1901 alkaline Fe/NiOOH","Indestructible 100-year cells found working","Slow efficiency poor for vehicles then","Iron flow revival grid storage today"],
 content:`<p>Pin Edison bất tử nhưng kém hiệu quả cho ô tô thời đó — một thế kỷ sau, chính tính 'chịu đựng' khiến nó hồi sinh làm lưu trữ lưới điện hàng ngày giá rẻ.</p>`},
{id:"tpv-thermophoto", cat:"nang-luong", icon:"🔆", name:"TPV thermophotovoltaic", sub:"'Pin mặt trời cho lửa' kỷ lục 44% MIT 2022",
 facts:["Hot emitter IR → PV cell electricity","No turbine solid state generator","Airborne thermal battery flight concept","Tungsten/graphite emitter photonic design"],
 content:`<p>Nung graphite phát hồng ngoại, cell PV chuyên IR chuyển thành điện — hiệu suất 44% vượt turbine nhỏ; ý tưởng 'pin nhiệt bay' cho máy bay điện dài hạn.</p>`},
{id:"thorium-msr-fuel", cat:"nang-luong", icon:"⚛️", name:"Thorium molten salt fuel", sub:"Muối nóng chảy Th-232/U-233 lò thế hệ IV",
 facts:["Th-232 fertile breed U-233 fissile","FLiBe salt 650°C atmospheric pressure","Oak Ridge MSRE ran 1965-69 proven concept","Waste shorter-lived proliferation-resistant claims"],
 content:`<p>Lò muối chảy thorium hoạt động áp suất khí quyển, không meltdown kiểu Chernobyl; Trung Quốc/Đan Mạch đang tái khởi động công nghệ ORNL bỏ từ 1969.</p>`},
{id:"uf6-enrichment", cat:"nang-luong", icon:"🌀", name:"UF₆ centrifuge enrichment", sub:"Khí uranium quay 60.000 vòng/phút tách isotope",
 facts:["Uranium hexafluoride sublimes 56°C gas","Gas centrifuge cascade thousands stages","3-5% LEU reactor · 90% HEU weapons","SWU separative work unit economics"],
 content:`<p>Máy ly tâm UF₆ quay sát tốc độ âm tách U-235 nặng hơn tí xíu — hàng nghìn tầng nối tiếp mới đủ 3-5% cho reactor; cùng công nghệ là ranh giới phổ hạt nhân.</p>`},
{id:"pu-foam-core", cat:"polymer", icon:"🛥️", name:"PVC foam sandwich core", sub:"Lõi xốp 'bánh kẹp' thân du thuyền nhẹ",
 facts:["Crosslinked PVC foam closed-cell","Sandwich skins take bending stiffness","Boat hulls wind blades panels","Fire performance resin choice matters"],
 content:`<p>Hai vỏ composite mỏng kẹp lõi xốp — stiffness tăng theo khối bậc ba khoảng cách! Du thuyền & cánh tua-bin gió đều là bánh kẹp vật liệu này.</p>`},
{id:"uf-adhesive", cat:"polymer", icon:"🪵", name:"Urea-formaldehyde wood adhesive", sub:"Keo gỗ của MDF — và chuyện formaldehyde",
 facts:["UF resin plywood MDF particle board","Cheap strong interior grade","Off-gassing E1/E0 emission classes","Phenolic exterior marine upgrade path"],
 content:`<p>UF keo rẻ bám gỗ tuyệt vời — nhưng formaldehyde thoát ra gây lo ngại ung thư; tiêu chuẩn E0/E1 ép ngành cải tiến công thức giảm phát thải 90%.</p>`},
{id:"pvac-glue", cat:"polymer", icon:"🧴", name:"PVAc trắng Elmer's glue", sub:"Keo sữa trắng mọi bàn học sinh",
 facts:["Polyvinyl acetate water emulsion","Coalesces water evaporates bond forms","Reversible re-wettable craft friendly","Woodworking PVA yellow variant stronger"],
 content:`<p>Keo trắng khô khi nước bay hơi, các hạt PVAc hợp nhất thành phim — 'bond vật lý' có thể tẩy bằng ẩm; anh em vàng (carpenter glue) mạnh hơn cho gỗ.</p>`},
{id:"pva-water-soluble", cat:"polymer", icon:"🧼", name:"PVA water-soluble pod", sub:"Viên giặt tan trong nước PVOH",
 facts:["Polyvinyl alcohol cold-water soluble film","Laundry pods unit-dose convenience","Biodegradability wastewater debate active","Textile sizing & 3D printing support dual"],
 content:`<p>Túi giặt viên 'màng tan' là PVOH — hòa tan hoàn toàn ở 30°C. Tranh cãi: có phân hủy đầy đủ trong xử lý nước hay thành vi-plastic hòa tan chưa rõ.</p>`},
{id:"gutta-percha", cat:"polymer", icon:"🌊", name:"Gutta-percha", sub:"Nhựa tự nhiên xuyên đại dương & chữa răng",
 facts:["Trans-polyisoprene rigid isomer of rubber","1858 transatlantic cable insulation revolution","Root canal obturation standard至今","Biodegradable ocean cable legacy replaced"],
 content:`<p>Gutta-percha đồng phân 'cứng' của cao su cách điện dưới biển — cáp xuyên Đại Tây Dương 1858 mở kỷ nguyên liên lạc toàn cầu; nay vẫn trám ống tủy răng.</p>`},
{id:"shellac-78rpm", cat:"polymer", icon:"💿", name:"Shellac record discs", sub:"Đĩa 78 vòng từ... sáp ve côn trùng",
 facts:["Laccifer lacca secretion purified flakes","Brittle 78 rpm shellac disc era 1900-1950","Food glaze confectioner's resin dual use","Vinyl PVC displaced recording industry"],
 content:`<p>Sáp ve (từ côn trùng châu Á) ép thành đĩa hát brittle dễ vỡ — vinyl PVC 1948 thay thế mở kỷ nguyên LP dài play; shellac vẫn phủ kẹo & thuốc viên sáng bóng.</p>`},
{id:"rosin-flux", cat:"polymer", icon:"🌲", name:"Rosin soldering flux", sub:"Nhựa thông hàn mạch điện tử mọi phòng lab",
 facts:["Pine resin abietic acid activators","Removes oxides wetting solder joints","No-clean formulations modern SMT","Violin bow string grip dual-use culture"],
 content:`<p>Nhựa thông khử oxide kim loại để thiếc bám ướt tốt — mỗi bo mạch điện tử thế giới hàn qua rosin; violinist cũng nhờ nó mà dây cầm nốt.</p>`},
{id:"sac-leadfree", cat:"kim-loai", icon:"🔩", name:"SAC solder lead-free", sub:"Thiếc hàn không chì RoHS 2006",
 facts:["Sn-Ag-Cu eutectic 217°C melt","RoHS/WEEE regulation forced transition","Tin whisker reliability new challenge","High-Sn alloys stronger fatigue tradeoffs"],
 content:`<p>EU cấm chì trong điện tử → ngành phải phát minh lại hàn: SAC305 trở thành chuẩn, kèm vấn đề mới 'tin whisker' mọc kim tua gây short — regulation drives innovation literal.</p>`},
{id:"invar-lowcte", cat:"kim-loai", icon:"📏", name:"Invar 36", sub:"Hợp kim 'không giãn nở' của thước đo & TV mask",
 facts:["Fe-36% Ni near-zero CTE","Shadow mask CRT precision heritage","Telescope structures LNG tank membranes","Guillaume Nobel Physics 1920 discovery"],
 content:`<p>Invar giãn gần bằng 0 khi nóng — Charles Guillaume đoạt Nobel 1920; nay nằm trong màng LNG tàu khí, khung kính thiên văn, khuôn đúc composit aerospace.</p>`},
{id:"kovar-glassseal", cat:"kim-loai", icon:"🔌", name:"Kovar glass-to-metal seal", sub:"Hợp kim 'bắt tay' kim loại với thủy tinh chân không",
 facts:["Fe-Ni-Co CTE matched borosilicate","Hermetic feedthrough vacuum tubes transistors","Integrated circuit package heritage","Thermal expansion match is everything"],
 content:`<p>Kovar giãn đúng bằng thủy tinh — hàn kín chân không tuyệt đối cho tube & chip đầu tiên; không Kovar thì không có kỷ nguyên điện tử chân không.</p>`},
{id:"elinvar-hairspring", cat:"kim-loai", icon:"⌚", name:"Elinvar hairspring", sub:"Hợp kim đàn hồi 'độc lập nhiệt độ' đồng hồ chính xác",
 facts:["Elastic modulus temperature-invariant","Chronometer longitude prize heritage","Guillaume second Nobel-linked alloy","Mechanical watch precision still beloved"],
 content:`<p>Elinvar (elastic invariable) giữ độ cứng đàn hồi mọi nhiệt độ — móng ngựa đồng hồ chạy đúng dù sa mạc hay Bắc Cực; giải quyết bài toán kinh tuyến thế kỷ XVIII-XIX.</p>`},
{id:"du-penetrator-debate", cat:"kim-loai", icon:"⚖️", name:"Depleted uranium penetrator", sub:"Uranium nghèo — vật liệu chiến tranh gây tranh cãi",
 facts:["Density 19.1 self-sharpening adiabatic shear","Armor-piercing munitions Gulf War era","Radioactivity & toxicity health controversy","Tungsten alternatives cost-performance tradeoff"],
 content:`<p>DU tự 'v sharpen' khi xuyên thép — hiệu quả quân sự vượt trội; nhưng phóng xạ thấp + độc hóa học để lại tranh cãi sức khỏe môi trường kéo dài đến hôm nay.</p>`},
{id:"alumina-sparkplug", cat:"gom", icon:"🕯️", name:"99% alumina insulator", sub:"Gốm nhôm oxit của mọi bugi đánh lửa",
 facts:["Al₂O₃ 96-99.7% grades","Dielectric strength 15 kV/mm class","Spark plug 25kV survival 100M pulses","Wear liners seals pump components too"],
 content:`<p>Gốm alumina chịu 25.000 volt bugi trong 800°C xi lanh hàng trăm triệu chu kỳ — 'workhorse vô danh' của mọi động cơ combustion từ 1920 đến nay.</p>`},
{id:"steatite-classic", cat:"gom", icon:"🔌", name:"Steatite insulator", sub:"Gốm talc điện tử thế kỷ XX kinh điển",
 facts:["MgO·SiO₂ talc-based fired body","Low loss RF insulator vintage radio","Cost-effective volume production","House fuse carriers terminal blocks"],
 content:`<p>Steatite (gốm từ talc) mất mát RF thấp giá rẻ — isolator của radio, cầu chì, terminal block suốt giữa thế kỷ XX trước alumina hiện đại.</p>`},
{id:"ruby-first-laser", cat:"gom", icon:"🔴", name:"Ruby crystal first laser 1960", sub:"Viên ruby Maiman bắn laser đầu tiên nhân loại",
 facts:["Cr³⁺ in Al₂O₃ three-level laser","694 nm pulsed May 16 1960 Hughes","Flash lamp pumped helical design","Synthetic Verneuil flame fusion grown"],
 content:`<p>Theo lý thuyết bị coi 'không thể', Theodore Maiman vẫn bắn laser đầu tiên từ thanh ruby nhân tạo 16/5/1960 — mở kỷ nguyên photonics toàn cầu từ một viên đá quý.</p>`},
{id:"glass-ceramic-cooktop", cat:"gom", icon:"🍳", name:"Glass-ceramic cooktop Ceran", sub:"Kính-gốm 'zero nở' mặt bếp từ cảm ứng",
 facts:["Li₂O-Al₂O₃-SiO₂ nucleated glass-ceramic","CTE ≈ 0 thermal shock immune","Opaque crystallized translucent control","Schott Ceran brand since 1971"],
 content:`<p>Nung kính có nucleating agent → tinh thể leucite mọc trong màng — kết quả: tấm bếp chịu sốc nhiệt đá lạnh lên ngay khi đang đỏ lửa mà không nứt.</p>`},
{id:"bone-china", cat:"gom", icon:"☕", name:"Bone china porcelain", sub:"Sứ xương Anh — trong suốt nhờ... tro xương",
 facts:["50% cattle bone ash calcium phosphate","Translucent whitest porcelain grade","Josiah Spode 1790s England innovation","Higher firing difficulty lower yield cost"],
 content:`<p>Bone china thêm tro xương bò giàu canxi phosphat — tách trà soi bóng qua thân sứ; phát minh Spode cạnh tranh sứ Trung Hoa sau khi châu Âu vừa crack được công thức.</p>`},
{id:"celadon-glaze", cat:"gom", icon:"🍵", name:"Celadon glaze", sub:"Men lam sứ 'màu trời sau mưa' triết học kiln",
 facts:["Iron reduction firing green jade tone","Song dynasty Ru ware imperial treasure","Crackle ice pattern controlled defects","Kiln atmosphere chemistry art mastery"],
 content:`<p>Màu xanh ngọc của men celadon đến từ Fe²⁺ trong lò khử oxy — 'thiên thanh' mà vua Tống coi như trời sau mưa; vết nứt băng tuyết được nâng thành nghệ thuật.</p>`},
{id:"lusterware-nano", cat:"gom", icon:"✨", name:"Lusterware metallic glaze", sub:"Gốm ánh kim trung cổ — nanotech vô tình",
 facts:["Ag/Cu nanoparticles surface reduced","Medieval Islamic potters 9th century","Metallic iridescence plasmonic origin","Electron microscopy confirmed 1980s!"],
 content:`<p>Thợ gốm Baghdad/Fez nấu muối bạc-đồng trên men trong lò khử — vô tình tạo nanoparticle kim loại phản chiếu ánh kim; khoa học xác nhận 900 năm sau!</p>`},
{id:"mg-resorbable-stent", cat:"y-duoc-vl", icon:"🫀", name:"Magnesium bioresorbable stent", sub:"Stent magnez 'tan biến' sau 12 tháng",
 facts:["Mg alloy WE43 degrades safely","Temporary scaffold vessel healing","Drug-eluting resorbable combo","Xience/Biotronik Magmaris approved EU"],
 content:`<p>Stent magnez giữ động mạch mở đúng giai đoạn healed rồi tan thành Mg²⁺ cơ thể đã quen — 'giúp rồi biến mất' triết lý thiết kế y tế thế hệ mới.</p>`},
{id:"decellularized-ecm", cat:"y-duoc-vl", icon:"👻", name:"Decellularized ECM ghost organ", sub:"'Bộ xương mô' rửa sạch tế bào trồng lại tế bào mới",
 facts:["Detergent perfusion strip cells keep matrix","Ghost heart/kidney/lung scaffolds","Patient cell recellularization research","Xenotransplant immunology bypass hope"],
 content:`<p>Rửa trái tim heo bằng detergent — còn lại ma trận collagen trắng như ma ('ghost heart'); gieo tế bào bệnh nhân vào sẽ tạo tim không bị đào thải. Frontier regenerative medicine.</p>`},
{id:"organ-on-chip", cat:"y-duoc-vl", icon:"🔬", name:"Organ-on-a-chip", sub:"Chip mô phỏng phổi/gan thay thí nghiệm động vật",
 facts:["PDMS microchannels living cells lined","Breathing motion vacuum side chambers","FDA Modernization Act 2022 animal alternative","Emulate Wyss Harvard pioneering platforms"],
 content:`<p>Chip nhỏ cỡ thẻ ATM chứa tế bào phổi thật 'thở' theo nhịp chân không — test độc tính thuốc chính xác hơn chuột; FDA đã chấp nhận dữ liệu thay thử nghiệm động vật.</p>`},
{id:"bioprinting-skin", cat:"y-duoc-vl", icon:"🖨️", name:"3D bioprinting tissue", sub:"In da, sụn sống layer-by-layer bioink",
 facts:["Bioink cell-laden hydrogel strands","Skin graft burn trials clinical","Vascularization grand challenge remaining","Cellink/BioInk commercial printers exist"],
 content:`<p>Đầu in phun hỗn hợp tế bào sống + gel — in da cho người bỏng đã vào trial lâm sàng; thách thức cuối: in mao mạch nuôi khối dày.</p>`},
{id:"aav-genetherapy", cat:"y-duoc-vl", icon:"🧬", name:"AAV gene therapy vector", sub:"Virus 'trình đưa gen' — thuốc đắt nhất hành tinh",
 facts:["Adeno-associated virus safe vector serotypes","Luxturna/Zolgensma $2.1M single dose","Spinal muscular atrophy cure newborns","Packaging limit ~4.7 kb cargo constraint"],
 content:`<p>Virus AAV đã bị 'khử' thành taxi chở gene lành vào tế bào — Zolgensma chữa SMA trẻ sơ sinh bằng MỘT liều; giá 2,1 triệu USD mở tranh luận y tế công bằng.</p>`},
{id:"dental-implant-ti", cat:"y-duoc-vl", icon:"🦷", name:"Titanium dental implant", sub:"Brånemark 1952 — xương 'dính' titanium tình cờ",
 facts:["Osseointegration discovered rabbit leg cannot remove","TiO₂ passive layer biocompatible key","Two-stage protocol success >95% 10yr","Abutment crown restorative workflow standard"],
 content:`<p>Brånemark thấy chân thỏ titanium không tháo ra nổi — 'xương sống dính vào kim loại'! Osseointegration khai sinh implant nha khoa hiện đại phục hồi răng triệu người.</p>`},
{id:"zinc-air-hearingaid", cat:"y-duoc-vl", icon:"👂", name:"Zinc-air hearing aid battery", sub:"Pin kẽm-không khí của máy trợ thính",
 facts:["O₂ cathode air hole tab activation","Highest energy density per volume primary","Stable voltage discharge curve hearing critical","Mercury-free transition completed 2013"],
 content:`<p>Bóc tab — oxy tràn vào cathode, pin 'thức dậy' 1,35 V ổn định suốt tuần; năng lượng riêng cao nhất các pin primary giúp trợ thính bé xíu chạy cả ngày.</p>`},
{id:"ewod-display", cat:"thong-minh", icon:"💧", name:"Electrowetting display", sub:'E-paper "màu & video" đẩy dầu bằng điện',
 facts:["Oil/water interface voltage shape change","Color reflective video-rate capable","Sunlight readable like paper","Shop shelf labels commercial beachhead"],
 content:`<p>Điện áp kéo giọt dầu màu lan/tròn đổi pixel — e-paper có màu & tốc độ video; Etulics/Snapple? — thương mại hóa bắt đầu từ label siêu thị.</p>`},
{id:"qtc-pressure-sensor", cat:"thong-minh", icon:"🖐️", name:"QTC quantum tunneling composite", sub:"Vật liệu 'bóp thì dẫn, thả thì cách điện'",
 facts:["Silver nanoparticle spiky filler silicone","Pressure → tunneling conductivity exponential ×10¹⁰ range","Touchpads robot grippers tactile sensing","Peratech UK Queen's Award winner"],
 content:`<p>Hạt bạc gai nhọn gần chạm nhau: bóp nhẹ → electron tunneling qua khe → điện trở giảm hàng tỷ lần. Da robot & tay cầm game cảm biến lực theo cấp số nhân.</p>`},
{id:"mos-gas-sensor", cat:"thong-minh", icon:"🚨", name:"Taguchi MOS gas sensor", sub:"Cảm biến SnO₂ cứu mạng trong mọi báo khói CO",
 facts:["SnO₂ heating element resistance shift gas adsorption","Figaro Taguchi 1968 commercial pioneer","CO/methane/smoke alarm ubiquitous safety","Power hungry heater continuous operation trade"],
 content:`<p>Đèn nung SnO₂ nhỏ: khí CO bám → điện trở giảm → alarm kêu. Cảm biến 'nóng ranh' này mỗi năm cứu hàng nghìn người khỏi ngộ độc khí không màu không mùi.</p>`},
{id:"hotdip-galvanized", cat:"lop-phu", icon:"🌧️", name:"Hot-dip galvanized steel", sub:"Mạ kẽm nhúng nóng — hoa tuyết kẽm đẹp & bền 70 năm",
 facts:["Molten zinc 450°C immersion Fe-Zn layers","Sacrificial protection scratches still safe","Spangle crystal pattern aesthetic variable","Transmission towers guardrails streetlights everywhere"],
 content:`<p>Nhúng thép vào kẽm nóng chảy — lớp Fe-Zn intermetallic bảo vệ cả khi xước (kẽm hy sinh bản thân). Hoa tuyết kẽm trên cột điện là tinh thể kẽm tự nhiên.</p>`},
{id:"parkesine-first-plastic", cat:"lich-su-vl", icon:"🏛️", name:"Parkesine 1862", sub:'"Nhựa đầu tiên" triển lãm London trước Bakelite',
 facts:["Alexander Parkes nitrocellulose moldable 1862","Great Exhibition London public debut","Unstable plasticizer commercial failure","Celluloid Hyatt brother improvement 1869 heritage"],
 content:`<p>Parkesine trình diễn 1862 — nhựa đúc từ cellulose nitrate đầu tiên; thương mại thất bại do unstable, nhưng mở đường celluloid & toàn ngành plastics.</p>`},
{id:"egyptian-blue", cat:"lich-su-vl", icon:"🔵", name:"Egyptian blue CaCuSi₄O₁₀", sub:'Sắc tố nhân tạo ĐẦU TIÊN nhân loại 2200 TCN',
 facts:["Calcium copper tetrasilicate synthesized","First man-made pigment ever recorded","Near-IR luminescence rediscovered modern uses","Security ink biomedical imaging research revival"],
 content:`<p>Ai Cập cổ 'phát minh màu': nấu cát + vôi + đồng → Egyptian blue. 4000 năm sau phát hiện nó phát quang hồng ngoại — đang hồi sinh làm mực bảo mật & ảnh y tế.</p>`},
{id:"cinnabar-vermilion", cat:"lich-su-vl", icon:"🔴", name:"Cinnabar vermilion HgS", sub:"Đỏ thủy ngân — sắc đẹp & độc của hoàng gia",
 facts:["HgS mineral ground pigment vermilion","Han Chinese tombs Roman Pompeii murals","Toxic mercury handling artisan deaths","Cadmium-red organic azo modern replacements"],
 content:`<p>Cinnabar (HgS) đỏ rực vẽ lăng mộ Hán & tường Pompeii — nghệ sĩ thời đó thường chết sớm vì mercury; sắc đỏ đẹp nhất cổ đại trả giá bằng mạng.</p>`},
{id:"madder-alizarin", cat:"lich-su-vl", icon:"🟥", name:"Madder alizarin Turkey red", sub:"Chàm đỏ nhuộm quân phục — hóa học thay đổi địa chính trị",
 facts:["Rubia tinctorum root anthraquinone dye","Turkey red complex oil mordant process prized","Graebe Liebermann synthesis 1868 killed farming","Napoleon army uniforms dyed madder heritage"],
 content:`<p>Đỏ madder nuôi cả vùng Rhine; khi BASF tổng hợp alizarin 1868, nông nghiệp nhuộm sụp đổ — ví dụ đầu tiên 'synthetic beats agriculture' reshaping economies.</p>`},
{id:"prussian-blue-doublelife", cat:"lich-su-vl", icon:"🎨", name:"Prussian blue double life", sub:"Sắc tố tình cờ 1704 — và thuốc giải độc thế kỷ XX",
 facts:["Diesbach accidental iron cyanide blue","First modern synthetic pigment art revolution","Radiation cesium/thallium antidote oral","UNESCO Goya Hokusai heritage artworks"],
 content:`<p>Tình cờ trộn sai chất tạo xanh Prussian đẹp kinh ngạc (1704); 250 năm sau chính bột ấy là thuốc giải cesium phóng xạ — một vật liệu hai cuộc đời ngoạn mục.</p>`},

{id:"cof-frameworks", cat:"nano", icon:"🧊", name:"COF covalent organic framework", sub:"MOF 'anh em thuần cộng hóa trị' bền hơn",
 facts:["Boroxine/imine/triazine linkages","Crystalline porous pure covalent","Photocatalysis & quantum dot arrays","Yaghi/Odobel COF water splitting stacks"],
 content:`<p>COF dùng bond cộng hóa trị mạnh thay coordination — chịu nước, acid tốt hơn MOF; 2D COF xếp chồng thành 'kênh nano có tính hướng' cho photocatalysis tổng phân giải nước.</p>`},
{id:"single-atom-catalyst", cat:"gom", icon:"⚛️", name:"Single-atom catalyst", sub:"Mỗi nguyên tử Pt quý đều phải làm việc",
 facts:["Isolated metal atoms on support","100% atom utilization vs nanoparticle surface fraction","Zhang 2011 Nature Chem concept paper","CO oxidation Au₁/FeOx benchmark"],
 content:`<p>Nanoparticle Pt chỉ ~20% nguyên tử ở bề mặt làm việc — SAC tách từng atom đơn lẻ neo lên support: hiệu suất riêng tăng gấp chục, mở cả field catalysis mới.</p>`},
{id:"twisted-bilayer-graphene", cat:"nano", icon:"🌀", name:"Twisted bilayer graphene", sub:"Góc xoay 1.1° tạo siêu dẫn 'ma thuật'",
 facts:["Magic angle θ≈1.1° moiré superlattice","Superconductivity 1.7K Cao 2018","Correlated insulator phases twist-tunable","Twistronics entire subfield born"],
 content:`<p>Xếp hai lớp graphene lệch 1.1° — electron moiré chậm lại tương tác mạnh: siêu dẫn + Mott insulator xuất hiện chỉ nhờ GÓC XOAY. Điều chỉnh góc = chỉnh material identity.</p>`},
{id:"vdw-heterostructure", cat:"nano", icon:"🥪", name:"Van der Waals heterostructure", sub:'"Lego nguyên tử" xếp mọi vật liệu 2D thành stack',
 facts:["Graphene/hBN/TMD arbitrary stacking","Transfer deterministic angle alignment","Interlayer excitons devices","Geim vision 2013 Nature perspective"],
 content:`<p>Không giới hạn lattice match như epitaxy truyền thống — nhặt từng lớp 2D xếp thành thiết kế bất kỳ: tunnel transistor, LED atomically thin, moiré physics playground.</p>`},
{id:"high-entropy-oxide", cat:"gom", icon:"🎲", name:"High-entropy oxide", sub:"5 oxides 'hòa tan' vào một tinh thể duy nhất",
 facts:["(MgCoNiCuZn)O rocksalt single phase","Configurational entropy stabilization","Catalyst thermal storage Li-rich battery exploration","Rost 2015 entropy-stabilized oxides paper"],
 content:`<p>HEA concept lan sang oxide: 5 cation chia sẻ cùng site — entropy trộn giữ pha đơn. Tính chất 'vừa là tất cả': catalytic, colossal dielectric, lithium capacity đang khám phá.</p>`},
{id:"cnt-yarn-muscle", cat:"polymer", icon:"💪", name:"CNT yarn artificial muscle", sub:"Sợi ống nano 'co giãn như bắp tay' chạy bằng nhiệt/electrochemical",
 facts:["Twisted CNT yarn guest-filled actuation","Tensile stroke 1000%+ hybrid variants","Baughman UT Dallas group pioneering","Self-powered humidity/solvent responsive textiles"],
 content:`<p>Xoắn sợi CNT chở paraffin — nung nóng wax nở khiến sợi xoắn co rút sinh lực kéo lớn hơn cơ người theo trọng lượng. Textile robot mềm không cần motor.</p>`},
{id:"de-novo-protein-material", cat:"y-duoc-vl", icon:"🧬", name:"De novo designed protein materials", sub:"Protein 'phát minh từ đầu' Baker lab thành vật liệu",
 facts:["Rosetta/RFdiffusion design compute first","Self-assembling cages nanocapsules","Hydrogels cytokine mimics immunotherapy","Not found in nature — entirely invented folds"],
 content:`<p>AI thiết kế fold chưa từng tồn tại rồi DNA gene tổng hợp protein đó thật — lưới protein tự lắp hydrogel chữa tim, nano-cage vaccine platform (skycovione COVID approved!).</p>`},
{id:"mof-water-harvester", cat:"nang-luong", icon:"🏜️", name:"MOF water harvester", sub:"'Hút nước từ không khí sa mạc' MOF-801/Yaghi product",
 facts:["Adsorb dew point below 10% RH desert air","Solar release potable water cycle daily","Field trial Arizona desert Yaghi 2019 Science","Water security climate adaptation tech"],
 content:`<p>MOF hấp thụ hơi nước ở độ ẩm cực thấp ban đêm, ánh nắng buổi sáng đẩy nước sạch ra uống — không điện không nguồn nước; đang scale cho vùng khô hạn toàn cầu.</p>`},
{id:"dac-sorbent", cat:"moi-truong-vl", icon:"🏭", name:"Direct air capture sorbent", sub:"Vật liệu 'hút CO₂ trực tiếp từ bầu trời'",
 facts:["Amine-functionalized silica/MOF sorbent","400 ppm dilute capture hardest challenge","Climeworks Orca/Mammoth Iceland operating","Permanent basalt mineralization Carbfix partner"],
 content:`<p>Bắt CO₂ ở nồng độ 0.04% là bài toán khó nhất carbon removal — solid amine sorbent hấp phụ thường, nung 100°C nhả CO₂ tinh khiết khoan sâu biến thành đá vôi vĩnh viễn.</p>`},
{id:"argyrodite-electrolyte", cat:"nang-luong", icon:"💎", name:"Argyrodite solid electrolyte", sub:"Li₆PS₅Cl dẫn ion như chất lỏng mà là tinh thể",
 facts:["Ionic conductivity >10 mS/cm room temp","Cold-press densification no sintering","Sulfide softness enables stack pressure","Samsung pilot EV cell 900 Wh/L claim"],
 content:`<p>Khoáng argyrodite nhân tạo dẫn Li⁺ gần ngang electrolyte lỏng nhưng rắn an toàn — Samsung SDI pilot pin thể rắn sulfide cho xe 900+ Wh/L, sạc nhanh 800 km.</p>`},
{id:"si-photonics-waveguide", cat:"ban-dan", icon:"🔆", name:"Silicon photonics waveguide", sub:"'Ống dẫn ánh sáng' silicon thay đồng dây datacenter",
 facts:["Waveguide Si-on-insulator 220nm core","WDM channels terabits per fiber pair","Co-packaged optics NVIDIA/Ayar Labs push","Modulator ring resonator electro-optic switching"],
 content:`<p>Khắc sóng dẫn ánh sáng trên wafer silic chuẩn CMOS — dữ liệu giữa chip đi bằng photon tiết kiệm năng lượng ×10 so đồng; AI cluster bandwidth bottleneck solution.</p>`},
{id:"dna-origami-device", cat:"nano", icon:"📐", name:"DNA origami device", sub:"(đã có entry gốc — đây là thế hệ máy DNA nano)",
 facts:["Rotors hinges pistons measured by cryo-EM","Single-molecule force spectroscopy platforms","Drug release logic gate pH/miRNA triggered","PDB now hosts DNA origami structures!"],
 content:`<p>Từ hình vui 2006 đến máy móc: rotor quay đo được, hộp mở khóa bởi aptamer gặp tế bào ung thư, thậm chí 'factory' tổng hợp phân tử tuần tự trên track DNA.</p>`},
{id:"perovskite-led-pv-stack", cat:"nang-luong", icon:"🎛️", name:"Perovskite tandem commercial", sub:"Tandem perovskite-silicon ra khỏi lab lên module",
 facts:["Longi 34.6% cell record 2024 certified","Encapsulation lifetime IEC passed pilots","Oxford PV commercial shipment started","Tandem architecture monolithic two-terminal"],
 content:`<p>Mốc lịch sử 2024: pin perovskite-silicon tandem vượt 34% và BẮT ĐẦU bán thương mại — kết thúc kỷ nguyên silicon độc quyền 70 năm quang điện.</p>`},
{id:"enzyme-pet-recycling", cat:"moi-truong-vl", icon:"🧴", name:"Enzymatic PET recycling plant", sub:"'Nhà máy enzyme' tái chế nhựa vô hạn chu kỳ",
 facts:["PETase/ MHETase engineered fast variants","Depolymerize to virgin-quality monomers","Carbios France demonstration plant L'Oréal/Nestlé","Mixed color contaminated waste acceptable feedstock"],
 content:`<p>Enzyme đột biến cắt PET thành monomer nguyên chất — tái chế 'đúng nghĩa vô tận' khác mechanical downcycling; nhà máy demo Pháp xử lý hàng nghìn tấn/năm.</p>`},
{id:"protein-computing-biofilm", cat:"ly-thuyet", icon:"🦠", name:"Protein bioelectronics biofilm", sub:"Geobacter 'dây thần kinh vi khuẩn' dẫn điện sinh học",
 facts:["Conductive pili protein nanowires 5 nm","Microbial fuel cells electricity from mud","Bioelectronic interface living circuits","Lovley/Malvankar discovery controversy→confirmed"],
 content:`<p>Vi khuẩn Geobacter mọc 'lông' protein dẫn điện để hô hấp ngoài tế bào — cầu nối sống-máy: pin bùn, cảm biến môi trường, mạch điện tử sinh học tương lai.</p>`},

/* ===== VẬT LIỆU NGHIÊN CỨU SÂU (MS/PhD) ===== */
{id:"transmon-qubit", cat:"ban-dan", icon:"🔮", name:"Transmon qubit", sub:"Mạch Josephson Nb/AlOx/Nb — phần cứng máy tính lượng tử",
 facts:["Al/AlOx/Al Josephson junction","Coherence ~100µs-1ms transmon","IBM Google Quantum superconducting chips","Dilution refrigerator 10-15 millikelvin"],
 content:`<p>Qubit siêu dẫn = junction Josephson trong cộng hưởng microwave: |0⟩ và |1⟩ là hai mức năng lượng mạch. Google Willow & IBM Heron hàng trăm qubit đang vượt ngưỡng error correction.</p>`},
{id:"hfo2-fe-memory", cat:"gom", icon:"💾", name:"HfO₂ ferroelectric memory", sub:'Ferroelectric "không thể có" trong CMOS — FeRAM thế hệ mới',
 facts:["Hf₀.₅Zr₀.₅O₂ ferroelectric 2011 surprise","CMOS-compatible scaling below 10nm","FeFET non-volatile logic-in-memory","Wake-up cycling & fatigue engineering"],
 content:`<p>Lý thuyết cũ nói HfO₂ màng mỏng không ferroelectric — 2011 bị bác bỏ thực nghiệm: dopant + strain tạo phase orthorhombic cực tính. Mở kỷ nguyên memory tích hợp silicon trực tiếp.</p>`},
{id:"zif-8-framework", cat:"nano", icon:"🧊", name:"ZIF-8 zeolitic imidazolate", sub:"MOF 'áo giáp hóa học' cho delivery & tách khí",
 facts:["Zn(imidazolate)₂ sodalite topology","pH-responsive dissolution zinc release","Gas separation membranes molecular sieving","Biomimetic mineralization enzyme encapsulation"],
 content:`<p>ZIF-8 ổn định nước như zeolite thật nhưng lỗ rỗng MOF — bao enzyme/b cell giữ hoạt động, pH thấp ung thư tan giải phóng thuốc thông minh.</p>`},
{id:"peo-spe-electrolyte", cat:"nang-luong", icon:"🧪", name:"PEO solid polymer electrolyte", sub:"Polyethylene oxide-LiTFSI 'chất điện ly nhựa' pin",
 facts:["PEO helix coordinate Li⁺ hopping transport","Tg suppression ceramic filler LLZO blend","60-80°C operating heating pack design","Bolloré Bluecar deployed fleet heritage"],
 content:`<p>Sợi PEO quấn quanh Li⁺ như dây leo — ion 'nhảy' giữa vị trí phối trí khi đoạn chain vận động segmentally. An toàn tuyệt đối nhưng cần ấm: bài toán trade-off kinh điển.</p>`},
{id:"skutterundite-te", cat:"nang-luong", icon:"🌡️", name:"Filled skutterundite thermoelectric", sub:"CoSb₃ 'nhốt nguyên tử' giảm thermal conductivity NASA",
 facts:["La/Ce-filled CoSb₃ rattler mode phonon scattering","ZT~1.5 high temperature waste heat","Radioisotope alternative power concepts","Phonon-glass electron-crystal design paradigm"],
 content:`<p>'Rattler' nguyên tử đất hiếm lắc trong lồng antimonide tán xạ phonon — dẫn điện tốt mà cách nhiệt kém: công thức hoàn hảo thermoelectric theo thiết kế phonon-glass/electron-crystal.</p>`},
{id:"bazr03-proton", cat:"gom", icon:"💧", name:"BaZrO₃ proton conductor", sub:"Gốm dẫn proton cho fuel cell hydro economy",
 facts:["Y-doped BaZrO₃ proton hopping hydration","300-600°C intermediate temp operation","Fuel flexibility NH₃ direct potential","Grain boundary resistance sintering challenge"],
 content:`<p>Proton 'leo' giữa các ô oxy hydrate — PCFC chạy ở nhiệt trung gian thấp hơn SOFC dùng vật liệu rẻ hơn; grain boundary vẫn là boss cuối của ngành.</p>`},
{id:"graphene-oxide-membrane", cat:"nano", icon:"🧫", name:"GO membrane ion sieving", sub:"Màng graphene oxide 'sàng ion' chính xác Å",
 facts:["Interlayer spacing tunable 6-10 Å hydration-controlled","He gas leaks nothing water permeates fast","Desalination ion exclusion sieving research","Nair/Geim 2012 Science helium-impermeable demo"],
 content:`<p>Khoảng cách giữa các lớp GO điều khiển bằng độ ẩm/nhiệt — lọc He khỏi mọi khí nhưng nước xuyên nhanh; 'sàng phân tử' precision hứa hẹn desalination energy-free.</p>`},
{id:"ctf-photocatalyst", cat:"nang-luong", icon:"☀️", name:"Covalent triazine framework photocatalyst", sub:"COF triazine tổng hợp H₂ từ nước chỉ bằng ánh sáng",
 facts:["CTF-1 triazine network carbon nitride cousin","Pt cocatalyst sacrificial donor H₂ evolution","Visible bandgap ~2.4 eV tuned doping","Solar fuels artificial leaf component race"],
 content:`<p>Khung triazine cộng hóa trị hấp thụ visible → electron kích hoạt giảm H⁺ thành H₂ trên Pt — 'lá cây nhân tạo' dạng bột powder scalable không electrode phức tạp.</p>`},
{id:"pom-water-oxidation", cat:"nang-luong" , icon:"🔷", name:"Polyoxometalate Ru₄-POM WOC", sub:"Cluster vô cơ mô phỏng OEC quang hợp nhân tạo",
 facts:["[Ru₄(µ-O)₄] polyoxotungstate water oxidation catalyst","Bonnet? no — Bonchio group benchmark TOF","Molecular defined vs heterogeneous opaque advantage","Artificial leaf tandem cell integration component"],
 content:`<p>POM là 'molecule-like catalyst' xác định cấu trúc nguyên tử cho phản ứng khó nhất — oxy hóa nước; mỗi nguyên tử Ru đếm được như enzym tự nhiên.</p>`},
{id:"polymer-inclusion-membrane", cat:"polymer", icon:"🧴", name:"Polymer inclusion membrane", sub:"Màng polymer chở ion chọn lọc qua 'cửa có người gác'",
 facts:["PVC plasticizer + carrier ionophore","Selective metal extraction Cu/Li rare earth","Passive concentration gradient driven separation","Hydrometallurgy green solvent replacement"],
 content:`<p>Ionophore trong màng bắt chọn lọc ion mục tiêu đưa qua — chiết kim loại quý/rare earth không dung dịch hữu cơ độc: hydrometallurgy sạch thế hệ mới.</p>`},

/* ===== BÀO CHẾ DƯỢC HIỆN ĐẠI ===== */
{id:"plga-depot-lai", cat:"y-duoc-vl", icon:"📅", name:"PLGA depot long-acting injectable", sub:"'Tiêm một phát dùng một tháng' vi cầu polymer",
 facts:["Poly(lactic-co-glycolic acid) microspheres","Risperidone/leuprolide monthly-3month depots","Surface erosion + bulk hydrolysis kinetics","Adherence schizophrenia/contraception game changer"],
 content:`<p>Thuốc nhúng trong hạt PLGA 50 µm — polymer thủy phân chậm giải phóng thuốc đều đặn nhiều tuần. Risperidone LAI giúp tâm thần phân liệt không quên uống; leuprolide 3 tháng một mũi trị tiền liệt tuyến.</p>`},
{id:"microneedle-patch", cat:"y-duoc-vl", icon:"🪡", name:"Microneedle vaccine patch", sub:'Vaccine "dán da" kim nhỏ tan hết không đau',
 facts:["Dissolvable sugar-gel needles 600µm","Stratum corneum bypass painless","Thermostability no cold-chain potential","Georgia Tech/CMU influenza trials landmark"],
 content:`<p>Hàng trăm kim đường tan trong da — đủ dài xuyên lớp sừng, ngắn trước khi chạm dây thần kinh. Vaccine khô ổn định nhiệt, tự gửi qua thư được: tương lai tiêm chủng toàn cầu.</p>`},
{id:"dpi-lactose-carrier", cat:"duoc-pham-vl" , icon:"🌬️", name:"DPI lactose carrier inhalation", sub:"Bột hít 'chở thuốc' bằng lactose tĩnh điện",
 facts:["α-Lactose monohydrate 60-100µm carrier","Drug micronized 1-5µm adhesive blend","Inhaler shear force detaches drug to lungs","Spray-dried biologics insulin systemic trials"],
 content:`<p>Đường sữa tinh thể to 'cõng' hạt thuốc nano — lực hít mạnh tách drug khỏi carrier lắng xuống phổi. Spray drying mở đường insulin & kháng thể dạng hít cho biologics.</p>`},
{id:"chitosan-nasal-mucoadhesive", cat:"y-duoc-vl", icon:"👃", name:"Chitosan nasal mucoadhesive", sub:"Vaccines & thuốc qua mũi bám niêm mạc lâu hơn",
 facts:["Positively charged mucoadhesion mucus negative","Tight junction opening absorption enhancer","Nasal vaccine needle-free immunization","Ozoralizumab? Intranasal ketamine research delivery"],
 content:`<p>Chitosan dương điện bám màng nhầy âm điện — kéo dài thời gian tiếp xúc gấp nhiều lần, đồng thời 'mở các khớp nối' epithelial cho vaccine xịt mũi kích miễn dịch đường hô hấp.</p>`},
{id:"silicone-oil-syringe", cat:"y-duoc-vl", icon:"💉", name:"Prefilled syringe silicone oil issue", sub:"Dầu silicon bôi trơn kim bấm vs protein kết cụm",
 facts:["Siliconized barrel lubrication gliding","Protein aggregation silicone droplets interface risk","Baked-on siliconeization fluoropolymer fixes","Biologics device combination product engineering"],
 content:`<p>Bơm tiêm prefilled bôi dầu silicon để pít-tông trượt mượt — nhưng giọt oil nano khiến protein thuốc kết cụm thành hạt gây phản ứng. 'Baked silicone' phủ cố định là lời giải kỹ thuật đẹp.</p>`},

/* ===== BÀO CHẾ & CÔNG NGHỆ DƯỢC THỂ ===== */
{id:"amorphous-solid-dispersion", cat:"duoc-pham-vl", icon:"🧊", name:"Amorphous solid dispersion ASD", sub:'"Cứu" thuốc không tan bằng trạng thái vô định hình',
 facts:["Spray drying/HME polymer drug glass solution","BCS II poorly soluble 70% pipeline problem","Polymer HPMC-AS/PVP recrystallization inhibitor","Supersaturating delivery jump bioavailability ×5+"],
 content:`<p>70% thuốc mới tan kém trong nước. ASD trộn thuốc với polymer làm lạnh cực nhanh giữ dạng amorphous — năng lượng tự do cao tạo supersaturation hấp thu tăng vọt trước khi kết tinh lại.</p>`},
{id:"snedds-lipid-formulation", cat:"duoc-pham-vl", icon:"🥛", name:"SNEDDS self-nanoemulsifying", sub:"Viên nang 'tự nhũ hóa' lipid trong ruột",
 facts:["Oil+surfactant+cosolvent isotropic mix","GI fluids spontaneous nanoemulsion 20-200nm","Lipolysis digestion solubilization partner","Cyclosporine Sandimmun Neoral landmark product"],
 content:`<p>Trong ruột, viên SNEDDS tự tách thành nano-giọt dầu — cyclosporine Neoral giảm biến động nồng độ máu, tăng hiệu quả ghép thận hàng chục nghìn ca.</p>`},
{id:"cyclodextrin-inclusion", cat:"y-duoc-vl", icon:"🍩", name:"Cyclodextrin inclusion complexes", sub:"'Vòng đường' ôm phân tử kém tan thành hòa tan",
 facts:["α/β/γ-glucopyranose torus cavity 5-8Å","Hydrophobic interior guest inclusion","HPβCD injectable itraconazole voriconazole IV","Taste masking volatile retention dual uses"],
 content:`<p>Cyclodextrin là 'bánh donut đường': lòng kỵ nước ôm lấy phân tử thuốc khó tan đẩy ra môi trường nước hòa tan được — supramolecular chemistry ứng dụng dược phổ biến nhất.</p>`},
{id:"ion-exchange-resin-taste", cat:"duoc-pham-vl", icon:"🍬", name:"Ion-exchange resin taste masking", sub:"Che đắng thuốc ho cho trẻ bằng resin trao đổi ion",
 facts:["Polystyrene sulfonate drug complex reversible","Salivary pH no release swallow gastric release","Liquid pediatric antibiotics bitter solved","Dextromethorphan polistirex extended classics"],
 content:`<p>Thuốc đắng gắn vào resin — trong miệng pH trung tính không giải phóng nên không vị; tới dạ dày acid mạnh 'đòi lại' thuốc. Hóa học ion trao đổi che vị đắng hoàn hảo.</p>`},
{id:"film-coating-hpmc", cat:"duoc-pham-vl", icon:"🎬", name:"Film coating HPMC aqueous", sub:"Màng phim nước thay organic solvent truyền thống",
 facts:["HPMC/PVA aqueous spray atomized film","Masking taste + protection + branding color","Plasticizer PEG/Triethyl citrate flexibility tuning","Organic solvent environmental fire elimination"],
 content:`<p>Spray coating dung dịch polymer nước lên viên quay — màng mỏng 50µm che vị, bảo ẩm, in logo màu; loại bỏ solvent độc dễ cháy của thời trước green chemistry.</p>`},
{id:"benzalkonium-preservation", cat:"duoc-pham-vl", icon:"🧴", name:"Benzalkonium chloride preservative system", sub:'"Vệ sĩ" lọ thuốc nhiều liều chống nhiễm khuẩn',
 facts:["BAK quaternary ammonium membrane disruptor","Multi-dose eye drops 0.01% standard decades","Preservative-free unit dose preservative allergy era","Challenges USP <51> antimicrobial effectiveness test"],
 content:`<p>Mỗi lần mở lọ là cửa cho vi khuẩn — BAK quát ammonium phá màng tế bào giữ thuốc sterile 30 ngày; nhưng độc giác mạc → xu hướng preservative-free single-dose hiện đại.</p>`},
{id:"amber-glass-photoprotection", cat:"duoc-pham-vl", icon:"🟫", name:"Amber glass photoprotection", sub:"Thủy tinh nâu 'kính râm' cho thuốc sợ ánh sáng",
 facts:["Iron+ sulfur colloid absorbs UV-blue <450nm","Nitroglycerin/vitamin/chemo light-sensitive protected","USP light transmission testing standardized","Flint clear vs amber vs opothalmic grey grading"],
 content:`<p>Nhiều thuốc phân rã dưới UV — thủy tinh nâu hấp thụ bước sóng nguy hiểm như kính râm; nitroglycerin bắt buộc lọ nâu vì ánh sáng làm mất tác dụng trong giờ!</p>`},
{id:"blister-aluminum-lidding", cat:"duoc-pham-vl", icon:"📦", name:"Blister foil packaging science", sub:"Vỉ nhôm 'vừa chống trẻ vừa thân già' đồng thời",
 facts:["Alu-Al cold form barrier zero moisture O₂","Push-through vs peel push senior-friendly CR","Child-resistant regulation Poison Prevention 1970 deaths↓","Serialization track trace anti-counterfeit printing"],
 content:`<p>Vỉ nhôm nhôm chắn oxy ẩm tuyệt đối bảo thuốc 3 năm; thiết kế mở 'đẩy-xé' phải khó với trẻ 4 tuổi mà dễ với người 80 tuổi — bài toán vật liệu+lực học nhân học thú vị.</p>`},
{id:"nitrogen-blanketing-vitamin", cat:"duoc-pham-vl", icon:"💨", name:"Nitrogen blanketing oxidation control", sub:"'Trục oxy' khỏi chai vitamin & siro dễ oxy hóa",
 facts:["Head-space N₂ purge residual O₂ <2%","Omega-3/fish oil rancidity prevention essential","Ascorbic acid degradation slow dramatically","Inert gas wine pharma shared technology heritage"],
 content:`<p>Oxy là kẻ thù số 1 của dầu cá & vitamin C — xịt nitơ đuổi không khí khỏi chai trước khi đóng nắp: chi phí vài xu kéo dài hạn dùng gấp đôi. Hóa học khí inert đơn giản mà quý.</p>`}
];
