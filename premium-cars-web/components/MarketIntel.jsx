"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CountUp from "@/components/CountUp";
import TrendChart from "@/components/TrendChart";
import { formatIDR } from "@/lib/cars";

const usd = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const REFRESH_MS = 60_000;

const selectCls =
  "w-full rounded-sm border border-line bg-floor px-4 py-3 text-sm text-ink transition-colors focus:border-amber focus:outline-none disabled:opacity-50";

/**
 * Market Intelligence terminal — katalog vPIC (semua merek, tahun lama→baru),
 * harga internasional live, grafik naik/turun 12 bulan (Tabela FIPE), dan
 * estimasi nasional. Auto-refresh tiap 60 detik selama tab terlihat.
 * Mendukung prefill via URL: /harga-pasar?make=Porsche&model=911&year=2020
 */
export default function MarketIntel() {
  const sp = useSearchParams();
  const [meta, setMeta] = useState({ makes: [], yearMin: 1980, yearMax: 2026 });
  const [make, setMake] = useState(sp.get("make") || "Porsche");
  const [year, setYear] = useState(Number(sp.get("year")) || 2020);
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("");
  const [modelsState, setModelsState] = useState("idle");
  const [report, setReport] = useState(null);
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const lastQuery = useRef(null);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => d.makes && setMeta(d))
      .catch(() => {});
  }, []);

  const doAnalyze = useCallback(async (q, silent = false) => {
    if (!q?.model) return;
    if (!silent) {
      setState("loading");
      setError("");
    }
    try {
      const r = await fetch(
        `/api/market?make=${encodeURIComponent(q.make)}&model=${encodeURIComponent(
          q.model
        )}&year=${q.year}`,
        { cache: "no-store" }
      );
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "Gagal menganalisis.");
      lastQuery.current = q;
      setReport(d);
      setUpdatedAt(new Date());
      setState("done");
    } catch (err) {
      if (!silent) {
        setError(err.message);
        setState("error");
      }
    }
  }, []);

  // Prefill dari URL → langsung analisis.
  useEffect(() => {
    const m = sp.get("model");
    if (m) {
      doAnalyze({
        make: sp.get("make") || "Porsche",
        model: m,
        year: Number(sp.get("year")) || 2020,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ambil daftar model setiap merek/tahun berubah.
  useEffect(() => {
    let stop = false;
    setModelsState("loading");
    setModels([]);
    fetch(`/api/catalog?make=${encodeURIComponent(make)}&year=${year}`)
      .then((r) => r.json())
      .then((d) => {
        if (stop) return;
        if (d.models) {
          setModels(d.models);
          setModel((prev) =>
            d.models.includes(prev) ? prev : d.models[0] || ""
          );
          setModelsState("done");
        } else {
          setModelsState("error");
        }
      })
      .catch(() => !stop && setModelsState("error"));
    return () => {
      stop = true;
    };
  }, [make, year]);

  // Real-time: refresh senyap tiap 60 dtk selama tab terlihat.
  useEffect(() => {
    if (state !== "done") return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && lastQuery.current) {
        doAnalyze(lastQuery.current, true);
      }
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [state, doAnalyze]);

  const years = [];
  for (let y = meta.yearMax; y >= meta.yearMin; y--) years.push(y);

  return (
    <div>
      {/* Terminal input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doAnalyze({ make, model, year });
        }}
        className="grid gap-5 border border-line bg-surface p-6 md:grid-cols-[1fr,1fr,140px,auto] md:items-end md:p-8"
      >
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">Merek</span>
          <select value={make} onChange={(e) => setMake(e.target.value)} className={selectCls}>
            {(meta.makes.length ? meta.makes : [make]).map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">
            Model{" "}
            {modelsState === "loading"
              ? "· memuat katalog…"
              : models.length
                ? `· ${models.length} model`
                : ""}
          </span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={modelsState !== "done" || !models.length}
            className={selectCls}
          >
            {models.length ? (
              models.map((m) => <option key={m}>{m}</option>)
            ) : (
              <option>
                {modelsState === "error" ? "Katalog tidak terjangkau" : "Memuat…"}
              </option>
            )}
          </select>
        </label>
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">Tahun</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={selectCls}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={state === "loading" || !model}
          className="btn-sheen rounded-sm bg-amber px-8 py-3 text-[13px] font-semibold uppercase tracking-tech text-floor transition-all hover:-translate-y-px hover:bg-amber-600 disabled:opacity-50"
        >
          {state === "loading" ? "Menganalisis…" : "Analisis Pasar"}
        </button>
      </form>

      {state === "error" && (
        <p className="mt-4 border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
          {error}
        </p>
      )}

      {/* Report */}
      {report && state === "done" && (
        <div className="animate-fade-up mt-8 space-y-6">
          {/* Mode + query + updated */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="display text-2xl md:text-3xl">
              {report.query.make} {report.query.model}{" "}
              <span className="text-muted">· {report.query.year}</span>
            </h2>
            <div className="flex items-center gap-5">
              {updatedAt && (
                <p className="tech text-meta" suppressHydrationWarning>
                  Diperbarui{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(updatedAt)}{" "}
                  · auto 60s
                </p>
              )}
              <p className="tech flex items-center gap-2 text-meta">
                <span
                  className={`h-2 w-2 rounded-full ${
                    report.mode === "live" ? "animate-pulse bg-amber" : "bg-muted"
                  }`}
                />
                {report.mode === "live"
                  ? `Live · ${
                      { fipe: "Tabela FIPE", "auto.dev": "Auto.dev", marketcheck: "MarketCheck" }[
                        report.listing.source
                      ] || report.listing.source
                    }`
                  : "Mode Demo · data kurasi"}
              </p>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            <Tile label={`Pasar Acuan (${report.listing.market})`}>
              {report.listing.count != null ? (
                <>
                  <CountUp
                    text={new Intl.NumberFormat("id-ID").format(report.listing.count)}
                  />{" "}
                  <span className="text-base text-muted">listing aktif</span>
                </>
              ) : report.listing.variants ? (
                <>
                  <CountUp text={String(report.listing.variants)} />{" "}
                  <span className="text-base text-muted">varian harga</span>
                </>
              ) : (
                "—"
              )}
            </Tile>
            <Tile label="Median Internasional (USD)">
              {usd(report.listing.usd.median)}
            </Tile>
            <Tile label={`Kurs USD→IDR (${report.fx.source})`}>
              <CountUp
                text={new Intl.NumberFormat("id-ID").format(Math.round(report.fx.rate))}
              />
            </Tile>
            <Tile label="Katalog vPIC">
              {report.catalog ? (
                <>
                  <CountUp text={String(report.catalog.modelsInYear)} />{" "}
                  <span className="text-base text-muted">
                    model · {report.query.year}
                  </span>
                </>
              ) : (
                "—"
              )}
            </Tile>
          </div>

          {/* Grafik pergerakan harga */}
          {report.trend && (
            <div className="border border-line bg-surface p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="tech text-meta">
                    Kurva Harga per Tahun Produksi · Tabela FIPE
                  </p>
                  <p className="mt-1 text-xs text-meta">
                    Varian acuan: {report.trend.variant} — harga pasar hari
                    ini untuk tiap tahun model, dikonversi ke IDR
                  </p>
                </div>
                <span
                  className={`flex items-center gap-2 border px-4 py-2 font-display text-lg font-bold ${
                    report.trend.direction === "up"
                      ? "border-amber/50 text-amber"
                      : "border-line text-muted"
                  }`}
                  title="Selisih harga tahun termuda vs tertua pada kurva"
                >
                  {report.trend.direction === "up" ? "▲" : "▼"}{" "}
                  {Math.abs(report.trend.pct).toFixed(0)}%
                </span>
              </div>
              <TrendChart
                data={report.trend.points.map((p) => ({ label: p.label, value: p.idr }))}
                format={formatIDR}
              />
            </div>
          )}

          {/* National estimate — panel amber */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
            <div className="bg-amber p-8 text-floor">
              <p className="text-[11px] font-semibold uppercase tracking-tech">
                Estimasi Harga Pasar Nasional
              </p>
              <p className="mt-3 font-display text-4xl font-bold md:text-5xl">
                <CountUp
                  value={report.national.estimateIdr}
                  format={formatIDR}
                  duration={1000}
                />
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-floor/80">
                {report.national.note} Faktor: ×{report.national.factor}.
              </p>
              <Link
                href={`/kontak?intent=sourcing&unit=${encodeURIComponent(
                  `${report.query.make} ${report.query.model} ${report.query.year}`
                )}`}
                className="mt-6 inline-block rounded-sm bg-ink px-7 py-3 text-[12px] font-semibold uppercase tracking-tech text-floor transition-all hover:-translate-y-px hover:bg-ink/80"
              >
                Minta Sourcing Unit Ini
              </Link>
            </div>

            {/* Rentang internasional */}
            <div className="border border-line bg-surface p-8">
              <p className="tech text-meta">Rentang Harga Internasional (IDR)</p>
              <dl className="mt-4 divide-y divide-line-soft">
                <Row k="Terendah" v={formatIDR(report.listing.idr.min)} />
                <Row k="Median" v={formatIDR(report.listing.idr.median)} accent />
                <Row k="Tertinggi" v={formatIDR(report.listing.idr.max)} />
              </dl>
              {report.availability && (
                <p className="tech mt-5 text-meta">
                  Terdaftar di katalog {report.availability.from}–
                  {report.availability.to}
                </p>
              )}
            </div>
          </div>

          {/* Specs */}
          {report.specs && (
            <div className="border border-line bg-surface p-8">
              <p className="tech text-meta">Spesifikasi (API Ninjas)</p>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  ["Kelas", report.specs.class],
                  ["Silinder", report.specs.cylinders],
                  ["Transmisi", report.specs.transmission],
                  ["Penggerak", report.specs.drive],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <p className="tech text-[10px] text-meta">{k}</p>
                      <p className="mt-1 font-display text-lg font-semibold uppercase">
                        {String(v)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Tile({ label, children }) {
  return (
    <div className="bg-surface p-6">
      <p className="tech text-[10px] text-meta">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold md:text-3xl">{children}</p>
    </div>
  );
}

function Row({ k, v, accent = false }) {
  return (
    <div className="flex items-center justify-between py-3">
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
