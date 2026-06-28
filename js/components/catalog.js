/* ============================================================
   PC.catalog — render grid, pencarian, filter kategori, sort,
   modal detail. Lihat SDD.md §5.5 & §6.2
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
        src: car.image, alt: car.name, loading: "lazy",
        onerror: function () { this.style.visibility = "hidden"; },
      }),
    ]);
    var node = el("article", { class: "product", "data-id": car.id, tabindex: "0" }, [
      el("span", { class: "product-badge" }, [car.badge || car.brand]),
      media,
      el("h3", {}, [car.name]),
      el("p", { class: "product-specs" }, [specChips(car)]),
      el("p", { class: "product-price" }, [fmt.rupiah(car.price)]),
      el("div", { class: "product-actions" }, [
        el("button", { class: "btn-ghost", type: "button", onclick: function (e) { e.stopPropagation(); openDetail(car); } }, ["Detail"]),
        el("button", { class: "btn-solid", type: "button", onclick: function (e) { e.stopPropagation(); buy(car); } }, ["Minati"]),
      ]),
    ]);
    node.addEventListener("click", function () { openDetail(car); });
    node.addEventListener("keydown", function (e) {
      if (e.key === "Enter") openDetail(car);
    });
    return node;
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
      list.forEach(function (c) { frag.appendChild(card(c)); });
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

  /* ---------------- Detail modal ---------------- */
  function specRow(label, value) {
    return el("div", { class: "spec-row" }, [
      el("span", { class: "spec-row__k" }, [label]),
      el("span", { class: "spec-row__v" }, [value]),
    ]);
  }
  function openDetail(car) {
    var s = car.specs;
    var content = el("div", { class: "detail" }, [
      el("div", { class: "detail__media" }, [el("img", { src: car.image, alt: car.name })]),
      el("div", { class: "detail__info" }, [
        el("span", { class: "detail__brand" }, [car.brand + " · " + car.year]),
        el("h2", { class: "detail__title" }, [car.name]),
        el("p", { class: "detail__price" }, [fmt.rupiah(car.price)]),
        el("div", { class: "detail__specs" }, [
          specRow("Kecepatan maks", s.topSpeed + " km/h"),
          specRow("Tenaga", s.power + " hp"),
          specRow("Kapasitas", s.seats + " kursi"),
          specRow("Transmisi", s.transmission),
          specRow("Kategori", (PC.categories.find(function (c) { return c.id === car.category; }) || {}).label || car.category),
        ]),
        el("div", { class: "detail__actions" }, [
          el("button", { class: "btn-solid", type: "button", onclick: function () { buy(car); PC.ui.modal.close(); } }, ["Tambah ke daftar minat"]),
          el("button", { class: "btn-link", type: "button", onclick: function () { PC.ui.modal.close(); PC.simulator && PC.simulator.prefill(car); } }, ["Simulasi cicilan »"]),
        ]),
      ]),
    ]);
    PC.ui.modal.open(content);
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

  return { init: init, openDetail: openDetail, refresh: refresh };
})();
