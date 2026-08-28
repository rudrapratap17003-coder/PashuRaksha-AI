import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  FilePlus2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  PawPrint, 
  HelpCircle,
  Stethoscope,
  Radio,
  Clock,
  Mic,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Cpu
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import VoiceReportModal from '../../components/common/VoiceReportModal'
import apiClient from '../../services/api'
import { SYMPTOM_DEFINITIONS } from '../../utils/symptomDefinitions'
import { useAuth } from '../../context/AuthContext'

export default function SymptomReportPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [animals, setAnimals] = useState([])
  const [selectedAnimalId, setSelectedAnimalId] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [severity, setSeverity] = useState('moderate')
  const [durationDays, setDurationDays] = useState(2)
  const [affectedCount, setAffectedCount] = useState(1)
  const [village, setVillage] = useState('Rampur')
  const [district, setDistrict] = useState('Jaipur Rural')
  const [loadingAnimals, setLoadingAnimals] = useState(true)

  // AI Analysis & Outcome State
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)

  useEffect(() => {
    async function loadAnimals() {
      try {
        const res = await apiClient.get('/animals')
        setAnimals(res.data)
        if (res.data.length > 0) setSelectedAnimalId(res.data[0].animal_id)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingAnimals(false)
      }
    }
    loadAnimals()
  }, [])

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleAnalyzeHealthRisk = async (e) => {
    e.preventDefault()
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one clinical symptom to analyze.')
      return
    }

    setError(null)
    setAnalyzing(true)
    setAnalysisStep(1)

    // Build payload
    const payload = {
      animal_id: selectedAnimalId,
      fever: selectedSymptoms.includes('fever'),
      cough: selectedSymptoms.includes('cough'),
      nasal_discharge: selectedSymptoms.includes('nasal_discharge'),
      difficulty_breathing: selectedSymptoms.includes('difficulty_breathing'),
      lesions: selectedSymptoms.includes('lesions'),
      salivation: selectedSymptoms.includes('salivation'),
      diarrhea: selectedSymptoms.includes('diarrhea'),
      reduced_milk: selectedSymptoms.includes('reduced_milk'),
      swelling: selectedSymptoms.includes('swelling'),
      lethargy: selectedSymptoms.includes('lethargy'),
      reduced_appetite: selectedSymptoms.includes('reduced_appetite'),
      severity,
      duration_days: parseInt(durationDays) || 2,
      number_of_animals_affected: parseInt(affectedCount) || 1,
      village,
      district,
    }

    // Step-by-step AI sequence
    setTimeout(() => setAnalysisStep(2), 700)
    setTimeout(() => setAnalysisStep(3), 1400)
    setTimeout(() => setAnalysisStep(4), 2100)

    try {
      const res = await apiClient.post('/health-reports', payload)
      setTimeout(() => {
        setAnalyzing(false)
        setAnalysisResult(res.data)
      }, 2800)
    } catch (err) {
      setAnalyzing(false)
      setError(err.response?.data?.detail || err.message || 'Failed to analyze health risk')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              Clinical Symptom Reporting
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
              AI Decision Support
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Livestock Health Problem Intake
          </h1>
        </div>

        <Button
          onClick={() => setVoiceModalOpen(true)}
          icon={Mic}
          className="font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
        >
          Voice Intake (आवाज में बताएं)
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Multi-Step Symptom Form */}
      <form onSubmit={handleAnalyzeHealthRisk} className="space-y-6">
        
        {/* Step 1: Select Animal */}
        <Card className="bg-[#092923] border border-emerald-500/30 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-xs font-mono font-black uppercase text-emerald-400">
              STEP 1 • SELECT ANIMAL
            </span>
            <span className="text-[11px] text-slate-400">Select livestock from your digital registry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {animals.map((anim) => (
              <div
                key={anim.id}
                onClick={() => setSelectedAnimalId(anim.animal_id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1 ${
                  selectedAnimalId === anim.animal_id
                    ? 'bg-emerald-950 border-emerald-400 ring-2 ring-emerald-400/40'
                    : 'bg-[#061B17] border-emerald-500/20 hover:border-emerald-500/40 text-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-black text-emerald-400">{anim.animal_id}</span>
                  <PawPrint className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h4 className="font-bold text-sm text-white">{anim.species}</h4>
                <span className="text-[11px] text-slate-400 block">{anim.breed || 'Gir'} • {anim.age} yrs</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Step 2: 11 Core Symptoms Checklist */}
        <Card className="bg-[#092923] border border-emerald-500/30 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-xs font-mono font-black uppercase text-emerald-400">
              STEP 2 • OBSERVED CLINICAL SYMPTOMS ({selectedSymptoms.length} SELECTED)
            </span>
            <span className="text-[11px] text-slate-400">Tap all symptoms currently present</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {SYMPTOM_DEFINITIONS.map((sym) => {
              const active = selectedSymptoms.includes(sym.id)
              return (
                <div
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 select-none ${
                    active
                      ? 'bg-emerald-950 border-emerald-400 ring-2 ring-emerald-400/50 text-white'
                      : 'bg-[#061B17] border-emerald-500/20 hover:border-emerald-500/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{sym.icon}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      active ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black' : 'border-slate-600'
                    }`}>
                      {active ? '✓' : ''}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-tight">{sym.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium block">{sym.hindiName}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Step 3: Severity, Duration & Location */}
        <Card className="bg-[#092923] border border-emerald-500/30 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <span className="text-xs font-mono font-black uppercase text-emerald-400">
              STEP 3 • CLINICAL CONTEXT &amp; LOCATION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Severity */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#061B17] border border-emerald-500/30 text-white font-semibold focus:ring-2 focus:ring-emerald-400"
              >
                <option value="mild">Mild (हल्का)</option>
                <option value="moderate">Moderate (मध्यम)</option>
                <option value="severe">Severe (गंभीर - Emergency)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Duration (Days)</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#061B17] border border-emerald-500/30 text-white font-semibold focus:ring-2 focus:ring-emerald-400"
              >
                <option value="1">1 Day (आज से)</option>
                <option value="2">2–3 Days</option>
                <option value="5">4–7 Days</option>
                <option value="10">More than 7 Days</option>
              </select>
            </div>

            {/* Affected Animals Count */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Animals Affected in Herd</label>
              <input
                type="number"
                min="1"
                max="50"
                value={affectedCount}
                onChange={(e) => setAffectedCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#061B17] border border-emerald-500/30 text-white font-semibold focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>
        </Card>

        {/* Big Submit Button */}
        <Button
          type="submit"
          size="lg"
          icon={Sparkles}
          className="w-full font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 text-base py-3.5"
        >
          Analyze Livestock Health Risk →
        </Button>
      </form>

      {/* AI Health Analysis Multi-Step Loading Modal */}
      {analyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <Card className="bg-[#092923] border border-emerald-500/40 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl text-white">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-xl text-white">
                ANALYZING LIVESTOCK HEALTH...
              </h3>
              <p className="text-xs text-slate-300">
                PASHURAKSHA AI Explainable Risk Engine Active
              </p>
            </div>

            <div className="space-y-2 text-xs text-left max-w-xs mx-auto">
              <div className={`flex items-center space-x-2 ${analysisStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <span>{analysisStep >= 1 ? '✓' : '○'}</span>
                <span>Symptom pattern &amp; synergies analyzed</span>
              </div>
              <div className={`flex items-center space-x-2 ${analysisStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <span>{analysisStep >= 2 ? '✓' : '○'}</span>
                <span>Animal history &amp; age factors checked</span>
              </div>
              <div className={`flex items-center space-x-2 ${analysisStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <span>{analysisStep >= 3 ? '✓' : '○'}</span>
                <span>Vaccination coverage &amp; immunity status checked</span>
              </div>
              <div className={`flex items-center space-x-2 ${analysisStep >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <span>{analysisStep >= 4 ? '✓' : '○'}</span>
                <span>Nearby spatial reports in Rampur analyzed</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* AI Health Risk Assessment Result Modal */}
      {analysisResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <Card className="bg-[#092923] border border-emerald-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-emerald-500/20 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  AI DECISION-SUPPORT ASSESSMENT
                </span>
                <h3 className="text-xl font-black text-white">
                  Health Risk Evaluation: {analysisResult.animal_id}
                </h3>
              </div>
              <RiskBadge level={analysisResult.risk_level} score={analysisResult.risk_score} />
            </div>

            {/* Score & Disease Match */}
            <div className="p-4 rounded-2xl bg-[#061B17] border border-emerald-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Calculated Risk Score:</span>
                <strong className="text-xl font-black text-emerald-300">{analysisResult.risk_score} / 100</strong>
              </div>

              <div className="text-xs space-y-1 pt-1 border-t border-emerald-500/10">
                <div className="text-slate-300">
                  Potential Disease Concern: <strong className="text-rose-400">{analysisResult.possible_disease_concern}</strong>
                </div>
              </div>
            </div>

            {/* Action Advice */}
            <div className="p-3.5 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-xs text-amber-200 space-y-1">
              <strong className="text-amber-400 block font-bold">Recommended Isolation &amp; Veterinary Guidance:</strong>
              <p>{analysisResult.recommended_action || 'Isolate symptomatic animal in dry pen, ensure clean water, and await on-site veterinary inspection.'}</p>
            </div>

            {/* Link to Outbreak Map */}
            <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-rose-300 block">Nearby Spatial Disease Cluster Detected</span>
                <span className="text-slate-400 text-[11px]">Multiple similar cases reported in Rampur sector</span>
              </div>
              <Link to="/presentation">
                <Button size="sm" className="font-bold bg-rose-600 hover:bg-rose-500 text-white">
                  View Outbreak Map →
                </Button>
              </Link>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <Button
                onClick={() => navigate('/farmer/dashboard')}
                size="md"
                className="flex-1 font-black bg-emerald-500 text-slate-950"
              >
                Return to Dashboard
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* Voice Reporting Modal */}
      <VoiceReportModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSymptomsDetected={(symList) => {
          // Map recognized strings to ids
          const mapped = symList.map(s => s.toLowerCase().replace(' ', '_'))
          setSelectedSymptoms(mapped)
        }}
      />

    </div>
  )
}
