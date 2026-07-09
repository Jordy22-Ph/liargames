import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ref, get, set, serverTimestamp } from 'firebase/database'
import { db } from '../firebase'
import CharacterCustomizer from '../components/CharacterCustomizer'
import BackgroundDecor from '../components/BackgroundDecor'
import { DEFAULT_AVATAR, randomAvatar } from '../data/avatarOptions'
import { generateRoomCode } from '../utils/gameLogic'
import { getClientId } from '../utils/identity'
import FeedbackScreen from './FeedbackScreen'

const NICKNAME_KEY = 'liar_game_nickname'
const AVATAR_KEY = 'liar_game_avatar'
const MAX_PLAYERS = 8

export default function MainScreen({ onEnterLobby }) {
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
  const [joinCode, setJoinCode] = useState('')
  const [joinOpen, setJoinOpen] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

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

  if (showFeedback) {
    return <FeedbackScreen onBack={() => setShowFeedback(false)} />
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-[#0F1020]">
      <BackgroundDecor />

      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="absolute right-4 top-4 z-20 text-xs text-white/40 underline-offset-2 transition
          hover:text-white/70 hover:underline"
      >
        💬 건의사항이 있으면 눌러주세요
      </button>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-4xl">🎭</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            LIAR{' '}
            <span className="bg-linear-to-r from-[#7C5CFF] to-[#A855F7] bg-clip-text text-transparent">
              GAME
            </span>
          </h1>
          <p className="mt-2 text-sm text-[#A8A8B8]">거짓말쟁이를 찾아라</p>
        </motion.div>

        <CharacterCustomizer avatar={avatar} onChange={setAvatar} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex w-full max-w-xs flex-col items-center gap-3"
        >
          <div className="relative w-full">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              👤
            </span>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 10))}
              placeholder="닉네임을 입력하세요"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white
                placeholder:text-white/30 outline-none transition
                focus:border-[#7C5CFF] focus:shadow-[0_0_0_3px_rgba(124,92,255,0.25)]"
            />
          </div>

          <AnimatePresence>
            {joinOpen && (
              <motion.input
                key="joinCode"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 5))}
                placeholder="초대코드 5자리"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-center uppercase
                  tracking-widest text-white placeholder:text-white/30 outline-none transition
                  focus:border-[#7C5CFF] focus:shadow-[0_0_0_3px_rgba(124,92,255,0.25)]"
              />
            )}
          </AnimatePresence>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={busy}
            onClick={joinOpen ? handleJoinRoom : handleCreateRoom}
            className="w-full rounded-2xl bg-linear-to-r from-[#7C5CFF] to-[#A855F7] py-3.5 font-bold text-white
              shadow-[0_0_25px_rgba(124,92,255,0.45)] transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? '처리 중...' : joinOpen ? '입장하기' : '방 만들기'}
          </motion.button>

          {joinOpen ? (
            <button
              type="button"
              onClick={() => {
                setJoinOpen(false)
                setError('')
              }}
              className="text-xs text-[#A8A8B8] underline-offset-2 transition hover:text-white hover:underline"
            >
              ← 방 만들기로 돌아가기
            </button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setJoinOpen(true)
                setError('')
              }}
              className="w-full rounded-2xl border border-white/15 bg-transparent py-3 font-medium text-white/80
                transition hover:border-[#7C5CFF]/60 hover:text-white"
            >
              초대코드로 입장
            </motion.button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#A8A8B8] sm:text-sm"
        >
          <span>👥 3~8명</span>
          <span className="text-white/10">|</span>
          <span>🗳️ 토론 후 투표</span>
          <span className="text-white/10">|</span>
          <span>🎭 라이어를 찾아라</span>
        </motion.div>
      </div>

      <footer className="relative z-10 border-t border-white/10 py-4 text-center text-xs tracking-wide text-white/30">
        Made by{' '}
        <a
          href="https://github.com/Jordy22-Ph/liargames"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 underline-offset-2 transition hover:text-[#A855F7] hover:underline"
        >
          Jordy22-Ph
        </a>{' '}
        · 라이어 게임
      </footer>
    </div>
  )
}
