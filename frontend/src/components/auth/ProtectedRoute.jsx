import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-3 text-emerald-600 font-bold">
          <span className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Credentials...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    // If logged in as another role, redirect to their home
    if (user.role === 'farmer') return <Navigate to="/farmer/dashboard" replace />
    if (user.role === 'veterinarian') return <Navigate to="/vet/dashboard" replace />
    if (user.role === 'authority') return <Navigate to="/authority/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return children
}
