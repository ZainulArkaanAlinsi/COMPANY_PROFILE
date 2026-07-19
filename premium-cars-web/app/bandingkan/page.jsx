import { Suspense } from "react";
import CompareClient from "@/components/CompareClient";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Bandingkan Mobil | Premium Cars",
  description:
    "Adu dua unit head-to-head: tenaga, top speed, akselerasi, dan harga. Diagram kelebihan tiap mobil dalam satu layar.",
};

export default function BandingkanPage() {
  return (
    <div className="frame py-14 md:py-20">
      <Reveal as="header" className="max-w-2xl">
        <p className="tech mb-4 text-amber">Head to Head · Comparison Lab</p>
        <h1 className="display text-5xl md:text-7xl">
          Bandingkan <span className="text-muted">Mobil</span>
        </h1>
        <p className="mt-6 text-muted md:text-lg">
          Pilih dua unit dan lihat siapa unggul di tiap metrik — tenaga, top
          speed, akselerasi, hingga harga — lengkap dengan ringkasan
          kelebihannya.
        </p>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <Suspense fallback={<div className="min-h-[420px] border border-line bg-surface" />}>
          <CompareClient />
        </Suspense>
      </Reveal>
    </div>
  );
}
