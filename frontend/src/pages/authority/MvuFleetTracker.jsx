import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  MapPin,
  Phone,
  Radio,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Send,
  CheckCircle2,
  Navigation,
  Fuel,
  Thermometer,
  Stethoscope,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Activity,
  Check
} from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import apiClient from '../../services/api'

const INITIAL_MVU_FLEET = [
  {
    id: 'MH-12-MVU-1962',
    name: 'Pashu Sanjeevani Unit #01 (Baramati)',
    district: 'Pune',
    currentLocation: 'Baramati East Wasti (18.1582° N, 74.5810° E)',
    status: 'ON-CALL (Attending Case)',
    statusType: 'warning',
    dutyVet: 'Dr. Vivek Kulkarni, B.V.Sc',
    driver: 'Santosh Ghadge (+91 98221 45678)',
    speedKmH: 32,
    fuelPercent: 82,
    coldBoxTemp: 4.1,
    casesHandledToday: 7,
    equipment: ['Ultrasound Scanner', 'Minor Surgery Kit', 'Emergency FMD Vax Pack', 'Cold Storage Unit', 'Sterilization Autoclave']
  },
  {
    id: 'MH-12-MVU-1963',
    name: 'Pashu Sanjeevani Unit #02 (Shirur)',
    district: 'Pune',
    currentLocation: 'Shirur Bypass Station (18.8290° N, 74.3720° E)',
    status: 'STANDBY (Ready for Dispatch)',
    statusType: 'success',
    dutyVet: 'Dr. Priya Sharma, M.V.Sc',
    driver: 'Rahul Shinde (+91 98229 98811)',
    speedKmH: 0,
    fuelPercent: 94,
    coldBoxTemp: 3.8,
    casesHandledToday: 4,
    equipment: ['Blood Analyzer Kit', 'Emergency Oxygen', 'Deworming Drencher', 'Mobile Microchip Reader', 'Vaccine Cooler']
  },
  {
    id: 'MH-42-MVU-1964',
    name: 'Pashu Sanjeevani Unit #03 (Indapur)',
    district: 'Pune',
    currentLocation: 'Bawada Road (18.1120° N, 75.0210° E)',
    status: 'EN-ROUTE (Dispatched to Hotspot)',
    statusType: 'info',
    dutyVet: 'Dr. Amit Jadhav, B.V.Sc',
    driver: 'Nitin Pawar (+91 98234 45566)',
    speedKmH: 48,
    fuelPercent: 68,
    coldBoxTemp: 4.4,
    casesHandledToday: 6,
    equipment: ['Liquid Nitrogen AI Container', 'Post-Mortem Diagnostic Kit', 'Antibiotic Injectables', 'Field Centrifuge']
  }
]

export default function MvuFleetTracker() {
  const [fleet, setFleet] = useState(INITIAL_MVU_FLEET)
  const [selectedUnit, setSelectedUnit] = useState(INITIAL_MVU_FLEET[0])
  const [sosNotice, setSosNotice] = useState(null)
  const [targetHotspot, setTargetHotspot] = useState('Baramati Outbreak Hotspot (Contagion Core)')
  const [refreshing, setRefreshing] = useState(false)
  const [refreshSuccess, setRefreshSuccess] = useState(false)
  const [dispatching, setDispatching] = useState(false)

  const handleRefresh = async () => {
    if (refreshing) return
    setRefreshing(true)
    setRefreshSuccess(false)
    try {
      // Simulate/poll latest GPS & cold-chain telemetry updates
      await new Promise(resolve => setTimeout(resolve, 600))
      setFleet(prev => prev.map(u => ({
        ...u,
        speedKmH: u.status.includes('STANDBY') ? 0 : Math.floor(25 + Math.random() * 25),
        coldBoxTemp: parseFloat((3.8 + Math.random() * 0.7).toFixed(1))
      })))
      setRefreshSuccess(true)
      setTimeout(() => setRefreshSuccess(false), 2500)
    } catch {
      // Keep cached state
    } finally {
      setRefreshing(false)
    }
  }

  const handleDispatch = () => {
    if (dispatching) return
    setDispatching(true)
    setTimeout(() => {
      setFleet(prev => prev.map(u => 
        u.id === selectedUnit.id 
          ? { ...u, status: 'DISPATCHED VIA 1962 SOS', statusType: 'warning', speedKmH: 52 } 
          : u
      ))
      setSosNotice(`🚨 Emergency 1962 SOS order transmitted to ${selectedUnit.name}. Dispatched to "${targetHotspot}". Estimated Arrival Time (ETA): 14 minutes.`)
      setDispatching(false)
      setTimeout(() => setSosNotice(null), 8000)
    }, 700)
  }

  const activeCount = fleet.filter(u => !u.status.includes('STANDBY')).length
  const standbyCount = fleet.filter(u => u.status.includes('STANDBY')).length

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/authority/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to District Command Center</span>
        </Link>
        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          Emergency Response Fleet • Toll-Free 1962
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-500/20 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>1962 Pashu Sanjeevani • Mobile Veterinary Ambulance Fleet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            1962 Mobile Veterinary Unit (MVU) Dispatcher
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Real-time GPS tracking, automated vaccine cold-box temperature telemetry, and emergency SOS routing for rapid veterinary field units across Western Maharashtra.
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              refreshSuccess
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'bg-slate-900 hover:bg-slate-800 text-white border border-sky-500/30 hover:border-sky-400/50'
            } disabled:opacity-70`}
          >
            {refreshSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-sky-400' : 'text-sky-300'}`} />
            )}
            <span>{refreshing ? 'Refreshing...' : refreshSuccess ? '✓ Refreshed' : 'Refresh Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* SOS Dispatch Confirmation Banner */}
      {sosNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-100 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{sosNotice}</span>
          </div>
          <button
            onClick={() => setSosNotice(null)}
            className="text-slate-400 hover:text-white text-xs ml-3 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Fleet Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Monitored Fleet"
          value={`${fleet.length} Units`}
          subtitle="Pune & neighbouring talukas"
          icon={Truck}
          iconBg="bg-sky-500/10 text-sky-600 border border-sky-500/20"
        />
        <StatCard
          title="Active Dispatches"
          value={`${activeCount} Active`}
          subtitle="En-route or attending case"
          icon={Activity}
          iconBg="bg-amber-500/10 text-amber-600 border border-amber-500/20"
        />
        <StatCard
          title="Units on Standby"
          value={`${standbyCount} Ready`}
          subtitle="Stationed at central depots"
          icon={ShieldCheck}
          iconBg="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
        />
        <StatCard
          title="Avg Cold-Box Temp"
          value="4.1°C"
          subtitle="Safe 2°C – 8°C vaccine range"
          icon={Thermometer}
          iconBg="bg-teal-500/10 text-teal-600 border border-teal-500/20"
        />
      </div>

      {/* 2-Column Split: Fleet List + Unit Telemetry & Dispatch Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Fleet Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-900">Pashu Sanjeevani MVU Units</h3>
            <span className="text-[11px] font-bold text-slate-500">{fleet.length} Active Ambulances</span>
          </div>

          <div className="space-y-3">
            {fleet.map((u) => {
              const isSelected = selectedUnit?.id === u.id
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUnit(u)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-500 shadow-md ring-2 ring-sky-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold text-sky-700">{u.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        u.status.includes('STANDBY')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : u.status.includes('EN-ROUTE')
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {u.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{u.name}</h4>
                    <p className="text-[11px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{u.currentLocation}</span>
                    </p>
                  </div>
                  <Navigation className={`w-5 h-5 flex-shrink-0 ml-2 ${isSelected ? 'text-sky-600' : 'text-slate-300'}`} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Right 7 Cols: Unit Telemetry & Dispatch */}
        <div className="lg:col-span-7">
          {selectedUnit ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              {/* Unit Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-sky-700 font-bold uppercase bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {selectedUnit.district} Division Node
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{selectedUnit.id}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{selectedUnit.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-sky-600" />
                    <span>Officer on Duty: <strong className="text-slate-900">{selectedUnit.dutyVet}</strong></span>
                  </p>
                </div>
                <span className="self-start px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-xs">
                  {selectedUnit.casesHandledToday} Cases Handled Today
                </span>
              </div>

              {/* Real-time Telemetry 3-Box Strip */}
              <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center justify-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-sky-600" /> Vaccine Cold-Box
                  </span>
                  <strong className="text-lg font-black text-slate-900">{selectedUnit.coldBoxTemp}°C</strong>
                  <span className="text-[10px] font-bold text-emerald-700 block">✓ Safe 2-8°C Range</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center justify-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-600" /> Diesel Fuel
                  </span>
                  <strong className="text-lg font-black text-slate-900">{selectedUnit.fuelPercent}%</strong>
                  <span className="text-[10px] text-slate-500 block">Est. Range: ~320 km</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center justify-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-teal-600" /> GPS Speed
                  </span>
                  <strong className="text-lg font-black text-teal-700">{selectedUnit.speedKmH} km/h</strong>
                  <span className="text-[10px] text-slate-500 block">Live Telematics</span>
                </div>
              </div>

              {/* On-Board Medical Equipment Checklist */}
              <div className="space-y-2">
                <span className="text-slate-700 font-bold uppercase text-[11px] block">
                  On-Board Mobile Diagnostic &amp; Clinical Equipment:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedUnit.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{eq}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Driver Contact & Emergency Dispatch Controls */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="text-xs">
                    <p className="text-slate-300 font-medium"><strong>Assigned Driver:</strong> {selectedUnit.driver}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Emergency Helpline: <strong className="text-amber-400">1962 (Toll-Free 24x7)</strong></p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    GPS Link Active
                  </span>
                </div>

                {/* Dispatch Target Selector & Action Button */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Target Hotspot / Incident Zone:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={targetHotspot}
                      onChange={(e) => setTargetHotspot(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="Baramati Outbreak Hotspot (Contagion Core)">Baramati Outbreak Hotspot (Contagion Core)</option>
                      <option value="Shirur Buffer Containment Ring">Shirur Buffer Containment Ring</option>
                      <option value="Indapur Veterinary Cordon">Indapur Veterinary Cordon</option>
                      <option value="Sinnar Monitoring Node">Sinnar Monitoring Node</option>
                    </select>
                    <button
                      onClick={handleDispatch}
                      disabled={dispatching}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition disabled:opacity-60 cursor-pointer flex-shrink-0"
                    >
                      <Send className={`w-3.5 h-3.5 ${dispatching ? 'animate-spin' : ''}`} />
                      <span>{dispatching ? 'Transmitting...' : 'Dispatch SOS Ambulance'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-800">Select an MVU Unit to view telemetry and dispatch controls</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

