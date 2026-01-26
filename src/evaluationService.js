// Evaluation service - calls your free backend
// Set VITE_BACKEND_URL to your Render backend URL

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export async function evaluateWithRealAI(studentProfile) {
  try {
    console.log('📊 Calling real AI backend at:', BACKEND_URL)

    const response = await fetch(`${BACKEND_URL}/api/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: studentProfile.fullName,
        skills: studentProfile.skills,
        experience: studentProfile.experience || '',
        education: studentProfile.education || '',
        bio: studentProfile.bio || '',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Evaluation failed')
    }

    console.log('✅ Real AI evaluation received:', data.evaluation)
    return data.evaluation
  } catch (error) {
    console.error('❌ Real AI evaluation error:', error)
    throw error
  }
}
