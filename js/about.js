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

  /* Count-up animation untuk statistik */
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
            var num = parseFloat(raw.replace(/[^\d.,]/g, '').replace(',', '.'));
            if (isNaN(num)) return;
            var duration = 1200;
            var start = performance.now();
            function frame(now) {
              var p = Math.min((now - start) / duration, 1);
              var eased = 1 - Math.pow(1 - p, 3);
              var current = eased * num;
              el.textContent = (num % 1 === 0 ? Math.round(current) : current.toFixed(1)) + suffix;
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
