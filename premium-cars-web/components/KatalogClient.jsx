"use client";

import { useEffect, useMemo, useState } from "react";
import CarCard from "@/components/CarCard";
import FinanceCalculator from "@/components/FinanceCalculator";
import Reveal from "@/components/Reveal";
import { categories } from "@/lib/cars";

const drivetrains = ["RWD", "AWD", "FWD"];
const bodyStyles = ["Coupe", "Sedan", "SUV"];

function matchCategory(car, cat) {
  switch (cat) {
    case "New Arrivals":
      return car.status === "New Arrival";
    case "Electric":
      return car.fuel === "Electric" || car.category === "Electric";
    case "Track":
      return car.category === "Track";
    case "Limited Edition":
      return car.category === "Hypercar" || car.category === "Limited Edition";
    default:
      return true;
  }
}

export default function KatalogClient({ cars, source = "local" }) {
  const [cat, setCat] = useState("All Inventory");
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [drivetrain, setDrivetrain] = useState(null);
  const [bodies, setBodies] = useState([]);
  const [minHp, setMinHp] = useState(300);
  const [visible, setVisible] = useState(24);
  const [sort, setSort] = useState("relevan");

  const brandList = useMemo(
    () => ["All", ...[...new Set(cars.map((c) => c.brand))].sort()],
    [cars]
  );
  const hasHp = cars.some((c) => c.hp > 0);

  const toggleBody = (b) =>
    setBodies((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (!matchCategory(c, cat)) return false;
      if (brand !== "All" && c.brand !== brand) return false;
      if (query && !`${c.brand} ${c.name}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (drivetrain && c.drivetrain !== drivetrain) return false;
      if (bodies.length && !bodies.includes(c.bodyStyle)) return false;
      if (hasHp && c.hp && c.hp < minHp) return false;
      return true;
    });
  }, [cars, cat, brand, query, drivetrain, bodies, minHp, hasHp]);

  useEffect(() => {
    setVisible(24);
  }, [cat, brand, query, drivetrain, bodies, minHp]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "termurah": arr.sort((a, b) => a.price - b.price); break;
      case "termahal": arr.sort((a, b) => b.price - a.price); break;
      case "terbaru": arr.sort((a, b) => (b.year || 0) - (a.year || 0)); break;
      case "terlama": arr.sort((a, b) => (a.year || 0) - (b.year || 0)); break;
      case "tenaga": arr.sort((a, b) => (b.hp || 0) - (a.hp || 0)); break;
      default: break;
    }
    return arr;
  }, [filtered, sort]);

  return (
    <>
      {/* Header editorial */}
      <header>
        <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
          <p className="tech text-amber">
            <span className="text-meta">N° 01 — </span>Marketplace
          </p>
          <p className="tech text-meta">{cars.length} Unit</p>
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.9] md:text-8xl">Katalog</h1>
        <p className="mt-6 max-w-2xl text-muted md:text-lg">
          Sempurnakan pencarian Anda. Koleksi kurasi kendaraan performa tinggi
          kami merepresentasikan puncak keunggulan otomotif dan seni industri.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 border border-line px-3 py-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              source === "marketcheck" ? "animate-pulse bg-amber" : "bg-muted"
            }`}
          />
          <span className="tech text-meta">
            {source === "marketcheck"
              ? "Live inventory · MarketCheck"
              : "Curated inventory · Local"}
          </span>
        </div>
      </header>

      {/* Search + chips */}
      <div className="mt-12 flex flex-col gap-5 lg:flex-row lg:items-center">
        <label className="relative w-full lg:max-w-xs">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari model…"
            className="w-full rounded-sm border border-line bg-surface py-3 pl-11 pr-4 text-sm placeholder:text-meta focus:border-amber focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-sm px-4 py-2.5 text-[12px] font-semibold uppercase tracking-tech transition-colors ${
                cat === c
                  ? "bg-amber text-floor"
                  : "border border-line text-muted hover:border-amber hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="border border-line bg-surface p-6">
            <h3 className="display mb-6 text-xl">Spec Finder</h3>

            <p className="tech mb-3 text-meta">Brand</p>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mb-6 w-full rounded-sm border border-line bg-floor px-4 py-2.5 text-sm focus:border-amber focus:outline-none"
            >
              {brandList.map((b) => (
                <option key={b} value={b}>{b === "All" ? "Semua Merek" : b}</option>
              ))}
            </select>

            <p className="tech mb-3 text-meta">Drivetrain</p>
            <div className="mb-6 grid grid-cols-3 gap-2">
              {drivetrains.map((d) => (
                <button
                  key={d}
                  onClick={() => setDrivetrain(drivetrain === d ? null : d)}
                  className={`rounded-sm border py-2 text-[12px] font-semibold uppercase tracking-tech ${
                    drivetrain === d
                      ? "border-amber text-amber"
                      : "border-line text-muted hover:text-ink"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {hasHp && (
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <p className="tech text-meta">Horsepower</p>
                  <p className="font-display text-sm">{minHp}+ HP</p>
                </div>
                <input
                  type="range"
                  min={300}
                  max={1600}
                  step={10}
                  value={minHp}
                  onChange={(e) => setMinHp(Number(e.target.value))}
                  className="mt-3 w-full accent-amber"
                />
                <div className="mt-1 flex justify-between text-[10px] text-meta">
                  <span>300</span>
                  <span>1600+</span>
                </div>
              </div>
            )}

            <p className="tech mb-3 text-meta">Body Style</p>
            <div className="space-y-3">
              {bodyStyles.map((b) => (
                <label key={b} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={bodies.includes(b)}
                    onChange={() => toggleBody(b)}
                    className="h-4 w-4 accent-amber"
                  />
                  <span className={bodies.includes(b) ? "text-ink" : "text-muted"}>
                    {b}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <FinanceCalculator price={filtered[0]?.price || 500000000} />
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="tech text-meta">{filtered.length} unit tersedia</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <span className="tech text-meta">Urutkan</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-sm border border-line bg-floor px-3 py-1.5 text-[12px] font-semibold uppercase tracking-tech text-ink focus:border-amber focus:outline-none"
                >
                  <option value="relevan">Relevan</option>
                  <option value="termurah">Harga Termurah</option>
                  <option value="termahal">Harga Termahal</option>
                  <option value="terbaru">Tahun Terbaru</option>
                  <option value="terlama">Tahun Terlama</option>
                  <option value="tenaga">Tenaga (HP)</option>
                </select>
              </label>
              {(brand !== "All" || cat !== "All Inventory" || bodies.length || drivetrain || query) && (
                <button
                  onClick={() => {
                    setCat("All Inventory"); setBrand("All"); setQuery("");
                    setDrivetrain(null); setBodies([]); setMinHp(300);
                  }}
                  className="tech text-amber hover:text-amber-400"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {filtered.length ? (
            <>
              <Reveal stagger key={`${cat}-${brand}-${drivetrain}-${bodies.join()}-${sort}`} className="grid gap-6 sm:grid-cols-2">
                {sorted.slice(0, visible).map((car) => (
                  <CarCard key={car.slug} car={car} />
                ))}
              </Reveal>
              {visible < filtered.length && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setVisible((v) => v + 24)}
                    data-magnetic
                    className="btn-sheen rounded-full border border-line px-8 py-3.5 text-[12.5px] font-semibold uppercase tracking-tech text-ink transition-colors hover:border-amber hover:text-amber"
                  >
                    Muat lebih banyak · {filtered.length - visible} unit tersisa
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="border border-dashed border-line bg-surface p-16 text-center">
              <p className="display text-2xl text-muted">Tidak ada unit cocok</p>
              <p className="mt-2 text-sm text-meta">
                Sesuaikan filter untuk melihat lebih banyak inventaris.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-4 top-1/2 -translate-y-1/2 text-meta"
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
