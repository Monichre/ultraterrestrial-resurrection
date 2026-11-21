"use client"

import { useEffect, useRef } from "react"

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const drawInterface = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.save()
      ctx.fillStyle = "rgba(0, 255, 0.2)"
      for (let x = 20 * 2; x < width - 20 * 2; x += 20) {
        for (let y = 20 * 2; y < height - 20 * 2; y += 20) {
          if (Math.random() > 0.7) {
            ctx.beginPath()
            ctx.arc(x, y, 1, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      drawInterface(ctx, rect.width, rect.height)

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

