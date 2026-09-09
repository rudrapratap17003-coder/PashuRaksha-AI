import React, { useState, useEffect } from 'react'
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  CheckCircle2,
  Volume2,
  ArrowRight,
  Activity,
  AlertCircle,
  ShieldCheck,
  CheckSquare,
  Square,
  Edit3
} from 'lucide-react'
import Card from './Card'
import Button from './Button'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { saveOfflineReport } from '../../utils/offlineQueue'

const CLINICAL_SYMPTOM_LEXICON = [
  {
    id: 'fever',
    label: 'Fever (ताप / बुखार)',
    keywords: ['fever', 'ताप', 'तापमान', 'बुखार', 'गरम', 'garam', 'hot', 'temperature']
  },
  {
    id: 'lesions',
    label: 'Mouth / Skin Blisters (तोंडात फोड / छाले)',
    keywords: ['lesion', 'blister', 'ulcer', 'sore', 'wound', 'फोड', 'तोंडात', 'छाले', 'घाव', 'गाठ', 'nodule', 'eruption']
  },
  {
    id: 'salivation',
    label: 'Excessive Salivation (लाळ गळणे / लार टपकना)',
    keywords: ['saliv', 'drool', 'froth', 'लाळ', 'लार', 'गळत', 'टपकना', 'foam']
  },
  {
    id: 'reduced_appetite',
    label: 'Loss of Appetite (चारा न खाणे / भूख कम)',
    keywords: ['appetite', 'feed', 'eat', 'fodder', 'चारा', 'खात नाही', 'खात', 'भूख', 'दाना', 'off-feed']
  },
  {
    id: 'reduced_milk',
    label: 'Reduced Milk Yield (दूध कमी)',
    keywords: ['milk', 'yield', 'दूध', 'दूध कमी', 'drop in milk', 'less milk']
  },
  {
    id: 'cough',
    label: 'Cough / Respiratory Distress (खोकला / सांस फूलना)',
    keywords: ['cough', 'breath', 'panting', 'खोकला', 'खांसी', 'श्वास', 'दम', 'wheez']
  },
  {
    id: 'lameness',
    label: 'Lameness / Foot Soreness (लंगडणे / लंगड़ाना)',
    keywords: ['lame', 'limp', 'hoof', 'foot', 'लंगड', 'लंगड़ा', 'खुर']
  },
  {
    id: 'diarrhea',
    label: 'Diarrhea (जुलाब / दस्त)',
    keywords: ['diarrhea', 'loose', 'dung', 'जुलाब', 'पातळ', 'दस्त']
  }
]

export default function VoiceReportModal({
  isOpen,
  onClose,
  onSuccess,
  onSymptomsDetected,
  defaultAnimalId = '',
  availableAnimals = []
}) {
  if (!isOpen) return null

  const { user } = useAuth()
  const [language, setLanguage] = useState('mr') // 'mr' | 'hi' | 'en'
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [symptomList, setSymptomList] = useState([])
  const [step, setStep] = useState('idle') // 'idle' | 'listening' | 'analyzed' | 'submitted'
  const [submitting, setSubmitting] = useState(false)
  const [recognitionSource, setRecognitionSource] = useState(null) // 'browser' | 'fallback'
  const [animalId, setAnimalId] = useState(() => {
    if (defaultAnimalId) return defaultAnimalId
    if (availableAnimals && availableAnimals.length > 0) return availableAnimals[0].animal_id
    return 'TAG-01'
  })

  // Detect Web Speech API availability
  const isSpeechSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  const sampleDialectTranscripts = {
    mr: {
      text: 'माझ्या गाईला दोन दिवसांपासून तीव्र ताप आहे, तोंडात फोड आले आहेत, लाळ गळत आहे आणि चारा खात नाही.',
    },
    hi: {
      text: 'मेरी गाय को दो दिन से तेज बुखार है, मुंह में छाले हैं, लार टपक रही है और चारा नहीं खा रही है।',
    },
    en: {
      text: 'My animal has high fever, blisters in mouth, excessive salivation and stopped eating feed.',
    }
  }

  const parseSymptomsFromTranscript = (text) => {
    if (!text) return []
    const lower = text.toLowerCase()
    return CLINICAL_SYMPTOM_LEXICON.map((sym) => {
      const isPresent = sym.keywords.some((kw) => lower.includes(kw.toLowerCase()))
      return {
        id: sym.id,
        label: sym.label,
        checked: isPresent
      }
    })
  }

  const startBrowserSpeechRecognition = () => {
    setRecording(true)
    setStep('listening')
    setTranscript('')
    setSymptomList([])
    setRecognitionSource('browser')

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setRecording(false)
      setStep('idle')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript
        setTranscript(speechResult)
        const extracted = parseSymptomsFromTranscript(speechResult)
        setSymptomList(extracted)
        setRecording(false)
        setStep('analyzed')
        setRecognitionSource('browser')
      }

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err)
        setRecording(false)
        setStep('idle')
      }

      recognition.start()
    } catch (e) {
      console.warn('Failed to start speech recognition:', e)
      setRecording(false)
      setStep('idle')
    }
  }

  const handleSimulatedVoiceDemo = () => {
    setRecording(true)
    setStep('listening')
    setTranscript('')
    setSymptomList([])
    setRecognitionSource('fallback')

    setTimeout(() => {
      const sampleText = sampleDialectTranscripts[language].text
      setTranscript(sampleText)
      const extracted = parseSymptomsFromTranscript(sampleText)
      setSymptomList(extracted)
      setRecording(false)
      setStep('analyzed')
    }, 1500)
  }

  const handleToggleSymptom = (id) => {
    setSymptomList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    )
  }

  const handleTranscriptChange = (newText) => {
    setTranscript(newText)
    const updated = parseSymptomsFromTranscript(newText)
    // Keep user's manual toggles if any, or re-parse
    setSymptomList(updated)
  }

  const handleLodgeVoiceReport = async () => {
    const selectedSymptoms = symptomList.filter((s) => s.checked).map((s) => s.id)
    if (selectedSymptoms.length === 0) {
      alert('Please check at least one confirmed symptom before submitting.')
      return
    }

    setSubmitting(true)
    const payload = {
      animal_id: animalId || 'TAG-01',
      species: 'Cattle (Cow)',
      reported_by: user?.id || 'usr-farmer',
      reporter_name: user?.name || 'Registered Farmer',
      village: user?.village || 'Baramati',
      district: user?.district || 'Pune',
      fever: selectedSymptoms.includes('fever'),
      lesions: selectedSymptoms.includes('lesions'),
      salivation: selectedSymptoms.includes('salivation'),
      reduced_appetite: selectedSymptoms.includes('reduced_appetite'),
      reduced_milk: selectedSymptoms.includes('reduced_milk'),
      cough: selectedSymptoms.includes('cough'),
      severity: selectedSymptoms.length >= 3 ? 'severe' : 'moderate',
      duration_days: 2,
      number_of_animals_affected: 2,
      notes: `Voice intake transcript (${recognitionSource === 'browser' ? 'Live Speech' : 'Demo Simulation'}): "${transcript}"`
    }

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('OFFLINE_NETWORK')
      }
      await apiClient.post('/health-reports', payload)
      setStep('submitted')
      if (onSymptomsDetected) onSymptomsDetected(selectedSymptoms)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        onClose()
      }, 1500)
    } catch (err) {
      await saveOfflineReport(payload)
      setStep('submitted')
      if (onSymptomsDetected) onSymptomsDetected(selectedSymptoms)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        onClose()
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <Card className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 text-white shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Multilingual Voice Symptom Intake
              </h3>
              <p className="text-xs text-slate-400">
                मराठी / हिंदी / English Speech Recognition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close voice intake modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-bold px-2">Voice Language:</span>
          {[
            { id: 'mr', label: 'मराठी (Marathi)' },
            { id: 'hi', label: 'हिंदी (Hindi)' },
            { id: 'en', label: 'English' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                language === l.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Animal Selector / Verification */}
        <div className="flex items-center justify-between text-xs bg-slate-950 px-3.5 py-2.5 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-400 block text-[10px]">Reporting For Animal:</span>
            <span className="font-bold text-emerald-400">{animalId || 'Selected Cattle'}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Farmer / Village:</span>
            <span className="text-slate-300 font-bold">{user?.name || 'Farmer'} ({user?.village || 'Baramati'})</span>
          </div>
        </div>

        {/* Stage 1: IDLE Stage */}
        {step === 'idle' && (
          <div className="text-center py-4 space-y-4">
            {isSpeechSupported ? (
              <div className="space-y-3">
                <button
                  onClick={startVoiceRecording}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-950 transition transform hover:scale-105"
                >
                  <Mic className="w-8 h-8 font-black" />
                </button>
                <p className="text-xs text-slate-300 font-medium">
                  Tap the microphone to speak your animal symptoms.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2 text-left">
                <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Voice recognition is unavailable on this device.</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your browser does not expose the Speech Recognition API. You can run the demonstration voice simulation below:
                </p>
                <button
                  onClick={handleSimulatedVoiceDemo}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4" /> Demo voice simulation
                </button>
              </div>
            )}

            {isSpeechSupported && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={handleSimulatedVoiceDemo}
                  className="text-[11px] text-slate-400 hover:text-amber-300 font-bold underline transition"
                >
                  Or run Demo voice simulation (Sample dialect recording)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stage 2: LISTENING Stage */}
        {step === 'listening' && (
          <div className="text-center py-6 space-y-4">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-950">
                <Mic className="w-7 h-7 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                {recognitionSource === 'browser' ? 'Listening to microphone...' : 'Processing sample dialect speech...'}
              </span>
              <p className="text-xs text-slate-400 mt-1 italic">
                {recognitionSource === 'browser' ? 'Speak clearly into your microphone' : `"${sampleDialectTranscripts[language].text}"`}
              </p>
            </div>
          </div>
        )}

        {/* Stage 3: ANALYZED & CONFIRMATION Stage */}
        {step === 'analyzed' && (
          <div className="space-y-4 animate-in fade-in">
            {recognitionSource === 'browser' ? (
              <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Live Speech Recognition
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Microphone Stream</span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Demo voice simulation
                </span>
                <span className="text-[10px] text-amber-400 font-mono">Dialect Simulation</span>
              </div>
            )}

            {/* Editable Transcript */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-emerald-400" /> Spoken Transcript (Edit if needed):
                </span>
                <span className="text-[10px] text-slate-500">Farmer review</span>
              </div>
              <textarea
                rows={2}
                value={transcript}
                onChange={(e) => handleTranscriptChange(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Extracted Symptoms Confirmation Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Confirmed Clinical Signs:</span>
                </span>
                <span className="text-[10px] text-slate-400">Check/uncheck to edit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {symptomList.map((sym) => (
                  <div
                    key={sym.id}
                    onClick={() => handleToggleSymptom(sym.id)}
                    className={`p-2 rounded-xl border cursor-pointer transition flex items-center space-x-2 text-xs select-none ${
                      sym.checked
                        ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {sym.checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                    <span className="truncate">{sym.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleLodgeVoiceReport}
              loading={submitting}
              icon={ArrowRight}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5"
            >
              Confirm &amp; Submit Voice Report
            </Button>
          </div>
        )}

        {/* Stage 4: SUBMITTED Stage */}
        {step === 'submitted' && (
          <div className="text-center py-6 space-y-3 animate-in zoom-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-black text-white">Voice Report Submitted!</h4>
            <p className="text-xs text-slate-300">
              Clinical symptoms recorded for {animalId}. Case queued for veterinary triage.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

