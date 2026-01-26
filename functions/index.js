const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Groq = require('groq-sdk')
const cors = require('cors')

// Initialize Firebase Admin
admin.initializeApp()
const db = admin.firestore()

// Initialize CORS
const corsHandler = cors({ origin: true })

// Initialize Groq Client
// Get API key from environment variable
const groqApiKey = process.env.GROQ_API_KEY || process.env.groq_apikey || 'YOUR_GROQ_API_KEY_HERE'

const groq = new Groq({
  apiKey: groqApiKey,
})

// ============================================
// CLOUD FUNCTION: Evaluate Student Profile
// ============================================
// Triggered by: Student submits for evaluation
// Accesses: Student profile + resume from Firestore
// Calls: Groq AI API
// Saves: Results to evaluations collection
//
exports.evaluateStudentProfile = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be logged in to evaluate profile'
      )
    }

    const userId = context.auth.uid

    try {
      // Get student profile from Firestore
      const profileRef = db.collection('studentProfiles').doc(userId)
      const profileSnap = await profileRef.get()

      if (!profileSnap.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Student profile not found'
        )
      }

      const profile = profileSnap.data()

      // Validate profile has required data
      if (!profile.fullName || !profile.skills || !profile.resumeBase64) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Profile must have name, skills, and resume'
        )
      }

      // Create prompt for AI evaluation
      const evaluationPrompt = `
You are an expert recruiter and career coach evaluating a student's profile for a tech position.

STUDENT PROFILE:
- Name: ${profile.fullName}
- Skills: ${profile.skills}
- Experience: ${profile.experience || 'Not provided'}
- Education: ${profile.education || 'Not provided'}
- Bio: ${profile.bio || 'Not provided'}

Based on this profile, provide evaluation in JSON format with these EXACT fields:
{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "readinessScore": 75,
  "eligibility": "Eligible"
}

IMPORTANT:
- readinessScore: integer 0-100
- eligibility: must be exactly one of: "Eligible", "Needs Improvement", "Not Ready"
- Return ONLY valid JSON, no extra text

Evaluation based on:
- Technical skills level
- Experience relevance
- Overall readiness for positions
- Growth potential
`

      // Call Groq AI API
      console.log('Calling Groq API for evaluation...')
      const message = await groq.messages.create({
        model: 'mixtral-8x7b-32768',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: evaluationPrompt,
          },
        ],
      })

      // Extract response
      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : ''

      console.log('Groq API Response:', responseText)

      // Parse JSON response
      let evaluation
      try {
        // Extract JSON from response (in case AI adds extra text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error('No JSON found in response')
        }
        evaluation = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        throw new functions.https.HttpsError(
          'internal',
          'Failed to parse AI evaluation response'
        )
      }

      // Validate evaluation structure
      if (!evaluation.strengths || !evaluation.weaknesses || !evaluation.suggestions ||
          evaluation.readinessScore === undefined || !evaluation.eligibility) {
        throw new functions.https.HttpsError(
          'internal',
          'AI response missing required fields'
        )
      }

      // Save evaluation to Firestore
      const evaluationData = {
        userId: userId,
        studentName: profile.fullName,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestions: evaluation.suggestions,
        readinessScore: Math.min(100, Math.max(0, evaluation.readinessScore)),
        eligibility: evaluation.eligibility,
        evaluatedAt: admin.firestore.FieldValue.serverTimestamp(),
        model: 'groq',
      }

      await db.collection('evaluations').doc(userId).set(evaluationData)

      // Update profile status to "evaluated"
      await profileRef.update({
        status: 'evaluated',
        evaluatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      console.log('Evaluation saved successfully for user:', userId)

      return {
        success: true,
        message: 'Profile evaluated successfully',
        evaluation: evaluationData,
      }
    } catch (error) {
      console.error('Evaluation error:', error)

      if (error instanceof functions.https.HttpsError) {
        throw error
      }

      throw new functions.https.HttpsError(
        'internal',
        `Evaluation failed: ${error.message}`
      )
    }
  })

// ============================================
// HTTP FUNCTION: Health Check
// ============================================
// For testing if Cloud Functions are deployed
exports.healthCheck = functions
  .region('us-central1')
  .https.onRequest((req, res) => {
    corsHandler(req, res, () => {
      res.json({
        status: 'ok',
        message: 'SkillBridge AI Cloud Functions are running',
        timestamp: new Date().toISOString(),
      })
    })
  })

// ============================================
// HTTP FUNCTION: Get Evaluation
// ============================================
// Fetch evaluation results for a student
exports.getEvaluation = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be logged in')
    }

    const userId = context.auth.uid
    const requestedUserId = data.userId || userId

    try {
      // Students can only view their own evaluation
      // Admins can view any evaluation (checked in frontend ProtectedRoute)
      const evalRef = db.collection('evaluations').doc(requestedUserId)
      const evalSnap = await evalRef.get()

      if (!evalSnap.exists) {
        return { success: false, message: 'No evaluation found' }
      }

      return {
        success: true,
        evaluation: evalSnap.data(),
      }
    } catch (error) {
      console.error('Error fetching evaluation:', error)
      throw new functions.https.HttpsError('internal', 'Failed to fetch evaluation')
    }
  })
