import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { ShieldAlert, AlertTriangle, CheckCircle2, HeartPulse, FlaskConical, FileSpreadsheet, Search, Sparkles, PieChart, Layers, ArrowRight, TrendingDown } from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const AMR_FARMS = [
  {
    farmName: 'Shinde Dairy Farm (Baramati)',
    owner: 'Ramesh Shinde',
    cattleCount: 18,
    primaryAntibioticUsed: 'Enrofloxacin 10%',
    ciaCategory: 'Highest Priority Critically Important (HPCI)',
    mrlStatus: 'CLEAR (Within Safe MRL)',
    withdrawalDaysRemaining: 0,
    astSensitivity: 'Sensitive to Enrofloxacin & Gentamicin; Resistant to Streptomycin'
  },
  {
    farmName: 'Patil Livestock Shed (Shirur)',
    owner: 'Suresh Patil',
    cattleCount: 24,
    primaryAntibioticUsed: 'Ceftiofur Sodium',
    ciaCategory: '3rd Generation Cephalosporin (HPCI)',
    mrlStatus: 'WITHDRAWAL ACTIVE (Day 3 of 5)',
    withdrawalDaysRemaining: 2,
    astSensitivity: 'Sensitive to Ceftiofur & Amoxicillin-Clavulanate'
  },
  {
    farmName: 'Indapur Buffalo Dairy Co-op',
    owner: 'Dattatray Pawar',
    cattleCount: 32,
    primaryAntibioticUsed: 'Oxytetracycline LA 20%',
    ciaCategory: 'Highly Important Antimicrobial',
    mrlStatus: 'CLEAR (Post-7 Day Withholding Verified)',
    withdrawalDaysRemaining: 0,
    astSensitivity: 'Intermediate resistance observed to Tetracyclines'
  }
]

export default function AmrSurveillanceDesk() {
  const { t } = useLanguage()
  const [farms, setFarms] = useState(AMR_FARMS)
  const [search, setSearch] = useState('')

  const filtered = farms.filter(f =>
    f.farmName.toLowerCase().includes(search.toLowerCase()) ||
    f.primaryAntibioticUsed.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12 text-slate-100 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-rose-500/20 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>{t("vetModule.amr.actionPlan")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("vetModule.amr.title")}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            {t("vetModule.amr.subtitle")}
          </p>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: t("vetModule.amr.stats.monitored"), value: '42 Sheds', sub: t("vetModule.amr.stats.monitoredSub"), color: 'emerald' },
          { label: t("vetModule.amr.stats.withdrawals"), value: '7 Farms', sub: t("vetModule.amr.stats.withdrawalsSub"), color: 'amber' },
          { label: t("vetModule.amr.stats.hpci"), value: '18.4%', sub: t("vetModule.amr.stats.hpciSub"), color: 'rose' },
          { label: t("vetModule.amr.stats.mrl"), value: '98.2%', sub: t("vetModule.amr.stats.mrlSub"), color: 'sky' },
        ].map((k, i) => (
          <div key={i} className={`p-4 rounded-2xl bg-slate-900/80 border border-${k.color}-500/20 text-center space-y-1`}>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{k.label}</span>
            <strong className={`text-2xl font-black text-${k.color}-400 block`}>{k.value}</strong>
            <span className="text-[9px] text-slate-500 block">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("vetModule.amr.searchPlaceholder")}
          className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Farm Antimicrobial Audit Cards */}
      <div className="space-y-4">
        {filtered.map((farm, idx) => (
          <Card key={idx} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-rose-500/30 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">{t("vetModule.amr.auditPrefix")} #{idx + 101}</span>
                <h3 className="text-base font-bold text-white">{farm.farmName}</h3>
                <p className="text-xs text-slate-400">{t("vetModule.amr.owner")}: {farm.owner} • {farm.cattleCount} {t("vetModule.amr.regHead")}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                farm.withdrawalDaysRemaining > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {farm.mrlStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{t("vetModule.amr.prescribed")}</span>
                <strong className="text-white text-xs block">{farm.primaryAntibioticUsed}</strong>
                <span className="text-[10px] text-rose-400 block">{farm.ciaCategory}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{t("vetModule.amr.labAst")}</span>
                <p className="text-[11px] text-slate-300 leading-snug">{farm.astSensitivity}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{t("vetModule.amr.dairySafety")}</span>
                <p className="text-[11px] text-emerald-300">
                  {farm.withdrawalDaysRemaining > 0
                    ? `⚠️ {t("vetModule.amr.prohibitMilk")} ${farm.withdrawalDaysRemaining} {t("vetModule.amr.moreDays")}`
                    : '{t("vetModule.amr.milkApproved")}'}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
