/* ============================================================
   PC.marketcheck — Integrasi MarketCheck Cars API (opsional)
   Dokumen API: https://docs.marketcheck.com/docs/api/cars
   Endpoint inti: GET https://api.marketcheck.com/v2/search/car/active

   PENTING — baca MARKETCHECK.md:
   1) Butuh API KEY (daftar gratis di marketcheck.com). Tanpa key,
      modul ini DIAM dan situs tetap pakai data lokal (js/data/cars.js).
   2) Memanggil api.marketcheck.com LANGSUNG dari browser akan:
        - membocorkan api_key di kode klien (tidak aman), dan
        - kemungkinan besar DIBLOKIR CORS.
      Solusi yang benar: pakai proxy serverless (set `proxyUrl`).
      Contoh proxy ada di MARKETCHECK.md.
   3) Data MarketCheck = pasar AS (USD). Harga dikonversi ke Rupiah
      via `usdToIdr` agar format situs tetap konsisten.
   4) Endpoint inventory TIDAK menyediakan spesifikasi performa
      (top speed / hp). Nilai itu di sini hanya ESTIMASI kasar; untuk
      spesifikasi asli pakai VIN decode (/v2/decode/car/{vin}/specs).
   ============================================================ */
window.PC = window.PC || {};

PC.marketcheck = (function () {
  var config = {
    /* Isi key Anda di sini ATAU lewat proxy (lebih aman, lihat di bawah). */
    apiKey: "YOUR_MARKETCHECK_API_KEY",

    /* Proxy yang menyuntik api_key di sisi server (anti-CORS & rahasia key).
       Default cocok dengan server/proxy.js (lokal) & api/cars.js (Vercel).
       Kosongkan ("") untuk menonaktifkan jalur proxy. Lihat MARKETCHECK.md. */
    proxyUrl: "/api/cars",

    host: "https://api.marketcheck.com",
    usdToIdr: 16000, /* kurs kasar untuk menjaga format Rupiah */
    placeholderImage: "image/side-view-white-modern-car-outdoors.png",

    /* Parameter pencarian default (lihat dok untuk 100+ filter). */
    defaultParams: {
      car_type: "used",
      rows: 24,
      start: 0,
      sort_by: "price",
      sort_order: "desc",
    },
  };

  /* ---------- Pemetaan respons API -> model situs ---------- */
  function mapCategory(b) {
    var fuel = (b.fuel_type || "").toLowerCase();
    var body = (b.body_type || "").toLowerCase();
    var vtype = (b.vehicle_type || "").toLowerCase();
    if (fuel.indexOf("electric") >= 0) return "electric";
    if (body.indexOf("suv") >= 0 || vtype.indexOf("suv") >= 0) return "suv";
    if (/van|minivan|wagon/.test(body)) return "family";
    if (/coupe|convertible|roadster/.test(body)) return "sport";
    if ((b.year || 9999) < 1995) return "classic";
    return "sport";
  }

  /* Estimasi kasar — MarketCheck inventory tak menyediakan top speed/hp. */
  function deriveSpecs(b) {
    var body = (b.body_type || "").toLowerCase();
    var isPerf = /coupe|convertible|roadster/.test(body);
    var isSuv = /suv|van|wagon|truck|pickup/.test(body);
    var cyl = parseInt(b.cylinders, 10) || (isPerf ? 8 : 4);
    return {
      topSpeed: isPerf ? 300 : isSuv ? 190 : 230,
      power: Math.round(cyl * 60 + ((b.year || 0) > 2018 ? 40 : 0)),
      seats: isSuv ? 7 : isPerf ? 2 : 5,
      transmission: b.transmission || "Automatic",
    };
  }

  function mapListing(l) {
    var b = l.build || {};
    var media = l.media || {};
    var photos = media.photo_links || media.photo_links_cached || [];
    var priceUsd = l.price || l.msrp || 0;
    return {
      id: String(l.id || l.vin || b.make + "-" + b.model + "-" + (l.miles || "")),
      name: l.heading || [b.year, b.make, b.model, b.trim].filter(Boolean).join(" "),
      brand: b.make || "—",
      category: mapCategory(b),
      price: Math.round(priceUsd * config.usdToIdr),
      year: b.year || null,
      image: photos[0] || config.placeholderImage,
      badge: l.inventory_type || b.body_type || "Used",
      featured: false,
      specs: deriveSpecs(b),
    };
  }

  function buildUrl(params) {
    var query = Object.assign({}, config.defaultParams, params || {});
    var base;
    if (config.proxyUrl) {
      base = config.proxyUrl; /* proxy menyuntik api_key di server */
    } else {
      base = config.host + "/v2/search/car/active";
      query.api_key = config.apiKey;
    }
    return base + "?" + new URLSearchParams(query).toString();
  }

  /* ---------- API publik ---------- */
  function enabled() {
    /* file:// tak punya server proxy → jangan coba-coba (hindari error). */
    if (typeof location !== "undefined" && location.protocol === "file:") return false;
    return Boolean(config.proxyUrl) ||
      (config.apiKey && config.apiKey !== "YOUR_MARKETCHECK_API_KEY");
  }

  /** Promise<Array<car>> — hasil sudah dipetakan ke model situs. */
  function search(params) {
    return fetch(buildUrl(params), { headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        var list = (data.listings || []).map(mapListing).filter(function (c) {
          return c.image && c.price > 0;
        });
        list.slice(0, 6).forEach(function (c) { c.featured = true; });
        return list;
      });
  }

  /** Ganti PC.cars dengan data API lalu refresh katalog. Aman bila gagal. */
  function load(params) {
    return search(params)
      .then(function (cars) {
        if (!cars.length) return false;
        PC.cars = cars;
        if (PC.catalog && PC.catalog.refresh) PC.catalog.refresh();
        return true;
      })
      .catch(function (err) {
        /* Diam-diam fallback ke data lokal (mis. proxy belum jalan / belum
           ada key). Hanya catat di console agar tidak mengganggu pengunjung. */
        console.warn(
          "[marketcheck] gagal memuat (" + err.message +
          ") — memakai data lokal. Lihat MARKETCHECK.md (CORS/proxy/key)."
        );
        return false;
      });
  }

  /** Dipanggil otomatis dari entry halaman; diam bila belum dikonfigurasi. */
  function init(params) {
    if (!enabled()) return Promise.resolve(false);
    return load(params);
  }

  return { init: init, load: load, search: search, enabled: enabled, config: config };
})();
