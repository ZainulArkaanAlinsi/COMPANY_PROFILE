// Helper klien untuk mengirim lead ke /api/leads.
// Return { ok, id?, error? } — tidak pernah melempar.
export async function submitLead(type, data) {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, ...data }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) {
      return { ok: false, error: json.error || "Gagal mengirim. Coba lagi." };
    }
    return { ok: true, id: json.id };
  } catch {
    return { ok: false, error: "Jaringan bermasalah. Periksa koneksi Anda." };
  }
}
