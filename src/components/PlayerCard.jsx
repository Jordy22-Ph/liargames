import { motion } from 'framer-motion'
import Avatar from './Avatar'
import PlayerReactionBubble from './PlayerReactionBubble'

export default function PlayerCard({ player, isHostPlayer, isMe, reaction, onToggleReady }) {
  const readyBadge = (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
        player.ready ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'
      }`}
    >
      {player.ready ? '✅ 준비 완료' : '⏳ 대기 중'}
    </span>
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative flex flex-col items-center gap-1 rounded-xl bg-white/5 p-3"
    >
      <PlayerReactionBubble reaction={reaction} />
      <Avatar avatar={player.avatar} size={56} />
      <p className="truncate text-xs text-white">
        {player.nickname} {isHostPlayer && '👑'}
      </p>
      {isMe ? (
        <button type="button" onClick={onToggleReady}>
          {readyBadge}
        </button>
      ) : (
        readyBadge
      )}
    </motion.div>
  )
}
