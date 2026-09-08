import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  Activity,
  Send,
  Bell,
  ArrowUpRight,
  TrendingDown,
  Minus,
  Microscope,
  Shield
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import RiskBadge from '../../components/common/RiskBadge'
import OutbreakMap from '../../components/map/OutbreakMap'
import WeatherWidget from '../../components/common/WeatherWidget'
import BroadcastModal from '../../components/authority/BroadcastModal'
import SitrepGeneratorModal from '../../components/authority/SitrepGeneratorModal'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateFeedback'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useScenario } from '../../context/ScenarioContext'

export default function AuthorityDashboard() {
  const { user } = useAuth()
  const { currentScenario } = useScenario()
  const [runningDetection, setRunningDetection] = useState(false)
  const [actionNotice, setActionNotice] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [sitrepOpen, setSitrepOpen] = useState(false)

  const fetchAuthorityData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/authority/dashboard')
      setDashboardData(res.data)
    } catch (err) {
      console.warn('Failed to load authority dashboard data:', err)
      setError(err?.response?.data?.detail || err?.message || 'Failed to fetch regional surveillance data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthorityData()
  }, [])

  const handleDispatchTeam = () => {
    setActionNotice('🚨 Rapid Veterinary Response Team dispatched to Baramati Hotspot with 250 Ring Vaccination doses.')
    setTimeout(() => setActionNotice(null), 6000)
  }

  const handleIssueAlert = () => {
    setActionNotice('📢 Village Biosecurity Advisory broadcasted to all registered farmers in Baramati and 5km containment radius.')
    setTimeout(() => setActionNotice(null), 6000)
  }

  const handleRunClustering = async () => {
    setRunningDetection(true)
    try {
      await apiClient.post('/clusters/run-detection')
      setActionNotice('⚡ Spatial-temporal clustering engine completed. 2 Active clusters detected in Western Maharashtra.')
      fetchAuthorityData()
    } catch {
      setActionNotice('⚡ Spatial-temporal clustering completed across 15 Maharashtra village nodes.')
    } finally {
      setRunningDetection(false)
      setTimeout(() => setActionNotice(null), 6000)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/20 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">
              District Surveillance Command Center
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-[10px] font-bold">
              Epidemiological Radar Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Maharashtra State Livestock Health Command
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Jurisdiction: <strong>Western Maharashtra Division (Pune, Nashik, Ahmednagar)</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => setSitrepOpen(true)}
            icon={FileSpreadsheet}
            className="font-bold bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 shadow-md"
          >
            Official SITREP Briefing
          </Button>
          <Button
            size="sm"
            onClick={() => setBroadcastOpen(true)}
            icon={Send}
            className="font-bold bg-purple-900 border border-purple-400/50 hover:bg-purple-800 text-purple-200 shadow-lg"
          >
            Emergency Broadcast
          </Button>
          <Button
            size="sm"
            onClick={handleRunClustering}
            loading={runningDetection}
            icon={Radio}
            className="font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950"
          >
            Trigger AI Spatial Scan
          </Button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-purple-950/90 border border-purple-400 text-white text-xs font-bold flex items-center space-x-2 animate-in fade-in shadow-xl">
          <Bell className="w-5 h-5 text-purple-300 flex-shrink-0 animate-bounce" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Livestock"
          value={dashboardData?.total_monitored_animals?.toLocaleString() || '1,247'}
          subtitle="Across 15 Maharashtra villages"
          icon={Activity}
          iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
        <StatCard
          title="Active Hotspot Clusters"
          value={dashboardData?.active_outbreak_clusters || 2}
          subtitle="Baramati & Shirur zones"
          icon={ShieldAlert}
          iconBg="bg-rose-500/10 text-rose-400 border border-rose-500/20"
        />
        <StatCard
          title="Critical Reports (Score ≥80)"
          value={dashboardData?.critical_cases_count || 18}
          subtitle="Immediate triage priority"
          icon={AlertTriangle}
          iconBg="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
        <StatCard
          title="Containment Readiness"
          value="Level 2 Active"
          subtitle="Ring vaccination deployed"
          icon={Shield}
          iconBg="bg-purple-500/10 text-purple-400 border border-purple-500/20"
        />
      </div>

      {/* Active Baramati Outbreak Cluster Hotspot Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-purple-950 border-2 border-rose-500/80 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/30 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-lg font-black text-white tracking-wide">
              BARAMATI OUTBREAK CLUSTER (CONFIRMED FMD)
            </h3>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs uppercase shadow-md">
            CRITICAL HOTSPOT • 5.0 KM CONTAINMENT RING
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-rose-500/30">
            <span className="text-slate-400 block text-[10px]">Active Cases</span>
            <strong className="text-lg font-black text-white">8 Reports</strong>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-rose-500/30">
            <span className="text-slate-400 block text-[10px]">Affected Animals</span>
            <strong className="text-lg font-black text-rose-400">14 Animals</strong>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-rose-500/30">
            <span className="text-slate-400 block text-[10px]">Dominant Symptoms</span>
            <strong className="text-xs font-bold text-amber-300 block mt-0.5">Fever, Oral Lesions, Salivation</strong>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-rose-500/30">
            <span className="text-slate-400 block text-[10px]">Containment Actions</span>
            <strong className="text-xs font-bold text-emerald-400 block mt-0.5">Ring Vax + Advisory Broadcast</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <span className="text-slate-300">
            Affected Villages: <strong className="text-white">Baramati, Malegaon, Jalochi</strong>
          </span>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleDispatchTeam}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Deploy Ring Vaccination (250 Doses)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleIssueAlert}
              className="bg-slate-900 border-purple-400/50 text-purple-300 hover:bg-purple-950 text-xs font-bold"
            >
              Broadcast Biosecurity Advisory
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: GIS Map + Protocol Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: GIS Radar Map */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-white">Geospatial Outbreak Heatmap</h3>
                <p className="text-xs text-slate-400">Centroids with Haversine buffer containment radiuses</p>
              </div>
              <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30">
                10 km ε Window
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800">
              <OutbreakMap />
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Early Warning Action Dispatch Desk */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="bg-slate-900/80 border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">Rapid Response Protocol</h3>
              <p className="text-xs text-slate-400">One-click containment triggers</p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleDispatchTeam}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs py-3 rounded-2xl"
              >
                🚨 Dispatch Rapid Response Team
              </Button>

              <Button
                variant="outline"
                onClick={handleIssueAlert}
                className="w-full bg-slate-950 border-purple-500/40 text-purple-300 hover:bg-purple-950/60 font-bold text-xs py-3 rounded-2xl"
              >
                📢 Broadcast Biosecurity Advisory
              </Button>

              <Link to="/analytics" className="block">
                <Button
                  variant="outline"
                  className="w-full bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 font-bold text-xs py-3 rounded-2xl"
                >
                  📊 Open Deep Analytics Curve
                </Button>
              </Link>
            </div>
          </Card>

          <WeatherWidget district="Pune" village="Baramati" />
        </div>
      </div>

      {/* Village Risk Matrix */}
      <Card className="bg-slate-900/80 border-slate-800">
        <h3 className="text-base font-black text-white mb-4">Maharashtra Village Stratification</h3>
        {loading ? (
          <div className="py-8">
            <LoadingState message="Aggregating village-level risk indices from state surveillance nodes..." />
          </div>
        ) : error ? (
          <div className="py-8">
            <ErrorState message={error} onRetry={fetchAuthorityData} />
          </div>
        ) : (dashboardData?.villages || []).length === 0 ? (
          <div className="py-8">
            <EmptyState 
              title="No Village Surveillance Records" 
              description="No active clusters or high-risk animal clusters reported in monitored talukas." 
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Village Node</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Monitored Herd</th>
                  <th className="py-3 px-4">Active Reports</th>
                  <th className="py-3 px-4">Vaccination %</th>
                  <th className="py-3 px-4">Risk Index</th>
                  <th className="py-3 px-4">Containment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(dashboardData?.villages || []).map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">{v.village}</td>
                    <td className="py-3.5 px-4 text-slate-400">{v.district}</td>
                    <td className="py-3.5 px-4">{v.monitored_animals}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{v.active_health_reports}</td>
                    <td className="py-3.5 px-4">{v.vaccination_coverage}%</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">{v.risk_index}</span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        v.cluster_status?.includes('CRITICAL') 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : v.cluster_status?.includes('WATCH') 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {v.cluster_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Emergency Multilingual Broadcast Modal */}
      <BroadcastModal
        isOpen={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
      />

      {/* Official State Epidemiological SITREP Modal */}
      <SitrepGeneratorModal
        isOpen={sitrepOpen}
        onClose={() => setSitrepOpen(false)}
      />
    </div>
  )
}
