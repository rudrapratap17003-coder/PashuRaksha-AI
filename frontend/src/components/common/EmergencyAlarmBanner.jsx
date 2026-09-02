import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BellRing, 
  Volume2, 
  VolumeX, 
  AlertOctagon, 
  Radio, 
  ShieldAlert, 
  X, 
  ChevronRight,
  Truck,
  MessageSquare
} from 'lucide-react'
import { useScenario } from '../../context/ScenarioContext'
import { playEmergencySiren, stopEmergencySiren, isSirenPlaying } from '../../utils/audioAlarm'

export default function EmergencyAlarmBanner() {
  const { currentScenario, scenarios } = useScenario()
  const [muted, setMuted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [sirenActive, setSirenActive] = useState(false)

  const isOutbreak = currentScenario === scenarios.RAMPUR_OUTBREAK

  useEffect(() => {
    if (isOutbreak && !muted && !dismissed) {
      playEmergencySiren(8) // Play siren for 8s
      setSirenActive(true)
    } else {
      stopEmergencySiren()
      setSirenActive(false)
    }

    return () => {
      stopEmergencySiren()
    }
  }, [isOutbreak, muted, dismissed])

  const toggleMute = () => {
    if (sirenActive) {
      stopEmergencySiren()
      setSirenActive(false)
      setMuted(true)
    } else {
      setMuted(false)
      playEmergencySiren(10)
      setSirenActive(true)
    }
  }

  if (!isOutbreak || dismissed) return null

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-rose-950 via-red-950 to-slate-950 border-b-2 border-rose-500 shadow-2xl shadow-rose-950/80 text-white px-4 py-3 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left Siren Warning */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="w-9 h-9 rounded-2xl bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-300 animate-pulse">
              <BellRing className="w-5 h-5 animate-bounce" />
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-black uppercase tracking-wider text-rose-400 bg-rose-950/90 px-2 py-0.5 rounded border border-rose-500/40 text-[10px]">
                STATE EPIDEMIC ALARM ACTIVE • धोक्याचा इशारा
              </span>
              <span className="text-[10px] text-rose-300 font-bold hidden sm:inline">
                Baramati Cluster #RC-2026-014
              </span>
            </div>
            <h4 className="text-sm font-black text-white mt-0.5">
              Foot &amp; Mouth Disease (FMD) Hotspot Detected in Baramati East — 10km Quarantine Cordon Active
            </h4>
          </div>
        </div>

        {/* Right Action & Siren Audio Controls */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleMute}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 text-xs ${
              sirenActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {sirenActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            <span>{sirenActive ? '🚨 Siren Sound Active (Mute)' : '🚨 Siren Sound'}</span>
          </button>

          <Link
            to="/authority/mvu-fleet"
            className="px-3 py-1.5 rounded-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-md transition flex items-center space-x-1"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Dispatch RRU Van</span>
          </Link>

          <Link
            to="/presentation"
            className="px-3 py-1.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center space-x-1"
          >
            <span>GIS Hotspot Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              stopEmergencySiren()
              setDismissed(true)
            }}
            title="Dismiss alarm banner"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
