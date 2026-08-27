import React from 'react'
import { Link } from 'react-router-dom'
import { 
  PawPrint, 
  FilePlus2, 
  Syringe, 
  AlertTriangle, 
  Plus, 
  ChevronRight, 
  CheckCircle,
  Bell,
  Activity
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'

export default function FarmerDashboard({ user }) {
  // Demo sample livestock for Phase 2 scaffold
  const sampleAnimals = [
    {
      id: 'COW-101',
      name: 'Gauri',
      species: 'Cattle (Cow)',
      breed: 'Gir',
      age: '4.5 yrs',
      riskLevel: 'LOW',
      riskScore: 12,
      vaccineStatus: 'Up to date',
      statusNote: 'Healthy vitals',
    },
    {
      id: 'BUF-204',
      name: 'Kali',
      species: 'Buffalo',
      breed: 'Murrah',
      age: '3 yrs',
      riskLevel: 'HIGH',
      riskScore: 74,
      vaccineStatus: 'Due soon',
      statusNote: 'Fever & reduced appetite reported',
    },
    {
      id: 'GOAT-305',
      name: 'Chhotu',
      species: 'Goat',
      breed: 'Sirohi',
      age: '1.2 yrs',
      riskLevel: 'LOW',
      riskScore: 8,
      vaccineStatus: 'Up to date',
      statusNote: 'Normal activity',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Farmer Mobile Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Ramesh Kumar'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Village: <strong>{user?.village || 'Rampur'}</strong> | District: <strong>{user?.district || 'Jaipur'}</strong>
          </p>
        </div>

        {/* 1-Tap Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          <Link to="/farmer/report">
            <Button icon={FilePlus2} className="font-bold">
              Report Symptoms
            </Button>
          </Link>
          <Link to="/farmer/animals/add">
            <Button variant="outline" icon={Plus} className="font-bold">
              Add Animal
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Animals"
          value="3"
          subtitle="Registered livestock"
          icon={PawPrint}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Healthy / Low Risk"
          value="2"
          subtitle="Normal vitals"
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Elevated Risk"
          value="1"
          subtitle="Needs observation"
          icon={AlertTriangle}
          iconBg="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="Vaccines Due"
          value="1"
          subtitle="Within 14 days"
          icon={Syringe}
          iconBg="bg-sky-50 text-sky-600"
        />
      </div>

      {/* Nearby Outbreak / Surveillance Alert Banner */}
      <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-900 flex items-start space-x-3">
        <Bell className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Community Health Alert
            </span>
            <Badge variant="warning" size="sm">Nearby Alert</Badge>
          </div>
          <p className="text-xs sm:text-sm text-amber-800/90">
            <strong>Jaipur Rural Zone</strong>: 4 nearby livestock health reports received in the last 48 hours. Please check your animals for fever or respiratory symptoms.
          </p>
        </div>
      </Card>

      {/* Livestock Overview List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <PawPrint className="w-5 h-5 text-emerald-600" />
            <span>My Registered Animals</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500">3 Animals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleAnimals.map((animal) => (
            <Card key={animal.id} hover className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {animal.id}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{animal.name}</h3>
                  <p className="text-xs text-slate-500">
                    {animal.species} • {animal.breed} ({animal.age})
                  </p>
                </div>
                <RiskBadge level={animal.riskLevel} score={animal.riskScore} />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Vaccination:</span>
                  <span className="font-semibold text-slate-700">{animal.vaccineStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="font-semibold text-slate-700">{animal.statusNote}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <Link
                  to={`/farmer/report?animalId=${animal.id}`}
                  className="font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Report Symptom →
                </Link>
                <button className="text-slate-400 hover:text-slate-700 font-medium">
                  View History
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
