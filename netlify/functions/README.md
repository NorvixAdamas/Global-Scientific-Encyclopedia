# Optional server-side proxy (Netlify Functions)

The static site calls the public scientific APIs **directly from the browser** and works
without this folder. A proxy is only useful if you want to:

- keep a Materials Project key on the server instead of in the visitor's browser, or
- call an API that does not send CORS headers (none of the currently integrated sources).

No paid service is required. Nothing in this folder runs unless you deploy it to Netlify.

## Contract expected by the front end

The browser sends:

```
GET /.netlify/functions/api/?url=<encoded absolute upstream URL>
```

and expects the upstream JSON with CORS headers. The front end is configured on `#/settings`
via **Proxy URL**, for example:

```
https://your-site.netlify.app/.netlify/functions/api
```

When a proxy base is set, `Sci.net` rewrites **only** URLs whose hosts are listed in
`KEY_HOSTS` (`api.materialsproject.org`, `api.cdc.gov`, `api-ccte.epa.gov`, `api.plants.epa.gov`)
plus `api.fda.gov` when an openFDA key is configured. All other requests still go directly
to the public API.

## If you implement it

Create `netlify/functions/api.mjs` with a **strict allowlist** and never forward arbitrary URLs:

```js
const ALLOWED = new Set(["api.materialsproject.org", "api.fda.gov"]);

export default async (req) => {
  const target = new URL(req.url).searchParams.get("url");
  if (!target) return new Response("missing url", { status: 400 });
  const u = new URL(target);
  if (u.protocol !== "https:" || !ALLOWED.has(u.hostname)) {
    return new Response("host not allowed", { status: 403 });
  }
  // Inject the key server-side; never return it to the browser.
  if (u.hostname === "api.materialsproject.org") {
    u.searchParams.set("_fields", "material_id,formula_pretty,formation_energy_per_atom,band_gap");
  }
  const upstream = await fetch(u, {
    headers: { "X-API-KEY": process.env.MP_API_KEY || "" },
  });
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "access-control-allow-origin": "https://your-site.netlify.app",
    },
  });
};
```

Set `MP_API_KEY` in **Netlify → Site configuration → Environment variables** (never in the repo).
`.env.example` documents the same names for `netlify dev`.

## Security notes

- Allowlist hosts; do not accept `http:`, `file:`, `localhost` or arbitrary paths (SSRF).
- Restrict `access-control-allow-origin` to your own origin.
- Do not log request headers or keys.
- Return only the fields the UI needs.
- Rate-limit if the function becomes public and key-backed.
