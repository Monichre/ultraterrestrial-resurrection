'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ArrowUpFromLine, Cpu, Network, ShieldAlert } from 'lucide-react'
import * as THREE from 'three'
import './cognitive-routing-framework.css'

export interface CognitiveRoutingFrameworkProps {
  className?: string
  style?: CSSProperties
}

function formatUtcClock(date: Date): string {
  const timeStr = date.toISOString().split('T')[1].split('.')[0]
  return `SYS.SYNC // ${timeStr}Z`
}

export function CognitiveRoutingFramework({
  className,
  style,
}: CognitiveRoutingFrameworkProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const webglRef = useRef<HTMLDivElement>(null)
  const [liveTime, setLiveTime] = useState('SYS.ACTIVE')

  // Three.js icosahedron / globe — sized to container, full dispose on unmount
  useEffect(() => {
    const container = webglRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      1000,
    )
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(3, 2)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      emissive: 0x000000,
      roughness: 0.3,
      metalness: 0.7,
      flatShading: true,
      transparent: true,
      opacity: 0.9,
    })
    const globe = new THREE.Mesh(geometry, material)

    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x8b3a2a,
      transparent: true,
      opacity: 0.25,
      linewidth: 1,
    })
    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    globe.add(wireframe)
    scene.add(globe)

    const ambientLight = new THREE.AmbientLight(0xc8c4bc, 0.4)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0x8b3a2a, 3)
    dirLight1.position.set(5, 3, 4)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xc8c4bc, 1)
    dirLight2.position.set(-5, -4, -2)
    scene.add(dirLight2)

    const clock = new THREE.Clock()
    let frameId = 0
    let isActive = true

    const resizeToContainer = () => {
      if (!container) return
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const animate = () => {
      if (!isActive) return
      frameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      globe.rotation.y = elapsedTime * 0.1
      globe.rotation.x = Math.sin(elapsedTime * 0.05) * 0.2
      globe.position.y = Math.sin(elapsedTime * 0.5) * 0.1

      renderer.render(scene, camera)
    }

    animate()

    const resizeObserver = new ResizeObserver(() => {
      resizeToContainer()
    })
    resizeObserver.observe(container)
    window.addEventListener('resize', resizeToContainer)

    return () => {
      isActive = false
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', resizeToContainer)

      globe.remove(wireframe)
      scene.remove(globe)
      scene.remove(ambientLight)
      scene.remove(dirLight1)
      scene.remove(dirLight2)

      geometry.dispose()
      material.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      renderer.dispose()

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // GSAP entrance reveals
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.to('.crf-reveal', {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        delay: 0.2,
      })

      gsap.from('.crf-text-up', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'expo.out',
        delay: 0.6,
      })

      gsap.from('.crf-card', {
        y: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.2,
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  // UTC clock
  useEffect(() => {
    const tick = () => {
      setLiveTime(formatUtcClock(new Date()))
    }
    tick()
    const intervalId = window.setInterval(tick, 1000)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const rootClassName = ['crf-root', className].filter(Boolean).join(' ')

  return (
    <div ref={rootRef} className={rootClassName} style={style}>
      <div className='crf-guide crf-guide--left' aria-hidden />
      <div className='crf-guide crf-guide--right' aria-hidden />

      <div className='crf-corner crf-corner--tl' aria-hidden />
      <div className='crf-corner crf-corner--bl' aria-hidden />
      <div className='crf-corner crf-corner--tr' aria-hidden />
      <div className='crf-corner crf-corner--br' aria-hidden />

      <main className='crf-main crf-reveal'>
        <div className='crf-poster-shell'>
          <div className='crf-surface'>
            <div className='crf-grid-bg' aria-hidden />
            <div className='crf-ambient' aria-hidden />

            <header className='crf-header'>
              <div className='crf-header-left'>
                <span className='crf-icon' aria-hidden>
                  <Cpu size={20} strokeWidth={1.25} />
                </span>
                <span className='crf-header-label'>[ OP-CORE // V.4.9 ]</span>
              </div>
              <div className='crf-header-right'>
                <span className='crf-status-dot crf-flicker' aria-hidden />
                <span className='crf-header-clock'>{liveTime}</span>
              </div>
            </header>

            <section className='crf-hero' aria-label='Live signal field'>
              <div ref={webglRef} className='crf-webgl' aria-hidden />

              <div className='crf-target crf-target--tl' aria-hidden />
              <div className='crf-target crf-target--tr' aria-hidden />
              <div className='crf-target crf-target--bl' aria-hidden />
              <div className='crf-target crf-target--br' aria-hidden />

              <div className='crf-hero-content'>
                <div className='crf-eyebrow crf-text-up'>Primary Execution Environment</div>
                <h1 className='crf-title crf-text-up'>
                  Cognitive <br /> Topology
                </h1>
                <p className='crf-lede crf-text-up'>
                  Continuous mesh optimization mapping global logic vectors in real-time.
                </p>
              </div>
            </section>

            <section className='crf-panels' aria-label='Routing stages'>
              <article className='crf-panel crf-card'>
                <div className='crf-panel-accent' aria-hidden />
                <div className='crf-panel-head'>
                  <h3 className='crf-panel-title'>Ingestion</h3>
                  <span className='crf-panel-index'>01</span>
                </div>
                <p className='crf-panel-body'>
                  Parsing continuous heuristic streams from external nodes. Filtering noise
                  algorithms dynamically.
                </p>
                <div className='crf-panel-status'>
                  <ArrowUpFromLine size={14} strokeWidth={1.25} aria-hidden />
                  <span className='crf-panel-status-label'>Actively Syncing</span>
                </div>
              </article>

              <article className='crf-panel crf-card'>
                <div className='crf-panel-accent' aria-hidden />
                <div className='crf-panel-head'>
                  <h3 className='crf-panel-title'>Consensus</h3>
                  <span className='crf-panel-index'>02</span>
                </div>
                <p className='crf-panel-body'>
                  Algorithmic state resolution bypassing conventional latency corridors via local
                  validation.
                </p>
                <div className='crf-panel-status'>
                  <Network size={14} strokeWidth={1.25} aria-hidden />
                  <span className='crf-panel-status-label'>Mesh Established</span>
                </div>
              </article>

              <article className='crf-panel crf-card'>
                <div className='crf-panel-accent' aria-hidden />
                <div className='crf-panel-head'>
                  <h3 className='crf-panel-title'>Heuristics</h3>
                  <span className='crf-panel-index'>03</span>
                </div>
                <p className='crf-panel-body'>
                  Predictive mathematical shielding neutralizing structural anomalies before
                  execution logic fires.
                </p>
                <div className='crf-panel-status'>
                  <ShieldAlert size={14} strokeWidth={1.25} aria-hidden />
                  <span className='crf-panel-status-label'>Threat Zero</span>
                </div>
              </article>
            </section>

            <div className='crf-meta'>
              <div className='crf-meta-awaiting crf-flicker'>AWAITING INSTRUCTION...</div>
              <div className='crf-meta-secure'>SECURE TETHER : TRUE</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
