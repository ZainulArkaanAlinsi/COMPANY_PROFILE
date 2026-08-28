"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SmartImage from "@/components/SmartImage";
import CountUp from "@/components/CountUp";
import { cars, formatIDR } from "@/lib/cars";

/**
 * Equity Analyzer — terminal trade-in sesuai desain stitch
 * trade_in_evaluation. Aset saat ini (input pengguna) dibandingkan dengan
 * target dari inventaris; selisih ekuitas + estimasi cicilan dihitung
 * dengan heuristik flat-rate (demo — sambungkan ke mesin valuasi riil).
 */

const conditions = {
  Pristine: 1.0,
  Excellent: 0.92,
  Good: 0.8,
  Fair: 0.65,
};

const RATE = 0.055; // flat p.a. — selaras dengan FinanceCalculator
const MONTHS = 36;

export default function EquityAnalyzer() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("target");
  const [current, setCurrent] = useState({
    model: "2021 Porsche Taycan 4S",
    value: 2450000000,
    mileage: 14200,
    condition: "Excellent",
  });
  const [targetSlug, setTargetSlug] = useState(
    cars.some((c) => c.slug === requested) ? requested : cars[1].slug
  );
  const [marketDate, setMarketDate] = useState("");

  useEffect(() => {
    setMarketDate(
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date())
    );
  }, []);

  const target = cars.find((c) => c.slug === targetSlug) || cars[0];

  const calc = useMemo(() => {
    const condFactor = conditions[current.condition] ?? 0.8;
    const mileFactor = Math.max(1 - current.mileage / 400000, 0.6);
    const offer = current.value * condFactor * mileFactor;
    const recon = current.value * (1 - condFactor) * 0.08;
    const auctionAvg = current.value * 0.97;
    const demand = Math.min(
      9.8,
      Math.max(5, 6 + condFactor * 3.5 - current.mileage / 150000)
    );
    const deficit = target.price - offer;
    const coverage = Math.min((offer / target.price) * 100, 100);
    const principal = Math.max(deficit, 0);
    const monthly = (principal + principal * RATE * (MONTHS / 12)) / MONTHS;
    return { offer, recon, auctionAvg, demand, deficit, coverage, monthly };
  }, [current, target]);

  const set = (k) => (e) => {
    const v =
      k === "value" || k === "mileage"
        ? Number(String(e.target.value).replace(/[^\d]/g, "")) || 0
        : e.target.value;
    setCurrent((c) => ({ ...c, [k]: v }));
  };

  const similar = cars.filter(
    (c) => c.category === target.category && c.slug !== target.slug
  ).length;

  return (
    <div>
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="tech text-amber">Trade-In Terminal V2.4</p>
          <h1 className="display mt-3 text-5xl md:text-7xl">
            Equity <span className="text-muted">Analyzer</span>
          </h1>
        </div>
        <div className="border-l-2 border-amber pl-4 text-right md:text-left">
          <p className="tech text-meta">Market Date</p>
          <p className="font-display text-xl font-semibold uppercase" suppressHydrationWarning>
            {marketDate || "—"}
          </p>
        </div>
      </header>

      {/* Comparison grid */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr,120px,1fr] lg:gap-0">
        {/* Current asset */}
        <div className="space-y-8">
          <div className="border border-line bg-surface p-6 md:p-8">
            <div className="flex items-center justify-between">
              <p className="tech text-amber">Current Asset / Baseline</p>
              <CarIcon />
            </div>
            <SmartImage
              src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
              alt="Kendaraan Anda saat ini"
              label="Your Asset"
              className="mt-5 aspect-[16/9] w-full grayscale"
            />
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <label className="min-w-[220px] flex-1">
                <span className="tech text-[10px] text-meta">Model Anda</span>
                <input
                  value={current.model}
                  onChange={set("model")}
                  className="mt-1 w-full border-b border-line bg-transparent pb-1 font-display text-2xl font-semibold uppercase focus:border-amber focus:outline-none"
                />
              </label>
              <div className="text-right">
                <span className="tech text-[10px] text-meta">Estimasi Nilai</span>
                <input
                  inputMode="numeric"
                  value={formatIDR(current.value)}
                  onChange={set("value")}
                  className="mt-1 w-44 border-b border-line bg-transparent pb-1 text-right font-display text-xl font-semibold text-amber focus:border-amber focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 border-t border-line-soft pt-5">
              <label>
                <span className="tech text-[10px] text-meta">Kilometer</span>
                <input
                  inputMode="numeric"
                  value={new Intl.NumberFormat("id-ID").format(current.mileage)}
                  onChange={set("mileage")}
                  className="mt-1 w-full border-b border-line bg-transparent pb-1 font-display text-lg font-semibold uppercase focus:border-amber focus:outline-none"
                />
              </label>
              <label>
                <span className="tech text-[10px] text-meta">Kondisi</span>
                <select
                  value={current.condition}
                  onChange={set("condition")}
                  className="mt-1 w-full border-b border-line bg-transparent pb-1 font-display text-lg font-semibold uppercase focus:border-amber focus:outline-none [&>option]:bg-surface"
                >
                  {Object.keys(conditions).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Valuation matrix */}
          <div className="border border-line bg-surface p-6 md:p-8">
            <p className="tech text-meta">Valuation Matrix</p>
            <dl className="mt-4 divide-y divide-line-soft">
              <Row k="Market Demand Index" v={`${calc.demand.toFixed(1)} / 10`} />
              <Row k="Auction Realized Avg" v={formatIDR(calc.auctionAvg)} />
              <Row k="Estimated Recon Cost" v={`-${formatIDR(calc.recon)}`} accent />
            </dl>
          </div>
        </div>

        {/* Delta divider */}
        <div className="relative hidden items-center justify-center lg:flex">
          <span className="absolute inset-y-0 left-1/2 w-px bg-line" aria-hidden />
          <div className="relative flex flex-col items-center gap-3 bg-floor py-6">
            <span className="flex h-12 w-12 rotate-45 items-center justify-center border border-amber">
              <SwapIcon />
            </span>
            <span className="tech text-center text-meta">
              Valuation<br />Delta
            </span>
          </div>
        </div>

        {/* Target asset + equity panel */}
        <div className="space-y-8">
          <div className="border border-amber/40 bg-surface p-6 md:p-8">
            <div className="flex items-center justify-between">
              <p className="tech text-amber">Target Asset / Upgrade</p>
              <StarIcon />
            </div>
            <SmartImage
              src={target.image}
              alt={target.name}
              label={target.name}
              className="mt-5 aspect-[16/9] w-full"
            />
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <label className="min-w-[220px] flex-1">
                <span className="tech text-[10px] text-meta">Pilih Unit Inventaris</span>
                <select
                  value={targetSlug}
                  onChange={(e) => setTargetSlug(e.target.value)}
                  className="mt-1 w-full border-b border-line bg-transparent pb-1 font-display text-2xl font-semibold uppercase focus:border-amber focus:outline-none [&>option]:bg-surface [&>option]:text-base"
                >
                  {cars.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.brand} {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="text-right">
                <span className="tech text-[10px] text-meta">Harga Unit</span>
                <p className="mt-1 font-display text-xl font-semibold text-ink">
                  {formatIDR(target.price)}
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 border-t border-line-soft pt-5">
              {target.specs.slice(0, 2).map((s) => (
                <div key={s.k}>
                  <p className="tech text-[10px] text-meta">{s.k}</p>
                  <p className="mt-1 font-display text-lg font-semibold uppercase">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Equity result */}
          <div className="bg-amber p-6 text-floor md:p-8">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-tech">
                {calc.deficit > 0 ? "Equity Deficit" : "Equity Surplus"}
              </p>
              <ReceiptIcon />
            </div>
            <p className="mt-4 font-display text-5xl font-bold md:text-6xl">
              <CountUp value={Math.abs(calc.deficit)} format={formatIDR} duration={900} />
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-floor/80">
              {calc.deficit > 0 ? (
                <>
                  Aset Anda saat ini menutup{" "}
                  <strong>{calc.coverage.toFixed(0)}%</strong> dari total biaya.
                  Sisa selisih dihitung berdasarkan penawaran terjamin hari ini.
                </>
              ) : (
                <>
                  Nilai aset Anda melampaui unit target — surplus dikreditkan
                  langsung ke akuisisi Anda berikutnya.
                </>
              )}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/kontak?intent=trade-in&unit=${encodeURIComponent(
                  `${target.brand} ${target.name}`
                )}&offer=${encodeURIComponent(
                  `${current.model} (${formatIDR(calc.offer)}) → ${target.brand} ${
                    target.name
                  }, selisih ${formatIDR(Math.abs(calc.deficit))}`
                )}`}
                className="rounded-sm bg-ink px-7 py-3 text-[12px] font-semibold uppercase tracking-tech text-floor transition-all hover:-translate-y-px hover:bg-ink/80"
              >
                Accept Offer
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-sm border border-floor/40 px-7 py-3 text-[12px] font-semibold uppercase tracking-tech text-floor transition-colors hover:border-black"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation band */}
      <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
        <div className="bg-surface-2 p-8">
          <p className="tech text-amber">Recommendation Engine</p>
          <h3 className="display mt-3 text-2xl">Precision Financing</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Jembatani selisih {formatIDR(Math.max(calc.deficit, 0))} dengan
            program Equity Leased khusus untuk upgrade bernilai tinggi.
          </p>
          <Link
            href="/cicilan"
            className="tech mt-6 inline-block text-ink transition-colors hover:text-amber"
          >
            Configure Monthly Payment →
          </Link>
        </div>
        <div className="flex flex-col justify-center bg-surface p-8">
          <p className="tech text-meta">Estimated Payment</p>
          <p className="mt-3 font-display text-4xl font-bold md:text-5xl">
            {calc.deficit > 0 ? formatIDR(calc.monthly) : "—"}
            <span className="ml-1 text-base font-semibold text-muted">/BLN</span>
          </p>
          <p className="tech mt-3 text-meta">
            Based on {MONTHS} months @ {(RATE * 100).toFixed(1)}% flat
          </p>
        </div>
        <Link href="/katalog" className="force-dark group relative min-h-[220px] overflow-hidden">
          <SmartImage
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80"
            alt="Akses inventaris"
            label="Inventory"
            className="absolute inset-0 h-full w-full"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,11,0.85)] via-[rgba(15,13,11,0.15)] to-transparent" />
          <span className="absolute bottom-0 left-0 p-8">
            <span className="display block text-2xl">Inventory Access</span>
            <span className="tech mt-2 block text-muted transition-colors group-hover:text-amber">
              View {similar} Similar Configurations →
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

function Row({ k, v, accent = false }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <dt className="text-sm text-muted">{k}</dt>
      <dd
        className={`font-display text-base font-semibold uppercase ${
          accent ? "text-amber" : "text-ink"
        }`}
      >
        {v}
      </dd>
    </div>
  );
}

function CarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-meta">
      <path d="M4 15l1.5-5a2 2 0 0 1 1.9-1.5h9.2A2 2 0 0 1 18.5 10L20 15" />
      <rect x="3" y="15" width="18" height="4" rx="1" />
      <circle cx="7.5" cy="19" r="1.4" /><circle cx="16.5" cy="19" r="1.4" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4L12 7.5z" />
    </svg>
  );
}
function SwapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="-rotate-45 text-amber">
      <path d="M7 9h10l-3-3M17 15H7l3 3" />
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="5" width="16" height="11" rx="1" />
      <path d="M8 19h8M12 16v3" />
    </svg>
  );
}
