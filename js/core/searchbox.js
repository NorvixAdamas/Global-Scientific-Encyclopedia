/* =========================================================================
   Accessible scientific search field (combobox) used by the header, the atlas
   hero and the search page. Local suggestions are instant; PubChem
   autocomplete is debounced and clearly attributed.
   ========================================================================= */
(function (root) {
  "use strict";
  const Sci = (root.Sci = root.Sci || {});
  const U = Sci.util;
  const h = U.html;
  const raw = U.raw;

  let uid = 0;

  function create(mount, opts) {
    const o = opts || {};
    const id = "sci-search-" + ++uid;
    const listId = id + "-list";
    mount.innerHTML = `
      <form class="sci-search ${o.compact ? "compact" : ""}" role="search" autocomplete="off">
        <span class="sci-search-icon" aria-hidden="true">⌕</span>
        <input id="${id}" type="search" name="q" role="combobox" aria-autocomplete="list"
          aria-expanded="false" aria-controls="${listId}"
          placeholder="${U.esc(o.placeholder || "Tìm hợp chất, phản ứng, thuốc, protein, DOI…")}"
          ${o.value ? `value="${U.esc(o.value)}"` : ""}
          spellcheck="false" />
        <kbd class="sci-search-kbd" aria-hidden="true">/</kbd>
        <div class="sci-search-drop" id="${listId}" role="listbox" hidden></div>
      </form>`;

    const form = mount.querySelector("form");
    const input = mount.querySelector("input");
    const drop = mount.querySelector(".sci-search-drop");
    let items = [];
    let active = -1;
    let remoteTerms = [];
    let reqSeq = 0;

    function setOpen(open) {
      drop.hidden = !open;
      input.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) {
        active = -1;
        drop.innerHTML = "";
      }
    }

    function paint() {
      const q = input.value.trim();
      const rows = [];
      items.forEach((it, i) => {
        rows.push(
          h`<a role="option" id="${listId}-opt-${i}" aria-selected="${i === active}" class="drop-item ${i === active ? "active" : ""}"
            href="${it.route}" data-idx="${i}">
            <span class="drop-kind">${Sci.search.kindLabel(it.kind)}</span>
            <span class="drop-label">${it.label}</span>
            ${it.sub ? h`<span class="drop-sub">${it.sub}</span>` : raw("")}
          </a>`
        );
      });
      if (remoteTerms.length) {
        remoteTerms.slice(0, 4).forEach((term, i) => {
          const idx = items.length + i;
          rows.push(
            h`<a role="option" id="${listId}-opt-${idx}" aria-selected="false" class="drop-item drop-remote"
              href="#/search?q=${encodeURIComponent(term)}" data-idx="${idx}" data-query="${term}">
              <span class="drop-kind drop-kind-remote">PubChem gợi ý</span>
              <span class="drop-label">${term}</span>
            </a>`
          );
        });
      }
      if (q) {
        rows.push(
          h`<a role="option" class="drop-item drop-all" href="#/search?q=${encodeURIComponent(q)}">
            <span class="drop-kind">Tìm kiếm</span>
            <span class="drop-label">Xem tất cả kết quả cho “${q}”</span>
            <span class="drop-sub">cục bộ + 11 nguồn trực tiếp</span>
          </a>`
        );
      }
      if (!rows.length) {
        drop.innerHTML = h`<p class="drop-empty">Nhập tên chất, CID, InChIKey, DOI hoặc SMILES…</p>`;
        return;
      }
      drop.innerHTML = rows.join("");
      setOpen(true);
    }

    function refreshLocal() {
      const q = input.value.trim();
      if (q.length < 2) {
        items = [];
        remoteTerms = [];
        setOpen(false);
        return;
      }
      items = Sci.search.suggestLocal(q, 6);
      remoteTerms = [];
      paint();
      const seq = ++reqSeq;
      if (!/[\s]/.test(q) && q.length >= 3 && Sci.search.detectIdentifier(q).type === "text") {
        clearTimeout(refreshLocal._t);
        refreshLocal._t = setTimeout(async () => {
          try {
            const terms = await Sci.adapters.pubchem.autocomplete(q);
            if (seq !== reqSeq || input.value.trim() !== q) return;
            remoteTerms = terms.filter((t) => t.toLowerCase() !== q.toLowerCase());
            paint();
          } catch (e) {
            /* autocomplete is an enhancement only */
          }
        }, 260);
      }
    }

    function go(href) {
      setOpen(false);
      if (o.onNavigate) o.onNavigate(href);
      else location.hash = href.replace(/^#/, "");
    }

    U.on(input, "input", U.debounce(refreshLocal, 120));
    U.on(input, "focus", () => {
      if (input.value.trim().length >= 2) refreshLocal();
    });
    U.on(input, "keydown", (e) => {
      const options = Array.from(drop.querySelectorAll(".drop-item"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        active = Math.min(options.length - 1, active + 1);
        syncActive(options);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = Math.max(-1, active - 1);
        syncActive(options);
      } else if (e.key === "Enter") {
        if (active >= 0 && options[active]) {
          e.preventDefault();
          options[active].click();
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        input.blur();
      }
    });

    function syncActive(options) {
      options.forEach((el, i) => {
        el.classList.toggle("active", i === active);
        el.setAttribute("aria-selected", i === active ? "true" : "false");
      });
      if (active >= 0 && options[active]) {
        input.setAttribute("aria-activedescendant", options[active].id);
        options[active].scrollIntoView({ block: "nearest" });
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    }

    U.on(drop, "mousedown", (e) => {
      const a = e.target.closest("a.drop-item");
      if (!a) return;
      e.preventDefault();
      go(a.getAttribute("href"));
    });

    U.on(form, "submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      if (o.onSubmit) o.onSubmit(q);
      else go("#/search?q=" + encodeURIComponent(q));
    });

    U.on(document, "click", (e) => {
      if (!mount.contains(e.target)) setOpen(false);
    });

    return {
      input,
      focus() {
        input.focus();
        input.select();
      },
      value(v) {
        input.value = v || "";
      },
      destroy() {
        mount.innerHTML = "";
      },
    };
  }

  Sci.searchBox = { create };
})(typeof window !== "undefined" ? window : globalThis);
