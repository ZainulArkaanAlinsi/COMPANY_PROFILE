import Link from "next/link";
import Button from "@/components/Button";
import Marquee from "@/components/Marquee";
import SectionHeader from "@/components/SectionHeader";
import CarCard from "@/components/CarCard";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import CatalogExplorer from "@/components/CatalogExplorer";
import HeroScene from "@/components/HeroScene";
import NewsletterForm from "@/components/NewsletterForm";
import { cars, collections } from "@/lib/cars";
import { brandMarquee } from "@/lib/content";
import { journal } from "@/lib/journal";

// Angka diturunkan dari katalog supaya tidak pernah menyimpang dari isinya.
const negara = new Set(cars.map((c) => c.origin)).size;
const tertua = Math.min(...cars.map((c) => c.year));

const stats = [
  { n: `${cars.length}`, l: "Model Terkurasi" },
  { n: `${negara}`, l: "Negara Asal" },
  { n: `${tertua}`, l: "Unit Tertua" },
  { n: "25 Thn", l: "Sejak 1998" },
];

export default function HomePage() {
  const featured = cars.slice(0, 3);
  const [lead, ...sisaJurnal] = journal;
  const rest = sisaJurnal.slice(0, 3);

  return (
    <>
      {/* HERO — foto mobil nyata di atas panggung logam cair WebGL */}
      <section className="relative isolate overflow-hidden">
        {/* Lapisan atmosfer 3D. Ditaruh absolut di belakang seluruh isi hero,
            bukan sebagai blok tersendiri, supaya tidak menambah tinggi
            halaman dan tidak pernah menggeser tata letak. */}
        {/* Lapisan 3D ditaruh di PARUH BAWAH saja, bukan seluruh hero.
            Sebagai lantai memantul di bawah panel foto ia punya peran yang
            jelas; membentang penuh di belakang judul, ia hanya jadi tekstur
            yang mengganggu keterbacaan. */}
        <HeroScene className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] w-full" />

        {/* Peredam kontras: teks harus tetap terbaca di atas permukaan
            memantul yang kecerahannya berubah terus. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgb(var(--pc-floor)) 0%, rgb(var(--pc-floor)) 30%, rgb(var(--pc-floor) / 0.55) 46%, rgb(var(--pc-floor) / 0.20) 62%, rgb(var(--pc-floor) / 0.55) 86%, rgb(var(--pc-floor)) 100%)",
          }}
        />

        <div className="frame pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="flex animate-fade-up items-center justify-between border-b border-line/70 pb-5">
            <p className="tech text-amber">N° 01 — Kurator Otomotif</p>
            <p className="tech hidden text-meta sm:block">Est. 1998 · Jakarta</p>
          </div>

          <h1 className="display mt-10 text-[3.4rem] leading-[0.86] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem]">
            <span className="hero-line">
              <span style={{ "--line-delay": "120ms" }}>Engineered</span>
            </span>
            <span className="hero-line">
              <span
                style={{ "--line-delay": "260ms" }}
                className="flex items-baseline gap-4"
              >
                <span className="font-body text-[0.2em] font-medium uppercase tracking-[0.42em] text-muted">
                  for
                </span>
                <span className="text-amber">Excellence</span>
              </span>
            </span>
          </h1>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <p
              className="animate-fade-up max-w-xl text-base leading-relaxed text-muted md:text-lg"
              style={{ animationDelay: "520ms" }}
            >
              Rumah kurasi kendaraan performa tinggi — {cars.length} model dari{" "}
              {negara} negara, {tertua} hingga hari ini. Mitra tepercaya untuk
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

          {/* Subjeknya foto mobil sungguhan. Lapisan 3D di belakang memberi
              kedalaman dan cahaya bergerak; ia tidak berpura-pura jadi mobil. */}
          <div
            className="animate-fade-up relative mt-14 md:mt-20"
            style={{ animationDelay: "780ms" }}
            data-parallax="0.05"
          >
            <div
              className="img-reveal overflow-hidden border border-line/80 shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)]"
              style={{ "--reveal-delay": "820ms" }}
              data-spotlight
            >
              <SmartImage
                src="https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=2000&q=82"
                alt="Lamborghini Aventador SVJ di showroom Premium Cars"
                label="Premium Cars"
                className="aspect-[16/10] w-full sm:aspect-[2/1] lg:aspect-[21/9]"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="tech text-meta">↳ Fig. 01 — Aventador SVJ · Showroom Jakarta</p>
              <p className="tech flex items-center gap-2 text-amber">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
                Live
              </p>
            </div>
          </div>

          <Reveal stagger className="mt-14 grid grid-cols-2 gap-y-8 border-t border-line pt-8 md:mt-20 md:grid-cols-4">
            {stats.map((st, i) => (
              <div
                key={st.l}
                className={`pl-5 md:border-l md:border-line md:pl-8 ${
                  i % 2 === 0 ? "" : "border-l border-line"
                } ${i === 0 ? "md:border-l-0 md:pl-0" : ""}`}
              >
                <p className="font-display text-4xl font-semibold leading-none md:text-6xl">
                  <CountUp text={st.n} />
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-tech text-meta">{st.l}</p>
              </div>
            ))}
          </Reveal>
        </div>
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
            title="Koleksi Terkurasi"
            action={{ label: "Semua Kategori", href: "/katalog" }}
          />
        </Reveal>
        <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.label}
              href={c.href || "/katalog"}
              data-spotlight
              className="force-dark card-lift group relative block overflow-hidden rounded-3xl"
            >
              <SmartImage
                src={c.image}
                alt={c.label}
                label={c.label}
                className="aspect-[4/5] w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--pc-floor)/0.88)] via-[rgb(var(--pc-floor)/0.15)] to-transparent" />
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
            kicker="Inventaris"
            title="Ketersediaan Terbatas"
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
            title="Jurnal Premium"
            action={{ label: "Semua Cerita", href: "/journal" }}
          />
        </Reveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Tanpa foto: artikel-artikel ini tidak punya gambar terverifikasi,
              dan memasang foto stok yang tidak berhubungan justru menurunkan
              kredibilitas tulisan teknis. Tipografi yang bekerja. */}
          <Reveal delay={80}>
            <Link
              href={`/journal/${lead.slug}`}
              className="group flex h-full flex-col justify-between rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-amber/50 md:p-10"
            >
              <div>
                <p className="tech text-amber">
                  {lead.kicker} · {lead.baca}
                </p>
                <h3 className="display mt-5 text-2xl leading-tight transition-colors group-hover:text-amber md:text-4xl">
                  {lead.judul}
                </h3>
                <p className="mt-5 leading-relaxed text-muted">{lead.ringkas}</p>
              </div>
              <span className="tech mt-8 inline-flex items-center gap-2 text-ink transition-colors group-hover:text-amber">
                Baca
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </Reveal>

          <Reveal delay={180} stagger className="flex flex-col divide-y divide-line-soft">
            {rest.map((a) => (
              <Link
                key={a.slug}
                href={`/journal/${a.slug}`}
                className="group block py-6 first:pt-0 last:pb-0"
              >
                <p className="tech text-meta">
                  {a.kicker} · {a.tanggal} · {a.baca}
                </p>
                <h4 className="display mt-2 text-lg leading-snug transition-colors group-hover:text-amber md:text-xl">
                  {a.judul}
                </h4>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {a.ringkas}
                </p>
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
