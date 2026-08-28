import React, { useState } from 'react'
import { 
  X, 
  Stethoscope, 
  PawPrint, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Syringe, 
  TestTube2, 
  Send,
  Calendar,
  Clock,
  ShieldAlert
} from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import RiskBadge from '../common/RiskBadge'
import Badge from '../common/Badge'
import apiClient from '../../services/api'

export default function VetCaseModal({ caseItem, onClose, onActionSuccess }) {
  if (!caseItem) return null

  const [actionType, setActionType] = useState('Investigated & Advised')
  const [notes, setNotes] = useState(caseItem.veterinary_notes || '')
  const [labReferral, setLabReferral] = useState(caseItem.lab_referral || false)
  const [status, setStatus] = useState(caseItem.status || 'investigated')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmitAction = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await apiClient.post(`/vet/cases/${caseItem.id}/action`, {
        action: actionType,
        notes,
        lab_referral: labReferral,
        status,
      })
      setSuccess(true)
      setTimeout(() => {
        if (onActionSuccess) onActionSuccess()
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to submit clinical action')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-black">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-slate-400">
                CASE ID: {caseItem.id}
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {caseItem.animal_id} — {caseItem.species} ({caseItem.breed || 'Indigenous'})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Clinical investigation recorded and updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Farmer & Location Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Farmer</span>
            <p className="font-bold text-slate-900">{caseItem.farmer_name || 'Ramesh Kumar'}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Phone</span>
            <p className="font-bold text-slate-900 flex items-center space-x-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{caseItem.farmer_phone || '9876543210'}</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium">Location</span>
            <p className="font-bold text-slate-900 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{caseItem.village || 'Rampur'}</span>
            </p>
          </div>
        </div>

        {/* AI Differential Evaluation */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              AI Decision-Support Assessment
            </span>
            <RiskBadge level={caseItem.risk_level} score={caseItem.risk_score} />
          </div>

          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-900">
              Pattern Match: <span className="text-rose-700 font-extrabold">{caseItem.possible_disease_concern}</span>
            </div>
            <div className="text-slate-500">
              Reported Symptoms: <strong>{caseItem.symptoms?.join(', ') || 'Fever, Respiratory Distress'}</strong>
            </div>
            <div className="text-slate-500">
              Severity: <strong>{caseItem.severity?.toUpperCase()}</strong> • Duration: <strong>{caseItem.duration_days} Days</strong>
            </div>
          </div>

          {caseItem.cluster_flag && (
            <div className="p-2 rounded-lg bg-rose-100/70 border border-rose-300 text-[11px] font-bold text-rose-900 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>⚠️ Linked to Active Spatial Outbreak Cluster #{caseItem.cluster_id || 'clust-101'}</span>
            </div>
          )}
        </div>

        {/* Clinical Action Form */}
        <form onSubmit={handleSubmitAction} className="space-y-4 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-sky-600" />
            <span>Record Veterinary Clinical Action</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Action Performed</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 bg-white font-medium"
              >
                <option value="Investigated & Advised">Investigated &amp; Advised</option>
                <option value="Prescribed Antibiotics / Antipyretics">Prescribed Medication</option>
                <option value="Sample Collected for Lab">Sample Collected for Lab</option>
                <option value="Enforced Strict Farm Quarantine">Enforced Farm Quarantine</option>
                <option value="Administered Emergency Vaccine">Administered Emergency Vaccine</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Case Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 bg-white font-medium"
              >
                <option value="pending">Pending Clinical Inspection</option>
                <option value="investigated">Investigated / Under Treatment</option>
                <option value="resolved">Resolved / Discharged</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="labRef"
              checked={labReferral}
              onChange={(e) => setLabReferral(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded-md focus:ring-sky-500 border-slate-300"
            />
            <label htmlFor="labRef" className="text-xs font-bold text-slate-800 flex items-center space-x-1.5 cursor-pointer">
              <TestTube2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Order Confirmatory Diagnostic Laboratory Referral</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Veterinary Clinical Notes &amp; Rx</label>
            <textarea
              rows="3"
              required
              placeholder="Record diagnostic impressions, prescribed dosage, and isolation instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Button
              type="submit"
              size="md"
              loading={submitting}
              icon={Send}
              className="flex-1 font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-200"
            >
              Submit Veterinary Action
            </Button>
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>

      </Card>
    </div>
  )
}
