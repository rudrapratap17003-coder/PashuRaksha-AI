import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import Button from '../../components/common/Button'
import SurveillanceBackground from '../../components/background/SurveillanceBackground'
import { useAuth } from '../../context/AuthContext'
import { USER_ROLES } from '../../utils/constants'
import PashuLogo from '../../components/common/PashuLogo'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [role, setRole] = useState(USER_ROLES.FARMER)
  const [email, setEmail] = useState('farmer1@pashuraksha.ai')
  const [password, setPassword] = useState('password123')
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
      if (userRole === USER_ROLES.FARMER) navigate('/farmer/dashboard')
      else if (userRole === USER_ROLES.FIELD_WORKER) navigate('/field-worker/dashboard')
      else if (userRole === USER_ROLES.VETERINARIAN) navigate('/vet/dashboard')
      else if (userRole === USER_ROLES.LABORATORY) navigate('/lab/dashboard')
      else if (userRole === USER_ROLES.AUTHORITY) navigate('/authority/dashboard')
      else if (userRole === USER_ROLES.ADMIN) navigate('/admin/dashboard')
      else navigate('/farmer/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    }
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 sm:p-6 bg-white">
      <SurveillanceBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-5">

          {/* Header */}
          <div className="text-center space-y-2 pb-4 border-b border-slate-200">
            <div className="flex justify-center">
              <PashuLogo size="lg" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">PASHURAKSHA AI</h2>
            <p className="text-sm text-slate-500">Government of Maharashtra • Livestock Health Portal</p>
          </div>

          {/* Role Selector — Big Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">Select Your Role / भूमिका निवडा</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: USER_ROLES.FARMER, label: 'Farmer', sub: 'शेतकरी' },
                { role: USER_ROLES.FIELD_WORKER, label: 'Pashu Sakhi', sub: 'पशु सखी' },
                { role: USER_ROLES.VETERINARIAN, label: 'Vet Doctor', sub: 'पशुवैद्यक' },
                { role: USER_ROLES.LABORATORY, label: 'Lab', sub: 'प्रयोगशाळा' },
                { role: USER_ROLES.AUTHORITY, label: 'Authority', sub: 'अधिकारी' },
                { role: USER_ROLES.ADMIN, label: 'Admin', sub: 'प्रशासक' },
              ].map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleRoleSelect(p.role)}
                  className={`py-2.5 px-2 text-center rounded-xl transition-colors duration-200 ${
                    role === p.role
                      ? 'bg-sky-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-sky-50 font-medium border border-slate-200'
                  }`}
                >
                  <span className="block text-sm font-bold">{p.label}</span>
                  <span className="block text-xs opacity-75">{p.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              className="w-full font-bold bg-sky-600 hover:bg-sky-700 text-white border-0 py-3.5 text-base rounded-xl transition-colors duration-200"
            >
              Login / प्रवेश करा
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500 pt-3 border-t border-slate-200">
            <span>New user? </span>
            <Link to="/register" className="text-sky-600 font-semibold hover:underline">
              Register / नोंदणी करा
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
