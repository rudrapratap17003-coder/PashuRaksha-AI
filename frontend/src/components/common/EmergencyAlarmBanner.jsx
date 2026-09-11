import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Link } from 'react-router-dom'
import { BellRing, Volume2, VolumeX, ChevronRight, Truck, X } from 'lucide-react'
import { useScenario } from '../../context/ScenarioContext'
import { playEmergencySiren, stopEmergencySiren } from '../../utils/audioAlarm'

export default function EmergencyAlarmBanner() {
  const { t } = useLanguage()
  const { currentScenario, scenarios } = useScenario()
  const [dismissed, setDismissed] = useState(false)
  const [sirenActive, setSirenActive] = useState(false)

  const isOutbreak = currentScenario === scenarios.RAMPUR_OUTBREAK

  // Strictly enforce: Siren audio is OFF by default.
  // NO audio should EVER play automatically on load, mount, navigation, or scenario change.
  // Clean up any playing siren on unmount.
  useEffect(() => {
    return () => {
      stopEmergencySiren()
    }
  }, [])

  // If scenario is no longer outbreak or banner is dismissed, ensure siren is stopped
  useEffect(() => {
    if (!isOutbreak || dismissed) {
      stopEmergencySiren()
      setSirenActive(false)
    }
  }, [isOutbreak, dismissed])

  const toggleSiren = () => {
    if (sirenActive) {
      stopEmergencySiren()
      setSirenActive(false)
    } else {
      // User explicitly clicked to activate siren
      playEmergencySiren(20, () => {
        setSirenActive(false)
      })
      setSirenActive(true)
    }
  }

  if (!isOutbreak || dismissed) return null

  return (
    <div className="sticky top-0 z-50 bg-slate-900 border-b-2 border-rose-500 shadow-2xl shadow-slate-900/20 text-white px-4 py-3 animate-in slide-in-from-top duration-300">
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
            type="button"
            onClick={toggleSiren}
            aria-label={sirenActive ? 'Mute emergency siren' : 'Activate emergency siren'}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer ${
              sirenActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-slate-900/20 animate-pulse border border-rose-400'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'
            }`}
          >
            {sirenActive ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white" />
                <span>Mute Siren</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span>🔊 Activate Siren</span>
              </>
            )}
          </button>

          <Link
            to="/authority/mvu-fleet"
            className="px-3 py-1.5 rounded-xl font-bold hover:bg-slate-800 text-white shadow-md transition flex items-center space-x-1"
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
            type="button"
            onClick={() => {
              stopEmergencySiren()
              setSirenActive(false)
              setDismissed(true)
            }}
            aria-label="Dismiss alarm banner"
            title="Dismiss alarm banner"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
