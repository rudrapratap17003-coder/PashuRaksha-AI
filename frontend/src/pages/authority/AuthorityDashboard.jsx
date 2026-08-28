import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Syringe, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Layers,
  Radio,
  FileSpreadsheet,
  Activity
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import RiskBadge from '../../components/common/RiskBadge'
import OutbreakMap from '../../components/map/OutbreakMap'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function AuthorityDashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [clusters, setClusters] = useState([])
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [runningDetection, setRunningDetection] = useState(false)
  const [detectionNotice, setDetectionNotice] = useState(null)

  const fetchAuthorityData = async () => {
    setLoading(true)
    try {
      const [sumRes, clustRes, trendRes] = await Promise.allSettled([
        apiClient.get('/authority/dashboard'),
        apiClient.get('/clusters'),
        apiClient.get('/authority/trends'),
      ])

      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data)
      if (clustRes.status === 'fulfilled') setClusters(clustRes.value.data)
      if (trendRes.status === 'fulfilled') setTrends(trendRes.value.data)
    } catch (err) {
      console.error('Error loading authority data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthorityData()
  }, [])

  const handleRunClusterDetection = async () => {
    setRunningDetection(true)
    setDetectionNotice(null)
    try {
      const res = await apiClient.post('/clusters/run-detection')
      setClusters(res.data)
      setDetectionNotice(`Spatial-temporal clustering executed. ${res.data.length} active disease clusters updated in database.`)
      fetchAuthorityData()
    } catch (err) {
      setDetectionNotice('Failed to execute cluster detection')
    } finally {
      setRunningDetection(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              District Surveillance Portal
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
              Epidemic Intelligence Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Livestock Disease Surveillance Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Jurisdiction: <strong>Jaipur Rural District • Department of Animal Husbandry</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchAuthorityData}
            title="Refresh"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <Button
            onClick={handleRunClusterDetection}
            loading={runningDetection}
            icon={Sparkles}
            className="font-bold bg-purple-700 hover:bg-purple-600 text-white shadow-md shadow-purple-200"
          >
            Run Outbreak Detection
          </Button>
        </div>
      </div>

      {detectionNotice && (
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span>{detectionNotice}</span>
        </div>
      )}

      {/* District KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Monitored Livestock"
          value={summary?.total_monitored_animals || 625}
          subtitle="Across 4 Sub-districts"
          icon={Users}
          iconBg="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Health Reports"
          value={summary?.total_health_reports || 12}
          subtitle="Past 14 Days"
          icon={Activity}
          iconBg="bg-sky-50 text-sky-600"
        />
        <StatCard
          title="Active Clusters"
          value={clusters.length}
          subtitle="Spatial Hotspots"
          icon={Radio}
          iconBg={clusters.length > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"}
        />
        <StatCard
          title="Hotspot Villages"
          value={summary?.high_risk_villages_count || 1}
          subtitle="Critical Attention"
          icon={AlertTriangle}
          iconBg="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="Vaccination Rate"
          value={`${summary?.district_vaccination_rate || 84.2}%`}
          subtitle="District Coverage"
          icon={Syringe}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Geospatial Outbreak Map Section */}
      <Card className="space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-base">
                District Epidemiological GIS Heatmap ({clusters.length} Active Hotspots)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Interactive spatial-temporal cluster centroids and containment buffer zones
            </p>
          </div>
          <Badge variant="danger" dot>Real-time Haversine Detection</Badge>
        </div>

        <OutbreakMap
          clusters={clusters}
          height="440px"
          zoom={11}
        />
      </Card>

      {/* 2-Column Split: Village Risk Index & Epidemic Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Village Risk Stratification Table (2 Cols) */}
        <Card className="lg:col-span-2 p-0 overflow-hidden space-y-0">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-700" />
              <h3 className="font-bold text-slate-900 text-base">
                Village Risk Stratification Matrix
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              4 Villages Monitored
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Village</th>
                  <th className="py-3.5 px-4">Monitored Animals</th>
                  <th className="py-3.5 px-4">Active Reports</th>
                  <th className="py-3.5 px-4">Vaccine Coverage</th>
                  <th className="py-3.5 px-4">Risk Index</th>
                  <th className="py-3.5 px-4 sm:px-6">Cluster Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {summary?.villages?.map((v) => (
                  <tr key={v.village} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                      {v.village}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {v.monitored_animals}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {v.active_health_reports}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      {v.vaccination_coverage}%
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        v.risk_index >= 80 ? 'bg-rose-100 text-rose-800' :
                        v.risk_index >= 40 ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {v.risk_index}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <Badge variant={
                        v.cluster_status.includes('CRITICAL') ? 'danger' :
                        v.cluster_status.includes('WATCHLIST') ? 'warning' : 'primary'
                      }>
                        {v.cluster_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Multi-Day Epidemic Trend Visualizer (1 Col) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Epidemic Risk Trends (7 Days)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Daily Incidents</span>
          </div>

          <div className="space-y-2 pt-2">
            {trends.map((t) => (
              <div key={t.date} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>{t.date}</span>
                  <span>{t.low_risk_count + t.high_risk_count + t.critical_risk_count} cases</span>
                </div>
                
                {/* Multi-tier Stacked Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(t.low_risk_count / (t.low_risk_count + t.high_risk_count + t.critical_risk_count || 1)) * 100}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Low Risk: ${t.low_risk_count}`}
                  />
                  <div
                    style={{ width: `${(t.high_risk_count / (t.low_risk_count + t.high_risk_count + t.critical_risk_count || 1)) * 100}%` }}
                    className="bg-orange-500 h-full"
                    title={`High Risk: ${t.high_risk_count}`}
                  />
                  <div
                    style={{ width: `${(t.critical_risk_count / (t.low_risk_count + t.high_risk_count + t.critical_risk_count || 1)) * 100}%` }}
                    className="bg-rose-600 h-full"
                    title={`Critical Risk: ${t.critical_risk_count}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/><span>Low Risk</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block"/><span>High Risk</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-rose-600 inline-block"/><span>Critical</span></span>
          </div>
        </Card>

      </div>
    </div>
  )
}
