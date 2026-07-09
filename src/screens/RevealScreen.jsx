import { useState } from 'react'
import { ref, update } from 'firebase/database'
import { db } from '../firebase'
import Avatar from '../components/Avatar'

export default function RevealScreen({ room, roomCode, players, myId, isHost, onLeave }) {
  const [guess, setGuess] = useState('')
  const { round, result } = room
  const votes = room.votes || {}

  const tally = players
    .map((p) => ({ ...p, count: Object.values(votes).filter((v) => v === p.id).length }))
    .sort((a, b) => b.count - a.count)

  const topVoted = players.find((p) => p.id === result.topVotedId)
  const liarNicknames = round.liarIds.map((id) => players.find((p) => p.id === id)?.nickname).filter(Boolean)
  const isCaughtLiar = result.liarCaught && myId === result.topVotedId
  const awaitingGuess = result.liarCaught && !result.winner

  const submitGuess = () => {
    const isCorrect = guess.trim() && guess.trim() === round.word.trim()
    update(ref(db, `rooms/${roomCode}/result`), {
      liarGuess: guess.trim(),
      winner: isCorrect ? 'liars' : 'citizens',
    })
  }

  const rematch = () => {
    update(ref(db, `rooms/${roomCode}`), { status: 'lobby', round: null, votes: null, defense: null, result: null })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-5 px-6 py-10 text-center">
      <h1 className="text-2xl font-bold text-white">투표 결과</h1>

      <div className="flex flex-col gap-1.5 rounded-2xl bg-white/5 p-4">
        {tally.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <Avatar avatar={p.avatar} size={32} />
            <span className="flex-1 text-left text-sm text-white">{p.nickname}</span>
            <span className="text-sm text-white/50">{p.count}표</span>
          </div>
        ))}
      </div>

      <p className="text-white/80">
        {topVoted ? (
          <>
            🗳️ 가장 많은 표를 받은 <span className="font-semibold text-white">{topVoted.nickname}</span>
            님이 탈락했습니다.
          </>
        ) : (
          '투표가 동률이라 아무도 지목되지 않았어요.'
        )}
      </p>

      {awaitingGuess && isCaughtLiar && (
        <div className="flex flex-col gap-2 rounded-2xl bg-rose-500/10 p-4 ring-1 ring-rose-400/30">
          <p className="text-sm text-white/80">제시어를 맞히면 라이어가 승리합니다! 한 번만 추측할 수 있어요.</p>
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="제시어 추측..."
            className="rounded-lg bg-white/10 px-3 py-2 text-center text-white outline-none ring-1 ring-white/10
              focus:ring-2 focus:ring-rose-400"
          />
          <button
            type="button"
            onClick={submitGuess}
            disabled={!guess.trim()}
            className="rounded-lg bg-rose-500 py-2 font-medium text-white hover:bg-rose-400 disabled:opacity-40"
          >
            제출
          </button>
        </div>
      )}
      {awaitingGuess && !isCaughtLiar && (
        <p className="text-sm text-white/50">라이어가 제시어를 추측하는 중...</p>
      )}

      {result.winner && (() => {
        const winners =
          result.winner === 'liars'
            ? players.filter((p) => round.liarIds.includes(p.id))
            : players.filter((p) => !round.liarIds.includes(p.id))
        const title =
          result.winner === 'liars' ? `${winners.map((p) => p.nickname).join(', ')} WIN!!` : '시민 WIN!!'

        return (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-violet-500/15 p-5 ring-1 ring-violet-400/40">
            <div className="flex flex-wrap justify-center gap-3">
              {winners.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-1">
                  <Avatar avatar={p.avatar} size={56} />
                  <p className="text-xs text-white">{p.nickname}</p>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-sm text-white/70">
              제시어: {round.word}
              {round.similarWord && ` (라이어 제시어: ${round.similarWord})`}
            </p>
            <p className="text-sm text-white/70">라이어: {liarNicknames.join(', ')}</p>
          </div>
        )
      })()}

      {isHost && result.winner && (
        <button
          type="button"
          onClick={rematch}
          className="rounded-xl bg-violet-500 py-3 font-semibold text-white hover:bg-violet-400"
        >
          다시 하기
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
