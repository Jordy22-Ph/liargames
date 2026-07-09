import topicsData from '../data/topics.json'

const ROOM_CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export const ROUND_DURATION_MS = 5 * 60 * 1000
export const DEFENSE_DURATION_MS = 60 * 1000

export function generateRoomCode(length = 5) {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]
  }
  return code
}

export function getCategories() {
  return topicsData.categories
}

export function getCategoryById(categoryId) {
  return topicsData.categories.find((c) => c.id === categoryId)
}

function pickRandom(list, count) {
  const pool = [...list]
  const picked = []
  while (picked.length < count && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(i, 1)[0])
  }
  return picked
}

/**
 * Builds a round: picks a word pair from the category and assigns liars.
 * Normal mode: 1 liar, gets no word (just the category name).
 * Hard mode: 2 liars, each gets the "similar" word instead of the real word.
 */
export function assignRound(categoryId, mode, userIds) {
  const category = getCategoryById(categoryId)
  const entry = category.words[Math.floor(Math.random() * category.words.length)]
  const liarCount = mode === 'hard' ? 2 : 1
  const liarIds = pickRandom(userIds, Math.min(liarCount, userIds.length))

  const wordByUser = {}
  userIds.forEach((id) => {
    const isLiar = liarIds.includes(id)
    if (!isLiar) {
      wordByUser[id] = entry.word
    } else {
      wordByUser[id] = mode === 'hard' ? entry.similar : null
    }
  })

  return {
    categoryId,
    categoryName: category.name,
    mode,
    liarIds,
    wordByUser,
    word: entry.word,
    similarWord: mode === 'hard' ? entry.similar : null,
  }
}
