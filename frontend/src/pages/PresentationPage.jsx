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
    <div className="min-h-screen bg-[#061B17] text-white flex flex-col font-sans relative overflow-x-hidden">
      <SurveillanceBackground />

      {/* Presentation Top Bar */}
      <header className="sticky top-0 z-40 bg-[#061B17]/95 backdrop-blur-md border-b border-emerald-500/20 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-slate-300 hover:text-white transition flex items-center space-x-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black tracking-tight text-white">
                    PASHURAKSHA <span className="text-emerald-400">AI</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                    JURY PRESENTATION MODE
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 font-medium">
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
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              }`}
            >
              🟢 Baseline
            </button>
            <button
              onClick={() => setScenario(scenarios.RAMPUR_OUTBREAK)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currentScenario === scenarios.RAMPUR_OUTBREAK
                  ? 'bg-rose-600 text-white font-black animate-pulse'
                  : 'bg-rose-950/60 border border-rose-800 text-rose-300'
              }`}
            >
              🔴 Rampur Outbreak
            </button>
            <button
              onClick={() => setScenario(scenarios.VACCINATION_ALERT)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                currentScenario === scenarios.VACCINATION_ALERT
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-amber-950/60 border border-amber-800 text-amber-300'
              }`}
            >
              🟡 Ring Containment
            </button>
          </div>
        </div>
      </header>

      {/* Live Surveillance Bar */}
      <LiveSurveillanceStrip />

      {/* Main Presentation Command Grid */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6 relative z-10">
        
        {/* Scenario Overview Banner */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isCritical
            ? 'bg-gradient-to-r from-rose-950/80 to-[#092923] border-rose-500/40 shadow-xl shadow-rose-950/30'
            : 'bg-gradient-to-r from-emerald-950/60 to-[#092923] border-emerald-500/30 shadow-xl'
        }`}>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-black uppercase text-emerald-400">
                ACTIVE DEMO STATE:
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                isCritical ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
              }`}>
                {scenarioData.tag}
              </span>
            </div>
            <h2 className="text-lg font-black text-white">{scenarioData.name}</h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{scenarioData.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/vet/dashboard"
              className="px-3 py-1.5 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-300 text-xs font-bold hover:bg-sky-900 transition flex items-center space-x-1"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Vet Desk →</span>
            </Link>
            <Link
              to="/authority/dashboard"
              className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-900 transition flex items-center space-x-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Authority →</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Split: Central GIS Map + Real-Time Telemetry Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Central Interactive GIS Outbreak Map */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rose-400" />
                  <h3 className="font-bold text-white text-base">
                    Epidemiological Outbreak Map — Jaipur Rural District
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
            <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  AI Risk Engine Telemetry
                </span>
                <RiskBadge level={isCritical ? 'CRITICAL' : 'LOW'} score={isCritical ? 94 : 18} />
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={isCritical ? "text-rose-500" : "text-emerald-400"}
                      strokeDasharray={`${isCritical ? 94 : 18}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-black text-base text-white">
                    {isCritical ? '94' : '18'}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-white">
                    {isCritical ? 'Vesicular / FMD Concern' : 'Normal Baseline Health'}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {isCritical ? 'High spatial report density (+28) with mucosal erosion synergy' : 'Zero acute symptom clusters'}
                  </div>
                </div>
              </div>

              {/* Environmental Context */}
              <div className="p-3 rounded-xl bg-[#061B17] border border-emerald-500/20 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Environmental Factor:</span>
                  <strong className={scenarioData.environmentalRisk.level === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'}>
                    {scenarioData.environmentalRisk.level}
                  </strong>
                </div>
                <p className="text-slate-300">{scenarioData.environmentalRisk.advisory}</p>
              </div>
            </Card>

            {/* Active Cluster Details */}
            <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Cluster Detection Matrix</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {scenarioData.clusters.length} Cluster Active
                </span>
              </div>

              {scenarioData.clusters.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-[#061B17] rounded-xl border border-dashed border-emerald-500/20">
                  No active spatial disease clusters detected in monitored radius.
                </div>
              ) : (
                scenarioData.clusters.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-[#061B17] border border-rose-500/30 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-rose-400 font-bold">{c.id}</span>
                        <h4 className="font-bold text-white">{c.cluster_name}</h4>
                      </div>
                      <Badge variant="danger" size="sm">{c.risk_level}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 py-1 text-[11px] bg-slate-900/60 p-2 rounded-lg text-slate-300">
                      <div>Cases: <strong className="text-white">{c.case_count} Reports</strong></div>
                      <div>Livestock: <strong className="text-white">{c.affected_animals_count} Head</strong></div>
                      <div>Radius: <strong className="text-white">{c.radius_km} km</strong></div>
                      <div>Score: <strong className="text-rose-400">{c.cluster_score}/100</strong></div>
                    </div>

                    <p className="text-[11px] text-rose-300 leading-snug">
                      <strong>Action:</strong> {c.recommended_action}
                    </p>
                  </div>
                ))
              )}
            </Card>
          </div>

        </div>

        {/* Bottom Section: Live Event Timeline (Chronological SIH Story) */}
        <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm sm:text-base">
                Live Epidemiological Incident Timeline
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Chronological Intelligence Stream
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenarioData.timeline.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border space-y-1 text-xs ${
                  item.status === 'critical'
                    ? 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                    : item.status === 'action'
                    ? 'bg-sky-950/50 border-sky-500/40 text-sky-200'
                    : item.status === 'warning'
                    ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                    : 'bg-[#061B17] border-emerald-500/20 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-emerald-400">{item.time}</span>
                  <span className="uppercase font-bold">{item.status}</span>
                </div>
                <p className="font-medium text-white leading-snug">{item.event}</p>
              </div>
            ))}
          </div>
        </Card>

      </main>

    </div>
  )
}
