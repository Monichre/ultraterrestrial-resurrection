import type {EmblemKind} from '../types/paper-document'

/**
 * Emblem — variant-driven focal graphic sitting on the image plate.
 *  - seal:      embossed circular coin / occult glyph  (image 1)
 *  - halo:      glowing white ring/disc                (image 4)
 *  - crosshair: concentric-circle survey crosshair     (image 5)
 * Rendered with pure CSS so it survives without external assets.
 */
export function Emblem({kind, size = 220}: {kind: EmblemKind; size?: number}) {
  switch (kind) {
    case 'none':
      return null

    case 'seal':
      return (
        <div
          aria-hidden='true'
          className='relative'
          style={{
            width: size,
            height: size,
            borderRadius: '9999px',
            background:
              'radial-gradient(circle at 42% 38%, rgba(255,255,255,0.35), rgba(120,118,110,0.15) 55%, rgba(40,40,38,0.25) 100%)',
            boxShadow:
              'inset 0 2px 3px rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25)',
            mixBlendMode: 'multiply',
          }}>
          <div
            className='absolute inset-[10%] rounded-full'
            style={{border: '2px solid rgba(0,0,0,0.30)'}}
          />
          <div
            className='absolute inset-[26%] rounded-full'
            style={{border: '1px solid rgba(0,0,0,0.22)'}}
          />
          <div
            className='absolute inset-[34%]'
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.4), transparent 60%)',
              filter: 'blur(0.4px)',
            }}
          />
        </div>
      )

    case 'halo':
      return (
        <div
          aria-hidden='true'
          style={{
            width: size,
            height: size,
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 30%, transparent 62%)',
            boxShadow: '0 0 60px 20px rgba(255,255,255,0.45)',
            mixBlendMode: 'screen',
            border: '2px solid rgba(255,255,255,0.8)',
          }}
        />
      )

    case 'crosshair':
      return (
        <div
          aria-hidden='true'
          className='relative'
          style={{width: size, height: size, mixBlendMode: 'multiply'}}>
          {[100, 74, 48].map((pct) => (
            <div
              key={pct}
              className='absolute rounded-full'
              style={{
                inset: `${(100 - pct) / 2}%`,
                border: '1px solid rgba(0,0,0,0.45)',
              }}
            />
          ))}
          <div
            className='absolute left-1/2 top-0 h-full'
            style={{width: 1, background: 'rgba(0,0,0,0.4)', transform: 'translateX(-0.5px)'}}
          />
          <div
            className='absolute top-1/2 left-0 w-full'
            style={{height: 1, background: 'rgba(0,0,0,0.4)', transform: 'translateY(-0.5px)'}}
          />
        </div>
      )

    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}
