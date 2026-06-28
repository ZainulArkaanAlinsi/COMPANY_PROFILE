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

  /* Opsional: muat unit live dari MarketCheck bila sudah dikonfigurasi
     (api key / proxy di js/lib/marketcheck.js). Diam & pakai data lokal
     bila belum diatur atau bila gagal (CORS/kuota). Lihat MARKETCHECK.md. */
  if (PC.marketcheck) PC.marketcheck.init();
});
