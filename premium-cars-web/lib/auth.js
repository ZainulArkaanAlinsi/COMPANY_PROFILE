// Auth ringan berbasis file + cookie sesi bertanda tangan HMAC (server-only).
// User disimpan di data/users.json (lokal) / /tmp (Vercel, ephemeral —
// sambungkan DB riil untuk produksi; bentuk fungsinya sudah siap diganti).
// Password di-hash scrypt dengan salt per-user. Set AUTH_SECRET di env
// produksi agar sesi tidak bisa dipalsukan.

import { promises as fs } from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

const SECRET =
  process.env.AUTH_SECRET || "dev-secret-premium-cars-ganti-di-produksi";
export const SESSION_COOKIE = "pc_session";
const SESSION_DAYS = 7;

/* ── Penyimpanan user ──────────────────────────────────────────────── */

function storeDirs() {
  return [
    path.join(process.cwd(), "data"),
    path.join(os.tmpdir(), "premium-cars"),
  ];
}

async function readUsers() {
  for (const dir of storeDirs()) {
    try {
      const list = JSON.parse(
        await fs.readFile(path.join(dir, "users.json"), "utf8")
      );
      if (Array.isArray(list)) return list;
    } catch {}
  }
  return [];
}

async function writeUsers(users) {
  for (const dir of storeDirs()) {
    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(
        path.join(dir, "users.json"),
        JSON.stringify(users, null, 2),
        "utf8"
      );
      return true;
    } catch {}
  }
  return false;
}

/* ── Password hashing (scrypt + salt) ─────────────────────────────── */

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 })
    .toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expected) {
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ── Sesi: token = base64url(payload).base64url(hmac) ─────────────── */

const b64u = (buf) => Buffer.from(buf).toString("base64url");

function sign(payloadStr) {
  return crypto.createHmac("sha256", SECRET).update(payloadStr).digest("base64url");
}

export function createSessionToken(user) {
  const payload = JSON.stringify({
    email: user.email,
    name: user.name,
    exp: Date.now() + SESSION_DAYS * 86400_000,
  });
  const p = b64u(payload);
  return `${p}.${sign(p)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [p, sig] = token.split(".");
  const expected = sign(p);
  const a = Buffer.from(sig || "", "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return { email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  };
}

/* ── Operasi akun ─────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser({ name, email, password }) {
  name = String(name || "").trim();
  email = String(email || "").trim().toLowerCase();
  password = String(password || "");
  if (name.length < 2) return { error: "Nama minimal 2 karakter." };
  if (!EMAIL_RE.test(email)) return { error: "Format email tidak valid." };
  if (password.length < 6) return { error: "Password minimal 6 karakter." };

  const users = await readUsers();
  if (users.some((u) => u.email === email))
    return { error: "Email sudah terdaftar — silakan masuk." };

  const { salt, hash } = hashPassword(password);
  const user = { name, email, salt, hash, createdAt: new Date().toISOString() };
  users.push(user);
  await writeUsers(users);
  return { user: { name, email, createdAt: user.createdAt } };
}

export async function loginUser({ email, password }) {
  email = String(email || "").trim().toLowerCase();
  const users = await readUsers();
  const user = users.find((u) => u.email === email);
  if (!user || !verifyPassword(String(password || ""), user.salt, user.hash))
    return { error: "Email atau password salah." };
  return { user: { name: user.name, email: user.email, createdAt: user.createdAt } };
}

export async function getUserByEmail(email) {
  const users = await readUsers();
  const user = users.find((u) => u.email === String(email).toLowerCase());
  if (!user) return null;
  return { name: user.name, email: user.email, createdAt: user.createdAt };
}
