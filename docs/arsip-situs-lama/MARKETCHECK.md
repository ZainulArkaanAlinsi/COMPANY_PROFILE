# Integrasi MarketCheck Cars API

Halaman **Shopping** (`penjualan.html`) bisa menampilkan **listing mobil live**
dari [MarketCheck Cars API](https://docs.marketcheck.com/docs/api/cars)
(endpoint `GET /v2/search/car/active`, auth via `api_key`).

Modul `js/lib/marketcheck.js` mengambil data, **memetakannya** ke model situs
(kategori, harga USD→IDR, foto), lalu mengisi katalog. **Aman by default:**
bila belum dikonfigurasi / gagal / dibuka via `file://`, situs memakai data
lokal (`js/data/cars.js`) — tidak pernah rusak.

> Aku **tidak bisa** mendaftarkan/mendapat API key untukmu — itu harus akunmu.
> Daftar (ada free trial) di <https://www.marketcheck.com/apis/cars/>.

Karena situs ini statis, browser **tidak boleh** memanggil `api.marketcheck.com`
langsung (key bocor + diblokir CORS). Jadi semua jalur di bawah memakai **proxy**
yang menyimpan key di server. `proxyUrl` sudah di-set `"/api/cars"` secara default.

---

## Cara 1 — Jalankan lokal (paling cepat lihat data live)

Butuh **Node 18+**. Dari folder proyek (PowerShell):

```powershell
$env:MARKETCHECK_API_KEY = "KEY_KAMU"
node server/proxy.js
```

Buka <http://localhost:3000> → katalog terisi unit live.
`server/proxy.js` menyajikan situs **dan** meneruskan `/api/cars` ke MarketCheck
dengan key dari environment (key tidak pernah sampai ke browser).

## Cara 2 — Deploy ke Vercel (produksi)

File `api/cars.js` sudah siap sebagai serverless function.

1. Import proyek ke Vercel.
2. Tambah Environment Variable: `MARKETCHECK_API_KEY = <key kamu>`.
3. Deploy. Path `/api/cars` otomatis aktif; situs memanggilnya.

(Netlify: buat `netlify/functions/cars.js` dengan pola serupa, lalu set
`proxyUrl: "/.netlify/functions/cars"` di `js/lib/marketcheck.js`.)

## Cara 3 — Key langsung di klien (hanya uji coba, TIDAK aman)

Di `js/lib/marketcheck.js`: kosongkan `proxyUrl` dan isi `apiKey`.

```js
proxyUrl: "",
apiKey: "KEY_KAMU",
```

> Key terlihat di kode sumber & kemungkinan gagal CORS. Jangan untuk produksi.

---

## Penyesuaian (opsional)

Objek `config` di `js/lib/marketcheck.js`:

| Opsi | Fungsi |
| --- | --- |
| `defaultParams` | Filter pencarian (`make`, `model`, `car_type`, `rows`, dll). [100+ parameter](https://docs.marketcheck.com/docs/api/cars/inventory/inventory-search). |
| `usdToIdr` | Kurs konversi harga USD→Rupiah (default 16000). |
| `placeholderImage` | Gambar cadangan bila listing tak punya foto. |

## Batasan (jujur)

- **Mata uang:** data MarketCheck = pasar AS (USD); dikali `usdToIdr` agar format
  Rupiah konsisten. Sesuaikan kurs.
- **Spesifikasi performa:** endpoint inventory **tidak** memberi top speed / hp —
  nilai di kartu hanya **estimasi**. Untuk asli pakai VIN decode
  `/v2/decode/car/{vin}/specs`.
- **Kategori** dipetakan heuristik dari `body_type` / `fuel_type` / `year`.
- **Kuota:** trial MarketCheck terbatas; `api/cars.js` sudah meng-cache 5 menit di edge.
- Key tak akan ter-commit: `.env` & `*.local` ada di `.gitignore`.
