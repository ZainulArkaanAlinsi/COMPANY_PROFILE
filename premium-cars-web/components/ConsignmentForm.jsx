"use client";

import { useState } from "react";
import { submitLead } from "@/lib/leads-client";

/**
 * Discreet Concierge — formulir kontak consignment, tersambung ke
 * /api/leads (tipe "consignment").
 */
export default function ConsignmentForm() {
  const [form, setForm] = useState({
    name: "",
    contact: "Email Terenkripsi",
    details: "",
    company: "", // honeypot
  });
  const [state, setState] = useState({ status: "idle" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "loading" });
    const res = await submitLead("consignment", form);
    setState(
      res.ok
        ? { status: "done", id: res.id }
        : { status: "error", error: res.error }
    );
  };

  if (state.status === "done") {
    return (
      <div className="flex h-full flex-col items-center justify-center border border-line bg-surface p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-amber text-amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="display mt-6 text-2xl">Kontak Terjalin</h3>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
          Senior consultant kami akan menghubungi Anda melalui kanal pilihan
          dalam 24 jam. Seluruh komunikasi terenkripsi.
        </p>
        <p className="mt-5 border border-line bg-floor px-5 py-2.5 font-display text-lg font-semibold tracking-wide text-amber">
          {state.id}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-surface p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="tech mb-2 block text-[10px]">Nama</span>
          <input required value={form.name} onChange={set("name")} placeholder="Nama Anda" className={input} />
        </label>
        <label className="block">
          <span className="tech mb-2 block text-[10px]">Kontak Pilihan</span>
          <select value={form.contact} onChange={set("contact")} className={input}>
            <option>Email Terenkripsi</option>
            <option>Telepon</option>
            <option>WhatsApp</option>
            <option>Signal</option>
          </select>
        </label>
      </div>
      <label className="mt-5 block">
        <span className="tech mb-2 block text-[10px]">Detail Aset</span>
        <textarea
          required
          rows={5}
          value={form.details}
          onChange={set("details")}
          placeholder="Merek, model, tahun, provenance singkat..."
          className={input + " resize-y"}
        />
      </label>
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={set("company")}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {state.status === "error" && (
        <p className="mt-4 border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={state.status === "loading"}
        className="btn-sheen mt-6 w-full rounded-sm bg-amber py-3.5 text-[13px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {state.status === "loading" ? "Mengirim…" : "Establish Contact"}
      </button>
      <p className="mt-4 text-center text-[11px] uppercase tracking-tech text-meta">
        Identitas Anda tidak pernah dibagikan tanpa izin
      </p>
    </form>
  );
}

const input =
  "w-full rounded-sm border border-line bg-floor px-4 py-3 text-sm text-ink placeholder:text-meta transition-colors focus:border-amber focus:outline-none";
