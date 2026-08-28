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
  CloudSun,
  Send,
  Bell,
  ArrowUpRight,
  TrendingDown,
  Minus
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import RiskBadge from '../../components/common/RiskBadge'
import OutbreakMap from '../../components/map/OutbreakMap'
import LiveSurveillanceStrip from '../../components/common/LiveSurveillanceStrip'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useScenario } from '../../context/ScenarioContext'

export default function AuthorityDashboard() {
  const { user } = useAuth()
  const { scenarioData, currentScenario, setScenario, scenarios } = useScenario()
  const [runningDetection, setRunningDetection] = useState(false)
  const [actionNotice, setActionNotice] = useState(null)

  const isCritical = currentScenario === 'RAMPUR_OUTBREAK'

  const handleDispatchTeam = () => {
    setActionNotice('🚨 Rapid Veterinary Response Team dispatched to Rampur with 250 Ring Vaccination doses.')
    setTimeout(() => setActionNotice(null), 5000)
  }

  const handleIssueAlert = () => {
    setActionNotice('📢 Village Biosecurity Advisory broadcasted to all farmers in Rampur and surrounding 5 km perimeter.')
    setTimeout(() => setActionNotice(null), 5000)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">
              District Surveillance Command Center
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-[10px] font-bold">
              Epidemiological Intelligence Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Livestock Disease Surveillance Command
          </h1>
          <p className="text-xs text-slate-300">
            Jurisdiction: <strong>Jaipur Rural District • Department of Animal Husbandry</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/presentation">
            <Button
              size="sm"
              icon={Sparkles}
              className="font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
            >
              Jury Presentation Mode →
            </Button>
          </Link>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-purple-950/90 border border-purple-400 text-white text-xs font-bold flex items-center space-x-2 animate-in fade-in shadow-xl">
          <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* District KPI Summary Strip */}
      <LiveSurveillanceStrip />

      {/* Central Interactive GIS Outbreak Map with Early Warning Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Large GIS Map (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white text-base">
                  District GIS Surveillance Canvas ({scenarioData.clusters.length} Active Hotspots)
                </h3>
              </div>
              <Badge variant={isCritical ? 'danger' : 'primary'} dot>
                {isCritical ? 'Hotspot Radius: 2.8 km' : 'Normal Baseline'}
              </Badge>
            </div>

            <OutbreakMap
              clusters={scenarioData.clusters}
              height="450px"
              zoom={11}
            />
          </Card>
        </div>

        {/* Early Warning Action Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className={`p-5 space-y-4 border ${
            isCritical
              ? 'bg-gradient-to-b from-rose-950/80 to-[#092923] border-rose-500/40'
              : 'bg-[#092923] border-emerald-500/20'
          }`}>
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className={`w-5 h-5 ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`} />
                <h3 className="font-black text-sm text-white uppercase tracking-wider">
                  {isCritical ? '🔴 HIGH PRIORITY OUTBREAK' : '🟢 Surveillance Status'}
                </h3>
              </div>
              <Badge variant={isCritical ? 'danger' : 'primary'} size="sm">
                {isCritical ? 'ACTION REQUIRED' : 'STABLE'}
              </Badge>
            </div>

            {isCritical ? (
              <div className="space-y-3 text-xs">
                <p className="text-rose-200 font-bold leading-snug">
                  Potential vesicular &amp; respiratory disease cluster detected in Rampur village.
                </p>
                <div className="p-3 bg-[#061B17] rounded-xl border border-rose-500/30 space-y-1 text-slate-300">
                  <div>Reports: <strong className="text-white">13 Cases (9 Similar)</strong></div>
                  <div>At Risk: <strong className="text-white">37 Livestock in Herd</strong></div>
                  <div>Cluster Confidence: <strong className="text-rose-400">82% (High Confidence)</strong></div>
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleDispatchTeam}
                    size="sm"
                    className="w-full font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md"
                  >
                    🚀 Dispatch Rapid Veterinary Team
                  </Button>
                  <Button
                    onClick={handleIssueAlert}
                    variant="outline"
                    size="sm"
                    className="w-full font-bold border-rose-400 text-rose-300 hover:bg-rose-950"
                  >
                    📢 Broadcast Village Alert
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 bg-[#061B17] rounded-xl border border-emerald-500/20 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-white">All Monitored Villages Operating Normally</p>
                <span className="text-[11px]">Routine health telemetry streams active</span>
              </div>
            )}
          </Card>

          {/* Environmental Risk Panel */}
          <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <div className="flex items-center space-x-1.5">
                <CloudSun className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white uppercase">Environmental Risk Model</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                scenarioData.environmentalRisk.level === 'ELEVATED'
                  ? 'bg-amber-950 border border-amber-500 text-amber-300'
                  : 'bg-emerald-950 border border-emerald-500 text-emerald-300'
              }`}>
                {scenarioData.environmentalRisk.level} RISK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div>Temp: <strong>{scenarioData.environmentalRisk.temperature}</strong></div>
              <div>Humidity: <strong>{scenarioData.environmentalRisk.humidity}</strong></div>
              <div>Rain: <strong>{scenarioData.environmentalRisk.rainfall}</strong></div>
              <div>Season: <strong>{scenarioData.environmentalRisk.season}</strong></div>
            </div>

            <p className="text-[11px] text-slate-300 pt-1 border-t border-emerald-500/10">
              {scenarioData.environmentalRisk.advisory}
            </p>
          </Card>
        </div>

      </div>

      {/* 2-Column Split: Village Risk Matrix + Vaccination Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Village Risk Stratification Matrix (8 Cols) */}
        <div className="lg:col-span-8">
          <Card className="bg-[#092923] border border-emerald-500/20 p-0 overflow-hidden space-y-0">
            <div className="p-4 sm:p-5 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Village Risk Stratification Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                4 Villages Monitored
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#061B17] border-b border-emerald-500/20 text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Village</th>
                    <th className="py-3 px-3">Livestock</th>
                    <th className="py-3 px-3">Reports</th>
                    <th className="py-3 px-3">Risk Index</th>
                    <th className="py-3 px-3">Trend</th>
                    <th className="py-3 px-3">Vaccination</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10 text-slate-300 font-medium">
                  {scenarioData.villages.map((v) => (
                    <tr key={v.village} className="hover:bg-[#08221D] transition">
                      <td className="py-3 px-4 font-bold text-white">{v.village}</td>
                      <td className="py-3 px-3">{v.monitored_animals}</td>
                      <td className="py-3 px-3">{v.active_health_reports}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          v.risk_index >= 80 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                          v.risk_index >= 40 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {v.risk_index}/100
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {v.trend === 'up' ? (
                          <span className="text-rose-400 font-bold flex items-center">↑ Rapid</span>
                        ) : v.trend === 'down' ? (
                          <span className="text-emerald-400 font-bold flex items-center">↓ Falling</span>
                        ) : (
                          <span className="text-slate-400 font-bold flex items-center">→ Stable</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-emerald-300 font-bold">{v.vaccination_coverage}%</td>
                      <td className="py-3 px-4">
                        <Badge variant={v.cluster_status.includes('CRITICAL') ? 'danger' : v.cluster_status.includes('WATCHLIST') ? 'warning' : 'primary'} size="sm">
                          {v.cluster_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Vaccination Intelligence Panel (4 Cols) */}
        <div className="lg:col-span-4">
          <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <div className="flex items-center space-x-2">
                <Syringe className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-white uppercase">Vaccination Intelligence</h3>
              </div>
              <span className="text-emerald-400 font-bold">{scenarioData.districtVaccinationRate}% Avg</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-slate-300 pb-1 text-[11px]">
                  <span>District Coverage Goal (85%)</span>
                  <span>{scenarioData.districtVaccinationRate}%</span>
                </div>
                <div className="h-2 w-full bg-[#061B17] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${scenarioData.districtVaccinationRate}%` }}
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                  />
                </div>
              </div>

              {isCritical ? (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 space-y-1 text-rose-200">
                  <strong className="text-rose-300 font-bold block">⚠️ Coverage Gap Detected in Rampur:</strong>
                  <p className="text-[11px]">
                    Rampur vaccination coverage (71%) is 13.2% below district average. Emergency ring vaccination recommended immediately.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#061B17] border border-emerald-500/20 text-slate-300 text-[11px]">
                  ✓ All villages meet minimum epidemiological immunity thresholds (&gt;80%).
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

    </div>
  )
}
