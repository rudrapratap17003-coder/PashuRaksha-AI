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
  AlertTriangle,
  Radio,
  FileText
} from 'lucide-react'
import { USER_ROLES } from '../utils/constants'
import AlertCenterModal from '../components/common/AlertCenterModal'
import apiClient from '../services/api'

export default function DashboardLayout({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [alertCenterOpen, setAlertCenterOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const role = user?.role || USER_ROLES.FARMER

  const fetchUnreadAlerts = async () => {
    try {
      const res = await apiClient.get(`/alerts?role=${role}`)
      const unread = res.data.filter(a => !a.is_read).length
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

  // Navigation Items per Role
  const getNavItems = () => {
    switch (role) {
      case USER_ROLES.FARMER:
        return [
          { name: 'Dashboard', path: '/farmer/dashboard', icon: Home },
          { name: 'My Livestock', path: '/farmer/animals', icon: PawPrint },
          { name: 'Report Symptoms', path: '/farmer/report', icon: FilePlus2 },
          { name: 'Vaccinations', path: '/farmer/vaccinations', icon: Syringe },
          { name: 'Nearby Alerts', path: '/farmer/alerts', icon: AlertTriangle },
        ]
      case USER_ROLES.VETERINARIAN:
        return [
          { name: 'Clinical Desk', path: '/vet/dashboard', icon: Stethoscope },
          { name: 'Triage Queue', path: '/vet/cases', icon: FileText },
          { name: 'Outbreak Clusters', path: '/vet/clusters', icon: Radio },
        ]
      case USER_ROLES.AUTHORITY:
        return [
          { name: 'Surveillance Command', path: '/authority/dashboard', icon: Building2 },
          { name: 'District GIS Map', path: '/authority/map', icon: Radio },
          { name: 'Village Risk Matrix', path: '/authority/villages', icon: Activity },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <Activity className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                  PASHURAKSHA <span className="text-emerald-600">AI</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-400">
                  SIH26128 • Livestock Health Platform
                </span>
              </div>
            </Link>

            {/* Role Badge */}
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              {role}
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setAlertCenterOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Surveillance Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'User'}
                </span>
                <span className="block text-[10px] text-slate-400">
                  {user?.village || 'Rampur'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (onLogout) onLogout()
                navigate('/')
              }}
              title="Sign Out"
              className="p-2.5 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-56 space-y-2 flex-shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Navigation Menu
          </span>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 pb-16 md:pb-6 overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around p-2 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[10px] font-bold ${
                isActive ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Alert Center Modal */}
      <AlertCenterModal
        isOpen={alertCenterOpen}
        onClose={() => setAlertCenterOpen(false)}
        onAlertRead={fetchUnreadAlerts}
      />
    </div>
  )
}
