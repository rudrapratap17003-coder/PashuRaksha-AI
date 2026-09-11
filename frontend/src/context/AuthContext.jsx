import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import apiClient from '../services/api'
import { USER_ROLES } from '../utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pashuraksha_user')
    if (savedUser) {
      try {
        return JSON.parse(savedUser)
      } catch {
        return null
      }
    }
    return null
  })

  const [token, setToken] = useState(() => localStorage.getItem('pashuraksha_token'))
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { access_token, user: userData } = response.data
      setToken(access_token)
      setUser(userData)
      localStorage.setItem('pashuraksha_token', access_token)
      localStorage.setItem('pashuraksha_user', JSON.stringify(userData))
      return userData
    } catch (err) {
      // Security: Failed login must fail. Never create or fall back to fake users.
      const errorMsg = err?.response?.data?.detail || err?.message || 'Authentication failed'
      const customError = new Error(errorMsg)
      customError.status = err?.response?.status
      customError.code = err?.code
      throw customError
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData) => {
    setLoading(true)
    try {
      await apiClient.post('/auth/register', formData)
      return await login(formData.email, formData.password)
    } catch (err) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Registration failed'
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const loginAsRole = async (role) => {
    // These emails must match the seeded users in seed_service.py
    const roleEmailMap = {
      [USER_ROLES.FARMER]: 'farmer1@pashuraksha.ai',
      [USER_ROLES.FIELD_WORKER]: 'fieldworker1@pashuraksha.ai',
      [USER_ROLES.VETERINARIAN]: 'vet1@pashuraksha.ai',
      [USER_ROLES.LABORATORY]: 'lab1@pashuraksha.ai',
      [USER_ROLES.AUTHORITY]: 'officer1@pashuraksha.ai',
      [USER_ROLES.ADMIN]: 'admin@pashuraksha.ai',
    }
    const email = roleEmailMap[role] || 'farmer1@pashuraksha.ai'
    return await login(email, 'password123')
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('pashuraksha_token')
    localStorage.removeItem('pashuraksha_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginAsRole,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
