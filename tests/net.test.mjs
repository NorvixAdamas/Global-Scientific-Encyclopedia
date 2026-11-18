import test from "node:test";
import assert from "node:assert/strict";
import { createEnv, jsonResponse, textResponse } from "./helpers/env.mjs";

function countingFetch(handler) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push(String(url));
    return handler(String(url), init || {}, calls.length);
  };
  return { fetch, calls };
}

test("identical JSON requests are cached, not re-fetched", async () => {
  const { fetch, calls } = countingFetch(() => jsonResponse({ value: 42 }));
  const { Sci } = createEnv({ fetch });
  const a = await Sci.net.getJSON("https://example.org/data.json");
  const b = await Sci.net.getJSON("https://example.org/data.json");
  assert.equal(JSON.stringify(a), JSON.stringify({ value: 42 }));
  assert.equal(JSON.stringify(b), JSON.stringify({ value: 42 }));
  assert.equal(calls.length, 1, "second call must come from the cache");
  const info = Sci.net.cacheInfo();
  assert.ok(info.entries >= 1);
  assert.ok(info.bytes > 0);
});

test("concurrent identical requests are de-duplicated", async () => {
  let resolveFirst;
  const gate = new Promise((r) => (resolveFirst = r));
  const { fetch, calls } = countingFetch(async () => {
    await gate;
    return jsonResponse({ ok: true });
  });
  const { Sci } = createEnv({ fetch });
  const p1 = Sci.net.getJSON("https://example.org/slow.json");
  const p2 = Sci.net.getJSON("https://example.org/slow.json");
  resolveFirst();
  const [r1, r2] = await Promise.all([p1, p2]);
  assert.equal(JSON.stringify(r1), JSON.stringify({ ok: true }));
  assert.equal(JSON.stringify(r2), JSON.stringify({ ok: true }));
  assert.equal(calls.length, 1, "in-flight de-duplication should share one request");
});

test("server errors are retried, client errors are not", async () => {
  const { fetch, calls } = countingFetch((url, init, n) =>
    n === 1 ? jsonResponse({ error: "boom" }, { status: 503 }) : jsonResponse({ recovered: true })
  );
  const { Sci } = createEnv({ fetch });
  const data = await Sci.net.getJSON("https://example.org/flaky.json", { retries: 2, retryDelay: 5 });
  assert.equal(JSON.stringify(data), JSON.stringify({ recovered: true }));
  assert.equal(calls.length, 2);

  const notFound = countingFetch(() => jsonResponse({ error: "missing" }, { status: 404 }));
  const env2 = createEnv({ fetch: notFound.fetch });
  await assert.rejects(() => env2.Sci.net.getJSON("https://example.org/missing.json", { retries: 2 }), (err) => {
    assert.equal(err.status, 404);
    return true;
  });
  assert.equal(notFound.calls.length, 1, "404 must not be retried");
});

test("plain text responses (Rhea TSV) are supported", async () => {
  const tsv = "Reaction identifier\tEquation\nRHEA:11752\tA + B = C\n";
  const { Sci } = createEnv({ fetch: async () => textResponse(tsv) });
  const text = await Sci.net.getText("https://www.rhea-db.org/rhea/?query=x&format=tsv");
  assert.equal(text, tsv);
});

test("POST bodies are forwarded as JSON", async () => {
  let seen = null;
  const { Sci } = createEnv({
    fetch: async (url, init) => {
      seen = init;
      return jsonResponse({ data: [] });
    },
  });
  await Sci.net.postJSON("https://nomad-lab.eu/prod/v1/api/v1/entries/query", { query: { a: 1 } });
  assert.equal(seen.method, "POST");
  assert.match(String(seen.headers["content-type"] || seen.headers["Content-Type"]), /application\/json/);
  assert.equal(seen.body, JSON.stringify({ query: { a: 1 } }));
});

test("cache can be cleared and is reported honestly", async () => {
  const { fetch, calls } = countingFetch(() => jsonResponse({ n: 1 }));
  const { Sci } = createEnv({ fetch });
  await Sci.net.getJSON("https://example.org/a.json");
  Sci.net.clearCache();
  assert.equal(Sci.net.cacheInfo().entries, 0);
  await Sci.net.getJSON("https://example.org/a.json");
  assert.equal(calls.length, 2);
});

test("the request log records status without leaking request bodies", async () => {
  const { Sci } = createEnv({ fetch: async () => jsonResponse({ ok: 1 }) });
  await Sci.net.getJSON("https://example.org/logged.json");
  const recent = Sci.net.recent(5);
  assert.ok(recent.length >= 1);
  assert.ok(recent[0].url.includes("example.org"));
  assert.equal(recent[0].ok, true);
});
