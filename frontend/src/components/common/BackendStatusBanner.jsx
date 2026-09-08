import React, { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw, CheckCircle2, WifiOff } from 'lucide-react'
import { checkHealth } from '../../services/api'

export default function BackendStatusBanner() {
  const [status, setStatus] = useState('checking') // 'healthy' | 'offline' | 'checking'
  const [retrying, setRetrying] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const verifyHealth = async () => {
    setRetrying(true)
    try {
      await checkHealth()
      setStatus('healthy')
    } catch {
      setStatus('offline')
    } finally {
      setRetrying(false)
    }
  }

  useEffect(() => {
    verifyHealth()
    const interval = setInterval(verifyHealth, 45000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'healthy' || status === 'checking' || dismissed) {
    return null
  }

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-amber-200 text-xs flex items-center justify-between gap-2 animate-in slide-in-from-top">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>
          <strong>Backend Service Unreachable:</strong> Operating with local cached data &amp; IndexedDB offline queue.
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={verifyHealth}
          disabled={retrying}
          className="px-2.5 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/40 text-amber-100 font-bold transition flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
          <span>{retrying ? 'Connecting...' : 'Retry Connection'}</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-amber-400 hover:text-white"
          title="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
