/**
 * Loads the classic (non-module) browser scripts into a Node VM so the pure
 * logic can be unit tested without a browser or a build step.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export const ROOT = path.resolve(import.meta.dirname, "../..");

const CORE = [
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
];

/**
 * Storage stub that behaves like the Web Storage API: keys are enumerable own
 * properties, so Object.keys(localStorage) works exactly as it does in a
 * browser (the cache uses that to prune and clear entries).
 */
function memoryStorage() {
  const store = {};
  const api = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => {
      Object.defineProperty(store, String(k), {
        value: String(v),
        enumerable: true,
        configurable: true,
        writable: true,
      });
    },
    removeItem: (k) => {
      delete store[k];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
    key: (i) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
  return new Proxy(api, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === "string" && Object.prototype.hasOwnProperty.call(store, prop)) return store[prop];
      return undefined;
    },
    set(target, prop, value) {
      if (prop in target) target[prop] = value;
      else api.setItem(prop, value);
      return true;
    },
    ownKeys() {
      return Object.keys(store);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (Object.prototype.hasOwnProperty.call(store, prop)) {
        return { value: store[prop], enumerable: true, configurable: true, writable: true };
      }
      return undefined;
    },
  });
}

function stubElement() {
  return {
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute() {},
    removeAttribute() {},
    appendChild() {},
    removeChild() {},
    addEventListener() {},
    remove() {},
    select() {},
    click() {},
    focus() {},
    innerHTML: "",
    textContent: "",
    hidden: false,
  };
}

export function createEnv(options = {}) {
  const localStorage = memoryStorage();
  const sandbox = {
    console,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    AbortController,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    localStorage,
    navigator: { userAgent: "node-test", clipboard: null },
    location: { href: "http://localhost:8765/", origin: "http://localhost:8765", hostname: "localhost", hash: "", search: "" },
    document: {
      body: stubElement(),
      documentElement: { getAttribute: () => "light", setAttribute() {}, classList: { add() {}, remove() {} } },
      createElement: () => stubElement(),
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {},
      getElementById: () => null,
    },
    performance: { now: () => Date.now() },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  sandbox.fetch =
    options.fetch ||
    (async () => {
      throw new Error("network is disabled in unit tests");
    });

  if (options.globals) Object.assign(sandbox, options.globals);
  vm.createContext(sandbox);

  for (const rel of CORE) {
    const file = path.join(ROOT, rel);
    vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  }

  return {
    sandbox,
    Sci: sandbox.Sci,
    storage: localStorage,
    /** Evaluate an expression inside the same VM context. */
    eval: (code) => vm.runInContext(code, sandbox),
    /** Load an additional classic script after setup (e.g. a view). */
    load(rel) {
      const file = path.join(ROOT, rel);
      vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
      return sandbox.Sci;
    },
  };
}

export function jsonResponse(body, init = {}) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status: init.status || 200,
    headers: Object.assign({ "content-type": "application/json" }, init.headers || {}),
  });
}

export function textResponse(body, init = {}) {
  return new Response(body, {
    status: init.status || 200,
    headers: Object.assign({ "content-type": "text/plain" }, init.headers || {}),
  });
}
