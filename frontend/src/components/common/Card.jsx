import React from 'react'

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'p-5',
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${
        hover ? 'card-hover' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
