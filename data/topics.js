/* =========================================================================
   Topic definitions for the 24-section navigation architecture.
   Each topic renders a landing page: concepts, open questions, related local
   records, live search entry points and the sources it draws on.
   Wording is deliberately conservative: no invented measurements or citations.
   ========================================================================= */
(function (root) {
  "use strict";
  window.SCI_TOPICS = [
    {
      slug: "organic",
      title: "Hóa hữu cơ",
      eyebrow: "Chemistry · Organic",
      icon: "⛓",
      summary:
        "Hóa học của carbon: cấu trúc, lập thể, cơ chế phản ứng và chiến lược tổng hợp. Đây là tầng nền cho hóa dược, polymer, vật liệu và hóa sinh.",
      concepts: [
        { title: "Liên kết & lai hóa", text: "sp³, sp², sp lai hóa quyết định hình học phân tử; cộng hưởng làm bền hệ π và giải thích tính axit/bazơ." },
        { title: "Nhóm chức", text: "Alcohol, amine, carbonyl, carboxyl, ester, amide… là 'ngữ pháp' để đọc phân tử và dự đoán phản ứng." },
        { title: "Cơ chế", text: "SN1/SN2, E1/E2, cộng electrophin/nucleophin, thế electrophin thơm, pericyclic — mỗi loại có yêu cầu lập thể riêng." },
        { title: "Thơm & Hückel", text: "4n+2 electron π trong hệ phẳng, liên hợp mạch vòng; aromaticity định hướng phản ứng thế và độ bền." },
        { title: "Lập thể", text: "R/S, E/Z, axial chirality; thuốc thường chỉ một đồng phân có hoạt tính — lập thể là vấn đề an toàn dược lý." },
        { title: "Chiến lược tổng hợp", text: "Retrosynthesis, bảo vệ nhóm chức, economy nguyên tử, chọn lọc hóa học và chọn lọc lập thể." },
      ],
      questions: [
        "Kích hoạt C–H chọn lọc vị trí trong phân tử phức tạp mà không cần nhóm định hướng?",
        "Tổng hợp tự động (flow + AI) có thể tái tạo được độ chọn lọc của hóa học tổng hợp thủ công?",
        "Vật liệu hữu cơ bền nhiệt/oxy hóa cho pin và thiết bị điện tử linh hoạt?",
      ],
      sources: ["pubchem", "chebi", "chembl", "ord", "nist-webbook"],
      tools: [{ label: "Công thức & khối lượng mol", route: "#/tools?tab=formula" }, { label: "Cân bằng phương trình", route: "#/tools?tab=balance" }, { label: "Tra SMILES/InChI", route: "#/tools?tab=resolve" }],
      presets: ["aspirin", "caffeine", "glucose", "benzene"],
    },
    {
      slug: "inorganic",
      title: "Hóa vô cơ",
      eyebrow: "Chemistry · Inorganic",
      icon: "◈",
      summary:
        "Kim loại, phi kim, phức chất và vật liệu rắn. Trọng tâm là liên kết phối trí, hóa học trạng thái rắn và xúc tác kim loại.",
      concepts: [
        { title: "Phức chất & phối trí", text: "Số phối trí, hình học, đồng phân cis/trans, chelate; ligand field giải thích màu và từ tính." },
        { title: "HSAB", text: "Axit/bazơ cứng–mềm dự đoán ái lực: Hg²⁺ thích S, Al³⁺ thích O — nền tảng độc chất kim loại nặng." },
        { title: "Trạng thái rắn", text: "Ô mạng, nhóm không gian, khuyết tật, doping; tính chất điện tử phụ thuộc cấu trúc tinh thể." },
        { title: "Hóa cơ kim", text: "18-electron, xúc tác cross-coupling, hydroformyl hóa, metathesis — công cụ của tổng hợp hiện đại." },
        { title: "Hóa sinh vô cơ", text: "Hemoglobin (Fe), nitrogenase (Fe–Mo), carbonic anhydrase (Zn), PSII (Mn₄CaO₅)." },
        { title: "Vô cơ công nghiệp", text: "Haber–Bosch, chlor-alkali, luyện kim, xi măng — nơi hóa học vô cơ gặp phát thải CO₂." },
      ],
      questions: [
        "Xúc tác kim loại rẻ, không platinum cho hydro xanh và pin nhiên liệu?",
        "Thu hồi chọn lọc kim loại đất hiếm từ chất thải điện tử ở quy mô công nghiệp?",
        "Vật liệu vô cơ bền trong môi trường khắc nghiệt cho lò phản ứng muối nóng chảy?",
      ],
      sources: ["pubchem", "cod", "nomad", "materials-project", "rhea"],
      tools: [{ label: "Tính khối lượng mol", route: "#/tools?tab=formula" }, { label: "Bảng tuần hoàn", route: "#/elements" }],
      presets: ["sodium chloride", "iron(III) oxide", "ammonia", "perovskite"],
    },
    {
      slug: "physical",
      title: "Hóa lý",
      eyebrow: "Chemistry · Physical",
      icon: "∫",
      summary:
        "Nhiệt động học, động học, cơ học lượng tử và phổ học — ngôn ngữ định lượng để hiểu vì sao phản ứng xảy ra và nhanh đến đâu.",
      concepts: [
        { title: "Nhiệt động học", text: "ΔG = ΔH − TΔS; trạng thái cân bằng, hoạt độ, thế hóa học; nhiệt động quyết định chiều, động học quyết định tốc độ." },
        { title: "Động học", text: "Bậc phản ứng, phương trình Arrhenius, xúc tác, trạng thái chuyển tiếp và năng lượng hoạt hóa." },
        { title: "Cơ học lượng tử", text: "Hàm sóng, orbital, nguyên lý bất định, phương pháp Hartree–Fock và DFT — nền tảng của hóa tính toán." },
        { title: "Phổ học", text: "IR, Raman, UV-Vis, NMR, MS: mỗi kỹ thuật quan sát một mức năng lượng khác nhau của phân tử." },
        { title: "Điện hóa", text: "Thế điện cực, phương trình Nernst, quá thế; pin, điện phân và ăn mòn là cùng một ngôn ngữ." },
        { title: "Thống kê", text: "Phân bố Boltzmann, hàm phân bố, entropy cấu hình; cầu nối từ vi mô phân tử tới đại lượng đo được." },
      ],
      questions: [
        "Dự đoán chính xác hằng số tốc độ trong dung môi thực bằng mô phỏng?",
        "Kiểm soát phản ứng bằng trường điện từ/plasmon thay vì nhiệt?",
        "Giảm bất định của DFT cho hệ kim loại chuyển tiếp nặng?",
      ],
      sources: ["nist-webbook", "nomad", "pubchem", "cod"],
      tools: [{ label: "Chuyển đổi đơn vị", route: "#/tools?tab=units" }, { label: "Nồng độ & pha loãng", route: "#/tools?tab=solution" }],
      presets: ["enthalpy", "activation energy", "entropy"],
    },
    {
      slug: "analytical",
      title: "Hóa phân tích",
      eyebrow: "Chemistry · Analytical",
      icon: "⌁",
      summary:
        "Đo cái gì, đo thế nào và tin được bao nhiêu: tách, định lượng, xác nhận cấu trúc và đảm bảo chất lượng dữ liệu.",
      concepts: [
        { title: "Sắc ký", text: "HPLC/UHPLC, GC, ion chromatography; chọn pha tĩnh và gradient quyết định độ phân giải." },
        { title: "Khối phổ", text: "ESI/MALDI, MS/MS, HRMS; định lượng bằng isotope dilution là chuẩn vàng cho dấu vết." },
        { title: "NMR", text: "¹H/¹³C, 2D (COSY, HSQC, HMBC), NOE; xác định cấu trúc và động học trong dung dịch." },
        { title: "Phổ nguyên tử", text: "AAS, ICP-OES, ICP-MS cho kim loại vết; nền mẫu quyết định giới hạn phát hiện thực tế." },
        { title: "Thẩm định phương pháp", text: "Độ chọn lọc, tuyến tính, LOD/LOQ, độ lặp, độ thu hồi; theo ICH Q2 hoặc ISO 17025." },
        { title: "Metrology & bất định", text: "Truy xuất chuẩn, hiệu chuẩn, uncertainty budget — không có bất định thì con số chưa phải kết quả." },
      ],
      questions: [
        "Phân tích không phá hủy, tại chỗ, cho hỗn hợp phức tạp ở nồng độ femtomol?",
        "Chuẩn hóa liên phòng thí nghiệm cho dữ liệu omics và vật liệu?",
        "Tự động phát hiện gian lận dữ liệu phổ bằng thống kê?",
      ],
      sources: ["nist-webbook", "massbank", "nmrshiftdb", "pubchem", "europe-pmc"],
      tools: [{ label: "Nồng độ & pha loãng", route: "#/tools?tab=solution" }, { label: "Chuyển đổi đơn vị", route: "#/tools?tab=units" }],
      presets: ["chromatography", "mass spectrometry", "NMR"],
    },
    {
      slug: "advanced-materials",
      title: "Vật liệu tiên tiến",
      eyebrow: "Materials · Advanced",
      icon: "⬡",
      summary:
        "Vật liệu được thiết kế ở cấp nguyên tử để đạt tính chất không có trong tự nhiên: 2D, xốp có trật tự, perovskite, siêu dẫn, metamaterials.",
      concepts: [
        { title: "Vật liệu 2D", text: "Graphene, TMDC (MoS₂), MXene, borophene; tính chất phụ thuộc số lớp và lớp nền." },
        { title: "Khung xốp", text: "MOF/COF với diện tích bề mặt hàng nghìn m²/g — ứng dụng lưu trữ khí, tách, xúc tác." },
        { title: "Perovskite", text: "ABX₃ cho quang điện hiệu suất cao nhưng cần giải bài toán ổn định và chì." },
        { title: "Hợp kim phức tạp", text: "High-entropy alloys: trộn nhiều nguyên tố để tăng độ bền và chống ăn mòn." },
        { title: "Siêu dẫn & lượng tử", text: "Cuprate, iron-based, hydride áp cao; vật liệu tô pô cho điện toán lượng tử." },
        { title: "Metamaterials", text: "Cấu trúc nhân tạo điều khiển sóng điện từ/âm thanh vượt giới hạn vật liệu tự nhiên." },
      ],
      questions: [
        "Perovskite không chì, ổn định 25 năm ngoài trời?",
        "MOF hấp phụ CO₂ chọn lọc với chi phí tái sinh thấp?",
        "Siêu dẫn ở nhiệt độ phòng dưới áp suất thường?",
      ],
      sources: ["cod", "nomad", "materials-project", "aflow", "rcsb-pdb"],
      tools: [{ label: "Tra vật liệu NOMAD", route: "#/materials/live" }, { label: "Khối lượng mol", route: "#/tools?tab=formula" }],
      presets: ["graphene", "MOF", "perovskite", "superconductor"],
    },
    {
      slug: "medicinal-chemistry",
      title: "Hóa dược",
      eyebrow: "Pharma · Medicinal Chemistry",
      icon: "⚗",
      summary:
        "Thiết kế phân tử có hoạt tính: quan hệ cấu trúc–tác dụng, dược động học, chọn lọc target và tối ưu hóa ứng viên.",
      concepts: [
        { title: "SAR & pharmacophore", text: "Thay đổi từng phần phân tử để tìm nhóm quyết định hoạt tính và giảm tác dụng phụ." },
        { title: "Quy tắc Lipinski", text: "MW, logP, HBD, HBA dự đoán khả năng hấp thu đường uống — quy tắc kinh nghiệm, không phải định luật." },
        { title: "Prodrug & bioisostere", text: "Cải thiện hấp thu/chọn lọc bằng cách thay đổi phân tử tạm thời hoặc thay nhóm tương đương sinh học." },
        { title: "Covalent & cơ chế mới", text: "Covalent inhibitor, PROTAC, molecular glue mở rộng không gian target trước đây 'không thể druggable'." },
        { title: "ADME sớm", text: "Độ tan, thấm, chuyển hóa CYP, thải trừ — phần lớn thất bại lâm sàng đến từ đây, không phải hiệu lực." },
        { title: "Tối ưu đa mục tiêu", text: "Cân bằng hiệu lực, chọn lọc, an toàn, tổng hợp được và chi phí — bài toán Pareto, không phải một con số." },
      ],
      questions: [
        "Thiết kế ligand cho target không có túi gắn kết rõ ràng?",
        "Dự đoán độc tính gan sớm bằng mô hình dựa trên cơ chế?",
        "Tổng hợp quy mô lớn phân tử phức tạp với chi phí thấp?",
      ],
      sources: ["chembl", "pubchem", "openfda", "rxnorm", "uniprot", "open-targets"],
      tools: [{ label: "Tra ChEMBL/PubChem", route: "#/compounds" }, { label: "Công thức & khối lượng mol", route: "#/tools?tab=formula" }],
      presets: ["imatinib", "aspirin", "penicillin", "PROTAC"],
    },
    {
      slug: "pharmacology",
      title: "Dược lý học",
      eyebrow: "Pharma · Pharmacology",
      icon: "◉",
      summary:
        "Thuốc làm gì với cơ thể và cơ thể làm gì với thuốc: dược động học, dược lực học, biến thiên cá thể và an toàn thuốc.",
      concepts: [
        { title: "PK/PD", text: "ADME quyết định nồng độ theo thời gian; PD quyết định đáp ứng theo nồng độ — hai nửa của một hệ." },
        { title: "Thụ thể & tín hiệu", text: "Agonist/antagonist, allosteric, biased agonism; mật độ thụ thể thay đổi theo bệnh và thời gian." },
        { title: "Cửa sổ trị liệu", text: "Khoảng cách giữa liều hiệu quả và liều độc; thuốc có cửa sổ hẹp cần theo dõi nồng độ." },
        { title: "Chuyển hóa & CYP", text: "Pha I/II, đa hình CYP2C19/CYP2D6, tương tác thuốc — nguyên nhân phổ biến của thất bại điều trị." },
        { title: "Dược lý di truyền", text: "Biến thể gen ảnh hưởng đáp ứng; ví dụ HLA-B*15:02 và carbamazepine ở một số quần thể." },
        { title: "An toàn thuốc", text: "ADR, FAERS là tín hiệu tự nguyện — không chứng minh nhân quả; cần nghiên cứu dịch tễ để kết luận." },
      ],
      questions: [
        "Cá thể hóa liều bằng mô hình PK quần thể thời gian thực?",
        "Dự đoán ADR hiếm trước khi thử nghiệm lâm sàng?",
        "Tối ưu phối hợp thuốc bằng dữ liệu thực tế (RWD) có kiểm soát nhiễu?",
      ],
      sources: ["openfda", "rxnorm", "chembl", "dailymed", "pubmed"],
      tools: [{ label: "Tra nhãn FDA / RxNorm", route: "#/pharma" }, { label: "Nồng độ & pha loãng", route: "#/tools?tab=solution" }],
      presets: ["metformin", "warfarin", "atorvastatin", "insulin"],
    },
    {
      slug: "biological-reactions",
      title: "Phản ứng sinh học",
      eyebrow: "Biochemistry · Reactions",
      icon: "⇌",
      summary:
        "Mạng lưới phản ứng enzyme xúc tác duy trì sự sống, được mô tả bằng EC number, ChEBI và Rhea/UniProt.",
      concepts: [
        { title: "Xúc tác enzyme", text: "Giảm năng lượng hoạt hóa bằng môi trường cục bộ, acid-base chung, ion kim loại và hiệu ứng lập thể." },
        { title: "Phân loại EC", text: "Sáu lớp chính (oxidoreductase, transferase, hydrolase, lyase, isomerase, ligase) — ngôn ngữ chuẩn của enzymology." },
        { title: "Chuyển hóa", text: "Glycolysis, TCA, oxidative phosphorylation, β-oxidation; nối với bệnh chuyển hóa và dinh dưỡng." },
        { title: "Điều hòa", text: "Allosteric, phosphoryl hóa, biểu hiện gen; tốc độ dòng chảy (flux) do bước giới hạn quyết định." },
        { title: "Redox sinh học", text: "NAD⁺/NADH, FAD, quinone, cytochrome; cân bằng redox liên quan stress oxy hóa và lão hóa." },
        { title: "Quang hợp", text: "PSII tách nước bằng cụm Mn₄CaO₅, PSI khử NADP⁺; hiệu suất lượng tử gần tối đa." },
      ],
      questions: [
        "Thiết kế enzyme nhân tạo xúc tác phản ứng không có trong tự nhiên?",
        "Đo flux chuyển hóa ở cấp tế bào sống với độ phân giải cao?",
        "Tái tạo chu trình Calvin hiệu quả cho lương thực nhân tạo?",
      ],
      sources: ["rhea", "uniprot", "reactome", "chebi", "brenda", "kegg"],
      tools: [{ label: "Tra phản ứng Rhea", route: "#/reactions/explore" }, { label: "Tra protein UniProt", route: "#/biochem" }],
      presets: ["ATP hydrolysis", "glycolysis", "photosynthesis"],
    },
    {
      slug: "toxicology",
      title: "Độc chất học & an toàn hóa chất",
      eyebrow: "Safety · Toxicology",
      icon: "☣",
      summary:
        "Liều lượng tạo nên chất độc: độc động học, cơ chế độc, phân loại nguy hại và quản lý phơi nhiễm nghề nghiệp.",
      concepts: [
        { title: "Quan hệ liều–đáp ứng", text: "Ngưỡng, NOAEL/LOAEL, hormesis; 'liều duy nhất' không tồn tại cho mọi chất." },
        { title: "ADME độc chất", text: "Hấp thu qua da/hô hấp/tiêu hóa, hoạt hóa chuyển hóa (NAPQI từ paracetamol), thải trừ." },
        { title: "Cơ chế độc", text: "Stress oxy hóa, alkyl hóa DNA, ức chế enzyme (AChE), rối loạn ion/kênh — mỗi cơ chế có antidote riêng." },
        { title: "GHS & CLP", text: "Phân loại nguy hại toàn cầu: mã H (hazard) và P (precautionary), pictogram; đọc SDS đúng cách." },
        { title: "Phơi nhiễm & giới hạn", text: "TWA, STEL, IDLH; giám sát sinh học (biomonitoring) quan trọng hơn nồng độ không khí đơn thuần." },
        { title: "Độc chất môi trường", text: "Persistence, bioaccumulation (logKow), biomagnification; POPs bị cấm toàn cầu theo Stockholm Convention." },
      ],
      questions: [
        "Đánh giá phơi nhiễm hỗn hợp hóa chất thay vì từng chất riêng lẻ?",
        "Mô hình in silico thay thế thử nghiệm động vật có độ tin cậy đủ cho quy định?",
        "Phát hiện sớm độc tính gan/thận bằng biomarker nhạy?",
      ],
      sources: ["pubchem-ghs", "comptox", "echa", "openfda", "pubmed"],
      tools: [{ label: "Tra GHS trên PubChem", route: "#/compounds" }, { label: "Đơn vị nồng độ", route: "#/tools?tab=units" }],
      presets: ["benzene", "lead", "paracetamol", "cyanide"],
    },
    {
      slug: "molecular-biology",
      title: "Sinh học phân tử",
      eyebrow: "Biology · Molecular",
      icon: "🧬",
      summary:
        "Từ DNA đến protein: phiên mã, dịch mã, điều hòa, chỉnh sửa gen và công cụ đo lường phân tử.",
      concepts: [
        { title: "Central dogma", text: "DNA → RNA → protein, với phiên mã ngược, RNA không mã hóa và điều hòa biểu hiện là các tầng bổ sung." },
        { title: "CRISPR", text: "Cas9/guide RNA tạo đứt đôi; base editing và prime editing cho chỉnh sửa chính xác không đứt đôi." },
        { title: "Cấu trúc protein", text: "Bậc 1–4; dự đoán cấu trúc bằng học sâu đã thay đổi cách tiếp cận structural biology." },
        { title: "Biểu hiện gen", text: "Promoter/enhancer, yếu tố phiên mã, epigenetics (methyl hóa, histone), RNA interference." },
        { title: "Omics", text: "Genomics, transcriptomics, proteomics, metabolomics; thống kê đa biến và hiệu chỉnh multiple testing là bắt buộc." },
        { title: "Công cụ", text: "PCR/qPCR, sequencing, Western blot, flow cytometry, cryo-EM — mỗi công cụ có giới hạn phát hiện riêng." },
      ],
      questions: [
        "Chỉnh sửa gen in vivo chính xác, không off-target, cho mô người trưởng thành?",
        "Hiểu vai trò của RNA không mã hóa trong bệnh phức tạp?",
        "Mô hình hóa tế bào đơn lẻ dự đoán đáp ứng thuốc?",
      ],
      sources: ["uniprot", "rcsb-pdb", "europe-pmc", "pubmed", "gene-ontology"],
      tools: [{ label: "Tra protein UniProt", route: "#/biochem" }, { label: "Tra cấu trúc PDB", route: "#/materials/live" }],
      presets: ["p53", "CRISPR", "hemoglobin"],
    },
    {
      slug: "frontier",
      title: "Nghiên cứu & khám phá",
      eyebrow: "Research · Frontier",
      icon: "✦",
      summary:
        "Các hướng nghiên cứu đang định hình lại hóa học, vật liệu và y học — kèm chỉ dấu về mức độ trưởng thành của từng hướng.",
      concepts: [
        { title: "AI cho khoa học", text: "Mô hình học sâu cho cấu trúc protein, dự đoán tính chất, tối ưu phản ứng; giới hạn nằm ở dữ liệu và hiệu chuẩn." },
        { title: "RNA therapeutics", text: "mRNA vaccine, siRNA, aptamer; vấn đề là phân phối mô, độ ổn định và miễn dịch bẩm sinh." },
        { title: "Năng lượng sạch", text: "Hydro xanh, pin thể rắn, thu giữ carbon, quang xúc tác — thách thức nằm ở quy mô và vật liệu." },
        { title: "Vật liệu lượng tử", text: "Topological insulator, spin liquid, Majorana; ứng dụng còn xa nhưng vật lý đã được xác lập một phần." },
        { title: "Sinh học tổng hợp", text: "Thiết kế mạch gen, tế bào cảm biến, enzyme mới; an toàn sinh học là điều kiện tiên quyết." },
        { title: "Khoa học dữ liệu mở", text: "FAIR data, DOI cho dataset, tái lập kết quả; giá trị của một phát hiện phụ thuộc khả năng kiểm chứng." },
      ],
      questions: [
        "Chứng minh một phát hiện AI có giá trị thực nghiệm, không chỉ trên tập test?",
        "Đưa vật liệu mới từ lab ra sản xuất trong dưới 5 năm?",
        "Đo lường tác động môi trường của toàn bộ vòng đời vật liệu mới?",
      ],
      sources: ["europe-pmc", "crossref", "zenodo", "open-targets", "nomad"],
      tools: [{ label: "Tra tài liệu", route: "#/literature" }, { label: "Đồ thị tri thức", route: "#/graph" }],
      presets: ["mRNA vaccine", "perovskite solar cell", "green hydrogen", "protein design"],
    },
    {
      slug: "computational",
      title: "Khoa học tính toán",
      eyebrow: "Research · Computational",
      icon: "⌘",
      summary:
        "DFT, động lực học phân tử, docking và học máy — cách mô phỏng thu hẹp không gian thực nghiệm, cùng giới hạn cần công bố.",
      concepts: [
        { title: "DFT", text: "Năng lượng từ mật độ electron; chọn functional và basis set quyết định sai số, phải báo cáo rõ." },
        { title: "MD", text: "Trường lực, nhiệt độ/áp suất, sampling; thời gian mô phỏng thường ngắn hơn hiện tượng thực." },
        { title: "Docking & scoring", text: "Sàng lọc ảo xếp hạng liên kết; điểm số không phải năng lượng tự do — cần kiểm chứng thực nghiệm." },
        { title: "ML potentials", text: "Mạng nơ-ron thay thế DFT cho hệ lớn; ngoại suy ngoài vùng huấn luyện là rủi ro chính." },
        { title: "Cheminformatics", text: "SMILES/InChI, fingerprints, scaffold analysis; chuẩn hóa cấu trúc trước khi so sánh." },
        { title: "FAIR & tái lập", text: "Lưu input, phiên bản phần mềm, seed, dữ liệu thô; không có siêu dữ liệu thì kết quả không tái lập được." },
      ],
      questions: [
        "Định lượng bất định cho dự đoán DFT/ML đủ tin cậy để ra quyết định?",
        "Mô phỏng dung môi và enzyme ở thang thời gian thực?",
        "Chuẩn hóa dữ liệu phản ứng để mô hình hóa chuyển giao giữa phòng thí nghiệm?",
      ],
      sources: ["nomad", "materials-project", "pubchem", "chembl", "zenodo", "europe-pmc"],
      tools: [{ label: "Tra NOMAD", route: "#/materials/live" }, { label: "Tra ChEMBL", route: "#/compounds" }],
      presets: ["density functional theory", "molecular dynamics", "machine learning potential"],
    },
  ];
})(typeof window !== "undefined" ? window : globalThis);
