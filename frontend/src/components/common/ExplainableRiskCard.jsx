import React from 'react'
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react'
import RiskBadge from './RiskBadge'

export default function ExplainableRiskCard({
  score = 82,
  level = 'CRITICAL',
  disease = 'Foot-and-Mouth Disease (suspected)',
  animalId = 'COW-101',
  factors = null,
  recommendation = 'Immediate herd isolation in dry pen + urgent veterinary inspection. Restrict livestock movement within 5km zone.',
  className = '',
  compact = false
}) {
  const defaultFactors = [
    { factor: 'Vesicular oral mucosal erosions / blisters', points: 24.0, category: 'Clinical Sign' },
    { factor: 'High systemic fever (104.5°F)', points: 18.0, category: 'Vitals' },
    { factor: 'Excessive frothy salivation & drooling', points: 16.0, category: 'Clinical Sign' },
    { factor: 'Synergistic Vesicular Triad (Fever + Lesions + Salivation)', points: 18.0, category: 'Synergy' },
    { factor: 'Multiple herd animals affected (3 contacts)', points: 8.0, category: 'Epidemiological' },
    { factor: 'Vaccination vulnerability (overdue FMD booster)', points: 5.0, category: 'Immunity Gap' }
  ]

  const activeFactors = (factors && factors.length > 0) ? factors : defaultFactors

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
              EXPLAINABLE AI RISK ASSESSMENT
            </span>
            {animalId && (
              <span className="text-xs text-slate-400 font-mono">
                • {animalId}
              </span>
            )}
          </div>
          <h3 className="text-base font-black text-white">
            Clinical Health Risk Breakdown
          </h3>
        </div>
        <RiskBadge level={level} score={score} size="lg" />
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold text-amber-300">MANDATORY CLINICAL DISCLAIMER:</strong>
          <p className="text-amber-200/90">
            Pattern flag only — veterinary verification required. PASHURAKSHA AI provides decision-support and surveillance intelligence. It does not replace physical examination by a registered veterinarian.
          </p>
        </div>
      </div>

      {/* Disease Match & Score */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Calculated Health Risk:</span>
          <strong className="text-lg font-black text-rose-400">{score} / 100 ({level})</strong>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-slate-800">
          <span className="text-slate-400">Possible Disease Pattern:</span>
          <strong className="text-amber-300 font-bold">{disease}</strong>
        </div>
      </div>

      {/* 3-6 Contributing Factors */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Major Contributing Factors (Transparent Attribution):
        </span>
        <div className="space-y-1 text-xs">
          {activeFactors.slice(0, 6).map((item, idx) => {
            const factorText = typeof item === 'string' ? item : item.factor
            const pts = typeof item === 'object' && (item.points || item.weight_contribution)
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800/60 text-[11px]"
              >
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>{factorText}</span>
                </span>
                {pts && (
                  <span className="font-mono font-bold text-rose-400 ml-2 flex-shrink-0">
                    +{Number(pts).toFixed(1)} pts
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/30 text-xs space-y-1">
        <strong className="text-sky-300 block font-bold">Recommended Clinical Action:</strong>
        <p className="text-slate-300 text-[11px] leading-relaxed">{recommendation}</p>
      </div>
    </div>
  )
}
