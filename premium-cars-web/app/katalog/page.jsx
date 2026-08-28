import KatalogClient from "@/components/KatalogClient";
import SpecFinderLive from "@/components/SpecFinderLive";
import CatalogExplorer from "@/components/CatalogExplorer";
import Reveal from "@/components/Reveal";
import { getInventory } from "@/lib/inventory";

export const metadata = {
  title: "Katalog | Premium Cars",
  description:
    "Koleksi kurasi kendaraan performa tinggi. Filter berdasarkan merek, drivetrain, dan body style, lengkap dengan simulasi cicilan.",
};

export default async function KatalogPage() {
  const { source, cars } = await getInventory();

  return (
    <div className="frame py-14 md:py-20">
      <KatalogClient cars={cars} source={source} />

      {/* Database besar — semua merek & tahun (NHTSA) */}
      <section className="mt-section-sm">
        <Reveal>
          <h2 className="display accent-rule mb-3 text-3xl">Di Luar Showroom</h2>
          <p className="mb-8 max-w-2xl text-muted">
            Katalog kurasi di atas adalah unit yang kami pegang. Di bawah ini:
            akses ke seluruh database kendaraan dunia — ribuan model, semua merek
            &amp; tahun — lengkap dengan analisis harga pasarnya.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <CatalogExplorer />
        </Reveal>
      </section>

      {/* Live specs */}
      <section className="mt-section-sm">
        <h2 className="display accent-rule mb-8 text-3xl">Data Teknis Nyata</h2>
        <SpecFinderLive />
      </section>
    </div>
  );
}
