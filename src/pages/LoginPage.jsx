import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Basic validation
      if (!email || !password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      // Sign in with Firebase
      await login(email, password)

      // Redirect to home page after successful login
      navigate('/')
    } catch (err) {
      // Show Firebase error message
      console.error('Login error code:', err.code)
      console.error('Full error:', err)
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password auth is not enabled. Please contact admin.')
      } else {
        setError(`Error: ${err.message}`)
      }
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 relative overflow-hidden">
      {/* Background Pattern - Subtle tech theme */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-indigo-400 rounded-full blur-3xl"></div>
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
              className="group relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl border-2 border-indigo-400 border-opacity-60 hover:border-opacity-100 flex items-center justify-center text-lg transform hover:scale-105"
              title="Account Menu"
            >
              👤
              <div className="absolute inset-0 bg-indigo-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-gradient-to-br from-slate-800 to-indigo-900 rounded-xl shadow-2xl border border-indigo-500 border-opacity-60 backdrop-blur-lg z-50 overflow-hidden">
                {/* Guest Section */}
                <div className="border-b border-indigo-500 border-opacity-30 px-4 py-4">
                  <p className="text-indigo-200 text-sm font-semibold mb-1">Welcome Guest</p>
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

                  {/* Register Option */}
                  <button
                    onClick={() => {
                      navigate('/register')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-purple-400 hover:bg-purple-600 hover:bg-opacity-30 transition-all text-left font-semibold border-t border-indigo-500 border-opacity-30"
                  >
                    <span className="text-lg">✍️</span>
                    <span>Register</span>
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
          <div className="inline-block bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl flex-shrink-0">
            <span className="text-3xl">🎓</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">SkillBridge</h1>
            <p className="text-indigo-300 font-semibold text-sm">AI-Powered Student Evaluation</p>
          </div>
        </div>
        
        <p className="text-slate-300 font-semibold text-sm mb-8 pb-8 border-b border-indigo-500 border-opacity-20">Welcome back, student! 👋</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 text-red-200 rounded-lg font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-white font-semibold mb-2">📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-slate-700 bg-opacity-80 border border-indigo-400 border-opacity-60 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-slate-700 transition-all text-base"
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
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-slate-700 bg-opacity-80 border border-indigo-400 border-opacity-60 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-slate-700 transition-all text-base"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 transition-all transform hover:scale-105 cursor-pointer mt-8"
          >
            {loading ? '⏳ Signing in...' : '✨ Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-white mt-6 font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-300 hover:text-blue-200 hover:underline transition-colors">
            Sign Up Here
          </Link>
        </p>

        {/* Admin Login Hint */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Admin? Log in with your admin account
        </p>
      </div>
    </div>
  )
}
