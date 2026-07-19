# PRD — Premium Cars Web

## Problem statement
Showroom mobil premium butuh satu website yang sekaligus company profile
dan marketplace jual-beli: pembeli awam sulit tahu harga pasar wajar
(nasional vs internasional), dan penjual tidak punya jalur appraisal /
trade-in / consignment yang jelas.

## Goals & success metrics
- Lead inquiry (kontak/appraisal/consignment) ≥ 20/bulan → terukur di `/api/leads`.
- ≥ 40% pengunjung katalog membuka detail unit atau Harga Pasar.
- Waktu jawab concierge < 24 jam (SLA di copy semua form).

## Non-goals (out of scope v1)
- Pembayaran online / booking berbayar.
- Chat real-time in-app (dialihkan ke WhatsApp).
- Multi-bahasa (ID dulu, EN menyusul).

## Persona & jobs-to-be-done
1. **Kolektor** — "Cari unit langka & jual koleksi diam-diam" → Katalog, Consignment.
2. **Upgrader** — "Tukar mobilku ke unit lebih tinggi, berapa selisihnya?" → Trade-In Equity Analyzer.
3. **Orang awam / peminat** — "Iseng riset harga & spek mobil apa pun, tahun lama–baru" → Harga Pasar, Bandingkan.

## High-level flow
Landing → (Beli: Katalog → Detail → Reserve/Test-Drive/WA) ·
(Riset: Harga Pasar → grafik tren → Sourcing) ·
(Jual: Hub → Appraisal / Trade-In / Consignment → lead) ·
(Akun: Daftar/Masuk → riwayat aktivitas).

## Key features (prioritas)
P0 Katalog + detail + lead forms + backend leads ·
P0 Harga Pasar (vPIC + FIPE/MarketCheck/Auto.dev + kurs) ·
P1 Trade-In Analyzer, Consignment, Appraisal ·
P1 Bandingkan mobil + grafik tren harga ·
P1 Auth (akun + riwayat) · P2 Membership/Journal/Heritage.

## Assumptions & constraints
- Data listing internasional = pasar AS/Brasil sebagai proxy; harga nasional = estimasi berfaktor pajak (indikatif).
- Penyimpanan file JSON bersifat demo; produksi memakai DB (lihat SDD).

## Risks & mitigasi
- API pihak ketiga down → fallback berlapis + mode demo berlabel.
- Estimasi harga disalahartikan sebagai penawaran → disclaimer di semua panel harga.

## Release plan
- **MVP v1 (sekarang)**: semua P0+P1 di atas, deploy Vercel.
- **v1.1**: DB riil (Postgres) untuk leads/users, foto unit asli.
- **v2**: wishlist per akun, notifikasi harga, dashboard admin.
