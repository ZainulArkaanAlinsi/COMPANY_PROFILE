/* ============================================================
   PC.carapi — klien API Ninjas Cars (via proxy /api/ninjas)
   Dipakai fitur "Cek Spesifikasi" (js/components/specfinder.js).
   Dokumen: https://api-ninjas.com/api/cars

   Catatan plan: endpoint /v1/cars (spesifikasi) tersedia di tier gratis.
   carmakes/carmodels/cartrims/cardetails butuh plan berbayar.
   Key TIDAK pernah ada di klien — disuntik server (server/proxy.js
   atau api/ninjas.js). Lihat API-NINJAS.md.
   ============================================================ */
window.PC = window.PC || {};

PC.carapi = (function () {
  var config = {
    proxyUrl: "/api/ninjas", // cocok dgn server/proxy.js & api/ninjas.js
  };

  function get(pathName, params) {
    var cleanParams = {};
    Object.keys(params || {}).forEach(function (key) {
      var value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = value;
      }
    });
    var query = Object.assign({ path: pathName }, cleanParams);
    var url = config.proxyUrl + "?" + new URLSearchParams(query).toString();
    return fetch(url, { headers: { Accept: "application/json" } }).then(function (r) {
      return r.json().then(function (body) {
        if (!r.ok || (body && body.error)) {
          throw new Error((body && body.error) || "HTTP " + r.status);
        }
        return body;
      });
    });
  }

  function carmakes() {
    return get("carmakes");
  }

  function carmodels(make) {
    return get("carmodels", { make: make });
  }

  function cartrims(make, model) {
    return get("cartrims", { make: make, model: model });
  }

  function cardetails(make, model, trim) {
    return get("cardetails", { make: make, model: model, trim: trim });
  }

  /** Promise<Array> spesifikasi untuk make+model (endpoint /v1/cars). */
  function cars(make, model) {
    return get("cars", { make: make, model: model });
  }

  function available() {
    return typeof location === "undefined" || location.protocol !== "file:";
  }

  return {
    get: get,
    carmakes: carmakes,
    carmodels: carmodels,
    cartrims: cartrims,
    cardetails: cardetails,
    cars: cars,
    available: available,
    config: config,
  };
})();
