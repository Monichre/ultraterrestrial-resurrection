'use client'

import type {CSSProperties} from 'react'
import {useBrandRevisionsFonts} from '../use-drafting-board-fonts'
import './brand-revisions-board.css'

export interface BrandRevisionsBoardProps {
  className?: string
  style?: CSSProperties
}

export function BrandRevisionsBoard({className, style}: BrandRevisionsBoardProps) {
  useBrandRevisionsFonts()

  return (
    <div className={`brb-root ${className ?? ''}`.trim()} style={style}>
      <svg className='brb-svg-filters' aria-hidden>
        <defs>
          <filter id='ink-bleed' x='-10%' y='-10%' width='120%' height='120%'>
            <feTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='3' result='noise' />
            <feDisplacementMap
              in='SourceGraphic'
              in2='noise'
              scale='3'
              xChannelSelector='R'
              yChannelSelector='G'
            />
          </filter>
        </defs>
      </svg>

      <div className='brb-workspace'>
        <div className='brb-revision-stamp'>REVISIONS REQUESTED</div>

        <div className='brb-sticky-note brb-sticky-note--top-right'>
          &ldquo;Kingdom&rdquo; needs to feel more monumental. Scale up?
          <br />
          <br />- Client Feedback
        </div>

        <div className='brb-sticky-note brb-sticky-note--bottom-left'>
          Baseline is too wobbly. Re-align to grid or start over.
        </div>

        <div className='brb-red-pen' aria-hidden />
        <div className='brb-eraser' aria-hidden />

        <div className='brb-sketch-composition'>
          <svg className='brb-drafting-layer' viewBox='0 0 800 500' aria-hidden>
            <defs>
              <marker id='red-arrow' markerWidth='6' markerHeight='6' refX='5' refY='3' orient='auto'>
                <polygon points='0 0, 6 3, 0 6' fill='#D32F2F' />
              </marker>
            </defs>
            <line x1='50' y1='180' x2='750' y2='180' className='brb-draft-line' />
            <line x1='50' y1='260' x2='750' y2='260' className='brb-draft-line' />
            <circle
              cx='400'
              cy='245'
              r='160'
              className='brb-red-markup'
              style={{strokeDasharray: '10 5'}}
            />
            <path d='M 220 220 L 320 320 M 320 220 L 220 320' className='brb-red-markup' strokeWidth='4' />
            <path d='M 120 250 Q 400 380 680 250' className='brb-red-markup' style={{opacity: 0.6}} />
            <path d='M 150 150 L 170 170' className='brb-red-markup' />
            <path d='M 600 150 L 580 185' className='brb-red-markup' markerEnd='url(#red-arrow)' />
            <path d='M 200 350 L 230 310' className='brb-red-markup' markerEnd='url(#red-arrow)' />
          </svg>

          <div className='brb-text-layer'>
            <div className='brb-brief-text brb-strikethrough' style={{color: '#D32F2F'}}>
              Stewarding
            </div>
            <div className='brb-marker-text'>
              <div className='brb-strike-through' />
              <span>Kingdom</span> <span>Voices</span>
            </div>
            <div className='brb-brief-text' style={{opacity: 0.4}}>
              With Strategy, Creativity, &amp; Impact.
            </div>
          </div>

          <div className='brb-annotation brb-note-hand brb-red-note brb-annotation--no-casual'>
            NO! TOO CASUAL
          </div>
          <div className='brb-annotation brb-note-hand brb-red-note brb-annotation--fix-align'>
            FIX ALIGNMENT
          </div>
          <div className='brb-annotation brb-note-hand brb-red-note brb-annotation--kern'>
            Kern this area! Gap is huge.
          </div>

          <div className='brb-annotation brb-note-hand brb-annotation--ascender'>
            Check ascender height
          </div>
          <div className='brb-annotation brb-annotation--kerning'>CHECK KERNING</div>

          <div className='brb-annotation brb-annotation--draft-status'>
            DRAFT: <span className='brb-strikethrough'>04</span>{' '}
            <span className='brb-revision-highlight'>05 REV</span>
            <br />
            STATUS: REJECTED
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandRevisionsBoard
