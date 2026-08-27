import React from 'react'
import { ShieldAlert, Info, AlertTriangle, AlertCircle, X } from 'lucide-react'
import { LEGAL_DISCLAIMER } from '../../utils/constants'

const TYPES = {
  disclaimer: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: ShieldAlert,
    iconColor: 'text-amber-600',
    title: 'Decision Support & Non-Diagnostic Principle',
  },
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-900',
    icon: Info,
    iconColor: 'text-sky-600',
    title: 'Notice',
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    icon: AlertTriangle,
    iconColor: 'text-orange-600',
    title: 'Early-Warning Alert',
  },
  critical: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    icon: AlertCircle,
    iconColor: 'text-rose-600',
    title: 'Critical Outbreak Alert',
  },
}

export default function AlertBanner({
  type = 'disclaimer',
  title,
  message,
  onClose,
  className = '',
}) {
  const config = TYPES[type] || TYPES.disclaimer
  const Icon = config.icon

  return (
    <div
      className={`p-4 rounded-2xl border ${config.bg} ${config.border} ${config.text} flex items-start space-x-3.5 shadow-sm ${className}`}
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 space-y-0.5 text-xs sm:text-sm">
        <h4 className="font-bold tracking-wide uppercase text-[11px] sm:text-xs">
          {title || config.title}
        </h4>
        <p className="leading-relaxed opacity-90">
          {message || LEGAL_DISCLAIMER}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
