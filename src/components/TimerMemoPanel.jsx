import { useState } from 'react'
import CountdownTimer from './CountdownTimer'

export default function TimerMemoPanel({ endsAt, roomCode, onTimeUp }) {
  const memoKey = `liar_game_memo_${roomCode}`
  const [memo, setMemo] = useState(() => localStorage.getItem(memoKey) || '')

  const handleMemoChange = (value) => {
    setMemo(value)
    localStorage.setItem(memoKey, value)
  }

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl bg-white/5 p-3">
      <CountdownTimer endsAt={endsAt} onTimeUp={onTimeUp} label="남은 시간" />
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
