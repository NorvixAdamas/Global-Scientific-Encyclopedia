/* =========================================================================
   Runtime configuration
   -------------------------------------------------------------------------
   This is a static site. Optional free API keys are stored in the visitor's
   own browser (never committed, never sent anywhere except the official API
   host, or the optional Netlify Function proxy configured by the operator).
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});

  const PREFIX = "sci:config:v2:";
  const FILE = root.SCI_CONFIG || {};

  const DEFAULTS = {
    /* Optional free keys — the app works without them. */
    mpKey: "",
    openfdaKey: "",
    ncbiKey: "",
    /* Optional serverless proxy (Netlify Function) so keys stay server-side. */
    proxyBase: "",
    /* Optional contact for Crossref polite pool. */
    mailto: "",
  };

  function read(key) {
    if (FILE[key]) return FILE[key];
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v === null ? DEFAULTS[key] : v;
    } catch (e) {
      return DEFAULTS[key];
    }
  }

  function set(key, value) {
    try {
      if (value === "" || value === null || value === undefined) localStorage.removeItem(PREFIX + key);
      else localStorage.setItem(PREFIX + key, String(value));
    } catch (e) {
      /* storage blocked — configuration stays in memory for this page */
    }
    memoryOverrides[key] = value == null ? "" : String(value);
  }

  const memoryOverrides = {};

  function get(key) {
    if (Object.prototype.hasOwnProperty.call(memoryOverrides, key)) return memoryOverrides[key];
    return read(key);
  }

  function proxyBase() {
    const p = get("proxyBase");
    return p ? p.replace(/\/$/, "") : "";
  }

  /** Hosts that normally need a server-side key, used when a proxy is configured. */
  const KEY_HOSTS = ["api.materialsproject.org", "api-cdc.gov", "api-ccte.epa.gov", "api.plants.epa.gov"];

  function needsProxy(url) {
    try {
      const h = new URL(url, location.href).hostname;
      if (KEY_HOSTS.includes(h)) return true;
      if (h === "api.fda.gov" && get("openfdaKey") && proxyBase()) return false;
      return false;
    } catch (e) {
      return false;
    }
  }

  function configured() {
    return {
      mpKey: !!get("mpKey"),
      openfdaKey: !!get("openfdaKey"),
      ncbiKey: !!get("ncbiKey"),
      proxy: !!proxyBase(),
      mailto: !!get("mailto"),
    };
  }

  function withKey(url, keyName, param) {
    const key = get(keyName);
    if (!key) return url;
    const u = new URL(url);
    u.searchParams.set(param, key);
    return u.toString();
  }

  Sci.config = {
    DEFAULTS,
    get,
    set,
    all: () => Object.assign({}, DEFAULTS, {
      mpKey: get("mpKey"),
      openfdaKey: get("openfdaKey"),
      ncbiKey: get("ncbiKey"),
      proxyBase: get("proxyBase"),
      mailto: get("mailto"),
    }),
    proxyBase,
    needsProxy,
    configured,
    withKey,
    canQueryKeySource: (name) => !!get(name),
  };
})(typeof window !== "undefined" ? window : globalThis);
