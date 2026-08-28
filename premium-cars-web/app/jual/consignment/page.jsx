import Link from "next/link";
import Button from "@/components/Button";
import SmartImage from "@/components/SmartImage";
import ConsignmentForm from "@/components/ConsignmentForm";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Private Consignment | Premium Cars",
  description:
    "Ekosistem undangan-terbatas untuk aset otomotif paling signifikan. Jangkauan global, diskresi absolut, dan provenance forensik.",
};

export default function ConsignmentPage() {
  return (
    <div className="py-14 md:py-20">
      {/* Hero */}
      <section className="frame">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr,1fr]">
          <div>
            <h1 className="display text-6xl md:text-7xl">
              Consignment<br />
              <span className="text-amber">Excellence</span>
            </h1>
            <p className="mt-6 max-w-md text-muted">
              Ekosistem undangan-terbatas untuk aset otomotif paling signifikan
              di dunia. Kami menjembatani koleksi privat dan connoisseur global
              dengan diskresi absolut.
            </p>
          </div>
          <div className="lg:text-right">
            <p className="tech text-amber">Established 1998</p>
            <p className="display mt-2 text-2xl md:text-3xl">
              Rp 3T+ Nilai Transaksi
            </p>
          </div>
        </div>
      </section>

      {/* Featured asset — private treaty */}
      <section className="frame mt-14">
        <Reveal className="force-dark kenburns group relative overflow-hidden border border-line">
          <SmartImage
            src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=2000&q=80"
            alt="Ferrari LaFerrari — tersedia via private treaty"
            label="LaFerrari"
            className="h-[60vh] min-h-[420px] w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,11,0.85)] via-[rgba(15,13,11,0.12)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-6 md:p-10">
            <div>
              <p className="tech text-amber">Available via Private Treaty</p>
              <h2 className="display mt-2 text-4xl md:text-5xl">
                Ferrari LaFerrari
              </h2>
              <dl className="mt-4 flex gap-8">
                <Spec k="Year" v="2014" />
                <Spec k="Mileage" v="660 KM" />
                <Spec k="Location" v="Jakarta, ID" />
              </dl>
            </div>
            <Button
              href="/kontak?intent=consignment&unit=Ferrari%20LaFerrari%20(Private%20Treaty)"
              variant="solid"
              className="shrink-0"
            >
              Inquire Privately
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Bento — the consignment advantage */}
      <section className="frame mt-6">
        <Reveal stagger className="grid gap-6 md:grid-cols-12">
          <div className="flex flex-col justify-between border border-line bg-surface p-8 md:col-span-4">
            <div>
              <GlobeIcon />
              <h3 className="display mt-5 text-2xl">Global Reach</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Akses langsung ke kolektor UHNW di 42 negara. Aset Anda tidak
                sekadar dilisting — ia ditempatkan.
              </p>
            </div>
            <p className="display mt-10 text-5xl leading-none text-line md:text-6xl">
              42<br />Countries
            </p>
          </div>

          <div className="force-dark relative min-h-[300px] overflow-hidden border border-line md:col-span-8">
            <SmartImage
              src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80"
              alt="Bugatti Chiron — baru saja diamankan untuk klien"
              label="Bugatti Chiron"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,11,0.85)] via-[rgba(15,13,11,0.15)] to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="display text-3xl md:text-4xl">Bugatti Chiron</h3>
              <p className="tech mt-2 text-amber">Recently Secured</p>
            </div>
          </div>

          <div className="force-dark relative min-h-[300px] overflow-hidden border border-line md:col-span-7">
            <SmartImage
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
              alt="Interior kokpit — shadow catalog"
              label="Discretion"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-floor/75" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <h3 className="display text-2xl md:text-3xl">Absolute Discretion</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                Untuk listing yang tak pernah menyentuh publik — Shadow Catalog
                kami menghubungkan pemilik dengan pembeli terverifikasi dalam
                closed loop.
              </p>
              <Link
                href="/kontak"
                className="tech mt-6 border border-line px-6 py-2.5 text-ink transition-colors hover:border-amber hover:text-amber"
              >
                Request Private Access
              </Link>
            </div>
          </div>

          <div className="flex flex-col border border-line bg-surface p-8 md:col-span-5">
            <BadgeIcon />
            <h3 className="display mt-5 text-2xl">Forensic Provenance</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Setiap consignment menjalani verifikasi 140 titik dan penelusuran
              riwayat mendalam oleh master technician kami — sertifikasi yang
              menaikkan nilai jual akhir.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Discreet concierge */}
      <section className="frame mt-section-sm">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="display text-4xl md:text-5xl">
              Discreet<br /><span className="text-amber">Concierge</span>
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Siap mendiskusikan penempatan aset Anda? Senior consultant kami
              tersedia untuk perjalanan global dalam waktu singkat guna
              menginspeksi dan mengevaluasi koleksi Anda.
            </p>
            <ul className="mt-8 space-y-6">
              <li className="flex gap-4">
                <span className="mt-0.5 shrink-0 text-amber"><LockIcon /></span>
                <div>
                  <h3 className="tech text-ink">Encrypted Communication</h3>
                  <p className="mt-1 text-[13px] text-muted">
                    Kanal sinyal dan email aman untuk seluruh dokumentasi sensitif.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-0.5 shrink-0 text-amber"><PlaneIcon /></span>
                <div>
                  <h3 className="tech text-ink">Global Logistics</h3>
                  <p className="mt-1 text-[13px] text-muted">
                    Transportasi white-glove berasuransi ke destinasi mana pun.
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <ConsignmentForm />
          </Reveal>
        </div>
      </section>

      {/* Collector circle CTA */}
      <section className="frame mt-section-sm">
        <Reveal className="border border-line bg-surface px-6 py-16 text-center md:px-16 md:py-20">
          <h2 className="display mx-auto max-w-2xl text-4xl md:text-5xl">
            Join the <span className="text-amber">Collector</span> Circle
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-muted">
            Jaringan privat kami menerima first-refusal atas semua aset masuk
            sebelum mencapai galeri digital. Keanggotaan melalui undangan atau
            vetting.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href="/membership" variant="light">
              Apply for Membership
            </Button>
            <Button href="/membership" variant="ghost">
              View Criteria
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Spec({ k, v }) {
  return (
    <div>
      <dt className="tech text-[10px] text-meta">{k}</dt>
      <dd className="mt-1 font-display text-lg font-semibold uppercase">{v}</dd>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}
function BadgeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.5v.01M9.2 15.5c.7-1.8 1.5-2.7 2.8-2.7s2.1.9 2.8 2.7" />
      <circle cx="12" cy="12" r="3.4" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="10.5" width="14" height="9.5" rx="1" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}
function PlaneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10.5 13.5L4 11l16-7-7 16-2.5-6.5z" />
    </svg>
  );
}
