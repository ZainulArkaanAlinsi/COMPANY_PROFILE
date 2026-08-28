import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifySessionToken, SESSION_COOKIE, getUserByEmail } from "@/lib/auth";
import { readLeads } from "@/lib/leads";
import LogoutButton from "@/components/LogoutButton";
import Button from "@/components/Button";

export const metadata = { title: "Akun Saya | Premium Cars" };
export const dynamic = "force-dynamic";

const LABELS = {
  contact: "Pesan Kontak",
  appraisal: "Penilaian Kendaraan",
  consignment: "Konsinyasi",
  newsletter: "Buletin",
};

export default async function AkunPage() {
  const session = verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
  if (!session) redirect("/masuk?next=/akun");

  const user = (await getUserByEmail(session.email)) || session;
  const leads = (await readLeads())
    .filter((l) => (l.data?.email || "").toLowerCase() === session.email)
    .reverse()
    .slice(0, 8);

  return (
    <div className="frame py-14 md:py-20">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="tech mb-4 text-amber">Owner&rsquo;s Circle</p>
          <h1 className="display text-5xl md:text-6xl">
            Halo, <span className="text-amber">{user.name?.split(" ")[0]}</span>
          </h1>
          <p className="mt-4 text-muted">
            {user.email}
            {user.createdAt && (
              <span className="text-meta">
                {" "}
                · bergabung{" "}
                {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
                  new Date(user.createdAt)
                )}
              </span>
            )}
          </p>
        </div>
        <LogoutButton />
      </header>

      {/* Quick actions */}
      <section className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {[
          { t: "Jelajahi Katalog", b: "Unit kurasi terbaru", href: "/katalog" },
          { t: "Cek Harga Pasar", b: "Riset nasional & internasional", href: "/harga-pasar" },
          { t: "Jual / Trade-In", b: "Konversi masterpiece Anda", href: "/jual" },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="group bg-surface p-7 transition-colors hover:bg-surface-2">
            <h3 className="font-display text-xl font-semibold uppercase transition-colors group-hover:text-amber">
              {a.t} →
            </h3>
            <p className="mt-1 text-sm text-muted">{a.b}</p>
          </Link>
        ))}
      </section>

      {/* Aktivitas */}
      <section className="mt-12">
        <h2 className="display accent-rule mb-8 text-3xl">Aktivitas Saya</h2>
        {leads.length ? (
          <div className="space-y-px overflow-hidden border border-line bg-line">
            {leads.map((l) => (
              <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 bg-surface px-6 py-4">
                <div>
                  <p className="font-display text-lg font-semibold uppercase">
                    {LABELS[l.type] || l.type}
                  </p>
                  <p className="tech mt-0.5 text-meta">{l.id}</p>
                </div>
                <p className="tech text-meta">
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(l.createdAt))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-line bg-surface p-10 text-center">
            <p className="text-muted">
              Belum ada aktivitas — kirim inquiry pertama Anda dan semuanya
              tercatat di sini.
            </p>
            <div className="mt-6">
              <Button href="/katalog" variant="solid">
                Mulai Jelajah
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
