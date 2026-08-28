# SDD — Premium Cars Web

## Architecture overview
```
Browser ──> Next.js 14 App Router (Vercel)
             ├─ Static pages (SSG) + client components (terminal, forms)
             ├─ /api/leads      ─ validasi → file store → webhook/Resend
             ├─ /api/auth/*     ─ scrypt + cookie sesi HMAC
             ├─ /api/catalog    ─ proxy NHTSA vPIC (cache 24 jam)
             ├─ /api/market     ─ agregator: Auto.dev → MarketCheck → FIPE
             │                    + frankfurter (kurs) + estimasi nasional
             ├─ /api/inventory  ─ MarketCheck listings | data kurasi
             └─ /api/specs      ─ proxy API Ninjas
```
Semua integrasi eksternal: server-side saja, timeout 9 dtk, fallback berlapis.

## Data model (file-store v1 → Postgres v1.1)
- `users.json`: { name, email(unik), salt, hash(scrypt), createdAt }
- `leads.json`: { id, type, data{}, createdAt }
- Kurasi statis: `lib/cars.js` (13 unit, foto terverifikasi), `lib/content.js`
- v1.1: tabel `users`, `leads`, `units`, `price_snapshots` — fungsi di
  `lib/auth.js` & `lib/leads.js` sudah berbentuk repository agar tinggal ganti driver.

## API spec (ringkas)
| Endpoint | Method | Auth | Catatan |
| --- | --- | --- | --- |
| /api/leads | POST | publik + honeypot + rate-limit 10/mnt/IP | 4 tipe lead |
| /api/leads | GET | Bearer ADMIN_TOKEN | audit lead |
| /api/auth/register·login·logout | POST | cookie diset/dihapus | scrypt, HMAC |
| /api/auth/me | GET | cookie | { user \| null } |
| /api/catalog | GET | publik | vPIC, revalidate 86400 |
| /api/market | GET | publik | agregat multi-sumber + tren FIPE |

## Sequence — Analisis Pasar
UI → GET /api/market → paralel: [vPIC models, year-spread probe, listing
(Auto.dev→MC→FIPE), kurva harga per-tahun FIPE (≤14 titik), API Ninjas,
frankfurter] →
normalisasi USD → IDR → estimasi nasional → JSON → UI render + interval 60 dtk.

## Security design
- Cookie sesi httpOnly SameSite=Lax, HMAC-SHA256 (`AUTH_SECRET`), expiry 7 hari.
- Password scrypt N=16384 + salt per-user + timingSafeEqual.
- Key API hanya env server; `.env*` di-gitignore (root & app).
- Rate limit in-memory per instance (v1.1: Upstash/Redis bila multi-instance).

## Realtime strategy
1. Fetch cache berjenjang: katalog 24 jam, kurs 12 jam, listing `no-store`.
2. Client polling 60 dtk (hanya tab visible) → data "tanpa berhenti" hemat kuota.
3. Upgrade path: Vercel Cron menyimpan `price_snapshots` harian → grafik
   historis sendiri; SSE/WebSocket bila butuh push < 60 dtk.

## Deployment & environments
Vercel (proyek `company-car-site`, root `premium-cars-web`). Env per stage
di dashboard; tanpa key situs tetap hidup (vPIC/FIPE/frankfurter keyless).
Logging: console (Vercel Logs); lead juga terkirim ke webhook bila di-set.

## Tech decisions (trade-off)
- **File-store dulu, DB belakangan** — nol dependensi saat demo; kontrak
  fungsi tidak berubah saat migrasi.
- **SVG chart tanpa library** — bundle kecil, gaya konsisten design system.
- **CSS variables untuk tema** — dark/light tanpa duplikasi kelas Tailwind.
