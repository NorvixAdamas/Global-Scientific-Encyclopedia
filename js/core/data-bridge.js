/* =========================================================================
   Legacy data bridge
   -------------------------------------------------------------------------
   Legacy files declare their datasets with top-level `const`, which creates
   bindings in the global lexical scope but does NOT attach them to `window`.
   New V2 modules read `window.ELEMENTS`, `window.REACTIONS`, … so this small
   script copies those bindings onto the window object. It must load AFTER the
   legacy data scripts and BEFORE the V2 core modules.
   ========================================================================= */
(function (root) {
  "use strict";
  const names = [
    "CAT_LABELS",
    "ELEMENTS",
    "THEORETICAL_ELEMENTS",
    "RXN_CATS",
    "REACTIONS",
    "MAT_CATS",
    "MATERIALS",
    "DRUGS",
  ];
  const bridge = {
    CAT_LABELS: typeof CAT_LABELS !== "undefined" ? CAT_LABELS : undefined,
    ELEMENTS: typeof ELEMENTS !== "undefined" ? ELEMENTS : undefined,
    THEORETICAL_ELEMENTS: typeof THEORETICAL_ELEMENTS !== "undefined" ? THEORETICAL_ELEMENTS : undefined,
    RXN_CATS: typeof RXN_CATS !== "undefined" ? RXN_CATS : undefined,
    REACTIONS: typeof REACTIONS !== "undefined" ? REACTIONS : undefined,
    MAT_CATS: typeof MAT_CATS !== "undefined" ? MAT_CATS : undefined,
    MATERIALS: typeof MATERIALS !== "undefined" ? MATERIALS : undefined,
    DRUGS: typeof DRUGS !== "undefined" ? DRUGS : undefined,
  };
  names.forEach(function (name) {
    if (typeof bridge[name] !== "undefined" && typeof root[name] === "undefined") {
      root[name] = bridge[name];
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
