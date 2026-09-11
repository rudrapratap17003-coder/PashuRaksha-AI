import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { X, FlaskConical, ShieldAlert } from 'lucide-react'
import apiClient from '../../services/api'

export default function RequestLabModal({ isOpen, onClose, cluster, onSuccess }) {
  const { t } = useLanguage()
  const [requesting, setRequesting] = useState(false)
  
  if (!isOpen) return null

  const clusterName = cluster?.cluster_name || 'Karad Outbreak Cluster #901'
  const affectedVillage = cluster?.affected_villages?.[0] || 'Karad'

  const handleRequest = async () => {
    setRequesting(true)
    try {
      await apiClient.post('/alerts/broadcast', {
        title: `🧪 Urgent RT-PCR Request: ${affectedVillage}`,
        message: `Authority requested immediate molecular diagnostic confirmation and epithelial swab typing for ${affectedVillage} (${clusterName}).`,
        target_role: 'laboratory',
        risk_level: 'CRITICAL',
        village: affectedVillage
      })
    } catch (err) {
      console.warn('Lab request API notice:', err)
    }
    setTimeout(() => {
      setRequesting(false)
      if (onSuccess) onSuccess()
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Request Lab RT-PCR
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-bold">Target Cluster</span>
              <span className="text-sm font-black text-white">{clusterName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Location</span>
              <span className="text-sm font-bold text-slate-200">{affectedVillage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Samples / Animals</span>
              <span className="text-sm font-bold text-slate-200">8 affected animals</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Testing Priority</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                Critical
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition">
            Cancel
          </button>
          <button
            onClick={handleRequest}
            disabled={requesting}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-slate-900/20"
          >
            {requesting ? 'Requesting...' : 'Request RT-PCR'}
          </button>
        </div>

      </div>
    </div>
  )
}
