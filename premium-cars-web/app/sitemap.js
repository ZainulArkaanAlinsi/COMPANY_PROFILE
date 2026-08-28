import { cars } from "@/lib/cars";
import { journal } from "@/lib/journal";
import { SITE_URL as base } from "@/lib/site-url";

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

  // Artikel journal punya halamannya sendiri sejak rute /journal/[slug]
  // ditambahkan, tetapi sitemap tidak pernah ikut diperbarui — sehingga
  // halamannya tayang tapi tidak pernah ditemukan mesin pencari.
  const artikel = journal.map((a) => ({
    url: `${base}/journal/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...routes, ...units, ...artikel];
}
