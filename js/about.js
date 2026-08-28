document.addEventListener("DOMContentLoaded", function () {
  if (window.PC && PC.nav) {
    PC.nav.initMenu("#nav_togle", "#nav_menu", "show");
  } else {
    // Fallback: basic accessible toggle if shared nav not present
    const navTogle = document.getElementById("nav_togle");
    const navMenu = document.getElementById("nav_menu");
    if (navTogle && navMenu) {
      var navOpenLabel = "Buka menu";
      var navCloseLabel = "Tutup menu";
      navTogle.setAttribute("aria-expanded", "false");
      navTogle.setAttribute("aria-label", navOpenLabel);
      function setNavState(isOpen) {
        navMenu.classList.toggle("show", isOpen);
        navTogle.setAttribute("aria-expanded", String(isOpen));
        navTogle.setAttribute("aria-label", isOpen ? navCloseLabel : navOpenLabel);
      }
      function toggleNav() {
        var isOpen = navMenu.classList.toggle("show");
        setNavState(isOpen);
      }
      navTogle.addEventListener("click", toggleNav);
      navTogle.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleNav();
        }
      });
      navMenu.querySelectorAll(".nav_link").forEach((link) => {
        link.addEventListener("click", () => setNavState(false));
      });
    }
  }

  /* Validasi form kontak (butuh js/lib/ui.js + js/components/forms.js) */
  if (window.PC && PC.forms) {
    PC.forms.initContactAbout();
  }

  /* Scroll reveal observer dan progress bar */
  if (window.PC && PC.ui) {
    PC.ui.initReveal();
    PC.ui.initScrollProgress();
  }

  /* Statistik diambil dari data unit bila js/data/cars.js ikut dimuat, agar
     angkanya tidak lagi ditulis manual dan jadi basi saat katalog bertambah. */
  if (window.PC && Array.isArray(PC.cars)) {
    var unitsEl = document.querySelector('[data-stat="units"]');
    if (unitsEl) unitsEl.textContent = PC.cars.length + "+";
    var catEl = document.querySelector('[data-stat="categories"]');
    if (catEl && Array.isArray(PC.categories)) {
      // "Semua" adalah chip filter, bukan kategori unit — jangan ikut dihitung.
      catEl.textContent = String(PC.categories.filter(function (c) {
        return c.id !== "all";
      }).length);
    }
  }

  /* Count-up animation untuk statistik */
  function fmtInt(v) {
    try { return new Intl.NumberFormat("id-ID").format(v); }
    catch (e) { return String(v); }
  }
  var stats = document.querySelectorAll('.stat strong');
  if (stats.length && typeof IntersectionObserver !== 'undefined') {
    var counted = false;
    var obs = new IntersectionObserver(function (entries) {
      if (counted) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          counted = true;
          stats.forEach(function (el) {
            var raw = el.textContent.trim();
            var suffix = raw.replace(/[\d.,]+/g, '');
            // Format id-ID: titik = pemisah ribuan, koma = desimal. Tanpa
            // pembersihan ini "1.200" terbaca parseFloat sebagai 1,2.
            var digits = raw.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.');
            var num = parseFloat(digits);
            if (isNaN(num)) return;
            // Kembalikan ke gaya id-ID (titik ribuan, koma desimal) supaya
            // hasil animasi tampil sama persis dengan teks aslinya.
            var render = num % 1 === 0
              ? function (v) { return fmtInt(Math.round(v)); }
              : function (v) { return v.toFixed(1).replace(".", ","); };
            var duration = 1200;
            var start = performance.now();
            function frame(now) {
              var p = Math.min((now - start) / duration, 1);
              var eased = 1 - Math.pow(1 - p, 3);
              var current = eased * num;
              el.textContent = render(current) + suffix;
              if (p < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    obs.observe(document.querySelector('.about_stats') || document.body);
  }
});
