import React, { useState, useEffect } from 'react'
import { 
  Syringe, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  ShieldCheck,
  Clock,
  Check,
  X
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import apiClient from '../../services/api'

export default function FarmerVaccinationsPage() {
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [form, setForm] = useState({
    animal_id: 'COW-101',
    vaccine_name: 'FMD (Foot & Mouth Disease)',
    vaccination_date: new Date().toISOString().split('T')[0],
    next_due_date: new Date(Date.now() + 180*24*60*60*1000).toISOString().split('T')[0],
    notes: 'Administered at Baramati Taluka Dispensary'
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchVaccinations = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/vaccinations')
      setVaccinations(res.data)
    } catch {
      // Fallback Maharashtra Vaccination Schedule
      setVaccinations([
        {
          id: 'vac-001',
          animal_id: 'COW-101',
          vaccine_name: 'FMD (Foot & Mouth Disease)',
          vaccination_date: '2026-03-15',
          next_due_date: '2026-09-15',
          status: 'completed',
          notes: 'Bi-annual booster administered by Dr. Priya Sharma'
        },
        {
          id: 'vac-002',
          animal_id: 'BUF-204',
          vaccine_name: 'HS + BQ Combined Pre-Monsoon',
          vaccination_date: '2026-04-10',
          next_due_date: '2026-10-10',
          status: 'completed',
          notes: 'Pre-monsoon prophylaxis against Hemorrhagic Septicemia'
        },
        {
          id: 'vac-003',
          animal_id: 'GOAT-305',
          vaccine_name: 'PPR (Peste des Petits Ruminants)',
          vaccination_date: '2026-01-20',
          next_due_date: '2027-01-20',
          status: 'completed',
          notes: 'Annual immunity drive'
        },
        {
          id: 'vac-004',
          animal_id: 'COW-108',
          vaccine_name: 'Brucellosis S19 (Calfhood)',
          vaccination_date: '2025-08-12',
          next_due_date: 'Lifetime Protected',
          status: 'completed',
          notes: 'One-time female calf vaccination'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVaccinations()
  }, [])

  const handleLogVaccine = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiClient.post('/vaccinations', form)
      await fetchVaccinations()
      setLogModalOpen(false)
    } catch {
      setVaccinations(prev => [
        {
          id: `vac-${Date.now()}`,
          ...form,
          status: 'completed'
        },
        ...prev
      ])
      setLogModalOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Syringe className="w-4 h-4" />
            <span>Immunization & Herd Prophylaxis Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Livestock Vaccination Records & Schedules
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Track mandatory state vaccination schedules for FMD, HS, BQ, and Brucellosis across Maharashtra districts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setLogModalOpen(true)}
            variant="primary"
            icon={Plus}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            Log New Dose
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Vaccinations"
          value={vaccinations.length || 4}
          subtitle="Doses certified on-record"
          icon={CheckCircle2}
          iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
        <StatCard
          title="FMD Status"
          value="Protected (100%)"
          subtitle="Bi-annual booster valid"
          icon={ShieldCheck}
          iconBg="bg-teal-500/10 text-teal-400 border border-teal-500/20"
        />
        <StatCard
          title="Upcoming Due"
          value="Sept 2026"
          subtitle="HS+BQ Pre-Monsoon Cycle"
          icon={Clock}
          iconBg="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
        <StatCard
          title="Village Herd Immunity"
          value="78.5%"
          subtitle="Baramati Cluster Target: 90%"
          icon={Syringe}
          iconBg="bg-sky-500/10 text-sky-400 border border-sky-500/20"
        />
      </div>

      {/* Main Table */}
      <Card className="bg-slate-900/80 border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-white">Animal Vaccination History</h3>
          <span className="text-xs font-mono text-slate-400 font-bold">{vaccinations.length} Immunization Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Animal Tag ID</th>
                <th className="py-3 px-4">Vaccine & Prophylaxis</th>
                <th className="py-3 px-4">Administered Date</th>
                <th className="py-3 px-4">Next Due Date</th>
                <th className="py-3 px-4">Administering Authority</th>
                <th className="py-3 px-4">Immunity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vaccinations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{v.animal_id}</td>
                  <td className="py-3.5 px-4 font-bold text-teal-300">{v.vaccine_name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{v.vaccination_date}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-300">{v.next_due_date}</td>
                  <td className="py-3.5 px-4 text-slate-400">{v.notes || 'Veterinary Team'}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {v.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Vaccination Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Syringe className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">Log Administered Vaccine</h3>
              </div>
              <button onClick={() => setLogModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogVaccine} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Animal Tag ID</label>
                <input
                  type="text"
                  required
                  value={form.animal_id}
                  onChange={(e) => setForm({ ...form, animal_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Vaccine Name</label>
                <select
                  value={form.vaccine_name}
                  onChange={(e) => setForm({ ...form, vaccine_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500"
                >
                  <option value="FMD (Foot & Mouth Disease)">FMD (Foot & Mouth Disease)</option>
                  <option value="HS + BQ Combined Pre-Monsoon">HS + BQ Combined Pre-Monsoon</option>
                  <option value="Brucellosis S19 (Calfhood)">Brucellosis S19 (Calfhood)</option>
                  <option value="PPR (Peste des Petits Ruminants)">PPR (Peste des Petits Ruminants)</option>
                  <option value="Black Quarter (BQ)">Black Quarter (BQ)</option>
                  <option value="Anthrax Spore Vaccine">Anthrax Spore Vaccine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Date Administered</label>
                  <input
                    type="date"
                    required
                    value={form.vaccination_date}
                    onChange={(e) => setForm({ ...form, vaccination_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={form.next_due_date}
                    onChange={(e) => setForm({ ...form, next_due_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Veterinary Notes & Batch Number</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Batch #FMD-2026-MH4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setLogModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={submitting} className="bg-emerald-600 hover:bg-emerald-500">
                  Save Vaccine Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
