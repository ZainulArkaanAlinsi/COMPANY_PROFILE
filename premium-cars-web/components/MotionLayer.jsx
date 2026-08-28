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

    // ---- Kursor kustom (hanya perangkat pointer presisi / desktop) ----
    const fine = window.matchMedia("(pointer: fine)").matches;
    let dot = null;
    let cursorRaf = 0;
    let cx = -100,
      cy = -100,
      tx = -100,
      ty = -100;
    if (fine) {
      dot = document.createElement("div");
      dot.className = "cursor-dot";
      document.body.appendChild(dot);
      const loop = () => {
        cx += (tx - cx) * 0.22;
        cy += (ty - cy) * 0.22;
        dot.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`;
        cursorRaf = requestAnimationFrame(loop);
      };
      cursorRaf = requestAnimationFrame(loop);
    }

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

    // ---- Spotlight + tilt + magnetik ----
    let moveScheduled = false;
    let lastEvent = null;
    let tiltEl = null;
    const onMove = (e) => {
      // Kursor kustom: target posisi + membesar di elemen interaktif
      if (dot) {
        tx = e.clientX;
        ty = e.clientY;
        if (!dot.classList.contains("on")) dot.classList.add("on");
        const hit =
          e.target.closest &&
          e.target.closest(
            "a, button, select, input, textarea, [data-magnetic], [data-tilt], [role='button']"
          );
        dot.classList.toggle("lg", !!hit);
      }

      // Spotlight langsung (murah): update kartu di bawah kursor
      const card = e.target.closest && e.target.closest("[data-spotlight]");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (reduce) return;

      // 3D tilt kartu mengikuti kursor
      const tilt = e.target.closest && e.target.closest("[data-tilt]");
      if (tilt !== tiltEl) {
        if (tiltEl) {
          tiltEl.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
          tiltEl.style.transform = "";
        }
        tiltEl = tilt;
      }
      if (tilt) {
        const tr = tilt.getBoundingClientRect();
        const px = (e.clientX - tr.left) / tr.width - 0.5;
        const py = (e.clientY - tr.top) / tr.height - 0.5;
        tilt.style.transition = "transform 0.1s ease-out";
        tilt.style.transform = `perspective(950px) rotateX(${(-py * 5.5).toFixed(2)}deg) rotateY(${(px * 5.5).toFixed(2)}deg)`;
      }

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
    const resetAll = () => {
      document.querySelectorAll("[data-magnetic]").forEach((m) => {
        m.style.transform = "";
      });
      if (tiltEl) {
        tiltEl.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        tiltEl.style.transform = "";
        tiltEl = null;
      }
      if (dot) dot.classList.remove("on");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", resetAll, { passive: true });
    document.addEventListener("mouseleave", resetAll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", resetAll);
      document.removeEventListener("mouseleave", resetAll);
      cancelAnimationFrame(cursorRaf);
      if (dot) dot.remove();
      bar.remove();
    };
  }, []);

  return null;
}
