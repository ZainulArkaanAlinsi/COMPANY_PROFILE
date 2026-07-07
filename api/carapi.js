/* ============================================================
   Vercel Serverless Function — proxy CarAPI (carapi.app)
   Path publik: /api/carapi?path=years&year=2020
   Deploy: set Environment Variables
     CARAPI_TOKEN = <token>
     CARAPI_SECRET = <secret>
   ============================================================ */

const AUTH_URL = "https://carapi.app/api/auth/login";
const BASE_URL = "https://carapi.app/api";
const ALLOWED_PREFIXES = [
    "years",
    "years/v2",
    "makes",
    "makes/v2",
    "models",
    "models/v2",
    "trims",
    "trims/v2",
    "vin",
    "vehicle-attributes",
    "account/requests",
    "account/requests-today",
];

let cache = { token: "", expires: 0 };

function jwtExpirationMs(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return Date.now() + 600000;
        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = Buffer.from(payload, "base64").toString("utf8");
        const parsed = JSON.parse(json);
        return parsed.exp ? parsed.exp * 1000 : Date.now() + 600000;
    } catch (e) {
        return Date.now() + 600000;
    }
}

function canonicalPath(raw) {
    if (!raw) return "";
    return raw.replace(/^\/+|\/+$/g, "");
}

function isAllowed(path) {
    if (!path) return false;
    const normalized = canonicalPath(path);
    return ALLOWED_PREFIXES.some(function (prefix) {
        return normalized === prefix || normalized.indexOf(prefix + "/") === 0;
    });
}

async function fetchJwt(token, secret) {
    const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ api_token: token, api_secret: secret }),
    });
    if (!res.ok) {
        throw new Error("CarAPI auth failed " + res.status);
    }
    const text = (await res.text()).trim();
    let jwt = text;
    try {
        const parsed = JSON.parse(text);
        jwt = parsed.token || parsed.jwt || jwt;
    } catch (e) {
        jwt = text;
    }
    if (!jwt) throw new Error("CarAPI auth returned empty token");
    return jwt;
}

async function getJwt(token, secret) {
    if (cache.token && Date.now() < cache.expires - 10000) return cache.token;
    const jwt = await fetchJwt(token, secret);
    cache.token = jwt;
    cache.expires = jwtExpirationMs(jwt);
    return jwt;
}

module.exports = async function handler(req, res) {
    const token = process.env.CARAPI_TOKEN;
    const secret = process.env.CARAPI_SECRET;
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (!token || !secret) {
        res.status(500).json({ error: "CARAPI_TOKEN atau CARAPI_SECRET belum di-set di Vercel." });
        return;
    }

    const q = Object.assign({}, req.query);
    const path = canonicalPath(q.path || "");
    delete q.path;
    if (!isAllowed(path)) {
        res.status(400).json({ error: "Endpoint tidak diizinkan: " + (q.path || path) });
        return;
    }

    try {
        const jwt = await getJwt(token, secret);
        const url = BASE_URL + "/" + path + (Object.keys(q).length ? "?" + new URLSearchParams(q).toString() : "");
        let upstream = await fetch(url, { headers: { Accept: "application/json", Authorization: "Bearer " + jwt } });
        if (upstream.status === 401) {
            cache.token = "";
            cache.expires = 0;
            const retryJwt = await getJwt(token, secret);
            upstream = await fetch(url, { headers: { Accept: "application/json", Authorization: "Bearer " + retryJwt } });
        }
        const data = await upstream.text();
        res.status(upstream.status).send(data);
    } catch (e) {
        res.status(502).json({ error: "Proxy gagal: " + e.message });
    }
};
