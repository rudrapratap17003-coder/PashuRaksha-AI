import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Activity, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Stethoscope, 
  TestTube2, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Microscope,
  Send,
  Sparkles,
  Plus
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import RiskBadge from '../../components/common/RiskBadge'
import apiClient from '../../services/api'
import PrescriptionGeneratorModal from '../../components/vet/PrescriptionGeneratorModal'

export default function CaseDetailsPage() {
  const { caseId } = useParams()
  const [caseData, setCaseData] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rxModalOpen, setRxModalOpen] = useState(false)

  const fetchCaseDetails = async () => {
    setLoading(true)
    const effectiveId = caseId || 'rep-101'
    try {
      const [reportRes, timeRes] = await Promise.all([
        apiClient.get(`/health-reports/${effectiveId}`),
        apiClient.get(`/cases/${effectiveId}/timeline`)
      ])
      setCaseData(reportRes.data)
      setTimeline(timeRes.data)
    } catch {
      // Fallback Demo Data for Case
      setCaseData({
        id: effectiveId,
        animal_id: 'COW-101',
        reporter_name: 'Ramesh Patil',
        species: 'Cattle (Cow)',
        breed: 'Gir',
        village: 'Baramati',
        district: 'Pune',
        severity: 'severe',
        duration_days: 3,
        number_of_animals_affected: 4,
        fever: true,
        cough: true,
        difficulty_breathing: true,
        reduced_appetite: true,
        reduced_milk: true,
        risk_score: 74.0,
        risk_level: 'HIGH',
        possible_disease_concern: 'Possible Bovine Respiratory Disease / Elevated Viral Concern',
        recommendation: 'Urgent veterinary assessment. Isolate animal, provide clean water, and verify herd vaccination.',
        reported_at: '2026-08-28T10:30:00'
      })
      setTimeline([
        {
          id: 'evt-1',
          event_type: 'report_created',
          title: 'Health Symptom Report Lodged',
          description: 'Farmer reported fever, dyspnea, and appetite loss in Gir Cow COW-101.',
          actor_name: 'Ramesh Patil',
          actor_role: 'farmer',
          created_at: '2026-08-28T10:30:00'
        },
        {
          id: 'evt-2',
          event_type: 'ai_triage',
          title: 'AI Multi-Factor Risk Assessment: HIGH (74/100)',
          description: 'Respiratory complex pattern identified. Synergistic severity multipliers triggered.',
          actor_name: 'Pashuraksha Risk Engine',
          actor_role: 'system',
          created_at: '2026-08-28T10:31:00'
        },
        {
          id: 'evt-3',
          event_type: 'field_visit',
          title: 'Field Verification by Pashu Sakhi',
          description: 'Physical exam confirmed rectal temp of 104.5°F and wheezing sounds.',
          actor_name: 'Ankita Jadhav',
          actor_role: 'field_worker',
          created_at: '2026-08-28T14:15:00'
        },
        {
          id: 'evt-4',
          event_type: 'sample_collected',
          title: 'Nasal Swab Collected for RT-PCR',
          description: 'Sterile swab collected and dispatched under cold chain to Pune Diagnostic Lab.',
          actor_name: 'Dr. Priya Sharma',
          actor_role: 'veterinarian',
          created_at: '2026-08-29T09:45:00'
        },
        {
          id: 'evt-5',
          event_type: 'lab_result',
          title: 'Diagnostic Lab Result: POSITIVE',
          description: 'BVD virus RNA confirmed via RT-PCR. Antibiotic susceptibility issued.',
          actor_name: 'Dr. Suhas Kulkarni',
          actor_role: 'laboratory',
          created_at: '2026-08-30T11:00:00'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCaseDetails()
  }, [caseId])

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!note.trim()) return
    setSubmitting(true)
    const effectiveId = caseId || 'rep-101'
    try {
      await apiClient.post(`/cases/${effectiveId}/timeline`, {
        event_type: 'treatment',
        title: 'Clinical Treatment Note',
        description: note,
        actor_name: 'Attending Veterinarian',
        actor_role: 'veterinarian'
      })
      setTimeline(prev => [
        ...prev,
        {
          id: `evt-${Date.now()}`,
          event_type: 'treatment',
          title: 'Clinical Treatment Note',
          description: note,
          actor_name: 'Attending Veterinarian',
          actor_role: 'veterinarian',
          created_at: new Date().toISOString()
        }
      ])
      setNote('')
    } catch {
      setTimeline(prev => [
        ...prev,
        {
          id: `evt-${Date.now()}`,
          event_type: 'treatment',
          title: 'Clinical Treatment Note',
          description: note,
          actor_name: 'Attending Veterinarian',
          actor_role: 'veterinarian',
          created_at: new Date().toISOString()
        }
      ])
      setNote('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <Link to="/vet/dashboard" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Clinical Queue</span>
      </Link>

      {/* Case Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Digital Clinical Case Record • Maharashtra Animal Husbandry</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Case #{caseData?.id || 'rep-101'}
            </h1>
            <RiskBadge level={caseData?.risk_level} score={caseData?.risk_score} />
          </div>
          <p className="text-slate-300 text-sm mt-1">
            Animal Tag: <strong className="text-white">{caseData?.animal_id}</strong> ({caseData?.species}) • Owner: {caseData?.reporter_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setRxModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center space-x-2 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Official Rx</span>
          </button>
          <span className="text-xs bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{caseData?.village}, {caseData?.district}</span>
          </span>
        </div>
      </div>

      {/* Grid: Left 7 Cols (Case Breakdown), Right 5 Cols (Interactive Lifecycle Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col */}
        <div className="lg:col-span-7 space-y-6">
          {/* Clinical Vitals */}
          <Card className="bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-black text-white mb-3">Clinical Signs & AI Risk Attribution</h3>
            
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 mb-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Suspected Disease Concern:</span>
                <span className="font-bold text-amber-300">{caseData?.possible_disease_concern}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Herd Animals Affected:</span>
                <span className="font-bold text-white">{caseData?.number_of_animals_affected} animals</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Symptom Duration:</span>
                <span className="font-bold text-white">{caseData?.duration_days} days</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Observed Symptoms</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  caseData?.fever && 'Fever',
                  caseData?.cough && 'Cough',
                  caseData?.difficulty_breathing && 'Dyspnea / Panting',
                  caseData?.reduced_appetite && 'Loss of Appetite',
                  caseData?.reduced_milk && 'Milk Yield Drop',
                  caseData?.salivation && 'Salivation',
                  caseData?.lesions && 'Blisters/Lesions',
                  caseData?.swelling && 'Swelling',
                  caseData?.diarrhea && 'Diarrhea',
                  caseData?.lethargy && 'Lethargy'
                ].filter(Boolean).map((s, idx) => (
                  <span key={idx} className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-200 leading-relaxed">
              <strong className="text-amber-300 block mb-1">Standard Veterinary Advisory:</strong>
              {caseData?.recommendation}
            </div>
          </Card>

          {/* Add Treatment Note Form */}
          <Card className="bg-slate-900/80 border-slate-800">
            <h3 className="text-sm font-black text-white mb-2">Record Clinical Action or Prescription</h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Prescribe antipyretic, antibiotics, or record isolation orders..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" loading={submitting} icon={Send} className="bg-emerald-600 hover:bg-emerald-500">
                  Append to Case Timeline
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Col: Interactive Lifecycle Timeline */}
        <div className="lg:col-span-5">
          <Card className="bg-slate-900/80 border-slate-800 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white">Case Lifecycle Timeline</h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {timeline.length} Events
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {timeline.map((evt, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                    evt.event_type === 'lab_result' 
                      ? 'bg-rose-500 animate-pulse'
                      : evt.event_type === 'treatment'
                      ? 'bg-emerald-500'
                      : evt.event_type === 'sample_collected'
                      ? 'bg-sky-500'
                      : 'bg-teal-500'
                  }`} />

                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 space-y-1 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{evt.title}</span>
                      <span className="text-[9px] text-slate-500 uppercase font-bold">{evt.actor_role}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{evt.description}</p>
                    <div className="flex items-center justify-between pt-1 text-[9px] text-slate-500">
                      <span>By {evt.actor_name || 'System'}</span>
                      <span>{new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Official AI Prescription Generator Modal */}
      <PrescriptionGeneratorModal
        isOpen={rxModalOpen}
        onClose={() => setRxModalOpen(false)}
        caseData={caseData}
        onPrescriptionCreated={(rx) => {
          setTimeline(prev => [
            ...prev,
            {
              id: `evt-${Date.now()}`,
              event_type: 'treatment',
              title: `Official Rx Generated: ${rx.prescription_id}`,
              description: `Prescribed ${rx.medications.length} medications for ${rx.diagnosis} (Withdrawal milk: ${rx.withdrawal_period.milk}).`,
              actor_name: rx.veterinarian.name,
              actor_role: 'veterinarian',
              created_at: new Date().toISOString()
            }
          ])
        }}
      />
    </div>
  )
}
