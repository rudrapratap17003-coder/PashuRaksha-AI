import React, { useState, useEffect } from 'react'
import { CloudRain, Thermometer, Wind, AlertTriangle, Droplets, ShieldCheck } from 'lucide-react'
import apiClient from '../../services/api'

export default function WeatherWidget({ district = 'Pune', village = 'Baramati' }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await apiClient.get(`/weather?district=${district}&village=${village}`)
        setWeather(res.data)
      } catch {
        setWeather({
          location: `${village}, ${district}`,
          district: district,
          temperature_celsius: 27.8,
          humidity_percent: 86,
          rainfall_mm: 142.5,
          season: 'Monsoon (Heavy Precipit.)',
          seasonal_risk: 'High',
          environmental_risk_score: 74.0,
          advisory: 'Pre-monsoon humidity elevates vector transmission risk. Ensure livestock shelters remain dry and well-ventilated.'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [district, village])

  if (loading && !weather) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-slate-800 rounded w-3/4"></div>
      </div>
    )
  }

  const isHighRisk = weather?.environmental_risk_score >= 60

  return (
    <div className={`rounded-2xl border p-4.5 transition-all ${
      isHighRisk 
        ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/30' 
        : 'bg-slate-900/80 border-slate-800'
    }`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              Environmental Risk • {weather?.district || district}
            </h4>
            <p className="text-[10px] text-slate-400">Maharashtra Agro-Climatic Sensor Mesh</p>
          </div>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
          isHighRisk 
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse' 
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        }`}>
          {weather?.seasonal_risk || 'Moderate'} Seasonal Risk
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 my-3 text-center">
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2">
          <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px]">
            <Thermometer className="w-3 h-3 text-orange-400" />
            <span>Temp</span>
          </div>
          <span className="text-sm font-black text-white mt-0.5 block">
            {weather?.temperature_celsius}°C
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2">
          <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px]">
            <Droplets className="w-3 h-3 text-sky-400" />
            <span>Humidity</span>
          </div>
          <span className="text-sm font-black text-sky-300 mt-0.5 block">
            {weather?.humidity_percent}%
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2">
          <div className="flex items-center justify-center space-x-1 text-slate-400 text-[10px]">
            <Wind className="w-3 h-3 text-teal-400" />
            <span>Rainfall</span>
          </div>
          <span className="text-sm font-black text-teal-300 mt-0.5 block">
            {weather?.rainfall_mm} mm
          </span>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-amber-200/90 leading-relaxed flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>{weather?.advisory}</span>
      </div>
    </div>
  )
}
