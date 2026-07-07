/* ============================================================
   PC.carapiCarAPI — klien proxy untuk CarAPI (carapi.app)
   Gunakan endpoint `GET /api/carapi?path=...` di server lokal atau Vercel.
   ============================================================ */
window.PC = window.PC || {};

PC.carapiCarAPI = (function () {
    var config = {
        proxyUrl: "/api/carapi", // cocok dengan server/proxy.js
    };

    function get(pathName, params) {
        var query = Object.assign({ path: pathName }, params || {});
        var url = config.proxyUrl + "?" + new URLSearchParams(query).toString();
        return fetch(url, { headers: { Accept: "application/json" } }).then(function (r) {
            return r.json().then(function (body) {
                if (!r.ok || (body && body.exception)) {
                    throw new Error((body && (body.message || body.exception)) || "HTTP " + r.status);
                }
                return body;
            });
        });
    }

    function years(params) {
        return get("years", params);
    }

    function yearsV2(params) {
        return get("years/v2", params);
    }

    function makes(params) {
        return get("makes", params);
    }

    function makesV2(params) {
        return get("makes/v2", params);
    }

    function models(params) {
        return get("models", params);
    }

    function modelsV2(params) {
        return get("models/v2", params);
    }

    function trims(params) {
        return get("trims", params);
    }

    function trimsV2(params) {
        return get("trims/v2", params);
    }

    function trimById(id) {
        return get("trims/v2/" + encodeURIComponent(id));
    }

    function vin(vin, options) {
        return get("vin/" + encodeURIComponent(vin), options);
    }

    function vehicleAttributes(params) {
        return get("vehicle-attributes", params);
    }

    function accountRequests() {
        return get("account/requests");
    }

    function accountRequestsToday() {
        return get("account/requests-today");
    }

    function available() {
        return typeof location === "undefined" || location.protocol !== "file:";
    }

    return {
        get: get,
        years: years,
        yearsV2: yearsV2,
        makes: makes,
        makesV2: makesV2,
        models: models,
        modelsV2: modelsV2,
        trims: trims,
        trimsV2: trimsV2,
        trimById: trimById,
        vin: vin,
        vehicleAttributes: vehicleAttributes,
        accountRequests: accountRequests,
        accountRequestsToday: accountRequestsToday,
        available: available,
        config: config,
    };
})();
