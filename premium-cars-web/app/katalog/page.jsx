import KatalogClient from "@/components/KatalogClient";
import SpecFinderLive from "@/components/SpecFinderLive";
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

      {/* Live specs */}
      <section className="mt-section-sm">
        <h2 className="display accent-rule mb-8 text-3xl">Data Teknis Nyata</h2>
        <SpecFinderLive />
      </section>
    </div>
  );
}
