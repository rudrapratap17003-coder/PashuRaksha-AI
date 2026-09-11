import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { CheckCircle2, Clock, ShieldAlert, MapPin, HeartPulse, Syringe, ArrowRight, Sparkles, Users, Stethoscope, FlaskConical, Building2, Share2, FileCheck2 } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'

export default function FinalImpactPanel({ onClose, onReset }) {
  const { t } = useLanguage()
  const steps = [
    {
      time: '08:30 AM',
      phase: 'Farmer Intake',
      actor: 'Ramesh Patil (Farmer, Baramati)',
      icon: Users,
      color: 'emerald',
      detail: 'Submitted 7 clinical signs for COW-101 (Gir Cow). 3 herd animals showing fever & oral lesions.'
    },
    {
      time: '08:31 AM',
      phase: 'Explainable AI Risk Engine',
      actor: 'PASHURAKSHA AI Platform',
      icon: HeartPulse,
      color: 'rose',
      detail: 'Risk Score 82/100 (CRITICAL). Detected Vesicular Triad synergy and overdue FMD booster gap.'
    },
    {
      time: '09:45 AM',
      phase: 'Field Verification & Sampling',
      actor: 'Ankita Jadhav (Pashu Sakhi / LSS)',
      icon: MapPin,
      color: 'teal',
      detail: 'On-site rectal temp 104.4°F verified. Sterile oral epithelial swab collected under cold chain.'
    },
    {
      time: '10:30 AM',
      phase: 'Veterinary Triage & Referral',
      actor: 'Dr. Priya Sharma (Baramati Polyclinic)',
      icon: Stethoscope,
      color: 'blue',
      detail: 'Confirmed ulcerative stomatitis. Ordered urgent RT-PCR test with District Disease Lab.'
    },
    {
      time: '11:45 AM',
      phase: 'Laboratory Confirmation',
      actor: 'Dr. Suhas Kulkarni (District Lab, Pune)',
      icon: FlaskConical,
      color: 'purple',
      detail: 'Validated POSITIVE for FMD Virus Serotype O via RT-PCR (Ct: 21.4). Triggered epidemic alert.'
    },
    {
      time: '12:00 PM',
      phase: 'GIS Outbreak Cluster Engine',
      actor: 'Automated Surveillance Centroid',
      icon: ShieldAlert,
      color: 'amber',
      detail: 'Formed Baramati Outbreak Cluster (5.0 km radius, 14 affected animals, Critical Hotspot).'
    },
    {
      time: '12:15 PM',
      phase: 'Authority Rapid Containment',
      actor: 'S. Deshmukh IAS (District Command)',
      icon: Building2,
      color: 'indigo',
      detail: 'Dispatched Mobile Veterinary Unit with 250 ring vaccines. Broadcasted biosecurity SMS advisory.'
    }
  ]

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Headline Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
              Smart India Hackathon 2026 • Evaluation Outcome
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 text-[10px] font-black">
              SIH DEMONSTRATION DATA
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            "From first symptom report to coordinated outbreak response in under 4 hours."
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            By connecting grassroots farmers, field workers, veterinarians, diagnostic laboratories, and government health authorities on a unified explainable surveillance mesh, PASHURAKSHA AI compresses traditional 10–14 day epidemic delays down to hours.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] text-emerald-200 font-bold block uppercase">Response Time</span>
              <strong className="text-xl sm:text-2xl font-black text-white">&lt; 4 Hours</strong>
              <span className="text-[9px] text-emerald-200 block">vs. 10–14 days traditional</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] text-emerald-200 font-bold block uppercase">Containment Radius</span>
              <strong className="text-xl sm:text-2xl font-black text-white">5.0 km</strong>
              <span className="text-[9px] text-emerald-200 block">Baramati Hotspot Perimeter</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] text-emerald-200 font-bold block uppercase">Ring Vaccination</span>
              <strong className="text-xl sm:text-2xl font-black text-white">250 Doses</strong>
              <span className="text-[9px] text-emerald-200 block">Mobile Vet Unit Dispatched</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <span className="text-[10px] text-emerald-200 font-bold block uppercase">Farmer Advisories</span>
              <strong className="text-xl sm:text-2xl font-black text-white">450 Sent</strong>
              <span className="text-[9px] text-emerald-200 block">SMS Containment Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete 7-Stage Closed Loop Timeline */}
      <Card className="bg-white border-slate-200 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Closed-Loop Epidemic Containment Chain of Custody
            </h3>
            <p className="text-xs text-slate-500">
              End-to-end deterministic audit trail across all 6 stakeholder personas
            </p>
          </div>
          <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            7 / 7 Complete
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="relative group">
                {/* Dot / Icon */}
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-emerald-600 text-emerald-600 flex items-center justify-center shadow-md">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {step.time}
                      </span>
                      <strong className="text-sm font-black text-slate-900">{step.phase}</strong>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {step.actor}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Disclaimer footer */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-black block">ACADEMIC &amp; HACKATHON EVALUATION PRINCIPLE</span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              All scenarios, animal ear-tags, and clinical diagnostic confirmations represent synthetic prototype evaluation data specifically prepared for Smart India Hackathon 2026. PASHURAKSHA AI provides decision-support and surveillance intelligence to assist registered veterinarians and statutory livestock authorities.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto font-bold text-xs"
          >Reset Demo Scenario for Next Jury
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
          >
            Close Impact Panel
          </Button>
        </div>
      </Card>
    </div>
  )
}
