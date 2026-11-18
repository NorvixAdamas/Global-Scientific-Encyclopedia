/* ===== KHO KIẾN THỨC HÓA HỌC ===== */

/* Nhóm chức hữu cơ */
const FUNC_GROUPS = [
  {g:"Alkane", f:"R–CH₃", ex:"CH₄ (metan)", feat:"Không phân cực, trơ", app:"Khí đốt, xăng, sáp"},
  {g:"Alkene", f:"C=C", ex:"CH₂=CH₂ (ethylene)", feat:"Cộng điệnophile, polymer hóa", app:"Nhựa PE, ethanol công nghiệp"},
  {g:"Alkyne", f:"C≡C", ex:"HC≡CH (acetylene)", feat:"Axit yếu, cộng mạnh", app:"Đèn hàn oxy-acetylene 3000°C"},
  {g:"Arene", f:"C₆H₅–", ex:"Benzen, toluene", feat:"Thế electrophile aromatic", app:"Dung môi, thuốc nhuộm, aspirin"},
  {g:"Haloalkane", f:"R–X", ex:"CHCl₃, CFC", feat:"Chất leaving group tốt", app:"Gây mê cũ, dung môi, Teflon precursor"},
  {g:"Alcohol", f:"R–OH", ex:"C₂H₅OH (ethanol)", feat:"Liên kết hydro, axit/bazơ lưỡng tính", app:"Đồ uống, dung môi, khử trùng"},
  {g:"Ether", f:"R–O–R′", ex:"Diethyl ether", feat:"Trơ, dễ bay hơi", app:"Gây mê đầu tiên 1846, dung môi Grignard"},
  {g:"Aldehyde", f:"R–CHO", ex:"HCHO (formalin), vanillin", feat:"Oxy hóa dễ, phản ứng nucleophilic", app:"Bảo quản mẫu, hương vanilla"},
  {g:"Ketone", f:"R–CO–R′", ex:"Acetone", feat:"Oxy hóa khó hơn aldehyde", app:"Tẩy sơn móng, dung môi phổ biến"},
  {g:"Carboxylic acid", f:"R–COOH", ex:"CH₃COOH (giấm), citric", feat:"Axit yếu pKa ~4-5", app:"Thực phẩm, xà phòng, dược phẩm"},
  {g:"Ester", f:"R–COOR′", ex:"Ethyl acetate, isoamyl acetate", feat:"Mùi trái cây, thủy phân được", app:"Hương liệu, biodiesel, sơn"},
  {g:"Amide", f:"R–CONH₂", ex:"Paracetamol, peptide bond", feat:"Rất bền — backbone protein", app:"Nylon, kevlar, mọi enzyme"},
  {g:"Amine", f:"R–NH₂", ex:"Aniline, histamine", feat:"Bazơ yếu, mùi cá", app:"Thuốc nhuộm, dược phẩm, amino acid"},
  {g:"Nitrile", f:"R–C≡N", ex:"Acrylonitrile", feat:"C electrophile mạnh", app:"ABS nhựa, acrylic fiber, adiponitrile nylon"},
  {g:"Thiol", f:"R–SH", ex:"Ethanethiol", feat:"Mùi hôi cực mạnh (ppb!)", app:"Mùi gas tự nhiên cảnh báo rò rỉ"},
  {g:"Nitro", f:"R–NO₂", ex:"TNT, nitroglycerin", feat:"Ổn năng lượng cao", app:"Thuốc nổ, tim thuốc ngực"},
  {g:"Sulfonic acid", f:"R–SO₃H", ex:"LAS surfactant", feat:"Axit mạnh hoàn toàn", app:"Bột giặt, chất nhuộm azo"},
  {g:"Phosphate ester", f:"R–OPO₃²⁻", ex:"ATP, DNA backbone", feat:"Năng lượng & thông tin", app:"ADN/ARN, tín hiệu tế bào"}
];

/* Định luật quan trọng */
const LAWS = [
  {n:"Bảo toàn khối lượng", y:"1789", w:"Lavoisier", t:"Tổng khối lượng trước = sau phản ứng.", d:"Nền tảng cân bằng phương trình; bác bỏ thuyết phlogiston."},
  {n:"Avogadro", y:"1811", w:"Avogadro", t:"Cùng T,P: cùng thể tích khí chứa cùng số phân tử.", d:"6,022×10²³ — cầu nối thế giới vi mô ↔ vĩ mô."},
  {n:"Boyle", y:"1662", w:"Boyle", t:"P·V = const (T cố định).", d:"Định luật khí đầu tiên; bình xịp là minh họa sống."},
  {n:"Charles & Gay-Lussac", y:"1787/1802", w:"Charles, Gay-Lussac", t:"V/T = const; P/T = const.", d:"Nền cho nhiệt độ tuyệt đối Kelvin."},
  {n:"Henry", y:"1803", w:"William Henry", t:"Khí hòa tan ∝ áp suất riêng phần.", d:"Bệnh thợ lặn decompression sickness; soda fizz khi mở nắp."},
  {n:"Raoult", y:"1882", w:"François-Marie Raoult", t:"Áp suất hơi dung dịch ∝ mole fraction dung môi.", d:"Nền chưng cất & lọc nước thẩm thấu ngược."},
  {n:"Hess", y:"1840", w:"Germain Hess", t:"ΔH tổng chỉ phụ thuộc trạng thái đầu-cuối.", d:"Tính ΔH phản ứng không đo trực tiếp được."},
  {n:"Le Chatelier", y:"1884", w:"Henry Le Chatelier", t:"Hệ cân bằng dịch chuyển chống lại tác động bên ngoài.", d:"Giải thích Haber-Bosch dùng áp suất cao tăng NH₃."},
  {n:"Faraday điện phân", y:"1834", w:"Michael Faraday", t:"Khối lượng chất thoát ∝ điện lượng qua electrode.", d:"1 F = 96.485 C/mol e⁻; mạ điện & tinh luyện kim loại."},
  {n:"Arrhenius", y:"1889", w:"Svante Arrhenius", t:"k = A·e^(−Ea/RT) — nhiệt độ tăng → tốc độ tăng theo hàm mũ.", d:"Quy tắc 10°C gấp đôi tốc độ; cả mô hình CO₂ nhà kính đầu tiên!"},
  {n:"Nernst", y:"1889", w:"Walther Nernst", t:"E = E° − (RT/nF)·ln Q.", d:"Điện thế pin phụ thuộc nồng độ — pH meter, sensor oxygen lambda."},
  {n:"Beer-Lambert", y:"1729/1852", w:"Bouguer, Beer", t:"A = ε·l·c — hấp thu ∝ nồng độ & đường đi.", d:"UV-Vis spectrophotometry đo nồng độ mọi phòng lab."},
  {n:"Tuần hoàn Mendeleev", y:"1869", w:"Mendeleev", t:"Tính chất là hàm tuần hoàn của số nguyên tử.", d:"Dự đoán Ga, Sc, Ge trước khi phát hiện — chiến thắng khoa học vĩ đại."},
  {n:"Pauli loại trừ", y:"1925", w:"Wolfgang Pauli", t:"2 electron không thể cùng 4 quantum number.", d:"Giải thích cấu hình electron & bảng tuần hoàn hiện đại."},
  {n:"Hund", y:"1927", w:"Friedrich Hund", t:"Electron ưu tiên chiếm orbital riêng với spin song song.", d:"Từ tính & màu sắc ion chuyển tiếp."},
  {n:"Octet / VSEPR", y:"1916/1957", w:"Lewis, Gillespie", t:"Cặp electron đẩy nhau → hình học phân tử dự đoán được.", d:"104,5° nước, 120° CO₂ phẳng... từ vài quy tắc đơn giản."},
  {n:"Brønsted-Lowry", y:"1923", w:"Brønsted, Lowry", t:"Axit = donor H⁺; bazơ = acceptor H⁺.", d:"Mở rộng axit-bazơ ra ngoài dung dịch nước."},
  {n:"Lewis acid-base", y:"1923", w:"Gilbert Lewis", t:"Axit = acceptor cặp e⁻; bazơ = donor cặp e⁻.", d:"Bao quát mọi phản ứng phối hợp & xúc tác Lewis (AlCl₃)."},
  {n:"Gibbs energy", y:"1876", w:"J. Willard Gibbs", t:"ΔG = ΔH − TΔS < 0 thì phản ứng tự diễn ra.", d:'Ngôn ngữ "hướng đi" của mọi phản ứng hóa học.'},
  {n:"Curtin-Hammett principle", y:"1935", w:"Hammett", t:"Sản phẩm chủ đạo đến từ transition state năng lượng thấp nhất, không nhất thiết intermediate bền nhất.", d:"Cẩm nang chọn điều kiện tổng hợp hữu cơ."}
];

/* Hằng số vật lý */
const CONSTANTS = [
  {s:"N_A", n:"Số Avogadro", v:"6,02214076×10²³ mol⁻¹", d:"Số hạt trong 1 mol — chuẩn SI 2019."},
  {s:"R", n:"Hằng số khí", v:"8,314 J/(mol·K)", d:"PV = nRT; xuất hiện khắp thermodynamics."},
  {s:"F", n:"Faraday", v:"96.485 C/mol", d:"Điện tích 1 mol electron."},
  {s:"k_B", n:"Boltzmann", v:"1,380649×10⁻²³ J/K", d:"Cầu nối nhiệt độ ↔ năng lượng vi mô."},
  {s:"h", n:"Planck", v:"6,62607015×10⁻³⁴ J·s", d:"Lượng tử hóa năng lượng E = hν — khởi đầu cơ học lượng tử."},
  {s:"c", n:"Tốc độ ánh sáng", v:"2,998×10⁸ m/s", d:"E = mc² và spectroscopy."},
  {s:"e", n:"Điện tích elementary", v:"1,602176634×10⁻¹⁹ C", d:"Millikan oil drop đo 1909."},
  {s:"u", n:"Đơn vị khối lượng nguyên tử", v:"1,66054×10⁻²⁷ kg", d:"1/12 khối lượng C-12."},
  {s:"pH", n:"Thang pH Sørensen", v:"pH = −log[H⁺]", d:"1909; máu 7,4, giấm 2,5, drain cleaner 14."}
];

/* Dãy hoạt động kim loại */
const ACTIVITY_SERIES = {
  order:["K","Na","Ca","Mg","Al","Zn","Fe","Ni","Sn","Pb","(H)","Cu","Ag","Hg","Pt","Au"],
  note:"Kim loại đứng trước đẩy được ion kim loại đứng sau khỏi dung dịch muối; đứng trước H tan trong axit loãng.",
  detail:[
    "K Na Ca Mg Al — cực hoạt động, phản ứng với nước lạnh/nóng",
    "Zn Fe Ni Sn Pb — cần axit hoặc nhiệt",
    "(H) ranh giới",
    "Cu Ag Hg Pt Au — quý hiếm, chỉ tan axit oxi hóa mạnh (HNO₃, aqua regia)"
  ]
};

/* Quy tắc độ tan */
const SOLUBILITY_RULES = [
  {r:"Muối NO₃⁻, CH₃COO⁻, ClO₃⁻", s:"Tan hết", note:"Luôn tan — không có ngoại lệ thực dụng."},
  {r:"Muối Cl⁻, Br⁻, I⁻", s:"Tan", note:"Ngoại lệ: Ag⁺, Pb²⁺, Hg₂²⁺ kết tủa (phân tích định tính)."},
  {r:"Muối SO₄²⁻", s:"Tan", note:"Ngoại lệ: BaSO₄, PbSO₄, CaSO₄ ít tan."},
  {r:"Muối Na⁺, K⁺, NH₄⁺", s:"Tan hết", note:"Mọi muối amoni/alkali đều tan — nền phân bón."},
  {r:"Carbonate PO₄³⁻ S²⁻ OH⁻", s:"Kết tủa", note:"Ngoại lệ nhóm 1 & NH₄⁺; đáy hồ carbonate, ruột kết sỏi."},
  {r:"BaSO₄", s:"KHÔNG tan kể cả trong axit", note:"Vì vậy an toàn uống làm thuốc cản quang X-quang."}
];

/* Dòng thời gian hóa học */
const TIMELINE = [
  {y:"~1700 TCN", t:"Kim loại đồng thiếc — Bronze Age", d:"Con người đầu tiên 'thiết kế' hợp kim: đồng + thiếc = đồng thau cứng hơn."},
  {y:"~1000 TCN", t:"Sắt & Thời đại Sắt", d:"Luyện quặng nhiệt cao hơn — nông cụ, vũ khí thay đổi văn minh."},
  {y:"~300 TCN", t:"Aristotle — bốn nguyên tố", d:"Đất, nước, lửa, khí: mô hình vật chất thống trị 2000 năm."},
  {y:"800–1400", t:"Giả kim thuật Alchemy", d:"Jabir ibn Hayyan, Paracelsus tìm 'hòn đá triết' nhưng để lại distillation, crucible, muối axit mineral."},
  {y:"1661", t:"Boyle — The Sceptical Chymist", d:"Định nghĩa nguyên tố hiện đại lần đầu; tách hóa học khỏi giả kim."},
  {y:"1774", t:"Lavoisier — oxy & bảo toàn khối lượng", d:"'Cha hóa học hiện đại' đặt tên oxygen, viết phương trình cân bằng đầu tiên."},
  {y:"1803", t:"Dalton — thuyết nguyên tử", d:"Vật chất gồm nguyên tử; hợp chất tỷ lệ nguyên cố định."},
  {y:"1807", t:"Davy điện phân", d:"Phát hiện Na, K, Ca, Mg bằng Volta pile — sinh nhật electrochemistry."},
  {y:"1828", t:"Wöhler tổng hợp urea", d:"Vô cơ → hữu cơ: chấm dứt thuyết vitalism 'lực sống'."},
  {y:"1852", t:"Frankland — valence", d:"Khái niệm 'trị' của nguyên tố; tiền đề cấu trúc phân tử."},
  {y:"1856", t:"Perkin — mauve dye", d:"Thuốc nhuộm tổng hợp đầu tiên từ aniline — khai sinh ngành hóa chất."},
  {y:"1865", t:"Kekulé — vòng benzen", d:"Giấc mơ con rắn cắn đuôi; cấu trúc aromatic mở ra hóa hữu cơ hiện đại."},
  {y:"1869", t:"Mendeleev — Bảng tuần hoàn", d:"Sắp xếp 63 nguyên tố; bỏ trống ô dự đoán Ga, Ge, Sc — tất cả đúng!"},
  {y:"1884", t:"Le Chatelier & cân bằng", d:"Nguyên lý dịch chuyển cân bằng — chìa khóa công nghiệp hóa."},
  {y:"1896–1898", t:"Becquerel & Curie — phóng xạ", d:"Polonium, radium; mở cửa hạt nhân & y học phóng xạ."},
  {y:"1905", t:"Einstein — Brownian motion", d:"Bằng chứng định lượng sự tồn tại nguyên tử — cuối cùng ai cũng tin!"},
  {y:"1909", t:"Sørensen — thang pH", d:"Carlsberg lab; pH trở thành ngôn ngữ chung sinh học & công nghiệp."},
  {y:"1911", t:"Rutherford — hạt nhân", d:"Thí nghiệm vàng lá: nguyên tử gần như rỗng."},
  {y:"1913", t:"Bohr — mô hình nguyên tử", d:"Orbit quantized giải thích phổ hydrogen; Nobel 1922."},
  {y:"1918", t:"Haber-Bosch thương mại", d:"NH₃ công nghiệp — phân bón nuôi nửa nhân loại (và cả thuốc nổ Thế chiến I)."},
  {y:"1925–26", t:"Cơ học lượng tử", d:"Heisenberg, Schrödinger, Pauli: orbital thay orbit; hóa học thành vật lý ứng dụng."},
  {y:"1928", t:"Fleming — penicillin", d:"Nấm Penicillium nhiễm đĩa Petri; antibiotics cứu hàng trăm triệu mạng sống."},
  {y:"1935", t:"Carothers — nylon", d:"Polymer tổng hợp thương mại đầu tiên; tất nữ giới gây sốc toàn cầu."},
  {y:"1938", t:"Plunkett — PTFE tình cờ", d:"Gas trong bình bị 'biến mất' thành bột trắng — Teflon chào đời."},
  {y:"1939", t:"Meitner/Frisch/Hahn — phân hạch", d:"Uranium split; Manhattan Project và kỷ nguyên hạt nhân."},
  {y:"1953", t:"Watson-Crick-Franklin — DNA helix", d:"Ảnh X-ray Photo 51; bản thiết kế sự sống. Nobel 1962."},
  {y:"1962", t:"Pedersen — crown ether", d:"Host-guest chemistry — supramolecular Nobel 1987."},
  {y:"1965", t:"Woodward tổng hợp vitamin B₁₂", d:"Tổng hợp hữu cơ đỉnh cao; 99 bước, 11 năm, 100 postdoc."},
  {y:"1969", t:"Apollo 11 lấy mẫu Mặt Trăng", d:"Lunar geology — hóa học vô cơ ngoài Trái Đất."},
  {y:"1985", t:"Fullerene C₆₀ phát hiện", d:"Smalley/Curl/Kroto; Nobel 1996; mở kỷ nguyên nano."},
  {y:"1991", t:"Iijima — carbon nanotube", d:"CNT dưới kính TEM; vật liệu bền nhất từng biết."},
  {y:"1995", t:"BEC — Bose-Einstein condensate", d:"Cornell/Wieman làm lạnh 170 nK; 'trạng thái vật chất thứ 5'."},
  {y:"2004", t:"Geim/Novoselov — graphene", d:"Băng keo Scotch tape tách lớp carbon; Nobel 2010 chỉ 6 năm sau."},
  {y:"2009–2020s", t:"Perovskite solar bùng nổ", d:"3,8% → 26% trong một thập kỷ — tốc độ chưa từng có."},
  {y:"2012", t:"CRISPR-Cas9", d:"Doudna/Charpentier 'kéo cắt DNA'; Nobel 2020; liệu pháp gene đã ra lò."},
  {y:"2020", t:"Vaccine mRNA 42 ngày thiết kế", d:"Hóa học lipid nanoparticle — Pfizer/BioNTech Moderna cứu đại dịch."},
  {y:"2023", t:"AI AlphaFold dự đoán protein", d:"Baker/Hassabis/Jumper Nobel Hóa 2024 — 200 triệu cấu trúc miễn phí."},
  {y:"2024→", t:"Green hydrogen & carbon capture", d:"Elektrolysis giá rẻ, MOF bắt CO₂ — hóa học cứu khí hậu."}
];

/* ===== BỔ SUNG MỞ RỘNG ===== */

/* Định luật bổ sung */
const LAWS_EXTRA = [
  {n:"Dalton áp suất riêng phần", y:"1801", w:"John Dalton", t:"P_total = Σ Pᵢ (mỗi khí đóng góp độc lập).", d:"Tính khí hỗn hợp; hơi nước trong không khí ẩm."},
  {n:"Graham khuếch tán", y:"1848", w:"Thomas Graham", t:"Tốc độ khuếch tán ∝ 1/√M (khối lượng phân tử).", d:"Làm giàu uranium UF₆ thế kỷ XX; mùi tỏi lan nhanh hơn hương nước hoa."},
  {n:"Henderson-Hasselbalch", y:"1908", w:"Henderson, Hasselbalch", t:"pH = pKa + log([bazơ liên hợp]/[axit]).", d:'Công thức "thánh" pha buffer mọi phòng lab & công thức máu.'},
  {n:"Markovnikov", y:"1869", w:"Vladimir Markovnikov", t:"H⁺ cộng vào carbon nhiều H hơn trong alkene bất đối xứng.", d:"Dự đoán sản phẩm cộng; ngoại lệ anti-Markovnikov peroxide effect."},
  {n:"Zaitsev", y:"1875", w:"Alexander Zaitsev", t:"Elimination ưu tiên alkene thế nhiều hơn (bền hơn).", d:"Chọn base cồng kềnh (t-BuOK) để đảo ngược thành Hofmann product."},
  {n:"Woodward-Hoffmann", y:"1965", w:"Woodward, Hoffmann", t:"Đối xứng orbital quyết định cho phép/cấm phản ứng vòng.", d:"Giải thích Diels-Alder nhiệt cho phép, quang hóa ngược lại; Nobel 1965."},
  {n:"Hammett equation", y:"1937", w:"Louis Hammett", t:"log(k/k₀) = ρσ — tốc độ tuyến tính theo substituent constant.", d:"'Kính hiển vi cơ chế': đo ρ biết có carbocation hay không."},
  {n:"Trouton rule", y:"1884", w:"Frederick Trouton", t:"ΔS_vap ≈ 85–88 J/mol·K cho đa số chất lỏng.", d:"Ước ΔH bay hơi chỉ từ điểm sôi — mẹo tính nhanh thermodynamics."},
  {n:"Kirchhoff thermochemistry", y:"1858", w:"Gustav Kirchhoff", t:"ΔH phản ứng thay đổi theo nhiệt độ theo ΔCp.", d:"Nội suy ΔH từ 25°C lên nhiệt độ lò phản ứng công nghiệp."},
  {n:"Eyring transition state", y:"1935", w:"Henry Eyring", t:"k = (k_BT/h)·e^(−ΔG‡/RT).", d:"Thermodynamics của transition state — 'ảnh chụp' khoảnh khắc phản ứng."}
];

/* Ion đa nguyên tử */
const POLYATOMIC_IONS = [
  {i:"NH₄⁺", n:"Amoni", note:"Phân đạm mọi loại; mùi khai amoniac."},
  {i:"OH⁻", n:"Hydroxide", note:"Bazơ mạnh; định nghĩa pH & pOH."},
  {i:"NO₃⁻", n:"Nitrate", note:"Muối tan hết; ô nhiễm nước ngầm nông nghiệp."},
  {i:"NO₂⁻", n:"Nitrite", note:"Giữ màu thịt nguội; E250 tranh cãi sức khỏe."},
  {i:"SO₄²⁻", n:"Sulfate", note:"H₂SO₄ muối; thạch cao CaSO₄·2H₂O."},
  {i:"SO₃²⁻", n:"Sulfite", note:"E221-228 bảo quản rượu vang — dị ứng 'wine headache'."},
  {i:"CO₃²⁻", n:"Carbonate", note:"Đá vôi, vỏ trứng, độ cứng nước."},
  {i:"HCO₃⁻", n:"Bicarbonate", note:"Baking soda; buffer máu sống còn."},
  {i:"PO₄³⁻", n:"Phosphate", note:"Backbone ADN/ATP; phân bón NPK."},
  {i:"ClO⁻", n:"Hypochlorite", note:"Nước Javel NaClO khử trùng nhà cửa."},
  {i:"ClO₂⁻ / ClO₃⁻ / ClO₄⁻", n:"Chlorite/chlorate/perchlorate", note:"Thuốc tẩy bột giấy → thuốc nổ rocket oxidizer."},
  {i:"MnO₄⁻", n:"Permanganate", note:"KMnO₄ tím oxy hóa mạnh; test độ sạch nước."},
  {i:"CrO₄²⁻ / Cr₂O₇²⁻", n:"Chromate/dichromate", note:"Vàng ↔ cam đổi màu theo pH; K₂Cr₂O₄ oxy hóa lab."},
  {i:"CN⁻", n:"Cyanide", note:"Độc chết người chặn cytochrome c oxidase; mùi hạnh nhân."},
  {i:"SCN⁻", n:"Thiocyanate", note:"Fe³⁺ + SCN⁻ → đỏ máu — test kinh điển."},
  {i:"C₂O₄²⁻", n:"Oxalate", note:"Rau muống, rau dền — gây 'khó tiêu canxi' dân gian."},
  {i:"CH₃COO⁻", n:"Acetate", note:"Giấm ăn; buffer axit acetic."},
  {i:"S₂O₃²⁻", n:"Thiosulfate", note:"Fixer nhiếp ảnh; giải độc cyanide!"},
  {i:"O₂²⁻ / O₂⁻", n:"Peroxide/superoxide", note:"Na₂O₂ tự thở tàu ngầm: CO₂ + Na₂O₂ → O₂."},
  {i:"N₃⁻", n:"Azide", note:"NaN₃ airbag; cực độc như cyanide."},
  {i:"CrO₅", n:"Cromium peroxide xanh lam", note:"Test H₂O₂ ether layer 'blue flash' đẹp nhất lab."},
  {i:"BF₄⁻ / PF₆⁻", n:"Tetrafluoroborate/hexafluorophosphate", note:"Anion 'trơ' của electrolyte pin lithium LiPF₆."},
  {i:"IO₃⁻", n:"Iodate", note:"KIO₃ trộn muối iốt ổn định nhiệt đới hơn KI."},
  {i:"BrO₃⁻", n:"Bromate", note:"Phụ phẩm khử trùng nước — carcinogen giới hạn ppb."},
  {i:"AsO₄³⁻", n:"Arsenate", note:"Mô phỏng phosphate → độc; gạo & giếng Bangladesh."},
  {i:"SeO₃²⁻/SeO₄²⁻", n:"Selenite/selenate", note:"Cửa sổ dinh dưỡng-độc cực hẹp của selenium."},
  {i:"MnO₄²⁻", n:"Manganate xanh lục", note:"Trung gian không bền tự disproportionation sang permanganate."},
  {i:"VO₂⁺/VO²⁺", n:"Vanadyl redox couple", n:"", note:"Pin flow vanadium: vàng ↔ xanh đổi màu theo trạng thái sạc."},
  {i:"ReO₄⁻", n:"Perrhenate", note:"'Permanganate hiền' — analog rhenium ít oxy hóa hơn."},
  {i:"RuO₄", n:"Ruthenium tetroxide", note:"Oxy hóa mạnh nguy hiểm — oxidizer 'quá mức' hiếm dùng."},
  {i:"UO₂²⁺", n:"Uranyl", n:"", note:"Ion uranium di động phát quang xanh trong nước — tracer môi trường."}
];

/* Độ mạnh axit – bazơ */
const ACID_BASE_TABLE = [
  {s:"HClO₄", type:"axit", pk:"−10", note:"Axit mạnh nhất thông dụng; perchloric explosive với hữu cơ."},
  {s:"HI / HBr / HCl", type:"axit", pk:"−10 / −9 / −7", note:"Halogen acid mạnh hoàn toàn trong nước."},
  {s:"HNO₃", type:"axit", pk:"−1.4", note:"Oxy hóa kim loại quý; aqua regia thành phần."},
  {s:"H₂SO₄", type:"axit", pk:"−3 (pKa₁)", note:"Dehydrating agent — đường + H₂SO₄ = than đen!"},
  {s:"H₃PO₄", type:"axit", pk:"2.15 / 7.20 / 12.35", note:"Triprotic cola acidity; rust converter."},
  {s:"HF", type:"axit", pk:"3.17", note:"Yếu nhưng NGUYÊN HIỂM nhất — xuyên da tấn công canxi xương."},
  {s:"CH₃COOH", type:"axit", pk:"4.76", note:"Giấm ăn; buffer acetate chuẩn."},
  {s:"H₂CO₃", type:"axit", pk:"6.35 / 10.33", note:"Buffer máu; soda fizz."},
  {s:"NH₄⁺", type:"axit", pk:"9.25", note:"Axit liên hợp của NH₃; phân amoni."},
  {s:"C₂H₅OH", type:"axit", pk:"16", note:"Rượu là axit yếu hơn nước một chút!"},
  {s:"NaOH / KOH", type:"bazơ", pk:"pKb ~ −0.8", note:"Bazơ kiềm mạnh — 'lye' làm xà phòng."},
  {s:"Ca(OH)₂", type:"bazơ", pk:"pKb ~ −0.4", note:"Vôi tôi; nước vôi trong test CO₂."},
  {s:"NH₃", type:"bazơ", pk:"pKb 4.75", note:"Bazơ yếu duy nhất gia đình; window cleaner."},
  {s:"Na₂CO₃ / NaHCO₃", type:"bazơ", pk:"pKb 3.75 / 7.6", note:"Soda ash & baking soda — bazơ an toàn bếp."},
  {s:"Pyridine C₅H₅N", type:"bazơ", pk:"pKb 8.8", note:"Bazơ hữu cơ chuẩn; mùi cá ươn đặc trưng."},
  {s:"Acetate CH₃COO⁻", type:"bazơ", pk:"pKb 9.25", note:"Bazơ liên hợp giấm; buffer đôi với acetic acid."},
  {s:"Citric acid", type:"axit", pk:"3.1 / 4.8 / 6.4", note:"Triprotic chanh — buffer 3 vùng; 'sour salt' thực phẩm."},
  {s:"Lactic acid", type:"axit", pk:"3.86", note:'Sour milk & "acid burn cơ" myth — lactate là fuel, không phải rác!'},
  {s:"Formic acid", type:"axit", pk:"3.75", n:"", note:"Kiến đỏ cắn = formic; rocket oxidizer research HCOOH."},
  {s:"Benzoic acid E210", type:"axit", pk:"4.2", note:"Preservative hiệu quả chỉ pH<4.5 — food tech principle."},
  {s:"Sorbic acid E200", type:"axit", pk:"4.76", note:"Chống nấm mốc phô mai/rượu vang an toàn nhất."},
  {s:"TFA", type:"axit", pk:"−0.25", n:"", note:"Axit hữu cơ mạnh — cleave peptide resin synthesis."},
  {s:"TRIS buffer", type:"bazơ", pk:"pKa 8.1 (temp-shift!)", note:"Buffer sinh học phổ biến; pH đổi 0.03/°C — lưu ý 4°C vs 37°C."},
  {s:"HEPES/MOPS Good buffers", type:"zwitterion buffer", pk:"7.5 / 7.2", note:"Good 1966 thiết kế buffer 'lý tưởng' nuôi tế bào cách mạng."},
  {s:"Phosphate buffer", type:"bazơ/axit", pk:"pKa₂ 7.21", note:"Gần pH máu 7.4 — chuẩn hemoglobin function studies."}
];

/* Kỹ thuật phân tích hiện đại */
const ANALYTICAL_TECHNIQUES = [
  {t:"NMR (^1H, ^13C)", what:"Nguyên tử trong từ trường hấp thu RF", info:"Xác định cấu trúc hữu cơ #1; MRI là anh em y tế.", fun:"MRI = NMR đổi tên để đỡ sợ chữ 'nuclear'!"},
  {t:"Mass Spectrometry (MS)", what:"Ion hóa + đo m/z", info:"Khối lượng chính xác ppm; LC-MS/MS dược pharmacokinetics.", fun:"Nobel ×4 (Thomson, Aston, Paul, Fenn/Tanaka, Karas/MALDI)"},
  {t:"FTIR", what:"Hấp thu hồng ngoại rung bond", info:"Fingerprint vùng 1500-500 cm⁻¹ nhận diện polymer/nhựa nhanh nhất.", fun:"Polyme tái chế phân loại bằng IR handheld trong 1 giây."},
  {t:"Raman", what:"Tán xạ không đàn hồi laser", info:"Bổ sung IR (symmetric bonds); đo qua túi thủy tinh/không cần lấy mẫu.", fun:"Curiosity rover Mars dùng Raman tìm carbon trên Sao Hỏa."},
  {t:"UV-Vis", what:"Hấp thu điện tử UV/Visible", info:"Beer-Lambert định lượng rẻ nhất; DNA 260 nm protein 280 nm.", fun:"OD260/280 ratio 1.8 = DNA sạch chuẩn mọi lab sinh học."},
  {t:"XRD", what:"Nhiễu xạ tia X tinh thể", info:"Vua cấu trúc tinh thể; DNA helix Photo 51 Franklin.", fun:">100.000 cấu trúc protein PDB đều nhờ XRD/cryo-EM."},
  {t:"XRF", what:"Huỳnh quang X phát ra khi bắn X", info:"Handheld đo quặng tại mỏ, vàng giả, RoHS compliance.", fun:"Soi cổ vật bảo tàng không phá mẫu — archaeometry."},
  {t:"SEM", what:"Electron quét bề mặt", info:"Zoom 100.000×; nhìn nanostructure, vi nhựa, tế bào.", fun:"Ảnh 'snowflake crystal' đẹp mọi nơi đều SEM."},
  {t:"TEM", what:"Electron xuyên qua mẫu siêu mỏng", info:"Độ phân giải nguyên tử; nhìn graphene lattice trực tiếp.", fun:"Nobel 1986 electron microscopy Ernst/Ruska."},
  {t:"AFM", what:"Kim tip quét lực nguyên tử", info:"Bề mặt 3D cả vật liệu cách điện; force spectroscopy single bond.", fun:"IBM 1989 viết 'IBM' bằng 35 nguyên tử xenon!"},
  {t:"HPLC/UPLC", what:"Sắc ký lỏng áp suất cao", info:"Tách & định lượng dược phẩm, vitamin, pesticide residue.", fun:"Quả tim HPLC chạy 24/7 trong mọi phòng kiểm nghiệm thuốc."},
  {t:"GC-MS", what:"Sắc ký khí + MS", info:"Doping thể thao, chất gây nghiện, hương liệu, arson debris.", fun:"Olympic lab anti-doping phát hiện steroid ppb level."},
  {t:"ICP-MS/OES", what:"Plasma 10.000K ion hóa kim loại", info:"Đo 70+ nguyên tố đồng thời ppt level; heavy metal trong gạo/cá.", fun:"Arsenic trong nước đá vụn từng làm scandal thực phẩm nhờ ICP-MS."},
  {t:"Cyclic Voltammetry", what:"Quét điện thế đo dòng redox", info:"Nghiên cứu electrode pin, sensor glucose, electrocatalyst.", fun:"Glucose meter của bạn là mini-electrochemist trong lòng bàn tay."},
  {t:"TGA/DSC", what:"Nhiệt phân & dòng nhiệt theo T", info:"Độ ẩm, filler content, glass transition, crystallinity polymer.", fun:"DSC chocolate tempering quality control Nestlé."},
  {t:"CHNS Elemental", what:"Đốt mẫu đo C/H/N/S", info:"Kiểm tra purity compound tổng hợp trước NMR.", fun:"Mỗi paper tổng hợp hữu cơ đều bắt đầu bằng con số CHNS."},
  {t:"EPR/ESR", what:"Resonance spin electron tự do", info:"Radical, defect, dosimetry; dating tooth enamel 500k năm.", fun:"Free radical aging theory được đo trực tiếp bằng EPR."},
  {t:"Cryo-EM", what:"Electron cryo microscope protein đông", info:"Resolution revolution Nobel 2017; COVID spike protein structure 2020.", fun:"AlphaFold dự đoán + cryo-EM xác nhận = combo cấu trúc hiện đại."},
  {t:"GC×GC 2D", what:"Sắc ký khí 2 chiều toàn diện", info:"Petroleum fingerprint hàng nghìn peak tách đủ — 'map hóa học' dầu mỏ.", fun:"Mùi rượu vang ~1000 hợp chất được GC×GO? GC×GC đếm từng chất!"},
  {t:"SEC/GPC", what:"Sắc ký thấm gel đo phân bố MW", info:"Polymer molecular weight distribution Mn/Mw/PDI chuẩn ngành nhựa.", fun:"PDI <1.05 = polymer 'sống' precision như protein."},
  {t:"DLS/Zeta", what:"Tán xạ ánh sáng động đo size & charge", info:"Nano formulation QC: size distribution + zeta potential stability.", fun:"Zeta >|30| mV colloid bền — công thức 'vàng' mọi lab nano."},
  {t:"XPS", what:"Quang phổ điện tử photoelectron X", info:"Elemental + oxidation state surface 10nm; battery interface degradation.", fun:"XPS đọc 'trạng thái oxy hóa' từng nguyên tử trên bề mặt pin chai."},
  {t:"FTIR microscope mapping", what:"IR imaging không gian", info:"Microplastic identification environmental forensics từng hạt.", fun:"Soi 1 hạt vi nhựa trong cát biển — FTIR microscope đọc polymer identity."},
  {t:"Confocal Raman imaging", what:"Raman scan 3D tế bào/mô", info:"Tumor margin surgery guidance research; drug distribution in tissue.", fun:"Raman 'đọc' thuốc nằm ở đâu trong viên nén không phá mẫu."},
  {t:"Neutron activation", what:"Bắn neutron đo gamma phát ra", info:"Archaeometry provenance obsidian/coin ancient trade routes non-destructive.", fun:"Truy nguồn đá obsidian công cụ đá cách nhau 500km nhờ NAA!"}
];

/* Nhánh hóa học */
const CHEM_BRANCHES = [
  {b:"Hóa hữu cơ", d:"Cấu trúc/tổng hợp hợp chất carbon", ex:"Dược phẩm, polymer, hương liệu"},
  {b:"Hóa vô cơ", d:"Mọi nguyên tố ngoài carbon (gần như)", ex:"Chất xúc tác, kim loại, khoáng"},
  {b:"Hóa lý", d:"Thermodynamics, kinetics, quantum", ex:"Pin efficiency, reaction rate design"},
  {b:"Hóa phân tích", d:"Đo & xác định thành phần", ex:"Kiểm nghiệm thuốc, forensic, môi trường"},
  {b:"Hóa sinh", d:"Hóa học của sự sống", ex:"Enzyme, metabolic pathway, drug target"},
  {b:"Polymer science", d:"Macromolecule synthesis & properties", ex:"Nhựa, cao su, fiber, adhesive"},
  {b:"Materials science", d:"Cấu trúc-vật liệu-tính năng", ex:"Superalloy, semiconductor, nanomaterial"},
  {b:"Medicinal chemistry", d:"Thiết kế phân tử thuốc", ex:"QSAR, lead optimization, prodrug"},
  {b:"Environmental chemistry", d:"Hóa học trong đất-nước-khí", ex:"Pollutant fate, remediation, climate"},
  {b:"Nuclear/Radiochemistry", d:"Hạt nhân & isotope", ex:"Y học hạt nhân, dating, energy"},
  {b:"Computational chemistry", d:"Mô phỏng phân tử bằng máy tính", ex:"DFT, molecular dynamics, AlphaFold era"},
  {b:"Supramolecular chemistry", d:"Hóa học 'vượt phân tử' host-guest", ex:"Crown ether, MOF, self-assembly"},
  {b:"Organometallic chemistry", d:"Bond metal-carbon", ex:"Grignard, catalyst coupling, metallocene"},
  {b:"Electrochemistry", d:"Electron transfer tại electrode", ex:"Pin, mạ điện, corrosion, sensor"},
  {b:"Photochemistry", d:"Ánh sáng kích hoạt phản ứng", ex:"Photovoltaics, phototherapy, vision"},
  {b:"Food chemistry", d:"Thành phần & biến đổi thực phẩm", ex:"Flavor chemistry, preservation, nutrition"},
  {b:"Forensic chemistry", d:"Hóa học pháp y", ex:"Toxicology, drug ID, arson, fingerprints"},
  {b:"Astrochemistry", d:"Hóa học vũ trụ", ex:"Interstellar molecules, planet formation"}
];

/* Khái niệm lý thuyết nền tảng */
const THEORY_CONCEPTS = [
  {c:"Orbital phân tử (MO theory)", e:"Electron delocalize toàn phân tử; bond order = (bonding−antibonding)/2", w:"Giải thích O₂ paramagnetic mà Lewis structure không làm nổi."},
  {c:"Hybridization sp/sp²/sp³", e:"Trộn orbital tạo hình học tetrahedral/trigonal/linear", w:"109,5° methan đến 180° CO₂ — geometry từ vài quy tắc."},
  {c:"Resonance & delocalization", e:"Cấu trúc thật = hybrid các form Lewis", w:"Benzen ổn định 150 kJ/mol nhờ aromatic delocalization."},
  {c:"Aromaticity Hückel", e:"Planar, cyclic, (4n+2) π electron → aromatic ổn định", w:"Giải thích benzene vs cyclobutadiene; graphene aromatic 2D."},
  {c:"Chirality & enantiomer", e:"Mirror image không chồng khớp — 'bàn tay trái/phải'", w:"Thalidomide tragedy 1960s; enantiomer thuốc khác tác dụng sinh học."},
  {c:"HSAB (Pearson)", e:"Hard acids prefer hard bases, soft prefer soft", w:"Dự đoán stability complex; AgI insoluble vì soft-soft."},
  {c:"HOMO-LUMO gap", e:"Frontier orbital quyết định reactivity & màu sắc", w:"Gap nhỏ → màu đậm; gap lớn → trong suốt; OLED engineering core."},
  {c:"Kinetic vs Thermodynamic control", e:"Sản phẩm nhanh ≠ sản phẩm bền", w:"-80°C kinetic product, +40°C thermodynamic — chọn điều kiện chọn sản phẩm."},
  {c:"Hammond postulate", e:"TS giống species gần nó về năng lượng", w:"Exothermic → TS giống reactant; đọc được TS từ energetics."},
  {c:"Microscopic reversibility", e:"Đường đi thuận = nghịch đảo chi tiết", w:"Biết cơ chế esterification là biết cơ chế hydrolysis ngược."},
  {c:"Isotope effect (KIE)", e:"C-H bond vỡ chậm hơn C-D ~7×", w:"Công cụ chẩn đoán bước rate-determining trong cơ chế."},
  {c:"Hydrophobic effect", e:"Entropy nước đẩy chất kị nước lại gần nhau", w:"Fold protein, membrane lipid bilayer — entropy-driven assembly."},
  {c:"Transition state theory (Eyring)", e:"Phản ứng qua 'đỉnh núi' năng lượng ΔG‡", w:"Catalyst hạ đỉnh núi chứ không đổi điểm cuối."},
  {c:"DFT & computational chemistry", e:"Density functional tính năng lượng từ mật độ electron", w:"Screening vật liệu pin/catalyst in silico trước khi vào lab."},
  {c:"Hyperconjugation", e:"σ-bond electron delocalize vào p-orbital trống", w:"Vì sao ethyl carbocation bền hơn methyl — 'no-bond resonance'."},
  {c:"Inductive vs Mesomeric effect", e:"+I/−I kéo đẩy qua σ; +M/−M qua π delocalization", w:"Bảng substituent constant σ của Hammett sinh ra từ đây."},
  {c:"Tautomerism keto–enol", e:"H di chuyển C↔O đổi vị trí double bond cân bằng", w:"Acetoacetate synth: enolate 'đứng trên cả hai chân' — synthetic workhorse."},
  {c:"Stereoelectronic antiperiplanar", e:"E2 yêu cầu β-H và leaving group anti-coplanar 180°", w:"Geometry quyết định tốc độ — cyclohexane chỉ E2 khi H axial!"},
  {c:"Baldwin's rules ring closure", e:"3-exo-tet favored · 5-endo-trig disfavored… bảng tra", w:"Dự đoán cyclization nào 'cho phép' trước khi tổng hợp vòng."},
  {c:"Thorpe-Ingold gem-dimethyl", e:"2 nhóm methyl cùng carbon 'gập' chain tăng cyclization", w:"Thêm gem-dimethyl → vòng khép nhanh ×100 — molecular conformation trick."},
  {c:"Felkin-Anh vs chelation control", e:"Nucleophile tấn công mặt ít cản (hoặc chelated metal side)", w:"Chọn solvent/Lewis acid chọn diastereomer — asymmetric induction playbook."},
  {c:"Möbius aromaticity", e:"Vòng twisted 4n π electron vẫn aromatic nếu Möbius topology", w:"Heilbronner dự đoán 1964, tổng hợp xác nhận 2003 — toán học thành phân tử."},
  {c:"σ-Aromaticity", e:"Cluster kim loại Li₃⁺/Al₄²⁻ vòng σ aromatic!", w:"Aromaticity không chỉ dành cho π — kim loại cũng 'nghe nhạc Hückel'."}
];

/* Nguyên tố lý thuyết Z=119+ */
const SUPERHEAVY_THEORY = [
  {z:119, sym:"Uue", name:"Ununennium", cat:"alkali", group:1, period:8, pred:"Kim loại kiềm siêu nặng, có thể lỏng ở RT; bán thọ <1 µs dự đoán."},
  {z:120, sym:"Ubn", name:"Unbinilium", cat:"alkaline", group:2, period:8, pred:"Ức viên mục tiêu nhiều lab (Ti/Cf beams); relativity làm hành vi lạ."},
  {z:121, sym:"Ubu", name:"Unbiunium", cat:"transition", group:3, period:8, pred:"Khởi đầu 'superactinide'; electron 5g đầu tiên xuất hiện?"},
  {z:122, sym:"Ubb", name:"Unbibium", cat:"transition", group:4, period:8, pred:"Có thể giống thorium hơn zirconium do hiệu ứng tương đối tính."},
  {z:124, sym:"Ubq", name:"Unbiquadium", cat:"transition", group:4, period:8, pred:"Island of stability candidate quanh N=184."},
  {z:126, sym:"Ubh", name:"Unbihexium", cat:"actinide", group:3, period:8, pred:"Magic number Z=126 (như Pb=82) — 'holy grail' island of stability; half-life có thể ngày-năm!"}
];

/* Timeline bổ sung */
const TIMELINE_EXTRA = [
  {y:"1932", t:"Chadwick — neutron", d:"Miếng ghép cuối atomic nucleus; mở đường fission & isotope science."},
  {y:"1937", t:"Technetium — nguyên tố nhân tạo đầu tiên", d:"Perrier-Segrè lấp khoảng trống bảng tuần hoàn số 43."},
  {y:"1952", t:"Miller-Urey thí nghiệm sự sống", d:"Tia sét nguyên thủy + khí = amino acid — abiogenesis chemistry."},
  {y:"1955", t:"Sanger sequencing insulin", d:"Protein sequence đầu tiên; Nobel 1958 rồi lần 2 năm 1980 DNA."},
  {y:"1965", t:"Woodward-Hoffmann rules", d:"Orbital symmetry — hóa lý lý thuyết điều khiển tổng hợp thực tế."},
  {y:"1981", t:"STM — scanning tunneling microscope", d:"IBM Zurich Nobel 1986; lần đầu 'nhìn thấy' & di chuyển nguyên tử."},
  {y:"1986", t:"Bednorz-Müller high-Tc cuprate", d:"Siêu dẫn 30K phá trần lý thuyết; Nobel chỉ 1 năm sau — kỷ lục tốc độ."},
  {y:"1983", t:"Mullis PCR", d:"Copy DNA exponential trong ống test; Nobel 1993, nền PCR test COVID."},
  {y:"2000", t:"Conductive polymers Nobel", d:"Heeger/MacDiarmid/Shirakawa — nhựa dẫn điện mở OLED/solar flexible."},
  {y:"2014", t:"Super-resolution microscopy Nobel", d:"Betzig/Hell/Moerner vượt giới hạn ánh sáng — xem protein sống động."},
  {y:"2017", t:"Cryo-EM resolution revolution Nobel", d:"Dubochet/Frank/Henderson — protein structure không cần crystal."},
  {y:"2021", t:"Asymmetric organocatalysis Nobel", d:"List/MacMillan — catalyst organic metal-free chirality."},
  {y:"2023", t:"Quantum dots Nobel", d:"Bawendi/Brus/Ekimov — nanocrystal size-tuned color QLED TV."},
  {y:"2023", t:"mRNA vaccine Nobel Y khoa", d:"Karikó/Weissman nucleoside modification — hóa học RNA cứu đại dịch."}
];

/* ===== BỔ SUNG ĐỢT 2 ===== */

/* Nobel Hóa học tiêu biểu */
const NOBEL_CHEMISTRY = [
  {y:1901, w:"Jacobus van't Hoff", c:"Động lực hóa học & áp suất thẩm thấu", n:"Nobel hóa học đầu tiên lịch sử."},
  {y:1903, w:"Svante Arrhenius", c:"Lý thuyết ion hóa điện ly", n:"Luận án từng bị chấm điểm D!"},
  {y:1909, w:"Wilhelm Ostwald", c:"Xúc tác, cân bằng, tốc độ phản ứng", n:"Cha đẻ ngành hóa lý hiện đại."},
  {y:1918, w:"Fritz Haber", c:"Tổng hợp amoniac từ N₂ & H₂", n:"Nuôi nửa nhân loại — và cả vũ khí khí độc gây tranh cãi."},
  {y:1935, w:"Frédéric & Irène Joliot-Curie", c:"Tạo phóng xạ nhân tạo", n:"Gia đình Curie — 4 Nobel trong một dòng họ."},
  {y:1944, w:"Otto Hahn", c:"Phát hiện phân hạch hạt nhân nặng", n:"Meitner bị bỏ sót — case study thiên lệch Nobel."},
  {y:1948, w:"Arne Tiselius", c:"Điện di & adsorption analysis protein", n:"Nền tảng electrophoresis mọi phòng lab sinh học."},
  {y:1954, w:"Linus Pauling", c:"Bản chất liên kết hóa học", n:"Duy nhất 2 Nobel đơn (Hóa + Hòa bình); mô hình orbital valence."},
  {y:1958, w:"Frederick Sanger", c:"Cấu trúc insulin", n:"Sau đó Nobel 1980 nữa — 2 lần cho sequencing."},
  {y:1962, w:"Max Perutz & John Kendrew", c:"Cấu trúc globular protein", n:"Hemoglobin & myoglobin bằng X-ray đầu tiên."},
  {y:1964, w:"Dorothy Hodgkin", c:"Cấu trúc penicillin & B₁₂", n:"Nữ Nobel hóa học thứ 3; xác định cấu trúc insulin 35 năm."},
  {y:1965, w:"Robert Burns Woodward", c:"Tổng hợp hữu cơ nghệ thuật", n:"Quinine, cholesterol, chlorophyll… 'Woodward rules'."},
  {y:1973, w:"Geoffrey Wilkinson & Ernst Fischer", c:"Hóa học organometallic sandwich", n:"Ferrocene mở cả lĩnh vực mới."},
  {y:1976, w:"William Lipscomb", c:"Cấu trúc boranes", n:"Liên kết 3 tâm 2 electron kỳ lạ."},
  {y:1987, w:"Pedersen, Lehn, Cram", c:"Hóa supramolecular host-guest", n:'"Phân tử nhận biết phân tử" — nền MOF/drug delivery.'},
  {y:1993, w:"Kary Mullis & Michael Smith", c:"PCR & site-directed mutagenesis", n:"PCR thay đổi mọi thứ: y khoa, pháp y, khảo cổ."},
  {y:1995, w:"Crutzen, Molina, Rowland", c:"Ozone depletion chemistry CFC", n:"Cảnh báo sớm cứu tầng ozone qua Montreal Protocol."},
  {y:2000, w:"Heeger, MacDiarmid, Shirakawa", c:"Polymer dẫn điện", n:"Nhựa cũng dẫn điện — OLED/solar flexible khởi nguồn."},
  {y:2001, w:"Knowles, Noyori, Sharpless", c:"Hydrogenation/oxidation đối xứng", n:"'Chiral hand' của công nghiệp thuốc."},
  {y:2005, w:"Chauvin, Grubbs, Schrock", c:"Metathesis olefin", n:"'Đổi partner' alkene — catalyst Ru carbene vạn năng."},
  {y:2008, w:"Shimomura, Chalfie, Tsien", c:"Green fluorescent protein GFP", n:"Đèn huỳnh quang soi sống tế bào — revolution imaging."},
  {y:2010, w:"Heck, Negishi, Suzuki", c:"Palladium-catalyzed cross coupling", n:"Backbone tổng hợp thuốc hiện đại toàn cầu."},
  {y:2012, w:"Lefkowitz & Kobilka", c:"GPCR receptors", n:"~40% thuốc thị trường nhắm vào GPCR."},
  {y:2015, w:"Lindahl, Modrich, Sancar", c:"DNA repair mechanisms", n:"Giải mã hệ thống 'sửa lỗi' ADN chống ung thư."},
  {y:2016, w:"Sauvage, Stoddart, Feringa", c:"Máy móc phân tử", n:"Xe nano, thang DNA — 'chemistry in motion' Nobel."},
  {y:2017, w:"Dubochet, Frank, Henderson", c:"Cryo-electron microscopy", n:"Resolution revolution nhìn protein sống động."},
  {y:2018, w:"Arnold, Smith, Winter", c:"Tiến hóa định hướng enzyme & phage display", n:"Directed evolution — enzyme 'trồng' như cây."},
  {y:2019, w:"Goodenough, Whittingham, Yoshino", c:"Pin lithium-ion", n:"97 tuổi Goodenough — Nobel già nhất lịch sử lúc đó."},
  {y:2021, w:"List & MacMillan", c:"Asymmetric organocatalysis", n:"Catalyst organic không kim loại — green chiral synthesis."},
  {y:2022, w:"Sharpless, Meldal, Bertozzi", c:"Click chemistry & bioorthogonal", n:"Gắn phân tử nhanh như click — imaging sống tế bào."},
  {y:2023, w:"Bawendi, Brus, Ekimov", c:"Quantum dots", n:"Size-tuned nanocrystal — QLED TV & bioimaging."},
  {y:2024, w:"Baker, Hassabis, Jumper", c:"Protein design & AlphaFold2", n:"AI dự đoán cấu trúc protein — kỷ nguyên computational biology; 200 triệu cấu trúc miễn phí cho nhân loại."}
];

/* Danh nhân hóa học */
const CHEMISTS_GALLERY = [
  {n:"Marie Curie", y:"1867–1934", c:"Phóng xạ · Po, Ra", q:"Nobel Vật lý 1903 + Hóa 1911 — người duy nhất thắng Nobel ở 2 khoa khác nhau.", i:"MC"},
  {n:"Antoine Lavoisier", y:"1743–1794", c:"Bảo toàn khối lượng · O₂", q:"'Cha hóa học hiện đại' — bị chém đầu thời Cách mạng Pháp. 'La révolution n'a pas besoin de savants.'", i:"AL"},
  {n:"Dmitri Mendeleev", y:"1834–1907", c:"Bảng tuần hoàn 1869", q:"Bỏ ô trống dự đoán Ga, Ge, Sc trước khi chúng được tìm thấy — tất cả đúng.", i:"DM"},
  {n:"Alfred Nobel", y:"1833–1896", c:"Dynamite · Di sản Nobel", q:"Đọc báo cáo nhầm mình đã chết ('merchant of death') → lập giải Nobel chuộc tội.", i:"AN"},
  {n:"Linus Pauling", y:"1901–1994", c:"Liên kết hóa học", q:"2 Nobel đơn khác khoa; gần như tìm ra DNA nhưng sai helix triple.", i:"LP"},
  {n:"Dorothy Hodgkin", y:"1910–1994", c:"Penicillin, B₁₂, insulin", q:"Xác định cấu trúc insulin mất 35 năm kiên trì — nữ Nobel thứ 3 hóa học.", i:"DH"},
  {n:"Robert Woodward", y:"1917–1979", c:"Tổng hợp tự nhiên", q:"'Có nhiều lý do để làm tổng hợp, nhưng tuyệt vời nhất là... nó rất vui.'", i:"RW"},
  {n:"Fritz Haber", y:"1868–1934", c:"NH₃ & khí độc", q:"Vừa nuôi sống hàng tỷ người vừa khai sinh chiến tranh hóa học — nhân vật gây tranh cãi nhất hóa học.", i:"FH"},
  {n:"Gertrude Elion", y:"1918–1999", c:"Rational drug design", q:"Nữ Nobel 1988; azidothymidine AZT HIV, 6-MP leukemia — không bằng PhD vẫn thành huyền thoại.", i:"GE"},
  {n:"Ahmed Zewail", y:"1946–2016", c:"Femtochemistry", q:"Chụp 'ảnh chuyển động' phản ứng trong femtosecond (10⁻¹⁵ s) — Nobel 1999.", i:"AZ"},
  {n:"Frances Arnold", y:"1956–", c:"Directed evolution", q:"Nobel 2018 — 'tôi nuôi enzyme tiến hóa trong ống nghiệm'; nữ kỹ thuật đầu tiên MIT faculty tenure.", i:"FA"},
  {n:"Jennifer Doudna", y:"1964–", c:"CRISPR-Cas9", q:"Nobel 2020; mơ thấy scissors cắt DNA → công cụ sửa gene thế giới.", i:"JD"},
  {n:"Tu Youyou 屠呦呦", y:"1930–", c:"Artemisinin", q:"Đọc cổ thư Trung Quốc 1600 tuổi → artemisinin cứu triệu mạng sốt rét; Nobel 2015 không PhD, không overseas.", i:"TY"},
  {n:"John Goodenough", y:"1922–2023", c:"Li-ion cathode", q:"Nobel 97 tuổi; phát minh pin ở tuổi 57, LFP ở 75 — 'đừng bao giờ nghĩ mình quá già để đổi mới'.", i:"JG"},
  {n:"Percy Julian", y:"1899–1975", c:"Steroid tổng hợp", q:"Grandson of slaves → tổng hợp physostigmine & progesterone từ đậu tương; 100+ patents.", i:"PJ"},
  {n:"Rosalind Franklin", y:"1920–1958", c:"Photo 51 DNA", q:"Ảnh X-ray quyết định double helix; chết 37 tuổi vì phơi nhiễm X-ray nghiên cứu.", i:"RF"},
  {n:"Stephanie Kwolek", y:"1923–2014", c:"Kevlar", q:"Nữ hóa học gia DuPont — dung dịch 'quá lạ' suýt bị bỏ đi trở thành áo giáp cứu 1000s mạng.", i:"SK"},
  {n:"Kary Mullis", y:"1944–2019", c:"PCR", q:"Nobel 1993; surf, LSD stories, và một ý tưởng đêm chạy xe trên con đường California.", i:"KM"},
  {n:"Robert Boyle", y:"1627–1691", c:"Hóa hiện đại khai sinh", q:"'The Sceptical Chymist' 1661 tách hóa khỏi giả kim; định luật khí đầu tiên.", i:"RB"},
  {n:"Jöns Berzelius", y:"1779–1848", c:"Ký hiệu hóa học", q:"Phát minh ký hiệu chữ (H, O, Fe…) — ngôn ngữ hóa học toàn cầu hôm nay.", i:"JB"},
  {n:"Justus von Liebig", y:"1803–1873", c:"Nông nghiệp hóa học", q:"Định luật minimum: cây lớn theo yếu tố thiếu nhất — phân bón hiện đại ra đời.", i:"JL"},
  {n:"August Kekulé", y:"1829–1896", c:"Vòng benzen giấc mơ rắn", q:"Mơ rắn cắn đuôi → cấu trúc vòng aromatic; 'hãy học để mơ có hệ thống!'", i:"AK"},
  {n:"Jacobus van't Hoff", y:"1852–1911", c:"Carbon tetrahedral · Nobel 1", q:"Nobel Hóa đầu tiên 1901; đề xuất carbon tứ diện bị chê 'phiêu kỳ' trước khi đúng.", i:"JH"},
  {n:"Ernest Rutherford", y:"1871–1937", c:"Hạt nhân · Nobel Hóa 1908", q:'"All science is either physics or stamp collecting" — nhưng Nobel của ông là Hóa!', i:"ER"},
  {n:"Irving Langmuir", y:"1881–1957", c:"Bề mặt & plasma", q:"Industrial scientist GE: monolayer, seeding mây, đặt từ 'plasma' vào vật lý.", i:"IL"},
  {n:"Mario Molina", y:"1943–2020", c:"Lỗ ozone CFC", q:"Người Mexico cảnh báo CFC giữa lúc ngành lạnh phủ nhận — Nobel 1995 chứng minh đúng.", i:"MM"},
  {n:"Ada Yonath", y:"1939–", c:"Ribosome structure", q:"Nữ Nobel 2009; 20 năm kiên trì crystallize ribosome khi cả giới nói không thể.", i:"AY"},
  {n:"Venki Ramakrishnan", y:"1952–", c:"Ribosome atomic", q:"Nobel 2009; từng bị trượt đại học → chủ tịch Royal Society — đường vòng không sao.", i:"VR"},
  {n:"Barry Sharpless", y:"1941–", c:"Double Nobel Hóa", q:"Duy nhất cùng Sanger có 2 Nobel Hóa (2001 chiral + 2022 click) — 'find the click!'.", i:"BS"},
  {n:"Ben Feringa", y:"1951–", c:"Motor phân tử", q:"Nobel 2016; motor nano quay 12 triệu vòng/giây — 'xây máy móc bằng phân tử'.", i:"BF"},
  {n:"Carolyn Bertozzi", y:"1966–", c:"Bioorthogonal click", q:"Nobel 2022; gắn huỳnh quang vào đường trên tế bào sống không phá nhiễu sinh học.", i:"CB"},
  {n:"David Baker", y:"1962–", c:"Protein design", q:"Nobel 2024; thiết kế protein hoàn toàn mới chưa tồn tại trong tự nhiên.", i:"DB"},
  {n:"Demis Hassabis", y:"1976–", c:"AlphaFold AI", q:"Nobel 2024; thần đồng chess → game AI → giải bài toán 50 năm protein folding.", i:"DH"},
  {n:"John Jumper", y:"1985–", c:"AlphaFold2", q:"Nobel 2024 trẻ nhất đợt; chuyển từ physics sang ML biology ở tuổi 30.", i:"JJ"},
  {n:"Dan Shechtman", y:"1941–", c:"Quasicrystal", q:"Bị đuổi khỏi nhóm vì 'quasicrystal không tồn tại' — 29 năm sau nhận Nobel 2011.", i:"DS"},
  {n:"Emmanuelle Charpentier", y:"1968–", c:"CRISPR", q:"Nobel 2020 với Doudna — 'bacteria immune system thành công cụ gene editing nhân loại'.", i:"EC"},
  {n:"Nguyễn Văn Hiến / các hóa học gia Việt Nam", y:"—", c:"Truyền thống Việt", q:"Việt Nam có truyền thống luyện kim Đông Sơn 2500 năm, giấy dó, men gốm Bát Tràng — hóa học bản địa lâu đời.", i:"VN"}
];

/* Bảng số liệu: Thế điện cực chuẩn E° */
const E0_SERIES = {
  rows:[
    ["Li⁺/Li","−3,04","Kim loại khử mạnh nhất"],
    ["K⁺/K","−2,93","",""],
    ["Ca²⁺/Ca","−2,87","",""],
    ["Na⁺/Na","−2,71","",""],
    ["Al³⁺/Al","−1,66","",""],
    ["Zn²⁺/Zn","−0,76","Ắc quy kẽm anode"],
    ["Fe²⁺/Fe","−0,44","Ăn mòn thép"],
    ["(H⁺/H₂)","0,00","Chuẩn so sánh"],
    ["Cu²⁺/Cu","+0,34","Dây điện đồng bền"],
    ["Ag⁺/Ag","+0,80","Pin bạc kẽm 1,56 V"],
    ["Hg₂²⁺/Hg","+0,85","Electrode calomel chuẩn"],
    ["Cl₂/Cl⁻","+1,36","Khử trùng clo oxy mạnh"],
    ["Au³⁺/Au","+1,50","Vàng không gỉ — quý hiếm"],
    ["F₂/F⁻","+2,87","Oxy hóa mạnh nhất — fluorine king"]
  ]
};

/* Hằng số cân bằng tan Ksp */
const KSP_TABLE = [
  ["AgCl","1,8×10⁻¹⁰","Kết tủa chloride test"],
  ["BaSO₄","1,1×10⁻¹⁰","Gravimetric sulfate; an toàn uống"],
  ["CaCO₃","3,3×10⁻⁹","Đá vôi, cáu kettle, vỏ trứng"],
  ["PbI₂","7,9×10⁻⁹","'Golden rain' thí nghiệm đẹp"],
  ["Ag₂CrO₄","1,1×10⁻¹²","Indicator Mohr đỏ đất"],
  ["Mg(OH)₂","5,6×10⁻¹²","Sữa magnesia thuốc dạ dày"],
  ["Fe(OH)₃","2,8×10⁻³⁹","Kết tủa sắt xử lý nước"],
  ["Al(OH)₃","1,3×10⁻³³","Flocculant keo tụ nước"],
  ["CuS","6×10⁻³⁷","Group II H₂S scheme đen"],
  ["HgS","4×10⁻⁵³","Ít tan nhất từng biết — cinnabar đỏ ngàn năm"]
];

/* Năng lượng bond trung bình (kJ/mol) */
const BOND_ENERGY = [
  ["H–H","436","Bond mạnh nhất đơn giản"],
  ["C–H","413","Backbone hữu cơ"],
  ["C–C","347","Mạch polymer"],
  ["C=C","614","π bond yếu hơn σ"],
  ["C≡C","839","Acetylene đèn hàn"],
  ["C–O","358","Alcohol/ether"],
  ["C=O","745","Carbonyl mạnh — CO₂ ổn định"],
  ["O–H","467","Nước khó phân hủy"],
  ["N≡N","941","Bond mạnh nhất phổ biến — vì sao N₂ khó cố định!"],
  ["Cl–Cl","243","Photolysis dễ tạo radical"],
  ["Si–O","452","Silicate backbone — đá & thủy tinh"],
  ["F–F","159","Bond halogen yếu nhất — F₂ cực hoạt động"]
];

/* Đồng vị quan trọng */
const ISOTOPES_TABLE = [
  ["¹H / ²H(D) / ³H(T)","Protium/Deuterium/Tritium","Nước nặng, fusion fuel, NMR solvent"],
  ["¹²C / ¹³C / ¹⁴C","Carbon chuẩn / NMR / dating","Radiocarbon dating t½ 5.730 năm"],
  ["¹⁶O / ¹⁸O","Oxy thường/nặng","Paleoclimate ice core temperature proxy!"],
  ["²³⁵U / ²³⁸U","Enriched / natural uranium","3-5% enriched reactor; 93% weapons-grade"],
  ["⁶⁰Co","Gamma source","Xạ trị ung thư & tiệt trùng dụng cụ y tế"],
  ["⁹⁹ᵐTc","Metastable technetium","~40 triệu scan y tế/năm — isotope y tế số 1"],
  ["¹³¹I","Radioiodine","Điều trị cường giáp & ung thư tuyến giáp"],
  ["²⁴Na","Sodium-24","Blood circulation tracer research"],
  ["²¹⁰Po","Polonium-210","RTG nguồn nhiệt; Litvinenko assassination 2006"],
  ["²³⁸Pu","Plutonium heat","Voyager/New Horizons RTG power decades"]
];

/* pH các chất quen thuộc */
const PH_COMMON = [
  ["Axit pin (H₂SO₄)","0","Extremely corrosive"],
  ["Axit dạ dày (HCl)","1,5–2","Digestion protein pepsin hoạt động"],
  ["Nước chanh","2,2","Citric acid ~5%"],
  ["Giấm ăn","2,5","Acetic acid 5%"],
  ["Coca-Cola","2,5","Phosphoric acid — hòa tan răng overnight myth? partially true"],
  ["Cà phê đen","5,0","Slightly acidic"],
  ["Nước mưa tự nhiên","5,6","CO₂ equilibrium — 'clean' baseline"],
  ["Nước tinh khiết","7,0","Neutral by definition 25°C"],
  ["Máu người","7,35–7,45","Buffer bicarbonate sống còn ±0,05!"],
  ["Nước biển","8,1","HCO₃⁻ buffer; đang giảm vì CO₂"],
  ["Xà phòng","9–10","Fatty acid salt hydrolysis"],
  ["Thuốc tẩy Javel","12,5","NaClO — corosive skin"],
  ["Thông cống NaOH","14","Extreme base — dissolve hair/fat"]
];

/* Đơn vị & thuật ngữ */
const UNITS_GLOSSARY = [
  {u:"mol", d:"Đơn vị lượng chất = 6,022×10²³ hạt", ex:"22,4 L khí STP = 1 mol"},
  {u:"Molarity (M)", d:"mol chất tan / L dung dịch", ex:"HCl 1M = 36,5 g/L"},
  {u:"Molality (m)", d:"mol chất tan / kg dung môi", ex:"Dùng cho colligative properties vì không phụ thuộc T"},
  {u:"ppm/ppb", d:"Parts per million/billion", ex:"As trong nước chuẩn WHO <10 ppb"},
  {u:"STP", d:"Standard Temperature & Pressure: 0°C, 1 bar", ex:"Vmolar = 22,7 L (bar) hoặc 22,4 L (atm)"},
  {u:"kDa", d:"Kilodalton — đơn vị khối lượng phân tử lớn", ex:"Insulin 5,8 kDa; antibody ~150 kDa"},
  {u:"Å (Angstrom)", d:"10⁻¹⁰ m — scale nguyên tử", ex:"Bond C–C 1,54 Å"},
  {u:"eV", d:"Electronvolt năng lượng", ex:"Bandgap Si 1,12 eV; visible photon 1,6–3,1 eV"},
  {u:"ΔH°f", d:"Enthalpy tạo thành chuẩn", ex:"ΔH°f(H₂O,l) = −285,8 kJ/mol"},
  {u:"Ka/Kb & pKa/pKb", d:"Hằng số axit/bazơ", ex:"pKa thấp hơn = axit mạnh hơn"},
  {u:"Ksp", d:"Hằng số tích số tan", ex:"[Ag⁺][Cl⁻] = 1,8×10⁻¹⁰ tại 25°C"},
  {u:"titer", d:"Hệ số pha loãng serology fold-dilution", ex:"COVID titer 1:320 — 'đo miễn dịch bằng lần pha'"},
  {u:"Normality (N)", d:"Equivalents/L acid-base-redox legacy", ex:"0.1 N H₂SO₄ = 0.05 M vì 2 H⁺ mỗi phân tử"},
  {u:"Mole fraction χ", d:"mol phần / tổng mol — dimensionless", ex:"Raoult law P = χ·P° tính vapor pressure"},
  {u:"ppmv khí", d:"Parts per million theo thể tích", ex:"CO₂ Mauna Loa curve vượt 420 ppmv — biểu đồ nổi tiếng khí hậu"},
  {u:"Torr / mmHg", d:"Đơn vị áp suất vacuum & huyết áp", ex:"120/80 mmHg; high-vac 10⁻⁶ Torr sputter chamber"},
  {u:"Dalton (Da)", d:"1/12 khối lượng C-12 cho đại phân tử", ex:"Insulin 5.8 kDa · antibody IgG ~150 kDa"},
  {u:"Becquerel vs Sievert", d:"Activity (sự phân rã) ≠ dose (tác động)", ex:"Bq đếm số decay/s; Sv nhân hệ số sinh học — phân biệt sống còn"},
  {u:"λmax Wien", e:"", d:"Wien displacement λmax·T = 2.9×10⁻³ m·K", ex:"Sao đỏ lạnh 3000K, sao xanh nóng 10000K — đọc nhiệt độ từ màu"}
];

/* Cấu trúc tinh thể kinh điển */
const CRYSTAL_STRUCTURES = [
  {c:"SC — Simple cubic", e:"Polonium α duy nhất!", d:" Packing 52% — kém hiệu quả đến mức chỉ Po dùng."},
  {c:"BCC — Body-centered", e:"α-Fe, W, Na, K", d:"Packing 68%; ferrite thép mềm ở RT."},
  {c:"FCC — Face-centered", e:"Cu, Al, Au, Ag, Ni, γ-Fe", d:"Packing 74% tối ưu; ductile metals — dễ uốn kéo."},
  {c:"HCP — Hexagonal", e:"Mg, Ti, Zn, Co", d:"Packing 74% như FCC nhưng ít slip systems → giòn hơn."},
  {c:"Diamond cubic", e:"C, Si, Ge", d:"Tetrahedral sp³ network; hardness extreme, semiconductor substrate."},
  {c:"NaCl rock salt", e:"NaCl, MgO, TiN", d:"Two interpenetrating FCC; brittle ionic crystal cleavage cubic."},
  {c:"CsCl structure", e:"CsCl, NH₄Cl", d:"8:8 coordination khác NaCl 6:6 — size matters!"},
  {c:"Perovskite ABX₃", e:"CaTiO₃, BaTiO₃, MAPbI₃", d:"Ferroelectric, superconductor, solar cell — structure của thập kỷ."},
  {c:"Spinel AB₂O₄", e:"MgAl₂O₄, magnetite Fe₃O₄", d:"Ferrite magnets, Li-ion cathode spinel LiMn₂O₄."},
  {c:"Graphite layered", e:"C graphite", d:"Sheets slide — pencil lubricant; graphene layers riêng lẻ."},
  {c:"Rutile TiO₂ chains", e:"TiO₂ tetragonal", d:"Pigment trắng trắng nhất + photocatalyst; chains edge-sharing."},
  {c:"Fluorite CaF₂ / antifluorite", e:"CaF₂ · Li₂O inverse", d:"8:4 coordination đảo ngược NaCl logic — geometry swap game."},
  {c:"Zinc blende ↔ wurtzite", e:"ZnS, GaN, CdSe polytypes", d:"Cùng hóa học khác stacking → bandgap LED màu thay đổi!"},
  {c:"Garnet family Y₃Al₅O₁₂", e:"YAG, YIG, LLZO garnet", d:"Laser + microwave + solid electrolyte — một cấu trúc ba nghề."},
  {c:"Olivine Mg₂SiO₄ → LiFePO₄", e:"Mantle mineral borrowed for battery", d:"Tên từ đá manti Trái Đất; cathode LFP an toàn pin EV đại chúng."},
  {c:"Apatite Ca₅(PO₄)₃X", e:"X=F/Cl/OH biological & geological", d:"Men răng fluorapatite; fission track dating núi non tuổi."},
  {c:"Scheelite CaWO₄", e:"Tungstate scintillator vintage X-ray screen", d:"Cha của mọi màn huỳnh quang y khoa trước digital era."}
];

/* Định luật bổ sung — y dược */
const LAWS_MED = [
  {n:"Fick diffusion", y:"1855", w:"Adolf Fick", t:"J = −D·A·(ΔC/Δx) — tốc độ khuếch tán ∝ diện tích & gradient nồng độ.", d:"Nền hấp thu thuốc qua màng, thiết kế dialysis & màng trao đổi khí phổi."},
  {n:"Noyes-Whitney dissolution", y:"1897", w:"Noyes, Whitney", t:"dC/dt = k·A·(Cs − C) — tan nhanh theo diện tích bề mặt.", d:"Vì sao nanocrystal drug tăng sinh khả dụng: nghiền mịn = tăng A."},
  {n:"Lipinski Rule of 5", y:"1997", w:"Christopher Lipinski", t:"MW<500 · logP<5 · H-donor≤5 · H-acceptor ≤10 → 'drug-like'.", d:"Bộ lọc hàng triệu hợp chất trước tổng hợp — chuẩn công nghiệp dược."},
  {n:"Bohr effect", y:"1904", w:"Christian Bohr", t:"pH thấp / CO₂ cao → hemoglobin nhả O₂ dễ hơn.", d:"Mô hoạt động (axit) tự hút thêm O₂ — thiết kế thông minh của cơ thể."},
  {n:"Hill equation dose-response", y:"1910", w:"Archibald Hill", t:"E = Emax·Cⁿ/(EC₅₀ⁿ + Cⁿ) — sigmoid pharmacodynamics.", d:"Đọc EC₅₀ & Hill coefficient biết full/partial agonism, cooperativity."},
  {n:"First-order elimination", y:"—", w:"Pharmacokinetics", t:"dC/dt = −k·C — thanh thải tỷ lệ với nồng độ.", d:"t½ không đổi; ethanol lại zero-order khi bão hòa enzyme ADH."},
  {n:"Donnan equilibrium", y:"1911", w:"Frederick Donnan", t:"Ion bất khuếch tán tạo chênh lệch điện thế qua màng.", d:"Áp suất keo tế bào, điện thế màng −70 mV, phù nề pathology."},
  {n:"pH partition (ion trapping)", y:"1908", w:"Henderson-Hasselbalch ứng dụng", t:"Thuốc yếu axit/bazơ phân bố theo pH môi trường vs pKa.", d:"Aspirin (pKa 3.5) tập trung dạ dày pH 2; overdose opioid → acidosis não."},
  {n:"Laplace law (aneurysm)", y:"1806", w:"Pierre-Simon Laplace", t:"T = P·r / (2·w) — ứng suất thành mạch ∝ bán kính.", d:"Aneurysm càng to càng dễ vỡ — vòng xoắn tử vong vật lý sinh học."},
  {n:"Poiseuille flow", y:"1840", w:"Jean Poiseuille", t:"Q = Δπr⁴/(8ηl) — lưu lượng ∝ r⁴!", d:"Hẹp động mạch còn 50% đường kính → dòng giảm ×16. Cơ sở mọi bệnh mạch."},
  {n:"Starling equation (edema)", y:"1896", w:"Ernest Starling", t:"Jv = Kf[(Pc − Pi) − σ(πc − πi)] — cân bằng lọc/hấp thu mao quản.", d:"Giải thích phù: suy tim, hypoalbumin, tắc bạch huyết — từng thuật ngữ một cơ chế."},
  {n:"Michaelis-Menten kinetics", y:"1913", w:"Michaelis, Menten", t:"v = Vmax[S]/(Km+[S]) — bão hòa enzyme khi [S] >> Km.", d:"Ethanol zero-order vì ADH bão hòa; thuốc cạnh tranh substrate cùng enzyme."},
  {n:"Hard-soft acid-base HSAB", y:"1963", w:"Ralph Pearson", t:"Acid cứng ghép base cứng, acid mềm ghép base mềm.", d:"Dự đoán stability complex & vị trí kim loại trong quặng — geochemistry tool."},
  {n:"Woodward-Hoffmann orbital symmetry", y:"1965", w:"(đã có ở trên — mở rộng)", t:"Phản ứng vòng 4n vs 4n+2: nhiệt cho phép khác quang hóa.", d:"Diels-Alder nhiệt thuận, photochemical ngược — dự đoán trước khi làm."},
  {n:"Hammond-Leffler postulate", y:"1955", w:"Hammond, Leffler", t:"TS giống species gần nó về năng lượng; phản ứng nhanh TS sớm.", d:"Đọc cấu trúc transition state từ energy diagram — mọi cơ chế hữu cơ."},
  {n:"Gibbs phase rule", y:"1875", w:"Josiah Gibbs", t:"F = C − P + 2 — bậc tự do của hệ cân bằng đa pha.", d:"Vì sao nước ba trạng thái cùng tồn tại duy nhất ở điểm tam giác 0,01 °C."},
  {n:"Clausius-Clapeyron", y:"1834", w:"Clausius & Clapeyron", t:"dP/dT = ΔH/(TΔV) — độ dốc đường hóa hơi.", d:"Dự đoán áp suất hơi mọi nhiệt độ từ một điểm đo + ΔH — thiết kế chưng cất."},
  {n:"Bragg's law", y:"1913", w:"Bragg cha & con", t:"nλ = 2d·sinθ — điều kiện nhiễu xạ tinh thể.", d:"Mọi XRD/TEM & bức ảnh DNA Photo 51 đều sinh từ phương trình này."},
  {n:"Debye-Hückel limiting law", y:"1923", w:"Debye & Hückel", t:"log γ± = −A·z²·√I — hệ số hoạt độ giảm theo √lực ion.", d:"pH 'thật' lệch pH đo khi muối nhiều — hoạt độ vs nồng độ sống còn."},
  {n:"Stokes-Einstein diffusion", y:"1905", w:"Einstein & Stokes", t:"D = kT/(6πηr) — khuếch tán nghịch với bán kính & độ nhớt.", d:"Dự đoán tốc độ lan thuốc/nanoparticle trong dung dịch sinh học."},
  {n:"Mark-Houwink-Sakurada", y:"1938", w:"Mark, Houwink, Sakurada", t:"[η] = K·Mᵃ — độ nhớt giới hạn ∝ khối lượng phân tử.", d:"Đo Mw polymer rẻ bằng viscometer thay GPC đắt tiền."},
  {n:"Boltzmann distribution", y:"1868", w:"Ludwig Boltzmann", t:"Nᵢ/Nⱼ = e^(−ΔE/kT) — mật độ trạng thái theo năng lượng.", d:"Population NMR, Arrhenius factor, khí quyển barometric — một công thức vạn năng."},
  {n:"Onsager reciprocal relations", y:"1931", w:"Lars Onsager", t:"Hệ số chéo của các dòng gần cân bằng đối xứng nhau.", d:"Thermoelectric ↔ electrothermal; Seebeck ↔ Peltier liên kết định lượng. Nobel 1968."}
];

/* Nobel bổ sung các năm còn lại */
const NOBEL_EXTRA = [
  {y:1902, w:"Emil Fischer", c:"Tổng hợp đường & purine", n:"'Chúa tổng hợp hữu cơ'; lock-key enzyme concept."},
  {y:1904, w:"William Ramsay", c:"Phát hiện khí hiếm Ne/Ar/Kr/Xe", n:"Một mình lấp cả cột bên phải bảng tuần hoàn."},
  {y:1906, w:"Henri Moissan", c:"Fluorine điện phân & lò hồ quang kim cương", n:"Tạo kim cương nhân tạo đầu tiên trong lò điện."},
  {y:1907, w:"Eduard Buchner", c:"Fermentation không tế bào (zymase)", n:"Chứng minh enzyme hoạt động ngoài cơ thể sống."},
  {y:1910, w:"Otto Wallach", c:"Hóa terpene", n:"Nền hương liệu & hóa học tinh dầu."},
  {y:1912, w:"Victor Grignard & Paul Sabatier", c:"Grignard & hydrogenation catalytic", n:"Hai công cụ tổng hợp hữu cơ dùng đến hôm nay."},
  {y:1913, w:"Alfred Werner", c:"Hóa phối hợp cấu tạo phức", n:"Cha đẻ coordination chemistry — hình học octahedral."},
  {y:1921, w:"Frederick Soddy", c:"Khái niệm isotope", n:"Đặt từ 'isotope' — giải bí mật khối lượng nguyên tử lẻ."},
  {y:1922, w:"Francis Aston", c:"Mass spectrograph & rule số nguyên", n:"Xác nhận isotope bằng máy tự chế của chính mình."},
  {y:1923, w:"Fritz Pregl", c:"Phân tích vi lượng hữu cơ", n:"Đo C/H/N từ vài mg mẫu — microanalysis ra đời."},
  {y:1925, w:"Richard Zsigmondy", c:"Colloid vàng siêu kính hiển vi", n:"Nghiên cứu gold sol — tiền thân nanoscience."},
  {y:1926, w:"The Svedberg", c:"Máy ly tâm siêu tốc protein", n:"Đo khối lượng hemoglobin bằng ultracentrifuge tự chế."},
  {y:1930, w:"Hans Fischer", c:"Cấu trúc chlorophyll & heme", n:"20 năm 'xây' phân tử porphyrin — Nobel xứng đáng từng bước."},
  {y:1931, w:"Carl Bosch", c:"Hóa chất áp suất cao công nghiệp", n:"Scale-up Haber thành nhà máy — Haber-Bosch hoàn chỉnh."},
  {y:1932, w:"Irving Langmuir", c:"Hóa bề mặt monolayer", n:"Langmuir-Blodgett film; surface chemistry công nghiệp GE."},
  {y:1934, w:"Harold Urey", c:"Phát hiện deuterium", n:"Tách deuterium từ nước thường bằng distillation — nước nặng ra đời."},
  {y:1943, w:"George de Hevesy", c:"Isotope tracer indicator", n:"Ý tưởng theo dõi nguyên tử trong cơ thể — nuclear medicine gốc."},
  {y:1945, w:"Artturi Virtanen", c:"Bảo quản thức ăn chăn nuôi", n:"AIV silage — nông nghiệp Bắc Âu hiện đại hóa."},
  {y:1947, w:"Robert Robinson", c:"Alkaloid & tropinone biomimetic", n:"Tổng hợp tropinone một chén — 'biomimetic synthesis' khai sinh."},
  {y:1949, w:"William Giauque", c:"Nhiệt động gần absolute zero", n:"Adiabatic demagnetization đạt 0.001 K — cryogenics king."},
  {y:1951, w:"Glenn Seaborg", c:"Actinide concept & transuranium", n:"Phát hiện Pu-Np-Am-Cm…; element seaborgium đặt tên khi còn sống!"},
  {y:1952, w:"Archer Martin & Richard Synge", c:"Partition chromatography", n:"Sắc ký phân chia — nền HPLC/GC mọi phòng lab."},
  {y:1953, w:"Hermann Staudinger", c:"Macromolecule polymer concept", n:"Đấu 30 năm chứng minh polymer là phân tử lớn — cha ngành nhựa."},
  {y:1957, w:"Alexander Todd", c:"Nucleotide ATP/ADN structure", n:"Xây nền molecular biology trước Watson-Crick application."},
  {y:1959, w:"Jaroslav Heyrovský", c:"Polarography electrode giọt mercury", d:"", n:"Voltammetry kinh điển — đo oxy hòa tan & metal traces."},
  {y:1960, w:"Willard Libby", c:"Radiocarbon dating C-14", n:"Định tuổi khảo cổ bằng đồng vị — archaeology revolution."},
  {y:1961, w:"Melvin Calvin", c:"Con đường cố định CO₂ quang hợp", n:"Calvin cycle — vẽ bản đồ carbon trong photosynthesis dùng rêu phóng xạ."},
  {y:1966, w:"Robert Mulliken", c:"Orbital phân tử MO theory", n:"MO theory định lượng — cùng Hund/Lennard-Jones dựng nền tảng."},
  {y:1967, w:"Manfred Eigen", c:"Phản ứng cực nhanh relaxation", n:"Đo reaction trong microsecond — 'nhìn' proton transfer."},
  {y:1969, w:"Derek Barton & Odd Hassel", c:"Conformational analysis", d:"", n:"Chair/boat cyclohexane — hình 3D quyết định reactivity."},
  {y:1975, w:"John Cornforth & Vladimir Prelog", c:"Stereochemistry enzymatic reactions", n:"Cơ chế chọn 'bàn tay' của enzyme — asymmetric synthesis gốc."},
  {y:1977, w:"Ilya Prigogine", c:"Cấu trúc tiêu tán hệ xa cân bằng", n:"'Order out of chaos' — thermodynamics của sự sống."},
  {y:1978, w:"Peter Mitchell", c:"Chemiosmosis gradient H⁺ ATP", d:"", n:"Gradient proton qua màng nuôi ATP synthase — ban đầu bị cười rồi Nobel."},
  {y:1980, w:"Paul Berg, Walter Gilbert, Sanger", c:"Recombinant DNA & sequencing", n:"Biotech industry foundation — Genentech era opens."},
  {y:1982, w:"Aaron Klug", c:"Crystallographic electron microscopy", n:"Xem nucleic acid-protein complexes — structural biology tools."},
  {y:1983, w:"Henry Taube", c:"Electron transfer inner-sphere", n:"Cơ chế chuyển electron kim loại — redox chemistry chi tiết hóa."},
  {y:1984, w:"Bruce Merrifield", c:"Solid-phase peptide synthesis", n:"Máy tổng hợp peptide tự động — robot chemistry Nobel."},
  {y:1988, w:"Deisenhofer, Huber, Michel", c:"Cấu trúc trung tâm quang hợp bacteria", n:"Membrane protein X-ray đầu tiên — phá quan niệm không crystallize được."},
  {y:1989, w:"Sidney Altman & Thomas Cech", c:"RNA catalysis ribozyme", n:"RNA tự cắt — phá giáo điều 'chỉ protein catalyze'."},
  {y:1990, w:"Elias Corey", c:"Retrosynthetic analysis logic", n:"'Nghịch' từ phân mục tiêu về nguyên liệu — AI drug design ancestor."},
  {y:1991, w:"Richard Ernst", c:"Fourier transform NMR 2D", n:"FT-NMR nền MRI y khoa hiện đại toàn cầu."},
  {y:1992, w:"Rudolph Marcus", c:"Marcus theory electron transfer rate", n:"Outer-sphere ET quantitative — photosynthesis & batteries apply."},
  {y:1994, w:"George Olah", c:"Carbocation & superacid chemistry", n:"Magic acid ổn định carbocation — hydrocarbon chemistry mới."},
  {y:1997, w:"Boyer, Walker, Skou", c:"ATP synthase rotary engine + Na⁺/K⁺ pump", n:"ATP synthase quay như turbine — 'engine of life' trực quan hóa."},
  {y:1998, w:"Walter Kohn & John Pople", c:"DFT & computational quantum chemistry", n:"Gaussian software + DFT — mọi chemist giờ có 'lab ảo'."},
  {y:2011, w:"Dan Shechtman", c:"Quasicrystal đối xứng 5 lần 'bất khả'", n:"Bị chê 'có vấn đề với tinh thể học' — rồi đúng, Nobel 29 năm sau."},
  {y:2020, w:"Emmanuelle Charpentier & Jennifer Doudna", c:"CRISPR-Cas9 gene editing", n:"Nobel hóa học đầu tiên cho 2 nữ scientist đồng giải."}
];

/* Lộ trình giáo trình hóa học */
const LEARN_PATH = [
  {lv:"Lớp 6–7 (KHTN)", t:"Vật chất & sự chuyển hóa đầu đời", k:"Nguyên tử–phân tử, 3 trạng thái vật chất, hỗn hợp/tách chất, không khí, nước, dung dịch"},
  {lv:"Lớp 8", t:"Hóa học cơ bản nền móng", k:"Nguyên tử, BTH (Z=1–20), cấu hình e lớp vỏ, hóa trị, PTHH cân bằng, mol & khối lượng mol"},
  {lv:"Lớp 9", t:"Vô cơ hệ thống", k:"Bảng tuần hoàn Z=1–30, liên kết ion/cộng hóa trị, oxit–axit–bazơ–muối, kim loại & phi kim đại diện, dung dịch nồng độ %"},
  {lv:"Lớp 10", t:"Nền lý thuyết hiện đại", k:"Cấu hình e phân lớp, tính chu kỳ, liên kết hóa học VSEPR, độ tan, tốc độ phản ứng, cân bằng ban đầu, điện ly"},
  {lv:"Lớp 11", t:"Hữu cơ mở màn + nhiệt động", k:"Hydrocarbon C1–C6 quy tắc, enthalpy ΔH, tốc độ & xúc tác, cân bằng Kc/Kp, pH axit-bazơ, electrochem sơ khai"},
  {lv:"Lớp 12", t:"Tổng hợp thi THPT", k:"Ester/lipid/carbohydrate/amin & protein, polymer, điện phân Faraday, pin & ăn mòn, bài toán hỗn hợp trắc nghiệm kinh điển"},
  {lv:"Đại học năm 1", t:"General Chemistry nâng cao", k:"Quantum numbers & orbital shape, thermodynamics Gibbs ΔG, equilibrium advanced, acid-base đa proton, redox stoichiometry"},
  {lv:"Organic Chemistry I-II", t:'"Dao mổ" tổng hợp hữu cơ', k:"SN1/SN2/E1/E2, spectroscopy NMR-IR-MS, aromatic chemistry, carbonyl kingdom, retrosynthesis logic"},
  {lv:"Physical Chemistry", t:"Toán học của hóa học", k:"Statistical thermodynamics, kinetics theory, quantum chemistry Hückel/HF/DFT, electrochemistry Nernst sâu"},
  {lv:"Inorganic / Coordination", t:"Hóa phối hợp & vật rắn", k:"Crystal field theory màu sắc spin, organometallic 18-electron rule, solid state lattices, bioinorganic hemoglobin"}
];

/* Danh pháp hữu cơ IUPAC cơ bản */
const NOMENCLATURE = [
  ["Meth-/Eth-/Prop-/But-","1/2/3/4 carbon mạch chính","methane CH₄ → butane C₄H₁₀"],
  ["Pent-/Hex-/Hept-/Oct-","5/6/7/8 carbon","octane xăng reference fuel"],
  ["-ane / -ene / -yne","alkane đơn / alkene đôi / alkyne ba","propane · propene · propyne"],
  ["an- / en- / yn- vị trí","Số chỉ vị trí bond: but-1-ene vs but-2-ene","but-2-ene cis/trans E/Z"],
  ["ol / al / one / oic acid","OH / CHO / CO trong mạch / COOH","ethanol · ethanal · propanone · ethanoic acid"],
  ["amino-, hydroxy-, chloro-…","Prefix substituent alphabetized","2-chloro-1-propanol numbering lowest"],
  ["di-, tri-, tetra-","Đếm substituent giống nhau","dichloromethane CH₂Cl₂"],
  ["cis- / trans- hay (E)/(Z)","Stereochemistry quanh double bond","cis-but-2-ene same side; E/Z cao cấp hơn"],
  ["R/S configuration","Chiral center absolute configuration","(S)-ibuprofen active; (R) inactive!"],
  ["ortho-/meta-/para-","1,2- / 1,3- / 1,4- trên vòng benzen","para-dichlorobenzene mothball"]
];
