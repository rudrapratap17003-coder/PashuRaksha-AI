import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import FarmerAnimalsPage from './pages/farmer/FarmerAnimalsPage'
import AddAnimalPage from './pages/farmer/AddAnimalPage'
import AnimalProfilePage from './pages/farmer/AnimalProfilePage'
import SymptomReportPage from './pages/farmer/SymptomReportPage'
import FarmerVaccinationsPage from './pages/farmer/FarmerVaccinationsPage'
import FarmerAlertsPage from './pages/farmer/FarmerAlertsPage'
import VetDashboard from './pages/vet/VetDashboard'
import AuthorityDashboard from './pages/authority/AuthorityDashboard'
import NotFoundPage from './pages/NotFoundPage'
import { USER_ROLES } from './utils/constants'

function AppRoutes() {
  const { user, logout } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout user={user} onLogout={logout} />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Views */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout user={user} onLogout={logout} />
          </ProtectedRoute>
        }
      >
        {/* Farmer Portal Routes */}
        <Route
          path="/farmer/dashboard"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/animals"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <FarmerAnimalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/animals/add"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <AddAnimalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/animals/:animalId"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <AnimalProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/report"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <SymptomReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/vaccinations"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <FarmerVaccinationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/alerts"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <FarmerAlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Veterinarian Portal Routes */}
        <Route
          path="/vet/dashboard"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.VETERINARIAN]}>
              <VetDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vet/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.VETERINARIAN]}>
              <VetDashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* Authority Portal Routes */}
        <Route
          path="/authority/dashboard"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.AUTHORITY]}>
              <AuthorityDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/authority/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.AUTHORITY]}>
              <AuthorityDashboard user={user} />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Catch-All */}
      <Route element={<MainLayout user={user} onLogout={logout} />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
