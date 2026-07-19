# Premium Cars — Web (Next.js)

Company profile **+** marketplace jual-beli mobil mewah dalam satu website,
dibangun ulang dari desain Stitch (`stitch_premium_cars/`) menggunakan
**Next.js 14 (App Router) + Tailwind CSS**.

Sumber kebenaran design system: `stitch_premium_cars/dark_editorial_garage/DESIGN.md`
("Dark Editorial Garage" — Industrial Minimalism, Charcoal & Molten Amber `#FF6A00`,
Oswald + Inter, sudut tajam, hairline outline, tanpa shadow).

## Menjalankan

```bash
cd premium-cars-web
npm install
npm run dev      # http://localhost:3000
npm run build    # produksi
```

## Deploy ke Vercel

Next.js zero-config di Vercel. Dari dalam folder ini:

```bash
cd premium-cars-web
vercel login          # sekali saja (browser/email) — langkah yang butuh Anda
vercel                # deploy preview
vercel --prod         # deploy production
```

Non-interaktif (mis. dengan token dari Account Settings → Tokens):

```bash
vercel deploy --prod --yes --token=YOUR_VERCEL_TOKEN
```

Set env var opsional lewat dashboard Vercel atau:

```bash
vercel env add API_NINJAS_KEY
vercel env add MARKETCHECK_API_KEY
```

> Root directory di Vercel = `premium-cars-web` (jalankan `vercel` dari sini,
> atau set "Root Directory" ke `premium-cars-web` bila deploy dari root repo).

## Struktur

```
app/
  page.jsx              Home (hero profil + preview marketplace + band beli/jual)
  heritage/             Company profile / tentang + timeline
  katalog/              Marketplace: listing + spec finder + kalkulator
  katalog/[slug]/       Detail unit + simulasi cicilan + unit serupa
  cicilan/              Simulasi & alur pembiayaan
  jual/                 Sell & Trade hub (Convert Your Masterpiece)
  jual/appraisal/       Vehicle Appraisal — formulir 3 fase + komitmen
  jual/trade-in/        Equity Analyzer — bandingkan aset vs unit target
  jual/consignment/     Private Consignment — private treaty + concierge
  journal/              Editorial
  membership/           Tier keanggotaan
  kontak/               Form kontak + info showroom
components/             Navbar, Footer, CarCard, FinanceCalculator, AppraisalForm, …
lib/                    cars.js (inventaris) · content.js (editorial/heritage)
tailwind.config.js      Token design system Dark Editorial Garage
```

## Dua fungsi, satu website

- **Company profile:** Home, Heritage, Journal, Membership, Kontak
- **Jual-beli mobil:** Katalog, Detail Unit, Cicilan, Jual (Appraisal/Consignment/Trade-In)

## Data realtime (opsional)

Katalog mengambil inventaris via `getInventory()` (server-side):

- **Tanpa env key** → memakai data kurasi lokal (`lib/cars.js`). Badge "Curated".
- **`MARKETCHECK_API_KEY` di-set** → menarik listing aktif (harga, foto, mileage)
  dari MarketCheck, dinormalisasi ke bentuk kartu. Badge "Live". Key hanya
  dibaca di server, tidak pernah dikirim ke browser.

Fitur **Cek Spesifikasi** (bawah halaman Katalog) menarik spesifikasi teknis
nyata dari **API Ninjas `/v1/cars`** melalui route handler `app/api/specs`.
Set `API_NINJAS_KEY` untuk mengaktifkannya; tanpa key, UI menampilkan pesan jelas.

```bash
cp .env.example .env.local   # lalu isi key yang Anda punya
```

### Market Intelligence (`/harga-pasar`)

Riset harga pasar nasional & internasional untuk semua merek/model dari
tahun lama sampai baru:

| Data | Sumber (urutan prioritas) | Key |
| --- | --- | --- |
| Katalog merek/model/tahun (1980–sekarang) | **NHTSA vPIC** | tidak perlu (gratis) |
| Harga pasar internasional | 1. **Auto.dev** (listing aktif AS) 2. **MarketCheck** 3. **Tabela FIPE** Brasil (harga resmi bulanan) | 1. `AUTODEV_API_KEY` 2. `MARKETCHECK_API_KEY` 3. **tanpa key** |
| Kurs USD/BRL→IDR live | **frankfurter.app** | tidak perlu (gratis) |
| Estimasi harga nasional | median × kurs × `NATIONAL_PRICE_FACTOR` (pajak impor CBU, default 2.4) | — |

**Zero-config = tetap live**: tanpa key apa pun, terminal memakai Tabela
FIPE (gratis, tanpa registrasi) sehingga harga pasar internasional tetap
data nyata. Mode demo hanya muncul bila seluruh sumber tak terjangkau.

Endpoint internal:
- `GET /api/inventory` → `{ source, count, cars }`
- `GET /api/specs?make=BMW&model=M4` → spesifikasi live
- `GET /api/catalog` → daftar merek; `?make=Porsche&year=1995` → daftar model
- `GET /api/market?make=Porsche&model=911&year=2020` → laporan pasar lengkap
  (jumlah listing, harga internasional USD/IDR, kurs, estimasi nasional, spesifikasi)
- `POST /api/leads` → terima lead (contact / newsletter / appraisal /
  consignment) dengan validasi, honeypot, dan rate-limit. Semua formulir
  situs tersambung ke sini. Lead disimpan ke `data/leads.json` (lokal;
  `/tmp` di Vercel) dan diteruskan ke `LEADS_WEBHOOK_URL` serta email
  (Resend) bila env di-set.
- `GET /api/leads` (header `Authorization: Bearer $ADMIN_TOKEN`) → daftar
  lead tersimpan.

## Cara mendapatkan API key (semua opsional)

| Layanan | Untuk apa | Cara dapat key |
| --- | --- | --- |
| **Auto.dev** | Listing aktif pasar AS (jumlah + harga real-time) | auto.dev → Sign Up (gratis) → dashboard → salin API key → `AUTODEV_API_KEY` |
| **MarketCheck** | Alternatif listing + statistik harga | marketcheck.com/apis → daftar → key → `MARKETCHECK_API_KEY` |
| **API Ninjas** | Spesifikasi teknis | api-ninjas.com → daftar gratis → `API_NINJAS_KEY` |
| **Resend** | Email notifikasi lead | resend.com → API key → `RESEND_API_KEY` + `LEADS_EMAIL_TO` |
| vPIC / FIPE / frankfurter | Katalog, harga FIPE, kurs | **tidak perlu key** |

Set di lokal (`.env.local`) atau `vercel env add NAMA_KEY`.

## Real-time tanpa berhenti — cara kerjanya

1. **Cache berjenjang di server**: katalog vPIC 24 jam, kurs 12 jam,
   riwayat FIPE 12 jam, listing selalu segar (`no-store`).
2. **Auto-refresh klien**: halaman Harga Pasar mengambil ulang laporan
   tiap 60 detik selama tab terlihat — data bergerak tanpa reload.
3. **Upgrade path** (lihat docs/SDD.md): Vercel Cron untuk snapshot harga
   harian, lalu SSE/WebSocket bila butuh push di bawah 60 detik.

## Dokumen fondasi

`docs/PRD.md` → `docs/SRS.md` → `docs/SDD.md` → `docs/UIUX.md` →
`docs/TASKS.md` — urutan update mengikuti kontrak antar dokumen.

## Motion system

Animasi GPU-only (opacity/transform), hormat `prefers-reduced-motion`:

- `components/Reveal.jsx` — scroll-reveal + stagger anak elemen
- `components/CountUp.jsx` — angka statistik & panel ekuitas berlari ke nilainya
- `app/template.jsx` — transisi masuk di setiap navigasi
- `globals.css` — hero line-rise, Ken Burns (`.kenburns`), sheen tombol
  (`.btn-sheen`), garis aksen tumbuh, marquee pause-on-hover
- Navbar menyingkir saat scroll turun, muncul lagi saat naik

## Catatan

- Foto mobil memakai URL Unsplash; `SmartImage` menampilkan fallback gradient +
  nama unit bila sebuah gambar gagal dimuat (tidak pernah ikon rusak).
  Ganti field `image`/`gallery` di `lib/cars.js` dengan aset final Anda kapan saja.
- Kalkulator cicilan & appraisal memakai heuristik estimasi (flat-rate / depresiasi)
  untuk demonstrasi — sambungkan ke API/leasing riil untuk produksi.
- Listing live (MarketCheck) mengarah ke `/kontak` (Inquire) karena belum punya
  halaman detail statis; unit kurasi lokal punya halaman `/katalog/[slug]`.
