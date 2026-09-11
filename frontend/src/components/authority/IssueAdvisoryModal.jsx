import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { X, MessageSquare, ShieldAlert } from 'lucide-react'
import apiClient from '../../services/api'

export default function IssueAdvisoryModal({ isOpen, onClose, cluster, onSuccess }) {
  const { t } = useLanguage()
  const [issuing, setIssuing] = useState(false)
  
  const clusterName = cluster?.cluster_name || 'Karad Outbreak Cluster #901'
  const affectedVillage = cluster?.affected_villages?.[0] || 'Karad'
  
  const [message, setMessage] = useState(
    `Health advisory: Movement of livestock in and around the ${affectedVillage} containment zone should be restricted. Report animals showing fever, cough, difficulty breathing, or reduced appetite to the veterinary response team immediately.`
  )

  if (!isOpen) return null

  const handleIssue = async () => {
    setIssuing(true)
    try {
      await apiClient.post('/alerts/broadcast', {
        title: `📢 Biosecurity Advisory: ${affectedVillage} Containment Zone`,
        message: message,
        target_role: 'farmer',
        risk_level: 'HIGH',
        village: affectedVillage
      })
    } catch (err) {
      console.warn('Advisory broadcast API notice:', err)
    }
    setTimeout(() => {
      setIssuing(false)
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
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200  text-slate-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Issue Public Health Advisory
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-bold">Target Cluster</span>
            <span className="text-sm font-black text-white">{clusterName}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400">Affected Village</span>
            <span className="text-sm font-bold text-slate-200">{affectedVillage}</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-2">Advisory Message</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition">
            Cancel
          </button>
          <button
            onClick={handleIssue}
            disabled={issuing}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-slate-900/20"
          >
            {issuing ? 'Issuing...' : 'Issue Advisory'}
          </button>
        </div>

      </div>
    </div>
  )
}
