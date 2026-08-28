import AppraisalWizard from "@/components/AppraisalWizard";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";

export const metadata = {
  title: "Vehicle Appraisal | Premium Cars",
  description:
    "Formulir appraisal presisi — identitas kendaraan, integritas visual, dan spesifikasi mekanis. Estimasi high-end dalam 24 jam.",
};

const commitments = [
  {
    icon: ShieldIcon,
    title: "Penilai Bersertifikat",
    body: "Setiap valuasi ditinjau manual oleh mekanik senior dan analis pasar kami.",
  },
  {
    icon: GaugeIcon,
    title: "Valuasi Cepat",
    body: "Terima estimasi awal kelas premium dalam 24 jam sejak pengajuan.",
  },
  {
    icon: CardIcon,
    title: "Pembayaran Langsung",
    body: "Dana ditransfer via transfer terjamin dalam 2 jam setelah serah terima fisik.",
  },
];

export default function AppraisalPage() {
  return (
    <div className="py-14 md:py-20">
      <section className="frame">
        <div className="grid gap-12 lg:grid-cols-[280px,1fr]">
          {/* Sidebar — our commitment */}
          <Reveal as="aside" delay={150} className="lg:border-r lg:border-line-soft lg:pr-10">
            <h2 className="display accent-rule text-xl">Komitmen Kami</h2>
            <ul className="mt-10 space-y-8">
              {commitments.map((c) => (
                <li key={c.title} className="flex gap-4">
                  <span className="mt-0.5 shrink-0 text-amber">
                    <c.icon />
                  </span>
                  <div>
                    <h3 className="tech text-ink">{c.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      {c.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <figure className="mt-10 border border-line-soft bg-surface p-5">
              <blockquote className="text-[13px] italic leading-relaxed text-muted">
                &ldquo;Prosesnya sepresisi rekayasa 911 saya. Layanan tanpa
                banding.&rdquo;
              </blockquote>
              <figcaption className="tech mt-3 text-amber">
                — R. Wijaya, Kolektor
              </figcaption>
            </figure>
          </Reveal>

          {/* Form */}
          <div>
            <header className="mb-8">
              <h1 className="display text-5xl md:text-6xl">Penilaian Kendaraan</h1>
              <p className="mt-4 max-w-xl text-muted">
                Mulai transisi masterpiece otomotif Anda. Lengkapi kolom di
                bawah dengan presisi mekanis.
              </p>
            </header>
            <AppraisalWizard />
          </div>
        </div>
      </section>

      {/* Precision market intelligence */}
      <section className="frame mt-section-sm">
        <Reveal className="grid items-center gap-10 border border-line bg-surface p-6 md:p-10 lg:grid-cols-2">
          <SmartImage
            src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1400&q=80"
            alt="Detail mesin performa tinggi"
            label="Presisi"
            className="aspect-[4/3] w-full grayscale"
          />
          <div>
            <h2 className="display text-4xl md:text-5xl">
              Precision Market<br />Intelligence
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Algoritma valuasi kami memanfaatkan data lelang real-time,
              penjualan privat, dan penilaian kesehatan mekanis untuk
              menghasilkan angka yang akurat tanpa kompromi.
            </p>
            <dl className="mt-8 flex gap-12">
              <div>
                <dd className="font-display text-3xl font-bold text-amber">
                  <CountUp text="0-24H" />
                </dd>
                <dt className="tech mt-1 text-meta">Waktu Respons</dt>
              </div>
              <div>
                <dd className="font-display text-3xl font-bold text-amber">
                  <CountUp text="98,4%" />
                </dd>
                <dt className="tech mt-1 text-meta">Penerimaan Penawaran</dt>
              </div>
            </dl>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  );
}
function GaugeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 18a8 8 0 1 1 14 0" />
      <path d="M12 13l3.5-3.5" />
      <circle cx="12" cy="14" r="1.4" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="6" width="18" height="13" rx="1" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  );
}
