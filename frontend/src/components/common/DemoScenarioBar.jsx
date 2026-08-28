import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Play, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, X, Presentation, ChevronRight } from 'lucide-react'
import { useScenario } from '../../context/ScenarioContext'
import OfflineIndicator from './OfflineIndicator'

export default function DemoScenarioBar() {
  const { currentScenario, setScenario, scenarioData, scenarios } = useScenario()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeNotice, setActiveNotice] = useState(null)

  const handleSelectScenario = (key) => {
    setScenario(key)
    setActiveNotice(`Switched to ${key.replace('_', ' ')}. Visual surveillance and cluster states updated!`)
    setTimeout(() => setActiveNotice(null), 4000)
  }

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-2xl bg-[#061B17] text-emerald-400 text-xs font-black shadow-2xl border border-emerald-500/50 flex items-center space-x-2 hover:scale-105 transition"
      >
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>Jury Evaluation Bar</span>
      </button>
    )
  }

  return (
    <div className="bg-[#051512] text-white border-b border-emerald-500/20 px-4 py-2.5 shadow-2xl relative z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left Jury Header */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-black uppercase tracking-wider text-[11px] text-emerald-300">
                SIH 2026 EVALUATION CONTROLLER
              </span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-950 border border-emerald-600/40 text-emerald-400 text-[10px] font-bold">
                PS ID: SIH26128
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Select simulation scenario to demonstrate full platform response
            </span>
          </div>
        </div>

        {/* 1-Click Scenario Buttons & Presentation Link */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSelectScenario(scenarios.BASELINE)}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 text-xs ${
              currentScenario === scenarios.BASELINE
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40'
                : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/80'
            }`}
          >
            <span>🟢 Baseline Health</span>
          </button>

          <button
            onClick={() => handleSelectScenario(scenarios.RAMPUR_OUTBREAK)}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 text-xs ${
              currentScenario === scenarios.RAMPUR_OUTBREAK
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40 animate-pulse'
                : 'bg-rose-950/60 border border-rose-800/60 text-rose-300 hover:bg-rose-900/80'
            }`}
          >
            <span>🔴 Rampur Outbreak</span>
          </button>

          <button
            onClick={() => handleSelectScenario(scenarios.VACCINATION_ALERT)}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 text-xs ${
              currentScenario === scenarios.VACCINATION_ALERT
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/40'
                : 'bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:bg-amber-900/80'
            }`}
          >
            <span>🟡 Ring Vaccination Alert</span>
          </button>

          {/* Dedicated Presentation View Button */}
          <Link
            to="/presentation"
            className="px-3 py-1.5 rounded-xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md hover:from-teal-500 hover:to-emerald-500 transition flex items-center space-x-1.5 text-xs"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Jury Mode</span>
            <ChevronRight className="w-3 h-3" />
          </Link>

          {/* Rural Offline Simulator */}
          <OfflineIndicator />

          {/* Minimize */}
          <button
            onClick={() => setIsCollapsed(true)}
            title="Minimize bar"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {activeNotice && (
        <div className="max-w-7xl mx-auto pt-1.5 text-[11px] font-semibold text-emerald-400 flex items-center space-x-1.5 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{activeNotice}</span>
        </div>
      )}
    </div>
  )
}
