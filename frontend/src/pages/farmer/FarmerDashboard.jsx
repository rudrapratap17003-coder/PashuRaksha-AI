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
  Calculator
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import VoiceReportModal from '../../components/common/VoiceReportModal'
import WeatherWidget from '../../components/common/WeatherWidget'
import EconomicLossCalculator from '../../components/farmer/EconomicLossCalculator'
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
  const [lossCalcOpen, setLossCalcOpen] = useState(false)
  const [language, setLanguage] = useState('mr')

  const fetchFarmerData = async () => {
    setLoading(true)
    try {
      const [animRes, alertRes] = await Promise.allSettled([
        apiClient.get('/animals'),
        apiClient.get('/alerts?role=farmer'),
      ])
      if (animRes.status === 'fulfilled') setAnimals(animRes.value.data)
      if (alertRes.status === 'fulfilled') setAlerts(alertRes.value.data)
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFarmerData()
  }, [])

  const translations = {
    mr: {
      welcome: 'नमस्कार, रमेश पाटील',
      sub: 'आपली जनावरे AI निगराणी अंतर्गत सुरक्षित आहेत',
      villageBadge: 'बारामती, पुणे',
      reportBtn: 'लक्षणे नोंदवा',
      voiceBtn: 'बोलून सांगा',
      addAnimal: 'नवीन जनावर जोडा',
      livestockHeader: 'माझी जनावरे',
      alertsHeader: 'इशारे',
      vaccineDue: 'लसीकरण बाकी',
      statusNormal: 'आरोग्य उत्तम',
      lossTitle: 'दूध नुकसान मोजा',
      lossSub: 'आजारी जनावरांमुळे होणारे नुकसान मोजा व शासकीय भरपाईसाठी अर्ज करा.',
      lossBtn: 'नुकसान मोजा →'
    },
    hi: {
      welcome: 'नमस्ते, रमेश पाटिल',
      sub: 'आपके पशु AI निगरानी के तहत सुरक्षित हैं',
      villageBadge: 'बारामती, पुणे',
      reportBtn: 'लक्षण दर्ज करें',
      voiceBtn: 'बोलकर बताएं',
      addAnimal: 'नया पशु जोड़ें',
      livestockHeader: 'मेरे पशु',
      alertsHeader: 'चेतावनी',
      vaccineDue: 'टीकाकरण बाकी',
      statusNormal: 'स्वास्थ्य सामान्य',
      lossTitle: 'दूध नुकसान गणना',
      lossSub: 'बीमार पशुओं से होने वाले नुकसान की गणना करें और सरकारी भरपाई के लिए आवेदन करें।',
      lossBtn: 'नुकसान मोजा →'
    },
    en: {
      welcome: 'Welcome, Ramesh Patil',
      sub: 'Your animals are protected under AI health monitoring',
      villageBadge: 'Baramati, Pune',
      reportBtn: 'Report Symptoms',
      voiceBtn: 'Speak to Report',
      addAnimal: 'Add Animal',
      livestockHeader: 'My Animals',
      alertsHeader: 'Alerts',
      vaccineDue: 'Vaccine Due',
      statusNormal: 'Healthy',
      lossTitle: 'Calculate Milk Loss',
      lossSub: 'Calculate loss from sick animals and apply for government compensation.',
      lossBtn: 'Calculate Loss →'
    }
  }

  const t = translations[language] || translations.mr

  return (
    <div className="space-y-5 pb-12 text-slate-800 font-sans">

      {/* Welcome Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Farmer Portal • शेतकरी कक्ष
            </span>
            <span className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              {t.villageBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.welcome}
          </h1>
          <p className="text-sm text-slate-500">{t.sub}</p>
        </div>

        {/* Language Selector — Big Buttons for Farmers */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { code: 'mr', label: 'मराठी' },
            { code: 'hi', label: 'हिंदी' },
            { code: 'en', label: 'English' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200 ${
                language === lang.code
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions — BIG Buttons for Less Educated Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Report Symptoms */}
        <Link
          to="/farmer/report"
          className="group p-5 rounded-2xl bg-sky-600 text-white shadow-md card-hover flex items-start space-x-4"
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <FilePlus2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{t.reportBtn}</h3>
            <p className="text-sm text-sky-100 mt-1">
              Fever, cough, blisters, milk drop
            </p>
          </div>
        </Link>

        {/* Voice Report */}
        <button
          onClick={() => setVoiceModalOpen(true)}
          className="group p-5 rounded-2xl bg-white border-2 border-amber-300 text-slate-800 shadow-sm card-hover flex items-start space-x-4 text-left"
        >
          <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{t.voiceBtn}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Marathi / Hindi / English
            </p>
          </div>
        </button>

        {/* Weather */}
        <div className="sm:col-span-2 lg:col-span-1">
          <WeatherWidget district="Pune" village="Baramati" />
        </div>
      </div>

      {/* Economic Loss Banner — Simple */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">{t.lossTitle}</h3>
          <p className="text-sm text-slate-600 mt-0.5">{t.lossSub}</p>
        </div>
        <button
          onClick={() => setLossCalcOpen(true)}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center space-x-2 flex-shrink-0 transition-colors duration-200"
        >
          <Calculator className="w-4 h-4" />
          <span>{t.lossBtn}</span>
        </button>
      </div>

      {/* Animals & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* My Animals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">{t.livestockHeader}</h2>
            <Link to="/farmer/animals/add">
              <Button size="sm" icon={Plus} className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors duration-200">
                {t.addAnimal}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(animals.length > 0 ? animals : [
              { id: 'anim-101', animal_id: 'COW-101', species: 'Cattle (Cow)', breed: 'Gir', current_risk_level: 'LOW', current_risk_score: 12.0, vaccination_status: 'Up to date' },
              { id: 'anim-102', animal_id: 'BUF-204', species: 'Buffalo', breed: 'Murrah', current_risk_level: 'HIGH', current_risk_score: 74.0, vaccination_status: 'Due soon' },
              { id: 'anim-103', animal_id: 'GOAT-305', species: 'Goat', breed: 'Sirohi', current_risk_level: 'LOW', current_risk_score: 8.0, vaccination_status: 'Up to date' },
              { id: 'anim-104', animal_id: 'COW-108', species: 'Cattle (Cow)', breed: 'Dangi', current_risk_level: 'LOW', current_risk_score: 15.0, vaccination_status: 'Up to date' },
            ]).map((animal) => (
              <Link
                key={animal.id}
                to={`/farmer/animals/${animal.animal_id}`}
                className="group bg-white border border-slate-200 hover:border-sky-400 rounded-2xl p-4 shadow-sm card-hover block space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                      <PawPrint className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm block">{animal.animal_id}</span>
                      <span className="text-xs text-slate-500">{animal.breed} • {animal.species}</span>
                    </div>
                  </div>
                  <RiskBadge level={animal.current_risk_level} score={animal.current_risk_score} />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center space-x-1.5">
                    <Syringe className="w-4 h-4 text-sky-600" />
                    <span>{animal.vaccination_status}</span>
                  </span>
                  <span className="text-sky-600 font-semibold flex items-center space-x-1">
                    <span>View</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">{t.alertsHeader}</h2>
          {[
            {
              title: 'Baramati Respiratory Watch',
              msg: 'Multiple cases reported. Isolate cattle showing nasal discharge.',
              level: 'CRITICAL',
              date: 'Today, 10:15 AM'
            },
            {
              title: 'Vaccination Drive',
              msg: 'HS + BQ booster drive starts next week at Taluka Veterinary Center.',
              level: 'MODERATE',
              date: 'Yesterday'
            }
          ].map((al, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{al.title}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  al.level === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {al.level}
                </span>
              </div>
              <p className="text-sm text-slate-600">{al.msg}</p>
              <span className="text-xs text-slate-400 block">{al.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <VoiceReportModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSuccess={() => fetchFarmerData()}
      />
      <EconomicLossCalculator
        isOpen={lossCalcOpen}
        onClose={() => setLossCalcOpen(false)}
      />
    </div>
  )
}
