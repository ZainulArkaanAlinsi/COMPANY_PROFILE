// Katalog kendaraan via NHTSA vPIC (gratis, tanpa key).
//   GET /api/catalog                → daftar merek yang didukung UI
//   GET /api/catalog?make=Porsche&year=2005 → daftar model merek itu di tahun itu

import { NextResponse } from "next/server";
import { MAKES, YEAR_MIN, YEAR_MAX, getModels } from "@/lib/market";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const make = (searchParams.get("make") || "").trim();
  const year = Number(searchParams.get("year")) || YEAR_MAX;

  if (!make) {
    return NextResponse.json({ makes: MAKES, yearMin: YEAR_MIN, yearMax: YEAR_MAX });
  }
  if (year < YEAR_MIN || year > YEAR_MAX) {
    return NextResponse.json(
      { error: `Tahun harus ${YEAR_MIN}–${YEAR_MAX}.` },
      { status: 400 }
    );
  }

  try {
    const { count, models } = await getModels(make, year);
    return NextResponse.json({ make, year, count, models });
  } catch (e) {
    return NextResponse.json(
      { error: "Katalog vPIC tidak terjangkau: " + e.message },
      { status: 502 }
    );
  }
}
