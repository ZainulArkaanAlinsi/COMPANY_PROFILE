"use client";

import { useEffect, useState } from "react";

/**
 * Saklar dark/light. Preferensi disimpan di localStorage ("pc-theme");
 * skrip anti-FOUC di layout membaca nilai yang sama sebelum paint pertama.
 */
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem("pc-theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className={`relative flex h-8 w-14 items-center rounded-full border border-line bg-surface transition-colors hover:border-amber ${className}`}
    >
      <span
        className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-amber text-floor transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          theme === "dark" ? "translate-x-1" : "translate-x-7"
        }`}
      >
        {theme === "dark" ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 13A8 8 0 1 1 11 4a6.5 6.5 0 0 0 9 9z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
