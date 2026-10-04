import { PLANET_GLYPHS, type PlanetName } from './icons/planets'

type Props = {
  name: PlanetName
  /** percentages of map area */
  x: number
  y: number
  active?: boolean
  labelSide?: 'right' | 'bottom'
}

export const PlanetMarker = ({ name, x, y, active = false, labelSide = 'right' }: Props) => {
  const Glyph = PLANET_GLYPHS[name]
  return (
    <div
      className="absolute flex items-center gap-3"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform:
          labelSide === 'bottom'
            ? 'translate(-50%, -50%)'
            : 'translate(-12px, -50%)',
        flexDirection: labelSide === 'bottom' ? 'column' : 'row',
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{
          width: 24,
          height: 24,
          background: '#1A1A1A',
          border: '1px solid var(--hud-border-faint)',
        }}
      >
        <Glyph
          width={14}
          height={14}
          stroke={active ? 'var(--hud-marker)' : 'var(--hud-text-muted)'}
          strokeWidth={1.25}
        />
      </span>
      <span
        className="font-medium uppercase tracking-[0.12em]"
        style={{
          fontSize: 14,
          color: active ? 'var(--hud-text-primary)' : 'var(--hud-text-muted)',
          whiteSpace: 'nowrap',
        }}
      >
        {name.toUpperCase()}
      </span>
    </div>
  )
}
