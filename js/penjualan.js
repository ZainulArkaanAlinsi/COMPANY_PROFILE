/* ============================================================
   Entry — Halaman Katalog. Inisialisasi seluruh komponen.
   Urutan: cart → catalog → simulator → forms → nav.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
   PC.cart.init();
   PC.catalog.init();
   PC.simulator.init();
   PC.forms.initContact();
   PC.nav.initCart();
   PC.nav.initMenu("#hamburger", "#nav-links", "active");

   /* ?sim=<id> — dikirim dari tombol "Buka simulator lengkap" di halaman
      detail unit: isi form cicilan dengan harga unit lalu gulir ke sana. */
   try {
      var simId = new URLSearchParams(location.search).get("sim");
      var simCar = simId && PC.getCar(simId);
      if (simCar) PC.simulator.prefill(simCar);
   } catch (e) { /* URLSearchParams tak didukung — abaikan */ }

   /* Fitur "Cek Spesifikasi" — data live API Ninjas via proxy /api/ninjas
       (jalankan node server/proxy.js atau deploy api/ninjas.js). Lihat
       API-NINJAS.md. Diam saat dibuka via file:// (lihat PC.carapi.available). */
   if (PC.specfinder) PC.specfinder.init();
   if (PC.carapiBrowser) PC.carapiBrowser.init();

   /* Scroll reveal, progress bar, dan count-up statistik */
   if (PC.ui) {
      PC.ui.initReveal();
      PC.ui.initScrollProgress();
      PC.ui.setCount(PC.ui.$("[data-count-cars]"), PC.cars.length);
      PC.ui.initCounters();
   }
});
