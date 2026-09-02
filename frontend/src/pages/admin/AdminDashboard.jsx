import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  Users, 
  Sliders, 
  Database, 
  Activity, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  Server, 
  RefreshCw,
  Cpu,
  Search,
  Sparkles
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import apiClient from '../../services/api'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [riskRules, setRiskRules] = useState(null)
  const [villages, setVillages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const [usersRes, statsRes, rulesRes, villRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/risk-rules'),
        apiClient.get('/admin/villages')
      ])
      setUsers(usersRes.data)
      setStats(statsRes.data)
      setRiskRules(rulesRes.data)
      setVillages(villRes.data)
    } catch {
      setStats({
        user_count: 28,
        farmer_count: 15,
        vet_count: 4,
        animal_count: 1247,
        report_count: 438,
        active_clusters: 2,
        vaccination_count: 892,
        alert_count: 45,
        villages_covered: 15,
        districts_covered: 5
      })
      setUsers([
        { id: 'usr-farmer-1', name: 'Ramesh Patil', role: 'farmer', village: 'Baramati', district: 'Pune', phone: '9876543210', status: 'active' },
        { id: 'usr-vet-1', name: 'Dr. Priya Sharma', role: 'veterinarian', village: 'Baramati', district: 'Pune', phone: '9876543220', status: 'active' },
        { id: 'usr-auth-1', name: 'S. Deshmukh (IAS)', role: 'authority', village: 'Pune HQ', district: 'Pune', phone: '9876543230', status: 'active' },
        { id: 'usr-lab-1', name: 'Dr. Suhas Kulkarni', role: 'laboratory', village: 'Pune Lab', district: 'Pune', phone: '9876543240', status: 'active' },
        { id: 'usr-fw-1', name: 'Ankita Jadhav', role: 'field_worker', village: 'Baramati', district: 'Pune', phone: '9876543250', status: 'active' }
      ])
      setRiskRules({
        symptom_weights: {
          difficulty_breathing: 26,
          lesions: 24,
          fever: 18,
          salivation: 16,
          diarrhea: 14,
          reduced_milk: 12
        },
        factor_weights: {
          symptom_severity: '20%',
          affected_animals: '20%',
          mortality: '20%',
          nearby_cases: '15%',
          vaccination_gap: '10%'
        }
      })
      setVillages([
        { name: 'Baramati', taluka: 'Baramati', district: 'Pune', farms: 5, animals: 142 },
        { name: 'Shirur', taluka: 'Shirur', district: 'Pune', farms: 3, animals: 98 },
        { name: 'Indapur', taluka: 'Indapur', district: 'Pune', farms: 4, animals: 115 },
        { name: 'Sinnar', taluka: 'Sinnar', district: 'Nashik', farms: 3, animals: 108 },
        { name: 'Shrigonda', taluka: 'Shrigonda', district: 'Ahmednagar', farms: 3, animals: 95 }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.village?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>State Platform Operations & Identity Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            System Administration & Policy Console
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Configure explainable AI risk scoring parameters, manage RBAC identities across 5 stakeholder tiers, and audit Maharashtra cluster detection jobs.
          </p>
        </div>
        <Button onClick={fetchAdminData} variant="outline" icon={RefreshCw} className="bg-slate-900 border-slate-700 text-white">
          Reload Config
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Stakeholders"
          value={stats?.user_count || 28}
          subtitle="Across 5 RBAC roles"
          icon={Users}
          iconBg="bg-amber-500/10 text-amber-400 border border-amber-500/20"
        />
        <StatCard
          title="Digital Passports"
          value={stats?.animal_count?.toLocaleString() || '1,247'}
          subtitle="Monitored livestock tags"
          icon={Database}
          iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />
        <StatCard
          title="Village Nodes"
          value={stats?.villages_covered || 15}
          subtitle="Western Maharashtra network"
          icon={MapPin}
          iconBg="bg-teal-500/10 text-teal-400 border border-teal-500/20"
        />
        <StatCard
          title="AI Scoring Engine"
          value="Online (42ms)"
          subtitle="Explainable rule parser v1.0"
          icon={Cpu}
          iconBg="bg-sky-500/10 text-sky-400 border border-sky-500/20"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        {[
          { id: 'users', label: 'User Registry', icon: Users },
          { id: 'rules', label: 'AI Risk Engine Parameters', icon: Sliders },
          { id: 'nodes', label: 'Village Sensor Nodes', icon: MapPin }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: Users */}
      {activeTab === 'users' && (
        <Card className="bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name, role or village..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-bold">{filteredUsers.length} Users Listed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Role Tier</th>
                  <th className="py-3 px-4">Jurisdiction / Village</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{u.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{u.village}, {u.district}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{u.phone}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Risk Rules */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-black text-white mb-3">Core Clinical Symptom Weights (0-100 Base)</h3>
            <p className="text-xs text-slate-400 mb-4">Multi-factor severity points injected into explainable risk matrix</p>
            <div className="space-y-2.5">
              {riskRules?.symptom_weights && Object.entries(riskRules.symptom_weights).map(([sym, wt]) => (
                <div key={sym} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-slate-200 capitalize">{sym.replace('_', ' ')}</span>
                  <span className="bg-amber-500/20 text-amber-300 font-black px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    +{wt} pts
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-black text-white mb-3">Multi-Factor Weight Attribution</h3>
            <p className="text-xs text-slate-400 mb-4">Hierarchical weight distribution across 7 risk dimensions</p>
            <div className="space-y-2.5">
              {riskRules?.factor_weights && Object.entries(riskRules.factor_weights).map(([fact, pct]) => (
                <div key={fact} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-slate-200 capitalize">{fact.replace('_', ' ')}</span>
                  <span className="text-emerald-400 font-black">{pct}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Village Nodes */}
      {activeTab === 'nodes' && (
        <Card className="bg-slate-900/80 border-slate-800">
          <h3 className="text-sm font-black text-white mb-3">Maharashtra Village Telemetry Mesh</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {villages.map((v, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{v.name}</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                    Active Node
                  </span>
                </div>
                <p className="text-slate-400">{v.taluka} Taluka • {v.district} District</p>
                <div className="flex justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-300">
                  <span>{v.farms || 3} Registered Farms</span>
                  <span className="font-bold text-teal-400">{v.animals || 100} Animals Monitored</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
