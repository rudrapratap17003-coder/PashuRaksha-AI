import React, { useEffect, useRef } from 'react'
import { Activity, ShieldCheck, Cpu, Radio, Sparkles, Dna } from 'lucide-react'

export default function Auth3DShowcase() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    // 3D Particles on a rotating sphere
    const numParticles = 75
    const radius = Math.min(width, height) * 0.35
    const particles = []

    for (let i = 0; i < numParticles; i++) {
      const theta = Math.acos(2 * Math.random() - 1)
      const phi = 2 * Math.PI * Math.random()
      particles.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        baseX: radius * Math.sin(theta) * Math.cos(phi),
        baseY: radius * Math.sin(theta) * Math.sin(phi),
        baseZ: radius * Math.cos(theta),
        size: Math.random() * 2.5 + 1.5,
        color: i % 4 === 0 ? '#38bdf8' : i % 3 === 0 ? '#6366f1' : '#10b981'
      })
    }

    let angleX = 0.003
    let angleY = 0.005
    let rotation = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      rotation += 0.01

      const cx = width / 2
      const cy = height / 2

      // Draw subtle orbital rings
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation * 0.5)
      ctx.beginPath()
      ctx.ellipse(0, 0, radius * 1.15, radius * 0.45, Math.PI / 4, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([6, 8])
      ctx.stroke()
      ctx.restore()

      // Rotate and Project 3D particles
      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)
      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)

      const projected = []

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i]

        // Rotate Y
        let x1 = p.x * cosY - p.z * sinY
        let z1 = p.z * cosY + p.x * sinY

        // Rotate X
        let y1 = p.y * cosX - z1 * sinX
        let z2 = z1 * cosX + p.y * sinX

        p.x = x1
        p.y = y1
        p.z = z2

        // Perspective projection
        const fov = 400
        const scale = fov / (fov + p.z)
        const projX = cx + p.x * scale
        const projY = cy + p.y * scale
        const alpha = Math.max(0.15, (p.z + radius) / (2 * radius))

        projected.push({ x: projX, y: projY, z: p.z, scale, alpha, color: p.color, size: p.size })
      }

      // Draw connecting telemetry lines
      ctx.beginPath()
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x
          const dy = projected[i].y - projected[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 65 && projected[i].z > -radius * 0.3 && projected[j].z > -radius * 0.3) {
            ctx.moveTo(projected[i].x, projected[i].y)
            ctx.lineTo(projected[j].x, projected[j].y)
          }
        }
      }
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)'
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Draw particles
      projected.sort((a, b) => a.z - b.z)
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.scale, 0, 2 * Math.PI)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.fill()
      }
      ctx.globalAlpha = 1.0
      ctx.shadowBlur = 0

      // Draw pulsing center beacon
      ctx.beginPath()
      const pulseSize = 14 + Math.sin(rotation * 3) * 3
      ctx.arc(cx, cy, pulseSize, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI)
      ctx.fillStyle = '#10b981'
      ctx.shadowColor = '#10b981'
      ctx.shadowBlur = 12
      ctx.fill()
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 flex flex-col justify-between p-8 shadow-2xl">
      {/* 3D Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>EPIDEMIOLOGICAL 3D NEURAL RADAR</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Maharashtra Livestock Surveillance Grid
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Active real-time telemetry syncing 15,000+ livestock tags across Pune, Nashik, Ahmednagar, and Satara.
        </p>
      </div>

      {/* Floating 3D Stat Badges */}
      <div className="relative z-10 grid grid-cols-2 gap-3 pt-6">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Outbreak Detection</span>
          <strong className="text-base font-black text-emerald-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>&lt; 4 Hours</span>
          </strong>
          <span className="text-[9px] text-slate-500 block">vs 7 days conventional</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Ring Vaccination</span>
          <strong className="text-base font-black text-sky-400 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-sky-400" />
            <span>2°C–8°C IoT Safe</span>
          </strong>
          <span className="text-[9px] text-slate-500 block">10km contagion cordon</span>
        </div>
      </div>
    </div>
  )
}
