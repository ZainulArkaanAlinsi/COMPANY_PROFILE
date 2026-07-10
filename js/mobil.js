/* ============================================================
   Entry — Halaman detail unit (mobil/<id>.html).
   Halamannya sudah dirender statis oleh scripts/build-cars.mjs;
   skrip ini hanya menambah interaksi: daftar minat, tenor cicilan,
   counter, reveal.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  var $ = PC.ui.$;

  PC.cart.init();
  PC.nav.initCart();
  PC.nav.initMenu("#hamburger", "#nav-links", "active");

  /* ---------------- Tambah ke daftar minat ---------------- */
  var addBtn = $("#unit-add");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      var car = PC.getCar(addBtn.getAttribute("data-car"));
      if (!car) return;
      PC.store.cart.add(car.id);
      PC.ui.toast(car.name + " ditambahkan ke daftar minat", "success");
    });
  }

  /* ---------------- Tenor cicilan ---------------- */
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
      monthlyEl.textContent = PC.format.rupiah(res.monthly);
      subEl.textContent =
        "DP 20% (" + PC.format.rupiah(dp) + ") · tenor " + months +
        " bulan · bunga flat " + Math.round(PC.simulator.RATE * 100) + "%/th";
    });
  }

  PC.ui.initReveal();
  PC.ui.initScrollProgress();
  PC.ui.initCounters();
});
