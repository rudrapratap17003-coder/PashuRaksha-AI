import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ScenarioProvider } from './context/ScenarioContext'
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
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/animals" element={<FarmerAnimalsPage />} />
        <Route path="/farmer/animals/add" element={<AddAnimalPage />} />
        <Route path="/farmer/animals/:animalId" element={<AnimalProfilePage />} />
        <Route path="/farmer/report" element={<SymptomReportPage />} />
        <Route path="/farmer/vaccinations" element={<FarmerVaccinationsPage />} />
        <Route path="/farmer/alerts" element={<FarmerAlertsPage />} />
        <Route path="/farmer/herd" element={<HerdManagement />} />
        <Route path="/farmer/knowledge" element={<DiseaseKnowledgeBase />} />
        <Route path="/farmer/nutrition" element={<NutritionAdvisorPage />} />
        <Route path="/farmer/breeds" element={<BreedRegistryPage />} />

        {/* 2. Field Worker / Pashu Sakhi Portal */}
        <Route path="/field-worker/dashboard" element={<FieldWorkerDashboard />} />
        <Route path="/field-worker/*" element={<FieldWorkerDashboard />} />

        {/* 3. Veterinarian Clinical Portal */}
        <Route path="/vet/dashboard" element={<VetDashboard user={user} />} />
        <Route path="/vet/cases/:caseId" element={<CaseDetailsPage />} />
        <Route path="/vet/cases" element={<VetDashboard user={user} />} />
        <Route path="/vet/amr" element={<AmrSurveillanceDesk />} />
        <Route path="/vet/*" element={<VetDashboard user={user} />} />

        {/* 4. Diagnostic Laboratory Portal */}
        <Route path="/lab/dashboard" element={<LabDashboard />} />
        <Route path="/lab/*" element={<LabDashboard />} />

        {/* 5. Public Health Authority Portal */}
        <Route path="/authority/dashboard" element={<AuthorityDashboard user={user} />} />
        <Route path="/authority/cold-chain" element={<ColdChainLogisticsPage />} />
        <Route path="/authority/mvu-fleet" element={<MvuFleetTracker />} />
        <Route path="/authority/market-biosecurity" element={<MarketBiosecurityPage />} />
        <Route path="/authority/*" element={<AuthorityDashboard user={user} />} />

        {/* 6. System Administration Console */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
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
      <ScenarioProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ScenarioProvider>
    </AuthProvider>
  )
}
