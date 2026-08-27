import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Activity, 
  RefreshCw, 
  LogOut, 
  User, 
  Menu, 
  X,
  Bell,
  Sparkles
} from 'lucide-react'
import { checkHealth } from '../../services/api'
import { USER_ROLES } from '../../utils/constants'

export default function Navbar({ user, onLogout, toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [apiOnline, setApiOnline] = useState(null)
  const [checkingApi, setCheckingApi] = useState(false)

  const verifyApi = async () => {
    setCheckingApi(true)
    try {
      await checkHealth()
      setApiOnline(true)
    } catch {
      setApiOnline(false)
    } finally {
      setCheckingApi(false)
    }
  }

  useEffect(() => {
    verifyApi()
  }, [])

  const getRoleBadge = (role) => {
    switch (role) {
      case USER_ROLES.FARMER:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Farmer</span>
      case USER_ROLES.VETERINARIAN:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">Veterinarian</span>
      case USER_ROLES.AUTHORITY:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Authority</span>
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Demo User</span>
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          {user && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                PASHURAKSHA <span className="text-emerald-600">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                SIH26128
              </span>
            </div>
          </Link>
        </div>

        {/* Right: API Status & User Controls */}
        <div className="flex items-center space-x-3">
          {/* API Health Pill */}
          <div
            title="FastAPI Gateway Connection Status"
            className={`hidden sm:inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${
              apiOnline === null
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : apiOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiOnline === null
                  ? 'bg-amber-400 animate-pulse'
                  : apiOnline
                  ? 'bg-emerald-500 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span>{apiOnline ? 'FastAPI: Online' : 'FastAPI: Offline'}</span>
          </div>

          <button
            onClick={verifyApi}
            title="Refresh API connection status"
            className="hidden sm:flex p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${checkingApi ? 'animate-spin' : ''}`} />
          </button>

          {/* User Menu / Role Switcher */}
          {user ? (
            <div className="flex items-center space-x-3">
              {getRoleBadge(user.role)}
              <span className="hidden md:inline-block text-xs font-semibold text-slate-700">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
