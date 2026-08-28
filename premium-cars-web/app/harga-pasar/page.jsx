import { Suspense } from "react";
import MarketIntel from "@/components/MarketIntel";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { bacaHargaPasar } from "@/lib/company";

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
      <Reveal as="header">
        <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
          <p className="tech text-amber">
            <span className="text-meta">N° 06 — </span>Riset Harga
          </p>
          <p className="tech hidden text-meta sm:block">Nasional & Internasional</p>
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.9] md:text-8xl">
          Harga <span className="text-muted">Pasar</span>
        </h1>
        <p className="mt-6 max-w-xl text-muted md:text-lg">
          Pilih merek, model, dan tahun — dari unit klasik hingga keluaran
          terbaru — lalu lihat jumlah listing aktif, median harga
          internasional, dan estimasi harga pasar nasional secara instan.
        </p>
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

      {/* ── Cara membaca angkanya ────────────────────────────────────── */}
      <section className="mt-section">
        <Reveal>
          <SectionHeader
            index={2}
            kicker="Cara Membaca"
            title="Empat hal sebelum Anda memakai angka ini"
          />
          <p className="mt-6 max-w-3xl leading-relaxed text-muted">
            Data pasar mudah disalahartikan, dan salah membacanya berujung
            tawaran yang meleset jauh — ke atas maupun ke bawah.
          </p>
        </Reveal>
        <div className="mt-12 border-t border-line">
          {bacaHargaPasar.map((x, i) => (
            <Reveal key={x.judul} delay={i * 60}>
              <article className="grid gap-4 border-b border-line py-7 md:grid-cols-[1fr_1.6fr] md:gap-10">
                <h3 className="display text-lg leading-snug md:text-xl">{x.judul}</h3>
                <p className="leading-relaxed text-muted">{x.isi}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
