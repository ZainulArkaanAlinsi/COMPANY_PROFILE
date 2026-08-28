"use client";

import { useId, useMemo, useState } from "react";

/**
 * Grafik garis SVG murni (tanpa dependensi) untuk pergerakan harga.
 * data: [{ label, value }] lama → baru. Interaktif: hover menampilkan titik.
 */
export default function TrendChart({ data, format = (v) => v, height = 200 }) {
  const gid = useId().replace(/[:]/g, "");
  const [hover, setHover] = useState(null);

  const geo = useMemo(() => {
    const W = 720;
    const H = height;
    const PAD = { t: 16, r: 16, b: 26, l: 16 };
    const vals = data.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    const x = (i) =>
      PAD.l + (i / Math.max(data.length - 1, 1)) * (W - PAD.l - PAD.r);
    const y = (v) => PAD.t + (1 - (v - min) / span) * (H - PAD.t - PAD.b);
    const pts = data.map((d, i) => ({ x: x(i), y: y(d.value), ...d }));
    const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
    const area = `M ${pts[0].x},${H - PAD.b} L ${line
      .split(" ")
      .join(" L ")} L ${pts[pts.length - 1].x},${H - PAD.b} Z`;
    return { W, H, PAD, min, max, pts, line, area };
  }, [data, height]);

  const up = data[data.length - 1].value >= data[0].value;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${geo.W} ${geo.H}`}
        className="h-auto w-full"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`g-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--pc-amber))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(var(--pc-amber))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Garis bantu min/median/max */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={geo.PAD.l}
            x2={geo.W - geo.PAD.r}
            y1={geo.PAD.t + f * (geo.H - geo.PAD.t - geo.PAD.b)}
            y2={geo.PAD.t + f * (geo.H - geo.PAD.t - geo.PAD.b)}
            stroke="rgb(var(--pc-line-soft))"
            strokeDasharray="3 6"
          />
        ))}

        <path d={geo.area} fill={`url(#g-${gid})`} />
        <polyline
          points={geo.line}
          fill="none"
          stroke="rgb(var(--pc-amber))"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Titik + area hover */}
        {geo.pts.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hover === i ? 6 : i === geo.pts.length - 1 ? 5 : 3}
              fill={
                hover === i || i === geo.pts.length - 1
                  ? "rgb(var(--pc-amber))"
                  : "rgb(var(--pc-surface))"
              }
              stroke="rgb(var(--pc-amber))"
              strokeWidth="2"
            />
            <rect
              x={p.x - geo.W / data.length / 2}
              y={0}
              width={geo.W / data.length}
              height={geo.H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          </g>
        ))}

        {/* Label sumbu X: awal & akhir */}
        <text x={geo.PAD.l} y={geo.H - 8} fontSize="11" fill="rgb(var(--pc-meta))">
          {data[0].label}
        </text>
        <text
          x={geo.W - geo.PAD.r}
          y={geo.H - 8}
          fontSize="11"
          textAnchor="end"
          fill="rgb(var(--pc-meta))"
        >
          {data[data.length - 1].label}
        </text>
      </svg>

      {/* Tooltip */}
      {hover != null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full border border-line bg-surface px-3 py-2 text-center"
          style={{
            left: `${(geo.pts[hover].x / geo.W) * 100}%`,
            top: `${(geo.pts[hover].y / geo.H) * 100}%`,
          }}
        >
          <p className="tech text-[9px] text-meta">{data[hover].label}</p>
          <p className="font-display text-sm font-semibold text-amber">
            {format(data[hover].value)}
          </p>
        </div>
      )}

      {/* Rentang */}
      <div className="mt-2 flex justify-between text-[11px] uppercase tracking-tech text-meta">
        <span>Terendah {format(geo.min)}</span>
        <span className={up ? "text-amber" : ""}>
          Tertinggi {format(geo.max)}
        </span>
      </div>
    </div>
  );
}
