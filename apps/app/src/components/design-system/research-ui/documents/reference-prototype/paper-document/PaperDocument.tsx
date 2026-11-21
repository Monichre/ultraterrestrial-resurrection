'use client'

import {useEffect, useState} from 'react'
import {PaperTexture} from './PaperTexture'
import {SurveyFrame} from './SurveyFrame'
import {ImagePlate} from './ImagePlate'
import {DocHeader} from './DocHeader'
import {DocTitle} from './DocTitle'
import {TextColumns} from './TextColumns'
import {DocFooter} from './DocFooter'
import {PageAccentMark} from './PageAccentMark'
import {Marginalia} from './Marginalia'
import type {PaperDocumentProps} from '../types/paper-document'
import './paper-document-motion.css'

/**
 * PaperDocument (Paper) — one reusable aged-paper poster / redacted dossier.
 *
 * Fidelity notes:
 *  - 2:3 portrait, cream substrate, offset survey frames, eroded serif title,
 *    simulated-illegible mono micro-text, corner registration marks, single
 *    scarce accent, fire-only warmth, intentional imperfect rotation.
 *  - Static by default. `enableMotion` opts into implied smoke/ember drift,
 *    which is disabled automatically under prefers-reduced-motion.
 *
 * Layer / z map:
 *   texture(0) -> plate(10) -> frames(20) -> type(30) -> accents(40) -> marginalia(50)
 */
export function PaperDocument({variant, enableMotion = false, className = ''}: PaperDocumentProps) {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const on = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const motionOn = enableMotion && !reduceMotion

  return (
    <article
      role='img'
      aria-label={`Archival poster: ${variant.title.text}. Distressed paper document with scorched terrain imagery.`}
      className={`relative mx-auto w-full max-w-[900px] overflow-hidden shadow-2xl ${className}`}
      style={{
        aspectRatio: '2 / 3',
        background: variant.substrate,
        isolation: 'isolate',
        transform: `rotate(${variant.rotationDeg ?? 0}deg)`,
        // component-scoped tokens (keep names distinct from app tokens)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--pd-ink' as any]: '#0f0f0e',
        ['--pd-ink-faded' as any]: 'rgba(18,18,16,0.55)',
        ['--pd-line' as any]:
          variant.tone === 'halftone' ? 'rgba(15,15,14,0.6)' : 'rgba(15,15,14,0.4)',
        ['--pd-accent-red' as any]: '#b7241c',
        ['--pd-accent-yellow' as any]: '#e8b23a',
      }}>
      {/* screen-reader clean title (visible title is intentionally eroded) */}
      <span className='sr-only'>{variant.title.text}</span>

      <PaperTexture tone={variant.tone} />
      <ImagePlate plate={variant.plate} tone={variant.tone} enableMotion={motionOn} />
      <SurveyFrame frames={variant.frames} />

      <DocHeader spec={variant.header} />
      <DocTitle title={variant.title} secondary={variant.secondaryTitle} />
      <TextColumns columns={variant.textColumns} />
      <DocFooter spec={variant.footer} />

      <PageAccentMark accent={variant.accent} />
      {variant.marginalia && <Marginalia />}
    </article>
  )
}
