import test from "node:test";
import assert from "node:assert/strict";
import { createEnv } from "./helpers/env.mjs";

const { Sci } = createEnv();
const T = Sci.tools;

test("molar mass of common formulas matches IUPAC atomic weights", () => {
  const aspirin = T.parseFormula("C9H8O4");
  assert.ok(Math.abs(aspirin.molarMass - 180.159) < 0.02, `aspirin: ${aspirin.molarMass}`);
  assert.equal(aspirin.composition.C, 9);
  assert.equal(aspirin.atomCount, 21);

  const hydrate = T.parseFormula("CuSO4·5H2O");
  assert.ok(Math.abs(hydrate.molarMass - 249.68) < 0.05, `hydrate: ${hydrate.molarMass}`);
  assert.equal(JSON.stringify(hydrate.hydrates), JSON.stringify([{ body: "H2O", multiplier: 5 }]));

  assert.ok(Math.abs(T.molarMass("Ca(OH)2") - 74.093) < 0.02);
  assert.ok(Math.abs(T.molarMass("Fe2(SO4)3") - 399.88) < 0.05);
  assert.ok(Math.abs(T.molarMass("[Cu(NH3)4]SO4") - 227.73) < 0.05);
});

test("element composition percentages sum to 100", () => {
  const p = T.parseFormula("C6H12O6");
  const sum = p.compositionPercent.reduce((s, c) => s + c.percent, 0);
  assert.ok(Math.abs(sum - 100) < 1e-9);
  const carbon = p.compositionPercent.find((c) => c.element === "C");
  assert.ok(Math.abs(carbon.percent - 40.0) < 0.1);
});

test("exact (monoisotopic) mass is only reported when the data supports it", () => {
  const aspirin = T.parseFormula("C9H8O4");
  assert.ok(Math.abs(aspirin.exactMass - 180.0423) < 0.01);
  const withoutIsotopes = T.parseFormula("BaSO4");
  assert.equal(withoutIsotopes.exactMass, null, "Ba has no monoisotopic entry, so null is correct");
});

test("charges, subscripts and unicode input are normalised", () => {
  assert.equal(T.parseFormula("SO4^2-").charge, -2);
  const ammonium = T.parseFormula("NH4+");
  assert.equal(ammonium.charge, 1);
  assert.equal(ammonium.composition.H, 4, "the 4 in NH4+ is a subscript, not a charge");
  assert.equal(T.parseFormula("C₆H₁₂O₆").composition.C, 6);
  assert.equal(T.parseFormula("Fe³⁺").charge, 3);
  assert.equal(T.parseFormula("SO₄²⁻").charge, -2);
  assert.equal(T.parseFormula("Ca^2+").charge, 2);
});

test("invalid formulas fail loudly instead of returning a guess", () => {
  assert.throws(() => T.parseFormula(""), /Nhập công thức/);
  assert.throws(() => T.parseFormula("Xx2"), /Ký hiệu nguyên tố/);
  assert.throws(() => T.parseFormula("Ca(OH2"), /Thiếu ngoặc|Ngoặc/);
  assert.throws(() => T.parseFormula("c6h12o6"), /chữ in hoa/);
});

test("balancer produces smallest integer coefficients", () => {
  const water = T.balanceEquation("H2 + O2 -> H2O");
  assert.equal(water.ok, true);
  assert.equal(water.coefficients.join(","), "2,1,2");
  assert.equal(water.balanced, "2H2 + O2 → 2H2O");
  for (const c of water.check) assert.equal(c.left, c.right, `element ${c.element}`);

  assert.equal(T.balanceEquation("Fe + O2 -> Fe2O3").coefficients.join(","), "4,3,2");
  assert.equal(T.balanceEquation("C3H8 + O2 -> CO2 + H2O").coefficients.join(","), "1,5,3,4");
  assert.equal(T.balanceEquation("CaCO3 -> CaO + CO2").coefficients.join(","), "1,1,1");
  assert.equal(T.balanceEquation("Al + Fe2O3 -> Al2O3 + Fe").coefficients.join(","), "2,1,1,2");
});

test("balancer reports unusable input rather than inventing coefficients", () => {
  assert.throws(() => T.balanceEquation("H2 + O2 ->"), /Thiếu chất|phản ứng/i);
  assert.throws(() => T.balanceEquation("H2 + O2 -> XxO"), /Xx|Ký hiệu/);
  assert.throws(() => T.balanceEquation("H2 -> O2"), /nghiệm|H2/i, "elements cannot be conserved here");
});

test("stoichiometry helpers are consistent", () => {
  const m = T.mass(1, "NaCl");
  assert.ok(Math.abs(m.molarMass - 58.44) < 0.02);
  assert.ok(Math.abs(m.mass - 58.44) < 0.02);
  const mol = T.moles(58.44, "NaCl");
  assert.ok(Math.abs(mol.n - 1) < 1e-3);
  assert.equal(T.molarity(0.5, 0.25), 2);
  assert.throws(() => T.molarity(1, 0), /Thể tích/);
  assert.equal(T.dilution(1, 10, 0.1, null), 100);
  assert.equal(T.dilution(null, 10, 0.1, 100), 1);
});

test("unit conversion handles metric factors and temperature offsets", () => {
  assert.equal(T.convert(1, "pressure", "atm", "Pa"), 101325);
  assert.ok(Math.abs(T.convert(1, "energy", "kcal", "J") - 4184) < 1e-9);
  assert.ok(Math.abs(T.convert(1, "length", "nm", "Å") - 10) < 1e-9);
  assert.ok(Math.abs(T.convert(0, "temperature", "°C", "K") - 273.15) < 1e-9);
  assert.ok(Math.abs(T.convert(100, "temperature", "°C", "°F") - 212) < 1e-9);
  assert.ok(Math.abs(T.convert(32, "temperature", "°F", "°C")) < 1e-9);
  assert.throws(() => T.convert(1, "length", "kg", "m"), /không nằm trong nhóm/);
  assert.throws(() => T.convert(1, "nope", "a", "b"), /Nhóm đơn vị/);
});

test("template helper escapes data but not nested fragments (regression)", () => {
  const U = Sci.util;
  const inner = U.html`<b>${"<script>"}</b>`;
  assert.equal(String(inner), "<b>&lt;script&gt;</b>");
  const outer = U.html`<div>${inner}</div>`;
  assert.equal(String(outer), "<div><b>&lt;script&gt;</b></div>");
  assert.notEqual(outer[U.RAW], undefined, "nested fragments keep their raw marker");
  const list = U.html`<ul>${[U.html`<li>A</li>`, U.html`<li>B</li>`]}</ul>`;
  assert.equal(String(list), "<ul><li>A</li><li>B</li></ul>");
  const tainted = U.html`<p>${["<img onerror=1>"]}</p>`;
  assert.equal(String(tainted), "<p>&lt;img onerror=1&gt;</p>");
});
