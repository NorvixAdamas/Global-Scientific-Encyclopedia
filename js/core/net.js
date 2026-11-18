/* =========================================================================
   HTTP layer for open scientific APIs
   - per-host rate limiting, exponential backoff, timeout
   - in-flight request de-duplication
   - memory + localStorage TTL cache (RxNorm requires 12–24h caching)
   - optional Netlify Function proxy for key-based sources
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});

  const CACHE_PREFIX = "sci:cache:v2:";
  const MAX_CACHE_ENTRIES = 160;
  const MAX_ENTRY_BYTES = 220 * 1024;

  const HOST_LIMITS = {
    "pubchem.ncbi.nlm.nih.gov": 220,
    "www.ebi.ac.uk": 110,
    "rest.uniprot.org": 220,
    "www.rhea-db.org": 350,
    "api.fda.gov": 180,
    "rxnav.nlm.nih.gov": 60,
    "eutils.ncbi.nlm.nih.gov": 340,
    "api.crossref.org": 120,
    "nomad-lab.eu": 250,
    "data.rcsb.org": 120,
    "reactome.org": 150,
    "api.materialsproject.org": 400,
  };
  const DEFAULT_LIMIT = 100;

  const memory = new Map();
  const inflight = new Map();
  const hostState = new Map();
  const recent = [];

  function SciError(message, meta) {
    const err = new Error(message);
    err.name = "SciError";
    Object.assign(err, meta || {});
    return err;
  }

  function hostOf(url) {
    try {
      return new URL(url, location.href).hostname;
    } catch (e) {
      return "unknown";
    }
  }

  function storage() {
    try {
      const k = "__sci_probe__";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      return null;
    }
  }
  const store = storage();

  function readDisk(key) {
    if (!store) return null;
    try {
      const raw = store.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (!entry || entry.exp < Date.now()) {
        store.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return entry;
    } catch (e) {
      return null;
    }
  }

  function writeDisk(key, value, ttl) {
    if (!store) return;
    try {
      const payload = JSON.stringify({ t: Date.now(), exp: Date.now() + ttl, v: value });
      if (payload.length > MAX_ENTRY_BYTES) return;
      store.setItem(CACHE_PREFIX + key, payload);
      pruneDisk();
    } catch (e) {
      /* quota exceeded — drop the oldest half of the cache once */
      try {
        const keys = Object.keys(store).filter((k) => k.startsWith(CACHE_PREFIX));
        keys.slice(0, Math.ceil(keys.length / 2)).forEach((k) => store.removeItem(k));
      } catch (e2) {
        /* ignore */
      }
    }
  }

  function pruneDisk() {
    if (!store) return;
    try {
      const keys = Object.keys(store).filter((k) => k.startsWith(CACHE_PREFIX));
      if (keys.length <= MAX_CACHE_ENTRIES) return;
      const entries = keys
        .map((k) => {
          try {
            const e = JSON.parse(store.getItem(k));
            return { k, t: e && e.t ? e.t : 0 };
          } catch (err) {
            return { k, t: 0 };
          }
        })
        .sort((a, b) => a.t - b.t);
      entries.slice(0, keys.length - MAX_CACHE_ENTRIES).forEach((e) => store.removeItem(e.k));
    } catch (e) {
      /* ignore */
    }
  }

  async function gate(host) {
    const interval = HOST_LIMITS[host] || DEFAULT_LIMIT;
    const st = hostState.get(host) || { next: 0 };
    const now = Date.now();
    const wait = Math.max(0, st.next - now);
    st.next = Math.max(now, st.next) + interval;
    hostState.set(host, st);
    if (wait > 0) await Sci.util.sleep(wait);
  }

  function record(entry) {
    recent.unshift(Object.assign({ ok: entry.status >= 200 && entry.status < 400 }, entry));
    if (recent.length > 40) recent.pop();
  }

  /** Rewrite a key-based endpoint through the optional serverless proxy. */
  function maybeProxy(url, opts) {
    const base = Sci.config.proxyBase();
    if (!base) return url;
    const needs = opts.proxy === true || Sci.config.needsProxy(url);
    if (!needs) return url;
    return base.replace(/\/$/, "") + "/?url=" + encodeURIComponent(url);
  }

  async function request(url, opts) {
    const o = Object.assign(
      { ttl: 6 * 3600 * 1000, timeout: 16000, retries: 2, responseType: "json", headers: {}, force: false, sourceId: null, proxy: false },
      opts || {}
    );
    const target = maybeProxy(url, o);
    const host = hostOf(url);
    const method = (o.method || "GET").toUpperCase();
    const isPost = method === "POST";
    const key =
      o.cacheKey || `${o.responseType}:${method}:${target}${isPost && o.body ? ":" + o.body : ""}`;

    if (!o.force && !isPost) {
      if (memory.has(key)) return memory.get(key).v;
      const disk = readDisk(key);
      if (disk) {
        memory.set(key, disk);
        return disk.v;
      }
    }

    if (inflight.has(key)) return inflight.get(key);

    const task = (async () => {
      let lastErr = null;
      for (let attempt = 0; attempt <= o.retries; attempt++) {
        const started = Date.now();
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort("timeout"), o.timeout);
        try {
          await gate(host);
          const res = await fetch(target, {
            method,
            body: isPost ? o.body : undefined,
            signal: ctrl.signal,
            headers: Object.assign({ Accept: o.responseType === "json" ? "application/json, text/plain, */*" : "text/tab-separated-values, text/plain, */*" }, o.headers),
            mode: "cors",
            credentials: "omit",
            cache: o.force ? "no-cache" : "default",
          });
          clearTimeout(timer);

          if (res.status === 429) {
            const ra = Number(res.headers.get("Retry-After"));
            lastErr = SciError("Nguồn đang giới hạn tần suất (429).", { status: 429, url, sourceId: o.sourceId, retriable: true });
            record({ url, host, status: 429, ms: Date.now() - started, at: new Date().toISOString(), sourceId: o.sourceId });
            await Sci.util.sleep(isFinite(ra) && ra > 0 ? Math.min(ra * 1000, 8000) : 700 * Math.pow(2, attempt));
            continue;
          }
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            record({ url, host, status: res.status, ms: Date.now() - started, at: new Date().toISOString(), sourceId: o.sourceId });
            throw SciError(`Máy chủ trả về HTTP ${res.status}${text ? " — " + text.slice(0, 120).replace(/\s+/g, " ") : ""}`, {
              status: res.status,
              url,
              sourceId: o.sourceId,
              retriable: res.status >= 500,
            });
          }

          let value;
          if (o.responseType === "json") {
            const text = await res.text();
            try {
              value = JSON.parse(text);
            } catch (e) {
              throw SciError("Phản hồi không phải JSON hợp lệ.", { status: res.status, url, sourceId: o.sourceId });
            }
          } else {
            value = await res.text();
          }

          if (!isPost) {
            memory.set(key, { t: Date.now(), exp: Date.now() + o.ttl, v: value });
            writeDisk(key, value, o.ttl);
          }
          record({ url, host, status: res.status, ms: Date.now() - started, at: new Date().toISOString(), sourceId: o.sourceId });
          return value;
        } catch (err) {
          clearTimeout(timer);
          if (err && err.name === "SciError" && !err.retriable) throw err;
          if (err && err.name === "AbortError") {
            lastErr = SciError("Truy vấn quá thời gian chờ (timeout).", { url, sourceId: o.sourceId, retriable: true });
          } else if (err && err.name === "AbortError") {
            lastErr = SciError("Truy vấn bị huỷ.", { url, sourceId: o.sourceId });
          } else if (err && err.name === "SciError") {
            lastErr = err;
          } else {
            lastErr = SciError(
              "Không kết nối được tới nguồn (mất mạng, CORS hoặc DNS). Website vẫn dùng được với dữ liệu cục bộ.",
              { url, sourceId: o.sourceId, retriable: true, network: true }
            );
            record({ url, host, status: 0, ms: Date.now() - started, at: new Date().toISOString(), sourceId: o.sourceId });
          }
          if (attempt < o.retries) await Sci.util.sleep(400 * Math.pow(2, attempt));
        }
      }
      throw lastErr || SciError("Truy vấn thất bại.", { url, sourceId: o.sourceId });
    })().finally(() => inflight.delete(key));

    inflight.set(key, task);
    return task;
  }

  function getJSON(url, opts) {
    return request(url, Object.assign({}, opts, { responseType: "json" }));
  }
  function getText(url, opts) {
    return request(url, Object.assign({}, opts, { responseType: "text" }));
  }
  function postJSON(url, body, opts) {
    return request(url, Object.assign({}, opts, {
      responseType: "json",
      headers: Object.assign({ "Content-Type": "application/json" }, (opts || {}).headers),
      method: "POST",
      body: JSON.stringify(body),
    }));
  }

  function clearCache() {
    memory.clear();
    if (store) {
      Object.keys(store)
        .filter((k) => k.startsWith(CACHE_PREFIX))
        .forEach((k) => store.removeItem(k));
    }
  }

  function cacheInfo() {
    if (!store) return { entries: 0, bytes: 0, available: false };
    let entries = 0;
    let bytes = 0;
    Object.keys(store)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => {
        entries++;
        bytes += (store.getItem(k) || "").length;
      });
    return { entries, bytes, available: true };
  }

  Sci.net = {
    request,
    getJSON,
    getText,
    postJSON,
    clearCache,
    cacheInfo,
    recent: () => recent.slice(),
    hostLimit: (h) => HOST_LIMITS[h] || DEFAULT_LIMIT,
    error: SciError,
  };
})(typeof window !== "undefined" ? window : globalThis);
