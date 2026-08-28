import { Suspense } from "react";
import EquityAnalyzer from "@/components/EquityAnalyzer";

export const metadata = {
  title: "Trade-In Evaluation — Equity Analyzer | Premium Cars",
  description:
    "Bandingkan aset Anda saat ini dengan unit target di inventaris kami. Hitung selisih ekuitas, matriks valuasi, dan estimasi pembiayaan secara instan.",
};

export default function TradeInPage() {
  return (
    <div className="py-14 md:py-20">
      <section className="frame">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <EquityAnalyzer />
        </Suspense>
      </section>
    </div>
  );
}
