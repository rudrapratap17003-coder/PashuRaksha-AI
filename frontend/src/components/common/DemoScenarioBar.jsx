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
    setActiveNotice(`Switched to ${key.replace('_', ' ')}. Surveillance state updated!`)
    setTimeout(() => setActiveNotice(null), 4000)
  }

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 px-3.5 py-2 rounded-2xl bg-white text-sky-700 text-xs font-black shadow-xl border border-sky-200 flex items-center space-x-1.5 hover:scale-105 transition"
      >
        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
        <span className="text-[11px]">Jury Bar</span>
      </button>
    )
  }

  return (
    <div className="bg-white text-slate-800 border-b border-sky-100 px-3 sm:px-4 py-2 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 text-xs">
        
        {/* Left Jury Header */}
        <div className="flex items-center justify-between md:justify-start space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0 border border-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-black uppercase tracking-wider text-[10px] sm:text-[11px] text-sky-900">
                  SIH26128 EVALUATION
                </span>
                <span className="hidden sm:inline px-1.5 py-0.2 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[9px] font-bold">
                  Live Simulation
                </span>
              </div>
            </div>
          </div>

          {/* Minimize button on mobile */}
          <button
            onClick={() => setIsCollapsed(true)}
            title="Minimize bar"
            className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1-Click Scenario Buttons - Horizontally Scrollable on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-nowrap">
          <button
            onClick={() => handleSelectScenario(scenarios.BASELINE)}
            className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 text-[11px] flex-shrink-0 ${
              currentScenario === scenarios.BASELINE
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-50 border border-slate-200 text-emerald-700 hover:bg-slate-100'
            }`}
          >
            <span>🟢 Baseline</span>
          </button>

          <button
            onClick={() => handleSelectScenario(scenarios.RAMPUR_OUTBREAK)}
            className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 text-[11px] flex-shrink-0 ${
              currentScenario === scenarios.RAMPUR_OUTBREAK
                ? 'bg-rose-600 text-white shadow-sm animate-pulse'
                : 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span>🔴 Outbreak</span>
          </button>

          <button
            onClick={() => handleSelectScenario(scenarios.VACCINATION_ALERT)}
            className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 text-[11px] flex-shrink-0 ${
              currentScenario === scenarios.VACCINATION_ALERT
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span>🟡 Ring Alert</span>
          </button>

          {/* Dedicated Presentation View Button */}
          <Link
            to="/presentation"
            className="px-2.5 py-1 rounded-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm hover:from-sky-500 hover:to-blue-500 transition flex items-center space-x-1 text-[11px] flex-shrink-0"
          >
            <Presentation className="w-3 h-3" />
            <span>Jury Stage</span>
          </Link>

          {/* Rural Offline Simulator */}
          <div className="flex-shrink-0">
            <OfflineIndicator />
          </div>

          {/* Desktop Minimize Button */}
          <button
            onClick={() => setIsCollapsed(true)}
            title="Minimize bar"
            className="hidden md:block p-1 rounded-lg text-slate-400 hover:text-slate-700 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {activeNotice && (
        <div className="max-w-7xl mx-auto pt-1 text-[10px] font-semibold text-emerald-700 flex items-center space-x-1 animate-in fade-in">
          <CheckCircle2 className="w-3 h-3 flex-shrink-0 text-emerald-600" />
          <span>{activeNotice}</span>
        </div>
      )}
    </div>
  )
}
