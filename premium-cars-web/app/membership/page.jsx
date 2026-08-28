import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { membershipTiers, membershipFaq } from "@/lib/content";

export const metadata = {
  title: "Membership | Premium Cars",
  description:
    "Bergabung dengan lingkaran eksklusif kolektor otomotif. Akses awal, concierge, dan acara privat.",
};

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-amber">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function MembershipPage() {
  return (
    <div className="frame py-14 md:py-20">
      <Reveal as="header" className="mx-auto max-w-3xl text-center">
        <p className="tech mb-4 text-amber">
          <span className="text-meta">N° 10 — </span>The Circle
        </p>
        <h1 className="display text-6xl leading-[0.9] md:text-8xl">Membership</h1>
        <p className="mx-auto mt-6 max-w-xl text-muted md:text-lg">
          Bergabunglah dengan lingkaran eksklusif para penikmat otomotif.
          Nikmati akses istimewa, layanan concierge, dan undangan acara privat.
        </p>
      </Reveal>

      <Reveal stagger className="mt-16 grid gap-6 lg:grid-cols-3">
        {membershipTiers.map((t) => (
          <div
            key={t.name}
            className={`flex flex-col border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 ${
              t.highlight ? "border-amber" : "border-line hover:border-amber/50"
            }`}
          >
            {t.highlight && (
              <span className="mb-4 inline-block w-max rounded-sm bg-amber px-3 py-1 text-[11px] font-semibold uppercase tracking-tech text-floor">
                Paling Banyak Dipilih
              </span>
            )}
            <h3 className="display text-3xl">{t.name}</h3>
            <p className="mt-2 font-display text-xl font-semibold text-amber">{t.price}</p>
            {t.ringkas && (
              <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-muted">
                {t.ringkas}
              </p>
            )}
            <ul className="mt-8 flex-1 space-y-4">
              {t.perks.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-muted">
                  <Check />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                href={`/kontak?intent=membership&tier=${encodeURIComponent(t.name)}`}
                variant={t.highlight ? "solid" : "ghost"}
                className="w-full"
              >
                {/^\s*(atas undangan|by invitation)/i.test(t.price)
                  ? "Ajukan Undangan"
                  : "Bergabung"}
              </Button>
            </div>
          </div>
        ))}
      </Reveal>

      <p className="mt-10 text-center text-sm leading-relaxed text-meta">
        Seluruh tingkat mencakup jaminan keabsahan dokumen dan berkas kondisi
        lengkap untuk setiap unit — dua hal yang juga kami berikan kepada
        pembeli non-anggota.
      </p>

      <section className="mt-section">
        <Reveal>
          <SectionHeader
            index={2}
            kicker="Sebelum Bergabung"
            title="Tiga hal yang sebaiknya Anda tanyakan"
          />
        </Reveal>
        <div className="mt-10 border-t border-line">
          {membershipFaq.map((f, i) => (
            <Reveal key={f.t} delay={i * 60}>
              <details className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6">
                  <h3 className="display text-lg leading-snug md:text-xl">{f.t}</h3>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-2xl leading-none text-amber transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-7 leading-relaxed text-muted">{f.j}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
