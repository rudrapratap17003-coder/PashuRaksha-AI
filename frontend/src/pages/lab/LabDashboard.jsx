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
  ShieldAlert
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import apiClient from '../../services/api'

export default function LabDashboard() {
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({ pending: 0, received: 0, processing: 0, completed: 0, high_priority: 0 })
  const [loading, setLoading] = useState(true)
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

  const fetchLabData = async () => {
    setLoading(true)
    try {
      const [dashRes, refRes] = await Promise.all([
        apiClient.get('/lab/dashboard'),
        apiClient.get('/lab/referrals')
      ])
      setStats(dashRes.data)
      setReferrals(refRes.data)
    } catch {
      // Fallback Maharashtra demo data
      setStats({ pending: 2, received: 2, processing: 2, completed: 2, high_priority: 4 })
      setReferrals([
        {
          id: 'lab-001',
          case_id: 'rep-101',
          animal_id: 'COW-101',
          sample_type: 'Nasal Swab',
          test_requested: 'RT-PCR for BVD/IBR Respiratory Complex',
          priority: 'high',
          veterinarian_name: 'Dr. Priya Sharma',
          village: 'Baramati',
          district: 'Pune',
          status: 'completed',
          result: 'positive',
          result_notes: 'BVD virus RNA confirmed via TaqMan RT-PCR (Ct: 22.4). Highly contagious.',
          collection_date: '2026-08-28T10:00:00'
        },
        {
          id: 'lab-002',
          case_id: 'rep-102',
          animal_id: 'BUF-102',
          sample_type: 'Epithelial Swab',
          test_requested: 'FMD Virus Serotyping (ELISA + RT-PCR)',
          priority: 'urgent',
          veterinarian_name: 'Dr. Priya Sharma',
          village: 'Baramati',
          district: 'Pune',
          status: 'processing',
          result: 'pending',
          collection_date: '2026-08-29T14:30:00'
        },
        {
          id: 'lab-003',
          case_id: 'rep-104',
          animal_id: 'GOAT-104',
          sample_type: 'Blood (EDTA)',
          test_requested: 'Pasteurella multocida Culture & Gram Staining',
          priority: 'high',
          veterinarian_name: 'Dr. Arun Joshi',
          village: 'Shirur',
          district: 'Pune',
          status: 'received',
          result: 'pending',
          collection_date: '2026-08-29T16:00:00'
        },
        {
          id: 'lab-004',
          case_id: 'rep-105',
          animal_id: 'COW-105',
          sample_type: 'Milk Sample',
          test_requested: 'California Mastitis Test (CMT) & Antibiogram',
          priority: 'normal',
          veterinarian_name: 'Dr. Meena Kulkarni',
          village: 'Sinnar',
          district: 'Nashik',
          status: 'completed',
          result: 'positive',
          result_notes: 'Staphylococcus aureus isolated. Ceftriaxone sensitivity confirmed.',
          collection_date: '2026-08-26T11:00:00'
        }
      ])
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
    try {
      await apiClient.put(`/lab/referrals/${selectedReferral.id}`, resultForm)
      await fetchLabData()
      setResultModalOpen(false)
    } catch {
      // Local optimistic update
      setReferrals(prev => prev.map(r => r.id === selectedReferral.id ? { ...r, ...resultForm } : r))
      setResultModalOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredReferrals = referrals.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesSearch = 
      r.animal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sample_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.test_requested?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.village?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6 pb-12">
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
          <Button 
            onClick={fetchLabData} 
            variant="outline" 
            icon={RefreshCw}
            className="self-start md:self-auto bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800"
          >
            Refresh Queue
          </Button>
        </div>
      </div>

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

        {/* Samples Table */}
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
                    <span className="font-mono font-bold text-emerald-400">{ref.id}</span>
                    <span className="block text-[10px] text-slate-500">Case: {ref.case_id || 'Direct'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{ref.animal_id}</span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{ref.village}, {ref.district}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-200 block">{ref.sample_type}</span>
                    <span className="text-[11px] text-teal-400 block">{ref.test_requested}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300">{ref.veterinarian_name || 'Taluka Vet'}</span>
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
          {filteredReferrals.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Microscope className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p>No diagnostic referrals found matching your query.</p>
            </div>
          )}
        </div>
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
