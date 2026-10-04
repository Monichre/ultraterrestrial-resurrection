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
  'Plus+Jakarta+Sans': 'Plus Jakarta Sans',
  'Space+Grotesk': 'Space Grotesk',
  'Special+Elite': 'Special Elite',
}

const weights = {
  Anton: ['400'],
  Caveat: ['400..700'],
  'IBM+Plex+Mono': ['400'],
  Inter: ['100..900'],
  'JetBrains+Mono': ['100..800'],
  'Just+Another+Hand': ['400'],
  'League+Spartan': ['100..900'],
  'Martian+Mono': ['100..800'],
  'Noto+Sans': ['100..900'],
  'Plus+Jakarta+Sans': ['200..800'],
  'Space+Grotesk': ['300..700'],
  'Special+Elite': ['400'],
}

module.exports = Object.fromEntries(
  Object.entries(fonts).flatMap(([urlName, family]) => {
    const css = fallbackFontFace(family)

    return weights[urlName].flatMap((weight) =>
      ['swap', 'block'].map((display) => [
        `https://fonts.googleapis.com/css2?family=${urlName}:wght@${weight}&display=${display}`,
        css,
      ])
    )
  })
)
