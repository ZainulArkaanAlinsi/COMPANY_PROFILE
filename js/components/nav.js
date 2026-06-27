/* ============================================================
   PC.nav — trigger keranjang + badge jumlah, toggle menu mobile.
   Lihat SDD.md §5.5
   ============================================================ */
window.PC = window.PC || {};

PC.nav = (function () {
  var $ = PC.ui.$;

  /** Tombol keranjang di header + badge angka yang sinkron dengan store. */
  function initCart() {
    var btn = $("#cart-btn");
    var badge = $("#cart-count");
    if (btn && PC.cart) btn.addEventListener("click", PC.cart.open);

    function update() {
      if (!badge) return;
      var n = PC.store.cart.count();
      badge.textContent = String(n);
      badge.classList.toggle("is-empty", n === 0);
    }
    PC.store.on("change:cart", update);
    update();
  }

  /** Toggle generic menu mobile: tombol menamb/menghapus class pada target. */
  function initMenu(btnSel, targetSel, cls) {
    var btn = $(btnSel), target = $(targetSel);
    if (!btn || !target) return;
    btn.addEventListener("click", function () { target.classList.toggle(cls); });
    target.addEventListener("click", function (e) {
      if (e.target.closest("a")) target.classList.remove(cls);
    });
  }

  return { initCart: initCart, initMenu: initMenu };
})();
