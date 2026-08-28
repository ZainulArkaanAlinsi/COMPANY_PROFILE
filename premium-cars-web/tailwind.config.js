/**
 * Ink & Cognac — design tokens.
 * Palet: ink biru-hitam hangat + aksen tunggal cognac/tan (#B0724A),
 * selaras dengan situs statis root. Sharp corners, hairline outlines, no shadows.
 * Catatan: token warna `amber` di bawah dipertahankan namanya demi
 * kompatibilitas kelas, tapi NILAI-nya kini cognac (lihat app/globals.css).
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semua warna tema dibaca dari CSS variables (globals.css) sehingga
        // dark/light mode cukup mengganti nilai var — kelas Tailwind tetap.
        floor: "rgb(var(--pc-floor) / <alpha-value>)",
        surface: "rgb(var(--pc-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--pc-surface-2) / <alpha-value>)",
        ink: "rgb(var(--pc-ink) / <alpha-value>)",
        muted: "rgb(var(--pc-muted) / <alpha-value>)",
        meta: "rgb(var(--pc-meta) / <alpha-value>)",
        line: "rgb(var(--pc-line) / <alpha-value>)",
        "line-soft": "rgb(var(--pc-line-soft) / <alpha-value>)",
        amber: {
          DEFAULT: "rgb(var(--pc-amber) / <alpha-value>)",
          600: "rgb(var(--pc-amber-600) / <alpha-value>)",
          400: "rgb(var(--pc-amber-400) / <alpha-value>)",
        },
        danger: "#c0392b",
      },
      fontFamily: {
        display: ["var(--font-display)", "Oswald", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        frame: "1440px",
      },
      spacing: {
        section: "120px", // section-gap
        "section-sm": "80px",
        18: "4.5rem",
      },
      borderRadius: {
        // Sharp by default; 2px only for functional interactive elements
        DEFAULT: "0px",
        sm: "2px",
        md: "4px",
      },
      letterSpacing: {
        badge: "0.18em",
        tech: "0.1em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
