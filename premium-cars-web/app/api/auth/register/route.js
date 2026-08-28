import { NextResponse } from "next/server";
import {
  registerUser,
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Payload tidak valid." }, { status: 400 });
  }

  const result = await registerUser(body);
  if (result.error) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, user: result.user });
  res.cookies.set(SESSION_COOKIE, createSessionToken(result.user), sessionCookieOptions());
  return res;
}
