'use client'

import {useEffect, useRef, type CSSProperties, type RefObject} from 'react'
import {useSymbolonFonts} from '../use-symbolon-fonts'
import {PLANETARY_FRAME, PLANETARY_HOUSES, PLANETARY_META} from './fixtures'
import './planetary-transit.css'

export interface PlanetaryTransitProps {
  className?: string
  style?: CSSProperties
  title?: string
  subtitle?: string
  activeHouse?: string
  /** When false, skip WebGL and use 2D star scatter only. */
  preferWebgl?: boolean
}

function HouseNodes() {
  const radius = 160
  return (
    <>
      {PLANETARY_HOUSES.map((name, i) => {
        const angle = i * 30 * (Math.PI / 180)
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        return (
          <div
            key={name}
            className='pt-house'
            style={{
              left: `calc(50% + ${x}px - 30px)`,
              top: `calc(50% + ${y}px - 20px)`,
            }}>
            <div className='pt-house-dot' />
            <span className='pt-house-label'>{name}</span>
          </div>
        )
      })}
    </>
  )
}

function drawStarScatter(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, PLANETARY_FRAME.width, PLANETARY_FRAME.height)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * PLANETARY_FRAME.width
    const y = Math.random() * PLANETARY_FRAME.height
    const r = Math.random() * 1.5
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.8 + 0.2})`
    ctx.fill()
  }
}

function startWebglStarfield(
  canvas: HTMLCanvasElement,
  animFrameRef: RefObject<number | null>
): boolean {
  const gl =
    canvas.getContext('webgl') ||
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
  if (!gl) return false

  const vertexShaderSrc = `
    attribute vec2 a_position;
    varying vec2 vUv;
    void main() {
      vUv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `
  const fragmentShaderSrc = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float n = random(uv + u_time * 0.0001);
      float stars = step(0.999, n);
      gl_FragColor = vec4(vec3(stars), 1.0);
    }
  `

  const createShader = (type: number, src: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    return shader
  }

  const program = gl.createProgram()
  if (!program) return false
  const vs = createShader(gl.VERTEX_SHADER, vertexShaderSrc)
  const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc)
  if (!vs || !fs) return false
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  )

  const posLoc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  const uTime = gl.getUniformLocation(program, 'u_time')
  const uRes = gl.getUniformLocation(program, 'u_resolution')
  gl.uniform2f(uRes, PLANETARY_FRAME.width, PLANETARY_FRAME.height)

  const animate = (time: number) => {
    gl.uniform1f(uTime, time)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    animFrameRef.current = requestAnimationFrame(animate)
  }
  animFrameRef.current = requestAnimationFrame(animate)
  return true
}

export function PlanetaryTransit({
  className,
  style,
  title = PLANETARY_META.title,
  subtitle = PLANETARY_META.subtitle,
  activeHouse = PLANETARY_META.activeHouse,
  preferWebgl = true,
}: PlanetaryTransitProps) {
  useSymbolonFonts()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const planetRef = useRef<HTMLDivElement>(null)
  const starfieldFrameRef = useRef<number | null>(null)
  const planetFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let usedWebgl = false
    if (preferWebgl) {
      usedWebgl = startWebglStarfield(canvas, starfieldFrameRef)
    }
    if (!usedWebgl) {
      drawStarScatter(canvas)
    }

    const orbitPlanet = (time: number) => {
      if (planetRef.current) {
        const pAngle = time * 0.0005
        const px = Math.cos(pAngle) * 112
        const py = Math.sin(pAngle) * 112
        planetRef.current.style.transform = `translate(${px}px, ${py}px)`
      }
      planetFrameRef.current = requestAnimationFrame(orbitPlanet)
    }
    planetFrameRef.current = requestAnimationFrame(orbitPlanet)

    return () => {
      if (starfieldFrameRef.current != null) {
        cancelAnimationFrame(starfieldFrameRef.current)
      }
      if (planetFrameRef.current != null) {
        cancelAnimationFrame(planetFrameRef.current)
      }
    }
  }, [preferWebgl])

  const rootClass = ['pt-root', className].filter(Boolean).join(' ')

  return (
    <div className='pt-stage' style={style}>
      <div className={rootClass}>
        <canvas
          ref={canvasRef}
          className='pt-canvas'
          width={PLANETARY_FRAME.width}
          height={PLANETARY_FRAME.height}
          aria-hidden
        />

        <div className='pt-zenith' aria-hidden>
          <div className='pt-zenith-line' />
          <div className='pt-zenith-node' />
          <div className='pt-zenith-node pt-zenith-node-active' />
          <div className='pt-zenith-node' />
          <div className='pt-zenith-node' />
        </div>

        <main className='pt-ui'>
          <header className='pt-header'>
            <div className='pt-meta'>
              <span className='pt-meta-label'>ORBITAL</span>
              <span className='pt-meta-val'>{PLANETARY_META.orbitalId}</span>
            </div>
            <div className='pt-meta pt-meta-right'>
              <span className='pt-meta-label'>CONSTELLATION</span>
              <span className='pt-meta-val'>{PLANETARY_META.constellation}</span>
            </div>
          </header>

          <section className='pt-title-block'>
            <h1 className='pt-title'>{title}</h1>
            <p className='pt-subtitle'>{subtitle}</p>
          </section>

          <section className='pt-transit'>
            <div className='pt-wheel'>
              <div className='pt-ring pt-ring-1' />
              <div className='pt-ring pt-ring-2' />
              <div className='pt-ring pt-ring-3' />
              <HouseNodes />
              <div ref={planetRef} className='pt-planet' />
            </div>
          </section>

          <section className='pt-details'>
            <div className='pt-detail-row'>
              <span className='pt-detail-label'>ACTIVE HOUSE</span>
              <span className='pt-detail-val'>{activeHouse}</span>
            </div>
            <div className='pt-detail-row'>
              <span className='pt-detail-label'>DEGREE</span>
              <span className='pt-detail-val'>{PLANETARY_META.degree}</span>
            </div>
            <div className='pt-detail-row'>
              <span className='pt-detail-label'>ASPECT</span>
              <span className='pt-detail-val'>{PLANETARY_META.aspect}</span>
            </div>
          </section>

          <div className='pt-stream'>
            {PLANETARY_META.dataStream.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
