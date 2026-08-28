import Link from "next/link";

/**
 * Section header editorial: baris index (N° 0X — kicker) di atas hairline,
 * lalu judul display besar. Opsional aksi di kanan.
 */
export default function SectionHeader({ title, kicker, index, action, className = "" }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
        <p className="tech text-amber">
          {index != null && (
            <span className="text-meta">N° {String(index).padStart(2, "0")} — </span>
          )}
          {kicker}
        </p>
        {action && (
          <Link
            href={action.href}
            className="tech group inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-ink transition-colors hover:text-amber"
          >
            {action.label}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
      <h2 className="display mt-6 text-4xl leading-[0.95] md:text-6xl">{title}</h2>
    </div>
  );
}
