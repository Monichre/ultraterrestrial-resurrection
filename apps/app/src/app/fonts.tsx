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

export const FONT_CAVEAT = Caveat({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

// Local font files deleted — replaced with Google Font fallbacks that preserve CSS variable names
export const FONT_LUKAS_SANS = Space_Grotesk({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-lukas-sans',
  display: 'swap',
})

export const FONT_NEUE_HAAS_GROTESK = Inter({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-neue-haas',
  display: 'swap',
})

export const FONT_MONUMENT_GROTESK_MONO = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-monument-mono',
  display: 'swap',
})

export const FONT_MONUMENT_GROTESK = Plus_Jakarta_Sans({
  weight: ['400', '500', '700', '800'],
  subsets: ['latin'],
  variable: '--font-monument',
  display: 'swap',
})

export const FONT_JUST_ANOTHER_HAND = Just_Another_Hand({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-just-another-hand',
})

export const FONT_JET_BRAINS_MONO = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const FONT_MARTIAN_MONO = Martian_Mono({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-martian-mono',
  display: 'swap',
})

export const FONT_NOTO_SANS = Noto_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
})

export const FONT_SPACE_GROTESK = Space_Grotesk({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const FONT_LEAGUE_SPARTAN = League_Spartan({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-league-spartan',
  display: 'swap',
})

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
