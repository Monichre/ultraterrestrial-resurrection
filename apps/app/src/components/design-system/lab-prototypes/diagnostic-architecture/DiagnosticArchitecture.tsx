'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import gsap from 'gsap'
import {
  FastForward,
  Maximize2,
  Pause,
  Rewind,
  Server,
} from 'lucide-react'
import {
  ACTIVE_NODES,
  DEFAULT_KERNEL_LABEL,
  DEFAULT_PLAYBACK_STEP,
  DEFAULT_STATUS,
  DEFAULT_TITLE,
  DIAGNOSTIC_MODES,
  LOAD_METERS,
  TELEMETRY_STREAM,
  type DiagnosticMode,
} from './fixtures'
import './diagnostic-architecture.css'

const DA_FONT_LINK_ID = 'da-lab-fonts'
const DA_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap'

function useDiagnosticFonts() {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(DA_FONT_LINK_ID)) return
    const linkEl = document.createElement('link')
    linkEl.id = DA_FONT_LINK_ID
    linkEl.rel = 'stylesheet'
    linkEl.href = DA_FONT_HREF
    document.head.appendChild(linkEl)
  }, [])
}

export interface DiagnosticArchitectureProps {
  className?: string
  style?: CSSProperties
  initialMode?: DiagnosticMode
  kernelLabel?: string
  title?: string
  statusLabel?: string
  playbackStep?: string
  onModeChange?: (mode: DiagnosticMode) => void
  onEngage?: () => void
  onIsolate?: () => void
}

function CornerReticles() {
  return (
    <div className='da-reticles' aria-hidden>
      <svg className='da-reticle da-reticle--tl' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='1'>
        <path d='M6 18v-8a2 2 0 012-2h8' />
      </svg>
      <svg className='da-reticle da-reticle--tr' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='1'>
        <path d='M18 18v-8a2 2 0 00-2-2h-8' />
      </svg>
      <svg className='da-reticle da-reticle--bl' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='1'>
        <path d='M6 6v8a2 2 0 002 2h8' />
      </svg>
      <svg className='da-reticle da-reticle--br' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth='1'>
        <path d='M18 6v8a2 2 0 01-2 2h-8' />
      </svg>
    </div>
  )
}

function ExplodedWireframe({ gridPatternId }: { gridPatternId: string }) {
  return (
    <svg
      className='da-svg'
      viewBox='0 0 1000 800'
      preserveAspectRatio='xMidYMid meet'
      aria-hidden
    >
      <defs>
        <pattern id={gridPatternId} width='20' height='20' patternUnits='userSpaceOnUse'>
          <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#27272a' strokeWidth='0.5' />
        </pattern>
      </defs>

      <line
        x1='500'
        y1='100'
        x2='500'
        y2='720'
        stroke='#3f3f46'
        strokeWidth='1'
        strokeDasharray='4 8'
      />

      <g className='da-wireframe-group'>
        <g className='da-exploded-layer' data-layer='base'>
          <ellipse cx='500' cy='650' rx='320' ry='100' fill='none' stroke='#52525b' strokeWidth='1.5' />
          <ellipse
            cx='500'
            cy='650'
            rx='290'
            ry='90'
            fill='none'
            stroke='#3f3f46'
            strokeWidth='1'
            strokeDasharray='2 4'
          />
          <ellipse cx='500' cy='650' rx='150' ry='45' fill='none' stroke='#27272a' strokeWidth='1' />
          <path d='M 180 650 Q 500 750 820 650' fill='none' stroke='#27272a' strokeWidth='1' />
          <path d='M 210 650 Q 500 720 790 650' fill='none' stroke='#27272a' strokeWidth='1' />
          <path d='M 350 650 Q 500 680 650 650' fill='none' stroke='#27272a' strokeWidth='1' />
          <line x1='180' y1='650' x2='820' y2='650' stroke='#3f3f46' strokeWidth='0.5' />
          <line x1='500' y1='550' x2='500' y2='750' stroke='#3f3f46' strokeWidth='0.5' />
        </g>

        <g className='da-struts'>
          <line x1='260' y1='500' x2='180' y2='650' stroke='#3f3f46' strokeWidth='1' />
          <line x1='740' y1='500' x2='820' y2='650' stroke='#3f3f46' strokeWidth='1' />
          <line
            x1='350'
            y1='500'
            x2='290'
            y2='650'
            stroke='#27272a'
            strokeWidth='1'
            strokeDasharray='2 4'
          />
          <line
            x1='650'
            y1='500'
            x2='710'
            y2='650'
            stroke='#27272a'
            strokeWidth='1'
            strokeDasharray='2 4'
          />
        </g>

        <g className='da-exploded-layer' data-layer='housing'>
          <ellipse
            cx='500'
            cy='500'
            rx='240'
            ry='80'
            fill='rgba(0,0,0,0.8)'
            stroke='#71717a'
            strokeWidth='1.5'
          />
          <ellipse
            cx='500'
            cy='500'
            rx='200'
            ry='66'
            fill='none'
            stroke='#52525b'
            strokeWidth='1'
            strokeDasharray='4 4'
          />
          <ellipse cx='500' cy='500' rx='100' ry='33' fill='none' stroke='#3f3f46' strokeWidth='1' />
          <line x1='260' y1='500' x2='740' y2='500' stroke='#3f3f46' strokeWidth='1' />
          <line x1='330' y1='443' x2='670' y2='557' stroke='#3f3f46' strokeWidth='0.5' />
          <line x1='330' y1='557' x2='670' y2='443' stroke='#3f3f46' strokeWidth='0.5' />
        </g>

        <g className='da-struts'>
          <line x1='320' y1='350' x2='260' y2='500' stroke='#52525b' strokeWidth='1' />
          <line x1='680' y1='350' x2='740' y2='500' stroke='#52525b' strokeWidth='1' />
        </g>

        <g className='da-exploded-layer' data-layer='resonance'>
          <ellipse
            cx='500'
            cy='350'
            rx='180'
            ry='60'
            fill='rgba(0,0,0,0.8)'
            stroke='#a1a1aa'
            strokeWidth='1.5'
          />
          <ellipse cx='500' cy='350' rx='150' ry='50' fill='none' stroke='#71717a' strokeWidth='1' />
          <ellipse
            cx='500'
            cy='350'
            rx='120'
            ry='40'
            fill='none'
            stroke='#52525b'
            strokeWidth='1'
            strokeDasharray='2 4'
          />
          <path d='M 320 350 A 180 60 0 0 0 680 350' fill='none' stroke='#52525b' strokeWidth='1' />
          <line x1='320' y1='350' x2='680' y2='350' stroke='#52525b' strokeWidth='1' />
        </g>

        <g className='da-struts'>
          <line x1='380' y1='200' x2='320' y2='350' stroke='#71717a' strokeWidth='1' />
          <line x1='620' y1='200' x2='680' y2='350' stroke='#71717a' strokeWidth='1' />
          <rect
            x='480'
            y='200'
            width='40'
            height='150'
            fill='none'
            stroke='#3f3f46'
            strokeWidth='1'
            strokeDasharray='2 4'
          />
        </g>

        <g className='da-exploded-layer' data-layer='capacitor'>
          <ellipse
            cx='500'
            cy='200'
            rx='120'
            ry='40'
            fill='rgba(0,0,0,0.9)'
            stroke='#e4e4e7'
            strokeWidth='2'
          />
          <ellipse cx='500' cy='200' rx='100' ry='33' fill='none' stroke='#a1a1aa' strokeWidth='1' />
          <circle cx='500' cy='200' r='15' fill='none' stroke='#ffffff' strokeWidth='1' />
          <circle cx='500' cy='200' r='5' fill='#ffffff' />
          <line x1='380' y1='200' x2='620' y2='200' stroke='#71717a' strokeWidth='1' />
          <line x1='500' y1='160' x2='500' y2='240' stroke='#71717a' strokeWidth='1' />
        </g>
      </g>

      <g className='da-annotations'>
        <g className='da-annotation'>
          <path
            className='da-connector-line'
            d='M 440 180 L 300 110 L 180 110'
            fill='none'
            stroke='#a1a1aa'
            strokeWidth='1'
          />
          <circle cx='440' cy='180' r='2' fill='#ffffff' />
          <rect x='180' y='108' width='4' height='4' fill='#a1a1aa' />
          <text x='165' y='105' className='da-anno-title' textAnchor='end'>
            Capacitor Array
          </text>
          <text x='165' y='120' className='da-anno-detail' textAnchor='end'>
            0.004 MS ALLOC
          </text>
        </g>

        <g className='da-annotation'>
          <path
            className='da-connector-line'
            d='M 660 330 L 750 260 L 850 260'
            fill='none'
            stroke='#71717a'
            strokeWidth='1'
          />
          <circle cx='660' cy='330' r='2' fill='#a1a1aa' />
          <rect x='846' y='258' width='4' height='4' fill='#71717a' />
          <text x='865' y='255' className='da-anno-title' textAnchor='start'>
            Resonance Ring
          </text>
          <text x='865' y='270' className='da-anno-detail' textAnchor='start'>
            FREQ: 44.2 THz
          </text>
        </g>

        <g className='da-annotation'>
          <path
            className='da-connector-line'
            d='M 280 480 L 180 430 L 100 430'
            fill='none'
            stroke='#71717a'
            strokeWidth='1'
          />
          <circle cx='280' cy='480' r='2' fill='#a1a1aa' />
          <rect x='100' y='428' width='4' height='4' fill='#71717a' />
          <text x='85' y='425' className='da-anno-title' textAnchor='end'>
            Magnetic Housing
          </text>
          <text x='85' y='440' className='da-anno-detail' textAnchor='end'>
            TEMP: 2.4K // NOMINAL
          </text>
        </g>

        <g className='da-annotation'>
          <path
            className='da-connector-line'
            d='M 760 620 L 820 580 L 900 580'
            fill='none'
            stroke='#52525b'
            strokeWidth='1'
          />
          <circle cx='760' cy='620' r='2' fill='#71717a' />
          <rect x='896' y='578' width='4' height='4' fill='#52525b' />
          <text x='915' y='575' className='da-anno-title da-anno-title--dim' textAnchor='start'>
            Base Manifold
          </text>
          <text x='915' y='590' className='da-anno-detail da-anno-detail--dim' textAnchor='start'>
            STRUCTURAL GROUND
          </text>
        </g>
      </g>
    </svg>
  )
}

export function DiagnosticArchitecture({
  className,
  style,
  initialMode = 'Wireframe',
  kernelLabel = DEFAULT_KERNEL_LABEL,
  title = DEFAULT_TITLE,
  statusLabel = DEFAULT_STATUS,
  playbackStep = DEFAULT_PLAYBACK_STEP,
  onModeChange,
  onEngage,
  onIsolate,
}: DiagnosticArchitectureProps) {
  useDiagnosticFonts()
  const rootRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const gridPatternId = `da-grid-pattern-${reactId.replace(/:/g, '')}`
  const [activeMode, setActiveMode] = useState<DiagnosticMode>(initialMode)

  function handleMode(mode: DiagnosticMode) {
    setActiveMode(mode)
    onModeChange?.(mode)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const layers = root.querySelectorAll<SVGGElement>('.da-exploded-layer')
    const strutParts = root.querySelectorAll<SVGElement>('.da-struts line, .da-struts rect')
    const annotations = root.querySelector<SVGGElement>('.da-annotations')
    const connectorLines = root.querySelectorAll<SVGPathElement>('.da-connector-line')
    const annotationBits = root.querySelectorAll<SVGElement>(
      '.da-annotation text, .da-annotation circle, .da-annotation rect',
    )

    connectorLines.forEach((line) => {
      const length = line.getTotalLength()
      line.style.strokeDasharray = `${length}`
      line.style.strokeDashoffset = `${length}`
    })

    const tl = gsap.timeline()

    tl.fromTo(
      layers,
      { y: 50, scale: 0.95, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 1.5, stagger: 0.15, ease: 'power3.out' },
    )

    tl.fromTo(
      strutParts,
      { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
      { opacity: 1, scaleY: 1, duration: 1, stagger: 0.05, ease: 'power2.out' },
      '-=1',
    )

    if (annotations) {
      tl.to(annotations, { opacity: 1, duration: 0.1 }, '-=0.5')
    }

    tl.to(
      connectorLines,
      { strokeDashoffset: 0, duration: 1.2, stagger: 0.1, ease: 'power2.inOut' },
      '-=0.5',
    )

    tl.fromTo(
      annotationBits,
      {
        opacity: 0,
        x: (_i, el) => (el.getAttribute('text-anchor') === 'start' ? -5 : 5),
      },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.05, ease: 'power2.out' },
      '-=0.8',
    )

    const driftTweens = [
      layers[0]
        ? gsap.to(layers[0], {
            y: -4,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2,
          })
        : null,
      layers[1]
        ? gsap.to(layers[1], {
            y: -2,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2.5,
          })
        : null,
      layers[2]
        ? gsap.to(layers[2], {
            y: 2,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2.2,
          })
        : null,
    ]

    return () => {
      tl.kill()
      driftTweens.forEach((tween) => tween?.kill())
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={['da-root', className].filter(Boolean).join(' ')}
      style={style}
    >
      <div className='da-halftone' aria-hidden />
      <div className='da-grid' aria-hidden />
      <div className='da-vignette' aria-hidden />

      <div className='da-frame' aria-hidden />
      <CornerReticles />

      <header className='da-header'>
        <div className='da-header-brand'>
          <div className='da-kernel'>
            <Server size={16} strokeWidth={1.5} aria-hidden />
            <span className='da-kernel-label'>{kernelLabel}</span>
          </div>
          <h1 className='da-title'>{title}</h1>
        </div>

        <nav className='da-header-nav' aria-label='Diagnostic modes'>
          {DIAGNOSTIC_MODES.map((mode) => (
            <button
              key={mode}
              type='button'
              className='da-nav-item'
              data-active={activeMode === mode}
              onClick={() => handleMode(mode)}
            >
              <span className='da-nav-dot' aria-hidden />
              <span>{mode}</span>
            </button>
          ))}
        </nav>

        <div className='da-header-status'>
          <div className='da-status-bars' aria-hidden>
            <div className='da-status-bar da-status-bar--active' />
            <div className='da-status-bar da-status-bar--idle' />
            <div className='da-status-bar da-status-bar--idle' />
          </div>
          <span className='da-status-label'>{statusLabel}</span>
        </div>
      </header>

      <aside className='da-aside-left' aria-label='Node status'>
        <div className='da-panel'>
          <h2 className='da-panel-title'>Active Nodes</h2>
          <div className='da-node-list'>
            {ACTIVE_NODES.map((node) => (
              <div key={node.label} className='da-node-row' data-idle={node.idle === true}>
                <span className='da-node-label'>{node.label}</span>
                <span className='da-node-value'>{node.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='da-panel'>
          <h2 className='da-panel-title'>Load Dist</h2>
          <div className='da-load-list'>
            {LOAD_METERS.map((meter) => (
              <div key={meter.label} className='da-meter'>
                <div className='da-meter-meta'>
                  <span>{meter.label}</span>
                  <span>{meter.percent}%</span>
                </div>
                <div className='da-meter-track'>
                  <div
                    className='da-meter-fill'
                    data-tone={meter.tone}
                    style={{ width: `${meter.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <aside className='da-aside-right' aria-label='Telemetry'>
        <h2 className='da-panel-title da-panel-title--right'>Telemetry Stream</h2>
        <div className='da-telemetry'>
          {TELEMETRY_STREAM.map((entry) => (
            <div
              key={`${entry.time}-${entry.message}`}
              className='da-telemetry-row'
              data-state={entry.state}
            >
              {entry.time}
              <span className='da-telemetry-msg'>{entry.message}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className='da-main'>
        <div className='da-stage'>
          <ExplodedWireframe gridPatternId={gridPatternId} />
        </div>
      </main>

      <footer className='da-footer'>
        <div className='da-playback'>
          <button type='button' className='da-ctrl' aria-label='Rewind'>
            <Rewind size={18} strokeWidth={1.5} aria-hidden />
          </button>
          <button type='button' className='da-ctrl da-ctrl--active' aria-label='Pause'>
            <Pause size={18} strokeWidth={1.5} aria-hidden />
          </button>
          <button type='button' className='da-ctrl' aria-label='Forward'>
            <FastForward size={18} strokeWidth={1.5} aria-hidden />
          </button>
          <div className='da-playback-meta'>
            <span className='da-playback-label'>PLAYBACK</span>
            <span className='da-playback-step'>{playbackStep}</span>
          </div>
        </div>

        <div className='da-timeline' aria-hidden>
          <div className='da-timeline-labels'>
            <span>0.0s</span>
            <span className='da-tl-active'>1.2s</span>
            <span>2.4s</span>
            <span>3.6s</span>
          </div>
          <div className='da-timeline-track'>
            <div className='da-tl-seg da-tl-seg--flex' />
            <div className='da-tl-seg da-tl-seg--a' />
            <div className='da-tl-seg da-tl-seg--b'>
              <div className='da-tl-playhead' />
            </div>
            <div className='da-tl-seg da-tl-seg--c' />
            <div className='da-tl-seg da-tl-seg--flex' />
          </div>
        </div>

        <div className='da-actions'>
          <div className='da-action'>
            <span className='da-action-label'>Output Node</span>
            <button type='button' className='da-action-btn' onClick={onEngage}>
              <span className='da-action-dot' aria-hidden />
              <span className='da-action-text'>Engage Sys</span>
            </button>
          </div>
          <div className='da-action'>
            <span className='da-action-label'>Render Mode</span>
            <button type='button' className='da-action-btn' onClick={onIsolate}>
              <Maximize2 size={14} strokeWidth={1.5} aria-hidden />
              <span className='da-action-text'>Isolate</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
