// Normalisasi gambar mobil (PNG transparan) agar SEMUA tampil "sama besar".
// Langkah: trim area transparan → scale ke inner-box → center di kanvas seragam.
// Sumber & output aman: file asli TIDAK ditimpa (hasil ke image/normalized/).
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "image");
const OUT = join(SRC, "normalized");

// Kanvas seragam 16:10 (samakan dengan .unit-card__media). Transparan.
const CANVAS_W = 1600;
const CANVAS_H = 1000;
const PAD = 0.07; // 7% padding tiap sisi → napas konsisten
const innerW = Math.round(CANVAS_W * (1 - PAD * 2));
const innerH = Math.round(CANVAS_H * (1 - PAD * 2));

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const pngs = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith(".png"));
let done = 0,
  skipped = 0;

for (const file of pngs) {
  try {
    const inPath = join(SRC, file);
    // 1) Trim border transparan (threshold agar sisa semi-transparan ikut).
    const trimmed = await sharp(inPath)
      .ensureAlpha()
      .trim({ threshold: 12 })
      .toBuffer();

    // 2) Scale ke inner-box (boleh membesar → tiap mobil isi frame konsisten).
    const car = await sharp(trimmed)
      .resize(innerW, innerH, {
        fit: "inside",
        withoutEnlargement: false,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();
    const meta = await sharp(car).metadata();

    // 3) Center di kanvas seragam transparan.
    await sharp({
      create: {
        width: CANVAS_W,
        height: CANVAS_H,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: car,
          top: Math.round((CANVAS_H - meta.height) / 2),
          left: Math.round((CANVAS_W - meta.width) / 2),
        },
      ])
      .png({ compressionLevel: 9 })
      .toFile(join(OUT, file));

    done++;
  } catch (e) {
    console.error("SKIP", file, "-", e.message);
    skipped++;
  }
}

console.log(`Selesai: ${done} dinormalisasi, ${skipped} dilewati → image/normalized/`);
