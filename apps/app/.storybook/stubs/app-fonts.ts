type FontStub = {
  className: string
  variable: string
  style: {
    fontFamily: string
  }
}

const createFontStub = (className: string, variable: string, fontFamily: string): FontStub => ({
  className,
  variable,
  style: {
    fontFamily,
  },
})

export const FONT_SPECIAL_ELITE = createFontStub(
  'font-special-elite',
  'font-variable-special-elite',
  "'Special Elite', 'Courier New', monospace"
)

export const FONT_ANTON = createFontStub(
  'font-anton',
  'font-variable-anton',
  "'Anton', Impact, sans-serif"
)

export const FONT_CAVEAT = createFontStub(
  'font-caveat',
  'font-variable-caveat',
  "'Caveat', cursive"
)

export const FONT_LUKAS_SANS = createFontStub(
  'font-lukas-sans',
  'font-variable-lukas-sans',
  "'Lukas Sans', Arial, sans-serif"
)

export const FONT_NEUE_HAAS_GROTESK = createFontStub(
  'font-neue-haas-grotesk',
  'font-variable-neue-haas',
  "'Neue Haas Grotesk', 'Helvetica Neue', Arial, sans-serif"
)

export const FONT_JUST_ANOTHER_HAND = createFontStub(
  'font-just-another-hand',
  'font-variable-just-another-hand',
  "'Just Another Hand', 'Caveat', cursive"
)

export const FONT_MONUMENT_GROTESK_MONO = createFontStub(
  'font-monument-grotesk-mono',
  'font-variable-monument-mono',
  "'Monument Grotesk Mono', 'JetBrains Mono', monospace"
)

export const FONT_MONUMENT_GROTESK = createFontStub(
  'font-monument-grotesk',
  'font-variable-monument',
  "'Monument Grotesk', 'Helvetica Neue', Arial, sans-serif"
)

export const FONT_JET_BRAINS_MONO = createFontStub(
  'font-jetbrains-mono',
  'font-variable-jetbrains-mono',
  "'JetBrains Mono', monospace"
)

export const FONT_MARTIAN_MONO = createFontStub(
  'font-martian-mono',
  'font-variable-martian-mono',
  "'Martian Mono', monospace"
)

export const FONT_NOTO_SANS = createFontStub(
  'font-noto-sans',
  'font-variable-noto-sans',
  "'Noto Sans', Arial, sans-serif"
)

export const FONT_SPACE_GROTESK = createFontStub(
  'font-space-grotesk',
  'font-variable-space-grotesk',
  "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"
)

export const FONT_LEAGUE_SPARTAN = createFontStub(
  'font-league-spartan',
  'font-variable-league-spartan',
  "'League Spartan', 'Helvetica Neue', Arial, sans-serif"
)
