import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  PawPrint,
  Stethoscope,
  Building2,
  Bell,
  LogOut,
  Menu,
  X,
  Home,
  FilePlus2,
  Syringe,
  Radio,
  Sparkles,
  Presentation,
  Microscope,
  TrendingUp,
  Shield,
  Users,
  Wheat,
  Dna,
  Truck,
  BookOpen
} from 'lucide-react'
import { USER_ROLES } from '../utils/constants'
import PashuLogo from '../components/common/PashuLogo'
import AlertCenterModal from '../components/common/AlertCenterModal'
import DemoScenarioBar from '../components/common/DemoScenarioBar'
import EmergencyAlarmBanner from '../components/common/EmergencyAlarmBanner'
import EmergencyPanicModal from '../components/common/EmergencyPanicModal'
import SurveillanceBackground from '../components/background/SurveillanceBackground'
import MaharashtraHeader from '../components/common/MaharashtraHeader'
import AIAssistant from '../components/common/AIAssistant'
import BackendStatusBanner from '../components/common/BackendStatusBanner'
import apiClient from '../services/api'
import { useLanguage } from '../context/LanguageContext'

export default function DashboardLayout({ user, onLogout }) {
  const location = useLocation()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [alertCenterOpen, setAlertCenterOpen] = useState(false)
  const [panicModalOpen, setPanicModalOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const role = user?.role || USER_ROLES.FARMER

  const fetchUnreadAlerts = async () => {
    try {
      const res = await apiClient.get(`/alerts?role=${role}`)
      const unread = res.data.filter((a) => !a.is_read).length
      setUnreadCount(unread)
    } catch {
      // Fallback
    }
  }

  useEffect(() => {
    fetchUnreadAlerts()
    const interval = setInterval(fetchUnreadAlerts, 15000)
    return () => clearInterval(interval)
  }, [role])

  const getNavItems = () => {
    switch (role) {
      case USER_ROLES.FARMER:
        return [
          { name: t('nav.farmer.dashboard'), path: '/farmer/dashboard', icon: Home },
          { name: t('nav.farmer.report'), path: '/farmer/report', icon: FilePlus2 },
          { name: t('nav.farmer.herd'), path: '/farmer/herd', icon: PawPrint },
          { name: t('nav.farmer.nutrition'), path: '/farmer/nutrition', icon: Wheat },
          { name: t('nav.farmer.breeds'), path: '/farmer/breeds', icon: Dna },
          { name: t('nav.farmer.knowledge'), path: '/farmer/knowledge', icon: BookOpen },
          { name: t('nav.farmer.vaccinations'), path: '/farmer/vaccinations', icon: Syringe },
        ]
      case USER_ROLES.FIELD_WORKER:
        return [
          { name: t('nav.fieldWorker.dashboard'), path: '/field-worker/dashboard', icon: Activity },
          { name: t('nav.fieldWorker.report'), path: '/field-worker/report-on-behalf', icon: FilePlus2 },
          { name: t('nav.fieldWorker.census'), path: '/field-worker/households', icon: Home },
        ]
      case USER_ROLES.VETERINARIAN:
        return [
          { name: t('nav.vet.dashboard'), path: '/vet/dashboard', icon: Stethoscope },
          { name: t('nav.vet.cases'), path: '/vet/cases/rep-101', icon: FilePlus2 },
          { name: t('nav.vet.amr'), path: '/vet/amr', icon: Microscope },
        ]
      case USER_ROLES.LABORATORY:
        return [
          { name: t('nav.lab.dashboard'), path: '/lab/dashboard', icon: Microscope },
        ]
      case USER_ROLES.AUTHORITY:
        return [
          { name: t('nav.authority.commandCenter'), path: '/authority/dashboard', icon: Building2 },
          { name: t('nav.authority.coldChain'), path: '/authority/cold-chain', icon: Shield },
          { name: t('nav.authority.mvuFleet'), path: '/authority/mvu-fleet', icon: Truck },
          { name: t('nav.authority.marketSecurity'), path: '/authority/market-biosecurity', icon: Building2 },
          { name: t('nav.authority.analytics'), path: '/analytics', icon: TrendingUp },
        ]
      case USER_ROLES.ADMIN:
        return [
          { name: t('nav.admin.admin'), path: '/admin/dashboard', icon: Shield },
          { name: t('nav.admin.analytics'), path: '/analytics', icon: TrendingUp },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans relative">
      <SurveillanceBackground />
      <MaharashtraHeader />
      <BackendStatusBanner />
      <DemoScenarioBar />
      <EmergencyAlarmBanner />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

          {/* Left: Menu + Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <PashuLogo size="sm" />
              <div>
                <span className="text-sm font-extrabold text-slate-900 leading-none block">
                  PASHURAKSHA <span className="text-sky-600">AI</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 block truncate max-w-[200px] sm:max-w-none">
                  {t('common.prototypeNotice')}
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Portal Switcher (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[
              { label: t('roles.farmer'), path: '/farmer/dashboard', r: USER_ROLES.FARMER },
              { label: t('roles.fieldWorker'), path: '/field-worker/dashboard', r: USER_ROLES.FIELD_WORKER },
              { label: t('roles.vetDoctor'), path: '/vet/dashboard', r: USER_ROLES.VETERINARIAN },
              { label: t('roles.lab'), path: '/lab/dashboard', r: USER_ROLES.LABORATORY },
              { label: t('roles.authority'), path: '/authority/dashboard', r: USER_ROLES.AUTHORITY },
              { label: t('nav.authority.analytics'), path: '/analytics', r: null },
            ].map((p) => (
              <Link
                key={p.path}
                to={p.path}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ${
                  (p.r && role === p.r) || (!p.r && location.pathname === p.path)
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* SOS */}
            <button
              onClick={() => setPanicModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-xs font-bold transition-colors duration-200 flex items-center space-x-1"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            <Link to="/presentation" className="hidden sm:flex">
              <button className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold hover:bg-sky-100 transition-colors duration-200 flex items-center space-x-1">
                <Presentation className="w-3.5 h-3.5" />
                <span>{t('nav.jury')}</span>
              </button>
            </Link>

            {/* Bell */}
            <button
              type="button"
              onClick={() => setAlertCenterOpen(true)}
              className="relative p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors duration-200"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                if (onLogout) onLogout()
                navigate('/')
              }}
              className="p-2 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-lg">
            <span className="text-xs font-bold text-sky-700 block px-1">
              {t('nav.menuLabel', { role: t('roles.' + (role === USER_ROLES.FIELD_WORKER ? 'fieldWorker' : role === USER_ROLES.VETERINARIAN ? 'vetDoctor' : role === USER_ROLES.LABORATORY ? 'lab' : role === 'admin' ? 'admin' : role)) })}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-3 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 block px-1 mb-1">{t('nav.switchPortal')}</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { label: t('roles.farmer'), path: '/farmer/dashboard' },
                  { label: t('roles.vetDoctor'), path: '/vet/dashboard' },
                  { label: t('roles.authority'), path: '/authority/dashboard' },
                  { label: t('roles.lab'), path: '/lab/dashboard' },
                  { label: t('nav.authority.analytics'), path: '/analytics' },
                  { label: t('nav.jury'), path: '/presentation' },
                ].map((p) => (
                  <Link
                    key={p.path}
                    to={p.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-slate-100 rounded-lg text-center font-semibold text-slate-700 hover:bg-sky-50 transition-colors duration-200"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex gap-6 relative z-10">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-52 space-y-1 flex-shrink-0">
          <span className="text-xs font-bold text-sky-700 px-3 py-1.5">
            {t('nav.menuLabel', { role: t('roles.' + (role === USER_ROLES.FIELD_WORKER ? 'fieldWorker' : role === USER_ROLES.VETERINARIAN ? 'vetDoctor' : role === USER_ROLES.LABORATORY ? 'lab' : role === 'admin' ? 'admin' : role)) })}
          </span>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </aside>

        {/* Page Content */}
        <main className="flex-1 pb-24 md:pb-6 overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around p-2 shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-xs font-semibold ${
                isActive ? 'text-sky-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-[60px] mt-0.5">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Modals */}
      <AlertCenterModal
        isOpen={alertCenterOpen}
        onClose={() => {
          setAlertCenterOpen(false)
          fetchUnreadAlerts()
        }}
        role={role}
      />
      <EmergencyPanicModal
        isOpen={panicModalOpen}
        onClose={() => setPanicModalOpen(false)}
      />
      <AIAssistant role={role} />
    </div>
  )
}
