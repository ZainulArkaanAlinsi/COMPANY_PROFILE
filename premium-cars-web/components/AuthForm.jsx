"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const input =
  "w-full rounded-sm border border-line bg-floor px-4 py-3 text-sm text-ink placeholder:text-meta transition-colors focus:border-amber focus:outline-none";

/** Formulir Masuk / Daftar — tab ganda, terhubung ke /api/auth/*. */
export default function AuthForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/akun";

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [state, setState] = useState({ status: "idle" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "loading" });
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || "Gagal. Coba lagi.");
      router.push(next);
      router.refresh();
    } catch (err) {
      setState({ status: "error", error: err.message });
    }
  };

  return (
    <div className="border border-line bg-surface">
      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-line">
        {[
          ["login", "Masuk"],
          ["register", "Daftar"],
        ].map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setState({ status: "idle" });
            }}
            className={`tech relative py-4 transition-colors ${
              mode === m ? "text-amber" : "text-muted hover:text-ink"
            }`}
          >
            {label}
            <span
              className={`absolute inset-x-0 bottom-0 h-[2px] bg-amber transition-transform duration-300 ${
                mode === m ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-5 p-6 md:p-8">
        {mode === "register" && (
          <label className="block">
            <span className="tech mb-2 block text-[10px] text-meta">Nama</span>
            <input required value={form.name} onChange={set("name")} placeholder="Nama lengkap" className={input} />
          </label>
        )}
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">Email</span>
          <input type="email" required value={form.email} onChange={set("email")} placeholder="email@domain.com" className={input} />
        </label>
        <label className="block">
          <span className="tech mb-2 block text-[10px] text-meta">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={set("password")}
            placeholder={mode === "register" ? "Minimal 6 karakter" : "Password Anda"}
            className={input}
          />
        </label>

        {state.status === "error" && (
          <p className="border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={state.status === "loading"}
          className="btn-sheen w-full rounded-sm bg-amber py-3.5 text-[13px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber-600 disabled:opacity-60"
        >
          {state.status === "loading"
            ? "Memproses…"
            : mode === "login"
              ? "Masuk ke Akun"
              : "Buat Akun"}
        </button>

        <p className="text-center text-[11px] uppercase tracking-tech text-meta">
          {mode === "login" ? "Belum punya akun? " : "Sudah terdaftar? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-amber hover:underline"
          >
            {mode === "login" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </form>
    </div>
  );
}
