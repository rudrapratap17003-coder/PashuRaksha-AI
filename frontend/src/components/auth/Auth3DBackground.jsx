import React, { useEffect, useRef } from 'react'

export default function Auth3DBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // 3D Particles on a rotating sphere + outer starfield
    const numParticles = 140
    const radius = Math.min(width, height) * 0.42
    const particles = []

    for (let i = 0; i < numParticles; i++) {
      const theta = Math.acos(2 * Math.random() - 1)
      const phi = 2 * Math.PI * Math.random()
      const isOuter = i % 5 === 0
      const r = isOuter ? radius * (1.1 + Math.random() * 0.4) : radius * (0.6 + Math.random() * 0.4)

      particles.push({
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(theta),
        size: Math.random() * 2.2 + 1.2,
        color: i % 4 === 0 ? '#38bdf8' : i % 3 === 0 ? '#6366f1' : i % 5 === 0 ? '#a855f7' : '#10b981',
        speed: Math.random() * 0.002 + 0.003
      })
    }

    let mouseX = 0
    let mouseY = 0
    let targetAngleX = 0.002
    let targetAngleY = 0.004
    let currentAngleX = 0.002
    let currentAngleY = 0.004
    let rotation = 0

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - width / 2) / width
      mouseY = (e.clientY - height / 2) / height
      targetAngleX = mouseY * 0.008
      targetAngleY = mouseX * 0.008
    }

    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      rotation += 0.008

      // Smooth mouse easing
      currentAngleX += (targetAngleX - currentAngleX) * 0.05
      currentAngleY += (targetAngleY - currentAngleY) * 0.05

      const cx = width / 2
      const cy = height / 2

      // Draw subtle orbital glowing rings
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation * 0.4)
      ctx.beginPath()
      ctx.ellipse(0, 0, radius * 1.25, radius * 0.5, Math.PI / 4, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([8, 12])
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(0, 0, radius * 1.1, radius * 0.4, -Math.PI / 3, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)'
      ctx.lineWidth = 1.2
      ctx.setLineDash([4, 8])
      ctx.stroke()
      ctx.restore()

      // Rotate and Project 3D particles
      const cosX = Math.cos(currentAngleX || 0.002)
      const sinX = Math.sin(currentAngleX || 0.002)
      const cosY = Math.cos(currentAngleY + 0.004)
      const sinY = Math.sin(currentAngleY + 0.004)

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
        const fov = 500
        const scale = fov / (fov + p.z + 100)
        const projX = cx + p.x * scale
        const projY = cy + p.y * scale
        const alpha = Math.max(0.12, (p.z + radius) / (2.2 * radius))

        projected.push({ x: projX, y: projY, z: p.z, scale, alpha, color: p.color, size: p.size })
      }

      // Draw connecting constellation lines
      ctx.beginPath()
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x
          const dy = projected[i].y - projected[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 75 && projected[i].z > -radius * 0.4 && projected[j].z > -radius * 0.4) {
            ctx.moveTo(projected[i].x, projected[i].y)
            ctx.lineTo(projected[j].x, projected[j].y)
          }
        }
      }
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)'
      ctx.lineWidth = 0.75
      ctx.stroke()

      // Draw particles sorted by depth
      projected.sort((a, b) => a.z - b.z)
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.scale), 0, 2 * Math.PI)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10
        ctx.fill()
      }
      ctx.globalAlpha = 1.0
      ctx.shadowBlur = 0

      // Pulsing central beacon
      ctx.beginPath()
      const pulseSize = 22 + Math.sin(rotation * 2.5) * 4
      ctx.arc(cx, cy, pulseSize, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, 7, 0, 2 * Math.PI)
      ctx.fillStyle = '#10b981'
      ctx.shadowColor = '#10b981'
      ctx.shadowBlur = 16
      ctx.fill()
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#090D16]">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  )
}
