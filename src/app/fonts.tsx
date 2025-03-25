import localFont from 'next/font/local'
export const lukasSans = localFont( {
  src: './fonts/LukasSans.woff2',
  variable: '--font-lukas-sans',
  display: 'swap'
} )

export const neueHaasGrotesk = localFont( {
  src: './fonts/NeueHaasGrotesk/neuehaas.woff',
  variable: '--font-neue-haas',
  display: 'swap',
  weight: '400',
  style: 'normal'
} )

export const monumentGroteskMono = localFont( {
  src: [
    {
      path: './fonts/MonumentGroteskMono/ABCMonumentGroteskMono-Regular-Trial.woff2',
      weight: '400',
      style: 'normal'
    },

    {
      path: './fonts/MonumentGroteskMono/ABCMonumentGroteskMono-Medium-Trial.woff2',
      weight: '500',
      style: 'normal'
    },

    {
      path: './fonts/MonumentGroteskMono/ABCMonumentGroteskMono-Heavy-Trial.woff2',
      weight: '800',
      style: 'normal'
    },

  ],
  variable: '--font-monument-mono',
  display: 'swap'
} )

// export const monumentGrotesk = localFont( {
//   src: './fonts/Monument-Grotesk/ABCMonument-Grotesk.woff2',
//   variable: '--font-monument',
//   display: 'swap'
// } )

export const monumentGrotesk = localFont( {
  src: [
    {
      path: './fonts/Monument-Grotesk/ABCMonumentGrotesk-Regular-Trial.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: './fonts/Monument-Grotesk/ABCMonumentGrotesk-Medium-Trial.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: './fonts/Monument-Grotesk/ABCMonumentGrotesk-Heavy-Trial.woff2',
      weight: '800',
      style: 'normal'
    }
  ],
  variable: '--font-monument',
  display: 'swap'
} )
