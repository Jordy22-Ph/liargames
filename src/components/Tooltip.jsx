export default function Tooltip({ text, children }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2
          rounded-lg bg-[#1c1d2b] p-2.5 text-xs leading-snug text-white/90 opacity-0 shadow-lg
          ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100"
      >
        {text}
      </div>
    </div>
  )
}
