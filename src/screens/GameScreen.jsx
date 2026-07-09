import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ref, update } from 'firebase/database'
import { db } from '../firebase'
import PlayerPodiums from '../components/PlayerPodiums'
import ChatPanel from '../components/ChatPanel'
import WordCard from '../components/WordCard'
import TimerMemoPanel from '../components/TimerMemoPanel'
import CountdownTimer from '../components/CountdownTimer'
import TurnOrderIntro from '../components/TurnOrderIntro'
import { TURN_DURATION_MS } from '../utils/gameLogic'

const ROUND_RESTART_MESSAGES = {
  tie: '🗳️ 투표가 동률이었어요. 다시 토론해보세요!',
  wrong_accusation: '💬 아직 결론을 내리기 어려워요. 다시 토론해보세요.',
}

export default function GameScreen({ room, roomCode, players, myId, isHost, onLeave }) {
  const me = players.find((p) => p.id === myId)
  const isFinalDiscussion = room.round.phase === 'finalDiscussion'
  const restartMessage = ROUND_RESTART_MESSAGES[room.round.lastOutcome]

  const speakingOrder = room.round.speakingOrder ?? players.map((p) => p.id)
  const orderedPlayers = speakingOrder.map((id) => players.find((p) => p.id === id)).filter(Boolean)
  const currentSpeakerId = speakingOrder[room.round.currentSpeakerIndex ?? 0]
  const currentSpeaker = players.find((p) => p.id === currentSpeakerId)

  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    setShowIntro(true)
    const timer = setTimeout(() => setShowIntro(false), 2500)
    return () => clearTimeout(timer)
  }, [room.round.roundNumber, room.round.phase])

  const startVoting = () => {
    update(ref(db, `rooms/${roomCode}`), { status: 'voting' })
  }

  const advanceTurn = () => {
    const nextIndex = ((room.round.currentSpeakerIndex ?? 0) + 1) % speakingOrder.length
    update(ref(db, `rooms/${roomCode}/round`), {
      currentSpeakerIndex: nextIndex,
      turnEndsAt: Date.now() + TURN_DURATION_MS,
    })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-4 px-4 py-6">
      <AnimatePresence>
        {showIntro && <TurnOrderIntro order={speakingOrder} players={players} />}
      </AnimatePresence>

      <header className="flex items-center justify-between">
        <p className="text-xs tracking-widest text-white/40">
          방 코드 {roomCode} · {isFinalDiscussion ? '최종 토론' : `${room.round.roundNumber}라운드`}
        </p>
        <div className="flex gap-2">
          {isHost && (
            <button
              type="button"
              onClick={startVoting}
              className="rounded-lg bg-violet-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-400"
            >
              {isFinalDiscussion ? '최종 투표 시작' : '투표 시작'}
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

      {isFinalDiscussion && (
        <p className="rounded-xl bg-violet-500/10 px-4 py-2 text-center text-sm text-violet-300 ring-1 ring-violet-400/20">
          🎙️ 최후 변론이 끝났어요. 마지막으로 한 번 더 토론한 뒤 최종 투표를 진행해요.
        </p>
      )}

      {restartMessage && (
        <p className="rounded-xl bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-300 ring-1 ring-amber-400/20">
          {restartMessage}
        </p>
      )}

      <section className="rounded-2xl bg-white/5 p-4">
        <PlayerPodiums players={orderedPlayers} myId={myId} hostId={room.hostId} currentSpeakerId={currentSpeakerId} />
      </section>

      <section className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
        <p className="text-sm text-white/70">
          🎤 <span className="font-semibold text-white">{currentSpeaker?.nickname ?? '...'}</span>님 발언 중
        </p>
        <div className="flex items-center gap-3">
          <CountdownTimer endsAt={room.round.turnEndsAt} onTimeUp={isHost ? advanceTurn : undefined} label="발언 시간" />
          {isHost && (
            <button
              type="button"
              onClick={advanceTurn}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/20"
            >
              다음 사람 →
            </button>
          )}
        </div>
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
