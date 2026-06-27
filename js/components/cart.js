/* ============================================================
   PC.cart — drawer keranjang + checkout (lead WhatsApp).
   Lihat SDD.md §5.5 & §6.3
   ============================================================ */
window.PC = window.PC || {};
PC.config = PC.config || { whatsapp: "6281234567890", brand: "PREMIUM CARS" };

PC.cart = (function () {
  var el = PC.ui.el, fmt = PC.format;
  var drawer, overlay, listEl, totalEl, refs = {};

  function build() {
    listEl = el("ul", { class: "cart-list" });
    totalEl = el("strong", { class: "cart-total__val" }, ["Rp 0"]);

    var foot = el("div", { class: "cart-foot" }, [
      el("div", { class: "cart-total" }, [el("span", {}, ["Total"]), totalEl]),
      el("button", { class: "btn-solid cart-checkout", type: "button", onclick: checkout }, ["Kirim Permintaan via WhatsApp"]),
      el("button", { class: "btn-link cart-clear", type: "button", onclick: function () { PC.store.cart.clear(); PC.ui.toast("Daftar minat dikosongkan", "info"); } }, ["Kosongkan daftar"]),
    ]);

    drawer = el("aside", { class: "cart-drawer", "aria-hidden": "true", "aria-label": "Daftar minat" }, [
      el("div", { class: "cart-head" }, [
        el("h3", {}, ["Daftar Minat"]),
        el("button", { class: "cart-close", type: "button", "aria-label": "Tutup", onclick: close }, [el("i", { class: "ri-close-line", "aria-hidden": "true" })]),
      ]),
      listEl,
      foot,
    ]);
    refs.foot = foot;

    overlay = el("div", { class: "cart-overlay", onclick: close });
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
    });
  }

  function row(item) {
    var car = item.car;
    var qtyVal = el("span", { class: "qty__val", "aria-live": "polite" }, [String(item.qty)]);
    return el("li", { class: "cart-item" }, [
      el("div", { class: "cart-item__media" }, [el("img", { src: car.image, alt: car.name })]),
      el("div", { class: "cart-item__body" }, [
        el("p", { class: "cart-item__name" }, [car.name]),
        el("p", { class: "cart-item__price" }, [fmt.rupiah(car.price)]),
        el("div", { class: "qty" }, [
          el("button", { class: "qty__btn", type: "button", "aria-label": "Kurangi", onclick: function () { PC.store.cart.setQty(car.id, item.qty - 1); } }, ["−"]),
          qtyVal,
          el("button", { class: "qty__btn", type: "button", "aria-label": "Tambah", onclick: function () { PC.store.cart.setQty(car.id, item.qty + 1); } }, ["+"]),
        ]),
      ]),
      el("div", { class: "cart-item__right" }, [
        el("strong", { class: "cart-item__subtotal" }, [fmt.compactRupiah(item.subtotal)]),
        el("button", { class: "cart-item__remove", type: "button", "aria-label": "Hapus", onclick: function () { PC.store.cart.remove(car.id); PC.ui.toast("Unit dihapus", "info"); } }, [el("i", { class: "ri-delete-bin-6-line", "aria-hidden": "true" })]),
      ]),
    ]);
  }

  function render() {
    var items = PC.store.cart.items();
    listEl.innerHTML = "";
    if (!items.length) {
      listEl.appendChild(el("li", { class: "cart-empty" }, [
        el("i", { class: "ri-shopping-bag-3-line", "aria-hidden": "true" }),
        el("p", {}, ["Belum ada unit yang Anda minati."]),
      ]));
      refs.foot.style.display = "none";
    } else {
      refs.foot.style.display = "";
      var frag = document.createDocumentFragment();
      items.forEach(function (it) { frag.appendChild(row(it)); });
      listEl.appendChild(frag);
    }
    totalEl.textContent = fmt.rupiah(PC.store.cart.total());
  }

  function checkout() {
    var items = PC.store.cart.items();
    if (!items.length) return;
    var lines = items.map(function (it) {
      return "• " + it.car.name + " x" + it.qty + " — " + fmt.rupiah(it.subtotal);
    });
    var text = "Halo " + PC.config.brand + ", saya tertarik dengan unit berikut:\n\n" +
      lines.join("\n") + "\n\nEstimasi total: " + fmt.rupiah(PC.store.cart.total()) +
      "\n\nMohon info ketersediaan, test drive, dan proses selanjutnya. Terima kasih.";
    var url = "https://wa.me/" + PC.config.whatsapp + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
  }

  function open() {
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function init() {
    build();
    render();
    PC.store.on("change:cart", render);
  }

  return { init: init, open: open, close: close };
})();
