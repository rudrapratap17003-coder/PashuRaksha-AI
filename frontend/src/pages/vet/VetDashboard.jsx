import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Stethoscope, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Activity, 
  Eye, 
  FileCheck2,
  Radio
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'

export default function VetDashboard({ user }) {
  // Demo triage cases for Phase 2 scaffold
  const priorityCases = [
    {
      id: 'CASE-8801',
      animalId: 'BUF-204',
      species: 'Buffalo',
      farmer: 'Ramesh Kumar',
      village: 'Rampur',
      symptoms: ['Fever', 'Cough', 'Reduced Appetite'],
      riskScore: 74,
      riskLevel: 'HIGH',
      detectedAt: '2 hours ago',
      clusterFlag: true,
    },
    {
      id: 'CASE-8802',
      animalId: 'COW-409',
      species: 'Cattle',
      farmer: 'Suresh Patel',
      village: 'Rampur',
      symptoms: ['Fever', 'Cough', 'Nasal Discharge'],
      riskScore: 82,
      riskLevel: 'CRITICAL',
      detectedAt: '3 hours ago',
      clusterFlag: true,
    },
    {
      id: 'CASE-8803',
      animalId: 'GOAT-112',
      species: 'Goat',
      farmer: 'Mahesh Sharma',
      village: 'Kalyanpura',
      symptoms: ['Diarrhea', 'Lethargy'],
      riskScore: 48,
      riskLevel: 'MODERATE',
      detectedAt: '5 hours ago',
      clusterFlag: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Vet Desk Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Veterinarian Clinical Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {user?.name || 'Dr. Sharma (Veterinary Officer)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Assigned Block: <strong>Jaipur Rural • Rampur &amp; Kalyanpura Sub-Centers</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="danger" dot size="lg">
            2 High/Critical Priority Cases
          </Badge>
        </div>
      </div>

      {/* Vet Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Critical Cases"
          value="1"
          subtitle="Urgent triage needed"
          icon={ShieldAlert}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="High-Risk Cases"
          value="1"
          subtitle="Elevated concern"
          icon={AlertTriangle}
          iconBg="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="Cluster Hotspots"
          value="1"
          subtitle="Rampur Village Cluster"
          icon={Radio}
          iconBg="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Resolved Today"
          value="4"
          subtitle="Completed reviews"
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Cluster Warning Box */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-rose-50 border-purple-200 text-purple-950 flex items-start space-x-3">
        <Radio className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Active Outbreak Cluster Alert
            </span>
            <Badge variant="purple" size="sm">Rampur Cluster #1</Badge>
          </div>
          <p className="text-xs sm:text-sm text-purple-900/90 leading-relaxed">
            <strong>Rampur Center</strong>: 4 animals reporting matching respiratory symptoms (fever + cough) within 1.5 km radius. Field investigation recommended.
          </p>
        </div>
      </Card>

      {/* Priority Case Triage Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-sky-600" />
              <span>Priority Triage Queue</span>
            </h2>
            <p className="text-xs text-slate-500">
              Sorted by AI Risk Score &amp; Geospatial Cluster Severity
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {priorityCases.length} Active Cases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Case / Animal</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Reported Symptoms</th>
                <th className="py-3.5 px-4">AI Risk Assessment</th>
                <th className="py-3.5 px-4">Cluster</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {priorityCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-bold text-slate-900">{c.animalId}</div>
                    <div className="text-xs text-slate-400 font-normal">
                      {c.species} • {c.farmer}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.village}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{c.detectedAt}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {c.symptoms.map((sym) => (
                        <span
                          key={sym}
                          className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] text-slate-700 font-semibold"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={c.riskLevel} score={c.riskScore} />
                  </td>
                  <td className="py-3.5 px-4">
                    {c.clusterFlag ? (
                      <Badge variant="purple" size="sm">Hotspot</Badge>
                    ) : (
                      <span className="text-xs text-slate-400">Isolated</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <Button variant="outline" size="sm" icon={Eye}>
                      Review
                    </Button>
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
