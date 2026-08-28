import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { listCars, createCar } from "@/lib/repo/cars";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ cars: listCars() });
}

export async function POST(req) {
  if (!getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const car = createCar(body);
    return NextResponse.json({ car }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Gagal menyimpan." }, { status: 400 });
  }
}
