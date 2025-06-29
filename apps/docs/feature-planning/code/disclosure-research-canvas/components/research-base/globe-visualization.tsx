"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Info } from "lucide-react"

// This component will attempt to load Three.js dynamically and provide a fallback
export default function GlobeVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadingState, setLoadingState] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Dynamic import of Three.js
  useEffect(() => {
    let mounted = true
    let animationFrameId: number

    const loadThreeJs = async () => {
      try {
        // Simulate loading Three.js
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Randomly simulate success or error for demonstration
        const success = Math.random() > 0.5

        if (!mounted) return

        if (success) {
          setLoadingState("success")
          // In a real implementation, you would initialize Three.js here
          // initThreeJsGlobe()
        } else {
          throw new Error("Failed to load 3D visualization library")
        }
      } catch (error) {
        if (!mounted) return
        console.error("Error loading Three.js:", error)
        setErrorMessage(error instanceof Error ? error.message : "Unknown error")
        setLoadingState("error")

        // Initialize fallback 2D canvas visualization
        initFallbackCanvas()
      }
    }

    const initFallbackCanvas = () => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      // Draw grid lines
      const drawGrid = () => {
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw world map outline (simplified)
        ctx.strokeStyle = "rgba(100, 100, 100, 0.5)"
        ctx.lineWidth = 1

        // Draw grid
        const gridSize = 20
        ctx.beginPath()
        for (let x = 0; x <= canvas.width; x += gridSize) {
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
        }
        ctx.stroke()

        // Draw simplified continents
        ctx.beginPath()
        ctx.strokeStyle = "rgba(150, 150, 150, 0.8)"
        ctx.lineWidth = 2

        // North America (very simplified)
        ctx.moveTo(canvas.width * 0.2, canvas.height * 0.3)
        ctx.lineTo(canvas.width * 0.3, canvas.height * 0.2)
        ctx.lineTo(canvas.width * 0.4, canvas.height * 0.3)
        ctx.lineTo(canvas.width * 0.3, canvas.height * 0.5)
        ctx.closePath()

        // Europe/Asia (very simplified)
        ctx.moveTo(canvas.width * 0.5, canvas.height * 0.3)
        ctx.lineTo(canvas.width * 0.8, canvas.height * 0.2)
        ctx.lineTo(canvas.width * 0.8, canvas.height * 0.5)
        ctx.lineTo(canvas.width * 0.6, canvas.height * 0.6)
        ctx.closePath()

        ctx.stroke()

        // Draw sighting locations
        const sightings = [
          { x: canvas.width * 0.25, y: canvas.height * 0.35, alert: true },
          { x: canvas.width * 0.65, y: canvas.height * 0.3, alert: false },
          { x: canvas.width * 0.5, y: canvas.height * 0.5, alert: true },
          { x: canvas.width * 0.75, y: canvas.height * 0.4, alert: false },
        ]

        sightings.forEach((sighting) => {
          // Draw pulse effect for main location
          ctx.beginPath()
          ctx.fillStyle = sighting.alert ? "rgba(255, 100, 100, 0.7)" : "rgba(100, 200, 255, 0.7)"
          ctx.arc(sighting.x, sighting.y, 5, 0, Math.PI * 2)
          ctx.fill()

          // Draw outer ring
          ctx.beginPath()
          ctx.strokeStyle = sighting.alert ? "rgba(255, 100, 100, 0.3)" : "rgba(100, 200, 255, 0.3)"
          ctx.lineWidth = 2
          ctx.arc(sighting.x, sighting.y, 10 + Math.sin(Date.now() * 0.003) * 5, 0, Math.PI * 2)
          ctx.stroke()
        })

        // Scanline effect
        const scanLineY = (Date.now() * 0.1) % canvas.height
        ctx.beginPath()
        ctx.strokeStyle = "rgba(100, 255, 200, 0.1)"
        ctx.lineWidth = 2
        ctx.moveTo(0, scanLineY)
        ctx.lineTo(canvas.width, scanLineY)
        ctx.stroke()

        animationFrameId = requestAnimationFrame(drawGrid)
      }

      drawGrid()
    }

    loadThreeJs()

    return () => {
      mounted = false
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-neutral-800 bg-black/40">
      {loadingState === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.98, 1, 0.98],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="flex flex-col items-center"
          >
            <div className="h-16 w-16 rounded-full border-2 border-t-transparent border-neutral-500 animate-spin mb-4" />
            <span className="font-mono text-sm text-neutral-400">Loading Global Sighting Data...</span>
          </motion.div>
        </div>
      )}

      {loadingState === "error" && (
        <div className="absolute top-4 left-4 right-4 bg-red-900/20 border border-red-900/50 rounded-md p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-mono text-sm font-medium text-red-400">3D Visualization Error</h3>
            <p className="text-xs text-neutral-400 mt-1">
              {errorMessage || "Failed to load 3D visualization. Falling back to 2D canvas."}
            </p>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className={`w-full h-full ${loadingState === "success" ? "hidden" : ""}`} />

      {loadingState === "error" && (
        <div className="absolute bottom-4 right-4 bg-neutral-900/80 border border-neutral-800 rounded-md p-2 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>2D Fallback Visualization Active</span>
          </div>
        </div>
      )}
    </div>
  )
}
