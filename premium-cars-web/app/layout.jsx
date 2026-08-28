import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MotionLayer from "@/components/MotionLayer";
import { SITE_URL } from "@/lib/site-url";
import { SpeedInsights } from "@vercel/speed-insights/next";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "PREMIUM CARS | Engineered for Excellence",
  description:
    "Premium Cars — kurator kendaraan performa tinggi & rumah bagi kolektor. Company profile dan marketplace jual-beli mobil mewah dalam satu tempat.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "PREMIUM CARS | Engineered for Excellence",
    description:
      "Curated luxury automotive inventory. Company profile + marketplace jual-beli dalam satu website.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${oswald.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        <MotionLayer />
        <div className="grain" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <SpeedInsights />
      </body>
    </html>
  );
}
