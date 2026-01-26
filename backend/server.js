import express from 'express'
import cors from 'cors'
import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory for dotenv path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') })

const app = express()
const PORT = process.env.PORT || 3000
const GROQ_API_KEY = process.env.GROQ_API_KEY

// Validate API key exists
if (!GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY environment variable not set!')
  console.error('Please ensure .env.local file has GROQ_API_KEY')
  console.error('Or set GROQ_API_KEY in environment variables before starting')
  process.exit(1)
}

console.log('✅ Groq API key loaded successfully')
console.log('📦 Initializing Groq client...')

// Initialize Groq client
let groq
try {
  groq = new Groq({
    apiKey: GROQ_API_KEY,
  })
  console.log('✅ Groq client initialized successfully')
} catch (error) {
  console.error('❌ Failed to initialize Groq client:', error.message)
  process.exit(1)
}

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SkillBridge AI Backend is running',
    timestamp: new Date().toISOString(),
  })
})

// ============================================
// EVALUATE STUDENT PROFILE ENDPOINT
// ============================================
app.post('/api/evaluate', async (req, res) => {
  try {
    const { fullName, skills, experience, education, bio } = req.body

    // Validate required fields
    if (!fullName || !skills) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fullName, skills',
      })
    }

    console.log(`📊 Evaluating profile for: ${fullName}`)

    // Create evaluation prompt
    const evaluationPrompt = `
You are an expert recruiter and career coach evaluating a student's profile for a tech position.

STUDENT PROFILE:
- Name: ${fullName}
- Skills: ${skills}
- Experience: ${experience || 'Not provided'}
- Education: ${education || 'Not provided'}
- Bio: ${bio || 'Not provided'}

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

    // Call Groq API
    console.log('🤖 Calling Groq API...')
    console.log('Groq client initialized:', !!groq)
    console.log('Groq client methods:', Object.keys(groq))
    
    if (!groq) {
      throw new Error('Groq client not initialized')
    }

    const message = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
    })

    const responseText = message.choices[0].message.content || ''
    console.log('✅ Groq API response received')
    console.log('Response preview:', responseText.substring(0, 100) + '...')

    // Parse JSON response
    let evaluation
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      evaluation = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      return res.status(500).json({
        success: false,
        error: 'Failed to parse AI response',
      })
    }

    // Validate evaluation structure
    if (!evaluation.strengths || !evaluation.weaknesses || !evaluation.suggestions ||
        evaluation.readinessScore === undefined || !evaluation.eligibility) {
      return res.status(500).json({
        success: false,
        error: 'AI response missing required fields',
      })
    }

    // Ensure score is in valid range
    evaluation.readinessScore = Math.min(100, Math.max(0, evaluation.readinessScore))

    console.log(`✅ Evaluation complete - Score: ${evaluation.readinessScore}, Eligibility: ${evaluation.eligibility}`)

    res.json({
      success: true,
      evaluation: {
        ...evaluation,
        evaluatedAt: new Date().toISOString(),
        model: 'groq-mixtral',
      },
    })
  } catch (error) {
    console.error('❌ Evaluation error:', error)
    res.status(500).json({
      success: false,
      error: `Evaluation failed: ${error.message}`,
    })
  }
})

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   SkillBridge AI Backend Running       ║
║   🚀 http://localhost:${PORT}        ║
║   📊 POST /api/evaluate                ║
║   🏥 GET /health                       ║
╚════════════════════════════════════════╝
  `)
})

export default app
