# Integrasi MarketCheck Cars API

Modul `js/lib/marketcheck.js` (`PC.marketcheck`) bisa mengganti data lokal
(`js/data/cars.js`) dengan **listing mobil live** dari
[MarketCheck Cars API](https://docs.marketcheck.com/docs/api/cars).

- Endpoint: `GET https://api.marketcheck.com/v2/search/car/active`
- Auth: query param `api_key`
- Dipasang di halaman **Shopping** (`penjualan.html`). Home tetap pakai data kurasi lokal.
- **Aman by default:** tanpa konfigurasi, modul diam dan situs memakai data lokal. Jika API gagal (CORS/kuota/key salah), otomatis fallback ke data lokal — situs tidak pernah rusak.

---

## 1. Dapatkan API key

Daftar (ada free trial) di <https://www.marketcheck.com/apis/cars/> → ambil API key.
Saya **tidak bisa** mendaftarkan/mendapatkan key untukmu; ini harus akun milikmu.

## 2. Pilih salah satu cara pakai

### Cara A — Proxy serverless (DISARANKAN, aman)

Memanggil `api.marketcheck.com` langsung dari browser **membocorkan key** dan
biasanya **diblokir CORS**. Solusi benar: proxy kecil yang menyimpan key di server.

Contoh **Vercel** — buat `api/cars.js`:

```js
export default async function handler(req, res) {
  const params = new URLSearchParams(req.query);
  params.set("api_key", process.env.MARKETCHECK_API_KEY); // key di env server
  const r = await fetch(
    "https://api.marketcheck.com/v2/search/car/active?" + params.toString()
  );
  const data = await r.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(r.status).json(data);
}
```

Set env `MARKETCHECK_API_KEY` di dashboard Vercel, lalu di
`js/lib/marketcheck.js`:

```js
proxyUrl: "/api/cars",
```

(Netlify: pakai `netlify/functions/cars.js` dengan pola serupa, `proxyUrl: "/.netlify/functions/cars"`.)

### Cara B — Key langsung di klien (cepat, hanya untuk uji coba)

Di `js/lib/marketcheck.js` ganti:

```js
apiKey: "MASUKKAN_KEY_ANDA",
```

> Peringatan: key akan terlihat oleh siapa pun yang membuka kode sumber, dan
> kemungkinan gagal CORS di hosting statis. Jangan dipakai untuk produksi.

## 3. Sesuaikan (opsional)

Di objek `config` (`js/lib/marketcheck.js`):

| Opsi | Fungsi |
| --- | --- |
| `defaultParams` | Filter pencarian (mis. `make`, `model`, `car_type`, `rows`). [100+ parameter](https://docs.marketcheck.com/docs/api/cars/inventory/inventory-search). |
| `usdToIdr` | Kurs untuk konversi harga USD→Rupiah (default 16000). |
| `placeholderImage` | Gambar cadangan bila listing tak punya foto. |

## Catatan & batasan

- **Mata uang:** data MarketCheck = pasar AS (USD). Harga dikali `usdToIdr`
  agar format Rupiah situs tetap konsisten. Sesuaikan kurs sesuai kebutuhan.
- **Spesifikasi performa:** endpoint inventory **tidak** memberi top speed / hp.
  Nilai pada kartu = **estimasi kasar**. Untuk spesifikasi asli, pakai VIN decode
  `/v2/decode/car/{vin}/specs` (pengembangan lanjutan).
- **Kategori** (hypercar/sport/suv/family/electric/classic) dipetakan secara
  heuristik dari `body_type` / `fuel_type` / `year`.
- **Kuota:** trial MarketCheck terbatas; cache hasil bila perlu.
