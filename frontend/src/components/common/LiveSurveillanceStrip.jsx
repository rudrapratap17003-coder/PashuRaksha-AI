import React from 'react'
import { Activity, ShieldAlert, Radio, Syringe, Users, AlertTriangle } from 'lucide-react'
import { useScenario } from '../../context/ScenarioContext'

export default function LiveSurveillanceStrip() {
  const { scenarioData, currentScenario } = useScenario()

  const isCritical = currentScenario === 'RAMPUR_OUTBREAK'

  return (
    <div className="w-full bg-[#08221D]/90 backdrop-blur-md border-y border-emerald-500/20 text-slate-200 py-2.5 px-4 z-20 relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isCritical ? 'bg-rose-500' : 'bg-emerald-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isCritical ? 'bg-rose-500' : 'bg-emerald-500'
            }`} />
          </span>
          <span className="font-mono font-black uppercase tracking-widest text-[11px] text-emerald-400">
            LIVE SURVEILLANCE NETWORK
          </span>
        </div>

        {/* Dynamic Metric Tickers */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium text-[11px] sm:text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Monitored:</span>
            <strong className="text-white font-bold">{scenarioData.monitoredLivestock} Head</strong>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Reports:</span>
            <strong className="text-white font-bold">{scenarioData.activeReports14Days} / 14d</strong>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Clusters:</span>
            <strong className="text-white font-bold">{scenarioData.activeClustersCount} Active</strong>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <AlertTriangle className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-400' : 'text-slate-400'}`} />
            <span>Hotspots:</span>
            <strong className={isCritical ? 'text-rose-400 font-extrabold' : 'text-white font-bold'}>
              {scenarioData.hotspotVillagesCount} Critical
            </strong>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <Syringe className="w-3.5 h-3.5 text-teal-400" />
            <span>Vaccination:</span>
            <strong className="text-emerald-300 font-bold">{scenarioData.districtVaccinationRate}%</strong>
          </div>
        </div>

      </div>
    </div>
  )
}
