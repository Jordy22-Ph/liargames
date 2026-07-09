import { useState } from 'react'
import { submitFeedback } from '../utils/feedback'

export default function FeedbackScreen({ onBack }) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) return
    setStatus('sending')
    setError('')
    try {
      await submitFeedback(message.trim())
      setStatus('sent')
      setMessage('')
    } catch (err) {
      setStatus('idle')
      setError('전송에 실패했어요. 잠시 후 다시 시도해주세요.')
      console.error(err)
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-5 px-6 py-10">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm text-white/50 transition hover:text-white"
      >
        ← 돌아가기
      </button>

      <div>
        <h1 className="text-2xl font-bold text-white">건의사항</h1>
        <p className="mt-1 text-sm text-white/50">불편한 점이나 추가하고 싶은 기능을 자유롭게 적어주세요.</p>
      </div>

      {status === 'sent' ? (
        <p className="rounded-xl bg-emerald-500/15 p-4 text-sm text-emerald-300 ring-1 ring-emerald-400/30">
          전달됐어요. 읽어볼게요, 감사합니다!
        </p>
      ) : (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="건의사항을 입력해주세요..."
            className="h-40 resize-none rounded-xl bg-white/10 p-3 text-white placeholder:text-white/30
              outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-violet-400"
          />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'sending' || !message.trim()}
            className="rounded-xl bg-violet-500 py-3 font-semibold text-white transition hover:bg-violet-400
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'sending' ? '전송 중...' : '전송'}
          </button>
        </>
      )}
    </div>
  )
}
