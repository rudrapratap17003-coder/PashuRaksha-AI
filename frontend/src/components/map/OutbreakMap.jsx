import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AlertTriangle, ShieldAlert, PawPrint, Activity, Info } from 'lucide-react'
import RiskBadge from '../common/RiskBadge'
import Badge from '../common/Badge'

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Create custom colored HTML pulse icons
const createCustomMarker = (riskLevel) => {
  let bgColor = '#059669' // emerald
  let ringColor = 'rgba(5, 150, 105, 0.4)'
  if (riskLevel === 'CRITICAL') {
    bgColor = '#e11d48' // rose
    ringColor = 'rgba(225, 29, 72, 0.4)'
  } else if (riskLevel === 'HIGH') {
    bgColor = '#ea580c' // orange
    ringColor = 'rgba(234, 88, 12, 0.4)'
  } else if (riskLevel === 'MODERATE') {
    bgColor = '#d97706' // amber
    ringColor = 'rgba(217, 119, 6, 0.4)'
  }

  return L.divIcon({
    className: 'custom-outbreak-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background-color: ${ringColor}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 18px; height: 18px; border-radius: 9999px; background-color: ${bgColor}; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

const getRiskColor = (level) => {
  if (level === 'CRITICAL') return '#e11d48'
  if (level === 'HIGH') return '#ea580c'
  if (level === 'MODERATE') return '#d97706'
  return '#059669'
}

export default function OutbreakMap({
  clusters = [],
  center = [18.5204, 74.2800],
  zoom = 9,
  height = '460px',
  onSelectCluster = null,
}) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {clusters.map((c) => {
          const lat = c.latitude || 18.1515
          const lng = c.longitude || 74.5772
          const radiusMeters = Math.max(800, (c.radius_km || 1.5) * 1000)
          const riskColor = getRiskColor(c.risk_level)

          return (
            <React.Fragment key={c.id}>
              {/* Containment Buffer Circle */}
              <Circle
                center={[lat, lng]}
                radius={radiusMeters}
                pathOptions={{
                  color: riskColor,
                  fillColor: riskColor,
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: c.risk_level === 'CRITICAL' ? '4, 4' : undefined,
                }}
              />

              {/* Centroid Marker with Popup */}
              <Marker
                position={[lat, lng]}
                icon={createCustomMarker(c.risk_level)}
                eventHandlers={{
                  click: () => onSelectCluster && onSelectCluster(c),
                }}
              >
                <Popup className="outbreak-popup">
                  <div className="p-1 space-y-2 max-w-xs text-slate-900 font-sans">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {c.id}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">
                          {c.cluster_name}
                        </h4>
                      </div>
                      <RiskBadge level={c.risk_level} score={c.cluster_score} size="sm" />
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600">
                      <p className="font-semibold text-rose-700">
                        {c.disease_concern}
                      </p>
                      <div className="grid grid-cols-2 gap-1 py-1 text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <div>Cases: <strong>{c.case_count} Reports</strong></div>
                        <div>Affected: <strong>{c.affected_animals_count} Animals</strong></div>
                        <div>Radius: <strong>{c.radius_km || 1.5} km</strong></div>
                        <div>Score: <strong>{c.cluster_score}/100</strong></div>
                      </div>
                    </div>

                    {c.dominant_symptoms && c.dominant_symptoms.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Dominant Symptoms:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {c.dominant_symptoms.map((sym) => (
                            <span
                              key={sym}
                              className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-semibold"
                            >
                              {sym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {c.recommended_action && (
                      <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[10px] text-rose-900 leading-snug">
                        <strong>Action:</strong> {c.recommended_action}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          )
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-lg border border-slate-200 text-[11px] font-medium text-slate-700 space-y-1">
        <span className="font-bold text-[10px] uppercase text-slate-400 block pb-0.5 border-b border-slate-100">
          Epidemiological Risk Tiers
        </span>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
          <span>Critical Hotspot (80–100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
          <span>High Alert Zone (60–79)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Surveillance Watchlist (30–59)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span>Normal Baseline (0–29)</span>
        </div>
      </div>
    </div>
  )
}
