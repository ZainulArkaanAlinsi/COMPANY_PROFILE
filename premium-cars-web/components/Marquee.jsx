/**
 * Ghost brand marquee — oversized outlined Oswald names scrolling horizontally.
 * Duplicated once so the CSS translateX(-50%) loop is seamless.
 */
export default function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="group relative overflow-hidden border-y border-line-soft py-8">
      <div className="flex w-max animate-marquee gap-16 group-hover:[animation-play-state:paused]">
        {row.map((name, i) => (
          <span
            key={i}
            className="display select-none text-4xl text-transparent md:text-6xl"
            style={{ WebkitTextStroke: "1px rgb(var(--pc-line))" }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
