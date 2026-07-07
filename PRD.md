# PRD — Company Profile "PREMIUM CARS"

**Product Requirements Document (Dokumen Persyaratan Produk)**

|                      |                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Nama Produk**      | PREMIUM CARS — Company Profile & Katalog Showroom Mobil                                                               |
| **Versi Dokumen**    | 2.0 (revamp UI/UX + integrasi API)                                                                                   |
| **Tanggal**          | 2 Juli 2026                                                                                                          |
| **Pemilik / Author** | Zainul Arkaan                                                                                                        |
| **Status**           | Aktif — dasar untuk redesign profesional "Dark Editorial Garage v2"                                                 |
| **Jenis Proyek**     | Company Profile Web multi-halaman (statis-first) + tier backend opsional (proxy API & lead)                          |
| **Stack Saat Ini**   | HTML5, CSS3 (vanilla, design tokens), JavaScript (vanilla ES6, namespace `PC`), Swiper.js, ScrollReveal, Three.js, RemixIcon, Google Fonts, Node.js 18+ (Express/http), better-sqlite3 |

> **Perubahan v1.0 → v2.0.** Dokumen ini memperbarui PRD lama agar mencerminkan kondisi produk **saat ini** (katalog interaktif penuh, simulasi cicilan, integrasi data live MarketCheck / API Ninjas / CarAPI, penyimpanan lead, hero Three.js) sekaligus menetapkan **mandat redesign**: menyatukan tampilan lintas halaman menjadi satu sistem yang benar-benar terlihat profesional (kelas agensi), bukan gabungan template.

---

## 1. Ringkasan Eksekutif

PREMIUM CARS adalah **website company profile sekaligus katalog digital** untuk showroom/dealer mobil mewah dan sport (hypercar, sport, SUV, family, electric, classic). Tujuan situs: membangun **kesan brand premium**, memamerkan koleksi unit yang mudah dijelajahi, memberi informasi harga/cicilan yang transparan, dan menjadi **kanal lead** utama (Daftar Minat → WhatsApp, form kontak).

Situs terdiri dari tiga halaman inti:

1. **Home (`index.html`)** — etalase brand: hero sinematik, kategori mobil, sorotan unit cicilan (slider), jurnal/cerita, partner brand (marquee), newsletter.
2. **Shopping / Penjualan (`penjualan.html`)** — katalog interaktif: cari, filter kategori, urutkan, detail unit (modal), Daftar Minat + checkout lead WhatsApp, simulasi cicilan, **Cek Spesifikasi** (API Ninjas), **CarAPI Lookup** (trim resmi), form kontak.
3. **About (`about.html`)** — profil perusahaan, visi-misi, nilai, edukasi dokumen sebelum membeli, kontak.

Di atas lapisan statis, tersedia **tier backend opsional** (Node) yang berfungsi sebagai *proxy* aman ke API pihak ketiga (kunci API tidak pernah bocor ke browser) dan penyimpanan lead ke SQLite. Tanpa backend, situs **tetap berjalan penuh** memakai data unit yang di-*embed*.

Dokumen ini menetapkan persyaratan **fungsional, non-fungsional, desain, dan teknis** agar produk tampil dan terasa seperti karya **agensi desain profesional — bukan template AI generik**.

---

## 2. Latar Belakang & Masalah yang Diselesaikan

| Masalah                                                            | Dampak                                        | Solusi yang Ditawarkan                                            |
| ----------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| Showroom belum punya etalase digital yang kredibel                | Calon pembeli ragu, brand terlihat kecil      | Company profile dengan estetika premium & konsisten              |
| Katalog unit tersebar (chat/sosmed)                               | Sulit membandingkan unit & harga              | Katalog terstruktur: cari, filter, urutkan, detail               |
| Tidak ada kanal lead terpusat                                     | Lead hilang / lambat ditindaklanjuti          | Daftar Minat + CTA WhatsApp + form kontak → tersimpan (leads DB) |
| **Tampilan tidak konsisten antar halaman** (nav, ikon, komponen)  | Terlihat "gabungan template" / amatir         | **Redesign v2**: satu design system tegas untuk semua halaman    |
| Spesifikasi unit sering diragukan pembeli                         | Kepercayaan turun                             | Integrasi data spesifikasi live (API Ninjas / CarAPI)            |

**Temuan audit (utang teknis nyata yang memicu kesan "kurang profesional"):**

- **Tiga implementasi navbar berbeda** di tiga halaman: `index.html` (`.nav_link` / `#menu-btn`), `penjualan.html` (`.nav-links` / `#hamburger`), `about.html` (`.nav_list` / `#nav_togle`). Markup, kelas, dan perilaku toggle tidak seragam.
- **Dua library ikon** dipakai bersamaan: RemixIcon (home, penjualan) dan **BoxIcons** (about) — melanggar aturan "satu library ikon".
- **`css/design-system.css` menimpa token** inti saat dimuat paling akhir di `index.html` (aksen bergeser `#FF6A00` → `#FF6B3D`, radius `2px` → `12px`) sehingga hasil visual tak sesuai design system.
- **Dua server** hidup berdampingan: `server/proxy.js` (tanpa dependensi) dan `server/app.js` (Express + SQLite). Perlu satu yang kanonik.
- Kosakata kelas **About** berbeda total (`bd_grid`, `i_header`, `home_social`) dari Home/Penjualan.

---

## 3. Tujuan & Sasaran (Goals)

### 3.1 Tujuan Bisnis
- Meningkatkan kredibilitas brand showroom secara online.
- Menghasilkan **lead** berkualitas (Daftar Minat / WhatsApp / form kontak).
- Menyajikan katalog unit yang mudah dijelajahi & dibandingkan.

### 3.2 Tujuan Produk
- Situs **responsif penuh** (mobile, tablet, desktop) tanpa horizontal scroll.
- **Page load cepat** (< 3 detik di 4G) walau kaya interaksi.
- Desain **konsisten, premium, satu sistem** di semua halaman — tidak terlihat "AI-generated" atau tempelan template.

### 3.3 Sasaran Terukur (KPI)

| Metrik                                 | Target                                          |
| -------------------------------------- | ----------------------------------------------- |
| Lighthouse Performance (mobile)        | ≥ 85                                            |
| Lighthouse Accessibility               | ≥ 90                                            |
| Largest Contentful Paint (LCP)         | < 2,5 detik                                     |
| Cumulative Layout Shift (CLS)          | < 0,1                                           |
| Bounce rate halaman Home               | < 55%                                           |
| Konversi klik CTA "Hubungi/WhatsApp"   | ≥ 5% dari pengunjung                            |
| Konsistensi komponen lintas halaman    | 100% (nav, footer, tombol, ikon = 1 sistem)     |
| Kompatibilitas browser                 | 2 versi terakhir Chrome, Firefox, Safari, Edge  |

---

## 4. Target Pengguna (User Personas)

**Persona 1 — "Andre, Kolektor Mobil" (32 th).** Mencari hypercar/sport edisi terbatas. Mengutamakan tampilan premium & detail spesifikasi. Desktop.

**Persona 2 — "Bu Sinta, Keluarga Muda" (38 th).** Mencari mobil keluarga (Alphard, SUV). Peduli harga, opsi cicilan, kemudahan kontak. Ponsel.

**Persona 3 — "Rizki, First-time Buyer" (26 th).** Tertarik sport/electric. Sensitif harga, memakai simulasi cicilan, banyak membandingkan. Mobile/desktop campuran.

**Persona 4 — "Tim Sales PREMIUM CARS" (internal).** Butuh lead masuk terpusat, tersimpan rapi (nama, kontak, unit yang diminati), siap ditindaklanjuti.

---

## 5. Lingkup Produk (Scope)

### 5.1 Termasuk (In Scope)

**Frontend (statis-first, wajib jalan tanpa backend):**
- 3 halaman: Home, Shopping/Penjualan, About — **satu design system**.
- Navigasi & footer **identik** di semua halaman (satu komponen, satu perilaku).
- Hero Home: headline + form pencarian (UI) + visual mobil (opsional hero Three.js dengan fallback gambar).
- Grid kategori (Hypercar, Family, Sport, Electric, dst.).
- Slider unit unggulan (Swiper) dengan info spesifikasi + harga.
- **Katalog interaktif:** pencarian real-time (debounce), filter kategori (chip), urutkan (harga/tahun/unggulan), grid kartu konsisten, modal detail unit.
- **Daftar Minat** (wishlist/keranjang) persist di `localStorage` → **checkout sebagai lead WhatsApp**.
- **Simulasi cicilan** (harga, DP, tenor, bunga flat).
- **Cek Spesifikasi** unit dari **API Ninjas** (merek + model → mesin, transmisi, bahan bakar).
- **CarAPI Lookup** (pilih merek → model → trim resmi).
- Form kontak & newsletter dengan validasi + notifikasi toast.
- Jurnal/cerita, marquee partner, footer lengkap.

**Backend (tier opsional, meningkatkan keamanan & fitur):**
- **Proxy API** aman: `/api/cars` (MarketCheck), `/api/ninjas` (API Ninjas), `/api/carapi` (CarAPI) — kunci API hanya di server (ENV), **tak pernah** sampai ke browser.
- **Penyimpanan lead**: `POST /api/leads` (simpan ke SQLite) & `GET /api/leads` (daftar untuk admin).
- Deployment ganda: **lokal** (Node) dan **serverless** (fungsi di folder `api/` untuk Vercel).

### 5.2 Tidak Termasuk (Out of Scope)
- Pembayaran/checkout nyata (semua CTA "beli" bersifat **lead**, bukan transaksi).
- Autentikasi pengguna / akun / panel admin ber-login (endpoint `GET /api/leads` masih tanpa auth — lihat §9 Keamanan, backlog).
- CMS untuk konten.
- Multi-bahasa (i18n) penuh — bahasa utama **Bahasa Indonesia** (istilah otomotif EN diperbolehkan).

### 5.3 Backlog / Fase Berikutnya
- Halaman detail unit ber-URL (`/car/:id`) untuk SEO & share.
- Autentikasi & dashboard admin untuk lead.
- Notifikasi lead ke email/WhatsApp otomatis (webhook).
- Caching hasil API (mengurangi kuota panggilan pihak ketiga).
- Sinkronisasi katalog dari MarketCheck ke data lokal.

---

## 6. Struktur Situs (Sitemap) & Navigasi

```
PREMIUM CARS
├── Home (index.html)
│   ├── Hero + form pencarian (+ hero Three.js opsional)
│   ├── Kategori Mobil (grid)
│   ├── Sorotan / "Cari mobil yang ingin dimiliki"
│   ├── Unit Cicilan (slider Swiper)
│   ├── Stories / Jurnal (grid)
│   ├── Partner Brand (marquee)
│   ├── Download App / Promo
│   ├── Newsletter
│   └── Footer
├── Shopping / Penjualan (penjualan.html)
│   ├── Hero
│   ├── Katalog interaktif (cari · filter · urut · detail · Daftar Minat)
│   ├── Simulasi Cicilan
│   ├── Cek Spesifikasi (API Ninjas)
│   ├── CarAPI Lookup (trim resmi)
│   ├── Kontak (form + sosial)
│   └── Footer
└── About (about.html)
    ├── Profil Perusahaan + statistik
    ├── Visi & Misi
    ├── Nilai / Kenapa PREMIUM CARS
    ├── Sebelum Membeli (dokumen penting)
    ├── Kontak
    └── Footer
```

**Aturan navigasi (WAJIB seragam setelah redesign):**
- Satu markup navbar dipakai ketiga halaman: item, urutan, kelas, dan perilaku toggle **identik**.
- Item nav final yang disepakati (menghilangkan link mati): **HOME · ABOUT · KATALOG · CICILAN · KONTAK**.
- State aktif menandai halaman/anchor saat ini (indikator aksen / underline).
- Mobile: satu pola hamburger; menutup otomatis saat link diklik; `aria-expanded` sinkron.
- Logo selalu mengarah ke Home. **Tidak ada link mati** (semua `href` valid).

---

## 7. Persyaratan Fungsional (Per Halaman)

Format: **User Story → Kriteria Penerimaan (Acceptance Criteria).**

### 7.1 Global (Semua Halaman)

**FR-G1 — Navigasi konsisten**
- [ ] Navbar identik (markup, item, urutan) di semua halaman.
- [ ] < 992px → hamburger; tap buka/tutup; `aria-expanded` benar; menu tutup saat link diklik.
- [ ] Link aktif punya indikator visual; tidak ada link mati.

**FR-G2 — Footer konsisten**
- [ ] Struktur footer sama di semua halaman (brand, kolom link, sosial, copyright).
- [ ] Ikon sosial memakai **satu** library ikon.

**FR-G3 — Responsif & satu ikonografi**
- [ ] Tidak ada horizontal scroll 320px–1440px; gambar tidak overflow.
- [ ] Hanya **satu** library ikon di seluruh situs (RemixIcon).

### 7.2 Home (`index.html`)

**FR-H1 — Hero.** Headline besar + visual mobil + form pencarian (Lokasi/Mulai/Selesai). Form MVP = UI + validasi field tak kosong. Hero Three.js **opsional**, wajib ada fallback gambar dan **tidak** menghambat LCP (skip di `file://` & saat `prefers-reduced-motion`).

**FR-H2 — Grid Kategori.** Kartu kategori bergambar + judul + tautan ke katalog terfilter (`penjualan.html?cat=<id>`). Hover memberi feedback tegas (tanpa shadow berlebihan).

**FR-H3 — Slider Unit Cicilan (Swiper).** Geser kiri/kanan; saat slide aktif berubah, info spesifikasi & harga ikut update; kelas `show_info` benar.

**FR-H4 — Stories/Jurnal.** Grid kartu artikel (tanggal, judul, ringkasan, gambar) — konten nyata sebelum rilis.

**FR-H5 — Marquee Partner.** Loop mulus; grayscale default → berwarna saat hover; hormati `prefers-reduced-motion`.

**FR-H6 — Newsletter.** Input email + tombol; validasi format email; tampilkan state sukses (toast).

### 7.3 Shopping / Penjualan (`penjualan.html`)

**FR-S1 — Katalog.**
- [ ] Grid kartu konsisten (rasio media sama, harga & CTA sejajar baseline).
- [ ] Pencarian real-time (debounce ~200ms) atas nama/brand.
- [ ] Filter kategori via chip; urutkan (unggulan / harga naik-turun / tahun).
- [ ] Empty-state saat tak ada hasil.
- [ ] Format harga **Rupiah** konsisten (mis. `Rp 56.000.000.000`).

**FR-S2 — Detail Unit (Modal).** Klik kartu → modal aksesibel (fokus terjebak, `Esc`/overlay menutup) berisi media, spesifikasi, harga, aksi (Daftar Minat / kontak).

**FR-S3 — Daftar Minat + Lead.**
- [ ] Toggle Daftar Minat per unit; badge jumlah di header sinkron; persist `localStorage`.
- [ ] Checkout menyusun ringkasan (unit × qty, total) → **WhatsApp** (`wa.me`, teks di-`encodeURIComponent`).
- [ ] Bila backend aktif, lead juga dapat dikirim ke `POST /api/leads`.

**FR-S4 — Simulasi Cicilan.** Input harga/DP/tenor → angsuran bulanan (bunga flat); validasi DP < harga; tampilkan angsuran + total bayar.

**FR-S5 — Cek Spesifikasi (API Ninjas).**
- [ ] Input merek + model → panggil `/api/ninjas?path=cars` → tampilkan kartu spesifikasi (mesin, silinder, transmisi, penggerak, bahan bakar, konsumsi).
- [ ] Chip contoh (BMW M4, Ford Mustang, dst.) sebagai jalan pintas.
- [ ] State jelas: memuat, kosong, error/kuota (pesan ramah), dan info bila key belum di-set.

**FR-S6 — CarAPI Lookup.**
- [ ] Pilih Merek → Model (aktif setelah merek) → Trim; tombol "Muat trim".
- [ ] Tampilkan kartu trim resmi; opsi tambah ke Daftar Minat.
- [ ] State memuat/kosong/error yang informatif.

**FR-S7 — Form Kontak.** Field Nama, Email, Telepon, Pesan (wajib); validasi (email valid, telepon angka); submit → konfirmasi toast + (opsional) `POST /api/leads`.

### 7.4 About (`about.html`)
- [ ] Profil perusahaan + statistik (unit, kategori, dokumen).
- [ ] Visi, Misi, Nilai inti.
- [ ] Edukasi "Sebelum Membeli" (BPKB, STNK, faktur).
- [ ] Form kontak (konsisten dengan Penjualan) + minimal satu CTA ke Katalog/Kontak.
- [ ] Konten nyata (bukan placeholder).

---

## 8. Persyaratan Desain (Design Requirements) ⭐

> **Wajib dipatuhi ketat.** Target: tampilan **mantap, rapi, menawan, premium — seperti agensi profesional**, dan **TIDAK terlihat dihasilkan AI**. Redesign v2 fokus pada **konsistensi lintas halaman** sebagai sumber utama kesan profesional.

### 8.1 Prinsip Anti-"AI Look" (Aturan Keras)

**DILARANG:** ❌ `box-shadow` berlebihan/mengambang di mana-mana · ❌ gradien pelangi/multi-warna norak · ❌ radius besar di semua kartu · ❌ layout "aman" generik (hero tengah + 3 kartu identik + emoji) · ❌ glassmorphism blur di mana-mana, pastel acak, ikon emoji.

**WAJIB:** ✅ **satu** arah desain, komit penuh (§8.2) · ✅ grid disiplin / editorial asimetris yang disengaja · ✅ **garis hairline 1px** + kontras warna sebagai pemisah (bukan shadow) · ✅ sudut tajam / radius kecil konsisten (maks 4px) · ✅ **whitespace** generous & ritmis (skala spasi) · ✅ hierarki tipografi jelas & kontras.

### 8.2 Arah Desain Terkunci — "Dark Editorial Garage"

> Latar charcoal, **satu** aksen molten-amber tajam, tipografi industrial kontras, grid disiplin, hairline sebagai pemisah. Premium, maskulin, otomotif, tidak norak. **Arah ini dikunci** — redesign v2 mengangkat kualitas eksekusinya, bukan mengganti arahnya.

### 8.3 Token Warna (single source of truth: `css/tokens.css`)

| Token            | HEX       | Penggunaan                                        |
| ---------------- | --------- | ------------------------------------------------- |
| `--bg`           | `#0B0B0C` | Latar utama (hampir hitam)                        |
| `--surface`      | `#141417` | Permukaan kartu / section                         |
| `--surface-2`    | `#1C1C21` | Hover / elevasi via warna (bukan shadow)          |
| `--line`         | `#2A2A30` | Garis hairline 1px (pemisah & border)             |
| `--line-soft`    | `#1F1F24` | Hairline lebih redup (grid editorial)             |
| `--text`         | `#F2F2F0` | Teks utama (off-white)                            |
| `--text-muted`   | `#9A9A93` | Teks sekunder / caption                           |
| `--text-dim`     | `#6A6A64` | Teks paling redup (index, meta)                   |
| `--accent`       | `#FF6A00` | **Aksen tunggal** (molten amber) — CTA, highlight |
| `--accent-press` | `#E85D00` | State aktif/ditekan                               |

**Aturan warna:** maksimal **satu** aksen; hanya untuk elemen penting (CTA primer, angka harga, garis fokus); tidak ada gradien selain dark-to-darker halus di overlay hero. **`css/design-system.css` yang menimpa token ini harus dihapus/dinetralkan** (lihat §10 utang teknis).

### 8.4 Tipografi

| Peran                  | Font (default aktif)                | Aturan                                                     |
| ---------------------- | ----------------------------------- | ---------------------------------------------------------- |
| **Display / Headline** | **Oswald** 600–800, UPPERCASE       | tracking rapat; industrial, otomotif, percaya diri         |
| **Body / UI**          | **Inter** 400/500                   | netral, sangat terbaca; panjang baris 60–75 karakter       |

Maksimal **2 font family**; ≤ 3 weight per family. (Alternatif display mewah: Archivo/Fraunces — pilih SATU sistem & konsisten.) Skala tipografi memakai `clamp()` di `tokens.css` (`--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-kicker`).

### 8.5 Layout, Spacing & Grid
- **Grid:** `max-width: 1280px`, gutter responsif `clamp(1.25rem, 5vw, 4rem)`, padding section vertikal `clamp(4.5rem, 9vw, 8.5rem)`.
- **Skala spasi (8px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px — **hanya nilai dari skala ini**.
- **Radius:** `--radius: 2px`, `--radius-lg: 4px`. Tidak ada pill kecuali elemen kecil yang disengaja (chip).
- **Pemisah:** border 1px `--line`; elevasi lewat kenaikan warna surface, **bukan** shadow dekoratif.
- **Kartu:** rasio media konsisten, padding seragam, harga & CTA align baseline yang sama.

### 8.6 Komponen (Component Spec — dipakai lintas halaman)

| Komponen            | Spesifikasi                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Tombol primer**   | Bg `--accent`, teks `--bg`, radius 2px, padding lega (≥ 16–18px vertikal), UPPERCASE, tracking `0.12em`, hover `--accent-press` + lift halus (easing premium) |
| **Tombol sekunder** | Transparan, border 1px `--line`, hover border/teks `--accent`                                                            |
| **Kartu**           | Bg `--surface`, border 1px `--line`, radius 2px, hover → `--surface-2` (tanpa translate/shadow berlebihan)              |
| **Input**           | Bg gelap/transparan, border `--line`, fokus border `--accent`, label uppercase kecil                                    |
| **Navbar**          | Sticky/fixed, tinggi 72px, bg gelap + blur, border-bottom hairline; **satu** implementasi untuk semua halaman           |
| **Chip filter**     | Border 1px `--line`, aktif → bg `--accent` teks `--bg`                                                                   |
| **Toast/Modal/Drawer** | Di `css/components.css`; token-based; radius ≤4px; pemisah hairline; aksesibel                                        |
| **Marquee logo**    | Grayscale + opacity rendah default; hover satu logo → penuh                                                              |

### 8.7 Ikonografi & Gambar
- **Satu** library ikon: **RemixIcon**. Migrasikan seluruh ikon BoxIcons di About ke RemixIcon.
- Foto mobil PNG latar transparan, di-align & diberi ruang napas seragam.
- Format efisien (AVIF/WebP) + `loading="lazy"` di bawah lipatan; sediakan `alt` deskriptif.

### 8.8 Motion / Animasi
- Transisi halus & fungsional (fade/slide, 200–600ms, easing `cubic-bezier(0.22,1,0.36,1)`).
- Hormati `prefers-reduced-motion: reduce` (token motion dinetralkan di `tokens.css`).
- Marquee, slider, hero Three.js **tidak** boleh menimbulkan CLS.

---

## 9. Persyaratan Non-Fungsional

| Kategori            | Persyaratan                                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Performa**        | LCP < 2,5s; bobot awal < 2MB; gambar AVIF/WebP; render katalog via DocumentFragment; debounce search; script per-halaman           |
| **Responsif**       | Breakpoint ≤480 / 481–768 / 769–991 / ≥992; grid katalog `4→3→2→1`; drawer full-width di mobile                                     |
| **Aksesibilitas**   | Kontras ≥ 4.5:1; `alt` bermakna; navigasi keyboard; fokus terlihat; `aria-label` tombol ikon; `aria-live` toast & jumlah hasil     |
| **SEO**             | `<title>` & `meta description` unik/halaman; 1× `h1`/halaman; Open Graph; `sitemap.xml`; `robots.txt`; URL bersih                   |
| **Kompatibilitas**  | 2 versi terakhir Chrome, Firefox, Safari, Edge; degradasi anggun tanpa JS & tanpa backend                                          |
| **Keamanan**        | Kunci API **hanya** di server (ENV), tak pernah di klien; render via `textContent`; parameter `wa.me`/upstream di-`encodeURIComponent`; allowlist path proxy |
| **Maintainability** | Token via CSS custom properties (satu sumber); komponen lintas-halaman dipisah; namespace `PC`; penamaan kelas konsisten            |
| **Ketahanan**       | Statis-first: semua konten inti & katalog tetap tampil jika JS/back-end gagal atau kuota API habis (fallback data lokal)            |

---

## 10. Arsitektur Ringkas & Utang Teknis

> Desain teknis lengkap ada di **[SDD.md](SDD.md)**. Ringkasnya: frontend berlapis (`data → lib → components → entry`) dengan namespace global `PC`, plus **tier backend opsional** (Node proxy + SQLite lead; mirror serverless di `api/`).

**Utang teknis yang HARUS diselesaikan pada redesign v2:**

1. **Satukan navbar** menjadi satu markup + satu `nav.js` untuk ketiga halaman (hapus 3 varian).
2. **Satu library ikon** (RemixIcon) — konversi BoxIcons di `about.html`.
3. **Hapus/netralkan `css/design-system.css`** yang menimpa token (aksen & radius).
4. **Tetapkan satu server kanonik.** Rekomendasi: `server/app.js` (Express) sebagai default karena mendukung lead SQLite; `server/proxy.js` (tanpa dependensi) sebagai alternatif ringan. Samakan daftar endpoint & perilaku, dokumentasikan salah satu di README.
5. **Selaraskan kosakata kelas** About agar memakai komponen/utility yang sama (kicker, section-head, btn, footer).
6. **Standarkan bahasa & format harga** (Bahasa Indonesia; Rupiah).
7. Pastikan urutan muat script benar di tiap halaman (lihat SDD §3.1) dan tak ada file yang hilang.

---

## 11. Konten & Aset
- **Bahasa:** utama **Bahasa Indonesia** (istilah otomotif EN boleh); konsisten satu gaya.
- **Harga:** **Rupiah**, format `Rp 56.000.000.000` (helper `PC.format.rupiah`).
- **Copywriting:** ganti semua placeholder/Lorem ipsum dengan narasi & deskripsi unit nyata sebelum rilis.
- **Foto unit:** konsisten (sudut, latar transparan, ukuran); `alt` deskriptif.
- **Logo partner:** versi grayscale konsisten untuk marquee.
- **Konfigurasi sebelum go-live:** nomor WhatsApp (`PC.config.whatsapp` di `js/components/cart.js`), domain di `sitemap.xml`/`robots.txt`, GA4 opsional, dan **kunci API** di ENV server (`MARKETCHECK_API_KEY`, `API_NINJAS_KEY`, `CARAPI_TOKEN`, `CARAPI_SECRET`).

---

## 12. Roadmap / Fase Pengerjaan (Redesign v2)

| Fase                          | Cakupan                                                                                                    | Output                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Fase 0 — Foundation**       | Rapikan token (hapus override `design-system.css`), pastikan `tokens.css` satu-satunya sumber; audit link  | Design system bersih         |
| **Fase 1 — Unifikasi Global** | Satu navbar + footer + ikonografi (RemixIcon) untuk semua halaman; komponen tombol/kartu seragam           | Konsistensi lintas halaman   |
| **Fase 2 — Home**             | Poles hero, kategori, slider, jurnal, marquee sesuai design system v2                                       | Home final                   |
| **Fase 3 — Penjualan**        | Poles katalog, detail, Daftar Minat, simulasi, Cek Spesifikasi, CarAPI Lookup, kontak                      | Penjualan final              |
| **Fase 4 — About**            | Konversi kosakata kelas ke sistem bersama; konten nyata + CTA                                              | About final                  |
| **Fase 5 — Backend**          | Tetapkan server kanonik; uji proxy (MarketCheck/Ninjas/CarAPI) & lead SQLite; dokumentasikan ENV & Vercel  | Backend rapi & terdokumentasi |
| **Fase 6 — Polish**           | A11y, SEO meta, optimasi gambar, uji Lighthouse & lintas-browser                                          | Siap rilis                   |

---

## 13. Risiko & Asumsi

**Asumsi:** situs harus tetap jalan **tanpa** backend (statis-first); aset gambar/logo tersedia; hosting statis (GitHub Pages/Netlify) atau Node/Vercel bila backend dipakai; kunci API disimpan aman di ENV.

| Risiko                                        | Mitigasi                                                            |
| --------------------------------------------- | ------------------------------------------------------------------ |
| Gambar berat memperlambat load                | Kompres AVIF/WebP, lazy-load, ukuran responsif                     |
| Kuota / kegagalan API pihak ketiga            | State fallback ramah; fitur API opsional; data unit lokal tetap ada |
| Kunci API bocor ke klien                      | **Wajib** lewat proxy server (ENV); jangan pernah embed di JS klien |
| Desain melenceng jadi "AI generik"            | Patuhi §8 ketat; review per fase; jaga konsistensi lintas halaman  |
| Dua server membingungkan                      | Pilih satu kanonik; dokumentasikan di README                       |
| Endpoint `GET /api/leads` tanpa auth          | Batasi/di-nonaktifkan di produksi hingga ada auth (backlog)        |
| Konten placeholder bocor ke produksi          | Checklist konten wajib sebelum rilis                               |

---

## 14. Definition of Done (DoD)

Sebuah halaman/fitur dianggap **selesai** bila:
- [ ] Memenuhi seluruh Acceptance Criteria fungsionalnya (§7).
- [ ] Mematuhi design system & aturan anti-AI (§8) — diverifikasi review.
- [ ] **Navbar, footer, tombol, kartu, ikon identik** dengan halaman lain (konsistensi 100%).
- [ ] Responsif 320px–1440px tanpa overflow.
- [ ] Lighthouse: Performance ≥ 85, A11y ≥ 90 (mobile).
- [ ] Tidak ada link mati, tidak ada placeholder/Lorem ipsum.
- [ ] Harga & bahasa terstandar (Rupiah, Bahasa Indonesia).
- [ ] Fitur API punya state memuat/kosong/error yang benar & tetap aman tanpa key.
- [ ] Lulus uji Chrome, Firefox, Safari, Edge (2 versi terakhir).

---

## 15. Lampiran — Prompt Singkat untuk Generator Desain/AI

```
Buat desain [Landing Page / katalog] untuk showroom mobil mewah "PREMIUM CARS".
Estetika: premium, rapi, menawan, seperti agensi desain profesional —
JANGAN gaya AI generik yang membosankan.

Arah: "Dark Editorial Garage" — latar charcoal (#0B0B0C), satu warna aksen
molten-amber (#FF6A00) saja, teks off-white (#F2F2F0). Tidak ada gradien
pelangi, tidak ada shadow mengambang, sudut tajam (radius ≤ 4px), pemisah
pakai garis hairline 1px (#2A2A30). Grid disiplin, whitespace luas.

Tipografi KONTRAS & ELEGAN: headline 'Oswald' UPPERCASE tracking rapat,
body 'Inter' 400/500. Maksimal 2 font. Hierarki jelas.

Konsistensi mutlak: navbar, footer, tombol, kartu, dan ikon (RemixIcon)
sama persis di semua halaman. Layout berani & berkomitmen. Bukan template.
```

---

## 16. Aturan Baku Project (perhatikan ini)

> "Desain ini tidak boleh terlihat seperti dihasilkan oleh AI. Hindari pola umum seperti bayangan (shadow) yang berlebihan, gradien pelangi, dan kartu (cards) dengan sudut yang terlalu membulat. Buat pilihan tata letak yang tegas, berani, dan berkomitmen pada pilihan tersebut (misalnya: minimalist grid yang rapi atau dark mode dengan aksen tunggal)."

> "Draf awalnya sudah bagus, tapi terasa kurang 'hidup'. Buat spasi (padding) di bagian tombol menjadi lebih lebar. Berikan jarak antar teks yang lebih renggang agar terkesan lebih premium dan mudah dibaca. Gunakan efek animasi transisi (easing) yang halus saat kursor mengarah ke tombol."

---

_Dokumen ini adalah sumber kebenaran (single source of truth) untuk pembangunan PREMIUM CARS. Perubahan signifikan wajib memperbarui versi dokumen. Lihat **[SDD.md](SDD.md)** untuk desain teknis._
