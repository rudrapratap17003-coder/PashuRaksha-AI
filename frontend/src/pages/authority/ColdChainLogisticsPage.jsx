import React, { useState } from 'react'
import {
  Thermometer,
  Truck,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Syringe,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  Layers,
  ArrowRight,
  Send,
  Building2,
  PackageCheck
} from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'

const COLD_CHAIN_NODES = [
  {
    id: 'NODE-PUNE-HQ',
    location: 'District Vaccine Depot, Aundh, Pune',
    type: 'Primary ILR (Ice Lined Refrigerator)',
    temperature: 3.4,
    status: 'OPTIMAL',
    stock: {
      fmd_doses: 18500,
      hs_bq_doses: 12000,
      ppr_doses: 6500,
      lsd_goatpox_doses: 9200
    },
    lastPing: '2 mins ago',
    powerBackup: 'Solar Hybrid + Generator Active'
  },
  {
    id: 'NODE-BARAMATI-HUB',
    location: 'Taluka Veterinary Polyclinic, Baramati',
    type: 'Secondary Deep Freezer & ILR',
    temperature: 4.1,
    status: 'OPTIMAL',
    stock: {
      fmd_doses: 4200,
      hs_bq_doses: 2800,
      ppr_doses: 1400,
      lsd_goatpox_doses: 3100
    },
    lastPing: 'Just now',
    powerBackup: 'UPS Grid Synchronized'
  },
  {
    id: 'VAN-RRU-01',
    location: 'Mobile RRU Van #1 (Baramati East Sector)',
    type: 'Active Transit Vaccine Carrier Box',
    temperature: 4.8,
    status: 'IN-TRANSIT',
    stock: {
      fmd_doses: 650,
      hs_bq_doses: 300,
      ppr_doses: 150,
      lsd_goatpox_doses: 400
    },
    lastPing: '1 min ago',
    powerBackup: '12V Vehicle Direct Logger'
  },
  {
    id: 'NODE-SHIRUR-SUB',
    location: 'Rural Veterinary Dispensary, Shirur',
    type: 'Solar Direct Drive Refrigerator',
    temperature: 5.2,
    status: 'OPTIMAL',
    stock: {
      fmd_doses: 1500,
      hs_bq_doses: 900,
      ppr_doses: 500,
      lsd_goatpox_doses: 1100
    },
    lastPing: '4 mins ago',
    powerBackup: 'Solar Photovoltaic'
  }
]

const RING_CAMPAIGNS = [
  {
    id: 'CAMP-BARAMATI-RING',
    zone: 'Baramati 5km Inner Contagion Ring',
    targetLivestock: 5800,
    vaccinatedSoFar: 4120,
    coveragePercent: 71.0,
    teamsDeployed: 6,
    priority: 'HIGH PRIORITY (Active Hotspot)',
    vaccineType: 'Quadrivalent FMD (O, A, Asia-1) + LSD'
  },
  {
    id: 'CAMP-INDAPUR-BUFFER',
    zone: 'Indapur 10km Buffer Surveillance Ring',
    targetLivestock: 8400,
    vaccinatedSoFar: 3600,
    coveragePercent: 42.8,
    teamsDeployed: 4,
    priority: 'MODERATE (Containment Buffer)',
    vaccineType: 'Quadrivalent FMD Oil Adjuvant'
  }
]

export default function ColdChainLogisticsPage() {
  const [nodes, setNodes] = useState(COLD_CHAIN_NODES)
  const [campaigns, setCampaigns] = useState(RING_CAMPAIGNS)
  const [requestSent, setRequestSent] = useState(false)

  return (
    <div className="space-y-6 pb-12 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Thermometer className="w-4 h-4 text-sky-400" />
            <span>State Livestock Health Mission • Maharashtra Cold Chain Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ring Vaccination & Cold Chain Logistics Hub
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Real-time IoT temperature telemetry (2°C – 8°C safety window), vaccine vial monitors (VVM), and micro-planned ring containment deployment.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setRequestSent(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-950 flex items-center space-x-2 transition"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Request Stock Requisition</span>
          </button>
        </div>
      </div>

      {requestSent && (
        <div className="p-4 rounded-2xl bg-sky-950/80 border border-sky-500 text-sky-200 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Stock Requisition dispatched to Institute of Veterinary Biological Products (IVBP), Ganeshkhind, Pune.</span>
          </div>
          <button onClick={() => setRequestSent(false)} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* 2-Column Split: Active Ring Campaigns & Cold Chain Telemetry Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Ring Vaccination Campaigns */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Active Ring Vaccination Campaigns (Micro-Plans)</span>
          </h2>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <Card key={camp.id} className="bg-slate-900/80 border-slate-800 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{camp.id}</span>
                    <h3 className="text-base font-black text-white">{camp.zone}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{camp.vaccineType}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/30">
                    {camp.priority}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Immunity Coverage: {camp.coveragePercent}%</span>
                    <span className="text-emerald-400">{camp.vaccinatedSoFar.toLocaleString()} / {camp.targetLivestock.toLocaleString()} Head</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${camp.coveragePercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80 pt-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Field Teams Active:</span>
                    <strong className="text-white">{camp.teamsDeployed} Mobile Vans</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Target Finish Date:</span>
                    <strong className="text-emerald-300">Within 48 Hours</strong>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: IoT Cold Chain Telemetry Nodes */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-sky-400" />
            <span>IoT Cold Storage Telematics (2°C – 8°C Safe Zone)</span>
          </h2>

          <div className="space-y-3">
            {nodes.map((node) => (
              <Card key={node.id} className="bg-slate-900/80 border-slate-800 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-sky-400 font-bold">{node.id}</span>
                      <span className="text-[10px] text-slate-500">• {node.lastPing}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{node.location}</h4>
                    <span className="text-[11px] text-slate-400 block">{node.type}</span>
                  </div>

                  {/* Temperature Pill */}
                  <div className="text-right flex flex-col items-end">
                    <div className="px-3 py-1 rounded-xl bg-sky-950/90 border border-sky-500/40 text-sky-300 font-mono text-sm font-black flex items-center space-x-1">
                      <Thermometer className="w-3.5 h-3.5" />
                      <span>{node.temperature}°C</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase mt-1">Safe Operating Range</span>
                  </div>
                </div>

                {/* Stock Breakdown */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="p-1">
                    <span className="text-slate-500 block">FMD Vials</span>
                    <strong className="text-emerald-400 text-xs">{node.stock.fmd_doses}</strong>
                  </div>
                  <div className="p-1">
                    <span className="text-slate-500 block">HS/BQ</span>
                    <strong className="text-white text-xs">{node.stock.hs_bq_doses}</strong>
                  </div>
                  <div className="p-1">
                    <span className="text-slate-500 block">PPR</span>
                    <strong className="text-white text-xs">{node.stock.ppr_doses}</strong>
                  </div>
                  <div className="p-1">
                    <span className="text-slate-500 block">LSD Vax</span>
                    <strong className="text-sky-400 text-xs">{node.stock.lsd_goatpox_doses}</strong>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex justify-between items-center">
                  <span>Power Backup: <strong className="text-slate-300">{node.powerBackup}</strong></span>
                  <span className="text-emerald-400 font-bold">VVM Stage 1 (Usable)</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
