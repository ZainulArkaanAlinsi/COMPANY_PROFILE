"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/CarCard";
import FinanceCalculator from "@/components/FinanceCalculator";
import Reveal from "@/components/Reveal";
import { categories } from "@/lib/cars";

// Sumber inventaris bisa lokal (bahasa Indonesia) atau MarketCheck (Inggris),
// jadi pencocokan listrik harus mengenali keduanya — kalau tidak, filter
// Electric mengembalikan nol saat data lokal yang dipakai.
const isElectric = (c) =>
  /listrik|electric/i.test(c.fuel || "") || /listrik|electric/i.test(c.category || "");

function matchCategory(car, cat) {
  switch (cat) {
    case "New Arrivals":
      return car.status === "New Arrival";
    case "Electric":
      return isElectric(car);
    case "Track":
      return car.category === "Track" || car.category === "Rally";
    case "Limited Edition":
      return car.category === "Hypercar" || car.category === "Limited Edition";
    default:
      // Nilai apa pun di luar tab bawaan (mis. ?kategori=Hypercar dari kartu
      // koleksi beranda) dicocokkan langsung ke kategori unit. Tanpa ini
      // filternya diam-diam lolos dan menampilkan seluruh katalog.
      return cat === "All Inventory" || car.category === cat;
  }
}

// Opsi filter selalu diturunkan dari data yang benar-benar ada, bukan daftar
// tetap. Katalog bertambah → filternya ikut, tanpa menyunting berkas ini.
const optionsOf = (cars, key) =>
  [...new Set(cars.map((c) => c[key]).filter(Boolean))].sort();

const ERA_ORDER = ["70-an", "80-an", "90-an", "2000-an", "2010-an", "2020-an"];

export default function KatalogClient({ cars, source = "local" }) {
  const params = useSearchParams();

  const [cat, setCat] = useState("All Inventory");
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [origin, setOrigin] = useState("All");
  const [drivetrain, setDrivetrain] = useState(null);
  const [bodies, setBodies] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [eras, setEras] = useState([]);
  const [minHp, setMinHp] = useState(0);
  const [visible, setVisible] = useState(24);
  const [sort, setSort] = useState("relevan");

  // Tautan koleksi di beranda membawa filter lewat query string.
  useEffect(() => {
    if (!params) return;
    const q = (k) => params.get(k);
    if (q("kategori")) setCat(q("kategori"));
    if (q("merek")) setBrand(q("merek"));
    if (q("asal")) setOrigin(q("asal"));
    if (q("era")) setEras([q("era")]);
    if (q("bahanBakar")) setFuels([q("bahanBakar")]);
    if (q("cari")) setQuery(q("cari"));
  }, [params]);

  const brandList = useMemo(() => ["All", ...optionsOf(cars, "brand")], [cars]);
  const originList = useMemo(() => ["All", ...optionsOf(cars, "origin")], [cars]);
  const bodyList = useMemo(() => optionsOf(cars, "bodyStyle"), [cars]);
  const fuelList = useMemo(() => optionsOf(cars, "fuel"), [cars]);
  const driveList = useMemo(() => optionsOf(cars, "drivetrain"), [cars]);
  const eraList = useMemo(() => {
    const present = new Set(cars.map((c) => c.era));
    return ERA_ORDER.filter((e) => present.has(e));
  }, [cars]);

  const hasHp = cars.some((c) => c.hp > 0);
  // Batas atas slider mengikuti mobil terkuat yang benar-benar ada, dibulatkan
  // ke atas per 100 HP. Nilai awal 0 supaya tidak ada unit yang tersembunyi
  // saat halaman pertama dibuka.
  const maxHp = useMemo(
    () => Math.ceil(Math.max(100, ...cars.map((c) => c.hp || 0)) / 100) * 100,
    [cars]
  );

  const toggle = (setter) => (v) =>
    setter((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars.filter((c) => {
      if (!matchCategory(c, cat)) return false;
      if (brand !== "All" && c.brand !== brand) return false;
      if (origin !== "All" && c.origin !== origin) return false;
      if (
        q &&
        !`${c.brand} ${c.name} ${c.engine || ""} ${c.origin || ""}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (drivetrain && c.drivetrain !== drivetrain) return false;
      if (bodies.length && !bodies.includes(c.bodyStyle)) return false;
      if (fuels.length && !fuels.includes(c.fuel)) return false;
      if (eras.length && !eras.includes(c.era)) return false;
      if (hasHp && minHp > 0 && c.hp && c.hp < minHp) return false;
      return true;
    });
  }, [cars, cat, brand, origin, query, drivetrain, bodies, fuels, eras, minHp, hasHp]);

  useEffect(() => {
    setVisible(24);
  }, [cat, brand, origin, query, drivetrain, bodies, fuels, eras, minHp]);

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

  const dirty =
    brand !== "All" || origin !== "All" || cat !== "All Inventory" ||
    bodies.length || fuels.length || eras.length || drivetrain || query || minHp > 0;

  const reset = () => {
    setCat("All Inventory"); setBrand("All"); setOrigin("All"); setQuery("");
    setDrivetrain(null); setBodies([]); setFuels([]); setEras([]); setMinHp(0);
  };

  return (
    <>
      <header>
        <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
          <p className="tech text-amber">
            <span className="text-meta">N° 01 — </span>Marketplace
          </p>
          <p className="tech text-meta">{cars.length} Unit</p>
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.9] md:text-8xl">Katalog</h1>
        <p className="mt-6 max-w-2xl text-muted md:text-lg">
          {cars.length} model nyata dari {optionsOf(cars, "origin").length} negara,
          rentang {Math.min(...cars.map((c) => c.year || 9999))} hingga hari ini —
          bensin, diesel, hybrid, dan listrik. Saring menurut era, asal, bodi,
          atau tenaga.
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

      <div className="mt-12 flex flex-col gap-5 lg:flex-row lg:items-center">
        <label className="relative w-full lg:max-w-xs">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari model, mesin, negara…"
            className="w-full rounded-sm border border-line bg-surface py-3 pl-11 pr-4 text-sm placeholder:text-meta focus:border-amber focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-sm px-4 py-2.5 text-[12px] font-semibold uppercase tracking-tech transition-colors ${
                cat === c.id
                  ? "bg-amber text-floor"
                  : "border border-line text-muted hover:border-amber hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-8">
          <div className="border border-line bg-surface p-6">
            <h3 className="display mb-6 text-xl">Penyaring Spesifikasi</h3>

            <Field label="Merek">
              <Select value={brand} onChange={setBrand} options={brandList} allLabel="Semua Merek" />
            </Field>

            <Field label="Negara Asal">
              <Select value={origin} onChange={setOrigin} options={originList} allLabel="Semua Negara" />
            </Field>

            {eraList.length > 1 && (
              <Field label="Era">
                <div className="flex flex-wrap gap-2">
                  {eraList.map((e) => (
                    <Chip key={e} on={eras.includes(e)} onClick={() => toggle(setEras)(e)}>
                      {e}
                    </Chip>
                  ))}
                </div>
              </Field>
            )}

            {fuelList.length > 1 && (
              <Field label="Bahan Bakar">
                <div className="flex flex-wrap gap-2">
                  {fuelList.map((f) => (
                    <Chip key={f} on={fuels.includes(f)} onClick={() => toggle(setFuels)(f)}>
                      {f}
                    </Chip>
                  ))}
                </div>
              </Field>
            )}

            {driveList.length > 1 && (
              <Field label="Penggerak">
                <div className="grid grid-cols-3 gap-2">
                  {driveList.map((d) => (
                    <Chip
                      key={d}
                      on={drivetrain === d}
                      onClick={() => setDrivetrain(drivetrain === d ? null : d)}
                    >
                      {d}
                    </Chip>
                  ))}
                </div>
              </Field>
            )}

            {hasHp && (
              <Field label={null}>
                <div className="flex items-center justify-between">
                  <p className="tech text-meta">Tenaga Minimum</p>
                  <p className="font-display text-sm">
                    {minHp ? `${minHp}+ HP` : "Semua"}
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxHp}
                  step={10}
                  value={minHp}
                  onChange={(e) => setMinHp(Number(e.target.value))}
                  className="mt-3 w-full accent-amber"
                />
                <div className="mt-1 flex justify-between text-[10px] text-meta">
                  <span>Semua</span>
                  <span>{maxHp}</span>
                </div>
              </Field>
            )}

            {bodyList.length > 1 && (
              <Field label="Bentuk Bodi" last>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {bodyList.map((b) => (
                    <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={bodies.includes(b)}
                        onChange={() => toggle(setBodies)(b)}
                        className="h-4 w-4 shrink-0 accent-amber"
                      />
                      <span className={bodies.includes(b) ? "text-ink" : "text-muted"}>{b}</span>
                    </label>
                  ))}
                </div>
              </Field>
            )}
          </div>

          <FinanceCalculator price={filtered[0]?.price || 500000000} />
        </aside>

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
              {dirty && (
                <button onClick={reset} className="tech text-amber hover:text-amber-400">
                  Reset
                </button>
              )}
            </div>
          </div>

          {filtered.length ? (
            <>
              <Reveal
                stagger
                key={`${cat}-${brand}-${origin}-${drivetrain}-${bodies.join()}-${fuels.join()}-${eras.join()}-${sort}`}
                className="grid gap-6 sm:grid-cols-2"
              >
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
              {dirty && (
                <button
                  onClick={reset}
                  className="tech mt-5 text-amber hover:text-amber-400"
                >
                  Hapus semua filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, children, last }) {
  return (
    <div className={last ? "" : "mb-6"}>
      {label && <p className="tech mb-3 text-meta">{label}</p>}
      {children}
    </div>
  );
}

function Select({ value, onChange, options, allLabel }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-sm border border-line bg-floor px-4 py-2.5 text-sm focus:border-amber focus:outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "All" ? allLabel : o}
        </option>
      ))}
    </select>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm border px-3 py-2 text-[11.5px] font-semibold uppercase tracking-tech transition-colors ${
        on ? "border-amber text-amber" : "border-line text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
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
