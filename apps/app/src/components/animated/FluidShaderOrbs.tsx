'use client'

import React, {useRef, useEffect, useCallback} from 'react'
import * as THREE from 'three'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'

interface FluidShaderOrbsProps {
  isVisible: boolean
  onComplete?: () => void
  duration?: number
  containerId?: string
}

// Film grain shader
const FilmGrainShader = {
  uniforms: {
    tDiffuse: {value: null},
    iTime: {value: 0},
    iResolution: {value: new THREE.Vector3()},
    intensity: {value: 0.075},
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform float intensity;
    
    varying vec2 vUv;
    
    // Film grain parameters
    #define SHOW_NOISE 0
    #define SRGB 0
    // 0: Addition, 1: Screen, 2: Overlay, 3: Soft Light, 4: Lighten-Only
    #define BLEND_MODE 0
    #define SPEED 2.0
    // What gray level noise should tend to.
    #define MEAN 0.0
    // Controls the contrast/variance of noise.
    #define VARIANCE 0.5
    
    vec3 channel_mix(vec3 a, vec3 b, vec3 w) {
      return vec3(mix(a.r, b.r, w.r), mix(a.g, b.g, w.g), mix(a.b, b.b, w.b));
    }
    
    float gaussian(float z, float u, float o) {
      return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
    }
    
    vec3 madd(vec3 a, vec3 b, float w) {
      return a + a * b * w;
    }
    
    vec3 screen(vec3 a, vec3 b, float w) {
      return mix(a, vec3(1.0) - (vec3(1.0) - a) * (vec3(1.0) - b), w);
    }
    
    vec3 overlay(vec3 a, vec3 b, float w) {
      return mix(a, channel_mix(
        2.0 * a * b,
        vec3(1.0) - 2.0 * (vec3(1.0) - a) * (vec3(1.0) - b),
        step(vec3(0.5), a)
      ), w);
    }
    
    vec3 soft_light(vec3 a, vec3 b, float w) {
      return mix(a, pow(a, pow(vec3(2.0), 2.0 * (vec3(0.5) - b))), w);
    }
    
    void main() {
      vec2 ps = vec2(1.0) / iResolution.xy;
      vec2 uv = vUv;
      vec4 color = texture2D(tDiffuse, uv);
      
      #if SRGB
      color = pow(color, vec4(2.2));
      #endif
      
      float t = iTime * float(SPEED);
      float seed = dot(uv, vec2(12.9898, 78.233));
      float noise = fract(sin(seed) * 43758.5453 + t);
      noise = gaussian(noise, float(MEAN), float(VARIANCE) * float(VARIANCE));
      
      #if SHOW_NOISE
      color = vec4(noise);
      #else    
      float w = intensity;
      
      vec3 grain = vec3(noise) * (1.0 - color.rgb);
      
      #if BLEND_MODE == 0
      color.rgb += grain * w;
      #elif BLEND_MODE == 1
      color.rgb = screen(color.rgb, grain, w);
      #elif BLEND_MODE == 2
      color.rgb = overlay(color.rgb, grain, w);
      #elif BLEND_MODE == 3
      color.rgb = soft_light(color.rgb, grain, w);
      #elif BLEND_MODE == 4
      color.rgb = max(color.rgb, grain * w);
      #endif
          
      #if SRGB
      color = pow(color, vec4(1.0 / 2.2));
      #endif
      #endif
      
      gl_FragColor = color;
    }
  `,
}

const MAX_TRAIL_LENGTH = 20

export const FluidShaderOrbs: React.FC<FluidShaderOrbsProps> = ({
  isVisible,
  onComplete,
  duration = 3000,
  containerId = 'fluid-orbs',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const composerRef = useRef<EffectComposer | null>(null)
  const fluidMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
  const fluidMeshRef = useRef<THREE.Mesh | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const mousePositionRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5))
  const prevMousePositionsRef = useRef<THREE.Vector2[]>([])
  const lastMouseMoveTimeRef = useRef<number>(0)
  const isMouseMovingRef = useRef<boolean>(false)
  const mouseVelocityRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
  const lastMousePositionRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5))
  const fadeOpacityRef = useRef<number>(1.0)

  const FADE_DELAY = 1000
  const FADE_DURATION = 1500
  const INERTIA_FACTOR = 0.95

  // Initialize previous mouse positions
  useEffect(() => {
    for (let i = 0; i < MAX_TRAIL_LENGTH; i++) {
      prevMousePositionsRef.current.push(new THREE.Vector2(0.5, 0.5))
    }
  }, [])

  const updateMousePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const newMouseX = (clientX - rect.left) / rect.width
    const newMouseY = 1.0 - (clientY - rect.top) / rect.height

    // Calculate velocity
    mouseVelocityRef.current.x = newMouseX - mousePositionRef.current.x
    mouseVelocityRef.current.y = newMouseY - mousePositionRef.current.y

    // Update positions
    mousePositionRef.current.x = newMouseX
    mousePositionRef.current.y = newMouseY
    lastMousePositionRef.current.copy(mousePositionRef.current)

    // Mark as moving
    isMouseMovingRef.current = true
    lastMouseMoveTimeRef.current = Date.now()

    // Fade in if needed
    if (fadeOpacityRef.current < 1.0) {
      fadeOpacityRef.current = Math.min(fadeOpacityRef.current + 0.1, 1.0)
    }

    // Update shader uniforms
    if (fluidMaterialRef.current) {
      fluidMaterialRef.current.uniforms.iMouse.value.copy(mousePositionRef.current)
      fluidMaterialRef.current.uniforms.iOpacity.value = fadeOpacityRef.current
    }
  }, [])

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      updateMousePosition(event.clientX, event.clientY)
    },
    [updateMousePosition]
  )

  const onTouchStart = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length > 0) {
        event.preventDefault()
        const touch = event.touches[0]
        updateMousePosition(touch.clientX, touch.clientY)
      }
    },
    [updateMousePosition]
  )

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length > 0) {
        event.preventDefault()
        const touch = event.touches[0]
        updateMousePosition(touch.clientX, touch.clientY)
      }
    },
    [updateMousePosition]
  )

  const updateTrailPositions = useCallback(() => {
    // Apply inertia if not moving
    if (!isMouseMovingRef.current) {
      mouseVelocityRef.current.multiplyScalar(INERTIA_FACTOR)

      if (mouseVelocityRef.current.length() > 0.0001) {
        mousePositionRef.current.x += mouseVelocityRef.current.x
        mousePositionRef.current.y += mouseVelocityRef.current.y

        // Keep within bounds
        mousePositionRef.current.x = Math.max(0, Math.min(1, mousePositionRef.current.x))
        mousePositionRef.current.y = Math.max(0, Math.min(1, mousePositionRef.current.y))

        if (fluidMaterialRef.current) {
          fluidMaterialRef.current.uniforms.iMouse.value.copy(mousePositionRef.current)
        }
      }
    }

    // Update trail positions
    prevMousePositionsRef.current.pop()
    prevMousePositionsRef.current.unshift(mousePositionRef.current.clone())

    // Update shader uniforms
    if (fluidMaterialRef.current) {
      for (let i = 0; i < MAX_TRAIL_LENGTH; i++) {
        fluidMaterialRef.current.uniforms.iPrevMouse.value[i].copy(prevMousePositionsRef.current[i])
      }
    }
  }, [])

  const updateFadeEffect = useCallback(() => {
    const currentTime = Date.now()
    const timeSinceLastMove = currentTime - lastMouseMoveTimeRef.current

    if (timeSinceLastMove > FADE_DELAY) {
      const fadeProgress = Math.min(1, (timeSinceLastMove - FADE_DELAY) / FADE_DURATION)
      fadeOpacityRef.current = 1.0 - fadeProgress

      if (fluidMaterialRef.current) {
        fluidMaterialRef.current.uniforms.iOpacity.value = Math.max(0, fadeOpacityRef.current)
      }
    }

    if (mouseVelocityRef.current.length() < 0.0001) {
      isMouseMovingRef.current = false
    }
  }, [])

  const animate = useCallback(() => {
    if (!isVisible) return

    updateTrailPositions()
    updateFadeEffect()

    // Update time
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000
    if (fluidMaterialRef.current) {
      fluidMaterialRef.current.uniforms.iTime.value = elapsedTime
    }

    // Render
    if (composerRef.current) {
      composerRef.current.render()
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [isVisible, updateTrailPositions, updateFadeEffect])

  const onWindowResize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current || !composerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    if (cameraRef.current) {
      cameraRef.current.left = -1
      cameraRef.current.right = 1
      cameraRef.current.top = 1
      cameraRef.current.bottom = -1
      cameraRef.current.updateProjectionMatrix()
    }

    rendererRef.current.setSize(width, height)
    composerRef.current.setSize(width, height)

    if (fluidMaterialRef.current) {
      fluidMaterialRef.current.uniforms.iResolution.value.set(width, height, 1)
    }
  }, [])

  // Initialize Three.js scene
  useEffect(() => {
    if (!isVisible || !containerRef.current) return

    const container = containerRef.current
    startTimeRef.current = Date.now()

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    })
    renderer.setClearColor(0x000000, 1)
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create scene and camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    cameraRef.current = camera

    // Create fluid material
    const fluidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: {value: 0},
        iResolution: {
          value: new THREE.Vector3(container.clientWidth, container.clientHeight, 1),
        },
        iMouse: {value: new THREE.Vector2(0.5, 0.5)},
        iPrevMouse: {
          value: Array(MAX_TRAIL_LENGTH)
            .fill(null)
            .map(() => new THREE.Vector2(0.5, 0.5)),
        },
        iOpacity: {value: 1.0},
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec3 iResolution;
        uniform vec2 iMouse;
        uniform vec2 iPrevMouse[${MAX_TRAIL_LENGTH}];
        uniform float iOpacity;
        
        varying vec2 vUv;
        
        #define EPS .001
        
        #define TM iTime * 1.75
        #define FT 0.0025
        #define CI vec3(1)
        
        float hash(in float n) { return fract(sin(n)*43758.5453123); }
        
        float hash(vec2 p)
        {
            return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123);
        }
        
        float noise(vec2 p)
        {
            vec2 i = floor(p), f = fract(p); 
            f *= f*f*(3.-2.*f);
            return mix(mix(hash(i + vec2(0.,0.)), 
                           hash(i + vec2(1.,0.)), f.x),
                       mix(hash(i + vec2(0.,1.)), 
                           hash(i + vec2(1.,1.)), f.x), f.y);
        }
        
        float fbm(in vec2 p)
        {
            return  .5000 * noise(p)
                   +.2500 * noise(p * 2.)
                   +.1250 * noise(p * 4.)
                   +.0625 * noise(p * 8.);
        }
        
        float metaball(vec2 p, float r)
        {
            return vec2(noise(vec2(FT,1)/r)).x / dot(p, p);
        }
        
        vec3 blob(vec2 p, vec2 mousePos, float intensity)
        {
            vec2 distToMouse = p - mousePos;
            float r = metaball(distToMouse, 0.5);
            r = max(r, 0.2);
            r *= FT * 2.0 * intensity;
            vec3 white_color = vec3(1.0, 1.0, 1.0);
            
            return (r > 0.5)
                ? (vec3(step(0.1, r*r*r)) * CI)
                : (r < 1000.9 ? white_color * r : vec3(0.0));
        }
        
        vec3 texsample(vec2 uv, vec2 mousePos, vec2 prevPositions[${MAX_TRAIL_LENGTH}])
        {
            vec3 c = vec3(0);
            c += blob(uv, mousePos, 1.0);
            
            for (int i = 0; i < ${MAX_TRAIL_LENGTH}; i++) {
                float trailIntensity = 1.0 - float(i) / float(${MAX_TRAIL_LENGTH});
                c += blob(uv, prevPositions[i], trailIntensity * 0.7);
            }
            
            return c;
        }
        
        void main() {
            vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0)
                    * vec2(iResolution.x / iResolution.y, 1.0);
            
            vec2 mousePos = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
            
            vec2 prevPositions[${MAX_TRAIL_LENGTH}];
            for (int i = 0; i < ${MAX_TRAIL_LENGTH}; i++) {
                prevPositions[i] = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
            }
            
            vec3 color = texsample(uv, mousePos, prevPositions);
            gl_FragColor = vec4(color * iOpacity, 1.0);
        }
      `,
      transparent: false,
    })
    fluidMaterialRef.current = fluidMaterial

    // Create mesh
    const geometry = new THREE.PlaneGeometry(2, 2)
    const fluidMesh = new THREE.Mesh(geometry, fluidMaterial)
    scene.add(fluidMesh)
    fluidMeshRef.current = fluidMesh

    // Set up post-processing
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Add bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.0,
      0.7,
      0.2
    )
    composer.addPass(bloomPass)

    // Add film grain effect
    const filmGrainPass = new ShaderPass(FilmGrainShader)
    filmGrainPass.uniforms.iResolution.value.set(container.clientWidth, container.clientHeight, 1)
    composer.addPass(filmGrainPass)

    composerRef.current = composer

    // Event listeners
    window.addEventListener('resize', onWindowResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchstart', onTouchStart, {passive: false})
    window.addEventListener('touchmove', onTouchMove, {passive: false})

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }

      renderer.dispose()
      geometry.dispose()
      fluidMaterial.dispose()
    }
  }, [isVisible, animate, onWindowResize, onMouseMove, onTouchStart, onTouchMove])

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animate()
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isVisible, animate])

  // Handle completion
  useEffect(() => {
    if (!isVisible && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  return (
    <div
      ref={containerRef}
      id={containerId}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: isVisible ? 'auto' : 'none',
        zIndex: 100,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    />
  )
}

export default FluidShaderOrbs
