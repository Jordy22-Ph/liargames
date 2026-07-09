export default function WordCard({ round, myId }) {
  const myWord = round.wordByUser[myId]
  const isLiar = round.liarIds.includes(myId)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 p-5 text-center">
      <p className="text-xs font-medium text-white/50">주제</p>
      <p className="text-lg font-semibold text-white">{round.categoryName}</p>

      <div
        className={`mt-2 w-full rounded-xl px-4 py-6 ${
          isLiar ? 'bg-rose-500/15 ring-1 ring-rose-400/40' : 'bg-violet-500/15 ring-1 ring-violet-400/40'
        }`}
      >
        <p className="text-xs text-white/40">
          {isLiar ? (round.mode === 'hard' ? '당신의 제시어 (유사 단어)' : '당신은 라이어입니다') : '나의 제시어'}
        </p>
        <p className="mt-2 text-2xl font-bold text-white">
          {isLiar ? myWord ?? '???' : myWord}
        </p>
      </div>
    </div>
  )
}
