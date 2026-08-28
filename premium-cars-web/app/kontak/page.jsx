import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { jalurKontak, alurSetelahKontak } from "@/lib/company";

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
        <p className="tech mb-4 text-amber">Hubungi Kami</p>
        <h1 className="display accent-rule text-6xl md:text-7xl">Kontak</h1>
        <p className="mt-8 text-muted md:text-lg">
          Empat jalur, empat orang yang berbeda. Pilih yang sesuai dengan
          urusan Anda di bawah — beserta apa yang perlu disiapkan supaya
          balasan pertama kami sudah berisi jawaban, bukan pertanyaan balik.
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

      {/* ── Jalur kontak ─────────────────────────────────────────────── */}
      <section className="mt-section">
        <Reveal>
          <SectionHeader
            index={1}
            kicker="Jalur"
            title="Empat urusan, empat jalur"
          />
        </Reveal>
        <div className="mt-12 border-t border-line">
          {jalurKontak.map((j, i) => (
            <Reveal key={j.untuk} delay={i * 60}>
              <article className="grid gap-5 border-b border-line py-8 md:grid-cols-[1.1fr_1fr_auto] md:gap-10">
                <div>
                  <h3 className="display text-xl md:text-2xl">{j.untuk}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{j.isi}</p>
                </div>
                <div>
                  <p className="tech text-amber">Siapkan</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{j.siapkan}</p>
                </div>
                <div className="md:text-right">
                  <p className="tech text-meta">Balasan</p>
                  <p className="mt-2 whitespace-nowrap font-display text-lg font-semibold">
                    {j.balasan}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Alur setelah menghubungi ─────────────────────────────────── */}
      <section className="mt-section">
        <Reveal>
          <SectionHeader
            index={2}
            kicker="Alur"
            title="Yang terjadi setelah Anda menghubungi"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {alurSetelahKontak.map((a, i) => (
            <Reveal key={a.no} delay={i * 70}>
              <div className="h-full border-t-2 border-amber/50 pt-5">
                <p className="font-display text-3xl leading-none text-amber">{a.no}</p>
                <h3 className="display mt-4 text-lg">{a.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.isi}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
