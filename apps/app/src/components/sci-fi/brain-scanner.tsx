"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Scan, Target } from "lucide-react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export default function BrainScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(true)
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef<number>(0)

  // Initialize particles
  const initParticles = () => {
    const particles: Particle[] = []
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random(),
      })
    }
    particlesRef.current = particles
  }

  // Draw brain-like shape
  const drawBrain = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.save()
    ctx.strokeStyle = "rgba(0, 255, 0.5)"
    ctx.lineWidth = 0.5

    // Draw main brain shape
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, 60, 80, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Draw brain folds (simplified)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x1 = centerX + Math.cos(angle) * 30
      const y1 = centerY + Math.sin(angle) * 40
      const x2 = centerX + Math.cos(angle) * 60
      const y2 = centerY + Math.sin(angle) * 80

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      const cp1x = x1 + Math.cos(angle + 0.5) * 20
      const cp1y = y1 + Math.sin(angle + 0.5) * 20
      const cp2x = x2 + Math.cos(angle - 0.5) * 20
      const cp2y = y2 + Math.sin(angle - 0.5) * 20
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2)
      ctx.stroke()
    }
    ctx.restore()
  }

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Draw brain
    drawBrain(ctx, centerX, centerY)

    // Update and draw particles
    ctx.beginPath()
    particlesRef.current.forEach((particle, i) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life -= 0.01

      if (particle.life <= 0) {
        particle.life = 1
        particle.x = Math.random() * 300 - 150 + centerX
        particle.y = Math.random() * 300 - 150 + centerY
      }

      const distance = Math.sqrt(Math.pow(particle.x - centerX, 2) + Math.pow(particle.y - centerY, 2))

      if (distance < 100) {
        ctx.moveTo(particle.x, particle.y)
        particlesRef.current.forEach((p2, j) => {
          if (i !== j) {
            const d = Math.sqrt(Math.pow(particle.x - p2.x, 2) + Math.pow(particle.y - p2.y, 2))
            if (d < 50) {
              ctx.lineTo(p2.x, p2.y)
            }
          }
        })
      }
    })

    ctx.strokeStyle = `rgba(0, 255, 255, ${scanning ? 0.2 : 0.1})`
    ctx.stroke()

    frameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    initParticles()
    animate()

    const scanInterval = setInterval(() => {
      setScanning((prev) => !prev)
    }, 2000)

    return () => {
      cancelAnimationFrame(frameRef.current)
      clearInterval(scanInterval)
    }
  }, []) // Removed dependencies to useEffect

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div
        className="relative w-full max-w-2xl aspect-video border border-gray-200 border-cyan-500/20 bg-grid-small-cyan/10 dark:border-gray-800"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0 255 255 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0 255 255 / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px",
        }}
      >
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-500"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-500"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-500"></div>

        {/* Main Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="relative w-96 h-96 bg-transparent border-cyan-500/20 overflow-hidden">
            {/* Targeting Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 border-2 border-cyan-500/50"></div>
                <div className="absolute left-0 top-0 w-4 h-4 border-l-2 border-t-2 border-cyan-500"></div>
                <div className="absolute right-0 top-0 w-4 h-4 border-r-2 border-t-2 border-cyan-500"></div>
                <div className="absolute left-0 bottom-0 w-4 h-4 border-l-2 border-b-2 border-cyan-500"></div>
                <div className="absolute right-0 bottom-0 w-4 h-4 border-r-2 border-b-2 border-cyan-500"></div>
              </div>
            </div>

            {/* Canvas for Brain Visualization */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Scanning Effect */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-scan"
              style={{
                animation: "scan 2s linear infinite",
              }}
            ></div>

            {/* HUD Elements */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-cyan-500">
              <Scan className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-mono">SCAN MODE</span>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-cyan-500">
              <Target className="w-4 h-4" />
              <span className="text-xs font-mono">TRACKING TARGET</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  )
}

