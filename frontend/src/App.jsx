import React, { useState, useEffect } from 'react'
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Users, 
  Stethoscope, 
  Building2, 
  RefreshCw,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react'

function App() {
  const [apiStatus, setApiStatus] = useState({
    loading: true,
    online: false,
    data: null,
    error: null,
  })

  const checkBackendHealth = async () => {
    setApiStatus(prev => ({ ...prev, loading: true, error: null }))
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/health')
      if (response.ok) {
        const data = await response.json()
        setApiStatus({
          loading: false,
          online: true,
          data: data,
          error: null,
        })
      } else {
        throw new Error(`HTTP Error ${response.status}`)
      }
    } catch (err) {
      setApiStatus({
        loading: false,
        online: false,
        data: null,
        error: err.message || 'Cannot reach FastAPI backend',
      })
    }
  }

  useEffect(() => {
    checkBackendHealth()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                PASHURAKSHA <span className="text-emerald-600">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                SIH26128
              </span>
            </div>
          </div>

          {/* Backend Status Pill */}
          <div className="flex items-center space-x-3">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${
              apiStatus.loading 
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : apiStatus.online
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                apiStatus.loading
                  ? 'bg-amber-400 animate-pulse'
                  : apiStatus.online
                  ? 'bg-emerald-500 animate-ping'
                  : 'bg-rose-500'
              }`} />
              <span>
                {apiStatus.loading
                  ? 'Checking API...'
                  : apiStatus.online
                  ? 'FastAPI Backend: Online'
                  : 'FastAPI Backend: Offline'}
              </span>
            </div>

            <button 
              onClick={checkBackendHealth}
              title="Refresh connection status"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            >
              <RefreshCw className={`w-4 h-4 ${apiStatus.loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 • PS #128</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              PASHURAKSHA <span className="text-emerald-400">AI</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-emerald-100 leading-relaxed">
              Livestock Health Intelligence &amp; Outbreak Early-Warning Platform
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              An intelligent, software-based surveillance ecosystem connecting <strong>Farmers</strong>, <strong>Veterinarians</strong>, and <strong>Government Authorities</strong> for early risk assessment, spatial cluster detection, and proactive disease mitigation.
            </p>

            {/* Quick Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-200">
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">Theme: Agriculture &amp; FoodTech</span>
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">Architecture: Decoupled REST + AI</span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">Phase 1: Foundation Active</span>
            </div>
          </div>
        </div>

        {/* Core Product Principle Alert */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-4 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm tracking-wide uppercase text-amber-800">
              Core Non-Diagnostic Principle &amp; AI Decision-Support Notice
            </h3>
            <p className="text-sm text-amber-800/90 leading-relaxed">
              <strong>PASHURAKSHA AI</strong> provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment. All high-risk alerts and suspected cluster notifications advise professional veterinary consultation.
            </p>
          </div>
        </div>

        {/* 3-Tier Stakeholder Roles Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>3-Tier Integrated Intelligence Platform</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Roadmap Overview</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Farmer Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Role 1</span>
                <h3 className="text-lg font-bold text-slate-900">Farmer Mobile Portal</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Digital Livestock Health Records</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Easy 1-Tap Symptom Reporting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Vaccination Reminders &amp; Local Alerts</span>
                </li>
              </ul>
            </div>

            {/* Vet Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Role 2</span>
                <h3 className="text-lg font-bold text-slate-900">Veterinarian Clinical Desk</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span>Priority Case Triage (Risk-Ordered)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span>Explainable AI Risk Factor Breakdown</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span>Clinical Actions &amp; Lab Referral Workflow</span>
                </li>
              </ul>
            </div>

            {/* Authority Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Role 3</span>
                <h3 className="text-lg font-bold text-slate-900">Authority Surveillance</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>District &amp; Village Spatial Hotspot Maps</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Outbreak Cluster Detection Engine</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Proactive Early Warning Dissemination</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Phase 1 Verification Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center space-x-2">
              <Radio className="w-5 h-5 text-emerald-600" />
              <span>Phase 1 Verification Matrix</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Active Environment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Frontend Framework</span>
              <p className="font-bold text-slate-800">React 18 + Vite</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Backend Gateway</span>
              <p className="font-bold text-slate-800">FastAPI + Uvicorn</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Styling &amp; Theme</span>
              <p className="font-bold text-slate-800">Tailwind CSS</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Health Check Status</span>
              <p className={`font-bold ${apiStatus.online ? 'text-emerald-600' : 'text-amber-600'}`}>
                {apiStatus.online ? 'Healthy & Connected' : 'Waiting for Backend'}
              </p>
            </div>
          </div>

          {apiStatus.data && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto space-y-1">
              <div className="text-emerald-400 font-semibold">// Live Response from FastAPI /api/v1/health:</div>
              <pre>{JSON.stringify(apiStatus.data, null, 2)}</pre>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PASHURAKSHA AI • Smart India Hackathon Prototype (SIH26128)</p>
          <div className="flex items-center space-x-4">
            <span>Theme: Agriculture &amp; FoodTech</span>
            <span>•</span>
            <span>Decision-Support System</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
