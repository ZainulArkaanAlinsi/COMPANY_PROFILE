"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/jual" },
  { label: "Appraisal", href: "/jual/appraisal" },
  { label: "Trade-In", href: "/jual/trade-in" },
  { label: "Consignment", href: "/jual/consignment" },
];

/**
 * Sub-navigasi "terminal" untuk seluruh alur Sell & Trade — meniru nav
 * BROWSE / SELL / TRADE-IN / CONSIGNMENT pada desain stitch.
 */
export default function SellNav() {
  const pathname = usePathname();
  return (
    <div className="frame">
      <nav
        aria-label="Navigasi jual & tukar"
        className="flex gap-7 overflow-x-auto border-b border-line pt-8"
      >
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`tech relative whitespace-nowrap pb-4 transition-colors ${
                active ? "text-amber" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
              <span
                className={`absolute inset-x-0 bottom-0 h-[2px] bg-amber transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
