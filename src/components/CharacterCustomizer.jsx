import { motion } from 'framer-motion'
import Avatar from './Avatar'
import { EYES, MOUTHS, THEMES } from '../data/avatarOptions'

function Dot({ active, onClick, label, style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      style={style}
      className={`h-3.5 w-3.5 rounded-full transition-all duration-200 ${
        active
          ? 'scale-125 shadow-[0_0_10px_rgba(124,92,255,0.85)]'
          : 'opacity-45 hover:opacity-80'
      }`}
    />
  )
}

function DotRow({ label, options, selected, onSelect, colored }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[#A8A8B8]">{label}</p>
      <div className="flex max-w-56 flex-wrap items-center justify-center gap-2.5">
        {options.map((opt, i) => (
          <Dot
            key={opt.id}
            active={selected === i}
            onClick={() => onSelect(i)}
            label={opt.label}
            style={
              colored
                ? { background: opt.face, boxShadow: selected === i ? `0 0 10px ${opt.face}` : 'none' }
                : { background: selected === i ? 'linear-gradient(135deg,#7C5CFF,#A855F7)' : '#3a3b52' }
            }
          />
        ))}
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
        <DotRow label="눈" options={EYES} selected={avatar.eyes} onSelect={update('eyes')} />
        <DotRow label="입" options={MOUTHS} selected={avatar.mouth} onSelect={update('mouth')} />
        <DotRow label="피부" options={THEMES} selected={avatar.theme} onSelect={update('theme')} colored />
      </div>
    </motion.div>
  )
}
