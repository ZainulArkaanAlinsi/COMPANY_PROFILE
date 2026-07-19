import Link from "next/link";
import SmartImage from "./SmartImage";
import { formatIDR } from "@/lib/cars";

const statusStyle = {
  "In Stock": "bg-amber text-floor",
  "New Arrival": "bg-ink text-floor",
  Reserved: "bg-surface-2 text-muted border border-line",
};

/**
 * Marketplace car card — luxury retail: rounded, hairline, spotlight media,
 * spec grid, price + CTA.
 */
export default function CarCard({ car, cta = "Detail" }) {
  const href = car.live ? "/kontak" : `/katalog/${car.slug}`;
  const label = car.live ? "Inquire" : cta;
  return (
    <article data-spotlight data-tilt className="card-lift group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface">
      <Link href={href} className="showroom relative block">
        <SmartImage
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          label={car.name}
          className="aspect-[4/3] w-full"
        />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-tech ${
            statusStyle[car.status] || "bg-surface-2 text-muted"
          }`}
        >
          {car.status}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="tech mb-2 text-amber">{car.eyebrow}</p>
        <Link href={href}>
          <h3 className="display text-2xl leading-tight transition-colors hover:text-amber">
            {car.name}
          </h3>
        </Link>
        {(car.year || typeof car.km === "number") && (
          <p className="tech mt-1.5 text-meta">
            {car.year || "—"}
            {typeof car.km === "number"
              ? car.km
                ? ` · ${car.km.toLocaleString("id-ID")} KM`
                : " · Baru"
              : ""}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-y-4 border-t border-line-soft pt-5">
          {car.specs.slice(0, 4).map((s) => (
            <div key={s.k}>
              <p className="tech text-[10px] text-meta">{s.k}</p>
              <p className="mt-1 font-display text-lg font-semibold uppercase">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-line-soft pt-5">
          <div>
            <p className="tech text-[10px] text-meta">Harga</p>
            <p className="mt-1 font-display text-lg font-semibold">{formatIDR(car.price)}</p>
          </div>
          <Link
            href={href}
            className="rounded-full bg-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber"
          >
            {label}
          </Link>
        </div>
      </div>
    </article>
  );
}
