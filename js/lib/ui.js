/* ============================================================
   PC.ui — helper DOM, toast, reveal & counter. Lihat SDD.md §5.4
   Render aman (textContent / node) untuk cegah XSS.
   Butuh PC.format (dimuat lebih dulu) untuk memformat angka counter.
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
  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* [data-stagger="90"] menjadikan setiap anak langsung sebuah .reveal dengan
     transition-delay bertingkat, sehingga daftar/grid masuk beruntun. */
  function applyStagger() {
    $$("[data-stagger]").forEach(function (group) {
      var step = parseInt(group.getAttribute("data-stagger"), 10) || 80;
      Array.prototype.slice.call(group.children).forEach(function (child, i) {
        child.classList.add("reveal");
        child.style.transitionDelay = i * step + "ms";
      });
    });
  }

  function initReveal(selector) {
    selector = selector || ".reveal";
    applyStagger();
    var nodes = $$(selector);
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach(function (el) { el.classList.add("visible"); });
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
    nodes.forEach(function (el) {
      var delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.transitionDelay = delay + "ms";
      observer.observe(el);
    });
  }

  /* ---------------- Count-up statistik ---------------- */
  /* <strong data-count="29" data-suffix="+">29+</strong>
     Teks final tetap ditulis di HTML (aman untuk crawler & tanpa JS);
     JS hanya menghitungnya naik dari nol saat elemen terlihat. */
  function paintCount(node, value) {
    var decimals = parseInt(node.getAttribute("data-decimals"), 10) || 0;
    var shown = decimals
      ? value.toFixed(decimals).replace(".", ",")
      : PC.format.number(value);
    node.textContent = (node.getAttribute("data-prefix") || "") + shown + (node.getAttribute("data-suffix") || "");
  }

  function runCount(node) {
    var target = parseFloat(node.getAttribute("data-count"));
    if (isNaN(target)) return;
    if (prefersReducedMotion()) { paintCount(node, target); return; }
    var duration = parseInt(node.getAttribute("data-duration"), 10) || 1400;
    var start = performance.now();
    (function frame(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      paintCount(node, eased * target);
      if (p < 1) requestAnimationFrame(frame);
    })(start);
  }

  function initCounters(selector) {
    var nodes = $$(selector || "[data-count]");
    if (!nodes.length) return;
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach(function (n) { paintCount(n, parseFloat(n.getAttribute("data-count")) || 0); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        runCount(entry.target);
      });
    }, { threshold: 0.6 });
    nodes.forEach(function (n) {
      paintCount(n, 0);
      observer.observe(n);
    });
  }

  /** Setel target hitung sekaligus teks fallback-nya (mis. jumlah unit live). */
  function setCount(node, value) {
    if (!node) return;
    node.setAttribute("data-count", String(value));
    paintCount(node, value);
  }

  /* ---------------- Auto tahun copyright ---------------- */
  // Setiap elemen [data-year] otomatis diisi tahun berjalan (semua halaman
  // memuat ui.js → tak perlu wiring per-halaman). Footer cukup tulis
  // <span data-year>2026</span>.
  function initYear() {
    var y = String(new Date().getFullYear());
    $$("[data-year]").forEach(function (n) { n.textContent = y; });
  }
  document.addEventListener("DOMContentLoaded", initYear);

  return {
    $: $, $$: $$, el: el, toast: toast,
    initReveal: initReveal,
    initScrollProgress: initScrollProgress,
    initCounters: initCounters,
    setCount: setCount,
    initYear: initYear,
    prefersReducedMotion: prefersReducedMotion,
  };
})();
