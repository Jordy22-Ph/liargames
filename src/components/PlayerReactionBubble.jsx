import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function PlayerReactionBubble({ reaction }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!reaction) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
    // Only restart the timer when a genuinely new reaction arrives (by ts),
    // not on every re-render where `reaction` is a fresh object with the same value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reaction?.ts])

  return (
    <AnimatePresence>
      {visible && reaction && (
        <motion.div
          key={reaction.ts}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -20 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 text-2xl"
        >
          {reaction.emoji}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
