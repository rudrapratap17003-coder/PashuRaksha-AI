import React from 'react'
import { motion } from 'framer-motion'

export default function SurveillanceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#061B17]">
      {/* Deep Radial Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-teal-900/20 rounded-full blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-emerald-950/40 rounded-full blur-[160px]" />

      {/* Subtle Coordinate Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #34D399 1px, transparent 1px), linear-gradient(to bottom, #34D399 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      {/* SVG Epidemiological Network Mesh */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Dynamic Telemetry Lines */}
        <g stroke="url(#streamGrad)" strokeWidth="1" fill="none" strokeDasharray="4 6">
          <path d="M 50,150 Q 300,50 600,200 T 1200,100" />
          <path d="M 100,600 Q 450,400 800,650 T 1400,500" />
          <path d="M 200,300 Q 700,550 1100,350 T 1600,450" />
        </g>
      </svg>

      {/* Floating Animated Signal Pulses */}
      <div className="absolute top-1/4 left-[15%] w-2 h-2 rounded-full bg-emerald-400/60 animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute top-1/2 left-[35%] w-2.5 h-2.5 rounded-full bg-teal-400/60 animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/3 right-[25%] w-2 h-2 rounded-full bg-amber-400/60 animate-ping" style={{ animationDuration: '3.5s' }} />
      <div className="absolute bottom-1/4 right-[15%] w-3 h-3 rounded-full bg-rose-500/50 animate-ping" style={{ animationDuration: '2.5s' }} />
    </div>
  )
}
