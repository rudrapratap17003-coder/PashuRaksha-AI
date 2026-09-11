import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Mic, MicOff, X, Sparkles, CheckCircle2, Volume2, ArrowRight, HeartPulse, AlertCircle, ShieldCheck, CheckSquare, Square, Edit3, RefreshCw, Info, Radio, StopCircle } from 'lucide-react'
import Card from './Card'
import Button from './Button'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useSpeechRecognition, LOCALE_MAP } from '../../hooks/useSpeechRecognition'
import { saveOfflineReport } from '../../utils/offlineQueue'

export const CLINICAL_SYMPTOM_LEXICON = [
  {
    id: 'fever',
    label: 'Fever (ताप / बुखार)',
    keywords: ['fever', 'ताप', 'तापमान', 'बुखार', 'गरम', 'garam', 'hot', 'temperature', 'taap', 'bukhar']
  },
  {
    id: 'lesions',
    label: 'Mouth / Skin Blisters (तोंडात फोड / छाले)',
    keywords: ['lesion', 'blister', 'ulcer', 'sore', 'wound', 'फोड', 'तोंडात', 'छाले', 'घाव', 'गाठ', 'nodule', 'eruption', 'khur', 'chhale', 'phod', 'vesicle']
  },
  {
    id: 'salivation',
    label: 'Excessive Salivation (लाळ गळणे / लार टपकना)',
    keywords: ['saliv', 'drool', 'froth', 'लाळ', 'लार', 'गळत', 'टपकना', 'foam', 'laal', 'laar', 'drooling']
  },
  {
    id: 'reduced_appetite',
    label: 'Loss of Appetite (चारा न खाणे / भूख कम)',
    keywords: ['appetite', 'feed', 'eat', 'fodder', 'चारा', 'खात नाही', 'खात', 'भूख', 'दाना', 'off-feed', 'chara', 'bhookh', 'not eating', 'eating']
  },
  {
    id: 'reduced_milk',
    label: 'Reduced Milk Yield (दूध कमी)',
    keywords: ['milk', 'yield', 'दूध', 'दूध कमी', 'drop in milk', 'less milk', 'doodh', 'dudh', 'ghat']
  },
  {
    id: 'cough',
    label: 'Cough (खोकला / खांसी)',
    keywords: ['cough', 'खोकला', 'खांसी', 'कफ', 'khokla', 'khansi', 'coughing']
  },
  {
    id: 'nasal_discharge',
    label: 'Nasal Discharge (नाकातून पाणी / नाक बहना)',
    keywords: ['nasal', 'discharge', 'nose', 'नाक', 'नाकातून पाणी', 'नाक बहना', 'snot', 'shingad']
  },
  {
    id: 'difficulty_breathing',
    label: 'Difficulty Breathing (श्वास घेण्यास त्रास / सांस फूलना)',
    keywords: ['breath', 'panting', 'श्वास', 'सांस', 'दम', 'wheez', 'shwas', 'dum', 'breathing']
  },
  {
    id: 'diarrhea',
    label: 'Diarrhea (जुलाब / दस्त)',
    keywords: ['diarrhea', 'loose', 'dung', 'जुलाब', 'पातळ', 'दस्त', 'julaab', 'dast']
  },
  {
    id: 'swelling',
    label: 'Swelling / Edema (सूज / सूजन)',
    keywords: ['swell', 'swelling', 'सूज', 'सूजन', 'गाठ', 'sujan', 'sooj', 'swollen']
  },
  {
    id: 'lethargy',
    label: 'Lethargy / Dullness (सुस्ती / कमजोरी)',
    keywords: ['letharg', 'dull', 'weak', 'सुस्ती', 'कमजोरी', 'अशक्त', 'sust', 'kamjori', 'depressed']
  }
]

export default function VoiceReportModal({
  isOpen,
  onClose,
  onSuccess,
  onSymptomsDetected,
  defaultAnimalId = '',
  availableAnimals = [],
  initialText = ''
}) {
  const { t } = useLanguage()
  if (!isOpen) return null

  const { user } = useAuth()
  const { language: appLang } = useLanguage()
  const [selectedLang, setSelectedLang] = useState(appLang || 'mr')
  const [step, setStep] = useState('idle') // 'idle' | 'listening' | 'analyzed' | 'submitted'
  const [editableTranscript, setEditableTranscript] = useState(initialText || '')
  const [symptomList, setSymptomList] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [recognitionSource, setRecognitionSource] = useState('browser') // 'browser' | 'demo'
  const [animalId, setAnimalId] = useState(() => {
    if (defaultAnimalId) return defaultAnimalId
    if (availableAnimals && availableAnimals.length > 0) return availableAnimals[0].animal_id
    return 'COW-101'
  })

  // Sync selected language when modal opens or appLang changes
  useEffect(() => {
    if (appLang) setSelectedLang(appLang)
  }, [appLang])

  // Parse symptoms from text
  const parseSymptomsFromText = useCallback((text) => {
    if (!text) return CLINICAL_SYMPTOM_LEXICON.map(sym => ({ ...sym, checked: false }))
    const lower = text.toLowerCase()
    return CLINICAL_SYMPTOM_LEXICON.map((sym) => {
      const isPresent = sym.keywords.some((kw) => lower.includes(kw.toLowerCase()))
      return {
        id: sym.id,
        label: sym.label,
        checked: isPresent
      }
    })
  }, [])

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    fullTranscript,
    error: speechError,
    errorCode,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    defaultLang: selectedLang,
    continuous: true,
    interimResults: true,
    onResult: ({ fullTranscript: liveFull, transcript: finalT, interimTranscript: interimT }) => {
      const currentText = (liveFull || finalT || interimT || '').trim()
      setEditableTranscript(currentText)
      const detected = parseSymptomsFromText(currentText)
      setSymptomList(detected)
    },
    onError: (err) => {
      console.warn('[Voice] Modal error handler:', err)
    }
  })

  // Start live microphone recording
  const handleStartRecording = () => {
    console.log('[Voice] Modal start recording triggered')
    setRecognitionSource('browser')
    setStep('listening')
    startListening({
      lang: selectedLang,
      reset: !editableTranscript,
      existingText: editableTranscript
    })
  }

  // Stop recording and move to review
  const handleStopRecording = () => {
    console.log('[Voice] Modal stop recording triggered')
    stopListening()
    setStep('analyzed')
  }

  const handleToggleSymptom = (id) => {
    setSymptomList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    )
  }

  const handleTranscriptChange = (newText) => {
    setEditableTranscript(newText)
    const updated = parseSymptomsFromText(newText)
    setSymptomList(updated)
  }

  const handleReset = () => {
    stopListening()
    resetTranscript()
    setEditableTranscript('')
    setSymptomList([])
    setStep('idle')
  }

  const handleClose = () => {
    stopListening()
    onClose()
  }

  const handleLodgeVoiceReport = async () => {
    const selectedSymptoms = symptomList.filter((s) => s.checked).map((s) => s.id)
    if (selectedSymptoms.length === 0 && !editableTranscript.trim()) {
      alert('Please check at least one confirmed symptom or enter spoken observations.')
      return
    }

    setSubmitting(true)
    const finalSpokenNotes = editableTranscript || fullTranscript || transcript
    const payload = {
      animal_id: animalId || 'COW-101',
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
      nasal_discharge: selectedSymptoms.includes('nasal_discharge'),
      difficulty_breathing: selectedSymptoms.includes('difficulty_breathing'),
      diarrhea: selectedSymptoms.includes('diarrhea'),
      swelling: selectedSymptoms.includes('swelling'),
      lethargy: selectedSymptoms.includes('lethargy'),
      other_symptoms: finalSpokenNotes,
      severity: selectedSymptoms.length >= 3 ? 'severe' : 'moderate',
      duration_days: 2,
      number_of_animals_affected: 2,
      notes: `Voice intake (${selectedLang.toUpperCase()}): "${finalSpokenNotes}"`
    }

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('OFFLINE_NETWORK')
      }
      await apiClient.post('/health-reports', payload)
      setStep('submitted')
      if (onSymptomsDetected) onSymptomsDetected(selectedSymptoms, finalSpokenNotes)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        handleClose()
      }, 1500)
    } catch (err) {
      console.warn('Network submission failed, queueing offline:', err)
      await saveOfflineReport(payload)
      setStep('submitted')
      if (onSymptomsDetected) onSymptomsDetected(selectedSymptoms, finalSpokenNotes)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        handleClose()
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  const langButtons = [
    { id: 'mr', label: 'मराठी (Marathi)' },
    { id: 'hi', label: 'हिंदी (Hindi)' },
    { id: 'en', label: 'English' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <Card className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-5 sm:p-7 space-y-5 text-white shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
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
                मराठी (mr-IN) / हिंदी (hi-IN) / English (en-IN)
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close voice intake modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-bold px-2">Voice Language:</span>
          <div className="flex items-center space-x-1">
            {langButtons.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLang(l.id)
                  if (step === 'listening') {
                    startListening({ lang: l.id, reset: false, existingText: editableTranscript })
                  }
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedLang === l.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Animal Selector / Location */}
        <div className="flex items-center justify-between text-xs bg-slate-950 px-3.5 py-2.5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[10px]">Animal:</span>
            {availableAnimals && availableAnimals.length > 1 ? (
              <select
                value={animalId}
                onChange={(e) => setAnimalId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-emerald-400 font-bold px-2 py-0.5 rounded-lg text-xs focus:ring-1 focus:ring-emerald-400"
              >
                {availableAnimals.map(a => (
                  <option key={a.animal_id} value={a.animal_id}>
                    {a.animal_id} ({t(`data.species.${a.species}`, {}, a.species)})
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-bold text-emerald-400">{animalId || 'Selected Cattle'}</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px]">Location: </span>
            <span className="text-slate-300 font-bold">{user?.village || 'Baramati'}, {user?.district || 'Pune'}</span>
          </div>
        </div>

        {/* Speech Error Banner if any */}
        {speechError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">{speechError}</span>
              {(errorCode === 'not-allowed' || errorCode === 'service-not-allowed') && (
                <p className="text-[11px] text-rose-300 leading-relaxed">
                  Microphone permission is required for voice reporting. Please allow microphone access in your browser settings.
                </p>
              )}
            </div>
          </div>
        )}

        {/* STAGE 1: IDLE */}
        {step === 'idle' && (
          <div className="text-center py-4 space-y-4">
            {isSupported ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-20 h-20 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-slate-900/20 transition transform hover:scale-105 active:scale-95"
                >
                  <Mic className="w-8 h-8 font-black" />
                </button>
                <div>
                  <p className="text-sm text-slate-200 font-bold">
                    Tap microphone &amp; speak your animal symptoms
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedLang === 'mr'
                      ? 'उदा. "माझ्या गाईला ताप आहे, तोंडात फोड आले आहेत आणि लाळ गळत आहे"'
                      : selectedLang === 'hi'
                      ? 'उदा. "मेरी गाय को तेज बुखार है, मुंह में छाले हैं और लार टपक रही है"'
                      : 'e.g. "My cow has fever, mouth blisters and salivation"'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-2 text-left">
                <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Voice input is not supported in this browser. Please use Google Chrome.</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Web Speech API is available on desktop &amp; mobile Chrome, Microsoft Edge, and Safari.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STAGE 2: LISTENING */}
        {step === 'listening' && (
          <div className="text-center py-5 space-y-4">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-slate-900/20 transition transform active:scale-95"
              >
                <Mic className="w-7 h-7 animate-pulse" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">Listening to microphone ({LOCALE_MAP[selectedLang] || selectedLang})...
              </span>
              <p className="text-xs text-slate-400">
                Speak clearly into your microphone. Tap stop when finished.
              </p>
            </div>

            {/* Live Audio Waves / Transcript Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/40 min-h-[70px] text-left space-y-1">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block">
                Live Speech Stream:
              </span>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                {editableTranscript || fullTranscript || (
                  <span className="text-slate-500 font-normal">Listening for audio...</span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="primary"
                onClick={handleStopRecording}
                icon={StopCircle}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-6"
              >
                Stop &amp; Review Transcript
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 3: ANALYZED & CONFIRMATION */}
        {step === 'analyzed' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Speech Captured Successfully
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">{LOCALE_MAP[selectedLang]}</span>
            </div>

            {/* Editable Transcript */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-emerald-400" /> Spoken Transcript (Edit if needed):
                </span>
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="text-[10px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Mic className="w-3 h-3" /> Speak More
                </button>
              </div>
              <textarea
                rows={3}
                value={editableTranscript}
                onChange={(e) => handleTranscriptChange(e.target.value)}
                placeholder="Spoken symptoms appear here..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Extracted Symptoms Confirmation Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Detected Symptoms ({symptomList.filter(s => s.checked).length}):</span>
                </span>
                <span className="text-[10px] text-slate-400">Tap to toggle</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {symptomList.map((sym) => (
                  <div
                    key={sym.id}
                    onClick={() => handleToggleSymptom(sym.id)}
                    className={`p-2 rounded-xl border cursor-pointer transition flex items-center space-x-2 text-xs select-none ${
                      sym.checked
                        ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold ring-1 ring-emerald-500/30'
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

            <div className="flex items-center space-x-2 pt-1">
              <Button
                variant="secondary"
                onClick={handleReset}
                className="w-1/3 py-2.5 text-xs text-slate-300"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={handleLodgeVoiceReport}
                loading={submitting}
                icon={ArrowRight}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5"
              >
                Confirm &amp; Submit
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 4: SUBMITTED */}
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
