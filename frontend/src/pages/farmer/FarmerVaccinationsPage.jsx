import React, { useState, useEffect } from 'react'
import { Syringe, Plus, Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import apiClient from '../../services/api'

export default function FarmerVaccinationsPage() {
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVaccinations = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/vaccinations')
      setVaccinations(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVaccinations()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Immunization &amp; Disease Prevention
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Vaccination Schedules &amp; Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track mandatory and seasonal vaccines for FMD, HS, BQ, and Brucellosis
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchVaccinations}
            title="Refresh"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Vaccination Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Syringe className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Recorded Vaccinations
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {vaccinations.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Animal ID</th>
                <th className="py-3.5 px-4">Vaccine Name</th>
                <th className="py-3.5 px-4">Administered Date</th>
                <th className="py-3.5 px-4">Next Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {vaccinations.map((vac) => (
                <tr key={vac.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                    {vac.animal_id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">
                    {vac.vaccine_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {vac.vaccination_date || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {vac.next_due_date || 'Annual schedule'}
                  </td>
                  <td className="py-3.5 px-4">
                    {vac.status === 'due' || vac.status === 'overdue' ? (
                      <Badge variant="warning" dot>Due Soon</Badge>
                    ) : (
                      <Badge variant="primary" dot>Completed</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-500">
                    {vac.notes || 'Routine immunization'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
