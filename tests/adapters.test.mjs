import test from "node:test";
import assert from "node:assert/strict";
import { createEnv } from "./helpers/env.mjs";

const ASPIRIN_KEY = "BSYNRYMUTXBXSQ-UHFFFAOYSA-N";

const PUBCHEM_PROPS = {
  PropertyTable: {
    Properties: [
      {
        CID: 2244,
        MolecularFormula: "C9H8O4",
        MolecularWeight: "180.16",
        IUPACName: "2-acetoxybenzoic acid",
        CanonicalSMILES: "CC(=O)OC1=CC=CC=C1C(=O)O",
        InChIKey: ASPIRIN_KEY,
        XLogP: 1.2,
        HBondDonorCount: 1,
        HBondAcceptorCount: 4,
        TPSA: 63.6,
      },
    ],
  },
};

function makeEnv() {
  const env = createEnv();
  const calls = [];
  env.Sci.net.getJSON = async (url) => {
    calls.push(url);
    const u = String(url);
    if (u.includes("pubchem") && u.includes("synonym")) {
      return { InformationList: { Information: [{ CID: 2244, Synonym: ["Aspirin", "Acetylsalicylic acid"] }] } };
    }
    if (u.includes("pubchem") && u.includes("pug_view")) return { Record: { RecordNumber: 2244, Section: [] } };
    if (u.includes("pubchem")) return PUBCHEM_PROPS;
    if (u.includes("chebi") && u.includes("es_search")) {
      return { hits: { hits: [{ _source: { chebi_accession: "CHEBI:15377", name: "water" } }] } };
    }
    if (u.includes("chebi")) {
      return {
        chebi_accession: "CHEBI:15377",
        name: "water",
        definition: "An oxygen hydride consisting of an oxygen atom and two hydrogen atoms.",
        stars: "3",
        names: [{ type: "SYNONYM", name: "H2O" }],
        chemical_data: [],
        database_accessions: [{ database_accession: "PMID:12345", database_name: "PubMed" }],
        ontology_relations: [],
        default_structure: { smiles: "O", inchi: "InChI=1S/H2O/h1H2" },
      };
    }
    if (u.includes("chembl") && u.includes("molecule")) {
      return {
        molecule_chembl_id: "CHEMBL25",
        pref_name: "ASPIRIN",
        max_phase: 4,
        molecule_properties: {
          full_molformula: "C9H8O4",
          full_mwt: "180.16",
          alogp: "1.19",
          hba: 4,
          hbd: 1,
          psa: "63.60",
          qed_weighted: "0.55",
        },
        molecule_structures: { standard_inchi_key: ASPIRIN_KEY, canonical_smiles: "CC(=O)OC1=CC=CC=C1C(=O)O" },
        molecule_synonyms: [{ molecule_synonym: "Aspirin" }],
        cross_references: [{ xref_id: "2244", xref_src: "PubChem" }],
      };
    }
    if (u.includes("uniprot")) {
      const entry = {
        primaryAccession: "P01308",
        uniProtkbId: "INS_HUMAN",
        proteinDescription: { recommendedName: { fullName: { value: "Insulin" } } },
        organism: { scientificName: "Homo sapiens" },
        sequence: { value: "MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKT", length: 110, molWeight: 11981 },
        keywords: [{ name: "Hormone" }],
        uniProtKBCrossReferences: [
          { database: "PDB", id: "4INS" },
          { database: "Rhea", id: "RHEA:11752", properties: [{ key: "Rhea ID", value: "RHEA:11752" }] },
        ],
        proteinExistence: "1: Evidence at protein level",
        annotationScore: 5,
        comments: [],
      };
      /* The adapter queries /uniprotkb/search, which wraps entries in results[]. */
      return { results: [entry] };
    }
    if (u.includes("rxnav")) {
      return {
        drugGroup: {
          conceptGroup: [
            {
              tty: "IN",
              conceptProperties: [{ rxcui: "1191", name: "aspirin", synonym: "Aspirin", tty: "IN" }],
            },
          ],
        },
      };
    }
    if (u.includes("fda.gov")) {
      return {
        results: [
          {
            openfda: { brand_name: ["Aspirin"], generic_name: ["aspirin"], product_ndc: ["1234-5678"] },
            indications_and_usage: ["Pain relief."],
            boxed_warning: ["Test boxed warning."],
            dosage_and_administration: ["325 mg every 4 hours."],
            contraindications: ["Active bleeding."],
            warnings: ["Gastrointestinal bleeding."],
            adverse_reactions: ["Dyspepsia."],
            drug_interactions: ["Anticoagulants."],
            effective_time: "20200101",
            spl_id: "abc-123",
          },
        ],
      };
    }
    if (u.includes("europepmc")) {
      return {
        resultList: {
          result: [
            {
              id: "26017442",
              pmid: "26017442",
              doi: "10.1038/nature14539",
              title: "Aspirin and colorectal cancer",
              authorString: "Doe J, Roe R.",
              journalTitle: "Nature",
              pubYear: "2015",
              abstractText: "An abstract.",
              isOpenAccess: "Y",
              citedByCount: 10,
            },
          ],
        },
      };
    }
    throw new Error("unexpected URL in fixture: " + u);
  };
  env.Sci.net.getText = async () =>
    "Reaction identifier\tEquation\tChEBI identifier\tEC number\tEnzymes\tPubMed\n" +
    "RHEA:11752\tA + B = C\tCHEBI:15377\t1.1.1.1\tP01308\t12345\n";
  return { env, calls };
}

test("PubChem records carry identifiers, properties and licence provenance", async () => {
  const { env } = makeEnv();
  const rec = await env.Sci.adapters.pubchem.compound(2244);
  assert.equal(String(rec.identifiers.cid), "2244");
  assert.equal(rec.identifiers.inchikey, ASPIRIN_KEY);
  assert.match(rec.title, /aspirin|acetoxy/i);
  assert.ok(rec.properties.length >= 3, "molecular properties should be mapped");
  const prov = rec.provenance.find((p) => p.source === "pubchem");
  assert.ok(prov, "PubChem provenance is mandatory");
  assert.ok(prov.license && prov.dataType, "every provenance row carries licence + data type");
  assert.ok(prov.url && prov.recordId, "every provenance row carries a record id and url");
});

test("ChEBI entity maps the accession and keeps its own provenance", async () => {
  const { env } = makeEnv();
  const rec = await env.Sci.adapters.chebi.entity("15377");
  assert.equal(String(rec.identifiers.chebi).replace(/\D/g, ""), "15377");
  assert.match(rec.title, /water/i);
  const prov = rec.provenance.find((p) => p.source === "chebi");
  assert.ok(prov && /CC BY/i.test(prov.license));
});

test("ChEMBL molecule maps structure, properties and provenance", async () => {
  const { env } = makeEnv();
  const rec = await env.Sci.adapters.chembl.molecule("CHEMBL25");
  assert.equal(rec.identifiers.chembl, "CHEMBL25");
  assert.equal(rec.identifiers.inchikey, ASPIRIN_KEY);
  assert.ok(rec.properties.some((p) => /phân tử khối|khối lượng|weight|mw/i.test(p.name)));
  const prov = rec.provenance.find((p) => p.source === "chembl");
  assert.ok(prov && /CC BY-SA/i.test(prov.license));
});

test("Rhea TSV parsing keeps the reaction equation and enzyme links", async () => {
  const { env } = makeEnv();
  const hits = await env.Sci.adapters.rhea.search("water");
  assert.ok(Array.isArray(hits) && hits.length === 1);
  const hit = hits[0];
  assert.equal(String(hit.identifiers.rhea).replace(/\D/g, ""), "11752");
  assert.ok(JSON.stringify(hit).includes("A + B"), "equation should survive parsing");
  assert.ok(JSON.stringify(hit).includes("P01308") || JSON.stringify(hit).includes("1.1.1.1"), "enzyme/EC links should survive");
});

test("UniProt entry maps accession, sequence and cross-references", async () => {
  const { env } = makeEnv();
  const rec = await env.Sci.adapters.uniprot.entry("P01308");
  assert.equal(rec.identifiers.uniprot, "P01308");
  assert.match(rec.title, /insulin/i);
  assert.ok(rec.extra.sequence && rec.extra.sequence.length > 20);
  assert.ok((rec.extra.pdb || []).includes("4INS"));
  assert.ok((rec.extra.rhea || []).length >= 1, "Rhea cross-references are extracted");
});

test("RxNorm maps RxCUI and never invents a concept", async () => {
  const { env } = makeEnv();
  const rec = await env.Sci.adapters.rxnorm.record("aspirin");
  assert.equal(rec.identifiers.rxcui, "1191");
  assert.match(rec.title, /aspirin/i);
  const prov = rec.provenance.find((p) => p.source === "rxnorm");
  assert.ok(prov && /UMLS|NLM/i.test(prov.license));
});

test("openFDA label parsing preserves the original warning text", () => {
  const { env } = makeEnv();
  const rec = env.Sci.adapters.openfda.parse({
    openfda: { brand_name: ["Aspirin"], generic_name: ["aspirin"] },
    boxed_warning: ["Test boxed warning."],
    indications_and_usage: ["Pain relief."],
  });
  assert.match(rec.title, /aspirin/i);
  assert.equal(rec.extra.boxedWarning, "Test boxed warning.");
  const prov = rec.provenance.find((p) => p.source === "openfda");
  assert.ok(prov && /Public domain/i.test(prov.license));
});

test("Europe PMC search returns publication records with DOI provenance", async () => {
  const { env } = makeEnv();
  const hits = await env.Sci.adapters.literature.search("aspirin", { max: 3 });
  assert.ok(hits.length === 1);
  assert.equal(hits[0].identifiers.doi, "10.1038/nature14539");
  assert.equal(hits[0].identifiers.pmid, "26017442");
  assert.ok(hits[0].route.startsWith("#/literature/"));
});

test("openFDA NOT_FOUND means 'no label', not an error", async () => {
  const { env } = makeEnv();
  env.Sci.net.getJSON = async () => {
    const err = new Error("Máy chủ trả về HTTP 404");
    err.status = 404;
    throw err;
  };
  assert.equal((await env.Sci.adapters.openfda.labels("not-a-real-drug")).length, 0);
  assert.equal(await env.Sci.adapters.openfda.eventCount("not-a-real-drug"), null);
  assert.equal((await env.Sci.adapters.openfda.recalls("not-a-real-drug")).length, 0);
});

test("adapters fail loudly rather than fabricating a record", async () => {
  const { env } = makeEnv();
  env.Sci.net.getJSON = async () => {
    throw new Error("upstream down");
  };
  await assert.rejects(() => env.Sci.adapters.pubchem.compound(999999));
  await assert.rejects(() => env.Sci.adapters.uniprot.entry("Q99999"));
});
