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
});
