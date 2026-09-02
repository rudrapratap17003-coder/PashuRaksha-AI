import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Activity, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Syringe, 
  Users, 
  Radio, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Sparkles,
  Stethoscope,
  Building2,
  Share2
} from 'lucide-react'
import PashuLogo from '../components/common/PashuLogo'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import RiskBadge from '../components/common/RiskBadge'
import OutbreakMap from '../components/map/OutbreakMap'
import LiveSurveillanceStrip from '../components/common/LiveSurveillanceStrip'
import SurveillanceBackground from '../components/background/SurveillanceBackground'
import { useScenario } from '../context/ScenarioContext'

export default function PresentationPage() {
  const { currentScenario, setScenario, scenarioData, scenarios } = useScenario()

  const isCritical = currentScenario === scenarios.RAMPUR_OUTBREAK

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative overflow-x-hidden">
      <SurveillanceBackground />

      {/* Presentation Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-sky-100 shadow-sm px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition flex items-center space-x-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <div className="flex items-center space-x-2.5">
              <PashuLogo size="sm" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black tracking-tight text-slate-900">
                    PASHURAKSHA <span className="text-sky-600">AI</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold">
                    JURY STAGE
                  </span>
                </div>
                <span className="block text-[10px] text-slate-500 font-medium">
                  Smart India Hackathon 2026 • PS ID: SIH26128
                </span>
              </div>
            </div>
          </div>

          {/* 1-Click Scenario Trigger for Judges */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setScenario(scenarios.BASELINE)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currentScenario === scenarios.BASELINE
                  ? 'bg-emerald-600 text-white font-black shadow-sm'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🟢 Baseline
            </button>
            <button
              onClick={() => setScenario(scenarios.RAMPUR_OUTBREAK)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currentScenario === scenarios.RAMPUR_OUTBREAK
                  ? 'bg-rose-600 text-white font-black animate-pulse shadow-sm'
                  : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
              }`}
            >
              🔴 Baramati Outbreak
            </button>
            <button
              onClick={() => setScenario(scenarios.CONTAINED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currentScenario === scenarios.CONTAINED
                  ? 'bg-sky-600 text-white font-black shadow-sm'
                  : 'bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100'
              }`}
            >
              🟡 Ring Contained
            </button>

            <Link
              to="/presentation/pitch"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-md shadow-sky-600/20 flex items-center space-x-1.5 transition ml-2"
            >
              <span>📺 Pitch Deck Slides</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Live Surveillance Bar */}
      <LiveSurveillanceStrip />

      {/* Main Presentation Command Grid */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6 relative z-10">
        
        {/* Scenario Overview Banner */}
        <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
          isCritical
            ? 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-200 text-rose-900'
            : 'bg-gradient-to-r from-sky-50 via-white to-blue-50 border-sky-100 text-slate-900'
        }`}>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-black uppercase text-sky-700">
                ACTIVE SIMULATION STATE:
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                isCritical ? 'bg-rose-600 text-white' : 'bg-sky-600 text-white'
              }`}>
                {scenarioData.tag}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900">{scenarioData.name}</h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{scenarioData.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/vet/dashboard"
              className="px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-sky-700 text-xs font-bold hover:bg-sky-50 transition flex items-center space-x-1 shadow-sm"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Vet Desk →</span>
            </Link>
            <Link
              to="/authority/dashboard"
              className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-50 transition flex items-center space-x-1 shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Authority →</span>
            </Link>
          </div>
        </div>

        {/* 6-Portal Quick Access for Judges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { to: '/farmer/dashboard', label: 'Farmer Portal', sublabel: 'Shed & Livestock', icon: '🐄' },
            { to: '/field-worker/dashboard', label: 'Pashu Sakhi', sublabel: 'Field Outreach', icon: '🚶' },
            { to: '/vet/dashboard', label: 'Vet Clinical', sublabel: 'Triage & Diagnosis', icon: '🩺' },
            { to: '/lab/dashboard', label: 'Diagnostic Lab', sublabel: 'RT-PCR / ELISA', icon: '🔬' },
            { to: '/authority/dashboard', label: 'Health Authority', sublabel: 'District Command', icon: '🏛️' },
            { to: '/admin/dashboard', label: 'Admin Console', sublabel: 'System Governance', icon: '⚙️' },
          ].map((portal, i) => (
            <Link
              key={i}
              to={portal.to}
              className="p-3.5 rounded-3xl bg-white border border-sky-100 hover:border-sky-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/15 transition-all duration-300 ease-out group text-center shadow-sm relative overflow-hidden"
            >
              <div className="text-2xl mb-1.5 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">{portal.icon}</div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{portal.label}</div>
              <div className="text-[10px] text-slate-500">{portal.sublabel}</div>
            </Link>
          ))}
        </div>

        {/* 2-Column Split: Central GIS Map + Real-Time Telemetry Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Central Interactive GIS Outbreak Map */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white border border-slate-200 p-5 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Epidemiological Outbreak Map — Pune Rural District, Maharashtra
                  </h3>
                </div>
                <Badge variant={isCritical ? 'danger' : 'primary'} dot>
                  {isCritical ? 'Active Hotspot Detected' : 'Baseline Stable'}
                </Badge>
              </div>

              <OutbreakMap
                clusters={scenarioData.clusters}
                height="460px"
                zoom={11}
              />
            </Card>
          </div>

          {/* Right 1 Col: AI Engine Telemetry & Cluster Inspector */}
          <div className="space-y-4">
            {/* AI Risk Score Breakdown */}
            <Card className="bg-white border border-slate-200 p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  AI Risk Engine Telemetry
                </span>
                <RiskBadge level={isCritical ? 'CRITICAL' : 'LOW'} score={isCritical ? 94 : 18} />
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={isCritical ? "text-rose-500" : "text-sky-600"}
                      strokeDasharray={`${isCritical ? 94 : 18}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-black text-base text-slate-900">
                    {isCritical ? '94' : '18'}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-900">
                    {isCritical ? 'Vesicular / FMD Concern' : 'Normal Baseline Health'}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {isCritical ? 'High spatial report density (+28) with mucosal erosion synergy' : 'Zero acute symptom clusters'}
                  </div>
                </div>
              </div>

              {/* Explainable Factor Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">AI Explainable Factors</span>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Mucosal Blister Synergy</span>
                  <strong className={isCritical ? "text-rose-600" : "text-slate-800"}>{isCritical ? "+42 pts" : "0"}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Spatial Cluster Density</span>
                  <strong className={isCritical ? "text-rose-600" : "text-slate-800"}>{isCritical ? "+28 pts" : "0"}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Vaccine Lag Penalty</span>
                  <strong className={isCritical ? "text-amber-600" : "text-slate-800"}>{isCritical ? "+24 pts" : "+18"}</strong>
                </div>
              </div>
            </Card>

            {/* Quick Action Trigger */}
            <Card className="bg-white border border-slate-200 p-5 space-y-3 shadow-md">
              <span className="text-xs font-bold text-slate-800 block">Emergency Response Actions</span>
              <div className="space-y-2">
                <Link
                  to="/authority/mvu-fleet"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                >
                  <Radio className="w-4 h-4" />
                  <span>Dispatch 1962 MVU Fleet</span>
                </Link>
                <Link
                  to="/authority/market-biosecurity"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center space-x-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>APMC Market Biosecurity Gate</span>
                </Link>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
