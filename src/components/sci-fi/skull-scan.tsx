"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { BrainVisualization } from "./components/brain-visualization"
import { BrainComparison } from "./components/brain-comparison"
import { ChevronRightIcon, DotFilledIcon } from "@radix-ui/react-icons"

export default function SkullScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedTab, setSelectedTab] = useState(0)

  // Draw UI elements
  const drawInterface = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save()

    // Draw grid dots
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

    // Draw interface elements
    drawInterface(ctx, rect.width, rect.height)

    requestAnimationFrame(animate)
  }

  useEffect(() => {
    animate()

    const interval = setInterval(() => {
      setScanProgress((prev) => (prev + 1) % 100)
    }, 50)

    return () => {
      clearInterval(interval)
    }
  }, [animate]) // Removed animate from the dependency array

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl aspect-square">
        {/* Main Display */}
        <Card className="relative w-full h-full bg-black/50 border-cyan-500/20 overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Brain Visualizations */}
          <div className="absolute inset-0">
            <div className="relative w-full h-full">
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  selectedTab === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <BrainVisualization />
              </div>
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  selectedTab === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <BrainComparison />
              </div>
            </div>
          </div>

          {/* Side UI Elements */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between p-4">
            <div className="space-y-4">
              <DotFilledIcon className="w-4 h-4 text-cyan-500" />
              <DotFilledIcon className="w-4 h-4 text-cyan-500/50" />
              <DotFilledIcon className="w-4 h-4 text-cyan-500/30" />
            </div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-0.5 bg-cyan-500/30"
                  style={{
                    opacity: 1 - i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right UI Elements */}
          <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col justify-between p-4">
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index < 2) {
                      setSelectedTab(index)
                    }
                    // Add any additional functionality for the third button here
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 ${
                    index < 2
                      ? selectedTab === index
                        ? "bg-cyan-500 text-black"
                        : "text-cyan-500 hover:bg-cyan-500/20"
                      : "text-cyan-500 hover:bg-cyan-500/20"
                  }`}
                >
                  <ChevronRightIcon
                    className={`w-4 h-4 ${
                      index < 2 ? (selectedTab === index ? "" : `opacity-${100 - index * 30}`) : ""
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Activity className="w-4 h-4 text-cyan-500" />
            </div>
          </div>

          {/* View Labels */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <span
              className={`text-xs font-mono transition-opacity duration-200 ${
                selectedTab === 0 ? "text-cyan-500" : "text-cyan-500/30"
              }`}
            >
              SINGLE VIEW
            </span>
            <span
              className={`text-xs font-mono transition-opacity duration-200 ${
                selectedTab === 1 ? "text-cyan-500" : "text-cyan-500/30"
              }`}
            >
              COMPARISON VIEW
            </span>
          </div>
        </Card>

        {/* Bottom Data Display */}
        <div className="absolute -bottom-8 left-16 right-16 flex justify-between text-cyan-500 text-xs font-mono">
          <div>SCAN_ID: XR-2024-0217</div>
          <div>STATUS: ANALYZING</div>
          <div>MATCH: 98.7%</div>
        </div>
      </div>
    </div>
  )
}

