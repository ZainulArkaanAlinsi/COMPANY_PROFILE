import Link from "next/link";
import Button from "@/components/Button";
import AppraisalForm from "@/components/AppraisalForm";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { recentTransactions } from "@/lib/content";

export const metadata = {
  title: "Jual & Tukar Mobil | Premium Cars",
  description:
    "Lepas unit Anda dengan cara yang benar — penilaian terukur, program tukar tambah, dan konsinyasi privat untuk kendaraan performa tinggi.",
};

const stats = [
  { k: "Market Reach", v: "Global" },
  { k: "Appraisal Time", v: "24H" },
  { k: "Trust Score", v: "99,8%" },
];

const appraisalSteps = [
  { n: "01", t: "Vehicle Specs", b: "VIN dan detail performa." },
  { n: "02", t: "Physical State", b: "Riwayat servis & estetika." },
  { n: "03", t: "Contact", b: "Penawaran final diantar." },
];

const paths = [
  {
    tag: "Upgrade Path",
    title: "Trade-In Program",
    body: "Jembatani kendaraan Anda saat ini dengan evolusi berikutnya. Ekuitas Anda langsung diperhitungkan ke unit mana pun di inventaris kurasi kami.",
    href: "/jual/trade-in",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80",
    stats: [
      { k: "Direct Credit", v: "Instant" },
      { k: "Equity Report", v: "Real-Time" },
    ],
  },
  {
    tag: "Discreet Sale",
    title: "Private Consignment",
    body: "Untuk aset langka yang membutuhkan pembeli terkurasi. Kami memanfaatkan jaringan kolektor global untuk transaksi off-market dengan kerahasiaan absolut.",
    href: "/jual/consignment",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    stats: [
      { k: "Network Access", v: "VIP Only" },
      { k: "Avg. Premium", v: "+12%" },
    ],
  },
];

export default function JualPage() {
  return (
    <div className="py-14 md:py-20">
      {/* Hero — convert your masterpiece */}
      <section className="frame">
        <div className="flex animate-fade-up items-center justify-between gap-6 border-b border-line pb-4">
          <p className="tech text-amber">
            <span className="text-meta">N° 07 — </span>Concierge
          </p>
          <p className="tech hidden text-meta sm:block">Jual &amp; Tukar Tambah</p>
        </div>
        <div className="mt-8 max-w-2xl">
          <h1 className="display text-6xl md:text-8xl">
            <span className="hero-line">
              <span style={{ "--line-delay": "150ms" }}>Lepas Unit</span>
            </span>
            <span className="hero-line">
              <span className="text-amber" style={{ "--line-delay": "280ms" }}>
                Anda
              </span>
            </span>
          </h1>
          <p
            className="mt-6 max-w-lg animate-fade-up text-muted md:text-lg"
            style={{ animationDelay: "450ms" }}
          >
            Baik menambah koleksi maupun melepasnya, penilaian kami berangkat
            dari transaksi pembanding yang benar-benar terjadi — bukan dari
            harga penawaran yang tidak pernah laku.
          </p>
          <div
            className="mt-9 flex animate-fade-up flex-wrap gap-4"
            style={{ animationDelay: "600ms" }}
          >
            <Button href="/jual/appraisal" variant="solid">
              Appraise Now
            </Button>
            <Button href="/jual/consignment" variant="ghost">
              Private Sale
            </Button>
          </div>
        </div>
        <Reveal as="dl" stagger className="mt-16 grid grid-cols-3 gap-6 border-t border-line-soft pt-8 md:max-w-2xl">
          {stats.map((s) => (
            <div key={s.k}>
              <dt className="tech text-meta">{s.k}</dt>
              <dd className="display mt-2 text-2xl md:text-3xl">
                <CountUp text={s.v} />
              </dd>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Professional appraisal — estimator instan */}
      <section className="frame mt-section-sm">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,340px),1fr] lg:gap-16">
          <Reveal>
            <h2 className="display accent-rule text-4xl md:text-5xl">
              Professional<br />Appraisal
            </h2>
            <p className="mt-8 max-w-xs text-sm leading-relaxed text-muted">
              Proses verifikasi multi-titik kami memanfaatkan data lelang
              global real-time untuk valuasi paling akurat atas kendaraan
              eksotis Anda.
            </p>
            <ol className="mt-8 space-y-5">
              {appraisalSteps.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="font-display text-lg font-bold text-amber">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="tech text-ink">{s.t}</h3>
                    <p className="mt-0.5 text-[13px] text-muted">{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              href="/jual/appraisal"
              className="tech mt-8 inline-block text-ink transition-colors hover:text-amber"
            >
              Formulir Appraisal Lengkap →
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <AppraisalForm />
          </Reveal>
        </div>
      </section>

      {/* Acquisition paths */}
      <section className="frame mt-section-sm">
        <Reveal as="header" className="max-w-xl">
          <h2 className="display accent-rule text-4xl md:text-5xl">
            Acquisition Paths
          </h2>
          <p className="mt-8 text-muted">
            Solusi terukur bagi kolektor cerdas — bertransisi ke masterpiece
            berikutnya atau keluar secara diskret.
          </p>
        </Reveal>
        <Reveal stagger className="mt-10 grid gap-6 lg:grid-cols-2">
          {paths.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="force-dark group relative flex min-h-[360px] flex-col justify-between overflow-hidden border border-line p-8 md:p-10"
            >
              <SmartImage
                src={p.image}
                alt={p.title}
                label={p.title}
                className="absolute inset-0 h-full w-full opacity-40 transition-opacity duration-500 group-hover:opacity-60"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,11,0.9)] via-[rgba(15,13,11,0.55)] to-[rgba(15,13,11,0.3)]" />
              <span className="tech relative inline-block self-start border border-amber/60 px-3 py-1.5 text-amber">
                {p.tag}
              </span>
              <span className="relative mt-auto block pt-16">
                <span className="display block text-3xl md:text-4xl">
                  {p.title}
                </span>
                <span className="mt-3 block max-w-md text-sm leading-relaxed text-muted">
                  {p.body}
                </span>
                <span className="mt-7 flex items-end justify-between border-t border-line-soft pt-5">
                  <span className="flex gap-10">
                    {p.stats.map((s) => (
                      <span key={s.k} className="block">
                        <span className="tech block text-[10px] text-meta">
                          {s.k}
                        </span>
                        <span className="mt-1 block font-display text-lg font-semibold uppercase">
                          {s.v}
                        </span>
                      </span>
                    ))}
                  </span>
                  <span className="text-amber transition-transform duration-300 group-hover:translate-x-1.5">
                    <ArrowIcon />
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* Recent transactions */}
      <section className="frame mt-section-sm">
        <Reveal className="flex items-end justify-between gap-6">
          <h2 className="display accent-rule text-4xl md:text-5xl">
            Recent Transactions
          </h2>
          <p className="tech flex items-center gap-2 text-meta">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
            Live Data Feed
          </p>
        </Reveal>
        <Reveal stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {recentTransactions.map((t) => (
            <article key={t.name} className="group border border-line bg-surface">
              <div className="relative">
                <SmartImage
                  src={t.image}
                  alt={t.name}
                  label={t.name}
                  className="aspect-[16/10] w-full grayscale transition-all duration-500 group-hover:grayscale-0"
                />
                <span className="absolute bottom-4 left-4 bg-amber px-3 py-1 text-[10px] font-bold uppercase tracking-tech text-floor">
                  {t.status}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold uppercase">
                  {t.name}
                </h3>
                <div className="mt-4 flex items-end justify-between border-t border-line-soft pt-4">
                  <div>
                    <p className="tech text-[10px] text-meta">{t.metric}</p>
                    <p className="mt-1 font-display text-lg font-semibold text-amber">
                      {t.value}
                    </p>
                  </div>
                  <p className="tech text-meta">{t.time}</p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <section className="frame mt-section-sm">
        <Reveal className="border border-line bg-surface px-6 py-16 text-center md:px-16 md:py-24">
          <h2 className="display mx-auto max-w-3xl text-4xl md:text-6xl">
            Ready to Evolve Your{" "}
            <span className="text-amber">Collection?</span>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/jual/appraisal" variant="solid">
              Start Appraisal
            </Button>
            <Button href="/kontak" variant="ghost">
              Contact Expert
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h15m0 0l-5.5-5.5M19 12l-5.5 5.5" />
    </svg>
  );
}
