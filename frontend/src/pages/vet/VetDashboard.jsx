import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  Sparkles,
  Radio
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import OutbreakMap from '../../components/map/OutbreakMap'
import VetCaseModal from '../../components/vet/VetCaseModal'
import LiveSurveillanceStrip from '../../components/common/LiveSurveillanceStrip'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useScenario } from '../../context/ScenarioContext'

export default function VetDashboard() {
  const { user } = useAuth()
  const { scenarioData, currentScenario } = useScenario()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchVetCases = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/vet/cases')
      setCases(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVetCases()
  }, [])

  const isCritical = currentScenario === 'RAMPUR_OUTBREAK'

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesSearch =
      c.animal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.village?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase">
              Veterinary Clinical Triage Desk
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-950 border border-sky-500/40 text-sky-300 text-[10px] font-bold">
              AI Priority Queue Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Veterinarian Emergency Dashboard
          </h1>
          <p className="text-xs text-slate-300">
            Assigned Zone: <strong>Jaipur Rural District • Central Veterinary Clinic</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/presentation">
            <Button
              size="sm"
              icon={Sparkles}
              className="font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30"
            >
              Jury Presentation Mode →
            </Button>
          </Link>
        </div>
      </div>

      {/* District Telemetry Strip */}
      <LiveSurveillanceStrip />

      {/* Regional Outbreak GIS Map for Vets */}
      <Card className="bg-[#092923] border border-emerald-500/20 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-base">
              Regional Outbreak GIS Map ({scenarioData.clusters.length} Active Hotspots)
            </h3>
          </div>
          <Badge variant={isCritical ? 'danger' : 'primary'} dot>
            {isCritical ? 'High Alert In Rampur' : 'Normal Baseline'}
          </Badge>
        </div>

        <OutbreakMap
          clusters={scenarioData.clusters}
          height="320px"
          zoom={11}
        />
      </Card>

      {/* Priority Clinical Triage Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-sky-400" />
              <span>Priority Clinical Triage Queue</span>
            </h2>
            <p className="text-xs text-slate-300">
              Ranked automatically by AI risk score (highest risk cases requiring immediate dispatch shown first)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search animal or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-[#061B17] border border-emerald-500/30 text-white w-48 sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-[#061B17] border border-emerald-500/30 text-white font-semibold"
            >
              <option value="all">All Cases</option>
              <option value="pending">Pending</option>
              <option value="investigated">Investigated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Triage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map((item) => (
            <Card
              key={item.id}
              hover
              className={`p-5 space-y-4 border-l-4 ${
                item.risk_level === 'CRITICAL'
                  ? 'border-l-rose-500 bg-[#092923] border border-rose-500/30'
                  : 'bg-[#092923] border border-emerald-500/20 border-l-sky-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {item.id} • {item.village || 'Rampur'}
                  </span>
                  <h3 className="font-bold text-base text-white">
                    {item.animal_id} — {item.species} ({item.breed || 'Local'})
                  </h3>
                </div>
                <RiskBadge level={item.risk_level} score={item.risk_score} />
              </div>

              {/* Disease match */}
              <div className="p-3 rounded-xl bg-[#061B17] border border-emerald-500/20 text-xs space-y-1.5">
                <div className="font-bold text-rose-400">
                  {item.possible_disease_concern}
                </div>
                <div className="text-slate-300 flex flex-wrap gap-1">
                  {item.symptoms?.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 bg-slate-900 rounded border border-emerald-500/20 text-[10px] font-semibold text-emerald-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div>Farmer: <strong className="text-white">{item.farmer_name || 'Ramesh Kumar'}</strong></div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{item.farmer_phone || '9876543210'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-emerald-500/20 text-xs">
                <Badge variant={item.status === 'resolved' ? 'primary' : 'warning'}>
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
      </div>

      {/* Case Action Modal */}
      {selectedCase && (
        <VetCaseModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onActionSuccess={fetchVetCases}
        />
      )}

    </div>
  )
}
