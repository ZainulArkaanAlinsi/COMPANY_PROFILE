"use client";

import { useState } from "react";

const rupiah = (n) => "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));

const conditions = {
  Pristine: 1.0,
  Excellent: 0.9,
  Good: 0.78,
  Fair: 0.62,
};

/**
 * Instant appraisal estimator. Rough heuristic on entered base value,
 * age, mileage, and condition — produces an indicative range.
 */
export default function AppraisalForm() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: 2022,
    base: 2000000000,
    mileage: 20000,
    condition: "Excellent",
  });
  const [result, setResult] = useState(null);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const age = Math.max(2024 - Number(form.year), 0);
    const depAge = Math.pow(0.9, age); // ~10% per year
    const depKm = Math.max(1 - Number(form.mileage) / 400000, 0.6);
    const cond = conditions[form.condition] || 0.8;
    const mid = Number(form.base) * depAge * depKm * cond;
    setResult({ low: mid * 0.94, high: mid * 1.06 });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={submit} className="border border-line bg-surface p-8">
        <h3 className="display text-2xl">Estimasi Instan</h3>
        <p className="mt-2 text-sm text-muted">
          Masukkan detail kendaraan untuk penawaran indikatif.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Merek">
            <input required value={form.brand} onChange={set("brand")}
              placeholder="Porsche" className={inputCls} />
          </Field>
          <Field label="Model">
            <input required value={form.model} onChange={set("model")}
              placeholder="911 Turbo S" className={inputCls} />
          </Field>
          <Field label="Tahun">
            <input type="number" min={1990} max={2024} value={form.year}
              onChange={set("year")} className={inputCls} />
          </Field>
          <Field label="Harga Beli (Rp)">
            <input type="number" min={0} step={50000000} value={form.base}
              onChange={set("base")} className={inputCls} />
          </Field>
          <Field label="Kilometer">
            <input type="number" min={0} step={1000} value={form.mileage}
              onChange={set("mileage")} className={inputCls} />
          </Field>
          <Field label="Kondisi">
            <select value={form.condition} onChange={set("condition")} className={inputCls}>
              {Object.keys(conditions).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        <button
          type="submit"
          className="mt-7 w-full rounded-sm bg-amber py-3.5 text-[13px] font-semibold uppercase tracking-tech text-floor hover:bg-amber-600"
        >
          Hitung Estimasi
        </button>
      </form>

      <div className="garage-gradient flex flex-col justify-center border border-line p-8">
        {result ? (
          <div className="animate-fade-up">
            <p className="tech text-amber">Estimasi Nilai Pasar</p>
            <p className="mt-3 font-display text-3xl font-bold md:text-4xl">
              {rupiah(result.low)}
            </p>
            <p className="tech my-1 text-meta">— hingga —</p>
            <p className="font-display text-3xl font-bold text-amber md:text-4xl">
              {rupiah(result.high)}
            </p>
            <p className="mt-5 max-w-sm text-xs leading-relaxed text-meta">
              Estimasi indikatif berbasis data pasar. Penawaran final ditentukan
              setelah inspeksi fisik oleh tim appraisal kami.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="display text-3xl text-line">Rp ———</p>
            <p className="mt-3 text-sm text-meta">
              Isi formulir untuk melihat estimasi nilai kendaraan Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-sm border border-line bg-floor px-4 py-3 text-sm focus:border-amber focus:outline-none";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="tech mb-2 block text-[10px] text-meta">{label}</span>
      {children}
    </label>
  );
}
