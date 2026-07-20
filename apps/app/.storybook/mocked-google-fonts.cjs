const fallbackFontFace = (family) => `
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: local('Arial');
}
`

const fonts = {
  Anton: 'Anton',
  Caveat: 'Caveat',
  'IBM+Plex+Mono': 'IBM Plex Mono',
  Inter: 'Inter',
  'JetBrains+Mono': 'JetBrains Mono',
  'Just+Another+Hand': 'Just Another Hand',
  'League+Spartan': 'League Spartan',
  'Martian+Mono': 'Martian Mono',
  'Noto+Sans': 'Noto Sans',
  'Space+Grotesk': 'Space Grotesk',
  'Special+Elite': 'Special Elite',
}

const weights = {
  Anton: '400',
  Caveat: '400',
  'IBM+Plex+Mono': '400',
  Inter: '300;400;500',
  'JetBrains+Mono': '400;500;700',
  'Just+Another+Hand': '400',
  'League+Spartan': '400;600;700',
  'Martian+Mono': '400;600;700',
  'Noto+Sans': '400;600;700',
  'Space+Grotesk': '400;600;700',
  'Special+Elite': '400',
}

module.exports = Object.fromEntries(
  Object.entries(fonts).flatMap(([urlName, family]) => {
    const css = fallbackFontFace(family)
    const weight = weights[urlName]

    return ['swap', 'block'].map((display) => [
      `https://fonts.googleapis.com/css2?family=${urlName}:wght@${weight}&display=${display}`,
      css,
    ])
  })
)
