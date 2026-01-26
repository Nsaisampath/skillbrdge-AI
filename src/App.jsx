import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { ProtectedRoute, StudentRoute, AdminRoute } from './ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { PublicHomePage } from './pages/PublicHomePage'
import { AuthenticatedHomePage } from './pages/HomePage'
import { StudentDashboard } from './pages/StudentDashboard'
import { AdminDashboard } from './pages/AdminDashboard'

// Component to handle home route based on auth state
function HomeRouter() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center"><p className="text-white text-2xl">Loading...</p></div>
  }

  // If user is authenticated, show authenticated home, otherwise show public home
  return user ? <AuthenticatedHomePage /> : <PublicHomePage />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes - anyone can access */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Home route - shows public or authenticated based on auth state */}
          <Route path="/" element={<HomeRouter />} />

          {/* Student-only routes */}
          <Route
            path="/student"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
