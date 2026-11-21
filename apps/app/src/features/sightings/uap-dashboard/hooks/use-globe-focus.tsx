"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import * as THREE from "three"

export function useGlobeFocus(
  focusedLocation: { lat: number; lon: number } | null,
  controlsRef: React.RefObject<any>,
  camera: THREE.Camera | undefined,
) {
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    // Make sure we have all required objects before proceeding
    if (!focusedLocation || !controlsRef.current || !camera) {
      return
    }

    const { lat, lon } = focusedLocation
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    const x = -(6 * Math.sin(phi) * Math.cos(theta))
    const z = 6 * Math.sin(phi) * Math.sin(theta)
    const y = 6 * Math.cos(phi)

    const targetPosition = new THREE.Vector3(x, y, z)

    // Animate camera movement
    const duration = 1000 // ms
    const startPosition = camera.position.clone()
    let startTime: number | null = null

    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const easeProgress = progress * (2 - progress) // Ease out

      camera.position.lerpVectors(startPosition, targetPosition, easeProgress)
      camera.lookAt(0, 0, 0)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [focusedLocation, camera, controlsRef])
}

