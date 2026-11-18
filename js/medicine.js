/* ===== GÓC Y DƯỢC ===== */

/* Thuốc kinh điển: lớp, năm, cơ chế, câu chuyện */
const DRUGS = [
  {n:"Aspirin (acetylsalicylic acid)", cls:"NSAID", y:"1899", mech:"Ức chế COX-1/2 → ↓ prostaglandin & TXA₂", note:"Thuốc bán chạy nhất lịch sử; liều 75mg chống kết tập tiểu cầu dự phòng NMCT."},
  {n:"Penicillin G/V", cls:"Beta-lactam", y:"1942", mech:"Ức chế transpeptidase → vách tế bào vi khuẩn vỡ", note:"Fleming 1928, Heatley/Florey sản xuất đại trà WWII; kháng sinh đầu tiên."},
  {n:"Amoxicillin", cls:"Beta-lactam", y:"1972", mech:"Như penicillin + phổ rộng hơn, uống hấp thu tốt", note:"Kết hợp clavulanic acid chống beta-lactamase (Augmentin)."},
  {n:"Paracetamol/Acetaminophen", cls:"Analgesic-antipyretic", y:"1955", mech:"COX trung ương (cơ chế vẫn đang nghiên cứu!)", note:"Độc gan khi quá liều — giải độc N-acetylcysteine; không phải NSAID."},
  {n:"Ibuprofen", cls:"NSAID propionic", y:"1969", mech:"Ức chế COX không chọn lọc", note:"Boots UK Stewart Adams tự test trên headache hangover!"},
  {n:"Morphine", cls:"Opioid agonist", y:"1826 thương mại", mech:"Agonist μ-opioid receptor", note:"Sertürner tách từ thuốc phiện 1804 — alkaloid hoạt động đầu tiên."},
  {n:"Heroin (diacetylmorphine)", cls:"Opioid (bị kiểm soát)", y:"1898 Bayer", mech:"Prodrug morphine mạnh hơn ×2 qua BBB", note:"Bayer từng bán làm 'không gây nghiện' thay codeine ho — thảm họa dược sử."},
  {n:"Quinine", cls:"Antimalarial", y:"1630s Peru bark", mech:"Độc plasmodium heme detox", note:"Vỏ cây cinchona; tonic water & gin-tonic ra đời từ đây!"},
  {n:"Artemisinin", cls:"Antimalarial ACT", y:"1972", mech:"Peroxide bridge → radical diệt plasmodium", note:"Tu Youyou Nobel 2015; chuẩn điều trị malaria toàn cầu hiện nay."},
  {n:"Metformin", cls:"Biguanide", y:"1957", mech:"↓ gluconeogenesis gan, AMPK activation", note:"Số 1 đái tháo đường type 2; nguồn gốc cỏ cừu galega medieval."},
  {n:"Insulin (Humulin)", cls:"Hormone peptide", y:"1921 / 1982 recombinant", mech:"Receptor GLUT4 → glucose vào tế bào", note:"Banting-Best Macleod Nobel 1923; Genentech Humulin là protein recombinant đầu tiên."},
  {n:"Warfarin", cls:"Anticoagulant VKA", y:"1948", mech:"Ức chế vitamin K epoxide reductase", note:"Ban đầu... chuột độc! Từ bệnh chảy máu gia súc ăn clover hỏng Wisconsin."},
  {n:"Digoxin", cls:"Cardiac glycoside", y:"1785 digitalis", mech:"Ức chế Na⁺/K⁺ ATPase → ↑ Ca²⁺ tim co mạnh hơn", note:"William Withering từ hoa digitalis foxglove dân gian phù thũng."},
  {n:"Lidocaine", cls:"Local anesthetic amide", y:"1948", mech:"Chặn kênh Na⁺ voltage-gated", note:"Cocaine → procaine → lidocaine lineage; an toàn hơn cocaine nguyên bản."},
  {n:"Nitrous oxide N₂O", cls:"Anesthetic gas", y:"1844", mech:"NMDA antagonist + GABA", note:'"Laughing gas" party Horace Wells nhận ra đau không thấy khi té xe.'},
  {n:"Halothane → Isoflurane", cls:"Inhalational anesthetic", y:"1956/1980", mech:"GABA_A potentiation", note:"Thế hệ halogenated ether — phẫu thuật hiện đại an toàn."},
  {n:"Ketamine", cls:"Dissociative anesthetic", y:"1970", mech:"NMDA antagonist", note:"Giờ cả antidepressant rapid-action esketamine nasal spray."},
  {n:"Diazepam Valium", cls:"Benzodiazepine", y:"1963", mech:"↑ GABA_A frequency channel opening", note:"'Mother's little helper' — thuốc kê nhiều nhất thập niên 70."},
  {n:"Fluoxetine Prozac", cls:"SSRI", y:"1987", mech:"Chọn lọc chặn reuptake serotonin", note:"Khởi phong trào tâm lý học trị liệu hóa học hiện đại."},
  {n:"Lithium carbonate", cls:"Mood stabilizer", y:"1949", mech:"Ức chế inositol monophosphatase, GSK-3β", note:"Nguyên tố bảng tuần hoàn thành thuốc thần kinh — duy nhất!"},
  {n:"Levodopa + carbidopa", cls:"Anti-Parkinson", y:"1970s", mech:"Precursor dopamine + peripheral DDC inhibitor", note:"Carbidopa không qua BBB nên chỉ chặn levodopa ngoài não."},
  {n:"Salbutamol Ventolin", cls:"β₂ agonist SABA", y:"1969", mech:"β₂ receptor → bronchodilation cAMP", note:"Inhaler cứu mạng hen suyễn — thiết kế dùng được trẻ em."},
  {n:"Cortisone/Prednisolone", cls:"Glucocorticoid", y:"1948", mech:"Receptor nuclear → anti-inflammatory gene expression", note:"Hench/Kendall/Reichstein Nobel 1950; 'phép màu' viêm khớp rheumatoid."},
  {n:"Norethisterone (the Pill)", cls:"Progestin OC", y:"1960", mech:"Phản hồi âm giả thai ngăn rụng trứng", note:"Djerassi tổng hợp; thay đổi xã hội thế kỷ XX sâu nhất mọi loại thuốc."},
  {n:"Omeprazole", cls:"PPI", y:"1988", mech:"Ức chế H⁺/K⁺ ATPase proton pump irreversibly", note:"Loét dạ dày khỏi cần phẫu thuật — Nobel 2005 Marshall uống H. pylori chứng minh!"},
  {n:"Cimetidine Tagamet", cls:"H₂ antagonist", y:"1976", mech:"Chặn H₂ receptor acid parietal", note:"Thuốc đầu tiên thiết kế rational (Black Nobel 1988) — doanh thu blockbuster đầu tiên."},
  {n:"Sildenafil Viagra", cls:"PDE5 inhibitor", y:"1998", mech:"↑ cGMP → vasodilation corpus cavernosum", note:"Side effect angina drug thất bại → industry $2 tỷ/năm!"},
  {n:"Minoxidil", cls:"Vasodilator/topical", y:"1988 topical", mech:"K_ATP opener → hair follicle growth paradox", note:"Uống hạ áp mọc râu tóc — chuyển đổi thành serum mọc tóc."},
  {n:"Imatinib Gleevec", cls:"TKI targeted therapy", y:"2001", mech:"Ức chế BCR-ABL fusion kinase CML", note:"'Magic bullet' thật sự — CML từ tử vong thành bệnh mạn tính; Nobel 2020 hunter."},
  {n:"AZT (Zidovudine)", cls:"NRTI antiretroviral", y:"1987", mech:"Reverse transcriptase chain terminator", note:"Thuốc AIDS đầu tiên tái chế từ ung thư thất bại 1964."},
  {n:"Sofosbuvir", cls:"NS5B inhibitor", y:"2013", mech:"Prodrug nucleotide chặn HCV RNA polymerase", note:"Điều trị khỏi hepatitis C ~95% — 'functional cure' lần đầu viral chronic."},
  {n:"Ivermectin", cls:"Antiparasitic avermectin", y:"1981", mech:"Glutamate-gated Cl⁻ channel worm paralysis", note:"Satoshi Ōmura & Campbell Nobel 2015 — xóa gần hết onchocerciasis châu Phi."},
  {n:"Vancomycin", cls:"Glycopeptide last-resort", y:"1958", mech:"Bind D-Ala-D-Ala chặn vách peptidoglycan", note:"'Kháng sinh cuối cùng' MRSA; VRSA xuất hiện = báo động AMR."},
  {n:"Acyclovir", cls:"Antiviral nucleoside", y:"1981", mech:"Chain termination HSV DNA polymerase", note:"Gertrude Elion design — chọn lọc kinase virus nên độc tế bào thấp."},
  {n:"Warfarin antidote Vitamin K₁", cls:"—", y:"—", mech:"Phục hồi clotting factor synthesis", note:"(xem tab Giải độc)"},
  {n:"Naloxone Narcan", cls:"Opioid antagonist", y:"1971", mech:"Competitive μ-receptor reversal", note:"Cứu overdose opioid đại dịch fentanyl — nasal spray cho bystander."},
  {n:"N-acetylcysteine (NAC)", cls:"Antidote/mucolytic", y:"1960s", mech:"Replenish glutathione detox NAPQI", note:"Cứu quá liều paracetamol trong 8-10h cửa sổ vàng."},
  {n:"Atropine", cls:"Antimuscarinic antidote", y:"1831 isolate", mech:"Competitive muscarinic blocker", note:"Từ atropa belladonna; giải độc organophosphate pesticide/sarin với pralidoxime."},
  {n:"Hydroxocobalamin", cls:"Cyanide antidote", y:"1990s", mech:"Bind CN⁻ → cyanocobalamin (vitamin B12) thận đào thải", note:"Giải độc cyanide bằng... chính vitamin B12!"},

  /* --- Tim mạch --- */
  {n:"Nitroglycerin (GTN)", cls:"Nitrate angina", y:"1879", mech:"→ NO ↑ cGMP giãn động mạch vành", note:"Thuốc nổ Nobel thành thuốc cứu cơn đau thắt ngực — ngậm dưới lưỡi bỏ first-pass."},
  {n:"Atenolol/Metoprolol", cls:"Beta-blocker", y:"1970s", mech:"Chặn β₁ tim → ↓ nhịp, ↓ co bóp", note:"Black box: NGỪNG đột ngột gây rebound tachycardia NMCT."},
  {n:"Amlodipine", cls:"Calcium channel blocker", y:"1990", mech:"Chặn kênh L-type Ca²⁺ cơ trơn mạch → giãn mạch", note:"Hạ áp êm; side effect phù cổ chân edema đặc trưng."},
  {n:"Captopril/Enalapril", cls:"ACE inhibitor", y:"1981", mech:"Chặn ACE → ↓ Angiotensin II", note:"Từ peptide nọc rắn Bothrops! Side effect ho khan do bradykinin."},
  {n:"Losartan", cls:"ARB", y:"1995", mech:"Chặn receptor AT₁ Angiotensin II", note:"Không gây ho như ACEi — designed để tránh bradykinin pathway."},
  {n:"Furosemide", cls:"Loop diuretic", y:"1964", mech:"Chặn NKCC2 Henle → bài niệu mạnh", note:"'Water pill' suy tim; theo dõi K⁺ sát sao — hypokalemia nguy hiểm."},
  {n:"Clopidogrel Plavix", cls:"P2Y₁₂ antiplatelet", y:"1997", mech:"Chặn ADP receptor → ngăn kết tập tiểu cầu", note:"Prodrug qua CYP2C19 — poor metabolizer gene test cá thể hóa."},
  {n:"Atorvastatin Lipitor", cls:"Statin HMG-CoA RI", y:"1997", mech:"Ức chế HMG-CoA reductase ↓ cholesterol tổng hợp", note:"Doanh thu $125 tỷ — thuốc bán chạy nhất mọi thời đại."},
  {n:"Amiodarone", cls:"Class III antiarrhythmic", y:"1960s", mech:"Block K⁺ channel kéo dài AP", note:"Đa cơ quan độc: phổi, gan, giáp, da xanh xám — 'double-edged sword'."},
  {n:"Heparin / Enoxaparin", cls:"Anticoagulant", y:"1916 / LMWH 1980s", mech:"Potentiate antithrombin III → chặn IIa/Xa", note:"Từ gan heo McLean sinh viên 1916; reversed protamine."},

  /* --- Thần kinh & tâm thần --- */
  {n:"Phenobarbital", cls:"Barbiturate", y:"1912", mech:"GABA_A prolong opening", note:"Chống động kinh đầu tiên vẫn dùng; thay thế bởi benzo an toàn hơn."},
  {n:"Carbamazepine", cls:"Anti-epileptic Na⁺ blocker", y:"1974", mech:"Use-dependent sodium channel block", note:"HLA-B*1502 screen bắt buộc người Đông Á — SJS/TEN nguy hiểm."},
  {n:"Sodium valproate", cls:"Broad AED", y:"1967", mech:"↑ GABA + block Na⁺ + T-type Ca²⁺", note:"Teratogenic — chống chỉ định phụ nữ có khả năng mang thai (2024 rules)."},
  {n:"Gabapentin/Pregabalin", cls:"α₂δ ligand neuropathic", y:"1993", mech:"Bind α₂δ Ca²⁺ subunit giảm glutamate release", note:"Đau dây thần kinh & fibromyalgia; misuse rising."},
  {n:"Chlorpromazine Largactil", cls:"Typical antipsychotic", y:"1952", mech:"D₂ antagonist", note:"Khóa psychiatric asylum — 'chemical lobotomy' debate; khởi psychopharmacology."},
  {n:"Clozapine", cls:"Atypical antipsychotic", y:"1972", mech:"Multi-receptor D₄/5HT₂A loose binding", note:"Schizophrenia treatment-resistant gold standard; agranulocytosis monitor WBC tuần."},
  {n:"Haloperidol", cls:"Butyrophenone", y:"1958", mech:"Strong D₂ blockade", note:"Acute psychosis agitation; EPS extrapyramidal side effects kinh điển."},
  {n:"Methylphenidate Ritalin", cls:"Stimulant ADHD", y:"1955", mech:"DAT/NET reuptake inhibitor", note:"ADDA trẻ em; 'study drug' misuse đại học controversy."},

  /* --- Nhiễm khuẩn & ký sinh --- */
  {n:"Doxycycline", cls:"Tetracycline", y:"1967", mech:"30S ribosome block aminoacyl-tRNA", note:"Malaria prophylaxis du lịch, Lyme, acne; photosensitivity tránh nắng."},
  {n:"Azithromycin Zithromax", cls:"Macrolide azalide", y:"1991", mech:"50S exit tunnel block", note:"Z-pak 3 ngày nhờ dài t½ 68h — tissue penetration sâu."},
  {n:"Ceftriaxone", cls:"3rd gen cephalosporin", y:"1982", mech:"Beta-lactam PBP bind gram-negative mạnh", note:"IV/IM once daily — workhorse bệnh viện; gonorrhea last oral line shifting."},
  {n:"Isoniazid + Rifampicin", cls:"Anti-TB DOTs backbone", y:"1952/1966", mech:"INH mycolic acid · RIF RNA polymerase", note:"Liệu trình 6 tháng; INH → peripheral neuropathy cần B6; RIF cam nước tiểu."},
  {n:"Metronidazole Flagyl", cls:"Nitroimidazole", y:"1959", mech:"Radical DNA anaerobe/amoeba damage", note:"Disulfiram-like reaction với alcohol — không uống rượu khi dùng!"},
  {n:"Fluconazole", cls:"Triazole antifungal", y:"1990", mech:"Lanosterol 14-α demethylase block ergosterol", note:"Candida systemic; CYP inhibitor tương tác nhiều thuốc."},
  {n:"Amphotericin B", cls:"Polyene antifungal", y:"1958", mech:"Bind ergosterol pore membrane fungus", note:"'Amphoterrible' nephrotoxicity — liposomal formulation cứu thận."},
  {n:"Praziquantel", cls:"Antihelminthic", y:"1975", mech:"Ca²⁺ influx worm paralysis tegument damage", note:"Sán lá gan, schistosomiasis — một viên uống khỏi sán chó thịt gỏi cá!"},
  {n:"Albendazole", cls:"Benzimidazole", y:"1975", mech:"β-tubulin bind giun microtubule collapse", note:"Tẩy giun định kỳ chương trình trường học Việt Nam."},

  /* --- Nội tiết & chuyển hóa --- */
  {n:"Levothyroxine T4", cls:"Thyroid hormone", y:"1950s", mech:"T4 → T3 nuclear receptor metabolism set-point", note:"Thuốc kê nhiều nhất Mỹ; uống sáng bụng đói cách canxi/sắt 4h."},
  {n:"Glipizide/Glibenclamide", cls:"Sulfonylurea", y:"1950s", mech:"K_ATP β-cell close → insulin release", note:"Trước metformin era; hypoglycemia risk cao hơn — 'force the pancreas'."},
  {n:"Empagliflozin", cls:"SGLT2 inhibitor", y:"2014", mech:"Chặn glucose reabsorb thận → glucosuria", note:"Game-changer: ngoài hạ đường còn bảo vệ tim thận breakthrough."},
  {n:"Alendronate Fosamax", cls:"Bisphosphonate", y:"1995", mech:"Ức chế osteoclast farnesyl PP — chống hủy xương", note:"Osteoporosis sau mãn kinh; uống đứng upright tránh esophagitis."},

  /* --- Hô hấp & dị ứng --- */
  {n:"Ipratropium", cls:"Muscarinic antagonist SAMA", y:"1986", mech:"Chặn M₃ bronchoconstriction", note:"COPD combo với salbutamol — DuoVent blue+grey inhaler."},
  {n:"Budesonide", cls:"ICS inhaled corticosteroid", y:"1981", mech:"Local anti-inflammatory airway", note:"Controller hen suyễn — giảm exacerbation & mortality khi dùng đều."},
  {n:"Montelukast Singulair", cls:"LTRA", y:"1998", mech:"Chặn leukotriene CysLT₁ receptor", note:"Viên uống hen dị ứng; FDA black box neuropsychiatric effects 2020."},
  {n:"Theophylline", cls:"Methylxanthine cũ", y:"1920s", mech:"PDE inhibitor + adenosine antagonist", note:"Thế hệ trước salbutamol; TI thấp phải đo nồng độ máu — giờ ít dùng."},
  {n:"Cetirizine/Levocetirizine", cls:"H₁ antihistamine thế hệ 2", y:"1987/2001", mech:"Peripheral H₁ block ít xuyên BBB", note:"Ít buồn ngủ hơn chlorpheniramine đời đầu — design deliberate."},

  /* --- Tiêu hóa --- */
  {n:"ORS dung dịch bù nước", cls:"Rehydration therapy", y:"1971 Bangladesh", mech:"Na-glucose cotransport vẫn hoạt động khi tiêu chảy", note:"Cứu >50 triệu trẻ em — phát minh y học công cộng vĩ đại nhất thế kỷ XX."},
  {n:"Ondansetron Zofran", cls:"5-HT₃ antagonist", y:"1991", mech:"Chặn serotonin vomiting center vagus", note:"Hóa trị nôn ói không kiểm soát → controlled; serotype-specific design."},
  {n:"Loperamide Imodium", cls:"Opioid anti-diarrheal", y:"1976", mech:"μ-receptor intestinal wall, không qua BBB", note:"Giảm peristalsis; abuse high-dose QT prolongation warning."},
  {n:"Mesalazine (5-ASA)", cls:"IBD aminosalicylate", y:"1977", mech:"Local colon anti-inflammatory PPAR-γ", note:"Ulcerative colitis topical-in-a-pill; pH-release coating đến đại tràng."},
  {n:"Ranitidine recall saga", cls:"H₂RA (đã thu hồi)", y:"1981–2020", mech:"(trước đây) H₂ block acid", note:"NDMA carcinogen impurity degradation — bài học nitrosamine class-wide."},

  /* --- Ung thư & miễn dịch --- */
  {n:"Tamoxifen", cls:"SERM breast cancer", y:"1977", mech:"ER antagonist vú (agonist xương/niêm mạc)", note:"Tissue-selective design; CYP2D6 endoxifen active metabolite."},
  {n:"Cyclophosphamide", cls:"Alkylating agent", y:"1959", mech:"Cross-link DNA guanine N7", note:"Prodrug CYP450 → phosphoramide mustard; hemorrhagic cystitis mesna rescue."},
  {n:"Trastuzumab Herceptin", cls:"HER2 monoclonal Ab", y:"1998", mech:"Bind HER2 → ADCC internalize growth signal", note:"Biologic cancer đầu tiên; cardiotoxicity monitoring với echo."},
  {n:"Rituximab", cls:"Anti-CD20 mAb", y:"1997", mech:"Deplete B cells complement/ADCC", note:"NHL & autoimmune rheumatoid/MS — 'B-cell depletion' platform."},
  {n:"Pembrolizumab Keytruda", cls:"PD-1 checkpoint inhibitor", y:"2014", mech:"Unblock PD-1/PD-L1 → T-cell attack tumor", note:"Immunotherapy revolution; Nobel Allison/Honjo 2018; Jimmy Carter cured melanoma."},
  {n:"Adalimumab Humira", cls:"Anti-TNF mAb", y:"2003", mech:"Neutralize TNF-α inflammatory cytokine", note:"Doanh thu $200 tỷ lifetime — best-selling drug ever trước semaglutide era."},
  {n:"Hydroxychloroquine", cls:"DMARD antimalarial", y:"1955", mech:"Lysosomotropic autophagy/phagosome pH", note:"Lupus/RA pregnancy-safe; COVID trial negative — evidence over hype."},

  /* --- Gây mê hồi sức --- */
  {n:"Propofol Diprivan", cls:"IV anesthetic", y:"1986", mech:"GABA_A modulator lipid emulsion", note:"'Milk of amnesia'; Michael Jackson propofol misuse death lesson."},
  {n:"Succinylcholine", cls:"Depolarizing NMJ blocker", y:"1951", mech:"Persistent ACh receptor depolarization paralysis", note:"Intubation rapid sequence; malignant hyperthermia rare fatal trigger."},
  {n:"Noradrenaline pressor", cls:"Vasopressor ICU", y:"—", mech:"α₁ vasoconstriction MAP support septic shock", note:"First-line shock nhiễm trùng guideline Surviving Sepsis."},

  /* --- Vaccine (nhóm đặc biệt) --- */
  {n:"Vaccine đậu mùa Jenner", cls:"Live attenuated origin", y:"1796", mech:"Cowpox cross-immunity variola", note:"Vaccine đầu tiên lịch sử — từ 'vacca' con bò; xóa sổ 1980."},
  {n:"Vaccine dại Pasteur", cls:"Attenuated dried cord", y:"1885", mech:"Post-exposure immunization before symptom onset", note:"Joseph Meister bé 9 tuổi bị chó dại cắn — Pasteur risk his career saving him."},
  {n:"MMR vaccine & Wakefield fraud", cls:"Live attenuated MMR", y:"1971", mech:"Measles-Mumps-Rubella combined immunity", note:"Autism paper 1998 = FRAUD revoked — vaccination rates dropped → outbreaks. Lesson in scientific integrity."},

  /* --- Thần kinh mở rộng --- */
  {n:"Donepezil", cls:"Cholinesterase inhibitor", y:"1996", mech:"Central AChE inhibition ↑ cholinergic cognition", note:"Alzheimer chuẩn điều trị; không sửa bệnh chỉ làm chậm suy giảm."},
  {n:"Memantine", cls:"NMDA antagonist uncompetitive", y:"2002", mech:"Chặn tonic glutamate excitotoxicity giữ phasic signal", note:"Trung-độ-nặng Alzheimer; cơ chế 'giảm nhiễu' độc đáo."},
  {n:"Aripiprazole Abilify", cls:"D₂ partial agonist", y:"2002", mech:"Ổn định dopamine: agonist khi thấp, antagonist khi cao", note:"'Dopamine system stabilizer' — functional selectivity concept."},
  {n:"Zolpidem Ambien", cls:"Z-drug hypnotic", y:"1992", mech:"GABA_A α1-subunit selective sedation", note:"Chọn α1 gây ngủ, ít giãn cơ/anxiolytic hơn benzo — subtype design."},
  {n:"Modafinil", cls:"Wakefulness promoter", y:"1998", mech:"Dopamine transporter weak + orexin/histamine activation", note:"Narcolepsy; 'smart drug' off-label debate ethics."},
  {n:"Sumatriptan Imigran", cls:"Triptan 5-HT₁B/₁D agonist", y:"1991", mech:"Cranial vasoconstriction + trigeminal peptide inhibition", note:"Từ LSD research → migraine miracle; contraindicated coronary disease."},
  {n:"Topiramate", cls:"Broad AED prophylaxis", y:"1996", mech:"Na⁺ + AMPA + GABA + carbonic anhydrase multi-hit", note:"Dự phòng migraine & giảm cân side effect thành indication mới."},

  /* --- Giảm đau --- */
  {n:"Tramadol", cls:"Dual μ-weak + SNRI", y:"1977", mech:"Weak μ-opioid + serotonin/noradrenaline reuptake block", note:"O-desmethyl metabolite mạnh ×200 — CYP2D6 dependent again!"},
  {n:"Fentanyl", cls:"Synthetic μ full agonist", y:"1960", mech:"μ-receptor lipophilic rapid BBB crossing", note:"×100 morphine; analog fentanyl crisis illicit chemistry arms race."},
  {n:"Bupivacaine vs Levobupivacaine", cls:"Long local anesthetic amide", y:"1963/2000", mech:"Na⁺ channel block prolonged", note:"R-enantiomer cardiotoxic hơn — chiral switch cứu tim mạch."},

  /* --- Tim mạch thêm --- */
  {n:"Ranolazine Ranexa", cls:"Late INa inhibitor", y:"2006", mech:"Giảm sodium late current → ↓ Ca²⁺ overload ischemia", note:"Anti-anginal KHÔNG đổi nhịp/Huyết áp — mechanism novel."},
  {n:"Ivabradine Procoralan", cls:"If channel blocker", y:"2005", mech:"Chặn funny current SA node → pure HR reduction", note:'"Chỉ hạ nhịp thôi" — sinus node engineering pharmacology.'},
  {n:"Sacubitril/valsartan Entresto", cls:"ARNI dual inhibitor", y:"2015", mech:"Neprilysin block (BNP↑) + ARB — PARADIGM-HF milestone", note:"Suy tim HFpEF/HFrEF game changer; never with ACEi — angioedema."},
  {n:"Alteplase tPA", cls:"Thrombolytic serine protease", y:"1987", mech:"Activate plasminogen→plasmin dissolve fibrin clot", note:"Stroke window 4.5h gold; recombinant protein biotech flagship."},
  {n:"Dobutamine", cls:"β₁ inotrope synthetic", y:"1975", mech:"β₁ agonist ↑ contractility stroke volume", note:"Stress echo drug & ICU heart failure bridge therapy."},

  /* --- Hô hấp precision medicine --- */
  {n:"Ivacaftor Kalydeco", cls:"CFTR potentiator", y:"2012", mech:"Mở kênh chloride CFTR-G551D mutant hoạt động lại", note:"Precision medicine landmark — genotyping trước prescribing; $300k/năm."},
  {n:"Elexacaftor/tezacaftor/ivacaftor Trikafta", cls:"CF triple corrector+potentiator", y:"2019", mech:"Fold trafficking rescue + gate open combo F508del", note:"~90% người CF có lợi — gần 'functional cure' cystic fibrosis."},
  {n:"Omalizumab Xolair", cls:"Anti-IgE monoclonal", y:"2003", mech:"Bind free IgE downregulate FcεRI allergic cascade", note:"Biologic asthma đầu tiên; urticaria chronic spontaneous too."},
  {n:"Roflumilast Daxas", cls:"PDE4 inhibitor oral COPD", y:"2010", mech:"↑ cAMP anti-inflammatory bronchi non-bronchodilator", note:"COPD nặng với chronic bronchitis exacerbations; nausea dose-limiting."},

  /* --- Tiêu hóa miễn dịch --- */
  {n:"Infliximab Remicade", cls:"Chimeric anti-TNF mAb", y:"1998", mech:"Neutralize TNF-α soluble & transmembrane", note:"Crohn fistula healing revolution; chimeric mouse part → immunogenicity lesson."},
  {n:"Ursodeoxycholic acid UDCA", cls:"Bile acid hepatoprotective", y:"—", mech:"Displace toxic hydrophobic bile acids cytoprotective", note:"Sỏi cholesterol tan được; PBC primary biliary cholangitis standard."},
  {n:"Linaclotide Constella", cls:"GC-C agonist peptide", y:"2012", mech:"Mimic guanylin → cGMP → chloride secretion constipation relief", note:"IBS-C peptide oral không hấp thu hành động tại ruột — design elegant."},

  /* --- Nội tiết xương --- */
  {n:"Denosumab Prolia", cls:"RANKL monoclonal", y:"2010", mech:"Block osteoclast formation differentiation survival", note:"Anti-RANKL 6-month injection; rebound fracture risk after stopping!"},
  {n:"Teriparatide Forteo", cls:"PTH(1-34) anabolic", y:"2002", mech:"Intermittent PTH builds bone (continuous resorbs paradox)", note:"Liều ngắt quãng tạo xương mới — timing is everything endocrine."},
  {n:"Cabergoline Dostinex", cls:"D₂ agonist long-acting", y:"1996", mech:"Dopamine receptor prolactin suppression", note:"Prolactinoma first-line; Parkinson adjunct high-dose valve fibrosis warning."},
  {n:"Octreotide Sandostatin", cls:"Somatostatin analog octapeptide", y:"1988", mech:"SSTR agonist ↓ GH/insulin/glucagon secretions", note:"Acromegaly & variceal bleeding; t½ minutes natural → hours analog design."},

  /* --- Miễn dịch ghép/tự miễn --- */
  {n:"Tacrolimus FK506", cls:"Calcineurin inhibitor macrolide", y:"1994", mech:"FKBP complex block calcineurin NFAT IL-2 transcription", note:"Transplant backbone stronger than cyclosporine; nephrotoxicity monitor trough."},
  {n:"Sirolimus rapamycin", cls:"mTOR inhibitor", y:"1999", mech:"FKBP12-mTOR complex block cell cycle G1", note:"Easter Island soil discovery; longevity research darling mTOR biology."},
  {n:"Tofacitinib Xeljanz", cls:"JAK1/3 inhibitor small molecule", y:"2012", mech:"Block cytokine signaling JAK-STAT intracellular", note:"Oral 'biologic-alternative' RA/UC/psoriasis — kinase inhibitor era."},
  {n:"Dupilumab Dupixent", cls:"IL-4Rα monoclonal", y:"2017", mech:"Block IL-4/IL-13 type-2 inflammation shared receptor", note:"Eczema-asthma-nasal polyps one drug three diseases — Th2 axis master key."},

  /* --- Kháng sinh/kháng virút mới --- */
  {n:"Daptomycin Cubicin", cls:"Lipopeptide membrane disruptor", y:"2003", mech:"Ca²⁺-dependent membrane depolarization bactericidal", note:"MRSA/VRE skin & bloodstream; inactivated by lung surfactant — pneumonia NO!"},
  {n:"Ceftaroline Teflaro", cls:"5th-gen cephalosporin", y:"2010", mech:"Binds PBP2a (altered target of MRSA) active", note:"First β-lactam covering MRSA — binding affinity redesign success."},
  {n:"Bedaquiline Sirturo", cls:"Diarylquinoline MDR-TB", y:"2012", mech:"ATP synthase mycobacterial proton pump novel target", note:"40 năm thuốc TB mới đầu tiên — QT prolongation monitoring ECG."},
  {n:"Bictegravir Biktarvy", cls:"INSTI strand transfer", y:"2018", mech:"Integrase strand transfer block proviral DNA", note:"Single-tablet regimen HIV hiện đại highest barrier resistance."},
  {n:"Lenacapavir Sunlenca", cls:"HIV capsid inhibitor first-in-class", y:"2022", mech:"Multi-stage capsid protein disruption conformation", note:"Tiêm 2 lần/NĂM dự phòng PURPOSE trial 100% — prevention game changer."},
  {n:"Nirmatrelvir/ritonavir Paxlovid", cls:"3CL protease inhibitor + booster", y:"2021", mech:"Covalent reversible 3CLpro block viral polyprotein", note:"Ritonavir không trị COVID mà ức chế CYP3A giữ nirmatrelvir — boosting trick classic."},

  /* --- Ung thư thế hệ mới --- */
  {n:"Venetoclax Venclexta", cls:"BH3 mimetic BCL2", y:"2016", mech:"Restore apoptosis bind anti-apoptotic BCL2 pocket", note:"CLL/AML; tumor lysis syndrome management intensive first cycles."},
  {n:"Olaparib Lynparza", cls:"PARP inhibitor synthetic lethality", y:"2014", mech:"BRCA-mutant cells cannot repair PARP-blocked SSB → death", note:"Concept 'synthetic lethality' Nobel-worthy logic — BRCA testing companion dx."},
  {n:"Erlotinib Tarceva", cls:"EGFR TKI lung cancer", y:"2004", mech:"ATP competitive EGFR tyrosine kinase domain block", note:"Never-smoker Asian adenocarcinoma mutation enriched — biomarker-driven era start."},
  {n:"Carfilzomib Kyprolis", cls:"Proteasome epoxyketone", y:"2012", mech:"Irreversible 20S proteasome block multiple myeloma", note:"Second-generation bortezomib improvement cardiovascular watch."},
  {n:"Blinatumomab Blincyto", cls:"BiTE bispecific T-cell engager", y:"2014", mech:"CD3×CD19 linker drag T-cells to leukemia blasts", note:"Antibody fragment half-life hours — continuous 28-day infusion pump required."},
  {n:"Tisagenlecleucel Kymriah", cls:"CAR-T autologous CD19", y:"2017", mech:"Patient T-cells engineered CAR recognize CD19 B-lineage", note:"First gene-modified cell therapy FDA — each dose unique manufacturing patient-specific."},

  /* --- Tiết niệu/Da/Mắt/Thuốc giải --- */
  {n:"Finasteride Proscar/Propecia", cls:"5α-reductase inhibitor", y:"1992", mech:"Block testosterone→DHT conversion type II isoform", note:"BPH & male-pattern hair loss; dutasteride blocks type I+II both."},
  {n:"Tamsulosin Flomax", cls:"α₁A-selective blocker", y:"1997", mech:"Prostate smooth muscle relaxation uroselective", note:"Subtype selectivity tránh hypotension orthostatic của non-selective predecessors."},
  {n:"Latanoprost Xalatan", cls:"PGF₂α analog glaucoma", y:"1996", mech:"↑ uveoscleral outflow once-nightly drop", note:"Iris darkening side effect permanent heterochromia — prostaglandin biology."},
  {n:"Isotretinoin Accutane", cls:"13-cis retinoic acid acne", y:"1982", mech:"Retinoid nuclear receptor sebaceous gland atrophy", note:"Severe acne cure but teratogenic — iPLEDGE pregnancy program strictest ever."},
  {n:"Idarucizumab Praxbind", cls:"Monoclonal Fab reversal agent", y:"2015", mech:"Humanized Fab bind dabigatran affinity ×350", note:"Antidote antibody for anticoagulant — biologic antidote era bleeding emergencies."},

  /* --- Đợt 3: CNS sâu --- */
  {n:"Lamotrigine", cls:"AED bipolar Na⁺ blocker", y:"1994", mech:"Use-dependent Na⁺ + ↓glutamate release", note:"Bipolar depression maintenance; SJS titration slow mandatory!"},
  {n:"Levetiracetam Keppra", cls:"SV2A modulator", y:"2000", mech:"Bind synaptic vesicle protein SV2A ↓neurotransmitter release", note:"Novel target không kênh ion — broad spectrum minimal interactions."},
  {n:"Quetiapine Seroquel", cls:"Multiplex receptor antipsychotic", y:"1997", mech:"D₂ + 5HT₂A + H₁ + α₁ broad binding", note:'"Everything drug" off-label insomnia; metabolic syndrome monitoring.'},
  {n:"Vortioxetine", cls:"Multimodal serotonergic", y:"2013", mech:"SSRI + 5HT₁A agonist + 5HT₃ antagonist cognitive benefit", note:"Depression with cognition claims — multimodal pharmacology design."},
  {n:"Bupropion Wellbutrin", cls:"NDRI atypical antidepressant", y:"1985", mech:"Dopamine-noradrenaline reuptake inhibition", note:"Smoking cessation Zyban; seizure dose-dependent ceiling warning."},
  {n:"Mirtazapine Remeron", cls:"NaSSA α₂ antagonist", y:"1994", mech:"Block presynaptic α₂ ↑NE/5HT release + H₁ sedation", note:"Insomnia-depression appetite loss elderly favorite; weight gain trade-off."},

  /* --- Tim mạch đông cầm mở rộng --- */
  {n:"Spironolactone/Eplerenone", cls:"MR antagonists", y:"1959/2002", mech:"Block aldosterone mineralocorticoid receptor", note:"RAAS fourth pillar HF; eplerenone selective ít gynecomastia spiro."},
  {n:"Ticagrelor Brilinta", cls:"P2Y₁₂ reversible allosteric", y:"2011", mech:"Allosteric receptor not ADP-competitive like clopidogrel", note:"Faster offset surgery-friendly; dyspnea side effect adenosine theory."},
  {n:"Apixaban Eliquis", cls:"Factor Xa DOAC", y:"2011", mech:"Direct Xa active-site reversible block", note:"DOAC king AF/VTE — fewer bleeds warfarin ARISTOTLE; reversal andexanet."},
  {n:"Isosorbide mononitrate", cls:"Long-acting nitrate", y:"—", mech:"NO donor venodilation preload reduction", note:"Nitrate-free interval 10-12h tránh tolerance tachyphylaxis mechanism."},
  {n:"Hydralazine", cls:"Direct arteriolar vasodilator", y:"1950s", mech:"Unknown exact — K⁺ channel/ref NO theories", note:"Hypertension pregnancy preferred; lupus-like syndrome drug-induced classic."},

  /* --- Nội tiết thêm --- */
  {n:"Sitagliptin Januvia", cls:"DPP-4 inhibitor", y:"2006", mech:"Protect endogenous GLP-1 from degradation", note:"Weight-neutral glucose-dependent low hypo — incretin era oral branch."},
  {n:"Pioglitazone Actos", cls:"PPARγ agonist thiazolidinedione", y:"1999", mech:"Nuclear receptor insulin sensitization adipose", note:"Insulin sensitizer true; edema/heart failure & fracture risks boxed."},
  {n:"Methimazole", cls:"Thionamide antithyroid", y:"1949", mech:"Block thyroid peroxidase iodination coupling", note:"Graves hyperthyroid; PTU first-trimester switch hepatic risk later methimazole."},
  {n:"Cinacalcet Sensipar", cls:"Calcimimetic CaSR positive allosteric", y:"2004", mech:"Sensitize calcium-sensing receptor → PTH suppression", note:"Allosteric modulation clinical proof — CKD-MBD secondary hyperparathyroidism."},

  /* --- Kháng sinh/virus mới --- */
  {n:"Tigecycline Tygacil", cls:"Glycylcycline IV", y:"2005", mech:"30S ribosome bind circumvent efflux/tet resistance", note:"Broad 'last-line' skin intra-abdominal; mortality signal boxed label."},
  {n:"Nitrofurantoin Macrobid", cls:"Urinary antiseptic classic", y:"1953", mech:"Multiple bacterial enzyme targets intracellular radicals", note:"UTI cystitis workhorse 70 năm; ineffective tissue — cystitis only renal concentration."},
  {n:"Fosfomycin Monurol", cls:"Phosphonic acid UTI single-dose", y:"1969", mech:"MurA unique cell-wall step other antibiotics skip", note:"Một liều 3g uống xong — synergy studies pivot against ESBL cystitis."},
  {n:"Cefiderocol Fetroja", cls:"Siderophore cephalosporin Trojan horse", y:"2019", mech:"Iron-scavenging catechol hijacks bacterial iron transporters entry", note:"'Cherokee trojan' chống carbapenemase Gram-negative — chemistry mimic biology warfare."},
  {n:"Dolutegravir Tivicay", cls:"Second-gen INSTI", y:"2013", mech:"Integrase strand transfer high barrier resistance", note:"WHO first-line HIV global; neural tube defect debate revised safe."},
  {n:"Efavirenz", cls:"NNRTI non-nucleoside", y:"1998", mech:"Allosteric reverse transcriptase palm pocket bind", note:"Vivid dreams CNS side effects; CYP inducer many interactions legacy regimens."},

  /* --- Ung thư targeted/biologic thêm --- */
  {n:"Vincristine Oncovin", cls:"Vinca alkaloid tubulin destabilizer", y:"1963", mech:"Bind tubulin prevent mitotic spindle assembly M-phase", note:"Madagascar periwinkle folk lead; fatal if intrathecal — vincristine rule strict!"},
  {n:"Doxorubicin Adriamycin", cls:"Anthracycline topoisomerase II poison", y:"1974", mech:"DNA intercalation + topoII cleavage complex stabilization + ROS", note:"Red devil cumulative cardiotoxicity lifetime dose cap 450-550 mg/m² dexrazoxane chelate."},
  {n:"5-Fluorouracil", cls:"Fluoropyrimidine TS inhibitor", y:"1957", mech:"FdUMP traps thymidylate synthase covalently ± RNA incorporation", note:"DPD deficiency lethal toxicity — pharmacogenetic testing before fluoropyrimidines!"},
  {n:"Gemcitabine Gemzar", cls:"Deoxycytidine analog masked prodrug", y:"1996", mech:"Masked chain termination self-potentiation dCK phosphorylation", note:'Pancreas cancer "standard"; flatulence? no — flu-like infusion reactions common.'},
  {n:"Sorafenib Nexavar", cls:"Multi-kinase VEGFR/PDGFR/Raf", y:"2005", mech:"Antiangiogenic + tumor proliferation dual blockade", note:"HCC RCC oral targeted pioneer; hand-foot skin reaction characteristic."},
  {n:"Everolimus Afinitor", cls:"mTORC1 rapalog", y:"2009", mech:"FKBP12-mTORC1 complex block proliferation signaling", note:"TSC tuberous sclerosis & neuroendocrine tumors; immunosuppression crossover use."},
  {n:"Sulfasalazine", cls:"5-ASA + sulfapyridine prodrug IBD", y:"1942", mech:"Azoreduction colonic bacteria release mesalazine + antibiotic moiety", note:"Designed by Svartz rheumatoid hypothesis; microbiome activation — prodrug by flora!"},
  {n:"Azathioprine Imuran", cls:"Thiopurine immunosuppressant prodrug", y:"1968", mech:"6-MP conversion → thioguanine nucleotides purine antimetabolite", note:"TPMT/NUDT15 testing mandatory before start — pharmacogenomics poster child."},
  {n:"Mycophenolate CellCept", cls:"IMPDH inhibitor selective lymphocyte", y:"1995", mech:"Block de novo guanine synthesis lymphocytes rely on", note:"Transplant & autoimmune; teratogen switched mycophenolate pregnancy program."},
  {n:"Belimumab Benlysta", cls:"Anti-BAFF BLyS monoclonal", y:"2011", mech:"Bind B-cell survival factor reduce autoreactive B maturation", note:"First new SLE drug in 50+ years when approved — lupus unmet need history."},

  /* --- Tiêu hóa/tiết niệu/mắt/giải độc thêm --- */
  {n:"Rifaximin Xifaxan", cls:"Non-absorbed rifamycin GI-local", y:"2004", mech:"RNA polymerase block luminal bacteria <0.4% systemic absorption", note:"IBS-D & hepatic encephalopathy ammonia reduction — local gut antibiotic design."},
  {n:"Lactulose", cls:"Synthetic disaccharide osmotic/ammonia trap", y:"1957", mech:"Colonic bacteria acidify lumen trap NH₃→NH₄⁺ nonabsorbable", note:"Hepatic encephalopathy chemistry: pH gradient converts absorbable to trapped ion!"},
  {n:"Solifenacin Vesicare", cls:"M₃-selective antimuscarinic OAB", y:"2004", mech:"Bladder smooth muscle M₃ preferential over salivary/cardiac", note:"Overactive bladder subtype selectivity dry mouth reduced vs oxybutynin older."},
  {n:"Mirabegron Myrbetriq", cls:"β₃-adrenoceptor agonist first-in-class", y:"2012", mech:"Detrusor relaxation storage phase improvement", note:"Alternative anticholinergic burden elderly — new receptor target validation."},
  {n:"Aflibercept Eylea", cls:"VEGF Trap-eye fusion protein", y:"2011", mech:"Decoy receptor bind VEGF-A/B PlGF higher affinity antibody", note:"WAMD diabetic retinopathy vision preservation intravitreal injection q8weeks."},
  {n:"Timolol eye drops", cls:"Nonselective beta-blocker glaucoma", y:"1978", mech:"↓ aqueous humor production ciliary body β-receptors", note:"Systemic absorption via nasolacrimal — bradycardia asthma warnings eyedrops are drugs too!"},

  /* ─── BỔ SUNG ~100 THUỐC MỚI ─── */
  // --- Tim mạch bổ sung ---
  {n:"Dabigatran Pradaxa", cls:"Direct thrombin inhibitor", y:"2010", mech:"Competitive reversible direct thrombin (IIa) inhibition", note:"Prodrug etexilate; idarucizumab reversal antibody; no monitoring vs warfarin."},
  {n:"Rivaroxaban Xarelto", cls:"Direct Factor Xa inhibitor", y:"2011", mech:"Selective FXa block → reduce thrombin burst", note:"DOAC — andexanet alfa antidote 2018; VTE/PE + AF stroke prevention."},
  {n:"Sacubitril/Valsartan Entresto", cls:"ARNI (combined), neprilysin inhibitor + ARB", y:"2015", mech:"Sacubitril block neprilysin → ↑ natriuretic peptides + valsartan AT₁ block", note:"HFrEF paradigm shift PARADIGM-HF trial mortality benefit over enalapril alone."},
  {n:"Ivabradine", cls:"I_f channel inhibitor", y:"2015", mech:"HCN channel SA node slow diastolic depolarization", note:"Giảm nhịp tim không giảm co bóp — HFrEF when beta-blocker not tolerated."},
  {n:"Enalaprilat IV", cls:"ACE inhibitor IV", y:"1985", mech:"Active diacid form enalapril — ACE block IV immediate", note:"Hypertensive emergency IV option; creatinine/K⁺ monitoring critical."},
  {n:"Nitroprusside Nipride", cls:"Nitric oxide donor balanced vasodilator", y:"1970s", mech:"Spontaneous NO release arterial + venous dilation", note:"Cyanide toxicity with prolonged use; thiocyanate monitoring; fotoprotect solution."},
  {n:"Dobutamine", cls:"β₁ agonist inotrope", y:"1978", mech:"β₁ selective — ↑ contractility mild vasodilation", note:"Short-term decompensated HF; tolerance tachyphylaxis 72h."},
  {n:"Fenofibrate", cls:"PPARα agonist fibrate", y:"1975", mech:"PPARα activation → ↑ LPL, ↑ HDL, ↓ triglycerides", note:"FIELD/ACCORD trials; added statin mixed evidence; gemfibrozil statin CI myopathy."},
  {n:"Ezetimibe Zetia", cls:"NPC1L1 cholesterol absorption inhibitor", y:"2002", mech:"Block jejunal enterocyte cholesterol transporter NPC1L1", note:"IMPROVE-IT: simvastatin+ezetimibe CVD event reduction modest but proven."},
  {n:"Bempedoic acid", cls:"ACL inhibitor cholesterol", y:"2020", mech:"ATP-citrate lyase block → ↓ cholesterol synthesis upstream HMG-CoA reductase", note:"Prodrug activated in liver only → no muscle side effect (statin-intolerant alternative)."},
  {n:"Ticagrelor Brilinta", cls:"P2Y₁₂ antagonist reversible", y:"2010", mech:"Reversible allosteric P2Y₁₂ block non-prodrug", note:"PLATO trial beat clopidogrel in ACS; dyspnea from adenosine increased."},
  {n:"Prasugrel Effient", cls:"P2Y₁₂ antagonist irreversible prodrug", y:"2009", mech:"Thienopyridine prodrug → active metabolite P2Y₁₂ block", note:"TRITON-TIMI 38 more bleeding than clopidogrel but less MI; avoid elderly <60kg."},
  {n:"Milrinone", cls:"PDE3 inhibitor inodilator", y:"1987", mech:"↑ cAMP cardiac + vascular PDE3 block", note:"Short-term decompensated HF; PROMISE trial increased mortality chronic oral milrinone."},

  // --- Kháng sinh bổ sung ---
  {n:"Ciprofloxacin", cls:"Fluoroquinolone", y:"1987", mech:"DNA gyrase & topoisomerase IV block → DNA replication stop", note:"Black box tendon rupture, neuropathy; quinolone core với F ở vị trí 6."},
  {n:"Meropenem", cls:"Carbapenem β-lactam", y:"1996", mech:"Penicillin-binding protein broad-spectrum ± ESBL stable", note:"Reserve for MDR; ertapenem no pseudomonas coverage difference through C1 methyl."},
  {n:"Piperacillin-Tazobactam", cls:"Ureidopenicillin + β-lactamase inhibitor", y:"1993", mech:"Penicillin broad + tazobactam covalently block ESBL class A", note:"Pseudomonas + anaerobes; extended infusion 4h for time-dependent killing PK/PD."},
  {n:"Ceftriaxone", cls:"3rd-gen cephalosporin", y:"1982", mech:"PBP bind transpeptidase block with stable β-lactam ring", note:"Once-daily; biliary + renal dual excretion; displaces bilirubin — caution neonate."},
  {n:"Cefepime", cls:"4th-gen cephalosporin anti-pseudomonal", y:"1994", mech:"Zwitterion rapid porin penetration + PBP binding", note:"Febrile neutropenia 1st line; neurotoxicity in renal impairment myoclonus confusion."},
  {n:"Colistin (Polymyxin E)", cls:"Polymyxin last-resort", y:"1959", mech:"Cationic detergent disrupt LPS outer membrane Gram-neg", note:"'Kháng sinh cuối cùng' XDR Acinetobacter/Pseudomonas; nephrotoxicity ~30%."},
  {n:"Daptomycin Cubicin", cls:"Cyclic lipopeptide", y:"2003", mech:"Calcium-dependent membrane depolarization Gram-positive", note:"Killed by surfactant — never for pneumonia; CPK monitoring rhabdomyolysis."},
  {n:"Linezolid Zyvox", cls:"Oxazolidinone", y:"2000", mech:"23S rRNA 50S subunit initiator complex PT binding unique", note:"MAO inhibitor — serotonin syndrome with SSRI; bone marrow suppression >2 weeks."},
  {n:"Tigecycline Tygacil", cls:"Glycylcycline tetracycline analogue", y:"2005", mech:"30S ribosome bind with extra glycyl group evading efflux/tetM protection", note:"MDR Acinetobacter; black box increased mortality ventilator-associated pneumonia."},
  {n:"Cefiderocol Fetroja", cls:"Siderophore cephalosporin", y:"2019", mech:"Catechol iron-chelating side group — 'Trojan horse' TonB active transport + PBP block", note:"CRPA/Acinetobacter carbapenem-resistant novel entry mechanism ingenious!"},
  {n:"Fidaxomicin Dificid", cls:"Macrocyclic narrow-spectrum", y:"2011", mech:"RNA polymerase Clostridium difficile selective", note:"C. difficile recurrence ↓ vs vancomycin — spares gut microbiome Bacteroides."},
  {n:"Bedaquiline Sirturo", cls:"Diarylquinoline anti-TB", y:"2012", mech:"ATP synthase mycobacterium selective block", note:"Novel mechanism MDR-TB after 40 years! QT prolongation black box."},
  {n:"Pretomanid", cls:"Nitroimidazole anti-TB", y:"2019", mech:"Pro-drug NO radical release under bacilli F420 cofactor", note:"BPaL regimen: bedaquiline + pretomanid + linezolid 6-month MDR-TB breakthrough."},
  {n:"Delamanid Deltyba", cls:"Nitroimidazole anti-TB", y:"2014", mech:"Mycolic acid synthesis block methoxy-mycolic/keto-mycolic", note:"MDR-TB option; QT prolongation + albumin low monitoring."},

  // --- Ung thư bổ sung ---
  {n:"Pembrolizumab Keytruda", cls:"Anti-PD-1 mAb checkpoint inhibitor", y:"2014", mech:"Block PD-1 → release T-cell brake tumor recognition", note:"'Key'truda — tissue-agnostic MSI-H approval đầu tiên trong lịch sử FDA."},
  {n:"Nivolumab Opdivo", cls:"Anti-PD-1 mAb", y:"2014", mech:"PD-1 checkpoint blockade unleash cytotoxic T-cells", note:"Jimmy Carter cured metastatic melanoma 2015 → public awareness immunotherapy."},
  {n:"Ipilimumab Yervoy", cls:"Anti-CTLA-4 mAb", y:"2011", mech:"CTLA-4 block early T-cell priming phase", note:"Checkpoint inhibitor đầu tiên; James Allison Nobel 2018. Colitis/dermatitis idiosyncratic."},
  {n:"CAR-T Tisagenlecleucel Kymriah", cls:"CD19 CAR-T cell therapy", y:"2017", mech:"Autologous T-cells transduced anti-CD19 scFv-CD3ζ-4-1BB", note:"Living drug — 1 dose remission ALL 83%; CRS IL-6 tocilizumab rescue. Nồng độ $475K."},
  {n:"Bortezomib Velcade", cls:"Proteasome inhibitor", y:"2003", mech:"Reversible 26S proteasome block → unfolded protein apoptosis myeloma", note:"Myeloma từ tử vong → chronic; peripheral neuropathy dose-limiting."},
  {n:"Lenalidomide Revlimid", cls:"IMiD immunomodulatory", y:"2005", mech:"CRBN cereblon E3 ligase → IKZF1/3 degradation + immune activation", note:"Thalidomide analogue safer; $8B+ sales; myelosuppression DVT risk."},
  {n:"Rituximab Rituxan", cls:"Anti-CD20 mAb", y:"1997", mech:"CD20+ B-cell depletion via ADCC/CDC apoptosis", note:"Monoclonal antibody đầu tiên ung thư; NHL, CLL, RA autoimmune revolutions."},
  {n:"Trastuzumab Herceptin", cls:"Anti-HER2/neu mAb", y:"1998", mech:"HER2 receptor dimerization block + ADCC", note:"HER2+ breast cancer từ aggressive → curable; cardiotoxicity anthracycline synergy."},
  {n:"Bevacizumab Avastin", cls:"Anti-VEGF mAb", y:"2004", mech:"Bind VEGF-A → ngăn gắn receptor VEGFR angiogenesis starve tumor", note:"Folkman anti-angiogenesis theory validated; side HTN, thrombosis, GI perforation."},
  {n:"Cetuximab Erbitux", cls:"Anti-EGFR mAb", y:"2004", mech:"EGFR extracellular block + internalization", note:"KRAS wild-type colorectal only; RAS testing mandatory before use. Rash acneiform."},
  {n:"Olaparib Lynparza", cls:"PARP inhibitor", y:"2014", mech:"PARP1/2 trap + synthetic lethality BRCA1/2 defective HR DNA repair", note:"Synthetic lethality — normal cells HR backup rescue, tumor BRCA cells die."},
  {n:"Venetoclax Venclexta", cls:"BCL-2 inhibitor BH3-mimetic", y:"2016", mech:"Selective BCL-2 block → apoptosis CLL cancer mythochondrial pathway", note:"Tumor lysis syndrome severe initial dose ramp-up; FDA REMS program."},
  {n:"Abiraterone Zytiga", cls:"CYP17A1 inhibitor androgen biosynthesis", y:"2011", mech:"Block 17α-hydroxylase/C17,20-lyase → ↓adrenal+tumor testosterone", note:"Added prednisone for mineralocorticoid excess; pre-chemo prostate cancer."},
  {n:"Enzalutamide Xtandi", cls:"Androgen receptor antagonist 2nd-gen", y:"2012", mech:"AR nuclear translocation + coactivator recruitment block", note:"Bind AR stronger than bicalutamide; seizure black box BBB penetration."},
  {n:"Palbociclib Ibrance", cls:"CDK4/6 inhibitor", y:"2015", mech:"CDK4/6 block → G1 arrest preventing Rb phosphorylation", note:"HR+/HER2- breast cancer + letrozole; neutropenia manageable cycle-on/off."},

  // --- Thần kinh / Tâm thần bổ sung ---
  {n:"Aripiprazole Abilify", cls:"D₂ partial agonist / 5-HT₁A partial / 5-HT₂A antagonist", y:"2002", mech:"Dopamine system stabilizer — partial agonist theory", note:"Functional selectivity concept; less metabolic than olanzapine quetiapine."},
  {n:"Quetiapine Seroquel", cls:"Atypical antipsychotic multi-receptor", y:"1997", mech:"5-HT₂A + D₂ antagonist + H₁ histamine strong", note:"Sedation heavy due to H₁; metabolic syndrome monitoring weight lipid glucose."},
  {n:"Donepezil Aricept", cls:"Acetylcholinesterase inhibitor", y:"1996", mech:"Reversible AChE inhibitor CNS selective", note:"Alzheimer symptomatic; no disease modifying; cholinergic crisis overdose."},
  {n:"Memantine Namenda", cls:"NMDA antagonist noncompetitive", y:"2003", mech:"Open-channel NMDA block moderate affinity — tone down glutamate noise", note:"Alzheimer moderate-severe; synaptopathy theory — reduce excitotoxicity."},
  {n:"Pregabalin Lyrica", cls:"α2δ calcium channel ligand gabapentinoid", y:"2004", mech:"Bind α2δ-1 subunit presynaptic Ca²⁺ channel → ↓ glutamate/noradrenaline release", note:"Neuropathic pain + epilepsy + GAD; schedule V controlled tolerance/addiction."},
  {n:"Lacosamide Vimpat", cls:"Antiepileptic Na⁺ channel slow inactivation", y:"2008", mech:"Enhance slow inactivation NaV channel (unique among AEDs)", note:"Focal seizures; PO→IV 1:1 conversion; dizziness diplopia main side."},
  {n:"Esketamine Spravato", cls:"NMDA antagonist S-enantiomer nasal", y:"2019", mech:"NMDA antagonist rapid synaptogenesis mTOR/BDNF pathway", note:"Treatment-resistant depression 24h onset! REMS clinic-only administration; dissociation."},
  {n:"Brexanolone Zulresso", cls:"GABA_A neurosteroid", y:"2019", mech:"Allopregnanolone IV → GABA_A positive allosteric modulation", note:"Postpartum depression 60h infusion $34K — first FDA indication for PPD!"},
  {n:"Vortioxetine Trintellix", cls:"Multimodal serotonergic", y:"2013", mech:"5-HT₃/5-HT₇/5-HT₁D antagonist + SERT inhibition + 5-HT₁A agonist 5-HT₁B partial", note:"Cognitive improvement in MDD claims unique; nausea significant early."},
  {n:"Lisdexamfetamine Vyvanse", cls:"Prodrug dextroamphetamine ADHD", y:"2007", mech:"Lysine-D-amphetamine prodrug cleaved RBC → controlled release", note:"Less abuse potential than immediate-release amphetamine; prodrug design clever."},

  // --- Chuyển hóa / Nội tiết ---
  {n:"Empagliflozin Jardiance", cls:"SGLT2 inhibitor", y:"2014", mech:"Block SGLT2 proximal tubule glucose reabsorption → glycosuria", note:"EMPA-REG OUTCOME: HF + CKD benefit beyond glucose! Class paradigm shift."},
  {n:"Dapagliflozin Farxiga", cls:"SGLT2 inhibitor", y:"2012", mech:"SGLT2 selective renal glucose loss 70g/ngày", note:"DAPA-HF HFrEF benefit regardless diabetes status — SGLT2i miracle."},
  {n:"Liraglutide Victoza/Saxenda", cls:"GLP-1 agonist", y:"2010", mech:"GLP-1 receptor agonist → insulin ↑ glucagon ↓ gastric emptying slow", note:"Obesity Saxenda 3mg higher dose; LEADER CVOT mortality benefit first GLP-1."},
  {n:"Semaglutide Ozempic/Wegovy", cls:"GLP-1 agonist long-acting", y:"2017", mech:"GLP-1 weekly; CNS appetite suppression doses higher obesity", note:"Wegovy 2,4mg 15% weight loss — cultural phenomenon! Supply shortage worldwide."},
  {n:"Sitagliptin Januvia", cls:"DPP-4 inhibitor gliptin", y:"2006", mech:"Block DPP-4 → GLP-1/GIP endogenous raised", note:"Weight-neutral; less GI than GLP-1 agonist; class heart failure caution."},
  {n:"Pioglitazone Actos", cls:"PPARγ agonist TZD", y:"1999", mech:"PPARγ nuclear receptor → insulin sensitization adipocyte differentiation", note:"Fluid retention HF + bone fracture risk; bladder cancer controversial signal."},
  {n:"Levothyroxine Synthroid", cls:"Synthetic thyroxine T₄ replacement", y:"1950s", mech:"T₄ → T₃ peripheral conversion deiodinase", note:"Narrow therapeutic index; brand vs generic bioavailability difference documented."},
  {n:"Denosumab Prolia/Xgeva", cls:"RANKL inhibitor mAb", y:"2010", mech:"Anti-RANKL → osteoclast maturation block", note:"Osteoporosis 6-month SC; Xgeva higher dose bone metastasis; hypocalcemia vitamin D ensure."},
  {n:"Alendronate Fosamax", cls:"Bisphosphonate", y:"1995", mech:"Farnesyl pyrophosphate synthase block osteoclast apoptosis", note:"Nhịn đói 30ph đứng thẳng sau uống — esophagitis risk; ONJ rare but devastating."},
  {n:"Teriparatide Forteo", cls:"PTH (1-34) anabolic fragment", y:"2002", mech:"Intermittent PTH → osteoblast ANBOLIC (paradox! continuous PTH bone loss)", note:"Đầu tiên và duy nhất anabolic bone-building (not antiresorptive); osteosarcoma rat limit 2yr."},

  // --- Miễn dịch / Viêm ---
  {n:"Adalimumab Humira", cls:"Anti-TNFα mAb fully human", y:"2002", mech:"TNFα soluble + transmembrane block", note:"Thuốc bán chạy nhất thế giới ~$20B/năm; RA, psoriasis, IBD, uveitis multi-indication."},
  {n:"Infliximab Remicade", cls:"Anti-TNFα chimeric mAb", y:"1998", mech:"TNFα soluble + membrane bound block", note:"Chuột/người chimeric → antibodies against drug (ADA) immunogenicity issue."},
  {n:"Etanercept Enbrel", cls:"TNFα decoy receptor fusion protein", y:"1998", mech:"Soluble TNFR2-Fc fusion → trap circulating TNFα", note:"Fc domain extended half-life; no binding lymphotoxin-α unlike infliximab."},
  {n:"Tocilizumab Actemra", cls:"Anti-IL-6R mAb", y:"2010", mech:"Block IL-6 receptor membrane + soluble sIL-6R", note:"CRS cytokine storm CAR-T rescue + COVID-19; RA, GCA, JIA indications."},
  {n:"Ustekinumab Stelara", cls:"Anti-p40 IL-12/IL-23 shared subunit mAb", y:"2009", mech:"Block IL-12 (Th1) + IL-23 (Th17) shared p40 subunit", note:"Psoriasis + Crohn UC dual mechanism Th1/Th17 cytokines."},
  {n:"Secukinumab Cosentyx", cls:"Anti-IL-17A mAb", y:"2015", mech:"Selective IL-17A block Th17 pathway skin/joint", note:"Psoriasis PASI 90 unprecedented; IBD exacerbation caution IL-17 in gut."},
  {n:"Baricitinib Olumiant", cls:"JAK1/JAK2 inhibitor", y:"2018", mech:"JAK kinase intracellular block cytokine signaling", note:"Oral small molecule biologic-equivalent; COVID-19 ACTT-2 trial mortality benefit."},
  {n:"Methotrexate low-dose", cls:"Antimetabolite DMARD anchor", y:"1950s", mech:"AICAR transformylase → adenosine release → anti-inflammatory paradox", note:"Ung thư dùng liều cao diệt DNA; RA liều thấp lại tăng adenosine — pharmacology puzzle."},
  {n:"Hydroxychloroquine Plaquenil", cls:"4-aminoquinoline antimalarial immunomodulator", y:"1955", mech:"TLR7/9 endosomal block antigen presentation MHC", note:"SLE base therapy; retinal toxicity screen yearly after 5yr; COVID hype debunked RCTs."},

  // --- Truyền nhiễm / Ký sinh trùng ---
  {n:"Primaquine", cls:"8-aminoquinoline antimalarial", y:"1950s", mech:"Radical cure hypnozoite P. vivax/ovale liver", note:"G6PD deficiency test bắt buộc — primaquine gây tán huyết tan máu nặng."},
  {n:"Praziquantel Biltricide", cls:"Anthelmintic trematode/cestode", y:"1980s", mech:"Ca²⁺ influx paralysis tegument damage schistosome", note:"Schistosomiasis 250M người — đơn liều 40mg/kg; WHO mass drug administration."},
  {n:"Mebendazole", cls:"Benzimidazole anthelmintic", y:"1971", mech:"Bind β-tubulin worm intestinal cells → glucose starvation", note:"Tẩy giun đường ruột giá vài cent; single-dose mass deworming children."},
  {n:"Albendazole", cls:"Benzimidazole broad-spectrum", y:"1980s", mech:"β-tubulin binding + larvicidal/ovicidal", note:"Neurocysticercosis + echinococcosis long course; dexamethasone cover inflammation."},
  {n:"Oseltamivir Tamiflu", cls:"Neuraminidase inhibitor influenza", y:"1999", mech:"NA sialic acid transition state analogue → block viral release", note:"48h cửa sổ vàng symptom onset; resistance H275Y H1N1 2008; stockpile biên giới."},
  {n:"Ganciclovir/Valganciclovir", cls:"Anti-CMV nucleoside", y:"1988", mech:"Viral kinase UL97 → ganciclovir-TP chain termination CMV DNA pol", note:"CMV retinitis HIV/AIDS era; valganciclovir oral prodrug valine ester bioavailability 60%."},
  {n:"Entecavir Baraclude", cls:"Anti-HBV nucleoside guanosine", y:"2005", mech:"HBV polymerase priming + DNA-dependent DNA synthesis chain termination", note:"HBV resistance barrier cao nhất trong NAs; 0% resistance 5yr naive patients."},

  // --- Đau / Gây mê bổ sung ---
  {n:"Ropivacaine", cls:"Local anesthetic amide S-enantiomer", y:"1996", mech:"Na⁺ channel block sensory > motor differential", note:"Less cardiotoxicity than bupivacaine; chiral switch improved safety."},
  {n:"Dexmedetomidine Precedex", cls:"α₂ agonist sedative analgesic", y:"1999", mech:"Presynaptic α₂ → ↓ norepinephrine release locus coeruleus", note:"Sedation co-operative — patient opens eyes when spoken! Minimal respiratory depression."},
  {n:"Sugammadex Bridion", cls:"Modified γ-cyclodextrin selective relaxant binding", y:"2015", mech:"Encapsulate rocuronium/vecuronium 1:1 complex → renal excretion", note:"Chemically designed host-guest cyclodextrin cavity reversal — instant block tắt."},
  {n:"Gabapentin Neurontin", cls:"Gabapentinoid α2δ ligand", y:"1993", mech:"α2δ Ca²⁺ channel block → ↓ excitatory neurotransmitter release", note:"Originally epilepsy → neuropathic pain; off-label everything; drug-seeking potential."},
  {n:"Tramadol hydrochloride", cls:"Weak μ-opioid + SNRI dual mechanism", y:"1977", mech:"μ-opioid (parent) + M1 metabolite stronger + serotonin/norepinephrine reuptake block", note:"Prodrug CYP2D6 → O-desmethyltramadol 200× stronger; risk seizure+serotonin syndrome."},
  {n:"Tapentadol Nucynta", cls:"MOR agonist + NRI", y:"2008", mech:"μ-opioid + norepinephrine reuptake in single molecule", note:"Dual mechanism less GI than classic opioids; schedule II controlled."},

  // --- Khác ---
  {n:"Sildenafil citrate Revatio", cls:"PDE5 inhibitor pulmonary hypertension", y:"2005", mech:"PDE5 block → ↑ cGMP pulmonary vasodilation", note:"Revatio 20mg TID # Viagra 25-100mg PRN; same drug different indication dose!"},
  {n:"Rivaroxaban Xarelto CAD/PAD low-dose", cls:"Factor Xa inhibitor vascular dose", y:"2018", mech:"2,5mg BID + aspirin → reduce MACE in CAD/PAD", note:"COMPASS trial breakthrough — DOAC + antiplatelet combo for atherosclerosis!"},
  {n:"Tranexamic acid", cls:"Antifibrinolytic lysine analogue", y:"1960s", mech:"Block plasminogen binding fibrin → prevent fibrinolysis", note:"CRASH-2 trial: TXA 1g IV within 3h trauma reduces mortality 1/3! WOMAN trial PPH too."},
  {n:"Flumazenil Romazicon", cls:"Benzodiazepine antagonist", y:"1987", mech:"Competitive GABA_A BZD site antagonist", note:"Đối kháng quá liều benzo; seizure risk mixed overdose (TCA); t½ ngắn hơn BZD."},
  {n:"Naltrexone Revia/Vivitrol", cls:"Opioid antagonist alcohol craving", y:"1984", mech:"μ-opioid blockade → endorphin pathway alcohol reward disconnect", note:"Alcohol use disorder + opioid; depot IM monthly Vivitrol adherence solution."},
  {n:"Buprenorphine Suboxone", cls:"Partial μ-opioid agonist/κ antagonist + naloxone", y:"2002", mech:"High affinity μ partial ceiling effect safety + naloxone abuse deterrent", note:"Opioid use disorder treatment; ceiling respiratory depression; precipitated withdrawal risk."},
  {n:"Methadone", cls:"Long-acting full opioid + NMDA antagonist", y:"1940s", mech:"μ-opioid long half-life 24h + NMDA block neuropathic component", note:"Opioid maintenance therapy gold standard; QTc prolongation monitoring; stigma barrier."},
  {n:"Acamprosate Campral", cls:"Glutamate/GABA modulator alcohol", y:"2004", mech:"NMDA modulation + GABA_A restore withdrawal balance", note:"Alcohol abstinence maintenance; unlike naltrexone reward-pathway, acamprosate homeostasis."},
  {n:"Varenicline Chantix", cls:"Nicotinic α4β2 partial agonist", y:"2006", mech:"Partial agonist nicotine receptor — block nicotine dopamine surge", note:"Cai thuốc lá hiệu quả nhất; neuropsychiatric warning removed 2016 EAGLES trial."}
];

/* Thuốc theo hệ cơ quan */
const ORGAN_PHARM = [
  ["🫀 Tim mạch", "Nitroglycerin, atenolol, amlodipine, captopril, furosemide, atorvastatin, clopidogrel, amiodarone", "MAP = CO × SVR; điều chỉnh 4 trục: nhịp, co bóp, tiền tải/hậu tải, lipid"],
  ["🧠 Thần kinh trung ương", "Levodopa, phenobarbital, valproate, diazepam, fluoxetine, haloperidol, propofol", "BBB là cổng chốt: thuốc não phải lipophilic nhỏ hoặc qua transporter"],
  ["🫁 Hô hấp", "Salbutamol, ipratropium, budesonide, montelukast, theophylline", "Beta₂ vs muscarinic: hai tay ga & phanh của đường thở"],
  ["🍽️ Tiêu hóa", "Omeprazole, ranitidine (recall), ondansetron, loperamide, mesalazine", "Acid suppression đổi vi sinh ruột — C. difficile risk tăng"],
  ["🦠 Nhiễm khuẩn", "Amoxicillin, ceftriaxone, azithro, doxy, vancomycin, metronidazole", "Gram +/- & beta-lactamase quyết định chọn ban đầu trước kháng sinh đồ"],
  ["🐛 Ký sinh trùng", "Ivermectin, albendazole, praziquantel, chloroquine, artemisinin", "Mỗi loại ký sinh một điểm yếu sinh hóa riêng"],
  ["🧬 Nội tiết", "Insulin, metformin, SGLT2i, levothyroxine, prednisone, the Pill", "Feedback loop: đo hormone đúng thời điểm trong ngày mới chính xác"],
  ["🎗️ Ung thư", "Tamoxifen, cyclophosphamide, imatinib, trastuzumab, pembrolizumab", "3 thế hệ: cytotoxic → targeted → immunotherapy checkpoint"],
  ["🦴 Cơ xương khớp", "Ibuprofen, methotrexate low-dose, alendronate, adalimumab", "NSAID giảm triệu chứng; DMARD/biologic thay đổi tiến trình bệnh"],
  ["👁️ 👂 Giác quan", "Timolol glaucoma, latanoprost PG analog, cochlear implant drug-eluting?", "Glaucoma: ↓ production (β) + ↑ outflow (PG) hai hướng"],
  ["🩸 Máu & đông cầm", "Warfarin, heparin/LMWH, clopidogrel, iron sulfate, EPO", "Coagulation cascade vị trí tác động khác nhau của từng anticoagulant"],
  ["💉 Gây mê hồi sức", "Propofol, ketamine, succinylcholine, noradrenaline, fentanyl", "Triad gây mê: mất ý thức + giảm đau + giãn cơ — mỗi thuốc một chân"]
];

/* Vaccine toàn tập */
const VACCINES = [
  ["Đậu mùa","1796 Jenner","Live cross (cowpox)","Bệnh ĐẦU TIÊN xóa sổ (1980) — ring vaccination strategy"],
  ["Dại","1885 Pasteur","Attenuated dried cord","Post-exposure works vì rabies incubation dài"],
  ["Bại liệt Salk/Sabin","1955 IPV / 1961 OPV","Inactivated / live oral","OPV sugar cube truyền miễn dịch cộng đồng; polio gần xóa sổ"],
  ["Sởi MMR","1963/1971","Live attenuated","1 case → 12-18 secondary; R₀ cao nhất trong các bệnh người"],
  ["Diphtheria-Tetanus-Pertussis","1920s","Toxoid + killed","Toxin neutralization concept; booster mỗi 10 năm cho tetanus"],
  ["BCG lao","1921","Live attenuated Mycobacterium bovis","Bảo vệ trẻ nhỏ khỏi TB nặng; hiệu quả phổi người lớn biến đổi"],
  ["Viêm gan B","1981/1986 recombinant","Subunit HBsAg yeast","'Cancer vaccine' đầu tiên — ngăn HCC do HBV!"],
  ["Hib","1985","Conjugate polysaccharide-protein","Conjugation concept giải quyết T-independent infant immunity"],
  ["Pneumococcal PCV13/20","2000/2021","Conjugate serotypes","Herd effect giảm cả antibiotic-resistant ear infections"],
  ["Rotavirus","2006","Live attenuated oral","Giảm ~40% hospital diarrhea trẻ dưới 5 tuổi toàn cầu"],
  ["HPV Gardasil","2006","VLP subunit yeast/insect","Ngăn >90% cervical cancer — vaccine chống ung thư thật sự"],
  ["Cúm hàng năm","1940s","Inactivated/recombinant","Antigenic drift → phải cập nhật strain yearly WHO forecast"],
  ["COVID-19 mRNA","2020","mRNA-LNP Pfizer/Moderna","42 ngày sequence→clinical trial; platform technology validated"],
  ["COVID-19 viral vector","2020","Adenovirus ChAdOx1/AZ","Replication-indefective vector carries spike gene"],
  ["Dengue Qdenga","2022","Live tetravalent attenuated","Cân bằng ADE risk — chỉ dùng serostatus đúng chỉ định"],
  ["RSV Abrysvo/mAb","2023","Subunit prefusion F / nirsevimab mAb","Thai kỳ 32-36w truyền kháng thể thụ động cho bé"]
];
const IMMUNE_CONCEPTS = [
  {t:"Herd immunity", e:"R_eff = R₀ × (1 − p)", d:"% tiêm p đủ lớn khiến dịch không lan — measles cần ~95%."},
  {t:"Attenuation", e:"Passage qua môi trường/cấy chuyền giảm virulence giữ antigenicity", d:"Sabin OPV nhân bản lạnh 34°C yếu đi nhưng vẫn dạy miễn dịch."},
  {t:"Cold chain", e:"2–8°C bất biến từ nhà máy đến cánh tay", d:"Vaccine loggers IoT giám sát từng lô; break chain = hủy lô hàng."},
  {t:"Adjuvant alum", e:"Al(OH)₃ adsorb antigen slow-release + innate alarm", d:"100 năm tuổi vẫn là adjuvant phổ cập nhất; MF59/AS01 thế hệ mới."},
  {t:"Neutralizing Ab vs T-cell", e:"Kháng thể chặn entry · T cell kill infected cells", d:"mRNA vaccine mạnh cả hai nhánh; đo bằng neutralization assay/ELISpot."}
];

/* Từ điển y dược VN–EN */
const MED_GLOSSARY = [
  ["Thuốc kê đơn / OTC","Prescription (Rx) / Over-the-counter","Rx = recipe Latin; OTC tự mua an toàn liều thường"],
  ["Hoạt chất / tá dược","Active pharmaceutical ingredient (API) / excipient","API chữa bệnh; excipient giúp viên uống được, ổn định, vị"],
  ["Sinh khả dụng","Bioavailability","% liều vào tuần hoàn; IV luôn 100%"],
  ["Dạng bào chế","Dosage form","Viên nén, nang, siro, tiêm, miếng dán, xịt…"],
  ["Chống chỉ định","Contraindication","Tình trạng KHÔNG được dùng — tuyệt đối/tương đối"],
  ["Phản ứng có hại thuốc","Adverse Drug Reaction (ADR)","WHO-Uppsala VigiBase thu nhận toàn cầu"],
  ["Quá liều / độc tính","Overdose / toxicity","Paracetamol >150 mg/kg cấp cứu ngay"],
  ["Nửa đời thuốc","Half-life (t½)","5 t½ ≈ thanh thải ~97%"],
  ["Khoảng điều trị","Therapeutic range/window","Digoxin 0,5–0,9 ng/mL narrow — đo máu TDM"],
  ["Tương tác thuốc","Drug-drug interaction (DDI)","Warfarin + NSAID = bleeding; grapefruit + statin"],
  ["Lâm sàng / tiền lâm sàng","Clinical / preclinical","Preclinical: in vitro + animal trước Phase I người"],
  ["Thử nghiệm lâm sàng I–IV","Clinical trial phases","Phase I an toàn 20-100 người → III hàng nghìn → IV post-marketing"],
  ["Nhóm chứng mù đôi","Double-blind randomized placebo-controlled (RCT)","Gold standard evidence-based medicine"],
  ["Hiệu quả giả dược","Placebo effect","~35% nhiều tình trạng — lý do bắt buộc placebo arm"],
  ["Chỉ định / ngoài chỉ định","On-label / off-label","Off-label: dùng ngoài giấy phép — bác sĩ cân nhắc evidence"],
  ["Kháng thuốc","Resistance (AMR)","AMR dự báo 10 triệu tử vong/năm 2050 nếu không hành động"],
  ["Liều khởi đầu / duy trì","Loading / maintenance dose","Loading đạt nhanh steady-state rồi maintenance giữ"],
  ["Tiêm dưới da / cơ / tĩnh mạch","SC / IM / IV","IV 100% bioavailability tức thì; SC depot chậm"],
  ["Truyền dịch / truyền máu","IV fluid / blood transfusion","ABO-Rh match bắt buộc; crossmatch trước truyền"],
  ["Chẩn đoán phân biệt","Differential diagnosis (DDx)","Danh sách bệnh có thể — xét nghiệm thu hẹp dần"],
  ["Tiên lượng","Prognosis","Dự báo tiến triển; 5-year survival rate ung thư chuẩn báo cáo"],
  ["Bệnh cảnh hội chứng","Syndrome","Cluster signs/symptoms cùng cơ chế ví dụ metabolic syndrome"],
  ["Đối chứng giả dược","Placebo-controlled","Placebo pill màu/vị giống hệt — blind cả người phát thuốc"],
  ["Dược động học / dược lực học","Pharmacokinetics / pharmacodynamics","PK: cơ thể xử lý thuốc thế nào; PD: thuốc tác động cơ thể ra sao"],
  ["Therapeutic drug monitoring","TDM","Vancomycin trough, digoxin, lithium — đo nồng độ đỉnh/đáy"],
  ["Chống đông / tiêu sợi huyết","Anticoagulant / fibrinolytic","Warfarin-heparin chặn cascade; alteplase dissolve existing clot MI/stroke"],
  ["Miễn dịch thụ động/đích chủ động","Passive / active immunization","Passive: antibody sẵn (Rhogam, IVIG); active: vaccine tự tạo Ab"],
  ["Ghép tạng / đào thải ghép","Transplant / rejection","HLA matching + cyclosporine/tacrolimus calcineurin inhibitor"]
];

/* Dược lý nền tảng */
const PHARMA_CONCEPTS = [
  {t:"ADME", e:"Absorption · Distribution · Metabolism · Excretion", d:"Bốn chặng đời thuốc trong cơ thể quyết định liều & tần suất."},
  {t:"Bioavailability (F)", e:"% liều đến tuần hoàn hệ thống", d:"IV = 100%; uống phụ thuộc first-pass metabolism gan."},
  {t:"First-pass effect", e:"Gan metabolize trước khi thuốc đến vòng tuần hoàn", d:"GTN ngậm dưới lưỡi bỏ qua gan — nitroglycerin uống vô nghĩa!"},
  {t:"Half-life (t½)", e:"Thời gian nồng độ giảm còn 50%", d:"~5 t½ để steady-state hoặc thanh thải hoàn toàn; quyết định uống 1× hay 4×/ngày."},
  {t:"Steady state", e:"Rate in = rate out", d:"Sau ~4-5 t½; giải thích vì sao thuốc cần mấy ngày mới 'vào guồng'."},
  {t:"Therapeutic Index TI", e:"TD₅₀/ED₅₀ (hoặc LD₅₀/ED₅₀)", d:"TI thấp (digoxin, warfarin, lithium) phải theo dõi nồng độ máu TDM."},
  {t:"EC₅₀ & Emax", e:"Nồng độ đạt 50% hiệu quả tối đa & hiệu quả trần", d:"Hill equation mô tả dose-response sigmoid."},
  {t:"Agonist vs Antagonist", e:"Kích hoạt receptor vs chặn receptor", d:"Naloxone antagonize morphine — cứu overdose tức thì."},
  {t:"Partial agonist", e:"Hiệu quả nội tại <100%", d:"Buprenorphine opioid partial — ceiling effect khó overdose."},
  {t:"Blood-brain barrier BBB", e:"Tight junction endothelium não chặn phân tử hydrophilic", d:"Thuốc não phải lipophilic nhỏ (<500 Da) hoặc qua transporter."},
  {t:"Prodrug", e:"Chất bất hoạt → enzyme biến thành hoạt chất", d:"Codeine→morphine CYP2D6; sofosbuvir designed prodrug."},
  {t:"CYP450 hệ enzyme", e:"CYP3A4 metabolize ~50% thuốc", d:"Nước bưởi ức chế CYP3A4 → tăng nồng độ statin nguy hiểm!"},
  {t:"Zero vs First-order kinetics", e:"Thanh thải cố định lượng vs theo tỷ lệ nồng độ", d:"Ethanol zero-order (quá tải enzyme); đa số thuốc first-order."},
  {t:"Drug-drug interaction", e:"Ức chế/cảm ứng CYP, P-gp, protein binding displacement", d:"Warfarin + aspirin = bleeding risk cộng hưởng."},
  {t:"Lipinski Rule of 5", e:"MW<500 · logP<5 · HBD≤5 · HBA≤10", d:"Bộ lọc 'thuốc được' kinh điển screening hợp chất."},
  {t:"Pharmacovigilance", e:"Theo dõi ADR sau lưu hành", d:"Thalidomide 1961 khởi sinh hệ thống; VigiBase WHO Uppsala."}
];

/* Hóa học cơ thể: điện giải & chất truyền tin */
const ELECTROLYTES = [
  ["Na⁺","135–145 mmol/L","Thể tích nước, nerve impulse","Hyponatremia → co giật não phù"],
  ["K⁺","3,5–5,0 mmol/L","Nhịp tim, cơ co","Hyperkalemia >6,5 → ngừng tim!"],
  ["Ca²⁺","2,2–2,6 mmol/L","Xương, co cơ, đông máu","Hypocalcemia → tetany Chvostek sign"],
  ["Mg²⁺","0,7–1,0 mmol/L",">300 enzyme cofactor","Thiếu Mg → loạn nhịp, run tay"],
  ["Cl⁻","98–106 mmol/L","Cân bằng anion với Na⁺","Follow sodium thường"],
  ["HCO₃⁻","22–28 mmol/L","Buffer máu chính","Metabolic acidosis marker"],
  ["PO₄³⁻","0,8–1,45 mmol/L","ADN/ATP backbone","CKD → hyperphospathemia"],
  ["Fe²⁺ (serum)","60–170 µg/dL","Heme hemoglobin","Thiếu = thiếu máu phổ biến nhất thế giới"],
  ["Zn²⁺","70–120 µg/dL",">300 enzyme, immune","Thiếu → chậm lành vết thương vị giác kém"]
];

const NEUROTRANSMITTERS = [
  ["Dopamine","Reward, motor control","Parkinson thiếu; schizophrenia excess theory; cocaine blocks reuptake"],
  ["Serotonin (5-HT)","Mood, gut motility","90% nằm ở ruột! SSRI giữ serotonin synaptic lâu hơn"],
  ["Acetylcholine","NMJ muscle contraction","Botulinum chặn release → tê liệt; Alzheimer neurons mất"],
  ["GABA","Main inhibitory CNS","Alcohol/benzodiazepine potentiate — 'đè phanh' não"],
  ["Glutamate","Main excitatory CNS","Excitotoxicity stroke; MSG cùng phân tử (khác compartment)"],
  ["Norepinephrine","Fight-or-flight","Amphetamine tăng release; beta-blocker chặn tim"],
  ["Endorphin","Natural pain relief","Runner's high; morphine mimic tại μ-receptor"]
];

const HORMONES_CLASS = [
  ["Steroid (lipid)","Cortisol, estrogen, testosterone","Qua màng bind nuclear receptor — slow genomic action"],
  ["Peptide/protein","Insulin, GH, GLP-1","Membrane receptor second messenger; không uống bị tiêu hóa"],
  ["Amino acid derivative","Adrenaline, thyroxine (T4), melatonin","Tyrosine-derived (catecholamine) hay tryptophan (melatonin)"],
  ["Gas signaling","NO (nitric oxide)","Viagra pathway — NO→cGMP smooth muscle relax"]
];

/* Nguyên tố trong cơ thể người */
const BIOELEMENTS = [
  ["O","65%","Nước, hô hấp tế bào"],
  ["C","18%","Backbone mọi phân tử hữu cơ"],
  ["H","10%","Nước, acid-base balance"],
  ["N","3%","Amino acid, nucleotide"],
  ["Ca","1,5–2%","Xương răng, tín hiệu tế bào"],
  ["P","1,0–1,2%","ATP, ADN, phospholipid"],
  ["K","0,2–0,35%","Điện thế màng tế bào"],
  ["S","0,25%","Disulfide bond protein, methionine"],
  ["Na","0,15%","Thể tích ngoại bào, dẫn thần kinh"],
  ["Cl","0,15%","Electrolyte, HCl dạ dày"],
  ["Mg","0,05%","Cofactor ATP — thực chất MgATP²⁻"],
  ["Fe","4–5 g total","Hemoglobin O₂ transport; thiếu = thiếu máu"],
  ["F","trace","Men răng fluorapatite"],
  ["Zn","2–3 g","300+ enzyme, immune, vị giác"],
  ["Cu","~80 mg","Ceruloplasmin, cytochrome oxidase"],
  ["I","15–20 mg","Thyroxine T3/T4 — thiếu → bướu cổ cretinism"],
  ["Se","~15 mg","Glutathione peroxidase antioxidant"],
  ["Co","~2 mg","Vitamin B₁₂ cobalt trung tâm!"],
  ["Mo","~10 mg","Nitrogenase, xanthine oxidase"],
  ["Cr, Mn, Ni, V…","trace","Enzyme cofactors ít hiểu rõ"]
];

/* Vitamin & deficiency */
const VITAMINS = [
  ["A (retinol)","Nhìn đêm, biểu mô","Quáng gà, khô mắt xerosis"],
  ["B1 (thiamine)","Carbohydrate metabolism","Beriberi; Wernicke-Korsakoff nghiện rượu"],
  ["B2 (riboflavin)","FAD/FMN cofactor","Cheilitis môi nứt khoé miệng"],
  ["B3 (niacin)","NAD/NADP","Pellagra 3D: dermatitis-diarrhea-dementia"],
  ["B5 (pantothenic)","CoA","Hiếm thiếu — có trong mọi thức ăn"],
  ["B6 (pyridoxine)","Transamination, neurotransmitter","Neuropathy; INH tuberculosis cần bổ sung"],
  ["B7 (biotin)","Carboxylation","Rụng tóc da liễu; ăn trứng sống avidin block"],
  ["B9 (folate)","DNA synthesis","Neural tube defect — bà bầu bắt buộc; methotrexate antagonist"],
  ["B12 (cobalamin)","DNA, myelin","Thiếu máu ác tính Biermer; vegan thiếu"],
  ["C (ascorbic)","Collagen hydroxylation","Bệnh scurvy thủy thủ; Linus Pauling obsession"],
  ["D (calcitriol)","Canxi hấp thu","Còi xương trẻ, osteomalacia người lớn"],
  ["E (tocopherol)","Antioxidant lipid","Hiếm; hemolytic anemia premature"],
  ["K (phylloquinone)","Clotting factor II,VII,IX,X","Chảy máu; newborn injection prophylaxis VKDB"]
];

/* Xét nghiệm thường quy */
const LAB_TESTS = [
  ["Glucose đói","3,9–6,1 mmol/L","≥7,0 = diabetes; HbA1c ≥6,5% chẩn đoán xác định"],
  ["Creatinine","44–133 µmol/L","GFR estimate kidney function; tăng = giảm lọc"],
  ["Ure/BUN","2,5–7,5 mmol/L","Protein metabolism; dehydration tăng"],
  ["AST/ALT","<40 U/L","Liver enzymes; ALT đặc hiệu gan hơn AST"],
  ["Cholesterol LDL","<2,6 mmol/L mục tiêu","'Bad cholesterol' atherosclerosis target statin"],
  ["HDL",">1,0 mmol/L","'Good cholesterol' reverse transport"],
  ["Triglyceride","<1,7 mmol/L","Pancreatitis nếu >10!"],
  ["Hemoglobin","Nam 130–175 · Nữ 120–155 g/L","Thiếu máu threshold; transfusion trigger ~70"],
  ["WBC","4,0–11,0 ×10⁹/L","Leukocytosis infection; leukemia cực cao"],
  ["Platelets","150–400 ×10⁹/L","Chảy máu <50; spontaneous bleed <20"],
  ["CRP","<5 mg/L","Acute phase inflammation; sepsis spike"],
  ["Troponin I/T","<14 ng/L","Cardiac-specific — NMCT gold standard rise/fall"],
  ["TSH","0,4–4,0 mIU/L","Thyroid master hormone; cao = hypothyroid"],
  ["HbA1c","<5,7% bình thường","Average glucose 3 tháng RBC lifespan"],
  ["pH máu động mạch","7,35–7,45","Respiratory/metabolic acid-base decode"],
  ["pO₂/pCO₂","80–100 / 35–45 mmHg","Gas exchange efficiency; COPD CO₂ retention"],
  ["Amylase/Lipase","Norm range","Lipase ×3 = acute pancreatitis"],
  ["PSA","<4 ng/mL age-dependent","Prostate cancer screening tranh cãi overdiagnosis"]
];

/* Giải độc — antidote */
const ANTIDOTES = [
  ["Paracetamol quá liều","N-Acetylcysteine (NAC)","Refill glutathione detox NAPQI — cửa sổ vàng 8–10h"],
  ["Opioid (morphine, heroin, fentanyl)","Naloxone","Competitive μ-antagonist; tác dụng ngắn hơn opioid → repeat dose"],
  ["Organophosphate/sarin","Atropine + Pralidoxime","Block muscarinic + regenerate AChE enzyme"],
  ["Cyanide","Hydroxocobalamin ± Na-thiosulfate","Bind CN thành B12; thiosulfate → thiocyanate thận thải"],
  ["CO (khí gas, cháy)","O₂ 100% ± HBO","Displace CO từ hemoglobin; half-life 4h→40 phút hyperbaric"],
  ["Methanol (rượu giả)","Ethanol/fomepizole","Competitive ADH — ethanol 'chiếm enzyme' để methanol không thành formic acid"],
  ["Warfarin/superwarfarin","Vitamin K₁ ± PCC","Restore clotting factor synthesis"],
  ["Digoxin độc","Digoxin Fab fragments (Digifab)","Antibody bind digoxin → renal clearance"],
  ["Iron overload (sắt)","Deferoxamine","Chelator Fe³⁺ excrete màu vang đỏ urine!"],
  ["Lead chì","EDTA/DMSA/Succimer","Chelate heavy metal urine"],
  ["Benzodiazepine","Flumazenil","Competitive GABA antagonist (dùng cẩn trọng seizure history)"],
  ["Beta-blocker quá liều","Glucagon","Bypass β-receptor tăng cAMP trực tiếp"],
  ["Heparin","Protamine sulfate","Ionically neutralize heparin"],
  ["Metformin lactic acidosis","Lactate dialysis + supportive","Không có antidote đặc hiệu — hỗ trợ & lọc máu"]
];

/* Kháng sinh theo cơ chế */
const AB_CLASSES = [
  ["Beta-lactam (penicillin, cephalosporin, carbapenem)","Chặn transpeptidase vách peptidoglycan","Bactericidal; resistance: beta-lactamase → thêm clavulanate"],
  ["Macrolide (azithromycin, clarithro)","Bind 50S chặn protein exit tunnel","Bacteriostatic; atypical coverage respiratory"],
  ["Fluoroquinolone (ciprofloxacin, levo)","Ức chế DNA gyrase/topoisomerase IV","Broad; tendon rupture warning FDA black box"],
  ["Tetracycline (doxy, mino)","30S block aminoacyl-tRNA","Acne, Lyme; tránh cho trẻ <8 tuổi răng ố"],
  ["Aminoglycoside (gentamicin, amikacin)","30S misreading mRNA","IV gram-negative severe; nephro/ototoxicity monitor"],
  ["Glycopeptide (vancomycin, teicoplanin)","Bind D-Ala-D-Ala wall precursor","MRSA workhorse; trough monitoring IV"],
  ["Oxazolidinone (linezolid)","50S initiation complex","MRSA/VRE; serotonin syndrome with SSRIs!"],
  ["Sulfonamide + trimethoprim","Double-block folate pathway DHPS+DHFR","UTI classic; sulfa allergy common"],
  ["Nitroimidazole (metronidazole)","Radical DNA damage anaerobe","Anaerobic + protozoa; disulfiram alcohol reaction"],
  ["Polymyxin (colistin)","Membrane disruption cationic peptide","Last-resort CRE; nephrotoxicity significant"],
  ["Lincosamide (clindamycin)","50S như macrolide","Anaerobic dental/bone; C. difficile risk cao"],
  ["Rifampicin (anti-TB)","RNA polymerase inhibitor","Cam nước tiểu! CYP inducer tương tác khủng khiếp"]
];

/* Timeline bổ sung — y học */
const TIMELINE_MED = [
  {y:"1543", t:"Vesalius — De Humani Corporis Fabrica", d:"Giải phẫu chính xác đầu tiên; phá vỡ giáo điều Galen 1300 năm."},
  {y:"1628", t:"Harvey — tuần hoàn máu", d:"Máu quay vòng có hướng — nền vật lý sinh học của mọi tim mạch học."},
  {y:"1796", t:"Jenner — vaccine đậu mùa", d:"Cowpox protect smallpox — 'vaccine' từ vacca (bò); smallpox xóa sổ 1980."},
  {y:"1846", t:"Morton — gây mê ether công khai", d:"Massachusetts General; 'không đau' khi mổ trở thành chuẩn nhân đạo."},
  {y:"1854", t:"Snow — bản đồ dịch tả Broad Street", d:"Epidemiology sơ khai: khóa giếng nước = dập dịch; nước là vector."},
  {y:"1865", t:"Lister — antiseptic carbolic", d:"Phẫu thuật sạch: mortality cắt cụt chi giảm từ 45% xuống 15%!"},
  {y:"1882", t:"Koch — postulates & vi khuẩn TB", d:"Mycobacterium tuberculosis; tiêu chuẩn xác định tác nhân bệnh truyền nhiễm."},
  {y:"1897", t:"Ross — muỗi truyền sốt rét Nobel", d:"Vector biology; nền cho chiến lược diệt muỗi & artemisinin sau này."},
  {y:"1901", t:"Landsteiner — nhóm máu ABO", d:"Nobel 1930; truyền máu an toàn thay vì đánh bạc mạng người."},
  {y:"1921", t:"Banting & Best — insulin", d:"Toronto; bệnh tử vong chắc chắn thành bệnh mạn tính quản lý được."},
  {y:"1928", t:"Fleming — penicillin", d:"Nấm bay vào đĩa Staphylococcus; antibiotics kỷ nguyên."},
  {y:"1943", t:"Penicillin sản xuất đại trà WWII", d:"Deep-tank fermentation Pfizer; đủ liều cho D-Day invasion."},
  {y:"1953", t:"Watson-Crick-Franklin DNA helix", d:"Central dogma foundation — molecular medicine bắt đầu."},
  {y:"1955", t:"Salk vaccine bại liệt", d:"Polio inactivated vaccine; đại dịch khủng khiếp nhất thế kỷ XX bị chặn."},
  {y:"1960", t:"The Pill — thuốc tránh thai", d:"Norethisterone/norgestrel; cách mạng xã hội & sức khỏe sinh sản."},
  {y:"1961", t:"Thalidomide thảm họa", d:"10.000 dị tật chi — khởi sinh pharmacovigilance hiện đại; sau này chữa myeloma/leprosy!"},
  {y:"1967", t:"Barnard — ghép tim đầu tiên", d:"Cape Town; immunosuppression cyclosporine 1983 mở kỷ nguyên ghép tạng."},
  {y:"1978", t:"Baby Louise Brown — IVF", d:"Thụ tinh trong ống nghiệm; Nobel Edwards 2010 — 12 triệu em bé từ đó."},
  {y:"1980", t:"Smallpox tuyên bố xóa sổ", d:"Bệnh đầu tiên con người xóa khỏi hành tinh — vaccine victory ultimate."},
  {y:"1981", t:"AIDS identified", d:"MMWR report; HIV isolated 1983; AZT 1987; ART triple 1996 chuyển chronic."},
  {y:"1996", t:"HAART — HIV thành bệnh mạn tính", d:"'AIDS no longer death sentence' — combination therapy revolution."},
  {y:"2003", t:"Human Genome Project complete", d:"3 tỷ base pair; genomic medicine era; cost sequencing $100M → $200!"},
  {y:"2006", t:"HPV vaccine", d:"Frazer/Zhou; cervical cancer preventable — cancer vaccine đầu tiên phòng bệnh."},
  {y:"2010", t:"CAR-T first patient Emily", d:"Genetically engineered immune cells; Emily alive 13+ years leukemia-free."},
  {y:"2015", t:"CRISPR edit human embryos debate", d:"He Jiankui scandal 2018 → global moratorium ethics framework."},
  {y:"2020", t:"mRNA vaccine 42 ngày", d:"COVID-19 response nhanh nhất lịch sử; Karikó-Weissman platform validated."},
  {y:"2023", t:"Casgevy — CRISPR therapy approved", d:"Sickle cell & beta-thalassemia cure — gene editing ra lò chính thức."}
];

/* ===== CHUYÊN SÂU LÂM SÀNG — BS chuyên khoa / DS lâm sàng / NCS ===== */

/* Toxidrome — hội chứng độc chất */
const TOXIDROMES = [
  ["Anticholinergic","Hot as hare, dry as bone, red as beet, blind as bat, mad as hen","Atropin/scopolamine, antihistamin thế hệ 1, TCAs","Physostigmine (chọn lọc trường hợp nặng)"],
  ["Sympathomimetic","Mydriasis, tim nhanh, tăng huyết áp, vã mồ hôi, kích động, co giật","Cocaine, amphetamine, MDMA, caffeine overload","Benzodiazepine + làm mát tích cực"],
  ["Opioid","Miosis 3 dấu: thở chậm + ý thức giảm + đồng tử kim","Heroin, fentanyl, methadone","Naloxone — chú ý tái ngộ do t½ ngắn hơn opioid"],
  ["Cholinergic (SLUDGE)","Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis","Organophosphate, carbamate, nấm Muscaria","Atropine + pralidoxime"],
  ["Sedative-hypnotic","Ức chế hô hấp, ý thức ↓ nhưng đồng tử thường", "Benzo, barbiturate, GHB, alcohol","Flumazenil (cẩn trọng co giật) / hỗ trợ hô hấp"],
  ["Hội chứng serotonin","Clonus + hyperreflexia + tự thần kinh; triad tâm thần-tự vận động-tự trị","SSRI+MAOI, tramadol+SSRI, linezolid+SSRI","Cyproheptadine + benzodiazepine, ngừng serotonergic"],
  ["NMS (hội chứng ác tính an thần kinh)",'"4D": Đờ đẫn-Di chứng-Dystonia-Đổ mồ hôi + CKM cực cao',"Haloperidol, risperidone, metoclopramide","Dantrolene + bromocriptine + làm mát — phân biệt serotonin syndrome (clonus) vs NMS (cứng铅)"],
  ["Salicylate","'Rung chuông': ù tai → hyperventilation → mixed acid-base","Aspirin quá liều, dầu wintergreen","Alkalinize urine NaHCO₃ + hemodialysis >100 mg/dL"],
  ["Sympatholytic","Bradycardia, hypotension, miosis, CNS trầm","Clonidine, beta-blocker, opioids chồng","Naloxone thử nghiệm cho clonidine; vasopressor hỗ trợ"],
  ["Hallucinogen","Ảo giác + mydriasis + tim nhanh nhưng vital ổn định","LSD, psilocybin, ketamine","'Talk-down' môi trường yên tĩnh + benzo nếu kích động"]
];

/* Tương tác CYP450 chi tiết */
const CYP_TABLE = [
  ["CYP3A4","~50% thuốc thị trường","Ketoconazole, grapefruit juice, clarithromycin (ức chế) · rifampicin, carbamazepine, St. John's wort (cảm ứng)","Statins, cyclosporine, CCBS, opioids, many TKIs"],
  ["CYP2D6","~25% drugs; poor/ultrarapid polymorphism","Fluoxetine, paroxetine, bupropion (ức chế mạnh)","Codeine→morphine, tamoxifen→endoxifen, TCAs, metoprolol"],
  ["CYP2C9","Warfarin, phenytoin, NSAIDs metabolism","Amiodarone, fluconazole ức chế → INR spike","VKORC1 + CYP2C9 genotyping warfarin dosing"],
  ["CYP1A2","Theophylline, clozapine, caffeine","Smoking CỰU KỲ cảm ứng → cai thuốc lá tăng clozapine level!","Fluvoxamine ức chế mạnh"],
  ["CYP2C19","Clopidogrel activation, PPIs, diazepam","Omeprazole ức chế → clopidogrel failure interaction","Loss-of-function allele phổ biến người Á Đông"],
  ["UGT1A1","Glucuronidation bilirubin, irinotecan","Gilbert syndrome · atazanavir ức chế","Irinotecan neutropenia UGT1A1*28 testing"],
  ["P-gp efflux","Bơm xuất bề mặt ruột/BBB","Verapamil, quinidine ức chế; rifampicin cảm ứng","Digoxin levels ↑ với verapamil/amiodarone"],
  ["MAO-A/B","Metabolism amines neurotransmitter","Thuốc MAOI — tyramine cheese reaction hypertensive crisis","Contrast SSRI/tramadol contraindications"]
];

/* Công thức tính liều lâm sàng */
const CLINICAL_CALC = [
  ["Loading dose","LD = Vd × Cp mục tiêu / F","Đưa ngay tới nồng độ điều trị không chờ 5 t½ — amiodarone digoxin phenytoin"],
  ["Maintenance rate","MDR = CL × Cp_ss / F","Thanh thải = lượng vào = lượng ra tại steady state"],
  ["Cockcroft-Gault CrCl","[(140−tuổi)×cân nặng]/(72×Cr mg/dL); nữ ×0.85","Điều chỉnh liều renally-cleared: vancomycin, LMWH, gabapentin…"],
  ["Anion gap","AG = Na⁺ − (Cl⁻ + HCO₃⁻), bình thường 8–12","MUDPILES causes metabolic acidosis high-gap; uremia ketoacid lactic toxin"],
  ["Corrected calcium","Ca đo + 0.02×(40 − albumin g/L)","Hypoalbuminemia giả hypocalcemia — correction trước khi hành động"],
  ["Serum osmolality đo vs tính","2Na + glucose/3 + urea/2.8; gap >10 = osmolal toxin","Methanol/ethylene glycol screening khi gap osmolar cao bất giải thích"],
  ["Free water deficit","0.6×kg ×(Na/140 −1)","Hypernatremia correction ≤10-12 mM/24h tránh cerebral edema rebound"],
  ["Winter's formula kiểm tra PCO₂", "PCO₂ dự kiến = 1.5×[HCO₃⁻] + 8 ±2","Acidosis metabolic có compensation đúng hay kèm respiratory disorder"],
  ["Vancomycin AUC/MIC ≥400","Trough-based legacy vs Bayesian AUC-guided modern","Nephrotoxicity giảm khi AUC-guided — PK/PD clinical pharmacist skill"],
  ["Creatinine kinase CK rhabdo","CK >5000 + myoglobinuria dark urine","Fluids aggressive + alkalinize urine; monitor K⁺/Ca²⁺ arrhythmia risk"]
];

/* Đối tượng đặc biệt */
const SPECIAL_POP = [
  ["Thai kỳ FDA cũ A-B-C-D-X","X = teratogenic tuyệt đối chống chỉ định: isotretinoin, thalidomide, warfarin, ACEi/ARB 2-3","Dùng LactMed/reproductive risk frameworks; methotrexate weekly abortifacient"],
  ["Cho con bú","LactMed database; relative infant dose <10% thường chấp nhận được","Codeine ultra-rapid → morphine sữa gây tử vong trẻ — black box"],
  ["Nhi khoa mg/kg","Không mini-adult: Vd/CL/kg khác biệt theo tuổi; neonate hepatic immature","Chloramphenicol gray baby syndrome; tetracycline teeth/bone growth"],
  ["Người cao tuổi Beers criteria","AGS Beers list: anticholinergic burden, benzo falls risk, sliding insulin","Polypharmacy deprescribing — medication reconciliation mỗi nhập viện"],
  ["Suy gan Child-Pugh A/B/C","CYP giảm + albumin thấp + portal shunting → dose reduce","No reliable formula — titrate cautiously; avoid prodrugs needing activation"],
  ["Suy thận eGFR bands",">60 bình thường · 30-60 giảm liều · <15 dialysis planning","DOACs, metformin, gabapentin, vancomycin — bảng adjust từng drug label"],
  ["Pharmacogenomics CPIC","CYP2D6 codeine · TPMT/NUDT15 thiopurines · HLA-B*5801 allopurinol SJS","HLA-B*1502 carbamazepine Đông Á bắt buộc test trước kê đơn"],
  ["Obesity dosing","ABW vs IBW vs adjusted BW theo lipophilicity drug-specific","Enoxaparin prophylaxis obesity evidence evolving; vancomycin AUC preferred"]
];

/* Vaughan-Williams antiarrhythmic */
const VW_CLASSES = [
  ["Class Ia","Disopyramide, procainamide, quinidine","↓Vmax moderate · prolong AP","Atrial/flutter + WPW; torsades & anticholinergic load"],
  ["Class Ib","Lidocaine, mexiletine","↓Vmax minimal · shorten AP","Ischemic ventricular arrhythmias only — atrial useless"],
  ["Class Ic","Flecainide, propafenone","↓Vmax strong no AP change","Structural heart disease CONTRAINDICATED post-MI CAST trial mortality!"],
  ["Class II","Beta-blockers (metoprolol, esmolol)","β₁ blockade ↓SA/AV node automaticity","Post-MI mortality benefit rare among antiarrhythmics"],
  ["Class III","Amiodarone, sotalol, dofetilide, ibutilide","K⁺ block prolong repolarization QT","Amio 'dirty multi-class'; sotalol beta-blockade combo"],
  ["Class IV","Verapamil, diltiazem","Ca²⁺ channel AV nodal slow","SVRate control; avoid in HF with reduced EF decompensation"],
  ["Others","Adenosine, digoxin, magnesium","Transient AV block / NaK ATPase / physiologic Ca block","Adenosine 6→12mg rapid push transient asystole diagnostic-therapeutic SVT"]
];

/* Phác đồ cấp cứu hóa-dược */
const EMERGENCY_PROTOCOLS = [
  ["Sốc phản vệ","Epinephrine IM 0.3-0.5mg đùi ngoài LẤY TRƯỚC antihistamine/steroid","IM thigh beats IV delay; position flat legs raised O₂ fluids second-line"],
  ["Status epilepticus","Benzo IV đầu tiên → phenytoin/fosphenytoin → anesthetic propofol/midazolam drip","5 phút definition; lorazepam 4mg repeat once; glucose thiamine if alcoholic"],
  ["STEMI","Door-to-balloon ≤90 min PCI; fibrinolytic ≤30 min nếu không PCI capable","ASA chew + P2Y₁₂ loading + heparin anticoagulation adjuncts"],
  ["Stroke ischemic window","tPA ≤4.5h onset + thrombectomy ≤6-24h selected imaging","BP <185/110 before lytics; glucose mimic stroke check first"],
  ["Sepsis bundle hour-1","Broad antibiotics + 30mL/kg crystalloid + lactate measure + vasopressors if MAP<65","Surviving Sepsis Campaign — antibiotics sớm nhất là yếu tố sống còn nhất"],
  ["DKA protocol","IV fluids first → insulin infusion 0.1u/kg/h → K⁺ replace BEFORE insulin if <3.3","Bicarbonate chỉ pH<6.9; cerebral edema children overcorrection risk"],
  ["Tricyclic overdose","NaHCO₃ bolus QRS widening >100ms — sodium overrides sodium-channel block","Avoid flumazenil/physostigmine mixed overdoses seizures cardiac priority"],
  ["Methanol/EG intoxication","Fomepizole hoặc ethanol + hemodialysis when acidosis/vision/end-organ signs","Formate accumulation targets optic nerve/ kidney — early dialysis saves sight"],
  ["Serotonin syndrome severe","Cyproheptadine 12mg then 2mg/2h + cooling + benzo agitation","Weiss criteria diagnosis; differentiate NMS (lead-pipe rigidity, CK↑, slower onset)"],
  ["Local anesthetic systemic toxicity LAST","Intralipid 20% 1.5 mL/kg bolus lipid sink rescue","Stop injection immediately; avoid vasopressor cocktails; amiodarone over lidocaine for VT"]
];
