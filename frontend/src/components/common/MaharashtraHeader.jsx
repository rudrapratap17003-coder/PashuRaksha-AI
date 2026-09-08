import React from 'react'
import { Shield, Sparkles } from 'lucide-react'

export default function MaharashtraHeader() {
  return (
    <div className="bg-slate-900 text-white text-[11px] py-1.5 px-3 sm:px-4 border-b border-slate-800 font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="font-bold text-sky-300">PASHURAKSHA AI • SIH 2026 DEMO • SYNTHETIC DATA</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-slate-400 ml-auto">
          <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-sky-400 font-bold">
            SIH26128
          </span>
          <span>Prototype developed for SIH Problem Statement SIH26128</span>
        </div>
      </div>
    </div>
  )
}
