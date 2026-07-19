"use client";

import { useEffect, useRef, useState } from "react";

const easeOut = (t) => 1 - Math.pow(1 - t, 4);

/**
 * Angka yang "berlari" ke nilainya. Dua mode:
 * - `text`: string seperti "2.400+" / "99%" / "24H" — angka di dalamnya
 *   di-tween saat elemen masuk viewport, sisanya dibiarkan.
 * - `value` (number) + `format`: tween ulang setiap kali nilai berubah
 *   (dipakai panel ekuitas). format menerima fungsi via parent client.
 */
export default function CountUp({
  text,
  value,
  format,
  duration = 1400,
  className = "",
}) {
  const ref = useRef(null);
  const prevRef = useRef(0);
  const [display, setDisplay] = useState(text != null ? "0" : null);
  const [started, setStarted] = useState(false);

  // Mode teks: mulai saat terlihat
  useEffect(() => {
    if (text == null) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text]);

  useEffect(() => {
    if (text == null || !started) return;
    const m = String(text).match(/([\d.,]+)/);
    if (!m) {
      setDisplay(text);
      return;
    }
    const numStr = m[1];
    const target = Number(numStr.replace(/\./g, "").replace(/,/g, "."));
    const decimals = /,\d/.test(numStr) ? 1 : 0;
    const [before, after] = String(text).split(numStr);
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const v = target * easeOut(p);
      const formatted =
        decimals > 0
          ? v.toFixed(decimals).replace(".", ",")
          : new Intl.NumberFormat("id-ID").format(Math.round(v));
      setDisplay(`${before || ""}${formatted}${after || ""}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, started, duration]);

  // Mode nilai numerik: tween saat berubah
  useEffect(() => {
    if (value == null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prevRef.current = value;
      setDisplay(format ? format(value) : String(value));
      return;
    }
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const v = from + (to - from) * easeOut(p);
      setDisplay(format ? format(v) : String(Math.round(v)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, format, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display ?? (format ? format(value ?? 0) : "")}
    </span>
  );
}
