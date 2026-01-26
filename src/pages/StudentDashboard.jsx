import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import { createStudentProfile, getStudentProfile, saveAIEvaluation, getAIEvaluation } from '../firebaseDB'
import { evaluateWithRealAI } from '../evaluationService'

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Profile form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    skills: '',
    experience: '',
    education: '',
    bio: '',
  })

  const [resumeFile, setResumeFile] = useState(null)
  const [resumeFileName, setResumeFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileStatus, setProfileStatus] = useState('draft') // draft, submitted, evaluated
  const [uploading, setUploading] = useState(false)
  const [evaluation, setEvaluation] = useState(null) // Store evaluation results

  // Ref to scroll to evaluation results
  const resultsRef = useRef(null)

  // Load student profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      try {
        const profile = await getStudentProfile(user.uid)
        if (profile) {
          setFormData({
            fullName: profile.fullName || '',
            phone: profile.phone || '',
            skills: profile.skills || '',
            experience: profile.experience || '',
            education: profile.education || '',
            bio: profile.bio || '',
          })
          setResumeFileName(profile.resumeFileName || '')
          setProfileStatus(profile.status || 'draft')
        }
        
        // Load evaluation if exists
        const eval_ = await getAIEvaluation(user.uid)
        if (eval_) {
          setEvaluation(eval_)
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }
    loadProfile()
  }, [user])

  // Handle profile form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  // Handle resume file selection
  const handleResumeSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.includes('pdf')) {
        setError('Please upload a PDF file')
        return
      }
      // Validate file size (max 1MB for Firestore)
      if (file.size > 1 * 1024 * 1024) {
        setError('File size must be less than 1MB')
        return
      }
      setResumeFile(file)
      setError('')
    }
  }

  // Upload resume as Base64 to Firestore
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Convert file to Base64
      const base64String = await fileToBase64(resumeFile)

      // Save to Firestore
      await createStudentProfile(user.uid, {
        resumeBase64: base64String,
        resumeFileName: resumeFile.name,
      })

      setResumeFileName(resumeFile.name)
      setResumeFile(null)
      setSuccess('Resume uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error uploading resume:', err)
      setError('Failed to upload resume. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Download resume from Base64
  const handleDownloadResume = () => {
    if (!resumeFileName) return

    try {
      // You would need to fetch the profile to get the Base64 data
      // For now, this is a placeholder for the download functionality
      setSuccess('Resume download feature coming soon!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error downloading resume:', err)
      setError('Failed to download resume')
    }
  }

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validation
      if (!formData.fullName.trim()) {
        setError('Please enter your full name')
        setLoading(false)
        return
      }

      // Save profile to Firestore
      await createStudentProfile(user.uid, {
        ...formData,
        email: user.email,
        status: 'draft',
      })

      setSuccess('Profile saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Reset evaluation and allow re-submission
  const handleResetEvaluation = () => {
    setEvaluation(null)
    setProfileStatus('draft')
    setResumeFileName('')
    setSuccess('✨ Evaluation reset! You can now submit a new profile for evaluation.')
    setTimeout(() => setSuccess(''), 5000)
  }

  // Submit for evaluation
  const handleSubmitForEvaluation = async () => {
    if (!resumeFileName) {
      setError('Please upload your resume first')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Starting evaluation process...')
      
      // Call REAL AI backend (calls Groq API securely)
      console.log('Calling real AI backend for evaluation...')
      const evaluation = await evaluateWithRealAI(formData)
      console.log('Real AI evaluation received:', evaluation)

      // Save evaluation to Firestore
      console.log('Saving evaluation to Firestore...')
      await saveAIEvaluation(user.uid, evaluation)
      console.log('Evaluation saved!')

      // Update profile status to evaluated
      console.log('Updating profile status to evaluated...')
      await createStudentProfile(user.uid, {
        ...formData,
        email: user.email,
        status: 'evaluated',
      })
      console.log('Profile status updated!')

      // Update local state with evaluation - MUST do this AFTER saving to ensure state updates
      console.log('Setting local state...')
      setEvaluation(evaluation)
      setProfileStatus('evaluated')
      setSuccess('🎉 Real AI evaluation complete! Check your results below.')
      setTimeout(() => setSuccess(''), 5000)
      console.log('Evaluation complete!')

      // Scroll to results after a brief delay to ensure state updates
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } catch (err) {
      console.error('Error submitting profile:', err)
      console.error('Error details:', err.message)
      setError(`Failed to evaluate profile: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-black via-gray-900 to-black'
        : 'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-20'}`}>
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-gray-700' : 'bg-blue-300'}`}></div>
        <div className={`absolute top-1/2 right-20 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-gray-700' : 'bg-cyan-300'}`}></div>
        <div className={`absolute bottom-20 left-1/3 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-gray-700' : 'bg-sky-300'}`}></div>
      </div>

      {/* Navbar */}
      <nav className={`backdrop-blur-md sticky top-0 z-50 shadow-lg border-b transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700'
          : 'bg-gradient-to-br from-sky-200 via-cyan-100 to-blue-200 border-sky-300'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className={`text-5xl font-black bg-clip-text text-transparent drop-shadow-lg bg-gradient-to-r ${
              isDark
                ? 'from-white via-gray-300 to-gray-200'
                : 'from-indigo-700 via-purple-700 to-pink-700'
            }`}>SkillBridge AI</h1>
            <p className={`text-sm font-bold mt-1 ${isDark ? 'text-gray-300' : 'text-indigo-600'}`}>✨ AI-Powered Evaluation Platform</p>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`group relative w-12 h-12 rounded-full hover:shadow-xl transition-all shadow-lg border-2 flex items-center justify-center text-lg transform hover:scale-105 ${
                isDark
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-blue-400 border-opacity-60 hover:border-opacity-100'
                  : 'bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 border-blue-300 border-opacity-60 hover:border-opacity-100'
              }`}
              title="Profile Menu"
            >
              👨‍🎓
              <div className={`absolute inset-0 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10 ${isDark ? 'bg-blue-400' : 'bg-blue-300'}`}></div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-3 w-56 rounded-xl shadow-2xl border backdrop-blur-lg z-50 overflow-hidden transition-colors duration-300 ${
                isDark
                  ? 'bg-gradient-to-br from-slate-800 to-indigo-900 border-indigo-500 border-opacity-60'
                  : 'bg-gradient-to-br from-slate-50 to-indigo-50 border-indigo-200 border-opacity-60'
              }`}>
                {/* Profile Section */}
                <div className={`border-b px-4 py-4 ${isDark ? 'border-indigo-500 border-opacity-30' : 'border-indigo-200 border-opacity-40'}`}>
                  <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>Logged in as</p>
                  <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.email}</p>
                  <div className={`mt-3 inline-block px-3 py-1 rounded-full text-white text-xs font-bold ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                  }`}>
                    👨‍🎓 Student
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {/* Home Option */}
                  <button
                    onClick={() => {
                      navigate('/')
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left font-semibold ${
                      isDark
                        ? 'text-blue-400 hover:bg-blue-600 hover:bg-opacity-30'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <span className="text-lg">🏠</span>
                    <span>Home</span>
                  </button>

                  {/* Logout Option */}
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left font-semibold border-t ${
                      isDark
                        ? 'text-red-400 hover:bg-red-600 hover:bg-opacity-30 border-indigo-500 border-opacity-30'
                        : 'text-red-600 hover:bg-red-100 border-indigo-200 border-opacity-40'
                    }`}
                  >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                  </button>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left font-semibold border-t ${
                      isDark
                        ? 'text-yellow-400 hover:bg-yellow-900 hover:bg-opacity-20 border-gray-600'
                        : 'text-yellow-600 hover:bg-yellow-100 border-indigo-200 border-opacity-40'
                    }`}
                  >
                    <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Welcome & Status Section */}
        <div className="mb-8">
          <h2 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome, {formData.fullName || 'Student'}! 👋</h2>
          <p className={`text-lg font-semibold ${isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>Complete your profile and get AI-powered evaluation</p>
          
          {/* Status Progress */}
          <div className={`mt-6 bg-opacity-60 backdrop-blur-sm rounded-lg shadow-lg p-6 border transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800 border-indigo-500 border-opacity-30'
              : 'bg-white bg-opacity-70 border-indigo-200 border-opacity-40'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Profile Completion Status</span>
              <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
                profileStatus === 'draft' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                profileStatus === 'submitted' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}>
                {profileStatus === 'draft' ? '📝 Draft' : profileStatus === 'submitted' ? '📤 Submitted' : '✅ Evaluated'}
              </span>
            </div>
            <div className={`w-full rounded-full h-3 ${isDark ? 'bg-slate-700 bg-opacity-50' : 'bg-slate-200'}`}>
              <div
                className={`h-3 rounded-full transition-all shadow-lg ${
                  profileStatus === 'draft' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 w-1/3' :
                  profileStatus === 'submitted' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 w-2/3' :
                  'bg-gradient-to-r from-green-500 to-emerald-500 w-full'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border-l-4 border-red-400 text-red-200 rounded-lg shadow-md flex items-start backdrop-blur-sm">
            <span className="text-2xl mr-3">⚠️</span>
            <div className="font-semibold">{error}</div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border-l-4 border-green-400 text-green-200 rounded-lg shadow-md flex items-start backdrop-blur-sm">
            <span className="text-2xl mr-3">✅</span>
            <div className="font-semibold">{success}</div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-2xl p-8 border border-blue-500 border-opacity-40 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">📋</span>
              <h2 className="text-2xl font-bold text-white">Your Profile Information</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Full Name */}
              <div className="group">
                <label className="block text-white font-semibold mb-2">👤 Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-blue-500 border-opacity-30 rounded-lg bg-slate-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-white font-semibold mb-2">📱 Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-blue-500 border-opacity-30 rounded-lg bg-slate-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Skills */}
              <div className="group">
                <label className="block text-white font-semibold mb-2">⚙️ Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="JavaScript, React, Node.js, Python"
                  className="w-full px-4 py-3 border-2 border-blue-500 border-opacity-30 rounded-lg bg-slate-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  disabled={loading}
                />
                <p className="text-indigo-300 text-xs mt-2">💡 Separate skills with commas for better AI analysis</p>
              </div>

              {/* Experience */}
              <div className="group">
                <label className="block text-white font-semibold mb-2">💼 Years of Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 years in web development"
                  className="w-full px-4 py-3 border-2 border-blue-500 border-opacity-30 rounded-lg bg-slate-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Education */}
              <div className="group">
                <label className="block text-white font-semibold mb-2">🎓 Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="Bachelor's in Computer Science"
                  className="w-full px-4 py-3 border-2 border-blue-500 border-opacity-30 rounded-lg bg-slate-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Bio */}
              <div className="group">
                <label className="block text-white font-semibold mb-2">✍️ About You</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your career goals and interests..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-blue-500 border-opacity-30 rounded-lg bg-slate-700 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none"
                  disabled={loading}
                />
              </div>

              {/* Save Profile Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                {loading ? '💾 Saving...' : '💾 Save Profile'}
              </button>
            </form>
          </div>

          {/* Right Column - Resume Upload & Submit */}
          <div className="space-y-6">
            {/* Resume Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">📄</span>
                <h2 className="text-2xl font-bold text-gray-800">Resume Upload</h2>
              </div>

              {resumeFileName ? (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <p className="text-green-700 font-semibold text-lg">✅ Resume Ready</p>
                  <p className="text-gray-600 text-sm mt-2">File: <span className="font-medium">{resumeFileName}</span></p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                  <p className="text-amber-700 font-semibold">⚠️ Upload Resume to Proceed</p>
                  <p className="text-gray-600 text-sm mt-2">Required for AI evaluation</p>
                </div>
              )}

              {/* File Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-3">Select PDF Resume</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeSelect}
                    disabled={uploading}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none hover:border-green-500 transition-all"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">📋 PDF only, Max 1MB</p>
              </div>

              {resumeFile && (
                <p className="text-sm text-gray-700 mb-4 bg-blue-50 p-3 rounded-lg">
                  📎 Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(2)} KB)
                </p>
              )}

              {/* Upload Button */}
              <button
                onClick={handleResumeUpload}
                disabled={!resumeFile || uploading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                {uploading ? '⬆️ Uploading...' : '⬆️ Upload Resume'}
              </button>
            </div>

            {/* Submit for Evaluation Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-500">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">🤖</span>
                <h2 className="text-2xl font-bold text-gray-800">AI Evaluation</h2>
              </div>

              <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                <p className="text-purple-700 text-sm font-medium">
                  🚀 Get AI-powered feedback on your profile, strengths, weaknesses, and career readiness!
                </p>
              </div>

              <button
                onClick={handleSubmitForEvaluation}
                disabled={!resumeFileName || loading || profileStatus === 'submitted' || profileStatus === 'evaluated' || evaluation}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg text-lg"
              >
                {profileStatus === 'draft' && !resumeFileName ? '⬆️ Upload Resume First' :
                 evaluation ? '✅ Evaluation Complete' :
                 profileStatus === 'draft' ? '🚀 Submit for AI Evaluation' :
                 '⏳ Evaluating...'}
              </button>

              {profileStatus === 'submitted' && !evaluation && (
                <p className="text-center text-gray-600 mt-4 text-sm bg-blue-50 p-3 rounded-lg">
                  ⏳ Your profile is being evaluated by our AI. Check back in a moment!
                </p>
              )}

              {(profileStatus === 'evaluated' || evaluation) && evaluation && (
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <p className="text-green-700 font-semibold text-lg">✅ Evaluation Complete!</p>
                  <p className="text-gray-600 text-sm mt-2">Scroll down to see your detailed AI analysis →</p>
                </div>
              )}
            </div>
          </div>

          {/* Evaluation Results Section */}
          {evaluation && (
            <div className="lg:col-span-3 space-y-6" ref={resultsRef}>
                {/* Main Score Card */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-xl p-10 text-white">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold">🎯 Your Evaluation Results</h2>
                    <button
                      onClick={handleResetEvaluation}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                      title="Reset and submit a new profile for evaluation"
                    >
                      ↻ New Evaluation
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-purple-100 text-sm font-medium mb-2">Readiness Score</p>
                      <div className="text-6xl font-bold">{evaluation.readinessScore}</div>
                      <p className="text-purple-100 text-sm mt-1">out of 100</p>
                    </div>
                    <div>
                      <p className="text-purple-100 text-sm font-medium mb-2">Eligibility Status</p>
                      <div className={`inline-block px-6 py-3 rounded-full font-bold text-lg ${
                        evaluation.eligibility === 'Eligible' ? 'bg-green-400 text-green-900' :
                        evaluation.eligibility === 'Needs Improvement' ? 'bg-yellow-300 text-yellow-900' :
                        'bg-red-400 text-red-900'
                      }`}>
                        {evaluation.eligibility}
                      </div>
                    </div>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="mt-8">
                    <p className="text-purple-100 text-sm font-medium mb-3">Progress</p>
                    <div className="w-full bg-purple-400 bg-opacity-30 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          evaluation.readinessScore >= 75 ? 'bg-green-300' :
                          evaluation.readinessScore >= 50 ? 'bg-yellow-300' :
                          'bg-red-300'
                        }`}
                        style={{ width: `${evaluation.readinessScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Strengths Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-3xl mr-3">💪</span> Your Strengths
                  </h3>
                  <div className="space-y-3">
                    {evaluation.strengths && evaluation.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-start p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <span className="text-2xl mr-3 flex-shrink-0">✓</span>
                        <span className="text-gray-700 text-lg">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-500">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-3xl mr-3">⚡</span> Areas for Improvement
                  </h3>
                  <div className="space-y-3">
                    {evaluation.weaknesses && evaluation.weaknesses.map((weakness, idx) => (
                      <div key={idx} className="flex items-start p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                        <span className="text-2xl mr-3 flex-shrink-0">→</span>
                        <span className="text-gray-700 text-lg">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="text-3xl mr-3">📚</span> Recommended Next Steps
                  </h3>
                  <div className="space-y-3">
                    {evaluation.suggestions && evaluation.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <span className="text-2xl mr-3 flex-shrink-0 font-bold text-blue-600">{idx + 1}</span>
                        <span className="text-gray-700 text-lg">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Message */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                  <p className="text-gray-700 text-center text-lg">
                    🚀 <span className="font-bold">Keep improving!</span> These insights are based on our AI analysis. Take action on the recommendations above to boost your readiness score.
                  </p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
