import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Activity, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  Building2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import SurveillanceBackground from '../../components/background/SurveillanceBackground'
import { useAuth } from '../../context/AuthContext'
import { USER_ROLES } from '../../utils/constants'

import PashuLogo from '../../components/common/PashuLogo'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [role, setRole] = useState(USER_ROLES.FARMER)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    village: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const user = await register({ ...formData, role })
      if (user.role === USER_ROLES.FARMER) navigate('/farmer/dashboard')
      else if (user.role === USER_ROLES.VETERINARIAN) navigate('/vet/dashboard')
      else if (user.role === USER_ROLES.AUTHORITY) navigate('/authority/dashboard')
      else navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-50">
      <SurveillanceBackground />

      {/* Centered White & Sky Blue Card */}
      <div className="relative z-10 w-full max-w-xl animate-in fade-in zoom-in duration-300">
        <Card className="w-full space-y-6 shadow-xl shadow-sky-950/5 bg-white border border-sky-100 text-slate-900 rounded-3xl p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sky-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-black text-sky-700 uppercase tracking-widest bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  STATE LIVESTOCK REGISTRY
                </span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Join Pashuraksha Network
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Register your dairy farm or field veterinary agency profile
              </p>
            </div>

            <PashuLogo size="lg" />
          </div>

          {/* Role Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Select Stakeholder Account Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole(USER_ROLES.FARMER)}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                  role === USER_ROLES.FARMER
                    ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-500/30'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                🧑‍🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => setRole(USER_ROLES.VETERINARIAN)}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                  role === USER_ROLES.VETERINARIAN
                    ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-500/30'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                🩺 Veterinarian
              </button>
              <button
                type="button"
                onClick={() => setRole(USER_ROLES.AUTHORITY)}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                  role === USER_ROLES.AUTHORITY
                    ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-500/30'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                🏛️ Authority
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Shinde"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="farmer@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Maharashtra Location Pickers */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Village / Wasti</label>
                <input
                  type="text"
                  name="village"
                  required
                  placeholder="e.g. Baramati"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-2 py-2 text-xs rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                >
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Ahmednagar">Ahmednagar</option>
                  <option value="Satara">Satara</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Kolhapur">Kolhapur</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">State</label>
                <input
                  type="text"
                  name="state"
                  readOnly
                  value="Maharashtra"
                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 px-3 py-2 text-xs rounded-xl cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              loading={loading}
              icon={ArrowRight}
              className="w-full font-bold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-sky-600/20 py-3.5 text-xs uppercase tracking-wider transition"
            >
              Create Registered Profile →
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Already registered?</span>
            <Link to="/login" className="text-sky-600 font-bold hover:underline">
              Sign in to existing account →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
