import Avatar from './Avatar'

export default function PlayerPodiums({ players, myId, hostId, currentSpeakerId }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {players.map((player) => {
        const isSpeaking = player.id === currentSpeakerId
        return (
          <div key={player.id} className="flex w-20 shrink-0 flex-col items-center gap-1">
            <div
              className={`rounded-full transition ${
                isSpeaking ? 'shadow-[0_0_16px_rgba(124,92,255,0.9)] ring-2 ring-[#7C5CFF]' : ''
              }`}
            >
              <Avatar avatar={player.avatar} size={52} />
            </div>
            <div className="w-full rounded-md bg-white/10 px-1 py-1 text-center">
              <p className="truncate text-[11px] text-white">
                {isSpeaking && '🎤'} {player.id === hostId && '👑'} {player.nickname}
              </p>
              {player.id === myId && <p className="text-[10px] text-violet-300">나</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
