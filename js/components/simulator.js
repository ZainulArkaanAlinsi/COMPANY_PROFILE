/* ============================================================
   PC.simulator — simulasi cicilan (bunga flat). Lihat SDD.md §6.4
   ============================================================ */
window.PC = window.PC || {};

PC.simulator = (function () {
  var $ = PC.ui.$, fmt = PC.format;
  var refs = {};
  var RATE = 0.05; // bunga flat per tahun (5%)

  function compute() {
    var price = parseFloat(refs.price.value) || 0;
    var dp = parseFloat(refs.dp.value) || 0;
    var months = parseInt(refs.tenor.value, 10) || 12;

    if (price <= 0) { return show(null, "Masukkan harga unit."); }
    if (dp >= price) { return show(null, "Uang muka harus lebih kecil dari harga."); }
    if (dp < 0) { return show(null, "Uang muka tidak valid."); }

    var principal = price - dp;
    var years = months / 12;
    var totalLoan = principal * (1 + RATE * years);
    var monthly = totalLoan / months;

    show({
      monthly: monthly,
      principal: principal,
      totalLoan: totalLoan,
      totalPay: totalLoan + dp,
      months: months,
    });
  }

  function show(res, err) {
    if (err) {
      refs.out.innerHTML = "";
      refs.out.appendChild(PC.ui.el("p", { class: "sim-error" }, [
        PC.ui.el("i", { class: "ri-error-warning-line", "aria-hidden": "true" }), " " + err,
      ]));
      return;
    }
    refs.out.innerHTML = "";
    refs.out.appendChild(PC.ui.el("div", { class: "sim-result" }, [
      PC.ui.el("div", { class: "sim-result__main" }, [
        PC.ui.el("span", { class: "sim-result__label" }, ["Angsuran / bulan"]),
        PC.ui.el("strong", { class: "sim-result__value" }, [fmt.rupiah(res.monthly)]),
        PC.ui.el("span", { class: "sim-result__sub" }, ["selama " + res.months + " bulan · bunga flat 5%/th"]),
      ]),
      PC.ui.el("div", { class: "sim-result__rows" }, [
        rowKV("Pokok pinjaman", fmt.rupiah(res.principal)),
        rowKV("Total bunga", fmt.rupiah(res.totalLoan - res.principal)),
        rowKV("Total bayar (+DP)", fmt.rupiah(res.totalPay)),
      ]),
    ]));
  }
  function rowKV(k, v) {
    return PC.ui.el("div", { class: "sim-kv" }, [
      PC.ui.el("span", {}, [k]), PC.ui.el("span", {}, [v]),
    ]);
  }

  /** dipanggil dari modal detail: isi harga & gulir ke simulator */
  function prefill(car) {
    if (!refs.price) return;
    refs.price.value = car.price;
    refs.dp.value = Math.round(car.price * 0.2);
    if (refs.label) refs.label.textContent = "Simulasi untuk: " + car.name;
    compute();
    var sec = $("#simulasi");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function init() {
    refs.price = $("#sim-price");
    refs.dp = $("#sim-dp");
    refs.tenor = $("#sim-tenor");
    refs.out = $("#sim-output");
    refs.label = $("#sim-label");
    refs.form = $("#sim-form");
    if (!refs.form) return;

    refs.form.addEventListener("submit", function (e) { e.preventDefault(); compute(); });
    [refs.price, refs.dp, refs.tenor].forEach(function (inp) {
      inp.addEventListener("input", compute);
      inp.addEventListener("change", compute);
    });
  }

  return { init: init, prefill: prefill };
})();
