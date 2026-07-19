"use client";

import { useEffect } from "react";

/**
 * Lapisan interaksi global (dipasang sekali di layout). Semuanya GPU-only
 * (transform/opacity) & menghormati prefers-reduced-motion:
 *  - scroll-progress: bar cognac tipis di paling atas
 *  - [data-parallax]: geser halus mengikuti scroll (isi angka speed, mis. 0.12)
 *  - [data-spotlight]: sorotan cognac mengikuti kursor (set --mx/--my)
 *  - [data-magnetic]: tombol "tertarik" ke kursor saat didekati
 */
export default function MotionLayer() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Progress bar baca ----
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);

    let scrollScheduled = false;
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        scrollScheduled = false;
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = max > 0 ? doc.scrollTop / max : 0;
        bar.style.transform = `scaleX(${p})`;
        if (reduce) return;
        const vh = window.innerHeight;
        document.querySelectorAll("[data-parallax]").forEach((el) => {
          const speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2 - vh / 2;
          el.style.setProperty("--py", `${(-center * speed).toFixed(1)}px`);
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    // ---- Spotlight + magnetik ----
    let moveScheduled = false;
    let lastEvent = null;
    const onMove = (e) => {
      // Spotlight langsung (murah): update kartu di bawah kursor
      const card = e.target.closest && e.target.closest("[data-spotlight]");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (reduce) return;
      lastEvent = e;
      if (moveScheduled) return;
      moveScheduled = true;
      requestAnimationFrame(() => {
        moveScheduled = false;
        const ev = lastEvent;
        if (!ev) return;
        document.querySelectorAll("[data-magnetic]").forEach((m) => {
          const r = m.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = ev.clientX - cx;
          const dy = ev.clientY - cy;
          const dist = Math.hypot(dx, dy);
          const radius = Math.max(r.width, 120);
          if (dist < radius) {
            const pull = (1 - dist / radius) * 7;
            m.style.transform = `translate(${((dx / dist) * pull || 0).toFixed(1)}px, ${((dy / dist) * pull || 0).toFixed(1)}px)`;
          } else if (m.style.transform) {
            m.style.transform = "";
          }
        });
      });
    };
    const resetMagnets = () =>
      document.querySelectorAll("[data-magnetic]").forEach((m) => {
        m.style.transform = "";
      });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", resetMagnets, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", resetMagnets);
      bar.remove();
    };
  }, []);

  return null;
}
