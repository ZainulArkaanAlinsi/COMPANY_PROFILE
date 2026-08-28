import { cars } from "@/lib/cars";

const base = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://premium-cars.example"
).replace(/\/$/, "");

export default function sitemap() {
  const routes = [
    "",
    "/heritage",
    "/katalog",
    "/harga-pasar",
    "/bandingkan",
    "/cicilan",
    "/jual",
    "/jual/appraisal",
    "/jual/trade-in",
    "/jual/consignment",
    "/journal",
    "/membership",
    "/kontak",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const units = cars.map((c) => ({
    url: `${base}/katalog/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...routes, ...units];
}
