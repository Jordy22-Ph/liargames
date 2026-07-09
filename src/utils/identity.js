import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

let cachedUid = null

export function initIdentity() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          cachedUid = user.uid
          resolve(user.uid)
        }
      },
      reject,
    )
    signInAnonymously(auth).catch(reject)
  })
}

export function getClientId() {
  if (!cachedUid) {
    throw new Error('Identity not initialized yet — call initIdentity() before rendering.')
  }
  return cachedUid
}
