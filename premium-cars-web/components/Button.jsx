import Link from "next/link";

/**
 * Button — solid (amber on black) or ghost (hairline border).
 * 2px radius, uppercase label-md, wide horizontal padding, per DESIGN.md.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-body text-[12.5px] font-semibold uppercase tracking-tech transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-floor";

const variants = {
  // Primary retail: tombol ink (near-black), teks bone. Elegan & tegas.
  solid: "btn-sheen bg-ink text-floor hover:bg-amber",
  // Ghost: hairline, isi transparan.
  ghost: "border border-line text-ink hover:border-ink hover:bg-ink hover:text-floor",
  // Accent cognac.
  accent: "btn-sheen bg-amber text-floor hover:bg-amber-600",
  light: "btn-sheen bg-ink text-floor hover:bg-amber",
};

export default function Button({
  as = "button",
  variant = "solid",
  href,
  className = "",
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} data-magnetic {...props}>
        {children}
      </Link>
    );
  }
  const Tag = as;
  return (
    <Tag className={cls} data-magnetic {...props}>
      {children}
    </Tag>
  );
}
