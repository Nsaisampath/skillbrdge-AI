import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import { useState } from 'react'

export function AuthenticatedHomePage() {
  const { user, userRole, logout } = useAuth()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  const handleStudentDashboard = () => {
    navigate('/student')
  }

  const handleAdminDashboard = () => {
    navigate('/admin')
  }

  const handleViewProfile = () => {
    if (userRole === 'student') {
      handleStudentDashboard()
    } else {
      handleAdminDashboard()
    }
    setIsDropdownOpen(false)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-black via-gray-900 to-black'
        : 'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100'
    }`}>
      {/* Navbar */}
      <nav className={`backdrop-blur-lg sticky top-0 z-50 shadow-lg border-b transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700'
          : 'bg-gradient-to-br from-sky-200 via-cyan-100 to-blue-200 border-sky-300'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className={`text-5xl font-black bg-clip-text text-transparent drop-shadow-lg bg-gradient-to-r ${
              isDark
                ? 'from-white via-gray-300 to-gray-200'
                : 'from-indigo-700 via-purple-700 to-pink-700'
            }`}>SkillBridge AI</h1>
            <p className={`text-base font-bold mt-2 ${isDark ? 'text-gray-300' : 'text-indigo-600'}`}>✨ AI-Powered Evaluation Platform</p>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`group relative w-14 h-14 rounded-full hover:shadow-2xl transition-all shadow-xl border-2 flex items-center justify-center text-2xl transform hover:scale-110 ${
                isDark
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-blue-400 border-opacity-60 hover:border-opacity-100'
                  : 'bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 border-blue-300 border-opacity-60 hover:border-opacity-100'
              }`}
              title="Profile Menu"
            >
              {userRole === 'student' ? '👨‍🎓' : '👨‍💼'}
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
                    {userRole === 'student' ? '👨‍🎓 Student' : '👨‍💼 Admin'}
                  </div>
                </div>
                {/* Menu Items */}
                <div className="py-2">
                  {/* Profile Option */}
                  <button
                    onClick={handleViewProfile}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left font-semibold ${
                      isDark
                        ? 'text-white hover:bg-indigo-600 hover:bg-opacity-50'
                        : 'text-slate-900 hover:bg-indigo-100'
                    }`}
                  >
                    <span className="text-lg">{userRole === 'student' ? '👨‍🎓' : '👨‍💼'}</span>
                    <span>Profile</span>
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
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h2 className={`text-6xl font-bold mb-4 drop-shadow-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome Back! 👋
            </h2>
            <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              AI-Powered Student Profile Screening System
            </p>
          </div>
          
          {/* Project Benefits */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            <div className="bg-blue-600 bg-opacity-40 backdrop-blur rounded-lg p-4 border border-blue-300 border-opacity-50 hover:bg-opacity-60 transition-all">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-white text-sm font-bold drop-shadow-lg">Easy Profiles</p>
              <p className="text-white font-bold text-lg drop-shadow-lg">Simple Setup</p>
            </div>
            <div className="bg-purple-600 bg-opacity-40 backdrop-blur rounded-lg p-4 border border-purple-300 border-opacity-50 hover:bg-opacity-60 transition-all">
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-white text-sm font-bold drop-shadow-lg">Smart Analysis</p>
              <p className="text-white font-bold text-lg drop-shadow-lg">AI Evaluation</p>
            </div>
            <div className="bg-pink-600 bg-opacity-40 backdrop-blur rounded-lg p-4 border border-pink-300 border-opacity-50 hover:bg-opacity-60 transition-all">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-white text-sm font-bold drop-shadow-lg">Real Insights</p>
              <p className="text-white font-bold text-lg drop-shadow-lg">Fast Results</p>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="mt-16 mb-16">
          <h3 className="text-4xl font-bold text-white text-center mb-4 drop-shadow-lg">
            🎯 What SkillBridge AI Does
          </h3>
          <p className="text-indigo-200 text-center text-lg font-semibold mb-10 max-w-3xl mx-auto">
            We use cutting-edge AI technology to evaluate your skills, analyze your potential, and provide personalized feedback to help you succeed.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Resume Screening */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl shadow-xl p-8 border border-blue-500 border-opacity-40 backdrop-blur-sm hover:border-opacity-60 transition-all">
              <div className="text-5xl mb-4">📄</div>
              <h4 className="text-2xl font-bold text-white mb-3">Resume Screening</h4>
              <p className="text-indigo-200 font-semibold mb-4">
                Our AI analyzes your resume to extract key information about your experience, skills, and qualifications.
              </p>
              <ul className="space-y-2">
                <li className="text-white flex items-start">
                  <span className="mr-3 text-blue-400">✓</span>
                  <span>Parse your CV automatically</span>
                </li>
                <li className="text-white flex items-start">
                  <span className="mr-3 text-blue-400">✓</span>
                  <span>Extract key competencies</span>
                </li>
                <li className="text-white flex items-start">
                  <span className="mr-3 text-blue-400">✓</span>
                  <span>Verify professional background</span>
                </li>
              </ul>
            </div>

            {/* Skills Analysis */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl shadow-xl p-8 border border-purple-500 border-opacity-40 backdrop-blur-sm hover:border-opacity-60 transition-all">
              <div className="text-5xl mb-4">🤖</div>
              <h4 className="text-2xl font-bold text-white mb-3">Skills Analysis</h4>
              <p className="text-purple-200 font-semibold mb-4">
                Deep dive into your technical and soft skills to identify strengths and areas for improvement.
              </p>
              <ul className="space-y-2">
                <li className="text-white flex items-start">
                  <span className="mr-3 text-purple-400">✓</span>
                  <span>Evaluate technical proficiency</span>
                </li>
                <li className="text-white flex items-start">
                  <span className="mr-3 text-purple-400">✓</span>
                  <span>Assess soft skills</span>
                </li>
                <li className="text-white flex items-start">
                  <span className="mr-3 text-purple-400">✓</span>
                  <span>Benchmark against industry standards</span>
                </li>
              </ul>
            </div>

            {/* AI Evaluation & Review */}
            <div className="bg-gradient-to-br from-pink-900 to-rose-900 rounded-2xl shadow-xl p-8 border border-pink-500 border-opacity-40 backdrop-blur-sm hover:border-opacity-60 transition-all">
              <div className="text-5xl mb-4">⭐</div>
              <h4 className="text-2xl font-bold text-white mb-3">AI Evaluation & Review</h4>
              <p className="text-pink-200 font-semibold mb-4">
                Get comprehensive AI-powered feedback on your readiness, potential, and career prospects.
              </p>
              <ul className="space-y-2">
                <li className="text-white flex items-start">
                  <span className="mr-3 text-pink-400">✓</span>
                  <span>Personalized evaluation report</span>
                </li>
                <li className="text-white flex items-start">
                  <span className="mr-3 text-pink-400">✓</span>
                  <span>Actionable improvement suggestions</span>
                </li>
                <li className="text-white flex items-start">
                  <span className="mr-3 text-pink-400">✓</span>
                  <span>Career readiness score</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Why You Need Us */}
          <div className="mt-12 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl shadow-2xl p-10 border border-indigo-500 border-opacity-40 backdrop-blur-sm">
            <h4 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="mr-4">💡</span> Why You Need SkillBridge AI
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="text-3xl mr-4">🎯</div>
                <div>
                  <h5 className="text-white font-bold text-lg mb-2">Clear Career Direction</h5>
                  <p className="text-indigo-200">Understand your strengths and know exactly what to improve for your dream job</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-3xl mr-4">⚡</div>
                <div>
                  <h5 className="text-white font-bold text-lg mb-2">Save Time & Effort</h5>
                  <p className="text-indigo-200">Get instant AI evaluation instead of waiting for months to hear back from recruiters</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-3xl mr-4">📈</div>
                <div>
                  <h5 className="text-white font-bold text-lg mb-2">Competitive Advantage</h5>
                  <p className="text-indigo-200">Stand out in the job market with data-backed insights about your skills</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-3xl mr-4">🚀</div>
                <div>
                  <h5 className="text-white font-bold text-lg mb-2">Fast & Affordable</h5>
                  <p className="text-indigo-200">Professional evaluation at zero cost - AI-powered, instant results</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Coming Soon ✨
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Online Tests Button */}
            <div className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-6 cursor-not-allowed opacity-75 hover:opacity-85 transition-all border border-emerald-400 border-opacity-50">
              <div className="absolute top-3 right-3 bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                SOON
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-3">📝</div>
                <h4 className="text-lg font-bold text-white mb-2">Online Tests</h4>
                <p className="text-white font-semibold text-sm mb-3">
                  Coding assessments, aptitude tests, skill verification exams
                </p>
                <div className="space-y-1 text-white text-xs font-semibold mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">✓</span> Coding Challenges
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span> Skill Assessments
                  </div>
                </div>
                <button disabled className="w-full bg-white text-emerald-600 font-bold py-2 rounded-lg opacity-60 cursor-not-allowed text-sm">
                  🔒 Q2 2026
                </button>
              </div>
            </div>

            {/* AI Interview Button */}
            <div className="group relative bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl shadow-2xl p-6 cursor-not-allowed opacity-75 hover:opacity-85 transition-all border border-orange-400 border-opacity-50">
              <div className="absolute top-3 right-3 bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                SOON
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-3">🎤</div>
                <h4 className="text-lg font-bold text-white mb-2">AI Interview</h4>
                <p className="text-white font-semibold text-sm mb-3">
                  Mock interviews with real-time AI feedback on performance
                </p>
                <div className="space-y-1 text-white text-xs font-semibold mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">✓</span> Mock Interviews
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span> AI Feedback
                  </div>
                </div>
                <button disabled className="w-full bg-white text-orange-600 font-bold py-2 rounded-lg opacity-60 cursor-not-allowed text-sm">
                  🔒 Q2 2026
                </button>
              </div>
            </div>

            {/* Skill Improvement Button */}
            <div className="group relative bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-2xl p-6 cursor-not-allowed opacity-75 hover:opacity-85 transition-all border border-indigo-400 border-opacity-50">
              <div className="absolute top-3 right-3 bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                SOON
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-3">📚</div>
                <h4 className="text-lg font-bold text-white mb-2">Skill Growth</h4>
                <p className="text-white font-semibold text-sm mb-3">
                  Personalized learning paths and skill improvement tracking
                </p>
                <div className="space-y-1 text-white text-xs font-semibold mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">✓</span> Learning Paths
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span> Progress Track
                  </div>
                </div>
                <button disabled className="w-full bg-white text-indigo-600 font-bold py-2 rounded-lg opacity-60 cursor-not-allowed text-sm">
                  🔒 Q3 2026
                </button>
              </div>
            </div>

            {/* Placement Assistance Button */}
            <div className="group relative bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl shadow-2xl p-6 cursor-not-allowed opacity-75 hover:opacity-85 transition-all border border-pink-400 border-opacity-50">
              <div className="absolute top-3 right-3 bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                SOON
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-3">💼</div>
                <h4 className="text-lg font-bold text-white mb-2">Placement Aid</h4>
                <p className="text-white font-semibold text-sm mb-3">
                  Job recommendations, resume tips, and hiring connections
                </p>
                <div className="space-y-1 text-white text-xs font-semibold mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">✓</span> Job Match
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✓</span> Connections
                  </div>
                </div>
                <button disabled className="w-full bg-white text-pink-600 font-bold py-2 rounded-lg opacity-60 cursor-not-allowed text-sm">
                  🔒 Q3 2026
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white text-base font-bold drop-shadow-lg">
          <p>SkillBridge AI • AI-Powered Student Evaluation • 🚀 Build & Deploy 2026</p>
        </div>
      </div>
    </div>
  )
}
