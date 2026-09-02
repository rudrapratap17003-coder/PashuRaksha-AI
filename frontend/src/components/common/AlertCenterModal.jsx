import React, { useState, useEffect } from 'react'
import { 
  X, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Check,
  RefreshCw,
  Syringe,
  Microscope,
  Radio,
  Layers,
  Sparkles
} from 'lucide-react'
import Card from './Card'
import Button from './Button'
import Badge from './Badge'
import RiskBadge from './RiskBadge'
import apiClient from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function AlertCenterModal({ isOpen, onClose, onAlertRead = null }) {
  if (!isOpen) return null

  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const [alertRes, notifRes] = await Promise.allSettled([
        apiClient.get(`/alerts?role=${user?.role || 'farmer'}`),
        apiClient.get(`/notifications?role=${user?.role || 'farmer'}`)
      ])
      
      let combined = []
      if (alertRes.status === 'fulfilled' && Array.isArray(alertRes.value.data)) {
        combined = [...alertRes.value.data]
      }
      if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value.data)) {
        combined = [...combined, ...notifRes.value.data]
      }
      
      if (combined.length === 0) {
        // Fallback Maharashtra Alerts
        combined = [
          {
            id: 'alt-001',
            title: '⚠️ Elevated Livestock Health Risk in Baramati',
            message: 'Multiple similar health reports detected in your area. Check your animals for fever, cough, or breathing difficulty.',
            risk_level: 'CRITICAL',
            village: 'Baramati',
            category: 'cluster_warning',
            is_read: false,
            created_at: new Date().toISOString()
          },
          {
            id: 'alt-005',
            title: '💉 Vaccination Due: HS+BQ Pre-Monsoon Booster',
            message: 'Your animals are due for Hemorrhagic Septicemia + Black Quarter vaccination. Contact nearest dispensary.',
            risk_level: 'MODERATE',
            village: 'Shirur',
            category: 'vaccination',
            is_read: false,
            created_at: new Date().toISOString()
          },
          {
            id: 'alt-007',
            title: '🔬 URGENT Sample: FMD Typing Required',
            message: 'Epithelial swab from Baramati requires urgent FMD virus typing.',
            risk_level: 'HIGH',
            village: 'Baramati',
            category: 'lab_update',
            is_read: true,
            created_at: new Date().toISOString()
          }
        ]
      }
      setAlerts(combined)
    } catch {
      // Keep state resilient
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [user?.role])

  const handleMarkAsRead = async (alertId) => {
    try {
      await apiClient.put(`/alerts/${alertId}/read`)
    } catch {
      // Local optimistic update
    }
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a))
    if (onAlertRead) onAlertRead()
  }

  const handleMarkAllRead = async () => {
    try {
      await apiClient.put(`/notifications/read-all?user_id=${user?.id || 'demo-user'}`)
    } catch {
      // Local optimistic update
    }
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })))
    if (onAlertRead) onAlertRead()
  }

  const filteredAlerts = alerts.filter(a => {
    if (categoryFilter === 'unread') return !a.is_read
    if (categoryFilter === 'cluster') return a.category === 'cluster_warning' || a.alert_type === 'cluster_warning'
    if (categoryFilter === 'vaccine') return a.category === 'vaccination' || a.alert_type === 'vaccination_reminder'
    if (categoryFilter === 'lab') return a.category === 'lab_update' || a.alert_type === 'lab_priority'
    return true
  })

  const unreadCount = alerts.filter(a => !a.is_read).length

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">Surveillance & Alert Center</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Maharashtra Livestock Health Network</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 py-3 overflow-x-auto scrollbar-none border-b border-slate-800/80">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: 'Unread' },
            { id: 'cluster', label: 'Outbreak Watch' },
            { id: 'vaccine', label: 'Vaccines' },
            { id: 'lab', label: 'Lab Reports' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                categoryFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredAlerts.map((alt, idx) => (
            <div
              key={alt.id || idx}
              className={`p-4 rounded-2xl border transition ${
                !alt.is_read
                  ? 'bg-slate-950/90 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{alt.title}</span>
                    {!alt.is_read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-1">
                    {alt.village && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{alt.village}</span>
                      </span>
                    )}
                    <span>{new Date(alt.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {!alt.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(alt.id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 text-slate-400 hover:text-emerald-400 transition flex-shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-400" />
              <p className="text-xs">No alerts currently matching this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
