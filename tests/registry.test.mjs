import test from "node:test";
import assert from "node:assert/strict";
import { createEnv } from "./helpers/env.mjs";

const { Sci } = createEnv();
const R = Sci.registry;
const VALID_STATUS = ["live", "live-key", "bulk", "external", "planned", "rejected"];
const VALID_COST = ["free", "free-key", "free-key-optional", "paid"];

test("every catalogued source has the fields the UI and docs depend on", () => {
  assert.ok(R.SOURCES.length >= 35, `expected a substantial catalogue, got ${R.SOURCES.length}`);
  const ids = new Set();
  for (const s of R.SOURCES) {
    assert.ok(s.id && !ids.has(s.id), `duplicate or missing id: ${s.id}`);
    ids.add(s.id);
    assert.ok(s.name, `${s.id}: name`);
    assert.ok(s.org, `${s.id}: organisation`);
    assert.ok(s.license, `${s.id}: licence must never be blank`);
    assert.ok(VALID_STATUS.includes(s.status), `${s.id}: status ${s.status}`);
    assert.ok(VALID_COST.includes(s.cost), `${s.id}: cost ${s.cost}`);
    assert.ok(Array.isArray(s.domains) && s.domains.length, `${s.id}: domains`);
    assert.ok(Array.isArray(s.access) && s.access.length, `${s.id}: access methods`);
    assert.ok(typeof s.description === "string" && s.description.length > 20, `${s.id}: description`);
    assert.ok(s.url && s.url.startsWith("https://"), `${s.id}: url`);
  }
});

test("no paid or proprietary source is presented as usable data", () => {
  for (const s of R.SOURCES) {
    if (s.status === "rejected") {
      assert.equal(s.redistribution, "no", `${s.id}: rejected sources must not be redistributable`);
      assert.equal(s.connector, null, `${s.id}: rejected sources must not have a connector`);
    }
    if (s.cost === "paid") {
      assert.equal(s.status, "rejected", `${s.id}: paid sources must be rejected, not integrated`);
    }
  }
});

test("every live connector is backed by a real, documented endpoint", () => {
  const live = R.SOURCES.filter((s) => s.status === "live" || s.status === "live-key");
  assert.ok(live.length >= 12, `expected at least 12 live sources, got ${live.length}`);
  for (const s of live) {
    assert.ok(s.connector, `${s.id}: live sources need a connector`);
    assert.ok(Array.isArray(s.endpoints) && s.endpoints.length, `${s.id}: endpoints`);
    assert.ok(s.api, `${s.id}: api documentation link`);
    assert.ok(s.rateLimit, `${s.id}: rate limit note`);
    assert.ok(
      s.auth === "none" || /miễn phí/i.test(s.auth),
      `${s.id}: only optional free keys are allowed, got "${s.auth}"`
    );
  }
});

test("licence families are classified honestly", () => {
  const family = (id) => R.licenseFamily(R.byId[id]);
  assert.equal(family("chebi"), "attribution");
  assert.equal(family("chembl"), "share-alike");
  assert.equal(family("rcsb-pdb"), "public-domain");
  assert.equal(family("drugbank"), "proprietary");
  const redistributable = R.redistributable().map((s) => s.id);
  assert.ok(redistributable.includes("chebi"));
  assert.ok(!redistributable.includes("drugbank"));
  assert.ok(!redistributable.includes("aflow"));
});

test("statistics add up to the catalogue size", () => {
  const st = R.stats();
  assert.equal(st.total, R.SOURCES.length);
  assert.equal(st.live + st.liveKey + st.bulk + st.external + st.planned + st.rejected, st.total);
  assert.equal(st.live + st.liveKey, R.SOURCES.filter((s) => s.status === "live" || s.status === "live-key").length);
  assert.ok(st.rejected >= 4, "commercial databases must be explicitly listed as excluded");
});

test("source ids used by the adapters exist in the registry", () => {
  const adapters = Sci.sources;
  assert.ok(adapters, "Sci.sources facade must be registered");
  for (const a of adapters.searchable()) {
    assert.ok(R.byId[a.id], `adapter source missing from registry: ${a.id}`);
  }
});
