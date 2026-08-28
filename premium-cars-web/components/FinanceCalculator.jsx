"use client";

import { useMemo, useState } from "react";

const rupiah = (n) => "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));

/**
 * Flat-rate installment estimator. Compact variant for the Katalog sidebar,
 * full variant for the Cicilan page.
 */
export default function FinanceCalculator({
  price = 500000000,
  variant = "compact",
  rate = 0.055, // annual flat rate estimate
}) {
  const [dp, setDp] = useState(Math.round(price * 0.2));
  const [tenure, setTenure] = useState(5);

  const monthly = useMemo(() => {
    const principal = Math.max(price - dp, 0);
    const months = tenure * 12;
    const interest = principal * rate * tenure;
    return (principal + interest) / months;
  }, [price, dp, tenure, rate]);

  const full = variant === "full";

  return (
    <div
      className={
        full
          ? "border border-line bg-surface p-8"
          : "border border-line bg-surface p-6"
      }
    >
      <div className="mb-6 flex items-center gap-3">
        <CalcIcon />
        <h3 className="display text-xl">Kalkulator Cicilan</h3>
      </div>

      <div className={full ? "grid gap-6 md:grid-cols-2" : "space-y-6"}>
        <label className="block">
          <span className="tech text-[10px] text-meta">Uang Muka (DP)</span>
          <input
            type="text"
            inputMode="numeric"
            value={rupiah(dp)}
            onChange={(e) => {
              const raw = Number(e.target.value.replace(/[^\d]/g, "")) || 0;
              setDp(Math.min(raw, price));
            }}
            className="mt-2 w-full rounded-sm border border-line bg-floor px-4 py-3 font-display text-lg focus:border-amber focus:outline-none"
          />
          <input
            type="range"
            min={0}
            max={price}
            step={10000000}
            value={dp}
            onChange={(e) => setDp(Number(e.target.value))}
            className="mt-3 w-full accent-amber"
          />
        </label>

        <label className="block">
          <span className="tech text-[10px] text-meta">Tenor</span>
          <select
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="mt-2 w-full rounded-sm border border-line bg-floor px-4 py-3 font-display text-lg focus:border-amber focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((y) => (
              <option key={y} value={y}>
                {y} Tahun
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 border-t border-line-soft pt-5">
        <p className="tech text-[10px] text-meta">Estimasi Angsuran / Bulan</p>
        <p className="mt-1 font-display text-3xl font-bold text-amber">
          {rupiah(monthly)}
        </p>
        <p className="mt-2 text-[11px] text-meta">
          *Estimasi flat {(rate * 100).toFixed(1)}% p.a. Belum termasuk asuransi &
          biaya administrasi.
        </p>
      </div>
    </div>
  );
}

function CalcIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber">
      <rect x="4" y="3" width="16" height="18" />
      <path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2" />
    </svg>
  );
}
