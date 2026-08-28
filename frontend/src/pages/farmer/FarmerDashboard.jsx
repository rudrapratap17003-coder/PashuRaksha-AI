import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  PawPrint, 
  FilePlus2, 
  Syringe, 
  AlertTriangle, 
  ShieldCheck, 
  Mic, 
  Plus, 
  ChevronRight, 
  Activity, 
  Clock, 
  MapPin, 
  Phone,
  Radio,
  Sparkles,
  Volume2
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import VoiceReportModal from '../../components/common/VoiceReportModal'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useScenario } from '../../context/ScenarioContext'

export default function FarmerDashboard() {
  const { user } = useAuth()
  const { scenarioData, currentScenario } = useScenario()
  const [animals, setAnimals] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [language, setLanguage] = useState('hi')

  const fetchFarmerData = async () => {
    setLoading(true)
    try {
      const [animRes, alertRes] = await Promise.allSettled([
        apiClient.get('/animals'),
        apiClient.get('/alerts?role=farmer'),
      ])
      if (animRes.status === 'fulfilled') setAnimals(animRes.value.data)
      if (alertRes.status === 'fulfilled') setAlerts(alertRes.value.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFarmerData()
  }, [])

  const isCritical = currentScenario === 'RAMPUR_OUTBREAK'

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Bar with Language Switcher */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#092923] to-[#061B17] border border-emerald-500/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              Farmer Mobile Portal • किसान पोर्टल
            </span>
            <Badge variant="primary" size="sm">Rampur Village</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {language === 'hi' ? 'नमस्ते, रमेश कुमार जी' : 'Welcome, Ramesh Kumar'}
          </h1>
          <p className="text-xs text-slate-300">
            {language === 'hi' ? 'आपके 5 पशु निगरानी नेटवर्क से जुड़े हैं' : '5 livestock actively protected under AI health surveillance'}
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-[#061B17] p-1.5 rounded-2xl border border-emerald-500/20 text-xs">
          <span className="text-[10px] text-slate-400 font-bold px-2">भाषा:</span>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-xl font-bold transition ${
              language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-xl font-bold transition ${
              language === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('kn')}
            className={`px-2.5 py-1 rounded-xl font-bold transition ${
              language === 'kn' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>
      </div>

      {/* HUGE Big-Button Rural Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Report Symptoms Primary Action */}
        <Link to="/farmer/report" className="col-span-2 sm:col-span-2">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/30 hover:scale-[1.02] transition flex items-center justify-between cursor-pointer border border-emerald-400/40">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-100">
                Primary Action • मुख्य कार्य
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                {language === 'hi' ? '🩺 बीमारी की सूचना दें' : '🩺 Report Animal Symptoms'}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                {language === 'hi' ? 'तुरंत एआई स्वास्थ्य विश्लेषण और सलाह प्राप्त करें' : 'Instant AI risk assessment & isolation guidance'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <FilePlus2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>

        {/* 2. Voice Report Action */}
        <div
          onClick={() => setVoiceModalOpen(true)}
          className="p-5 rounded-3xl bg-[#092923] border border-emerald-500/40 text-white hover:bg-emerald-950/80 transition flex flex-col justify-between cursor-pointer shadow-lg hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Voice AI</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="font-black text-sm text-white">
              {language === 'hi' ? '🎙 बोलकर बताएं' : '🎙 Voice Report'}
            </h4>
            <span className="text-[11px] text-slate-300 font-medium">
              {language === 'hi' ? 'हिंदी / इंग्लिश आवाज पहचान' : 'Dialect Voice Intake'}
            </span>
          </div>
        </div>

        {/* 3. My Animals */}
        <Link
          to="/farmer/animals"
          className="p-5 rounded-3xl bg-[#092923] border border-emerald-500/40 text-white hover:bg-emerald-950/80 transition flex flex-col justify-between cursor-pointer shadow-lg hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Digital Records</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PawPrint className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="font-black text-sm text-white">
              {language === 'hi' ? '🐄 मेरे पशु (' + animals.length + ')' : '🐄 My Animals (' + animals.length + ')'}
            </h4>
            <span className="text-[11px] text-slate-300 font-medium">Digital Passports</span>
          </div>
        </Link>
      </div>

      {/* Outbreak Advisory Warning Banner when Outbreak is Active */}
      {isCritical && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950 to-[#092923] border border-rose-500/50 text-white shadow-xl flex items-start space-x-3.5 animate-pulse">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 font-black">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-rose-200">
                {language === 'hi' ? '⚠️ रामपुरा में पशु रोग का अलर्ट!' : '⚠️ Active Disease Outbreak Alert in Rampur!'}
              </h4>
              <Badge variant="danger" size="sm">CRITICAL</Badge>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {language === 'hi' 
                ? 'आपके गाँव में खुरपका-मुंहपका (FMD) के 13 मामले मिले हैं। कृपया अपने पशुओं को अलग रखें और तुरंत जाँच करें।' 
                : '13 cases of acute vesicular disease detected nearby. Check animal mouths for lesions and isolate symptomatic cattle immediately.'}
            </p>
          </div>
        </div>
      )}

      {/* Livestock Overview Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <PawPrint className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'पशु डिजिटल पासपोर्ट' : 'Livestock Digital Passports'}</span>
          </h2>
          <Link to="/farmer/animals/add">
            <Button size="sm" icon={Plus} className="font-bold bg-emerald-500 text-slate-950">
              Add Animal
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {animals.map((anim) => (
            <Card key={anim.id} hover className="bg-[#092923] border border-emerald-500/30 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    {anim.animal_id}
                  </span>
                  <h4 className="font-black text-sm text-white">{anim.species}</h4>
                  <span className="text-xs text-slate-300">{anim.breed || 'Gir'} • {anim.age} yrs</span>
                </div>
                <RiskBadge level={anim.health_status === 'critical' ? 'CRITICAL' : 'LOW'} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20 text-xs text-slate-300">
                <span>Milk: <strong>{anim.milk_production || 12} L/day</strong></span>
                <Link to={`/farmer/animals/${anim.animal_id}`} className="text-emerald-400 font-bold flex items-center">
                  <span>Passport</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Voice Reporting Modal */}
      <VoiceReportModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSymptomsDetected={(symptoms) => {
          // Handled via redirection or state
        }}
      />

    </div>
  )
}
