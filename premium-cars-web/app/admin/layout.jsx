import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdmin } from "@/lib/admin";

export const metadata = { title: "Admin · Premium Cars", robots: { index: false } };
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventory", label: "Inventaris" },
];

export default function AdminLayout({ children }) {
  const admin = getAdmin();
  if (!admin) redirect("/masuk");

  return (
    <div className="frame py-10 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="tech text-amber">Admin Panel</p>
          <p className="display mt-1 text-2xl">Kontrol Pusat</p>
          <nav className="mt-6 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-xl px-4 py-2.5 text-[13px] font-semibold uppercase tracking-tech text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-line bg-surface p-4">
            <p className="text-[11px] uppercase tracking-tech text-meta">Masuk sebagai</p>
            <p className="mt-1 truncate text-sm font-semibold">{admin.name || admin.email}</p>
            <Link href="/" className="tech mt-3 inline-block text-amber">
              ← Lihat Situs
            </Link>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
