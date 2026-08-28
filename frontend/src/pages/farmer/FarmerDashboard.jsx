import React, { useState, useEffect } from 'react'
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
  Activity,
  Calendar,
  Clock,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import AnimalDetailModal from '../../components/farmer/AnimalDetailModal'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function FarmerDashboard() {
  const { user } = useAuth()
  const [animals, setAnimals] = useState([])
  const [alerts, setAlerts] = useState([])
  const [reports, setReports] = useState([])
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAnimal, setSelectedAnimal] = useState(null)

  const fetchFarmerData = async () => {
    setLoading(true)
    try {
      const [animalsRes, alertsRes, reportsRes, vacsRes] = await Promise.allSettled([
        apiClient.get('/animals'),
        apiClient.get('/alerts?role=farmer'),
        apiClient.get('/health-reports'),
        apiClient.get('/vaccinations'),
      ])

      if (animalsRes.status === 'fulfilled') setAnimals(animalsRes.value.data)
      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value.data)
      if (reportsRes.status === 'fulfilled') setReports(reportsRes.value.data)
      if (vacsRes.status === 'fulfilled') setVaccinations(vacsRes.value.data)
    } catch (err) {
      console.error('Error loading farmer data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFarmerData()
  }, [])

  // Calculate live summary KPIs
  const totalAnimals = animals.length
  const healthyAnimals = animals.filter(a => (a.current_risk_level || 'LOW') === 'LOW').length
  const elevatedRiskAnimals = animals.filter(a => ['HIGH', 'CRITICAL', 'MODERATE'].includes(a.current_risk_level)).length
  const vaccinesDue = vaccinations.filter(v => v.status === 'due' || v.status === 'overdue').length

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Farmer Mobile Portal
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Live Database
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Ramesh Kumar'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Village: <strong>{user?.village || 'Rampur'}</strong> | District: <strong>{user?.district || 'Jaipur Rural'}</strong>
          </p>
        </div>

        {/* 1-Tap Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchFarmerData}
            title="Refresh dashboard data"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/farmer/report">
            <Button icon={FilePlus2} className="font-bold shadow-md shadow-emerald-200">
              Report Symptoms
            </Button>
          </Link>
          <Link to="/farmer/animals">
            <Button variant="outline" icon={Plus} className="font-bold">
              Add Animal
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Animals"
          value={totalAnimals}
          subtitle="Registered livestock"
          icon={PawPrint}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Healthy / Low Risk"
          value={healthyAnimals}
          subtitle="Normal vitals"
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Elevated Risk"
          value={elevatedRiskAnimals}
          subtitle="Requires attention"
          icon={AlertTriangle}
          iconBg={elevatedRiskAnimals > 0 ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-500"}
        />
        <StatCard
          title="Vaccines Due"
          value={vaccinesDue}
          subtitle="Upcoming boosters"
          icon={Syringe}
          iconBg={vaccinesDue > 0 ? "bg-sky-50 text-sky-600" : "bg-slate-50 text-slate-500"}
        />
      </div>

      {/* Community Outbreak / Health Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Nearby Surveillance &amp; Outbreak Advisories</span>
            </h3>
            <span className="text-xs font-semibold text-amber-700">{alerts.length} Active Alerts</span>
          </div>

          <div className="space-y-2">
            {alerts.map((alt) => (
              <Card
                key={alt.id}
                className="p-4 bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-white border-amber-200 text-amber-950 flex items-start space-x-3 shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-amber-900">
                      {alt.title}
                    </h4>
                    <span className="text-[10px] text-amber-700 font-semibold">
                      {alt.village || 'Rampur'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    {alt.message}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Registered Livestock Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <PawPrint className="w-5 h-5 text-emerald-600" />
            <span>My Registered Livestock Passports</span>
          </h2>
          <Link to="/farmer/animals" className="text-xs font-bold text-emerald-600 hover:underline">
            View All ({animals.length}) →
          </Link>
        </div>

        {animals.length === 0 && !loading ? (
          <Card className="text-center p-8 space-y-3">
            <PawPrint className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800">No Livestock Registered Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create digital health passports for your cows, buffalos, and goats to track vitals and receive early warnings.
            </p>
            <Link to="/farmer/animals">
              <Button size="sm" icon={Plus} className="font-bold">
                Register First Animal
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {animals.map((animal) => (
              <Card key={animal.id} hover className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {animal.animal_id}
                      </span>
                      <h3 className="text-lg font-black text-slate-900">
                        {animal.species}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {animal.breed} • {animal.age} yrs
                      </p>
                    </div>
                    <RiskBadge
                      level={animal.current_risk_level || 'LOW'}
                      score={animal.current_risk_score}
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Vaccination:</span>
                      <span className={`font-bold ${animal.vaccination_status === 'Due soon' ? 'text-amber-600' : 'text-slate-700'}`}>
                        {animal.vaccination_status || 'Up to date'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Lactation Yield:</span>
                      <span className="font-bold text-slate-700">
                        {animal.milk_production ? `${animal.milk_production} L/day` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Location:</span>
                      <span className="font-semibold text-slate-600">
                        {animal.village || 'Rampur'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <Link
                    to={`/farmer/report?animalId=${animal.animal_id}`}
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                  >
                    <span>Report Symptom</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setSelectedAnimal(animal)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-semibold flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Symptom Reports Feed */}
      {reports.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-sky-600" />
              <span>Recent Symptom Reports &amp; AI Recommendations</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {reports.length} Reports
            </span>
          </div>

          <div className="space-y-2">
            {reports.slice(0, 3).map((rep) => (
              <Card key={rep.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">
                        {rep.animal_id} ({rep.species})
                      </span>
                      <Badge variant={rep.severity === 'severe' ? 'danger' : 'warning'} size="sm">
                        {rep.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Duration: {rep.duration_days} days • Affected: {rep.number_of_animals_affected} animals
                    </p>
                  </div>
                  <RiskBadge level={rep.risk_level} score={rep.risk_score} />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="font-semibold text-slate-700">
                    AI Decision-Support Recommendation:
                  </div>
                  <p className="text-slate-600 italic">
                    "{rep.recommendation || 'Veterinary assessment recommended.'}"
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Animal Detail Modal */}
      {selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
        />
      )}
    </div>
  )
}
