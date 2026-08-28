import Link from "next/link";
import { notFound } from "next/navigation";
import CarForm from "@/components/admin/CarForm";
import { getCarById } from "@/lib/repo/cars";

export const dynamic = "force-dynamic";

export default function EditCarPage({ params }) {
  const car = getCarById(params.id);
  if (!car) notFound();

  return (
    <div>
      <Link href="/admin/inventory" className="tech text-muted hover:text-ink">
        ← Inventaris
      </Link>
      <h1 className="display mt-3 text-4xl">Edit: {car.name}</h1>
      <p className="mt-2 text-muted">Perubahan langsung tersimpan ke database.</p>
      <div className="mt-8">
        <CarForm car={car} />
      </div>
    </div>
  );
}
