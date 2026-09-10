import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ScenarioProvider } from './context/ScenarioContext'
import { LanguageProvider } from './context/LanguageContext'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import PresentationPage from './pages/PresentationPage'
import PresentationPitchDeckPage from './pages/PresentationPitchDeckPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import FarmerAnimalsPage from './pages/farmer/FarmerAnimalsPage'
import AddAnimalPage from './pages/farmer/AddAnimalPage'
import AnimalProfilePage from './pages/farmer/AnimalProfilePage'
import SymptomReportPage from './pages/farmer/SymptomReportPage'
import FarmerVaccinationsPage from './pages/farmer/FarmerVaccinationsPage'
import FarmerAlertsPage from './pages/farmer/FarmerAlertsPage'
import HerdManagement from './pages/farmer/HerdManagement'
import DiseaseKnowledgeBase from './pages/farmer/DiseaseKnowledgeBase'
import NutritionAdvisorPage from './pages/farmer/NutritionAdvisorPage'
import BreedRegistryPage from './pages/farmer/BreedRegistryPage'
import VetDashboard from './pages/vet/VetDashboard'
import CaseDetailsPage from './pages/vet/CaseDetailsPage'
import AmrSurveillanceDesk from './pages/vet/AmrSurveillanceDesk'
import AuthorityDashboard from './pages/authority/AuthorityDashboard'
import ColdChainLogisticsPage from './pages/authority/ColdChainLogisticsPage'
import MvuFleetTracker from './pages/authority/MvuFleetTracker'
import MarketBiosecurityPage from './pages/authority/MarketBiosecurityPage'
import LabDashboard from './pages/lab/LabDashboard'
import FieldWorkerDashboard from './pages/fieldworker/FieldWorkerDashboard'
import FieldWorkerReportPage from './pages/fieldworker/FieldWorkerReportPage'
import FieldWorkerCensusPage from './pages/fieldworker/FieldWorkerCensusPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'
import { USER_ROLES } from './utils/constants'

function AppRoutes() {
  const { user, logout } = useAuth()

  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout user={user} onLogout={logout} />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Dedicated SIH Jury Presentation Console */}
      <Route path="/presentation" element={<PresentationPage />} />
      <Route path="/presentation/pitch" element={<PresentationPitchDeckPage />} />
      <Route path="/pitch" element={<PresentationPitchDeckPage />} />

      {/* Protected Dashboard Shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout user={user} onLogout={logout} />
          </ProtectedRoute>
        }
      >
        {/* 1. Farmer Portal Routes */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/farmer/animals" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><FarmerAnimalsPage /></ProtectedRoute>} />
        <Route path="/farmer/animals/add" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><AddAnimalPage /></ProtectedRoute>} />
        <Route path="/farmer/animals/:animalId" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><AnimalProfilePage /></ProtectedRoute>} />
        <Route path="/farmer/report" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><SymptomReportPage /></ProtectedRoute>} />
        <Route path="/farmer/vaccinations" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><FarmerVaccinationsPage /></ProtectedRoute>} />
        <Route path="/farmer/alerts" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><FarmerAlertsPage /></ProtectedRoute>} />
        <Route path="/farmer/herd" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><HerdManagement /></ProtectedRoute>} />
        <Route path="/farmer/knowledge" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><DiseaseKnowledgeBase /></ProtectedRoute>} />
        <Route path="/farmer/nutrition" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><NutritionAdvisorPage /></ProtectedRoute>} />
        <Route path="/farmer/breeds" element={<ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}><BreedRegistryPage /></ProtectedRoute>} />

        {/* 2. Field Worker / Pashu Sakhi Portal */}
        <Route path="/field-worker/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.FIELD_WORKER, USER_ROLES.ADMIN]}><FieldWorkerDashboard /></ProtectedRoute>} />
        <Route path="/field-worker/report-on-behalf" element={<ProtectedRoute allowedRoles={[USER_ROLES.FIELD_WORKER, USER_ROLES.ADMIN]}><FieldWorkerReportPage /></ProtectedRoute>} />
        <Route path="/field-worker/households" element={<ProtectedRoute allowedRoles={[USER_ROLES.FIELD_WORKER, USER_ROLES.ADMIN]}><FieldWorkerCensusPage /></ProtectedRoute>} />
        <Route path="/field-worker/*" element={<ProtectedRoute allowedRoles={[USER_ROLES.FIELD_WORKER, USER_ROLES.ADMIN]}><FieldWorkerDashboard /></ProtectedRoute>} />

        {/* 3. Veterinarian Clinical Portal */}
        <Route path="/vet/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.VETERINARIAN, USER_ROLES.ADMIN]}><VetDashboard user={user} /></ProtectedRoute>} />
        <Route path="/vet/cases/:caseId" element={<ProtectedRoute allowedRoles={[USER_ROLES.VETERINARIAN, USER_ROLES.ADMIN]}><CaseDetailsPage /></ProtectedRoute>} />
        <Route path="/vet/cases" element={<ProtectedRoute allowedRoles={[USER_ROLES.VETERINARIAN, USER_ROLES.ADMIN]}><VetDashboard user={user} /></ProtectedRoute>} />
        <Route path="/vet/amr" element={<ProtectedRoute allowedRoles={[USER_ROLES.VETERINARIAN, USER_ROLES.ADMIN]}><AmrSurveillanceDesk /></ProtectedRoute>} />
        <Route path="/vet/*" element={<ProtectedRoute allowedRoles={[USER_ROLES.VETERINARIAN, USER_ROLES.ADMIN]}><VetDashboard user={user} /></ProtectedRoute>} />

        {/* 4. Diagnostic Laboratory Portal */}
        <Route path="/lab/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.LABORATORY, USER_ROLES.ADMIN]}><LabDashboard /></ProtectedRoute>} />
        <Route path="/lab/*" element={<ProtectedRoute allowedRoles={[USER_ROLES.LABORATORY, USER_ROLES.ADMIN]}><LabDashboard /></ProtectedRoute>} />

        {/* 5. Public Health Authority Portal */}
        <Route path="/authority" element={<ProtectedRoute allowedRoles={[USER_ROLES.AUTHORITY, USER_ROLES.ADMIN]}><AuthorityDashboard user={user} /></ProtectedRoute>} />
        <Route path="/authority/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.AUTHORITY, USER_ROLES.ADMIN]}><AuthorityDashboard user={user} /></ProtectedRoute>} />
        <Route path="/authority/cold-chain" element={<ProtectedRoute allowedRoles={[USER_ROLES.AUTHORITY, USER_ROLES.ADMIN]}><ColdChainLogisticsPage /></ProtectedRoute>} />
        <Route path="/authority/mvu-fleet" element={<ProtectedRoute allowedRoles={[USER_ROLES.AUTHORITY, USER_ROLES.ADMIN]}><MvuFleetTracker /></ProtectedRoute>} />
        <Route path="/authority/market-biosecurity" element={<ProtectedRoute allowedRoles={[USER_ROLES.AUTHORITY, USER_ROLES.ADMIN]}><MarketBiosecurityPage /></ProtectedRoute>} />
        <Route path="/authority/*" element={<ProtectedRoute allowedRoles={[USER_ROLES.AUTHORITY, USER_ROLES.ADMIN]}><AuthorityDashboard user={user} /></ProtectedRoute>} />

        {/* 6. System Administration Console */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
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
    <LanguageProvider>
      <AuthProvider>
        <ScenarioProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ScenarioProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
