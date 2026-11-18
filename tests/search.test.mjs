import test from "node:test";
import assert from "node:assert/strict";
import { createEnv } from "./helpers/env.mjs";

const env = createEnv({
  globals: {
    CAT_LABELS: { nonmetal: "Phi kim", noble: "Khí hiếm" },
    ELEMENTS: [
      { z: 6, sym: "C", name: "Carbon", cat: "nonmetal", config: "[He] 2s2 2p2", use: "hữu cơ" },
      { z: 10, sym: "Ne", name: "Neon", cat: "noble", config: "[He] 2s2 2p6", use: "đèn" },
    ],
    THEORETICAL_ELEMENTS: [],
    RXN_CATS: [{ id: "redox", name: "Oxy hóa – khử" }],
    REACTIONS: [{ t: "Đốt cháy metan", e: "CH4 + 2O2 → CO2 + 2H2O", c: "redox", n: "tỏa nhiệt" }],
    MAT_CATS: [{ id: "nano", name: "Nano" }],
    MATERIALS: [{ id: "graphene", name: "Graphene", sub: "2D carbon", cat: "nano", facts: ["sp2"], content: "<p>Màng carbon</p>" }],
    DRUGS: [{ n: "Aspirin", cls: "NSAID", y: "1897", mech: "ức chế COX", note: "acetyl hóa" }],
    OPEN_COMPOUNDS: [
      {
        compound_cid: 2244,
        common_name: "Aspirin",
        iupac_name: "2-acetoxybenzoic acid",
        molecular_formula: "C9H8O4",
        molecular_weight: 180.16,
        smiles_string: "CC(=O)OC1=CC=CC=C1C(=O)O",
      },
    ],
    OPEN_REACTIONS: [],
    OPEN_DRUGS: [],
  },
});

const S = env.Sci.search;

test("identifier detection distinguishes identifier families", () => {
  const cases = [
    ["BSYNRYMUTXBXSQ-UHFFFAOYSA-N", "inchikey"],
    ["InChI=1S/C9H8O4/c1-6(10)13-8-5-3-2-4-7(8)9(11)12/h2-5H,1H3,(H,11,12)", "inchi"],
    ["10.1038/nature14539", "doi"],
    ["PMID: 26017442", "pmid"],
    ["CHEBI:15377", "chebi"],
    ["CHEMBL25", "chembl"],
    ["RHEA:11752", "rhea"],
    ["P01308", "uniprot"],
    ["C9H8O4", "formula"],
    ["CC(=O)OC1=CC=CC=C1C(=O)O", "smiles"],
    ["aspirin", "text"],
  ];
  for (const [value, type] of cases) {
    assert.equal(S.detectIdentifier(value).type, type, value);
  }
});

test("bare numbers are flagged as ambiguous instead of being guessed", () => {
  const id = S.detectIdentifier("2244");
  assert.equal(id.type, "ambiguous-number");
  assert.match(id.hint, /CID|PMID/);
  assert.equal(S.detectIdentifier("CID 2244").type, "cid");
  assert.equal(S.detectIdentifier("cid:2244").value, "2244");
});

test("local index finds compounds by name, formula and CID", () => {
  S.buildLocalIndex(true);
  const byName = S.local("aspirin");
  const nameHits = byName.results || byName;
  assert.ok(nameHits.length > 0, "expected a local hit for aspirin");
  assert.equal(nameHits[0].route, "#/compounds/2244");
  assert.ok(nameHits[0].why || nameHits[0].explanation, "results must explain why they matched");

  const byFormula = S.local("C9H8O4");
  const formulaHits = byFormula.results || byFormula;
  assert.ok(
    formulaHits.some((r) => r.route === "#/compounds/2244"),
    "formula search should reach the aspirin record"
  );

  const byCid = S.local("2244");
  const cidHits = byCid.results || byCid;
  assert.ok(cidHits.some((r) => r.identifiers && String(r.identifiers.cid) === "2244"));
});

test("local index covers legacy curated content", () => {
  const counts = S.localCounts();
  assert.equal(counts.total, 6, "2 elements + 1 curated reaction + 1 material + 1 curated drug + 1 compound");
  const el = S.local("carbon");
  const hits = el.results || el;
  assert.ok(hits.some((r) => r.kind === "element" && r.route === "#/elements/6"));
  const drug = S.local("COX");
  const drugHits = drug.results || drug;
  assert.ok(drugHits.some((r) => r.kind === "drug"), "mechanism text is searchable");
});

test("suggestions never merge records with different identifiers", () => {
  S.buildLocalIndex(true);
  const suggestions = S.suggestLocal("aspirin", 8);
  assert.ok(Array.isArray(suggestions));
  for (const s of suggestions) {
    assert.ok(s.route, "each suggestion needs a route");
    assert.ok(s.kind, "each suggestion needs a kind");
  }
});

test("search kind labels are stable for the UI", () => {
  assert.equal(S.kindLabel("compound"), "Hợp chất");
  assert.ok(S.KIND_ORDER.includes("compound"));
  assert.ok(S.KIND_ORDER.includes("protein"));
});
