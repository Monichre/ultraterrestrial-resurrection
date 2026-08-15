import {
  Anton,
  Just_Another_Hand,
  Special_Elite,
  Caveat,
  JetBrains_Mono,
  Martian_Mono,
  Noto_Sans,
  League_Spartan,
  Space_Grotesk,
  Inter,
  Plus_Jakarta_Sans,
} from 'next/font/google'
import localFont from 'next/font/local'

// Static: this family only ships at 400.
export const FONT_SPECIAL_ELITE = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite',
  display: 'swap',
})

// Static: this family only ships at 400.
export const FONT_ANTON = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

// Variable Google Fonts: omit `weight` to include its available weight axis.
export const FONT_CAVEAT = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

// CSS-compatible replacement for the deleted Lukas Sans files.
export const FONT_LUKAS_SANS = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-lukas-sans',
  display: 'swap',
})

// CSS-compatible replacement for Neue Haas Grotesk.
export const FONT_NEUE_HAAS_GROTESK = Inter({
  subsets: ['latin'],
  variable: '--font-neue-haas',
  display: 'swap',
})

// CSS-compatible replacement for Monument Grotesk Mono.
export const FONT_MONUMENT_GROTESK_MONO = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-monument-mono',
  display: 'swap',
})

// CSS-compatible replacement for Monument Grotesk.
export const FONT_MONUMENT_GROTESK = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-monument',
  display: 'swap',
})

// Static: this family only ships at 400.
export const FONT_JUST_ANOTHER_HAND = Just_Another_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-just-another-hand',
  display: 'swap',
})

export const FONT_JET_BRAINS_MONO = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const FONT_MARTIAN_MONO = Martian_Mono({
  subsets: ['latin'],
  variable: '--font-martian-mono',
  display: 'swap',
})

export const FONT_NOTO_SANS = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})

export const FONT_SPACE_GROTESK = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const FONT_LEAGUE_SPARTAN = League_Spartan({
  subsets: ['latin'],
  variable: '--font-league-spartan',
  display: 'swap',
})

// These are truly limited to the files present locally.
export const FONT_PP_NEUE_MONTREAL = localFont({
  src: [
    {
      path: '../../public/fonts/PPNeueMontreal-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PPNeueMontreal-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-pp-neue-montreal',
  display: 'swap',
})
