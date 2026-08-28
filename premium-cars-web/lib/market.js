// Market Intelligence layer (server-only).
//
// Sumber data, semua dengan fallback aman:
//  - Katalog merek/model/tahun : NHTSA vPIC (gratis, tanpa key)
//  - Harga pasar internasional  : Auto.dev (AUTODEV_API_KEY) →
//                                 MarketCheck (MARKETCHECK_API_KEY) →
//                                 Tabela FIPE Brasil (gratis, TANPA key) →
//                                 mode demo (data kurasi)
//  - Kurs                       : frankfurter.app (gratis) → kurs indikatif
//  - Estimasi harga nasional    : median internasional × kurs × faktor
//                                 pajak impor CBU (NATIONAL_PRICE_FACTOR)
//
// Semua key hanya dibaca di server, tidak pernah dikirim ke browser.

import { cars as curated } from "./cars";

const VPIC = "https://vpic.nhtsa.dot.gov/api/vehicles";
const FX_FALLBACK = 16300; // kurs indikatif bila API kurs tidak terjangkau
const DUTY_FACTOR = Number(process.env.NATIONAL_PRICE_FACTOR) || 2.4;

// Merek yang ditawarkan di UI — showroom range: mainstream sampai hypercar.
export const MAKES = [
  "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Ferrari", "Ford",
  "Honda", "Lamborghini", "Land Rover", "Lexus", "Maserati", "McLaren",
  "Mercedes-Benz", "Mitsubishi", "Nissan", "Porsche", "Rolls-Royce",
  "Tesla", "Toyota",
];

export const YEAR_MIN = 1980;
export const YEAR_MAX = new Date().getFullYear();

/** Daftar model untuk merek+tahun dari vPIC. Gratis, di-cache 24 jam. */
export async function getModels(make, year) {
  const url = `${VPIC}/GetModelsForMakeYear/make/${encodeURIComponent(
    make
  )}/modelyear/${year}?format=json`;
  const r = await fetch(url, { next: { revalidate: 86400 } });
  if (!r.ok) throw new Error(`vPIC HTTP ${r.status}`);
  const data = await r.json();
  const models = [
    ...new Set((data.Results || []).map((m) => m.Model_Name).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
  return { count: models.length, models };
}

/** Rentang ketersediaan katalog sebuah model (cek dekade, hemat request). */
export async function getYearSpread(make, model) {
  const probes = [];
  for (let y = YEAR_MAX; y >= YEAR_MIN; y -= 5) probes.push(y);
  const hits = [];
  await Promise.all(
    probes.map(async (y) => {
      try {
        const { models } = await getModels(make, y);
        if (models.some((m) => m.toLowerCase() === model.toLowerCase()))
          hits.push(y);
      } catch {}
    })
  );
  if (!hits.length) return null;
  return { from: Math.min(...hits), to: Math.max(...hits) };
}

/** Kurs USD→IDR live (frankfurter, tanpa key), cache 12 jam. */
export async function getFx() {
  try {
    const r = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=IDR",
      { next: { revalidate: 43200 } }
    );
    if (!r.ok) throw new Error(`fx HTTP ${r.status}`);
    const data = await r.json();
    const rate = data?.rates?.IDR;
    if (!rate) throw new Error("fx kosong");
    return { rate, date: data.date, source: "frankfurter" };
  } catch {
    return { rate: FX_FALLBACK, date: null, source: "indikatif" };
  }
}

const median = (nums) => {
  const s = [...nums].sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

/** Kurs BRL→USD untuk normalisasi harga FIPE, cache 12 jam. */
async function getBrlToUsd() {
  try {
    const r = await fetch(
      "https://api.frankfurter.app/latest?from=BRL&to=USD",
      { next: { revalidate: 43200 } }
    );
    if (!r.ok) throw new Error("fx brl");
    const data = await r.json();
    return data?.rates?.USD || 0.185;
  } catch {
    return 0.185; // indikatif
  }
}

const FIPE = "https://fipe.parallelum.com.br/api/v2";
const fipeTimeout = () => ({ signal: AbortSignal.timeout(9000) });

/**
 * Tabela FIPE (Brasil) — harga pasar resmi bulanan, gratis TANPA key.
 * Merek/model dicocokkan secara fuzzy; harga varian dikonversi BRL→USD.
 */
async function getFipeStats(make, model, year) {
  const brandsRes = await fetch(`${FIPE}/cars/brands`, {
    next: { revalidate: 86400 },
    ...fipeTimeout(),
  });
  if (!brandsRes.ok) throw new Error(`FIPE brands HTTP ${brandsRes.status}`);
  const brands = await brandsRes.json();
  const mk = make.toLowerCase();
  const brand = brands.find((b) => {
    const n = b.name.toLowerCase();
    return n.includes(mk) || mk.includes(n.split(" ")[0]);
  });
  if (!brand) return null;

  const modelsRes = await fetch(`${FIPE}/cars/brands/${brand.code}/models`, {
    next: { revalidate: 86400 },
    ...fipeTimeout(),
  });
  if (!modelsRes.ok) throw new Error(`FIPE models HTTP ${modelsRes.status}`);
  const models = await modelsRes.json();
  const q = model.toLowerCase();
  let candidates = models.filter((m) => m.name.toLowerCase().includes(q));
  if (!candidates.length) {
    const head = q.split(/\s+/)[0];
    candidates = models.filter((m) => m.name.toLowerCase().includes(head));
  }
  if (!candidates.length) return null;

  const brlToUsd = await getBrlToUsd();
  const prices = [];
  await Promise.all(
    candidates.slice(0, 4).map(async (m) => {
      try {
        const yearsRes = await fetch(
          `${FIPE}/cars/brands/${brand.code}/models/${m.code}/years`,
          { next: { revalidate: 86400 }, ...fipeTimeout() }
        );
        if (!yearsRes.ok) return;
        const years = await yearsRes.json();
        if (!years.length) return;
        const pick =
          years.find((y) => y.code.startsWith(`${year}-`)) ||
          years.reduce((best, y) => {
            const yr = Number(y.code.split("-")[0]) || 0;
            const bestYr = Number(best.code.split("-")[0]) || 0;
            return Math.abs(yr - year) < Math.abs(bestYr - year) ? y : best;
          }, years[0]);
        const priceRes = await fetch(
          `${FIPE}/cars/brands/${brand.code}/models/${m.code}/years/${pick.code}`,
          { next: { revalidate: 43200 }, ...fipeTimeout() }
        );
        if (!priceRes.ok) return;
        const detail = await priceRes.json();
        const brl = Number(
          String(detail.price).replace(/[^\d,]/g, "").replace(",", ".")
        );
        if (brl > 1000) prices.push(brl * brlToUsd);
      } catch {}
    })
  );
  if (!prices.length) return null;

  return {
    source: "fipe",
    market: "Brasil · Tabela FIPE",
    count: null,
    variants: prices.length,
    usd: {
      min: Math.min(...prices),
      median: median(prices),
      max: Math.max(...prices),
    },
  };
}

/**
 * Kurva harga per TAHUN PRODUKSI dari Tabela FIPE (gratis, tanpa key):
 * harga pasar hari ini untuk tiap tahun model, tua → baru. Inilah data
 * "naik/turun" yang dilihat pembeli showroom (kurva depresiasi nyata).
 * (Riwayat bulanan FIPE kini berbayar — kurva tahun tetap gratis.)
 */
export async function getFipeHistory(make, model, _year, maxPoints = 14) {
  // Resolusi brand/model (kandidat pertama).
  const brands = await (
    await fetch(`${FIPE}/cars/brands`, { next: { revalidate: 86400 }, ...fipeTimeout() })
  ).json();
  const mk = make.toLowerCase();
  const brand = brands.find((b) => {
    const n = b.name.toLowerCase();
    return n.includes(mk) || mk.includes(n.split(" ")[0]);
  });
  if (!brand) return null;

  const models = await (
    await fetch(`${FIPE}/cars/brands/${brand.code}/models`, {
      next: { revalidate: 86400 },
      ...fipeTimeout(),
    })
  ).json();
  const q = model.toLowerCase();
  const candidate =
    models.find((m) => m.name.toLowerCase().includes(q)) ||
    models.find((m) => m.name.toLowerCase().includes(q.split(/\s+/)[0]));
  if (!candidate) return null;

  const years = await (
    await fetch(
      `${FIPE}/cars/brands/${brand.code}/models/${candidate.code}/years`,
      { next: { revalidate: 86400 }, ...fipeTimeout() }
    )
  ).json();
  if (!years?.length) return null;

  // Ambil sampel merata bila varian tahun lebih banyak dari maxPoints.
  const sample =
    years.length <= maxPoints
      ? years
      : Array.from(
          { length: maxPoints },
          (_, i) => years[Math.round((i * (years.length - 1)) / (maxPoints - 1))]
        );

  const brlToUsd = await getBrlToUsd();
  const pointsOut = [];
  await Promise.all(
    sample.map(async (y) => {
      try {
        const r = await fetch(
          `${FIPE}/cars/brands/${brand.code}/models/${candidate.code}/years/${y.code}`,
          { next: { revalidate: 43200 }, ...fipeTimeout() }
        );
        if (!r.ok) return;
        const d = await r.json();
        const brl = Number(
          String(d.price).replace(/[^\d,]/g, "").replace(",", ".")
        );
        const yr = Number(y.code.split("-")[0]) || 0;
        if (brl > 1000)
          pointsOut.push({
            year: yr,
            label: yr >= 32000 ? "0 KM" : String(yr),
            usd: brl * brlToUsd,
          });
      } catch {}
    })
  );
  if (pointsOut.length < 4) return null;
  // Urutkan tahun tua → baru (0 KM paling akhir).
  pointsOut.sort((a, b) => a.year - b.year);
  return {
    variant: candidate.name,
    points: pointsOut.map(({ label, usd }) => ({ label, usd })),
  };
}

/** Statistik pasar internasional: Auto.dev → MarketCheck → FIPE → null. */
export async function getListingStats(make, model, year) {
  const adKey = process.env.AUTODEV_API_KEY;
  if (adKey) {
    try {
      const params = new URLSearchParams({ apikey: adKey, make, model });
      if (year) {
        params.set("year_min", String(year));
        params.set("year_max", String(year));
      }
      const r = await fetch(`https://auto.dev/api/listings?${params}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(9000),
      });
      if (!r.ok) throw new Error(`Auto.dev HTTP ${r.status}`);
      const data = await r.json();
      const prices = (data.records || [])
        .map((rec) => Number(String(rec.price).replace(/[^\d]/g, "")))
        .filter((p) => p > 1000);
      if (prices.length) {
        return {
          source: "auto.dev",
          market: "Amerika Serikat",
          count: data.totalCount ?? prices.length,
          usd: {
            min: Math.min(...prices),
            median: median(prices),
            max: Math.max(...prices),
          },
        };
      }
    } catch {}
  }

  const mcKey = process.env.MARKETCHECK_API_KEY;
  if (mcKey) {
    try {
      const params = new URLSearchParams({
        api_key: mcKey,
        make,
        model,
        car_type: "used",
        rows: "20",
        stats: "price",
      });
      if (year) params.set("year", String(year));
      const r = await fetch(
        `https://api.marketcheck.com/v2/search/car/active?${params}`,
        {
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(9000),
        }
      );
      if (!r.ok) throw new Error(`MarketCheck HTTP ${r.status}`);
      const data = await r.json();
      const prices = (data.listings || [])
        .map((l) => l.price)
        .filter((p) => p > 0);
      const stats = data.stats?.price;
      const med = stats?.median ?? median(prices);
      if (med) {
        return {
          source: "marketcheck",
          market: "Amerika Serikat",
          count: data.num_found ?? prices.length,
          usd: {
            min: stats?.min ?? Math.min(...prices),
            median: med,
            max: stats?.max ?? Math.max(...prices),
          },
        };
      }
    } catch {}
  }

  // Tanpa key apa pun: Tabela FIPE tetap memberi data pasar live.
  try {
    const fipe = await getFipeStats(make, model, year);
    if (fipe) return fipe;
  } catch {}

  return null;
}

/** Estimasi demo dari data kurasi lokal bila tidak ada key listing. */
function demoStats(make, model, year, fxRate) {
  const hit = curated.find(
    (c) =>
      c.brand.toLowerCase().includes(make.toLowerCase()) ||
      make.toLowerCase().includes(c.brand.toLowerCase())
  );
  let usdMedian;
  if (hit) {
    usdMedian = hit.price / DUTY_FACTOR / fxRate;
  } else {
    // Baseline segmen premium + depresiasi ~8%/tahun, lantai 15k USD.
    const age = Math.max(YEAR_MAX - (year || YEAR_MAX), 0);
    usdMedian = Math.max(120000 * Math.pow(0.92, age), 15000);
  }
  return {
    source: "demo",
    market: "Estimasi kurasi",
    count: null,
    usd: {
      min: usdMedian * 0.82,
      median: usdMedian,
      max: usdMedian * 1.18,
    },
  };
}

/** Spesifikasi via API Ninjas bila key tersedia. */
async function getSpecs(make, model, year) {
  const key = process.env.API_NINJAS_KEY;
  if (!key) return null;
  try {
    const q = new URLSearchParams({ make, model });
    if (year) q.set("year", String(year));
    const r = await fetch(`https://api.api-ninjas.com/v1/cars?${q}`, {
      headers: { "X-Api-Key": key },
      next: { revalidate: 86400 },
    });
    if (!r.ok) return null;
    const list = await r.json();
    return Array.isArray(list) && list.length ? list[0] : null;
  } catch {
    return null;
  }
}

/** Laporan pasar lengkap untuk satu merek+model(+tahun). */
export async function getMarketReport({ make, model, year }) {
  const [fx, catalog, spread, listing, specs, history] = await Promise.all([
    getFx(),
    year
      ? getModels(make, year).catch(() => null)
      : Promise.resolve(null),
    model ? getYearSpread(make, model).catch(() => null) : null,
    model ? getListingStats(make, model, year) : null,
    model ? getSpecs(make, model, year) : null,
    model ? getFipeHistory(make, model, year).catch(() => null) : null,
  ]);

  const stats = listing || demoStats(make, model, year, fx.rate);
  const toIdr = (usd) => Math.round(usd * fx.rate);

  // Tren naik/turun dari riwayat FIPE.
  let trend = null;
  if (history?.points?.length >= 4) {
    const pts = history.points;
    const first = pts[0].usd;
    const last = pts[pts.length - 1].usd;
    trend = {
      variant: history.variant,
      pct: first ? ((last - first) / first) * 100 : 0,
      direction: last >= first ? "up" : "down",
      points: pts.map((p) => ({ label: p.label, idr: toIdr(p.usd) })),
    };
  }

  return {
    query: { make, model, year },
    catalog: catalog
      ? { modelsInYear: catalog.count, models: catalog.models.slice(0, 60) }
      : null,
    availability: spread,
    listing: {
      ...stats,
      idr: {
        min: toIdr(stats.usd.min),
        median: toIdr(stats.usd.median),
        max: toIdr(stats.usd.max),
      },
    },
    national: {
      estimateIdr: Math.round(stats.usd.median * fx.rate * DUTY_FACTOR),
      factor: DUTY_FACTOR,
      note:
        "Median internasional × kurs × faktor pajak impor CBU (bea masuk + PPnBM + PPN) — indikatif, bukan penawaran.",
    },
    trend,
    fx,
    specs,
    mode: listing ? "live" : "demo",
  };
}
