"use client";

import { useState } from "react";
import { carArtSvg } from "@/lib/car-art";

/**
 * Foto unit di atas latar "garage". Kalau fotonya gagal dimuat — atau memang
 * tidak ada, yang berlaku untuk 95% katalog — yang tampil adalah ilustrasi
 * studio dari `art`, bukan ikon gambar rusak dan bukan kotak kosong.
 *
 * `art` opsional: berikan { bodyStyle, seed, brand, model, year } untuk sel
 * yang memang berisi mobil. Tanpa itu komponen kembali ke perilaku lama
 * (gradien + label), yang masih dipakai gambar non-mobil seperti foto suasana.
 */
export default function SmartImage({ src, alt, label, art, className = "" }) {
  const [ok, setOk] = useState(true);
  // src kosong harus ditolak DI MUKA. Browser tidak memicu onError untuk
  // src="" — ia meminta ulang URL halaman, yang berbalas 404 dan menyisakan
  // ikon gambar rusak, bukan fallback ini.
  const show = ok && Boolean(src);

  const pakaiArt = !show && art;

  return (
    <div
      className={`relative overflow-hidden ${
        pakaiArt ? "bg-[#0B0A09]" : "garage-gradient"
      } ${className}`}
    >
      {pakaiArt && (
        <div
          className="absolute inset-0 h-full w-full [&>svg]:h-full [&>svg]:w-full"
          // Isinya dihasilkan carArtSvg() dari data kita sendiri, dan nilai
          // teks di dalamnya sudah di-escape di sana.
          dangerouslySetInnerHTML={{ __html: carArtSvg(art) }}
        />
      )}

      {pakaiArt && (
        <span className="pointer-events-none absolute bottom-2 right-3 text-[8.5px] uppercase tracking-[0.18em] text-ink/25">
          Ilustrasi
        </span>
      )}

      {show && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {!show && !art && label && (
        <span className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <span className="display text-2xl text-meta md:text-3xl">{label}</span>
        </span>
      )}
    </div>
  );
}
