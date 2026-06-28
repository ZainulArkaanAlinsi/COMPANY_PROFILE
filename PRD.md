# PRD — Company Profile "PREMIUM CARS"

**Product Requirements Document (Dokumen Persyaratan Produk)**

|                      |                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Nama Produk**      | PREMIUM CARS — Company Profile & Katalog Showroom Mobil                                                |
| **Versi Dokumen**    | 1.0                                                                                                    |
| **Tanggal**          | 27 Juni 2026                                                                                           |
| **Pemilik / Author** | Zainul Arkaan                                                                                          |
| **Status**           | Draft untuk Implementasi                                                                               |
| **Jenis Proyek**     | Landing Page / Company Profile Web (multi-halaman, statis)                                             |
| **Stack Saat Ini**   | HTML5, CSS3 (vanilla), JavaScript (vanilla), Swiper.js, ScrollReveal, RemixIcon/BoxIcons, Google Fonts |

---

## 1. Ringkasan Eksekutif

PREMIUM CARS adalah **website company profile sekaligus katalog digital** untuk sebuah showroom/dealer mobil mewah dan sport (hypercar, sport, family, electric). Tujuan situs adalah membangun **kesan brand premium**, menampilkan koleksi unit, memberi informasi cicilan/harga, dan menjadi kanal kontak utama bagi calon pembeli.

Situs terdiri dari tiga halaman inti:

1. **Home (`index.html`)** — etalase brand: hero, kategori mobil, sorotan unit cicilan, cerita/blog, brand partner, newsletter.
2. **Shopping / Penjualan (`penjualan.html`)** — katalog produk mobil dengan harga + form kontak.
3. **About (`about.html`)** — profil perusahaan, visi-misi, nilai.

Dokumen ini menetapkan persyaratan **fungsional, non-fungsional, desain, dan teknis** agar produk bisa dibangun secara utuh, konsisten, dan terlihat seperti karya **agensi desain profesional — bukan template AI generik**.

---

## 2. Latar Belakang & Masalah yang Diselesaikan

| Masalah                                                 | Dampak                                   | Solusi yang Ditawarkan                             |
| ------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| Showroom belum punya etalase digital yang kredibel      | Calon pembeli ragu, brand terlihat kecil | Company profile dengan estetika premium            |
| Katalog unit tersebar (chat/sosmed)                     | Sulit membandingkan unit & harga         | Halaman katalog terstruktur dengan grid konsisten  |
| Tidak ada kanal kontak terpusat                         | Lead hilang / lambat ditindaklanjuti     | Form kontak + CTA WhatsApp di tiap halaman         |
| Desain lama tidak konsisten (warna, font, spacing acak) | Terlihat amatir / "buatan template"      | Design system tegas (token warna, tipografi, grid) |

---

## 3. Tujuan & Sasaran (Goals)

### 3.1 Tujuan Bisnis

- Meningkatkan kredibilitas brand showroom secara online.
- Menghasilkan **lead** (kontak/WhatsApp/form) dari calon pembeli.
- Menyajikan katalog unit yang mudah dijelajahi.

### 3.2 Tujuan Produk

- Situs **responsif penuh** (mobile, tablet, desktop).
- **Page load cepat** (< 3 detik di koneksi 4G).
- Desain **konsisten, premium, dan tidak terlihat "AI-generated"**.

### 3.3 Sasaran Terukur (Success Metrics / KPI)

| Metrik                               | Target                                         |
| ------------------------------------ | ---------------------------------------------- |
| Lighthouse Performance (mobile)      | ≥ 85                                           |
| Lighthouse Accessibility             | ≥ 90                                           |
| Largest Contentful Paint (LCP)       | < 2,5 detik                                    |
| Cumulative Layout Shift (CLS)        | < 0,1                                          |
| Bounce rate halaman Home             | < 55%                                          |
| Konversi klik CTA "Hubungi/WhatsApp" | ≥ 5% dari pengunjung                           |
| Kompatibilitas browser               | 2 versi terakhir Chrome, Firefox, Safari, Edge |

---

## 4. Target Pengguna (User Personas)

**Persona 1 — "Andre, Kolektor Mobil" (32 th)**
Mencari hypercar/sport edisi terbatas. Mengutamakan tampilan premium dan detail spesifikasi. Akses dari desktop.

**Persona 2 — "Bu Sinta, Keluarga Muda" (38 th)**
Mencari mobil keluarga (Alphard, SUV). Peduli pada harga, opsi cicilan, dan kemudahan kontak. Akses dari ponsel.

**Persona 3 — "Rizki, First-time Buyer" (26 th)**
Tertarik sport/electric. Sensitif harga, ingin simulasi cicilan, banyak membandingkan. Akses campuran mobile/desktop.

---

## 5. Lingkup Produk (Scope)

### 5.1 Termasuk (In Scope) — MVP

- 3 halaman: Home, Shopping/Penjualan, About.
- Navigasi konsisten + menu hamburger untuk mobile.
- Hero dengan headline + form pencarian/booking (UI saja pada MVP).
- Grid kategori mobil (Hypercar, Family, Sport, Electric).
- Slider unit unggulan (Swiper) dengan info spesifikasi + harga.
- Katalog produk (grid kartu mobil: gambar, nama, harga, tombol).
- Form kontak (Nama, Email, Telepon, Pesan).
- Bagian cerita/blog, brand partner (marquee logo), newsletter.
- Footer dengan tautan & sosial media.
- Design system (token warna, tipografi, komponen).

### 5.2 Tidak Termasuk (Out of Scope) — MVP

- Backend / database / autentikasi.
- Transaksi pembayaran nyata (tombol "Buy" bersifat lead, bukan checkout).
- Sistem keranjang belanja fungsional / akun pengguna.
- CMS / panel admin.
- Multi-bahasa (i18n) — bahasa default: campuran ID/EN sesuai konten sekarang (disarankan distandarkan; lihat §11).

### 5.3 Backlog / Fase Berikutnya

- Integrasi form ke email/WhatsApp API atau layanan seperti Formspree.
- Halaman detail unit (`/car/:id`).
- Filter & pencarian katalog (by brand, harga, kategori).
- Simulasi cicilan interaktif.
- Integrasi analytics (GA4) & SEO lanjutan.

---

## 6. Struktur Situs (Sitemap) & Navigasi

```
PREMIUM CARS
├── Home (index.html)
│   ├── Hero + Form pencarian
│   ├── Kategori Mobil (grid 4)
│   ├── Sorotan / "Cari mobil yang ingin dibeli"
│   ├── Unit Cicilan (slider Swiper)
│   ├── Stories Behind the Wheel (blog grid 3)
│   ├── Brand Partner (marquee logo)
│   ├── Download App / Promo
│   ├── Newsletter
│   └── Footer
├── Shopping / Penjualan (penjualan.html)
│   ├── Hero
│   ├── Welcome
│   ├── Katalog Produk (grid kartu)
│   ├── Kontak (form + sosial)
│   └── Footer
└── About (about.html)
    ├── Profil Perusahaan
    ├── Visi & Misi / Nilai
    └── Footer
```

**Aturan navigasi:**

- Navbar identik di semua halaman: `HOME · ABOUT · SERVICE · SHOPPING · CONTACT`.
- State aktif menandai halaman saat ini.
- Mobile: menu hamburger (toggle), menutup otomatis saat link diklik.
- Logo selalu mengarah ke Home.

> ⚠️ **Catatan konsistensi (utang teknis yang harus dirapikan):** saat ini ada duplikasi folder `penjulan/` (typo) vs file root, dan link nav menunjuk file yang belum ada (`about.html`, `penjualan.html` di root). Implementasi harus **menyatukan struktur file** dan memperbaiki seluruh tautan agar tidak ada link mati. Lihat §10.

---

## 7. Persyaratan Fungsional (Per Halaman)

Format: **User Story → Kriteria Penerimaan (Acceptance Criteria).**

### 7.1 Global (Semua Halaman)

**FR-G1 — Navigasi konsisten**

> Sebagai pengunjung, saya ingin berpindah halaman dengan mudah dari mana saja.

- [ ] Navbar tampil di semua halaman dengan item & urutan identik.
- [ ] Di < 768px, menu berubah jadi hamburger; tap membuka/menutup.
- [ ] Link yang aktif memiliki indikator visual (warna aksen / underline).
- [ ] Tidak ada link mati (semua `href` valid).

**FR-G2 — Footer**

- [ ] Footer berisi kolom Resource, Company, kategori, dan sosial media.
- [ ] Ikon sosial dapat diklik (placeholder `#` boleh pada MVP, tapi konsisten).
- [ ] Baris copyright menampilkan tahun & nama brand.

**FR-G3 — Responsif**

- [ ] Tidak ada horizontal scroll pada 320px–1440px.
- [ ] Gambar tidak overflow / pecah.

### 7.2 Home (`index.html`)

**FR-H1 — Hero**

> Sebagai pengunjung, saya ingin langsung memahami value proposition dan bisa mulai mencari mobil.

- [ ] Headline besar ("GET YOUR NEW CAR") + ilustrasi mobil utama.
- [ ] Form pencarian: Lokasi, Tanggal Mulai, Tanggal Selesai + tombol cari.
- [ ] Pada MVP form bersifat UI (tidak submit ke backend); validasi dasar field tidak kosong.
- [ ] Animasi masuk (ScrollReveal) halus, tidak mengganggu LCP.

**FR-H2 — Grid Kategori**

- [ ] 4 kartu kategori: Hypercar, Family, Sport, Electric.
- [ ] Tiap kartu punya gambar + judul + tautan panah.
- [ ] Hover memberi feedback visual (tegas, tanpa shadow berlebihan).

**FR-H3 — Slider Unit Cicilan (Swiper)**

- [ ] Slider menampilkan unit; geser kiri/kanan (grab cursor / swipe).
- [ ] Saat slide berubah, **harga/hari** & info spesifikasi ikut update.
- [ ] Info kartu aktif (kecepatan, seats, dll) ditampilkan benar (perbaiki bug class `show_info` vs `Show_info` di `script.js`).

**FR-H4 — Stories / Blog**

- [ ] Grid 3 kartu artikel: tanggal, judul, ringkasan, gambar.
- [ ] Placeholder "Lorem ipsum" diganti konten nyata sebelum rilis.

**FR-H5 — Brand Partner (Marquee)**

- [ ] Deret logo brand bergerak otomatis (loop mulus, digandakan via JS).
- [ ] Animasi `prefers-reduced-motion` dihormati (berhenti jika user minta).

**FR-H6 — Newsletter**

- [ ] Input email + tombol kirim; validasi format email.
- [ ] MVP: tampilkan state sukses/echo (tanpa backend) atau integrasi layanan form.

### 7.3 Shopping / Penjualan (`penjualan.html`)

**FR-S1 — Katalog Produk**

> Sebagai calon pembeli, saya ingin melihat daftar mobil beserta harga.

- [ ] Grid kartu produk: gambar, nama, harga, tombol aksi.
- [ ] **Hapus kartu placeholder duplikat** ("Product 3 / $30.00") — hanya tampilkan unit nyata.
- [ ] Standarkan format harga (lihat §11) — satu mata uang & format konsisten.
- [ ] Tombol aksi konsisten labelnya ("BELI" / "Hubungi") — saat ini campur "BUY" & "Add to Cart".
- [ ] Klik tombol mengarah ke kontak/WhatsApp (lead), bukan checkout.

**FR-S2 — Form Kontak**

- [ ] Field: Nama, Email, Telepon, Pesan — semua wajib.
- [ ] Validasi: email format valid, telepon angka, pesan tidak kosong.
- [ ] Submit menampilkan konfirmasi; MVP boleh kirim via `mailto:`/Formspree/WhatsApp link.
- [ ] Tautan sosial media aktif.

### 7.4 About (`about.html`)

**FR-A1 — Profil Perusahaan**

- [ ] Bagian narasi perusahaan (siapa, sejak kapan, keunggulan).
- [ ] Visi, Misi, dan/atau Nilai inti.
- [ ] Minimal satu CTA menuju Shopping atau Kontak.
- [ ] Konten nyata (bukan placeholder) sebelum rilis.

---

## 8. Persyaratan Desain (Design Requirements) ⭐

> **Bagian ini wajib dipatuhi ketat.** Tujuannya: tampilan **mantap, rapi, menawan, premium — seperti buatan agensi profesional**, dan **TIDAK terlihat dihasilkan AI**.

### 8.1 Prinsip Anti-"AI Look" (Aturan Keras)

**DILARANG:**

- ❌ Bayangan (`box-shadow`) berlebihan / mengambang di semua elemen.
- ❌ Gradien pelangi / multi-warna norak.
- ❌ Kartu dengan sudut terlalu membulat (radius besar di mana-mana).
- ❌ Tata letak "aman" generik: hero tengah + 3 kartu identik + emoji.
- ❌ Glassmorphism blur di mana-mana, warna pastel acak, ikon emoji.

**WAJIB:**

- ✅ **Pilih SATU arah desain yang tegas dan berkomitmen penuh** padanya (lihat §8.2).
- ✅ Tata letak berani: grid rapi & disiplin, atau editorial asimetris yang disengaja.
- ✅ Pakai **garis hairline 1px** dan **kontras warna** sebagai pemisah, bukan shadow.
- ✅ Sudut tajam atau radius kecil & konsisten (maks 4px), bukan pill di semua tempat.
- ✅ **Whitespace** generous dan ritmis (skala spasi konsisten).
- ✅ Hierarki tipografi jelas dan kontras.

### 8.2 Arah Desain Terpilih (COMMITTED) — _Dark Premium, Aksen Tunggal_

Untuk showroom mobil mewah, arah yang dipilih dan dikunci adalah:

> **"Dark Editorial Garage"** — latar gelap charcoal, **satu** warna aksen molten-amber yang tajam, tipografi industrial kontras, grid disiplin, garis hairline sebagai pemisah. Premium, maskulin, otomotif, tidak norak.

_(Alternatif yang juga valid jika klien memilih terang: "Minimalist Grid" — kanvas putih bersih, grid ketat, satu aksen gelap pekat, tipografi besar. Pilih SATU saja; dokumen ini mengunci Dark Editorial Garage sebagai default.)_

### 8.3 Token Warna (Design Tokens)

Palet **terbatas & disengaja** (hindari banyak warna). Mengembangkan amber lama (`#a84d07`) menjadi aksen yang lebih tajam.

| Token            | HEX       | Penggunaan                                        |
| ---------------- | --------- | ------------------------------------------------- |
| `--bg`           | `#0B0B0C` | Latar utama (hampir hitam)                        |
| `--surface`      | `#141417` | Permukaan kartu / section alternatif              |
| `--surface-2`    | `#1C1C21` | Hover / elevasi via warna (bukan shadow)          |
| `--line`         | `#2A2A30` | Garis hairline 1px (pemisah & border)             |
| `--text`         | `#F2F2F0` | Teks utama (off-white, bukan putih murni)         |
| `--text-muted`   | `#9A9A93` | Teks sekunder / caption                           |
| `--accent`       | `#FF6A00` | **Aksen tunggal** (molten amber) — CTA, highlight |
| `--accent-press` | `#E85D00` | State aktif/ditekan                               |

**Aturan warna:**

- Maksimal **satu** warna aksen. Tidak ada warna aksen kedua.
- Aksen hanya untuk elemen penting (CTA primer, angka harga, garis fokus).
- Tidak ada gradien selain (opsional) dark-to-darker yang sangat halus pada hero overlay.

### 8.4 Tipografi (Type System) ⭐

> **Aturan: kombinasi font yang KONTRAS dan ELEGAN.** Satu font display berkarakter kuat dipasangkan dengan satu font teks netral yang sangat terbaca.

**Pasangan terpilih (default):**

| Peran                  | Font                                                                                               | Kenapa                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Display / Headline** | **Archivo** (atau Oswald sebagai alternatif condensed) — weight 800–900, UPPERCASE, tracking rapat | Industrial, otomotif, percaya diri — kontras tegas |
| **Body / UI**          | **Inter** — weight 400/500, normal-case                                                            | Netral, modern, sangat terbaca di semua ukuran     |

**Pasangan editorial alternatif (jika ingin lebih mewah/klasik):**
_Display serif kontras tinggi_ **Fraunces** atau **Playfair Display** + _body_ **Inter**. Pilih SATU sistem dan konsisten.

**Skala tipografi (type scale, basis 1rem = 16px):**

| Token    | Ukuran                                | Penggunaan               |
| -------- | ------------------------------------- | ------------------------ |
| Display  | `clamp(2.75rem, 6vw, 4.5rem)`         | Hero headline            |
| H2       | `clamp(2rem, 4vw, 3.25rem)`           | Judul section            |
| H3       | `1.5rem`                              | Judul kartu              |
| H4       | `1.125rem`                            | Sub-judul                |
| Body     | `1rem` (line-height 1.6)              | Paragraf                 |
| Caption  | `0.875rem`                            | Meta, label, harga kecil |
| Overline | `0.75rem`, tracking 0.15em, UPPERCASE | Label kategori           |

**Aturan tipografi:**

- Maksimal **2 font family** di seluruh situs.
- Headline UPPERCASE + tracking negatif/rapat untuk kesan editorial.
- Panjang baris paragraf 60–75 karakter.
- Jangan pakai lebih dari 3 weight per family.

### 8.5 Layout, Spacing & Grid

- **Grid:** 12 kolom, `max-width: 1200px`, gutter 24px, padding section vertikal 80–120px.
- **Skala spasi (8px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px. **Hanya gunakan nilai dari skala ini.**
- **Radius:** 0–4px (tajam/konsisten). Tidak ada pill kecuali tombol kecil tertentu yang disengaja.
- **Border:** 1px `--line` sebagai pemisah; **shadow dihindari**. Jika perlu elevasi, naikkan warna surface.
- **Kartu produk:** rasio gambar konsisten (mis. 4:3), padding seragam, harga & CTA align ke baseline yang sama di semua kartu.

### 8.6 Komponen (Component Spec)

| Komponen            | Spesifikasi                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Tombol primer**   | Bg `--accent`, teks `--bg`, radius 2px, padding 14px 24px, uppercase, tracking 0.05em, hover → `--accent-press` (transisi 0.2s) |
| **Tombol sekunder** | Transparan, border 1px `--line`, teks `--text`, hover border `--accent`                                                         |
| **Kartu**           | Bg `--surface`, border 1px `--line`, radius 2px, hover → bg `--surface-2` (tanpa shadow/translate berlebihan)                   |
| **Input**           | Bg transparan, border-bottom 1px `--line`, fokus border-bottom `--accent`, label di atas                                        |
| **Navbar**          | Sticky atas, bg `--bg` dengan border-bottom hairline saat scroll; tinggi 72px                                                   |
| **Marquee logo**    | Grayscale default, opacity 0.6; hover satu logo → opacity 1                                                                     |

### 8.7 Ikonografi & Gambar

- **Satu** library ikon saja (pilih RemixIcon **atau** BoxIcons — jangan campur seperti sekarang).
- Foto mobil: latar transparan (PNG) konsisten; objek di-align dan diberi ruang napas seragam.
- Gunakan format efisien (AVIF/WebP) + `loading="lazy"` untuk gambar di bawah lipatan.

### 8.8 Motion / Animasi

- Animasi halus & fungsional (fade/slide masuk via ScrollReveal), durasi 200–600ms, easing `ease-out`.
- Hormati `prefers-reduced-motion: reduce` → matikan animasi non-esensial.
- Marquee & slider tidak boleh menyebabkan layout shift (CLS).

---

## 9. Persyaratan Non-Fungsional

| Kategori                 | Persyaratan                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Performa**             | LCP < 2,5s; total bobot halaman awal < 2MB; gambar dikompres (AVIF/WebP); CSS/JS di-minify untuk produksi                                   |
| **Responsif**            | Breakpoint: ≤480 (mobile), 481–768 (tablet kecil), 769–1024 (tablet/landscape), ≥1025 (desktop)                                             |
| **Aksesibilitas (a11y)** | Kontras teks ≥ 4.5:1; semua `img` punya `alt` bermakna; navigasi keyboard; fokus terlihat; `aria-label` pada tombol ikon; `lang` HTML benar |
| **SEO**                  | `<title>` & `<meta description>` unik per halaman; heading hierarkis (1× `h1`/halaman); Open Graph tags; `sitemap.xml`; URL bersih          |
| **Kompatibilitas**       | 2 versi terakhir Chrome, Firefox, Safari, Edge; degradasi anggun tanpa JS                                                                   |
| **Keamanan**             | Tidak ada data sensitif di klien; form pakai HTTPS; sanitasi input bila kelak ada backend                                                   |
| **Maintainability**      | Token desain via CSS custom properties; penamaan kelas konsisten (BEM atau utility); satu sumber kebenaran untuk warna & spacing            |

---

## 10. Arsitektur Teknis & Struktur File

**Stack:** HTML statis + CSS + JS vanilla (tanpa build wajib). Library via CDN: Swiper, ScrollReveal, ikon, Google Fonts.

**Struktur file target (dirapikan):**

```
COMPANY PROFILE/
├── index.html              # Home
├── penjualan.html          # Shopping (satu sumber, hapus duplikat folder)
├── about.html              # About
├── css/
│   ├── tokens.css          # variabel: warna, font, spacing (design tokens)
│   ├── base.css            # reset + tipografi global + komponen dasar
│   ├── home.css
│   ├── penjualan.css
│   └── about.css
├── js/
│   └── main.js             # nav toggle, swiper, scrollreveal, marquee
├── image/                  # foto unit (AVIF/WebP/PNG transparan)
├── logo/                   # logo brand partner
└── icon/                   # favicon & ikon
```

**Utang teknis yang harus diselesaikan saat implementasi:**

1. **Hapus duplikasi** `penjulan/` (folder typo) — satukan ke file root `penjualan.html`.
2. Perbaiki **semua tautan nav** agar menunjuk file yang benar-benar ada (`about.html`, `penjualan.html`).
3. Perbaiki bug `script.js`: typo `Show_info` → `show_info`, `coverfloweEffect` → `coverflowEffect`, `midifier` → `modifier`, `delsy`/`delay` di ScrollReveal.
4. Hapus **kartu produk placeholder** ("Product 3 / $30.00") yang berulang ~14×.
5. Pilih **satu** library ikon (RemixIcon atau BoxIcons), bukan keduanya.
6. Standarkan `<title>` tiap halaman (saat ini semua "Document").
7. Rename file aset bertipo (mis. `stayle.css` → `base.css`) — opsional tapi disarankan.

---

## 11. Konten & Aset

- **Bahasa:** standarkan satu gaya (disarankan **Bahasa Indonesia** untuk konten utama, istilah otomotif EN boleh). Saat ini campur ID/EN tidak konsisten.
- **Harga:** pilih **satu mata uang & format** (disarankan Rupiah, mis. `Rp 3.584.839.500`) — saat ini campur `$`, `juta`, format desimal tidak konsisten.
- **Copywriting:** ganti semua **Lorem ipsum** dengan deskripsi unit & narasi brand nyata sebelum rilis.
- **Foto unit:** konsisten (sudut, latar transparan, ukuran). Sediakan `alt` deskriptif (mis. "Bugatti Chiron Pur Sport tampak samping").
- **Logo brand:** versi grayscale konsisten untuk marquee.

---

## 12. Roadmap / Fase Pengerjaan

| Fase                    | Cakupan                                                                                           | Output             |
| ----------------------- | ------------------------------------------------------------------------------------------------- | ------------------ |
| **Fase 0 — Foundation** | Bersihkan struktur file, buat `tokens.css` + `base.css`, set tipografi & warna                    | Design system siap |
| **Fase 1 — Home**       | Bangun ulang `index.html` sesuai design system; perbaiki slider & animasi                         | Home final         |
| **Fase 2 — Shopping**   | Katalog bersih (tanpa placeholder), harga distandarkan, form kontak fungsional (mailto/Formspree) | Penjualan final    |
| **Fase 3 — About**      | Konten profil nyata + CTA                                                                         | About final        |
| **Fase 4 — Polish**     | A11y, SEO meta, optimasi gambar, uji Lighthouse, lintas-browser                                   | Siap rilis         |
| **Fase 5 — Backlog**    | Filter katalog, halaman detail unit, simulasi cicilan, analytics                                  | Iterasi berikutnya |

---

## 13. Risiko & Asumsi

**Asumsi:**

- Tetap statis tanpa backend pada MVP; form pakai layanan pihak ketiga (Formspree/WhatsApp link/`mailto:`).
- Aset gambar & logo brand tersedia dengan kualitas memadai.
- Hosting statis (mis. GitHub Pages / Netlify / Vercel).

**Risiko:**
| Risiko | Mitigasi |
|---|---|
| Gambar berat memperlambat load | Kompres ke AVIF/WebP, lazy-load, ukuran responsif |
| Konten placeholder bocor ke produksi | Checklist konten wajib sebelum rilis |
| Desain melenceng jadi "AI generik" | Patuhi §8 secara ketat; review desain per fase |
| Link mati akibat struktur lama | Audit link di Fase 0 |
| Hak penggunaan logo/foto brand | Pastikan lisensi/izin untuk publikasi |

---

## 14. Definition of Done (DoD)

Sebuah halaman dianggap **selesai** bila:

- [ ] Memenuhi seluruh Acceptance Criteria fungsionalnya (§7).
- [ ] Mematuhi design system & aturan anti-AI (§8) — diverifikasi review.
- [ ] Responsif 320px–1440px tanpa overflow.
- [ ] Lighthouse: Performance ≥ 85, A11y ≥ 90 (mobile).
- [ ] Tidak ada link mati, tidak ada placeholder/Lorem ipsum.
- [ ] Harga & bahasa terstandar.
- [ ] Lulus uji di Chrome, Firefox, Safari, Edge (2 versi terakhir).

---

## 15. Lampiran — Prompt Singkat untuk Generator Desain/AI

> Gunakan ini bila membuat mockup via tool desain/AI, agar hasil sesuai PRD:

```
Buat desain [Landing Page / katalog] untuk showroom mobil mewah "PREMIUM CARS".
Estetika: premium, rapi, menawan, seperti agensi desain profesional —
JANGAN gaya AI generik yang membosankan.

Arah: "Dark Editorial Garage" — latar charcoal (#0B0B0C), satu warna aksen
molten-amber (#FF6A00) saja, teks off-white (#F2F2F0). Tidak ada gradien
pelangi, tidak ada shadow mengambang, sudut tajam (radius ≤ 4px), pemisah
pakai garis hairline 1px (#2A2A30). Grid disiplin 12 kolom, whitespace luas.

Tipografi KONTRAS & ELEGAN: headline 'Archivo' weight 900 UPPERCASE tracking
rapat, body 'Inter' 400/500. Maksimal 2 font. Hierarki jelas.

Layout berani & berkomitmen: hero sinematik foto mobil + headline besar,
grid kategori rapi, kartu produk konsisten (rasio gambar sama, harga & CTA
sejajar). Satu library ikon. Premium, maskulin, otomotif — bukan template.
```

---

_Dokumen ini adalah sumber kebenaran (single source of truth) untuk pembangunan PREMIUM CARS. Perubahan signifikan harus memperbarui versi dokumen._

## 16. Aturan baru di dalam project ini okk perhatikan ini

"Desain ini tidak boleh terlihat seperti dihasilkan oleh AI. Hindari pola umum seperti bayangan (shadow) yang berlebihan, gradien pelangi, dan kartu (cards) dengan sudut yang terlalu membulat. Buat pilihan tata letak yang tegas, berani, dan berkomitmen pada pilihan tersebut (misalnya: pilih gaya minimalist grid yang rapi atau dark mode dengan aksen neon)."
dan juga "Draf awalnya sudah bagus, tapi terasa kurang 'hidup'. Buat spasi (padding) di bagian tombol menjadi lebih lebar. Berikan jarak antar teks yang lebih renggang agar terkesan lebih premium dan mudah dibaca. Gunakan efek animasi transisi (easing) yang halus saat kursor mengarah ke tombol."
