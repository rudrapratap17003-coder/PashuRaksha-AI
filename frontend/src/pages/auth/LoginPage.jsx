import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Lock, Mail, Users, Stethoscope, Building2, ArrowRight } from 'lucide-react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { USER_ROLES } from '../../utils/constants'

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [role, setRole] = useState(USER_ROLES.FARMER)
  const [email, setEmail] = useState('farmer.ramesh@pashuraksha.ai')
  const [password, setPassword] = useState('password123')

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    if (selectedRole === USER_ROLES.FARMER) {
      setEmail('farmer.ramesh@pashuraksha.ai')
    } else if (selectedRole === USER_ROLES.VETERINARIAN) {
      setEmail('dr.sharma@pashuraksha.ai')
    } else if (selectedRole === USER_ROLES.AUTHORITY) {
      setEmail('officer.verma@pashuraksha.ai')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Prepare mock user for Phase 2 frontend testing
    const mockUser = {
      id: 'demo-user-1',
      name: role === USER_ROLES.FARMER ? 'Ramesh Kumar (Farmer)' : role === USER_ROLES.VETERINARIAN ? 'Dr. Sharma (Veterinary Officer)' : 'R. Verma (District Health Officer)',
      email,
      role,
      village: 'Rampur',
      district: 'Jaipur',
    }
    
    if (onLoginSuccess) {
      onLoginSuccess(mockUser)
    }

    if (role === USER_ROLES.FARMER) navigate('/farmer/dashboard')
    else if (role === USER_ROLES.VETERINARIAN) navigate('/vet/dashboard')
    else if (role === USER_ROLES.AUTHORITY) navigate('/authority/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 shadow-xl border-slate-200">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 items-center justify-center text-white shadow-md shadow-emerald-200">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Sign In to PASHURAKSHA AI
          </h2>
          <p className="text-xs text-slate-500">
            Select your stakeholder role to access your dedicated portal
          </p>
        </div>

        {/* Role Quick Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => handleRoleSelect(USER_ROLES.FARMER)}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              role === USER_ROLES.FARMER
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Farmer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect(USER_ROLES.VETERINARIAN)}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              role === USER_ROLES.VETERINARIAN
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Veterinarian
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect(USER_ROLES.AUTHORITY)}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              role === USER_ROLES.AUTHORITY
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Authority
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address / Phone</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-bold">
            Enter as {role.toUpperCase()}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Need a new account?{' '}
          <Link to="/register" className="text-emerald-600 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  )
}
