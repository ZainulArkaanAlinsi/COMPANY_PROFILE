"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className="rounded-sm border border-line px-6 py-2.5 text-[12px] font-semibold uppercase tracking-tech text-ink transition-colors hover:border-amber hover:text-amber disabled:opacity-60"
    >
      {busy ? "Keluar…" : "Keluar"}
    </button>
  );
}
