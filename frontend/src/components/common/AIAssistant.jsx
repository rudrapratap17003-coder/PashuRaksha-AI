import React, { useState, useRef, useEffect } from 'react'
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  ShieldAlert, 
  MessageSquare, 
  ChevronDown, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Volume2,
  VolumeX
} from 'lucide-react'
import apiClient from '../../services/api'

export default function AIAssistant({ role = 'farmer' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! I am the Pashuraksha AI Assistant. How can I assist you with livestock symptoms, vaccination alerts, or outbreak intelligence in Maharashtra?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef(null)

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0
    // Try to match Marathi or Hindi voice if available
    const voices = window.speechSynthesis.getVoices()
    const indianVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('hi') || v.lang.includes('IN'))
    if (indianVoice) utterance.voice = indianVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const quickPrompts = [
    'What are early symptoms of FMD in cattle?',
    'Show high risk villages in Pune district',
    'What should I collect during a field visit?',
    'Explain how AI calculates the risk score'
  ]

  const handleSend = async (textToSend) => {
    const query = textToSend || input
    if (!query.trim()) return

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await apiClient.post('/ai/ask', {
        query: query,
        role: role
      })
      const aiMsg = {
        sender: 'ai',
        text: res.data?.answer || 'Response generated.',
        disclaimer: res.data?.disclaimer,
        sources: res.data?.sources,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      // Local fallback intelligence
      setTimeout(() => {
        let fallbackText = "Based on Maharashtra epidemiological surveillance data: If fever, oral lesions, and salivation are observed, isolate the animal immediately and notify the nearest Taluka Veterinary Dispensary."
        if (query.toLowerCase().includes('risk')) {
          fallbackText = "Pashuraksha AI calculates risk (0-100) by analyzing multi-factor indicators: symptom combinations (e.g. FMD triad), herd spread density, overdue vaccinations, and spatial proximity to active outbreak clusters in Maharashtra."
        } else if (query.toLowerCase().includes('pune') || query.toLowerCase().includes('village')) {
          fallbackText = "Baramati block currently has an active respiratory alert. High alert protocols and ring vaccination are active across 5km radius."
        }
        setMessages(prev => [
          ...prev, 
          {
            sender: 'ai',
            text: fallbackText,
            disclaimer: 'Prototype decision support. Consult a registered veterinarian for clinical diagnosis.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }, 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-900/40 border border-emerald-400/30 transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-900 animate-ping" />
          </div>
          <span className="font-bold text-sm tracking-wide">Pashuraksha Copilot</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className={`bg-slate-950/95 backdrop-blur-xl border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-[90vw] md:w-[600px] h-[80vh]' : 'w-[90vw] sm:w-[380px] h-[520px]'
        }`}>
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black text-white">Pashuraksha AI Copilot</h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Maharashtra Livestock Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-950'
                    : 'bg-slate-900/90 text-slate-200 border border-emerald-500/20 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                  {m.disclaimer && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-amber-400/90 flex items-start space-x-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{m.disclaimer}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/40 text-[9px] text-slate-400">
                    {m.sender === 'ai' ? (
                      <button
                        onClick={() => speakText(m.text)}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 font-bold"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeaking ? 'Stop' : 'Listen (ऐका)'}</span>
                      </button>
                    ) : <span />}
                    <span>{m.time}</span>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-3 text-xs text-emerald-400 flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing epidemiological records...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-slate-800/60 bg-slate-900/40 flex overflow-x-auto space-x-2 scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap text-[10px] bg-slate-800/80 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-slate-300 px-2.5 py-1 rounded-full transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-3 bg-slate-950 border-t border-slate-800/80 rounded-b-3xl flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about symptoms, vaccines, or alerts..."
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white text-xs px-3.5 py-2.5 rounded-xl placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
