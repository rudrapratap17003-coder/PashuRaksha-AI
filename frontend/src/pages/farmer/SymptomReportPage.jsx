import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  FilePlus2, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Thermometer, 
  Wind, 
  Droplets, 
  UtensilsCrossed, 
  AlertCircle, 
  Moon, 
  Milk, 
  HeartPulse, 
  Waves, 
  Activity, 
  MapPin, 
  Info,
  ChevronRight,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import { CORE_SYMPTOMS } from '../../utils/symptomDefinitions'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../services/api'

// Icon mapper for dynamic symptom rendering
const iconMap = {
  Thermometer,
  Wind,
  Droplets,
  UtensilsCrossed,
  AlertCircle,
  Moon,
  Milk,
  HeartPulse,
  Waves,
  AlertTriangle,
  ActivitySquare: Activity,
}

export default function SymptomReportPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  
  const [animals, setAnimals] = useState([])
  const [loadingAnimals, setLoadingAnimals] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [aiEvaluation, setAiEvaluation] = useState(null)

  const preselectedAnimalId = searchParams.get('animalId') || ''

  const [formData, setFormData] = useState({
    animal_id: preselectedAnimalId,
    fever: false,
    cough: false,
    nasal_discharge: false,
    reduced_appetite: false,
    diarrhea: false,
    lethargy: false,
    reduced_milk: false,
    difficulty_breathing: false,
    salivation: false,
    lesions: false,
    swelling: false,
    other_symptoms: '',
    severity: 'moderate',
    duration_days: 2,
    number_of_animals_affected: 1,
    village: user?.village || 'Rampur',
    district: user?.district || 'Jaipur Rural',
  })

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await apiClient.get('/animals')
        setAnimals(res.data)
        if (!formData.animal_id && res.data.length > 0) {
          setFormData(prev => ({ ...prev, animal_id: res.data[0].animal_id }))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingAnimals(false)
      }
    }
    fetchAnimals()
  }, [])

  const toggleSymptom = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAnimalChange = (e) => {
    setFormData(prev => ({ ...prev, animal_id: e.target.value }))
  }

  const handleSeveritySelect = (sev) => {
    setFormData(prev => ({ ...prev, severity: sev }))
  }

  const handleAnimalsCount = (delta) => {
    setFormData(prev => ({
      ...prev,
      number_of_animals_affected: Math.max(1, Math.min(50, prev.number_of_animals_affected + delta))
    }))
  }

  const selectedSymptomsCount = CORE_SYMPTOMS.filter(s => formData[s.key]).length

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.animal_id) {
      setError('Please select or specify an animal identification number')
      return
    }

    if (selectedSymptomsCount === 0 && !formData.other_symptoms) {
      setError('Please select at least one observed symptom')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await apiClient.post('/health-reports', {
        ...formData,
        reported_by: user?.id || 'usr-farmer-1'
      })
      setAiEvaluation(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to submit health report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Farmer Health Reporting Desk
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                AI Early-Warning Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Report Livestock Symptoms
            </h1>
          </div>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-rose-50 border-rose-200 text-rose-800 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-xs font-semibold">{error}</span>
        </Card>
      )}

      {/* Main Reporting Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          
          {/* Step 1: Select Livestock */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>Select Affected Animal</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  Registered Livestock Passport
                </label>
                <select
                  value={formData.animal_id}
                  onChange={handleAnimalChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white font-bold text-slate-800"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.animal_id}>
                      {a.animal_id} — {a.species} ({a.breed})
                    </option>
                  ))}
                  <option value="CUSTOM">Other / Unregistered Animal</option>
                </select>
              </div>

              {formData.animal_id === 'CUSTOM' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">
                    Enter Ear-Tag or Identifier
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. COW-999"
                    value={formData.animal_id === 'CUSTOM' ? '' : formData.animal_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, animal_id: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono uppercase font-bold"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Step 2: 11 Core Symptoms Checklist */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">
                  2
                </span>
                <span>Select Observed Symptoms ({selectedSymptomsCount}/11 Selected)</span>
              </label>
              <span className="text-xs text-slate-400 font-medium">Tap tiles to toggle</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CORE_SYMPTOMS.map((sym) => {
                const IconComponent = iconMap[sym.icon] || Activity
                const isSelected = !!formData[sym.key]

                return (
                  <button
                    key={sym.key}
                    type="button"
                    onClick={() => toggleSymptom(sym.key)}
                    className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="pt-3 space-y-0.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                        {sym.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                        {sym.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 3: Severity, Duration & Spread */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">
                3
              </span>
              <span>Severity, Duration &amp; Flock Spread</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Severity Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Severity Level</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {['mild', 'moderate', 'severe'].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => handleSeveritySelect(sev)}
                      className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition ${
                        formData.severity === sev
                          ? sev === 'severe'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : sev === 'moderate'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration in Days */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={formData.duration_days}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              {/* Animals Affected in Herd */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Animals Showing Signs
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleAnimalsCount(-1)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-slate-900">
                    {formData.number_of_animals_affected} {formData.number_of_animals_affected > 1 ? 'Animals' : 'Animal'}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAnimalsCount(1)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Additional Notes / Other Observations (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="Describe any other unusual signs, sudden environmental changes, or recent animal purchases..."
                value={formData.other_symptoms}
                onChange={(e) => setFormData(prev => ({ ...prev, other_symptoms: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <Button
              type="submit"
              size="lg"
              loading={submitting}
              icon={Sparkles}
              className="w-full font-bold shadow-lg shadow-emerald-200 py-3.5"
            >
              Submit Symptoms for AI Decision-Support Assessment
            </Button>
          </div>
        </Card>
      </form>

      {/* AI Evaluation & Recommendation Modal */}
      {aiEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <Card className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md shadow-emerald-100">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                AI Health Risk Assessment
              </h2>
              <p className="text-xs text-slate-500">
                Evaluation generated for <strong>{aiEvaluation.animal_id}</strong> ({aiEvaluation.species})
              </p>
            </div>

            {/* Risk Badge & Score Banner */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Computed Health Risk Level
              </span>
              <div className="flex justify-center">
                <RiskBadge
                  level={aiEvaluation.risk_level}
                  score={aiEvaluation.risk_score}
                  size="lg"
                />
              </div>
              <div className="text-sm font-black text-slate-800">
                Risk Score: {aiEvaluation.risk_score}/100
              </div>
            </div>

            {/* Possible Disease Concern */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Possible Disease Concern</span>
              </span>
              <p className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm font-semibold text-amber-900">
                {aiEvaluation.possible_disease_concern}
              </p>
            </div>

            {/* Veterinary & Management Recommendation */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Recommended Action &amp; Guidance</span>
              </span>
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium space-y-2">
                <p>{aiEvaluation.recommendation}</p>
                {aiEvaluation.risk_score >= 60 && (
                  <div className="p-2 rounded-lg bg-white/80 border border-emerald-300 text-xs font-bold text-emerald-800">
                    ⚡ This case has been automatically escalated to the Local Veterinary Priority Triage Queue.
                  </div>
                )}
              </div>
            </div>

            {/* Non-Diagnostic Disclaimer */}
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 leading-relaxed italic">
              <strong>Mandatory Notice:</strong> PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment.
            </div>

            {/* Modal Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <Button
                onClick={() => navigate('/farmer/dashboard')}
                size="lg"
                className="flex-1 font-bold"
              >
                Return to Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setAiEvaluation(null)
                  setFormData(prev => ({
                    ...prev,
                    fever: false,
                    cough: false,
                    nasal_discharge: false,
                    reduced_appetite: false,
                    diarrhea: false,
                    lethargy: false,
                    reduced_milk: false,
                    difficulty_breathing: false,
                    salivation: false,
                    lesions: false,
                    swelling: false,
                    other_symptoms: '',
                  }))
                }}
              >
                Log Another
              </Button>
            </div>

          </Card>
        </div>
      )}
    </div>
  )
}
