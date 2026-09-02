import React, { useState } from 'react'
import {
  Send,
  X,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  MessageSquare,
  Sparkles,
  Users,
  MapPin,
  RefreshCw
} from 'lucide-react'

const BROADCAST_TEMPLATES = {
  mr: {
    outbreak: "🚨 [सतर्कता संदेश] पशुसंवर्धन विभाग, महाराष्ट्र शासन: बारामती तालुक्यात लाळ-खुरकूत (FMD) चा प्रादुर्भाव आढळला आहे. आपल्या जनावरांमध्ये लाळ गळणे, तोंडात किंवा खुरांमध्ये फोड दिसल्यास त्वरित 1962 वर संपर्क साधा किंवा नजीकच्या पशुवैद्यकीय दवाखान्यात नोंद करा. आजच जनावरे वेगळी ठेवा.",
    vaccination: "💉 [लसीकरण मोहीम] बारामती व शिरूर परिसरातील सर्व पशुपालकांना सूचित करण्यात येते की 5 किमी परिसरासाठी मोफत रिंग व्हॅक्सिनेशन पथक आपल्या गावात येत आहे. कृपया सर्व गाई-म्हशींना लस टोचून सहकार्य करा. - जिल्हा पशुसंवर्धन अधिकारी.",
    biosecurity: "🛡️ [जैवसुरक्षा सूचना] जनावरांच्या गोठ्यात दररोज 4% धुण्याच्या सोड्याचे द्रावण फवारा. इतर गावांतून जनावरांची खरेदी-विक्री 14 दिवस बंद ठेवावी."
  },
  en: {
    outbreak: "🚨 [CRITICAL ALERT] Dept of Animal Husbandry, Govt of Maharashtra: FMD outbreak detected in Baramati block. If your livestock shows salivation, mouth ulcers, or lameness, immediately report via Pashuraksha AI or call 1962. Isolate cattle immediately.",
    vaccination: "💉 [RING VACCINATION DRIVE] Mobile veterinary units are conducting emergency FMD & LSD vaccination across 5km containment radius today. Keep livestock available at farm shed. Free government drive.",
    biosecurity: "🛡️ [BIOSECURITY NOTICE] Disinfect shed entryways with 4% sodium carbonate. Halt livestock trade in local weekly bazaars for next 14 days."
  },
  hi: {
    outbreak: "🚨 [सतर्कता चेतावनी] पशुपालन विभाग, महाराष्ट्र शासन: बारामती क्षेत्र में खुरपका-मुंहपका (FMD) का प्रकोप देखा गया है। यदि पशु में लार या छाले दिखें, तो तुरंत 1962 पर कॉल करें या अलग रखें।",
    vaccination: "💉 [टीकाकरण अभियान] बारामती में 5 किमी दायरे में आपातकालीन रिंग टीकाकरण वैन पहुंच रही हैं। अपने सभी मवेशियों का अनिवार्य टीकाकरण कराएं।",
    biosecurity: "🛡️ [जैव-सुरक्षा निर्देश] बाड़ों में कीटाणुनाशक का छिड़काव करें और 14 दिनों तक पशुओं की आवाजाही रोकें।"
  }
}

export default function BroadcastModal({ isOpen, onClose }) {
  const [lang, setLang] = useState('mr')
  const [templateType, setTemplateType] = useState('outbreak')
  const [channel, setChannel] = useState('both') // whatsapp | sms | both
  const [targetZone, setTargetZone] = useState('5km')
  const [customText, setCustomText] = useState(BROADCAST_TEMPLATES.mr.outbreak)
  const [sending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [stats, setStats] = useState({ totalRecipients: 4850, delivered: 4850 })

  const handleTemplateChange = (newType, newLang = lang) => {
    setTemplateType(newType)
    const text = BROADCAST_TEMPLATES[newLang]?.[newType] || BROADCAST_TEMPLATES.en[newType]
    setCustomText(text)
  }

  const handleLangChange = (newLang) => {
    setLang(newLang)
    handleTemplateChange(templateType, newLang)
  }

  const handleDispatch = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSentSuccess(true)
    }, 1200)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Emergency Multilingual Broadcast Dispatcher
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  SMS / WhatsApp Gateway
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Instantly broadcast biosecurity warnings & ring vaccination schedules to thousands of registered farmers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {sentSuccess ? (
            <div className="p-8 text-center space-y-4 bg-slate-950 rounded-3xl border border-emerald-500/40">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Broadcast Dispatched Successfully!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Message broadcast delivered to <strong className="text-emerald-400 font-bold">{stats.totalRecipients.toLocaleString()} registered farmers</strong> across the {targetZone} containment zone.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setSentSuccess(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
                >
                  Send Another Broadcast
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Form Controls */}
              <div className="md:col-span-7 space-y-4">
                {/* Channel & Target Radius */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Geofence</label>
                    <select
                      value={targetZone}
                      onChange={(e) => setTargetZone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="5km">5 km Active Hotspot (Baramati)</option>
                      <option value="10km">10 km Ring Containment (Baramati + Indapur)</option>
                      <option value="Taluka">Entire Taluka (All Registered Sheds)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Broadcast Language</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-700">
                      {[
                        { code: 'mr', label: 'मराठी' },
                        { code: 'hi', label: 'हिंदी' },
                        { code: 'en', label: 'EN' }
                      ].map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => handleLangChange(l.code)}
                          className={`py-1 text-xs font-bold rounded-lg transition ${
                            lang === l.code ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Templates */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Select Official Template</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'outbreak', label: 'Outbreak Alert' },
                      { id: 'vaccination', label: 'Vaccination Drive' },
                      { id: 'biosecurity', label: 'Biosecurity Order' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleTemplateChange(t.id)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition ${
                          templateType === t.id
                            ? 'bg-purple-950/80 border-purple-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Message Body (Editable)</label>
                  <textarea
                    rows="5"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Mobile Preview */}
              <div className="md:col-span-5 bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Farmer Phone Mockup (WhatsApp)</span>
                </span>

                {/* Phone Shell */}
                <div className="bg-[#0b141a] rounded-2xl p-3 border border-slate-800 shadow-inner space-y-2 text-xs">
                  {/* WA Header */}
                  <div className="bg-[#1f2c34] p-2 rounded-xl flex items-center justify-between text-[11px] text-slate-200 font-bold">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold">
                        MH
                      </div>
                      <span>Maha-Pashuraksha AI 🟢</span>
                    </div>
                    <span className="text-[9px] text-slate-400">Verified</span>
                  </div>

                  {/* Bubble */}
                  <div className="bg-[#005c4b] p-3 rounded-2xl text-white space-y-1 text-[11px] leading-relaxed shadow-sm">
                    <p>{customText}</p>
                    <span className="text-[9px] text-emerald-200 text-right block">Just now ✓✓</span>
                  </div>
                </div>

                {/* Target Audience Summary */}
                <div className="p-3 bg-purple-950/40 border border-purple-500/20 rounded-2xl text-[11px] text-purple-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Estimated Reach:</span>
                    <strong className="text-white">~4,850 Farmers</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Channels:</span>
                    <strong className="text-emerald-300">WhatsApp &amp; High-Priority SMS</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!sentSuccess && (
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Approved by Maharashtra State Animal Husbandry Emergency Response System
            </span>
            <div className="flex items-center space-x-3">
              <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition">
                Cancel
              </button>
              <button
                onClick={handleDispatch}
                disabled={sending}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-950"
              >
                {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send Emergency Broadcast</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
