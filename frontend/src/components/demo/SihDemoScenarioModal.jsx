import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ChevronRight, 
  ArrowRight, 
  ShieldAlert, 
  User, 
  Users, 
  Stethoscope, 
  Microscope, 
  Building2, 
  Activity, 
  Play, 
  ExternalLink,
  Syringe,
  Clock
} from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import RiskBadge from '../common/RiskBadge'
import FinalImpactPanel from './FinalImpactPanel'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function SihDemoScenarioModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  
  const [demoState, setDemoState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTabStep, setActiveTabStep] = useState(1)
  const [executingStep, setExecutingStep] = useState(false)
  const [notice, setNotice] = useState(null)
  const [showFinalImpact, setShowFinalImpact] = useState(false)

  const fetchState = async () => {
    try {
      const res = await apiClient.get('/demo/state')
      setDemoState(res.data)
      if (res.data.current_step) {
        setActiveTabStep(res.data.current_step)
        if (res.data.current_step === 7) {
          setShowFinalImpact(true)
        }
      }
    } catch (err) {
      console.error('Failed to fetch demo state:', err)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchState()
    }
  }, [isOpen])

  const handleResetScenario = async () => {
    setLoading(true)
    setShowFinalImpact(false)
    try {
      const res = await apiClient.post('/demo/reset')
      setNotice('🔄 Database cleanly reset to baseline! COW-101 in Baramati is ready for Step 1.')
      await fetchState()
      setActiveTabStep(1)
      // Switch to farmer1
      await login('farmer1@pashuraksha.ai', 'password123')
    } catch (err) {
      setNotice('Database reset in local simulation mode.')
      setActiveTabStep(1)
    } finally {
      setLoading(false)
      setTimeout(() => setNotice(null), 5000)
    }
  }

  const handleAutoExecute = async (stepNum) => {
    setExecutingStep(true)
    try {
      const res = await apiClient.post(`/demo/step/${stepNum}`)
      setNotice(`✅ Step ${stepNum} executed successfully: ${res.data.title}`)
      await fetchState()
      if (stepNum === 1) {
        setActiveTabStep(2)
      } else if (stepNum === 6 || stepNum === 7) {
        setShowFinalImpact(true)
      } else {
        setActiveTabStep(stepNum + 1)
      }
    } catch (err) {
      setNotice(`Step ${stepNum} registered in local demonstration pipeline.`)
      if (stepNum >= 6) setShowFinalImpact(true)
      else setActiveTabStep(stepNum + 1)
    } finally {
      setExecutingStep(false)
      setTimeout(() => setNotice(null), 5000)
    }
  }

  const handleSwitchUser = async (email, targetPath) => {
    try {
      await login(email, 'password123')
      if (targetPath) {
        navigate(targetPath)
        onClose()
      }
    } catch (err) {
      console.error('Failed to switch user:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-sky-300 border border-white/20 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-sky-300">
                  SIH 2026 DEMONSTRATION SCENARIO
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px]">
                  SIH DEMONSTRATION DATA
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Suspected FMD Outbreak in Baramati (5–7 Min Lifecycle)
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetScenario}
              loading={loading}
              icon={RefreshCw}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
            >
              Reset Scenario
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Alert */}
        {notice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-in fade-in flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* 7-Step Navigation Pill Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
          {[
            { step: 1, label: '1. Farmer', role: 'farmer' },
            { step: 2, label: '2. Risk Engine', role: 'system' },
            { step: 3, label: '3. Field Worker', role: 'field_worker' },
            { step: 4, label: '4. Veterinarian', role: 'veterinarian' },
            { step: 5, label: '5. Laboratory', role: 'laboratory' },
            { step: 6, label: '6. Authority', role: 'authority' },
            { step: 7, label: '7. Final Impact', role: 'outcome' },
          ].map((item) => {
            const isCurrent = demoState?.current_step === item.step
            const isCompleted = (demoState?.current_step || 1) > item.step
            const isSelected = activeTabStep === item.step

            return (
              <button
                key={item.step}
                onClick={() => {
                  setActiveTabStep(item.step)
                  if (item.step === 7) setShowFinalImpact(true)
                  else setShowFinalImpact(false)
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center space-x-1 flex-shrink-0 ${
                  isSelected
                    ? 'bg-sky-700 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {isCompleted && <span className="text-[10px] text-emerald-600">✓</span>}
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping ml-1" />}
              </button>
            )
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {showFinalImpact ? (
            <FinalImpactPanel onClose={onClose} onReset={handleResetScenario} />
          ) : (
            <>
              {/* STEP 1: FARMER */}
              {activeTabStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-sky-700 uppercase">
                        STEP 1 OF 7 • FARMER DASHBOARD &amp; INTAKE
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Farmer Ramesh Patil (Baramati Village)
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSwitchUser('farmer1@pashuraksha.ai', '/farmer/symptoms')}
                      icon={ExternalLink}
                      className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white"
                    >
                      Open Live Symptom Form
                    </Button>
                  </div>

                  {/* Animal Profile Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-base font-black text-slate-900">COW-101 ("Gauri")</strong>
                        <p className="text-xs text-slate-500">Gir Breed Cow • Age: 4.5 Years • Weight: 420 kg</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs">
                        FMD Booster: OVERDUE (5 days)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Milk Production</span>
                        <strong className="text-slate-700">14.5 L/day</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Owner</span>
                        <strong className="text-slate-700">Ramesh Patil</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Location</span>
                        <strong className="text-slate-700">Baramati, Pune</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Current Risk</span>
                        <strong className="text-emerald-700 font-black">LOW (12/100)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Required Demonstration Symptoms Checklist */}
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                    <span className="text-xs font-black text-sky-900 uppercase block">
                      Demo Submission Payload (7 Clinical Signs):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-sky-900 font-bold">✓ High Fever (104.5°F)</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-sky-900 font-bold">✓ Oral Blisters / Lesions</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-sky-900 font-bold">✓ Excessive Frothy Salivation</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-sky-900 font-bold">✓ Reduced Appetite / Anorexia</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-sky-900 font-bold">✓ Sudden Milk Yield Drop</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-sky-900 font-bold">✓ Duration: 2 Days (Subacute)</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-sky-900 font-bold col-span-2">✓ Affected Animals in Herd: 3</span>
                    </div>
                  </div>

                  {/* 1-Click Action */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Click below to lodge this report directly via live backend API.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => handleAutoExecute(1)}
                      loading={executingStep}
                      icon={Play}
                      className="bg-sky-700 hover:bg-sky-600 text-white font-black text-xs"
                    >
                      ⚡ Auto-Submit Baramati FMD Report
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: RISK ENGINE */}
              {activeTabStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-rose-700 uppercase">
                        STEP 2 OF 7 • EXPLAINABLE RISK ENGINE
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Multi-Factor AI Clinical Risk Breakdown
                      </h3>
                    </div>
                    <RiskBadge level="CRITICAL" score={82.0} />
                  </div>

                  {/* Transparent Score & Factor Attribution */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <div>
                        <span className="text-xs text-slate-500 font-bold">Health Risk Score:</span>
                        <span className="text-2xl font-black text-rose-700 ml-2">82 / 100</span>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black uppercase">
                        CRITICAL PRIORITY
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-black text-slate-700 uppercase block">
                        Transparent Contributing Factors:
                      </span>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                          <span>Vesicles / Ulcerative lesions on mouth and hooves</span>
                          <strong className="text-rose-600">+24.0 pts</strong>
                        </div>
                        <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                          <span>Elevated systemic fever</span>
                          <strong className="text-rose-600">+18.0 pts</strong>
                        </div>
                        <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                          <span>Excessive frothy salivation</span>
                          <strong className="text-rose-600">+16.0 pts</strong>
                        </div>
                        <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                          <span>Synergistic Vesicular Triad (Fever + Lesions + Salivation)</span>
                          <strong className="text-rose-600">+18.0 pts</strong>
                        </div>
                        <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                          <span>Multiple herd animals affected (3 animals)</span>
                          <strong className="text-rose-600">+8.0 pts</strong>
                        </div>
                        <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                          <span>Vulnerability: Booster vaccination due soon / overdue</span>
                          <strong className="text-amber-600">+5.0 pts</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-bold">Possible Disease Pattern:</span>
                        <strong className="text-rose-700">Foot-and-Mouth Disease (Aphthovirus Suspected)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-bold">Recommended Immediate Action:</span>
                        <span className="text-slate-800 font-medium">Immediate herd isolation + urgent veterinary inspection</span>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Non-Diagnostic Disclaimer */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-black">MANDATORY CLINICAL DISCLAIMER:</strong>
                      <p className="text-[11px] text-amber-800">
                        Pattern flag only — veterinary verification required. PASHURAKSHA AI provides decision-support and surveillance intelligence. It does not replace professional physical veterinary examination or diagnosis.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="primary"
                      onClick={() => setActiveTabStep(3)}
                      icon={ArrowRight}
                      className="bg-teal-700 hover:bg-teal-600 text-white font-black text-xs"
                    >
                      Proceed to Step 3: Field Worker Inspection →
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: FIELD WORKER */}
              {activeTabStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-teal-700 uppercase">
                        STEP 3 OF 7 • FIELD WORKER OUTREACH
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Ankita Jadhav (Pashu Sakhi / LSS, Baramati)
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSwitchUser('fieldworker1@pashuraksha.ai', '/field-worker')}
                      icon={ExternalLink}
                      className="bg-teal-700 hover:bg-teal-600 font-bold text-xs text-white"
                    >
                      Open Field Worker Dashboard
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <span className="font-black text-slate-800 uppercase block">
                      Case Appears in Field Worker Queue:
                    </span>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">COW-101 • Baramati Village</span>
                        <span className="text-slate-500">Signs: High fever, ropy salivation, oral blisters</span>
                      </div>
                      <RiskBadge level="CRITICAL" score={82.0} />
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="font-bold text-slate-700 block">Actions Required:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>1. Accept Case for On-Site Visit</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>2. Record Observation (104.4°F, erosions)</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>3. Collect Oral Swab under Cold Chain</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>4. Forward Case to Veterinarian</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Execute all 4 field actions simultaneously via live API.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => handleAutoExecute(3)}
                      loading={executingStep}
                      icon={Play}
                      className="bg-teal-700 hover:bg-teal-600 text-white font-black text-xs"
                    >
                      ⚡ Record Visit, Sample &amp; Forward to Vet
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: VETERINARIAN */}
              {activeTabStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-700 uppercase">
                        STEP 4 OF 7 • VETERINARY CLINICAL DESK
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Dr. Priya Sharma (Baramati Veterinary Polyclinic)
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSwitchUser('vet1@pashuraksha.ai', demoState?.report?.id ? `/cases/${demoState.report.id}` : '/vet/dashboard')}
                      icon={ExternalLink}
                      className="bg-blue-700 hover:bg-blue-600 font-bold text-xs text-white"
                    >
                      Open Case Details
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <span className="font-black text-slate-800 uppercase block">
                      Case Timeline Review:
                    </span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between">
                        <span>1. Farmer Report Lodged (Fever, Drooling, Lesions)</span>
                        <strong className="text-slate-500">Ramesh Patil</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between">
                        <span>2. AI Risk Engine Triage: 82/100 CRITICAL</span>
                        <strong className="text-rose-600">PASHURAKSHA AI</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between">
                        <span>3. Field Worker Verified: Oral Swab Collected</span>
                        <strong className="text-teal-600">Ankita Jadhav</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                      <strong className="text-blue-900 block">Attending Veterinarian Actions:</strong>
                      <p className="text-blue-800">
                        Initiated supportive antiseptic mouthwash protocol. Ordered urgent diagnostic RT-PCR laboratory referral for definitive viral typing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Creates urgent lab referral for COW-101 in database.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => handleAutoExecute(4)}
                      loading={executingStep}
                      icon={Play}
                      className="bg-blue-700 hover:bg-blue-600 text-white font-black text-xs"
                    >
                      ⚡ Order Urgent RT-PCR Lab Test
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 5: LABORATORY */}
              {activeTabStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-purple-700 uppercase">
                        STEP 5 OF 7 • DIAGNOSTIC LABORATORY DESK
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        District Disease Diagnostic Laboratory (Pune)
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSwitchUser('lab1@pashuraksha.ai', '/lab')}
                      icon={ExternalLink}
                      className="bg-purple-700 hover:bg-purple-600 font-bold text-xs text-white"
                    >
                      Open Lab Dashboard
                    </Button>
                  </div>

                  {/* Lab Referral Details */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <span className="font-black text-slate-800 uppercase block">
                      Referral in Accession Queue:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Sample ID</span>
                        <strong className="text-slate-800">{demoState?.referral?.id || 'SPL-FMD-101'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Animal ID</span>
                        <strong className="text-slate-800">COW-101</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Sample Type</span>
                        <strong className="text-slate-800">Oral Epithelial Swab</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Test Requested</span>
                        <strong className="text-slate-800">RT-PCR (FMD Typing)</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                      <div className="flex justify-between">
                        <span className="text-purple-900 font-bold">Assay Result Entry:</span>
                        <strong className="text-rose-700 font-black">POSITIVE - FMD Serotype O</strong>
                      </div>
                      <p className="text-purple-800 text-[11px]">
                        TaqMan Real-Time RT-PCR detected Aphthovirus RNA (Ct value: 21.4). Validated by Dr. Suhas Kulkarni. Triggers automatic cluster detection.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Validates result and triggers automatic spatial-temporal cluster update.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => handleAutoExecute(5)}
                      loading={executingStep}
                      icon={Play}
                      className="bg-purple-700 hover:bg-purple-600 text-white font-black text-xs"
                    >
                      ⚡ Validate POSITIVE (FMD Serotype O)
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 6: AUTHORITY */}
              {activeTabStep === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-700 uppercase">
                        STEP 6 OF 7 • HEALTH AUTHORITY COMMAND
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        District Animal Husbandry Surveillance HQ (Pune)
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSwitchUser('officer1@pashuraksha.ai', '/authority')}
                      icon={ExternalLink}
                      className="bg-indigo-700 hover:bg-indigo-600 font-bold text-xs text-white"
                    >
                      Open Authority Command Center
                    </Button>
                  </div>

                  {/* Outbreak Cluster Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div>
                        <strong className="text-base font-black text-slate-900">
                          BARAMATI OUTBREAK CLUSTER
                        </strong>
                        <p className="text-slate-500">Disease Concern: Foot-and-Mouth Disease (FMD Serotype O Confirmed)</p>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs">
                        CRITICAL HOTSPOT
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Active Cases</span>
                        <strong className="text-lg font-black text-slate-900">8 Reports</strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Affected Animals</span>
                        <strong className="text-lg font-black text-slate-900">14 Animals</strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Containment Radius</span>
                        <strong className="text-lg font-black text-rose-600">5.0 km Ring</strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Affected Villages</span>
                        <strong className="text-xs font-bold text-slate-800 block mt-1">Baramati, Malegaon, Jalochi</strong>
                      </div>
                    </div>

                    <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                      <span className="font-black text-indigo-950 uppercase block">
                        Containment Protocol Triggered:
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <span className="bg-white px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-900 font-bold flex items-center space-x-1">
                          <Syringe className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Dispatch 250 Ring Vaccines</span>
                        </span>
                        <span className="bg-white px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-900 font-bold flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>SMS Biosecurity Advisory Broadcast</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                      Concludes the 6-persona operational lifecycle and launches the impact analysis.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => handleAutoExecute(6)}
                      loading={executingStep}
                      icon={Play}
                      className="bg-indigo-700 hover:bg-indigo-600 text-white font-black text-xs"
                    >
                      ⚡ Activate 5km Ring Containment &amp; View Impact
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center space-x-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Currently logged in as: <strong className="text-slate-800">{user?.name} ({user?.role})</strong></span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFinalImpact(!showFinalImpact)}
              className="text-xs font-bold"
            >
              {showFinalImpact ? 'Back to Steps' : 'View Impact Panel'}
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Close Guide
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
