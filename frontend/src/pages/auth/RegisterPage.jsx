import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, User, Phone, MapPin, Mail, Lock } from 'lucide-react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { USER_ROLES } from '../../utils/constants'

export default function RegisterPage({ onRegisterSuccess }) {
  const navigate = useNavigate()
  const [role, setRole] = useState(USER_ROLES.FARMER)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    village: '',
    district: '',
    state: 'Rajasthan',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const mockUser = {
      id: 'registered-user-1',
      name: formData.name || 'New Registered User',
      email: formData.email,
      phone: formData.phone,
      role,
      village: formData.village,
      district: formData.district,
    }
    if (onRegisterSuccess) {
      onRegisterSuccess(mockUser)
    }
    if (role === USER_ROLES.FARMER) navigate('/farmer/dashboard')
    else if (role === USER_ROLES.VETERINARIAN) navigate('/vet/dashboard')
    else if (role === USER_ROLES.AUTHORITY) navigate('/authority/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-6 shadow-xl border-slate-200">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 items-center justify-center text-white shadow-md shadow-emerald-200">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Create PASHURAKSHA AI Account
          </h2>
          <p className="text-xs text-slate-500">
            Register your profile to join the early-warning livestock intelligence network
          </p>
        </div>

        {/* Role Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Account Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.FARMER)}
              className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                role === USER_ROLES.FARMER
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              🧑‍🌾 Farmer
            </button>
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.VETERINARIAN)}
              className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                role === USER_ROLES.VETERINARIAN
                  ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              🩺 Veterinarian
            </button>
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.AUTHORITY)}
              className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                role === USER_ROLES.AUTHORITY
                  ? 'border-purple-600 bg-purple-50 text-purple-800 ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              🏛️ Authority
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Village</label>
              <input
                type="text"
                name="village"
                required
                placeholder="Village name"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">District</label>
              <input
                type="text"
                name="district"
                required
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">State</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-bold">
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}
