# PREMIUM CARS — Company Profile

**Company profile** untuk showroom mobil mewah: memperkenalkan brand, memamerkan
koleksi unit (katalog interaktif), dan menjadi kanal *lead* (Daftar Minat → WhatsApp,
form kontak). Dibangun dengan **HTML + CSS + JavaScript vanilla**, tanpa framework
dan tanpa proses build.

> Ini company profile, bukan toko online. "Daftar Minat" & "Kirim Permintaan via
> WhatsApp" berfungsi sebagai *lead generation* (bukan transaksi/pembayaran).

## Halaman

| Halaman | File | Isi |
|---|---|---|
| Home | `index.html` | Hero, kategori unit, slider unggulan, cerita, partner, newsletter |
| Katalog | `penjualan.html` | Katalog dinamis: cari, filter kategori, urutkan, detail unit, Daftar Minat, simulasi cicilan, kontak |
| About | `about.html` | Profil, hal penting sebelum membeli mobil, kontak |

## Struktur Project

```
COMPANY PROFILE/
├── index.html · penjualan.html · about.html
│
├── css/
│   ├── tokens.css        # design token: warna, font, spasi (SUMBER TUNGGAL)
│   ├── components.css     # komponen lintas-halaman: toast, modal, tombol
│   ├── home.css · penjualan.css · about.css
│
├── js/
│   ├── data/cars.js       # dataset unit + kategori
│   ├── lib/               # format · storage · store (state) · ui (toast/modal)
│   ├── components/         # catalog · cart · simulator · forms · nav
│   └── home.js · penjualan.js · about.js   # entry per halaman
│
├── image/ · about/ · logo/ · icon/         # aset
└── PRD.md · SDD.md · README.md              # dokumentasi
```

Arsitektur memakai namespace global `PC` (PremiumCars). Detail di **[SDD.md](SDD.md)**.

## Fitur Katalog (client-side)

- 🔎 **Pencarian** real-time (debounce) + **filter kategori** (chip) + **urut** harga/tahun
- 🚗 **Modal detail** unit (spesifikasi lengkap)
- 🔖 **Daftar Minat** tersimpan di `localStorage` → **Kirim Permintaan via WhatsApp**
- 🧮 **Simulasi cicilan** (DP, tenor, bunga flat)
- ✅ **Validasi form** kontak & newsletter + notifikasi toast
- 🔗 Kartu kategori di Home tersambung ke katalog (`penjualan.html?cat=sport`)

## Menjalankan

Cukup buka `index.html` di browser (semua fitur jalan tanpa server karena data
di-*embed*, bukan di-`fetch`). Untuk pengalaman terbaik, jalankan server statis:

```bash
python -m http.server 5500
# buka http://localhost:5500
```

## Konfigurasi

- Nomor WhatsApp tujuan lead: ubah `PC.config.whatsapp` di `js/components/cart.js`.
- Palet & font: `css/tokens.css`. Data unit: `js/data/cars.js`.

## Checklist Produksi (sebelum go-live)

Project sudah lengkap & berfungsi. Tiga hal berikut butuh **data asli Anda**:

- [ ] **Nomor WhatsApp** → `js/components/cart.js` (`PC.config.whatsapp = "62..."`)
- [ ] **Domain** → ganti `premiumcars.example.com` di `sitemap.xml` & `robots.txt`
- [ ] **Google Analytics** → buka komentar `<!-- GA4 -->` di `<head>` tiap halaman & isi `G-XXXXXXXXXX`

Opsional (peningkatan performa lanjutan):
- [ ] Konversi foto besar (`.jpg/.avif`) ke **WebP** untuk ukuran lebih kecil
- [ ] Jalankan **Lighthouse** di Chrome DevTools untuk skor akhir

## Dokumentasi

- **[PRD.md](PRD.md)** — kebutuhan produk & aturan desain (anti "AI-look").
- **[SDD.md](SDD.md)** — desain teknis: arsitektur, modul, model data, alur.
