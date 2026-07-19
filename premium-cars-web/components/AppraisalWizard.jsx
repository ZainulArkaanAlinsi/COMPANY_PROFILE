"use client";

import { useState } from "react";
import Link from "next/link";
import { submitLead } from "@/lib/leads-client";

/**
 * Vehicle Appraisal — formulir 3 fase (Identity / Visuals / Engine) sesuai
 * desain stitch vehicle_appraisal. Submit dikirim ke /api/leads (tipe
 * "appraisal") dan nomor referensi datang dari server.
 */

const photoSlots = [
  { id: "front", label: "Front 3/4" },
  { id: "cockpit", label: "Cockpit" },
  { id: "odometer", label: "Odometer" },
  { id: "engine", label: "Engine Bay" },
];

const tireOptions = [
  "90% - 100% (Near New)",
  "70% - 89% (Good)",
  "50% - 69% (Worn)",
  "< 50% (Replace Soon)",
];

const steps = [
  { n: 1, label: "Identity", href: "#identity" },
  { n: 2, label: "Visuals", href: "#visuals" },
  { n: 3, label: "Engine", href: "#engine" },
];

export default function AppraisalWizard() {
  const [photos, setPhotos] = useState({});
  const [form, setForm] = useState({
    vin: "",
    make: "",
    model: "",
    odometer: "",
    mods: "",
    serviceDate: "",
    tire: tireOptions[0],
  });
  const [state, setState] = useState({ status: "idle" });
  const ref = state.status === "done" ? state.id : null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const attach = (id) => (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotos((p) => ({ ...p, [id]: file.name }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "loading" });
    const res = await submitLead("appraisal", {
      ...form,
      photos: Object.values(photos).join(", ") || "belum dilampirkan",
    });
    setState(
      res.ok
        ? { status: "done", id: res.id }
        : { status: "error", error: res.error }
    );
  };

  if (ref) {
    return (
      <div className="border border-line bg-surface p-10 text-center md:p-16">
        <p className="tech text-amber">Submission Received</p>
        <h2 className="display mt-4 text-4xl md:text-5xl">Dalam Antrean Review</h2>
        <p className="mx-auto mt-5 max-w-md text-muted">
          Dokumen Anda telah dienkripsi dan diteruskan ke master technician
          kami. Estimasi awal dikirim dalam <span className="text-ink">24 jam</span>.
        </p>
        <div className="mx-auto mt-8 inline-block border border-line bg-floor px-8 py-4">
          <p className="tech text-meta">Nomor Referensi</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-wide text-amber">
            {ref}
          </p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/jual/trade-in"
            className="rounded-sm bg-amber px-8 py-3 text-[13px] font-semibold uppercase tracking-tech text-floor hover:bg-amber-600"
          >
            Lanjut ke Equity Analyzer
          </Link>
          <Link
            href="/katalog"
            className="rounded-sm border border-line px-8 py-3 text-[13px] font-semibold uppercase tracking-tech text-ink hover:border-amber hover:text-amber"
          >
            Jelajahi Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stepper */}
      <div className="mb-8 flex items-center gap-3 md:gap-5">
        {steps.map((s, i) => (
          <div key={s.n} className="flex flex-1 items-center gap-3 md:gap-5">
            <a href={s.href} className="group flex shrink-0 items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-semibold ${
                  i === 0
                    ? "border-amber text-amber"
                    : "border-line text-muted group-hover:border-amber group-hover:text-amber"
                }`}
              >
                {s.n}
              </span>
              <span className="tech hidden text-ink sm:block">{s.label}</span>
            </a>
            {i < steps.length - 1 && (
              <span className="hairline h-px flex-1 border-t" aria-hidden />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="border border-line bg-surface p-6 md:p-10">
        {/* 01 — Identity */}
        <section id="identity" className="scroll-mt-32">
          <h2 className="display text-2xl">
            <span className="text-amber">01 /</span> Vehicle Identity
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="VIN (Vehicle Identification Number)">
              <input
                required
                minLength={11}
                maxLength={17}
                value={form.vin}
                onChange={set("vin")}
                placeholder="17-Digit Alpha-numeric Code"
                className={lightInput + " uppercase"}
              />
            </Field>
            <Field label="Make / Manufacturer">
              <input required value={form.make} onChange={set("make")} placeholder="e.g. Porsche, Ferrari" className={lightInput} />
            </Field>
            <Field label="Model & Year">
              <input required value={form.model} onChange={set("model")} placeholder="e.g. 2022 911 GT3 RS" className={lightInput} />
            </Field>
            <Field label="Current Odometer (KM)">
              <input required type="number" min={0} value={form.odometer} onChange={set("odometer")} placeholder="0" className={lightInput} />
            </Field>
          </div>
        </section>

        {/* 02 — Visuals */}
        <section id="visuals" className="scroll-mt-32 mt-12">
          <h2 className="display text-2xl">
            <span className="text-amber">02 /</span> Visual Integrity
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {photoSlots.map((slot) => {
              const done = Boolean(photos[slot.id]);
              return (
                <label
                  key={slot.id}
                  className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-3 py-6 text-center transition-colors ${
                    done
                      ? "border-amber bg-floor"
                      : "border-line bg-floor hover:border-muted"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={attach(slot.id)}
                  />
                  {done ? <CheckIcon /> : <CameraIcon />}
                  <span className={`tech ${done ? "text-amber" : "text-muted"}`}>
                    {slot.label}
                  </span>
                  {done && (
                    <span className="max-w-full truncate text-[10px] text-meta">
                      {photos[slot.id]}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </section>

        {/* 03 — Engine / mechanical */}
        <section id="engine" className="scroll-mt-32 mt-12">
          <h2 className="display text-2xl">
            <span className="text-amber">03 /</span> Mechanical Specs
          </h2>
          <div className="mt-6 space-y-5">
            <Field label="Modifications & Aftermarket Enhancements">
              <textarea
                rows={4}
                value={form.mods}
                onChange={set("mods")}
                placeholder="Sebutkan semua modifikasi: exhaust, tuning, suspensi, dan perubahan estetika..."
                className={darkInput + " resize-y"}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Last Service Date">
                <input type="date" value={form.serviceDate} onChange={set("serviceDate")} className={lightInput} />
              </Field>
              <Field label="Tire Condition (%)">
                <select value={form.tire} onChange={set("tire")} className={darkInput}>
                  {tireOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </section>

        {/* Submit */}
        {state.status === "error" && (
          <p className="mt-6 border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
            {state.error}
          </p>
        )}
        <div className="mt-10 flex flex-col items-stretch justify-between gap-4 border-t border-line-soft pt-7 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-tech text-meta">
            <LockIcon /> Secure Submission via 256-bit Encryption
          </p>
          <button
            type="submit"
            disabled={state.status === "loading"}
            className="btn-sheen rounded-sm bg-amber px-10 py-3.5 text-[13px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber-600 disabled:opacity-60"
          >
            {state.status === "loading" ? "Mengirim…" : "Submit for Review →"}
          </button>
        </div>
      </form>
    </div>
  );
}

const lightInput =
  "w-full rounded-sm border border-transparent bg-ink px-4 py-3 text-sm text-floor placeholder:text-meta focus:border-amber focus:outline-none";
const darkInput =
  "w-full rounded-sm border border-line bg-floor px-4 py-3 text-sm text-ink placeholder:text-meta focus:border-amber focus:outline-none";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="tech mb-2 block text-[10px]">{label}</span>
      {children}
    </label>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
      <path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="10.5" width="14" height="9.5" rx="1" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}
