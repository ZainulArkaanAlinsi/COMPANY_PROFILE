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
    PC.forms.initContact();
  }

  /* Scroll reveal, progress bar, dan count-up statistik */
  if (window.PC && PC.ui) {
    /* Jumlah unit & kategori diambil dari data agar tak basi saat koleksi
       bertambah. Kategori dikurangi satu: "Semua" bukan kategori. */
    PC.ui.setCount(PC.ui.$("[data-count-cars]"), PC.cars.length);
    PC.ui.setCount(PC.ui.$("[data-count-categories]"), PC.categories.length - 1);

    PC.ui.initReveal();
    PC.ui.initScrollProgress();
    PC.ui.initCounters();
  }
});
