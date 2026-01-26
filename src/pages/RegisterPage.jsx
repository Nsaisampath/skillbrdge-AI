import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'

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
  const { isDark, toggleTheme } = useTheme()

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
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-black via-gray-900 to-black'
        : 'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100'
    }`}>
      {/* Background Pattern - Subtle tech theme */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-20'}`}>
        <div className={`absolute top-10 right-10 w-40 h-40 rounded-full blur-2xl ${isDark ? 'bg-gray-700' : 'bg-cyan-300'}`}></div>
        <div className={`absolute top-1/3 left-20 w-60 h-60 rounded-full blur-3xl ${isDark ? 'bg-gray-700' : 'bg-sky-300'}`}></div>
        <div className={`absolute bottom-20 right-1/3 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-gray-700' : 'bg-blue-300'}`}></div>
      </div>
      
      {/* Top Navbar */}
      <div className={`absolute top-0 left-0 right-0 backdrop-blur-lg border-b h-24 flex items-center px-6 z-50 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700'
          : 'bg-gradient-to-br from-sky-200 via-cyan-100 to-blue-200 border-sky-300'
      }`}>
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
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
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-purple-400 border-opacity-60 hover:border-opacity-100'
                  : 'bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 border-blue-300 border-opacity-60 hover:border-opacity-100'
              }`}
              title="Account Menu"
            >
              👤
              <div className={`absolute inset-0 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10 ${isDark ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-3 w-56 rounded-xl shadow-2xl border backdrop-blur-lg z-50 overflow-hidden transition-colors duration-300 ${
                isDark
                  ? 'bg-gradient-to-br from-slate-800 to-indigo-900 border-purple-500 border-opacity-60'
                  : 'bg-gradient-to-br from-slate-50 to-indigo-50 border-indigo-200 border-opacity-60'
              }`}>
                {/* Guest Section */}
                <div className={`border-b px-4 py-4 ${isDark ? 'border-purple-500 border-opacity-30' : 'border-indigo-200 border-opacity-40'}`}>
                  <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>Welcome Guest</p>
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Not logged in</p>
                  <div className={`mt-3 inline-block px-3 py-1 rounded-full text-white text-xs font-bold ${
                    isDark
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500'
                  }`}>
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
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left font-semibold ${
                      isDark
                        ? 'text-blue-400 hover:bg-blue-600 hover:bg-opacity-30'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
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
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left font-semibold border-t ${
                      isDark
                        ? 'text-green-400 hover:bg-green-600 hover:bg-opacity-30 border-purple-500 border-opacity-30'
                        : 'text-green-600 hover:bg-green-100 border-indigo-300 border-opacity-40'
                    }`}
                  >
                    <span className="text-lg">🔓</span>
                    <span>Login</span>
                  </button>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left font-semibold border-t ${
                      isDark
                        ? 'text-yellow-400 hover:bg-yellow-900 hover:bg-opacity-20 border-gray-600'
                        : 'text-yellow-600 hover:bg-yellow-100 border-indigo-300 border-opacity-40'
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
      </div>
      
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
      
      <div className={`w-full max-w-md rounded-2xl shadow-2xl p-8 relative z-10 backdrop-blur-sm mt-28 transition-colors duration-300 border ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-indigo-500 border-opacity-40'
          : 'bg-gradient-to-br from-white to-slate-50 border-indigo-200 border-opacity-60'
      }`}>
        {/* Header with Icon - Horizontal Layout */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`inline-block p-4 rounded-xl flex-shrink-0 bg-gradient-to-br ${
            isDark
              ? 'from-purple-500 to-pink-600'
              : 'from-purple-400 to-pink-500'
          }`}>
            <span className="text-3xl">🚀</span>
          </div>
          <div>
            <h1 className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>SkillBridge</h1>
            <p className={`font-semibold text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Start Your Evaluation Journey</p>
          </div>
        </div>
        
        <p className={`font-semibold text-sm mb-8 pb-8 border-b transition-colors duration-300 ${
          isDark
            ? 'text-slate-300 border-purple-500 border-opacity-20'
            : 'text-slate-600 border-purple-300 border-opacity-40'
        }`}>Join thousands of evaluated students! 📚</p>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg font-semibold border transition-colors duration-300 ${
            isDark
              ? 'bg-red-500 bg-opacity-20 border-red-400 text-red-200'
              : 'bg-red-100 border-red-300 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className={`block font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-base ${
                isDark
                  ? 'bg-slate-700 bg-opacity-80 border border-purple-400 border-opacity-60 text-white placeholder-gray-300 focus:ring-purple-400 focus:bg-slate-700'
                  : 'bg-white border border-purple-300 text-slate-900 placeholder-slate-400 focus:ring-purple-400 focus:bg-sky-50'
              }`}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className={`block font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>🔐 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-base ${
                isDark
                  ? 'bg-slate-700 bg-opacity-80 border border-purple-400 border-opacity-60 text-white placeholder-gray-300 focus:ring-purple-400 focus:bg-slate-700'
                  : 'bg-white border border-purple-300 text-slate-900 placeholder-slate-400 focus:ring-purple-400 focus:bg-sky-50'
              }`}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className={`block font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>✅ Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-base ${
                isDark
                  ? 'bg-slate-700 bg-opacity-80 border border-purple-400 border-opacity-60 text-white placeholder-gray-300 focus:ring-purple-400 focus:bg-slate-700'
                  : 'bg-white border border-purple-300 text-slate-900 placeholder-slate-400 focus:ring-purple-400 focus:bg-sky-50'
              }`}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg disabled:opacity-50 transition-all transform hover:scale-105 cursor-pointer mt-8 ${
              isDark
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                : 'bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-400/50'
            }`}
          >
            {loading ? '⏳ Creating Account...' : '🚀 Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <p className={`text-center mt-6 font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Already have an account?{' '}
          <Link to="/login" className={`hover:underline transition-colors ${isDark ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-700'}`}>
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  )
}
