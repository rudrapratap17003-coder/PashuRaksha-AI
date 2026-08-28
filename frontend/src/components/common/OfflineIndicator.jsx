import React, { useState } from 'react'
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingSync, setPendingSync] = useState(0)

  const toggleOnlineState = () => {
    if (isOnline) {
      setIsOnline(false)
      setPendingSync(2)
    } else {
      setIsOnline(true)
      setPendingSync(0)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleOnlineState}
        title="Toggle Rural Network Simulation"
        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition flex items-center space-x-1.5 ${
          isOnline
            ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60'
            : 'bg-amber-950/80 border-amber-500/40 text-amber-300 animate-pulse'
        }`}
      >
        {isOnline ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Online Sync</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-amber-400" />
            <span>Offline ({pendingSync} Queued)</span>
          </>
        )}
      </button>
    </div>
  )
}
