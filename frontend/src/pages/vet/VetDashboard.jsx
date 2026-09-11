import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Link } from 'react-router-dom'
import { Stethoscope, AlertTriangle, CheckCircle2, Clock, MapPin, Phone, TestTube2, FileText, ShieldAlert, RefreshCw, Search, Filter, Layers, ChevronRight, Sparkles, Radio, FlaskConical, ExternalLink } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import OutbreakMap from '../../components/map/OutbreakMap'
import VetCaseModal from '../../components/vet/VetCaseModal'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateFeedback'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useScenario } from '../../context/ScenarioContext'

export default function VetDashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { scenarioData, currentScenario } = useScenario()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCase, setSelectedCase] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchVetCases = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/vet/cases')
      setCases(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.warn('Failed to load vet cases:', err)
      setError(err?.response?.data?.detail || err?.message || 'Failed to fetch clinical triage queue.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVetCases()
  }, [])

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesSearch =
      c.animal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.village?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="  rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              {t("vetModule.dashboardTitle")}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-950  text-slate-300 text-[10px] font-bold">
              {t("vetModule.priorityActive")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("vetModule.triageConsole")}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            {t("vetModule.jurisdiction")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/lab/dashboard">
            <Button
              size="sm"
              icon={Microscope}
              className="font-bold bg-cyan-700 hover:bg-cyan-600 text-white shadow-lg shadow-slate-900/20"
            >
              Diagnostic Lab Desk
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("vetModule.stats.criticalCases")}
          value={cases.filter((c) => c.risk_level === 'CRITICAL').length || 1}
          subtitle={t("vetModule.stats.criticalSub")}
          icon={AlertTriangle}
          iconBg="bg-rose-500/10 text-rose-400 border border-rose-500/20"
        />
        <StatCard
          title={t("vetModule.stats.highPriority")}
          value={cases.filter((c) => c.risk_level === 'HIGH').length || 2}
          subtitle={t("vetModule.stats.highSub")}
          icon={ShieldAlert}
          iconBg="bg-orange-500/10 text-orange-400 border border-orange-500/20"
        />
        <StatCard
          title={t("vetModule.stats.labTests")}
          value={cases.filter((c) => c.lab_referral).length || 3}
          subtitle={t("vetModule.stats.labSub")}
          icon={TestTube2}
          iconBg="bg-slate-50 border border-slate-200 text-slate-300 "
        />
        <StatCard
          title={t("vetModule.stats.resolvedWeek")}
          value={14}
          subtitle={t("vetModule.stats.resolvedSub")}
          icon={CheckCircle2}
          iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
      </div>

      {/* Main Grid: Priority Queue & GIS Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Triage Queue */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-black text-white">{t("vetModule.queue.title")}</h3>
                <p className="text-xs text-slate-400">{t("vetModule.queue.subtitle")}</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['all', 'pending', 'investigating', 'investigated'].map((st) => (
                  <button
                    key={t(`vetModule.queue.filters.${st}`)}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-bold text-[11px] transition ${
                      statusFilter === st ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t(`vetModule.queue.filters.${st}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by Ear-tag ID, species, farmer name, or village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Cases List */}
            <div className="space-y-3">
              {loading ? (
                <LoadingState message="Loading prioritized clinical cases from triage engine..." />
              ) : error ? (
                <ErrorState message={error} onRetry={fetchVetCases} />
              ) : filteredCases.length === 0 ? (
                <EmptyState
                  title={t("vetModule.queue.emptyTitle")}
                  description={statusFilter !== 'all' || searchTerm ? t("vetModule.queue.emptyFilter") : t("vetModule.queue.emptyAll")}
                />
              ) : (
                filteredCases.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 hover:border-slate-800 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-white text-sm">{c.animal_id}</span>
                          <RiskBadge level={t(`data.risk.${c.risk_level}`, {}, c.risk_level)} score={c.risk_score} />
                        </div>
                        <p className="text-xs text-slate-300 font-semibold mt-0.5">
                          {t(`data.breed.${c.breed}`) || c.breed} {t(`data.species.${t(`data.species.${c.species}`, {}, c.species)}`) || c.species} • {t("vetModule.queue.owner")}: <strong className="text-white">{c.farmer_name}</strong>
                        </p>
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{c.village}, {c.district}</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500 block">{t("vetModule.queue.caseId")} #{c.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize mt-1 inline-block ${
                          c.status === 'pending' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {t(`data.status.${t(`data.status.${c.status}`, {}, c.status)}`) || c.status}
                        </span>
                      </div>
                    </div>

                    {/* Symptoms Tags */}
                    <div className="flex flex-wrap gap-1">
                      {c.symptoms?.map((s, idx) => (
                        <span key={idx} className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded  font-medium">
                          {t(`data.symptom.${s}`) || s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-amber-300 font-bold truncate max-w-[240px]">
                        {t(`data.disease.${c.possible_disease_concern}`) || c.possible_disease_concern}
                      </span>

                      <div className="flex items-center space-x-2">
                        <Link to={`/vet/cases/${c.id}`}>
                          <Button size="sm" variant="outline" icon={ExternalLink} className="text-xs bg-slate-900 border-slate-700 text-slate-300">
                            Full Timeline
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setSelectedCase(c)}
                          className="text-xs bg-sky-600 hover:bg-sky-500 text-white font-bold"
                        >
                          Action Desk
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right 5 Cols: GIS Surveillance Map */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-white">{t("vetModule.map.radar")}</h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                {t("vetModule.map.location")}
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 h-80">
              <OutbreakMap />
            </div>
          </Card>
        </div>
      </div>

      {/* Case Action Modal */}
      {selectedCase && (
        <VetCaseModal
          caseData={selectedCase}
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          onSuccess={() => {
            fetchVetCases()
            setSelectedCase(null)
          }}
        />
      )}
    </div>
  )
}
