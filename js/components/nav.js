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
    var openLabel = btn.getAttribute("aria-label") || "Buka menu";
    var closeLabel = openLabel.toLowerCase().includes("tutup") ? openLabel : "Tutup menu";
    function setMenuState(isOpen) {
      btn.setAttribute("aria-expanded", String(isOpen));
      btn.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
    }
    setMenuState(false);
    function toggleMenu() {
      var isOpen = target.classList.toggle(cls);
      setMenuState(isOpen);
    }
    btn.addEventListener("click", toggleMenu);
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
    target.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        target.classList.remove(cls);
        setMenuState(false);
      }
    });
  }

  return { initCart: initCart, initMenu: initMenu };
})();
