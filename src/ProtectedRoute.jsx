import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Protect routes that require authentication
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Protect routes that require admin role
export function AdminRoute({ children }) {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

// Protect routes that require student role
export function StudentRoute({ children }) {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || userRole !== 'student') {
    return <Navigate to="/" replace />
  }

  return children
}
