import React from 'react'
import { 
  Building2, 
  Map, 
  Radio, 
  BarChart3, 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  Syringe, 
  Download,
  Filter
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'

export default function AuthorityDashboard({ user }) {
  // Demo district summary for Phase 2 scaffold
  const villageStats = [
    { village: 'Rampur', district: 'Jaipur Rural', animals: 142, activeCases: 5, clusterStatus: 'CRITICAL HOTSPOT', riskScore: 84 },
    { village: 'Kalyanpura', district: 'Jaipur Rural', animals: 98, activeCases: 2, clusterStatus: 'WATCHLIST', riskScore: 42 },
    { village: 'Sanganer Outskirts', district: 'Jaipur Rural', animals: 210, activeCases: 1, clusterStatus: 'NORMAL', riskScore: 18 },
    { village: 'Amer North', district: 'Jaipur Rural', animals: 175, activeCases: 0, clusterStatus: 'NORMAL', riskScore: 8 },
  ]

  return (
    <div className="space-y-6">
      {/* Authority Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Animal Health &amp; Disease Surveillance Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            District Surveillance: Jaipur Rural
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitoring Officer: <strong>{user?.name || 'R. Verma (District Health Officer)'}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" icon={Download}>
            Export Report
          </Button>
          <Button variant="primary" size="sm" icon={Radio} className="bg-purple-600 hover:bg-purple-700">
            Broadcast Alert
          </Button>
        </div>
      </div>

      {/* Surveillance Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Livestock"
          value="625"
          subtitle="4 registered villages"
          icon={Users}
          iconBg="bg-slate-100 text-slate-700"
        />
        <StatCard
          title="Active Disease Reports"
          value="8"
          subtitle="Past 7 days"
          icon={AlertTriangle}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Detected Clusters"
          value="1"
          subtitle="Rampur Hotspot"
          icon={Radio}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="Vaccination Coverage"
          value="84.2%"
          subtitle="Target: >90%"
          icon={Syringe}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Outbreak Heatmap Placeholder Card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Map className="w-5 h-5 text-purple-600" />
              <span>Spatial Outbreak Risk Heatmap (Preview)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive Leaflet GIS map with village-level cluster centroids (Full Integration in Phase 12)
            </p>
          </div>
          <Badge variant="purple" size="sm">Leaflet GIS Ready</Badge>
        </div>

        {/* Heatmap visual mock container */}
        <div className="h-64 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 relative overflow-hidden flex items-center justify-center p-6 text-center text-white">
          <div className="space-y-3 max-w-md">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mx-auto text-purple-300 animate-pulse">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base">Geospatial Cluster Visualization Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Spatial density points centered at <strong>Rampur (26.9124° N, 75.7873° E)</strong> showing 4 correlated respiratory reports forming an active cluster.
            </p>
            <div className="flex justify-center gap-2 pt-1 text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                ● Rampur Hotspot (Critical)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                ● Sanganer (Clear)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Village Surveillance Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Village Risk Stratification Index</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">4 Villages Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Village</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Total Animals</th>
                <th className="py-3.5 px-4">Active Reports</th>
                <th className="py-3.5 px-4">Cluster Classification</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Risk Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {villageStats.map((v) => (
                <tr key={v.village} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                    {v.village}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{v.district}</td>
                  <td className="py-3.5 px-4">{v.animals}</td>
                  <td className="py-3.5 px-4 font-bold">{v.activeCases}</td>
                  <td className="py-3.5 px-4">
                    {v.clusterStatus === 'CRITICAL HOTSPOT' ? (
                      <Badge variant="danger" dot>{v.clusterStatus}</Badge>
                    ) : v.clusterStatus === 'WATCHLIST' ? (
                      <Badge variant="warning" dot>{v.clusterStatus}</Badge>
                    ) : (
                      <Badge variant="primary">{v.clusterStatus}</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <RiskBadge score={v.riskScore} level={v.riskScore > 75 ? 'CRITICAL' : v.riskScore > 30 ? 'MODERATE' : 'LOW'} />
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
