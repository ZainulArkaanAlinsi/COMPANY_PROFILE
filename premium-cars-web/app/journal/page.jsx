import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import { journal } from "@/lib/content";

export const metadata = {
  title: "Journal | Premium Cars",
  description:
    "Editorial otomotif — rekayasa, gaya hidup, dan budaya di balik kendaraan performa tinggi.",
};

export default function JournalPage() {
  const [lead, ...rest] = journal;

  return (
    <div className="frame py-14 md:py-20">
      <Reveal as="header">
        <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
          <p className="tech text-amber">
            <span className="text-meta">N° 11 — </span>Editorial
          </p>
          <p className="tech hidden text-meta sm:block">Premium Cars Journal</p>
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.9] md:text-8xl">Journal</h1>
        <p className="mt-6 max-w-2xl text-muted md:text-lg">
          Jurnalisme otomotif premium — menyelami rekayasa, warisan, dan budaya
          di balik mesin-mesin paling didambakan di dunia.
        </p>
      </Reveal>

      {/* Lead */}
      <Reveal delay={100}>
        <Link href="/journal" className="group mt-14 block">
          <div className="grid gap-8 border border-line transition-colors group-hover:border-amber/50 md:grid-cols-2">
            <div className="overflow-hidden">
              <SmartImage
                src={lead.image}
                alt={lead.title}
                label={lead.kicker}
                className="aspect-[16/10] w-full md:aspect-auto md:h-full"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="tech text-amber">{lead.date} · {lead.kicker}</p>
              <h2 className="display mt-4 text-4xl transition-colors group-hover:text-amber">{lead.title}</h2>
              <p className="mt-4 text-muted">{lead.excerpt}</p>
              <span className="tech mt-6 text-ink transition-colors group-hover:text-amber">Read the Article →</span>
            </div>
          </div>
        </Link>
      </Reveal>

      {/* Grid */}
      <Reveal stagger className="mt-10 grid gap-8 md:grid-cols-3">
        {rest.map((a) => (
          <Link
            key={a.slug}
            href="/journal"
            className="group block border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-amber/50"
          >
            <SmartImage src={a.image} alt={a.title} label={a.kicker} className="aspect-[4/3] w-full" />
            <div className="p-6">
              <p className="tech text-meta">{a.date} · {a.kicker}</p>
              <h3 className="mt-3 font-display text-xl font-semibold uppercase leading-tight transition-colors group-hover:text-amber">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </Reveal>
    </div>
  );
}
