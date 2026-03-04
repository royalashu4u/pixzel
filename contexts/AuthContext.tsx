'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User 
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  credits: number | null
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (e: string, p: string) => Promise<void>
  signUpWithEmail: (e: string, p: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    let unsubscribeSnapshot: (() => void) | undefined

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true) // Ensure loading is true while verifying session
      
      try {
        if (currentUser) {
          // Send token to server for session & rigorous user sync
          const idToken = await currentUser.getIdToken(true)
          const sessionRes = await fetch('/api/auth/session', {
            method: 'POST',
            body: JSON.stringify({ idToken }),
            headers: { 'Content-Type': 'application/json' },
          })

          if (!sessionRes.ok) {
            console.error('Failed to establish session, signing out.')
            await firebaseSignOut(auth)
            setUser(null)
            return
          }

          // Only set user after successful session creation to prevent premature redirect
          setUser(currentUser)

          // Listen for credits changes via Firestore (doc is guaranteed to exist now)
          const userDocRef = doc(db, 'users', currentUser.uid)
          unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              setCredits(doc.data()?.credits ?? 0)
            }
          })
        } else {
          setUser(null)
          setCredits(null)
          if (unsubscribeSnapshot) {
            unsubscribeSnapshot()
          }
          await fetch('/api/auth/session', { method: 'DELETE' })
        }
      } catch (error) {
        console.error('Session/Firestore update error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [])

  const signInWithGoogle = async () => {
    if (!auth) return
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      // If popup is blocked by browser COOP policy, fall back to redirect
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        await signInWithRedirect(auth, provider)
      } else {
        throw error
      }
    }
  }

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) return
    await signInWithEmailAndPassword(auth, email, pass)
  }

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!auth) return
    await createUserWithEmailAndPassword(auth, email, pass)
  }

  const signOut = async () => {
    if (!auth) return
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, credits, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
