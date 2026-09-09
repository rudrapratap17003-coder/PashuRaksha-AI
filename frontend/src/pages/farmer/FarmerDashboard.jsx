import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PawPrint,
  FilePlus2,
  Syringe,
  AlertTriangle,
  Mic,
  Plus,
  ChevronRight,
  Phone,
  Calculator,
  ShieldCheck,
  Activity,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import VoiceReportModal from '../../components/common/VoiceReportModal'
import WeatherWidget from '../../components/common/WeatherWidget'
import EconomicLossCalculator from '../../components/farmer/EconomicLossCalculator'
import EmergencyPanicModal from '../../components/common/EmergencyPanicModal'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateFeedback'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useScenario } from '../../context/ScenarioContext'

export default function FarmerDashboard() {
  const { user } = useAuth()
  const { scenarioData, currentScenario } = useScenario()
  const [animals, setAnimals] = useState([])
  const [alerts, setAlerts] = useState([])
  const [recentReports, setRecentReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [lossCalcOpen, setLossCalcOpen] = useState(false)
  const [panicModalOpen, setPanicModalOpen] = useState(false)
  const [language, setLanguage] = useState('mr') // 'mr' | 'hi' | 'en'

  const fetchFarmerData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [animRes, alertRes, repRes] = await Promise.all([
        apiClient.get('/animals'),
        apiClient.get('/alerts?role=farmer'),
        apiClient.get('/health-reports?limit=5')
      ])
      setAnimals(animRes.data || [])
      setAlerts(alertRes.data || [])
      setRecentReports(repRes.data || [])
    } catch (err) {
      console.error('Farmer data fetch failed:', err)
      setError(err.response?.data?.detail || err.message || 'Unable to connect to live livestock registry.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFarmerData()
  }, [])

  const farmerDisplayName = user?.name || 'Farmer'
  const farmerLocation = `${user?.village || 'Baramati'}, ${user?.district || 'Pune'}`

  const translations = {
    mr: {
      heroTitle: 'आज आपले जनावर कसे आहे?',
      heroSub: 'पशुरक्षा AI — जनावरांचे आरोग्य रक्षक',
      villageBadge: farmerLocation,
      actions: {
        report: 'आजारी जनावर नोंदवा',
        reportSub: 'ताप, लाळ, फोड, दूध घट',
        myAnimals: 'माझी जनावरे',
        myAnimalsSub: 'नोंदणीकृत जनावरे पहा',
        vaccine: 'लसीकरण स्थिती',
        vaccineSub: 'बाकी व पूर्ण लसी',
        speak: 'बोलून सांगा',
        speakSub: 'व्हॉईस रिपोर्टिंग',
        emergency: 'आपत्कालीन SOS (1962)',
        emergencySub: 'तातडीची रुग्णवाहिका'
      },
      sections: {
        herdHealth: 'माझ्या गोठ्यातील आरोग्य स्थिती',
        vaccinesDue: 'लसीकरण बाकी असणारी जनावरे',
        recentReports: 'मागील आरोग्य तक्रारी',
        alerts: 'महत्त्वाचे गावपातळीवरील इशारे'
      }
    },
    hi: {
      heroTitle: 'आज आपका पशु कैसा है?',
      heroSub: 'पशुरक्षा AI — पशु स्वास्थ्य सुरक्षा',
      villageBadge: farmerLocation,
      actions: {
        report: 'बीमार पशु दर्ज करें',
        reportSub: 'बुखार, लार, छाले, दूध कम',
        myAnimals: 'मेरे पशु',
        myAnimalsSub: 'पंजीकृत पशु देखें',
        vaccine: 'टीकाकरण स्थिति',
        vaccineSub: 'लंबित व पूर्ण टीके',
        speak: 'बोलकर बताएं',
        speakSub: 'वॉइस रिपोर्टिंग',
        emergency: 'आपातकालीन SOS (1962)',
        emergencySub: 'तत्काल एम्बुलेंस'
      },
      sections: {
        herdHealth: 'मेरे पशुओं की स्वास्थ्य स्थिति',
        vaccinesDue: 'टीकाकरण बाकी पशु',
        recentReports: 'हालिया स्वास्थ्य रिपोर्ट',
        alerts: 'महत्वपूर्ण चेतावनी'
      }
    },
    en: {
      heroTitle: 'How is your animal today?',
      heroSub: 'PashuRaksha AI — Livestock Health Guard',
      villageBadge: farmerLocation,
      actions: {
        report: 'Report Sick Animal',
        reportSub: 'Fever, salivation, blisters, milk drop',
        myAnimals: 'My Animals',
        myAnimalsSub: 'View registered livestock',
        vaccine: 'Vaccination',
        vaccineSub: 'Due & administered boosters',
        speak: 'Speak Report',
        speakSub: 'Multilingual voice intake',
        emergency: 'Emergency SOS (1962)',
        emergencySub: 'Mobile Veterinary Unit'
      },
      sections: {
        herdHealth: 'My Herd Health',
        vaccinesDue: 'Vaccinations Due',
        recentReports: 'Recent Reports',
        alerts: 'Important Alerts'
      }
    }
  }

  const t = translations[language] || translations.mr

  // Computed Herd Health stats
  const totalAnimals = animals.length
  const highRiskAnimals = animals.filter(a => a.current_risk_level === 'HIGH' || a.current_risk_level === 'CRITICAL').length
  const dueVaccineAnimals = animals.filter(a => a.vaccination_status?.toLowerCase().includes('due') || a.vaccination_status?.toLowerCase().includes('overdue'))

  return (
    <div className="space-y-6 pb-12 text-slate-800 font-sans">
      
      {/* Top Mobile-First Hero Greeting */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              {farmerDisplayName}
            </span>
            <span className="bg-slate-900 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
              📍 {t.villageBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-300/90 font-medium">
            {t.heroSub}
          </p>
        </div>

        {/* Language Switcher — Touch Friendly */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 z-10 self-stretch sm:self-auto justify-center">
          {[
            { code: 'mr', label: 'मराठी' },
            { code: 'hi', label: 'हिंदी' },
            { code: 'en', label: 'English' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                language === lang.code
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 PRIMARY ACTIONS (Prominent, High-Contrast & Mobile-First) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 1. REPORT SICK ANIMAL */}
        <Link
          to="/farmer/report"
          className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-950 flex flex-col justify-between space-y-3 transition transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <FilePlus2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg leading-tight">{t.actions.report}</h3>
            <p className="text-[11px] text-emerald-100 mt-1 leading-snug">{t.actions.reportSub}</p>
          </div>
        </Link>

        {/* 2. MY ANIMALS */}
        <Link
          to="/farmer/animals"
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 text-slate-800 shadow-sm flex flex-col justify-between space-y-3 transition transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">{t.actions.myAnimals}</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t.actions.myAnimalsSub}</p>
          </div>
        </Link>

        {/* 3. VACCINATION */}
        <Link
          to="/farmer/animals"
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 text-slate-800 shadow-sm flex flex-col justify-between space-y-3 transition transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Syringe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">{t.actions.vaccine}</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t.actions.vaccineSub}</p>
          </div>
        </Link>

        {/* 4. SPEAK REPORT */}
        <button
          type="button"
          onClick={() => setVoiceModalOpen(true)}
          className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-300 text-slate-800 shadow-sm flex flex-col justify-between space-y-3 text-left transition transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">{t.actions.speak}</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t.actions.speakSub}</p>
          </div>
        </button>

        {/* 5. EMERGENCY SOS */}
        <button
          type="button"
          onClick={() => setPanicModalOpen(true)}
          className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-lg shadow-rose-950 flex flex-col justify-between space-y-3 text-left transition transform hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base leading-tight">{t.actions.emergency}</h3>
            <p className="text-[11px] text-rose-100 mt-1 leading-snug">{t.actions.emergencySub}</p>
          </div>
        </button>

      </div>

      {/* Main Grid: Left Column (Herd Health & Recent Reports), Right Column (Vaccines Due & Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION: My Herd Health */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-extrabold text-slate-900">{t.sections.herdHealth}</h2>
              </div>
              <Link to="/farmer/animals/add">
                <Button size="sm" icon={Plus} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs">
                  Add Cattle
                </Button>
              </Link>
            </div>

            {/* Quick KPI Counters */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Total Herd</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 block mt-0.5">{totalAnimals}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Healthy</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 block mt-0.5">{Math.max(0, totalAnimals - highRiskAnimals)}</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-bold text-rose-700 uppercase">Risk / Sick</span>
                <span className="text-xl sm:text-2xl font-black text-rose-700 block mt-0.5">{highRiskAnimals}</span>
              </div>
            </div>

            {/* Animal Cards List */}
            {loading ? (
              <LoadingState message="Loading your registered livestock..." />
            ) : error ? (
              <ErrorState error={error} onRetry={fetchFarmerData} />
            ) : animals.length === 0 ? (
              <EmptyState
                title="No Livestock Registered"
                message="No animals are registered under your farmer account yet."
                actionText="Add Cattle"
                onAction={() => window.location.href = '/farmer/animals/add'}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {animals.map((animal) => (
                  <Link
                    key={animal.id}
                    to={`/farmer/animals/${animal.animal_id}`}
                    className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-3.5 shadow-xs transition block space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm block">{animal.animal_id}</span>
                        <span className="text-xs text-slate-500">{animal.breed || 'Gir'} • {animal.species}</span>
                      </div>
                      <RiskBadge level={animal.current_risk_level} score={animal.current_risk_score} />
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Syringe className="w-3.5 h-3.5 text-purple-600" />
                        <span>{animal.vaccination_status || 'Up to date'}</span>
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* SECTION: Recent Reports */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-sky-600" />
                <h2 className="text-base font-extrabold text-slate-900">{t.sections.recentReports}</h2>
              </div>
              <Link to="/farmer/report" className="text-xs font-bold text-sky-600 hover:text-sky-700">
                New Report →
              </Link>
            </div>

            {recentReports.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No recent symptom reports lodged.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {recentReports.slice(0, 4).map((rep) => (
                  <div key={rep.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-slate-900">{rep.animal_id}</strong>
                        <span className="text-slate-500">• {rep.possible_disease_concern || 'Under Review'}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {rep.village || 'Baramati'} • {new Date(rep.reported_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <RiskBadge level={rep.risk_level} score={rep.risk_score} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 5 Columns */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Weather & Field Telemetry */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <WeatherWidget district={user?.district || 'Pune'} village={user?.village || 'Baramati'} />
          </div>

          {/* SECTION: Vaccinations Due */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Syringe className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-extrabold text-slate-900">{t.sections.vaccinesDue}</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
                {dueVaccineAnimals.length} Due
              </span>
            </div>

            {dueVaccineAnimals.length === 0 ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>All registered herd cattle have completed scheduled vaccinations.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {dueVaccineAnimals.map((anim) => (
                  <div key={anim.id} className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-purple-950 block">{anim.animal_id} ({anim.species})</strong>
                      <span className="text-[11px] text-purple-700">{anim.vaccination_status}</span>
                    </div>
                    <Link
                      to="/farmer/report"
                      className="px-2.5 py-1 rounded-xl bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-700 transition"
                    >
                      Book Camp
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION: Important Alerts */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-extrabold text-slate-900">{t.sections.alerts}</h2>
              </div>
              <span className="text-[11px] text-slate-400">Baramati Block</span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: 'Baramati FMD Surveillance Hotspot',
                  msg: 'Oral vesicles reported in nearby village. Isolate any cattle showing drooling or foot sores immediately.',
                  level: 'HIGH',
                  icon: '🔴',
                  date: 'Today'
                },
                {
                  title: 'Taluka Free Vaccination Camp',
                  msg: 'FMD + HS booster drive starts this Monday at Baramati Polyclinic.',
                  level: 'INFO',
                  icon: '🟢',
                  date: 'Yesterday'
                }
              ].map((al, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border space-y-1 ${
                    al.level === 'HIGH' ? 'bg-rose-50/80 border-rose-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{al.icon}</span>
                      <span>{al.title}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{al.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{al.msg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Economic Loss Calculator Trigger */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900">Milk Loss Compensation</h3>
              <p className="text-[11px] text-slate-600">Calculate economic loss for compensation relief.</p>
            </div>
            <button
              onClick={() => setLossCalcOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center space-x-1"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculate</span>
            </button>
          </div>

        </div>

      </div>

      {/* Modals */}
      <VoiceReportModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        availableAnimals={animals}
        defaultAnimalId={animals[0]?.animal_id || ''}
        onSuccess={() => fetchFarmerData()}
      />
      <EconomicLossCalculator
        isOpen={lossCalcOpen}
        onClose={() => setLossCalcOpen(false)}
      />
      <EmergencyPanicModal
        isOpen={panicModalOpen}
        onClose={() => setPanicModalOpen(false)}
      />
    </div>
  )
}

