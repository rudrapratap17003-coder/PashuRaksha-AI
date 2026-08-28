import React, { useState, useEffect } from 'react'
import { Bell, AlertTriangle, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import apiClient from '../../services/api'

export default function FarmerAlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/alerts?role=farmer')
      setAlerts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Early Warning &amp; Surveillance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Community Health &amp; Outbreak Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Advisories for your village and nearby clusters to prevent disease spread
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          title="Refresh"
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.map((alt) => (
          <Card key={alt.id} className="p-5 border-amber-200 bg-gradient-to-r from-amber-50/70 via-white to-white space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    {alt.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span>Village: <strong>{alt.village || 'Rampur'}</strong></span>
                    <span>•</span>
                    <span>Target: Farmers</span>
                  </div>
                </div>
              </div>
              <Badge variant={alt.risk_level === 'CRITICAL' ? 'danger' : 'warning'}>
                {alt.risk_level}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-13">
              {alt.message}
            </p>

            <div className="pl-13 pt-1 text-[11px] text-amber-800 font-semibold flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Recommended Action: Observe livestock vitals and report any fever or respiratory symptoms immediately.</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
