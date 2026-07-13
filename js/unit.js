/* ============================================================
   Entry — Halaman detail dinamis (mobil/unit.html?id=<id>).
   Melayani unit VARIAN (yang tak punya halaman statis). Merender
   DOM yang sama dengan halaman statis (scripts/build-cars.mjs) dari
   objek mobil di PC.cars, lalu memasang interaksi keranjang, tenor
   cicilan, counter, dan reveal.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  var el = PC.ui.el, fmt = PC.format;
  var root = PC.ui.$("#unit-root");

  PC.cart.init();
  PC.nav.initCart();
  PC.nav.initMenu("#hamburger", "#nav-links", "active");

  var id = "";
  try { id = new URLSearchParams(location.search).get("id") || ""; } catch (e) { /* abaikan */ }
  var car = id && PC.getCar(id);

  if (!car) {
    root.appendChild(el("section", { class: "unit-notfound" }, [
      el("h1", {}, ["Unit tidak ditemukan"]),
      el("p", {}, ["Unit yang Anda cari tidak tersedia atau tautannya tidak valid."]),
      el("a", { class: "btn-solid", href: PC.asset("penjualan.html") }, ["Kembali ke katalog"]),
    ]));
    document.title = "Unit tidak ditemukan — PREMIUM CARS";
    return;
  }

  render(car);
  wire(car);

  /* ---------------- Render ---------------- */
  function render(car) {
    var s = car.specs;
    document.title = car.name + " — PREMIUM CARS";
    setMeta("description", car.tagline + " " + fmt.number(s.power) + " hp · " + fmt.number(s.topSpeed) +
      " km/h · " + fmt.compactRupiah(car.price) + " di PREMIUM CARS.");

    root.appendChild(crumbs(car));
    root.appendChild(hero(car));
    root.appendChild(about(car));
    root.appendChild(cicilan(car));
    root.appendChild(related(car));
  }

  function setMeta(name, content) {
    var m = document.querySelector('meta[name="' + name + '"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", name); document.head.appendChild(m); }
    m.setAttribute("content", content);
  }

  function crumbs(car) {
    return el("nav", { class: "crumbs", "aria-label": "Breadcrumb" }, [
      el("a", { href: PC.asset("index.html") }, ["Home"]),
      el("span", { "aria-hidden": "true" }, ["/"]),
      el("a", { href: PC.asset("penjualan.html") }, ["Katalog"]),
      el("span", { "aria-hidden": "true" }, ["/"]),
      el("a", { href: PC.asset("penjualan.html?cat=" + car.category) }, [PC.categoryLabel(car.category)]),
      el("span", { "aria-hidden": "true" }, ["/"]),
      el("span", { "aria-current": "page" }, [car.name]),
    ]);
  }

  function stat(value, suffix, label) {
    return el("div", { class: "unit-stat" }, [
      el("strong", { "data-count": String(value), "data-suffix": " " + suffix }, [fmt.number(value) + " " + suffix]),
      el("span", {}, [label]),
    ]);
  }

  function hero(car) {
    var s = car.specs;
    var waText = "Halo PREMIUM CARS, saya tertarik dengan " + car.name + " (" + fmt.rupiah(car.price) +
      "). Mohon info ketersediaan dan test drive.";
    var waUrl = "https://wa.me/622151408888?text=" + encodeURIComponent(waText);

    return el("section", { class: "unit-hero" }, [
      el("div", { class: "unit-hero__media anim-up d1" }, [
        el("span", { class: "unit-hero__badge" }, [car.badge]),
        el("img", { src: PC.asset(car.image), alt: car.name, width: "900", height: "600" }),
      ]),
      el("div", { class: "unit-hero__body" }, [
        el("p", { class: "kicker anim-up d1" }, [
          el("span", { class: "kicker__dot", "aria-hidden": "true" }), car.brand + " · " + car.year,
        ]),
        el("h1", { class: "unit-hero__title anim-up d2" }, [car.name]),
        el("p", { class: "unit-hero__tagline anim-up d3" }, [car.tagline]),
        el("p", { class: "unit-hero__price anim-up d3" }, [fmt.rupiah(car.price)]),
        el("div", { class: "unit-stats anim-up d4" }, [
          stat(s.topSpeed, "km/h", "Kecepatan maks"),
          stat(s.power, "hp", "Tenaga"),
          stat(s.seats, "kursi", "Kapasitas"),
        ]),
        el("div", { class: "unit-hero__actions anim-up d4" }, [
          el("button", { class: "btn-solid", type: "button", id: "unit-add", "data-car": car.id }, ["Tambah ke daftar minat"]),
          el("a", { class: "btn-ghost", href: waUrl, target: "_blank", rel: "noreferrer" }, [
            el("i", { class: "ri-whatsapp-line", "aria-hidden": "true" }), " Tanya via WhatsApp",
          ]),
        ]),
      ]),
    ]);
  }

  function specRow(k, v) {
    return el("div", { class: "spec-row" }, [
      el("span", { class: "spec-row__k" }, [k]),
      el("span", { class: "spec-row__v" }, [v]),
    ]);
  }

  function sectionHead(num, kicker, title) {
    return [
      el("div", { class: "reveal reveal--rule", "aria-hidden": "true" }),
      el("div", { class: "unit-section__head" }, [
        el("p", { class: "kicker" }, [el("span", { class: "kicker__num" }, [num]), " " + kicker]),
        el("h2", {}, [title]),
      ]),
    ];
  }

  function about(car) {
    var s = car.specs;
    var noun = PC.categoryNoun(car.category);
    var intro = PC.categoryIntro[car.category] || "";
    return el("section", { class: "unit-section reveal", id: "tentang" },
      sectionHead("01", "Tentang unit", "SEKILAS").concat([
        el("div", { class: "unit-grid" }, [
          el("div", { class: "unit-prose" }, [
            el("p", {}, [car.name + " adalah " + noun + " " + car.brand + " tahun " + car.year + ". " + car.tagline]),
            el("p", {}, [intro]),
            el("p", {}, ["Setiap unit yang masuk showroom kami lewat pemeriksaan kondisi mesin, kelengkapan dokumen, dan penelusuran riwayat perawatan sebelum ditawarkan. Jadwalkan inspeksi langsung atau test drive kapan pun Anda siap."]),
          ]),
          el("div", { class: "unit-specs" }, [
            el("h3", { class: "unit-specs__title" }, ["Spesifikasi"]),
            specRow("Merek", car.brand),
            specRow("Tahun", String(car.year)),
            specRow("Kategori", PC.categoryLabel(car.category)),
            specRow("Kecepatan maks", fmt.number(s.topSpeed) + " km/h"),
            specRow("Tenaga", fmt.number(s.power) + " hp"),
            specRow("Kapasitas", fmt.number(s.seats) + " kursi"),
            specRow("Transmisi", s.transmission),
            specRow("Harga", fmt.rupiah(car.price)),
          ]),
        ]),
      ]));
  }

  function cicilan(car) {
    var dp = Math.round(car.price * 0.2);
    var res = PC.simulator.estimate(car.price, dp, 36);
    var chips = [12, 24, 36, 48, 60].map(function (m) {
      return el("button", {
        class: "tenor-chip" + (m === 36 ? " is-active" : ""),
        type: "button", "data-tenor": String(m), "aria-pressed": m === 36 ? "true" : "false",
      }, [m + " bln"]);
    });

    return el("section", { class: "unit-section reveal", id: "cicilan" },
      sectionHead("02", "Cicilan", "ESTIMASI ANGSURAN").concat([
        el("div", { class: "unit-sim", "data-price": String(car.price) }, [
          el("div", { class: "unit-sim__panel" }, [
            el("span", { class: "unit-sim__label" }, ["Angsuran per bulan"]),
            el("strong", { class: "unit-sim__value", id: "unit-sim-monthly" }, [fmt.rupiah(res.monthly)]),
            el("span", { class: "unit-sim__sub", id: "unit-sim-sub" }, [
              "DP 20% (" + fmt.rupiah(dp) + ") · tenor 36 bulan · bunga flat 5%/th",
            ]),
          ]),
          el("div", { class: "unit-sim__controls" }, [
            el("span", { class: "unit-sim__hint" }, ["Ganti tenor"]),
            el("div", { class: "tenor-chips", role: "group", "aria-label": "Pilih tenor" }, chips),
            el("a", { class: "btn-link", href: PC.asset("penjualan.html?sim=" + car.id) }, ["Buka simulator lengkap »"]),
          ]),
        ]),
        el("p", { class: "unit-sim__note" }, ["Estimasi memakai bunga flat 5% per tahun dan bersifat indikatif — bukan penawaran kredit resmi."]),
      ]));
  }

  function relatedCard(c) {
    return el("a", { class: "unit-card", href: PC.asset(PC.carUrl(c)) }, [
      el("div", { class: "unit-card__media" }, [el("img", { src: PC.asset(c.image), alt: c.name, loading: "lazy" })]),
      el("span", { class: "unit-card__badge" }, [c.badge]),
      el("h3", { class: "unit-card__name" }, [c.name]),
      el("p", { class: "unit-card__meta" }, [c.brand + " · " + c.year]),
      el("p", { class: "unit-card__price" }, [fmt.rupiah(c.price)]),
      el("span", { class: "unit-card__cta" }, ["Lihat unit ", el("i", { class: "ri-arrow-right-up-line", "aria-hidden": "true" })]),
    ]);
  }

  function related(car) {
    var cards = PC.relatedCars(car, 3).map(relatedCard);
    return el("section", { class: "unit-section reveal", id: "serupa" },
      sectionHead("03", "Unit serupa", "MUNGKIN ANDA SUKA").concat([
        el("div", { class: "unit-cards", "data-stagger": "110" }, cards),
      ]));
  }

  /* ---------------- Interaksi ---------------- */
  function wire(car) {
    var $ = PC.ui.$;

    var addBtn = $("#unit-add");
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        PC.store.cart.add(car.id);
        PC.ui.toast(car.name + " ditambahkan ke daftar minat", "success");
      });
    }

    var sim = $(".unit-sim");
    if (sim && PC.simulator) {
      var price = parseFloat(sim.getAttribute("data-price")) || 0;
      var dp = Math.round(price * 0.2);
      var monthlyEl = $("#unit-sim-monthly");
      var subEl = $("#unit-sim-sub");
      sim.addEventListener("click", function (e) {
        var chip = e.target.closest(".tenor-chip");
        if (!chip) return;
        var months = parseInt(chip.getAttribute("data-tenor"), 10);
        var res = PC.simulator.estimate(price, dp, months);
        PC.ui.$$(".tenor-chip", sim).forEach(function (c) {
          var active = c === chip;
          c.classList.toggle("is-active", active);
          c.setAttribute("aria-pressed", String(active));
        });
        monthlyEl.textContent = fmt.rupiah(res.monthly);
        subEl.textContent = "DP 20% (" + fmt.rupiah(dp) + ") · tenor " + months +
          " bulan · bunga flat " + Math.round(PC.simulator.RATE * 100) + "%/th";
      });
    }

    PC.ui.initReveal();
    PC.ui.initScrollProgress();
    PC.ui.initCounters();
  }
});
