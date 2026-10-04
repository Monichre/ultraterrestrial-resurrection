"use client"

import { useEffect, useRef, useState } from "react"
import "./graph-paper.css" // Include your CSS styles
import { GraphPaperAnimation } from "./graph-paper-animation"

interface GraphPaperBackgroundProps {
  onReady?: () => void
}

export const GraphPaperBackground = ({ onReady }: GraphPaperBackgroundProps) => {
  const planeCanvasRef = useRef<HTMLCanvasElement>(null)
  const mainCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<GraphPaperAnimation | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!planeCanvasRef.current || !mainCanvasRef.current) return

    // Set canvas dimensions
    const updateCanvasDimensions = () => {
      if (planeCanvasRef.current && mainCanvasRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight

        planeCanvasRef.current.width = width
        planeCanvasRef.current.height = height
        mainCanvasRef.current.width = width
        mainCanvasRef.current.height = height
      }
    }

    updateCanvasDimensions()
    window.addEventListener("resize", updateCanvasDimensions)

    // Get canvas contexts and initialize animation
    const planeCtx = planeCanvasRef.current.getContext("2d")
    const mainCtx = mainCanvasRef.current.getContext("2d")

    if (planeCtx && mainCtx) {
      // Set the contexts in the global context object used by the animation
      const contextObj = {
        plane: planeCtx,
        main: mainCtx,
      }

      // @ts-ignore - Directly set the context for the animation
      window.graphPaperContext = contextObj

      // Initialize animation
      animationRef.current = new GraphPaperAnimation(() => {
        // Animation is initialized and has started rendering
        setIsInitialized(true)
        // Wait a bit to ensure some visible elements are drawn before signaling ready
        setTimeout(() => {
          if (onReady) onReady()
        }, 800) // Delay to allow some animation to be visible
      })
    }

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions)
      if (animationRef.current) {
        animationRef.current.cleanup()
      }
    }
  }, [onReady])

  return (
    <div className="graph-paper-container">
      <canvas ref={planeCanvasRef} id="plane-canvas" className="graph-paper-canvas"></canvas>
      <canvas ref={mainCanvasRef} id="main-canvas" className="graph-paper-canvas"></canvas>
    </div>
  )
}

