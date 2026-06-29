/* ============================================================
   PC.specfinder — "Cek Spesifikasi Mobil" (API Ninjas /v1/cars)
   Input merek + model -> tampilkan spesifikasi nyata. Lihat PC.carapi.
   ============================================================ */
window.PC = window.PC || {};

PC.specfinder = (function () {
  var $, el, refs = {};
  var FUEL = { gas: "Bensin", diesel: "Diesel", electricity: "Listrik" };
  var TRANS = { a: "Otomatis", m: "Manual" };

  function title(s) {
    return String(s || "").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
  function kv(k, v) {
    return el("li", {}, [el("span", { class: "sf-k" }, [k]), el("span", { class: "sf-v" }, [v])]);
  }
  function card(c) {
    var engine = (c.cylinders ? c.cylinders + " silinder" : "—") +
      (c.displacement ? " · " + c.displacement + "L" : "");
    return el("article", { class: "sf-card" }, [
      el("span", { class: "sf-card__year" }, [String(c.year || "—")]),
      el("h4", {}, [title(c.make) + " " + title(c.model)]),
      el("span", { class: "sf-card__class" }, [title(c.class || "")]),
      el("ul", { class: "sf-specs" }, [
        kv("Mesin", engine),
        kv("Penggerak", (c.drive || "—").toUpperCase()),
        kv("Bahan bakar", FUEL[c.fuel_type] || title(c.fuel_type || "—")),
        kv("Transmisi", TRANS[c.transmission] || title(c.transmission || "—")),
      ]),
    ]);
  }

  function status(msg, kind) {
    refs.count.textContent = "";
    refs.results.innerHTML = "";
    refs.results.appendChild(
      el("p", { class: "sf-status" + (kind ? " sf-status--" + kind : "") }, [msg])
    );
  }

  function run() {
    var make = (refs.make.value || "").trim();
    var model = (refs.model.value || "").trim();
    if (!make || !model) return status("Isi merek dan model dulu (mis. BMW / M4).", "warn");
    if (!PC.carapi.available()) {
      return status("Jalankan lewat server (node server/proxy.js), bukan dibuka langsung sebagai file.", "warn");
    }
    status("Memuat spesifikasi…");
    PC.carapi.cars(make, model).then(function (list) {
      if (!Array.isArray(list) || !list.length) {
        return status('Tidak ada data untuk "' + make + " " + model + '". Coba model lain.', "warn");
      }
      refs.results.innerHTML = "";
      refs.results.appendChild(el("div", { class: "sf-grid" }, list.slice(0, 12).map(card)));
      refs.count.textContent = list.length + " varian ditemukan";
    }).catch(function (err) {
      status("Gagal memuat: " + err.message + " — pastikan API_NINJAS_KEY di-set di server.", "error");
    });
  }

  function init() {
    $ = PC.ui.$; el = PC.ui.el;
    refs.make = $("#sf-make");
    refs.model = $("#sf-model");
    refs.go = $("#sf-go");
    refs.results = $("#sf-results");
    refs.count = $("#sf-count");
    if (!refs.go) return;

    refs.go.addEventListener("click", run);
    [refs.make, refs.model].forEach(function (inp) {
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); run(); }
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll(".sf-chip"), function (ch) {
      ch.addEventListener("click", function () {
        refs.make.value = ch.getAttribute("data-make");
        refs.model.value = ch.getAttribute("data-model");
        run();
      });
    });
  }

  return { init: init, run: run };
})();
