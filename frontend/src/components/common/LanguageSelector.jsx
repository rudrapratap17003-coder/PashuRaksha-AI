import React, { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage, LANGUAGES } from '../../context/LanguageContext'

export default function LanguageSelector({ className = '', compact = false }) {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (code) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('nav.selectLanguage')}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-150"
      >
        <Globe className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
        <span className="font-semibold text-slate-800">{currentLang.label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Available languages"
          className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {LANGUAGES.map((l) => {
            const isSelected = l.code === language
            return (
              <button
                key={l.code}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => handleSelect(l.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                  isSelected
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{l.label}</span>
                  {l.nativeName && l.nativeName !== l.label && (
                    <span className="text-[10px] text-slate-400">({l.nativeName})</span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
