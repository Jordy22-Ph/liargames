const REACTIONS = ['😀', '😂', '😮', '😭', '😡', '👍', '❤️', '👑', '🔥']

export default function ReactionBar({ onReact }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-white/5 p-3">
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onReact(emoji)}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-lg transition
            hover:scale-110 hover:bg-white/10 active:scale-90"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
