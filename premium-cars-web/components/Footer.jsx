import Link from "next/link";

const cols = [
  {
    title: "Jelajahi",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Katalog", href: "/katalog" },
      { label: "Harga Pasar", href: "/harga-pasar" },
      { label: "Bandingkan", href: "/bandingkan" },
      { label: "Cicilan", href: "/cicilan" },
    ],
  },
  {
    title: "Layanan",
    links: [
      { label: "Jual Mobil", href: "/jual" },
      { label: "Penilaian Kendaraan", href: "/jual/appraisal" },
      { label: "Tukar Tambah", href: "/jual/trade-in" },
      { label: "Konsinyasi", href: "/jual/consignment" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Kontak", href: "/kontak" },
      { label: "Membership", href: "/membership" },
      { label: "Kebijakan Privasi", href: "/kontak" },
      { label: "Syarat & Ketentuan", href: "/kontak" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-section border-t border-line bg-floor">
      <div className="frame grid grid-cols-2 gap-10 py-16 md:grid-cols-4 md:py-20">
        <div className="col-span-2 md:col-span-1">
          <p className="display text-2xl">
            Premium<span className="text-amber">.</span>Cars
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Meredefinisi standar akuisisi otomotif mewah sejak 1998. Dirancang
            untuk yang luar biasa.
          </p>
          <div className="mt-6 flex gap-3">
            {["IG", "YT", "X"].map((s) => (
              <span
                key={s}
                className="flex h-9 w-9 items-center justify-center border border-line text-[11px] font-semibold text-muted hover:border-amber hover:text-amber"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <p className="tech mb-5 text-meta">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-amber"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line-soft">
        <div className="frame flex flex-col gap-2 py-6 text-[11px] uppercase tracking-tech text-meta md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Premium Cars. Engineered for Excellence.</span>
          <span>SCBD District 8, Level 42 — Jakarta Selatan · Bersertifikat ISO 9001</span>
        </div>
      </div>
    </footer>
  );
}
