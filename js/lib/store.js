/* ============================================================
   PC.store — state keranjang & wishlist + pub/sub.
   Satu-satunya penulis localStorage untuk state. Lihat SDD.md §5.3
   ============================================================ */
window.PC = window.PC || {};

PC.store = (function () {
  var KEY_CART = "pc.cart";
  var KEY_WISH = "pc.wishlist";

  var state = {
    cart: PC.storage.get(KEY_CART, []),     // [{ id, qty }]
    wishlist: PC.storage.get(KEY_WISH, []), // [id]
  };

  var handlers = {}; // event -> [fn]

  function on(event, fn) {
    (handlers[event] = handlers[event] || []).push(fn);
  }
  function emit(event) {
    (handlers[event] || []).forEach(function (fn) {
      try { fn(); } catch (e) { /* isolasi handler */ }
    });
  }

  function persistCart() {
    PC.storage.set(KEY_CART, state.cart);
    emit("change:cart");
  }
  function persistWish() {
    PC.storage.set(KEY_WISH, state.wishlist);
    emit("change:wishlist");
  }

  /* ---------------- Cart ---------------- */
  var cart = {
    add: function (id, qty) {
      qty = qty || 1;
      if (!PC.getCar(id)) return;
      var line = state.cart.find(function (l) { return l.id === id; });
      if (line) line.qty += qty;
      else state.cart.push({ id: id, qty: qty });
      persistCart();
    },
    remove: function (id) {
      state.cart = state.cart.filter(function (l) { return l.id !== id; });
      persistCart();
    },
    setQty: function (id, qty) {
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var line = state.cart.find(function (l) { return l.id === id; });
      if (line) { line.qty = qty; persistCart(); }
    },
    clear: function () { state.cart = []; persistCart(); },
    /** resolve detail mobil; skip + bersihkan id yatim */
    items: function () {
      var clean = [];
      var out = state.cart.map(function (l) {
        var car = PC.getCar(l.id);
        if (!car) return null;
        clean.push(l);
        return { car: car, qty: l.qty, subtotal: car.price * l.qty };
      }).filter(Boolean);
      if (clean.length !== state.cart.length) { state.cart = clean; persistCart(); }
      return out;
    },
    count: function () {
      return state.cart.reduce(function (s, l) { return s + l.qty; }, 0);
    },
    total: function () {
      return cart.items().reduce(function (s, i) { return s + i.subtotal; }, 0);
    },
    has: function (id) {
      return state.cart.some(function (l) { return l.id === id; });
    },
  };

  /* ---------------- Wishlist ---------------- */
  var wishlist = {
    toggle: function (id) {
      var i = state.wishlist.indexOf(id);
      var added;
      if (i >= 0) { state.wishlist.splice(i, 1); added = false; }
      else { state.wishlist.push(id); added = true; }
      persistWish();
      return added;
    },
    has: function (id) { return state.wishlist.indexOf(id) >= 0; },
    count: function () { return state.wishlist.length; },
    list: function () {
      return state.wishlist.map(PC.getCar).filter(Boolean);
    },
  };

  return { on: on, emit: emit, cart: cart, wishlist: wishlist };
})();
