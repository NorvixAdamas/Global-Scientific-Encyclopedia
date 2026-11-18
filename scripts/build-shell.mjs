/**
 * Build the V2 shell without hand-copying the legacy markup.
 *
 * The original single-page version is preserved byte-for-byte at
 * `legacy/index.v1.html`; its `<main>` contents are embedded in the new
 * document exactly as they were, inside `#legacyRoot`, so every legacy id,
 * section and script keeps working.
 *
 * Run: node scripts/build-shell.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const originalPath = path.join(root, "legacy", "index.v1.html");
const targetPath = path.join(root, "index.html");
const bodyOut = path.join(root, "legacy", "legacy-body.html");

if (!fs.existsSync(originalPath)) {
  console.error("Missing legacy/index.v1.html — the original v1 page is required as the source of truth.");
  process.exit(1);
}

const original = fs.readFileSync(originalPath, "utf8");
const mainMatch = original.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
  console.error("No <main> element found in the legacy page.");
  process.exit(1);
}
const legacyBody = mainMatch[1].trim();
fs.mkdirSync(path.dirname(bodyOut), { recursive: true });
fs.writeFileSync(bodyOut, legacyBody + "\n");

/* Preserve the original script order (data files first, then renderers). */
const legacyScripts = [...original.matchAll(/<script\s+src="([^"]+)"[^>]*><\/script>/g)].map((m) => m[1]);
const legacyCss = [...original.matchAll(/<link[^>]+href="([^"]+\.css)"[^>]*>/g)].map((m) => m[1]);
if (!legacyCss.includes("css/style.css")) legacyCss.unshift("css/style.css");

const V2_CSS = [...legacyCss, "css/v2.css"];
const V2_SCRIPTS = [
  "js/core/data-bridge.js",
  "js/core/util.js",
  "js/core/registry.js",
  "js/core/config.js",
  "js/core/net.js",
  "js/core/entity.js",
  "js/core/adapters/chemistry.js",
  "js/core/adapters/life.js",
  "js/core/adapters/applied.js",
  "js/core/adapters.js",
  "js/core/tools.js",
  "js/core/search.js",
  "js/core/graph.js",
  "js/core/ui.js",
  "js/core/searchbox.js",
  "data/topics.js",
  "js/core/nav.js",
  "js/views/atlas.js",
  "js/views/search.js",
  "js/views/sources.js",
  "js/views/graph.js",
  "js/views/chemistry.js",
  "js/views/reactions.js",
  "js/views/pharma.js",
  "js/views/tools.js",
  "js/views/settings.js",
  "js/app.js",
];

const head = `<!DOCTYPE html>
<html lang="vi" data-theme="light">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Global Scientific Encyclopedia — Hóa học, Vật liệu &amp; Dược học</title>
<meta name="description" content="Bách khoa toàn thư khoa học mở: 118 nguyên tố, hợp chất, phản ứng, vật liệu, dược chất, protein và công bố khoa học — kết nối trực tiếp PubChem, ChEBI, ChEMBL, Rhea, UniProt, openFDA, Europe PMC." />
<meta name="theme-color" content="#f6f8f7" />
<meta name="color-scheme" content="light dark" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Global Scientific Encyclopedia V2.0" />
<meta property="og:description" content="Hệ tri thức hóa học, vật liệu và dược học có thể kiểm chứng: dữ liệu biên soạn, truy vấn trực tiếp và liên kết nguồn mở." />
<meta property="og:locale" content="vi_VN" />
<link rel="canonical" href="https://papaya-eclair-e44179.netlify.app/" />
<link rel="preconnect" href="https://pubchem.ncbi.nlm.nih.gov" crossorigin />
<link rel="preconnect" href="https://www.ebi.ac.uk" crossorigin />
<link rel="preconnect" href="https://rest.uniprot.org" crossorigin />
<link rel="preconnect" href="https://eutils.ncbi.nlm.nih.gov" crossorigin />
<link rel="preconnect" href="https://api.fda.gov" crossorigin />
<link rel="preconnect" href="https://rxnav.nlm.nih.gov" crossorigin />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230f766e'/%3E%3Ctext x='16' y='23' font-size='18' text-anchor='middle' fill='%23fff'%3E%E2%9A%97%3C/text%3E%3C/svg%3E" />
${V2_CSS.map((href) => `<link rel="stylesheet" href="${href}" />`).join("\n")}
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Global Scientific Encyclopedia","alternateName":"Bách khoa Hóa học Vật liệu","url":"https://papaya-eclair-e44179.netlify.app/","inLanguage":["vi","en"],"potentialAction":{"@type":"SearchAction","target":"https://papaya-eclair-e44179.netlify.app/#/search?q={search_term_string}","query-input":"required name=search_term_string"}}
</script>
</head>
<body class="v2">
<a class="skip-link" href="#viewRoot">Bỏ qua điều hướng</a>
<header id="siteHeader" class="site-header"></header>
<main id="appMain">
  <div id="viewRoot" class="view-root"></div>
  <div id="legacyRoot" hidden>
${legacyBody}
    <button id="themeToggle" type="button" hidden aria-hidden="true" tabindex="-1">theme</button>
  </div>
</main>
<footer id="siteFooter" class="site-footer"></footer>
<div id="routeAnnouncer" class="visually-hidden" role="status" aria-live="polite"></div>
<dialog id="searchDialog" class="search-dialog" aria-label="Tìm kiếm toàn cầu"></dialog>
<noscript>
  <div class="noscript">Website cần JavaScript để truy vấn dữ liệu khoa học trực tiếp. Vui lòng bật JavaScript.</div>
</noscript>
${legacyScripts.map((src) => `<script src="${src}"></script>`).join("\n")}
${V2_SCRIPTS.map((src) => `<script src="${src}"></script>`).join("\n")}
</body>
</html>
`;

fs.writeFileSync(targetPath, head);
console.log(`Wrote ${path.relative(root, targetPath)}`);
console.log(`Legacy scripts preserved (${legacyScripts.length}): ${legacyScripts.join(", ")}`);
console.log(`Legacy body: ${legacyBody.length} chars`);
