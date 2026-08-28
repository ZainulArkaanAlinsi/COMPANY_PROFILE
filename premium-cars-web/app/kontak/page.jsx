import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Kontak | Premium Cars",
  description: "Hubungi showroom Premium Cars di SCBD, Jakarta Selatan.",
};

const details = [
  { k: "Showroom", v: "SCBD District 8, Level 42\nJakarta Selatan, 12190" },
  { k: "Telepon", v: "+62 21 5140 8888" },
  { k: "Email", v: "concierge@premium-cars.id" },
  { k: "Jam Operasional", v: "Senin – Sabtu · 09.00 – 20.00 WIB" },
];

export default function KontakPage() {
  return (
    <div className="frame py-14 md:py-20">
      <Reveal as="header" className="max-w-2xl">
        <p className="tech mb-4 text-amber">Get in Touch</p>
        <h1 className="display accent-rule text-6xl md:text-7xl">Kontak</h1>
        <p className="mt-8 text-muted md:text-lg">
          Tim concierge kami siap membantu akuisisi, penjualan, maupun
          konsultasi pembiayaan kendaraan mewah Anda.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.7fr]">
        <Reveal delay={100}>
          <Suspense fallback={<div className="min-h-[420px] border border-line bg-surface" />}>
            <ContactForm />
          </Suspense>
        </Reveal>

        {/* Details */}
        <Reveal delay={200} className="space-y-px overflow-hidden border border-line bg-line">
          {details.map((d) => (
            <div key={d.k} className="group bg-surface p-6 transition-colors hover:bg-surface-2">
              <p className="tech text-meta transition-colors group-hover:text-amber">{d.k}</p>
              <p className="mt-2 whitespace-pre-line font-display text-lg font-semibold uppercase leading-snug">
                {d.v}
              </p>
            </div>
          ))}
          {/* Koordinat showroom — blok peta bergaya teknis */}
          <div className="garage-gradient relative overflow-hidden p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(var(--pc-ink) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--pc-ink) / 0.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <span className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inset-0 animate-ping rounded-full bg-amber/50" />
              <span className="absolute inset-0 rounded-full bg-amber" />
            </span>
            <div className="relative flex items-end justify-between gap-4 pt-16">
              <div>
                <p className="tech text-meta">Koordinat</p>
                <p className="mt-1 font-display text-lg font-semibold">
                  6°13′38″S · 106°48′29″E
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=SCBD+District+8+Jakarta"
                target="_blank"
                rel="noreferrer"
                className="tech shrink-0 border border-line px-5 py-2.5 text-ink transition-colors hover:border-amber hover:text-amber"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
