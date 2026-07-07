/* ============================================================
   Entry — Halaman Katalog. Inisialisasi seluruh komponen.
   Urutan: cart → catalog → simulator → forms → nav.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
   PC.cart.init();
   PC.catalog.init();
   PC.simulator.init();
   PC.forms.initContactPenjualan();
   PC.nav.initCart();
   PC.nav.initMenu("#hamburger", "#nav-links", "active");

   /* Fitur "Cek Spesifikasi" — data live API Ninjas via proxy /api/ninjas
       (jalankan node server/proxy.js atau deploy api/ninjas.js). Lihat
       API-NINJAS.md. Diam saat dibuka via file:// (lihat PC.carapi.available). */
    if (PC.specfinder) PC.specfinder.init();
    if (PC.carapiBrowser) PC.carapiBrowser.init();

    /* Scroll reveal observer dan progress bar */
    if (PC.ui) {
      PC.ui.initReveal();
      PC.ui.initScrollProgress();
    }
});
