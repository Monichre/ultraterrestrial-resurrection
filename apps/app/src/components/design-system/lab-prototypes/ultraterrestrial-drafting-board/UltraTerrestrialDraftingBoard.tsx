'use client'

import type {CSSProperties} from 'react'
import {useUltraTerrestrialDraftingFonts} from '../use-drafting-board-fonts'
import './ultraterrestrial-drafting-board.css'

export interface UltraTerrestrialDraftingBoardProps {
  className?: string
  style?: CSSProperties
}

export function UltraTerrestrialDraftingBoard({
  className,
  style,
}: UltraTerrestrialDraftingBoardProps) {
  useUltraTerrestrialDraftingFonts()

  return (
    <div className={`utdb-root ${className ?? ''}`.trim()} style={style}>
      <svg className='utdb-drafting-layer' xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' aria-hidden>
        <defs>
          <pattern id='utdb-faint-grid' width='40' height='40' patternUnits='userSpaceOnUse'>
            <path d='M 40 0 L 0 0 0 40' fill='none' className='utdb-line-faint' />
          </pattern>
        </defs>

        <rect width='100%' height='100%' fill='url(#utdb-faint-grid)' />

        <line x1='50%' y1='0' x2='50%' y2='100%' className='utdb-line-light' />
        <line x1='0' y1='50%' x2='100%' y2='50%' className='utdb-line-light' />

        <rect x='5%' y='5%' width='90%' height='90%' className='utdb-line-dashed' />

        <g transform='translate(250, 200)'>
          <polygon points='0,0 80,-40 120,20 40,60' className='utdb-line-dashed' />
          <line x1='0' y1='0' x2='120' y2='20' className='utdb-line-light' />
          <circle cx='0' cy='0' r='3' fill='var(--graphite-med)' />
          <circle cx='80' cy='-40' r='2' fill='none' className='utdb-line-med' />
          <circle cx='120' cy='20' r='4' fill='var(--amber)' />
          <circle cx='40' cy='60' r='2' fill='var(--graphite-dark)' />
          <path d='M 120 20 Q 150 0 160 30' className='utdb-line-amber-dashed' />
        </g>
      </svg>

      <div className='utdb-overlay-circle'>
        <svg width='100%' height='100%' viewBox='-100 -100 200 200' style={{overflow: 'visible'}} aria-hidden>
          <circle cx='0' cy='0' r='60' className='utdb-line-light' />
          <circle cx='0' cy='0' r='80' className='utdb-line-dashed' />
          <line x1='-90' y1='0' x2='90' y2='0' className='utdb-line-light' />
          <line x1='0' y1='-90' x2='0' y2='90' className='utdb-line-light' />
          <circle cx='42' cy='-42' r='3' fill='var(--graphite-dark)' />
          <path d='M 0 0 L 42 -42' className='utdb-line-med' />
          <text x='48' y='-45' fontFamily='Space Mono' fontSize='8' fill='var(--graphite-med)'>
            Δ-0.4
          </text>
        </svg>
      </div>

      <div className='utdb-overlay-reticle'>
        <svg width='100%' height='100%' viewBox='-20 -20 40 40' style={{overflow: 'visible'}} aria-hidden>
          <circle cx='0' cy='0' r='15' className='utdb-line-light' />
          <line x1='-20' y1='0' x2='20' y2='0' className='utdb-line-med' />
          <line x1='0' y1='-20' x2='0' y2='20' className='utdb-line-med' />
        </svg>
      </div>

      <div className='utdb-overlay-curve'>
        <svg width='100%' height='100%' viewBox='0 0 600 200' style={{overflow: 'visible'}} aria-hidden>
          <path d='M 0 100 Q 300 200 600 100' className='utdb-line-dashed' />
        </svg>
      </div>

      <div className='utdb-overlay-ticks'>
        <svg width='100%' height='100%' viewBox='0 0 100 20' preserveAspectRatio='none' aria-hidden>
          <line x1='20' y1='5' x2='20' y2='15' className='utdb-tick-mark' />
          <line x1='30' y1='7' x2='30' y2='13' className='utdb-tick-mark' />
          <line x1='40' y1='2' x2='40' y2='18' className='utdb-tick-mark' />
          <line x1='60' y1='5' x2='60' y2='15' className='utdb-tick-mark' />
          <line x1='70' y1='7' x2='70' y2='13' className='utdb-tick-mark' />
          <line x1='80' y1='2' x2='80' y2='18' className='utdb-tick-mark' />
        </svg>
      </div>

      <div className='utdb-workspace'>
        <div className='utdb-composition-area'>
          <div className='utdb-title-group'>
            <div className='utdb-wordmark'>
              <span>ULTRA</span>
              <span className='utdb-wordmark-sub'>TERRESTRIAL</span>
              <div className='utdb-cal-mark utdb-cal-mark--tl' />
              <div className='utdb-cal-mark utdb-cal-mark--br' />
            </div>
          </div>

          <div className='utdb-annotation utdb-a-scale'>
            SYS.ARCHIVE / V.9
            <br />
            <span className='utdb-bold-tech'>SCALE: 1:1000</span>
          </div>

          <div className='utdb-annotation utdb-t-ambig utdb-amber-text'>[ PRESERVE AMBIGUITY ]</div>

          <div className='utdb-annotation utdb-a-vert'>
            EVIDENCE / INFERENCE / SPECULATION / RESONANCE
          </div>

          <div className='utdb-annotation utdb-t-pressure'>
            NODE COLLAPSE DETECTED
            <br />
            <span className='utdb-amber-text'>every contradiction is a pressure point</span>
            <br />
            REF: DOCTRINE_04
          </div>

          <div className='utdb-annotation utdb-a-orient'>
            <span className='utdb-bold-tech'>ORIENTATION, NOT CLOSURE.</span>
            <br />
            <span className='utdb-muted'>AWAITING FINAL ALIGNMENT</span>
          </div>

          <div className='utdb-anno-handwritten utdb-h-trace'>
            every source is a trace...
            <svg width='40' height='40' className='utdb-trace-arrow' aria-hidden>
              <defs>
                <marker id='utdb-arrow' markerWidth='6' markerHeight='6' refX='5' refY='3' orient='auto'>
                  <polygon points='0,0 6,3 0,6' fill='var(--graphite-dark)' />
                </marker>
              </defs>
              <path
                d='M0,0 Q20,20 40,5'
                fill='none'
                stroke='var(--graphite-dark)'
                strokeWidth='1'
                markerEnd='url(#utdb-arrow)'
              />
            </svg>
          </div>

          <div className='utdb-anno-handwritten utdb-h-motif'>
            every motif is an echo,
            <br />
            not proof.
          </div>

          <div className='utdb-anno-handwritten utdb-h-rigor'>rigor + reverence</div>

          <div className='utdb-correction-block utdb-correction-block--pressure' />
          <div className='utdb-correction-block utdb-correction-block--orient' />
        </div>
      </div>

      <div className='utdb-tools-layer'>
        <div className='utdb-fragment'>
          <svg width='100%' height='100%' aria-hidden>
            <path d='M -10 50 Q 50 20 100 80 T 200 60' className='utdb-line-light' />
            <path d='M -10 70 Q 50 40 100 100 T 200 80' className='utdb-line-faint' />
          </svg>
          <div className='utdb-annotation utdb-fragment-label'>FIG. 1A</div>
        </div>
        <div className='utdb-tape' aria-hidden />

        <div className='utdb-compass-leg'>
          <div className='utdb-compass-hinge' />
          <div className='utdb-compass-point' />
        </div>

        <div className='utdb-redaction-marker'>
          <div className='utdb-redaction-cap' />
          <div className='utdb-marker-label'>STANDARD ISSUE / ARCHIVE</div>
        </div>

        <div className='utdb-ruler'>
          <div className='utdb-ruler-marks' />
        </div>
      </div>
    </div>
  )
}

export default UltraTerrestrialDraftingBoard
