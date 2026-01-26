import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType] = useState('student') // Always student - admin registration disabled
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // Sign up with Firebase
      await signup(email, password, userType)

      // Redirect to home page after successful signup
      navigate('/')
    } catch (err) {
      // Show Firebase error messages
      console.error('Registration error code:', err.code)
      console.error('Full error:', err)
      
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already has an account')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak')
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password auth is not enabled. Please contact admin.')
      } else {
        setError(`Error: ${err.message}`)
      }
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 relative overflow-hidden">
      {/* Background Pattern - Subtle tech theme */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-40 h-40 bg-purple-400 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 left-20 w-60 h-60 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>
      
      {/* Top Navbar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg h-24 flex items-center px-6 z-50">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">SkillBridge AI</h1>
            <p className="text-sm text-indigo-200 font-bold mt-1">✨ AI-Powered Evaluation Platform</p>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl border-2 border-purple-400 border-opacity-60 hover:border-opacity-100 flex items-center justify-center text-lg transform hover:scale-105"
              title="Account Menu"
            >
              👤
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-gradient-to-br from-slate-800 to-indigo-900 rounded-xl shadow-2xl border border-purple-500 border-opacity-60 backdrop-blur-lg z-50 overflow-hidden">
                {/* Guest Section */}
                <div className="border-b border-purple-500 border-opacity-30 px-4 py-4">
                  <p className="text-purple-200 text-sm font-semibold mb-1">Welcome Guest</p>
                  <p className="text-white font-bold text-sm">Not logged in</p>
                  <div className="mt-3 inline-block px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full text-white text-xs font-bold">
                    👤 Guest
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
                    className="w-full flex items-center gap-3 px-4 py-3 text-blue-400 hover:bg-blue-600 hover:bg-opacity-30 transition-all text-left font-semibold"
                  >
                    <span className="text-lg">🏠</span>
                    <span>Home</span>
                  </button>

                  {/* Login Option */}
                  <button
                    onClick={() => {
                      navigate('/login')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-green-400 hover:bg-green-600 hover:bg-opacity-30 transition-all text-left font-semibold border-t border-purple-500 border-opacity-30"
                  >
                    <span className="text-lg">🔓</span>
                    <span>Login</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
      
      <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-indigo-500 border-opacity-40 relative z-10 backdrop-blur-sm mt-28">
        {/* Header with Icon - Horizontal Layout */}
        <div className="flex items-center gap-4 mb-8">
          <div className="inline-block bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl flex-shrink-0">
            <span className="text-3xl">🚀</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">SkillBridge</h1>
            <p className="text-purple-300 font-semibold text-sm">Start Your Evaluation Journey</p>
          </div>
        </div>
        
        <p className="text-slate-300 font-semibold text-sm mb-8 pb-8 border-b border-purple-500 border-opacity-20">Join thousands of evaluated students! 📚</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 text-red-200 rounded-lg font-semibold">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-white font-semibold mb-2">📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-slate-700 bg-opacity-80 border border-purple-400 border-opacity-60 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-slate-700 transition-all text-base"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-white font-semibold mb-2">🔐 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 bg-slate-700 bg-opacity-80 border border-purple-400 border-opacity-60 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-slate-700 transition-all text-base"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-white font-semibold mb-2">✅ Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 bg-slate-700 bg-opacity-80 border border-purple-400 border-opacity-60 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-slate-700 transition-all text-base"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition-all transform hover:scale-105 cursor-pointer mt-8"
          >
            {loading ? '⏳ Creating Account...' : '🚀 Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-white mt-6 font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-300 hover:text-purple-200 hover:underline transition-colors">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  )
}
