# UI/UX — Premium Cars Web

Design system: **Dark Editorial Garage** (lihat
`stitch_premium_cars/dark_editorial_garage/DESIGN.md`) — Oswald + Inter,
Charcoal & Molten Amber #FF6A00, sudut tajam, hairline, tanpa shadow.
Light mode memakai token yang sama dengan nilai terang (paper & charcoal).

## User flows utama
1. **Beli**: Home → Katalog (filter/spec-finder) → Detail (galeri, spek,
   cicilan, WA) → Reserve/Test-Drive (kontak prefilled) → konfirmasi + ref.
2. **Riset**: Harga Pasar → pilih merek/model/tahun → laporan (tile, grafik
   tren, estimasi nasional) → Sourcing / Bandingkan.
3. **Jual**: /jual hub → Appraisal (3 fase) | Trade-In (equity) |
   Consignment (concierge) → lead + nomor referensi.
4. **Akun**: Masuk/Daftar → /akun (riwayat aktivitas, aksi cepat) → Keluar.

## Screen list + states
Setiap form: idle → loading (tombol disabled + label proses) → success
(panel konfirmasi + nomor referensi) → error (banner amber, pesan spesifik).
Data eksternal: loading (label "memuat…"), live (badge amber pulse + sumber),
demo (badge netral), gagal (pesan jelas, tidak pernah blank).
Gambar: SmartImage fallback gradient + nama unit (tidak pernah ikon rusak).

## Komponen kunci & aturan pakai
- `Reveal` (scroll-reveal + stagger) — semua section di bawah fold.
- `CountUp` — angka statistik & panel nilai; format id-ID (desimal koma).
- `TrendChart` — pergerakan harga; tooltip hover; min/max di bawah.
- `SellNav` — tab di seluruh /jual*; `Navbar` dua tingkat + drawer mobile.
- Tombol: solid amber (aksi utama, satu per layar), ghost (sekunder),
  WhatsApp (kanal cepat, selalu tersedia via float).

## Microcopy penting
- Estimasi harga selalu diberi "indikatif, bukan penawaran".
- Error validasi menyebut field-nya ("Field \"email\" wajib diisi.").
- CTA memakai kata kerja: "Analisis Pasar", "Minta Sourcing", "Establish Contact".

## Interaksi & motion
GPU-only (opacity/transform), hormat `prefers-reduced-motion`. Navbar
menyingkir saat scroll turun; utility strip kolaps setelah 24 px. Hero
line-rise 0,9 dtk; stagger anak 80 ms; Ken Burns 22 dtk untuk hero image.
Breakpoint: 390 px (mobile), 768, 1024 (nav penuh), 1440 (frame max).
