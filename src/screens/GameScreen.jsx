import { ref, update } from 'firebase/database'
import { db } from '../firebase'
import PlayerPodiums from '../components/PlayerPodiums'
import ChatPanel from '../components/ChatPanel'
import WordCard from '../components/WordCard'
import TimerMemoPanel from '../components/TimerMemoPanel'

export default function GameScreen({ room, roomCode, players, myId, isHost, onLeave }) {
  const me = players.find((p) => p.id === myId)

  const startVoting = () => {
    update(ref(db, `rooms/${roomCode}`), { status: 'voting' })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-4 px-4 py-6">
      <header className="flex items-center justify-between">
        <p className="text-xs tracking-widest text-white/40">방 코드 {roomCode}</p>
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

      <section className="rounded-2xl bg-white/5 p-4">
        <PlayerPodiums players={players} myId={myId} />
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
