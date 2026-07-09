import { ref, update } from 'firebase/database'
import { db } from '../firebase'
import PlayerPodiums from '../components/PlayerPodiums'
import ChatPanel from '../components/ChatPanel'
import WordCard from '../components/WordCard'
import TimerMemoPanel from '../components/TimerMemoPanel'

const ROUND_RESTART_MESSAGES = {
  tie: '🔁 이전 투표가 동률이라 아무도 지목되지 못했어요. 다시 토론해보세요!',
  wrong_accusation: '🔁 지목된 사람이 라이어가 아니었어요! 다시 토론해보세요.',
}

export default function GameScreen({ room, roomCode, players, myId, isHost, onLeave }) {
  const me = players.find((p) => p.id === myId)
  const restartMessage = ROUND_RESTART_MESSAGES[room.round.lastOutcome]

  const startVoting = () => {
    update(ref(db, `rooms/${roomCode}`), { status: 'voting' })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-4 px-4 py-6">
      <header className="flex items-center justify-between">
        <p className="text-xs tracking-widest text-white/40">
          방 코드 {roomCode} · {room.round.roundNumber}라운드
        </p>
        <div className="flex gap-2">
          {isHost && (
            <button
              type="button"
              onClick={startVoting}
              className="rounded-lg bg-violet-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-400"
            >
              투표 시작
            </button>
          )}
          <button
            type="button"
            onClick={onLeave}
            className="rounded-lg bg-white/10 px-4 py-1.5 text-sm text-white/70 hover:bg-white/20"
          >
            나가기
          </button>
        </div>
      </header>

      {restartMessage && (
        <p className="rounded-xl bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-300 ring-1 ring-amber-400/20">
          {restartMessage}
        </p>
      )}

      <section className="rounded-2xl bg-white/5 p-4">
        <PlayerPodiums players={players} myId={myId} hostId={room.hostId} />
      </section>

      <section className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3 md:[&>*]:h-80">
        <ChatPanel roomCode={roomCode} myId={myId} myNickname={me?.nickname ?? ''} />
        <WordCard round={room.round} myId={myId} />
        <TimerMemoPanel
          endsAt={room.round.endsAt}
          roomCode={roomCode}
          onTimeUp={isHost ? startVoting : undefined}
        />
      </section>
    </div>
  )
}
