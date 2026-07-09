import { useEffect, useState } from 'react'
import MainScreen from './screens/MainScreen'
import LobbyScreen from './screens/LobbyScreen'
import { initIdentity } from './utils/identity'
import { parseJoinCodeFromPath } from './utils/inviteLink'

export default function App() {
  const [roomCode, setRoomCode] = useState(null)
  const [ready, setReady] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [initialJoinCode] = useState(() => parseJoinCodeFromPath())

  useEffect(() => {
    if (initialJoinCode) {
      window.history.replaceState({}, '', '/')
    }
    initIdentity()
      .then(() => setReady(true))
      .catch((err) => {
        console.error(err)
        setAuthError(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (authError) {
    return (
      <div className="grid min-h-svh place-items-center px-6 text-center text-white/60">
        로그인에 실패했어요. 새로고침 후 다시 시도해주세요.
      </div>
    )
  }

  if (!ready) {
    return <div className="grid min-h-svh place-items-center text-white/60">불러오는 중...</div>
  }

  if (roomCode) {
    return <LobbyScreen roomCode={roomCode} onExit={() => setRoomCode(null)} />
  }

  return <MainScreen onEnterLobby={setRoomCode} initialJoinCode={initialJoinCode} />
}
