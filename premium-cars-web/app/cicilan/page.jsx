import Link from "next/link";
import Button from "@/components/Button";
import FinanceCalculator from "@/components/FinanceCalculator";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Cicilan & Pembiayaan | Premium Cars",
  description:
    "Simulasikan cicilan kendaraan mewah Anda dengan tenor fleksibel dan mitra pembiayaan tepercaya.",
};

const steps = [
  { n: "01", t: "Pilih Unit", b: "Tentukan kendaraan dari katalog kurasi kami.", href: "/katalog" },
  { n: "02", t: "Simulasi", b: "Atur uang muka dan tenor untuk melihat estimasi angsuran.", href: null },
  { n: "03", t: "Pengajuan", b: "Ajukan pembiayaan melalui mitra leasing premium kami.", href: "/kontak?intent=financing" },
  { n: "04", t: "Serah Terima", b: "Selesaikan dokumen dan terima unit Anda.", href: null },
];

const partners = ["Mandiri Tunas Finance", "BCA Finance", "BFI Premium", "Clipan Finance", "Maybank Finance"];

export default function CicilanPage() {
  return (
    <div className="frame py-14 md:py-20">
      <Reveal as="header" className="max-w-2xl">
        <p className="tech mb-4 text-amber">Financing</p>
        <h1 className="display accent-rule text-6xl md:text-7xl">Cicilan</h1>
        <p className="mt-8 text-muted md:text-lg">
          Kepemilikan kendaraan impian dengan skema pembiayaan yang transparan.
          Simulasikan angsuran bulanan Anda secara instan.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
        <Reveal delay={100}>
          <FinanceCalculator price={2500000000} variant="full" />
        </Reveal>

        <Reveal delay={200} className="border border-line bg-surface p-8">
          <h3 className="display text-2xl">Kenapa Melalui Kami</h3>
          <ul className="mt-6 space-y-5">
            {[
              "Bunga kompetitif untuk kendaraan premium & langka",
              "Tenor fleksibel 1–6 tahun",
              "Proses persetujuan prioritas untuk member",
              "Asuransi all-risk terintegrasi",
            ].map((p) => (
              <li key={p} className="flex gap-3 text-sm text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/kontak?intent=financing" variant="ghost">
              Konsultasi Pembiayaan
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Steps */}
      <section className="mt-section-sm">
        <Reveal>
          <h2 className="display accent-rule mb-10 text-3xl">Alur Pengajuan</h2>
        </Reveal>
        <Reveal stagger className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-4">
          {steps.map((s) => {
            const inner = (
              <>
                <p className="display text-4xl text-amber">{s.n}</p>
                <h3 className="mt-4 font-display text-xl font-semibold uppercase">
                  {s.t}
                  {s.href && <span className="ml-2 text-amber">→</span>}
                </h3>
                <p className="mt-2 text-sm text-muted">{s.b}</p>
              </>
            );
            return s.href ? (
              <Link key={s.n} href={s.href} className="bg-surface p-8 transition-colors hover:bg-surface-2">
                {inner}
              </Link>
            ) : (
              <div key={s.n} className="bg-surface p-8">{inner}</div>
            );
          })}
        </Reveal>
      </section>

      {/* Partners */}
      <section className="mt-section-sm">
        <Reveal>
          <p className="tech mb-6 text-meta">Mitra Pembiayaan</p>
        </Reveal>
        <Reveal stagger className="flex flex-wrap gap-3">
          {partners.map((p) => (
            <span
              key={p}
              className="border border-line px-5 py-3 text-sm text-muted transition-colors hover:border-amber/50 hover:text-ink"
            >
              {p}
            </span>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
