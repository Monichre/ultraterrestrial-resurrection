import * as React from 'react'
type GlyphProps = React.SVGProps<SVGSVGElement> & { title?: string }

const base = (props: GlyphProps): React.SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  width: 16,
  height: 16,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': props.title ? undefined : true,
  ...props,
})

export const Sun = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
  </svg>
)

export const Mercury = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <circle cx="12" cy="10" r="4.5" />
    <path d="M7.5 4.5a4.5 4.5 0 0 0 9 0M12 14.5V20M9 18h6" />
  </svg>
)

export const Venus = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <circle cx="12" cy="9.5" r="4.5" />
    <path d="M12 14v7M9 18h6" />
  </svg>
)

export const Earth = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5v17M5.5 6.5c2 2 5 3 6.5 3s4.5-1 6.5-3M5.5 17.5c2-2 5-3 6.5-3s4.5 1 6.5 3" />
  </svg>
)

export const Mars = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <circle cx="10.5" cy="13.5" r="5" />
    <path d="M14.5 9.5L20 4M16 4h4v4" />
  </svg>
)

export const Jupiter = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 9.5h17M3.5 14.5h17M9 4c-1 2.5-1 13.5 0 16M15 4c1 2.5 1 13.5 0 16" />
  </svg>
)

export const Saturn = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <path d="M4 9l8 11 8-11z" />
    <circle cx="12" cy="11" r="3" />
  </svg>
)

export const Uranus = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <circle cx="12" cy="12" r="7.5" />
    <path d="M12 4.5v15M4.5 12h15" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

export const Neptune = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <circle cx="12" cy="12" r="8" />
    <path d="M6 9c1 4 4 7 6 7s5-3 6-7M12 4v3" />
  </svg>
)

export const Rocket = (props: GlyphProps) => (
  <svg {...base(props)}>
    {props.title ? <title>{props.title}</title> : null}
    <path d="M12 2c3 3 4.5 6.5 4.5 10.5V18l-4.5 3-4.5-3v-5.5C7.5 8.5 9 5 12 2z" />
    <circle cx="12" cy="10" r="1.6" />
    <path d="M7.5 14L4 17l2 1.5M16.5 14l3.5 3-2 1.5M10 21l-1 2M14 21l1 2" />
  </svg>
)

export const PLANET_GLYPHS = {
  Sun,
  Mercury,
  Venus,
  Earth,
  Mars,
  Jupiter,
  Saturn,
  Uranus,
  Neptune,
} as const

export type PlanetName = keyof typeof PLANET_GLYPHS
