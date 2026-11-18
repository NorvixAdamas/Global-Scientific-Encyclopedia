/* ============================================================
   FETCH-PUBCHEM-v2 — Tải dữ liệu hợp chất THẬT từ NIH PubChem
   Xử lý từng tên một (single-name lookup) qua PUG-REST
   Chạy:  node data/fetch-pubchem.js
   ============================================================ */

const https = require("https");
const fs = require("fs");
const path = require("path");

// ---- Danh sách ~400 hợp chất cần lấy (tên thông thường) ----
const NAMES = [
  // Amino acids
  "glycine","L-alanine","L-valine","L-leucine","L-isoleucine","L-serine","L-threonine","L-cysteine",
  "L-methionine","L-proline","L-aspartic acid","L-asparagine","L-glutamic acid","L-glutamine",
  "L-lysine","L-arginine","L-histidine","L-phenylalanine","L-tyrosine","L-tryptophan",
  // Sugars
  "D-fructose","sucrose","lactose","maltose","D-ribose","2-deoxy-D-ribose","D-galactose","D-mannose","D-xylose","L-arabinose",
  // Fatty acids
  "palmitic acid","stearic acid","oleic acid","linoleic acid","alpha-linolenic acid","arachidonic acid",
  "butyric acid","hexanoic acid","dodecanoic acid","tetradecanoic acid",
  // Vitamins
  "retinol","ascorbic acid","cholecalciferol","alpha-tocopherol","phylloquinone",
  "thiamine","riboflavin","nicotinic acid","pyridoxine","biotin","folic acid","cyanocobalamin","pantothenic acid",
  // Hormones
  "testosterone","estradiol","progesterone","cortisol","aldosterone","L-thyroxine",
  "epinephrine","norepinephrine","dopamine","serotonin","melatonin",
  // Alkaloids
  "cocaine","codeine","quinine","atropine","strychnine","colchicine","reserpine","ephedrine",
  "theophylline","theobromine","capsaicin","piperine","curcumin",
  // Antibiotics
  "tetracycline","doxycycline","erythromycin","clarithromycin","azithromycin","streptomycin",
  "kanamycin A","chloramphenicol","clindamycin","sulfamethoxazole","trimethoprim",
  "nalidixic acid","norfloxacin","levofloxacin","moxifloxacin","metronidazole",
  "nitrofurantoin","fosfomycin",
  // Antifungals
  "fluconazole","itraconazole","ketoconazole","terbinafine","griseofulvin","flucytosine",
  // Antivirals
  "acyclovir","ribavirin","lamivudine","tenofovir","efavirenz","lopinavir","ritonavir","remdesivir","sofosbuvir",
  // Cardiovascular
  "digoxin","captopril","enalapril","ramipril","valsartan","telmisartan","amlodipine",
  "nifedipine","verapamil","diltiazem","hydrochlorothiazide","spironolactone",
  "clopidogrel","apixaban","rivaroxaban","simvastatin","rosuvastatin",
  // Psychiatry / Neurology
  "haloperidol","chlorpromazine","clozapine","olanzapine","risperidone","quetiapine",
  "carbamazepine","valproic acid","lamotrigine","levetiracetam","phenytoin",
  "phenobarbital","midazolam","lorazepam","alprazolam","zolpidem",
  "sertraline","escitalopram","venlafaxine","duloxetine","bupropion","methylphenidate",
  // Analgesics / Anesthetics
  "indomethacin","naproxen","ketoprofen","piroxicam","celecoxib",
  "tramadol","fentanyl","methadone","naloxone","lidocaine","bupivacaine","ketamine","propofol",
  // Oncology
  "cyclophosphamide","ifosfamide","fluorouracil","capecitabine","gemcitabine",
  "etoposide","irinotecan","vincristine","vinblastine","daunorubicin","epirubicin",
  "erlotinib","gefitinib","sunitinib","sorafenib",
  // Solvents
  "dichloromethane","chloroform","tetrachloromethane","diethyl ether","tetrahydrofuran",
  "dimethyl sulfoxide","N,N-dimethylformamide","acetonitrile","hexane","heptane","pentane",
  "isopropyl alcohol","1-butanol","glycerol","ethylene glycol","propylene glycol",
  "1,4-dioxane","pyridine","triethylamine","carbon disulfide",
  // Acids
  "sulfuric acid","nitric acid","phosphoric acid","hydrochloric acid","hydrofluoric acid",
  "boric acid","oxalic acid","citric acid","lactic acid","malic acid","tartaric acid",
  "succinic acid","fumaric acid","maleic acid","phthalic acid","terephthalic acid","adipic acid",
  // Bases
  "sodium hydroxide","potassium hydroxide","calcium hydroxide",
  "sodium bicarbonate","sodium carbonate","potassium carbonate",
  // Salts / minerals
  "potassium chloride","calcium chloride","magnesium chloride","aluminium chloride",
  "iron(II) sulfate","copper(II) sulfate","zinc sulfate","silver nitrate",
  "barium sulfate","calcium carbonate","calcium sulfate","sodium nitrate",
  "potassium nitrate","ammonium nitrate","ammonium sulfate",
  "sodium phosphate","calcium phosphate","magnesium oxide","zinc oxide",
  "titanium dioxide","silicon dioxide","aluminium oxide","iron(III) oxide",
  // Gases
  "oxygen","nitrogen","hydrogen","helium","neon","argon","krypton","xenon",
  "carbon monoxide","sulfur dioxide","nitric oxide","nitrous oxide",
  "chlorine","hydrogen sulfide","ammonia",
  // Monomers
  "styrene","vinyl chloride","acrylonitrile","methyl methacrylate",
  "acrylic acid","methacrylic acid","vinyl acetate","butadiene","isoprene",
  "caprolactam","bisphenol A","epichlorohydrin","ethylene oxide","propylene oxide",
  "phthalic anhydride","maleic anhydride",
  // Colorants / Natural products
  "indigo","alizarin","beta-carotene","chlorophyll a","lycopene","astaxanthin",
  // Explosives / Propellants
  "nitroglycerin","2,4,6-trinitrotoluene","ammonium perchlorate",
  // Pesticides
  "glyphosate","paraquat","2,4-dichlorophenoxyacetic acid","atrazine",
  "diazinon","malathion","permethrin","deltamethrin",
  // Industrial chemicals
  "hydrogen peroxide","sodium hypochlorite","calcium oxide",
  "potassium permanganate","potassium dichromate","sodium borohydride",
  "hydrazine","sodium azide",
  // Biomolecules
  "ATP","NADH","coenzyme A","glutathione","ubiquinone",
];

// ---- HTTP helpers ----
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        if (res.statusCode === 404) return reject(new Error("NOT_FOUND"));
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        try {
          const parsed = JSON.parse(data);
          if (parsed.Fault) return reject(new Error(`FAULT:${parsed.Fault.Code}`));
          resolve(parsed);
        } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Fetch with exponential backoff on server-busy/rate-limit errors
async function fetchWithRetry(url, maxTries = 5) {
  let lastErr;
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      return await fetchJSON(url);
    } catch (e) {
      lastErr = e;
      const msg = String(e.message || e);
      if (msg.includes("ServerBusy") || msg.includes("Too many") || msg.includes("503")) {
        const wait = Math.min(2000 * Math.pow(2, attempt - 1), 30000);
        process.stderr.write(`    rate-limited (attempt ${attempt}/${maxTries}), waiting ${wait}ms...\n`);
        await sleep(wait);
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

// ---- Main ----
async function main() {
  console.log("🔬 PubChem Single-Name Fetcher v2\n");
  console.log(`Tổng: ${NAMES.length} hợp chất cần lookup\n`);

  const cidMap = new Map(); // name → cid
  let done = 0, failed = 0;

  for (const name of NAMES) {
    const encoded = encodeURIComponent(name);
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encoded}/cids/JSON`;
    try {
      const result = await fetchWithRetry(url);
      const cids = result.IdentifierList?.CID || [];
      if (cids.length > 0) {
        cidMap.set(name, cids[0]);
      } else {
        failed++;
      }
    } catch (e) {
      failed++;
    }
    done++;
    if (done % 30 === 0) process.stderr.write(`  Progress: ${done}/${NAMES.length} (found ${cidMap.size}, failed ${failed})\n`);
    await sleep(350); // stay under PubChem rate limit
  }

  console.log(`\n✅ Name→CID: ${cidMap.size}/${NAMES.length} resolved`);

  // Fetch properties
  const cidToName = new Map();
  for (const [name, cid] of cidMap) {
    if (!cidToName.has(cid)) cidToName.set(cid, name);
  }
  const uniqueCids = [...cidToName.keys()];
  const compounds = [];
  let propDone = 0, propFailed = 0;

  console.log(`\n📊 Fetching properties for ${uniqueCids.length} unique CIDs...\n`);
  const propBatchSize = 20;
  for (let i = 0; i < uniqueCids.length; i += propBatchSize) {
    const batch = uniqueCids.slice(i, i + propBatchSize);
    const cidStr = batch.join(",");
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cidStr}/property/IUPACName,MolecularFormula,MolecularWeight,SMILES/JSON`;
    try {
      const result = await fetchWithRetry(url);
      const props = result.PropertyTable?.Properties || [];
      for (const p of props) {
        const name = cidToName.get(p.CID) || `CID:${p.CID}`;
        compounds.push({
          compound_cid: String(p.CID),
          iupac_name: p.IUPACName || "",
          common_name: name,
          molecular_formula: p.MolecularFormula || "",
          molecular_weight: p.MolecularWeight ? parseFloat(p.MolecularWeight) : null,
          smiles_string: p.SMILES || p.ConnectivitySMILES || "",
          category: "chemistry/pharma",
          note: ""
        });
      }
    } catch (e) {
      propFailed += batch.length;
    }
    propDone += batch.length;
    if (i % 100 === 0) process.stderr.write(`  Props: ${Math.min(i+propBatchSize, uniqueCids.length)}/${uniqueCids.length}\n`);
    await sleep(500);
  }

  console.log(`\n✅ Downloaded: ${compounds.length} compounds`);

  // Categorize
  const catRules = {
    "glycine":"amino-acid","alanine":"amino-acid","valine":"amino-acid","leucine":"amino-acid",
    "isoleucine":"amino-acid","serine":"amino-acid","threonine":"amino-acid","cysteine":"amino-acid",
    "methionine":"amino-acid","proline":"amino-acid","aspartic":"amino-acid","asparagine":"amino-acid",
    "glutamic":"amino-acid","glutamine":"amino-acid","lysine":"amino-acid","arginine":"amino-acid",
    "histidine":"amino-acid","phenylalanine":"amino-acid","tyrosine":"amino-acid","tryptophan":"amino-acid",
    "fructose":"carbohydrate","sucrose":"carbohydrate","lactose":"carbohydrate","maltose":"carbohydrate",
    "ribose":"carbohydrate","galactose":"carbohydrate","mannose":"carbohydrate","xylose":"carbohydrate",
    "retinol":"vitamin","ascorbic":"vitamin","cholecalciferol":"vitamin","tocopherol":"vitamin",
    "phylloquinone":"vitamin","thiamine":"vitamin","riboflavin":"vitamin","nicotinic":"vitamin",
    "pyridoxine":"vitamin","biotin":"vitamin","folic":"vitamin","cyanocobalamin":"vitamin","pantothenic":"vitamin",
    "testosterone":"hormone","estradiol":"hormone","progesterone":"hormone","cortisol":"hormone",
    "aldosterone":"hormone","thyroxine":"hormone",
    "epinephrine":"neurotransmitter","norepinephrine":"neurotransmitter","dopamine":"neurotransmitter",
    "serotonin":"neurotransmitter","melatonin":"neurotransmitter",
    "cocaine":"alkaloid","codeine":"alkaloid","quinine":"alkaloid","atropine":"alkaloid",
    "strychnine":"alkaloid","colchicine":"alkaloid","reserpine":"alkaloid","ephedrine":"alkaloid",
    "theophylline":"alkaloid","theobromine":"alkaloid",
    "tetracycline":"antibiotic","doxycycline":"antibiotic","erythromycin":"antibiotic",
    "clarithromycin":"antibiotic","azithromycin":"antibiotic","streptomycin":"antibiotic",
    "kanamycin":"antibiotic","chloramphenicol":"antibiotic","clindamycin":"antibiotic",
    "sulfamethoxazole":"antibiotic","trimethoprim":"antibiotic",
    "nalidixic":"antibiotic","norfloxacin":"antibiotic","levofloxacin":"antibiotic",
    "moxifloxacin":"antibiotic","metronidazole":"antibiotic","nitrofurantoin":"antibiotic",
    "fosfomycin":"antibiotic",
    "fluconazole":"antifungal","itraconazole":"antifungal","ketoconazole":"antifungal",
    "terbinafine":"antifungal","griseofulvin":"antifungal","flucytosine":"antifungal",
    "acyclovir":"antiviral","ribavirin":"antiviral","lamivudine":"antiviral",
    "tenofovir":"antiviral","efavirenz":"antiviral","lopinavir":"antiviral",
    "ritonavir":"antiviral","remdesivir":"antiviral","sofosbuvir":"antiviral",
    "digoxin":"cardiovascular","captopril":"cardiovascular","enalapril":"cardiovascular",
    "ramipril":"cardiovascular","valsartan":"cardiovascular","telmisartan":"cardiovascular",
    "amlodipine":"cardiovascular","nifedipine":"cardiovascular","verapamil":"cardiovascular",
    "diltiazem":"cardiovascular","hydrochlorothiazide":"cardiovascular","spironolactone":"cardiovascular",
    "clopidogrel":"cardiovascular","apixaban":"cardiovascular","rivaroxaban":"cardiovascular",
    "simvastatin":"cardiovascular","rosuvastatin":"cardiovascular",
    "haloperidol":"psychiatric","chlorpromazine":"psychiatric","clozapine":"psychiatric",
    "olanzapine":"psychiatric","risperidone":"psychiatric","quetiapine":"psychiatric",
    "carbamazepine":"psychiatric","valproic":"psychiatric","lamotrigine":"psychiatric",
    "levetiracetam":"psychiatric","phenytoin":"psychiatric","phenobarbital":"psychiatric",
    "midazolam":"psychiatric","lorazepam":"psychiatric","alprazolam":"psychiatric","zolpidem":"psychiatric",
    "sertraline":"psychiatric","escitalopram":"psychiatric","venlafaxine":"psychiatric",
    "duloxetine":"psychiatric","bupropion":"psychiatric","methylphenidate":"psychiatric",
    "indomethacin":"analgesic","naproxen":"analgesic","ketoprofen":"analgesic","piroxicam":"analgesic",
    "celecoxib":"analgesic",
    "tramadol":"analgesic","fentanyl":"analgesic","methadone":"analgesic",
    "naloxone":"antidote","lidocaine":"anesthetic","bupivacaine":"anesthetic","ketamine":"anesthetic",
    "propofol":"anesthetic",
    "cyclophosphamide":"anticancer","ifosfamide":"anticancer","fluorouracil":"anticancer",
    "capecitabine":"anticancer","gemcitabine":"anticancer","etoposide":"anticancer",
    "irinotecan":"anticancer","vincristine":"anticancer","vinblastine":"anticancer",
    "daunorubicin":"anticancer","epirubicin":"anticancer","erlotinib":"anticancer",
    "gefitinib":"anticancer","sunitinib":"anticancer","sorafenib":"anticancer",
    "dichloromethane":"solvent","chloroform":"solvent","tetrachloromethane":"solvent",
    "diethyl":"solvent","tetrahydrofuran":"solvent","dimethyl sulfoxide":"solvent",
    "dimethylformamide":"solvent","acetonitrile":"solvent","hexane":"solvent",
    "heptane":"solvent","pentane":"solvent","isopropyl":"solvent","butanol":"solvent",
    "glycerol":"solvent","ethylene glycol":"solvent","propylene glycol":"solvent",
    "dioxane":"solvent","pyridine":"solvent","triethylamine":"solvent",
    "sulfuric":"acid","nitric":"acid","phosphoric":"acid","hydrochloric":"acid",
    "hydrofluoric":"acid","boric":"acid","oxalic":"acid","citric":"acid",
    "lactic":"acid","malic":"acid","tartaric":"acid","succinic":"acid",
    "fumaric":"acid","maleic":"acid","phthalic":"acid","terephthalic":"acid","adipic":"acid",
    "sodium hydroxide":"base","potassium hydroxide":"base","calcium hydroxide":"base",
    "sodium bicarbonate":"salt","sodium carbonate":"salt","potassium carbonate":"salt",
    "potassium chloride":"salt","calcium chloride":"salt","magnesium chloride":"salt",
    "aluminium chloride":"salt","iron(II)":"salt","copper(II)":"salt","zinc sulfate":"salt",
    "silver nitrate":"salt","barium sulfate":"salt","calcium carbonate":"salt",
    "calcium sulfate":"salt","sodium nitrate":"salt","potassium nitrate":"salt",
    "ammonium nitrate":"salt","ammonium sulfate":"salt","sodium phosphate":"salt",
    "calcium phosphate":"salt","magnesium oxide":"mineral","zinc oxide":"mineral",
    "titanium dioxide":"mineral","silicon dioxide":"mineral","aluminium oxide":"mineral",
    "iron(III)":"mineral",
    "oxygen":"gas","nitrogen":"gas","hydrogen":"gas","helium":"gas","neon":"gas",
    "argon":"gas","krypton":"gas","xenon":"gas","carbon monoxide":"gas","sulfur dioxide":"gas",
    "nitric oxide":"gas","nitrous oxide":"gas","hydrogen sulfide":"gas","ammonia":"gas",
    "styrene":"monomer","vinyl chloride":"monomer","acrylonitrile":"monomer",
    "methyl methacrylate":"monomer","acrylic acid":"monomer","methacrylic acid":"monomer",
    "vinyl acetate":"monomer","butadiene":"monomer","isoprene":"monomer","caprolactam":"monomer",
    "bisphenol":"monomer","epichlorohydrin":"monomer","ethylene oxide":"monomer",
    "propylene oxide":"monomer","maleic anhydride":"monomer","phthalic anhydride":"monomer",
    "indigo":"colorant","alizarin":"colorant","beta-carotene":"colorant","lycopene":"colorant",
    "astaxanthin":"colorant",
    "nitroglycerin":"explosive","trinitrotoluene":"explosive","ammonium perchlorate":"explosive",
    "glyphosate":"pesticide","paraquat":"pesticide","2,4-dichlorophenoxyacetic":"pesticide",
    "atrazine":"pesticide","diazinon":"pesticide","malathion":"pesticide",
    "permethrin":"pesticide","deltamethrin":"pesticide",
    "hydrogen peroxide":"industrial","sodium hypochlorite":"industrial","calcium oxide":"industrial",
    "potassium permanganate":"industrial","potassium dichromate":"industrial",
    "sodium borohydride":"industrial","hydrazine":"industrial","sodium azide":"industrial",
    "ATP":"biomolecule","glutathione":"biomolecule","ubiquinone":"biomolecule",
    "coenzyme A":"biomolecule",
    "carbon disulfide":"solvent","chlorophyll a":"colorant",
  };

  for (const c of compounds) {
    const nl = c.common_name.toLowerCase();
    for (const [key, cat] of Object.entries(catRules)) {
      if (nl.includes(key)) { c.category = cat; break; }
    }
  }

  // Save
  const outPath = path.join(__dirname, "pubchem-fetched.json");
  fs.writeFileSync(outPath, JSON.stringify(compounds, null, 2));
  console.log(`\n✅ Saved ${compounds.length} compounds → data/pubchem-fetched.json`);
  console.log("  Run: node data/build-data.js to merge into compounds.json");
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });
