# SDD — Software Design Document "PREMIUM CARS"

**Software Design Document (Dokumen Desain Perangkat Lunak)**

| | |
|---|---|
| **Produk** | PREMIUM CARS — Company Profile & Katalog Showroom |
| **Versi** | 1.0 |
| **Tanggal** | 27 Juni 2026 |
| **Author** | Zainul Arkaan |
| **Dokumen terkait** | [PRD.md](PRD.md) (kebutuhan), [README.md](README.md) (cara jalan) |
| **Status** | Untuk implementasi (Fase 2–5 PRD) |

---

## 1. Pendahuluan

### 1.1 Tujuan
Dokumen ini menjelaskan **desain teknis** bagaimana kebutuhan di PRD diwujudkan dalam kode: arsitektur, modul, model data, alur interaksi, struktur file, dan keputusan desain. SDD adalah jembatan antara *apa* (PRD) dan *bagaimana* (kode).

### 1.2 Lingkup Sistem
Aplikasi web **statis sisi-klien** (tanpa backend) yang berperan sebagai company profile + katalog mobil interaktif. Seluruh state (keranjang, wishlist) disimpan di `localStorage`. Aksi transaksional (checkout, kontak) dialihkan menjadi **lead** (WhatsApp/`mailto`).

### 1.3 Batasan Desain
- Tanpa framework, tanpa build step. Vanilla **HTML + CSS + JavaScript (ES6)**.
- Library pihak ketiga via CDN: Swiper, ScrollReveal, RemixIcon.
- Harus berjalan baik via server statis maupun `file://` (karena itu **data di-embed sebagai modul JS**, bukan di-`fetch`).
- Mematuhi design system "Dark Editorial Garage" (PRD §8).

---

## 2. Arsitektur Sistem

### 2.1 Gaya Arsitektur
**Layered + Component-based** di sisi klien, dengan namespace global tunggal `PC` (PremiumCars) sebagai pengganti module bundler. Script dimuat berurutan; tiap file menempel ke `window.PC`.

```
┌──────────────────────────────────────────────────────────┐
│                    PRESENTATION (HTML/CSS)                 │
│   index.html · penjualan.html · about.html  +  css/*.css   │
└───────────────▲───────────────────────────▲──────────────┘
                │ render & event                │ baca/tulis
┌───────────────┴───────────────┐ ┌───────────┴──────────────┐
│        COMPONENTS (UI)         │ │       STATE / STORE       │
│ catalog · cart · simulator ·   │ │  PC.store (cart, wishlist)│
│ forms · nav                    │ │  + pub/sub events         │
└───────────────▲───────────────┘ └───────────▲──────────────┘
                │ pakai                          │ persist
┌───────────────┴───────────────────────────────┴──────────┐
│                      LIB (utilitas)                        │
│  PC.format · PC.storage · PC.ui ($, el, toast, modal)      │
└───────────────▲───────────────────────────────────────────┘
                │ baca
┌───────────────┴───────────────────────────────────────────┐
│                       DATA (model)                         │
│        PC.cars[]  ·  PC.categories[]   (js/data/cars.js)    │
└────────────────────────────────────────────────────────────┘
```

### 2.2 Prinsip
- **Separation of concerns:** data ≠ tampilan ≠ state ≠ utilitas.
- **Single source of truth:** data mobil di satu file; state di `PC.store`; token desain di `css/tokens.css`.
- **Unidirectional update:** aksi user → ubah `store` → `store` emit event → komponen re-render. Tidak ada komponen yang menulis DOM komponen lain.
- **Progressive enhancement:** konten inti tetap tampil walau JS gagal (markup statis untuk teks; katalog & fitur dinamis adalah lapisan tambahan).

---

## 3. Struktur File (Target)

```
COMPANY PROFILE/
├── index.html              # Home
├── penjualan.html          # Katalog interaktif
├── about.html              # About
│
├── css/
│   ├── tokens.css          # design tokens (warna, font, spasi)
│   ├── components.css      # komponen lintas-halaman (toast, modal, drawer, chips, badge)
│   ├── home.css
│   ├── penjualan.css
│   └── about.css
│
├── js/
│   ├── data/
│   │   └── cars.js         # PC.cars[], PC.categories[]
│   ├── lib/
│   │   ├── format.js       # PC.format  (rupiah, angka, slug)
│   │   ├── storage.js      # PC.storage (wrapper localStorage aman)
│   │   ├── store.js        # PC.store   (cart + wishlist + pub/sub)
│   │   └── ui.js           # PC.ui      ($, $$, el, toast, modal)
│   ├── components/
│   │   ├── nav.js          # toggle menu + sinkron badge keranjang
│   │   ├── catalog.js      # render grid, search, filter, sort, detail
│   │   ├── cart.js         # drawer keranjang + checkout WА
│   │   ├── simulator.js    # simulasi cicilan
│   │   └── forms.js        # validasi kontak & newsletter
│   ├── home.js             # entry Home
│   ├── penjualan.js        # entry Katalog (init komponen)
│   └── about.js            # entry About
│
├── image/ · about/ · logo/ · icon/
├── PRD.md · SDD.md · README.md
```

### 3.1 Urutan muat script (penjualan.html)
`data/cars.js` → `lib/format.js` → `lib/storage.js` → `lib/store.js` → `lib/ui.js` → `components/*.js` → `penjualan.js`. Urutan ini menjamin dependensi sudah ada di `PC` sebelum dipakai.

---

## 4. Model Data

### 4.1 Entitas `Car`
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
  specs: {
    topSpeed: 350,         // km/h
    power:    1500,        // hp
    seats:    2,
    transmission: "Automatic"
  }
}
```

### 4.2 Entitas `Category`
```js
{ id: "hypercar", label: "Hypercar", icon: "ri-flashlight-line" }
```

### 4.3 State (runtime, persist di localStorage)
```js
// key: "pc.cart"
cart:     [{ id: "bmw-m4", qty: 1 }, ...]
// key: "pc.wishlist"
wishlist: ["lotus-evija", "pagani-huayra", ...]
```
Hanya `id` & `qty` yang dipersist; detail mobil selalu di-resolve dari `PC.cars` agar tidak ada data duplikat/usang.

---

## 5. Desain Modul

### 5.1 `PC.format` (lib/format.js)
| Fungsi | Tanda tangan | Keterangan |
|---|---|---|
| `rupiah(n)` | `(number) → string` | `56000000000 → "Rp 56.000.000.000"` |
| `compactRupiah(n)` | `(number) → string` | `→ "Rp 56 M"` untuk kartu ringkas |
| `number(n)` | `(number) → string` | pemisah ribuan lokal id-ID |
| `slug(s)` | `(string) → string` | normalisasi id |

### 5.2 `PC.storage` (lib/storage.js)
Pembungkus `localStorage` dengan `try/catch` (mode privat/penuh tidak menggagalkan app) dan serialisasi JSON.
`get(key, fallback)`, `set(key, value)`, `remove(key)`.

### 5.3 `PC.store` (lib/store.js) — **inti state**
Pola **pub/sub** sederhana.
```
state: { cart: [], wishlist: [] }

on(event, handler)          // "change:cart" | "change:wishlist"
emit(event)

cart.add(id, qty=1)
cart.remove(id)
cart.setQty(id, qty)
cart.clear()
cart.items()    → [{ car, qty, subtotal }]
cart.count()    → number
cart.total()    → number (IDR)

wishlist.toggle(id) → boolean
wishlist.has(id)    → boolean
wishlist.list()     → [car]
```
Setiap mutasi → simpan ke `PC.storage` → `emit("change:cart")`. Komponen berlangganan untuk re-render. **Tidak ada komponen yang menyentuh `localStorage` langsung.**

### 5.4 `PC.ui` (lib/ui.js)
- `$(sel, root)`, `$$(sel, root)` — query helper.
- `el(tag, props, children)` — pembuat elemen ringkas.
- `toast(message, type)` — notifikasi non-blok (`success|error|info`), auto-dismiss 3 dtk, antri.
- `modal.open(node)` / `modal.close()` — dialog aksesibel: fokus terjebak, `Esc` menutup, klik overlay menutup, `aria-modal`.

### 5.5 Komponen
| Komponen | Tanggung jawab | Bergantung pada |
|---|---|---|
| `catalog.js` | Render grid dari `PC.cars`; terapkan search + filter kategori + sort; tombol detail (buka modal), wishlist (toggle), beli (cart.add). | data, store, ui, format |
| `cart.js` | Render isi drawer dari `cart.items()`; ubah qty; hapus; total; checkout → buka WhatsApp dengan ringkasan order. Re-render saat `change:cart`. | store, ui, format |
| `simulator.js` | Hitung cicilan: input harga/DP/tenor → angsuran bulanan (bunga flat). Validasi DP < harga. | format, ui |
| `forms.js` | Validasi form kontak & newsletter (regex email, field wajib), tampilkan error inline + `toast` sukses; reset. | ui |
| `nav.js` | Toggle menu mobile lintas-halaman; perbarui badge jumlah keranjang dari `store`. | store, ui |

---

## 6. Alur Interaksi Utama (Sequence)

### 6.1 Tambah ke keranjang
```
User klik "Beli" pada kartu
  → catalog.js: PC.store.cart.add(id)
    → store: mutasi state → storage.set("pc.cart") → emit("change:cart")
      → cart.js: render ulang drawer & total
      → nav.js: perbarui angka badge
  → ui.toast("Ditambahkan ke keranjang", "success")
```

### 6.2 Filter + cari + urut katalog
```
User ketik di search / klik chip kategori / pilih sort
  → catalog.js: baca state filter lokal {q, category, sort}
  → pipeline: PC.cars → filter(category) → filter(q) → sort(price) 
  → render grid + update "menampilkan N unit"
  (debounce 200ms pada input search)
```

### 6.3 Checkout (lead)
```
User klik "Checkout via WhatsApp" di drawer
  → cart.js: susun teks order (nama unit × qty, subtotal, total)
  → buka https://wa.me/<no>?text=<encoded> di tab baru
  (tidak ada pembayaran nyata — sesuai scope PRD)
```

### 6.4 Simulasi cicilan
```
principal = price − dp
total     = principal × (1 + ratePerYear × tenorYear)   // bunga flat
angsuran  = total / tenorBulan
→ tampilkan angsuran/bulan + total bayar
```

---

## 7. Desain Antarmuka (UI) & Styling

- **Design system:** lihat PRD §8. Token di `css/tokens.css`.
- **Komponen lintas-halaman** (`css/components.css`): `.toast`, `.modal`, `.cart-drawer`, `.chip`, `.badge`, `.skeleton`. Memakai token; tanpa shadow dekoratif; radius ≤4px; pemisah hairline.
- **Ikon:** RemixIcon (satu library — PRD §8.7).
- **Responsif:** grid katalog `repeat(4→3→2→1)`; drawer keranjang full-width di mobile.
- **Aksesibilitas:** kontras AA; `aria-label` pada tombol ikon; `aria-live="polite"` pada toast & jumlah hasil; fokus terlihat; modal trap fokus.

---

## 8. Penanganan Error & Edge Case

| Kasus | Penanganan |
|---|---|
| `localStorage` tidak tersedia | `PC.storage` fallback ke objek memori; app tetap jalan (state hilang saat reload) |
| Cart berisi id yang sudah tak ada di data | Saat `cart.items()`, item tanpa `car` di-skip & dibersihkan |
| Search tanpa hasil | Tampilkan empty-state "Tidak ada unit yang cocok" |
| Form tidak valid | Cegah submit, tandai field, fokus ke field pertama yang error |
| DP ≥ harga di simulator | Tampilkan pesan error, jangan hitung |
| Gambar gagal dimuat | `onerror` → placeholder netral |

---

## 9. Performa

- Gambar `loading="lazy"` di bawah lipatan; `object-fit: contain` agar konsisten.
- Render katalog via **DocumentFragment** (satu kali reflow).
- Debounce input pencarian (200ms).
- CSS & JS dipecah per-halaman → hanya muat yang perlu.
- Animasi hormati `prefers-reduced-motion`.

## 10. Keamanan

- Tidak ada data sensitif/credential di klien.
- Semua teks dari input/`PC.cars` dirender via `textContent` / pembuatan node (bukan `innerHTML` mentah) untuk mencegah XSS.
- Parameter WhatsApp `mailto`/`wa.me` di-`encodeURIComponent`.

## 11. Strategi Pengujian

| Lapis | Cara | Cakupan |
|---|---|---|
| Manual fungsional | Checklist Acceptance Criteria PRD §7 | semua alur |
| Lintas-browser | Chrome, Firefox, Edge, Safari (2 versi) | rendering & JS |
| Responsif | DevTools 320/768/1024/1440 | layout |
| Aksesibilitas | Lighthouse a11y + navigasi keyboard | ≥90 |
| Performa | Lighthouse mobile | ≥85 |
| State | Tambah/hapus cart → reload → state persist | localStorage |

## 12. Keputusan Desain (Rationale)

| Keputusan | Alasan | Alternatif ditolak |
|---|---|---|
| Namespace global `PC`, bukan ES Module | Berjalan di `file://` tanpa server/bundler | ES Modules (butuh server, gagal di file://) |
| Data di-embed sebagai JS, bukan `fetch` JSON | Hindari CORS pada `file://` | `fetch('cars.json')` |
| State di `localStorage` + pub/sub | Persist tanpa backend, decoupling | Variabel global tersebar |
| Lead WhatsApp untuk "checkout" | Sesuai scope MVP tanpa backend | Gateway pembayaran (out of scope) |
| Bunga flat di simulator | Mudah dipahami & transparan | Anuitas (lebih kompleks, belum perlu) |

---

*SDD ini mengikat untuk implementasi. Perubahan arsitektur memerbarui versi dokumen.*
