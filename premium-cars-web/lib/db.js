// Database SQLite (better-sqlite3) — sumber data marketplace yang bisa
// dikelola dari dashboard admin. Untuk produksi Vercel, swap driver ke
// serverless (Turso/libSQL atau Neon Postgres) — API query nyaris identik.
//
// Koneksi di-cache di globalThis agar hot-reload dev tidak membuka banyak
// handle. Skema dibuat otomatis; tabel `cars` di-seed dari lib/cars.js
// pada run pertama (agar katalog tidak kosong).

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { cars as seedCars } from "./cars";

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      slug        TEXT UNIQUE NOT NULL,
      brand       TEXT NOT NULL,
      name        TEXT NOT NULL,
      eyebrow     TEXT,
      year        INTEGER,
      category    TEXT,
      bodyStyle   TEXT,
      drivetrain  TEXT,
      fuel        TEXT,
      status      TEXT DEFAULT 'In Stock',
      price       INTEGER DEFAULT 0,
      hp          INTEGER,
      image       TEXT,
      gallery     TEXT DEFAULT '[]',
      specs       TEXT DEFAULT '[]',
      created_at  TEXT DEFAULT (datetime('now')),
      updated_at  TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS leads (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT,
      email       TEXT,
      phone       TEXT,
      message     TEXT,
      source      TEXT,
      car_slug    TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );
  `);
}

function seed(db) {
  const { c } = db.prepare("SELECT COUNT(*) AS c FROM cars").get();
  if (c > 0) return;
  const insert = db.prepare(`
    INSERT INTO cars
      (slug, brand, name, eyebrow, year, category, bodyStyle, drivetrain,
       fuel, status, price, hp, image, gallery, specs)
    VALUES
      (@slug, @brand, @name, @eyebrow, @year, @category, @bodyStyle, @drivetrain,
       @fuel, @status, @price, @hp, @image, @gallery, @specs)
  `);
  const tx = db.transaction((list) => {
    for (const car of list) {
      insert.run({
        slug: car.slug,
        brand: car.brand || "",
        name: car.name || "",
        eyebrow: car.eyebrow || "",
        year: car.year ?? null,
        category: car.category || "",
        bodyStyle: car.bodyStyle || "",
        drivetrain: car.drivetrain || "",
        fuel: car.fuel || "",
        status: car.status || "In Stock",
        price: car.price ?? 0,
        hp: car.hp ?? null,
        image: car.image || "",
        gallery: JSON.stringify(car.gallery || []),
        specs: JSON.stringify(car.specs || []),
      });
    }
  });
  tx(seedCars);
}

function open() {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "premium-cars.db"));
  db.pragma("journal_mode = WAL");
  initSchema(db);
  seed(db);
  return db;
}

export function getDb() {
  if (!globalThis.__pcDb) globalThis.__pcDb = open();
  return globalThis.__pcDb;
}
