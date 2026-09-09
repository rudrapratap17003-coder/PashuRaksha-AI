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
 * Localized Error Messages matching SIH26128 requirements
 */
export const SPEECH_ERROR_MESSAGES = {
  'not-allowed': {
    en: 'Microphone permission is required for voice reporting. Please allow microphone access in your browser settings.',
    hi: 'वॉइस रिपोर्टिंग के लिए माइक्रोफ़ोन की अनुमति आवश्यक है। कृपया अपनी ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।',
    mr: 'व्हॉईस रिपोर्टिंगसाठी मायक्रोफोनची परवानगी आवश्यक आहे. कृपया आपल्या ब्राउझर सेटिंग्जमध्ये मायक्रोफोनची परवानगी द्या.'
  },
  'service-not-allowed': {
    en: 'Microphone permission was denied. Please enable microphone access in your browser.',
    hi: 'माइक्रोफ़ोन एक्सेस अस्वीकृत कर दिया गया। कृपया ब्राउज़र में माइक्रोफ़ोन चालू करें।',
    mr: 'मायक्रोफोन प्रवेश नाकारला गेला. कृपया ब्राउझरमध्ये मायक्रोफोन सुरू करा.'
  },
  'no-speech': {
    en: 'No speech detected. Please try speaking again closer to your microphone.',
    hi: 'कोई आवाज़ नहीं सुनाई दी। कृपया माइक्रोफ़ोन के पास आकर पुनः बोलें।',
    mr: 'कोणताही आवाज आढळला नाही. कृपया मायक्रोफोनजवळ येऊन पुन्हा बोला.'
  },
  'audio-capture': {
    en: 'No microphone was detected. Please check your audio input device.',
    hi: 'कोई माइक्रोफ़ोन नहीं मिला। कृपया अपना ऑडियो इनपुट उपकरण जांचें।',
    mr: 'मायक्रोफोन सापडला नाही. कृपया आपले ऑडिओ डिव्हाइस तपासा.'
  },
  'network': {
    en: 'Voice recognition could not connect. Please check your internet connection.',
    hi: 'ध्वनि पहचान कनेक्ट नहीं हो सकी। कृपया इंटरनेट कनेक्शन जांचें।',
    mr: 'आवाज ओळख कनेक्ट होऊ शकली नाही. कृपया आपले इंटरनेट कनेक्शन तपासा.'
  },
  'unsupported': {
    en: 'Voice input is not supported in this browser. Please use Google Chrome.',
    hi: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Google Chrome का उपयोग करें।',
    mr: 'या ब्राउझरमध्ये व्हॉईस इनपुट समर्थित नाही. कृपया Google Chrome वापरा.'
  },
  'default': {
    en: 'An error occurred during voice recognition. Please try again.',
    hi: 'ध्वनि पहचान में त्रुटि हुई। कृपया पुनः प्रयास करें।',
    mr: 'आवाज ओळखताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
  }
}

/**
 * useSpeechRecognition Hook
 * 
 * Provides a production-ready reactive interface to the browser's Web Speech API
 * (window.SpeechRecognition || window.webkitSpeechRecognition) with live logs and robust lifecycle handling.
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
  const accumulatedFinalRef = useRef('')
  const sessionFinalRef = useRef('')

  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)
  const onEndRef = useRef(onEnd)

  // Keep callback refs synced to latest render props
  useEffect(() => {
    onResultRef.current = onResult
    onErrorRef.current = onError
    onEndRef.current = onEnd
  }, [onResult, onError, onEnd])

  // Check browser speech recognition support
  const isSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    langRef.current = defaultLang
  }, [defaultLang])

  // Cleanup on unmount
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
    reset = false,
    existingText = ''
  } = {}) => {
    console.log('[Voice] Button clicked')

    if (!isSupported) {
      console.warn('[Voice] SpeechRecognition unsupported in this browser')
      const msg = getErrorMessage('unsupported', lang)
      setError(msg)
      setErrorCode('unsupported')
      if (onErrorRef.current) onErrorRef.current({ error: 'unsupported', message: msg })
      return
    }

    if (reset) {
      accumulatedFinalRef.current = existingText ? existingText.trim() : ''
      sessionFinalRef.current = ''
      setTranscript(accumulatedFinalRef.current)
      setInterimTranscript('')
    } else if (existingText && !accumulatedFinalRef.current) {
      accumulatedFinalRef.current = existingText.trim()
    }

    setError(null)
    setErrorCode(null)
    shouldListenRef.current = true

    // Clean up existing instance if any
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
    console.log('[Voice] Recognition initialized')

    const resolvedLocale = LOCALE_MAP[lang] || (lang.includes('-') ? lang : `${lang}-IN`)
    recognition.lang = resolvedLocale
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log('[Voice] Recognition started')
      setIsListening(true)
      setError(null)
      setErrorCode(null)
    }

    recognition.onaudiostart = () => {
      console.log('[Voice] Audio capture started')
    }

    recognition.onspeechstart = () => {
      console.log('[Voice] Speech detected')
    }

    recognition.onresult = (event) => {
      console.log('[Voice] Result received', event)
      let currentSessionFinal = ''
      let currentInterim = ''

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i]
        const text = item[0]?.transcript || ''
        if (item.isFinal) {
          currentSessionFinal += text + ' '
        } else {
          currentInterim += text
        }
      }

      sessionFinalRef.current = currentSessionFinal.trim()

      if (currentInterim) {
        console.log('[Voice] Interim transcript:', currentInterim)
      }

      const baseAccumulated = accumulatedFinalRef.current ? accumulatedFinalRef.current.trim() : ''
      const sessionPart = sessionFinalRef.current ? sessionFinalRef.current.trim() : ''
      
      let totalFinal = baseAccumulated
      if (sessionPart) {
        totalFinal = baseAccumulated ? `${baseAccumulated} ${sessionPart}` : sessionPart
      }

      if (sessionPart) {
        console.log('[Voice] Final transcript:', totalFinal)
      }

      const fullLive = (totalFinal ? `${totalFinal} ${currentInterim}` : currentInterim).trim()

      setTranscript(totalFinal)
      setInterimTranscript(currentInterim)

      if (onResultRef.current) {
        onResultRef.current({
          transcript: totalFinal,
          interimTranscript: currentInterim,
          fullTranscript: fullLive,
          isFinal: Boolean(sessionPart && !currentInterim)
        })
      }
    }

    recognition.onerror = (event) => {
      const code = event.error
      console.warn('[Voice] Recognition error:', code, event)

      if (code === 'no-speech') {
        // Pausing while speaking is normal; do not terminate unless stopped
        return
      }

      if (code === 'aborted') {
        // Clean user stop
        return
      }

      setErrorCode(code)
      const msg = getErrorMessage(code, lang)
      setError(msg)
      setIsListening(false)
      shouldListenRef.current = false

      if (onErrorRef.current) onErrorRef.current({ error: code, message: msg, event })
    }

    recognition.onend = () => {
      console.log('[Voice] Recognition ended')

      // Consolidate finalized session text into accumulated ref
      if (sessionFinalRef.current) {
        const base = accumulatedFinalRef.current ? accumulatedFinalRef.current.trim() : ''
        accumulatedFinalRef.current = base ? `${base} ${sessionFinalRef.current}` : sessionFinalRef.current
        sessionFinalRef.current = ''
      }
      setInterimTranscript('')

      // Auto-restart if continuous mode is expected and user has not clicked stop
      if (shouldListenRef.current && continuous) {
        try {
          recognition.start()
          console.log('[Voice] Recognition auto-restarted for continuous listening')
          return
        } catch (err) {
          console.warn('[Voice] Failed to restart recognition:', err)
        }
      }

      setIsListening(false)
      shouldListenRef.current = false
      if (onEndRef.current) onEndRef.current()
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
    } catch (err) {
      console.error('[Voice] Failed to start speech recognition:', err)
      setIsListening(false)
      shouldListenRef.current = false
      const msg = getErrorMessage('audio-capture', lang)
      setError(msg)
      setErrorCode('audio-capture')
      if (onErrorRef.current) onErrorRef.current({ error: 'audio-capture', message: msg, originalError: err })
    }
  }, [isSupported, continuous, interimResults, getErrorMessage])

  const stopListening = useCallback(() => {
    console.log('[Voice] Stop requested by user')
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

  const resetTranscript = useCallback((initialValue = '') => {
    accumulatedFinalRef.current = initialValue ? initialValue.trim() : ''
    sessionFinalRef.current = ''
    setTranscript(accumulatedFinalRef.current)
    setInterimTranscript('')
    setError(null)
    setErrorCode(null)
  }, [])

  const fullTranscript = (transcript ? (transcript + (interimTranscript ? ' ' + interimTranscript : '')) : interimTranscript).trim()

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
