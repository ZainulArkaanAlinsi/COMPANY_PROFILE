import Link from "next/link";
import Button from "@/components/Button";
import FinanceCalculator from "@/components/FinanceCalculator";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { syaratPembiayaan, berkasPembiayaan } from "@/lib/company";

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
      <Reveal as="header">
        <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
          <p className="tech text-amber">
            <span className="text-meta">N° 09 — </span>Pembiayaan
          </p>
          <p className="tech hidden text-meta sm:block">Pembiayaan Premium</p>
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.9] md:text-8xl">Cicilan</h1>
        <p className="mt-6 max-w-2xl text-muted md:text-lg">
          Simulasikan angsurannya di bawah. Tetapi angka angsuran bukan yang
          menentukan pengajuan Anda disetujui — empat hal di bagian bawah
          halaman ini yang menentukannya, dan tiga di antaranya jarang
          disebutkan sebelum berkas Anda ditolak.
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

      {/* ── Apa yang sebenarnya menentukan persetujuan ───────────────── */}
      <section className="mt-section">
        <Reveal>
          <SectionHeader
            index={2}
            kicker="Yang Menentukan"
            title="Empat hal yang menentukan pengajuan Anda"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {syaratPembiayaan.map((x, i) => (
            <Reveal key={x.judul} delay={i * 70}>
              <div className="h-full rounded-2xl border border-line bg-surface p-7">
                <h3 className="display text-lg leading-snug md:text-xl">{x.judul}</h3>
                <p className="mt-3 leading-relaxed text-muted">{x.isi}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Berkas ───────────────────────────────────────────────────── */}
      <section className="mt-section">
        <Reveal>
          <SectionHeader index={3} kicker="Berkas" title="Yang perlu disiapkan" />
        </Reveal>
        <Reveal delay={80}>
          <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {berkasPembiayaan.map((b) => (
              <li key={b} className="flex gap-3 border-t border-line pt-4 text-sm text-muted">
                <span aria-hidden="true" className="text-amber">—</span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-meta">
            Kami menyiapkan dan memeriksa berkas ini bersama Anda sebelum
            diajukan. Pengajuan yang ditolak tercatat di sistem lembaga
            pembiayaan, jadi lebih baik ditunda daripada diajukan setengah
            matang.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
