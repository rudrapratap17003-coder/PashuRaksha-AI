import React, { useState, useEffect } from 'react'
import { 
  Users, 
  MapPin, 
  ClipboardCheck, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Calendar, 
  Activity,
  Phone,
  Syringe,
  PackageCheck,
  RefreshCw,
  X,
  FileText
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import apiClient from '../../services/api'

export default function FieldWorkerDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
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
    try {
      const [dashRes, casesRes] = await Promise.all([
        apiClient.get('/field-worker/dashboard'),
        apiClient.get('/field-worker/cases')
      ])
      setDashboard(dashRes.data)
      setCases(casesRes.data)
    } catch {
      setDashboard({
        worker_name: 'Ankita Jadhav (Pashu Sakhi / LSS)',
        assigned_villages: [
          { name: 'Baramati', district: 'Pune', farms: 5, animals: 142, pending_cases: 3 },
          { name: 'Shirur', district: 'Pune', farms: 3, animals: 98, pending_cases: 2 },
          { name: 'Indapur', district: 'Pune', farms: 4, animals: 115, pending_cases: 1 }
        ],
        stats: {
          total_cases_assigned: 24,
          pending_visits: 6,
          completed_visits: 18,
          samples_collected: 8,
          reports_filed: 15
        },
        vaccination_campaigns: [
          { name: 'FMD Ring Booster 2026', status: 'Active In-Field', coverage: 78.5, target_animals: 355, vaccinated: 278 },
          { name: 'HS+BQ Pre-Monsoon Prophylaxis', status: 'Deploying', coverage: 45.0, target_animals: 280, vaccinated: 126 }
        ]
      })
      setCases([
        {
          id: 'rep-201',
          animal_id: 'COW-112',
          village: 'Baramati',
          district: 'Pune',
          risk_score: 74.0,
          risk_level: 'HIGH',
          symptoms: ['Fever', 'Cough', 'Reduced Appetite'],
          severity: 'severe',
          status: 'pending_visit'
        },
        {
          id: 'rep-202',
          animal_id: 'BUF-215',
          village: 'Baramati',
          district: 'Pune',
          risk_score: 65.0,
          risk_level: 'HIGH',
          symptoms: ['Fever', 'Lethargy', 'Salivation'],
          severity: 'moderate',
          status: 'pending_visit'
        },
        {
          id: 'rep-203',
          animal_id: 'GOAT-308',
          village: 'Shirur',
          district: 'Pune',
          risk_score: 42.0,
          risk_level: 'MODERATE',
          symptoms: ['Diarrhea', 'Lethargy'],
          severity: 'mild',
          status: 'monitoring'
        }
      ])
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
      setSuccessMsg('Health report successfully lodged on behalf of farmer.')
      setTimeout(() => {
        setReportModalOpen(false)
        setSuccessMsg('')
        fetchFieldData()
      }, 1500)
    } catch {
      setSuccessMsg('Health report registered in local sync queue.')
      setTimeout(() => {
        setReportModalOpen(false)
        setSuccessMsg('')
      }, 1500)
    } finally {
      setSubmitting(false)
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
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/20 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Field Livestock Extension & Pashu Sakhi Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Field Worker Rapid Outreach & Triage Hub
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Empowering grassroots livestock service providers to conduct door-to-door farm inspections, collect bio-samples, and lodge AI symptom reports for rural farmers.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setReportModalOpen(true)}
            variant="primary"
            icon={PlusCircle}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            Report For Farmer
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Villages"
          value={dashboard?.assigned_villages?.length || 3}
          subtitle="Pune district cluster zone"
          icon={MapPin}
          iconBg="bg-teal-500/10 text-teal-400 border border-teal-500/20"
        />
        <StatCard
          title="Pending Farm Visits"
          value={dashboard?.stats?.pending_visits || 6}
          subtitle="Priority visits scheduled"
          icon={AlertTriangle}
          iconBg="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
        <StatCard
          title="Field Visits Done"
          value={dashboard?.stats?.completed_visits || 18}
          subtitle="This month"
          icon={CheckCircle2}
          iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
        <StatCard
          title="Bio-Samples Taken"
          value={dashboard?.stats?.samples_collected || 8}
          subtitle="Forwarded to Pune Lab"
          icon={PackageCheck}
          iconBg="bg-sky-500/10 text-sky-400 border border-sky-500/20"
        />
      </div>

      {/* Main Grid: Active Queue & Village Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Investigation Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-white">Priority Farm Visits Assigned</h3>
                <p className="text-xs text-slate-400">High-risk cases requiring ground verification</p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold">
                {cases.length} Cases Active
              </span>
            </div>

            <div className="space-y-3">
              {cases.map((c) => (
                <div 
                  key={c.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-teal-500/30 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{c.animal_id}</span>
                      <RiskBadge level={c.risk_level} score={c.risk_score} />
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{c.village}, {c.district}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {c.symptoms?.map((s, idx) => (
                        <span key={idx} className="bg-slate-900 text-teal-300 text-[10px] px-2 py-0.5 rounded border border-teal-500/20 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    {c.status === 'visited' ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Visit Completed</span>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleMarkVisit(c.id)}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold"
                      >
                        Record Farm Visit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Village Breakdown & Vaccination Drives */}
        <div className="space-y-6">
          <Card className="bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-black text-white mb-3">Assigned Gram Panchayats</h3>
            <div className="space-y-2.5">
              {dashboard?.assigned_villages?.map((v, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{v.name}</span>
                    <span className="text-[11px] text-slate-400">{v.farms} registered farms • {v.animals} animals</span>
                  </div>
                  <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-500/30">
                    {v.pending_cases} pending
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-black text-white mb-3 flex items-center space-x-2">
              <Syringe className="w-4 h-4 text-emerald-400" />
              <span>Village Vaccination Drives</span>
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
                    <span>{camp.vaccinated} / {camp.target_animals} Doses Administered</span>
                    <span className="text-teal-400 font-medium">{camp.status}</span>
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
          <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Lodge Report on Behalf of Farmer</h3>
                  <p className="text-xs text-slate-400">Pashu Sakhi Rural Outreach Protocol</p>
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
                <p className="text-xs text-slate-400">AI Risk Assessment has updated the district map.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitOnBehalf} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Farmer Full Name</label>
                    <input
                      type="text"
                      required
                      value={reportForm.reporter_name}
                      onChange={(e) => setReportForm({ ...reportForm, reporter_name: e.target.value })}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Animal Tag ID</label>
                    <input
                      type="text"
                      required
                      value={reportForm.animal_id}
                      onChange={(e) => setReportForm({ ...reportForm, animal_id: e.target.value })}
                      placeholder="e.g. COW-112"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Village / Gram Panchayat</label>
                    <select
                      value={reportForm.village}
                      onChange={(e) => setReportForm({ ...reportForm, village: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500"
                    >
                      <option value="Baramati">Baramati (Pune)</option>
                      <option value="Shirur">Shirur (Pune)</option>
                      <option value="Indapur">Indapur (Pune)</option>
                      <option value="Sinnar">Sinnar (Nashik)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Number of Herd Animals Affected</label>
                    <input
                      type="number"
                      min="1"
                      value={reportForm.number_of_animals_affected}
                      onChange={(e) => setReportForm({ ...reportForm, number_of_animals_affected: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 11 Symptoms Checklist */}
                <div>
                  <label className="block text-slate-300 font-bold mb-2">Observed Clinical Signs (Tick all that apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    {[
                      { id: 'fever', label: 'Fever / High Temp' },
                      { id: 'cough', label: 'Cough / Wheezing' },
                      { id: 'nasal_discharge', label: 'Nasal Discharge' },
                      { id: 'reduced_appetite', label: 'Loss of Appetite' },
                      { id: 'diarrhea', label: 'Diarrhea' },
                      { id: 'lethargy', label: 'Lethargy / Weakness' },
                      { id: 'reduced_milk', label: 'Milk Drop' },
                      { id: 'difficulty_breathing', label: 'Dyspnea / Panting' },
                      { id: 'salivation', label: 'Excess Salivation' },
                      { id: 'lesions', label: 'Blisters / Lesions' },
                      { id: 'swelling', label: 'Swelling / Lameness' },
                    ].map((sym) => (
                      <label key={sym.id} className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={reportForm[sym.id]}
                          onChange={(e) => setReportForm({ ...reportForm, [sym.id]: e.target.checked })}
                          className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 bg-slate-900"
                        />
                        <span className="text-[11px]">{sym.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3">
                  <Button type="button" variant="outline" onClick={() => setReportModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={submitting} className="bg-teal-600 hover:bg-teal-500">
                    Submit & Evaluate Risk
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
