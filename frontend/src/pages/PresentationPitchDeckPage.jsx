import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Activity,
  ShieldCheck,
  Award,
  Layers,
  Cpu,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  Radio,
  Tv
} from 'lucide-react'
import SurveillanceBackground from '../components/background/SurveillanceBackground'

const SLIDES = [
  {
    id: 1,
    tag: 'SLIDE 01 • EXECUTIVE BRIEF',
    title: 'PASHURAKSHA AI (पशुरक्षा AI)',
    subtitle: 'Livestock Health Intelligence, Outbreak Early-Warning & Response Platform',
    department: 'Maharashtra State Innovation Society (MSInS) • Govt. of Maharashtra',
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-sky-100 text-center space-y-2 shadow-sm">
            <span className="text-3xl">🏆</span>
            <h4 className="text-sm font-bold text-slate-900">Smart India Hackathon 2026</h4>
            <p className="text-xs text-sky-600 font-mono font-bold">PS ID: SIH26128</p>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-sky-100 text-center space-y-2 shadow-sm">
            <span className="text-3xl">🏛️</span>
            <h4 className="text-sm font-bold text-slate-900">Target Beneficiary State</h4>
            <p className="text-xs text-sky-600 font-bold">Government of Maharashtra</p>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-sky-100 text-center space-y-2 shadow-sm">
            <span className="text-3xl">⚡</span>
            <h4 className="text-sm font-bold text-slate-900">Core Impact Metric</h4>
            <p className="text-xs text-sky-600 font-bold">&lt; 4 Hr Detection vs 7 Days</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-sky-50/80 border border-sky-100 text-xs text-slate-700 leading-relaxed space-y-2">
          <h4 className="font-bold text-sky-900 uppercase text-xs">The Problem Statement SIH26128</h4>
          <p>
            Livestock infectious diseases (FMD, Lumpy Skin Disease, Hemorrhagic Septicemia) cause severe dairy yield collapse and farmer debt. Conventional reporting relies on paper registers with a 7–10 day lag, allowing rapid airborne spread.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    tag: 'SLIDE 02 • MULTI-STAKEHOLDER ARCHITECTURE',
    title: 'Closed-Loop 6-Portal Architecture',
    subtitle: 'Connecting the entire rural veterinary ecosystem into one unified telemetry grid',
    content: (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        {[
          { name: '1. Farmer Shed Portal', desc: '11-symptom syndromic intake, Marathi voice assistant, vision lesion scan, feed optimizer.' },
          { name: '2. Pashu Sakhi Hub', desc: 'Village door-to-door livestock census, offline-first reporting, sample tracking.' },
          { name: '3. Vet Clinical Desk', desc: 'AI triage queue, digital WhatsApp prescription engine, lab referral dispatch.' },
          { name: '4. Diagnostic Lab Desk', desc: 'Biological sample accessioning, RT-PCR validation, central registry sync.' },
          { name: '5. District Authority Command', desc: 'Spatial GIS contagion heatmap, 10km quarantine cordon, 1962 MVU GPS dispatch.' },
          { name: '6. Epidemiology Desk', desc: 'Attack rates, district incidence curves, dairy economic loss & relief calculators.' }
        ].map((p, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-sky-100 space-y-1 shadow-sm">
            <strong className="text-sky-700 font-bold block">{p.name}</strong>
            <p className="text-slate-500 text-[11px] leading-tight">{p.desc}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 3,
    tag: 'SLIDE 03 • AI & DEEP-TECH ENGINES',
    title: 'Explainable AI Risk & Decision Support',
    subtitle: 'Combining symptom synergies, clinical histories, and spatial clustering',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white border border-sky-100 space-y-2 shadow-sm">
          <span className="text-2xl">🧠</span>
          <h4 className="font-bold text-slate-900">Syndromic Risk Engine</h4>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Multi-symptom interaction matrix calculating non-linear disease risk scores (0–100) with explainable positive/negative clinical drivers.
          </p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-sky-100 space-y-2 shadow-sm">
          <span className="text-2xl">📸</span>
          <h4 className="font-bold text-slate-900">Pashu-Drishti Vision AI</h4>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Camera-based convolutional lesion analysis for real-time visual classification of FMD blisters, Lumpy Skin nodules, and Mastitis.
          </p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-sky-100 space-y-2 shadow-sm">
          <span className="text-2xl">🌡️</span>
          <h4 className="font-bold text-slate-900">Cold Chain IoT &amp; Telematics</h4>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Real-time vaccine vial monitor (VVM) and 2°C–8°C thermal telemetry logging for ring vaccination logistics.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    tag: 'SLIDE 04 • MAHARASHTRA GOVERNANCE & 1962 FLEET',
    title: '1962 MVU Ambulance & APMC Biosecurity',
    subtitle: 'From outbreak alert to boots-on-the-ground containment in 15 minutes',
    content: (
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-sky-100 space-y-2 shadow-sm">
            <span className="text-2xl">🚑</span>
            <h4 className="font-bold text-slate-900">1962 Pashu Sanjeevani MVU GPS</h4>
            <p className="text-slate-600 text-[11px]">
              Live GPS dispatch of mobile veterinary units with onboard cold-box monitoring to reach rural farm coordinates within 15–20 minutes.
            </p>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-sky-100 space-y-2 shadow-sm">
            <span className="text-2xl">🛡️</span>
            <h4 className="font-bold text-slate-900">APMC Weekly Market Gatekeeper</h4>
            <p className="text-slate-600 text-[11px]">
              Digital transit permit QR scanner that automatically blocks livestock originating from within active 10km quarantine cordons.
            </p>
          </div>
        </div>
      </div>
    )
  }
]

export default function PresentationPitchDeckPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const nextSlide = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const currentSlide = SLIDES[currentSlideIndex]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      <SurveillanceBackground />

      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-sky-100 pb-4 max-w-5xl w-full mx-auto relative z-10">
        <Link
          to="/presentation"
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center space-x-1.5 text-xs font-bold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Console</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            Slide {currentSlideIndex + 1} of {SLIDES.length}
          </span>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="my-auto max-w-5xl w-full mx-auto p-4 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xl space-y-4 sm:space-y-6 relative z-10">
        <div>
          <span className="text-[10px] sm:text-xs font-mono font-bold text-sky-700 uppercase tracking-widest block">
            {currentSlide.tag}
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-1">
            {currentSlide.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{currentSlide.subtitle}</p>
        </div>

        <div className="py-2 sm:py-4">
          {currentSlide.content}
        </div>
      </div>

      {/* Slide Navigation Footer Bar */}
      <div className="flex items-center justify-between border-t border-sky-100 pt-3 sm:pt-4 max-w-5xl w-full mx-auto gap-2 relative z-10">
        <button
          onClick={prevSlide}
          disabled={currentSlideIndex === 0}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 sm:space-x-1.5 ${
            currentSlideIndex === 0 ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Slide</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {/* Dots */}
        <div className="flex space-x-1.5 sm:space-x-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2.5 sm:h-3 rounded-full transition-all ${
                currentSlideIndex === idx ? 'bg-sky-600 w-6 sm:w-8' : 'bg-slate-200 w-2.5 sm:w-3 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlideIndex === SLIDES.length - 1}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 sm:space-x-1.5 ${
            currentSlideIndex === SLIDES.length - 1 ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-sky-600 text-white hover:bg-sky-500 shadow-md shadow-sky-600/20'
          }`}
        >
          <span className="hidden sm:inline">Next Slide</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
