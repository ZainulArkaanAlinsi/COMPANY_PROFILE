"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NUMBER = "622151408888"; // +62 21 5140 8888 — nomor showroom
const TEXT = "Halo Premium Cars, saya ingin bertanya tentang unit di website.";

/**
 * Tombol WhatsApp mengambang khas showroom — muncul setelah sedikit scroll,
 * bersembunyi di halaman kontak (sudah ada formulir di sana).
 */
export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/kontak") return null;

  return (
    <a
      href={`https://wa.me/${NUMBER}?text=${encodeURIComponent(TEXT)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp Premium Cars"
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-amber/50 bg-surface text-amber shadow-none transition-all duration-500 hover:-translate-y-1 hover:bg-amber hover:text-floor ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-amber/20" />
      <WaIcon />
    </a>
  );
}

function WaIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a9.9 9.9 0 0 0-8.6 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.1 8.1 0 1 1 12 20.1zm4.6-6c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.3z" />
    </svg>
  );
}
