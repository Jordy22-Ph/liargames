import ChatPanel from './ChatPanel'

export default function LobbyChat({ roomCode, myId, myNickname }) {
  return (
    <div
      className="fixed bottom-4 right-4 z-30 flex h-72 w-64 max-w-[80vw] flex-col overflow-hidden rounded-2xl
        border border-white/10 bg-[#1A1B2E]/90 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl"
    >
      <ChatPanel roomCode={roomCode} myId={myId} myNickname={myNickname} />
    </div>
  )
}
