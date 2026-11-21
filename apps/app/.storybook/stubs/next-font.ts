type FontOptions = {
  variable?: string
}

const normalizeFontName = (name: string) => name.toLowerCase().replace(/_/g, '-')

const createFont = (name: string) => (options: FontOptions = {}) => {
  const normalizedName = normalizeFontName(name)
  const variableName = options.variable?.replace('--font-', '') ?? normalizedName

  return {
    className: `font-${normalizedName}`,
    variable: `font-variable-${variableName}`,
    style: {
      fontFamily: `var(--font-${variableName})`,
    },
  }
}

const localFont = createFont('local-font')

export default localFont

export const Anton = createFont('anton')
export const Caveat = createFont('caveat')
export const IBM_Plex_Mono = createFont('ibm-plex-mono')
export const Inter = createFont('inter')
export const JetBrains_Mono = createFont('jetbrains-mono')
export const Just_Another_Hand = createFont('just-another-hand')
export const League_Spartan = createFont('league-spartan')
export const Martian_Mono = createFont('martian-mono')
export const Noto_Sans = createFont('noto-sans')
export const Space_Grotesk = createFont('space-grotesk')
export const Special_Elite = createFont('special-elite')
