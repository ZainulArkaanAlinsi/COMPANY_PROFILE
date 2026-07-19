// Lead pipeline (server-only): validate → persist → notify.
// Storage: append ke data/leads.json (lokal). Di serverless (Vercel) FS
// project read-only → jatuh ke /tmp (ephemeral). Untuk produksi nyata,
// set LEADS_WEBHOOK_URL (Slack/Discord/Zapier) dan/atau RESEND_API_KEY
// + LEADS_EMAIL_TO agar setiap lead terkirim keluar, bukan cuma tersimpan.

import { promises as fs } from "fs";
import path from "path";
import os from "os";

const TYPES = {
  contact: ["name", "email", "message"],
  newsletter: ["email"],
  appraisal: ["vin", "make", "model"],
  consignment: ["name", "details"],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(body) {
  const type = String(body?.type || "");
  const required = TYPES[type];
  if (!required) return { ok: false, error: "Tipe lead tidak dikenal." };

  // Honeypot — bot yang mengisi field tersembunyi ditolak diam-diam.
  if (body.company) return { ok: false, error: "Rejected." };

  for (const f of required) {
    const v = String(body[f] ?? "").trim();
    if (!v) return { ok: false, error: `Field "${f}" wajib diisi.` };
  }
  if (body.email && !EMAIL_RE.test(String(body.email).trim()))
    return { ok: false, error: "Format email tidak valid." };
  if (type === "appraisal") {
    const vin = String(body.vin).replace(/\s/g, "").toUpperCase();
    if (vin.length < 11 || vin.length > 17)
      return { ok: false, error: "VIN harus 11–17 karakter." };
  }
  if (type === "contact" && String(body.message).trim().length < 10)
    return { ok: false, error: "Pesan minimal 10 karakter." };

  return { ok: true, type };
}

export function makeReference(type) {
  const tag = { contact: "CTC", newsletter: "NWS", appraisal: "APR", consignment: "CSG" }[type] || "LEAD";
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PC-${tag}-${rand}-${new Date().getFullYear()}`;
}

async function persistToFile(lead) {
  const candidates = [
    path.join(process.cwd(), "data"),
    path.join(os.tmpdir(), "premium-cars"),
  ];
  for (const dir of candidates) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, "leads.json");
      let list = [];
      try {
        list = JSON.parse(await fs.readFile(file, "utf8"));
        if (!Array.isArray(list)) list = [];
      } catch {}
      list.push(lead);
      await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
      return file;
    } catch {}
  }
  return null;
}

export async function readLeads() {
  for (const dir of [
    path.join(process.cwd(), "data"),
    path.join(os.tmpdir(), "premium-cars"),
  ]) {
    try {
      const list = JSON.parse(
        await fs.readFile(path.join(dir, "leads.json"), "utf8")
      );
      if (Array.isArray(list)) return list;
    } catch {}
  }
  return [];
}

async function notifyWebhook(lead) {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return;
  try {
    const summary = Object.entries(lead.data)
      .map(([k, v]) => `• ${k}: ${v}`)
      .join("\n");
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        // "content" dibaca Discord, "text" dibaca Slack — kirim keduanya.
        content: `🏁 Lead baru [${lead.type}] ${lead.id}\n${summary}`,
        text: `🏁 Lead baru [${lead.type}] ${lead.id}\n${summary}`,
        lead,
      }),
    });
  } catch (e) {
    console.error("[leads] webhook gagal:", e?.message);
  }
}

async function notifyEmail(lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_EMAIL_TO;
  if (!key || !to) return;
  try {
    const rows = Object.entries(lead.data)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#888">${k}</td><td>${String(v)}</td></tr>`)
      .join("");
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEADS_EMAIL_FROM || "Premium Cars <onboarding@resend.dev>",
        to: [to],
        subject: `[Premium Cars] Lead ${lead.type} — ${lead.id}`,
        html: `<h2>Lead baru: ${lead.type}</h2><p>Ref: <b>${lead.id}</b> · ${lead.createdAt}</p><table>${rows}</table>`,
      }),
    });
  } catch (e) {
    console.error("[leads] email gagal:", e?.message);
  }
}

export async function saveLead(type, data) {
  const lead = {
    id: makeReference(type),
    type,
    data,
    createdAt: new Date().toISOString(),
  };
  console.log("[leads] diterima:", JSON.stringify(lead));
  const file = await persistToFile(lead);
  await Promise.all([notifyWebhook(lead), notifyEmail(lead)]);
  return { id: lead.id, storedAt: file };
}
