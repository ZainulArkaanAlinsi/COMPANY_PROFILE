"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal wrapper. Elemen masuk viewport → fade-up halus (GPU-only:
 * opacity + transform). `stagger` menganimasikan anak-anak langsung satu
 * per satu. Menghormati prefers-reduced-motion.
 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  y = 24,
  stagger = false,
  className = "",
  children,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }
    // Elemen yang sudah terlewat viewport saat mount (mis. pengguna
    // scroll cepat sebelum hydration) langsung ditampilkan.
    if (el.getBoundingClientRect().bottom < 0) {
      el.classList.add("revealed");
      return;
    }
    // threshold HARUS 0. Ambang berbasis rasio dihitung terhadap tinggi
    // elemen, jadi wadah yang lebih tinggi dari viewport tidak akan pernah
    // memenuhinya: grid katalog setinggi 9.044px butuh 1.085px terlihat untuk
    // ambang 0,12, padahal di layar normal bagian yang terlihat tidak pernah
    // sebanyak itu — seluruh grid tetap opacity 0 dan katalog tampak kosong.
    // Dengan threshold 0, pemicunya adalah tepi elemen menyentuh root, apa pun
    // tingginya; rootMargin negatif yang menahan animasi sampai elemen benar-
    // benar masuk layar.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -64px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`will-reveal ${stagger ? "reveal-stagger" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, "--reveal-y": `${y}px` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
