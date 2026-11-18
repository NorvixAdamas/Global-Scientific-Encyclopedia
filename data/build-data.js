/* ============================================================
   BUILD DATA — Xuất toàn thư sang schema chuẩn mở
   Tạo: data/reactions.json|js · compounds.json|js · drugs.json|js
   Chạy:  node data/build-data.js
   ============================================================ */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

function loadJs(rel, ret) {
  const src = fs.readFileSync(path.join(root, rel), "utf8") + `\nreturn ${ret};`;
  return new Function("E", src)(null);
}
const REACTIONS = loadJs("js/reactions.js", "REACTIONS");
const MATERIALS = loadJs("js/materials.js", "MATERIALS");
const DRUGS = loadJs("js/medicine.js", "DRUGS");

/* ---- Máy tính khối lượng mol từ công thức hóa học (hỗ trợ ngoặc) ---- */
const ATOMIC_MASS = {H:1.008,He:4.003,Li:6.94,Be:9.012,B:10.81,C:12.011,N:14.007,O:15.999,F:18.998,
Ne:20.180,Na:22.990,Mg:24.305,Al:26.982,Si:28.085,P:30.974,S:32.06,Cl:35.45,Ar:39.948,K:39.098,
Ca:40.078,Ti:47.867,Cr:51.996,Mn:54.938,Fe:55.845,Ni:58.693,Cu:63.546,Zn:65.38,As:74.922,Br:79.904,
Ag:107.868,I:126.904,Ba:137.327,Pt:195.084,Au:196.967,Hg:200.592,Pb:207.2,U:238.029};
function parseFormula(f) {
  let i = 0;
  function parseGroup() {
    const counts = {};
    while (i < f.length) {
      const c = f[i];
      if (c === "(") { i++; const sub = parseGroup(); if (f[i] === ")") i++;
        let num = ""; while (i < f.length && /\d/.test(f[i])) num += f[i++];
        for (const [el, n] of Object.entries(sub)) counts[el] = (counts[el]||0) + n*(+num||1);
      } else if (c === ")") { return counts; }
      else if (/[A-Z]/.test(c)) {
        let el = c; i++;
        while (i < f.length && /[a-z]/.test(f[i])) el += f[i++];
        let num = ""; while (i < f.length && /\d/.test(f[i])) num += f[i++];
        counts[el] = (counts[el]||0) + (+num||1);
      } else i++;
    }
    return counts;
  }
  const counts = parseGroup();
  let mw = 0;
  for (const [el, n] of Object.entries(counts)) {
    if (!ATOMIC_MASS[el]) throw new Error("Unknown element " + el + " in " + f);
    mw += ATOMIC_MASS[el] * n;
  }
  return Math.round(mw * 100) / 100;
}

/* ---- Hợp chất seed có SMILES/CID thật (PubChem-confident subset) ---- */
const COMPOUND_SEEDS = [
 ["2244","Aspirin","C9H8O4","CC(=O)OC1=CC=CC=C1C(=O)O","2-acetoxybenzoic acid","Thuốc giảm đau chống kết tập"],
 ["1983","Paracetamol","C8H9NO2","CC(=O)NC1=CC=C(O)C=C1","N-(4-hydroxyphenyl)acetamide","Giảm đau hạ sốt"],
 ["3672","Ibuprofen","C13H18O2","CC(C)Cc1ccc(cc1)C(C)C(=O)O","2-[4-(2-methylpropyl)phenyl]propanoic acid","NSAID"],
 ["2519","Caffeine","C8H10N4O2","Cn1cnc2c1c(=O)n(C)c(=O)n2C","1,3,7-trimethylxanthine","Stimulant CNS"],
 ["1176","Urea","CH4N2O","NC(N)=O","Carbamide","Phân bón/dược"],
 ["176","Acetic acid","C2H4O2","CC(O)=O","Ethanoic acid","Giấm ăn"],
 ["8857","Ethyl acetate","C4H8O2","CCOC(C)=O","Ethyl ethanoate","Dung môi sơn"],
 ["702","Ethanol","C2H6O","CCO","Ethanol","Rượu etylic"],
 ["887","Methanol","CH4O","CO","Methanol","Dung môi/độc"],
 ["712","Formaldehyde","CH2O","C=O","Methanal","Bảo quản mẫu"],
 ["284","Formic acid","CH2O2","OC=O","Methanoic acid","Kiến đỏ"],
 ["180","Acetone","C3H6O","CC(C)=O","Propan-2-one","Tẩy sơn móng"],
 ["241","Benzene","C6H6","c1ccccc1","Benzene","Dung môi công nghiệp"],
 ["1140","Toluene","C7H8","Cc1ccccc1","Methylbenzene","Dung môi"],
 ["996","Phenol","C6H6O","Oc1ccccc1","Phenol","Khử trùng gốc"],
 ["6115","Aniline","C6H7N","Nc1ccccc1","Benzenamine","Thuốc nhuộm"],
 ["243","Benzoic acid","C7H6O2","OC(=O)c1ccccc1","Benzenecarboxylic acid","E210 bảo quản"],
 ["338","Salicylic acid","C7H6O3","OC(=O)c1ccccc1O","2-hydroxybenzoic acid","Tiền aspirin"],
 ["5793","Glucose","C6H12O6","OCC1OC(O)C(O)C(O)C1O","(2R,3S,4R,5R)-hexane-1,2,3,4,5,6-hexol? glucose","Đường máu"],
 ["962","Water","H2O","O","Oxidane","Dung môi vạn năng"],
 ["222","Ammonia","NH3","N","Azane","Haber-Bosch product"],
 ["297","Methane","CH4","C","Methane","Khí đốt chính"],
 ["280","Carbon dioxide","CO2","O=C=O","Carbon dioxide","Greenhouse gas"],
 ["6325","Ethylene","C2H4","C=C","Ethene","PE monomer"],
 ["8252","Propylene","C3H6","CC=C","Prop-1-ene","PP monomer"],
 ["6326","Acetylene","C2H2","C#C","Ethyne","Đèn hàn"],
 ["8078","Cyclohexane","C6H12","C1CCCCC1","Cyclohexane","Dung môi nylon route"],
 ["5234","Sodium chloride","NaCl","[Na+].[Cl-]","Sodium chloride","Muối ăn"],
 ["313","Hydrogen chloride","ClH","Cl","Hydrogen chloride","Axit mạnh"],
 ["3016","Diazepam","C16H13ClN2O","CN1C(=O)c2ccc(Cl)cc2NC2CCCC2C1=O","7-chloro-1-methyl-5-phenylbenzodiazepin-2-one","Benzodiazepine"],
 ["5288826","Morphine","C17H19NO3","CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@H]3[C@H]1C5","(1S,5R,13R,14S,17R)-…morphine","Opioid chuẩn"],
 ["5997","Cholesterol","C27H46O","CC(C)CCCC(C)C1CCC2(CC1)CC=C1CC(O)CCC1C2","Cholest-5-en-3β-ol","Steroid membrane"],
 ["89594","Nicotine","C10H14N2","CN1CCC[C@H]1c1cccnc1","3-(1-methylpyrrolidin-2-yl)pyridine","Thuốc lá alkaloid"],
 ["DB-extra","Warfarin","C19H16O4","CC(=O)CC(c1ccccc1)c1c(O)c2ccccc2oc1=O","4-hydroxy-3-(3-oxo-1-phenylbutyl)coumarin","Anticoagulant"],
 ["DB-extra2","Diclofenac","C14H11Cl2NO2","OC(=O)Cc1ccccc1Nc1c(Cl)cccc1Cl","2-[2-(2,6-dichloroanilino)phenyl]acetic acid","NSAID arylacetic"],
 ["DB-extra3","Salbutamol","C13H21NO3","CC(C)(C)NCC(O)c1ccc(O)c(CO)c1","4-[2-(tert-butylamino)-1-hydroxyethyl]-2-(hydroxymethyl)phenol","Beta2 agonist"],
 ["DB-extra4","Metformin","C4H11N5","CN(C)C(=N)N=C(N)N","1,1-dimethylbiguanide","Biguanide antidiabetic"],
 ["DB-extra5","Cisplatin","Cl2H6N2Pt","N.N.Cl[Pt]Cl","cis-diamminedichloroplatinum(II)","Thuốc ung thư phối hợp"],
 ["DB-extra6","Penicillin G","C16H18N2O4S","CC1(C)SC2C(NC(=O)Cc3ccccc3)C(=O)N2C1C(=O)O","benzylpenicillin","Beta-lactam đầu tiên"]
];

/* ---- Phản ứng seed theo schema ORD rút gọn ---- */
const RXN_SEEDS = [
 ["RXN-C001","Fischer esterification",[["Acetic acid","CC(O)=O"],["Ethanol","CCO"]],[["Ethyl acetate","CCOC(C)=O"],["Water","O"]],{temperature:"25–80 °C",solvent:"toluene (Dean-Stark)",catalyst:"H2SO4 cat."},"70-85%","acid-base"],
 ["RXN-C002","Aspirin acetylation",[["Salicylic acid","OC(=O)c1ccccc1O"],["Acetic anhydride","CC(=O)OC(C)=O"]],[["Aspirin","CC(=O)OC1=CC=CC=C1C(=O)O"],["Acetic acid","CC(O)=O"]],{temperature:"80 °C",solvent:"neat",catalyst:"H2SO4 trace"},"90%","acylation"],
 ["RXN-C003","Haber-Bosch ammonia",[["Nitrogen","N#N"],["Hydrogen","[H][H]"]],[["Ammonia","N"]],{temperature:"450 °C",solvent:"—",catalyst:"Fe/K2O-Al2O3, 200 atm"},"30% per pass","industrial"],
 ["RXN-C004","Neutralization",[["HCl","Cl"],["NaOH","[Na+].[OH-]"]],[["Sodium chloride","[Na+].[Cl-]"],["Water","O"]],{temperature:"25 °C",solvent:"water",catalyst:"—"},"quantitative","acid-base"],
 ["RXN-C005","Thermite aluminothermy",[["Aluminium powder","[Al]"],["Iron(III) oxide","O=[Fe](O[Fe]=O)O"]],[["Alumina","O=[Al](O[Al]=O)O"],["Iron metal","[Fe]"]],{temperature:"2500 °C ignition",solvent:"—",catalyst:"Mg fuse ribbon"},"~100%","redox"],
 ["RXN-C006","Methane combustion",[["Methane","C"],["Oxygen","O=O"]],[["Carbon dioxide","O=C=O"],["Water","O"]],{temperature:"flame ~1900 °C",solvent:"—",catalyst:"—"},"complete","combustion"],
 ["RXN-C007","Photosynthesis",[["CO2","O=C=O"],["Water","O"]],[["Glucose","OCC1OC(O)C(O)C(O)C1O"],["Oxygen","O=O"]],{temperature:"ambient + 6 photons H2O splitting",solvent:"chloroplast stroma",catalyst:"chlorophyll PSII/PSI"},"ΔG +2870 kJ/mol driven by light","photochemical"],
 ["RXN-C008","Electrolysis of water",[["Water","O"]],[["Hydrogen","[H][H]"],["Oxygen","O=O"]],{temperature:"25 °C electrolysis",solvent:"KOH aq",catalyst:"Ni-Fe electrodes"},"75% energy efficiency","electrochemical"],
 ["RXN-C009","Chlor-alkali membrane cell",[["NaCl brine","[Na+].[Cl-]"],["Water","O"]],[["Chlorine","ClCl"],["Hydrogen","[H][H]"],["Caustic soda","[Na+].[OH-]"]],{temperature:"80 °C",solvent:"brine 25%",catalyst:"Ni cathode / RuO2-Ti anode"},"industrial continuous","electrochemical"],
 ["RXN-C010","Hall-Héroult aluminium",[["Alumina","O=[Al]O[Al]=O"]],[["Aluminium metal","[Al]"],["Oxygen (carbon anode burn)","O=C=O"]],{temperature:"960 °C",solvent:"molten cryolite Na3AlF6",catalyst:"consumable carbon anodes"},"industrial molten salt electrolysis","electrochemical"],
 ["RXN-C011","Grignard formation",[["Bromobenzene","Brc1ccccc1"],["Magnesium turnings","[Mg]"]],[["Phenylmagnesium bromide","Br[Mg]c1ccccc1"]],{temperature:"reflux",solvent:"anhydrous diethyl ether",catalyst:"iodine crystal initiation"},"95%","organometallic"],
 ["RXN-C012","Friedel-Crafts alkylation",[["Benzene","c1ccccc1"],["Chloromethane","CCl"]],[["Toluene","Cc1ccccc1"],["HCl","Cl"]],{temperature:"0–25 °C",solvent:"neat excess benzene",catalyst:"AlCl3"},"60-80%","Friedel-Crafts"],
 ["RXN-C013","Nitration of benzene",[["Benzene","c1ccccc1"],["Nitric acid","O[N+](=O)[O-]"]],[["Nitrobenzene","O=[N+]([O-])c1ccccc1"],["Water","O"]],{temperature:"50 °C",solvent:"concentrated H2SO4 medium",catalyst:"H2SO4 protonates NO3-"},"85%","nitration EAS"],
 ["RXN-C014","Aldol addition acetaldehyde",[["Acetaldehyde","CC=O"]],[["3-hydroxybutanal","CC(O)CC=O"]],{temperature:"5 °C dilute",solvent:"aqueous NaOH",catalyst:"hydroxide base enolate"},"equilibrium aldol product","C-C bond forming"],
 ["RXN-C015","Cannizzaro disproportionation",[["Formaldehyde","C=O"],["NaOH","[Na+].[OH-]"]],[["Methanol","CO"],["Sodium formate","[Na+].O=C([O-])"]],{temperature:"50 °C concentrated",solvent:"water",catalyst:"hydroxide hydride transfer"},"disproportionation","hydride shift"],
 ["RXN-C016","Diels-Alder cyclohexene",[["1,3-butadiene","C=CC=C"],["Ethylene","C=C"]],[["Cyclohexene","C1=CCCCC1"]],{temperature:"150 °C pressure vessel",solvent:"neat thermal",catalyst:"—"},"[4+2] pericyclic allowed thermally","pericyclic"],
 ["RXN-C017","Ziegler-Natta polyethylene",[["Ethylene","C=C"]],[["Polyethylene HDPE","*[CH2CH2]* repeat"]],{temperature:"60–100 °C slurry",solvent:"hydrocarbon diluent",catalyst:"TiCl4/AlEt3 supported"},"HDPE industrial scale","coordination polymerization"],
 ["RXN-C018","Nylon-6,6 interfacial polycondensation",[["Adipoyl chloride","ClC(=O)CCCCCC(=O)Cl"],["Hexamethylenediamine","NCCCCCCN"]],[["Nylon-6,6 polymer","*[NHCCCCCCNC(=O)CCCCC(=O)]* repeat"],["HCl","Cl"]],{temperature:"room temperature interface",solvent:"water/organic two-phase",catalyst:"—"},"nylon rope trick demonstration","condensation polymerization"],
 ["RXN-C019","Rubber vulcanization",[["Natural rubber cis-polyisoprene","*isoprene repeat*"],["Elemental sulfur S8","[S]"]],[["Crosslinked vulcanized rubber network","*crosslinked elastomer*"]],{temperature:"140 °C press cure",solvent:"—",catalyst:"ZnO + accelerators"},"Goodyear 1839 discovery","crosslinking"],
 ["RXN-C020","Solvay sodium bicarbonate",[["Sodium chloride brine","[Na+].[Cl-]"],["Ammonia","N"],["Carbon dioxide","O=C=O"],["Water","O"]],[["Sodium bicarbonate precipitate","[Na+].OC(=O)[O-]"]],{temperature:"30–40 °C carbonating tower",solvent:"aqueous saturated brine",catalyst:"ammonia mediated cycle"},"Solvay ammonia-soda industrial","precipitation"],
 ["RXN-C021","Markovnikov addition HBr to propene",[["Propene","CC=C"],["Hydrogen bromide","Br"]],[["2-bromopropane","CC(Br)C"]],{temperature:"ambient no peroxide",solvent:"inert nonpolar",catalyst:"—"},"Markovnikov regioselectivity","electrophilic addition"],
 ["RXN-C022","Ethanol dehydration to ethylene",[["Ethanol","CCO"]],[["Ethylene","C=C"],["Water","O"]],{temperature:"170 °C",solvent:"vapor phase over alumina",catalyst:"conc. H2SO4 or Al2O3"},"dehydration elimination","elimination"],
 ["RXN-C023","Tollens silver mirror test",[["Reducing aldehyde RCHO","RCHO"],["Tollens reagent diamminesilver","[Ag(NH3)2]+.[OH-]"]],[["Carboxylate anion","[RCOO-]"],["Silver mirror metal","[Ag]"]],{temperature:"warm water bath 50 °C",solvent:"aqueous alkaline ammonia",catalyst:"—"},"qualitative silver mirror","oxidation qualitative"],
 ["RXN-C024","Kolbe-Schmitt carboxylation phenol",[["Sodium phenoxide","[Na+].Oc1ccccc1"],["Carbon dioxide","O=C=O"]],[["Salicylic acid sodium salt then acidified","[Na+].OC(=O)c1ccccc1O"]],{temperature:"125 °C 100 atm CO2",solvent:"solid dry sodium phenoxide",catalyst:"high pressure CO2"},"aspirin feedstock route","carboxylation"],
 ["RXN-C025","Sandmeyer chlorination diazonium",[["Benzenediazonium chloride","[Cl-].c1ccc([N+]#N)cc1"],["CuCl","Cl[Cu]"]],[["Chlorobenzene","Clc1ccccc1"],["Nitrogen gas","N#N"]],{temperature:"0–25 °C controlled",solvent:"aqueous hydrochloric",catalyst:"Cu(I) chloride radical relay"},"Sandmeyer halogenation diversity","substitution radical relay"],
 ["RXN-C026","Suzuki-Miyaura biaryl coupling",[["Phenylboronic acid","OB(O)c1ccccc1"],["4-bromoanisole","COc1ccc(Br)cc1"]],[["4-methoxybiphenyl","COc1ccc(-c2ccccc2)cc1"]],{temperature:"80 °C reflux aqueous base",solvent:"dioxane/water 4:1",catalyst:"Pd(PPh3)4 2 mol%"},"95% Nobel 2010 chemistry","cross-coupling"],
 ["RXN-C027","Click CuAAC triazole",[["Benzyl azide","[N-]=[N+]=NCC1=CC=CC=C1"],["Phenylacetylene","C#Cc1ccccc1"]],[["1,4-disubstituted 1,2,3-triazole product","triazole ring product"]],{temperature:"room temperature air tolerant",solvent:"t-BuOH/H2O 1:1",catalyst:"CuSO4 + sodium ascorbate in situ Cu(I)"},"Click chemistry CuAAC Nobel 2022","cycloaddition bioorthogonal"],
 ["RXN-C028","Reductive ozonolysis alkene cleavage",[["Alkene substrate","C=C fragment"],["Ozone O3","[O-][O+]=O"]],[["Two carbonyl fragments aldehydes ketones","aldehyde ketone pieces"]],{temperature:"-78 °C then Zn/acetic acid workup",solvent:"dichloromethane methanol",catalyst:"—"},"oxidative-reductive ozonolysis cleavage","cleavage"]
];
// Chuẩn hóa seeds dạng mảng lẫn object về object thống nhất
const REACTION_DB = RXN_SEEDS.map((r, i) => {
  if (r.reaction_id) return {
    reaction_id: r.reaction_id,
    reactants: r.reactants.map(([name, smiles]) => ({ name, smiles })),
    products: r.products.map(([name, smiles]) => ({ name, smiles })),
    conditions: r.conditions, yield_percent: String(r.yield || ""), type: r.type,
    source: "curated-toanthu", license: "educational"
  };
  const [rid, title, react, prod, cond, yld, type] = r;
  void title;
  return {
    reaction_id: rid,
    reactants: react.map(([name, smiles]) => ({ name, smiles })),
    products: prod.map(([name, smiles]) => ({ name, smiles })),
    conditions: cond, yield_percent: String(yld), type,
    source: "curated-toanthu", license: "educational"
  };
});

/* ---- Từ thư viện phản ứng site → bản ghi ORD-lite (không SMILES bắt buộc) ---- */
REACTIONS.forEach((r, i) => {
  REACTION_DB.push({
    reaction_id: "TT-R%05d".replace("%05d", String(i + 1).padStart(5, "0")),
    reactants: [{ name: r.t, smiles: "" }],
    products: [{ name: r.e.slice(0, 120), smiles: "" }],
    conditions: { temperature: "", solvent: "", catalyst: "" },
    yield_percent: "",
    type: r.c,
    note: r.n, source: "toanthu-curation", license: "educational"
  });
});

/* ---- Compounds DB ---- */
const COMPOUND_DB = COMPOUND_SEEDS.map(([cid, name, formula, smiles, iupac, note]) => ({
  compound_cid: cid.startsWith("DB") ? "" : cid,
  iupac_name: iupac,
  common_name: name,
  molecular_formula: formula,
  molecular_weight: (() => { try { return parseFormula(formula); } catch { return null; } })(),
  smiles_string: smiles,
  category: "chemistry/pharma",
  note
}));
MATERIALS.forEach((m, i) => COMPOUND_DB.push({
  compound_cid: "",
  iupac_name: "",
  common_name: `${m.icon} ${m.name}`,
  molecular_formula: "",
  molecular_weight: null,
  smiles_string: "",
  category: "material/" + (m.cat || "general"),
  note: m.sub,
  detail: stripTags(m.content).slice(0, 400)
}));
function MATCAT_NAME(id) { return id; }
function stripTags(h) { return h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "); }

/* ---- Merge PubChem-fetched compounds ---- */
(function mergePubChem() {
  const pcPath = path.join(__dirname, "pubchem-fetched.json");
  if (fs.existsSync(pcPath)) {
    try {
      const pubchem = JSON.parse(fs.readFileSync(pcPath, "utf8"));
      const existingCids = new Set(COMPOUND_DB.map(c => c.compound_cid).filter(Boolean));
      let added = 0;
      for (const pc of pubchem) {
        if (!pc.compound_cid || existingCids.has(pc.compound_cid)) continue;
        COMPOUND_DB.push({
          compound_cid: pc.compound_cid,
          iupac_name: pc.iupac_name || "",
          common_name: pc.common_name || "",
          molecular_formula: pc.molecular_formula || "",
          molecular_weight: pc.molecular_weight || null,
          smiles_string: pc.smiles_string || "",
          category: pc.category || "chemistry/pharma",
          note: pc.note || ""
        });
        added++;
      }
      console.log("Merged PubChem compounds:", added);
    } catch (e) { console.log("Skipping PubChem merge:", e.message); }
  }
})();

/* ---- Drugs DB theo schema DrugBank rút gọn ---- */
const REAL_DB_IDS = {
 "Aspirin":"DB00945", "Paracetamol/Acetaminophen":"DB00316", "Ibuprofen":"DB01050",
 "Metformin":"DB00331", "Warfarin":"DB00682", "Penicillin G/V":"DB01053", "Amoxicillin":"DB01060",
 "Omeprazole":"DB00338", "Morphine":"DB00295", "Diazepam Valium":"DB00829", "Atorvastatin":"DB01076",
 "Salbutamol":"DB01001", "Donepezil":"DB00843", "Fluoxetine":"DB00472", "Oseltamivir":"DB00198",
 "Sumatriptan":"DB00969", "Tamoxifen":"DB00675", "Imatinib":"DB00619",
 "Doxorubicin":"DB00997", "Cisplatin":"DB00515", "Levodopa":"DB01235",
 "Losartan":"DB00678", "Metoprolol":"DB00264", "Lisinopril":"DB00722", "Furosemide":"DB00690",
 "Prednisone":"DB00860", "Allopurinol":"DB00437", "Azathioprine":"DB00993",
 "Methotrexate":"DB00563", "Paclitaxel":"DB01204", "Rifampicin":"DB01045",
 "Vancomycin":"DB00512", "Ciprofloxacin":"DB00537",
 "Dabigatran":"DB06695", "Rivaroxaban":"DB06228", "Ticagrelor":"DB08816",
 "Prasugrel":"DB06209", "Simvastatin":"DB00641", "Rosuvastatin":"DB01098",
 "Clopidogrel":"DB00758", "Amlodipine":"DB00381", "Nifedipine":"DB01115",
 "Verapamil":"DB00661", "Diltiazem":"DB00343", "Valsartan":"DB00177",
 "Captopril":"DB00597", "Enalapril":"DB00584", "Ramipril":"DB00178",
 "Spironolactone":"DB00421", "Digoxin":"DB00392", "Ivabradine":"DB09083",
 "Haloperidol":"DB00502", "Chlorpromazine":"DB00477", "Clozapine":"DB00363",
 "Olanzapine":"DB00334", "Risperidone":"DB00734", "Quetiapine":"DB01224",
 "Aripiprazole":"DB01238", "Carbamazepine":"DB00564", "Valproic":"DB00313",
 "Lamotrigine":"DB00555", "Levetiracetam":"DB01202", "Phenytoin":"DB00252",
 "Phenobarbital":"DB01174", "Midazolam":"DB00683", "Lorazepam":"DB00186",
 "Alprazolam":"DB00404", "Sertraline":"DB01104", "Escitalopram":"DB01175",
 "Venlafaxine":"DB00285", "Duloxetine":"DB00476", "Bupropion":"DB01156",
 "Indomethacin":"DB00328", "Naproxen":"DB00788", "Ketoprofen":"DB01009",
 "Piroxicam":"DB00554", "Celecoxib":"DB00482",
 "Tramadol":"DB00193", "Fentanyl":"DB00813", "Methadone":"DB00333",
 "Naloxone":"DB01183", "Lidocaine":"DB00281", "Bupivacaine":"DB00297",
 "Ketamine":"DB01221", "Propofol":"DB00818",
 "Cyclophosphamide":"DB00531", "Ifosfamide":"DB01181", "Fluorouracil":"DB00544",
 "Capecitabine":"DB01101", "Gemcitabine":"DB00441",
 "Etoposide":"DB00773", "Irinotecan":"DB00762", "Vincristine":"DB00541",
 "Vinblastine":"DB00570", "Daunorubicin":"DB00694", "Epirubicin":"DB00445",
 "Erlotinib":"DB00530", "Gefitinib":"DB00317", "Sunitinib":"DB01268", "Sorafenib":"DB00398",
 "Pembrolizumab":"DB09037", "Nivolumab":"DB09035", "Ipilimumab":"DB06186",
 "Bortezomib":"DB00188", "Lenalidomide":"DB00480",
 "Rituximab":"DB00073", "Trastuzumab":"DB00072", "Bevacizumab":"DB00112",
 "Cetuximab":"DB00002", "Olaparib":"DB09074", "Venetoclax":"DB11581",
 "Abiraterone":"DB05812", "Enzalutamide":"DB08899", "Palbociclib":"DB09073",
 "Adalimumab":"DB00051", "Infliximab":"DB00065", "Etanercept":"DB00005",
 "Tocilizumab":"DB06273", "Ustekinumab":"DB05679", "Secukinumab":"DB09029",
 "Baricitinib":"DB11817", "Empagliflozin":"DB09038", "Dapagliflozin":"DB06292",
 "Liraglutide":"DB06655", "Semaglutide":"DB13928", "Sitagliptin":"DB01261",
 "Pioglitazone":"DB01132", "Denosumab":"DB06643", "Alendronate":"DB00630",
 "Hydroxychloroquine":"DB01611",
 "Meropenem":"DB00760", "Ceftriaxone":"DB01212", "Cefepime":"DB01413",
 "Daptomycin":"DB00080", "Linezolid":"DB00601", "Tigecycline":"DB00560",
 "Colistin":"DB00803",
 "Acyclovir":"DB00787", "Ribavirin":"DB00811", "Lamivudine":"DB00709",
 "Tenofovir":"DB00300", "Efavirenz":"DB00625", "Ritonavir":"DB00503",
 "Remdesivir":"DB14761", "Sofosbuvir":"DB08934",
 "Fluconazole":"DB00196", "Itraconazole":"DB01167", "Ketoconazole":"DB01026",
 "Terbinafine":"DB00857",
 "Gabapentin":"DB00996", "Pregabalin":"DB00230", "Ropivacaine":"DB00296",
 "Sildenafil":"DB00203", "Buprenorphine":"DB00921", "Naltrexone":"DB00704",
 "Varenicline":"DB01273",
 "Tetracycline":"DB00759", "Doxycycline":"DB00254", "Erythromycin":"DB00199",
 "Clarithromycin":"DB01211", "Azithromycin":"DB00207",
 "Levofloxacin":"DB01137", "Moxifloxacin":"DB00218", "Metronidazole":"DB00916"
};
const DRUG_DB = [];
let dseq = 0;
DRUGS.forEach(d => {
  dseq++;
  let dbid = "";
  for (const [k, v] of Object.entries(REAL_DB_IDS)) {
    const searchKey = k.toLowerCase();
    const drugName = d.n.toLowerCase();
    if (drugName.includes(searchKey) && v && !v.startsWith("skip") && !v.includes("?")) {
      dbid = v; break;
    }
  }
  const biologic = /mAb|monoclonal|vaccine|peptide|hormone|insulin|CAR-T|Fab|fusion protein/i.test(d.cls + d.n);
  DRUG_DB.push({
    drugbank_id: dbid || `TT-D${String(dseq).padStart(5, "0")}`,
    name: d.n, type: biologic ? "biologic" : "small molecule",
    groups: ["approved"], drug_class: d.cls,
    indication: d.note,
    targets: [{ target_name: d.mech, action: "modulator/inhibitor/agonist (see mechanism)" }],
    year: d.y, source: "toanthu-curation mapped to DrugBank-style schema"
  });
});

/* ---- GHI FILE ---- */
const outDir = __dirname;
fs.mkdirSync(outDir, { recursive: true });
function writePair(name, obj) {
  fs.writeFileSync(path.join(outDir, name + ".json"), JSON.stringify(obj, null, 1));
  fs.writeFileSync(path.join(outDir, name + "-data.js"),
    "// Sinh tự động từ build-data.js — nạp qua <script> cho chế độ file://\nwindow.OPEN_" +
    name.toUpperCase().replace(/-/g, "_") + " = " + JSON.stringify(obj) + ";");
}
writePair("reactions", REACTION_DB);
writePair("compounds", COMPOUND_DB);
writePair("drugs", DRUG_DB);
console.log("reactions:", REACTION_DB.length);
console.log("compounds:", COMPOUND_DB.length);
console.log("drugs:", DRUG_DB.length);
