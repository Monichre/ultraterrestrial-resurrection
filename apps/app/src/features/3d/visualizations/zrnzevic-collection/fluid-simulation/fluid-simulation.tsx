'use client'

import {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {vertexShader} from './shaders/vertexShader'
import {fragmentShader} from './shaders/fragmentShader'

interface FluidSimulationProps {
  width?: number
  height?: number
}

export const FluidSimulation = ({width = 800, height = 600}: FluidSimulationProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef(new THREE.Vector2(0, 0))
  const mouseSpeed = useRef(new THREE.Vector2(0, 0))
  const lastMousePosition = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create a plane that fills the screen
    const geometry = new THREE.PlaneGeometry(2, 2)

    // Create two render targets for ping-pong rendering
    const renderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }

    const renderTargetA = new THREE.WebGLRenderTarget(width, height, renderTargetOptions)
    const renderTargetB = new THREE.WebGLRenderTarget(width, height, renderTargetOptions)

    // Simulation material
    const simulationMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform vec2 uMouseSpeed;
        uniform float uTime;
        
        void main() {
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          
          // Get current state
          vec4 color = texture2D(uTexture, uv);
          
          // Create mouse influence
          float mouseSize = 0.1;
          float mouseDist = length(uv - uMouse);
          float mouseInfluence = exp(-mouseDist / mouseSize);
          
          // Add mouse movement
          vec2 mouseForce = uMouseSpeed * 0.05;
          color.rg += mouseForce * mouseInfluence;
          
          // Fluid dynamics (simplified)
          vec2 offset = vec2(1.0) / uResolution;
          
          // Sample neighboring velocities
          vec2 n = texture2D(uTexture, uv + vec2(0.0, offset.y)).rg;
          vec2 s = texture2D(uTexture, uv - vec2(0.0, offset.y)).rg;
          vec2 e = texture2D(uTexture, uv + vec2(offset.x, 0.0)).rg;
          vec2 w = texture2D(uTexture, uv - vec2(offset.x, 0.0)).rg;
          
          // Simple diffusion
          vec2 newVelocity = color.rg + 0.2 * (n + s + e + w - 4.0 * color.rg);
          
          // Damping
          newVelocity *= 0.995;
          
          // Update dye color
          float colorDiffusion = 0.001;
          float dyeDecay = 0.99;
          
          color.b += colorDiffusion * (
            texture2D(uTexture, uv + vec2(0.0, offset.y)).b +
            texture2D(uTexture, uv - vec2(0.0, offset.y)).b +
            texture2D(uTexture, uv + vec2(offset.x, 0.0)).b +
            texture2D(uTexture, uv - vec2(offset.x, 0.0)).b -
            4.0 * color.b
          );
          
          // Add dye near mouse
          if (mouseInfluence > 0.1) {
            float intensity = 0.5 * mouseInfluence;
            color.b = max(color.b, intensity);
          }
          
          color.b *= dyeDecay;
          
          // Output
          gl_FragColor = vec4(newVelocity, color.b, 1.0);
        }
      `,
      uniforms: {
        uTexture: {value: null},
        uResolution: {value: new THREE.Vector2(width, height)},
        uMouse: {value: mousePosition.current},
        uMouseSpeed: {value: mouseSpeed.current},
        uTime: {value: 0},
      },
    })

    // Display material
    const displayMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: `
        uniform sampler2D uTexture;
        
        varying vec2 vUv;
        
        void main() {
          vec4 data = texture2D(uTexture, vUv);
          
          // Velocity visualization
          vec2 vel = data.rg;
          float speed = length(vel) * 0.2;
          
          // Dye visualization
          float dye = data.b;
          
          // Create color based on velocity and dye
          vec3 color = mix(
            vec3(0.1, 0.1, 0.4), // Dark blue
            vec3(0.1, 0.5, 0.9), // Light blue
            speed
          );
          
          // Add dye color (purple)
          color = mix(color, vec3(0.7, 0.2, 0.9), dye);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        uTexture: {value: null},
      },
    })

    // Create meshes
    const simulationMesh = new THREE.Mesh(geometry, simulationMaterial)
    const displayMesh = new THREE.Mesh(geometry, displayMaterial)
    scene.add(displayMesh)

    // Initialize fluid state
    const initialData = new Float32Array(width * height * 4)
    for (let i = 0; i < initialData.length; i += 4) {
      initialData[i] = 0 // velocity x
      initialData[i + 1] = 0 // velocity y
      initialData[i + 2] = 0 // dye
      initialData[i + 3] = 1 // alpha
    }

    const initialTexture = new THREE.DataTexture(
      initialData,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType
    )
    initialTexture.needsUpdate = true

    renderer.setRenderTarget(renderTargetA)
    renderer.render(
      new THREE.Scene().add(
        new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: initialTexture}))
      ),
      camera
    )
    renderer.setRenderTarget(null)

    // Animation loop
    const clock = new THREE.Clock()
    let currentRenderTarget = renderTargetA
    let previousRenderTarget = renderTargetB

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Swap render targets
      const temp = currentRenderTarget
      currentRenderTarget = previousRenderTarget
      previousRenderTarget = temp

      // Update simulation
      simulationMaterial.uniforms.uTexture.value = previousRenderTarget.texture
      simulationMaterial.uniforms.uTime.value = elapsedTime

      // Update mouse speed
      mouseSpeed.current.subVectors(mousePosition.current, lastMousePosition.current)
      lastMousePosition.current.copy(mousePosition.current)
      simulationMaterial.uniforms.uMouseSpeed.value = mouseSpeed.current

      // Render simulation step
      renderer.setRenderTarget(currentRenderTarget)
      renderer.render(new THREE.Scene().add(simulationMesh), camera)

      // Display result
      displayMaterial.uniforms.uTexture.value = currentRenderTarget.texture

      renderer.setRenderTarget(null)
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

      simulationMaterial.uniforms.uMouse.value = mousePosition.current
    }

    containerRef.current.addEventListener('mousemove', handleMouseMove)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight

      simulationMaterial.uniforms.uResolution.value.set(newWidth, newHeight)

      renderer.setSize(newWidth, newHeight)

      // Resize render targets
      renderTargetA.setSize(newWidth, newHeight)
      renderTargetB.setSize(newWidth, newHeight)
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
      simulationMaterial.dispose()
      displayMaterial.dispose()
      renderTargetA.dispose()
      renderTargetB.dispose()
    }
  }, [width, height])

  return <div ref={containerRef} style={{width: '100%', height: '100%'}} />
}

export default FluidSimulation
