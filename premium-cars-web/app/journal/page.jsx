import Link from "next/link";
import Reveal from "@/components/Reveal";
import { journal } from "@/lib/journal";

export const metadata = {
  title: "Journal | Premium Cars",
  description:
    "Panduan pembeli, analisis pasar, dan catatan teknis dari tim inspeksi Premium Cars — ditulis untuk keputusan pembelian, bukan untuk gaya hidup.",
};

export default function JournalPage() {
  const [utama, ...sisanya] = journal;

  return (
    <div className="frame py-14 md:py-20">
      <div className="flex animate-fade-up items-center justify-between gap-6 border-b border-line pb-4">
        <p className="tech text-amber">
          <span className="text-meta">N° 05 — </span>Journal
        </p>
        <p className="tech text-meta">{journal.length} tulisan</p>
      </div>

      <h1 className="display mt-6 text-6xl leading-[0.9] md:text-8xl">Journal</h1>
      <p className="mt-6 max-w-2xl text-muted md:text-lg">
        Catatan dari meja inspeksi. Ditulis untuk menjawab pertanyaan yang
        menentukan keputusan pembelian — bukan untuk mengisi kolom gaya hidup.
      </p>

      {/* Tulisan utama */}
      <Reveal className="mt-14">
        <Link
          href={`/journal/${utama.slug}`}
          className="group block border-t border-line pt-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="tech text-amber">{utama.kicker}</span>
            <span className="tech text-meta">{utama.tanggal}</span>
            <span className="tech text-meta">· {utama.baca}</span>
          </div>
          <h2 className="display mt-5 max-w-4xl text-3xl leading-tight transition-colors group-hover:text-amber md:text-5xl">
            {utama.judul}
          </h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted">{utama.ringkas}</p>
          <span className="tech mt-6 inline-flex items-center gap-2 text-ink transition-colors group-hover:text-amber">
            Baca
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </Reveal>

      {/* Sisanya */}
      <div className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-2">
        {sisanya.map((a, i) => (
          <Reveal key={a.slug} delay={i * 70}>
            <Link
              href={`/journal/${a.slug}`}
              className="group flex h-full flex-col border-t border-line pt-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="tech text-amber">{a.kicker}</span>
                <span className="tech text-meta">{a.tanggal}</span>
                <span className="tech text-meta">· {a.baca}</span>
              </div>
              <h3 className="display mt-4 text-xl leading-snug transition-colors group-hover:text-amber md:text-2xl">
                {a.judul}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a.ringkas}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
