import React from 'react'

/**
 * Custom Livestock & Animal Protection Emblem Logo
 * Features smooth spring rotation, glassmorphic sheen, and ambient pulse ring
 */
export default function PashuLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9'
  }

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 ring-4 ring-sky-100/70 hover:ring-sky-200 flex-shrink-0 relative overflow-hidden group cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:rotate-3 hover:shadow-sky-500/40 ${className}`}
    >
      {/* Animated subtle shimmer sheen */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

      {/* Stylized Cattle / Livestock Animal Protection SVG */}
      <svg
        className={`${iconSizes[size] || iconSizes.md} text-white fill-current transition-transform duration-300 ease-out group-hover:scale-110`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cow / Bull Horns & Head Contour with Medical Shield */}
        <path d="M12 2C8.5 2 7 4.5 4.5 4.5C3.2 4.5 2.5 5.5 2 6.5C3.8 6.8 5 8 5.5 9.5C6 11 5.8 12.5 6 14C6.5 17 9 20 12 22C15 20 17.5 17 18 14C18.2 12.5 18 11 18.5 9.5C19 8 20.2 6.8 22 6.5C21.5 5.5 20.8 4.5 19.5 4.5C17 4.5 15.5 2 12 2Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Animal Ears / Horn Accents */}
        <path d="M6 7.5L3 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 7.5L21 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Central Livestock Health Heartbeat / Pulse Cross */}
        <path d="M9.5 12.5H11L12 10.5L13 14.5L14 12.5H15.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        
        {/* Muzzle / Nose Ring Dots */}
        <circle cx="10.5" cy="17" r="0.75" fill="currentColor" />
        <circle cx="13.5" cy="17" r="0.75" fill="currentColor" />
      </svg>
    </div>
  )
}
