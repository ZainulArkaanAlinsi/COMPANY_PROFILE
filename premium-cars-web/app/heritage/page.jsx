import Button from "@/components/Button";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { milestones } from "@/lib/content";

export const metadata = {
  title: "Heritage | Premium Cars",
  description:
    "Sejak 1998, Premium Cars meredefinisi standar akuisisi otomotif mewah di Indonesia.",
};

const stats = [
  { v: "1998", k: "Tahun Berdiri" },
  { v: "2.400+", k: "Unit Terkurasi" },
  { v: "18", k: "Negara Sourcing" },
  { v: "99%", k: "Kepuasan Klien" },
];

const values = [
  { t: "Presisi", b: "Setiap unit melalui inspeksi 200 titik. Tidak ada kompromi terhadap kualitas mekanis maupun keaslian." },
  { t: "Diskresi", b: "Privasi klien adalah kehormatan. Transaksi ditangani dengan kerahasiaan penuh." },
  { t: "Keahlian", b: "Tim spesialis dengan puluhan tahun pengalaman di dunia otomotif performa tinggi." },
];

export default function HeritagePage() {
  return (
    <div className="py-14 md:py-20">
      {/* Hero */}
      <section className="frame">
        <div
          className="flex animate-fade-up items-center justify-between gap-6 border-b border-line pb-4"
          style={{ animationDelay: "80ms" }}
        >
          <p className="tech text-amber">
            <span className="text-meta">N° 00 — </span>Heritage
          </p>
          <p className="tech hidden text-meta sm:block">Est. 1998 · Jakarta</p>
        </div>
        <h1
          className="display mt-8 max-w-4xl animate-fade-up text-5xl leading-[0.92] md:text-8xl"
          style={{ animationDelay: "180ms" }}
        >
          Warisan Rekayasa, Dibangun untuk yang Luar Biasa
        </h1>
        <div
          data-parallax="0.04"
          data-spotlight
          className="kenburns mt-10 overflow-hidden rounded-2xl border border-line"
        >
          <SmartImage
            src="https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=2000&q=80"
            alt="Premium Cars showroom"
            label="Heritage"
            className="aspect-[21/9] w-full"
          />
        </div>
      </section>

      {/* Story */}
      <section className="frame mt-section-sm grid gap-10 md:grid-cols-2">
        <h2 className="display text-3xl md:text-4xl">
          Kami memperlakukan inventaris otomotif mewah sebagai karya seni.
        </h2>
        <div className="space-y-5 text-muted">
          <p>
            Premium Cars lahir dari obsesi terhadap keunggulan mekanis. Apa yang
            bermula sebagai balai lelang privat kini menjadi ekosistem lengkap —
            marketplace kurasi, concierge akuisisi, dan rumah bagi para kolektor.
          </p>
          <p>
            Estetika kami adalah <span className="text-ink">Industrial Minimalism</span>:
            presisi, kontras tinggi, dan penghormatan terhadap fotografi otomotif.
            Setiap detail dirancang untuk terasa terukur dan struktural.
          </p>
          <Button href="/katalog" variant="ghost">Jelajahi Koleksi</Button>
        </div>
      </section>

      {/* Stats */}
      <section className="frame mt-section-sm">
        <Reveal stagger className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} data-spotlight className="bg-surface p-8 text-center md:p-10">
              <p className="display text-4xl text-amber md:text-5xl">
                <CountUp text={s.v} />
              </p>
              <p className="tech mt-3 text-meta">{s.k}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="frame mt-section-sm">
        <Reveal>
          <h2 className="display accent-rule mb-12 text-4xl">Perjalanan Kami</h2>
        </Reveal>
        <div className="space-y-px overflow-hidden border border-line bg-line">
          {milestones.map((m, i) => (
            <Reveal
              key={m.year}
              delay={i * 60}
              data-spotlight
              className="group grid gap-4 bg-surface p-8 transition-colors hover:bg-surface-2 md:grid-cols-[160px_1fr] md:p-10"
            >
              <p className="display text-4xl text-amber transition-transform duration-500 group-hover:translate-x-1">
                {m.year}
              </p>
              <div>
                <h3 className="font-display text-2xl font-semibold uppercase">{m.title}</h3>
                <p className="mt-2 max-w-2xl text-muted">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="frame mt-section-sm">
        <Reveal>
          <h2 className="display accent-rule mb-10 text-3xl">Nilai Kami</h2>
        </Reveal>
        <Reveal stagger className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.t}
              data-spotlight
              className="rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber/50"
            >
              <h3 className="display text-2xl text-amber">{v.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.b}</p>
            </div>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
