// Gate admin — sesi login + allowlist email admin.
// Default admin = pemilik proyek; override via env ADMIN_EMAILS (koma).
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "./auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "zainaril13@gmail.com")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.includes(String(email).toLowerCase());
}

export function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token); // { email, name } | null
}

/** Kembalikan user admin bila sesi valid & email termasuk admin, else null. */
export function getAdmin() {
  const user = getSessionUser();
  if (user && isAdminEmail(user.email)) return { ...user, isAdmin: true };
  return null;
}
