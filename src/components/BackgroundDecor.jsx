const ICONS = ['🎭', '🕵️', '💬', '🎲', '🔍']

// Deterministic scatter (index-based, not Math.random()) so positions never
// jump between re-renders.
const SPRINKLES = Array.from({ length: 24 }, (_, i) => ({
  icon: ICONS[i % ICONS.length],
  top: `${(i * 37) % 100}%`,
  left: `${(i * 53) % 100}%`,
  size: 22 + ((i * 7) % 36),
  rotate: (i * 29) % 360,
}))

export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#7C5CFF]/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-[#A855F7]/15 blur-[120px]" />
      {SPRINKLES.map((s, i) => (
        <span
          key={i}
          className="absolute select-none opacity-[0.05]"
          style={{ top: s.top, left: s.left, fontSize: s.size, transform: `rotate(${s.rotate}deg)` }}
        >
          {s.icon}
        </span>
      ))}
    </div>
  )
}
