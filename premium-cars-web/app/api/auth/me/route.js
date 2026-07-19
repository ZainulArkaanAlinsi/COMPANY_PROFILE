import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  return NextResponse.json({ ok: true, user: session || null });
}
