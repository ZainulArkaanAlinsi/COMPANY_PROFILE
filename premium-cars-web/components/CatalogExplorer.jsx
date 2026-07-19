"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Seed agar grid merek tampil instan (di-konfirmasi ulang oleh /api/catalog).
const INITIAL_MAKES = [
  "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Ferrari", "Ford",
  "Honda", "Lamborghini", "Land Rover", "Lexus", "Maserati", "McLaren",
  "Mercedes-Benz", "Mitsubishi", "Nissan", "Porsche", "Rolls-Royce",
  "Tesla", "Toyota",
];

/**
 * Jelajahi seluruh database kendaraan (NHTSA vPIC, gratis tanpa key) via
 * /api/catalog. Grid tile per merek (monogram) -> klik menarik ribuan model
 * nyata untuk tahun terpilih; tiap model tautan ke analisis harga pasar.
 */
export default function CatalogExplorer() {
  const thisYear = new Date().getFullYear();
  const [meta, setMeta] = useState({
    makes: INITIAL_MAKES,
    yearMin: 1980,
    yearMax: thisYear,
  });
  const [make, setMake] = useState("");
  const [year, setYear] = useState(String(thisYear));
  const [state, setState] = useState({ status: "idle", models: [], count: 0, error: null });
  const resultsRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d?.makes) return;
        setMeta({ makes: d.makes, yearMin: d.yearMin, yearMax: d.yearMax });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (make && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [make]);

  async function search(mk, yr) {
    setState({ status: "loading", models: [], count: 0, error: null });
    try {
      const q = new URLSearchParams({ make: mk, year: yr });
      const r = await fetch(`/api/catalog?${q}`);
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
      setState({
        status: "done",
        models: body.models || [],
        count: body.count || 0,
        error: null,
      });
    } catch (err) {
      setState({ status: "error", models: [], count: 0, error: err.message });
    }
  }

  function pickMake(mk) {
    setMake(mk);
    search(mk, year);
  }
  function changeYear(yr) {
    setYear(yr);
    if (make) search(make, yr);
  }

  const years = [];
  for (let y = meta.yearMax; y >= meta.yearMin; y--) years.push(y);
  const { status, models, count, error } = state;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 md:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <LiveDot />
        <h3 className="display text-2xl md:text-3xl">Jelajahi Seluruh Database</h3>
        <span className="tech text-meta">Live · NHTSA vPIC · gratis</span>
      </div>
      <p className="mt-2 max-w-xl text-muted">
        Pilih merek untuk menarik ribuan model nyata — semua tahun{" "}
        {meta.yearMin}–{meta.yearMax}. Klik model untuk analisis harga pasarnya.
      </p>

      {/* Grid tile per merek */}
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {meta.makes.map((m) => {
          const active = m === make;
          return (
            <button
              key={m}
              type="button"
              data-spotlight
              onClick={() => pickMake(m)}
              aria-pressed={active}
              className={`group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                active
                  ? "force-dark border-amber bg-ink"
                  : "border-line bg-floor hover:-translate-y-1 hover:border-amber"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -right-1 -top-4 select-none font-display text-[76px] font-bold leading-none transition-all duration-500 group-hover:scale-110 ${
                  active ? "text-amber/25" : "text-surface-2 group-hover:text-amber/20"
                }`}
              >
                {m[0]}
              </span>
              <span
                className={`relative font-display text-sm font-semibold uppercase leading-tight tracking-tech ${
                  active ? "text-floor" : "text-ink"
                }`}
              >
                {m}
              </span>
              <span
                className={`relative mt-1 text-[10px] uppercase tracking-tech ${
                  active ? "text-amber-400" : "text-meta"
                }`}
              >
                {active ? "✓ Terpilih" : "Lihat model"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hasil */}
      <div ref={resultsRef}>
        {!make ? (
          <p className="mt-6 text-sm text-meta">
            Klik salah satu merek di atas untuk mulai menjelajah.
          </p>
        ) : (
          <div className="mt-8 border-t border-line pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h4 className="display text-xl md:text-2xl">{make}</h4>
                <label className="tech text-meta" htmlFor="explorer-year">
                  Tahun
                </label>
                <select
                  id="explorer-year"
                  value={year}
                  onChange={(e) => changeYear(e.target.value)}
                  className="rounded-full border border-line bg-floor px-4 py-2 text-sm text-ink focus:border-amber focus:outline-none"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              {status === "done" && (
                <span className="tech text-meta">
                  {count} model · {make} {year}
                </span>
              )}
            </div>

            <div className="mt-5">
              {status === "loading" && (
                <p className="animate-pulse text-sm text-meta">Memuat model…</p>
              )}
              {status === "error" && (
                <p className="rounded-xl border border-line-soft bg-floor p-4 text-sm text-amber-400">
                  {error}
                </p>
              )}
              {status === "done" && models.length === 0 && (
                <p className="text-sm text-meta">
                  Tidak ada model {make} untuk tahun {year}. Coba tahun lain.
                </p>
              )}
              {status === "done" && models.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {models.map((m) => (
                    <Link
                      key={m}
                      href={`/harga-pasar?make=${encodeURIComponent(
                        make
                      )}&model=${encodeURIComponent(m)}&year=${year}`}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-floor px-4 py-2 text-sm transition-colors hover:border-amber hover:text-amber"
                    >
                      {m}
                      <span className="text-meta transition-transform group-hover:translate-x-0.5 group-hover:text-amber">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber" />
    </span>
  );
}
