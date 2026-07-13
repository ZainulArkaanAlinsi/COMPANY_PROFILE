/* ============================================================
   PC.format — utilitas format angka & teks. Lihat SDD.md §5.1
   ============================================================ */
window.PC = window.PC || {};

PC.format = {
  /** 56000000000 -> "Rp 56.000.000.000" */
  rupiah: function (n) {
    return "Rp " + PC.format.number(Math.round(n || 0));
  },

  /** ringkas untuk kartu: "Rp 56 M" / "Rp 1,5 M" / "Rp 650 Jt" */
  compactRupiah: function (n) {
    n = n || 0;
    if (n >= 1e9) {
      var m = n / 1e9;
      return "Rp " + PC.format._trim(m) + " M";
    }
    if (n >= 1e6) {
      var j = n / 1e6;
      return "Rp " + PC.format._trim(j) + " Jt";
    }
    return PC.format.rupiah(n);
  },

  /** pemisah ribuan id-ID */
  number: function (n) {
    return new Intl.NumberFormat("id-ID").format(Math.round(n || 0));
  },

  _trim: function (x) {
    // satu desimal, tanpa ".0", koma sebagai pemisah desimal
    var s = (Math.round(x * 10) / 10).toString();
    return s.replace(".", ",");
  },

  /** "Bugatti Chiron!" -> "bugatti-chiron" */
  slug: function (s) {
    return (s || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },
};

/** Path aset/halaman relatif-root. Halaman di subfolder (mobil/*.html)
    menyetel window.PC_BASE = "../" sebelum memuat skrip ini. */
PC.asset = function (path) {
  if (!path || /^([a-z]+:)?\/\//i.test(path)) return path;
  return (window.PC_BASE || "") + path;
};
