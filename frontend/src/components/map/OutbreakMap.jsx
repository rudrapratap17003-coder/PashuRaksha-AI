import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AlertTriangle, ShieldAlert, PawPrint, HeartPulse, Info } from 'lucide-react'
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
  caseMarkers = [],
  center = [18.5204, 74.2800],
  zoom = 9,
  height = '480px',
  onSelectCluster = null,
  onDeployAction = null,
  onBroadcastAction = null,
}) {
  const { t } = useLanguage()
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-inner border border-slate-800" style={{ height }}>
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

        {/* Render Detected Outbreak Clusters */}
        {clusters.map((c) => {
          const lat = c.latitude || 18.1515
          const lng = c.longitude || 74.5772
          const radiusMeters = Math.max(1200, (c.radius_km || 2.0) * 1000)
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
                  fillOpacity: 0.18,
                  weight: 2.5,
                  dashArray: c.risk_level === 'CRITICAL' ? '6, 6' : undefined,
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
                <Popup className="outbreak-popup" maxWidth={340}>
                  <div className="p-2 space-y-2.5 text-slate-900 font-sans">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-900 bg-purple-50 px-1.5 py-0.5 rounded border border-slate-800">
                          {c.id} • 14-Day Window
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1 leading-tight">
                          {c.cluster_name}
                        </h4>
                      </div>
                      <RiskBadge level={t(`data.risk.${c.risk_level}`, {}, c.risk_level)} score={c.cluster_score} size="sm" />
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-700">
                      <p className="font-bold text-rose-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        {c.disease_concern}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 py-1.5 text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div>Cases (14d): <strong className="text-slate-900 font-bold">{c.case_count} Reports</strong></div>
                        <div>Affected Herd: <strong className="text-rose-600 font-bold">{c.affected_animals_count} Animals</strong></div>
                        <div>Radius: <strong className="text-slate-900 font-bold">{c.radius_km || 2.0} km</strong></div>
                        <div>Vaccination: <strong className="text-emerald-700 font-bold">{c.vaccination_coverage || 78.5}%</strong></div>
                      </div>

                      {c.explanation && (
                        <div className="p-2 rounded-xl bg-purple-50/80 border border-slate-800 text-[10.5px] text-purple-950 leading-relaxed font-medium">
                          <strong>Why Detected:</strong> {c.explanation}
                        </div>
                      )}
                    </div>

                    {c.dominant_symptoms && c.dominant_symptoms.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Dominant Symptoms:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {c.dominant_symptoms.map((sym) => (
                            <span
                              key={sym}
                              className="px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[9px] font-bold"
                            >
                              {sym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Response Action Buttons in Popup */}
                    <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5">
                      <button
                        onClick={() => onDeployAction ? onDeployAction(c) : alert(`Dispatched team to ${c.cluster_name}`)}
                        className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition"
                      >
                        Deploy Team
                      </button>
                      <button
                        onClick={() => onBroadcastAction ? onBroadcastAction(c) : alert(`Advisory sent to ${c.cluster_name}`)}
                        className="flex-1 py-1.5 px-2 bg-purple-900 hover:bg-purple-800 text-slate-300 text-[10px] font-bold rounded-lg transition "
                      >
                        Issue Advisory
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          )
        })}

        {/* Render Individual Case Markers */}
        {caseMarkers.map((m) => (
          <Marker
            key={m.id}
            position={[m.latitude, m.longitude]}
            icon={createCustomMarker(m.risk_level)}
          >
            <Popup>
              <div className="p-1 space-y-1 text-slate-900 text-xs">
                <div className="font-bold text-slate-900">{m.title || `Case #${m.id}`}</div>
                <div className="text-[10px] text-slate-600">Risk Score: <strong>{m.risk_score}/100 ({t(`data.risk.${m.risk_level}`, {}, m.risk_level)})</strong></div>
                <div className="text-[10px] text-slate-600">Symptom: <strong>{m.dominant_symptom}</strong></div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 right-3 z-20 bg-slate-950/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-slate-800 text-[11px] font-medium text-slate-300 space-y-1.5">
        <span className="font-black text-[10px] uppercase text-slate-300 block pb-1 border-b border-slate-800">
          Epidemiological GIS Layers
        </span>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block shadow-sm shadow-slate-900/20" />
          <span>Critical Hotspot (Score ≥ 80)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
          <span>High Alert Zone (Score 60–79)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span>Surveillance Watchlist (30–59)</span>
        </div>
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
          <span>⭕ Ring Buffer: 5.0 km Containment</span>
        </div>
      </div>
    </div>
  )
}
