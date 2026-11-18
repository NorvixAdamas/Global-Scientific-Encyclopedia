/**
 * Static integrity check for the no-build site.
 * Verifies that every referenced asset exists, that the legacy DOM contracts
 * the v1 scripts depend on are still present, that all JavaScript parses, and
 * that JSON data files are valid.
 *
 * Run: node scripts/check.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const problems = [];
const notes = [];
const ok = (msg) => notes.push("ok   " + msg);
const bad = (msg) => problems.push("FAIL " + msg);

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));

/* ---------- 1. HTML ---------- */
const htmlPath = "index.html";
if (!exists(htmlPath)) {
  bad("index.html is missing");
} else {
  const html = read(htmlPath);

  const cssRefs = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map((m) => m[1]);
  for (const href of new Set(cssRefs)) {
    if (!exists(href)) bad(`missing stylesheet: ${href}`);
  }
  ok(`${new Set(cssRefs).size} stylesheets referenced and present`);

  const scriptRefs = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const src of scriptRefs) {
    if (!exists(src)) bad(`missing script: ${src}`);
    if (seen.has(src)) bad(`script included twice: ${src}`);
    seen.add(src);
  }
  ok(`${scriptRefs.length} scripts referenced, unique and present`);

  const v2 = ["js/app.js", "js/core/registry.js", "js/core/search.js", "js/views/atlas.js", "js/views/pharma.js"];
  for (const s of v2) if (!seen.has(s)) bad(`V2 script not loaded: ${s}`);

  const appIndex = scriptRefs.indexOf("js/app.js");
  const mainIndex = scriptRefs.indexOf("js/main.js");
  if (appIndex !== -1 && mainIndex !== -1 && appIndex < mainIndex) bad("js/app.js must load after the legacy scripts");

  const requiredIds = [
    "viewRoot",
    "legacyRoot",
    "siteHeader",
    "siteFooter",
    "searchDialog",
    "themeToggle",
    "globalSearch",
    "searchHint",
    "tuan-hoan",
    "phan-ung",
    "vat-lieu-moi",
    "y-duoc",
    "chuyen-sau",
    "du-lieu-mo",
    "kien-thuc",
  ];
  for (const id of requiredIds) {
    if (!new RegExp(`id="${id}"`).test(html)) bad(`required element id lost from the shell: #${id}`);
  }
  ok(`${requiredIds.length} required ids present (legacy contract preserved)`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) bad(`duplicate element ids: ${[...new Set(dupes)].join(", ")}`);
  else ok(`${ids.length} element ids are unique`);

  if (!/id="legacyRoot"[^>]*hidden/.test(html)) bad("legacyRoot should start hidden to avoid a flash of v1 UI");
  if (!/<noscript>/.test(html)) bad("missing <noscript> notice");
}

/* ---------- 2. JavaScript syntax ---------- */
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else if (entry.name.endsWith(".js")) out.push(rel);
  }
  return out;
}
const jsFiles = walk("js").concat(walk("data"), walk("scripts").filter((f) => f.endsWith(".mjs")));
let checked = 0;
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ["--check", path.join(root, file)], { stdio: "pipe" });
    checked++;
  } catch (e) {
    bad(`syntax error in ${file}: ${String(e.stderr || e.message).split("\n")[0]}`);
  }
}
ok(`${checked}/${jsFiles.length} JavaScript files parse`);

/* top-level await is invalid in classic scripts */
for (const file of walk("js")) {
  const code = read(file);
  if (/^await\s/m.test(code) && !/type="module"/.test(read("index.html"))) {
    bad(`${file}: top-level await is not allowed in a classic script`);
  }
}

/* ---------- 3. CSS ---------- */
const cssFiles = walk("css");
for (const file of cssFiles.concat(["css/v2.css"])) {
  if (!exists(file)) continue;
  const css = read(file);
  const open = (css.match(/{/g) || []).length;
  const close = (css.match(/}/g) || []).length;
  if (open !== close) bad(`${file}: unbalanced braces (${open} { vs ${close} })`);
}
ok("CSS braces balanced");

/* ---------- 4. JSON data ---------- */
for (const rel of ["data/compounds.json", "data/reactions.json", "data/drugs.json"]) {
  try {
    const data = JSON.parse(read(rel));
    if (!Array.isArray(data)) bad(`${rel}: expected an array`);
    else ok(`${rel}: ${data.length} records`);
  } catch (e) {
    bad(`${rel}: ${e.message}`);
  }
}

/* ---------- 5. Registry invariants ---------- */
const sandbox = { console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(read("js/core/registry.js"), sandbox, { filename: "registry.js" });
const R = sandbox.Sci.registry;
for (const s of R.SOURCES) {
  if (!s.license) bad(`registry: ${s.id} has no licence`);
  if (s.status === "rejected" && s.connector) bad(`registry: rejected source ${s.id} still has a connector`);
  if (s.status === "live" && !s.endpoints.length) bad(`registry: live source ${s.id} has no endpoints`);
}
const stats = R.stats();
ok(`registry: ${stats.total} sources (${stats.live} live, ${stats.liveKey} live-key, ${stats.rejected} rejected)`);

/* ---------- 6. Documentation ---------- */
for (const doc of ["DATA_SOURCES.md", "OPEN_DATA_LICENSES.md", "DATABASE_COVERAGE.md", "README.md", ".env.example"]) {
  if (!exists(doc)) bad(`missing documentation file: ${doc}`);
}
if (exists("DATA_SOURCES.md")) {
  const doc = read("DATA_SOURCES.md");
  for (const s of R.SOURCES.filter((x) => x.status === "live")) {
    if (!doc.includes(s.name)) bad(`DATA_SOURCES.md does not mention live source ${s.name}`);
  }
}
ok("documentation present and covers every live source");

/* ---------- 7. No secrets in shipped files ---------- */
const suspicious = /(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}|-----BEGIN (RSA |EC )?PRIVATE KEY-----)/;
for (const file of ["index.html", ".env.example"].concat(jsFiles)) {
  if (exists(file) && suspicious.test(read(file))) bad(`possible secret committed in ${file}`);
}
ok("no obvious credentials in shipped files");

/* ---------- report ---------- */
notes.forEach((n) => console.log(n));
console.log("");
if (problems.length) {
  problems.forEach((p) => console.error(p));
  console.error(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}
console.log(`All structural checks passed (${R.SOURCES.length} sources, ${stats.live + stats.liveKey} live connectors).`);
