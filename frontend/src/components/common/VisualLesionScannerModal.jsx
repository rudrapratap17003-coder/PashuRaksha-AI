import React, { useState } from 'react'
import {
  Camera,
  Upload,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Scan,
  RefreshCw,
  Eye,
  Info,
  Layers
} from 'lucide-react'

const SAMPLE_LESION_CASES = [
  {
    id: 'oral-fmd',
    title: 'Oral Mucosal Vesicles & Erosions',
    organ: 'Mouth / Tongue',
    species: 'Cattle (Cow)',
    detectedSign: 'Ruptured vesicle on dental pad & tongue',
    confidence: 96.4,
    suspectedDisease: 'Foot and Mouth Disease (FMD)',
    severity: 'Severe / Acute',
    symptomsMatched: {
      fever: true,
      salivation: true,
      lesions: true,
      reduced_appetite: true,
      reduced_milk: true
    },
    recommendation: 'Immediate strict isolation. High risk of transmission. Report to local veterinary officer.',
    imagePlaceholder: 'oral_lesion_fmd'
  },
  {
    id: 'skin-lsd',
    title: 'Nodular Cutaneous Lesions',
    organ: 'Skin / Neck & Flank',
    species: 'Cattle (Bullock)',
    detectedSign: 'Circumscribed firm nodules (2-5 cm)',
    confidence: 94.1,
    suspectedDisease: 'Lumpy Skin Disease (LSD)',
    severity: 'Moderate',
    symptomsMatched: {
      fever: true,
      swelling: true,
      lesions: true,
      reduced_appetite: true
    },
    recommendation: 'Apply antiseptic fly repellents. Administer antipyretics and isolate with vector netting.',
    imagePlaceholder: 'lsd_nodules'
  },
  {
    id: 'hoof-fmd',
    title: 'Interdigital Cleft Ulceration',
    organ: 'Hoof / Coronary Band',
    species: 'Buffalo',
    detectedSign: 'Coronary band erosions with lameness',
    confidence: 91.8,
    suspectedDisease: 'Vesicular Pododermatitis / FMD',
    severity: 'Severe',
    symptomsMatched: {
      fever: true,
      lesions: true,
      lethargy: true
    },
    recommendation: 'Provide Copper Sulphate footbaths. Restrict walking on hard or stony ground.',
    imagePlaceholder: 'hoof_cleft'
  },
  {
    id: 'udder-mastitis',
    title: 'Udder Asymmetry & Erythema',
    organ: 'Mammary Gland (Teat)',
    species: 'Cattle (Crossbred)',
    detectedSign: 'Swollen quarter with milk clotting',
    confidence: 89.2,
    suspectedDisease: 'Acute Clinical Mastitis',
    severity: 'High',
    symptomsMatched: {
      swelling: true,
      reduced_milk: true,
      fever: false
    },
    recommendation: 'Perform California Mastitis Test (CMT). Administer intramammary antibiotic infusion.',
    imagePlaceholder: 'mastitis_udder'
  }
]

export default function VisualLesionScannerModal({ isOpen, onClose, onApplyToReport }) {
  const [selectedCase, setSelectedCase] = useState(SAMPLE_LESION_CASES[0])
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(SAMPLE_LESION_CASES[0])
  const [customFile, setCustomFile] = useState(null)

  const handleSelectCase = (c) => {
    setSelectedCase(c)
    setScanning(true)
    setTimeout(() => {
      setScanResult(c)
      setScanning(false)
    }, 600)
  }

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCustomFile(URL.createObjectURL(file))
      setScanning(true)
      setTimeout(() => {
        setScanResult({
          ...SAMPLE_LESION_CASES[0],
          title: 'Uploaded Lesion Scan',
          confidence: 92.5
        })
        setScanning(false)
      }, 1000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Pashu-Drishti AI • Visual Lesion Scanner
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Computer Vision Assist
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Upload or capture photos of oral ulcers, skin nodules, or hoof lesions for instant AI classification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Sample Selectors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Clinical Lesion Specimen or Upload
              </span>
              <label className="cursor-pointer text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_LESION_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCase(c)}
                  className={`p-3 rounded-2xl text-left border transition ${
                    selectedCase.id === c.id
                      ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg shadow-emerald-950'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block">{c.organ}</span>
                  <strong className="text-xs block mt-0.5 leading-snug">{c.title}</strong>
                  <span className="text-[10px] text-slate-400 block mt-1">{c.species}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Viewport & AI Inference Results */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Visual Viewport with Simulated Neural Bounding Box */}
            <div className="md:col-span-6 bg-slate-950 rounded-3xl border border-slate-800 p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
              {scanning ? (
                <div className="space-y-3 text-center">
                  <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs text-emerald-300 font-bold animate-pulse">Running CNN Feature Extraction & Segmentation...</p>
                </div>
              ) : (
                <div className="w-full h-full relative flex flex-col items-center justify-center">
                  {/* Visual Simulation Canvas */}
                  <div className="w-full h-56 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden">
                    {/* Simulated Anatomical Graphic Background */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* Neural Bounding Box */}
                    <div className="absolute w-44 h-36 border-2 border-emerald-400 rounded-xl bg-emerald-500/10 backdrop-blur-xs flex flex-col justify-between p-2 animate-pulse">
                      <div className="flex items-center justify-between text-[10px] font-mono bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        <span>{scanResult.organ}</span>
                        <span>{scanResult.confidence}%</span>
                      </div>
                      <div className="text-[9px] text-emerald-200 bg-slate-950/80 px-1 py-0.5 rounded self-start">
                        ROI: [x:120, y:85, w:180, h:140]
                      </div>
                    </div>

                    <div className="text-center p-4 z-10">
                      <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <span className="text-xs font-bold text-slate-300">{scanResult.title}</span>
                      <span className="text-[10px] text-slate-500 block">Specimen: {scanResult.species}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inference Diagnostics */}
            <div className="md:col-span-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Diagnostic Inference
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                    Confidence: {scanResult.confidence}%
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white">{scanResult.suspectedDisease}</h3>
                  <p className="text-xs text-emerald-400 font-medium">{scanResult.detectedSign}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Severity Level:</span>
                    <strong className="text-rose-400">{scanResult.severity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Target Organ:</span>
                    <strong className="text-slate-200">{scanResult.organ}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" /> Immediate Action Required:
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{scanResult.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-400" />
            AI computer vision provides decision-support; verify with clinical exam.
          </span>
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition">
              Cancel
            </button>
            <button
              onClick={() => {
                if (onApplyToReport) onApplyToReport(scanResult)
                onClose()
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 transition flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <CheckCircle2 className="w-4 h-4" /> Auto-Fill Into Symptom Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
