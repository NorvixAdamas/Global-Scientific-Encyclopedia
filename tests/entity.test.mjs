import test from "node:test";
import assert from "node:assert/strict";
import { createEnv } from "./helpers/env.mjs";

const { Sci } = createEnv();
const E = Sci.entity;

const ASPIRIN_KEY = "BSYNRYMUTXBXSQ-UHFFFAOYSA-N";

test("canonical ids prefer strong structural identifiers", () => {
  assert.equal(E.canonicalKey("compound", { cid: 2244, inchikey: ASPIRIN_KEY }), "inchikey:" + ASPIRIN_KEY);
  assert.equal(E.canonicalKey("compound", { cid: 2244, name: "aspirin" }), "pubchem:2244");
  assert.equal(E.canonicalKey("compound", { chebi: "CHEBI:15377" }), "chebi:15377");
  assert.equal(E.canonicalKey("compound", { name: "aspirin" }), null, "a name is never a canonical id");
  assert.equal(E.canonicalKey("element", { z: 6 }), "element:6");
});

test("sameSubstance merges on identifiers, never on display names", () => {
  assert.equal(E.sameSubstance({ identifiers: { inchikey: ASPIRIN_KEY } }, { identifiers: { inchikey: ASPIRIN_KEY } }), true);
  assert.equal(E.sameSubstance({ identifiers: { cid: 2244 } }, { identifiers: { cid: "2244" } }), true);
  assert.equal(E.sameSubstance({ identifiers: { chebi: "CHEBI:15377" } }, { identifiers: { chebi: "15377" } }), true);
  assert.equal(
    E.sameSubstance(
      { identifiers: { inchikey: ASPIRIN_KEY }, title: "Aspirin" },
      { identifiers: { inchikey: "WYURNTSHIVDZCO-UHFFFAOYSA-N" }, title: "Aspirin" }
    ),
    false,
    "same name + different InChIKey must NOT be merged"
  );
  assert.equal(E.sameSubstance({ identifiers: { name: "aspirin" } }, { identifiers: { name: "aspirin" } }), false);
});

test("record() keeps every provenance entry with licence and data type", () => {
  const rec = E.record({
    kind: "compound",
    title: "Aspirin",
    identifiers: { cid: 2244, inchikey: ASPIRIN_KEY },
    properties: [{ name: "Khối lượng mol", value: 180.16, unit: "g/mol", source: "pubchem", kind: "experimental" }],
    provenance: [
      { source: "pubchem", recordId: 2244, license: "Public domain", dataType: "experimental", url: "https://pubchem.ncbi.nlm.nih.gov/compound/2244" },
      { source: "chebi", recordId: "CHEBI:15365", license: "CC BY 4.0", dataType: "curated" },
    ],
  });
  assert.equal(rec.id, "inchikey:" + ASPIRIN_KEY);
  assert.equal(rec.provenance.length, 2);
  assert.equal(rec.provenance[0].source, "pubchem");
  assert.equal(rec.provenance[1].license, "CC BY 4.0");
  assert.ok(rec.provenance[0].retrievedAt, "retrieval time is always recorded");
  assert.equal(rec.properties[0].unit, "g/mol");
});

test("merge keeps provenance and conflicting values side by side", () => {
  const a = E.record({
    kind: "compound",
    title: "Aspirin",
    identifiers: { cid: 2244, inchikey: ASPIRIN_KEY },
    properties: [{ name: "Điểm nóng chảy", value: 136, unit: "°C", source: "pubchem", conditions: "sealed tube" }],
    provenance: [{ source: "pubchem", recordId: 2244, license: "Public domain" }],
  });
  const b = E.record({
    kind: "compound",
    title: "Acetylsalicylic acid",
    identifiers: { chebi: "CHEBI:15365", inchikey: ASPIRIN_KEY },
    properties: [
      { name: "Điểm nóng chảy", value: 135, unit: "°C", source: "chebi", conditions: "reported value" },
      { name: "Công thức", value: "C9H8O4", source: "chebi" },
    ],
    provenance: [{ source: "chebi", recordId: "CHEBI:15365", license: "CC BY 4.0" }],
  });
  E.merge(a, b);
  assert.equal(a.identifiers.chebi, "CHEBI:15365");
  assert.equal(a.provenance.length, 2, "both sources stay attributed");
  assert.equal(a.properties.length, 3);
  const melting = E.groupProperties(a.properties).find((g) => /nóng chảy/i.test(g.name));
  assert.equal(melting.values.length, 2);
  assert.equal(E.hasConflict(melting), true, "136 vs 135 °C is a conflict, not an average");
});

test("groupProperties matches names case- and accent-insensitively", () => {
  const groups = E.groupProperties([
    { name: "Molecular Weight", value: 180.16, unit: "g/mol", source: "pubchem" },
    { name: "molecular weight", value: 180.16, unit: "g/mol", source: "chembl" },
    { name: "Molecular Weight", value: 180.16, unit: "g/mol", source: "pubchem" },
  ]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].values.length, 2, "exact duplicates from the same source collapse");
  assert.equal(E.hasConflict(groups[0]), false, "same value from different sources is not a conflict");
});

test("conflicts are detected across values and units", () => {
  const byValue = { values: [{ value: 1, unit: "g/mol", source: "a" }, { value: 2, unit: "g/mol", source: "b" }] };
  const byUnit = { values: [{ value: 1, unit: "g/mol", source: "a" }, { value: 1, unit: "kg/mol", source: "b" }] };
  assert.equal(E.hasConflict(byValue), true);
  assert.equal(E.hasConflict(byUnit), true);
  assert.equal(E.hasConflict({ values: [{ value: 1, unit: "g", source: "a" }] }), false);
});

test("xref labels cover the identifiers the UI can display", () => {
  const refs = E.xrefs({ cid: "2244", chebi: "CHEBI:15365", inchikey: ASPIRIN_KEY, unknown_id: "x" });
  assert.equal(refs.map((r) => r.label).join("|"), "PubChem CID|ChEBI|InChIKey");
  assert.equal(E.xrefs({}).length, 0);
});
