# Arsip — situs statis lama

Berkas di folder ini adalah dokumentasi **situs statis HTML/CSS/JS** yang dulu
berada di akar repo (`index.html`, `penjualan.html`, `mobil/`, `css/`, `js/`,
dan server Express di `server/`).

Situs itu **sudah dipensiunkan**. Situs yang tayang sekarang adalah aplikasi
Next.js di `premium-cars-web/`.

Dokumen-dokumen ini disimpan karena memuat pekerjaan perencanaan yang nyata —
persyaratan produk, keputusan desain, dan catatan integrasi API. Sebagian
besar isinya **tidak lagi menggambarkan situs yang tayang**: berkas yang
dirujuk (`penjualan.html`, `js/components/`, `api/*.js`) sudah tidak ada.

Kalau butuh berkas aslinya, semuanya utuh di riwayat git:

```bash
# lihat isi repo sebelum dirapikan
git show 86cac9a --stat

# pulihkan satu berkas
git checkout 86cac9a -- index.html

# atau lihat branch cadangan yang memuat versi lokal terakhir
git checkout backup/desain-lokal
```
