import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Supported Indian Locales
 */
export const LOCALE_MAP = {
  mr: 'mr-IN',
  hi: 'hi-IN',
  en: 'en-IN'
}

/**
 * Localized Error Messages
 */
export const SPEECH_ERROR_MESSAGES = {
  'not-allowed': {
    en: 'Microphone access was denied. Please allow microphone permission in your browser settings.',
    hi: 'माइक्रोफ़ोन एक्सेस अस्वीकृत कर दिया गया। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।',
    mr: 'मायक्रोफोन प्रवेश नाकारला गेला. कृपया आपल्या ब्राउझर सेटिंग्जमध्ये मायक्रोफोनची परवानगी द्या.'
  },
  'no-speech': {
    en: 'No speech detected. Please try speaking closer to your microphone.',
    hi: 'कोई आवाज़ नहीं सुनाई दी। कृपया माइक्रोफ़ोन के पास आकर बोलें।',
    mr: 'कोणताही आवाज आढळला नाही. कृपया मायक्रोफोनजवळ येऊन स्पष्ट बोला.'
  },
  'network': {
    en: 'Network error occurred during speech recognition. Please check your internet connection.',
    hi: 'ध्वनि पहचान के दौरान नेटवर्क त्रुटि हुई। कृपया इंटरनेट कनेक्शन जांचें।',
    mr: 'आवाज ओळखताना नेटवर्क त्रुटी आली. कृपया आपले इंटरनेट कनेक्शन तपासा.'
  },
  'audio-capture': {
    en: 'No microphone found or audio capture failed.',
    hi: 'कोई माइक्रोफ़ोन नहीं मिला या ऑडियो कैप्चर विफल रहा।',
    mr: 'मायक्रोफोन सापडला नाही किंवा ऑडिओ कॅप्चर अयशस्वी झाले.'
  },
  'unsupported': {
    en: 'Speech Recognition is not supported by your browser. Use Chrome, Edge, or Safari.',
    hi: 'आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता। कृपया Chrome या Edge का उपयोग करें।',
    mr: 'आपला ब्राउझर स्पीच रेकग्निशनला समर्थन देत नाही. कृपया Chrome किंवा Edge वापरा.'
  },
  'default': {
    en: 'An error occurred during voice recognition.',
    hi: 'ध्वनि पहचान में त्रुटि हुई।',
    mr: 'आवाज ओळखताना त्रुटी आली.'
  }
}

/**
 * useSpeechRecognition Hook
 * 
 * Provides a clean, reactive interface to the browser's Web Speech API (SpeechRecognition / webkitSpeechRecognition).
 */
export function useSpeechRecognition({
  defaultLang = 'mr',
  continuous = true,
  interimResults = true,
  onResult,
  onError,
  onEnd
} = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)
  const [errorCode, setErrorCode] = useState(null)

  const recognitionRef = useRef(null)
  const shouldListenRef = useRef(false)
  const langRef = useRef(defaultLang)

  const isSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  // Keep langRef synced
  useEffect(() => {
    langRef.current = defaultLang
  }, [defaultLang])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // ignore
        }
        recognitionRef.current = null
      }
    }
  }, [])

  const getErrorMessage = useCallback((code, currentLang = 'en') => {
    const langKey = ['mr', 'hi', 'en'].includes(currentLang) ? currentLang : 'en'
    const entry = SPEECH_ERROR_MESSAGES[code] || SPEECH_ERROR_MESSAGES['default']
    return entry[langKey] || entry['en']
  }, [])

  const startListening = useCallback(({
    lang = langRef.current,
    reset = false
  } = {}) => {
    if (!isSupported) {
      const msg = getErrorMessage('unsupported', lang)
      setError(msg)
      setErrorCode('unsupported')
      if (onError) onError({ error: 'unsupported', message: msg })
      return
    }

    if (reset) {
      setTranscript('')
      setInterimTranscript('')
    }

    setError(null)
    setErrorCode(null)
    shouldListenRef.current = true

    // Abort existing instance if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {
        // ignore
      }
      recognitionRef.current = null
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    const resolvedLocale = LOCALE_MAP[lang] || (lang.includes('-') ? lang : `${lang}-IN`)
    recognition.lang = resolvedLocale
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setErrorCode(null)
    }

    recognition.onresult = (event) => {
      let currentInterim = ''
      let finalAccumulated = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i]
        const text = item[0].transcript
        if (item.isFinal) {
          finalAccumulated += text + ' '
        } else {
          currentInterim += text
        }
      }

      if (finalAccumulated) {
        setTranscript((prev) => {
          const updated = (prev ? prev.trim() + ' ' : '') + finalAccumulated.trim()
          if (onResult) onResult({ transcript: updated, isFinal: true })
          return updated
        })
      }

      setInterimTranscript(currentInterim)
      if (currentInterim && onResult) {
        onResult({ interimTranscript: currentInterim, isFinal: false })
      }
    }

    recognition.onerror = (event) => {
      const code = event.error
      console.warn('SpeechRecognition error:', code, event)
      
      // 'no-speech' is common and usually benign if continuous
      if (code === 'no-speech') {
        // Don't kill listening immediately if user is pausing
        return
      }

      setErrorCode(code)
      const msg = getErrorMessage(code, lang)
      setError(msg)
      setIsListening(false)
      shouldListenRef.current = false

      if (onError) onError({ error: code, message: msg, event })
    }

    recognition.onend = () => {
      setInterimTranscript('')
      // If user did not manually request stop and continuous is on, restart if desirable
      if (shouldListenRef.current && continuous) {
        try {
          recognition.start()
          return
        } catch {
          // fall through
        }
      }
      setIsListening(false)
      shouldListenRef.current = false
      if (onEnd) onEnd()
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
    } catch (err) {
      console.error('Failed to start speech recognition:', err)
      setIsListening(false)
      shouldListenRef.current = false
      const msg = getErrorMessage('audio-capture', lang)
      setError(msg)
      setErrorCode('audio-capture')
      if (onError) onError({ error: 'audio-capture', message: msg, originalError: err })
    }
  }, [isSupported, continuous, interimResults, getErrorMessage, onResult, onError, onEnd])

  const stopListening = useCallback(() => {
    shouldListenRef.current = false
    setIsListening(false)
    setInterimTranscript('')
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        try {
          recognitionRef.current.abort()
        } catch {
          // ignore
        }
      }
      recognitionRef.current = null
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
    setErrorCode(null)
  }, [])

  const fullTranscript = (transcript ? transcript + (interimTranscript ? ' ' + interimTranscript : '') : interimTranscript).trim()

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    fullTranscript,
    error,
    errorCode,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
    getErrorMessage
  }
}

export default useSpeechRecognition
