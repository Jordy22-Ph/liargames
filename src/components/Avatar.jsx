import { EYES, MOUTHS, THEMES } from '../data/avatarOptions'

const EYE_SHAPES = {
  round: (
    <>
      <circle cx="41" cy="52" r="6" fill="#2b2140" />
      <circle cx="79" cy="52" r="6" fill="#2b2140" />
    </>
  ),
  happy: (
    <>
      <path d="M33 50 Q41 42 49 50" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M71 50 Q79 42 87 50" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  ),
  sharp: (
    <>
      <path d="M33 48 L49 54" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" />
      <path d="M87 48 L71 54" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  sleepy: (
    <>
      <path d="M34 53 L48 53" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" />
      <path d="M72 53 L86 53" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  star: (
    <>
      <path d="M41 46 L44 53 L51 53 L45 57 L47 64 L41 60 L35 64 L37 57 L31 53 L38 53 Z" fill="#2b2140" />
      <path d="M79 46 L82 53 L89 53 L83 57 L85 64 L79 60 L73 64 L75 57 L69 53 L76 53 Z" fill="#2b2140" />
    </>
  ),
}

const MOUTH_SHAPES = {
  smile: <path d="M46 72 Q60 82 74 72" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" fill="none" />,
  grin: <path d="M42 70 Q60 90 78 70 Q60 78 42 70 Z" fill="#2b2140" />,
  flat: <path d="M46 75 L74 75" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" />,
  open: <ellipse cx="60" cy="76" rx="9" ry="11" fill="#2b2140" />,
  smirk: <path d="M46 74 Q60 80 72 66" stroke="#2b2140" strokeWidth="5" strokeLinecap="round" fill="none" />,
}

export default function Avatar({ avatar, size = 120, className = '' }) {
  const eyeId = EYES[avatar.eyes % EYES.length].id
  const mouthId = MOUTHS[avatar.mouth % MOUTHS.length].id
  const theme = THEMES[avatar.theme % THEMES.length]

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="캐릭터 아바타"
    >
      <circle cx="60" cy="62" r="52" fill={theme.face} />
      <circle cx="30" cy="72" r="9" fill={theme.cheeks} opacity="0.55" />
      <circle cx="90" cy="72" r="9" fill={theme.cheeks} opacity="0.55" />
      {EYE_SHAPES[eyeId]}
      {MOUTH_SHAPES[mouthId]}
    </svg>
  )
}
