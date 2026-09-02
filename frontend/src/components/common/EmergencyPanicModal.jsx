import React, { useState } from 'react'
import {
  AlertTriangle,
  Radio,
  Phone,
  Truck,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  MapPin
} from 'lucide-react'
import Card from './Card'
import { playEmergencySiren, stopEmergencySiren } from '../../utils/audioAlarm'

export default function EmergencyPanicModal({ isOpen, onClose }) {
  const [sosSent, setSosSent] = useState(false)
  const [village, setVillage] = useState('Baramati East')
  const [affectedHeads, setAffectedHeads] = useState('4')
  const [symptomSummary, setSymptomSummary] = useState('Sudden severe salivation, mouth blisters & high fever (FMD suspected)')

  if (!isOpen) return null

  const handleTriggerAlarm = (e) => {
    e.preventDefault()
    playEmergencySiren(8)
    setSosSent(true)
  }

  const handleClose = () => {
    stopEmergencySiren()
    setSosSent(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <Card className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-white relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-400 flex-shrink-0 animate-pulse">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-black uppercase text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/40">
                1962 SOS PANIC ALARM
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              Emergency Livestock Outbreak Alarm
            </h3>
          </div>
        </div>

        {!sosSent ? (
          <form onSubmit={handleTriggerAlarm} className="space-y-4 text-xs">
            <p className="text-slate-300 text-xs leading-relaxed">
              Instantly activates the <strong>State Audio-Visual Siren</strong>, alerts the District Animal Husbandry Office, and dispatches the nearest <strong>1962 Mobile Veterinary Unit (MVU)</strong> to your GPS coordinates.
            </p>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold">Location / Farm Wasti</label>
              <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white font-bold">
                <MapPin className="w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="bg-transparent border-0 focus:outline-none w-full text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Affected Cattle/Buffalo</label>
                <input
                  type="number"
                  value={affectedHeads}
                  onChange={(e) => setAffectedHeads(e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white font-bold focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Toll-Free Backup</label>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-emerald-400 font-black flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 1962 (24x7)</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold">Emergency Observations</label>
              <textarea
                rows={2}
                value={symptomSummary}
                onChange={(e) => setSymptomSummary(e.target.value)}
                className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm shadow-xl shadow-rose-950 flex items-center justify-center space-x-2 transition"
            >
              <Volume2 className="w-5 h-5 animate-bounce" />
              <span>SIREN SOUND &amp; TRANSMIT SOS ALARM</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center py-2 animate-in zoom-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">RED ALERT BROADCAST TRANSMITTED</h4>
              <p className="text-xs text-emerald-300">
                Audio siren triggered. <strong>MVU-PUNE-01 (Baramati Ambulance)</strong> has been dispatched with 1,000 FMD doses.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left space-y-1">
              <p><strong>Incident Log ID:</strong> #SOS-MH-2026-9912</p>
              <p><strong>Coordinates:</strong> 18.1582° N, 74.5810° E (Baramati East)</p>
              <p><strong>Estimated RRU Arrival:</strong> 12 Minutes</p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Close &amp; Silence Alarm
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
