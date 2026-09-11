import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

const VARIANTS = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  primary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  info: 'bg-sky-50 text-slate-900 border-slate-800',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  purple: 'bg-purple-50 text-slate-900 border-slate-800',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  ...props
}) {
  const { t } = useLanguage()
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-semibold rounded-full border ${VARIANTS[variant]} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      <span>{children}</span>
    </span>
  )
}
