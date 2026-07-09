import { useEffect, useRef, useState } from 'react'
import { ref, push, onValue, serverTimestamp, query, limitToLast } from 'firebase/database'
import { db } from '../firebase'

export default function ChatPanel({ roomCode, myId, myNickname }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    const chatRef = query(ref(db, `rooms/${roomCode}/chat`), limitToLast(200))
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const list = []
      snapshot.forEach((child) => {
        list.push({ id: child.key, ...child.val() })
      })
      setMessages(list)
    })
    return () => unsubscribe()
  }, [roomCode])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    push(ref(db, `rooms/${roomCode}/chat`), {
      userId: myId,
      nickname: myNickname,
      text: trimmed,
      ts: serverTimestamp(),
    })
    setText('')
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/5 p-3">
      <p className="mb-2 text-xs font-medium text-white/50">채팅</p>
      <div ref={listRef} className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm leading-snug">
            <span className={msg.userId === myId ? 'font-semibold text-violet-300' : 'font-semibold text-white/70'}>
              {msg.nickname}
            </span>
            <span className="text-white/40">: </span>
            <span className="text-white/90 break-words">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지 입력..."
          className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30
            outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-violet-400"
        />
        <button
          type="button"
          onClick={handleSend}
          className="rounded-lg bg-violet-500 px-3 py-2 text-sm font-medium text-white hover:bg-violet-400"
        >
          전송
        </button>
      </div>
    </div>
  )
}
