import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  PawPrint, 
  ArrowLeft, 
  FilePlus2, 
  Calendar, 
  Scale, 
  Droplet, 
  Syringe, 
  MapPin, 
  Activity, 
  FileText,
  ShieldCheck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import apiClient from '../../services/api'

export default function AnimalProfilePage() {
  const { animalId } = useParams()
  const [animal, setAnimal] = useState(null)
  const [reports, setReports] = useState([])
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAnimalDetails = async () => {
    setLoading(true)
    try {
      const [animRes, repsRes, vacsRes] = await Promise.allSettled([
        apiClient.get(`/animals/${animalId}`),
        apiClient.get(`/health-reports?animal_id=${animalId}`),
        apiClient.get(`/vaccinations?animal_id=${animalId}`),
      ])

      if (animRes.status === 'fulfilled') setAnimal(animRes.value.data)
      if (repsRes.status === 'fulfilled') setReports(repsRes.value.data)
      if (vacsRes.status === 'fulfilled') setVaccinations(vacsRes.value.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimalDetails()
  }, [animalId])

  if (loading) {
    return (
      <div className="py-12 text-center text-emerald-600 font-bold flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading Livestock Passport...</span>
      </div>
    )
  }

  if (!animal) {
    return (
      <Card className="text-center p-8 space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Animal Record Not Found</h3>
        <p className="text-xs text-slate-500">
          No digital passport was found matching identification <strong>{animalId}</strong>.
        </p>
        <Link to="/farmer/animals">
          <Button size="sm">Back to My Livestock</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/farmer/animals"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              EAR-TAG: {animal.animal_id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {animal.species} ({animal.breed})
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Print Digital Passport</span>
          </button>
          <Link to={`/farmer/report?animalId=${animal.animal_id}`}>
            <Button icon={FilePlus2} className="font-bold shadow-md shadow-emerald-200">
              Report Symptom
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Vitals Overview */}
        <Card className="space-y-6 md:col-span-1 border-emerald-100 bg-gradient-to-b from-emerald-50/40 to-white">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <PawPrint className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">{animal.animal_id}</h2>
            <p className="text-xs text-slate-500 font-medium">{animal.species} • {animal.gender}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Current AI Risk Evaluation
            </span>
            <div className="flex justify-center">
              <RiskBadge level={animal.current_risk_level || 'LOW'} score={animal.current_risk_score} size="lg" />
            </div>
            <p className="text-[11px] text-slate-500">
              Score: <strong>{animal.current_risk_score ?? 0}/100</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Age</span>
              <span className="font-bold text-slate-800">{animal.age} Years</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Weight</span>
              <span className="font-bold text-slate-800">{animal.weight ? `${animal.weight} kg` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Milk Yield</span>
              <span className="font-bold text-slate-800">{animal.milk_production ? `${animal.milk_production} L/day` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Vaccination</span>
              <span className="font-bold text-slate-800">{animal.vaccination_status || 'Up to date'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Location</span>
              <span className="font-bold text-slate-800">{animal.village || 'Baramati'}, {animal.district || 'Pune'}</span>
            </div>
          </div>
        </Card>

        {/* Right Section: Timeline & Medical History */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Medical Notes */}
          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Medical History &amp; Remarks</span>
            </h3>
            <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {animal.previous_diseases || 'No chronic or severe illnesses registered.'}
            </p>
          </Card>

          {/* Symptom Reports Timeline */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-4 h-4 text-sky-600" />
                <span>Health &amp; Symptom History</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {reports.length} Reports Logged
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No symptoms or clinical concerns have been reported for this animal yet.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">
                          {r.reported_at ? new Date(r.reported_at).toLocaleDateString() : 'Recent'}
                        </span>
                        <Badge variant={r.severity === 'severe' ? 'danger' : 'warning'} size="sm">
                          {r.severity}
                        </Badge>
                      </div>
                      <RiskBadge level={r.risk_level} score={r.risk_score} />
                    </div>
                    <p className="text-slate-600">
                      Recommendation: <em>"{r.recommendation}"</em>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Vaccination History */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Syringe className="w-4 h-4 text-emerald-600" />
                <span>Vaccination Records</span>
              </h3>
            </div>

            {vaccinations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No specific vaccination records attached to this animal ID.
              </div>
            ) : (
              <div className="space-y-2">
                {vaccinations.map((v) => (
                  <div key={v.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{v.vaccine_name}</span>
                      <p className="text-slate-500">Administered: {v.vaccination_date || 'Standard'}</p>
                    </div>
                    <Badge variant="primary">Completed</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  )
}
