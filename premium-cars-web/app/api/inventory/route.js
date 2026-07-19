// Route handler exposing the current inventory as JSON.
// Live (MarketCheck) when MARKETCHECK_API_KEY is set, else curated local data.
//   GET /api/inventory  ->  { source, count, cars }

import { NextResponse } from "next/server";
import { getInventory } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export async function GET() {
  const { source, cars, error } = await getInventory();
  return NextResponse.json({ source, count: cars.length, error, cars });
}
