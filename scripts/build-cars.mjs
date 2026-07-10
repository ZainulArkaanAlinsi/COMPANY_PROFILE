/* ============================================================
   Generator halaman detail unit — mobil/<id>.html + sitemap.xml

   Kenapa digenerate, bukan satu halaman ?id=<id>:
   crawler dan pratinjau tautan (WhatsApp, X, Facebook) tidak
   menjalankan JavaScript, jadi <title>, meta description, dan
   Open Graph harus sudah ada di HTML saat dikirim.

   Jalankan setiap kali PC.cars di js/data/cars.js berubah:
       npm run build:cars
   ============================================================ */
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = resolve(ROOT, "mobil");

/* Domain produksi — samakan dengan robots.txt. */
const SITE = "https://premiumcars.example.com";
const WHATSAPP = "622151408888";

/* ---------------- Muat data ---------------- */

/** Jalankan js/data/cars.js dalam konteks tempat `window` menunjuk ke global
    sandbox itu sendiri — persis seperti di browser, sehingga `window.PC = …`
    lalu referensi bare `PC` di baris berikutnya sama-sama bekerja. */
async function loadData() {
  const src = await readFile(resolve(ROOT, "js/data/cars.js"), "utf8");
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: "js/data/cars.js" });
  return sandbox.PC;
}

/* ---------------- Util ---------------- */
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* Harus cocok dengan PC.format.number di js/lib/format.js — teks statis di
   HTML adalah nilai akhir yang juga dituju animasi count-up (PC.ui.initCounters).
   Kalau formatnya beda, angka "berkedip" begitu animasi selesai. */
const num = (n) => new Intl.NumberFormat("id-ID").format(Math.round(n));
const rupiah = (n) => "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));

/** Ringkas untuk meta description: "Rp 56 M" / "Rp 1,5 M" / "Rp 650 Jt". */
const compactRupiah = (n) => {
  const trim = (x) => (Math.round(x * 10) / 10).toString().replace(".", ",");
  if (n >= 1e9) return `Rp ${trim(n / 1e9)} M`;
  if (n >= 1e6) return `Rp ${trim(n / 1e6)} Jt`;
  return rupiah(n);
};

/** Nama file gambar memuat spasi & tanda kurung — harus di-encode di HTML. */
const url = (path) => encodeURI(path);

/* ---------------- Potongan HTML ---------------- */

function head(PC, car) {
  const noun = PC.categoryNoun(car.category);
  const title = `${car.name} — PREMIUM CARS`;
  const desc = `${car.tagline} ${car.specs.power} hp · ${car.specs.topSpeed} km/h · ${compactRupiah(car.price)} di PREMIUM CARS.`;
  const canonical = `${SITE}/mobil/${car.id}`;
  const image = `${SITE}/${url(car.image)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.name,
    brand: { "@type": "Brand", name: car.brand },
    model: car.name,
    vehicleConfiguration: PC.categoryLabel(car.category),
    productionDate: String(car.year),
    image,
    description: `${car.name} — ${noun} ${car.brand} tahun ${car.year}. ${car.tagline}`,
    vehicleSeatingCapacity: car.specs.seats,
    vehicleTransmission: car.specs.transmission,
    speed: { "@type": "QuantitativeValue", value: car.specs.topSpeed, unitCode: "KMH" },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "IDR",
      price: car.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: "PREMIUM CARS" },
    },
  };

  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <link rel="canonical" href="${esc(canonical)}" />

    <!-- SEO / Open Graph -->
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="PREMIUM CARS" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(car.tagline)}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(car.tagline)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <link rel="icon" href="../icon/shopping-bag.png" />

    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2).replace(/</g, "\\u003c")}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../css/tokens.css" />
    <link rel="stylesheet" href="../css/components.css" />
    <link rel="stylesheet" href="../css/chrome.css" />
    <link rel="stylesheet" href="../css/mobil.css" />`;
}

function header() {
  return `    <header class="site-header">
      <div class="logo">
        <a href="../index.html" class="wordmark">PREMIUM<span>CARS</span></a>
      </div>
      <nav aria-label="Navigasi utama">
        <ul class="nav-links" id="nav-links">
          <li><a href="../index.html">HOME</a></li>
          <li><a href="../about.html">ABOUT</a></li>
          <li><a href="../penjualan.html" class="is-active">KATALOG</a></li>
          <li><a href="../penjualan.html#simulasi">CICILAN</a></li>
          <li><a href="../penjualan.html#contact">CONTACT</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <button class="cart-btn" id="cart-btn" type="button" aria-label="Buka daftar minat">
          <i class="ri-bookmark-line" aria-hidden="true"></i>
          <span class="cart-badge is-empty" id="cart-count">0</span>
        </button>
        <div class="hamburger" id="hamburger" role="button" tabindex="0"
             aria-label="Buka menu" aria-controls="nav-links" aria-expanded="false">&#9776;</div>
      </div>
    </header>`;
}

function specRow(k, v) {
  return `          <div class="spec-row">
            <span class="spec-row__k">${esc(k)}</span>
            <span class="spec-row__v">${esc(v)}</span>
          </div>`;
}

function hero(PC, car) {
  const s = car.specs;
  const waText = `Halo PREMIUM CARS, saya tertarik dengan ${car.name} (${rupiah(car.price)}). Mohon info ketersediaan dan test drive.`;
  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`;

  return `      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span aria-hidden="true">/</span>
        <a href="../penjualan.html">Katalog</a>
        <span aria-hidden="true">/</span>
        <a href="../penjualan.html?cat=${esc(car.category)}">${esc(PC.categoryLabel(car.category))}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${esc(car.name)}</span>
      </nav>

      <section class="unit-hero">
        <div class="unit-hero__media anim-up d1">
          <span class="unit-hero__badge">${esc(car.badge)}</span>
          <img src="${url("../" + car.image)}" alt="${esc(car.name)}" width="900" height="600" />
        </div>
        <div class="unit-hero__body">
          <p class="kicker anim-up d1">
            <span class="kicker__dot" aria-hidden="true"></span>
            ${esc(car.brand)} · ${esc(car.year)}
          </p>
          <h1 class="unit-hero__title anim-up d2">${esc(car.name)}</h1>
          <p class="unit-hero__tagline anim-up d3">${esc(car.tagline)}</p>
          <p class="unit-hero__price anim-up d3">${esc(rupiah(car.price))}</p>

          <div class="unit-stats anim-up d4">
            <div class="unit-stat">
              <strong data-count="${s.topSpeed}" data-suffix=" km/h">${num(s.topSpeed)} km/h</strong>
              <span>Kecepatan maks</span>
            </div>
            <div class="unit-stat">
              <strong data-count="${s.power}" data-suffix=" hp">${num(s.power)} hp</strong>
              <span>Tenaga</span>
            </div>
            <div class="unit-stat">
              <strong data-count="${s.seats}" data-suffix=" kursi">${num(s.seats)} kursi</strong>
              <span>Kapasitas</span>
            </div>
          </div>

          <div class="unit-hero__actions anim-up d4">
            <button class="btn-solid" type="button" id="unit-add" data-car="${esc(car.id)}">
              Tambah ke daftar minat
            </button>
            <a class="btn-ghost" href="${esc(waUrl)}" target="_blank" rel="noreferrer">
              <i class="ri-whatsapp-line" aria-hidden="true"></i> Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>`;
}

function about(PC, car) {
  const noun = PC.categoryNoun(car.category);
  const intro = PC.categoryIntro[car.category] || "";
  const s = car.specs;

  return `      <section class="unit-section reveal" id="tentang">
        <div class="reveal reveal--rule" aria-hidden="true"></div>
        <div class="unit-section__head">
          <p class="kicker"><span class="kicker__num">01</span> Tentang unit</p>
          <h2>SEKILAS</h2>
        </div>
        <div class="unit-grid">
          <div class="unit-prose">
            <p>
              ${esc(car.name)} adalah ${esc(noun)} ${esc(car.brand)} tahun ${esc(car.year)}.
              ${esc(car.tagline)}
            </p>
            <p>${esc(intro)}</p>
            <p>
              Setiap unit yang masuk showroom kami lewat pemeriksaan kondisi mesin,
              kelengkapan dokumen, dan penelusuran riwayat perawatan sebelum
              ditawarkan. Jadwalkan inspeksi langsung atau test drive kapan pun Anda siap.
            </p>
          </div>
          <div class="unit-specs">
            <h3 class="unit-specs__title">Spesifikasi</h3>
${specRow("Merek", car.brand)}
${specRow("Tahun", String(car.year))}
${specRow("Kategori", PC.categoryLabel(car.category))}
${specRow("Kecepatan maks", num(s.topSpeed) + " km/h")}
${specRow("Tenaga", num(s.power) + " hp")}
${specRow("Kapasitas", num(s.seats) + " kursi")}
${specRow("Transmisi", s.transmission)}
${specRow("Harga", rupiah(car.price))}
          </div>
        </div>
      </section>`;
}

function cicilan(car) {
  /* Nilai awal (DP 20%, 36 bulan) dirender statis agar tetap terbaca tanpa JS;
     js/mobil.js menghitung ulang saat tenor diganti. */
  const dp = Math.round(car.price * 0.2);
  const months = 36;
  const totalLoan = (car.price - dp) * (1 + 0.05 * (months / 12));

  const chip = (m) =>
    `            <button class="tenor-chip${m === months ? " is-active" : ""}" type="button" data-tenor="${m}" aria-pressed="${m === months}">${m} bln</button>`;

  return `      <section class="unit-section reveal" id="cicilan">
        <div class="reveal reveal--rule" aria-hidden="true"></div>
        <div class="unit-section__head">
          <p class="kicker"><span class="kicker__num">02</span> Cicilan</p>
          <h2>ESTIMASI ANGSURAN</h2>
        </div>
        <div class="unit-sim" data-price="${car.price}">
          <div class="unit-sim__panel">
            <span class="unit-sim__label">Angsuran per bulan</span>
            <strong class="unit-sim__value" id="unit-sim-monthly">${esc(rupiah(totalLoan / months))}</strong>
            <span class="unit-sim__sub" id="unit-sim-sub">
              DP 20% (${esc(rupiah(dp))}) · tenor ${months} bulan · bunga flat 5%/th
            </span>
          </div>
          <div class="unit-sim__controls">
            <span class="unit-sim__hint">Ganti tenor</span>
            <div class="tenor-chips" role="group" aria-label="Pilih tenor">
${[12, 24, 36, 48, 60].map(chip).join("\n")}
            </div>
            <a class="btn-link" href="../penjualan.html?sim=${esc(car.id)}">
              Buka simulator lengkap »
            </a>
          </div>
        </div>
        <p class="unit-sim__note">
          Estimasi memakai bunga flat 5% per tahun dan bersifat indikatif — bukan penawaran kredit resmi.
        </p>
      </section>`;
}

function related(PC, car) {
  const list = PC.relatedCars(car, 3);
  const cards = list
    .map(
      (c) => `          <a class="unit-card" href="./${esc(c.id)}.html">
            <div class="unit-card__media">
              <img src="${url("../" + c.image)}" alt="${esc(c.name)}" loading="lazy" />
            </div>
            <span class="unit-card__badge">${esc(c.badge)}</span>
            <h3 class="unit-card__name">${esc(c.name)}</h3>
            <p class="unit-card__meta">${esc(c.brand)} · ${esc(c.year)}</p>
            <p class="unit-card__price">${esc(rupiah(c.price))}</p>
            <span class="unit-card__cta">Lihat unit <i class="ri-arrow-right-up-line" aria-hidden="true"></i></span>
          </a>`
    )
    .join("\n");

  return `      <section class="unit-section reveal" id="serupa">
        <div class="reveal reveal--rule" aria-hidden="true"></div>
        <div class="unit-section__head">
          <p class="kicker"><span class="kicker__num">03</span> Unit serupa</p>
          <h2>MUNGKIN ANDA SUKA</h2>
        </div>
        <div class="unit-cards" data-stagger="110">
${cards}
        </div>
      </section>`;
}

function footer() {
  return `    <footer class="site-footer">
      <a href="../index.html" class="footer_wordmark">PREMIUM<span>CARS</span></a>
      <nav class="footer_links" aria-label="Footer">
        <a href="../index.html">Home</a>
        <a href="../about.html">About</a>
        <a href="../penjualan.html">Katalog</a>
        <a href="../penjualan.html#simulasi">Cicilan</a>
        <a href="../penjualan.html#contact">Kontak</a>
      </nav>
      <div class="footer_bar">
        <span>&copy; <span data-year>2026</span> PREMIUM CARS. All rights reserved.</span>
        <span>Designed in Jakarta</span>
      </div>
    </footer>

    <a href="https://wa.me/${WHATSAPP}" class="whatsapp-float" target="_blank" rel="noreferrer" aria-label="Hubungi via WhatsApp">
      <i class="ri-whatsapp-line" aria-hidden="true"></i>
    </a>

    <!-- Halaman ini berada di subfolder: beri tahu PC.asset cara mencari aset. -->
    <script>window.PC_BASE = "../";</script>
    <script src="../js/data/cars.js"></script>
    <script src="../js/lib/format.js"></script>
    <script src="../js/lib/storage.js"></script>
    <script src="../js/lib/store.js"></script>
    <script src="../js/lib/ui.js"></script>
    <script src="../js/components/cart.js"></script>
    <script src="../js/components/simulator.js"></script>
    <script src="../js/components/nav.js"></script>
    <script src="../js/mobil.js"></script>`;
}

function page(PC, car) {
  return `<!doctype html>
<!-- DIGENERATE OTOMATIS oleh scripts/build-cars.mjs — jangan diedit manual.
     Ubah js/data/cars.js lalu jalankan: npm run build:cars -->
<html lang="id">
  <head>
${head(PC, car)}
  </head>
  <body class="unit-page">
    <div class="scroll-progress" id="scroll-progress" aria-hidden="true"></div>
    <a class="skip-link" href="#main-content">Langsung ke konten</a>
${header()}
    <main class="unit-main" id="main-content">
${hero(PC, car)}
${about(PC, car)}
${cicilan(car)}
${related(PC, car)}
    </main>
${footer()}
  </body>
</html>
`;
}

/* ---------------- Sitemap ---------------- */
function sitemap(PC) {
  const entry = (loc, changefreq, priority) =>
    `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const urls = [
    entry(`${SITE}/index.html`, "weekly", "1.0"),
    entry(`${SITE}/penjualan.html`, "weekly", "0.9"),
    entry(`${SITE}/about.html`, "monthly", "0.7"),
    ...PC.cars.map((c) => entry(`${SITE}/mobil/${c.id}`, "weekly", "0.8")),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- DIGENERATE OTOMATIS oleh scripts/build-cars.mjs (npm run build:cars).
     Ganti konstanta SITE di skrip tersebut dengan domain produksi Anda. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

/* ---------------- Main ---------------- */
async function main() {
  const PC = await loadData();
  await mkdir(OUT_DIR, { recursive: true });

  /* Buang halaman unit yang mobilnya sudah dihapus dari data. */
  const keep = new Set(PC.cars.map((c) => `${c.id}.html`));
  const existing = await readdir(OUT_DIR).catch(() => []);
  const stale = existing.filter((f) => f.endsWith(".html") && !keep.has(f));
  await Promise.all(stale.map((f) => rm(resolve(OUT_DIR, f))));

  await Promise.all(
    PC.cars.map((car) => writeFile(resolve(OUT_DIR, `${car.id}.html`), page(PC, car), "utf8"))
  );
  await writeFile(resolve(ROOT, "sitemap.xml"), sitemap(PC), "utf8");

  console.log(`✓ ${PC.cars.length} halaman unit ditulis ke mobil/`);
  if (stale.length) console.log(`✓ ${stale.length} halaman usang dihapus: ${stale.join(", ")}`);
  console.log(`✓ sitemap.xml diperbarui (${PC.cars.length + 3} URL)`);
}

main().catch((err) => {
  console.error("Gagal membangun halaman unit:", err);
  process.exit(1);
});
