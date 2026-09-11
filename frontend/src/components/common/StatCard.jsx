import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
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
  const { t } = useLanguage()
  return (
    <Card className={`relative flex flex-col h-full min-w-0 p-5 ${className}`} padding="">
      {/* Icon - absolute positioned to never clip or break layouts */}
      {Icon && (
        <div className={`absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Top row: Title with padding-right to guarantee no collision with icon */}
      <div className="mb-4 pr-16">
        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider leading-snug">
          {title}
        </span>
      </div>

      {/* Bottom section: Value and Subtitle */}
      <div className="flex-1 flex flex-col justify-end pr-16">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1.5 whitespace-pre-wrap break-normal">
          {value}
        </div>
        {subtitle && (
          <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="pt-2 flex items-center space-x-1 text-[10px] sm:text-xs">
            <span className={trend.positive ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
              {trend.text}
            </span>
            <span className="text-slate-400 break-words">{trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
