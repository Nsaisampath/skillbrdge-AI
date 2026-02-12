import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Replace these with your Firebase project credentials
// Get these from Firebase Console > Project Settings
const firebaseConfig = {
  authDomain: "skillbridge-ai-57f85.firebaseapp.com",
  projectId: "skillbridge-ai-57f85",
  storageBucket: "skillbridge-ai-57f85.firebasestorage.app",
  messagingSenderId: "887611510786",
  appId: "1:887611510786:web:e8998b4ff5c774ec4e971b",
  measurementId: "G-289YGNYL2Y"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)           // For authentication (login/signup)
export const db = getFirestore(app)        // For database (Firestore)
export const storage = getStorage(app)     // For file uploads (Cloud Storage)

export default app
