// Server-side inventory source.
// If MARKETCHECK_API_KEY is set, pulls live active listings and normalizes them
// to the app's car shape. Otherwise falls back to the curated local dataset.
// The key is read from env on the server only — never shipped to the browser.

import { cars as localCars } from "./cars";

const MC_URL = "https://api.marketcheck.com/v2/search/car/active";
const USD_TO_IDR = 16000; // indicative conversion for display

function deriveCategory(build = {}) {
  const body = (build.body_type || "").toLowerCase();
  const fuel = (build.fuel_type || "").toLowerCase();
  if (fuel.includes("electric")) return "Electric";
  if (body.includes("suv")) return "SUV";
  if (body.includes("sedan")) return "Track";
  return "Limited Edition";
}

function normalize(listing) {
  const b = listing.build || {};
  const photos = (listing.media && listing.media.photo_links) || [];
  const name = [b.model, b.trim].filter(Boolean).join(" ") || listing.heading || "Unit";
  return {
    slug: `mc-${listing.id}`,
    brand: b.make || "—",
    name,
    eyebrow: b.trim || b.body_type || "Listing",
    year: b.year || null,
    category: deriveCategory(b),
    bodyStyle: b.body_type || "—",
    drivetrain: (b.drivetrain || "—").toUpperCase().replace(/\s+/g, ""),
    fuel: b.fuel_type || "—",
    status: "In Stock",
    price: listing.price ? Math.round(listing.price * USD_TO_IDR) : 0,
    hp: 0,
    image: photos[0] || "",
    gallery: photos.slice(0, 3),
    specs: [
      { k: "Tahun", v: String(b.year || "—") },
      { k: "Engine", v: b.engine || "—" },
      { k: "Penggerak", v: (b.drivetrain || "—").toUpperCase() },
      { k: "Jarak Tempuh", v: listing.miles ? `${listing.miles.toLocaleString()} mil` : "—" },
    ],
    summary: listing.heading || `${b.year || ""} ${name}`.trim(),
    live: true,
  };
}

/**
 * @returns {Promise<{ source: "marketcheck" | "local", cars: any[] }>}
 */
export async function getInventory() {
  const key = process.env.MARKETCHECK_API_KEY;
  if (!key) return { source: "local", cars: localCars };

  try {
    const params = new URLSearchParams({
      api_key: key,
      car_type: "used",
      start: "0",
      rows: "24",
      sort_by: "price",
      sort_order: "desc",
    });
    const r = await fetch(`${MC_URL}?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`MarketCheck HTTP ${r.status}`);
    const data = await r.json();
    const listings = (data.listings || []).map(normalize).filter((c) => c.price > 0);
    if (!listings.length) return { source: "local", cars: localCars };
    return { source: "marketcheck", cars: listings };
  } catch (e) {
    // Never break the page — degrade to curated data.
    return { source: "local", cars: localCars, error: e.message };
  }
}
