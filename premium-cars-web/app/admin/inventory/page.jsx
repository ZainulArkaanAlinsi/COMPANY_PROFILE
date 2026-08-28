import Link from "next/link";
import { listCars } from "@/lib/repo/cars";
import InventoryTable from "@/components/admin/InventoryTable";

export const dynamic = "force-dynamic";

export default function InventoryPage() {
  const cars = listCars();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tech text-amber">Inventaris</p>
          <h1 className="display mt-1 text-4xl">Kelola Unit ({cars.length})</h1>
        </div>
        <Link
          href="/admin/inventory/new"
          className="rounded-full bg-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber"
        >
          + Tambah Unit
        </Link>
      </div>
      <div className="mt-8">
        <InventoryTable cars={cars} />
      </div>
    </div>
  );
}
