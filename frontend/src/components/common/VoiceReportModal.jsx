import React, { useState, useEffect } from 'react'
import { Mic, MicOff, X, Sparkles, CheckCircle2, Volume2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import Button from './Button'
import Badge from './Badge'

export default function VoiceReportModal({ isOpen, onClose, onSymptomsDetected }) {
  if (!isOpen) return null

  const [language, setLanguage] = useState('hi') // 'en' | 'hi' | 'kn'
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [extractedSymptoms, setExtractedSymptoms] = useState([])
  const [step, setStep] = useState('idle') // 'idle' | 'listening' | 'analyzed'

  const sampleTranscripts = {
    hi: {
      text: 'मेरी गाय को 2 दिन से तेज बुखार है, मुंह में छाले हैं और चारा नहीं खा रही है।',
      symptoms: ['Fever', 'Skin Lesions', 'Reduced Appetite', 'Excess Salivation'],
    },
    en: {
      text: 'My cow in Rampur has high fever, vesicular blisters on mouth and has stopped eating.',
      symptoms: ['Fever', 'Skin Lesions', 'Reduced Appetite', 'Excess Salivation'],
    },
    kn: {
      text: 'ನನ್ನ ಹಸುವಿಗೆ ಜ್ವರವಿದೆ, ಬಾಯಿಯಲ್ಲಿ ಹುಣ್ಣುಗಳಿವೆ ಮತ್ತು ಸರಿಯಾಗಿ ಆಹಾರ ತಿನ್ನುತ್ತಿಲ್ಲ.',
      symptoms: ['Fever', 'Skin Lesions', 'Reduced Appetite', 'Excess Salivation'],
    }
  }

  const startVoiceRecording = () => {
    setRecording(true)
    setStep('listening')
    setTranscript('')
    setExtractedSymptoms([])

    setTimeout(() => {
      setTranscript(sampleTranscripts[language].text)
      setRecording(false)
      setStep('analyzed')
      setExtractedSymptoms(sampleTranscripts[language].symptoms)
    }, 2500)
  }

  const handleProceedWithSymptoms = () => {
    if (onSymptomsDetected) {
      onSymptomsDetected(extractedSymptoms)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <Card className="bg-[#092923] border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Rural Voice Symptom Intake
              </h3>
              <p className="text-xs text-emerald-300/80 font-medium">
                AI Natural Language Speech-to-Symptom Parser
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-between bg-[#061B17] p-1.5 rounded-2xl border border-emerald-500/20 text-xs">
          <span className="text-[11px] font-bold text-slate-400 pl-2">Select Language:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-xl font-bold transition ${
                language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-xl font-bold transition ${
                language === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-3 py-1 rounded-xl font-bold transition ${
                language === 'kn' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ಕನ್ನಡ (Kannada)
            </button>
          </div>
        </div>

        {/* Microphone Action Area */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
          <button
            onClick={startVoiceRecording}
            disabled={recording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              recording
                ? 'bg-rose-600 text-white shadow-2xl shadow-rose-500/50 scale-110 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-105'
            }`}
          >
            <Mic className="w-10 h-10" />
          </button>

          <div>
            <span className="font-bold text-sm text-white block">
              {recording ? 'Listening & Transcribing Speech...' : 'Tap to Speak Symptoms'}
            </span>
            <span className="text-xs text-slate-400">
              {recording ? 'Speak clearly into your microphone' : 'Describe your animal\'s symptoms in your local dialect'}
            </span>
          </div>
        </div>

        {/* Audio Wave Animation when Recording */}
        {recording && (
          <div className="flex items-center justify-center space-x-1.5 h-8">
            {[40, 70, 90, 60, 100, 50, 80, 45, 95, 60].map((height, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${height * 0.3}%`, `${height}%`, `${height * 0.2}%`] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.08 }}
                className="w-1 bg-emerald-400 rounded-full"
              />
            ))}
          </div>
        )}

        {/* Extracted Results */}
        {step === 'analyzed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#061B17] border border-emerald-500/30 space-y-3 text-xs"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Recognized Speech:
              </span>
              <p className="text-slate-300 italic font-medium">"{transcript}"</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-emerald-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>AI Extracted Symptoms ({extractedSymptoms.length}):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedSymptoms.map((sym) => (
                  <span
                    key={sym}
                    className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold"
                  >
                    ✓ {sym}
                  </span>
                ))}
              </div>
            </div>

            <Button
              onClick={handleProceedWithSymptoms}
              size="md"
              icon={ArrowRight}
              className="w-full font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 mt-2"
            >
              Transfer to AI Risk Engine →
            </Button>
          </motion.div>
        )}

      </Card>
    </div>
  )
}
