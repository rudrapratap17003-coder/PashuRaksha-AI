import React, { useState } from 'react'
import { Mic, MicOff, Square, Radio, AlertCircle } from 'lucide-react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useLanguage } from '../../context/LanguageContext'

export default function VoiceReportButton({
  onTranscript,
  language: overrideLang,
  className = '',
  size = 'md',
  variant = 'primary',
  label,
  activeLabel,
  showLivePreview = true,
  disabled = false
}) {
  const { t } = useLanguage()
  const { language: contextLang } = useLanguage()
  const activeLang = overrideLang || contextLang || 'mr'

  const labels = {
    mr: {
      default: 'बोलून सांगा',
      listening: 'ऐकत आहे... थांबा',
      unsupported: 'मायक्रोफोन अनुपलब्ध'
    },
    hi: {
      default: 'बोलकर बताएं',
      listening: 'सुन रहा है... रोकें',
      unsupported: 'माइक उपलब्ध नहीं'
    },
    en: {
      default: 'Speak Report',
      listening: 'Listening... Stop',
      unsupported: 'Mic Unavailable'
    }
  }

  const currentLabels = labels[activeLang] || labels.mr

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    fullTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    defaultLang: activeLang,
    onResult: ({ transcript: resTranscript, interimTranscript: resInterim, isFinal }) => {
      if (onTranscript) {
        onTranscript(resTranscript, (resTranscript ? resTranscript + ' ' : '') + (resInterim || ''))
      }
    }
  })

  const handleToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening({ lang: activeLang, reset: true })
    }
  }

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-3 text-sm sm:text-base gap-2.5'
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Speech recognition is not supported in this browser"
        className={`inline-flex items-center justify-center font-bold rounded-xl opacity-60 cursor-not-allowed bg-slate-800 text-slate-400 border border-slate-700 ${sizeClasses[size]} ${className}`}
      >
        <MicOff className={iconSizes[size]} />
        <span>{label || currentLabels.unsupported}</span>
      </button>
    )
  }

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-pressed={isListening}
        className={`inline-flex items-center justify-center font-bold rounded-xl transition-all shadow-md active:scale-95 select-none ${
          isListening
            ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse border-2 border-rose-400 ring-2 ring-rose-500/40'
            : variant === 'secondary'
            ? 'bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-950 font-black'
        } ${sizeClasses[size]} ${className}`}
      >
        {isListening ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span>{activeLabel || currentLabels.listening}</span>
          </>
        ) : (
          <>
            <Mic className={iconSizes[size]} />
            <span>{label || currentLabels.default}</span>
          </>
        )}
      </button>

      {/* Live Audio & Transcript Preview popover */}
      {isListening && showLivePreview && (
        <div className="absolute top-full left-0 mt-2 z-50 min-w-[240px] max-w-sm p-3 rounded-2xl bg-slate-950/95 border border-rose-500/50 shadow-2xl backdrop-blur-md text-white space-y-2 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                Microphone Active ({activeLang.toUpperCase()})
              </span>
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="text-[10px] text-slate-400 hover:text-white font-bold underline"
            >
              Done
            </button>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed min-h-[32px] italic">
            {fullTranscript || (
              <span className="text-slate-500 font-normal">
                {activeLang === 'mr'
                  ? 'लक्षणे बोला (उदा. "गायीला ताप आणि तोंडात फोड आहेत")...'
                  : activeLang === 'hi'
                  ? 'लक्षण बताएं (उदा. "गाय को बुखार है और छाले हैं")...'
                  : 'Speak symptoms clearly into microphone...'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error Tooltip */}
      {error && !isListening && (
        <div className="absolute top-full left-0 mt-1 z-40 max-w-xs p-2 rounded-xl bg-rose-950 border border-rose-500 text-[11px] text-rose-200 flex items-center space-x-1.5 shadow-lg">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
          <span className="leading-tight">{error}</span>
        </div>
      )}
    </div>
  )
}
