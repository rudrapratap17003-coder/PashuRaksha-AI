import React, { useState } from 'react'
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
  Stethoscope
} from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const MVU_FLEET = [
  {
    id: 'MH-12-MVU-1962',
    name: 'Pashu Sanjeevani Unit #01 (Baramati)',
    district: 'Pune',
    currentLocation: 'Baramati East Wasti (18.1582° N, 74.5810° E)',
    status: 'ON-CALL (Attending Case)',
    dutyVet: 'Dr. Vivek Kulkarni, B.V.Sc',
    driver: 'Santosh Ghadge (9822145678)',
    speedKmH: 32,
    fuelPercent: 82,
    coldBoxTemp: 4.1,
    casesHandledToday: 7,
    equipment: ['Ultrasound Scanner', 'Minor Surgery Kit', 'Emergency FMD Vax Pack']
  },
  {
    id: 'MH-12-MVU-1963',
    name: 'Pashu Sanjeevani Unit #02 (Shirur)',
    district: 'Pune',
    currentLocation: 'Shirur Bypass Station (18.8290° N, 74.3720° E)',
    status: 'STANDBY (Ready for Dispatch)',
    dutyVet: 'Dr. Priya Sharma, M.V.Sc',
    driver: 'Rahul Shinde (9822998811)',
    speedKmH: 0,
    fuelPercent: 94,
    coldBoxTemp: 3.8,
    casesHandledToday: 4,
    equipment: ['Blood Analyzer Kit', 'Emergency Oxygen', 'Deworming Drencher']
  },
  {
    id: 'MH-42-MVU-1964',
    name: 'Pashu Sanjeevani Unit #03 (Indapur)',
    district: 'Pune',
    currentLocation: 'Bawada Road (18.1120° N, 75.0210° E)',
    status: 'EN-ROUTE (Dispatched to Hotspot)',
    dutyVet: 'Dr. Amit Jadhav, B.V.Sc',
    driver: 'Nitin Pawar (9823445566)',
    speedKmH: 48,
    fuelPercent: 68,
    coldBoxTemp: 4.4,
    casesHandledToday: 6,
    equipment: ['Liquid Nitrogen AI Container', 'Post-Mortem Kit', 'Antibiotic Injectables']
  }
]

export default function MvuFleetTracker() {
  const [fleet, setFleet] = useState(MVU_FLEET)
  const [selectedUnit, setSelectedUnit] = useState(MVU_FLEET[0])
  const [sosDispatched, setSosDispatched] = useState(false)
  const [targetVillage, setTargetVillage] = useState('Baramati')

  const handleDispatch = () => {
    setSosDispatched(true)
    setTimeout(() => {
      setFleet(prev => prev.map(u => 
        u.id === selectedUnit.id ? { ...u, status: 'DISPATCHED VIA SOS' } : u
      ))
    }, 500)
  }

  return (
    <div className="space-y-6 pb-12 text-slate-100 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-500/20 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>1962 Pashu Sanjeevani • फिरता पशुवैद्यकीय दवाखाना GPS Fleet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mobile Veterinary Unit (MVU) Live Dispatcher
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Real-time GPS tracking, telemetry, cold-box monitoring, and emergency SOS routing for Government of Maharashtra mobile veterinary ambulances.
          </p>
        </div>
      </div>

      {sosDispatched && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Emergency SOS order transmitted to {selectedUnit.name}. Estimated Arrival Time (ETA): 14 minutes.</span>
          </div>
          <button onClick={() => setSosDispatched(false)} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* 2-Column Split: Fleet List + Unit Telemetry & Dispatch Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Fleet Cards */}
        <div className="md:col-span-5 space-y-3">
          {fleet.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUnit(u)}
              className={`w-full p-4 rounded-2xl text-left border transition flex items-center justify-between ${
                selectedUnit.id === u.id
                  ? 'bg-slate-900 border-sky-400 shadow-lg shadow-sky-950'
                  : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-sky-400 font-bold">{u.id}</span>
                  <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${
                    u.status.includes('STANDBY') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {u.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{u.name}</h4>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {u.currentLocation}
                </p>
              </div>
              <Navigation className={`w-4 h-4 ${selectedUnit.id === u.id ? 'text-sky-400' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>

        {/* Right 7 Cols: Unit Telemetry & Dispatch */}
        <div className="md:col-span-7">
          {selectedUnit && (
            <Card className="p-6 rounded-3xl border border-sky-500/30 space-y-5 bg-slate-900/90 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 font-bold uppercase block">{selectedUnit.district} Division</span>
                  <h3 className="text-xl font-black text-white mt-0.5">{selectedUnit.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
                    <span>Officer on Duty: <strong>{selectedUnit.dutyVet}</strong></span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 text-slate-200">
                  {selectedUnit.casesHandledToday} Cases Today
                </span>
              </div>

              {/* IoT Telemetry Strip */}
              <div className="grid grid-cols-3 gap-2.5 text-center bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center justify-center gap-1">
                    <Thermometer className="w-3 h-3 text-sky-400" /> Cold-Box
                  </span>
                  <strong className="text-lg font-black text-sky-300">{selectedUnit.coldBoxTemp}°C</strong>
                  <span className="text-[9px] text-emerald-400 block">Safe Vax Window</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center justify-center gap-1">
                    <Fuel className="w-3 h-3 text-amber-400" /> Diesel Fuel
                  </span>
                  <strong className="text-lg font-black text-white">{selectedUnit.fuelPercent}%</strong>
                  <span className="text-[9px] text-slate-400 block">Range: ~320 km</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center justify-center gap-1">
                    <Navigation className="w-3 h-3 text-teal-400" /> GPS Speed
                  </span>
                  <strong className="text-lg font-black text-teal-300">{selectedUnit.speedKmH} km/h</strong>
                  <span className="text-[9px] text-slate-400 block">Live Telematics</span>
                </div>
              </div>

              {/* On-Board Medical Equipment */}
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">On-Board Mobile Diagnostic Equipment:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUnit.equipment.map((eq, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs">
                      ✓ {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Driver Contact & SOS Dispatch Bar */}
              <div className="p-4 bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="text-slate-300"><strong>Driver:</strong> {selectedUnit.driver}</p>
                  <p className="text-[11px] text-slate-400">Emergency Call Toll-Free: <strong>1962 (24x7)</strong></p>
                </div>
                <button
                  onClick={handleDispatch}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-950 flex items-center space-x-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch SOS Ambulance</span>
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
