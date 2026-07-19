"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Navbar "Luxury Retail" — satu tingkat, terang & lega.
 * Glass terang, teks ink, aksen cognac pada item aktif.
 * Desktop: logo · nav + dropdown "Lainnya" · akun + CTA.
 * Mobile: overlay putih fullscreen dengan link display besar.
 */

const primary = [
  { label: "Katalog", href: "/katalog" },
  { label: "Harga Pasar", href: "/harga-pasar" },
  { label: "Bandingkan", href: "/bandingkan" },
  { label: "Jual Mobil", href: "/jual" },
  { label: "Cicilan", href: "/cicilan" },
];

const more = [
  { label: "Heritage", href: "/heritage" },
  { label: "Journal", href: "/journal" },
  { label: "Membership", href: "/membership" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const moreRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const moreActive = more.some((m) => isActive(m.href));

  return (
    <header
      className={`glass sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "border-b border-line shadow-[0_8px_30px_-18px_rgba(26,22,17,0.25)]" : "border-b border-transparent"
      }`}
    >
      <div className="frame flex h-[76px] items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="shrink-0 leading-none">
          <span className="display text-xl tracking-tight md:text-[1.55rem]">
            Premium<span className="text-amber">.</span>Cars
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-[12.5px] font-medium uppercase tracking-tech transition-colors ${
                isActive(item.href)
                  ? "bg-amber/10 text-amber"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-medium uppercase tracking-tech transition-colors ${
                moreActive ? "bg-amber/10 text-amber" : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              Lainnya
              <svg
                width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                className={`transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className={`absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_50px_-24px_rgba(26,22,17,0.3)] transition-all duration-300 ${
                moreOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              {more.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-5 py-3 text-[12.5px] font-medium uppercase tracking-tech transition-colors hover:bg-surface-2 ${
                    isActive(item.href) ? "text-amber" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2.5">
          <Link
            href={user ? "/akun" : "/masuk"}
            className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-[12px] font-semibold uppercase tracking-tech text-ink transition-colors hover:border-ink md:inline-flex"
          >
            <UserIcon />
            {user ? user.name?.split(" ")[0] : "Masuk"}
          </Link>
          <Link
            href="/jual"
            className="btn-sheen hidden rounded-full bg-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-tech text-floor transition-colors hover:bg-amber md:inline-block"
          >
            Jual Mobil Anda
          </Link>
          {/* Mobile toggle */}
          <button
            aria-label="Menu"
            aria-expanded={open}
            className="relative z-[60] flex h-11 w-11 items-center justify-center text-ink lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-6">
              <span className={`absolute left-0 top-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute bottom-0 left-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 top-[76px] z-50 flex flex-col bg-floor transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="frame flex-1 overflow-y-auto py-6">
          {[...primary, ...more].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
              className={`display block border-b border-line-soft py-4 text-[2rem] transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              } ${isActive(item.href) ? "text-amber" : "text-ink"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="frame flex items-center justify-between gap-4 border-t border-line py-6">
          <Link href={user ? "/akun" : "/masuk"} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[12px] font-semibold uppercase tracking-tech text-ink">
            <UserIcon /> {user ? user.name?.split(" ")[0] : "Masuk / Daftar"}
          </Link>
          <Link href="/jual" className="rounded-full bg-ink px-5 py-3 text-[12px] font-semibold uppercase tracking-tech text-floor">
            Jual Mobil
          </Link>
        </div>
      </div>
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.4-3.2 4.2-4.8 7.5-4.8s6.1 1.6 7.5 4.8" />
    </svg>
  );
}
