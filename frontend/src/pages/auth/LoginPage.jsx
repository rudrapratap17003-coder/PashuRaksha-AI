import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'
import Button from '../../components/common/Button'
import SurveillanceBackground from '../../components/background/SurveillanceBackground'
import LanguageSelector from '../../components/common/LanguageSelector'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { USER_ROLES } from '../../utils/constants'
import PashuLogo from '../../components/common/PashuLogo'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname
  const { login, loading } = useAuth()
  const { t } = useLanguage()
  const [role, setRole] = useState(USER_ROLES.FARMER)
  const [email, setEmail] = useState('farmer1@pashuraksha.ai')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    switch (selectedRole) {
      case USER_ROLES.FARMER: setEmail('farmer1@pashuraksha.ai'); break
      case USER_ROLES.FIELD_WORKER: setEmail('fieldworker1@pashuraksha.ai'); break
      case USER_ROLES.VETERINARIAN: setEmail('vet1@pashuraksha.ai'); break
      case USER_ROLES.LABORATORY: setEmail('lab1@pashuraksha.ai'); break
      case USER_ROLES.AUTHORITY: setEmail('officer1@pashuraksha.ai'); break
      case USER_ROLES.ADMIN: setEmail('admin@pashuraksha.ai'); break
      default: setEmail('farmer1@pashuraksha.ai')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const user = await login(email, password)
      const userRole = user?.role || role

      // If user came from a deep link they are authorized for, send them there
      if (from && from !== '/login') {
        const rolePermissions = {
          '/farmer': [USER_ROLES.FARMER, USER_ROLES.ADMIN],
          '/field-worker': [USER_ROLES.FIELD_WORKER, USER_ROLES.ADMIN],
          '/vet': [USER_ROLES.VETERINARIAN, USER_ROLES.ADMIN],
          '/lab': [USER_ROLES.LABORATORY, USER_ROLES.ADMIN],
          '/authority': [USER_ROLES.AUTHORITY, USER_ROLES.ADMIN],
          '/admin': [USER_ROLES.ADMIN],
          '/analytics': [USER_ROLES.FARMER, USER_ROLES.FIELD_WORKER, USER_ROLES.VETERINARIAN, USER_ROLES.LABORATORY, USER_ROLES.AUTHORITY, USER_ROLES.ADMIN],
          '/presentation': [USER_ROLES.FARMER, USER_ROLES.FIELD_WORKER, USER_ROLES.VETERINARIAN, USER_ROLES.LABORATORY, USER_ROLES.AUTHORITY, USER_ROLES.ADMIN],
          '/pitch': [USER_ROLES.FARMER, USER_ROLES.FIELD_WORKER, USER_ROLES.VETERINARIAN, USER_ROLES.LABORATORY, USER_ROLES.AUTHORITY, USER_ROLES.ADMIN],
        }
        const matchedPrefix = Object.keys(rolePermissions).find(prefix => from.startsWith(prefix))
        if (!matchedPrefix || rolePermissions[matchedPrefix].includes(userRole)) {
          navigate(from, { replace: true })
          return
        }
      }

      if (userRole === USER_ROLES.FARMER) navigate('/farmer/dashboard')
      else if (userRole === USER_ROLES.FIELD_WORKER) navigate('/field-worker/dashboard')
      else if (userRole === USER_ROLES.VETERINARIAN) navigate('/vet/dashboard')
      else if (userRole === USER_ROLES.LABORATORY) navigate('/lab/dashboard')
      else if (userRole === USER_ROLES.AUTHORITY) navigate('/authority/dashboard')
      else if (userRole === USER_ROLES.ADMIN) navigate('/admin/dashboard')
      else navigate('/farmer/dashboard')
    } catch (err) {
      // Distinguish between backend unreachable and auth failure
      const msg = err.message || 'Authentication failed'
      if (msg === 'Network Error' || msg.includes('ERR_CONNECTION_REFUSED') || msg.includes('Unable to connect')) {
        setError(t("networkError"))
      } else if (msg.includes('Invalid credentials') || msg.includes('Incorrect password') || msg.includes('not found')) {
        setError(t("invalidCredentials"))
      } else {
        setError(msg || t("authFailed"))
      }
    }
  }

  const roleConfigs = [
    { role: USER_ROLES.FARMER, label: t("roles.farmer"), sub: t("roles.farmerSub") },
    { role: USER_ROLES.FIELD_WORKER, label: t("roles.fieldWorker"), sub: t("roles.fieldWorkerSub") },
    { role: USER_ROLES.VETERINARIAN, label: t("roles.vetDoctor"), sub: t("roles.vetDoctorSub") },
    { role: USER_ROLES.LABORATORY, label: t("roles.lab"), sub: t("roles.labSub") },
    { role: USER_ROLES.AUTHORITY, label: t("roles.authority"), sub: t("roles.authoritySub") },
    { role: USER_ROLES.ADMIN, label: t("roles.admin"), sub: t("roles.adminSub") },
  ]

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 sm:p-6 bg-white">
      <SurveillanceBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-5">

          {/* Header with Logo, Title and Top-Right Language Selector */}
          <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <PashuLogo size="md" />
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  PASHURAKSHA <span className="text-sky-600">AI</span>
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">
                  {t("prototypeNotice")}
                </p>
              </div>
            </div>

            {/* Language Selector Dropdown */}
            <div className="flex-shrink-0 pt-0.5">
              <LanguageSelector />
            </div>
          </div>

          {/* Role Selector — Big Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">{t("selectRole")}</label>
            <div className="grid grid-cols-3 gap-2">
              {roleConfigs.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleRoleSelect(p.role)}
                  className={`py-2.5 px-2 text-center rounded-xl transition-colors duration-200 ${
                    role === p.role
                      ? 'bg-sky-600 text-white font-bold shadow-sm ring-2 ring-sky-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-sky-50 font-medium border border-slate-200'
                  }`}
                >
                  <span className="block text-sm font-bold truncate">{p.label}</span>
                  <span className="block text-[11px] opacity-75 truncate">{p.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t("email")}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target("value"))}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t("password")}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target("value"))}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-10 py-3 text-sm rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  title={showPassword ? t("hidePassword") : t("showPassword")}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-sky-600 transition-colors p-0.5 rounded cursor-pointer"
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              className="w-full font-bold bg-sky-600 hover:bg-sky-700 text-white border-0 py-3.5 text-base rounded-xl transition-colors duration-200"
            >
              {loading ? t("signingIn") : t("login")}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500 pt-3 border-t border-slate-200">
            <span>{t("newUser")} </span>
            <Link to="/register" className="text-sky-600 font-semibold hover:underline">
              {t("register")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

