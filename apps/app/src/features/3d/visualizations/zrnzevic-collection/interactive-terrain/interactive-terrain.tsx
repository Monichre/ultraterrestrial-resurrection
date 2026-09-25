'use client'

import {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {vertexShader} from './shaders/vertexShader'
import {fragmentShader} from './shaders/fragmentShader'

interface InteractiveTerrainProps {
  width?: number
  height?: number
}

export const InteractiveTerrain = ({width = 800, height = 600}: InteractiveTerrainProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef(new THREE.Vector2(0.5, 0.5))

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050505)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 1.5, 3)

    const renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI / 2.1
    controls.minDistance = 1
    controls.maxDistance = 10

    // Create terrain geometry
    const terrain = new THREE.PlaneGeometry(10, 10, 150, 150)
    terrain.rotateX(-Math.PI / 2)

    // Create material with custom shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: {value: 0},
        uMouse: {value: mousePosition.current},
        uElevation: {value: 1.0},
        uElevationValley: {value: 0.2},
        uColorTerrain: {value: new THREE.Color('#1a2980')},
        uColorValley: {value: new THREE.Color('#00FEEF')},
      },
      side: THREE.DoubleSide,
      wireframe: false,
    })

    // Create mesh
    const terrainMesh = new THREE.Mesh(terrain, material)
    scene.add(terrainMesh)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 2, 3)
    scene.add(directionalLight)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update uniforms
      material.uniforms.uTime.value = elapsedTime

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    animate()

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      mousePosition.current.x = (event.clientX - rect.left) / rect.width
      mousePosition.current.y = 1.0 - (event.clientY - rect.top) / rect.height

      material.uniforms.uMouse.value = mousePosition.current
    }

    containerRef.current.addEventListener('mousemove', handleMouseMove)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()

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

      controls.dispose()
      terrain.dispose()
      material.dispose()
    }
  }, [width, height])

  return <div ref={containerRef} style={{width: '100%', height: '100%'}} />
}

export default InteractiveTerrain
