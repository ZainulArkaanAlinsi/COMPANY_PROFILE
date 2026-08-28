// Route handler: live car specifications via API Ninjas (/v1/cars).
// Mirrors the existing project's /api/ninjas proxy. The X-Api-Key is injected
// server-side from env (API_NINJAS_KEY) and never exposed to the browser.
//
//   GET /api/specs?make=BMW&model=M4

import { NextResponse } from "next/server";

const UPSTREAM = "https://api.api-ninjas.com/v1/cars";

export async function GET(request) {
  const key = process.env.API_NINJAS_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "API_NINJAS_KEY belum di-set. Fitur Cek Spesifikasi live nonaktif." },
      { status: 501 }
    );
  }

  const { searchParams } = new URL(request.url);
  const make = (searchParams.get("make") || "").trim();
  const model = (searchParams.get("model") || "").trim();
  if (!make && !model) {
    return NextResponse.json({ error: "Isi minimal merek atau model." }, { status: 400 });
  }

  const q = new URLSearchParams();
  if (make) q.set("make", make);
  if (model) q.set("model", model);

  try {
    const r = await fetch(`${UPSTREAM}?${q}`, {
      headers: { "X-Api-Key": key },
      cache: "no-store",
    });
    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return NextResponse.json({ error: "Proxy gagal: " + e.message }, { status: 502 });
  }
}
