import React from 'react'
import { Shield, Sparkles } from 'lucide-react'

export default function MaharashtraHeader() {
  return (
    <div className="bg-gradient-to-r from-amber-950 via-slate-950 to-emerald-950 text-white text-[11px] py-1.5 px-3 sm:px-4 border-b border-slate-800 font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span className="font-bold text-amber-300">महाराष्ट्र शासन</span>
            <span className="text-slate-300 text-[10px] sm:text-[11px] truncate">
              • Government of Maharashtra
            </span>
          </div>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-emerald-400 font-semibold text-[10px]">
            Maharashtra State Innovation Society (MSInS)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-amber-200/90 ml-auto">
          <span className="bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 rounded text-emerald-300 font-bold">
            SIH26128
          </span>
          <span className="hidden sm:inline text-slate-400">
            Dept. of Animal Husbandry (DAH)
          </span>
        </div>
      </div>
    </div>
  )
}
