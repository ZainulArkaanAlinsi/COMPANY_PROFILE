import Link from "next/link";
import Button from "@/components/Button";
import Marquee from "@/components/Marquee";
import SectionHeader from "@/components/SectionHeader";
import CarCard from "@/components/CarCard";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import CatalogExplorer from "@/components/CatalogExplorer";
import NewsletterForm from "@/components/NewsletterForm";
import { cars, collections } from "@/lib/cars";
import { brandMarquee, journal } from "@/lib/content";

const stats = [
  { n: "1.200+", l: "Unit Terkurasi" },
  { n: "25 Thn", l: "Sejak 1998" },
  { n: "18", l: "Negara Sourcing" },
  { n: "98%", l: "Kepuasan Klien" },
];

export default function HomePage() {
  const featured = cars.slice(0, 3);
  const lead = journal.find((j) => j.featured) || journal[0];
  const rest = journal.filter((j) => j !== lead).slice(0, 3);

  return (
    <>
      {/* HERO — editorial */}
      <section className="frame pt-6 md:pt-10">
        {/* Index row */}
        <div className="flex animate-fade-up items-center justify-between border-b border-line pb-5">
          <p className="tech text-amber">N° 01 — Kurator Otomotif</p>
          <p className="tech hidden text-meta sm:block">Est. 1998 · Jakarta</p>
        </div>

        <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-8 lg:pt-14">
          {/* Headline dominan, asimetris */}
          <div className="lg:col-span-7">
            <h1 className="display text-[3.6rem] leading-[0.86] sm:text-[5.25rem] md:text-[6.75rem] lg:text-[7.75rem]">
              <span className="hero-line">
                <span style={{ "--line-delay": "120ms" }}>Engineered</span>
              </span>
              <span className="hero-line">
                <span
                  style={{ "--line-delay": "260ms" }}
                  className="flex items-baseline gap-4"
                >
                  <span className="font-body text-[0.24em] font-medium uppercase tracking-[0.4em] text-muted">
                    for
                  </span>
                  <span className="text-amber">Excellence</span>
                </span>
              </span>
            </h1>

            <div className="mt-9 grid max-w-2xl gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
              <p
                className="animate-fade-up text-base leading-relaxed text-muted md:text-lg"
                style={{ animationDelay: "520ms" }}
              >
                Rumah kurasi kendaraan performa tinggi — mitra tepercaya untuk
                membeli, menjual, dan menukar mobil impian Anda.
              </p>
              <div
                className="flex animate-fade-up items-center gap-6"
                style={{ animationDelay: "640ms" }}
              >
                <Button href="/katalog" variant="solid">
                  Katalog
                </Button>
                <Link
                  href="/kontak"
                  className="tech group inline-flex items-center gap-2 whitespace-nowrap text-ink transition-colors hover:text-amber"
                >
                  Spesialis
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Foto berbingkai + kapsi editorial */}
          <div className="lg:col-span-5">
            <div className="relative" data-parallax="0.06">
              <div
                className="img-reveal kenburns overflow-hidden border border-line"
                data-spotlight
                style={{ "--reveal-delay": "350ms" }}
              >
                <SmartImage
                  src="https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1400&q=80"
                  alt="Lamborghini Aventador — kurasi premium"
                  label="Premium Cars"
                  className="aspect-[4/5] w-full"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="tech text-meta">↳ Fig. 01 — Showroom Jakarta</p>
                <p className="tech flex items-center gap-2 text-amber">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
                  Live
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Index angka editorial */}
        <Reveal stagger className="mt-12 grid grid-cols-2 gap-y-8 border-t border-line pt-8 md:mt-16 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={`pl-5 md:border-l md:border-line md:pl-8 ${
                i % 2 === 0 ? "" : "border-l border-line"
              } ${i === 0 ? "md:border-l-0 md:pl-0" : ""}`}
            >
              <p className="font-display text-4xl font-semibold leading-none md:text-6xl">
                <CountUp text={s.n} />
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-tech text-meta">{s.l}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* BRAND MARQUEE */}
      <section className="frame mt-8 border-y border-line py-8">
        <Marquee items={brandMarquee} />
      </section>

      {/* DUAL FUNCTION — beli / jual */}
      <section className="frame mt-section">
        <Reveal stagger className="grid gap-5 md:grid-cols-2">
          {[
            {
              tag: "01 — Marketplace",
              title: "Beli",
              body: "Inventaris tersertifikasi dengan riwayat transparan, spec finder, dan simulasi cicilan instan.",
              href: "/katalog",
              cta: "Lihat Inventaris",
            },
            {
              tag: "02 — Concierge",
              title: "Jual & Tukar",
              body: "Appraisal presisi, consignment privat, dan evaluasi trade-in dengan penawaran kompetitif.",
              href: "/jual",
              cta: "Jual Mobil Anda",
            },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              data-spotlight
              className="card-lift group relative overflow-hidden rounded-3xl border border-line bg-surface p-10 md:p-12"
            >
              <span className="pointer-events-none absolute -right-4 -top-8 select-none font-display text-[130px] font-bold leading-none text-surface-2 transition-colors duration-500">
                {f.tag.slice(0, 2)}
              </span>
              <p className="tech relative text-amber">{f.tag}</p>
              <h3 className="display relative mt-4 text-4xl md:text-5xl">{f.title}</h3>
              <p className="relative mt-4 max-w-sm text-muted">{f.body}</p>
              <span className="tech relative mt-8 inline-flex items-center gap-2 text-ink transition-colors group-hover:text-amber">
                {f.cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* MARKET INTELLIGENCE STRIP */}
      <section className="frame mt-5">
        <Reveal>
          <Link
            href="/harga-pasar"
            data-spotlight
            className="group flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-surface-2 px-8 py-7 md:px-11"
          >
            <div className="flex items-center gap-4">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber" />
              <div className="force-dark">
                <p className="tech text-amber">Market Intelligence</p>
                <p className="mt-1 font-display text-xl font-semibold uppercase text-ink md:text-2xl">
                  Cek harga pasar nasional & internasional — semua merek & tahun
                </p>
              </div>
            </div>
            <span className="tech flex items-center gap-2 text-amber">
              Buka Terminal
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </span>
          </Link>
        </Reveal>
      </section>

      {/* CURATED COLLECTIONS */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader
            index={2}
            kicker="Koleksi"
            title="Curated Collections"
            action={{ label: "Semua Kategori", href: "/katalog" }}
          />
        </Reveal>
        <Reveal stagger className="mt-10 grid gap-5 md:grid-cols-3">
          {collections.slice(0, 3).map((c) => (
            <Link
              key={c.label}
              href="/katalog"
              data-spotlight
              className="force-dark card-lift group relative block overflow-hidden rounded-3xl"
            >
              <SmartImage
                src={c.image}
                alt={c.label}
                label={c.label}
                className="aspect-[4/5] w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,11,0.88)] via-[rgba(15,13,11,0.15)] to-transparent" />
              <div className="absolute bottom-0 left-0 p-7">
                <p className="tech text-amber">{c.count} Unit</p>
                <h3 className="display mt-2 text-2xl text-ink">{c.label}</h3>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* LIMITED AVAILABILITY */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader
            index={3}
            kicker="Inventory"
            title="Limited Availability"
            action={{ label: "Katalog Lengkap", href: "/katalog" }}
          />
        </Reveal>
        <Reveal stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </Reveal>
      </section>

      {/* EXPLORE THE WHOLE DATABASE */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader
            index={4}
            kicker="Database"
            title="Di Luar Showroom"
            action={{ label: "Analisis Harga", href: "/harga-pasar" }}
          />
          <p className="mt-4 max-w-2xl text-muted">
            Unit di atas adalah yang kami pegang. Di bawah: akses ke seluruh
            database kendaraan dunia — ribuan model, semua merek &amp; tahun —
            lengkap dengan analisis harga pasarnya.
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-10">
          <CatalogExplorer />
        </Reveal>
      </section>

      {/* PREMIUM JOURNAL */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader
            index={5}
            kicker="Editorial"
            title="Premium Journal"
            action={{ label: "Semua Cerita", href: "/journal" }}
          />
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal delay={80}>
            <Link href="/journal" className="group block">
              <div className="card-lift overflow-hidden rounded-3xl border border-line">
                <SmartImage
                  src={lead.image}
                  alt={lead.title}
                  label={lead.kicker}
                  className="aspect-[16/10] w-full"
                />
              </div>
              <p className="tech mt-5 text-amber">
                {lead.date} · {lead.kicker}
              </p>
              <h3 className="display mt-3 text-3xl transition-colors group-hover:text-amber">
                {lead.title}
              </h3>
              <p className="mt-3 max-w-xl text-muted">{lead.excerpt}</p>
              <span className="tech mt-5 inline-block text-ink transition-colors group-hover:text-amber">
                Baca Artikel →
              </span>
            </Link>
          </Reveal>

          <Reveal delay={180} stagger className="flex flex-col divide-y divide-line-soft">
            {rest.map((a) => (
              <Link key={a.slug} href="/journal" className="group flex gap-5 py-5 first:pt-0">
                <div className="overflow-hidden rounded-2xl border border-line">
                  <SmartImage src={a.image} alt={a.title} label={a.kicker} className="h-24 w-32 shrink-0" />
                </div>
                <div>
                  <p className="tech text-meta">{a.kicker}</p>
                  <h4 className="mt-1 font-display text-xl font-semibold uppercase leading-tight transition-colors group-hover:text-amber">
                    {a.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* JOIN THE CIRCLE */}
      <section className="frame mt-section">
        <Reveal className="overflow-hidden rounded-[2rem] border border-line bg-surface-2 px-6 py-16 text-center md:px-16 md:py-24">
          <p className="tech text-amber">Membership</p>
          <h2 className="display mx-auto mt-4 max-w-2xl text-4xl text-ink md:text-5xl">
            Join the Exclusive Circle of Automotive Connoisseurs
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-muted">
            Akses awal ke stok terbatas, undangan viewing privat, dan digest
            editorial bulanan.
          </p>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
