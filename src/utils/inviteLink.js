const JOIN_PATH_PATTERN = /^\/join\/([A-Za-z0-9]{5})\/?$/

export function parseJoinCodeFromPath() {
  const match = window.location.pathname.match(JOIN_PATH_PATTERN)
  return match ? match[1].toUpperCase() : null
}

export function buildInviteLink(roomCode) {
  return `${window.location.origin}/join/${roomCode}`
}
