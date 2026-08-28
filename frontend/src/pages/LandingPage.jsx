import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  ArrowRight, 
  Users, 
  Stethoscope, 
  Building2, 
  Activity, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  Layers
} from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import RiskBadge from '../components/common/RiskBadge'
import { useAuth } from '../context/AuthContext'
import { USER_ROLES } from '../utils/constants'

export default function LandingPage() {
  const navigate = useNavigate()
  const { loginAsRole, loading } = useAuth()

  const handleLaunchRole = async (role) => {
    try {
      await loginAsRole(role)
      if (role === USER_ROLES.FARMER) navigate('/farmer/dashboard')
      else if (role === USER_ROLES.VETERINARIAN) navigate('/vet/dashboard')
      else if (role === USER_ROLES.AUTHORITY) navigate('/authority/dashboard')
    } catch {
      if (role === USER_ROLES.FARMER) navigate('/farmer/dashboard')
      else if (role === USER_ROLES.VETERINARIAN) navigate('/vet/dashboard')
      else if (role === USER_ROLES.AUTHORITY) navigate('/authority/dashboard')
    }
  }

  return (
    <div className="space-y-16 py-8">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-8 sm:p-14 shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 • Problem Statement ID #SIH26128</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              PASHURAKSHA <span className="text-emerald-400">AI</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-emerald-100 leading-relaxed">
              Livestock Health Intelligence &amp; Outbreak Early-Warning Platform
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Transforming decentralized rural livestock health reporting into actionable community disease cluster intelligence. Connecting <strong>Farmers</strong>, <strong>Veterinarians</strong>, and <strong>Public Health Authorities</strong> for proactive disease containment.
            </p>

            {/* Quick 1-Click Role Launchers */}
            <div className="pt-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                ⚡ Quick Demo Mode — Launch Stakeholder Portals:
              </span>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleLaunchRole(USER_ROLES.FARMER)}
                  icon={Users}
                  size="md"
                  loading={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Farmer Portal
                </Button>
                <Button
                  onClick={() => handleLaunchRole(USER_ROLES.VETERINARIAN)}
                  icon={Stethoscope}
                  variant="outline"
                  size="md"
                  loading={loading}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold"
                >
                  Veterinarian Desk
                </Button>
                <Button
                  onClick={() => handleLaunchRole(USER_ROLES.AUTHORITY)}
                  icon={Building2}
                  variant="outline"
                  size="md"
                  loading={loading}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold"
                >
                  Authority Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core USP Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="primary" dot>The Core Innovation</Badge>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            From Individual Records to District Outbreak Intelligence
          </h2>
          <p className="text-sm text-slate-600">
            A continuous decision-support pipeline linking local symptoms to broad public health action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="space-y-3 border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              1
            </div>
            <h3 className="font-bold text-slate-900">Symptom Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Farmers record livestock profiles, vaccinations, and report simple symptom checklists with duration and severity.
            </p>
          </Card>

          <Card className="space-y-3 border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              2
            </div>
            <h3 className="font-bold text-slate-900">Explainable AI Risk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hybrid risk engine computes normalized scores (0-100) with transparent risk factor contribution breakdowns.
            </p>
          </Card>

          <Card className="space-y-3 border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              3
            </div>
            <h3 className="font-bold text-slate-900">Cluster Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Spatial-temporal engine groups nearby correlated cases to identify emerging disease hotspots automatically.
            </p>
          </Card>

          <Card className="space-y-3 border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              4
            </div>
            <h3 className="font-bold text-slate-900">Targeted Response</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Veterinarians triage high-priority cases while authorities receive village surveillance heatmaps and alerts.
            </p>
          </Card>
        </div>
      </section>

      {/* Decision-Support Risk Matrix Demonstration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-slate-900 text-white p-8 space-y-6 border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Decision Support
              </span>
              <h3 className="text-2xl font-bold">Standardized Risk Stratification</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Prototypes adhere to non-diagnostic decision-support protocols with transparent classification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/30 space-y-2">
              <RiskBadge level="LOW" score="18" />
              <p className="text-xs text-slate-300">Score 0–29: Normal vitals. Routine monitoring.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/30 space-y-2">
              <RiskBadge level="MODERATE" score="44" />
              <p className="text-xs text-slate-300">Score 30–59: Mild symptoms. Increased watch advised.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-orange-500/30 space-y-2">
              <RiskBadge level="HIGH" score="68" />
              <p className="text-xs text-slate-300">Score 60–79: Elevated risk. Vet consultation recommended.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-rose-500/30 space-y-2">
              <RiskBadge level="CRITICAL" score="88" />
              <p className="text-xs text-slate-300">Score 80–100: Multiple severe symptoms. Urgent triage.</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
