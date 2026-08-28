# SDD — Software Design Document "PREMIUM CARS"

**Software Design Document (Dokumen Desain Perangkat Lunak)**

| | |
|---|---|
| **Produk** | PREMIUM CARS — Company Profile & Katalog Showroom |
| **Versi** | 2.0 (revamp UI/UX + tier backend & integrasi API) |
| **Tanggal** | 2 Juli 2026 |
| **Author** | Zainul Arkaan |
| **Dokumen terkait** | [PRD.md](PRD.md) (kebutuhan), [README.md](README.md) (cara jalan), [MARKETCHECK.md](MARKETCHECK.md), [API-NINJAS.md](API-NINJAS.md) |
| **Status** | Untuk implementasi redesign v2 |

> **Perubahan v1.0 → v2.0.** SDD lama hanya menjelaskan frontend statis. Versi ini menambahkan **tier backend opsional** (proxy API + penyimpanan lead), modul integrasi API (MarketCheck, API Ninjas, CarAPI), hero Three.js, serta **rencana remediasi** untuk menyatukan tampilan lintas halaman (navbar, ikon, token) sesuai mandat redesign PRD §10.

---

## 1. Pendahuluan

### 1.1 Tujuan
Menjelaskan **desain teknis** bagaimana kebutuhan PRD diwujudkan dalam kode: arsitektur, modul, model data, alur interaksi, kontrak API, struktur file, dan keputusan desain. SDD adalah jembatan antara *apa* (PRD) dan *bagaimana* (kode).

### 1.2 Lingkup Sistem
Aplikasi web **statis-first sisi-klien** (company profile + katalog interaktif) yang **bisa** ditingkatkan dengan **tier backend opsional** (Node) untuk:
1. **Proxy aman** ke API pihak ketiga (kunci API tak pernah sampai ke browser).
2. **Penyimpanan lead** ke SQLite.

State klien (Daftar Minat/keranjang, wishlist) disimpan di `localStorage`. Aksi transaksional dialihkan menjadi **lead** (WhatsApp `wa.me` dan/atau `POST /api/leads`).

### 1.3 Batasan Desain
- Frontend: tanpa framework, tanpa build step. Vanilla **HTML + CSS + JavaScript (ES6)**.
- Harus berjalan baik via server statis **maupun `file://`** → karena itu **data unit di-embed sebagai modul JS**, bukan di-`fetch`.
- Library klien via CDN: Swiper, ScrollReveal, RemixIcon, Three.js (opsional untuk hero).
- Backend: Node.js **18+** (butuh global `fetch`). Dua implementasi tersedia (lihat §7); satu ditetapkan kanonik.
- Mematuhi design system "Dark Editorial Garage" (PRD §8) dengan **satu** sumber token: `css/tokens.css`.

---

## 2. Arsitektur Sistem

### 2.1 Gaya Arsitektur
**Two-tier, statis-first.**
- **Tier 1 (wajib) — Klien:** *Layered + Component-based* dengan namespace global tunggal `PC` (PremiumCars) sebagai pengganti bundler. Script dimuat berurutan; tiap file menempel ke `window.PC`.
- **Tier 2 (opsional) — Backend Node:** *proxy API + penyimpanan lead*. Bila absen, klien memakai fallback data lokal dan lead lewat WhatsApp.

```
                         ┌───────────────────────── TIER 2 (opsional, Node) ─────────────────────────┐
                         │  server/app.js (Express)  ATAU  server/proxy.js (http, tanpa dependensi)   │
                         │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
   Browser  ─── /api ───▶│  │ /api/cars    │  │ /api/ninjas  │  │ /api/carapi  │  │ /api/leads     │  │
                         │  │ →MarketCheck │  │ →API Ninjas  │  │ →CarAPI(JWT) │  │ →SQLite (app)  │  │
                         │  └──────────────┘  └──────────────┘  └──────────────┘  └────────────────┘  │
                         │  Kunci API hanya di ENV — tak pernah ke browser. Mirror serverless: /api/*  │
                         └───────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────── TIER 1 (wajib, Klien) ───────────────────────────────────────┐
│                          PRESENTATION (HTML/CSS)                                                    │
│         index.html · penjualan.html · about.html   +   css/tokens.css · components.css · *.css      │
└───────────────▲───────────────────────────────────────────────▲──────────────────────────────────┘
                │ render & event                                   │ baca/tulis
┌───────────────┴───────────────────────────┐         ┌───────────┴──────────────┐
│              COMPONENTS (UI)               │         │        STATE / STORE      │
│ catalog · cart · simulator · forms · nav   │         │  PC.store (cart, wishlist)│
│ specfinder · carapi-browser                │         │  + pub/sub events         │
└───────────────▲───────────────────────────┘         └───────────▲──────────────┘
                │ pakai                                             │ persist (localStorage)
┌───────────────┴───────────────────────────────────────────────────┴──────────┐
│                                 LIB (utilitas)                                 │
│ PC.format · PC.storage · PC.ui  |  PC.marketcheck · PC.carapi (klien→proxy)    │
└───────────────▲───────────────────────────────────────────────────────────────┘
                │ baca
┌───────────────┴───────────────────────────────────────────────────────────────┐
│                                   DATA (model)                                  │
│                    PC.cars[]  ·  PC.categories[]   (js/data/cars.js)            │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Prinsip
- **Separation of concerns:** data ≠ tampilan ≠ state ≠ utilitas ≠ integrasi API ≠ backend.
- **Single source of truth:** data unit di satu file; state di `PC.store`; token desain di `css/tokens.css`; kunci API di ENV server.
- **Unidirectional update:** aksi user → ubah `store` → `store` emit event → komponen re-render. Tidak ada komponen yang menulis DOM komponen lain.
- **Progressive enhancement / statis-first:** konten inti tampil walau JS gagal; katalog & fitur API adalah lapisan tambahan yang gagal dengan anggun.
- **Keamanan by design:** rahasia hanya di server; klien memanggil proxy relatif (`/api/...`).

---

## 3. Struktur File (Aktual)

```
COMPANY PROFILE/
├── index.html              # Home
├── penjualan.html          # Katalog interaktif + simulasi + specfinder + carapi
├── about.html              # About  (target: samakan kosakata kelas ke sistem bersama)
│
├── css/
│   ├── tokens.css          # design tokens — SUMBER TUNGGAL (warna, font, spasi, motion)
│   ├── components.css      # komponen lintas-halaman (toast, modal, drawer, chip, badge, btn)
│   ├── home.css
│   ├── penjualan.css
│   ├── about.css
│   └── design-system.css   # ⚠️ MENIMPA token (accent/radius) — DIHAPUS/dinetralkan di v2
│
├── js/
│   ├── data/
│   │   └── cars.js         # PC.cars[], PC.categories[]  (di-embed)
│   ├── lib/
│   │   ├── format.js       # PC.format  (rupiah, angka, slug)
│   │   ├── storage.js      # PC.storage (wrapper localStorage aman)
│   │   ├── store.js        # PC.store   (cart + wishlist + pub/sub)
│   │   ├── ui.js           # PC.ui      ($, $$, el, toast, modal)
│   │   ├── marketcheck.js  # PC.marketcheck — klien untuk /api/cars (fallback data lokal)
│   │   ├── carapi.js       # PC.carapi — helper generic pemanggil proxy /api/*
│   │   └── carapi-carapi.js# klien khusus CarAPI Lookup (makes/models/trims → /api/carapi)
│   ├── components/
│   │   ├── nav.js          # toggle menu + sinkron badge Daftar Minat
│   │   ├── catalog.js      # render grid, search, filter, sort, modal detail
│   │   ├── cart.js         # drawer Daftar Minat + checkout WhatsApp (+ opsi /api/leads)
│   │   ├── simulator.js    # simulasi cicilan (bunga flat)
│   │   ├── specfinder.js   # Cek Spesifikasi via /api/ninjas (API Ninjas /v1/cars)
│   │   ├── carapi-browser.js # UI pilih Merek→Model→Trim via /api/carapi
│   │   └── forms.js        # validasi kontak & newsletter
│   ├── home.js             # entry Home
│   ├── penjualan.js        # entry Katalog (init komponen)
│   ├── about.js            # entry About
│   └── three-hero.js       # hero 3D opsional (skip di file:// & reduced-motion)
│
├── server/
│   ├── app.js              # ★ Express: static + proxy (cars/ninjas/carapi) + leads SQLite  (main)
│   ├── proxy.js            # alternatif tanpa dependensi: static + proxy (cars/ninjas/carapi)
│   └── data/               # leads.db (SQLite/WAL) + leads.json (backup) — dibuat runtime
│
├── api/                    # mirror serverless (Vercel): carapi.js · cars.js · ninjas.js
│
├── image/ · about/ · logo/ · icon/     # aset
├── package.json            # scripts start/dev; deps express, better-sqlite3; dev nodemon
├── sitemap.xml · robots.txt
└── PRD.md · SDD.md · README.md · MARKETCHECK.md · API-NINJAS.md
```

### 3.1 Urutan muat script (penting)
**penjualan.html:** `data/cars.js` → `lib/format.js` → `lib/storage.js` → `lib/store.js` → `lib/ui.js` → `lib/carapi.js` → `lib/carapi-carapi.js` → `components/catalog.js` → `cart.js` → `simulator.js` → `specfinder.js` → `carapi-browser.js` → `forms.js` → `nav.js` → `penjualan.js`.

**index.html:** `data/cars.js` → `lib/format.js` → `lib/ui.js` → `components/nav.js` → `forms.js` → `home.js` → `three-hero.js`.

**about.html:** `lib/ui.js` → `components/nav.js` → `forms.js` → `about.js`.

Urutan menjamin dependensi sudah ada di `PC` sebelum dipakai. (Catatan v2: pastikan `marketcheck.js` dimuat di penjualan bila katalog dari MarketCheck diaktifkan.)

---

## 4. Model Data

### 4.1 Entitas `Car` (di `js/data/cars.js`)
```js
{
  id:        "bugatti-chiron-pur-sport", // slug unik (PK)
  name:      "Bugatti Chiron Pur Sport",
  brand:     "Bugatti",
  category:  "hypercar",   // enum: hypercar|sport|suv|family|electric|classic
  price:     56000000000,  // Integer Rupiah (IDR)
  year:      2023,
  image:     "image/bu-removebg-preview (1).png",
  badge:     "Hypercar",   // label tampil (opsional)
  featured:  true,         // tampil di slider Home
  specs: { topSpeed: 350, power: 1500, seats: 2, transmission: "Automatic" }
}
```

### 4.2 Entitas `Category`
```js
{ id: "hypercar", label: "Hypercar", icon: "ri-flashlight-line" }
// PC.categories menyertakan { id: "all", label: "Semua" } untuk chip filter
```

### 4.3 State klien (runtime, persist `localStorage`)
```js
// key: "pc.cart"      → [{ id: "bmw-m4", qty: 1 }, ...]
// key: "pc.wishlist"  → ["lotus-evija", "pagani-huayra", ...]
```
Hanya `id` & `qty` yang dipersist; detail selalu di-resolve dari `PC.cars`.

### 4.4 Entitas `Lead` (server, SQLite `leads` — hanya di `server/app.js`)
```sql
leads(
  id TEXT PRIMARY KEY,   -- base36(timestamp)-random
  name TEXT, email TEXT, phone TEXT, message TEXT,
  items TEXT,            -- JSON array unit yang diminati
  createdAt TEXT         -- ISO 8601
)
```
`journal_mode = WAL`. Saat start, `leads.json` lama dimigrasikan idempoten (`INSERT OR IGNORE`) dan dipertahankan sebagai backup.

---

## 5. Desain Modul (Klien)

### 5.1 `PC.format` (lib/format.js)
| Fungsi | Tanda tangan | Keterangan |
|---|---|---|
| `rupiah(n)` | `(number) → string` | `56000000000 → "Rp 56.000.000.000"` |
| `compactRupiah(n)` | `(number) → string` | `→ "Rp 56 M"` untuk kartu ringkas |
| `number(n)` | `(number) → string` | pemisah ribuan lokal id-ID |
| `slug(s)` | `(string) → string` | normalisasi id |

### 5.2 `PC.storage` (lib/storage.js)
Pembungkus `localStorage` dengan `try/catch` + serialisasi JSON. `get(key, fallback)`, `set(key, value)`, `remove(key)`. Bila `localStorage` tak tersedia → fallback objek memori (app tetap jalan, state hilang saat reload).

### 5.3 `PC.store` (lib/store.js) — inti state
Pola **pub/sub**. `state: { cart:[], wishlist:[] }`; `on(event, handler)` / `emit(event)` untuk `"change:cart"` | `"change:wishlist"`.
`cart.add/remove/setQty/clear/items()/count()/total()`; `wishlist.toggle/has/list()`. Setiap mutasi → `PC.storage.set` → `emit`. **Tidak ada komponen yang menyentuh `localStorage` langsung.**

### 5.4 `PC.ui` (lib/ui.js)
`$`, `$$`, `el(tag, props, children)`; `toast(message, type)` (`success|error|info`, auto-dismiss, antri, `aria-live`); `modal.open(node)/close()` (fokus terjebak, `Esc` & klik overlay menutup, `aria-modal`).

### 5.5 Modul Integrasi API (klien → proxy)
| Modul | Tanggung jawab | Memanggil |
|---|---|---|
| `PC.marketcheck` (lib/marketcheck.js) | Ambil daftar unit dari MarketCheck untuk memperkaya/menggantikan katalog; **fallback ke `PC.cars`** jika gagal/backend absen | `GET /api/cars?...` |
| `PC.carapi` (lib/carapi.js) | Helper generik pemanggil proxy (`fetch` relatif, parse aman, penanganan error seragam) | `GET /api/*` |
| CarAPI Lookup (lib/carapi-carapi.js) | Ambil `makes/models/trims` resmi untuk dropdown berjenjang | `GET /api/carapi?path=makes|models|trims` |

Semua modul memanggil **path relatif** (`/api/...`) sehingga bekerja lokal (Node) maupun serverless (Vercel). Tidak ada kunci API di klien.

### 5.6 Komponen
| Komponen | Tanggung jawab | Bergantung pada |
|---|---|---|
| `catalog.js` | Render grid dari `PC.cars` (atau MarketCheck); search + filter kategori + sort; modal detail; Daftar Minat; lead. | data, store, ui, format, marketcheck |
| `cart.js` | Drawer Daftar Minat dari `cart.items()`; ubah qty; hapus; total; checkout → WhatsApp (`PC.config.whatsapp`) + opsi `POST /api/leads`. Re-render saat `change:cart`. | store, ui, format |
| `simulator.js` | Hitung cicilan (bunga flat); validasi DP < harga. | format, ui |
| `specfinder.js` | Input merek+model → `/api/ninjas` → kartu spesifikasi; chip contoh; state memuat/kosong/error/kuota. | carapi(lib), ui |
| `carapi-browser.js` | Dropdown Merek→Model→Trim via `/api/carapi`; render kartu trim; tambah ke Daftar Minat. | carapi-carapi, store, ui |
| `forms.js` | Validasi kontak & newsletter (regex email, wajib), error inline + toast, reset, opsi kirim lead. | ui |
| `nav.js` | Toggle menu (target v2: **satu** perilaku untuk semua halaman); sinkron badge Daftar Minat. | store, ui |

---

## 6. Alur Interaksi Utama (Sequence)

### 6.1 Tambah ke Daftar Minat
```
User klik "Daftar Minat" pada kartu
  → catalog.js: PC.store.cart.add(id)
    → store: mutasi → storage.set("pc.cart") → emit("change:cart")
      → cart.js: render ulang drawer & total
      → nav.js: perbarui badge
  → ui.toast("Ditambahkan ke Daftar Minat", "success")
```

### 6.2 Cari + filter + urut katalog
```
User ketik / klik chip / pilih sort
  → catalog.js: state filter lokal {q, category, sort}  (debounce 200ms untuk q)
  → pipeline: sumber → filter(category) → filter(q) → sort → render (DocumentFragment)
  → update "menampilkan N unit"
```

### 6.3 Checkout lead (WhatsApp + opsional server)
```
User klik "Kirim Permintaan via WhatsApp"
  → cart.js: susun teks order (unit × qty, total)  → wa.me/<no>?text=encodeURIComponent(...)
  (opsional) → POST /api/leads {name,email,phone,message,items}
      → server: simpan ke SQLite → 201 {ok, lead}
```

### 6.4 Simulasi cicilan
```
principal = price − dp
total     = principal × (1 + ratePerYear × tenorYear)   // bunga flat
angsuran  = total / tenorBulan
→ tampilkan angsuran/bulan + total bayar
```

### 6.5 Cek Spesifikasi (API Ninjas)
```
User isi merek+model / klik chip
  → specfinder.js: GET /api/ninjas?path=cars&make=<>&model=<>
    → server: tambah header X-Api-Key (ENV) → api-ninjas.com/v1/cars
  → render kartu spesifikasi (state: loading/empty/error/kuota)
```

### 6.6 CarAPI Lookup (dropdown berjenjang)
```
Load → GET /api/carapi?path=makes
Pilih merek → GET /api/carapi?path=models&make_id=..
Pilih model → GET /api/carapi?path=trims&model_id=..
  server: pastikan JWT (auth login, cache s.d. exp) → Bearer → carapi.app/api/...
          (jika 401: buang cache, login ulang, retry sekali)
→ render kartu trim → opsi tambah ke Daftar Minat
```

---

## 7. Desain Backend (Tier 2, opsional)

### 7.1 Dua implementasi
| Berkas | Basis | Endpoint | Kelebihan | Peran v2 |
|---|---|---|---|---|
| `server/app.js` | **Express** + `better-sqlite3` | `/api/cars`, `/api/ninjas`, `/api/carapi`, **`/api/leads` (POST/GET)**, `/api/health`, static | Menyimpan lead; middleware CORS `/api`; `main` di package.json | **★ Kanonik** |
| `server/proxy.js` | `http` inti (tanpa dependensi) | `/api/cars`, `/api/ninjas`, `/api/carapi`, static | Nol dependensi, ringan | Alternatif/dev cepat |

> Keputusan v2: jadikan **`app.js` kanonik** (mendukung lead). `proxy.js` tetap sebagai opsi ringan. Keduanya **wajib** menjaga kontrak endpoint & perilaku proxy yang sama.

### 7.2 Kontrak Endpoint
| Endpoint | Metode | Query/Body | Perilaku |
|---|---|---|---|
| `/api/health` | GET | — | `{ ok:true, ts }` |
| `/api/cars` | GET | passthrough query MarketCheck | Tambah `api_key` (ENV) → `marketcheck.com/v2/search/car/active`; status upstream diteruskan; 500 bila key kosong |
| `/api/ninjas` | GET | `path` ∈ {cars, carmakes, carmodels, cartrims, cardetails} + query | Header `X-Api-Key` (ENV) → `api-ninjas.com/v1/<path>`; 400 bila path tak diizinkan |
| `/api/carapi` | GET | `path` (allowlist prefix) + query | Auth JWT (cache s.d. exp; retry sekali saat 401) → `carapi.app/api/<path>`; 400 bila path di luar allowlist |
| `/api/leads` | POST | `{name, email?, phone?, message?, items[]}` | Validasi `name + (email\|phone)`; simpan SQLite; `201 {ok, lead}` |
| `/api/leads` | GET | `limit` (1–1000) | Daftar lead terbaru (⚠️ belum ada auth — backlog) |

### 7.3 Keamanan proxy
- Kunci API **hanya** dari ENV: `MARKETCHECK_API_KEY`, `API_NINJAS_KEY`, `CARAPI_TOKEN`, `CARAPI_SECRET`. Tak pernah dikirim ke browser.
- **Allowlist path** untuk Ninjas & CarAPI mencegah SSRF/penyalahgunaan proxy.
- CarAPI: JWT di-cache dengan waktu kedaluwarsa dari klaim `exp`; auto refresh saat 401.
- CORS `Access-Control-Allow-Origin: *` hanya pada `/api` (app.js) untuk memudahkan dev.
- Traversal statis dicegah (`filePath` harus di bawah `ROOT`).

### 7.4 Mirror serverless (`api/`)
`api/cars.js`, `api/ninjas.js`, `api/carapi.js` menyediakan logika proxy yang sama sebagai **fungsi serverless** (mis. Vercel) sehingga path `/api/*` yang dipanggil klien tetap valid tanpa server Node berjalan sendiri. ENV di-set di dashboard hosting.

---

## 8. Desain Antarmuka (UI) & Styling
- **Design system:** PRD §8. Token **tunggal** di `css/tokens.css`; **`design-system.css` dinetralkan** agar tak menimpa aksen/radius.
- **Komponen lintas-halaman** (`css/components.css`): `.btn-solid/.btn-ghost/.btn-link`, `.toast`, `.modal`, `.cart-drawer`, `.chip`, `.badge`, `.kicker`, `.anim-up`. Token-based; tanpa shadow dekoratif; radius ≤4px; pemisah hairline.
- **Ikon:** **RemixIcon** (satu library). About dimigrasikan dari BoxIcons.
- **Navbar:** satu markup + `nav.js` untuk semua halaman (menggantikan 3 varian).
- **Responsif:** grid katalog `repeat(4→3→2→1)`; drawer full-width di mobile.
- **Aksesibilitas:** kontras AA; `aria-label` tombol ikon; `aria-live="polite"` toast & jumlah hasil; fokus terlihat; modal trap fokus; `skip-link`.

---

## 9. Penanganan Error & Edge Case
| Kasus | Penanganan |
|---|---|
| `localStorage` tak tersedia | `PC.storage` fallback memori; app tetap jalan |
| Cart berisi id yang tak ada di data | `cart.items()` skip & bersihkan |
| Search tanpa hasil | Empty-state "Tidak ada unit yang cocok" |
| Form tidak valid | Cegah submit, tandai field, fokus ke error pertama |
| DP ≥ harga di simulator | Pesan error, jangan hitung |
| Gambar gagal dimuat | `onerror` → placeholder netral |
| Backend absen / kuota API habis | Fitur API tampil pesan ramah; katalog pakai `PC.cars` lokal |
| Key API belum di-set | Endpoint balas 500 dengan pesan jelas; UI menampilkan info non-blok |
| CarAPI token kedaluwarsa (401) | Server buang cache, login ulang, retry sekali |
| Path proxy tak diizinkan | Server balas 400 (allowlist) |

---

## 10. Performa
- Data unit di-embed → tanpa network untuk katalog inti.
- Gambar `loading="lazy"` di bawah lipatan; `object-fit: contain`.
- Render katalog via **DocumentFragment**; debounce search 200ms.
- CSS & JS dipecah per-halaman.
- Hero Three.js opsional & di-skip di `file://` / `prefers-reduced-motion`; ada fallback gambar → tak menghambat LCP.
- Animasi hormati `prefers-reduced-motion` (token motion dinetralkan di `tokens.css`).

---

## 11. Keamanan
- Tidak ada kredensial di klien; semua rahasia di ENV server.
- Render teks dari input/`PC.cars`/respons API via `textContent`/pembuatan node (bukan `innerHTML` mentah) → cegah XSS.
- Parameter `wa.me`/upstream di-`encodeURIComponent`; query proxy dibangun via `URLSearchParams`.
- Allowlist path proxy; validasi input lead di server.
- **Backlog keamanan:** lindungi `GET /api/leads` dengan auth sebelum produksi; batasi CORS di produksi.

---

## 12. Strategi Pengujian
| Lapis | Cara | Cakupan |
|---|---|---|
| Manual fungsional | Checklist Acceptance Criteria PRD §7 | semua alur |
| Konsistensi UI | Bandingkan navbar/footer/tombol/ikon 3 halaman | 100% seragam |
| Lintas-browser | Chrome, Firefox, Edge, Safari (2 versi) | rendering & JS |
| Responsif | DevTools 320/768/1024/1440 | layout |
| Aksesibilitas | Lighthouse a11y + keyboard | ≥90 |
| Performa | Lighthouse mobile | ≥85 |
| State | Tambah/hapus Daftar Minat → reload → persist | localStorage |
| API/Proxy | Uji `/api/*` dengan & tanpa key; simulasi 401 CarAPI & kuota | fallback & error benar |
| Lead | `POST /api/leads` valid/invalid → cek SQLite | validasi & simpan |

---

## 13. Keputusan Desain (Rationale)
| Keputusan | Alasan | Alternatif ditolak |
|---|---|---|
| Namespace global `PC`, bukan ES Module | Jalan di `file://` tanpa server/bundler | ES Modules (butuh server) |
| Data di-embed sebagai JS, bukan `fetch` JSON | Hindari CORS di `file://`; statis-first | `fetch('cars.json')` |
| State di `localStorage` + pub/sub | Persist tanpa backend, decoupling | Variabel global tersebar |
| **Proxy server untuk API** | Rahasiakan kunci API; hindari CORS klien | Panggil API langsung dari browser (bocor key) |
| **Allowlist path proxy** | Cegah proxy jadi open relay/SSRF | Teruskan path apa pun |
| **CarAPI JWT cache + retry 401** | Kurangi login berulang; tahan kedaluwarsa | Login tiap request / abaikan 401 |
| **`app.js` (SQLite) kanonik** | Butuh simpan lead untuk tim sales | Hanya proxy tanpa penyimpanan |
| Mirror serverless `api/` | Deploy tanpa server Node persisten | Node-only (butuh host proses) |
| Lead WhatsApp untuk "checkout" | Sesuai scope MVP tanpa pembayaran | Payment gateway (out of scope) |
| Bunga flat di simulator | Transparan & mudah dipahami | Anuitas (lebih kompleks) |
| **Satu navbar/ikon/token (redesign v2)** | Konsistensi = kunci kesan profesional | Membiarkan 3 varian + 2 icon lib |

---

## 14. Rencana Remediasi Teknis (Redesign v2)
Selaras PRD §10 & §12:
1. **Netralkan `css/design-system.css`** (atau hapus link-nya) → `tokens.css` jadi satu-satunya sumber token.
2. **Satu komponen navbar + `nav.js`** untuk `index/penjualan/about` (markup, kelas, `aria`, perilaku identik).
3. **Migrasi ikon About** BoxIcons → RemixIcon; hapus `<link>` BoxIcons.
4. **Samakan kosakata kelas About** ke sistem bersama (`kicker`, `section-head`, `btn-*`, footer).
5. **Tetapkan `server/app.js` kanonik**; sinkronkan endpoint dengan `proxy.js`; dokumentasikan ENV & Vercel di README.
6. **Standarkan harga (Rupiah) & bahasa (ID)** di semua render.
7. Verifikasi urutan muat script & keberadaan semua file (mis. `marketcheck.js` di penjualan bila dipakai).

---

*SDD ini mengikat untuk implementasi. Perubahan arsitektur wajib memperbarui versi dokumen. Lihat **[PRD.md](PRD.md)** untuk kebutuhan produk & aturan desain.*
