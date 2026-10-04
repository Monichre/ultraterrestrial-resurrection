'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, FileText, Link2, Maximize2, Play } from 'lucide-react'
import './monolith-engine.css'

gsap.registerPlugin(ScrollTrigger)

const CONFIG = {
  colors: {
    bg: 0x050505,
    primary: 0xdddddd,
    secondary: 0x555555,
  },
  vortexCount: 9500,
  ambientCount: 300,
} as const

export interface MonolithEngineProps {
  className?: string
  style?: CSSProperties
  /** When false, skip intro loader (useful for Storybook/tests). Default true. */
  showLoader?: boolean
}

function createSpiralLine(turnOffset: number, color: number) {
  const spiralPoints: THREE.Vector3[] = []
  const pointCount = 400
  for (let i = 0; i < pointCount; i++) {
    const t = i / (pointCount - 1)
    const angle = t * Math.PI * 14 + turnOffset
    const radius = 0.2 + t * 2.8
    const y = (0.5 - t) * 6.0
    spiralPoints.push(
      new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
    )
  }
  const spiralGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints)
  const spiralMaterial = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Line(spiralGeometry, spiralMaterial)
}

function triggerGlitch(targets: NodeListOf<Element> | HTMLElement[]) {
  targets.forEach((el) => {
    const node = el as HTMLElement
    if (node.dataset.animating === 'true') return
    node.dataset.animating = 'true'
    gsap.to(node, {
      x: () => (Math.random() - 0.5) * 4,
      y: () => (Math.random() - 0.5) * 2,
      textShadow: '2px 0 rgba(255,255,255,0.4), -2px 0 rgba(100,100,100,0.4)',
      duration: 0.05,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        gsap.set(node, { x: 0, y: 0, textShadow: 'none' })
        window.setTimeout(() => {
          node.dataset.animating = ''
        }, 200)
      },
    })
  })
}

export function MonolithEngine({
  className,
  style,
  showLoader = true,
}: MonolithEngineProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const coordsRef = useRef<HTMLSpanElement>(null)
  const [loaderHidden, setLoaderHidden] = useState(!showLoader)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const stage =
      (root.querySelector('.me-stage') as HTMLElement | null) ?? root

    let disposed = false
    let rafId = 0
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    let halfW = stage.clientWidth / 2
    let halfH = stage.clientHeight / 2

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(CONFIG.colors.bg)
    scene.fog = new THREE.FogExp2(CONFIG.colors.bg, 0.04)

    const camera = new THREE.PerspectiveCamera(
      75,
      Math.max(stage.clientWidth, 1) / Math.max(stage.clientHeight, 1),
      0.1,
      100,
    )
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      alpha: false,
    })
    renderer.setSize(stage.clientWidth, stage.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0

    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    const vortexCount = CONFIG.vortexCount
    const vortexPositions = new Float32Array(vortexCount * 3)
    const vortexRadius = new Float32Array(vortexCount)
    const vortexAngle = new Float32Array(vortexCount)
    const vortexHeight = new Float32Array(vortexCount)
    const vortexSpeed = new Float32Array(vortexCount)

    for (let i = 0; i < vortexCount; i++) {
      const i3 = i * 3
      const y = (Math.random() - 0.5) * 7.5
      const funnel = 0.4 + Math.abs(y) * 0.2
      const r = (0.1 + Math.pow(Math.random(), 1.5) * 2.5) * funnel
      const a = Math.random() * Math.PI * 2

      vortexHeight[i] = y
      vortexRadius[i] = r
      vortexAngle[i] = a
      vortexSpeed[i] = 0.5 + Math.random() * 0.8

      vortexPositions[i3] = Math.cos(a) * r
      vortexPositions[i3 + 1] = y
      vortexPositions[i3 + 2] = Math.sin(a) * r
    }

    const vortexGeometry = new THREE.BufferGeometry()
    vortexGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vortexPositions, 3),
    )
    const vortexMaterial = new THREE.PointsMaterial({
      size: 0.006,
      color: CONFIG.colors.primary,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const vortexPoints = new THREE.Points(vortexGeometry, vortexMaterial)
    mainGroup.add(vortexPoints)

    const spiralLineA = createSpiralLine(0, CONFIG.colors.secondary)
    const spiralLineB = createSpiralLine(Math.PI, CONFIG.colors.primary)
    mainGroup.add(spiralLineA)
    mainGroup.add(spiralLineB)

    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = CONFIG.ambientCount
    const posArray = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3),
    )
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.008,
      color: CONFIG.colors.secondary,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    })
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    const renderScene = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(stage.clientWidth, stage.clientHeight),
      1.0,
      0.4,
      0.85,
    )
    bloomPass.strength = 0.6
    bloomPass.radius = 0.3
    bloomPass.threshold = 0.2

    const composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)

    const clock = new THREE.Clock()

    const resize = () => {
      if (disposed) return
      const w = Math.max(stage.clientWidth, 1)
      const h = Math.max(stage.clientHeight, 1)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
      halfW = w / 2
      halfH = h / 2
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
    })
    resizeObserver.observe(stage)

    const onPointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const localX = event.clientX - rect.left
      const localY = event.clientY - rect.top
      mouseX = localX - halfW
      mouseY = localY - halfH

      if (coordsRef.current) {
        const xVal = (localX / Math.max(rect.width, 1)).toFixed(2)
        const yVal = (localY / Math.max(rect.height, 1)).toFixed(2)
        coordsRef.current.textContent = `${xVal}.${yVal}.00`
      }
    }

    root.addEventListener('pointermove', onPointerMove)

    const animate = () => {
      if (disposed) return
      rafId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()
      targetX = mouseX * 0.001
      targetY = mouseY * 0.0008

      mainGroup.rotation.y += 0.002
      mainGroup.rotation.y += 0.03 * (targetX - mainGroup.rotation.y)
      mainGroup.rotation.x += 0.03 * (targetY - mainGroup.rotation.x)

      const positions = vortexGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < vortexCount; i++) {
        const i3 = i * 3
        const spin = elapsedTime * vortexSpeed[i] * 0.5 + vortexHeight[i] * 0.5
        const angle = vortexAngle[i] + spin
        const pulse = Math.sin(elapsedTime * 1.2 + i * 0.01) * 0.05
        const radius = vortexRadius[i] + pulse

        positions[i3] = Math.cos(angle) * radius
        positions[i3 + 1] = vortexHeight[i] + Math.sin(elapsedTime + i * 0.02) * 0.03
        positions[i3 + 2] = Math.sin(angle) * radius
      }
      vortexGeometry.attributes.position.needsUpdate = true

      spiralLineA.rotation.y = elapsedTime * 0.15
      spiralLineB.rotation.y = -elapsedTime * 0.12
      particlesMesh.rotation.y = elapsedTime * 0.03
      particlesMesh.rotation.x = -mouseY * 0.0001

      composer.render()
    }

    animate()

    const shimmerBar = root.querySelector('.me-shimmer-bar')
    const navItems = root.querySelectorAll('.me-nav-item')
    const maskWords = root.querySelectorAll('.me-mask-word')
    const scrollArea = root.querySelector('.me-scroll-area')
    const glitchTargets = root.querySelectorAll('.me-glitch')

    const ctx = gsap.context(() => {
      if (shimmerBar && showLoader) {
        gsap.to(shimmerBar, {
          x: '100%',
          duration: 1.5,
          repeat: -1,
          ease: 'power1.inOut',
        })
      }

      const tl = gsap.timeline()

      if (showLoader) {
        tl.to('.me-loader', {
          opacity: 0,
          duration: 1.0,
          onComplete: () => {
            if (!disposed) setLoaderHidden(true)
          },
        })
      } else {
        setLoaderHidden(true)
      }

      tl.from(
        mainGroup.scale,
        { x: 0.6, y: 0.6, z: 0.6, duration: 2.0, ease: 'power3.out' },
        showLoader ? '-=0.5' : 0,
      ).to(
        navItems,
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power2.out',
        },
        showLoader ? '-=1.5' : '-=1.5',
      )

      if (scrollArea && maskWords.length) {
        gsap.to(maskWords, {
          scrollTrigger: {
            trigger: scrollArea,
            start: 'top 80%',
            scroller: document.documentElement,
          },
          y: 0,
          duration: 1.4,
          stagger: 0.1,
          ease: 'power4.out',
        })
      }
    }, root)

    let lastX = 0
    let lastY = 0
    let lastTime = 0
    let lastScrollY = window.scrollY
    let lastScrollTime = performance.now()

    const onGlitchPointer = (e: PointerEvent) => {
      const now = Date.now()
      const dt = now - lastTime
      if (dt > 40) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        const speed = Math.sqrt(dx * dx + dy * dy) / dt
        if (speed > 2.0 && glitchTargets.length) {
          triggerGlitch(glitchTargets)
        }
        lastX = e.clientX
        lastY = e.clientY
        lastTime = now
      }
    }

    const onScrollGlitch = () => {
      const now = performance.now()
      const dt = now - lastScrollTime
      if (dt > 40) {
        const dy = Math.abs(window.scrollY - lastScrollY)
        const speed = dy / dt
        if (speed > 1.2 && glitchTargets.length) {
          triggerGlitch(glitchTargets)
        }
        lastScrollY = window.scrollY
        lastScrollTime = now
      }
    }

    root.addEventListener('pointermove', onGlitchPointer)
    window.addEventListener('scroll', onScrollGlitch, { passive: true })

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointermove', onGlitchPointer)
      window.removeEventListener('scroll', onScrollGlitch)

      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && root.contains(st.trigger as Node)) st.kill()
      })
      gsap.killTweensOf(glitchTargets)

      vortexGeometry.dispose()
      vortexMaterial.dispose()
      spiralLineA.geometry.dispose()
      ;(spiralLineA.material as THREE.Material).dispose()
      spiralLineB.geometry.dispose()
      ;(spiralLineB.material as THREE.Material).dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      composer.dispose()
      renderer.dispose()
      scene.clear()
    }
  }, [showLoader])

  const rootClass = className ? `me-root ${className}` : 'me-root'

  return (
    <div ref={rootRef} className={rootClass} style={style}>
      <div
        className='me-loader'
        data-hidden={loaderHidden ? 'true' : 'false'}
        aria-hidden={loaderHidden}
      >
        <div className='me-loader-inner'>
          <div className='me-shimmer-track'>
            <div className='me-shimmer-bar' />
          </div>
          <p className='me-loader-label'>Initializing Matrix</p>
        </div>
      </div>

      <div className='me-stage'>
        <div className='me-canvas-wrap' aria-hidden>
          <canvas ref={canvasRef} className='me-canvas' />
        </div>

        <div className='me-frame' aria-hidden>
          <div className='me-corner me-corner--tl' />
          <div className='me-corner me-corner--tr' />
          <div className='me-corner me-corner--bl' />
          <div className='me-corner me-corner--br' />
        </div>

        <header className='me-header me-nav-item'>
          <button type='button' className='me-brand'>
            <div className='me-brand-mark'>
              <span>M</span>
            </div>
            <span className='me-brand-label me-glitch'>Monolith</span>
          </button>

          <nav className='me-nav' aria-label='Monolith sections'>
            <a href='#structure'>Structure</a>
            <a href='#array'>Array</a>
            <a href='#logic'>Logic</a>
          </nav>

          <button type='button' className='me-link-btn'>
            <span>Link</span>
            <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
          </button>
        </header>

        <footer className='me-footer me-nav-item'>
          <div className='me-footer-col'>
            <span className='me-footer-label'>Vector</span>
            <span ref={coordsRef} className='me-coords'>
              0.00.0.00.00
            </span>
          </div>

          <div className='me-footer-col me-footer-col--center'>
            <span className='me-footer-label me-footer-label--wide'>
              Scroll to sequence
            </span>
            <div className='me-scroll-hint' aria-hidden />
          </div>

          <div className='me-footer-col me-footer-col--end'>
            <a href='#link' className='me-social' aria-label='Link'>
              <Link2 size={18} strokeWidth={1.5} />
            </a>
            <a href='#expand' className='me-social' aria-label='Expand'>
              <Maximize2 size={18} strokeWidth={1.5} />
            </a>
          </div>
        </footer>
      </div>

      <div className='me-overlay'>
        <main className='me-main me-scroll-area'>
          <div className='me-content'>
            <div className='me-status-wrap'>
              <div className='me-status me-mask-word'>
                <span className='me-status-dot' aria-hidden />
                <p>System Core: Nominal</p>
              </div>
            </div>

            <div className='me-headline'>
              <span className='me-word-mask'>
                <span className='me-word me-mask-word me-glitch'>Kinetic</span>
              </span>
              <span className='me-word-mask'>
                <span className='me-word me-mask-word me-glitch'>Monolith</span>
              </span>
              <span className='me-word-mask'>
                <span className='me-word me-word--muted me-mask-word me-glitch'>
                  Engine.
                </span>
              </span>
            </div>

            <div className='me-desc-wrap'>
              <p className='me-desc me-mask-word'>
                A continuous kinetic particle system driven by monochromatic
                depth and precise motion analysis.
              </p>
            </div>

            <div className='me-cta-wrap'>
              <div className='me-cta-row me-mask-word'>
                <button type='button' className='me-btn-primary'>
                  <div className='me-btn-primary-fill' aria-hidden />
                  <div className='me-btn-primary-inner'>
                    <span>Execute</span>
                    <Play size={16} strokeWidth={1.5} aria-hidden />
                  </div>
                </button>

                <button type='button' className='me-btn-ghost'>
                  <div className='me-btn-ghost-inner'>
                    <span>Data Logs</span>
                    <FileText size={16} strokeWidth={1.5} aria-hidden />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
