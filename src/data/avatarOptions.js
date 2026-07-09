export const EYES = [
  { id: 'round', label: '동그란 눈' },
  { id: 'happy', label: '초승달 눈' },
  { id: 'sharp', label: '날카로운 눈' },
  { id: 'sleepy', label: '반쯤 감은 눈' },
  { id: 'star', label: '별빛 눈' },
]

export const MOUTHS = [
  { id: 'smile', label: '미소' },
  { id: 'grin', label: '활짝 웃음' },
  { id: 'flat', label: '무표정' },
  { id: 'open', label: '놀란 입' },
  { id: 'smirk', label: '장난기 입' },
]

export const THEMES = [
  { id: 'violet', label: '보라', face: '#c084fc', cheeks: '#a855f7' },
  { id: 'sky', label: '하늘', face: '#7dd3fc', cheeks: '#38bdf8' },
  { id: 'lime', label: '라임', face: '#bef264', cheeks: '#a3e635' },
  { id: 'amber', label: '노랑', face: '#fcd34d', cheeks: '#fbbf24' },
  { id: 'rose', label: '핑크', face: '#fda4af', cheeks: '#fb7185' },
]

export const DEFAULT_AVATAR = {
  eyes: 0,
  mouth: 0,
  theme: 0,
}

export function randomAvatar() {
  return {
    eyes: Math.floor(Math.random() * EYES.length),
    mouth: Math.floor(Math.random() * MOUTHS.length),
    theme: Math.floor(Math.random() * THEMES.length),
  }
}
