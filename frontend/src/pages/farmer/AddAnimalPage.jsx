import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  PawPrint, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Droplet, 
  Scale, 
  Calendar, 
  MapPin, 
  FileText,
  Syringe,
  Layers
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { SPECIES_BREEDS_MAP } from '../../utils/speciesBreeds'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../services/api'

export default function AddAnimalPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    animal_id: 'COW-' + Math.floor(100 + Math.random() * 900),
    species: 'Cattle (Cow)',
    breed: 'Gir',
    age: 3.5,
    gender: 'female',
    weight: 380,
    vaccination_status: 'Up to date',
    previous_diseases: 'None',
    milk_production: 12.0,
    village: user?.village || 'Rampur',
    district: user?.district || 'Jaipur Rural',
  })

  const generateEarTag = (species) => {
    let prefix = 'COW'
    if (species.includes('Buffalo')) prefix = 'BUF'
    else if (species.includes('Goat')) prefix = 'GOAT'
    else if (species.includes('Sheep')) prefix = 'SHP'
    else if (species.includes('Poultry')) prefix = 'PLT'
    else if (species.includes('Pig')) prefix = 'PIG'
    else prefix = 'LIV'

    const randomNum = Math.floor(100 + Math.random() * 900)
    setFormData(prev => ({ ...prev, animal_id: `${prefix}-${randomNum}` }))
  }

  const handleSpeciesChange = (e) => {
    const newSpecies = e.target.value
    const breeds = SPECIES_BREEDS_MAP[newSpecies] || ['Indigenous Local']
    setFormData(prev => ({
      ...prev,
      species: newSpecies,
      breed: breeds[0] || 'Local Breed',
      milk_production: newSpecies.includes('Cattle') || newSpecies.includes('Buffalo') || newSpecies.includes('Goat') ? 10.0 : 0.0
    }))
    generateEarTag(newSpecies)
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await apiClient.post('/animals', {
        ...formData,
        owner_id: user?.id || 'usr-farmer-1'
      })
      setSuccess(true)
      setTimeout(() => {
        navigate('/farmer/animals')
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to register animal')
      setLoading(false)
    }
  }

  const availableBreeds = SPECIES_BREEDS_MAP[formData.species] || ['Indigenous Local']
  const isDairySpecies = ['Cattle (Cow)', 'Buffalo', 'Goat'].includes(formData.species) && formData.gender === 'female'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/farmer/dashboard"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Farmer Onboarding Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Register New Livestock
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => generateEarTag(formData.species)}
          className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>New Ear-Tag ID</span>
        </button>
      </div>

      {success && (
        <Card className="p-4 bg-emerald-50 border-emerald-300 text-emerald-900 flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Livestock Registered Successfully!</h4>
            <p className="text-xs text-emerald-700">
              Digital passport created for <strong>{formData.animal_id}</strong>. Redirecting to livestock records...
            </p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 bg-rose-50 border-rose-200 text-rose-800 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-xs font-semibold">{error}</span>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="space-y-6 p-6 sm:p-8">
          
          {/* Section 1: Identification */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-slate-100">
              <PawPrint className="w-4 h-4 text-emerald-600" />
              <span>1. Animal Identification &amp; Breed</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Ear-Tag / Unique ID <span className="text-rose-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="animal_id"
                    required
                    value={formData.animal_id}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 uppercase"
                  />
                  <button
                    type="button"
                    title="Generate Random Ear-Tag"
                    onClick={() => generateEarTag(formData.species)}
                    className="sm:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Livestock Species <span className="text-rose-500">*</span>
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleSpeciesChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  {Object.keys(SPECIES_BREEDS_MAP).map((sp) => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Breed <span className="text-rose-500">*</span>
                </label>
                <select
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  {availableBreeds.map((br) => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Vitals & Characteristics */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>2. Vitals &amp; Performance</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Age (Years) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  step="0.1"
                  min="0.1"
                  max="30"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  step="1"
                  min="1"
                  max="1500"
                  placeholder="e.g. 350"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <span>Milk Yield (L/day)</span>
                  {isDairySpecies && <Droplet className="w-3 h-3 text-sky-500" />}
                </label>
                <input
                  type="number"
                  name="milk_production"
                  step="0.5"
                  min="0"
                  max="60"
                  placeholder={isDairySpecies ? "e.g. 12" : "0"}
                  value={formData.milk_production}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Health & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Syringe className="w-4 h-4 text-emerald-600" />
              <span>3. Immunization &amp; Medical History</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Vaccination Status
                </label>
                <select
                  name="vaccination_status"
                  value={formData.vaccination_status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  <option value="Up to date">Up to date</option>
                  <option value="Due soon">Due soon</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Never vaccinated">Never vaccinated</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Village</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Previous Medical History / Remarks
              </label>
              <textarea
                name="previous_diseases"
                rows="2"
                placeholder="Any previous illnesses, allergies, or treated conditions (e.g. Mild mastitis in 2025)..."
                value={formData.previous_diseases}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="flex-1 font-bold shadow-md shadow-emerald-200"
            >
              Save Digital Passport
            </Button>
            <Link to="/farmer/animals">
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  )
}
