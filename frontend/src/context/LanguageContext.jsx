import React, { createContext, useContext, useState, useEffect } from 'react'

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'हिन्दी', nativeName: 'Hindi' },
  { code: 'mr', label: 'मराठी', nativeName: 'Marathi' }
]

export const translations = {
  en: {
    // Brand & SIH
    brandName: 'PASHURAKSHA AI',
    prototypeNotice: 'Prototype developed for SIH Problem Statement SIH26128',
    
    // Auth & Login
    selectRole: 'Select Your Role',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    signingIn: 'Signing in...',
    newUser: 'New user?',
    register: 'Register',
    
    // Roles
    roles: {
      farmer: 'Farmer',
      farmerSub: 'Cattle / Herd Owner',
      fieldWorker: 'Pashu Sakhi',
      fieldWorkerSub: 'Field Worker',
      vetDoctor: 'Vet Doctor',
      vetDoctorSub: 'Veterinarian',
      lab: 'Lab',
      labSub: 'Diagnostics',
      authority: 'Authority',
      authoritySub: 'District Officer',
      admin: 'Admin',
      adminSub: 'Governance'
    },
    
    // Password visibility
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    
    // Validation & Errors
    invalidCredentials: 'Invalid email or password.',
    networkError: 'Cannot connect to PASHURAKSHA AI server. Please make sure the backend is running at 127.0.0.1:8000.',
    authFailed: 'Authentication failed. Please check your credentials.'
  },
  hi: {
    // Brand & SIH
    brandName: 'PASHURAKSHA AI',
    prototypeNotice: 'SIH समस्या विवरण SIH26128 के लिए विकसित प्रोटोटाइप',
    
    // Auth & Login
    selectRole: 'भूमिका चुनें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    login: 'लॉगिन',
    signingIn: 'लॉगिन हो रहा है...',
    newUser: 'नए उपयोगकर्ता?',
    register: 'पंजीकरण करें',
    
    // Roles
    roles: {
      farmer: 'किसान',
      farmerSub: 'पशुपालक',
      fieldWorker: 'पशु सखी',
      fieldWorkerSub: 'फील्ड वर्कर',
      vetDoctor: 'पशु चिकित्सक',
      vetDoctorSub: 'पशु डॉक्टर',
      lab: 'प्रयोगशाला',
      labSub: 'जांच केंद्र',
      authority: 'अधिकारी',
      authoritySub: 'जिला अधिकारी',
      admin: 'प्रशासक',
      adminSub: 'सिस्टम प्रशासन'
    },
    
    // Password visibility
    showPassword: 'पासवर्ड दिखाएं',
    hidePassword: 'पासवर्ड छुपाएं',
    
    // Validation & Errors
    invalidCredentials: 'अमान्य ईमेल या पासवर्ड।',
    networkError: 'PASHURAKSHA AI सर्वर से कनेक्ट नहीं हो सका। कृपया सुनिश्चित करें कि बैकएंड 127.0.0.1:8000 पर चल रहा है।',
    authFailed: 'प्रमाणीकरण विफल। कृपया अपने क्रेडेंशियल्स की जांच करें।'
  },
  mr: {
    // Brand & SIH
    brandName: 'PASHURAKSHA AI',
    prototypeNotice: 'SIH समस्या विवरण SIH26128 साठी विकसित प्रोटोटाइप',
    
    // Auth & Login
    selectRole: 'भूमिका निवडा',
    email: 'ईमेल',
    password: 'पासवर्ड',
    login: 'लॉगिन',
    signingIn: 'लॉगिन होत आहे...',
    newUser: 'नवीन वापरकर्ता?',
    register: 'नोंदणी करा',
    
    // Roles
    roles: {
      farmer: 'शेतकरी',
      farmerSub: 'पशुपालक शेतकरी',
      fieldWorker: 'पशु सखी',
      fieldWorkerSub: 'फील्ड वर्कर',
      vetDoctor: 'पशुवैद्यक',
      vetDoctorSub: 'पशुवैद्यकीय अधिकारी',
      lab: 'प्रयोगशाळा',
      labSub: 'तपासणी केंद्र',
      authority: 'अधिकारी',
      authoritySub: 'जिल्हा अधिकारी',
      admin: 'प्रशासक',
      adminSub: 'प्रशासन'
    },
    
    // Password visibility
    showPassword: 'पासवर्ड दाखवा',
    hidePassword: 'पासवर्ड लपवा',
    
    // Validation & Errors
    invalidCredentials: 'अवैध ईमेल किंवा पासवर्ड.',
    networkError: 'PASHURAKSHA AI सर्व्हरशी कनेक्ट होऊ शकले नाही. कृपया बॅकएंड 127.0.0.1:8000 वर चालू असल्याची खात्री करा.',
    authFailed: 'प्रमाणीकरण अयशस्वी. कृपया तुमची माहिती तपासा.'
  }
}

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
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

  const t = translations[language] || translations.en

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
      t: translations.en,
      languages: LANGUAGES
    }
  }
  return context
}

export default LanguageContext
