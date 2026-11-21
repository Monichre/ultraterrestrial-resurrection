'use client'

import {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {vertexShader} from './shaders/vertexShader'
import {fragmentShader} from './shaders/fragmentShader'

interface RayMarchingProps {
  width?: number
  height?: number
}

export const RayMarching = ({width = 800, height = 600}: RayMarchingProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create a plane that fills the screen for ray marching
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Create material with ray marching shader
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: {value: 0},
        uResolution: {value: new THREE.Vector2(width, height)},
        uMouse: {value: mousePosition.current},
        uCameraPosition: {value: new THREE.Vector3(0, 0, 5)},
        uCameraLookAt: {value: new THREE.Vector3(0, 0, 0)},
      },
    })

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update uniforms
      material.uniforms.uTime.value = elapsedTime

      // Slowly orbit camera around the scene
      const cameraRadius = 5
      const cameraX = Math.sin(elapsedTime * 0.2) * cameraRadius
      const cameraZ = Math.cos(elapsedTime * 0.2) * cameraRadius
      material.uniforms.uCameraPosition.value.set(cameraX, 2, cameraZ)

      // Render
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    animate()

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      mousePosition.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mousePosition.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      material.uniforms.uMouse.value = mousePosition.current
    }

    containerRef.current.addEventListener('mousemove', handleMouseMove)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight

      material.uniforms.uResolution.value.set(newWidth, newHeight)

      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
      window.removeEventListener('resize', handleResize)

      geometry.dispose()
      material.dispose()
    }
  }, [width, height])

  return <div ref={containerRef} style={{width: '100%', height: '100%'}} />
}

export default RayMarching
