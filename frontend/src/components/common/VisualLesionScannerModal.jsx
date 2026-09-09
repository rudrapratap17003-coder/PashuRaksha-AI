import React, { useState } from 'react'
import {
  Camera,
  Upload,
  X,
  AlertTriangle,
  CheckCircle2,
  Scan,
  RefreshCw,
  Info,
  ShieldCheck,
  Eye,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react'

const SAMPLE_LESION_CASES = [
  {
    id: 'oral-fmd',
    title: 'Oral Mucosal Vesicles & Erosions',
    organ: 'Mouth / Tongue',
    species: 'Cattle (Cow)',
    detectedSign: 'Ruptured vesicle on dental pad & tongue (Reference Specimen)',
    screeningConfidence: 'Specimen Reference Match',
    suspectedDisease: 'Foot and Mouth Disease (FMD) Pattern',
    severity: 'Severe / Acute',
    symptomsMatched: {
      fever: true,
      salivation: true,
      lesions: true,
      reduced_appetite: true,
      reduced_milk: true
    },
    recommendation: 'Strict herd isolation advised. Submit swab for RT-PCR lab confirmation. Report to taluka veterinary dispensary.',
    imagePlaceholder: 'oral_lesion_fmd'
  },
  {
    id: 'skin-lsd',
    title: 'Nodular Cutaneous Lesions',
    organ: 'Skin / Neck & Flank',
    species: 'Cattle (Bullock)',
    detectedSign: 'Circumscribed firm nodules (2-5 cm) (Reference Specimen)',
    screeningConfidence: 'Specimen Reference Match',
    suspectedDisease: 'Lumpy Skin Disease (LSD) Pattern',
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
    detectedSign: 'Coronary band erosions with lameness (Reference Specimen)',
    screeningConfidence: 'Specimen Reference Match',
    suspectedDisease: 'Vesicular Pododermatitis / FMD Pattern',
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
    detectedSign: 'Swollen quarter with milk clotting (Reference Specimen)',
    screeningConfidence: 'Specimen Reference Match',
    suspectedDisease: 'Acute Clinical Mastitis Pattern',
    severity: 'High',
    symptomsMatched: {
      swelling: true,
      reduced_milk: true,
      fever: false
    },
    recommendation: 'Perform California Mastitis Test (CMT). Administer intramammary therapy under veterinary direction.',
    imagePlaceholder: 'mastitis_udder'
  }
]

export default function VisualLesionScannerModal({ isOpen, onClose, onApplyToReport }) {
  const [selectedCase, setSelectedCase] = useState(SAMPLE_LESION_CASES[0])
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(SAMPLE_LESION_CASES[0])
  const [customFileUrl, setCustomFileUrl] = useState(null)
  const [isCustomUpload, setIsCustomUpload] = useState(false)
  const [qualityMetrics, setQualityMetrics] = useState({
    lighting: 'Good',
    contrast: 'Standard',
    resolution: 'Normal',
    clarityCheck: 'Pass'
  })

  const analyzeImageQuality = (file) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 64
        canvas.height = 64
        ctx.drawImage(img, 0, 0, 64, 64)
        
        try {
          const imageData = ctx.getImageData(0, 0, 64, 64)
          const data = imageData.data
          let totalBrightness = 0
          for (let i = 0; i < data.length; i += 4) {
            totalBrightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
          }
          const avgBrightness = totalBrightness / (64 * 64)
          
          let lighting = 'Good'
          if (avgBrightness < 50) lighting = 'Dark Image (Low Light)'
          else if (avgBrightness > 210) lighting = 'Overexposed'
          
          resolve({
            lighting,
            contrast: 'Analyzed',
            resolution: `${img.naturalWidth} × ${img.naturalHeight}`,
            clarityCheck: avgBrightness < 50 ? 'Low illumination — verify lesion clarity' : 'Adequate for documentation'
          })
        } catch {
          resolve({
            lighting: 'Standard',
            contrast: 'Standard',
            resolution: `${img.naturalWidth || 800} × ${img.naturalHeight || 600}`,
            clarityCheck: 'Field photo accepted'
          })
        }
      }
      img.onerror = () => {
        resolve({
          lighting: 'Unverified',
          contrast: 'Standard',
          resolution: 'Standard',
          clarityCheck: 'Field photo accepted'
        })
      }
    })
  }

  const handleSelectCase = (c) => {
    setSelectedCase(c)
    setIsCustomUpload(false)
    setCustomFileUrl(null)
    setScanning(true)
    setTimeout(() => {
      setScanResult(c)
      setQualityMetrics({
        lighting: 'Calibrated Specimen',
        contrast: 'High Reference',
        resolution: '1920 × 1080',
        clarityCheck: 'Standard Reference Image'
      })
      setScanning(false)
    }, 500)
  }

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setCustomFileUrl(url)
      setIsCustomUpload(true)
      setSelectedCase(null)
      setScanning(true)

      const quality = await analyzeImageQuality(file)
      setQualityMetrics(quality)

      setTimeout(() => {
        setScanResult({
          id: 'custom-upload',
          title: 'Field Photo Uploaded',
          organ: 'User Submitted Field Image',
          species: 'Registered Subject',
          detectedSign: 'Image received. Prototype visual screening workflow.',
          screeningConfidence: 'Prototype Screening Result',
          suspectedDisease: 'Unclassified Field Photo',
          severity: 'Requires Veterinary Inspection',
          symptomsMatched: {},
          recommendation: 'Clinical interpretation requires veterinary review. Visual pattern cannot replace laboratory testing or physical veterinary examination.',
          isCustom: true
        })
        setScanning(false)
      }, 700)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Visual Screening Assistant
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Visual Screening Overlay
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Specimen atlas &amp; visual screening assistant to aid field observation and clinical documentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close visual screening modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Sample Selectors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                SIH Demonstration Cases (Specimen Reference Atlas)
              </span>
              <label className="cursor-pointer text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Field Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_LESION_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCase(c)}
                  className={`p-3 rounded-2xl text-left border transition ${
                    selectedCase?.id === c.id
                      ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg shadow-emerald-950'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">{c.organ}</span>
                    <span className="text-[9px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                      SIH Demo
                    </span>
                  </div>
                  <strong className="text-xs block mt-1 leading-snug">{c.title}</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{c.species}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Viewport & Screening Results */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Visual Viewport with Screening Overlay */}
            <div className="md:col-span-6 bg-slate-950 rounded-3xl border border-slate-800 p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
              {scanning ? (
                <div className="space-y-3 text-center py-10">
                  <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs text-emerald-300 font-bold animate-pulse">Running Visual Screening Assistant...</p>
                </div>
              ) : (
                <div className="w-full h-full relative flex flex-col items-center justify-center">
                  <div className="w-full h-60 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden">
                    
                    {customFileUrl ? (
                      <img
                        src={customFileUrl}
                        alt="Uploaded Field Subject"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                        <div className="text-center p-4 z-10">
                          <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <span className="text-xs font-bold text-slate-200">{scanResult.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Subject: {scanResult.species}</span>
                        </div>
                      </>
                    )}

                    {/* Visual Screening Overlay */}
                    <div className="absolute w-48 h-36 border-2 border-emerald-400/80 rounded-xl bg-emerald-500/10 backdrop-blur-xs flex flex-col justify-between p-2">
                      <div className="flex items-center justify-between text-[10px] font-mono bg-emerald-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        <span>{scanResult.organ || 'Visual Region'}</span>
                        <span>{isCustomUpload ? 'Uploaded Photo' : 'Reference Specimen'}</span>
                      </div>
                      <div className="text-[9px] text-emerald-200 bg-slate-950/80 px-1.5 py-0.5 rounded self-start font-mono">
                        Visual Screening Overlay
                      </div>
                    </div>
                  </div>

                  {/* Image Quality Checks */}
                  <div className="w-full mt-3 grid grid-cols-3 gap-2 text-[10px] bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Lighting:</span>
                      <span className="font-bold text-slate-300">{qualityMetrics.lighting}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Resolution:</span>
                      <span className="font-bold text-slate-300">{qualityMetrics.resolution}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Quality Check:</span>
                      <span className="font-bold text-emerald-400">{qualityMetrics.clarityCheck}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Screening Diagnostics */}
            <div className="md:col-span-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Prototype Screening Result
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                    {scanResult.screeningConfidence}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white">{scanResult.suspectedDisease}</h3>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">{scanResult.detectedSign}</p>
                </div>

                {isCustomUpload && (
                  <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/40 text-sky-200 text-xs space-y-1">
                    <strong className="block font-bold text-sky-300">Image received.</strong>
                    <p className="text-[11px] leading-relaxed text-sky-200/90">
                      Prototype visual screening workflow. Clinical interpretation requires veterinary review.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Assessment Status:</span>
                    <strong className="text-amber-400">{scanResult.severity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Target Area:</span>
                    <strong className="text-slate-200">{scanResult.organ}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" /> Clinical Guidance:
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{scanResult.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Prototype visual screening workflow. Clinical interpretation requires veterinary review.</span>
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onApplyToReport) onApplyToReport(scanResult)
                onClose()
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 transition flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <CheckCircle2 className="w-4 h-4" /> Apply to Symptom Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
