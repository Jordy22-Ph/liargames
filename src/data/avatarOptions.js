export const EYES = [
  { id: 'round', label: '동그란 눈' },
  { id: 'happy', label: '초승달 눈' },
  { id: 'sharp', label: '날카로운 눈' },
  { id: 'sleepy', label: '반쯤 감은 눈' },
  { id: 'star', label: '별빛 눈' },
  { id: 'wink', label: '윙크 눈' },
  { id: 'heart', label: '하트 눈' },
  { id: 'spiral', label: '빙글빙글 눈' },
]

export const MOUTHS = [
  { id: 'smile', label: '미소' },
  { id: 'grin', label: '활짝 웃음' },
  { id: 'flat', label: '무표정' },
  { id: 'open', label: '놀란 입' },
  { id: 'smirk', label: '장난기 입' },
  { id: 'tongue', label: '혀 내밀기' },
  { id: 'box', label: '이빨 활짝' },
  { id: 'kiss', label: '뽀뽀 입' },
]

export const THEMES = [
  { id: 'lavender', label: '라벤더', face: '#d9c2f0', cheeks: '#c7a8e8' },
  { id: 'sky', label: '스카이', face: '#bee3f8', cheeks: '#9ed4f0' },
  { id: 'mint', label: '민트', face: '#c5f0de', cheeks: '#a8e6c9' },
  { id: 'butter', label: '버터', face: '#ffe5a0', cheeks: '#ffd873' },
  { id: 'rose', label: '로즈', face: '#fbc9d4', cheeks: '#f7a8b8' },
  { id: 'peach', label: '피치', face: '#ffd8b8', cheeks: '#ffc090' },
  { id: 'aqua', label: '아쿠아', face: '#b8f0ea', cheeks: '#93e5dc' },
  { id: 'lilac', label: '라일락', face: '#f0c9e8', cheeks: '#e3a8d8' },
]

export const ACCESSORIES = [
  { id: 'none', label: '없음' },
  { id: 'glasses', label: '안경' },
  { id: 'bowtie', label: '보타이' },
  { id: 'hat', label: '모자' },
]

export const DEFAULT_AVATAR = {
  eyes: 0,
  mouth: 0,
  theme: 0,
  accessory: 0,
}

export function randomAvatar() {
  return {
    eyes: Math.floor(Math.random() * EYES.length),
    mouth: Math.floor(Math.random() * MOUTHS.length),
    theme: Math.floor(Math.random() * THEMES.length),
    accessory: Math.floor(Math.random() * ACCESSORIES.length),
  }
}
