import React, { useState, useEffect } from 'react'
import { 
  FlaskConical, 
  TestTube2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Sparkles, 
  FileText, 
  Microscope,
  Send,
  X,
  RefreshCw,
  MapPin,
  Calendar,
  ShieldAlert,
  Radio
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateFeedback'
import apiClient from '../../services/api'

export default function LabDashboard() {
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({ pending: 0, received: 0, processing: 0, completed: 0, high_priority: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReferral, setSelectedReferral] = useState(null)
  const [resultModalOpen, setResultModalOpen] = useState(false)
  const [resultForm, setResultForm] = useState({
    status: 'completed',
    result: 'positive',
    result_notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState('')

  const fetchLabData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dashRes, refRes] = await Promise.all([
        apiClient.get('/lab/dashboard'),
        apiClient.get('/lab/referrals')
      ])
      setStats(dashRes.data || { pending: 0, received: 0, processing: 0, completed: 0, high_priority: 0 })
      setReferrals(Array.isArray(refRes.data) ? refRes.data : [])
    } catch (err) {
      console.warn('Failed to load lab data from backend:', err)
      setError(err?.response?.data?.detail || err?.message || 'Failed to fetch diagnostic referrals.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLabData()
  }, [])

  const handleUpdateResult = async (e) => {
    e.preventDefault()
    if (!selectedReferral) return
    setSubmitting(true)
    setError(null)
    try {
      await apiClient.put(`/lab/referrals/${selectedReferral.id}`, resultForm)
      await fetchLabData()
      setResultModalOpen(false)
      setNotice(`✅ Sample #${selectedReferral.id} updated successfully.`)
      setTimeout(() => setNotice(''), 5000)
    } catch (err) {
      console.error('Failed to update result:', err)
      alert('Failed to update findings. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredReferrals = referrals.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesSearch = 
      r.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.case_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.animal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sample_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.test_requested?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.village?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6 pb-32">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Microscope className="w-4 h-4" />
              <span>Maharashtra Disease Diagnostic Network • Pune Division</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Veterinary Pathology & Diagnostic Laboratory Desk
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-time biological sample accessioning, RT-PCR validation, and laboratory confirmation linked directly to the district outbreak containment registry.
            </p>
          </div>
          
          {/* Right Side System Status instead of blank space */}
          <div className="flex flex-col shrink-0 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm w-full md:w-72 space-y-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-2">Laboratory System Status</span>
             <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 flex items-center space-x-1.5"><Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> <span>LIMS Sync Network</span></span>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">ONLINE</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 flex items-center space-x-1.5"><FlaskConical className="w-3.5 h-3.5 text-sky-400" /> <span>PCR Thermal Cycler</span></span>
                <span className="text-[10px] font-black text-sky-400 bg-sky-950 px-2 py-0.5 rounded-full border border-sky-500/30">ACTIVE</span>
             </div>
             <Button 
                onClick={fetchLabData} 
                icon={RefreshCw}
                className="w-full mt-1 bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700 hover:bg-slate-700 text-xs py-1.5 shadow-none"
             >
                Sync & Refresh Queue
             </Button>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-400 text-white text-xs font-bold flex items-center space-x-2 animate-in fade-in shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Processing"
          value={stats.pending + stats.received}
          subtitle="Samples waiting testing"
          icon={Clock}
          iconBg="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
        <StatCard
          title="In Testing / PCR"
          value={stats.processing}
          subtitle="Active PCR/ELISA runs"
          icon={FlaskConical}
          iconBg="bg-sky-500/10 text-sky-400 border border-sky-500/20"
        />
        <StatCard
          title="Completed Results"
          value={stats.completed}
          subtitle="Confirmed pathogen reports"
          icon={CheckCircle2}
          iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
        <StatCard
          title="High Priority / Urgent"
          value={stats.high_priority}
          subtitle="Outbreak triage alert samples"
          icon={ShieldAlert}
          iconBg="bg-rose-500/10 text-rose-400 border border-rose-500/20"
        />
      </div>

      {/* Main Table & Filter Controls */}
      <Card className="bg-slate-900/80 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Animal ID, Test, Sample or Village..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-white text-xs pl-10 pr-4 py-2.5 rounded-xl placeholder-slate-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {['all', 'received', 'processing', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  statusFilter === st 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Samples Table / State Feedback */}
        {loading ? (
          <div className="py-8">
            <LoadingState message="Connecting to Diagnostic LIMS & fetching active test referrals..." />
          </div>
        ) : error ? (
          <div className="py-8">
            <ErrorState message={error} onRetry={fetchLabData} />
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="py-8">
            <EmptyState 
              title="No Diagnostic Referrals Found" 
              description={searchTerm || statusFilter !== 'all' ? "No referrals match the selected filters or search terms." : "All diagnostic bio-samples have been processed or none are pending."} 
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Sample Ref</th>
                  <th className="py-3 px-4">Animal / Location</th>
                  <th className="py-3 px-4">Sample Type & Test</th>
                  <th className="py-3 px-4">Referring Officer</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status & Result</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-emerald-300">{ref.id}</span>
                      <span className="block text-[11px] text-slate-400 font-medium">Case: {ref.case_id || 'Direct'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block text-[13px]">{ref.animal_id}</span>
                      <span className="text-[11px] text-slate-300 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{ref.village}, {ref.district}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-100 block text-[13px]">{ref.sample_type}</span>
                      <span className="text-[11px] text-teal-300 font-medium block">{ref.test_requested}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-medium">{ref.veterinarian_name || 'Taluka Vet'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                        ref.priority === 'urgent' 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                          : ref.priority === 'high' 
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {ref.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                          ref.status === 'completed' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : ref.status === 'processing' 
                            ? 'bg-sky-950 text-sky-300 border border-sky-500/30 animate-pulse'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {ref.status}
                        </span>
                        {ref.result !== 'pending' && (
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${
                            ref.result === 'positive' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {ref.result}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setSelectedReferral(ref)
                          setResultForm({
                            status: ref.status === 'pending' ? 'processing' : 'completed',
                            result: ref.result || 'positive',
                            result_notes: ref.result_notes || ''
                          })
                          setResultModalOpen(true)
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        Update Findings
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Result Entry Modal */}
      {resultModalOpen && selectedReferral && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setResultModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Record Diagnostic Findings</h3>
                <p className="text-xs text-slate-400">Sample #{selectedReferral.id} • Animal: {selectedReferral.animal_id}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateResult} className="space-y-4">
              {/* 1-Click Demo Fill */}
              <button
                type="button"
                onClick={() => {
                  setResultForm({
                    status: 'completed',
                    result: 'positive',
                    result_notes: 'POSITIVE - FMD Serotype O. Aphthovirus RNA confirmed via TaqMan RT-PCR (Ct: 21.4). Validated by Dr. Suhas Kulkarni.'
                  })
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Pre-Fill: POSITIVE - FMD Serotype O (Demo)</span>
              </button>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Test Requested:</span>
                  <span className="font-bold text-white">{selectedReferral.test_requested}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sample Matrix:</span>
                  <span className="font-bold text-teal-400">{selectedReferral.sample_type}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Testing Pipeline Status</label>
                <select
                  value={resultForm.status}
                  onChange={(e) => setResultForm({ ...resultForm, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="received">Sample Received & Registered</option>
                  <option value="processing">In Testing / Thermal Cycler Active</option>
                  <option value="completed">Testing Completed & Validated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Diagnostic Outcome</label>
                <div className="grid grid-cols-3 gap-2">
                  {['positive', 'negative', 'inconclusive'].map((res) => (
                    <button
                      type="button"
                      key={res}
                      onClick={() => setResultForm({ ...resultForm, result: res })}
                      className={`p-2.5 rounded-xl border text-xs font-black capitalize transition ${
                        resultForm.result === res 
                          ? res === 'positive' 
                            ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-950' 
                            : 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Pathologist / Virologist Notes</label>
                <textarea
                  rows="3"
                  value={resultForm.result_notes}
                  onChange={(e) => setResultForm({ ...resultForm, result_notes: e.target.value })}
                  placeholder="Record cycle threshold (Ct), bacterial strain isolated, or resistance profile..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setResultModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={submitting}>
                  Confirm & Sync Outbreak Engine
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
