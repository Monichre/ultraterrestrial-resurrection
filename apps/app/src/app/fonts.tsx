import localFont from 'next/font/local'
import {Anton, Just_Another_Hand, Special_Elite} from 'next/font/google'
export const FONT_SPECIAL_ELITE = Special_Elite({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-special-elite',
  display: 'swap',
})

export const FONT_ANTON = Anton({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

export const lukasSans = localFont({
  src: './fonts/LukasSans.woff2',
  variable: '--font-lukas-sans',
  display: 'swap',
})

export const neueHaasGrotesk = localFont({
  src: './fonts/NeueHaasGrotesk/neuehaas.woff',
  variable: '--font-neue-haas',
  display: 'swap',
  weight: '400',
  style: 'normal',
})

const justAnotherHand = Just_Another_Hand({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-just-another-hand',
})

export const monumentGroteskMono = localFont({
  src: [
    {
      path: './fonts/MonumentGroteskMono/ABCMonumentGroteskMono-Regular-Trial.woff2',
      weight: '400',
      style: 'normal',
    },

    {
      path: './fonts/MonumentGroteskMono/ABCMonumentGroteskMono-Medium-Trial.woff2',
      weight: '500',
      style: 'normal',
    },

    {
      path: './fonts/MonumentGroteskMono/ABCMonumentGroteskMono-Heavy-Trial.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-monument-mono',
  display: 'swap',
})

// export const monumentGrotesk = localFont( {
//   src: './fonts/Monument-Grotesk/ABCMonument-Grotesk.woff2',
//   variable: '--font-monument',
//   display: 'swap'
// } )

export const monumentGrotesk = localFont({
  src: [
    {
      path: './fonts/Monument-Grotesk/ABCMonumentGrotesk-Regular-Trial.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Monument-Grotesk/ABCMonumentGrotesk-Medium-Trial.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Monument-Grotesk/ABCMonumentGrotesk-Heavy-Trial.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-monument',
  display: 'swap',
})
