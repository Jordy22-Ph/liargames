import { useEffect, useRef, useState } from 'react'

function formatRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const minutes = String(Math.floor(total / 60)).padStart(2, '0')
  const seconds = String(total % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export default function TimerMemoPanel({ endsAt, roomCode, onTimeUp }) {
  const [remaining, setRemaining] = useState(endsAt - Date.now())
  const memoKey = `liar_game_memo_${roomCode}`
  const [memo, setMemo] = useState(() => localStorage.getItem(memoKey) || '')
  const firedRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => setRemaining(endsAt - Date.now()), 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  useEffect(() => {
    if (remaining <= 0 && !firedRef.current) {
      firedRef.current = true
      onTimeUp?.()
    }
  }, [remaining, onTimeUp])

  const handleMemoChange = (value) => {
    setMemo(value)
    localStorage.setItem(memoKey, value)
  }

  const timeUp = remaining <= 0

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl bg-white/5 p-3">
      <div className="text-center">
        <p className="text-xs font-medium text-white/50">남은 시간</p>
        <p className={`text-3xl font-bold tabular-nums ${timeUp ? 'text-rose-400' : 'text-white'}`}>
          {timeUp ? '시간 종료' : formatRemaining(remaining)}
        </p>
      </div>
      <div className="flex flex-1 flex-col">
        <p className="mb-1 text-xs font-medium text-white/50">메모 (나만 볼 수 있어요)</p>
        <textarea
          value={memo}
          onChange={(e) => handleMemoChange(e.target.value)}
          placeholder="추리 메모..."
          className="flex-1 resize-none rounded-lg bg-white/10 p-2 text-sm text-white placeholder:text-white/30
            outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-violet-400"
        />
      </div>
    </div>
  )
}
