import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import { membershipTiers } from "@/lib/content";

export const metadata = {
  title: "Membership | Premium Cars",
  description:
    "Bergabung dengan lingkaran eksklusif kolektor otomotif. Akses awal, concierge, dan acara privat.",
};

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0724A" strokeWidth="2" className="mt-0.5 shrink-0">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function MembershipPage() {
  return (
    <div className="frame py-14 md:py-20">
      <Reveal as="header" className="mx-auto max-w-2xl text-center">
        <p className="tech mb-4 text-amber">The Circle</p>
        <h1 className="display text-5xl md:text-7xl">Membership</h1>
        <p className="mt-6 text-muted md:text-lg">
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
                Most Popular
              </span>
            )}
            <h3 className="display text-3xl">{t.name}</h3>
            <p className="mt-2 font-display text-xl font-semibold text-amber">{t.price}</p>
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
                {t.price === "By Invitation" ? "Ajukan Undangan" : "Bergabung"}
              </Button>
            </div>
          </div>
        ))}
      </Reveal>

      <p className="mt-10 text-center text-sm text-meta">
        Semua tier mencakup garansi keaslian dan akses ke platform trade-in prioritas.
      </p>
    </div>
  );
}
