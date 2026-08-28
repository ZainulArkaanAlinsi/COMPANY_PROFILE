"use client";

import { useState } from "react";
import { submitLead } from "@/lib/leads-client";

/** Formulir newsletter (home) — tersambung ke /api/leads tipe "newsletter". */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ status: "idle" });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "loading" });
    const res = await submitLead("newsletter", { email });
    setState(
      res.ok ? { status: "done" } : { status: "error", error: res.error }
    );
  };

  if (state.status === "done") {
    return (
      <p className="mx-auto mt-9 max-w-lg animate-fade-up border border-amber/40 bg-amber/10 px-6 py-4 text-sm text-amber">
        Selamat bergabung di lingkaran eksklusif — undangan pertama menyusul ke
        inbox Anda.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Alamat email"
        className="flex-1 rounded-sm border border-line bg-floor px-5 py-3.5 text-sm placeholder:text-meta transition-colors focus:border-amber focus:outline-none"
      />
      <button
        type="submit"
        disabled={state.status === "loading"}
        className="btn-sheen rounded-sm bg-amber px-8 py-3 text-[13px] font-semibold uppercase tracking-tech text-floor transition-all hover:-translate-y-px hover:bg-amber-600 disabled:opacity-60"
      >
        {state.status === "loading" ? "…" : "Berlangganan"}
      </button>
      {state.status === "error" && (
        <p className="text-sm text-amber sm:hidden">{state.error}</p>
      )}
    </form>
  );
}
