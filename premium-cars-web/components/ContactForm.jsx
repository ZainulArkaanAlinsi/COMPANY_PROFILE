"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitLead } from "@/lib/leads-client";

const INTERESTS = [
  "Pembelian Unit",
  "Reservasi Unit",
  "Test Drive",
  "Sourcing Internasional",
  "Jual / Consignment",
  "Trade-In",
  "Pembiayaan / Cicilan",
  "Membership",
];

const INTENT_MAP = {
  reserve: "Reservasi Unit",
  "test-drive": "Test Drive",
  sourcing: "Sourcing Internasional",
  "trade-in": "Trade-In",
  consignment: "Jual / Consignment",
  financing: "Pembiayaan / Cicilan",
  membership: "Membership",
};

const inputCls =
  "w-full rounded-sm border border-line bg-floor px-4 py-3 text-sm placeholder:text-meta transition-colors focus:border-amber focus:outline-none";

/**
 * Form kontak — tersambung ke /api/leads. Prefill otomatis dari query:
 * ?intent=reserve|test-drive|trade-in|consignment|financing|membership
 * ?unit=<nama unit>  ?tier=<tier membership>  ?offer=<ringkasan penawaran>
 */
export default function ContactForm() {
  const sp = useSearchParams();

  const prefill = useMemo(() => {
    const intent = INTENT_MAP[sp.get("intent")] || INTERESTS[0];
    const unit = sp.get("unit");
    const tier = sp.get("tier");
    const offer = sp.get("offer");
    const parts = [];
    if (unit) parts.push(`Unit yang diminati: ${unit}.`);
    if (tier) parts.push(`Tier membership: ${tier}.`);
    if (offer) parts.push(`Ringkasan penawaran trade-in: ${offer}.`);
    return { interest: intent, message: parts.join("\n") };
  }, [sp]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: prefill.interest,
    message: prefill.message,
    company: "", // honeypot
  });
  const [state, setState] = useState({ status: "idle" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "loading" });
    const res = await submitLead("contact", form);
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
        <h3 className="display mt-6 text-3xl">Pesan Terkirim</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Concierge kami akan merespons dalam satu hari kerja. Simpan nomor
          referensi Anda:
        </p>
        <p className="mt-4 border border-line bg-floor px-6 py-3 font-display text-xl font-semibold tracking-wide text-amber">
          {state.id}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-surface p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">Nama</span>
          <input required value={form.name} onChange={set("name")} placeholder="Nama lengkap" className={inputCls} />
        </label>
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">Email</span>
          <input type="email" required value={form.email} onChange={set("email")} placeholder="email@domain.com" className={inputCls} />
        </label>
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">Telepon</span>
          <input value={form.phone} onChange={set("phone")} placeholder="+62…" className={inputCls} />
        </label>
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">Minat</span>
          <select value={form.interest} onChange={set("interest")} className={inputCls}>
            {INTERESTS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-5 block">
        <span className="tech mb-2 block text-[10px] text-meta">Pesan</span>
        <textarea
          rows={5}
          required
          value={form.message}
          onChange={set("message")}
          placeholder="Ceritakan kebutuhan Anda…"
          className={inputCls}
        />
      </label>
      {/* Honeypot — dibiarkan kosong oleh manusia */}
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
      <div className="mt-6">
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="inline-flex items-center gap-2 rounded-sm bg-amber px-8 py-3 text-[13px] font-semibold uppercase tracking-tech text-floor transition-all hover:bg-amber-600 disabled:opacity-60"
        >
          {state.status === "loading" ? "Mengirim…" : "Kirim Pesan"}
        </button>
      </div>
    </form>
  );
}
