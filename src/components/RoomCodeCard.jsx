import { buildInviteLink } from '../utils/inviteLink'

export default function RoomCodeCard({ roomCode, playerCount, maxPlayers, onToast }) {
  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode)
    onToast('방 코드가 복사되었습니다.')
  }

  const copyInvite = async () => {
    await navigator.clipboard.writeText(buildInviteLink(roomCode))
    onToast('초대 링크가 복사되었습니다.')
  }

  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <p className="text-xs text-white/40">방 코드</p>
      <h1 className="mt-1 text-3xl font-bold tracking-widest text-white">{roomCode}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copyCode}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 transition
            hover:bg-white/20 active:scale-95"
        >
          📋 코드 복사
        </button>
        <button
          type="button"
          onClick={copyInvite}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 transition
            hover:bg-white/20 active:scale-95"
        >
          🔗 초대 링크 복사
        </button>
        <span className="ml-auto text-xs text-white/40">
          👥 현재 {playerCount} / {maxPlayers}명
        </span>
      </div>
    </div>
  )
}
