// Repository inventaris mobil — semua akses tabel `cars` lewat sini
// (satu tempat, mudah di-swap ke driver DB lain nanti).
import { getDb } from "../db";

function rowToCar(r) {
  if (!r) return null;
  return {
    ...r,
    gallery: safeParse(r.gallery, []),
    specs: safeParse(r.specs, []),
  };
}
function safeParse(s, fallback) {
  try {
    return JSON.parse(s ?? "");
  } catch {
    return fallback;
  }
}

export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function listCars() {
  return getDb().prepare("SELECT * FROM cars ORDER BY id DESC").all().map(rowToCar);
}

export function getCarById(id) {
  return rowToCar(getDb().prepare("SELECT * FROM cars WHERE id = ?").get(Number(id)));
}

export function getCarBySlug(slug) {
  return rowToCar(getDb().prepare("SELECT * FROM cars WHERE slug = ?").get(slug));
}

function normalize(data) {
  return {
    brand: String(data.brand || "").trim(),
    name: String(data.name || "").trim(),
    eyebrow: String(data.eyebrow || "").trim(),
    year: data.year ? Number(data.year) : null,
    category: String(data.category || "").trim(),
    bodyStyle: String(data.bodyStyle || "").trim(),
    drivetrain: String(data.drivetrain || "").trim(),
    fuel: String(data.fuel || "").trim(),
    status: String(data.status || "In Stock").trim(),
    price: data.price ? Math.round(Number(data.price)) : 0,
    hp: data.hp ? Number(data.hp) : null,
    image: String(data.image || "").trim(),
    gallery: JSON.stringify(Array.isArray(data.gallery) ? data.gallery : []),
    specs: JSON.stringify(Array.isArray(data.specs) ? data.specs : []),
  };
}

function uniqueSlug(base, ignoreId = null) {
  const db = getDb();
  let slug = base || "unit";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const row = db.prepare("SELECT id FROM cars WHERE slug = ?").get(slug);
    if (!row || row.id === ignoreId) return slug;
    slug = `${base}-${++n}`;
  }
}

export function createCar(data) {
  const db = getDb();
  const v = normalize(data);
  if (!v.brand || !v.name) throw new Error("Merek & nama wajib diisi.");
  const slug = uniqueSlug(data.slug ? slugify(data.slug) : slugify(`${v.brand}-${v.name}`));
  const info = db
    .prepare(
      `INSERT INTO cars
        (slug, brand, name, eyebrow, year, category, bodyStyle, drivetrain,
         fuel, status, price, hp, image, gallery, specs)
       VALUES
        (@slug, @brand, @name, @eyebrow, @year, @category, @bodyStyle, @drivetrain,
         @fuel, @status, @price, @hp, @image, @gallery, @specs)`
    )
    .run({ slug, ...v });
  return getCarById(info.lastInsertRowid);
}

export function updateCar(id, data) {
  const db = getDb();
  id = Number(id);
  const existing = db.prepare("SELECT id, slug FROM cars WHERE id = ?").get(id);
  if (!existing) return null;
  const v = normalize(data);
  const slug = data.slug ? uniqueSlug(slugify(data.slug), id) : existing.slug;
  db.prepare(
    `UPDATE cars SET
       slug=@slug, brand=@brand, name=@name, eyebrow=@eyebrow, year=@year,
       category=@category, bodyStyle=@bodyStyle, drivetrain=@drivetrain,
       fuel=@fuel, status=@status, price=@price, hp=@hp, image=@image,
       gallery=@gallery, specs=@specs, updated_at=datetime('now')
     WHERE id=@id`
  ).run({ id, slug, ...v });
  return getCarById(id);
}

export function deleteCar(id) {
  return getDb().prepare("DELETE FROM cars WHERE id = ?").run(Number(id)).changes > 0;
}

export function inventoryStats() {
  const db = getDb();
  const total = db.prepare("SELECT COUNT(*) AS c FROM cars").get().c;
  const inStock = db.prepare("SELECT COUNT(*) AS c FROM cars WHERE status = 'In Stock'").get().c;
  const reserved = db.prepare("SELECT COUNT(*) AS c FROM cars WHERE status = 'Reserved'").get().c;
  const categories = db.prepare("SELECT COUNT(DISTINCT category) AS c FROM cars").get().c;
  const value = db.prepare("SELECT COALESCE(SUM(price),0) AS s FROM cars").get().s;
  return { total, inStock, reserved, categories, value };
}
