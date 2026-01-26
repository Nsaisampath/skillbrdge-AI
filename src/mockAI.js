// Mock AI Evaluation - Generates realistic results without API calls
// This works 100% FREE on Spark plan!

export function generateMockEvaluation(studentProfile) {
  // Skills strength mapping
  const skillsArray = studentProfile.skills
    ? studentProfile.skills.split(',').map(s => s.trim().toLowerCase())
    : []

  const strengths = []
  const weaknesses = []
  let score = 50 // Start with base score

  // ============================================
  // ANALYZE SKILLS
  // ============================================
  const frontendSkills = ['javascript', 'react', 'vue', 'angular', 'html', 'css']
  const backendSkills = ['node.js', 'python', 'java', 'golang', 'django', 'express']
  const databaseSkills = ['sql', 'firebase', 'mongodb', 'postgresql', 'mysql']
  const devopsSkills = ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git']

  const hasFrontend = skillsArray.some(s => frontendSkills.some(f => s.includes(f)))
  const hasBackend = skillsArray.some(s => backendSkills.some(b => s.includes(b)))
  const hasDatabase = skillsArray.some(s => databaseSkills.some(d => s.includes(d)))
  const hasDevops = skillsArray.some(s => devopsSkills.some(dv => s.includes(dv)))

  // Frontend skills
  if (hasFrontend) {
    strengths.push('Strong frontend development skills')
    score += 15
  } else {
    weaknesses.push('Limited frontend experience')
  }

  // Backend skills
  if (hasBackend) {
    strengths.push('Backend development knowledge')
    score += 15
  } else {
    weaknesses.push('No backend programming experience')
  }

  // Database skills
  if (hasDatabase) {
    strengths.push('Database management knowledge')
    score += 10
  } else {
    weaknesses.push('Database experience needed')
  }

  // DevOps skills
  if (hasDevops) {
    strengths.push('DevOps and deployment experience')
    score += 10
  }

  // ============================================
  // ANALYZE EXPERIENCE
  // ============================================
  const experienceYears = parseInt(studentProfile.experience || '0')

  if (experienceYears >= 3) {
    strengths.push('Solid professional experience')
    score += 15
  } else if (experienceYears >= 1) {
    strengths.push('Growing professional experience')
    score += 8
  } else if (experienceYears === 0) {
    weaknesses.push('Needs more hands-on experience')
  }

  // ============================================
  // ANALYZE EDUCATION
  // ============================================
  if (studentProfile.education && studentProfile.education.toLowerCase().includes('bachelor')) {
    strengths.push('Bachelor degree qualification')
    score += 10
  } else if (studentProfile.education && studentProfile.education.toLowerCase().includes('master')) {
    strengths.push('Advanced degree qualification')
    score += 15
  }

  // ============================================
  // ANALYZE BIO/PORTFOLIO
  // ============================================
  if (studentProfile.bio && studentProfile.bio.length > 50) {
    strengths.push('Clear communication and self-awareness')
    score += 5
  }

  // ============================================
  // ENSURE MINIMUM 3 OF EACH
  // ============================================
  while (strengths.length < 3) {
    const additionalStrengths = [
      'Problem-solving ability',
      'Learning aptitude',
      'Team collaboration potential',
      'Attention to detail',
    ]
    strengths.push(additionalStrengths[Math.floor(Math.random() * additionalStrengths.length)])
  }

  while (weaknesses.length < 2) {
    const additionalWeaknesses = [
      'Limited system design experience',
      'Need to strengthen data structures knowledge',
      'More projects needed for portfolio',
    ]
    weaknesses.push(additionalWeaknesses[Math.floor(Math.random() * additionalWeaknesses.length)])
  }

  // ============================================
  // GENERATE SUGGESTIONS
  // ============================================
  const suggestions = []

  if (!hasBackend) {
    suggestions.push('Learn backend development with Node.js or Python')
  }
  if (!hasDatabase) {
    suggestions.push('Master database design and SQL/NoSQL technologies')
  }
  if (!hasDevops) {
    suggestions.push('Build DevOps skills with Docker and cloud platforms')
  }
  if (experienceYears < 2) {
    suggestions.push('Build more real-world projects to strengthen portfolio')
  }

  suggestions.push('Contribute to open-source projects')

  // ============================================
  // DETERMINE ELIGIBILITY
  // ============================================
  let eligibility = 'Not Ready'
  if (score >= 75) {
    eligibility = 'Eligible'
  } else if (score >= 50) {
    eligibility = 'Needs Improvement'
  }

  // Clamp score between 0-100
  score = Math.min(100, Math.max(0, score))

  // ============================================
  // RETURN EVALUATION
  // ============================================
  return {
    strengths: strengths.slice(0, 4), // Top 4 strengths
    weaknesses: weaknesses.slice(0, 3), // Top 3 weaknesses
    suggestions: suggestions.slice(0, 4), // Top 4 suggestions
    readinessScore: score,
    eligibility: eligibility,
    evaluatedAt: new Date().toISOString(),
    model: 'mock-ai', // Indicates this is simulated
    note: '⚠️ This is a simulated evaluation. For production, upgrade to Blaze plan for real AI evaluation.',
  }
}
