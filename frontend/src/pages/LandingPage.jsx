import React from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Stethoscope,
  Building2,
  AlertTriangle,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
  Shield,
  Truck,
  Presentation,
  QrCode,
  Microscope,
  Cpu,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import Button from '../components/common/Button'
import OutbreakMap from '../components/map/OutbreakMap'
import SurveillanceBackground from '../components/background/SurveillanceBackground'
import WeatherWidget from '../components/common/WeatherWidget'
import PashuLogo from '../components/common/PashuLogo'

export default function LandingPage() {

  const portals = [
    {
      title: 'Farmer Portal',
      marathi: 'शेतकरी कक्ष',
      description: 'Report animal symptoms, scan with camera, get AI advice in Marathi.',
      link: '/farmer/dashboard',
      icon: Users,
      color: 'bg-sky-600',
    },
    {
      title: 'Pashu Sakhi / Field Worker',
      marathi: 'पशु सखी',
      description: 'Door-to-door livestock census & offline sample collection.',
      link: '/field-worker/dashboard',
      icon: Activity,
      color: 'bg-teal-600',
    },
    {
      title: 'Veterinary Desk',
      marathi: 'पशुवैद्यकीय दवाखाना',
      description: 'AI case triage, prescriptions, and lab referrals.',
      link: '/vet/dashboard',
      icon: Stethoscope,
      color: 'bg-blue-600',
    },
    {
      title: 'Diagnostic Lab',
      marathi: 'रोग निदान प्रयोगशाळा',
      description: 'Sample testing, RT-PCR results, and outbreak sync.',
      link: '/lab/dashboard',
      icon: Microscope,
      color: 'bg-cyan-600',
    },
    {
      title: 'State Authority',
      marathi: 'जिल्हा व राज्य नियंत्रण कक्ष',
      description: 'District maps, containment zones, and 1962 ambulance dispatch.',
      link: '/authority/dashboard',
      icon: Building2,
      color: 'bg-indigo-600',
    },
    {
      title: 'Analytics & Reports',
      marathi: 'साथरोग विश्लेषण',
      description: 'Disease trends, breed data, economic loss reports.',
      link: '/analytics',
      icon: TrendingUp,
      color: 'bg-amber-600',
    }
  ]

  const corePillars = [
    {
      step: '01',
      title: 'Early Warning System',
      desc: 'Farmers report symptoms in Marathi by voice or text. AI detects disease risk within hours.',
      icon: Cpu,
    },
    {
      step: '02',
      title: 'Camera Disease Scan',
      desc: 'Point your phone camera at the animal. AI identifies Foot & Mouth, Lumpy Skin, Mastitis.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Vaccine & Ambulance Tracking',
      desc: 'Live tracking of vaccine cold-chain temperature and 1962 MVU ambulance location.',
      icon: Truck,
    },
    {
      step: '04',
      title: 'Market Biosecurity',
      desc: 'QR-based health check at APMC markets to stop sick animals from spreading disease.',
      icon: QrCode,
    }
  ]

  return (
    <div className="relative text-slate-800 font-sans overflow-x-hidden min-h-screen bg-white">
      <SurveillanceBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-8 sm:pt-14 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Smart India Hackathon 2026 • SIH26128</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Livestock Health &amp;<br className="hidden sm:inline" />
              <span className="text-sky-600">Disease Protection</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              <strong>PASHURAKSHA AI</strong> — Built for <strong>Government of Maharashtra</strong>. 
              Early detection of animal diseases using AI, camera scanning, voice reporting in Marathi, 
              and emergency ambulance dispatch.
            </p>

            {/* CTAs — Large, Easy to Tap */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link to="/farmer/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  icon={ArrowRight}
                  className="w-full sm:w-auto font-bold bg-sky-600 hover:bg-sky-700 text-white text-base py-4 px-8 border-0 rounded-xl transition-colors duration-200"
                >
                  Open Demo
                </Button>
              </Link>

              <Link to="/presentation" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  icon={Presentation}
                  className="w-full sm:w-auto font-bold bg-white border-slate-300 text-slate-700 hover:bg-sky-50 hover:border-sky-400 text-base py-4 px-8 rounded-xl transition-colors duration-200"
                >
                  Jury Presentation
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-slate-600 border-t border-slate-200">
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <Shield className="w-4 h-4 text-sky-600" />
                <span className="font-semibold">Maharashtra State Innovation Society</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">Dept. of Animal Husbandry</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Live Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-sm font-bold text-slate-700">Live Surveillance</span>
                </div>
                <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 rounded-full font-semibold">
                  Pune Division
                </span>
              </div>

              <WeatherWidget district="Pune" village="Baramati" />

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-xs text-slate-500 block font-medium">Active Containment</span>
                  <span className="text-sm font-bold text-rose-600">#RC-2026-014 (Baramati)</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-xs text-slate-500 block font-medium">Vaccination Coverage</span>
                  <span className="text-sm font-bold text-emerald-600">78.5% (278/355)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars — Simple & Clear */}
      <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-sm font-bold text-sky-700 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-200">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            4 Steps to Protect Your Animals
          </h2>
          <p className="text-base text-slate-500 mt-2">आपल्या जनावरांचे संरक्षण करण्याचे ४ मार्ग</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {corePillars.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.step}
                className="group p-5 rounded-2xl bg-white border border-slate-200 shadow-sm card-hover space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-sky-600">{p.step}</span>
                  <div className="w-11 h-11 rounded-xl bg-sky-600 flex items-center justify-center text-white icon-lift">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 6 Portals — Big Tap Targets for Farmers */}
      <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-sm font-bold text-sky-700 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-200">
            PORTALS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Choose Your Portal
          </h2>
          <p className="text-base text-slate-500 mt-2">आपला कक्ष निवडा</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portals.map((p) => {
            const Icon = p.icon
            return (
              <Link
                key={p.title}
                to={p.link}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 card-hover shadow-sm flex items-start space-x-4"
              >
                <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center text-white flex-shrink-0 icon-lift`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-200">
                    {p.title}
                  </h3>
                  <span className="text-sm text-sky-600 font-semibold">{p.marathi}</span>
                  <p className="text-sm text-slate-500 mt-1">{p.description}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-sky-600 mt-2">
                    Open <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Map Section */}
      <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Live Disease Map
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time outbreak locations across Pune, Satara, and Solapur districts.
            </p>
          </div>
          <Link to="/authority/dashboard">
            <button className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 text-sm font-semibold flex items-center space-x-2 transition-colors duration-200">
              <span>Full Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-80 sm:h-96">
          <OutbreakMap />
        </div>
      </section>
    </div>
  )
}
