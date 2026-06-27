// Toggle menu navigasi mobile pada halaman About
const navTogle = document.getElementById("nav_togle");
const navMenu = document.getElementById("nav_menu");

if (navTogle && navMenu) {
  navTogle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });

  // Tutup menu saat salah satu tautan diklik
  navMenu.querySelectorAll(".nav_link").forEach((link) => {
    link.addEventListener("click", () => navMenu.classList.remove("show"));
  });
}

/* Validasi form kontak (butuh js/lib/ui.js + js/components/forms.js) */
if (window.PC && PC.forms) {
  PC.forms.initContactAbout();
}
