/* =========================================================================
   Cross-database knowledge graph
   -------------------------------------------------------------------------
   Nodes come from the curated local datasets + their explicit identifiers.
   Edges are derived only from stated relationships:
     element  —(formula contains)— compound
     compound —(name appears as participant)— reaction
     reaction —(product name matches)— drug
     drug     —(target listed by source)— target
   Every edge records how it was derived; name-based links are labelled as
   name matches, never presented as structural proof.
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;

  const KIND_COLORS = {
    element: "#38bdf8",
    compound: "#34d399",
    reaction: "#f59e0b",
    drug: "#a78bfa",
    material: "#f472b6",
    protein: "#fb7185",
    topic: "#94a3b8",
  };

  const KIND_LABELS = {
    element: "Nguyên tố",
    compound: "Hợp chất",
    reaction: "Phản ứng",
    drug: "Thuốc",
    material: "Vật liệu",
    protein: "Target / protein",
  };

  let GRAPH = null;

  function norm(s) {
    return String(s || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\(.*?\)/g, " ")
      .replace(/[·•]/g, " ")
      .replace(/[^a-zA-Z0-9α-ωΑ-Ω\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function node(id, kind, title, extra) {
    return Object.assign({ id, kind, title, degree: 0, route: null, meta: null }, extra || {});
  }

  function build() {
    if (GRAPH) return GRAPH;
    const nodes = new Map();
    const edges = [];
    const seenEdge = new Set();

    const addEdge = (a, b, relation, match) => {
      if (!a || !b) return;
      const key = a + "|" + b + "|" + relation;
      if (seenEdge.has(key)) return;
      seenEdge.add(key);
      edges.push({ source: a, target: b, relation, match: match || "stated" });
    };

    /* --- elements --- */
    const els = (root.ELEMENTS || []).concat(root.THEORETICAL_ELEMENTS || []);
    els.forEach((el) => {
      const id = "element:" + el.sym;
      nodes.set(id, node(id, "element", `${el.name} (${el.sym})`, { route: "#/elements/" + el.z, meta: { z: el.z, cat: el.cat } }));
    });

    /* --- compounds (curated PubChem-derived set) --- */
    const compoundByName = new Map();
    (root.OPEN_COMPOUNDS || []).forEach((c) => {
      const cid = c.compound_cid;
      const id = "compound:" + (cid || c.common_name);
      const title = c.common_name || c.iupac_name || "CID " + cid;
      const n = node(id, "compound", title, {
        route: cid ? "#/compounds/" + cid : null,
        meta: { formula: c.molecular_formula, cid, mw: c.molecular_weight },
      });
      nodes.set(id, n);
      [c.common_name, c.iupac_name].forEach((name) => {
        const k = norm(name);
        if (k && !compoundByName.has(k)) compoundByName.set(k, id);
      });
      Sci.tools.elementsInFormula(c.molecular_formula || "").forEach((sym) => {
        const eid = "element:" + sym;
        if (nodes.has(eid)) addEdge(eid, id, "thành phần công thức", "formula");
      });
    });

    /* --- reactions: curated library + ORD-style local records --- */
    (root.REACTIONS || []).forEach((r, i) => {
      const id = "reaction:curated-" + i;
      nodes.set(id, node(id, "reaction", r.t, { route: "#/reactions/i/" + i, meta: { equation: r.e, category: r.c } }));
    });

    (root.OPEN_REACTIONS || []).forEach((r) => {
      const id = "reaction:" + r.reaction_id;
      const left = (r.reactants || []).map((x) => x.name).filter(Boolean);
      const right = (r.products || []).map((x) => x.name).filter(Boolean);
      const label = `${left[0] || "?"} → ${right[0] || "?"}${left.length + right.length > 2 ? " (…)" : ""}`;
      nodes.set(id, node(id, "reaction", label, { route: "#/reactions/ord/" + encodeURIComponent(r.reaction_id), meta: { type: r.type, yield: r.yield_percent } }));
      left.forEach((name) => {
        const cid = compoundByName.get(norm(name));
        if (cid) addEdge(cid, id, "tham gia phản ứng", "name");
      });
      right.forEach((name) => {
        const cid = compoundByName.get(norm(name));
        if (cid) addEdge(cid, id, "tham gia phản ứng", "name");
      });
    });

    /* --- drugs and their stated targets --- */
    const targetByName = new Map();
    (root.OPEN_DRUGS || []).forEach((d) => {
      const id = "drug:" + (d.drugbank_id || d.name);
      nodes.set(id, node(id, "drug", d.name, { route: "#/pharma/drug/" + encodeURIComponent(d.name), meta: { cls: d.drug_class, groups: d.groups } }));
      (d.targets || []).forEach((t) => {
        const name = t.target_name;
        if (!name) return;
        const k = norm(name);
        let tid = targetByName.get(k);
        if (!tid) {
          tid = "target:" + U.slugify(k).slice(0, 60);
          targetByName.set(k, tid);
          nodes.set(tid, node(tid, "protein", name, { meta: { action: t.action } }));
        }
        addEdge(id, tid, "target (nguồn công bố)", "stated");
      });
    });

    /* curated drug notes link to compounds by name when they exist */
    (root.DRUGS || []).forEach((d) => {
      const cid = compoundByName.get(norm(String(d.n).replace(/\(.*?\)/g, "")));
      if (!cid) return;
      const id = "drug:" + U.slugify(d.n);
      if (!nodes.has(id)) {
        nodes.set(id, node(id, "drug", d.n, { route: "#/pharma/drug/" + encodeURIComponent(d.n), meta: { cls: d.cls, year: d.y } }));
      }
      addEdge(id, cid, "hoạt chất tương ứng", "name");
    });

    /* --- materials with a formula in the title --- */
    (root.MATERIALS || []).forEach((m) => {
      const formulaMatch = String(m.name || "").match(/[A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)+/);
      if (!formulaMatch) return;
      const id = "material:" + m.id;
      nodes.set(id, node(id, "material", m.name, { route: "#/materials/" + m.id, meta: { cat: m.cat } }));
      Sci.tools.elementsInFormula(formulaMatch[0]).forEach((sym) => {
        const eid = "element:" + sym;
        if (nodes.has(eid)) addEdge(eid, id, "thành phần công thức", "formula");
      });
    });

    edges.forEach((e) => {
      const a = nodes.get(e.source);
      const b = nodes.get(e.target);
      if (a) a.degree++;
      if (b) b.degree++;
    });

    GRAPH = {
      nodes: Array.from(nodes.values()),
      edges,
      index: nodes,
      builtAt: new Date().toISOString(),
      stats: {
        nodes: nodes.size,
        edges: edges.length,
        byKind: Array.from(nodes.values()).reduce((acc, n) => {
          acc[n.kind] = (acc[n.kind] || 0) + 1;
          return acc;
        }, {}),
      },
    };
    return GRAPH;
  }

  function neighbors(id, depth) {
    const g = build();
    const seen = new Set([id]);
    let frontier = [id];
    for (let d = 0; d < (depth || 1); d++) {
      const next = [];
      g.edges.forEach((e) => {
        if (frontier.includes(e.source) && !seen.has(e.target)) {
          seen.add(e.target);
          next.push(e.target);
        } else if (frontier.includes(e.target) && !seen.has(e.source)) {
          seen.add(e.source);
          next.push(e.source);
        }
      });
      frontier = next;
    }
    return seen;
  }

  /** Extract a renderable subgraph around seed ids (or all nodes when empty). */
  function subgraph(seedIds, opts) {
    const o = opts || {};
    const g = build();
    const max = o.maxNodes || 160;
    let ids;
    if (seedIds && seedIds.length) {
      const set = new Set();
      seedIds.forEach((s) => neighbors(s, o.depth === undefined ? 1 : o.depth).forEach((id) => set.add(id)));
      ids = Array.from(set);
    } else {
      ids = g.nodes
        .slice()
        .sort((a, b) => b.degree - a.degree)
        .slice(0, max)
        .map((n) => n.id);
    }
    if (o.kinds && o.kinds.length) {
      ids = ids.filter((id) => {
        const n = g.index.get(id);
        return n && (o.kinds.includes(n.kind) || (seedIds || []).includes(id));
      });
    }
    if (ids.length > max) ids = ids.slice(0, max);
    const idSet = new Set(ids);
    const nodes = ids.map((id) => g.index.get(id)).filter(Boolean);
    const edges = g.edges.filter((e) => idSet.has(e.source) && idSet.has(e.target)).slice(0, max * 4);
    return { nodes, edges, stats: { nodes: nodes.length, edges: edges.length } };
  }

  function searchNodes(q, limit) {
    const g = build();
    const needle = norm(q);
    if (!needle) return [];
    return g.nodes
      .filter((n) => norm(n.title).includes(needle))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, limit || 10);
  }

  /* ----------------------------------------------------------------------
     Canvas renderer with a small force simulation
     ---------------------------------------------------------------------- */
  function render(canvas, graphData, options) {
    const o = options || {};
    const ctx = canvas.getContext("2d");
    if (!ctx) return { destroy() {} };
    const dpr = Math.min(root.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let transform = { x: 0, y: 0, k: 1 };

    const nodes = graphData.nodes.map((n, i) => {
      const angle = (i / Math.max(1, graphData.nodes.length)) * Math.PI * 2;
      const r = 40 + Math.random() * 120;
      return {
        ref: n,
        x: Math.cos(angle) * r + (Math.random() - 0.5) * 30,
        y: Math.sin(angle) * r + (Math.random() - 0.5) * 30,
        vx: 0,
        vy: 0,
        r: 4 + Math.min(9, Math.sqrt(n.degree || 1) * 1.6),
      };
    });
    const byId = new Map(nodes.map((n) => [n.ref.id, n]));
    const edges = graphData.edges
      .map((e) => ({ ref: e, a: byId.get(e.source), b: byId.get(e.target) }))
      .filter((e) => e.a && e.b);
    const adjacency = new Map();
    edges.forEach((e) => {
      if (!adjacency.has(e.a.ref.id)) adjacency.set(e.a.ref.id, new Set());
      if (!adjacency.has(e.b.ref.id)) adjacency.set(e.b.ref.id, new Set());
      adjacency.get(e.a.ref.id).add(e.b.ref.id);
      adjacency.get(e.b.ref.id).add(e.a.ref.id);
    });

    let alpha = 1;
    let frame = 0;
    let dragging = null;
    let hover = null;
    let selected = o.selected ? byId.get(o.selected) : null;
    let destroyed = false;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height || 480;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function tick() {
      const repulsion = 900;
      const springLength = 55;
      const springK = 0.02;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) {
            dx = Math.random() - 0.5;
            dy = Math.random() - 0.5;
            d2 = 1;
          }
          const d = Math.sqrt(d2);
          const f = (repulsion * alpha) / d2;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }
      edges.forEach((e) => {
        const dx = e.b.x - e.a.x;
        const dy = e.b.y - e.a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - springLength) * springK * alpha;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        e.a.vx += fx;
        e.a.vy += fy;
        e.b.vx -= fx;
        e.b.vy -= fy;
      });
      nodes.forEach((n) => {
        n.vx -= n.x * 0.0012 * alpha;
        n.vy -= n.y * 0.0012 * alpha;
        n.vx *= 0.86;
        n.vy *= 0.86;
        if (dragging !== n) {
          n.x += n.vx;
          n.y += n.vy;
        }
      });
      alpha *= 0.985;
      if (alpha < 0.015) alpha = 0.015;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W / 2 + transform.x, H / 2 + transform.y);
      ctx.scale(transform.k, transform.k);

      ctx.lineWidth = 1 / transform.k;
      edges.forEach((e) => {
        const active = selected && (e.a === selected || e.b === selected);
        ctx.strokeStyle = active ? "rgba(56,189,248,0.75)" : "rgba(148,163,184,0.22)";
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.stroke();
      });

      nodes.forEach((n) => {
        const color = KIND_COLORS[n.ref.kind] || "#94a3b8";
        const isSel = selected === n;
        const isHover = hover === n;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + (isSel ? 3 : isHover ? 2 : 0), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = selected && !isSel && !(adjacency.get(selected.ref.id) || new Set()).has(n.ref.id) ? 0.35 : 0.92;
        ctx.fill();
        ctx.globalAlpha = 1;
        if (isSel) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2 / transform.k;
          ctx.stroke();
        }
        const showLabel = transform.k > 0.85 || isSel || isHover || n.ref.degree > 12;
        if (showLabel) {
          ctx.font = `${Math.max(9, 11 / transform.k)}px ui-monospace, monospace`;
          ctx.fillStyle = "rgba(226,232,240,0.92)";
          ctx.textAlign = "center";
          ctx.fillText(U.truncate(n.ref.title, 28), n.x, n.y + n.r + 12 / transform.k);
        }
      });
      ctx.restore();
    }

    function frameLoop() {
      if (destroyed) return;
      for (let i = 0; i < 3; i++) tick();
      draw();
      frame = requestAnimationFrame(frameLoop);
    }

    function toWorld(evt) {
      const rect = canvas.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;
      return { x: (x - W / 2 - transform.x) / transform.k, y: (y - H / 2 - transform.y) / transform.k };
    }

    function hitTest(p) {
      let best = null;
      let bestD = Infinity;
      nodes.forEach((n) => {
        const d = Math.hypot(n.x - p.x, n.y - p.y);
        if (d < n.r + 6 && d < bestD) {
          best = n;
          bestD = d;
        }
      });
      return best;
    }

    let panStart = null;

    function onDown(evt) {
      const p = toWorld(evt);
      const hit = hitTest(p);
      if (hit) {
        dragging = hit;
        canvas.setPointerCapture && canvas.setPointerCapture(evt.pointerId);
      } else {
        panStart = { x: evt.clientX - transform.x, y: evt.clientY - transform.y };
      }
    }
    function onMove(evt) {
      const p = toWorld(evt);
      if (dragging) {
        dragging.x = p.x;
        dragging.y = p.y;
        dragging.vx = 0;
        dragging.vy = 0;
        alpha = Math.max(alpha, 0.35);
        return;
      }
      if (panStart) {
        transform.x = evt.clientX - panStart.x;
        transform.y = evt.clientY - panStart.y;
        return;
      }
      const hit = hitTest(p);
      if (hit !== hover) {
        hover = hit;
        canvas.style.cursor = hit ? "pointer" : "grab";
      }
    }
    function onUp(evt) {
      if (dragging && !panStart) {
        const p = toWorld(evt);
        const moved = Math.hypot(dragging.x - p.x, dragging.y - p.y);
        if (moved < 4) {
          selected = dragging;
          if (o.onSelect) o.onSelect(dragging.ref);
        }
      }
      dragging = null;
      panStart = null;
    }
    function onWheel(evt) {
      evt.preventDefault();
      const factor = Math.exp(-evt.deltaY * 0.0012);
      transform.k = Math.max(0.35, Math.min(3, transform.k * factor));
    }
    function onResize() {
      resize();
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("resize", onResize);

    resize();
    frameLoop();

    return {
      destroy() {
        destroyed = true;
        cancelAnimationFrame(frame);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointerleave", onUp);
        canvas.removeEventListener("wheel", onWheel);
        root.removeEventListener("resize", onResize);
      },
      select(id) {
        selected = byId.get(id) || null;
      },
      getStats: () => ({ nodes: nodes.length, edges: edges.length }),
    };
  }

  Sci.graph = { build, subgraph, neighbors, searchNodes, render, KIND_COLORS, KIND_LABELS };
})(typeof window !== "undefined" ? window : globalThis);
