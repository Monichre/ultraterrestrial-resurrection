'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import {useSymbolonFonts} from '../use-symbolon-fonts'
import {ENERGY_HUB_COPY, ENERGY_TEMPLATE_CARDS, type EnergyStageState} from './fixtures'
import './energy-input-hub.css'

export interface EnergyInputHubProps {
  className?: string
  style?: CSSProperties
  brandLabel?: string
  initialPrompt?: string
  /** Storybook/tests: jump straight to resolved skeleton doc. */
  initialState?: EnergyStageState
  onSynthesize?: (prompt: string) => void
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  phase: 'scatter' | 'form'
  targetX: number
  targetY: number
}

function createParticle(x: number, y: number): Particle {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10,
    size: Math.random() * 3 + 1,
    color: `rgba(34, 211, 238, ${Math.random() * 0.8 + 0.2})`,
    phase: 'scatter',
    targetX: 0,
    targetY: 0,
  }
}

function updateParticle(particle: Particle) {
  if (particle.phase === 'scatter') {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vx *= 0.92
    particle.vy *= 0.92
    return
  }
  particle.x += (particle.targetX - particle.x) * 0.05
  particle.y += (particle.targetY - particle.y) * 0.05
}

function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle) {
  ctx.fillStyle = particle.color
  ctx.shadowBlur = 4
  ctx.shadowColor = 'rgba(14, 165, 233, 0.5)'
  ctx.beginPath()
  ctx.rect(particle.x, particle.y, particle.size, particle.size)
  ctx.fill()
  ctx.shadowBlur = 0
}

function FloorGrid() {
  const lines = []
  for (let i = 0; i <= 40; i++) {
    const pos = (i / 40) * 100
    lines.push(
      <line
        key={`v-${i}`}
        x1={`${pos}%`}
        y1='0%'
        x2={`${pos}%`}
        y2='100%'
        stroke='rgba(14,165,233,0.2)'
        strokeWidth='1'
      />,
      <line
        key={`h-${i}`}
        x1='0%'
        y1={`${pos}%`}
        x2='100%'
        y2={`${pos}%`}
        stroke='rgba(14,165,233,0.2)'
        strokeWidth='1'
      />
    )
  }
  return (
    <div className='eih-floor' aria-hidden>
      <svg viewBox='0 0 100 100' preserveAspectRatio='none'>
        {lines}
      </svg>
    </div>
  )
}

function CardIcon({icon}: {icon: (typeof ENERGY_TEMPLATE_CARDS)[number]['icon']}) {
  switch (icon) {
    case 'doc':
      return (
        <svg viewBox='0 0 24 24' aria-hidden>
          <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
          <polyline points='14 2 14 8 20 8' />
          <line x1='16' y1='13' x2='8' y2='13' />
          <line x1='16' y1='17' x2='8' y2='17' />
          <polyline points='10 9 9 9 8 9' />
        </svg>
      )
    case 'table':
      return (
        <svg viewBox='0 0 24 24' aria-hidden>
          <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
          <line x1='3' y1='9' x2='21' y2='9' />
          <line x1='9' y1='21' x2='9' y2='9' />
        </svg>
      )
    case 'screen':
      return (
        <svg viewBox='0 0 24 24' aria-hidden>
          <rect x='2' y='3' width='20' height='14' rx='2' ry='2' />
          <line x1='8' y1='21' x2='16' y2='21' />
          <line x1='12' y1='17' x2='12' y2='21' />
        </svg>
      )
    default: {
      const _exhaustive: never = icon
      return _exhaustive
    }
  }
}

export function EnergyInputHub({
  className,
  style,
  brandLabel = ENERGY_HUB_COPY.brand,
  initialPrompt = '',
  initialState = 'idle',
  onSynthesize,
}: EnergyInputHubProps) {
  useSymbolonFonts()

  const [stageState, setStageState] = useState<EnergyStageState>(initialState)
  const [inputValue, setInputValue] = useState(initialPrompt)
  const [charCount, setCharCount] = useState(
    initialPrompt.length > 0 ? `VOL: ${initialPrompt.length} BYTES` : ENERGY_HUB_COPY.awaiting
  )

  const cardsRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameIdRef = useRef<number | null>(null)
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    setStageState(initialState)
  }, [initialState])

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && hubRef.current) {
        canvasRef.current.width = hubRef.current.offsetWidth
        canvasRef.current.height = hubRef.current.offsetHeight
      }
    }
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  useEffect(() => {
    if (stageState !== 'idle') {
      if (cardsRef.current) cardsRef.current.style.transform = ''
      if (hubRef.current) hubRef.current.style.transform = ''
    }
  }, [stageState])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (stageState !== 'idle') return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      if (cardsRef.current) {
        cardsRef.current.style.transform = `translate3d(${x * 20}px, ${y * 20}px, 0) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`
      }
      if (hubRef.current) {
        hubRef.current.style.transform = `translate3d(${-x * 10}px, ${-y * 10}px, 0)`
      }
    }
    const handleMouseLeave = () => {
      if (cardsRef.current) {
        cardsRef.current.style.transform = 'translate3d(0, 0, 0) rotateY(0) rotateX(0)'
      }
      if (hubRef.current) {
        hubRef.current.style.transform = 'translate3d(0, 0, 0)'
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [stageState])

  const cancelAllAnimations = () => {
    if (animationFrameIdRef.current != null) {
      cancelAnimationFrame(animationFrameIdRef.current)
      animationFrameIdRef.current = null
    }
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }

  useEffect(() => () => cancelAllAnimations(), [])

  const animateParticles = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(2, 6, 23, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    particlesRef.current.forEach((particle) => {
      updateParticle(particle)
      drawParticle(ctx, particle)
    })
    animationFrameIdRef.current = requestAnimationFrame(animateParticles)
  }

  const triggerMagic = () => {
    if (inputValue.trim() === '') return
    cancelAllAnimations()
    setStageState('animating')
    onSynthesize?.(inputValue)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    if (hubRef.current) {
      canvas.width = hubRef.current.offsetWidth
      canvas.height = hubRef.current.offsetHeight
    }

    const textRect = {x: 32, y: 56, w: canvas.width - 64, h: 100}
    const particles: Particle[] = []
    for (let i = 0; i < 400; i++) {
      const px = textRect.x + Math.random() * textRect.w
      const py = textRect.y + Math.random() * textRect.h
      particles.push(createParticle(px, py))
    }
    particlesRef.current = particles
    animateParticles()

    const t1 = window.setTimeout(() => {
      particlesRef.current.forEach((particle) => {
        particle.phase = 'form'
        if (Math.random() > 0.7) {
          particle.targetX = 40 + Math.random() * (canvas.width * 0.6 - 80)
          particle.targetY = 40 + Math.random() * 40
        } else {
          particle.targetX = 40 + Math.random() * (canvas.width - 80)
          particle.targetY = 100 + Math.random() * (canvas.height - 140)
        }
      })
    }, 800)

    const t2 = window.setTimeout(() => {
      setStageState('resolved')
      const t3 = window.setTimeout(() => {
        if (animationFrameIdRef.current != null) {
          cancelAnimationFrame(animationFrameIdRef.current)
          animationFrameIdRef.current = null
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }, 1000)
      timeoutsRef.current.push(t3)
    }, 2500)

    timeoutsRef.current.push(t1, t2)
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setInputValue(val)
    setCharCount(val.length > 0 ? `VOL: ${val.length} BYTES` : ENERGY_HUB_COPY.awaiting)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      triggerMagic()
    }
  }

  const rootClass = ['eih-root', className].filter(Boolean).join(' ')

  return (
    <div className={rootClass} style={style}>
      <div className='eih-environment' />
      <FloorGrid />
      <main className='eih-stage' data-state={stageState}>
        <div className='eih-card-cluster' ref={cardsRef}>
          {ENERGY_TEMPLATE_CARDS.map((card) => (
            <div key={card.id} className='eih-template-card'>
              <div className='eih-card-icon'>
                <CardIcon icon={card.icon} />
              </div>
              <div className='eih-card-meta'>{card.meta}</div>
              <div className='eih-card-title'>{card.title}</div>
            </div>
          ))}
        </div>

        <div className='eih-input-hub' ref={hubRef}>
          <div className='eih-glass-panel'>
            <div className='eih-sys-labels'>
              <span className='eih-sys-label'>{brandLabel}</span>
              <span className='eih-sys-label'>{charCount}</span>
            </div>

            <textarea
              className='eih-textarea'
              placeholder={ENERGY_HUB_COPY.placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />

            <div className='eih-controls'>
              <div className='eih-tools'>
                <button type='button' className='eih-tool-btn' aria-label='Attach'>
                  <svg viewBox='0 0 24 24'>
                    <path d='M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48' />
                  </svg>
                </button>
                <button type='button' className='eih-tool-btn' aria-label='Edit'>
                  <svg viewBox='0 0 24 24'>
                    <path d='M12 20h9' />
                    <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
                  </svg>
                </button>
              </div>

              <button type='button' className='eih-generate' onClick={triggerMagic}>
                <div className='eih-btn-core' />
                <div className='eih-btn-cap'>
                  <span className='eih-btn-text'>{ENERGY_HUB_COPY.synthesize}</span>
                </div>
              </button>
            </div>

            <div className='eih-generated-doc'>
              <div className='eih-skel eih-skel-header' />
              <div className='eih-skel eih-skel-body' />
            </div>
          </div>
          <canvas className='eih-particle-canvas' ref={canvasRef} />
        </div>
      </main>
    </div>
  )
}
