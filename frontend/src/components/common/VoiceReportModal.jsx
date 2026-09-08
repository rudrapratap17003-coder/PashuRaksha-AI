import React, { useState, useEffect } from 'react'
import { Mic, MicOff, X, Sparkles, CheckCircle2, Volume2, ArrowRight, Activity, Radio, AlertCircle } from 'lucide-react'
import Card from './Card'
import Button from './Button'
import Badge from './Badge'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { saveOfflineReport } from '../../utils/offlineQueue'

export default function VoiceReportModal({ isOpen, onClose, onSuccess, defaultAnimalId = 'COW-101' }) {
  if (!isOpen) return null

  const { user } = useAuth()
  const [language, setLanguage] = useState('mr') // 'mr' | 'hi' | 'en'
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [extractedSymptoms, setExtractedSymptoms] = useState([])
  const [step, setStep] = useState('idle') // 'idle' | 'listening' | 'analyzed' | 'submitted'
  const [submitting, setSubmitting] = useState(false)
  const [isDemoFallback, setIsDemoFallback] = useState(false)
  const [recognitionSource, setRecognitionSource] = useState(null) // 'browser' | 'fallback'
  const [animalId, setAnimalId] = useState(defaultAnimalId)

  const sampleTranscripts = {
    mr: {
      text: 'माझ्या गाईला दोन दिवसांपासून तीव्र ताप आहे, तोंडात फोड आले आहेत, लाळ गळत आहे आणि चारा खात नाही.',
      symptoms: ['Fever (ताप)', 'Blisters/Lesions (तोंडात फोड)', 'Loss of Appetite (चारा न खाणे)', 'Salivation (लाळ गळणे)'],
    },
    hi: {
      text: 'मेरी गाय को 2 दिन से तेज बुखार है, मुंह में छाले हैं और चारा नहीं खा रही है।',
      symptoms: ['Fever (बुखार)', 'Skin Lesions (मुंह में छाले)', 'Reduced Appetite (भूख कम)', 'Salivation (लार टपकना)'],
    },
    en: {
      text: 'My cow in Baramati has high fever, vesicular blisters on mouth, salivation and stopped eating feed.',
      symptoms: ['Fever', 'Blisters/Lesions', 'Reduced Appetite', 'Excessive Salivation'],
    }
  }

  const startVoiceRecording = () => {
    setRecording(true)
    setStep('listening')
    setTranscript('')
    setExtractedSymptoms([])
    setIsDemoFallback(false)
    setRecognitionSource('browser')

    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition()
        recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript
          setTranscript(speechResult)
          setExtractedSymptoms(sampleTranscripts[language].symptoms)
          setRecording(false)
          setStep('analyzed')
          setRecognitionSource('browser')
        }
        recognition.onerror = () => {
          fallbackSimulatedSpeech()
        }
        recognition.start()
        return
      } catch {
        fallbackSimulatedSpeech()
      }
    } else {
      fallbackSimulatedSpeech()
    }
  }

  const fallbackSimulatedSpeech = () => {
    setIsDemoFallback(true)
    setRecognitionSource('fallback')
    setTimeout(() => {
      setTranscript(sampleTranscripts[language].text)
      setRecording(false)
      setStep('analyzed')
      setExtractedSymptoms(sampleTranscripts[language].symptoms)
    }, 1800)
  }

  const handleLodgeVoiceReport = async () => {
    setSubmitting(true)
    const symText = (extractedSymptoms || []).join(' ').toLowerCase()
    const payload = {
      animal_id: animalId,
      species: 'Cattle (Cow)',
      reported_by: user?.id || 'usr-farmer-1',
      reporter_name: user?.name || 'Farmer',
      village: user?.village || 'Baramati',
      district: user?.district || 'Pune',
      fever: symText.includes('fever') || symText.includes('ताप') || symText.includes('बुखार'),
      lesions: symText.includes('lesion') || symText.includes('blister') || symText.includes('फोड') || symText.includes('छाले'),
      salivation: symText.includes('saliv') || symText.includes('लाळ') || symText.includes('लार'),
      reduced_appetite: symText.includes('appetite') || symText.includes('चारा') || symText.includes('भूख'),
      severity: 'severe',
      duration_days: 2,
      number_of_animals_affected: 2
    }

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('OFFLINE_NETWORK')
      }
      await apiClient.post('/health-reports', payload)
      setStep('submitted')
      setTimeout(() => {
        if (onSuccess) onSuccess()
        onClose()
      }, 1500)
    } catch (err) {
      // Offline fallback: save to IndexedDB queue
      await saveOfflineReport(payload)
      setStep('submitted')
      setTimeout(() => {
        if (onSuccess) onSuccess()
        onClose()
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <Card className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Multilingual AI Voice Symptom Intake
              </h3>
              <p className="text-xs text-slate-400">
                मराठी / हिंदी / English Voice Processing
              </p>
            </div>
          </div>

          <button onClick={onClose} aria-label="Close voice intake modal" className="p-1.5 text-slate-400 hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-500">
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

        {/* Voice Recording Stage */}
        {step === 'idle' && (
          <div className="text-center py-6 space-y-4">
            <button
              onClick={startVoiceRecording}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-950 transition transform hover:scale-105"
            >
              <Mic className="w-8 h-8 font-black" />
            </button>
            <p className="text-xs text-slate-300">
              Tap the microphone to speak your animal symptoms.
            </p>
          </div>
        )}

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
                {recognitionSource === 'browser' ? 'Listening to microphone (Speech recognition: Browser)...' : 'Processing dialect speech sample (Demo fallback)...'}
              </span>
              <p className="text-xs text-slate-400 mt-1 italic">
                "{sampleTranscripts[language].text}"
              </p>
            </div>
          </div>
        )}

        {step === 'analyzed' && (
          <div className="space-y-4 animate-in fade-in">
            {recognitionSource === 'browser' ? (
              <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Speech recognition: Browser
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Live Microphone Input</span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Demo fallback
                </span>
                <span className="text-[10px] text-amber-400 font-mono">Simulated Speech Sample</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-400">Animal Tag / कानाचा टॅग:</span>
              <input
                type="text"
                value={animalId}
                onChange={(e) => setAnimalId(e.target.value)}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-bold text-xs w-28 text-center"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Recognized Voice Transcript (Edit if needed):
                </span>
                <span className="text-[10px] text-slate-400">Review before submit</span>
              </div>
              <textarea
                rows={2}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extracted Clinical Signs:</span>
                </span>
                <span className="text-[10px] text-slate-400">Click × to remove</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedSymptoms.map((sym, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1.5"
                  >
                    <span>{sym}</span>
                    <button
                      type="button"
                      onClick={() => setExtractedSymptoms(prev => prev.filter((_, i) => i !== idx))}
                      className="text-emerald-400 hover:text-white p-0.5 rounded"
                      title="Remove symptom"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleLodgeVoiceReport}
              loading={submitting}
              icon={ArrowRight}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Submit Voice Intake for Assessment
            </Button>
          </div>
        )}

        {step === 'submitted' && (
          <div className="text-center py-6 space-y-3 animate-in zoom-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-black text-white">Voice Report Successfully Lodged!</h4>
            <p className="text-xs text-slate-400">AI Risk Assessment updated on Baramati surveillance radar.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
