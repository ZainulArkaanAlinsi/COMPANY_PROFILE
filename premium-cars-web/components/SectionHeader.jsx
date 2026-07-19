import Link from "next/link";

/**
 * Section header: big Oswald title with amber accent rule + optional side link.
 */
export default function SectionHeader({ title, kicker, action, className = "" }) {
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <div>
        {kicker && <p className="tech mb-3 text-amber">{kicker}</p>}
        <h2 className="display text-4xl md:text-5xl">{title}</h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="tech shrink-0 whitespace-nowrap text-amber hover:text-amber-400"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
