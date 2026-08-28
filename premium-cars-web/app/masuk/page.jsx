import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Masuk / Daftar | Premium Cars",
  description:
    "Masuk ke akun Premium Cars untuk menyimpan pencarian, mengikuti unit favorit, dan mengakses layanan concierge.",
};

const perks = [
  "Simpan unit favorit & pantau pergerakan harganya",
  "Riwayat appraisal, trade-in, dan inquiry dalam satu tempat",
  "Prioritas undangan viewing privat & drop inventaris baru",
];

export default function MasukPage() {
  return (
    <div className="frame py-14 md:py-20">
      <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="tech mb-4 text-amber">Owner&rsquo;s Circle</p>
          <h1 className="display text-5xl md:text-6xl">
            Selamat<br />Datang <span className="text-amber">Kembali</span>
          </h1>
          <p className="mt-5 max-w-sm text-muted">
            Satu akun untuk seluruh layanan Premium Cars — marketplace,
            appraisal, dan concierge.
          </p>
          <ul className="mt-8 space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--pc-amber))" strokeWidth="2" className="mt-0.5 shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <Suspense fallback={<div className="min-h-[420px] border border-line bg-surface" />}>
            <AuthForm />
          </Suspense>
        </Reveal>
      </div>
    </div>
  );
}
