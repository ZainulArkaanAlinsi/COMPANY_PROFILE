# Task Breakdown — Premium Cars Web

Status: ✅ selesai · 🔜 berikutnya. Tiap task: DoD jelas, dependensi urut.

## Milestone 1 — Fondasi & setup ✅
- ✅ Next.js 14 + Tailwind + design tokens (DoD: build hijau, tokens = DESIGN.md)
- ✅ Layout, Navbar 2-tingkat, Footer, tema dark/light tanpa FOUC
- ✅ Gitignore: `.env*`, `.claude/`, `data/` tidak pernah ter-commit

## Milestone 2 — Core marketplace ✅
- ✅ 13 halaman dari desain Stitch (home, katalog, detail, jual×4, dst.)
- ✅ Data kurasi + foto terverifikasi visual (DoD: nama = foto)
- ✅ Backend leads + semua form tersambung (DoD: curl & e2e pass)
- ✅ Auth register/login/logout + /akun (DoD: cookie httpOnly, e2e pass)

## Milestone 3 — Market Intelligence ✅
- ✅ /api/catalog (vPIC) + /api/market (Auto.dev→MC→FIPE + kurs)
- ✅ Grafik tren 12 bulan (FIPE references) + auto-refresh 60 dtk
- ✅ /bandingkan head-to-head + diagram kelebihan
- ✅ Deep-link antar fitur (detail → trade-in/bandingkan/harga-pasar)

## Milestone 4 — Test & release ✅ / 🔜
- ✅ E2E Playwright: 9 flow forms + market + auth (jalankan tiap rilis)
- ✅ Deploy Vercel (`vercel --prod`, root `premium-cars-web`)
- 🔜 Set env produksi: `AUTH_SECRET` (wajib), `LEADS_WEBHOOK_URL`/Resend,
  `AUTODEV_API_KEY`, `NEXT_PUBLIC_SITE_URL`
- 🔜 Monitoring: cek Vercel Logs untuk `[leads]` + error rate API

## Backlog v1.1 → v2
- 🔜 Postgres (Neon/Supabase) untuk users + leads; migrasi dari file-store
- 🔜 Vercel Cron: snapshot harga harian → grafik historis mandiri
- 🔜 Wishlist per akun + notifikasi perubahan harga (email)
- 🔜 Dashboard admin (list lead, status follow-up)
- 🔜 Foto unit asli menggantikan stock Unsplash
