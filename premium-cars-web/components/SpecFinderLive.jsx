"use client";

import { useState } from "react";

/**
 * Live "Cek Spesifikasi" — queries API Ninjas /v1/cars via /api/specs.
 * Degrades to a clear message when the API key isn't configured (HTTP 501).
 */
export default function SpecFinderLive() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [state, setState] = useState({ status: "idle", data: null, error: null });

  async function submit(e) {
    e.preventDefault();
    setState({ status: "loading", data: null, error: null });
    try {
      const q = new URLSearchParams({ make, model });
      const r = await fetch(`/api/specs?${q}`);
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
      setState({ status: "done", data: Array.isArray(body) ? body : [], error: null });
    } catch (err) {
      setState({ status: "error", data: null, error: err.message });
    }
  }

  const { status, data, error } = state;

  return (
    <div className="border border-line bg-surface p-8">
      <div className="flex items-center gap-3">
        <LiveDot />
        <h3 className="display text-2xl">Cek Spesifikasi</h3>
        <span className="tech text-meta">Live · API Ninjas</span>
      </div>
      <p className="mt-2 text-sm text-muted">
        Masukkan merek &amp; model untuk menarik spesifikasi teknis nyata.
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={make}
          onChange={(e) => setMake(e.target.value)}
          placeholder="Merek (mis. BMW)"
          className="flex-1 rounded-sm border border-line bg-floor px-4 py-3 text-sm placeholder:text-meta focus:border-amber focus:outline-none"
        />
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model (mis. M4)"
          className="flex-1 rounded-sm border border-line bg-floor px-4 py-3 text-sm placeholder:text-meta focus:border-amber focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-sm bg-amber px-6 py-3 text-[13px] font-semibold uppercase tracking-tech text-floor hover:bg-amber-600 disabled:opacity-60"
        >
          {status === "loading" ? "Memuat…" : "Cek"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-5 border border-line-soft bg-floor p-4 text-sm text-amber-400">
          {error}
        </p>
      )}

      {status === "done" && data.length === 0 && (
        <p className="mt-5 text-sm text-meta">
          Tidak ada data untuk kombinasi tersebut. Coba merek/model lain.
        </p>
      )}

      {status === "done" && data.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.slice(0, 4).map((car, i) => (
            <div key={i} className="border border-line-soft bg-floor p-5">
              <p className="font-display text-lg font-semibold uppercase">
                {car.make} {car.model}
              </p>
              <p className="tech mt-1 text-meta">
                {car.year || "—"} · {car.class || "—"}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-y-3">
                {[
                  ["Cylinders", car.cylinders],
                  ["Displacement", car.displacement ? `${car.displacement} L` : null],
                  ["Drive", car.drive],
                  ["Fuel", car.fuel_type],
                  ["Transmission", car.transmission],
                  ["City MPG", car.city_mpg],
                ]
                  .filter(([, v]) => v !== undefined && v !== null && v !== "")
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="tech text-[10px] text-meta">{k}</dt>
                      <dd className="mt-0.5 font-display text-base font-semibold uppercase">
                        {String(v)}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber" />
    </span>
  );
}
