import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react'
import { getPendingCount, syncReports } from '../../utils/offlineQueue'
import apiClient from '../../services/api'

export default function OfflineIndicator() {
  const { t } = useLanguage()
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true))
  const [pendingSync, setPendingSync] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null)

  const updateCount = async () => {
    try {
      const count = await getPendingCount()
      setPendingSync(count)
    } catch {
      setPendingSync(0)
    }
  }

  const triggerSync = async () => {
    if (isSyncing) return
    setIsSyncing(true)
    try {
      const res = await syncReports(apiClient)
      if (res.synced > 0) {
        setSyncStatus(`Synced ${res.synced} report${res.synced > 1 ? 's' : ''}`)
        setTimeout(() => setSyncStatus(null), 4000)
      }
      await updateCount()
    } catch {
      // Ignore
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    updateCount()

    const handleOnline = () => {
      setIsOnline(true)
      triggerSync()
    }
    const handleOffline = () => {
      setIsOnline(false)
    }
    const handleQueueChange = (e) => {
      if (e.detail && typeof e.detail.count === 'number') {
        setPendingSync(e.detail.count)
      } else {
        updateCount()
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('pashuraksha-offline-queue-update', handleQueueChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('pashuraksha-offline-queue-update', handleQueueChange)
    }
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={triggerSync}
        disabled={isSyncing}
        title={pendingSync > 0 ? "Click to sync offline reports to server" : "Rural Network Status"}
        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition flex items-center space-x-1.5 ${
          !isOnline
            ? 'bg-amber-950/80 border-amber-500/40 text-amber-300 animate-pulse'
            : pendingSync > 0
            ? 'bg-sky-950/80 border-slate-800 text-slate-300 hover:bg-sky-900/60'
            : 'bg-emerald-950/70 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60'
        }`}
      >
        {syncStatus ? (
          <>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Synced</span>
          </>
        ) : isSyncing ? (
          <>
            <RefreshCw className="w-3 h-3 text-slate-300 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : !isOnline ? (
          <>
            <WifiOff className="w-3 h-3 text-amber-400" />
            <span>Offline {pendingSync > 0 ? `(${pendingSync})` : ''}</span>
          </>
        ) : pendingSync > 0 ? (
          <>
            <RefreshCw className="w-3 h-3 text-slate-300" />
            <span>Pending Sync ({pendingSync})</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Online</span>
          </>
        )}
      </button>
    </div>
  )
}
