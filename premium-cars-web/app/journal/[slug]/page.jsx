import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { journal, getArtikel } from "@/lib/journal";

export function generateStaticParams() {
  return journal.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const a = getArtikel(params.slug);
  if (!a) return { title: "Artikel tidak ditemukan | Premium Cars" };
  return {
    title: `${a.judul} | Journal Premium Cars`,
    description: a.ringkas,
    openGraph: { title: a.judul, description: a.ringkas, type: "article" },
  };
}

export default function ArtikelPage({ params }) {
  const a = getArtikel(params.slug);
  if (!a) notFound();

  const lain = journal.filter((x) => x.slug !== a.slug).slice(0, 2);

  return (
    <article className="frame py-14 md:py-20">
      <Link
        href="/journal"
        className="tech group inline-flex items-center gap-2 text-meta transition-colors hover:text-amber"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span>
        Journal
      </Link>

      <header className="mt-8 border-b border-line pb-10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="tech text-amber">{a.kicker}</span>
          <span className="tech text-meta">{a.tanggal}</span>
          <span className="tech text-meta">· {a.baca}</span>
        </div>
        <h1 className="display mt-6 max-w-4xl text-[2.4rem] leading-[0.98] md:text-6xl">
          {a.judul}
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted">
          {a.ringkas}
        </p>
      </header>

      {/* Lebar baris dibatasi ~68 karakter — di atas itu mata kehilangan
          jejak baris berikutnya saat kembali ke kiri. */}
      <div className="mt-12 max-w-[68ch] space-y-7">
        {a.isi.map((p, i) => (
          <Reveal key={i} delay={i * 40}>
            <p
              className={
                i === 0
                  ? "text-lg leading-[1.75] text-ink first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-amber"
                  : "leading-[1.85] text-muted"
              }
            >
              {p}
            </p>
          </Reveal>
        ))}
      </div>

      <footer className="mt-20 border-t border-line pt-10">
        <p className="tech text-amber">Baca juga</p>
        <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {lain.map((x) => (
            <Link key={x.slug} href={`/journal/${x.slug}`} className="group block">
              <p className="tech text-meta">{x.kicker} · {x.baca}</p>
              <h3 className="display mt-2 text-lg leading-snug transition-colors group-hover:text-amber">
                {x.judul}
              </h3>
            </Link>
          ))}
        </div>
      </footer>
    </article>
  );
}
