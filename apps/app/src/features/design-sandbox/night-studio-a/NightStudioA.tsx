import React, { useEffect, useState } from 'react'
import { scopeCss } from '../utils/scope-css'

/* ============================================================
   Night Studio (A) — "Stewarding Kingdom Voices"
   Source: ~/Downloads/react-app.js (interactive variant with
   Re-Draft animation). BrowserRouter/Routes stripped — the file
   only defines a single screen and react-router-dom is not a
   dependency of this app.

   CSS is preserved verbatim below and scoped to `.nsa` at
   injection time (see utils/scope-css.ts) so `body, html`, `*`
   and `:root` selectors do not bleed into the Storybook canvas.
   The style tag is removed on unmount.
   ============================================================ */

const STUDIO_CSS = `
:root {
    --paper-bg: #121212;
    --paper-texture: #1A1A1A;
    --ink-black: #FFB347;
    --graphite: #5A5A55;
    --graphite-light: rgba(90, 90, 85, 0.4);
    --accent-orange: #FF6B00;
    --shadow-soft: 0 15px 40px rgba(0,0,0,0.6);
    --shadow-hard: 5px 8px 15px rgba(0,0,0,0.8);
    --lamp-glare: radial-gradient(circle at 70% 20%, rgba(255, 179, 71, 0.05) 0%, transparent 60%);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body, html {
    width: 100%;
    height: 100vh;
    background-color: var(--paper-bg);
    background-image:
        var(--lamp-glare),
        repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 10px);
    overflow: hidden;
    font-family: 'Space Mono', monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

#root {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.app-root {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--paper-bg);
    background-image:
        var(--lamp-glare),
        repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 10px);
    overflow: hidden;
    font-family: 'Space Mono', monospace;
}

.svg-filters {
    position: absolute;
    width: 0;
    height: 0;
}

.workspace {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sketch-composition {
    position: relative;
    width: 800px;
    height: 500px;
    z-index: 10;
}

.drafting-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.draft-line {
    stroke: var(--graphite-light);
    stroke-width: 1px;
    fill: none;
}

.draft-line-dash {
    stroke: var(--graphite-light);
    stroke-width: 1px;
    stroke-dasharray: 4 4;
    fill: none;
}

.draft-accent {
    stroke: var(--accent-orange);
    stroke-width: 1.5px;
    fill: none;
}

.text-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

.brief-text {
    font-family: 'Reenie Beanie', cursive;
    color: var(--graphite);
    font-size: 24px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: -10px;
    transform: rotate(-1deg);
}

.brief-text.bottom {
    margin-top: 10px;
    font-size: 20px;
    transform: rotate(0.5deg);
}

.marker-text {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 110px;
    line-height: 0.9;
    color: var(--ink-black);
    text-align: center;
    filter: url(#ink-glow);
    transform: rotate(-2deg);
    position: relative;
    text-shadow: 0 0 15px rgba(255, 179, 71, 0.3);
}

.marker-word {
    display: inline-block;
}

.annotation {
    position: absolute;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--graphite);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    white-space: nowrap;
}

.note-hand {
    font-family: 'Nanum Pen Script', cursive;
    font-size: 18px;
    color: var(--graphite);
    text-transform: none;
    letter-spacing: 1px;
}

.note-1 { top: 20%; left: 5%; transform: rotate(-5deg); }
.note-2 { top: 15%; right: 10%; transform: rotate(3deg); }
.note-3 { bottom: 25%; left: 15%; transform: rotate(-2deg); }
.note-4 { bottom: 18%; right: 15%; transform: rotate(4deg); color: var(--accent-orange); }

.physical-tools {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 20;
}

.mech-pencil {
    position: absolute;
    top: -50px;
    left: 10vw;
    width: 12px;
    height: 400px;
    background: linear-gradient(to right, #2a2a2a 0%, #444 30%, #1a1a1a 100%);
    border-radius: 6px;
    transform: rotate(25deg);
    box-shadow: 40px 40px 60px rgba(0,0,0,0.8), inset -2px 0 5px rgba(0,0,0,0.5);
    z-index: 21;
}
.mech-pencil::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 60px;
    background: linear-gradient(to right, #333, #555, #222);
    clip-path: polygon(0 0, 100% 0, 80% 80%, 55% 100%, 45% 100%, 20% 80%);
}

.black-pencil {
    position: absolute;
    bottom: -100px;
    left: -50px;
    width: 450px;
    height: 14px;
    background: linear-gradient(to bottom, #050505 0%, #111 50%, #050505 100%);
    transform: rotate(-35deg);
    box-shadow: 20px -20px 40px rgba(0,0,0,0.9);
    z-index: 22;
}
.black-pencil::after {
    content: '';
    position: absolute;
    right: -40px;
    top: 0;
    width: 40px;
    height: 100%;
    background: #4a3b2a;
    clip-path: polygon(0 0, 0 100%, 100% 50%);
}

.fineliner {
    position: absolute;
    top: 30vh;
    right: -100px;
    width: 350px;
    height: 12px;
    background: #080808;
    border-radius: 6px;
    transform: rotate(-15deg);
    box-shadow: -30px 30px 50px rgba(0,0,0,0.9), inset 0 2px 5px rgba(255,255,255,0.05);
    z-index: 23;
}

.eraser {
    position: absolute;
    top: 15vh;
    right: 15vw;
    width: 45px;
    height: 35px;
    background: #2a2a2a;
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    transform: rotate(15deg);
    box-shadow:
        inset 1px 1px 3px rgba(255,255,255,0.1),
        inset -3px -3px 8px rgba(0,0,0,0.4),
        25px 30px 40px rgba(0,0,0,0.7);
    z-index: 24;
    filter: brightness(0.7) contrast(1.2);
}

.debris {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
}

.shaving {
    position: absolute;
    background: #222;
    border-radius: 50%;
    opacity: 0.5;
}

/* ============ Interaction layer ============ */
.marker-text {
    cursor: pointer;
    transition: text-shadow 0.35s ease;
}
.marker-text:hover {
    text-shadow: 0 0 30px rgba(255, 179, 71, 0.55);
}

.annotation {
    transition: color 0.25s ease;
}
.annotation:hover {
    color: var(--accent-orange);
}

.redraw-btn {
    position: absolute;
    bottom: 26px;
    left: 28px;
    z-index: 50;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--graphite);
    background: transparent;
    border: 1px solid var(--graphite-light);
    padding: 9px 16px;
    cursor: pointer;
    transition: color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}
.redraw-btn:hover {
    color: var(--accent-orange);
    border-color: var(--accent-orange);
    box-shadow: 0 0 14px rgba(255, 107, 0, 0.25);
}
.redraw-btn.is-busy {
    opacity: 0.45;
    cursor: progress;
    box-shadow: none;
}

.rev-note {
    position: absolute;
    bottom: 34px;
    left: 142px;
    z-index: 50;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent-orange);
    opacity: 0.75;
    pointer-events: none;
}

@keyframes draft-in {
    0%   { opacity: 0; filter: blur(10px); }
    55%  { opacity: 1; filter: blur(1.5px); }
    100% { opacity: 1; filter: blur(0); }
}
.sketch-composition.is-drafting {
    animation: draft-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.is-drafting .drafting-layer {
    animation: layer-in 0.9s ease-out 0.35s both;
}
@keyframes layer-in {
    from { opacity: 0; }
    to   { opacity: 1; }
}

.is-drafting .annotation {
    animation: note-in 0.45s ease-out both;
}
.is-drafting .note-1 { animation-delay: 0.75s; }
.is-drafting .note-2 { animation-delay: 0.85s; }
.is-drafting .note-3 { animation-delay: 0.95s; }
.is-drafting .note-4 { animation-delay: 1.05s; }
@keyframes note-in {
    from { opacity: 0; }
    to   { opacity: 1; }
}

/* ============ Responsive scaling ============ */
@media (max-width: 900px) {
    .sketch-composition { transform: scale(0.85); }
}
@media (max-width: 700px) {
    .sketch-composition { transform: scale(0.65); }
}
@media (max-width: 520px) {
    .sketch-composition { transform: scale(0.48); }
}
`

/* ---------------- SVG Filters (ink glow + arrowhead marker) ---------------- */
const InkFilters = () => (
  <svg className="svg-filters" aria-hidden="true" focusable="false">
    <defs>
      <filter id="ink-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={3} result="noise" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={2}
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feGaussianBlur in="displaced" stdDeviation={0.5} result="blurred" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 0.7  0 0 0 0 0.3  0 0 0 1 0"
          result="amber"
        />
        <feMerge>
          <feMergeNode in="blurred" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <marker id="arrowhead" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
        <polygon points="0 0, 6 3, 0 6" fill="#5A5A55" />
      </marker>
    </defs>
  </svg>
)

/* ---------------- Physical desk tools ---------------- */
const PhysicalTools = () => (
  <div className="physical-tools">
    <div className="mech-pencil" />
    <div className="black-pencil">
      <div
        className="black-pencil-lead"
        style={{
          position: 'absolute',
          right: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '15px',
          height: '4px',
          background: '#000',
          clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
        }}
      />
    </div>
    <div className="fineliner" />
    <div className="eraser" />
  </div>
)

/* ---------------- Eraser debris ---------------- */
const Debris = () => (
  <div className="debris">
    <div
      className="shaving"
      style={{ top: '18vh', right: '18vw', width: '4px', height: '2px', transform: 'rotate(45deg)' }}
    />
    <div
      className="shaving"
      style={{ top: '22vh', right: '14vw', width: '2px', height: '4px', transform: 'rotate(33deg)' }}
    />
  </div>
)

/* ---------------- Technical drafting grid ---------------- */
const DraftingLayer = () => (
  <svg className="drafting-layer" viewBox="0 0 800 500">
    <line x1={100} y1={0} x2={100} y2={500} className="draft-line-dash" />
    <line x1={700} y1={0} x2={700} y2={500} className="draft-line-dash" />
    <line x1={50} y1={180} x2={750} y2={180} className="draft-line" />
    <line x1={50} y1={260} x2={750} y2={260} className="draft-line" />
    <line x1={50} y1={360} x2={750} y2={360} className="draft-line" />
    <path d="M 400 30 L 400 50 M 390 40 L 410 40" stroke="#5A5A55" strokeWidth={1} fill="none" />
    <path d="M 400 450 L 400 470 M 390 460 L 410 460" stroke="#5A5A55" strokeWidth={1} fill="none" />
    <path d="M 100 250 L 120 250 M 110 240 L 110 260" stroke="#FF6B00" strokeWidth={1} fill="none" />
    <path d="M 700 250 L 680 250 M 690 240 L 690 260" stroke="#FF6B00" strokeWidth={1} fill="none" />
    <path
      d="M 160 130 Q 180 180 200 200"
      stroke="#5A5A55"
      strokeWidth={1}
      fill="none"
      markerEnd="url(#arrowhead)"
    />
    <path
      d="M 520 120 Q 500 160 490 200"
      stroke="#5A5A55"
      strokeWidth={1}
      fill="none"
      markerEnd="url(#arrowhead)"
    />
    <path
      d="M 250 280 Q 400 340 550 280"
      stroke="#FF6B00"
      strokeWidth={1}
      strokeDasharray="2 3"
      fill="none"
    />
    <circle cx={400} cy={220} r={140} stroke="rgba(90, 90, 85, 0.4)" strokeWidth={0.5} fill="none" />
  </svg>
)

/* ---------------- Headline text layer ---------------- */
const TextLayer = ({ onRedraw }: { onRedraw: () => void }) => (
  <div className="text-layer">
    <div className="brief-text">Stewarding</div>
    <div className="marker-text" onClick={onRedraw} title="Click to re-ink the headline">
      <span className="marker-word">Kingdom</span>{' '}
      <span className="marker-word">Voices</span>
    </div>
    <div className="brief-text bottom">With Strategy, Creativity, &amp; Impact.</div>
  </div>
)

/* ---------------- Full sketch composition ---------------- */
const SketchComposition = ({
  isDrafting,
  onRedraw,
}: {
  isDrafting: boolean
  onRedraw: () => void
}) => (
  <div className={`sketch-composition${isDrafting ? ' is-drafting' : ''}`}>
    <DraftingLayer />
    <TextLayer onRedraw={onRedraw} />

    <div className="annotation note-1 note-hand">Check ascender height</div>
    <div className="annotation note-2">
      COMPLETE.
      <br />
      <span style={{ fontSize: '8px', opacity: 0.6 }}>(REF: BRAND_NIGHT_V1)</span>
    </div>
    <div className="annotation note-3 note-hand">Respect margin</div>
    <div className="annotation note-4">GLOW BALANCE</div>

    <div className="annotation" style={{ top: '80px', left: '380px' }}>
      CENTER LINE
    </div>
    <div
      className="annotation"
      style={{ bottom: '70px', right: '120px', textAlign: 'right' }}
    >
      DRAFT: 04-NIGHT
      <br />
      SCALE: 1:1
    </div>
  </div>
)

/* ---------------- Studio page ---------------- */
const StudioPage = () => {
  const [draftKey, setDraftKey] = useState(0)
  const [isDrafting, setIsDrafting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsDrafting(false), 1500)
    return () => clearTimeout(timer)
  }, [draftKey])

  const handleRedraw = () => {
    if (isDrafting) return
    setIsDrafting(true)
    setDraftKey((k) => k + 1)
  }

  return (
    <div className="workspace">
      <PhysicalTools />
      <Debris />
      <SketchComposition key={draftKey} isDrafting={isDrafting} onRedraw={handleRedraw} />

      <button
        type="button"
        className={`redraw-btn${isDrafting ? ' is-busy' : ''}`}
        onClick={handleRedraw}
        disabled={isDrafting}
        title="Replay the drafting sequence"
      >
        {isDrafting ? 'Drafting…' : 'Re-Draft'}
      </button>
      <div className="rev-note">REV.{String(draftKey + 4).padStart(2, '0')}</div>
    </div>
  )
}

/* ---------------- Component (router stripped, scoped CSS) ---------------- */
const NightStudioA = () => {
  useEffect(() => {
    const head = document.head

    const fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Nanum+Pen+Script&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Reenie+Beanie&display=swap'
    fontLink.setAttribute('data-night-studio-a', '')

    const styleTag = document.createElement('style')
    styleTag.setAttribute('data-night-studio-a', '')
    styleTag.textContent = scopeCss(STUDIO_CSS, '.nsa')

    head.appendChild(fontLink)
    head.appendChild(styleTag)

    return () => {
      head.removeChild(fontLink)
      head.removeChild(styleTag)
    }
  }, [])

  return (
    <div className="nsa">
      <div className="app-root">
        <InkFilters />
        <StudioPage />
      </div>
    </div>
  )
}

export default NightStudioA
