import Link from "next/link";
import { inventoryStats, listCars } from "@/lib/repo/cars";
import { formatIDR } from "@/lib/cars";
import { statusLabel } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const s = inventoryStats();
  const recent = listCars().slice(0, 6);

  const cards = [
    { label: "Total Unit", value: s.total },
    { label: "Tersedia", value: s.inStock },
    { label: "Dipesan", value: s.reserved },
    { label: "Kategori", value: s.categories },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tech text-amber">Dashboard</p>
          <h1 className="display mt-1 text-4xl">Ringkasan Inventaris</h1>
        </div>
        <Link
          href="/admin/inventory/new"
          className="rounded-full bg-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber"
        >
          + Tambah Unit
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-[11px] uppercase tracking-tech text-meta">{c.label}</p>
            <p className="mt-2 font-display text-4xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface p-6">
        <p className="text-[11px] uppercase tracking-tech text-meta">Total Nilai Inventaris</p>
        <p className="mt-2 font-display text-3xl font-semibold text-amber">{formatIDR(s.value)}</p>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="display text-2xl">Unit Terbaru</h2>
        <Link href="/admin/inventory" className="tech text-amber">Kelola Semua →</Link>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        {recent.map((car, i) => (
          <Link
            key={car.id}
            href={`/admin/inventory/${car.id}`}
            className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-2 ${
              i > 0 ? "border-t border-line-soft" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold uppercase">{car.name}</p>
              <p className="text-[12px] text-muted">{car.brand} · {car.category || "—"}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display font-semibold">{formatIDR(car.price)}</p>
              <p className="text-[11px] uppercase tracking-tech text-meta">{statusLabel(car.status)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
