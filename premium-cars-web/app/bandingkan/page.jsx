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
      <Reveal as="header">
        <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
          <p className="tech text-amber">
            <span className="text-meta">N° 08 — </span>Comparison Lab
          </p>
          <p className="tech hidden text-meta sm:block">Head to Head</p>
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.9] md:text-8xl">
          Bandingkan <span className="text-muted">Mobil</span>
        </h1>
        <p className="mt-6 max-w-2xl text-muted md:text-lg">
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
