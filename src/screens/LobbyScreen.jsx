import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ref, onValue, update, remove, set, onDisconnect } from 'firebase/database'
import { db } from '../firebase'
import Tooltip from '../components/Tooltip'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import RoomCodeCard from '../components/RoomCodeCard'
import PlayerCard from '../components/PlayerCard'
import ReactionBar from '../components/ReactionBar'
import CharacterCustomizer from '../components/CharacterCustomizer'
import { useToast } from '../hooks/useToast'
import { DEFAULT_AVATAR } from '../data/avatarOptions'
import { getCategories, assignRound, ROUND_DURATION_MS } from '../utils/gameLogic'
import { getClientId } from '../utils/identity'
import GameScreen from './GameScreen'
import VotingScreen from './VotingScreen'
import DefenseScreen from './DefenseScreen'
import RevealScreen from './RevealScreen'

const MAX_PLAYERS = 8
const MIN_PLAYERS = 3
const AVATAR_KEY = 'liar_game_avatar'

export default function LobbyScreen({ roomCode, onExit }) {
  const uid = getClientId()
  const [room, setRoom] = useState(null)
  const [editingCharacter, setEditingCharacter] = useState(false)
  const { toastMessage, showToast } = useToast()

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`)
    const userRef = ref(db, `rooms/${roomCode}/users/${uid}`)
    onDisconnect(userRef).remove()

    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        onExit()
        return
      }
      setRoom(snapshot.val())
    })

    return () => unsubscribe()
  }, [roomCode, uid, onExit])

  const players = useMemo(() => {
    if (!room?.users) return []
    return Object.entries(room.users)
      .map(([id, user]) => ({ id, ...user }))
      .sort((a, b) => (a.joinedAt ?? 0) - (b.joinedAt ?? 0))
  }, [room])

  if (!room) {
    return (
      <div className="grid min-h-svh place-items-center text-white/60">방 정보를 불러오는 중...</div>
    )
  }

  const isHost = room.hostId === uid
  const categories = getCategories()
  const me = players.find((p) => p.id === uid)
  const allReady = players.length > 0 && players.every((p) => p.ready)
  const canStart = isHost && players.length >= MIN_PLAYERS && allReady && room.status === 'lobby'

  const handleLeave = async () => {
    const remaining = players.filter((p) => p.id !== uid)
    if (isHost && remaining.length > 0) {
      // Hand off hosting to whoever joined earliest among those staying, so the
      // room and everyone still in it survive the host leaving mid-game.
      // Only "users/{uid}" (self) and "hostId" (room-root, host-gated) can be
      // touched here — a departing host can't also write nextHost's own user
      // record, since that path's write rule only lets that user write it.
      const nextHost = remaining[0]
      await update(ref(db, `rooms/${roomCode}`), {
        [`users/${uid}`]: null,
        hostId: nextHost.id,
      })
    } else if (isHost) {
      await remove(ref(db, `rooms/${roomCode}`))
    } else {
      await remove(ref(db, `rooms/${roomCode}/users/${uid}`))
    }
    onExit()
  }

  const handleCategoryChange = (categoryId) => {
    update(ref(db, `rooms/${roomCode}/settings`), { categoryId })
  }

  const handleModeChange = (mode) => {
    update(ref(db, `rooms/${roomCode}/settings`), { mode })
  }

  const handleStart = () => {
    const userIds = players.map((p) => p.id)
    const round = assignRound(room.settings.categoryId, room.settings.mode, userIds)
    round.endsAt = Date.now() + ROUND_DURATION_MS
    update(ref(db, `rooms/${roomCode}`), { status: 'playing', round })
  }

  const handleToggleReady = () => {
    update(ref(db, `rooms/${roomCode}/users/${uid}`), { ready: !me?.ready })
  }

  const handleReact = (emoji) => {
    set(ref(db, `rooms/${roomCode}/reactions/${uid}`), { emoji, ts: Date.now() })
  }

  const handleAvatarChange = (nextAvatar) => {
    update(ref(db, `rooms/${roomCode}/users/${uid}/avatar`), nextAvatar)
    localStorage.setItem(AVATAR_KEY, JSON.stringify(nextAvatar))
  }

  if (room.status === 'playing' && room.round) {
    return (
      <GameScreen
        room={room}
        roomCode={roomCode}
        players={players}
        myId={uid}
        isHost={isHost}
        onLeave={handleLeave}
      />
    )
  }

  if (room.status === 'voting' && room.round) {
    return (
      <VotingScreen
        room={room}
        roomCode={roomCode}
        players={players}
        myId={uid}
        isHost={isHost}
        onLeave={handleLeave}
      />
    )
  }

  if (room.status === 'defense' && room.round && room.defense) {
    return (
      <DefenseScreen
        room={room}
        roomCode={roomCode}
        players={players}
        myId={uid}
        isHost={isHost}
        onLeave={handleLeave}
      />
    )
  }

  if (room.status === 'reveal' && room.round && room.result) {
    return (
      <RevealScreen
        room={room}
        roomCode={roomCode}
        players={players}
        myId={uid}
        isHost={isHost}
        onLeave={handleLeave}
      />
    )
  }

  const readyCount = players.filter((p) => p.ready).length
  let startLabel = '게임 시작'
  if (players.length < MIN_PLAYERS) {
    startLabel = `최소 ${MIN_PLAYERS}명 필요 (${players.length}/${MIN_PLAYERS})`
  } else if (!allReady) {
    startLabel = `모두 준비 완료를 기다리는 중 (${readyCount}/${players.length})`
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 px-6 py-8">
      <header className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">대기실</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditingCharacter(true)}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/20 active:scale-95"
          >
            👤 캐릭터 수정
          </button>
          <button
            type="button"
            onClick={handleLeave}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/20 active:scale-95"
          >
            나가기
          </button>
        </div>
      </header>

      <RoomCodeCard
        roomCode={roomCode}
        playerCount={players.length}
        maxPlayers={MAX_PLAYERS}
        onToast={showToast}
      />

      <section className="grid grid-cols-4 gap-3 sm:grid-cols-4">
        <AnimatePresence initial={false}>
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isHostPlayer={player.id === room.hostId}
              isMe={player.id === uid}
              reaction={room.reactions?.[player.id]}
              onToggleReady={handleToggleReady}
            />
          ))}
        </AnimatePresence>
        {Array.from({ length: Math.max(0, MAX_PLAYERS - players.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="flex flex-col items-center gap-1 rounded-xl bg-white/5 p-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/5 text-white/20">?</div>
            <p className="text-xs text-white/30">대기 중</p>
          </div>
        ))}
      </section>

      <ReactionBar onReact={handleReact} />

      <section className="rounded-2xl bg-white/5 p-5">
        <p className="mb-3 text-sm font-medium text-white/70">주제 선택</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const categoryButton = (
              <button
                type="button"
                disabled={!isHost}
                onClick={() => handleCategoryChange(cat.id)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  room.settings.categoryId === cat.id
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/10 text-white/60'
                } ${isHost ? 'hover:bg-violet-400/70' : 'cursor-not-allowed opacity-60'}`}
              >
                {cat.name}
              </button>
            )

            if (!cat.description) {
              return <span key={cat.id}>{categoryButton}</span>
            }

            return (
              <Tooltip key={cat.id} text={cat.description}>
                {categoryButton}
              </Tooltip>
            )
          })}
        </div>

        <p className="mb-3 mt-5 text-sm font-medium text-white/70">모드 선택</p>
        <div className="flex gap-3">
          <Tooltip text="라이어는 한 명! 혼자만 주제가 달라요.">
            <button
              type="button"
              disabled={!isHost}
              onClick={() => handleModeChange('normal')}
              className={`rounded-xl px-5 py-2 text-sm transition ${
                room.settings.mode === 'normal' ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/60'
              } ${isHost ? 'hover:bg-violet-400/70' : 'cursor-not-allowed opacity-60'}`}
            >
              노말 모드
            </button>
          </Tooltip>
          <Tooltip text="라이어는 두 명! 그리고 제시어와 비슷한 제시어가 라이어에게 부여됩니다.">
            <button
              type="button"
              disabled={!isHost}
              onClick={() => handleModeChange('hard')}
              className={`rounded-xl px-5 py-2 text-sm transition ${
                room.settings.mode === 'hard' ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/60'
              } ${isHost ? 'hover:bg-violet-400/70' : 'cursor-not-allowed opacity-60'}`}
            >
              하드 모드
            </button>
          </Tooltip>
        </div>
      </section>

      {isHost ? (
        <button
          type="button"
          disabled={!canStart}
          onClick={handleStart}
          className="rounded-xl bg-violet-500 py-3 font-semibold text-white transition
            hover:bg-violet-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {startLabel}
        </button>
      ) : (
        <p className="text-center text-sm text-white/40">방장이 설정을 마치면 게임이 시작됩니다.</p>
      )}

      <Modal open={editingCharacter} onClose={() => setEditingCharacter(false)}>
        <div className="flex flex-col items-center gap-4">
          <CharacterCustomizer avatar={me?.avatar ?? DEFAULT_AVATAR} onChange={handleAvatarChange} />
          <button
            type="button"
            onClick={() => setEditingCharacter(false)}
            className="rounded-xl bg-violet-500 px-8 py-2.5 font-semibold text-white transition hover:bg-violet-400"
          >
            완료
          </button>
        </div>
      </Modal>

      <Toast message={toastMessage} />
    </div>
  )
}
