'use client'

import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import './paper-document.css'

const FONT_LINK_ID = 'paper-document-fonts'
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap'

export type PaperDocumentVariant = 'letter' | 'research' | 'memo'

export interface PaperDocumentMeta {
  date?: string
  location?: string
  classification?: string
}

export interface PaperDocumentProps {
  title?: string
  paragraphs?: string[]
  emphasizedPhrases?: { text: string; position: number }[]
  signatureName?: string
  signatureTitle?: string
  signatureImageUrl?: string
  /** Show signature image only when a real URL is provided */
  showSignatureImage?: boolean
  variant?: PaperDocumentVariant
  meta?: PaperDocumentMeta
  /** Skip full-viewport desk chrome when embedding */
  embedded?: boolean
  /** Use light drafting desk instead of dark */
  lightDesk?: boolean
  className?: string
  style?: CSSProperties
}

const DEFAULT_PARAGRAPHS = [
  "Software teams spend nearly half of their time fixing what they've built instead of building what's next.",
  'We spend time battling with observability tools that fundamentally miss the mark — instead of understanding experiences, they overwhelm you with logs. Rather than preventing problems, they simply report exceptions after the fact. And most importantly, when you need clarity, they deliver an avalanche of data.',
  "We've professionalized suffering - building entire industries around the assumption that software must break. We've all felt exhausted and burned out context switching to debug mode, but we've convinced ourselves that fundamental to the process – that this is what it takes to build great products.",
  'But why?!',
  'Interfere is building the self-healing layer of the internet - software that sees users struggle, diagnoses the root cause, and ships its own fix before a human can open logs.',
  'Our long-term vision is for Interfere to become the foundational operating system for user experience, replacing existing legacy observability tools entirely, and enabling software that truly understands itself. Each problem we prevent is a step toward our real goal: the freedom to build without the burden of maintaining.',
  "In an age where execution is abundant, we're building the tools to enable the next generation of software to be durable, delightful with craft & taste built-in from day one.",
]

function isUsableImageUrl(url?: string) {
  if (!url) return false
  if (url.includes('placeholder')) return false
  return true
}

export function PaperDocument({
  title = 'Introducing Interfere',
  paragraphs = DEFAULT_PARAGRAPHS,
  emphasizedPhrases = [
    { text: "We've professionalized suffering", position: 2 },
    { text: 'But why?!', position: 3 },
  ],
  signatureName = 'Luke S.',
  signatureTitle = 'Founder & CEO, Interfere',
  signatureImageUrl,
  showSignatureImage,
  variant = 'letter',
  meta,
  embedded = false,
  lightDesk = false,
  className,
  style,
}: PaperDocumentProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(FONT_LINK_ID)) return
    const linkEl = document.createElement('link')
    linkEl.id = FONT_LINK_ID
    linkEl.rel = 'stylesheet'
    linkEl.href = FONT_HREF
    document.head.appendChild(linkEl)
  }, [])

  const shouldShowImage = showSignatureImage ?? isUsableImageUrl(signatureImageUrl)
  const hasMeta = Boolean(meta?.date || meta?.location || meta?.classification)

  function renderParagraph(text: string, index: number) {
    const emphasized = emphasizedPhrases.find((phrase) => phrase.position === index)

    if (emphasized && text.includes(emphasized.text)) {
      const parts = text.split(emphasized.text)
      return (
        <p key={index} className='pd-p'>
          {parts[0]}
          <strong className='pd-em'>{emphasized.text}</strong>
          {parts[1]}
        </p>
      )
    }

    return (
      <p key={index} className='pd-p'>
        {text}
      </p>
    )
  }

  return (
    <div
      className={[
        'pd-root',
        embedded ? 'pd-root--embedded' : '',
        lightDesk ? 'pd-root--light' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      data-variant={variant}
    >
      <section className='pd-stage'>
        <div className='pd-sheet-back' aria-hidden />
        <div className='pd-sheet-mid' aria-hidden />

        <article className='pd-sheet'>
          <div className='pd-sheet-inner'>
            {hasMeta && (
              <div className='pd-meta'>
                {meta?.date && <span>{meta.date}</span>}
                {meta?.location && <span>{meta.location}</span>}
                {meta?.classification && (
                  <span className='pd-meta-badge'>{meta.classification}</span>
                )}
              </div>
            )}

            <h2
              className={[
                'pd-title',
                variant === 'research' ? 'pd-title--research' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {title}
            </h2>

            <hr className='pd-rule' />

            <div className='pd-body'>
              {paragraphs.map((paragraph, index) => renderParagraph(paragraph, index))}
            </div>

            {(signatureName || signatureTitle) && (
              <footer className='pd-signature'>
                {signatureName && <div className='pd-sig-name'>{signatureName}</div>}
                {signatureTitle && <div className='pd-sig-title'>{signatureTitle}</div>}
                {shouldShowImage && signatureImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className='pd-sig-img'
                    src={signatureImageUrl}
                    alt={`${signatureName ?? 'Author'} signature`}
                  />
                )}
              </footer>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

export default PaperDocument
