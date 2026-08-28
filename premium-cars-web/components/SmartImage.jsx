"use client";

import { useState } from "react";

/**
 * Image on top of a dark "garage" gradient. If the remote photo fails,
 * the img hides and the gradient + label remain — never a broken icon.
 */
export default function SmartImage({ src, alt, label, className = "" }) {
  const [ok, setOk] = useState(true);
  // src kosong harus ditolak DI MUKA. Browser tidak memicu onError untuk
  // src="" — ia meminta ulang URL halaman, yang berbalas 404 dan menyisakan
  // ikon gambar rusak, bukan fallback ini.
  const show = ok && Boolean(src);
  return (
    <div
      className={`garage-gradient relative overflow-hidden ${className}`}
    >
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
      {!show && label && (
        <span className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <span className="display text-2xl text-line md:text-3xl">{label}</span>
        </span>
      )}
    </div>
  );
}
