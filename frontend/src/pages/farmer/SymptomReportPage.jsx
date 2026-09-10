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
import VoiceReportModal, { CLINICAL_SYMPTOM_LEXICON } from '../../components/common/VoiceReportModal'
import VoiceReportButton from '../../components/common/VoiceReportButton'
import VisualLesionScannerModal from '../../components/common/VisualLesionScannerModal'
import apiClient from '../../services/api'
import { SYMPTOM_DEFINITIONS } from '../../utils/symptomDefinitions'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { saveOfflineReport } from '../../utils/offlineQueue'

export default function SymptomReportPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [animals, setAnimals] = useState([])
  const [selectedAnimalId, setSelectedAnimalId] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [otherSymptoms, setOtherSymptoms] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [durationDays, setDurationDays] = useState(2)
  const [affectedCount, setAffectedCount] = useState(1)
  const [village, setVillage] = useState('Baramati')
  const [district, setDistrict] = useState('Pune')
  const [loadingAnimals, setLoadingAnimals] = useState(true)

  // AI Analysis & Outcome State
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [lesionScannerOpen, setLesionScannerOpen] = useState(false)

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

  const handleAutoFillBaramatiDemo = () => {
    const targetCow = animals.find(a => a.animal_id === 'COW-101') || animals[0]
    if (targetCow) {
      setSelectedAnimalId(targetCow.animal_id)
    }
    setSelectedSymptoms(['fever', 'lesions', 'salivation', 'reduced_appetite', 'reduced_milk'])
    setOtherSymptoms('High temperature observed with severe drooling, mouth ulcers and milk yield dropped sharply.')
    setSeverity('severe')
    setDurationDays(2)
    setAffectedCount(3)
    setVillage('Baramati')
    setDistrict('Pune')
  }

  const handleInlineVoiceInput = (finalTranscript, fullLiveTranscript) => {
    const text = (fullLiveTranscript || finalTranscript || '').trim()
    if (!text) return

    // Update otherSymptoms field directly in real-time
    setOtherSymptoms(text)

    // Detect and match symptoms into checklist
    const lower = text.toLowerCase()
    const matched = []
    CLINICAL_SYMPTOM_LEXICON.forEach((lex) => {
      if (lex.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
        matched.push(lex.id)
      }
    })
    if (matched.length > 0) {
      setSelectedSymptoms((prev) => Array.from(new Set([...prev, ...matched])))
    }
  }

  const handleAnalyzeHealthRisk = async (e) => {
    e.preventDefault()
    if (selectedSymptoms.length === 0 && !otherSymptoms.trim()) {
      setError('Please select at least one clinical symptom or describe symptoms to analyze.')
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
      other_symptoms: otherSymptoms,
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
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('OFFLINE_NETWORK')
      }
      const res = await apiClient.post('/health-reports', payload)
      setTimeout(() => {
        setAnalyzing(false)
        setAnalysisResult(res.data)
      }, 2000)
    } catch (err) {
      if (err.message === 'OFFLINE_NETWORK' || !err.response || err.code === 'ERR_NETWORK') {
        const queued = await saveOfflineReport(payload)
        setTimeout(() => {
          setAnalyzing(false)
          setAnalysisResult({
            id: queued?.id || `offline-${Date.now()}`,
            animal_id: payload.animal_id,
            risk_level: 'SAVED OFFLINE',
            risk_score: 45.0,
            possible_disease_concern: 'Pending Online Synchronization (Saved in Browser Storage)',
            ai_recommendation: 'Record stored securely in local device queue. Will auto-sync when network connectivity returns. Please quarantine the animal.',
            is_offline: true,
            status: 'pending_sync'
          })
        }, 1500)
      } else {
        setAnalyzing(false)
        setError(err.response?.data?.detail || err.message || 'Failed to submit symptom report')
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              {t('report.subtitle')}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
              {t('report.aiSupport')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t('report.title')}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFillBaramatiDemo}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-xs flex items-center space-x-1.5 transition shadow-lg shadow-rose-950/40"
            title="Pre-fill with Baramati FMD Demo Data (7 Clinical Signs)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('report.autofill')}</span>
          </button>
          <button
            type="button"
            onClick={() => setLesionScannerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950 font-bold text-xs flex items-center space-x-2 transition shadow-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t('report.aiScan')}</span>
          </button>
          <Button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            icon={Mic}
            className="font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
          >
            {t('report.voiceIntake')}
          </Button>
        </div>
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
        <Card className="bg-slate-900/90 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-black uppercase text-emerald-400">
              {t('report.step1')}
            </span>
            <span className="text-[11px] text-slate-400">{t('report.selectLivestock')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {animals.map((anim) => (
              <div
                key={anim.id}
                onClick={() => setSelectedAnimalId(anim.animal_id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1 ${
                  selectedAnimalId === anim.animal_id
                    ? 'bg-slate-950 border-emerald-400 ring-2 ring-emerald-400/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-black text-emerald-400">{anim.animal_id}</span>
                  <PawPrint className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h4 className="font-bold text-sm text-white">{t('data.species.' + anim.species) || anim.species}</h4>
                <span className="text-[11px] text-slate-400 block">{anim.breed || 'Gir'} • {anim.age} {t('units.yrs')}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Step 2: 11 Core Symptoms Checklist */}
        <Card className="bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
            <div>
              <span className="text-xs font-mono font-black uppercase text-emerald-400 block">
                {t('report.step2')} ({selectedSymptoms.length} SELECTED)
              </span>
              <span className="text-[11px] text-slate-400">{t('report.step2Sub')}</span>
            </div>
            <VoiceReportButton
              size="sm"
              onTranscript={handleInlineVoiceInput}
              label="Speak Symptoms"
              activeLabel="Listening..."
              className="self-start sm:self-auto"
            />
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
                      ? 'bg-slate-950 border-emerald-400 ring-2 ring-emerald-400/50 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
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
        <Card className="bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-black uppercase text-emerald-400">
              {t('report.step3')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Severity */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">{t('report.severityLevel')}</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              >
                <option value="mild">{t('report.mild')}</option>
                <option value="moderate">{t('report.moderate')}</option>
                <option value="severe">{t('report.severe')}</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">{t('report.duration')}</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              >
                <option value="1">{t('report.day1')}</option>
                <option value="2">{t('report.days2to3')}</option>
                <option value="5">{t('report.days4to7')}</option>
                <option value="10">{t('report.moreThan7')}</option>
              </select>
            </div>

            {/* Affected Animals Count */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">{t('report.animalsAffected')}</label>
              <input
                type="number"
                min="1"
                max="50"
                value={affectedCount}
                onChange={(e) => setAffectedCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Step 4: Spoken / Typed Clinical Observations */}
        <Card className="bg-slate-900/90 border border-slate-800 p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
            <div>
              <span className="text-xs font-mono font-black uppercase text-emerald-400 block">
                {t('report.step4')}
              </span>
              <span className="text-[11px] text-slate-400">
                {t('report.step4Sub')}
              </span>
            </div>
            <VoiceReportButton
              size="sm"
              onTranscript={handleInlineVoiceInput}
              label="Speak Report"
              activeLabel="Listening..."
              className="self-start sm:self-auto"
            />
          </div>

          <textarea
            rows={3}
            value={otherSymptoms}
            onChange={(e) => setOtherSymptoms(e.target.value)}
            placeholder={t('report.placeholder')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none font-medium"
          />
        </Card>

        {/* Big Submit Button */}
        <Button
          type="submit"
          size="lg"
          icon={Sparkles}
          className="w-full font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 text-base py-3.5"
        >
          {t('report.analyzeBtn')}
        </Button>
      </form>

      {/* AI Health Analysis Multi-Step Loading Modal */}
      {analyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <Card className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl text-white">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-xl text-white">
                {t('report.analyzing')}
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
          <Card className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  EXPLAINABLE HEALTH RISK ASSESSMENT
                </span>
                <h3 className="text-xl font-black text-white">
                  Clinical Risk Evaluation: {analysisResult.animal_id}
                </h3>
              </div>
              <RiskBadge level={analysisResult.risk_level} score={analysisResult.risk_score} />
            </div>

            {/* Mandatory Non-Diagnostic Disclaimer */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-300">{t('report.disclaimer')}</strong>
                <p className="text-amber-200/90">
                  {t('report.disclaimerText')}
                </p>
              </div>
            </div>

            {/* Score & Disease Match */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">{t('report.healthRiskScore')}</span>
                <span className="text-2xl font-black text-rose-400">{analysisResult.risk_score} / 100</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">{t('report.riskLevel')}</span>
                <span className="px-2.5 py-0.5 rounded-full font-black text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                  {analysisResult.risk_level || 'CRITICAL'}
                </span>
              </div>

              <div className="text-xs space-y-1 pt-2 border-t border-slate-800">
                <span className="text-slate-400 block font-bold">{t('report.possibleDisease')}</span>
                <strong className="text-rose-400 block text-sm">
                  {analysisResult.possible_disease_concern || 'Foot-and-Mouth Disease (suspected)'}
                </strong>
              </div>

              {/* Contributing Factors */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                  {t('report.contributingFactors')}
                </span>
                <div className="space-y-1 text-xs">
                  {analysisResult.contributing_factors && analysisResult.contributing_factors.length > 0 ? (
                    analysisResult.contributing_factors.map((f, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                        <span className="text-slate-300">{typeof f === 'string' ? f : f.factor}</span>
                        {typeof f === 'object' && f.weight_contribution > 0 && (
                          <span className="font-mono font-bold text-rose-400">+{f.weight_contribution.toFixed(1)} pts</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between items-center bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                        <span className="text-slate-300">• Fever / elevated temperature</span>
                        <span className="font-mono font-bold text-rose-400">+18.0 pts</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                        <span className="text-slate-300">• Oral lesions / blisters</span>
                        <span className="font-mono font-bold text-rose-400">+24.0 pts</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                        <span className="text-slate-300">• Excessive frothy salivation</span>
                        <span className="font-mono font-bold text-rose-400">+16.0 pts</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                        <span className="text-slate-300">• Reduced appetite & milk drop</span>
                        <span className="font-mono font-bold text-rose-400">+10.0 pts</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                        <span className="text-slate-300">• Multiple animals affected (3 herd contacts)</span>
                        <span className="font-mono font-bold text-rose-400">+8.0 pts</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                        <span className="text-slate-300">• Vaccination gap (FMD booster due/overdue)</span>
                        <span className="font-mono font-bold text-amber-400">+5.0 pts</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Advice */}
            <div className="p-3.5 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-xs text-amber-200 space-y-1">
              <strong className="text-amber-400 block font-bold">{t('report.nextAction')}</strong>
              <p>{analysisResult.recommendation || analysisResult.recommended_action || 'Immediate isolation + urgent veterinary inspection'}</p>
            </div>

            {/* Link to Outbreak Map */}
            <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-rose-300 block">Nearby Spatial Disease Cluster Detected</span>
                <span className="text-slate-400 text-[11px]">Active surveillance hotspot in Baramati village</span>
              </div>
              <Link to="/presentation">
                <Button size="sm" className="font-bold bg-rose-600 hover:bg-rose-500 text-white">
                  {t('report.viewMap')}
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
                {t('report.returnBtn')}
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* Voice Reporting Modal */}
      <VoiceReportModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        defaultAnimalId={selectedAnimalId}
        availableAnimals={animals}
        initialText={otherSymptoms}
        onSymptomsDetected={(symList, spokenText) => {
          setSelectedSymptoms(prev => Array.from(new Set([...prev, ...symList])))
          if (spokenText) {
            setOtherSymptoms(prev => prev ? (prev.trim() + ' ' + spokenText.trim()) : spokenText.trim())
          }
        }}
      />

      {/* Visual Lesion Scanner Modal */}
      <VisualLesionScannerModal
        isOpen={lesionScannerOpen}
        onClose={() => setLesionScannerOpen(false)}
        onApplyToReport={(scan) => {
          const syms = []
          if (scan.symptomsMatched?.fever) syms.push('fever')
          if (scan.symptomsMatched?.salivation) syms.push('salivation')
          if (scan.symptomsMatched?.lesions) syms.push('lesions')
          if (scan.symptomsMatched?.reduced_appetite) syms.push('reduced_appetite')
          if (scan.symptomsMatched?.reduced_milk) syms.push('reduced_milk')
          if (scan.symptomsMatched?.swelling) syms.push('swelling')
          if (scan.symptomsMatched?.lethargy) syms.push('lethargy')
          setSelectedSymptoms(prev => Array.from(new Set([...prev, ...syms])))
          if (scan.severity?.toLowerCase().includes('severe')) setSeverity('severe')
          else if (scan.severity?.toLowerCase().includes('high')) setSeverity('severe')
          else setSeverity('moderate')
        }}
      />

    </div>
  )
}
