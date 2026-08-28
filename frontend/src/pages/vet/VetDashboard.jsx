import React, { useState, useEffect } from 'react'
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  TestTube2, 
  FileText, 
  ShieldAlert, 
  RefreshCw,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import OutbreakMap from '../../components/map/OutbreakMap'
import VetCaseModal from '../../components/vet/VetCaseModal'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function VetDashboard() {
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [clusters, setClusters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchVetData = async () => {
    setLoading(true)
    try {
      const [casesRes, clustersRes] = await Promise.allSettled([
        apiClient.get('/vet/cases'),
        apiClient.get('/clusters'),
      ])

      if (casesRes.status === 'fulfilled') setCases(casesRes.value.data)
      if (clustersRes.status === 'fulfilled') setClusters(clustersRes.value.data)
    } catch (err) {
      console.error('Error fetching vet data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVetData()
  }, [])

  // KPI Calculations
  const criticalCases = cases.filter(c => c.risk_level === 'CRITICAL').length
  const highRiskCases = cases.filter(c => c.risk_level === 'HIGH').length
  const pendingCases = cases.filter(c => c.status === 'pending').length
  const labReferrals = cases.filter(c => c.lab_referral).length

  // Filtered cases
  const filteredCases = cases.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesSearch = 
      c.animal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.possible_disease_concern?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Clinical Triage Desk
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
              AI Risk Prioritization Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Veterinarian Emergency Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Assigned Zone: <strong>Jaipur Rural District • Central Veterinary Clinic</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchVetData}
            title="Refresh"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Critical Cases"
          value={criticalCases}
          subtitle="Immediate dispatch needed"
          icon={AlertTriangle}
          iconBg={criticalCases > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"}
        />
        <StatCard
          title="High Risk Queue"
          value={highRiskCases}
          subtitle="Triage within 24h"
          icon={ShieldAlert}
          iconBg="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="Pending Review"
          value={pendingCases}
          subtitle="Awaiting clinical notes"
          icon={Clock}
          iconBg="bg-sky-50 text-sky-600"
        />
        <StatCard
          title="Lab Tests Ordered"
          value={labReferrals}
          subtitle="Diagnostic referrals"
          icon={TestTube2}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Geospatial Surveillance Map for Vets */}
      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Regional Outbreak Cluster Map ({clusters.length} Active Hotspots)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Jaipur Rural Sector
          </span>
        </div>

        <OutbreakMap
          clusters={clusters}
          height="320px"
          zoom={11}
        />
      </Card>

      {/* Priority Clinical Triage Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-sky-600" />
              <span>Priority Clinical Triage Queue</span>
            </h2>
            <p className="text-xs text-slate-500">
              Ranked automatically by AI risk score and clinical severity
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search case, animal, or farmer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 w-48 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="investigated">Investigated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Triage Cards Grid */}
        {filteredCases.length === 0 && !loading ? (
          <Card className="text-center p-8 text-xs text-slate-500">
            No priority cases found matching your criteria.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCases.map((item) => (
              <Card
                key={item.id}
                hover
                className={`p-5 space-y-4 border-l-4 ${
                  item.risk_level === 'CRITICAL'
                    ? 'border-l-rose-600 bg-gradient-to-r from-rose-50/30 to-white'
                    : item.risk_level === 'HIGH'
                    ? 'border-l-orange-500 bg-gradient-to-r from-orange-50/20 to-white'
                    : 'border-l-sky-500'
                }`}
              >
                {/* Case Top Bar */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {item.id} • {item.village || 'Rampur'}
                    </span>
                    <h3 className="font-bold text-base text-slate-900">
                      {item.animal_id} — {item.species} ({item.breed || 'Local'})
                    </h3>
                  </div>
                  <RiskBadge level={item.risk_level} score={item.risk_score} />
                </div>

                {/* AI Disease Differential & Symptoms */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-rose-700">
                    {item.possible_disease_concern}
                  </div>
                  <div className="text-slate-600 flex flex-wrap gap-1">
                    {item.symptoms?.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 bg-white rounded border border-slate-200 text-[10px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Farmer & Location Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    Farmer: <strong className="text-slate-900">{item.farmer_name || 'Ramesh Kumar'}</strong>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-700">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{item.farmer_phone || '9876543210'}</span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <Badge variant={item.status === 'resolved' ? 'primary' : item.status === 'investigated' ? 'info' : 'warning'}>
                    {item.status?.toUpperCase()}
                  </Badge>

                  <Button
                    onClick={() => setSelectedCase(item)}
                    size="sm"
                    className="font-bold bg-sky-600 hover:bg-sky-500 text-white"
                  >
                    Clinical Action →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Case Investigation & Action Modal */}
      {selectedCase && (
        <VetCaseModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onActionSuccess={fetchVetData}
        />
      )}
    </div>
  )
}
