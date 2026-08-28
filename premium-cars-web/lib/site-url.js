/* Basis URL absolut untuk sitemap, robots.txt, dan metadata Open Graph.

   Urutan sumbernya:
   1. NEXT_PUBLIC_SITE_URL — bila disetel manual di environment
   2. VERCEL_PROJECT_PRODUCTION_URL — domain produksi yang diisi Vercel
      sendiri, sehingga TANPA konfigurasi apa pun URL-nya tetap benar
   3. contoh terakhir, hanya relevan bila dijalankan di luar Vercel

   Nilainya dinormalkan lebih dulu karena isian manual mudah keliru dan
   kekeliruannya tidak kelihatan sampai sitemap terlanjur tayang:
     "https:/situs.com"   → skema kurang satu garis miring
     "situs.com"          → tanpa skema (new URL() akan melempar error)
     "https://situs.com/" → garis miring di ujung, bikin URL ganda "//" */
function normalize(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  const withScheme = /^https?:/i.test(v)
    ? v.replace(/^(https?:)\/*/i, "$1//")
    : `https://${v}`;
  return withScheme.replace(/\/+$/, "");
}

export const SITE_URL =
  normalize(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalize(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  "https://premium-cars.example";
