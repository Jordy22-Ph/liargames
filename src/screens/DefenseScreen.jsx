import { ref, update } from 'firebase/database'
import { db } from '../firebase'
import Avatar from '../components/Avatar'
import CountdownTimer from '../components/CountdownTimer'
import ChatPanel from '../components/ChatPanel'
import { EXTRA_DISCUSSION_MS, TURN_DURATION_MS } from '../utils/gameLogic'

export default function DefenseScreen({ room, roomCode, players, myId, isHost, onLeave }) {
  const accused = players.find((p) => p.id === room.defense.topVotedId)
  const me = players.find((p) => p.id === myId)

  // Guilt is never decided right after the defense — that would mean this
  // screen's mere presence (or absence of a follow-up) leaks who's the liar.
  // Instead everyone gets one more discussion window and a final vote; only
  // that final vote's outcome (handled in VotingScreen) reveals anything.
  const finishDefense = () => {
    update(ref(db, `rooms/${roomCode}`), {
      status: 'playing',
      round: {
        ...room.round,
        phase: 'finalDiscussion',
        lastOutcome: null,
        endsAt: Date.now() + EXTRA_DISCUSSION_MS,
        currentSpeakerIndex: 0,
        turnEndsAt: Date.now() + TURN_DURATION_MS,
      },
      votes: null,
      defense: null,
    })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-5 px-4 py-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <Avatar avatar={accused?.avatar} size={72} />
        <h1 className="text-xl font-bold text-white">{accused?.nickname}님의 최후 변론</h1>
        <p className="text-sm text-white/50">가장 많이 지목됐어요. 마지막으로 해명할 시간이에요.</p>
      </header>

      <CountdownTimer
        endsAt={room.defense.endsAt}
        onTimeUp={isHost ? finishDefense : undefined}
        label="변론 남은 시간"
      />

      <div className="h-72">
        <ChatPanel roomCode={roomCode} myId={myId} myNickname={me?.nickname ?? ''} />
      </div>

      <div className="flex gap-2">
        {isHost && (
          <button
            type="button"
            onClick={finishDefense}
            className="flex-1 rounded-xl bg-violet-500 py-3 font-semibold text-white hover:bg-violet-400"
          >
            변론 종료 &amp; 추가 토론 시작
          </button>
        )}
        <button
          type="button"
          onClick={onLeave}
          className="rounded-xl bg-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/20"
        >
          나가기
        </button>
      </div>
    </div>
  )
}
