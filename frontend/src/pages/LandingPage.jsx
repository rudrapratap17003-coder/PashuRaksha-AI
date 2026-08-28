import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Activity, 
  PawPrint, 
  Stethoscope, 
  Building2, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Syringe, 
  ArrowRight, 
  CheckCircle2, 
  Radio,
  FileText,
  ChevronRight,
  Zap,
  Layers,
  HeartHandshake,
  Cpu
} from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import RiskBadge from '../components/common/RiskBadge'
import OutbreakMap from '../components/map/OutbreakMap'
import LiveSurveillanceStrip from '../components/common/LiveSurveillanceStrip'
import SurveillanceBackground from '../components/background/SurveillanceBackground'
import { useScenario } from '../context/ScenarioContext'

export default function LandingPage() {
  const { scenarioData, currentScenario } = useScenario()

  const isCritical = currentScenario === 'RAMPUR_OUTBREAK'

  return (
    <div className="relative text-white font-sans overflow-x-hidden min-h-screen bg-[#061B17]">
      <SurveillanceBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-8 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart India Hackathon 2026 • PS ID: SIH26128</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Detect Livestock Disease <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Before It Becomes an Outbreak.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
              <strong>PASHURAKSHA AI</strong> connects rural farmers, field veterinarians, and public health authorities into a single, closed-loop epidemiological surveillance and early-warning intelligence network.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/farmer/dashboard">
                <Button
                  size="lg"
                  icon={ArrowRight}
                  className="font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 text-sm"
                >
                  Launch Live Demo
                </Button>
              </Link>

              <Link to="/presentation">
                <Button
                  variant="outline"
                  size="lg"
                  icon={Sparkles}
                  className="font-bold border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 text-sm"
                >
                  Explore Outbreak Intelligence
                </Button>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-500/20 text-xs text-slate-300 font-semibold">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Explainable AI Scoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Haversine GIS Clusters</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Zero-Latency Alerts</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Animated AI Surveillance Network Visualizer */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#092923] to-[#061B17] border border-emerald-500/30 shadow-2xl shadow-emerald-950/60 overflow-hidden space-y-5">
              
              {/* Card Ambient Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Live Village Telemetry Mesh
                  </span>
                </div>
                <Badge variant={isCritical ? 'danger' : 'primary'} size="sm">
                  {isCritical ? 'HOTSPOT DETECTED' : 'MONITORING ACTIVE'}
                </Badge>
              </div>

              {/* Village Nodes Data Flow */}
              <div className="space-y-2.5">
                {[
                  { name: 'Village Rampur', status: 'critical', reports: 13, signal: 'Acute Vesicular' },
                  { name: 'Village Kalyanpura', status: 'warning', reports: 4, signal: 'Cough & Fever' },
                  { name: 'Village Sanganer', status: 'normal', reports: 1, signal: 'Routine Telemetry' },
                  { name: 'Village Amer North', status: 'normal', reports: 0, signal: 'Baseline Normal' },
                ].map((v) => (
                  <div
                    key={v.name}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                      v.status === 'critical'
                        ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        : v.status === 'warning'
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                        : 'bg-[#061B17] border-emerald-500/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        v.status === 'critical' ? 'bg-rose-500 animate-ping' :
                        v.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-400'
                      }`} />
                      <strong className="text-white">{v.name}</strong>
                    </div>
                    <div className="text-[11px] font-mono">
                      <span>{v.reports} Reports</span> • <span className="opacity-80">{v.signal}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Centered AI Synthesis Outcome */}
              <div className="p-4 rounded-2xl bg-[#061B17] border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase text-slate-300">
                      PASHURAKSHA AI Engine
                    </span>
                  </div>
                  <RiskBadge level={isCritical ? 'CRITICAL' : 'LOW'} score={isCritical ? 94 : 18} size="sm" />
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Spatial Cluster Status:</span>
                    <strong className={isCritical ? 'text-rose-400 font-extrabold' : 'text-emerald-400'}>
                      {isCritical ? 'Outbreak Cluster #14 Detected' : 'No Active Clusters'}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Veterinary Dispatch:</span>
                    <strong className="text-sky-400">Emergency Triage Alert Triggered</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Live Surveillance Status Strip */}
      <LiveSurveillanceStrip />

      {/* Section 2: From Individual Symptoms to Community Outbreak Intelligence */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            THE CORE INNOVATION WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            From Individual Animal Symptoms to Community Outbreak Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            How PASHURAKSHA AI closes the surveillance gap between rural livestock farmers, clinical veterinarians, and district disease authorities.
          </p>
        </div>

        {/* 5-Step Horizontal Animated Process */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'Farmer Report',
              desc: 'Farmer logs 11 symptoms or uses voice input in their native dialect.',
              icon: PawPrint,
              color: 'emerald',
            },
            {
              step: '02',
              title: 'AI Risk Analysis',
              desc: 'Explainable AI computes 0-100 risk score with disease differential matching.',
              icon: Sparkles,
              color: 'teal',
            },
            {
              step: '03',
              title: 'Cluster Detection',
              desc: 'Haversine algorithm groups nearby cases into spatial outbreak zones.',
              icon: Radio,
              color: 'amber',
            },
            {
              step: '04',
              title: 'Veterinary Triage',
              desc: 'Clinical desk prioritizes dispatch, treatment notes, and lab test orders.',
              icon: Stethoscope,
              color: 'sky',
            },
            {
              step: '05',
              title: 'Authority Alert',
              desc: 'Command Center activates ring vaccination and containment protocols.',
              icon: Building2,
              color: 'rose',
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="p-5 rounded-2xl bg-[#092923] border border-emerald-500/20 space-y-3 relative hover:border-emerald-400/50 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-emerald-400/60 group-hover:text-emerald-300 transition">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-black text-sm text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 3: Explainable AI Health Risk Engine Breakdown */}
      <section className="relative z-10 py-16 bg-[#08221D]/60 border-y border-emerald-500/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left AI Description */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              DECISION-SUPPORT INTELLIGENCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Explainable AI Health Risk Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike opaque black-box models, PASHURAKSHA AI generates fully transparent clinical factor trees. Every score is mathematically grounded in weighted symptom severity, clinical synergies, chronicity, and herd density.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#061B17] border border-emerald-500/20 text-xs text-slate-300 space-y-1 italic">
              <strong className="text-emerald-400 not-italic block">Mandatory Non-Diagnostic Disclaimer:</strong>
              PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning decision support. It does not replace professional veterinary diagnosis or treatment.
            </div>
          </div>

          {/* Right Factor Breakdown Radial Card */}
          <div className="lg:col-span-6">
            <Card className="bg-[#092923] border border-emerald-500/30 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    CLINICAL CASE #PR-1024
                  </span>
                  <h3 className="text-base font-black text-white">
                    Animal: BUF-204 (Murrah Buffalo)
                  </h3>
                </div>
                <RiskBadge level="HIGH" score={78} />
              </div>

              {/* Radial Progress & Attribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Radial Visualizer */}
                <div className="flex flex-col items-center justify-center p-4 bg-[#061B17] rounded-2xl border border-emerald-500/20">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-orange-500"
                        strokeDasharray="78, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="font-black text-2xl text-white block">78</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">/ 100 Risk</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-400 mt-2">HIGH RISK TIER</span>
                  <span className="text-[10px] text-slate-400">AI Confidence: 87%</span>
                </div>

                {/* Factor Contribution Tree */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                    Contributing Factors:
                  </span>
                  {[
                    { label: 'Fever', pts: '+24' },
                    { label: 'Respiratory signs (Dyspnea)', pts: '+18' },
                    { label: 'Reduced appetite', pts: '+12' },
                    { label: 'Milk production drop', pts: '+10' },
                    { label: 'Nearby spatial cases (Rampur)', pts: '+14' },
                  ].map((f) => (
                    <div key={f.label} className="flex justify-between text-slate-300 border-b border-emerald-500/10 pb-1">
                      <span>{f.label}</span>
                      <strong className="text-emerald-400 font-mono">{f.pts}</strong>
                    </div>
                  ))}
                  <div className="flex justify-between text-white font-bold pt-1">
                    <span>Total Calculated Risk:</span>
                    <strong className="text-orange-400 font-mono">78 / 100</strong>
                  </div>
                </div>

              </div>

              {/* Action Recommendation */}
              <div className="p-3 rounded-xl bg-orange-950/60 border border-orange-500/40 text-xs text-orange-200">
                <strong>Recommended Action:</strong> Immediate veterinary evaluation and farm isolation required within 24 hours.
              </div>
            </Card>
          </div>

        </div>
      </section>

      {/* Section 4: Full-Width Interactive GIS Surveillance Map Centerpiece */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              GEOSPATIAL EPIDEMIOLOGY CENTERPIECE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Interactive GIS Disease Surveillance Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Live spatial-temporal cluster centroids and dynamic containment buffers across Jaipur Rural District.
            </p>
          </div>

          <Link to="/presentation">
            <Button size="sm" icon={Sparkles} className="font-bold bg-emerald-500 text-slate-950">
              Open Fullscreen Jury View →
            </Button>
          </Link>
        </div>

        <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-3">
          <OutbreakMap
            clusters={scenarioData.clusters}
            height="480px"
            zoom={11}
          />
        </Card>
      </section>

      {/* Section 5: Stakeholder Portals Showcase */}
      <section className="relative z-10 py-16 bg-[#08221D]/60 border-t border-emerald-500/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              ROLE-BASED STAKEHOLDER WORKFLOWS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dedicated Solutions for Every Stakeholder
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Farmer Portal Card */}
            <Card hover className="bg-[#092923] border border-emerald-500/30 p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <PawPrint className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-white">🧑‍🌾 Rural Farmer Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Simple high-contrast mobile interface with voice reporting, digital animal passports, and instant AI isolation guidance.
              </p>
              <Link to="/farmer/dashboard" className="block pt-2">
                <Button size="sm" className="w-full font-bold bg-emerald-500 text-slate-950">
                  Enter Farmer Portal →
                </Button>
              </Link>
            </Card>

            {/* Vet Desk Card */}
            <Card hover className="bg-[#092923] border border-sky-500/30 p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-white">🩺 Veterinarian Clinical Desk</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                AI-prioritized clinical triage queue, diagnostic laboratory test referral ordering, and farm quarantine enforcement.
              </p>
              <Link to="/vet/dashboard" className="block pt-2">
                <Button size="sm" className="w-full font-bold bg-sky-500 text-slate-950">
                  Enter Clinical Desk →
                </Button>
              </Link>
            </Card>

            {/* Authority Command Card */}
            <Card hover className="bg-[#092923] border border-purple-500/30 p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-white">🏛️ Authority Surveillance Command</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                District-level epidemiological heatmaps, village risk stratification matrix, vaccination gaps, and rapid outbreak triggers.
              </p>
              <Link to="/authority/dashboard" className="block pt-2">
                <Button size="sm" className="w-full font-bold bg-purple-500 text-slate-950">
                  Enter Command Center →
                </Button>
              </Link>
            </Card>

          </div>
        </div>
      </section>

    </div>
  )
}
