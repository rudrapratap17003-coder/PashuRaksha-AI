import React from 'react'
import Card from './Card'

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-emerald-50 text-emerald-600',
  trend,
  className = '',
}) {
  return (
    <Card className={`flex items-start justify-between ${className}`}>
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500">{subtitle}</p>
        )}
        {trend && (
          <div className="pt-1 flex items-center space-x-1 text-xs">
            <span className={trend.positive ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
              {trend.text}
            </span>
            <span className="text-slate-400">{trend.label}</span>
          </div>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  )
}
