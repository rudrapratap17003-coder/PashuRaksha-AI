import React, { createContext, useContext, useState, useEffect } from 'react'
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
    // Default demo user is Farmer for immediate exploratory testing
    return {
      id: 'usr-farmer-1',
      name: 'Ramesh Kumar',
      email: 'farmer.ramesh@pashuraksha.ai',
      role: USER_ROLES.FARMER,
      village: 'Rampur',
      district: 'Jaipur Rural',
    }
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
      // Fallback for offline demo resilience
      const fallbackUser = {
        id: 'demo-user-1',
        name: email.includes('vet') ? 'Dr. Sharma' : email.includes('auth') ? 'R. Verma' : 'Ramesh Kumar',
        email,
        role: email.includes('vet') ? USER_ROLES.VETERINARIAN : email.includes('auth') ? USER_ROLES.AUTHORITY : USER_ROLES.FARMER,
        village: 'Rampur',
        district: 'Jaipur Rural',
      }
      setUser(fallbackUser)
      localStorage.setItem('pashuraksha_user', JSON.stringify(fallbackUser))
      return fallbackUser
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData) => {
    setLoading(true)
    try {
      const response = await apiClient.post('/auth/register', formData)
      const userData = response.data
      return await login(formData.email, formData.password)
    } catch (err) {
      // Fallback for offline resilience
      const mockUser = {
        id: 'usr-new-1',
        name: formData.name || 'New User',
        email: formData.email,
        role: formData.role || USER_ROLES.FARMER,
        village: formData.village || 'Rampur',
        district: formData.district || 'Jaipur Rural',
      }
      setUser(mockUser)
      localStorage.setItem('pashuraksha_user', JSON.stringify(mockUser))
      return mockUser
    } finally {
      setLoading(false)
    }
  }

  const loginAsRole = async (role) => {
    let email = 'farmer.ramesh@pashuraksha.ai'
    if (role === USER_ROLES.VETERINARIAN) {
      email = 'dr.sharma@pashuraksha.ai'
    } else if (role === USER_ROLES.AUTHORITY) {
      email = 'officer.verma@pashuraksha.ai'
    }
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
