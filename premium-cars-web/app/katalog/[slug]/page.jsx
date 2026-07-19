import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import SmartImage from "@/components/SmartImage";
import FinanceCalculator from "@/components/FinanceCalculator";
import CarCard from "@/components/CarCard";
import { cars, getCar, formatIDR } from "@/lib/cars";

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const car = getCar(params.slug);
  if (!car) return { title: "Unit tidak ditemukan | Premium Cars" };
  return {
    title: `${car.brand} ${car.name} | Premium Cars`,
    description: car.summary,
  };
}

export default function DetailPage({ params }) {
  const car = getCar(params.slug);
  if (!car) notFound();

  const related = [...cars]
    .filter((c) => c.slug !== car.slug)
    .sort(
      (a, b) =>
        (b.category === car.category) - (a.category === car.category)
    )
    .slice(0, 3);

  return (
    <div className="frame py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="tech mb-8 flex gap-2 text-meta">
        <Link href="/" className="hover:text-amber">Home</Link>
        <span>/</span>
        <Link href="/katalog" className="hover:text-amber">Katalog</Link>
        <span>/</span>
        <span className="text-ink">{car.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="border border-line">
            <SmartImage
              src={car.gallery[0]}
              alt={`${car.brand} ${car.name}`}
              label={car.name}
              className="aspect-[16/10] w-full"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {car.gallery.map((g, i) => (
              <div key={i} className="border border-line">
                <SmartImage
                  src={g}
                  alt={`${car.name} view ${i + 1}`}
                  label={car.brand}
                  className="aspect-[4/3] w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3">
            <span className="tech text-amber">{car.eyebrow}</span>
            <span className="h-3 w-px bg-line" />
            <span className="tech text-meta">{car.year} · {car.brand}</span>
          </div>
          <h1 className="display mt-3 text-5xl md:text-6xl">{car.name}</h1>

          <span className="mt-5 inline-block rounded-sm bg-amber px-3 py-1.5 text-[11px] font-semibold uppercase tracking-tech text-floor">
            {car.status}
          </span>

          <p className="mt-6 leading-relaxed text-muted">{car.summary}</p>

          {/* Spec table */}
          <dl className="mt-8 grid grid-cols-2 border-t border-line-soft">
            {car.specs.map((s) => (
              <div key={s.k} className="border-b border-line-soft py-4 pr-4">
                <dt className="tech text-[10px] text-meta">{s.k}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold uppercase">
                  {s.v}
                </dd>
              </div>
            ))}
            <div className="border-b border-line-soft py-4 pr-4">
              <dt className="tech text-[10px] text-meta">Drivetrain</dt>
              <dd className="mt-1 font-display text-2xl font-semibold uppercase">{car.drivetrain}</dd>
            </div>
            <div className="border-b border-line-soft py-4 pr-4">
              <dt className="tech text-[10px] text-meta">Fuel</dt>
              <dd className="mt-1 font-display text-2xl font-semibold uppercase">{car.fuel}</dd>
            </div>
          </dl>

          {/* Price + CTA */}
          <div className="mt-8 border border-line bg-surface p-6">
            <p className="tech text-meta">Harga</p>
            <p className="mt-1 font-display text-4xl font-bold text-amber">
              {formatIDR(car.price)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href={`/kontak?intent=reserve&unit=${encodeURIComponent(
                  `${car.brand} ${car.name}`
                )}`}
                variant="solid"
              >
                Reserve Unit
              </Button>
              <Button
                href={`/kontak?intent=test-drive&unit=${encodeURIComponent(
                  `${car.brand} ${car.name}`
                )}`}
                variant="ghost"
              >
                Jadwalkan Test Drive
              </Button>
              <a
                href={`https://wa.me/622151408888?text=${encodeURIComponent(
                  `Halo Premium Cars, saya tertarik dengan ${car.brand} ${car.name} (${formatIDR(car.price)}). Apakah unit masih tersedia?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-line px-6 py-3 text-[13px] font-semibold uppercase tracking-tech text-ink transition-all hover:-translate-y-px hover:border-amber hover:text-amber"
              >
                <WaIcon /> WhatsApp
              </a>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href={`/jual/trade-in?target=${car.slug}`}
                className="tech inline-flex items-center gap-2 text-muted transition-colors hover:text-amber"
              >
                <SwapIcon /> Tukar tambah dengan mobil Anda — hitung ekuitas →
              </Link>
              <Link
                href={`/bandingkan?a=${car.slug}`}
                className="tech inline-flex items-center gap-2 text-muted transition-colors hover:text-amber"
              >
                <VsIcon /> Bandingkan dengan unit lain →
              </Link>
              <Link
                href={`/harga-pasar?make=${encodeURIComponent(car.brand)}&model=${encodeURIComponent(
                  car.name.split(" ")[0]
                )}&year=${car.year}`}
                className="tech inline-flex items-center gap-2 text-muted transition-colors hover:text-amber"
              >
                <ChartIcon /> Grafik harga pasar model ini →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Finance */}
      <section className="mt-section-sm">
        <h2 className="display accent-rule mb-8 text-3xl">Simulasi Cicilan</h2>
        <FinanceCalculator price={car.price} variant="full" />
      </section>

      {/* Related */}
      <section className="mt-section-sm">
        <h2 className="display accent-rule mb-8 text-3xl">Unit Serupa</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((c) => (
            <CarCard key={c.slug} car={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SwapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 9h10l-3-3M17 15H7l3 3" />
    </svg>
  );
}

function VsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5l6 14M14 5h6l-6 14h6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19V5M4 19h16M8 15l4-5 3 3 5-7" />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a9.9 9.9 0 0 0-8.6 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.1 8.1 0 1 1 12 20.1zm4.6-6c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.3z" />
    </svg>
  );
}
