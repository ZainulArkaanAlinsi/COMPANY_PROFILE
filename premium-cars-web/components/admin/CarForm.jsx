"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const FIELDS = [
  { k: "brand", label: "Merek", required: true },
  { k: "name", label: "Nama Model", required: true },
  { k: "eyebrow", label: "Tagline / Eyebrow" },
  { k: "year", label: "Tahun", type: "number" },
  { k: "category", label: "Kategori" },
  { k: "bodyStyle", label: "Body Style" },
  { k: "drivetrain", label: "Drivetrain" },
  { k: "fuel", label: "Bahan Bakar" },
  { k: "price", label: "Harga (IDR)", type: "number" },
  { k: "hp", label: "Tenaga (HP)", type: "number" },
];

const STATUSES = ["In Stock", "New Arrival", "Reserved"];

export default function CarForm({ car }) {
  const router = useRouter();
  const editing = !!car;
  const [form, setForm] = useState(() => ({
    brand: car?.brand || "",
    name: car?.name || "",
    eyebrow: car?.eyebrow || "",
    year: car?.year || "",
    category: car?.category || "",
    bodyStyle: car?.bodyStyle || "",
    drivetrain: car?.drivetrain || "",
    fuel: car?.fuel || "",
    price: car?.price || "",
    hp: car?.hp || "",
    status: car?.status || "In Stock",
    image: car?.image || "",
    galleryText: (car?.gallery || []).join("\n"),
    specsText: (car?.specs || []).map((s) => `${s.k}: ${s.v}`).join("\n"),
  }));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const gallery = form.galleryText.split("\n").map((s) => s.trim()).filter(Boolean);
    const specs = form.specsText
      .split("\n")
      .map((line) => {
        const i = line.indexOf(":");
        if (i < 0) return null;
        return { k: line.slice(0, i).trim(), v: line.slice(i + 1).trim() };
      })
      .filter((s) => s && s.k);
    const payload = { ...form, gallery, specs };

    try {
      const res = await fetch(editing ? `/api/admin/cars/${car.id}` : "/api/admin/cars", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan.");
      router.push("/admin/inventory");
      router.refresh();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl">
      {error && (
        <p className="mb-6 rounded-xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.k} className="block">
            <span className="text-[11px] font-semibold uppercase tracking-tech text-meta">
              {f.label}{f.required && " *"}
            </span>
            <input
              type={f.type || "text"}
              value={form[f.k]}
              onChange={set(f.k)}
              required={f.required}
              className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
            />
          </label>
        ))}

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-tech text-meta">Status</span>
          <select
            value={form.status}
            onChange={set("status")}
            className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-ink"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-tech text-meta">
            URL Gambar Utama
          </span>
          <input
            value={form.image}
            onChange={set("image")}
            placeholder="https://…"
            className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-tech text-meta">
            Galeri (satu URL per baris)
          </span>
          <textarea
            rows={3}
            value={form.galleryText}
            onChange={set("galleryText")}
            className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-tech text-meta">
            Spesifikasi (satu per baris — format “Label: Nilai”)
          </span>
          <textarea
            rows={4}
            value={form.specsText}
            onChange={set("specsText")}
            placeholder={"Top Speed: 350 KM/H\n0–100: 2.8 s"}
            className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-ink px-8 py-3 text-[12px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber disabled:opacity-50"
        >
          {busy ? "Menyimpan…" : editing ? "Simpan Perubahan" : "Tambah Unit"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/inventory")}
          className="rounded-full border border-line px-6 py-3 text-[12px] font-semibold uppercase tracking-tech text-muted transition-colors hover:text-ink"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
