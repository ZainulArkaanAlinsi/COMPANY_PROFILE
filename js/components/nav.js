/* ============================================================
   PC.nav — trigger keranjang + badge jumlah, toggle menu mobile.
   Lihat SDD.md §5.5
   ============================================================ */
window.PC = window.PC || {};

PC.nav = (function () {
  var $ = PC.ui.$;

  /** Tombol keranjang di header + badge angka yang sinkron dengan store. */
  function initCart() {
    // PC.store hanya dimuat di halaman katalog; tanpa guard ini pemanggilan
    // dari halaman lain melempar TypeError.
    if (!PC.store || !PC.store.cart) return;
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

  /** Toggle generic menu mobile: tombol menambah/menghapus class pada target.
   *  Ikon ditukar bila tombol menyediakan data-icon-open / data-icon-close
   *  (tiap halaman memakai set ikon berbeda: Remix, Boxicons, atau teks). */
  function initMenu(btnSel, targetSel, cls) {
    var btn = $(btnSel), target = $(targetSel);
    if (!btn || !target) return;
    var openLabel = btn.getAttribute("aria-label") || "Buka menu";
    var closeLabel = openLabel.toLowerCase().indexOf("tutup") >= 0 ? openLabel : "Tutup menu";
    var icon = btn.querySelector("i");
    var iconOpen = btn.getAttribute("data-icon-open");
    var iconClose = btn.getAttribute("data-icon-close");

    function setMenuState(isOpen) {
      btn.setAttribute("aria-expanded", String(isOpen));
      btn.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
      // Sebelumnya ikon hamburger tetap hamburger saat menu terbuka.
      if (icon && iconOpen && iconClose) {
        icon.setAttribute("class", isOpen ? iconClose : iconOpen);
      }
    }
    function closeMenu() {
      if (!target.classList.contains(cls)) return;
      target.classList.remove(cls);
      setMenuState(false);
    }
    function toggleMenu() {
      setMenuState(target.classList.toggle(cls));
    }

    setMenuState(false);
    btn.addEventListener("click", toggleMenu);
    // Elemen toggle adalah <div role="button">, yang TIDAK menghasilkan klik
    // sintetis dari keyboard — handler ini yang membuatnya bisa dioperasikan.
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggleMenu();
      }
    });
    target.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  return { initCart: initCart, initMenu: initMenu };
})();
