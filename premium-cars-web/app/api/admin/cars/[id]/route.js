import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { getCarById, updateCar, deleteCar } from "@/lib/repo/cars";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  if (!getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const car = getCarById(params.id);
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ car });
}

export async function PUT(req, { params }) {
  if (!getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const car = updateCar(params.id, body);
    if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ car });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Gagal menyimpan." }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  if (!getAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = deleteCar(params.id);
  return NextResponse.json({ ok });
}
