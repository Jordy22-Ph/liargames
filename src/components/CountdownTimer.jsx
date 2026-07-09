import { useEffect, useRef, useState } from 'react'
import { formatRemaining } from '../utils/formatTime'

export default function CountdownTimer({ endsAt, onTimeUp, label = '남은 시간' }) {
  const [remaining, setRemaining] = useState(endsAt - Date.now())
  const firedRef = useRef(false)

  useEffect(() => {
    // A new endsAt means a fresh countdown period (next speaker's turn, next
    // round, etc.) — without this reset, firedRef stays latched from the
    // previous period and onTimeUp silently stops firing after the first time.
    firedRef.current = false
    setRemaining(endsAt - Date.now())
    const interval = setInterval(() => setRemaining(endsAt - Date.now()), 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  useEffect(() => {
    if (remaining <= 0 && !firedRef.current) {
      firedRef.current = true
      onTimeUp?.()
    }
  }, [remaining, onTimeUp])

  const timeUp = remaining <= 0

  return (
    <div className="text-center">
      <p className="text-xs font-medium text-white/50">{label}</p>
      <p className={`text-3xl font-bold tabular-nums ${timeUp ? 'text-rose-400' : 'text-white'}`}>
        {timeUp ? '시간 종료' : formatRemaining(remaining)}
      </p>
    </div>
  )
}
