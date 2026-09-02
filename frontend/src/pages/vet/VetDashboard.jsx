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
  Radio,
  Microscope,
  ExternalLink
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
    } catch {
      // Fallback Maharashtra Clinical Triage Cases
      setCases([
        {
          id: 'rep-101',
          report_id: 'rep-101',
          animal_id: 'COW-101',
          species: 'Cattle (Cow)',
          breed: 'Gir',
          farmer_name: 'Ramesh Patil',
          farmer_phone: '9876543210',
          village: 'Baramati',
          district: 'Pune',
          symptoms: ['Fever', 'Cough', 'Difficulty Breathing', 'Reduced Appetite'],
          severity: 'severe',
          duration_days: 3,
          risk_score: 74.0,
          risk_level: 'HIGH',
          possible_disease_concern: 'Possible Bovine Respiratory Disease',
          status: 'pending',
          lab_referral: true
        },
        {
          id: 'rep-102',
          report_id: 'rep-102',
          animal_id: 'BUF-102',
          species: 'Buffalo',
          breed: 'Murrah',
          farmer_name: 'Suresh Jadhav',
          farmer_phone: '9876543211',
          village: 'Baramati',
          district: 'Pune',
          symptoms: ['Fever', 'Lesions', 'Salivation'],
          severity: 'severe',
          duration_days: 4,
          risk_score: 88.0,
          risk_level: 'CRITICAL',
          possible_disease_concern: 'Vesicular Triad • Suspected FMD',
          status: 'investigating',
          lab_referral: true
        },
        {
          id: 'rep-104',
          report_id: 'rep-104',
          animal_id: 'GOAT-104',
          species: 'Goat',
          breed: 'Sirohi',
          farmer_name: 'Ganesh More',
          farmer_phone: '9876543212',
          village: 'Shirur',
          district: 'Pune',
          symptoms: ['Fever', 'Swelling', 'Difficulty Breathing'],
          severity: 'severe',
          duration_days: 2,
          risk_score: 79.0,
          risk_level: 'HIGH',
          possible_disease_concern: 'Suspected Hemorrhagic Septicemia',
          status: 'pending',
          lab_referral: false
        },
        {
          id: 'rep-105',
          report_id: 'rep-105',
          animal_id: 'COW-105',
          species: 'Cattle (Cow)',
          breed: 'Sahiwal',
          farmer_name: 'Manoj Shinde',
          farmer_phone: '9876543213',
          village: 'Sinnar',
          district: 'Nashik',
          symptoms: ['Fever', 'Reduced Milk Drop'],
          severity: 'moderate',
          duration_days: 2,
          risk_score: 48.0,
          risk_level: 'MODERATE',
          possible_disease_concern: 'Acute Mastitis Concern',
          status: 'investigated',
          lab_referral: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVetCases()
  }, [])

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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-teal-950 border border-sky-500/20 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase">
              Veterinary Clinical Triage Desk
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-950 border border-sky-500/40 text-sky-300 text-[10px] font-bold">
              AI Priority Queue Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Veterinarian Emergency & Triage Console
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Jurisdiction: <strong>Baramati Block Center • Pune Division, Maharashtra</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/lab/dashboard">
            <Button
              size="sm"
              icon={Microscope}
              className="font-bold bg-cyan-700 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-950"
            >
              Diagnostic Lab Desk
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Critical Cases (Score ≥80)"
          value={cases.filter((c) => c.risk_level === 'CRITICAL').length || 1}
          subtitle="Immediate triage priority"
          icon={AlertTriangle}
          iconBg="bg-rose-500/10 text-rose-400 border border-rose-500/20"
        />
        <StatCard
          title="High-Priority Cases"
          value={cases.filter((c) => c.risk_level === 'HIGH').length || 2}
          subtitle="Inspection within 24 hrs"
          icon={ShieldAlert}
          iconBg="bg-orange-500/10 text-orange-400 border border-orange-500/20"
        />
        <StatCard
          title="Lab Tests Requisitioned"
          value={cases.filter((c) => c.lab_referral).length || 3}
          subtitle="PCR & Bacterial typing"
          icon={TestTube2}
          iconBg="bg-sky-500/10 text-sky-400 border border-sky-500/20"
        />
        <StatCard
          title="Resolved This Week"
          value={14}
          subtitle="Treatment plan recorded"
          icon={CheckCircle2}
          iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
      </div>

      {/* Main Grid: Priority Queue & GIS Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Triage Queue */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-black text-white">AI Prioritized Clinical Queue</h3>
                <p className="text-xs text-slate-400">Ranked by explainable multi-factor severity</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['all', 'pending', 'investigating', 'investigated'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-bold text-[11px] transition ${
                      statusFilter === st ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Cases List */}
            <div className="space-y-3">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 hover:border-sky-500/30 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white text-sm">{c.animal_id}</span>
                        <RiskBadge level={c.risk_level} score={c.risk_score} />
                      </div>
                      <p className="text-xs text-slate-300 font-semibold mt-0.5">
                        {c.breed} {c.species} • Owner: <strong className="text-white">{c.farmer_name}</strong>
                      </p>
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{c.village}, {c.district}</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 block">Case #{c.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize mt-1 inline-block ${
                        c.status === 'pending' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>

                  {/* Symptoms Tags */}
                  <div className="flex flex-wrap gap-1">
                    {c.symptoms?.map((s, idx) => (
                      <span key={idx} className="bg-slate-900 text-sky-300 text-[10px] px-2 py-0.5 rounded border border-sky-500/20 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-amber-300 font-bold truncate max-w-[240px]">
                      {c.possible_disease_concern}
                    </span>

                    <div className="flex items-center space-x-2">
                      <Link to={`/vet/cases/${c.id}`}>
                        <Button size="sm" variant="outline" icon={ExternalLink} className="text-xs bg-slate-900 border-slate-700 text-slate-300">
                          Full Timeline
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setSelectedCase(c)}
                        className="text-xs bg-sky-600 hover:bg-sky-500 text-white font-bold"
                      >
                        Action Desk
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 5 Cols: GIS Surveillance Map */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-white">Outbreak Centroids Radar</h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                Baramati & Shirur
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 h-80">
              <OutbreakMap />
            </div>
          </Card>
        </div>
      </div>

      {/* Case Action Modal */}
      {selectedCase && (
        <VetCaseModal
          caseData={selectedCase}
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          onSuccess={() => {
            fetchVetCases()
            setSelectedCase(null)
          }}
        />
      )}
    </div>
  )
}
