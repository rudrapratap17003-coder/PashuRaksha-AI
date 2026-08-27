import React from 'react'

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${padding} ${
        hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
