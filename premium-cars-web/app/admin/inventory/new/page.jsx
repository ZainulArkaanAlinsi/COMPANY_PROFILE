import Link from "next/link";
import CarForm from "@/components/admin/CarForm";

export const dynamic = "force-dynamic";

export default function NewCarPage() {
  return (
    <div>
      <Link href="/admin/inventory" className="tech text-muted hover:text-ink">
        ← Inventaris
      </Link>
      <h1 className="display mt-3 text-4xl">Tambah Unit Baru</h1>
      <p className="mt-2 text-muted">Isi detail unit — akan langsung tersimpan ke database.</p>
      <div className="mt-8">
        <CarForm />
      </div>
    </div>
  );
}
