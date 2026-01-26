import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import { getAllStudentProfiles, getAllEvaluations } from '../firebaseDB'

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [students, setStudents] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, draft, submitted, evaluated
  const [selectedStudent, setSelectedStudent] = useState(null)

  // Load all student profiles and evaluations on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        // Fetch all students
        const studentsData = await getAllStudentProfiles()
        setStudents(studentsData)

        // Fetch all evaluations
        const evaluationsData = await getAllEvaluations()
        setEvaluations(evaluationsData)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load student data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter students by status
  const filteredStudents = filterStatus === 'all'
    ? students
    : students.filter(student => student.status === filterStatus)

  // Get evaluation for a student
  const getStudentEvaluation = (studentId) => {
    return evaluations.find(evaluation => evaluation.userId === studentId)
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'evaluated':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get eligibility badge color
  const getEligibilityColor = (eligibility) => {
    switch (eligibility) {
      case 'Eligible':
        return 'bg-green-500'
      case 'Needs Improvement':
        return 'bg-yellow-500'
      case 'Not Ready':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-black via-gray-900 to-black'
          : 'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100'
      }`}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className={`text-lg font-semibold ${isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>Loading student data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-black via-gray-900 to-black'
        : 'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-20'}`}>
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-gray-700' : 'bg-cyan-300'}`}></div>
        <div className={`absolute top-1/2 right-20 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-gray-700' : 'bg-sky-300'}`}></div>
        <div className={`absolute bottom-20 left-1/3 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-gray-700' : 'bg-blue-300'}`}></div>
      </div>

      {/* Navbar */}
      <nav className={`backdrop-blur-md sticky top-0 z-50 shadow-lg border-b transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700'
          : 'bg-gradient-to-br from-sky-200 via-cyan-100 to-blue-200 border-sky-300'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-10">
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
              className={`group relative w-14 h-14 rounded-full hover:shadow-2xl transition-all shadow-xl border-2 flex items-center justify-center text-2xl transform hover:scale-110 ${
                isDark
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-blue-400 border-opacity-60 hover:border-opacity-100'
                  : 'bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 border-blue-300 border-opacity-60 hover:border-opacity-100'
              }`}
              title="Profile Menu"
            >
              👨‍💼
              <div className={`absolute inset-0 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10 ${isDark ? 'bg-blue-400' : 'bg-blue-300'}`}></div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-3 w-56 rounded-xl shadow-2xl border backdrop-blur-lg z-50 overflow-hidden transition-colors duration-300 ${
                isDark
                  ? 'bg-gradient-to-br from-slate-800 to-indigo-900 border-blue-500 border-opacity-60'
                  : 'bg-gradient-to-br from-slate-50 to-indigo-50 border-blue-200 border-opacity-60'
              }`}>
                {/* Profile Section */}
                <div className={`border-b px-4 py-4 ${isDark ? 'border-blue-500 border-opacity-30' : 'border-blue-200 border-opacity-40'}`}>
                  <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>Logged in as</p>
                  <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.email}</p>
                  <div className={`mt-3 inline-block px-3 py-1 rounded-full text-white text-xs font-bold ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                  }`}>
                    👨‍💼 Admin
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
                        ? 'text-red-400 hover:bg-red-600 hover:bg-opacity-30 border-blue-500 border-opacity-30'
                        : 'text-red-600 hover:bg-red-100 border-blue-200 border-opacity-40'
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
                        : 'text-yellow-600 hover:bg-yellow-100 border-blue-200 border-opacity-40'
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
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">📊 Dashboard</h2>
          <p className="text-indigo-200 font-semibold">Manage and evaluate all student profiles</p>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform border border-blue-500 border-opacity-40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-bold">Total Students</p>
                <div className="text-4xl font-bold mt-2">{students.length}</div>
              </div>
              <div className="text-5xl opacity-40">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform border border-yellow-500 border-opacity-40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-bold">Draft Profiles</p>
                <div className="text-4xl font-bold mt-2">{students.filter(s => s.status === 'draft').length}</div>
              </div>
              <div className="text-5xl opacity-40">📝</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform border border-cyan-500 border-opacity-40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-bold">Pending Review</p>
                <div className="text-4xl font-bold mt-2">{students.filter(s => s.status === 'submitted').length}</div>
              </div>
              <div className="text-5xl opacity-40">⏳</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform border border-emerald-500 border-opacity-40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-bold">Evaluated</p>
                <div className="text-4xl font-bold mt-2">{students.filter(s => s.status === 'evaluated').length}</div>
              </div>
              <div className="text-5xl opacity-40">✅</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border-l-4 border-red-400 text-red-200 rounded-lg shadow-md flex items-start backdrop-blur-sm font-semibold">
            <span className="text-2xl mr-3">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-slate-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-purple-500 border-opacity-30">
          <h3 className="text-xl font-bold text-white mb-5 flex items-center">
            <span className="text-2xl mr-3">🔍</span> Filter & Search
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'all', label: 'All Students', icon: '👥', color: 'from-blue-500 to-blue-600' },
              { value: 'draft', label: 'Draft', icon: '📝', color: 'from-yellow-500 to-orange-600' },
              { value: 'submitted', label: 'Pending', icon: '⏳', color: 'from-cyan-500 to-blue-600' },
              { value: 'evaluated', label: 'Evaluated', icon: '✅', color: 'from-emerald-500 to-green-600' },
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  filterStatus === filter.value
                    ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                    : 'bg-slate-700 text-indigo-200 hover:bg-slate-600'
                }`}
              >
                {filter.icon} {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-slate-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-purple-500 border-opacity-30">
          <div className="px-6 py-5 bg-gradient-to-r from-purple-900 to-indigo-900 border-b-2 border-purple-500 border-opacity-40">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="text-3xl mr-3">👨‍🎓</span> Student Profiles ({filteredStudents.length})
            </h2>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-xl font-medium">No students found in this category</p>
              <p className="text-gray-500 text-sm mt-2">Try changing your filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">👤 Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">📧 Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Eligibility</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const evaluation = getStudentEvaluation(student.userId)
                    return (
                      <tr key={student.userId} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{student.fullName}</div>
                          <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-1">
                            {student.skills && student.skills.split(',').slice(0, 2).map((skill, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                {skill.trim()}
                              </span>
                            ))}
                            {student.skills && student.skills.split(',').length > 2 && (
                              <span className="text-gray-500 text-xs">+{student.skills.split(',').length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{student.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold text-white ${
                            student.status === 'draft' ? 'bg-yellow-500' :
                            student.status === 'submitted' ? 'bg-blue-500' :
                            'bg-green-500'
                          }`}>
                            {student.status === 'draft' && '📝 Draft'}
                            {student.status === 'submitted' && '⏳ Submitted'}
                            {student.status === 'evaluated' && '✅ Evaluated'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {evaluation ? (
                            <div className="flex items-center">
                              <span className="font-bold text-lg text-indigo-600">{evaluation.readinessScore}</span>
                              <div className="ml-3 w-12 bg-gray-300 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    evaluation.readinessScore >= 75 ? 'bg-green-500' :
                                    evaluation.readinessScore >= 50 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${evaluation.readinessScore}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-medium">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {evaluation ? (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                              evaluation.eligibility === 'Eligible' ? 'bg-green-500' :
                              evaluation.eligibility === 'Needs Improvement' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}>
                              {evaluation.eligibility}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-medium">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition-colors"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-6 flex justify-between items-center sticky top-0">
              <div>
                <h2 className="text-3xl font-bold">{selectedStudent.fullName}</h2>
                <p className="text-indigo-100 text-sm mt-1">Student Profile Details</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-3xl hover:opacity-80 transition-opacity w-10 h-10 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Profile Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                  <span className="text-2xl mr-3">📋</span> Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">📧 Email</p>
                    <p className="font-medium text-gray-800 mt-1">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">📱 Phone</p>
                    <p className="font-medium text-gray-800 mt-1">{selectedStudent.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">💼 Experience</p>
                    <p className="font-medium text-gray-800 mt-1">{selectedStudent.experience || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">🎓 Education</p>
                    <p className="font-medium text-gray-800 mt-1">{selectedStudent.education || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 font-semibold">Status</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white mt-2 ${
                      selectedStudent.status === 'draft' ? 'bg-yellow-500' :
                      selectedStudent.status === 'submitted' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}>
                      {selectedStudent.status === 'draft' && '📝 Draft'}
                      {selectedStudent.status === 'submitted' && '⏳ Submitted'}
                      {selectedStudent.status === 'evaluated' && '✅ Evaluated'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Evaluation Info */}
              {getStudentEvaluation(selectedStudent.userId) ? (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                    <span className="text-2xl mr-3">🤖</span> AI Evaluation Results
                  </h3>
                  {(() => {
                    const evaluation = getStudentEvaluation(selectedStudent.userId)
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                            <p className="text-sm text-gray-600 font-semibold">Readiness Score</p>
                            <div className="flex items-baseline mt-2">
                              <span className="text-4xl font-bold text-purple-600">{evaluation.readinessScore}</span>
                              <span className="text-gray-500 ml-2">/100</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                            <p className="text-sm text-gray-600 font-semibold">Eligibility</p>
                            <span className={`inline-block px-3 py-2 rounded-full text-sm font-bold text-white mt-2 ${
                              evaluation.eligibility === 'Eligible' ? 'bg-green-500' :
                              evaluation.eligibility === 'Needs Improvement' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}>
                              {evaluation.eligibility}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-600 font-semibold mb-3">Progress</p>
                          <div className="w-full bg-gray-300 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                evaluation.readinessScore >= 75 ? 'bg-green-500' :
                                evaluation.readinessScore >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${evaluation.readinessScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Strengths */}
                        {evaluation.strengths && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-600 font-semibold mb-3">💪 Strengths</p>
                            <ul className="space-y-2">
                              {evaluation.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span className="text-gray-700">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-8 text-center border-2 border-dashed border-gray-300 mb-6">
                  <p className="text-gray-600 font-medium text-lg">⏳ No evaluation yet</p>
                  <p className="text-gray-500 text-sm mt-2">This student hasn't submitted their profile for evaluation</p>
                </div>
              )}

              {/* Bio */}
              {selectedStudent.bio && (
                <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">💭</span> About
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{selectedStudent.bio}</p>
                </div>
              )}

              {/* Skills */}
              {selectedStudent.skills && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-xl mr-2">⚙️</span> Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.split(',').map((skill, idx) => (
                      <span key={idx} className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="bg-gray-50 px-8 py-4 border-t flex justify-end sticky bottom-0">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
