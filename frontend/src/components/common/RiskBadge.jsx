import React from 'react'
import { RISK_LEVELS } from '../../utils/constants'
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react'

const ICONS = {
  LOW: CheckCircle,
  MODERATE: AlertTriangle,
  HIGH: AlertCircle,
  CRITICAL: ShieldAlert,
}

export default function RiskBadge({
  level = 'LOW',
  score = null,
  showIcon = true,
  size = 'md',
  className = '',
}) {
  const normalizedLevel = (level || 'LOW').toUpperCase()
  const config = RISK_LEVELS[normalizedLevel] || RISK_LEVELS.LOW
  const Icon = ICONS[normalizedLevel] || CheckCircle

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg'
    ? 'px-4 py-1.5 text-sm font-bold'
    : 'px-3 py-1 text-xs font-semibold'

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border shadow-sm ${config.badge} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>
        {config.label} {score !== null && score !== undefined ? `(${score}/100)` : ''}
      </span>
    </span>
  )
}
