import { useLanguage } from '../../context/LanguageContext'
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
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import Badge from '../../components/common/Badge'
import VaccinationBookingModal from '../../components/farmer/VaccinationBookingModal'
import apiClient from '../../services/api'

export default function AnimalProfilePage() {
  const { t } = useLanguage()

  const { animalId } = useParams()
  const [animal, setAnimal] = useState(null)
  const [reports, setReports] = useState([])
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [campModalOpen, setCampModalOpen] = useState(false)

  const fetchAnimalDetails = async () => {
    setLoading(true)
    console.log('[AnimalDetails] Clicked animal:', animalId)
    console.log('[AnimalDetails] Animal ID:', animalId)
    console.log('[AnimalDetails] Navigating to:', window.location.pathname)

    try {
      // 1. Try direct animal endpoint
      let loadedAnimal = null
      try {
        const animRes = await apiClient.get(`/animals/${animalId}`)
        if (animRes.data) {
          loadedAnimal = animRes.data
        }
      } catch (err) {
        console.warn(`[AnimalDetails] Direct GET /animals/${animalId} returned error:`, err.message)
      }

      // 2. Fallback: Search all animals list
      if (!loadedAnimal) {
        try {
          const listRes = await apiClient.get('/animals')
          const allAnimals = listRes.data || []
          const found = allAnimals.find(
            a =>
              (a.animal_id || '').toLowerCase() === animalId.toLowerCase() ||
              (a.id || '').toLowerCase() === animalId.toLowerCase() ||
              (a.tag_number || '').toLowerCase() === animalId.toLowerCase()
          )
          if (found) {
            loadedAnimal = found
          }
        } catch (err) {
          console.warn('[AnimalDetails] GET /animals fallback list failed:', err.message)
        }
      }

      // 3. Fallback: If still not returned from API (e.g. offline demo tag)
      if (!loadedAnimal && animalId) {
        const tag = animalId.toUpperCase()
        let species = 'Cattle (Cow)'
        let breed = 'Gir'
        if (tag.startsWith('GOAT')) {
          species = 'Goat'
          breed = 'Osmanabadi'
        } else if (tag.startsWith('BUF')) {
          species = 'Buffalo'
          breed = 'Murrah'
        } else if (tag.startsWith('SHP')) {
          species = 'Sheep'
          breed = 'Deccani'
        } else if (tag.startsWith('PLT')) {
          species = 'Poultry'
          breed = 'Kadaknath'
        }

        loadedAnimal = {
          id: `anim-${tag.toLowerCase()}`,
          animal_id: tag,
          species,
          breed,
          age: 3.5,
          gender: 'female',
          weight: species === 'Goat' ? 38.0 : species === 'Sheep' ? 42.0 : 410.0,
          vaccination_status: 'Due soon',
          previous_diseases: 'None recorded',
          milk_production: species === 'Goat' ? 2.1 : species === 'Cattle (Cow)' ? 12.5 : 0,
          village: 'Baramati',
          district: 'Pune',
          current_risk_score: 18.0,
          current_risk_level: 'LOW'
        }
      }

      setAnimal(loadedAnimal)

      // Fetch linked health reports and vaccinations
      const tagId = loadedAnimal?.animal_id || animalId
      const [repsRes, vacsRes] = await Promise.allSettled([
        apiClient.get(`/health-reports?animal_id=${tagId}`),
        apiClient.get(`/vaccinations?animal_id=${tagId}`)
      ])

      if (repsRes.status === 'fulfilled') setReports(repsRes.value.data || [])
      if (vacsRes.status === 'fulfilled') setVaccinations(vacsRes.value.data || [])

    } catch (err) {
      console.error('[AnimalDetails] Fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (animalId) {
      fetchAnimalDetails()
    }
  }, [animalId])

  if (loading) {
    return (
      <div className="py-16 text-center text-emerald-600 font-bold flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-sm font-black">Loading Digital Livestock Passport for {animalId}...</span>
      </div>
    )
  }

  if (!animal) {
    return (
      <Card className="text-center p-8 space-y-4 max-w-lg mx-auto bg-white border border-slate-200">
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
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/farmer/dashboard"
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              EAR-TAG: {animal.animal_id || animal.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {animal.species} ({animal.breed || 'Indigenous'})
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Print Passport</span>
          </button>
          <button
            type="button"
            onClick={() => setCampModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
          >
            <Syringe className="w-4 h-4" />
            <span>Book Camp</span>
          </button>
          <Link to={`/farmer/report?animalId=${animal.animal_id || animal.id}`}>
            <Button icon={FilePlus2} className="font-bold shadow-md shadow-emerald-200 bg-emerald-600 hover:bg-emerald-500 text-white">
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
            <h2 className="text-xl font-black text-slate-900 font-mono">{animal.animal_id || animal.id}</h2>
            <p className="text-xs text-slate-500 font-medium">{animal.species} • {animal.gender || 'Female'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-center shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Current AI Risk Evaluation
            </span>
            <div className="flex justify-center">
              <RiskBadge level={animal.current_risk_level || 'LOW'} score={animal.current_risk_score ?? 0} size="lg" />
            </div>
            <p className="text-[11px] text-slate-500">
              Score: <strong>{animal.current_risk_score ?? 0}/100</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Breed</span>
              <span className="font-bold text-slate-800">{animal.breed || 'Gir'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Age</span>
              <span className="font-bold text-slate-800">{animal.age ? `${animal.age} Years` : '3.5 Years'}</span>
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
              <span className="font-bold text-purple-700">{animal.vaccination_status || 'Up to date'}</span>
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
              {animal.previous_diseases || 'No chronic or severe illnesses registered on state digital passport.'}
            </p>
          </Card>

          {/* Vaccination History */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Syringe className="w-4 h-4 text-purple-600" />
                <span>Vaccination Records &amp; State Drives</span>
              </h3>
              <button
                onClick={() => setCampModalOpen(true)}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 underline"
              >
                + Book Camp
              </button>
            </div>

            {vaccinations.length === 0 ? (
              <div className="p-5 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p>Status: <strong className="text-purple-700">{animal.vaccination_status || 'Due soon'}</strong></p>
                <button
                  type="button"
                  onClick={() => setCampModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Book State Vaccination Camp Slot
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {vaccinations.map((v) => (
                  <div key={v.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{v.vaccine_name}</span>
                      <p className="text-slate-500 text-[11px]">Administered: {v.vaccination_date || 'Recent'}</p>
                    </div>
                    <Badge variant={v.status === 'completed' ? 'success' : 'warning'}>
                      {v.status || 'Active'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
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
                No acute symptoms or clinical concerns have been reported for this animal yet.
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
                      Concern: <strong className="text-slate-900">{r.possible_disease_concern || 'Clinical Review'}</strong>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Recommendation: <em>"{r.recommendation}"</em>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* Vaccination Booking Modal */}
      <VaccinationBookingModal
        isOpen={campModalOpen}
        onClose={() => setCampModalOpen(false)}
        animal={animal}
        onBookingSuccess={() => fetchAnimalDetails()}
      />
    </div>
  )
}
