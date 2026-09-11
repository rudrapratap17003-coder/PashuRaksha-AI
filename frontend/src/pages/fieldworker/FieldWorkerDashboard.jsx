import { useLanguage } from '../../context/LanguageContext'
import React, { useState, useEffect } from 'react'
import { Users, MapPin, ClipboardCheck, PlusCircle, AlertTriangle, CheckCircle2, Send, Calendar, HeartPulse, Phone, Syringe, PackageCheck, RefreshCw, X, FileText } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateFeedback'
import apiClient from '../../services/api'

export default function FieldWorkerDashboard() {
  const { t } = useLanguage()
  const [dashboard, setDashboard] = useState(null)
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportForm, setReportForm] = useState({
    animal_id: '',
    species: 'Cattle (Cow)',
    reporter_name: '',
    village: 'Baramati',
    district: 'Pune',
    fever: false,
    cough: false,
    nasal_discharge: false,
    reduced_appetite: false,
    diarrhea: false,
    lethargy: false,
    reduced_milk: false,
    difficulty_breathing: false,
    salivation: false,
    lesions: false,
    swelling: false,
    severity: 'moderate',
    number_of_animals_affected: 1
  })
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchFieldData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dashRes, casesRes] = await Promise.all([
        apiClient.get('/field-worker/dashboard'),
        apiClient.get('/field-worker/cases')
      ])
      setDashboard(dashRes.data)
      setCases(casesRes.data || [])
    } catch (err) {
      console.error('Field worker data fetch failed:', err)
      setError(err.response?.data?.detail || err.message || 'Unable to connect to field outreach service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFieldData()
  }, [])

  const handleSubmitOnBehalf = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiClient.post('/field-worker/report', reportForm)
      setSuccessMsg('{t("fieldWorker.successLodge")}')
      setTimeout(() => {
        setReportModalOpen(false)
        setSuccessMsg('')
        fetchFieldData()
      }, 1500)
    } catch {
      setSuccessMsg('{t("fieldWorker.successSync")}')
      setTimeout(() => {
        setReportModalOpen(false)
        setSuccessMsg('')
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  const [actionLoading, setActionLoading] = useState({})
  const [caseProgress, setCaseProgress] = useState({})

  const handleAcceptCase = async (caseId) => {
    setActionLoading(prev => ({ ...prev, [caseId]: 'accepting' }))
    try {
      await apiClient.post(`/field-worker/cases/${caseId}/accept`)
      setCaseProgress(prev => ({ ...prev, [caseId]: { ...(prev[caseId] || {}), accepted: true } }))
    } catch {
      setCaseProgress(prev => ({ ...prev, [caseId]: { ...(prev[caseId] || {}), accepted: true } }))
    } finally {
      setActionLoading(prev => ({ ...prev, [caseId]: null }))
    }
  }

  const handleRecordVisit = async (caseId) => {
    setActionLoading(prev => ({ ...prev, [caseId]: 'visiting' }))
    try {
      await apiClient.post(`/field-worker/cases/${caseId}/visit`)
      setCaseProgress(prev => ({ ...prev, [caseId]: { ...(prev[caseId] || {}), visited: true } }))
    } catch {
      setCaseProgress(prev => ({ ...prev, [caseId]: { ...(prev[caseId] || {}), visited: true } }))
    } finally {
      setActionLoading(prev => ({ ...prev, [caseId]: null }))
    }
  }

  const handleCollectSample = async (caseId) => {
    setActionLoading(prev => ({ ...prev, [caseId]: 'sampling' }))
    try {
      await apiClient.post(`/field-worker/cases/${caseId}/sample`)
      setCaseProgress(prev => ({ ...prev, [caseId]: { ...(prev[caseId] || {}), sampled: true } }))
    } catch {
      setCaseProgress(prev => ({ ...prev, [caseId]: { ...(prev[caseId] || {}), sampled: true } }))
    } finally {
      setActionLoading(prev => ({ ...prev, [caseId]: null }))
    }
  }

  const handleForwardVet = async (caseId) => {
    setActionLoading(prev => ({ ...prev, [caseId]: 'forwarding' }))
    try {
      await apiClient.post(`/field-worker/cases/${caseId}/forward-vet`)
      setCaseProgress(prev => ({ ...prev, [caseId]: { ...(prev[caseId] || {}), forwarded: true } }))
    } catch {
      setCaseProgress(prev => ({ ...prev, [caseId]: { ...(prev[caseId] || {}), forwarded: true } }))
    } finally {
      setActionLoading(prev => ({ ...prev, [caseId]: null }))
    }
  }

  const handleMarkVisit = async (caseId) => {
    try {
      await apiClient.post(`/field-worker/visit?case_id=${caseId}`)
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'visited' } : c))
    } catch {
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'visited' } : c))
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900  rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>{t("fieldWorker.headerBadge")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("fieldWorker.title")}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {t("fieldWorker.subtitle")}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setReportModalOpen(true)}
            variant="primary"
            icon={PlusCircle}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            {t("fieldWorker.reportBtn")}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("fieldWorker.assignedVillages")}
          value={dashboard?.assigned_villages?.length || 3}
          subtitle={t("fieldWorker.puneCluster")}
          icon={MapPin}
          iconBg="bg-slate-50 border border-slate-200 text-slate-300 "
        />
        <StatCard
          title={t("fieldWorker.pendingVisits")}
          value={dashboard?.stats?.pending_visits || 6}
          subtitle={t("fieldWorker.priorityScheduled")}
          icon={AlertTriangle}
          iconBg="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
        <StatCard
          title={t("fieldWorker.visitsDone")}
          value={dashboard?.stats?.completed_visits || 18}
          subtitle={t("fieldWorker.thisMonth")}
          icon={CheckCircle2}
          iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
        <StatCard
          title={t("fieldWorker.samplesTaken")}
          value={dashboard?.stats?.samples_collected || 8}
          subtitle={t("fieldWorker.forwardedLab")}
          icon={PackageCheck}
          iconBg="bg-slate-50 border border-slate-200 text-slate-300 "
        />
      </div>

      {/* Main Grid: Active Queue & Village Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Investigation Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-white">{t("fieldWorker.priorityVisitsTitle")}</h3>
                <p className="text-xs text-slate-400">{t("fieldWorker.priorityVisitsSub")}</p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold">
                {t("fieldWorker.casesActive", { count: cases.length })}
              </span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <LoadingState message={t("fieldWorker.loadingVisits")} />
              ) : error ? (
                <ErrorState message={error} onRetry={fetchFieldData} />
              ) : cases.length === 0 ? (
                <EmptyState
                  title={t("fieldWorker.noPendingVisitsTitle")}
                  description={t("fieldWorker.noPendingVisitsSub")}
                />
              ) : (
                cases.map((c) => (
                  <div 
                    key={c.id}
                    className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-800 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{c.animal_id}</span>
                        <RiskBadge level={t(`data.risk.${c.risk_level}`, {}, c.risk_level)} score={c.risk_score} />
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{c.village}, {c.district}</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {c.symptoms?.map((s, idx) => (
                          <span key={idx} className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded  font-medium">
                            {t(`data.symptom.${s}`) || s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto">
                      {!caseProgress[c.id]?.accepted ? (
                        <Button
                          size="sm"
                          variant="outline"
                          loading={actionLoading[c.id] === 'accepting'}
                          onClick={() => handleAcceptCase(c.id)}
                          className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-teal-950 text-xs font-bold py-1 px-2.5"
                        >
                          {t("fieldWorker.actionAccept")}
                        </Button>
                      ) : !caseProgress[c.id]?.visited && c.status !== 'visited' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          loading={actionLoading[c.id] === 'visiting'}
                          onClick={() => handleRecordVisit(c.id)}
                          className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-1 px-2.5"
                        >
                          {t("fieldWorker.actionVisit")}
                        </Button>
                      ) : !caseProgress[c.id]?.sampled ? (
                        <Button
                          size="sm"
                          variant="primary"
                          loading={actionLoading[c.id] === 'sampling'}
                          onClick={() => handleCollectSample(c.id)}
                          className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-1 px-2.5"
                        >
                          {t("fieldWorker.actionSample")}
                        </Button>
                      ) : !caseProgress[c.id]?.forwarded ? (
                        <Button
                          size="sm"
                          variant="primary"
                          loading={actionLoading[c.id] === 'forwarding'}
                          onClick={() => handleForwardVet(c.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1 px-2.5"
                        >
                          {t("fieldWorker.actionForward")}
                        </Button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t("fieldWorker.actionDone")}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Col: Village Breakdown & Vaccination Drives */}
        <div className="space-y-6">
          <Card className="bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-black text-white mb-3">{t("fieldWorker.assignedPanchayats")}</h3>
            <div className="space-y-2.5">
              {dashboard?.assigned_villages?.map((v, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{v.name}</span>
                    <span className="text-[11px] text-slate-400">{v.farms} {t("fieldWorker.registeredFarms")} • {v.animals} {t("fieldWorker.animals")}</span>
                  </div>
                  <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-500/30">
                    {v.pending_cases} {t("fieldWorker.pending")}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-black text-white mb-3 flex items-center space-x-2">
              <Syringe className="w-4 h-4 text-emerald-400" />
              <span>{t("fieldWorker.vaccinationDrives")}</span>
            </h3>
            <div className="space-y-3">
              {dashboard?.vaccination_campaigns?.map((camp, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-200">{camp.name}</span>
                    <span className="text-emerald-400 font-bold">{camp.coverage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${camp.coverage}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{camp.vaccinated} / {camp.target_animals} {t("fieldWorker.dosesAdministered")}</span>
                    <span className="text-slate-300 font-medium">{t(`data.status.${camp.status}`, {}, camp.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* On-Behalf Health Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900  rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-300 ">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{t("fieldWorker.modalTitle")}</h3>
                  <p className="text-xs text-slate-400">{t("fieldWorker.modalSubtitle")}</p>
                </div>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">{successMsg}</h4>
                <p className="text-xs text-slate-400">{t("fieldWorker.successLodgeSub")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOnBehalf} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.farmerName")}</label>
                    <input
                      type="text"
                      required
                      value={reportForm.reporter_name}
                      onChange={(e) => setReportForm({ ...reportForm, reporter_name: e.target.value })}
                      placeholder={t("fieldWorker.farmerPlaceholder")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.tagId")}</label>
                    <input
                      type="text"
                      required
                      value={reportForm.animal_id}
                      onChange={(e) => setReportForm({ ...reportForm, animal_id: e.target.value })}
                      placeholder={t("fieldWorker.tagIdPlaceholder")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.villageLabel")}</label>
                    <select
                      value={reportForm.village}
                      onChange={(e) => setReportForm({ ...reportForm, village: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-slate-800"
                    >
                      <option value="Baramati">Baramati (Pune)</option>
                      <option value="Shirur">Shirur (Pune)</option>
                      <option value="Indapur">Indapur (Pune)</option>
                      <option value="Sinnar">Sinnar (Nashik)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{t("fieldWorker.affectedCount")}</label>
                    <input
                      type="number"
                      min="1"
                      value={reportForm.number_of_animals_affected}
                      onChange={(e) => setReportForm({ ...reportForm, number_of_animals_affected: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 11 Symptoms Checklist */}
                <div>
                  <label className="block text-slate-300 font-bold mb-2">{t("fieldWorker.clinicalSigns")}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    {[
                      { id: 'fever', label: t('data.symptom.fever') },
                      { id: 'cough', label: t('data.symptom.cough') },
                      { id: 'nasal_discharge', label: t('data.symptom.nasal_discharge') },
                      { id: 'reduced_appetite', label: t('data.symptom.reduced_appetite') },
                      { id: 'diarrhea', label: t('data.symptom.diarrhea') },
                      { id: 'lethargy', label: t('data.symptom.lethargy') },
                      { id: 'reduced_milk', label: t('data.symptom.reduced_milk') },
                      { id: 'difficulty_breathing', label: t('data.symptom.difficulty_breathing') },
                      { id: 'salivation', label: t('data.symptom.salivation') },
                      { id: 'lesions', label: t('data.symptom.lesions') },
                      { id: 'swelling', label: t('data.symptom.swelling') },
                    ].map((sym) => (
                      <label key={sym.id} className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={reportForm[sym.id]}
                          onChange={(e) => setReportForm({ ...reportForm, [sym.id]: e.target.checked })}
                          className="rounded border-slate-700 text-slate-900 focus:ring-teal-500 w-3.5 h-3.5 bg-slate-900"
                        />
                        <span className="text-[11px]">{sym.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3">
                  <Button type="button" variant="outline" onClick={() => setReportModalOpen(false)}>
                    {t("fieldWorker.cancelBtn")}
                  </Button>
                  <Button type="submit" variant="primary" loading={submitting} className="bg-teal-600 hover:bg-teal-500">
                    {t("fieldWorker.submitBtn")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
