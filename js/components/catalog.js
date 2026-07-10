/* ============================================================
   PC.catalog — render grid, pencarian, filter kategori, sort.
   Klik kartu menuju halaman detail unit (mobil/<id>.html) yang
   digenerate scripts/build-cars.mjs. Lihat SDD.md §5.5 & §6.2
   ============================================================ */
window.PC = window.PC || {};

PC.catalog = (function () {
  var $ = PC.ui.$, el = PC.ui.el, fmt = PC.format;
  var view = { q: "", category: "all", sort: "featured" };
  var refs = {};

  function specChips(car) {
    var s = car.specs;
    return [s.topSpeed + " km/h", s.power + " hp", s.seats + " kursi"].join("  ·  ");
  }

  function card(car) {
    var media = el("div", { class: "product-media" }, [
      el("img", {
        src: PC.asset(car.image), alt: car.name, loading: "lazy",
        onerror: function () { this.style.visibility = "hidden"; },
      }),
    ]);
    /* Judul adalah tautan asli (bisa dirayapi & dibuka di tab baru); pseudo-
       element-nya melebar ke seluruh kartu agar area kliknya tetap penuh. */
    var link = el("a", { class: "product-link", href: PC.asset(PC.carUrl(car)) }, [car.name]);
    return el("article", { class: "product", "data-id": car.id }, [
      el("span", { class: "product-badge" }, [car.badge || car.brand]),
      media,
      el("h3", {}, [link]),
      el("p", { class: "product-specs" }, [specChips(car)]),
      el("p", { class: "product-price" }, [fmt.rupiah(car.price)]),
      el("div", { class: "product-actions" }, [
        el("a", { class: "btn-ghost", href: PC.asset(PC.carUrl(car)) }, ["Detail"]),
        el("button", { class: "btn-solid", type: "button", onclick: function () { buy(car); } }, ["Minati"]),
      ]),
    ]);
  }

  function buy(car) {
    PC.store.cart.add(car.id);
    PC.ui.toast(car.name + " ditambahkan ke daftar minat", "success");
  }

  function filtered() {
    var q = view.q.trim().toLowerCase();
    var list = PC.cars.filter(function (c) {
      var okCat = view.category === "all" || c.category === view.category;
      var okQ = !q || (c.name + " " + c.brand + " " + c.badge).toLowerCase().indexOf(q) >= 0;
      return okCat && okQ;
    });
    if (view.sort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
    else if (view.sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
    else if (view.sort === "year-desc") list.sort(function (a, b) { return b.year - a.year; });
    else list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    return list;
  }

  function renderGrid() {
    var list = filtered();
    var grid = refs.grid;
    grid.innerHTML = "";
    if (!list.length) {
      grid.appendChild(el("div", { class: "catalog-empty" }, [
        el("i", { class: "ri-search-eye-line", "aria-hidden": "true" }),
        el("p", {}, ["Tidak ada unit yang cocok dengan pencarian Anda."]),
      ]));
    } else {
      var frag = document.createDocumentFragment();
      list.forEach(function (c, i) {
        var node = card(c);
        node.style.animationDelay = (i * 0.05) + "s";
        frag.appendChild(node);
      });
      grid.appendChild(frag);
    }
    if (refs.count) refs.count.textContent = "Menampilkan " + list.length + " unit";
  }

  function renderChips() {
    refs.chips.innerHTML = "";
    PC.categories.forEach(function (cat) {
      var btn = el("button", {
        class: "chip" + (view.category === cat.id ? " is-active" : ""),
        type: "button",
        "aria-pressed": view.category === cat.id ? "true" : "false",
      }, [el("i", { class: cat.icon, "aria-hidden": "true" }), el("span", { text: cat.label })]);
      btn.addEventListener("click", function () {
        view.category = cat.id;
        renderChips();
        renderGrid();
      });
      refs.chips.appendChild(btn);
    });
  }

  function init() {
    refs.grid = $("#product-grid");
    refs.chips = $("#catalog-chips");
    refs.count = $("#catalog-count");
    refs.search = $("#catalog-search");
    refs.sort = $("#catalog-sort");
    if (!refs.grid) return;

    // filter awal dari query param (?cat=sport&q=bmw)
    try {
      var params = new URLSearchParams(location.search);
      var cat = params.get("cat");
      if (cat && PC.categories.some(function (c) { return c.id === cat; })) view.category = cat;
      var q = params.get("q");
      if (q) { view.q = q; if (refs.search) refs.search.value = q; }
    } catch (e) { /* URLSearchParams tak didukung — abaikan */ }

    renderChips();
    renderGrid();

    if (refs.search) {
      var t;
      refs.search.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () { view.q = refs.search.value; renderGrid(); }, 200);
      });
    }
    if (refs.sort) {
      refs.sort.addEventListener("change", function () { view.sort = refs.sort.value; renderGrid(); });
    }
  }

  /** Render ulang chips + grid dari PC.cars terkini (mis. setelah data API). */
  function refresh() {
    if (!refs.grid) return;
    renderChips();
    renderGrid();
  }

  return { init: init, refresh: refresh };
})();
