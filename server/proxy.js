/* ============================================================
   PREMIUM CARS — server statis + proxy MarketCheck (lokal)
   Tanpa dependensi. Butuh Node 18+ (global fetch).

   Jalankan (PowerShell):
     $env:MARKETCHECK_API_KEY="KEY_KAMU"; node server/proxy.js
   Lalu buka http://localhost:3000

   - Menyajikan file situs apa adanya.
   - /api/cars  → meneruskan ke MarketCheck dengan api_key dari ENV
     (key TIDAK pernah sampai ke browser) + header CORS.
   Tanpa MARKETCHECK_API_KEY, situs tetap jalan memakai data lokal.
   ============================================================ */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.MARKETCHECK_API_KEY || "";
const MC_URL = "https://api.marketcheck.com/v2/search/car/active";
const NINJAS_KEY = process.env.API_NINJAS_KEY || "";
const NINJAS_PATHS = ["cars", "carmakes", "carmodels", "cartrims", "cardetails"];
const CARAPI_TOKEN = process.env.CARAPI_TOKEN || "";
const CARAPI_SECRET = process.env.CARAPI_SECRET || "";
const CARAPI_URL = "https://carapi.app/api";
const CARAPI_AUTH_URL = "https://carapi.app/api/auth/login";
const CARAPI_PREFIXES = [
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
const carapiAuthCache = { token: "", expires: 0 };

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".avif": "image/avif", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

async function proxyCars(req, res) {
  if (!API_KEY) {
    res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    return res.end(JSON.stringify({ error: "MARKETCHECK_API_KEY belum di-set di environment." }));
  }
  try {
    const incoming = new URL(req.url, "http://localhost");
    const params = incoming.searchParams;
    params.set("api_key", API_KEY);
    const r = await fetch(MC_URL + "?" + params.toString(), { headers: { Accept: "application/json" } });
    const body = await r.text();
    res.writeHead(r.status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(body);
  } catch (e) {
    res.writeHead(502, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify({ error: "Proxy gagal: " + e.message }));
  }
}

function jwtExpirationMs(token) {
  try {
    var parts = token.split(".");
    if (parts.length !== 3) return Date.now() + 10 * 60 * 1000;
    var payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    var json = Buffer.from(payload, "base64").toString("utf8");
    var stored = JSON.parse(json);
    return stored.exp ? stored.exp * 1000 : Date.now() + 10 * 60 * 1000;
  } catch (e) {
    return Date.now() + 10 * 60 * 1000;
  }
}

async function getCarapiToken() {
  if (carapiAuthCache.token && Date.now() < carapiAuthCache.expires - 10000) {
    return carapiAuthCache.token;
  }

  const body = JSON.stringify({ api_token: CARAPI_TOKEN, api_secret: CARAPI_SECRET });
  const r = await fetch(CARAPI_AUTH_URL, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: body,
  });

  if (!r.ok) {
    throw new Error("Auth HTTP " + r.status);
  }

  const text = (await r.text()).trim();
  var token = text;
  try {
    var parsed = JSON.parse(text);
    token = parsed.token || parsed.jwt || token;
  } catch (e) {
    token = text;
  }

  if (!token) {
    throw new Error("CarAPI auth token kosong");
  }

  carapiAuthCache.token = token;
  carapiAuthCache.expires = jwtExpirationMs(token);
  return token;
}

function canonicalCarapiPath(raw) {
  if (!raw) return "";
  return raw.replace(/^\/+|\/+$/g, "");
}

function isAllowedCarapiPath(path) {
  if (!path) return false;
  var candidate = canonicalCarapiPath(path);
  return CARAPI_PREFIXES.some(function (prefix) {
    return candidate === prefix || candidate.indexOf(prefix + "/") === 0;
  });
}

async function proxyCarAPI(req, res) {
  if (!CARAPI_TOKEN || !CARAPI_SECRET) {
    res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    return res.end(JSON.stringify({ error: "CARAPI_TOKEN atau CARAPI_SECRET belum di-set di environment." }));
  }

  try {
    const incoming = new URL(req.url, "http://localhost");
    const rawPath = incoming.searchParams.get("path") || "";
    const path = canonicalCarapiPath(rawPath);
    if (!isAllowedCarapiPath(path)) {
      res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      return res.end(JSON.stringify({ error: "Endpoint tidak diizinkan: " + rawPath }));
    }
    incoming.searchParams.delete("path");

    var token = await getCarapiToken();
    var upstreamUrl = CARAPI_URL + "/" + path;
    if (incoming.searchParams.toString()) upstreamUrl += "?" + incoming.searchParams.toString();

    var r = await fetch(upstreamUrl, { headers: { "Accept": "application/json", "Authorization": "Bearer " + token } });
    if (r.status === 401) {
      carapiAuthCache.token = "";
      carapiAuthCache.expires = 0;
      token = await getCarapiToken();
      r = await fetch(upstreamUrl, { headers: { "Accept": "application/json", "Authorization": "Bearer " + token } });
    }

    const body = await r.text();
    res.writeHead(r.status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(body);
  } catch (e) {
    res.writeHead(502, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify({ error: "Proxy gagal: " + e.message }));
  }
}

async function proxyNinjas(req, res) {
  if (!NINJAS_KEY) {
    res.writeHead(500, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    return res.end(JSON.stringify({ error: "API_NINJAS_KEY belum di-set di environment." }));
  }
  try {
    const incoming = new URL(req.url, "http://localhost");
    const which = incoming.searchParams.get("path") || "cars";
    if (NINJAS_PATHS.indexOf(which) < 0) {
      res.writeHead(400, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      return res.end(JSON.stringify({ error: "Endpoint tidak diizinkan: " + which }));
    }
    incoming.searchParams.delete("path");
    const upstream = "https://api.api-ninjas.com/v1/" + which + "?" + incoming.searchParams.toString();
    const r = await fetch(upstream, { headers: { "X-Api-Key": NINJAS_KEY } });
    const body = await r.text();
    res.writeHead(r.status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(body);
  } catch (e) {
    res.writeHead(502, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify({ error: "Proxy gagal: " + e.message }));
  }
}

function serveStatic(req, res) {
  let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (pathname === "/") pathname = "/index.html";
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.readFile(filePath, function (err, data) {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(function (req, res) {
  if (req.url.startsWith("/api/carapi")) return proxyCarAPI(req, res);
  if (req.url.startsWith("/api/ninjas")) return proxyNinjas(req, res);
  if (req.url.startsWith("/api/cars")) return proxyCars(req, res);
  serveStatic(req, res);
});

server.on("error", function (e) {
  if (e.code === "EADDRINUSE") {
    console.error(
      "Port " + PORT + " sudah dipakai. Pakai port lain, mis:\n" +
      '  $env:PORT="3100"; node server/proxy.js'
    );
  } else {
    console.error(e.message);
  }
  process.exit(1);
});

server.listen(PORT, function () {
  console.log("PREMIUM CARS  →  http://localhost:" + PORT);
  console.log(
    NINJAS_KEY
      ? "Proxy API Ninjas AKTIF di /api/ninjas (Cek Spesifikasi siap)"
      : "API_NINJAS_KEY belum di-set — fitur Cek Spesifikasi nonaktif."
  );
  if (API_KEY) console.log("Proxy MarketCheck AKTIF di /api/cars");
  if (CARAPI_TOKEN && CARAPI_SECRET) console.log("Proxy CarAPI AKTIF di /api/carapi");
});
