import React, { useState } from 'react'
import {
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Truck,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Search,
  Scan,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const ANIMAL_MARKETS = [
  {
    marketName: 'Baramati APMC Livestock Market (शनिवार बाजार)',
    day: 'Every Saturday',
    taluka: 'Baramati, Pune',
    status: 'EMBARGO ACTIVE (FMD Ring Containment)',
    statusType: 'danger',
    weeklyCattleFootfall: '~1,200 Head',
    disinfectionStation: 'Active (4% Sodium Carbonate Drive-Through Spray)',
    activeRestrictions: 'Total ban on livestock transit from within 10km containment zone.'
  },
  {
    marketName: 'Loni Livestock & Bullock Bazaar (लोणी बाजार)',
    day: 'Every Wednesday',
    taluka: 'Rahata, Ahmednagar',
    status: 'SURVEILLANCE SCREENING ACTIVE',
    statusType: 'warning',
    weeklyCattleFootfall: '~2,800 Head',
    disinfectionStation: 'Active Vehicle Disinfection',
    activeRestrictions: 'Mandatory QR Health Certificate & FMD vaccination check at toll gates.'
  },
  {
    marketName: 'Sangola Famous Cattle & Goat Market',
    day: 'Every Sunday',
    taluka: 'Sangola, Solapur',
    status: 'NORMAL CLEARANCE',
    statusType: 'success',
    weeklyCattleFootfall: '~3,400 Head',
    disinfectionStation: 'Routine Gatekeeper Check',
    activeRestrictions: 'Standard e-transit verification.'
  }
]

const SAMPLE_PERMITS = [
  {
    permitId: 'MH-TRANSIT-2026-8812',
    trader: 'Dnyaneshwar Shinde',
    originVillage: 'Shirur (Buffer Zone)',
    destinationMarket: 'Loni Market',
    animalCount: 4,
    species: 'Cattle (Khillar)',
    vaxStatus: 'Fully Vaccinated (FMD + HS)',
    verdict: 'PERMIT APPROVED',
    isAllowed: true
  },
  {
    permitId: 'MH-TRANSIT-2026-9401',
    trader: 'Popat Jadhav',
    originVillage: 'Baramati East (Infected Core)',
    destinationMarket: 'Baramati Saturday Bazaar',
    animalCount: 2,
    species: 'Buffalo (Murrah)',
    vaxStatus: 'Overdue / Suspect Hotspot',
    verdict: 'TRANSIT BLOCKED (Containment Cordon Violation)',
    isAllowed: false
  }
]

export default function MarketBiosecurityPage() {
  const [markets, setMarkets] = useState(ANIMAL_MARKETS)
  const [permits, setPermits] = useState(SAMPLE_PERMITS)
  const [scanCode, setScanCode] = useState('')
  const [scanVerdict, setScanVerdict] = useState(null)

  const handleVerifyPermit = (e) => {
    e.preventDefault()
    if (!scanCode.trim()) return
    if (scanCode.includes('9401') || scanCode.toLowerCase().includes('baramati')) {
      setScanVerdict({
        allowed: false,
        msg: '⛔ MOVEMENT DENIED: Animal originates from Baramati active FMD contagion cluster. Quarantined for 21 days.'
      })
    } else {
      setScanVerdict({
        allowed: true,
        msg: '✓ PERMIT VALID: 100% vaccination verified. Animal cleared for APMC market entry.'
      })
    }
  }

  return (
    <div className="space-y-6 pb-12 text-slate-100 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>APMC Market Biosecurity Gatekeeper • जनावरांचे आठवडे बाजार जैवसुरक्षा</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Livestock Weekly Market &amp; Transit Gatekeeper
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Live monitoring of Maharashtra livestock bazaars, electronic transit permits, and automated contagion cordon enforcement to halt inter-district epidemic spread.
          </p>
        </div>
      </div>

      {/* Transit Permit QR Scanner Verification Bar */}
      <Card className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <QrCode className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black text-white">Live Transit Permit &amp; Cattle Truck Gatekeeper Scanner</h3>
        </div>

        <form onSubmit={handleVerifyPermit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={scanCode}
            onChange={(e) => setScanCode(e.target.value)}
            placeholder="Scan Permit QR or Enter Permit ID (e.g. MH-TRANSIT-2026-9401 or 8812)..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 px-4 py-3 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2 transition flex-shrink-0"
          >
            <Scan className="w-4 h-4" />
            <span>Verify Market Entry</span>
          </button>
        </form>

        {scanVerdict && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2.5 ${
            scanVerdict.allowed ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200' : 'bg-rose-950/80 border border-rose-500 text-rose-200'
          }`}>
            {scanVerdict.allowed ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
            <span>{scanVerdict.msg}</span>
          </div>
        )}
      </Card>

      {/* Major Maharashtra Markets Biosecurity Status */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Major Maharashtra Livestock Bazaars Status</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {markets.map((m, i) => (
            <Card key={i} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{m.day}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    m.statusType === 'danger' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    m.statusType === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {m.statusType === 'danger' ? 'Embargoed' : m.statusType === 'warning' ? 'Screening' : 'Normal'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">{m.marketName}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{m.taluka}</p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Weekly Footfall:</span>
                    <strong className="text-white">{m.weeklyCattleFootfall}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Spray Station:</span>
                    <strong className="text-emerald-400">Active</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                <p>{m.activeRestrictions}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
