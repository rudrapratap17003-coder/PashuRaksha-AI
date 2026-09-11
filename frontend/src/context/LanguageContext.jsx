import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '../locales/en'
import hi from '../locales/hi'
import mr from '../locales/mr'

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'हिन्दी', nativeName: 'Hindi' },
  { code: 'mr', label: 'मराठी', nativeName: 'Marathi' }
]

const dictionaries = { en, hi, mr }

// Utility to resolve nested keys (e.g., 'auth.login')
function resolveKey(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, params) => key,
  languages: LANGUAGES
})

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('pashuraksha_language')
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        return saved
      }
    } catch {
      // Fallback
    }
    return 'en'
  })

  const setLanguage = (langCode) => {
    if (langCode === 'en' || langCode === 'hi' || langCode === 'mr') {
      setLanguageState(langCode)
      try {
        localStorage.setItem('pashuraksha_language', langCode)
      } catch (err) {
        console.warn('Failed to save language to localStorage:', err)
      }
    }
  }

  // Translation function with nested keys and interpolation
  const t = (key, params = {}, fallbackStr = undefined) => {
    const dict = dictionaries[language] || dictionaries.en
    let str = resolveKey(dict, key)

    // Fallback to English if missing in current locale
    if (str === undefined) {
      if (language !== 'en') {
        str = resolveKey(dictionaries.en, key)
      }
      
      // If still missing, return fallbackStr if provided, else format the key
      if (str === undefined) {
        if (fallbackStr !== undefined) return fallbackStr;
        console.warn(`[i18n] Missing translation key: ${key}`)
        // Fallback: extract last part of key and format as Title Case
        const keyBase = key.split('.').pop()
        return keyBase
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (s) => s.toUpperCase())
      }
    }

    // Handle interpolation, e.g., "Hello {name}"
    if (typeof str === 'string' && Object.keys(params).length > 0) {
      return str.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match
      })
    }

    return str
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key) => key,
      languages: LANGUAGES
    }
  }
  return context
}

export default LanguageContext
