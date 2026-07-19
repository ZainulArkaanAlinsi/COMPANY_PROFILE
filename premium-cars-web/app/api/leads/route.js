import { NextResponse } from "next/server";
import { validateLead, saveLead, readLeads } from "@/lib/leads";

export const runtime = "nodejs";

// Rate limit sederhana per-IP (in-memory, cukup untuk satu instance).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Payload JSON tidak valid." },
      { status: 400 }
    );
  }

  const check = validateLead(body);
  if (!check.ok) {
    return NextResponse.json(
      { ok: false, error: check.error },
      { status: 400 }
    );
  }

  const { type, company, ...data } = body;
  const { id } = await saveLead(check.type, data);
  return NextResponse.json({ ok: true, id });
}

// Inspeksi lead tersimpan (butuh ADMIN_TOKEN):
//   curl -H "authorization: Bearer $ADMIN_TOKEN" /api/leads
export async function GET(request) {
  const token = process.env.ADMIN_TOKEN;
  const auth = request.headers.get("authorization") || "";
  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const leads = await readLeads();
  return NextResponse.json({ ok: true, count: leads.length, leads });
}
