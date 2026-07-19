"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Jelajahi seluruh database kendaraan lewat NHTSA vPIC (gratis, tanpa key)
 * via /api/catalog. Pilih merek + tahun -> daftar model nyata; tiap model
 * tautan ke analisis harga pasar (/harga-pasar). Ini "sisi database besar"
 * dari katalog hybrid: showroom kurasi + ribuan model semua merek & tahun.
 */
export default function CatalogExplorer() {
  const thisYear = new Date().getFullYear();
  const [meta, setMeta] = useState({ makes: [], yearMin: 1980, yearMax: thisYear });
  const [make, setMake] = useState("Porsche");
  const [year, setYear] = useState(String(thisYear));
  const [state, setState] = useState({ status: "idle", models: [], count: 0, error: null });

  // Muat daftar merek + rentang tahun yang didukung.
  useEffect(() => {
    let alive = true;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d?.makes) return;
        setMeta({ makes: d.makes, yearMin: d.yearMin, yearMax: d.yearMax });
        if (d.makes.length && !d.makes.includes("Porsche")) setMake(d.makes[0]);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function run(e) {
    e?.preventDefault();
    if (!make) return;
    setState({ status: "loading", models: [], count: 0, error: null });
    try {
      const q = new URLSearchParams({ make, year });
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

  const years = [];
  for (let y = meta.yearMax; y >= meta.yearMin; y--) years.push(y);

  const { status, models, count, error } = state;
  const control =
    "flex-1 rounded-full border border-line bg-floor px-5 py-3 text-sm text-ink focus:border-amber focus:outline-none";

  return (
    <div
      data-spotlight
      className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 md:p-10"
    >
      <div className="flex flex-wrap items-center gap-3">
        <LiveDot />
        <h3 className="display text-2xl md:text-3xl">Jelajahi Seluruh Database</h3>
        <span className="tech text-meta">Live · NHTSA vPIC · gratis</span>
      </div>
      <p className="mt-2 max-w-xl text-muted">
        Ribuan model nyata — semua merek &amp; tahun {meta.yearMin}–{meta.yearMax}.
        Pilih merek &amp; tahun, lalu klik model untuk analisis harga pasarnya.
      </p>

      <form onSubmit={run} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <select
          aria-label="Merek"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className={control}
        >
          {meta.makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          aria-label="Tahun"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={control}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button
          data-magnetic
          type="submit"
          disabled={status === "loading"}
          className="btn-sheen rounded-full bg-ink px-7 py-3 text-[13px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber disabled:opacity-60"
        >
          {status === "loading" ? "Memuat…" : "Cari Model"}
        </button>
      </form>

      {status === "idle" && (
        <p className="mt-6 text-sm text-meta">
          Contoh: Porsche {meta.yearMax} → 911, 718 Cayman, Panamera, Taycan, Cayenne…
        </p>
      )}

      {status === "error" && (
        <p className="mt-5 rounded-xl border border-line-soft bg-floor p-4 text-sm text-amber-400">
          {error}
        </p>
      )}

      {status === "done" && (
        <div className="mt-6">
          <p className="tech text-meta">
            {count} model · {make} {year}
          </p>
          {models.length === 0 ? (
            <p className="mt-3 text-sm text-meta">
              Tidak ada model untuk kombinasi itu. Coba tahun lain.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
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
      )}
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
