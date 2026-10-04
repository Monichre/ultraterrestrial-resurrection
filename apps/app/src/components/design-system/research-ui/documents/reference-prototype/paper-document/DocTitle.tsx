import type {CSSProperties} from 'react'
import type {TitleSpec, SecondaryTitleSpec} from '../types/paper-document'

const CANVAS_H = 1350

/**
 * DocTitle — eroded serif display headline. The "eroded" flag applies a
 * turbulence displacement + grain-multiply mask so glyphs look bitten and
 * partially eaten by the paper, matching the references.
 */
export function DocTitle({title, secondary}: {title: TitleSpec; secondary?: SecondaryTitleSpec}) {
  const erodedStyle: CSSProperties = title.eroded
    ? {
        WebkitMaskImage:
          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120"><filter id="e"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.1"/></filter><rect width="100%" height="100%" fill="black"/><rect width="100%" height="100%" filter="url(%23e)"/></svg>\')',
        WebkitMaskSize: 'cover',
        maskImage:
          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120"><filter id="e"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.1"/></filter><rect width="100%" height="100%" fill="black"/><rect width="100%" height="100%" filter="url(%23e)"/></svg>\')',
        maskSize: 'cover',
      }
    : {}

  return (
    <>
      <h1
        className='absolute px-[6.2%]'
        style={{
          top: `${(title.topPx / CANVAS_H) * 100}%`,
          left: title.align === 'left' ? 0 : undefined,
          right: title.align === 'right' ? 0 : undefined,
          textAlign: title.align,
          width: '100%',
          zIndex: 30,
          fontFamily: '"Playfair Display", "IM Fell English", Georgia, serif',
          fontWeight: 700,
          fontSize: `clamp(28px, ${(title.sizePx / 900) * 100}vw, ${title.sizePx}px)`,
          letterSpacing: '0.05em',
          color: 'var(--pd-ink)',
          lineHeight: 1.02,
          ...erodedStyle,
        }}>
        {title.text}
      </h1>

      {secondary && (
        <h2
          className='absolute px-[6.2%]'
          style={{
            bottom: '12%',
            left: 0,
            zIndex: 30,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: `clamp(22px, ${(secondary.sizePx / 900) * 100}vw, ${secondary.sizePx}px)`,
            letterSpacing: '0.06em',
            color: 'var(--pd-ink)',
          }}>
          {secondary.text}
        </h2>
      )}
    </>
  )
}
