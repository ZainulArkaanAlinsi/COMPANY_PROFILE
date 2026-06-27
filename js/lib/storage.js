/* ============================================================
   PC.storage — pembungkus localStorage yang aman.
   Fallback ke memori bila localStorage diblok. Lihat SDD.md §5.2
   ============================================================ */
window.PC = window.PC || {};

PC.storage = (function () {
  var mem = {};
  var ok = (function () {
    try {
      var k = "__pc_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  })();

  return {
    available: ok,

    get: function (key, fallback) {
      try {
        var raw = ok ? window.localStorage.getItem(key) : mem[key];
        if (raw == null) return fallback;
        return JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },

    set: function (key, value) {
      var raw = JSON.stringify(value);
      try {
        if (ok) window.localStorage.setItem(key, raw);
        else mem[key] = raw;
      } catch (e) {
        mem[key] = raw;
      }
    },

    remove: function (key) {
      try {
        if (ok) window.localStorage.removeItem(key);
        else delete mem[key];
      } catch (e) {
        delete mem[key];
      }
    },
  };
})();
