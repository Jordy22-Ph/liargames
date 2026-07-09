import { motion } from 'framer-motion'

const NUMERALS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧']

export default function TurnOrderIntro({ order, players }) {
  const ordered = order.map((id) => players.find((p) => p.id === id)).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-[#1A1B2E] p-8
          shadow-[0_8px_50px_rgba(124,92,255,0.25)]"
      >
        <p className="text-lg font-bold text-white">🎙️ 이번 토론 순서</p>
        <div className="flex flex-col gap-2">
          {ordered.map((p, i) => (
            <p key={p.id} className="text-base text-white/80">
              {NUMERALS[i] ?? `${i + 1}.`} <span className="font-semibold text-white">{p.nickname}</span>
            </p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
