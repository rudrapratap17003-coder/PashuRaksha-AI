import React from 'react'
import { X, PawPrint, Calendar, Scale, Droplet, ShieldAlert, Syringe, MapPin, FileText } from 'lucide-react'
import RiskBadge from '../common/RiskBadge'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { Link } from 'react-router-dom'

export default function AnimalDetailModal({ animal, onClose }) {
  if (!animal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 space-y-6 p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-slate-400">
                EAR-TAG: {animal.animal_id}
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {animal.species}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Breed: <strong>{animal.breed}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Status Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Health Risk Status
            </span>
            <div className="text-xs text-slate-600">
              Score: <strong>{animal.current_risk_score ?? 0}/100</strong>
            </div>
          </div>
          <RiskBadge
            level={animal.current_risk_level || 'LOW'}
            score={animal.current_risk_score}
            size="lg"
          />
        </div>

        {/* Animal Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Age</span>
            </span>
            <p className="font-bold text-slate-800">{animal.age} Years</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Weight</span>
            </span>
            <p className="font-bold text-slate-800">{animal.weight ? `${animal.weight} kg` : 'N/A'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center space-x-1">
              <Droplet className="w-3.5 h-3.5" />
              <span>Milk Yield</span>
            </span>
            <p className="font-bold text-slate-800">
              {animal.milk_production ? `${animal.milk_production} L/day` : 'N/A'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center space-x-1">
              <Syringe className="w-3.5 h-3.5" />
              <span>Vaccination</span>
            </span>
            <p className="font-bold text-slate-800">{animal.vaccination_status || 'Up to date'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
            <span className="text-slate-400 font-semibold flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Registered Location</span>
            </span>
            <p className="font-bold text-slate-800">{animal.village || 'Rampur'}, {animal.district || 'Jaipur Rural'}</p>
          </div>
        </div>

        {/* Medical History */}
        <div className="space-y-1 text-xs">
          <span className="font-bold text-slate-700 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Previous Medical History</span>
          </span>
          <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
            {animal.previous_diseases || 'No prior severe illnesses recorded.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <Link to={`/farmer/report?animalId=${animal.animal_id}`} className="flex-1">
            <Button size="md" className="w-full font-bold">
              Report Symptoms
            </Button>
          </Link>
          <Button variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
