import React from 'react'

const VARIANTS = {
  primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 border-transparent',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200',
  outline: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200 border-transparent',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border-transparent',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg font-medium',
  md: 'px-4 py-2 text-sm rounded-xl font-semibold',
  lg: 'px-6 py-3 text-base rounded-2xl font-bold',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center space-x-2 transition-all duration-150 border active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 flex-shrink-0" />
      )}
      <span>{children}</span>
    </button>
  )
}
