/* ============================================================
   PC.ui — helper DOM, toast, modal. Lihat SDD.md §5.4
   Render aman (textContent / node) untuk cegah XSS.
   ============================================================ */
window.PC = window.PC || {};

PC.ui = (function () {
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /** el("button", {class:"btn", "aria-label":"x", onclick:fn}, ["teks", node]) */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v; // hanya untuk markup ikon tepercaya
      else if (k === "text") node.textContent = v;
      else if (k.indexOf("on") === 0 && typeof v === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v != null && v !== false) {
        node.setAttribute(k, v === true ? "" : v);
      }
    });
    (children == null ? [] : [].concat(children)).forEach(function (c) {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  /* ---------------- Toast ---------------- */
  var toastHost = null;
  function ensureToastHost() {
    if (!toastHost) {
      toastHost = el("div", { class: "toast-host", "aria-live": "polite", "aria-atomic": "true" });
      document.body.appendChild(toastHost);
    }
    return toastHost;
  }
  var icons = { success: "ri-checkbox-circle-line", error: "ri-error-warning-line", info: "ri-information-line" };
  function toast(message, type) {
    type = type || "info";
    var host = ensureToastHost();
    var node = el("div", { class: "toast toast--" + type, role: "status" }, [
      el("i", { class: icons[type] || icons.info, "aria-hidden": "true" }),
      el("span", { text: message }),
    ]);
    host.appendChild(node);
    requestAnimationFrame(function () { node.classList.add("is-in"); });
    var t = setTimeout(close, 3200);
    node.addEventListener("click", close);
    function close() {
      clearTimeout(t);
      node.classList.remove("is-in");
      node.addEventListener("transitionend", function () { node.remove(); }, { once: true });
      setTimeout(function () { if (node.parentNode) node.remove(); }, 400);
    }
  }

  /* ---------------- Modal ---------------- */
  var modalRoot = null, lastFocus = null;
  function buildModalRoot() {
    modalRoot = el("div", { class: "modal", "aria-hidden": "true" }, [
      el("div", { class: "modal__overlay", "data-close": "true" }),
      el("div", { class: "modal__dialog", role: "dialog", "aria-modal": "true", tabindex: "-1" }),
    ]);
    document.body.appendChild(modalRoot);
    modalRoot.addEventListener("click", function (e) {
      if (e.target.getAttribute("data-close") != null) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") trap(e);
    });
  }
  function isOpen() { return modalRoot && modalRoot.classList.contains("is-open"); }
  function dialog() { return $(".modal__dialog", modalRoot); }
  function trap(e) {
    var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', dialog());
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function open(node) {
    if (!modalRoot) buildModalRoot();
    lastFocus = document.activeElement;
    var d = dialog();
    d.innerHTML = "";
    var closeBtn = el("button", { class: "modal__close", "aria-label": "Tutup", "data-close": "true" },
      [el("i", { class: "ri-close-line", "aria-hidden": "true" })]);
    d.appendChild(closeBtn);
    d.appendChild(node);
    modalRoot.classList.add("is-open");
    modalRoot.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { d.focus(); });
  }
  function close() {
    if (!isOpen()) return;
    modalRoot.classList.remove("is-open");
    modalRoot.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    var bar = document.getElementById("scroll-progress");
    if (!bar) return;
    var winHeight, docHeight;
    function update() {
      winHeight = window.innerHeight;
      docHeight = document.documentElement.scrollHeight - winHeight;
      if (docHeight <= 0) { bar.style.width = "0%"; return; }
      bar.style.width = Math.min((window.scrollY / docHeight) * 100, 100) + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ---------------- Scroll reveal observer ---------------- */
  function initReveal(selector) {
    selector = selector || ".reveal";
    if (typeof IntersectionObserver === "undefined") {
      $$(selector).forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    $$(selector).forEach(function (el) { observer.observe(el); });
  }

  return { $: $, $$: $$, el: el, toast: toast, modal: { open: open, close: close, isOpen: isOpen }, initReveal: initReveal, initScrollProgress: initScrollProgress };
})();
