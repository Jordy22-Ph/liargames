import Avatar from './Avatar'
import { EYES, MOUTHS, THEMES } from '../data/avatarOptions'

function cycle(current, length, delta) {
  return (current + delta + length) % length
}

function ArrowButton({ direction, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg text-white/80
        transition hover:bg-white/20 hover:text-white active:scale-90"
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  )
}

function CustomizeRow({ label, valueLabel, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <ArrowButton direction="left" onClick={onPrev} label={`이전 ${label}`} />
      <div className="w-28 text-center">
        <p className="text-[11px] uppercase tracking-wide text-white/40">{label}</p>
        <p className="text-sm font-medium text-white">{valueLabel}</p>
      </div>
      <ArrowButton direction="right" onClick={onNext} label={`다음 ${label}`} />
    </div>
  )
}

export default function CharacterCustomizer({ avatar, onChange }) {
  const update = (key, length) => (delta) => {
    onChange({ ...avatar, [key]: cycle(avatar[key], length, delta) })
  }

  const eyesStep = update('eyes', EYES.length)
  const mouthStep = update('mouth', MOUTHS.length)
  const themeStep = update('theme', THEMES.length)

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl bg-white/5 p-6">
      <div className="grid h-36 w-36 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
        <Avatar avatar={avatar} size={128} />
      </div>

      <div className="flex w-full flex-col gap-3">
        <CustomizeRow
          label="눈"
          valueLabel={EYES[avatar.eyes].label}
          onPrev={() => eyesStep(-1)}
          onNext={() => eyesStep(1)}
        />
        <CustomizeRow
          label="입"
          valueLabel={MOUTHS[avatar.mouth].label}
          onPrev={() => mouthStep(-1)}
          onNext={() => mouthStep(1)}
        />
        <CustomizeRow
          label="색상"
          valueLabel={THEMES[avatar.theme].label}
          onPrev={() => themeStep(-1)}
          onNext={() => themeStep(1)}
        />
      </div>
    </div>
  )
}
