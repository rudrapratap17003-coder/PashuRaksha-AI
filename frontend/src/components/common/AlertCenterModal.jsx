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
  RefreshCw
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
  const [filter, setFilter] = useState('all')

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get(`/alerts?role=${user?.role || 'farmer'}`)
      setAlerts(res.data)
    } catch (err) {
      console.error('Error loading alerts:', err)
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
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a))
      if (onAlertRead) onAlertRead()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unread') return !a.is_read
    return true
  })

  const unreadCount = alerts.filter(a => !a.is_read).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border-slate-200 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <Bell className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 leading-tight">
                Surveillance &amp; Early-Warning Alerts
              </h3>
              <p className="text-xs text-slate-500">
                Target Role: <strong>{user?.role?.toUpperCase() || 'FARMER'}</strong> • {unreadCount} Unread
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === 'unread' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <button
            onClick={fetchAlerts}
            title="Refresh alerts"
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No active notification alerts for your current filter.
            </div>
          ) : (
            filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-4 rounded-2xl border transition space-y-2 ${
                  alt.is_read
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : alt.risk_level === 'CRITICAL'
                    ? 'bg-gradient-to-r from-rose-50 to-white border-rose-200 shadow-xs'
                    : 'bg-gradient-to-r from-amber-50 to-white border-amber-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {alt.title}
                      </span>
                      {!alt.is_read && (
                        <span className="w-2 h-2 rounded-full bg-rose-600 inline-block animate-pulse" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                      <span>Village: <strong>{alt.village || 'Rampur'}</strong></span>
                      <span>•</span>
                      <span>Type: {alt.alert_type?.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>

                  <Badge variant={alt.risk_level === 'CRITICAL' ? 'danger' : 'warning'} size="sm">
                    {alt.risk_level}
                  </Badge>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {alt.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400">
                    {alt.created_at ? new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>

                  {!alt.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(alt.id)}
                      className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark as read</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </Card>
    </div>
  )
}
