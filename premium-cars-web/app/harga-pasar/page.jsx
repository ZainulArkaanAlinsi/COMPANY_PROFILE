import { Suspense } from "react";
import MarketIntel from "@/components/MarketIntel";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Harga Pasar — Market Intelligence | Premium Cars",
  description:
    "Riset harga pasar mobil nasional & internasional: katalog lengkap merek/model dari tahun lama hingga baru, jumlah listing aktif, median harga, kurs live, dan estimasi harga dalam negeri.",
};

const sources = [
  {
    t: "Katalog Kendaraan",
    b: "NHTSA vPIC — seluruh merek & model, dari tahun lama hingga terbaru.",
  },
  {
    t: "Listing Internasional",
    b: "MarketCheck / Auto.dev — jumlah unit aktif dan statistik harga pasar.",
  },
  {
    t: "Kurs & Estimasi Nasional",
    b: "Kurs USD→IDR live + faktor pajak impor CBU untuk perkiraan harga dalam negeri.",
  },
];

export default function HargaPasarPage() {
  return (
    <div className="frame py-14 md:py-20">
      <Reveal as="header" className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="tech mb-4 text-amber">
            Market Intelligence · Nasional & Internasional
          </p>
          <h1 className="display text-5xl md:text-7xl">
            Harga <span className="text-muted">Pasar</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted md:text-lg">
            Pilih merek, model, dan tahun — dari unit klasik hingga keluaran
            terbaru — lalu lihat jumlah listing aktif, median harga
            internasional, dan estimasi harga pasar nasional secara instan.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <Suspense fallback={<div className="min-h-[220px] border border-line bg-surface" />}>
          <MarketIntel />
        </Suspense>
      </Reveal>

      {/* Sumber data */}
      <section className="mt-section-sm">
        <Reveal>
          <h2 className="display accent-rule mb-8 text-3xl">Sumber Data</h2>
        </Reveal>
        <Reveal stagger className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {sources.map((s, i) => (
            <div key={s.t} className="bg-surface p-8">
              <p className="display text-3xl text-amber">0{i + 1}</p>
              <h3 className="mt-4 font-display text-xl font-semibold uppercase">
                {s.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.b}</p>
            </div>
          ))}
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-meta">
            Estimasi nasional bersifat indikatif — harga akhir unit impor
            dipengaruhi bea masuk, PPnBM, PPN, tahun produksi, kondisi, dan
            kelengkapan dokumen. Hubungi concierge kami untuk penawaran resmi.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
