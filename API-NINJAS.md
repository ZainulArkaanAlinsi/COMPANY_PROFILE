# Fitur "Cek Spesifikasi" — API Ninjas Cars

Halaman **Shopping** (`penjualan.html` → bagian _Cek Spesifikasi_, id `#spesifikasi`)
menarik spesifikasi mobil **live** dari
[API Ninjas Cars API](https://api-ninjas.com/api/cars) (`GET /v1/cars`).

Masukkan merek + model (mis. `BMW` / `M4`) → tampil kartu spesifikasi: kelas,
mesin (silinder & cc), penggerak, bahan bakar, transmisi, tahun.

## Plan key kamu (tier gratis)

| Endpoint                                          | Status                       |
| ------------------------------------------------- | ---------------------------- |
| `/v1/cars` (spesifikasi)                          | ✅ jalan — dipakai fitur ini |
| `carmakes`, `carmodels`, `cartrims`, `cardetails` | 🔒 butuh plan berbayar       |
| field MPG & param `limit`                         | 🔒 premium                   |

Jika nanti upgrade plan, proxy sudah mengizinkan endpoint lain — tinggal panggil
`PC.carapi.get("carmodels", { make: "BMW" })`.

## Keamanan & CORS

Browser **tidak** memanggil API Ninjas langsung (key bocor + CORS). Semua lewat
**proxy** yang menyuntik `X-Api-Key` di server. `proxyUrl` = `/api/ninjas`.
Key **tidak pernah** ke-commit (`.gitignore` mengabaikan `.env`/`*.local`).

## Cara menjalankan

### Lokal (Node 18+)

```powershell
$env:API_NINJAS_KEY = "KEY_KAMU"
node server/proxy.js
```

Buka <http://localhost:3000> → **Shopping** → **Cek Spesifikasi**.
(Port 3000 dipakai? `$env:PORT="3100"` dulu.)

### Deploy Vercel

`api/ninjas.js` sudah siap. Set Environment Variable `API_NINJAS_KEY` di Vercel,
deploy — path `/api/ninjas` otomatis aktif.

## Batasan

- API ini **hanya spesifikasi** — tidak ada harga atau foto. Katalog showroom
  (gambar + harga Rupiah) tetap dari data kurasi lokal (`js/data/cars.js`);
  fitur ini melengkapinya dengan data teknis nyata.
- Dibuka langsung via `file://` → fitur nonaktif (perlu server proxy). Katalog
  & halaman lain tetap jalan normal.
- MarketCheck (listing) terpisah & dorman — lihat `MARKETCHECK.md` bila kelak
  punya key-nya.
