import { motion } from 'framer-motion'
import Avatar from './Avatar'
import { EYES, MOUTHS, THEMES } from '../data/avatarOptions'

function ArrowButton({ direction, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5
        text-lg text-white/70 transition hover:border-[#7C5CFF]/70 hover:text-white active:scale-90"
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  )
}

function StepRow({ label, options, selected, onSelect }) {
  const prev = () => onSelect((selected - 1 + options.length) % options.length)
  const next = () => onSelect((selected + 1) % options.length)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[#A8A8B8]">{label}</p>
      <div className="flex items-center gap-3">
        <ArrowButton direction="left" onClick={prev} label={`이전 ${label}`} />
        <p className="w-24 text-center text-sm font-medium text-white">{options[selected].label}</p>
        <ArrowButton direction="right" onClick={next} label={`다음 ${label}`} />
      </div>
    </div>
  )
}

function Dot({ active, onClick, label, style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      style={style}
      className={`h-3 w-3 shrink-0 rounded-full transition-all duration-200 ${
        active ? 'scale-125 shadow-[0_0_8px_rgba(124,92,255,0.85)]' : 'opacity-45 hover:opacity-80'
      }`}
    />
  )
}

function SkinRow({ label, options, selected, onSelect }) {
  const prev = () => onSelect((selected - 1 + options.length) % options.length)
  const next = () => onSelect((selected + 1) % options.length)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[#A8A8B8]">
        {label} · <span className="text-white/80">{options[selected].label}</span>
      </p>
      <div className="flex items-center gap-2.5">
        <ArrowButton direction="left" onClick={prev} label={`이전 ${label}`} />
        <div className="flex items-center gap-1.5">
          {options.map((opt, i) => (
            <Dot
              key={opt.id}
              active={selected === i}
              onClick={() => onSelect(i)}
              label={opt.label}
              style={{ background: opt.face, boxShadow: selected === i ? `0 0 8px ${opt.face}` : 'none' }}
            />
          ))}
        </div>
        <ArrowButton direction="right" onClick={next} label={`다음 ${label}`} />
      </div>
    </div>
  )
}

export default function CharacterCustomizer({ avatar, onChange }) {
  const update = (key) => (index) => onChange({ ...avatar, [key]: index })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center gap-7 rounded-[28px] border border-white/10 bg-[#1A1B2E]/70 p-8
        shadow-[0_8px_50px_rgba(124,92,255,0.18)] backdrop-blur-xl"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        className="grid h-44 w-44 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 sm:h-52 sm:w-52"
      >
        <Avatar avatar={avatar} size={176} />
      </motion.div>

      <div className="flex flex-col gap-4">
        <StepRow label="눈" options={EYES} selected={avatar.eyes} onSelect={update('eyes')} />
        <StepRow label="입" options={MOUTHS} selected={avatar.mouth} onSelect={update('mouth')} />
        <SkinRow label="피부" options={THEMES} selected={avatar.theme} onSelect={update('theme')} />
      </div>
    </motion.div>
  )
}
