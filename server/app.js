const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const DB_FILE = path.join(DATA_DIR, 'leads.db');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LEADS_FILE)) fs.writeFileSync(LEADS_FILE, JSON.stringify([]), 'utf8');

const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL');
db.prepare(`CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  items TEXT,
  createdAt TEXT
)`).run();

// migrate existing leads.json into sqlite (one-time idempotent)
try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf8') || '[]';
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length) {
        const insert = db.prepare('INSERT OR IGNORE INTO leads (id,name,email,phone,message,items,createdAt) VALUES (?,?,?,?,?,?,?)');
        const insertMany = db.transaction((items) => {
            for (const it of items) {
                insert.run(it.id, it.name, it.email, it.phone, it.message || '', JSON.stringify(it.items || []), it.createdAt || new Date().toISOString());
            }
        });
        insertMany(arr);
        // keep leads.json as backup
    }
} catch (e) {
    console.error('lead migration failed', e && e.stack || e);
}

const MARKETCHECK_API_KEY = process.env.MARKETCHECK_API_KEY || "";
const API_NINJAS_KEY = process.env.API_NINJAS_KEY || "";
const CARAPI_TOKEN = process.env.CARAPI_TOKEN || "";
const CARAPI_SECRET = process.env.CARAPI_SECRET || "";
const MARKETCHECK_URL = "https://api.marketcheck.com/v2/search/car/active";
const NINJAS_BASE = "https://api.api-ninjas.com/v1";
const CARAPI_BASE = "https://carapi.app/api";
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

let carapiAuthCache = { token: "", expires: 0 };

function jwtExpirationMs(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return Date.now() + 10 * 60 * 1000;
        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = Buffer.from(payload, "base64").toString("utf8");
        const parsed = JSON.parse(json);
        return parsed.exp ? parsed.exp * 1000 : Date.now() + 10 * 60 * 1000;
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
        body,
    });
    if (!r.ok) {
        throw new Error("CarAPI auth failed " + r.status);
    }
    const text = (await r.text()).trim();
    let token = text;
    try {
        const parsed = JSON.parse(text);
        token = parsed.token || parsed.jwt || token;
    } catch (ignored) {
        token = text;
    }
    if (!token) throw new Error("CarAPI auth token kosong");
    carapiAuthCache.token = token;
    carapiAuthCache.expires = jwtExpirationMs(token);
    return token;
}

function canonicalPath(raw) {
    if (!raw) return "";
    return raw.replace(/^\/+/g, "").replace(/\/+$/g, "");
}

function isAllowedCarapiPath(path) {
    if (!path) return false;
    return CARAPI_PREFIXES.some(function (prefix) {
        return path === prefix || path.indexOf(prefix + "/") === 0;
    });
}

const app = express();
app.use(express.json());
app.use('/api', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// static files: serve project root so existing pages still work
app.use(express.static(ROOT, { index: false }));

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.get('/api/cars', async (req, res) => {
    if (!MARKETCHECK_API_KEY) {
        return res.status(500).json({ error: 'MARKETCHECK_API_KEY belum di-set di environment.' });
    }
    try {
        const params = new URLSearchParams(Object.assign({}, req.query));
        params.set('api_key', MARKETCHECK_API_KEY);
        const upstream = MARKETCHECK_URL + '?' + params.toString();
        const r = await fetch(upstream, { headers: { Accept: 'application/json' } });
        const data = await r.json();
        res.status(r.status).json(data);
    } catch (e) {
        console.error(e && e.stack || e);
        res.status(502).json({ error: 'MarketCheck proxy gagal: ' + e.message });
    }
});

app.get('/api/ninjas', async (req, res) => {
    if (!API_NINJAS_KEY) {
        return res.status(500).json({ error: 'API_NINJAS_KEY belum di-set di environment.' });
    }
    try {
        const query = Object.assign({}, req.query);
        const which = String(query.path || 'cars');
        delete query.path;
        const allowed = ['cars', 'carmakes', 'carmodels', 'cartrims', 'cardetails'];
        if (allowed.indexOf(which) < 0) {
            return res.status(400).json({ error: 'Endpoint tidak diizinkan: ' + which });
        }
        const upstream = NINJAS_BASE + '/' + which + '?' + new URLSearchParams(query).toString();
        const r = await fetch(upstream, { headers: { 'X-Api-Key': API_NINJAS_KEY } });
        const data = await r.json();
        res.status(r.status).json(data);
    } catch (e) {
        console.error(e && e.stack || e);
        res.status(502).json({ error: 'API Ninjas proxy gagal: ' + e.message });
    }
});

app.get('/api/carapi', async (req, res) => {
    if (!CARAPI_TOKEN || !CARAPI_SECRET) {
        return res.status(500).json({ error: 'CARAPI_TOKEN atau CARAPI_SECRET belum di-set di environment.' });
    }
    try {
        const query = Object.assign({}, req.query);
        const rawPath = String(query.path || '');
        delete query.path;
        const path = canonicalPath(rawPath);
        if (!isAllowedCarapiPath(path)) {
            return res.status(400).json({ error: 'Endpoint tidak diizinkan: ' + rawPath });
        }
        let token = await getCarapiToken();
        let upstreamUrl = CARAPI_BASE + '/' + path;
        const paramString = new URLSearchParams(query).toString();
        if (paramString) upstreamUrl += '?' + paramString;
        let r = await fetch(upstreamUrl, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + token } });
        if (r.status === 401) {
            carapiAuthCache.token = '';
            carapiAuthCache.expires = 0;
            token = await getCarapiToken();
            r = await fetch(upstreamUrl, { headers: { Accept: 'application/json', Authorization: 'Bearer ' + token } });
        }
        const body = await r.text();
        res.status(r.status).send(body);
    } catch (e) {
        console.error(e && e.stack || e);
        res.status(502).json({ error: 'CarAPI proxy gagal: ' + e.message });
    }
});

app.post('/api/leads', (req, res) => {
    try {
        const body = req.body || {};
        const name = String(body.name || '').trim();
        const email = String(body.email || '').trim();
        const phone = String(body.phone || '').trim();
        const message = String(body.message || '').trim();
        if (!name || (!email && !phone)) return res.status(400).json({ error: 'name + (email|phone) required' });
        const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
        const createdAt = new Date().toISOString();
        const items = Array.isArray(body.items) ? body.items : [];
        const insert = db.prepare('INSERT INTO leads (id,name,email,phone,message,items,createdAt) VALUES (?,?,?,?,?,?,?)');
        insert.run(id, name, email, phone, message, JSON.stringify(items), createdAt);
        const lead = { id, name, email, phone, message, items, createdAt };
        return res.status(201).json({ ok: true, lead });
    } catch (e) {
        console.error(e && e.stack || e);
        res.status(500).json({ error: 'internal' });
    }
});

// admin: list leads (most recent first, limit optional)
app.get('/api/leads', (req, res) => {
    try {
        const limit = Math.min(Math.max(parseInt(req.query.limit || '100', 10), 1), 1000);
        const rows = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC LIMIT ?').all(limit);
        const out = rows.map(r => ({ ...r, items: JSON.parse(r.items || '[]') }));
        res.json({ ok: true, count: out.length, leads: out });
    } catch (e) {
        console.error(e && e.stack || e);
        res.status(500).json({ error: 'internal' });
    }
});

// fallback to index.html for SPA-ish routing
app.get('/', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Dev server running on http://localhost:' + PORT));
