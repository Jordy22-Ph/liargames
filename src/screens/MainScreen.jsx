import { useEffect, useState } from 'react'
import { ref, get, set, serverTimestamp } from 'firebase/database'
import { db } from '../firebase'
import CharacterCustomizer from '../components/CharacterCustomizer'
import { DEFAULT_AVATAR, randomAvatar } from '../data/avatarOptions'
import { generateRoomCode } from '../utils/gameLogic'
import { getClientId } from '../utils/identity'

const NICKNAME_KEY = 'liar_game_nickname'
const AVATAR_KEY = 'liar_game_avatar'
const MAX_PLAYERS = 8

export default function MainScreen({ onEnterLobby }) {
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
  const [joinCode, setJoinCode] = useState('')
  const [mode, setMode] = useState('create')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const savedNickname = localStorage.getItem(NICKNAME_KEY)
    const savedAvatar = localStorage.getItem(AVATAR_KEY)
    setNickname(savedNickname || '')
    setAvatar(savedAvatar ? JSON.parse(savedAvatar) : randomAvatar())
  }, [])

  const persistIdentity = () => {
    localStorage.setItem(NICKNAME_KEY, nickname.trim())
    localStorage.setItem(AVATAR_KEY, JSON.stringify(avatar))
  }

  const buildUserRecord = (isHost) => ({
    nickname: nickname.trim(),
    avatar,
    isHost,
    joinedAt: serverTimestamp(),
  })

  const handleCreateRoom = async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const uid = getClientId()
      let code = generateRoomCode()
      let snapshot = await get(ref(db, `rooms/${code}`))
      while (snapshot.exists()) {
        code = generateRoomCode()
        snapshot = await get(ref(db, `rooms/${code}`))
      }

      await set(ref(db, `rooms/${code}`), {
        hostId: uid,
        status: 'lobby',
        createdAt: serverTimestamp(),
        settings: { categoryId: 'food', mode: 'normal' },
        users: { [uid]: buildUserRecord(true) },
      })

      persistIdentity()
      onEnterLobby(code)
    } catch (err) {
      setError('방을 만들지 못했어요. 잠시 후 다시 시도해주세요.')
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  const handleJoinRoom = async () => {
    const code = joinCode.trim().toUpperCase()
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return
    }
    if (!code) {
      setError('방 코드를 입력해주세요.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const uid = getClientId()
      const roomRef = ref(db, `rooms/${code}`)
      const snapshot = await get(roomRef)
      if (!snapshot.exists()) {
        setError('존재하지 않는 방 코드예요.')
        return
      }
      const room = snapshot.val()
      if (room.status !== 'lobby') {
        setError('이미 게임이 시작된 방이에요.')
        return
      }
      const existingUsers = room.users || {}
      if (!existingUsers[uid] && Object.keys(existingUsers).length >= MAX_PLAYERS) {
        setError('방이 가득 찼어요. (최대 8명)')
        return
      }

      await set(ref(db, `rooms/${code}/users/${uid}`), buildUserRecord(Boolean(existingUsers[uid]?.isHost)))
      persistIdentity()
      onEnterLobby(code)
    } catch (err) {
      setError('방에 참가하지 못했어요. 잠시 후 다시 시도해주세요.')
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col items-center gap-6 px-6 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">라이어 게임</h1>
        <p className="mt-1 text-sm text-white/50">닉네임과 캐릭터를 정하고 시작해요</p>
      </div>

      <CharacterCustomizer avatar={avatar} onChange={setAvatar} />

      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value.slice(0, 10))}
        placeholder="닉네임 (최대 10자)"
        className="w-full rounded-xl bg-white/10 px-4 py-3 text-center text-white placeholder:text-white/40
          outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-violet-400"
      />

      <div className="flex w-full rounded-xl bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setMode('create')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            mode === 'create' ? 'bg-violet-500 text-white' : 'text-white/60'
          }`}
        >
          방 만들기
        </button>
        <button
          type="button"
          onClick={() => setMode('join')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            mode === 'join' ? 'bg-violet-500 text-white' : 'text-white/60'
          }`}
        >
          방 입장
        </button>
      </div>

      {mode === 'join' && (
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 5))}
          placeholder="방 코드 5자리"
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-center uppercase tracking-widest text-white
            placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-violet-400"
        />
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        type="button"
        disabled={busy}
        onClick={mode === 'create' ? handleCreateRoom : handleJoinRoom}
        className="w-full rounded-xl bg-violet-500 py-3 font-semibold text-white transition
          hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? '처리 중...' : mode === 'create' ? '방 만들기' : '입장하기'}
      </button>
    </div>
  )
}
