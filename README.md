# PREMIUM CARS

Company profile sekaligus marketplace untuk showroom kendaraan performa tinggi.
Aplikasi **Next.js 14 (App Router)**, tayang di
[heritage-garage-gules.vercel.app](https://heritage-garage-gules.vercel.app).

## Struktur

```
premium-cars-web/        ← seluruh aplikasi ada di sini
├── app/                 20 rute + 7 rute API + sitemap & robots
├── components/          31 komponen
├── lib/                 data & logika
└── vercel.json          konfigurasi build (menang atas setelan project)

docs/arsip-situs-lama/   dokumentasi situs statis yang sudah dipensiunkan
```

Repo ini pernah berisi **dua** situs: aplikasi Next.js di atas, dan sebuah situs
statis HTML/CSS/JS di akar repo. Yang statis sudah dihapus; berkasnya tetap utuh
di riwayat git dan di branch `backup/desain-lokal`.

## Menjalankan secara lokal

```bash
cd premium-cars-web
npm install
npm run dev          # http://localhost:3000
```

`better-sqlite3` adalah modul native. Bila npm memblokir install script-nya:

```bash
npm install-scripts approve better-sqlite3 && npm install
```

Tanpa langkah itu situs publik tetap jalan normal — hanya area `/admin` yang gagal,
karena hanya di sanalah database dipakai.

## Environment

| Variabel | Wajib | Untuk apa |
|---|---|---|
| `AUTH_SECRET` | ya, di produksi | Menandatangani cookie sesi. **Tanpa ini, login dinonaktifkan sepenuhnya** — bukan jatuh ke rahasia cadangan. |
| `NEXT_PUBLIC_SITE_URL` | tidak | Basis URL untuk sitemap, robots, dan Open Graph. Bila kosong, dipakai domain produksi Vercel secara otomatis. |
| `MARKETCHECK_API_KEY` | tidak | Inventaris live. Bila kosong, katalog memakai data lokal. |
| `LEADS_ADMIN_TOKEN` | tidak | Membuka endpoint pembacaan leads. |

## Katalog

`lib/catalog-data.js` memuat **270 model nyata**, 1970–2025, dari 15 negara.
Formatnya tabel pipe-delimited yang diurai saat modul dimuat.

Aturan yang dipegang berkas itu: spesifikasi teknis diisi angka produksi
sungguhan; angka yang tidak diketahui pasti ditulis `0` dan tampil sebagai `—`,
tidak pernah ditebak. Harga adalah estimasi pasar untuk keperluan tampilan, dan
itu dinyatakan di kepala berkasnya.

Foto hanya dipasang untuk model yang punya foto terverifikasi. Sisanya memakai
fallback `SmartImage` — memasang foto mobil yang salah lebih buruk daripada tidak
ada foto.

## Deploy

Otomatis lewat Vercel setiap push ke `main`. Root Directory project disetel ke
`premium-cars-web`; `premium-cars-web/vercel.json` menyatakan framework, install,
build, dan output directory secara eksplisit sehingga tidak bergantung pada
setelan di dashboard.
