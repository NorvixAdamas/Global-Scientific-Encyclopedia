/* =========================================================================
   Scientific tools: formula parsing, molar mass, elemental composition,
   reaction balancing, stoichiometry, unit conversion.
   Every calculation is deterministic and clearly labelled as computed.
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});

  /* IUPAC 2021 standard atomic weights (g/mol). Values for synthetic elements
     are the mass number of the most stable known isotope. */
  const ATOMIC_WEIGHTS = {
    H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
    F: 18.998, Ne: 20.18, Na: 22.99, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974,
    S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867,
    V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546,
    Zn: 65.38, Ga: 69.723, Ge: 72.63, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
    Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95, Tc: 98,
    Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41, In: 114.82, Sn: 118.71,
    Sb: 121.76, Te: 127.6, I: 126.9, Xe: 131.29, Cs: 132.91, Ba: 137.33, La: 138.91,
    Ce: 140.12, Pr: 140.91, Nd: 144.24, Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25,
    Tb: 158.93, Dy: 162.5, Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05, Lu: 174.97,
    Hf: 178.49, Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08,
    Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209, At: 210, Rn: 222,
    Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03, Np: 237, Pu: 244,
    Am: 243, Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257, Md: 258, No: 259, Lr: 266,
    Rf: 267, Db: 268, Sg: 269, Bh: 270, Hs: 269, Mt: 278, Ds: 281, Rg: 282, Cn: 285,
    Nh: 286, Fl: 289, Mc: 290, Lv: 293, Ts: 294, Og: 294,
  };

  /* Monoisotopic masses for the elements where "exact mass" is meaningful here. */
  const MONOISOTOPIC = {
    H: 1.00782503207, He: 4.00260325415, Li: 7.01600455, B: 11.0093054, C: 12.0,
    N: 14.0030740048, O: 15.9949146196, F: 18.99840322, Na: 22.9897692809,
    Mg: 23.9850417, Al: 26.98153863, Si: 27.9769265325, P: 30.97376163,
    S: 31.972071, Cl: 34.96885268, K: 38.96370668, Ca: 39.96259098, Fe: 55.9349375,
    Cu: 62.9295975, Zn: 63.9291422, Se: 79.9165213, Br: 78.9183371, I: 126.904473,
  };

  const SUBSCRIPT_MAP = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9", "⁻": "-", "⁺": "+" };
  const SUPERSCRIPT_MAP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };

  function normalizeFormula(input) {
    let s = String(input || "").trim();
    /* Superscript digits followed by a superscript sign are a charge, not a
       stoichiometric subscript: Fe³⁺ → Fe^3+, SO₄²⁻ → SO4^2-. */
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+[⁺⁻]/g, (m) =>
      "^" + m.split("").map((c) => SUPERSCRIPT_MAP[c] || c).join("")
    );
    s = s.replace(/[₀-₉]/g, (c) => SUBSCRIPT_MAP[c] || c);
    s = s.replace(/[⁰-⁹]/g, (c) => SUPERSCRIPT_MAP[c] || c);
    s = s.replace(/[⁺⁻]/g, (c) => (c === "⁺" ? "+" : "-"));
    s = s.replace(/[×xX](?=\d*\s*H2O)/g, "·");
    s = s.replace(/[•∙⋅]/g, "·");
    s = s.replace(/\s+/g, "");
    return s;
  }

  /**
   * Parse a formula into { composition, charge, hydrates }.
   * Supports parentheses, brackets, hydrates (CuSO4·5H2O) and trailing charge.
   * Throws { code, message } on invalid input.
   */
  function parseFormula(input) {
    const original = String(input || "");
    let s = normalizeFormula(original);
    if (!s) throw formulaError("empty", "Nhập công thức hóa học, ví dụ: C9H8O4 hoặc CuSO4·5H2O.");

    let charge = 0;
    /* A multi-digit charge needs an explicit caret (SO4^2-) because a trailing
       digit is normally a subscript (NH4+ = ammonium, not N with charge +4). */
    const caretCharge = s.match(/\^(\d*)([+-])$/);
    if (caretCharge) {
      const mag = caretCharge[1] ? Number(caretCharge[1]) : 1;
      charge = caretCharge[2] === "+" ? mag : -mag;
      s = s.slice(0, s.length - caretCharge[0].length);
    } else if (/[+-]$/.test(s)) {
      charge = s.endsWith("+") ? 1 : -1;
      s = s.slice(0, -1);
    }

    const parts = s.split(/[·*]/).filter(Boolean);
    const composition = {};
    const hydrates = [];

    parts.forEach((part, idx) => {
      let multiplier = 1;
      let body = part;
      if (idx > 0) {
        const m = part.match(/^(\d+)(.+)$/);
        if (m) {
          multiplier = Number(m[1]);
          body = m[2];
        }
      }
      const comp = parseGroup(body, original);
      Object.keys(comp).forEach((el) => {
        composition[el] = (composition[el] || 0) + comp[el] * multiplier;
      });
      if (idx > 0) hydrates.push({ body, multiplier });
    });

    const elements = Object.keys(composition);
    if (!elements.length) throw formulaError("empty", "Không tìm thấy nguyên tố nào trong công thức.");
    const unknown = elements.filter((el) => !ATOMIC_WEIGHTS[el]);
    if (unknown.length) throw formulaError("unknown-element", "Ký hiệu nguyên tố không hợp lệ: " + unknown.join(", "));

    const molarMass = elements.reduce((sum, el) => sum + ATOMIC_WEIGHTS[el] * composition[el], 0);
    const canExact = elements.every((el) => MONOISOTOPIC[el]);
    const exactMass = canExact ? elements.reduce((sum, el) => sum + MONOISOTOPIC[el] * composition[el], 0) : null;
    const atomCount = elements.reduce((sum, el) => sum + composition[el], 0);

    return {
      ok: true,
      input: original,
      normalized: s,
      composition,
      elements,
      molarMass,
      exactMass,
      atomCount,
      charge,
      hydrates,
      compositionPercent: elements
        .map((el) => ({
          element: el,
          count: composition[el],
          mass: ATOMIC_WEIGHTS[el] * composition[el],
          percent: ((ATOMIC_WEIGHTS[el] * composition[el]) / molarMass) * 100,
        }))
        .sort((a, b) => b.percent - a.percent),
    };
  }

  function parseGroup(str, original) {
    const composition = {};
    let i = 0;

    function readNumber() {
      let n = "";
      while (i < str.length && /\d/.test(str[i])) n += str[i++];
      return n === "" ? 1 : Number(n);
    }

    function readGroup(closer) {
      const local = {};
      while (i < str.length) {
        const ch = str[i];
        if (closer && ch === closer) {
          i++;
          return local;
        }
        if (ch === "(" || ch === "[") {
          i++;
          const inner = readGroup(ch === "(" ? ")" : "]");
          const mult = readNumber();
          Object.keys(inner).forEach((el) => (local[el] = (local[el] || 0) + inner[el] * mult));
          continue;
        }
        if (ch === ")" || ch === "]") throw formulaError("bracket", `Ngoặc không cân bằng trong "${original}".`);
        if (ch === "·" || ch === "*") break;
        if (/[A-Z]/.test(ch)) {
          let sym = ch;
          i++;
          if (i < str.length && /[a-z]/.test(str[i])) sym += str[i++];
          const mult = readNumber();
          local[sym] = (local[sym] || 0) + mult;
          continue;
        }
        if (/[a-z]/.test(ch)) {
          throw formulaError("lowercase", `Ký hiệu nguyên tố phải bắt đầu bằng chữ in hoa (gặp "${ch}" trong "${original}").`);
        }
        if (ch === " ") {
          i++;
          continue;
        }
        throw formulaError("syntax", `Ký tự không hợp lệ "${ch}" trong "${original}".`);
      }
      if (closer) throw formulaError("bracket", `Thiếu ngoặc đóng "${closer}" trong "${original}".`);
      return local;
    }

    const nested = readGroup(null);
    Object.keys(nested).forEach((el) => (composition[el] = (composition[el] || 0) + nested[el]));
    return composition;
  }

  function formulaError(code, message) {
    const err = new Error(message);
    err.code = code;
    return err;
  }

  /* ---------------- stoichiometry ---------------- */

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  /** Solve the null space of A (m×n) with Gauss–Jordan elimination. */
  function nullSpace(matrix, n) {
    const m = matrix.length;
    const A = matrix.map((row) => row.slice());
    const pivots = [];
    let row = 0;
    for (let col = 0; col < n && row < m; col++) {
      let best = row;
      for (let r = row + 1; r < m; r++) if (Math.abs(A[r][col]) > Math.abs(A[best][col])) best = r;
      if (Math.abs(A[best][col]) < 1e-10) continue;
      [A[row], A[best]] = [A[best], A[row]];
      const pv = A[row][col];
      for (let c = 0; c < n; c++) A[row][c] /= pv;
      for (let r = 0; r < m; r++) {
        if (r === row) continue;
        const f = A[r][col];
        if (Math.abs(f) < 1e-12) continue;
        for (let c = 0; c < n; c++) A[r][c] -= f * A[row][c];
      }
      pivots.push(col);
      row++;
    }
    const free = [];
    for (let c = 0; c < n; c++) if (!pivots.includes(c)) free.push(c);
    if (!free.length) return null;
    return free.map((f) => {
      const vec = new Array(n).fill(0);
      vec[f] = 1;
      pivots.forEach((p, r) => (vec[p] = -A[r][f]));
      return vec;
    });
  }

  function rationalize(x, maxDen) {
    maxDen = maxDen || 1000;
    let bestN = 1;
    let bestD = 1;
    let bestErr = Infinity;
    for (let d = 1; d <= maxDen; d++) {
      const n = Math.round(x * d);
      const err = Math.abs(x - n / d);
      if (err < bestErr - 1e-12) {
        bestErr = err;
        bestN = n;
        bestD = d;
        if (err < 1e-9) break;
      }
    }
    return { n: bestN, d: bestD, err: bestErr };
  }

  function splitSide(side) {
    /* '+' is a separator only when surrounded by whitespace; charges stay intact. */
    if (/\s\+\s/.test(side)) return side.split(/\s+\+\s+/).map((s) => s.trim()).filter(Boolean);
    return [side.trim()].filter(Boolean);
  }

  function parseEquation(input) {
    const s = String(input || "").trim();
    const m = s.split(/\s*(?:->|→|=>|=)\s*/);
    if (m.length < 2) throw formulaError("equation", "Phương trình cần dạng: 'A + B -> C + D'.");
    const left = splitSide(m[0]);
    const right = splitSide(m.slice(1).join(" -> "));
    if (!left.length || !right.length) throw formulaError("equation", "Thiếu chất phản ứng hoặc sản phẩm.");
    return { left, right };
  }

  function stripCoefficient(species) {
    const m = String(species).match(/^(\d+(?:[.,]\d+)?)\s*(.+)$/);
    if (m) return { coeff: Number(m[1].replace(",", ".")), formula: m[2].trim() };
    return { coeff: null, formula: species.trim() };
  }

  function balanceEquation(input) {
    const parsed = parseEquation(input);
    const left = parsed.left.map(stripCoefficient);
    const right = parsed.right.map(stripCoefficient);
    const species = left.concat(right);
    const formulas = species.map((s) => {
      try {
        return parseFormula(s.formula);
      } catch (e) {
        throw formulaError("parse", `Không đọc được "${s.formula}": ${e.message}`);
      }
    });
    const elements = [];
    formulas.forEach((f) => f.elements.forEach((el) => elements.includes(el) || elements.push(el)));

    const n = species.length;
    const matrix = elements.map((el) =>
      formulas.map((f, idx) => {
        const count = f.composition[el] || 0;
        return idx < left.length ? count : -count;
      })
    );

    const basis = nullSpace(matrix, n);
    if (!basis) throw formulaError("nonsolvable", "Không tìm được nghiệm khác 0 — kiểm tra lại các chất.");
    if (basis.length > 1) {
      return {
        ok: false,
        code: "ambiguous",
        message: "Phương trình có nhiều nghiệm độc lập (có thể là phản ứng song song hoặc redox chưa cân bằng electron).",
        elements,
      };
    }
    const vec = basis[0];
    const rational = vec.map((x) => rationalize(x, 200));
    const bad = rational.find((r) => r.err > 1e-6);
    if (bad) throw formulaError("numeric", "Không chuyển được nghiệm sang hệ số nguyên.");

    let L = 1;
    rational.forEach((r) => (L = lcm(L, r.d)));
    let coeffs = rational.map((r) => (r.n * L) / r.d);
    const allInts = coeffs.every((c) => Math.abs(c - Math.round(c)) < 1e-6);
    coeffs = coeffs.map((c) => Math.round(c));
    if (!allInts) throw formulaError("numeric", "Hệ số không nguyên — kiểm tra lại công thức.");
    const divisor = coeffs.reduce((g, c) => gcd(g, c), 0) || 1;
    coeffs = coeffs.map((c) => c / divisor);

    if (coeffs.some((c) => c <= 0)) {
      return {
        ok: false,
        code: "direction",
        message: "Nghiệm cho hệ số âm/không: các chất hai vế có thể bị đặt sai phía (hoặc phản ứng cần đảo chiều).",
      };
    }

    const fmtSide = (arr, offset) =>
      arr
        .map((sp, i) => {
          const c = coeffs[offset + i];
          const prefix = c === 1 ? "" : c;
          return prefix + sp.formula;
        })
        .join(" + ");

    return {
      ok: true,
      input,
      left,
      right,
      coefficients: coeffs,
      elements,
      balanced: `${fmtSide(left, 0)} → ${fmtSide(right, left.length)}`,
      species: species.map((sp, i) => ({
        formula: sp.formula,
        coefficient: coeffs[i],
        side: i < left.length ? "reactant" : "product",
        molarMass: formulas[i].molarMass,
      })),
      check: elements.map((el) => ({
        element: el,
        left: formulas.slice(0, left.length).reduce((s, f, i) => s + (f.composition[el] || 0) * coeffs[i], 0),
        right: formulas.slice(left.length).reduce((s, f, i) => s + (f.composition[el] || 0) * coeffs[left.length + i], 0),
      })),
    };
  }

  /* ---------------- stoichiometry helpers ---------------- */

  function moles(massG, formula) {
    const f = parseFormula(formula);
    return { n: massG / f.molarMass, molarMass: f.molarMass };
  }

  function mass(nMol, formula) {
    const f = parseFormula(formula);
    return { mass: nMol * f.molarMass, molarMass: f.molarMass };
  }

  function molarity(nMol, volumeL) {
    if (!volumeL) throw formulaError("volume", "Thể tích phải lớn hơn 0.");
    return nMol / volumeL;
  }

  function dilution(c1, v1, c2, v2) {
    /* returns the missing quantity; pass three, get the fourth */
    if (c1 == null) return (c2 * v2) / v1;
    if (v1 == null) return (c2 * v2) / c1;
    if (c2 == null) return (c1 * v1) / v2;
    if (v2 == null) return (c1 * v1) / c2;
    return null;
  }

  /* ---------------- unit conversion ---------------- */

  const UNITS = {
    amount: { label: "Lượng chất", base: "mol", units: { mol: 1, mmol: 1e-3, "µmol": 1e-6, nmol: 1e-9, kmol: 1e3 } },
    mass: { label: "Khối lượng", base: "g", units: { g: 1, mg: 1e-3, "µg": 1e-6, ng: 1e-9, kg: 1e3, u: 1.66053906660e-24, Da: 1.66053906660e-24 } },
    volume: { label: "Thể tích", base: "L", units: { L: 1, mL: 1e-3, "µL": 1e-6, "cm³": 1e-3, "dm³": 1, "m³": 1000 } },
    concentration: { label: "Nồng độ mol", base: "mol/L", units: { "mol/L": 1, mM: 1e-3, "µmol/L": 1e-6, "nmol/L": 1e-9, "mol/m³": 1e-3 } },
    pressure: { label: "Áp suất", base: "Pa", units: { Pa: 1, kPa: 1e3, MPa: 1e6, bar: 1e5, atm: 101325, mmHg: 133.322387415, psi: 6894.757293168 } },
    energy: { label: "Năng lượng", base: "J", units: { J: 1, kJ: 1e3, MJ: 1e6, cal: 4.184, kcal: 4184, eV: 1.602176634e-19, kWh: 3.6e6, "hartree": 4.3597447222071e-18 } },
    length: { label: "Độ dài", base: "m", units: { m: 1, cm: 1e-2, mm: 1e-3, "µm": 1e-6, nm: 1e-9, Å: 1e-10, pm: 1e-12 } },
    temperature: { label: "Nhiệt độ", base: "K", special: true, units: { K: 1, "°C": 1, "°F": 1 } },
  };

  function convertTemperature(value, from, to) {
    let k;
    if (from === "K") k = value;
    else if (from === "°C") k = value + 273.15;
    else if (from === "°F") k = (value - 32) * (5 / 9) + 273.15;
    else throw formulaError("unit", "Đơn vị nhiệt độ không hợp lệ.");
    if (to === "K") return k;
    if (to === "°C") return k - 273.15;
    if (to === "°F") return (k - 273.15) * (9 / 5) + 32;
    throw formulaError("unit", "Đơn vị nhiệt độ không hợp lệ.");
  }

  function convert(value, category, from, to) {
    const cat = UNITS[category];
    if (!cat) throw formulaError("unit", "Nhóm đơn vị không tồn tại.");
    if (!(from in cat.units) || !(to in cat.units)) throw formulaError("unit", "Đơn vị không nằm trong nhóm " + cat.label + ".");
    if (cat.special) return convertTemperature(value, from, to);
    return (value * cat.units[from]) / cat.units[to];
  }

  /* ---------------- periodic helpers ---------------- */

  function elementsInFormula(formula) {
    try {
      return parseFormula(formula).elements;
    } catch (e) {
      return [];
    }
  }

  function molarMass(formula) {
    return parseFormula(formula).molarMass;
  }

  Sci.tools = {
    ATOMIC_WEIGHTS,
    MONOISOTOPIC,
    normalizeFormula,
    parseFormula,
    balanceEquation,
    parseEquation,
    moles,
    mass,
    molarity,
    dilution,
    convert,
    convertTemperature,
    UNITS,
    elementsInFormula,
    molarMass,
  };
})(typeof window !== "undefined" ? window : globalThis);
