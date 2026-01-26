import { db } from './firebase'
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore'

// ============================================
// USER MANAGEMENT
// ============================================

// Get user profile by ID
export async function getUserProfile(userId) {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(userId, data) {
  try {
    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, data)
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// ============================================
// STUDENT PROFILE MANAGEMENT
// ============================================

// Create/Update student profile
export async function createStudentProfile(userId, profileData) {
  try {
    const docRef = doc(db, 'studentProfiles', userId)
    await setDoc(
      docRef,
      {
        userId,
        ...profileData,
        createdAt: serverTimestamp(),
        status: profileData.status || 'draft', // draft, submitted, evaluated
      },
      { merge: true }
    )
  } catch (error) {
    console.error('Error creating student profile:', error)
    throw error
  }
}

// Get student profile
export async function getStudentProfile(userId) {
  try {
    const docRef = doc(db, 'studentProfiles', userId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    console.error('Error getting student profile:', error)
    throw error
  }
}

// ============================================
// AI EVALUATION MANAGEMENT
// ============================================

// Save AI evaluation result
export async function saveAIEvaluation(userId, evaluationData) {
  try {
    const docRef = doc(db, 'evaluations', userId)
    await setDoc(
      docRef,
      {
        userId,
        ...evaluationData,
        evaluatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  } catch (error) {
    console.error('Error saving evaluation:', error)
    throw error
  }
}

// Get AI evaluation for a student
export async function getAIEvaluation(userId) {
  try {
    const docRef = doc(db, 'evaluations', userId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    console.error('Error getting evaluation:', error)
    throw error
  }
}

// ============================================
// ADMIN - GET ALL STUDENT DATA
// ============================================

// Get all student profiles (admin only)
export async function getAllStudentProfiles() {
  try {
    const querySnapshot = await getDocs(collection(db, 'studentProfiles'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error getting all student profiles:', error)
    throw error
  }
}

// Get all evaluations (admin only)
export async function getAllEvaluations() {
  try {
    const querySnapshot = await getDocs(collection(db, 'evaluations'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error getting all evaluations:', error)
    throw error
  }
}

// ============================================
// RESUME URL MANAGEMENT
// ============================================

// No longer needed - resume stored as Base64 in Firestore
// Function removed to keep code clean
