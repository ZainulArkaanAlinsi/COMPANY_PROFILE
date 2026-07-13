/* ============================================================
   PC.catalog — grid katalog: pencarian, filter (kategori, merek,
   rentang harga), sort, dan pagination "muat lebih banyak".
   Katalog kini ratusan unit (kurasi + varian), jadi grid dirender
   bertahap 24 unit/halaman agar tetap ringan. Lihat SDD §5.5 & §6.2
   ============================================================ */
window.PC = window.PC || {};

PC.catalog = (function () {
  var $ = PC.ui.$, el = PC.ui.el, fmt = PC.format;
  var PAGE_SIZE = 24;
  var view = { q: "", category: "all", brand: "all", price: "all", sort: "featured", page: 1 };
  var refs = {};

  // Rentang harga (miliar Rupiah) untuk dropdown filter.
  var PRICE_BUCKETS = {
    all: null,
    "lt1": [0, 1e9],
    "1-5": [1e9, 5e9],
    "5-15": [5e9, 15e9],
    "gt15": [15e9, Infinity],
  };

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
    var bucket = PRICE_BUCKETS[view.price];
    var list = PC.cars.filter(function (c) {
      var okCat = view.category === "all" || c.category === view.category;
      var okBrand = view.brand === "all" || c.brand === view.brand;
      var okPrice = !bucket || (c.price >= bucket[0] && c.price < bucket[1]);
      var okQ = !q || (c.name + " " + c.brand + " " + c.badge).toLowerCase().indexOf(q) >= 0;
      return okCat && okBrand && okPrice && okQ;
    });
    if (view.sort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
    else if (view.sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
    else if (view.sort === "year-desc") list.sort(function (a, b) { return b.year - a.year; });
    // Default: unit kurasi & unggulan dulu, lalu sisanya.
    else list.sort(function (a, b) {
      return (b.featured ? 2 : b.variant ? 0 : 1) - (a.featured ? 2 : a.variant ? 0 : 1);
    });
    return list;
  }

  /* Render bertahap. reset=true → bersihkan grid & mulai dari halaman 1;
     reset=false → tambahkan (append) kartu halaman berikutnya. */
  function render(reset) {
    var grid = refs.grid;
    if (reset) { grid.innerHTML = ""; view.page = 1; }

    var list = filtered();

    if (!list.length) {
      grid.innerHTML = "";
      grid.appendChild(el("div", { class: "catalog-empty" }, [
        el("i", { class: "ri-search-eye-line", "aria-hidden": "true" }),
        el("p", {}, ["Tidak ada unit yang cocok dengan filter Anda."]),
      ]));
      if (refs.count) refs.count.textContent = "0 unit";
      if (refs.more) refs.more.hidden = true;
      return;
    }

    var already = grid.querySelectorAll(".product").length;
    var end = Math.min(view.page * PAGE_SIZE, list.length);
    var frag = document.createDocumentFragment();
    for (var i = already; i < end; i++) {
      var node = card(list[i]);
      node.style.animationDelay = ((i - already) * 0.03) + "s";
      frag.appendChild(node);
    }
    grid.appendChild(frag);

    if (refs.count) refs.count.textContent = "Menampilkan " + end + " dari " + list.length + " unit";
    if (refs.more) {
      refs.more.hidden = end >= list.length;
      refs.more.textContent = "Muat lebih banyak (" + (list.length - end) + " lagi)";
    }
  }

  /* Perubahan filter apa pun → kembali ke halaman 1 & render ulang. */
  function applyFilters() { render(true); }

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
        applyFilters();
      });
      refs.chips.appendChild(btn);
    });
  }

  function populateBrands() {
    if (!refs.brand) return;
    var opts = [el("option", { value: "all" }, ["Semua merek"])];
    PC.brands().forEach(function (b) { opts.push(el("option", { value: b }, [b])); });
    opts.forEach(function (o) { refs.brand.appendChild(o); });
  }

  function init() {
    refs.grid = $("#product-grid");
    refs.chips = $("#catalog-chips");
    refs.count = $("#catalog-count");
    refs.search = $("#catalog-search");
    refs.sort = $("#catalog-sort");
    refs.brand = $("#catalog-brand");
    refs.price = $("#catalog-price");
    refs.more = $("#catalog-more");
    if (!refs.grid) return;

    // filter awal dari query param (?cat=sport&q=bmw&brand=BMW)
    try {
      var params = new URLSearchParams(location.search);
      var cat = params.get("cat");
      if (cat && PC.categories.some(function (c) { return c.id === cat; })) view.category = cat;
      var q = params.get("q");
      if (q) { view.q = q; if (refs.search) refs.search.value = q; }
      var brand = params.get("brand");
      if (brand) view.brand = brand;
    } catch (e) { /* URLSearchParams tak didukung — abaikan */ }

    renderChips();
    populateBrands();
    if (refs.brand) refs.brand.value = view.brand;
    render(true);

    if (refs.search) {
      var t;
      refs.search.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () { view.q = refs.search.value; applyFilters(); }, 200);
      });
    }
    if (refs.sort) refs.sort.addEventListener("change", function () { view.sort = refs.sort.value; applyFilters(); });
    if (refs.brand) refs.brand.addEventListener("change", function () { view.brand = refs.brand.value; applyFilters(); });
    if (refs.price) refs.price.addEventListener("change", function () { view.price = refs.price.value; applyFilters(); });
    if (refs.more) refs.more.addEventListener("click", function () { view.page++; render(false); });
  }

  /** Render ulang dari PC.cars terkini (mis. setelah data API). */
  function refresh() {
    if (!refs.grid) return;
    renderChips();
    applyFilters();
  }

  return { init: init, refresh: refresh };
})();
