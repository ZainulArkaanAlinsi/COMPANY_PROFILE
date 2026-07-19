# SRS — Premium Cars Web

Format: Given–When–Then per fitur + aturan validasi.

## F1. Leads (`POST /api/leads`)
- Given payload `type` ∈ {contact, newsletter, appraisal, consignment},
  When field wajib terisi valid, Then respons `{ok:true, id:"PC-XXX-9999-YYYY"}`
  dan lead tersimpan + webhook/email terkirim (bila env di-set).
- Given field wajib kosong / email invalid / VIN < 11 atau > 17 karakter /
  pesan kontak < 10 karakter, Then `400 {ok:false, error}` berbahasa Indonesia.
- Given field honeypot `company` terisi, Then `400` tanpa penyimpanan.
- Given > 10 request/menit dari satu IP, Then `429`.
- `GET /api/leads` tanpa `Authorization: Bearer $ADMIN_TOKEN` → `401`.

## F2. Auth
- Register: nama ≥ 2, email valid & unik, password ≥ 6 → cookie sesi
  `pc_session` (httpOnly, SameSite=Lax, 7 hari, HMAC).
- Login salah → `401 "Email atau password salah."` (tanpa membocorkan mana yang salah).
- `/akun` tanpa sesi valid → redirect `/masuk?next=/akun`.
- Logout menghapus cookie; `GET /api/auth/me` mengembalikan `user|null`.

## F3. Market Intelligence
- Given make+model+year (1980–tahun berjalan), When dianalisis,
  Then laporan berisi: sumber berlabel (auto.dev | marketcheck | fipe | demo),
  median USD & IDR, estimasi nasional = median × kurs × faktor, dan
  kurva harga per tahun produksi bila ≥ 4 titik FIPE tersedia.
- Given semua sumber listing gagal, Then mode "demo" dengan label jelas — UI tidak pernah error kosong.
- Given tahun di luar rentang, Then `400`.
- Data di layar diperbarui otomatis tiap 60 detik selama tab terlihat.

## F4. Bandingkan
- Dua unit tidak boleh sama (pilihan yang sama disembunyikan dari select lawan).
- Metrik lower-is-better (0-100, harga) diberi keterangan; nilai hilang tampil "—" dan tidak dimenangkan siapa pun.

## F5. Tema & aksesibilitas
- Preferensi tema tersimpan (localStorage) dan diterapkan sebelum paint pertama (tanpa FOUC).
- Semua animasi nonaktif saat `prefers-reduced-motion: reduce`.

## Non-functional
- Build statis penuh kecuali API routes; halaman utama < 110 kB First Load JS.
- Key API tidak pernah dikirim ke browser; cookie sesi httpOnly.
- Semua upstream fetch punya timeout ≤ 9 dtk + fallback (halaman tidak pernah crash karena API eksternal).
