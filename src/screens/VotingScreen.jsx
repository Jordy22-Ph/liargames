import { useEffect } from 'react'
import { ref, set, update } from 'firebase/database'
import { db } from '../firebase'
import Avatar from '../components/Avatar'
import { DEFENSE_DURATION_MS, nextRoundOrLiarWin } from '../utils/gameLogic'

function tallyVotes(votes) {
  const tally = {}
  Object.values(votes).forEach((targetId) => {
    tally[targetId] = (tally[targetId] ?? 0) + 1
  })
  return tally
}

function pickTopVoted(tally) {
  let topId = null
  let topCount = 0
  let tie = false
  Object.entries(tally).forEach(([id, count]) => {
    if (count > topCount) {
      topId = id
      topCount = count
      tie = false
    } else if (count === topCount) {
      tie = true
    }
  })
  return tie ? null : topId
}

export default function VotingScreen({ room, roomCode, players, myId, isHost, onLeave }) {
  const votes = room.votes || {}
  const myVote = votes[myId]
  const votedCount = Object.keys(votes).length

  const finalizeVote = () => {
    const tally = tallyVotes(votes)
    const topVotedId = pickTopVoted(tally)

    if (topVotedId === null) {
      // Tie — nobody is pinned down, so there's no one to give a final defense.
      // Treat it the same as failing to catch the liar: another round, or a
      // default liar win once the round cap is reached.
      update(ref(db, `rooms/${roomCode}`), nextRoundOrLiarWin(room.round, null))
      return
    }

    update(ref(db, `rooms/${roomCode}`), {
      status: 'defense',
      defense: { topVotedId, endsAt: Date.now() + DEFENSE_DURATION_MS },
    })
  }

  useEffect(() => {
    if (isHost && votedCount >= players.length && players.length > 0) {
      finalizeVote()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, votedCount, players.length])

  const castVote = (targetId) => {
    set(ref(db, `rooms/${roomCode}/votes/${myId}`), targetId)
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-6 py-10">
      <header className="text-center">
        <p className="text-xs text-white/40">{room.round.roundNumber}라운드</p>
        <h1 className="text-2xl font-bold text-white">라이어로 의심되는 사람을 지목하세요</h1>
        <p className="mt-1 text-sm text-white/50">{votedCount}/{players.length}명 투표 완료</p>
      </header>

      <div className="flex flex-col gap-2">
        {players
          .filter((p) => p.id !== myId)
          .map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => castVote(p.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition ${
                myVote === p.id ? 'bg-violet-500 ring-2 ring-violet-300' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Avatar avatar={p.avatar} size={40} />
              <span className="font-medium text-white">{p.nickname}</span>
            </button>
          ))}
      </div>

      {isHost && (
        <button
          type="button"
          onClick={finalizeVote}
          className="rounded-xl bg-violet-500 py-3 font-semibold text-white transition hover:bg-violet-400"
        >
          투표 마감 &amp; 결과 보기
        </button>
      )}

      <button
        type="button"
        onClick={onLeave}
        className="rounded-xl bg-white/10 py-2 text-sm text-white/60 hover:bg-white/20"
      >
        나가기
      </button>
    </div>
  )
}
