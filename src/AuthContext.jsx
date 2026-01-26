import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component - wraps entire app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Watch for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Get user role from Firestore
        const docRef = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role)
        }
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign up with email and password
  const signup = async (email, password, role = 'student') => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const newUser = result.user

    // Save user role to Firestore
    await setDoc(doc(db, 'users', newUser.uid), {
      email: newUser.email,
      role: role,
      createdAt: new Date(),
    })

    setUserRole(role)
    return newUser
  }

  // Sign in with email and password
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  // Sign out
  const logout = async () => {
    setUserRole(null)
    return await signOut(auth)
  }

  const value = {
    user,
    userRole,
    loading,
    signup,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
