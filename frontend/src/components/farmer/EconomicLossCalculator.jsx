import React, { useState } from 'react'
import {
  IndianRupee,
  TrendingDown,
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Download,
  Building2,
  X,
  HelpCircle
} from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'

export default function EconomicLossCalculator({ isOpen, onClose }) {
  const [affectedCattle, setAffectedCattle] = useState(4)
  const [avgMilkPerCow, setAvgMilkPerCow] = useState(12) // L/day
  const [milkRate, setMilkRate] = useState(38) // Rs/L (Maharashtra standard buffalo/cow average)
  const [quarantineDays, setQuarantineDays] = useState(14)
  const [yieldDropPercent, setYieldDropPercent] = useState(85) // % drop during acute FMD
  const [treatmentCostPerCow, setTreatmentCostPerCow] = useState(1800) // Rs
  const [claimSubmitted, setClaimSubmitted] = useState(false)
  const [claimId, setClaimId] = useState(null)

  // Calculations
  const dailyNormalMilk = affectedCattle * avgMilkPerCow
  const dailyLostMilk = dailyNormalMilk * (yieldDropPercent / 100)
  const totalMilkRevenueLoss = Math.round(dailyLostMilk * milkRate * quarantineDays)
  const totalTreatmentCost = Math.round(affectedCattle * treatmentCostPerCow)
  const totalFinancialLoss = totalMilkRevenueLoss + totalTreatmentCost

  // State Gov Relief Subsidy Estimation (Approx 60% relief under Maharashtra Livestock Disaster Fund)
  const estimatedGovRelief = Math.round(totalFinancialLoss * 0.65)

  const handleSubmitClaim = () => {
    const randomId = `MH-DAH-RELIEF-${Math.floor(100000 + Math.random() * 900000)}`
    setClaimId(randomId)
    setClaimSubmitted(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Economic Impact &amp; Dairy Relief Estimator
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  Govt of Maharashtra Relief Scheme
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Calculate milk revenue loss during disease quarantine and apply for state livestock compensation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {claimSubmitted ? (
            <div className="p-8 text-center space-y-4 bg-slate-950 rounded-3xl border border-emerald-500/40">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Relief Claim Submitted to Taluka Office!</h3>
                <p className="text-xs font-mono text-emerald-400 font-bold">Claim Ref: {claimId}</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto pt-2">
                  Your estimated relief claim of <strong className="text-white">₹{estimatedGovRelief.toLocaleString()}</strong> has been submitted to the Baramati Taluka Animal Husbandry Officer for verification.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setClaimSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
                >
                  Recalculate
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Input Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-bold">Affected Cattle/Buffalo:</span>
                    <span className="font-bold text-emerald-400">{affectedCattle} Head</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={affectedCattle}
                    onChange={(e) => setAffectedCattle(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-bold">Normal Yield (L/day/cow):</span>
                    <span className="font-bold text-emerald-400">{avgMilkPerCow} Liters</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={avgMilkPerCow}
                    onChange={(e) => setAvgMilkPerCow(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-bold">Milk Price (₹/Liter):</span>
                    <span className="font-bold text-emerald-400">₹{milkRate} / L</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="80"
                    value={milkRate}
                    onChange={(e) => setMilkRate(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-bold">Quarantine / Recovery Days:</span>
                    <span className="font-bold text-amber-400">{quarantineDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    value={quarantineDays}
                    onChange={(e) => setQuarantineDays(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Economic Calculation Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center">
                  <span className="text-[10px] text-rose-400 font-bold uppercase block">Milk Revenue Loss</span>
                  <strong className="text-lg font-black text-white">₹{totalMilkRevenueLoss.toLocaleString()}</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{dailyLostMilk.toFixed(1)} L/day loss</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Medical &amp; Care Costs</span>
                  <strong className="text-lg font-black text-white">₹{totalTreatmentCost.toLocaleString()}</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">₹{treatmentCostPerCow}/animal</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Total Net Loss</span>
                  <strong className="text-lg font-black text-amber-300">₹{totalFinancialLoss.toLocaleString()}</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Farm revenue impact</span>
                </div>
              </div>

              {/* Government Relief Subsidy Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>State Disaster Relief Eligibility (65% Coverage)</span>
                  </span>
                  <h4 className="text-sm font-black text-white">
                    Estimated Government Compensation: <span className="text-emerald-300 text-base">₹{estimatedGovRelief.toLocaleString()}</span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Scheme: <em>Maharashtra Pashu Dhan Bima &amp; Outbreak Assistance Fund</em>
                  </p>
                </div>
                <button
                  onClick={handleSubmitClaim}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center gap-1.5 flex-shrink-0 transition"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Apply For Relief</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!claimSubmitted && (
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Rates benchmarked to Maharashtra State Milk Producers Co-op Federation (Mahanand)
            </span>
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
