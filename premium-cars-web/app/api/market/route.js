// Laporan harga pasar nasional & internasional untuk satu unit.
//   GET /api/market?make=Porsche&model=911&year=2020
//
// Sumber: vPIC (katalog) + MarketCheck/Auto.dev (listing internasional,
// opsional via key) + frankfurter (kurs) + faktor pajak impor untuk
// estimasi nasional. Tanpa key listing → mode "demo" berbasis data kurasi.

import { NextResponse } from "next/server";
import { getMarketReport, YEAR_MIN, YEAR_MAX } from "@/lib/market";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const make = (searchParams.get("make") || "").trim();
  const model = (searchParams.get("model") || "").trim();
  const yearRaw = searchParams.get("year");
  const year = yearRaw ? Number(yearRaw) : null;

  if (!make || !model) {
    return NextResponse.json(
      { error: "Parameter make dan model wajib diisi." },
      { status: 400 }
    );
  }
  if (year && (year < YEAR_MIN || year > YEAR_MAX)) {
    return NextResponse.json(
      { error: `Tahun harus ${YEAR_MIN}–${YEAR_MAX}.` },
      { status: 400 }
    );
  }

  try {
    const report = await getMarketReport({ make, model, year });
    return NextResponse.json({ ok: true, ...report });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Analisis pasar gagal: " + e.message },
      { status: 502 }
    );
  }
}
