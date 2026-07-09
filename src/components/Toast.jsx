import { AnimatePresence, motion } from 'framer-motion'

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#1A1B2E] px-4 py-2.5 text-sm
            text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
