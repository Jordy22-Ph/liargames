import { useCallback, useRef, useState } from 'react'

export function useToast() {
  const [toastMessage, setToastMessage] = useState(null)
  const timeoutRef = useRef(null)

  const showToast = useCallback((text, duration = 2000) => {
    setToastMessage(text)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setToastMessage(null), duration)
  }, [])

  return { toastMessage, showToast }
}
