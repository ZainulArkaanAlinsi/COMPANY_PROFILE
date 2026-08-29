"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import { cars, formatIDR, artOf } from "@/lib/cars";

/**
 * Bandingkan dua unit inventaris berdampingan: diagram bar per metrik,
 * pemenang tiap ronde di-highlight, dan ringkasan kelebihan tiap mobil.
 * Deep link: /bandingkan?a=<slug>&b=<slug>
 */

// Kunci spesifikasi ditulis dalam bahasa Indonesia dan memakai en dash
// ("0–100 km/j"), jadi pencocokan harus menyamakan tanda hubung dulu. Tanpa ini
// dua metrik di bawah tidak pernah ketemu dan barisnya selalu tampil "—".
const norm = (s) => String(s).toLowerCase().replace(/[\u2013\u2014]/g, "-");

const num = (car, key) => {
  const spec = car.specs.find((s) => norm(s.k).includes(norm(key)));
  if (!spec) return null;
  const n = Number(String(spec.v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const METRICS = [
  { id: "hp", label: "Tenaga", unit: "HP", better: "high", get: (c) => c.hp },
  { id: "speed", label: "Kecepatan Puncak", unit: "KM/J", better: "high", get: (c) => num(c, "kecepatan puncak") },
  { id: "accel", label: "0–100 KM/J", unit: "DETIK", better: "low", get: (c) => num(c, "0-100") },
  { id: "price", label: "Harga", unit: "", better: "low", get: (c) => c.price,
    format: (v) => formatIDR(v), note: "lebih terjangkau" },
];

const fmt = (m, v) =>
  v == null ? "—" : m.format ? m.format(v) : `${new Intl.NumberFormat("id-ID").format(v)} ${m.unit}`;

export default function CompareClient() {
  const sp = useSearchParams();
  const bySlug = (s) => cars.find((c) => c.slug === s);
  const [aSlug, setA] = useState(bySlug(sp.get("a")) ? sp.get("a") : cars[0].slug);
  const [bSlug, setB] = useState(
    bySlug(sp.get("b")) && sp.get("b") !== (bySlug(sp.get("a")) ? sp.get("a") : cars[0].slug)
      ? sp.get("b")
      : cars[1].slug
  );

  const A = bySlug(aSlug) || cars[0];
  const B = bySlug(bSlug) || cars[1];

  const rows = useMemo(
    () =>
      METRICS.map((m) => {
        const va = m.get(A);
        const vb = m.get(B);
        let winner = null;
        if (va != null && vb != null && va !== vb) {
          winner = (m.better === "high") === va > vb ? "a" : "b";
        }
        // Lebar bar relatif antar pasangan (untuk lower-better dibalik).
        const rel = (v, other) => {
          if (v == null) return 0;
          if (other == null) return 1;
          return m.better === "high"
            ? v / Math.max(v, other)
            : Math.min(v, other) / v;
        };
        return { m, va, vb, winner, wa: rel(va, vb), wb: rel(vb, va) };
      }),
    [A, B]
  );

  const winsA = rows.filter((r) => r.winner === "a");
  const winsB = rows.filter((r) => r.winner === "b");

  return (
    <div>
      {/* Pemilih unit */}
      <div className="grid gap-6 md:grid-cols-[1fr,64px,1fr] md:items-stretch">
        <CarPicker car={A} value={aSlug} exclude={bSlug} onChange={setA} accent />
        <div className="hidden items-center justify-center md:flex">
          <span className="flex h-14 w-14 rotate-45 items-center justify-center border border-amber">
            <span className="display -rotate-45 text-lg text-amber">VS</span>
          </span>
        </div>
        <CarPicker car={B} value={bSlug} exclude={aSlug} onChange={setB} />
      </div>

      {/* Diagram head-to-head */}
      <div className="mt-10 border border-line bg-surface">
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4 border-b border-line px-6 py-4">
          <p className="display truncate text-lg text-amber md:text-xl">{A.name}</p>
          <p className="tech text-meta">Adu Spesifikasi</p>
          <p className="display truncate text-right text-lg md:text-xl">{B.name}</p>
        </div>
        <div className="divide-y divide-line-soft">
          {rows.map(({ m, va, vb, winner, wa, wb }) => (
            <div key={m.id} className="px-6 py-5">
              <div className="mb-2 grid grid-cols-[1fr,auto,1fr] items-baseline gap-4">
                <p
                  className={`font-display text-xl font-bold md:text-2xl ${
                    winner === "a" ? "text-amber" : "text-ink"
                  }`}
                >
                  {fmt(m, va)}
                  {winner === "a" && <Crown />}
                </p>
                <p className="tech text-center text-meta">
                  {m.label}
                  {m.better === "low" && (
                    <span className="block text-[9px] normal-case tracking-normal">
                      (lebih kecil lebih baik)
                    </span>
                  )}
                </p>
                <p
                  className={`text-right font-display text-xl font-bold md:text-2xl ${
                    winner === "b" ? "text-amber" : "text-ink"
                  }`}
                >
                  {winner === "b" && <Crown flip />}
                  {fmt(m, vb)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-end">
                  <div
                    className={`h-2 rounded-sm transition-all duration-700 ${
                      winner === "a" ? "bg-amber" : "bg-line"
                    }`}
                    style={{ width: `${Math.max(wa * 100, 4)}%` }}
                  />
                </div>
                <div>
                  <div
                    className={`h-2 rounded-sm transition-all duration-700 ${
                      winner === "b" ? "bg-amber" : "bg-line"
                    }`}
                    style={{ width: `${Math.max(wb * 100, 4)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ringkasan kelebihan */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {[
          { car: A, wins: winsA, other: B },
          { car: B, wins: winsB, other: A },
        ].map(({ car, wins }) => (
          <div key={car.slug} className="border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold uppercase">
                Kelebihan {car.name}
              </h3>
              <span className="display text-3xl text-amber">{wins.length}</span>
            </div>
            {wins.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {wins.map(({ m, va, vb }) => (
                  <li
                    key={m.id}
                    className="border border-amber/40 bg-amber/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-tech text-amber"
                  >
                    {m.label}
                    {m.note ? ` ${m.note}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Tidak unggul di metrik terukur — namun karakter tidak selalu
                bisa diangkakan.
              </p>
            )}
            <div className="mt-5 flex gap-4">
              <Link
                href={`/katalog/${car.slug}`}
                className="tech text-ink transition-colors hover:text-amber"
              >
                Lihat Unit →
              </Link>
              <Link
                href={`/harga-pasar?make=${encodeURIComponent(car.brand)}&model=${encodeURIComponent(
                  car.name.split(" ")[0]
                )}&year=${car.year}`}
                className="tech text-muted transition-colors hover:text-amber"
              >
                Harga Pasar →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarPicker({ car, value, exclude, onChange, accent = false }) {
  return (
    <div className={`border bg-surface ${accent ? "border-amber/50" : "border-line"}`}>
      <SmartImage
        src={car.image}
        alt={car.name}
        art={artOf(car)}
        className="aspect-[16/9] w-full"
      />
      <div className="p-5">
        <p className="tech mb-2 text-[10px] text-meta">
          {car.brand} · {car.year} · {formatIDR(car.price)}
        </p>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-sm border border-line bg-floor px-4 py-3 font-display text-lg font-semibold uppercase text-ink transition-colors focus:border-amber focus:outline-none"
        >
          {cars
            .filter((c) => c.slug !== exclude)
            .map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.brand} {c.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

function Crown({ flip = false }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block text-amber ${flip ? "mr-1.5" : "ml-1.5"} -translate-y-1`}
    >
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.5 10h-15L3 8z" />
    </svg>
  );
}
