import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import VetDashboard from './pages/vet/VetDashboard'
import AuthorityDashboard from './pages/authority/AuthorityDashboard'
import NotFoundPage from './pages/NotFoundPage'
import { USER_ROLES } from './utils/constants'

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pashuraksha_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return null
      }
    }
    // Default demo user is Farmer for immediate exploratory testing
    return {
      id: 'demo-farmer-1',
      name: 'Ramesh Kumar',
      email: 'farmer.ramesh@pashuraksha.ai',
      role: USER_ROLES.FARMER,
      village: 'Rampur',
      district: 'Jaipur Rural',
    }
  })

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    localStorage.setItem('pashuraksha_user', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('pashuraksha_user')
    localStorage.removeItem('pashuraksha_token')
  }

  const handleSelectDemoRole = (role) => {
    let mockUser = {
      id: `demo-${role}-1`,
      role,
      district: 'Jaipur Rural',
    }
    if (role === USER_ROLES.FARMER) {
      mockUser.name = 'Ramesh Kumar'
      mockUser.village = 'Rampur'
      mockUser.email = 'farmer.ramesh@pashuraksha.ai'
    } else if (role === USER_ROLES.VETERINARIAN) {
      mockUser.name = 'Dr. Sharma (Veterinary Officer)'
      mockUser.village = 'Rampur Block'
      mockUser.email = 'dr.sharma@pashuraksha.ai'
    } else if (role === USER_ROLES.AUTHORITY) {
      mockUser.name = 'R. Verma (District Health Officer)'
      mockUser.village = 'Jaipur HQ'
      mockUser.email = 'officer.verma@pashuraksha.ai'
    }
    handleLoginSuccess(mockUser)
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (Wrapped in MainLayout) */}
        <Route element={<MainLayout user={currentUser} onLogout={handleLogout} />}>
          <Route path="/" element={<LandingPage onSelectDemoRole={handleSelectDemoRole} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} />
        </Route>

        {/* Protected / Role Dashboards (Wrapped in DashboardLayout) */}
        <Route element={<DashboardLayout user={currentUser} onLogout={handleLogout} />}>
          <Route path="/farmer/dashboard" element={<FarmerDashboard user={currentUser} />} />
          <Route path="/farmer/*" element={<FarmerDashboard user={currentUser} />} />

          <Route path="/vet/dashboard" element={<VetDashboard user={currentUser} />} />
          <Route path="/vet/*" element={<VetDashboard user={currentUser} />} />

          <Route path="/authority/dashboard" element={<AuthorityDashboard user={currentUser} />} />
          <Route path="/authority/*" element={<AuthorityDashboard user={currentUser} />} />
        </Route>

        {/* 404 Catch-All */}
        <Route element={<MainLayout user={currentUser} onLogout={handleLogout} />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
