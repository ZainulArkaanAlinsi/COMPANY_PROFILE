"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatIDR } from "@/lib/cars";

export default function InventoryTable({ cars }) {
  const router = useRouter();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  async function remove(car) {
    if (!window.confirm(`Hapus "${car.name}"? Tindakan ini permanen.`)) return;
    setBusy(car.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/cars/${car.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus.");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  }

  if (!cars.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center text-muted">
        Belum ada unit. Klik “Tambah Unit” untuk mulai.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {cars.map((car, i) => (
          <div
            key={car.id}
            className={`flex flex-wrap items-center gap-4 px-5 py-4 ${
              i > 0 ? "border-t border-line-soft" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-semibold uppercase">{car.name}</p>
              <p className="text-[12px] text-muted">
                {car.brand} · {car.year || "—"} · {car.category || "—"}
              </p>
            </div>
            <div className="hidden w-28 text-right sm:block">
              <p className="font-display font-semibold">{formatIDR(car.price)}</p>
            </div>
            <span className="hidden w-24 text-center text-[10.5px] font-semibold uppercase tracking-tech text-muted md:block">
              {car.status}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/inventory/${car.id}`}
                className="rounded-full border border-line px-4 py-2 text-[11px] font-semibold uppercase tracking-tech text-ink transition-colors hover:border-ink"
              >
                Edit
              </Link>
              <button
                onClick={() => remove(car)}
                disabled={busy === car.id}
                className="rounded-full border border-danger/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-tech text-danger transition-colors hover:bg-danger hover:text-floor disabled:opacity-50"
              >
                {busy === car.id ? "…" : "Hapus"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
