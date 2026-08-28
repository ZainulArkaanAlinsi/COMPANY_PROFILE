import Link from "next/link";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import SectionHeader from "@/components/SectionHeader";
import {
  company, cerita, inspeksi, standar, keahlian, faq, tonggak, angka,
} from "@/lib/company";

export const metadata = {
  title: "Tentang Kami | Premium Cars",
  description:
    "Prosedur inspeksi tujuh tahap, standar yang bisa ditagih, dan rekam jejak sejak 1998. Bagaimana Premium Cars menilai sebuah kendaraan sebelum berani menawarkannya.",
};

export default function HeritagePage() {
  return (
    <div className="pb-20">
      {/* ── Pembuka ─────────────────────────────────────────────────────── */}
      <section className="frame pt-14 md:pt-20">
        <div className="flex animate-fade-up items-center justify-between gap-6 border-b border-line pb-4">
          <p className="tech text-amber">
            <span className="text-meta">N° 00 — </span>Tentang Kami
          </p>
          <p className="tech hidden text-meta sm:block">
            Est. {company.berdiri} · {company.kota}
          </p>
        </div>

        <h1 className="display mt-8 max-w-5xl text-[2.9rem] leading-[0.92] md:text-7xl lg:text-[5.2rem]">
          Kami tidak menjual mobil cepat.
          <br />
          <span className="text-amber">Kami menjual kepastian</span> tentang
          mobil cepat.
        </h1>

        <p className="mt-9 max-w-3xl text-lg leading-relaxed text-muted">
          {company.ringkas}
        </p>

        <Reveal stagger className="mt-14 grid gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {angka.map((a) => (
            <div key={a.l}>
              <p className="font-display text-5xl font-semibold leading-none text-ink md:text-6xl">
                <CountUp text={a.n} />
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-tech text-amber">{a.l}</p>
              <p className="mt-2 text-sm leading-relaxed text-meta">{a.k}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── Cerita ──────────────────────────────────────────────────────── */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader index={1} kicker="Asal Usul" title="Kenapa kami ada" />
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-3">
          {cerita.map((c, i) => (
            <Reveal key={c.judul} delay={i * 90}>
              <article className="flex h-full flex-col border-t border-line pt-6">
                <p className="tech text-amber">{c.kicker}</p>
                <h3 className="display mt-4 text-2xl leading-tight md:text-[1.75rem]">
                  {c.judul}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{c.isi}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Prosedur inspeksi — bagian terpenting halaman ini ────────────── */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader
            index={2}
            kicker="Prosedur"
            title="Tujuh tahap sebelum sebuah unit boleh ditawarkan"
          />
          <p className="mt-6 max-w-3xl leading-relaxed text-muted">
            Rata-rata 19 jam kerja teknisi per unit. Setiap tahap punya
            kriteria gugur yang jelas — bila terpenuhi, unit ditolak, berapa pun
            nilainya dan sedekat apa pun pemiliknya dengan kami.
          </p>
        </Reveal>

        <div className="mt-12 border-t border-line">
          {inspeksi.map((t, i) => (
            <Reveal key={t.no} delay={i * 60}>
              <article className="grid gap-4 border-b border-line py-8 md:grid-cols-[auto_1fr_1fr] md:gap-10">
                <div className="flex items-baseline gap-4 md:block">
                  <p className="font-display text-4xl leading-none text-amber md:text-5xl">
                    {t.no}
                  </p>
                  <p className="tech mt-0 text-meta md:mt-3">{t.durasi}</p>
                </div>
                <div>
                  <h3 className="display text-xl md:text-2xl">{t.judul}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{t.isi}</p>
                </div>
                {t.gugurBila !== "—" && (
                  <div className="border-l-2 border-amber/40 pl-5">
                    <p className="tech text-amber">Unit gugur bila</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {t.gugurBila}
                    </p>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Standar ─────────────────────────────────────────────────────── */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader
            index={3}
            kicker="Standar"
            title="Yang boleh Anda tagih dari kami"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {standar.map((s, i) => (
            <Reveal key={s.judul} delay={i * 60}>
              <div className="h-full rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-amber/50">
                <h3 className="display text-lg leading-snug">{s.judul}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.isi}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Tonggak ─────────────────────────────────────────────────────── */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader index={4} kicker="Rekam Jejak" title="Tujuh tonggak" />
        </Reveal>
        <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {tonggak.map((t, i) => (
            <Reveal key={t.tahun} delay={i * 50}>
              <article className="flex gap-6 border-t border-line pt-6">
                <p className="font-display shrink-0 text-2xl leading-none text-amber md:text-3xl">
                  {t.tahun}
                </p>
                <div>
                  <h3 className="display text-lg">{t.judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t.isi}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Keahlian ────────────────────────────────────────────────────── */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader index={5} kicker="Tim" title="Empat bidang keahlian" />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {keahlian.map((k, i) => (
            <Reveal key={k.bidang} delay={i * 60}>
              <div className="h-full border-t-2 border-amber/60 pt-5">
                <h3 className="display text-lg">{k.bidang}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{k.isi}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="frame mt-section">
        <Reveal>
          <SectionHeader
            index={6}
            kicker="Pertanyaan"
            title="Yang paling sering ditanyakan"
          />
        </Reveal>
        <div className="mt-12 border-t border-line">
          {faq.map((f, i) => (
            <Reveal key={f.t} delay={i * 50}>
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

      {/* ── Penutup ─────────────────────────────────────────────────────── */}
      <section className="frame mt-section">
        <Reveal>
          <div className="rounded-3xl border border-line bg-surface p-10 md:p-16">
            <p className="tech text-amber">Langkah berikutnya</p>
            <h2 className="display mt-5 max-w-2xl text-3xl leading-tight md:text-5xl">
              Bawa mekanik Anda sendiri. Kami tidak pernah menolaknya.
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted">
              Untuk unit di atas Rp 2 miliar, biaya inspeksi pihak ketiga kami
              tanggung. Penjual yang menolak permintaan ini patut Anda curigai.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button href="/katalog" variant="solid">
                Lihat Katalog
              </Button>
              <Link
                href="/kontak"
                className="tech group inline-flex items-center gap-2 text-ink transition-colors hover:text-amber"
              >
                Bicara dengan spesialis
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
