import '@xyflow/react/dist/style.css'
import './globals.css'

import {
  lukasSans,
  monumentGrotesk,
  monumentGroteskMono,
  neueHaasGrotesk,
} from './fonts'
import {Just_Another_Hand, Martian_Mono, Roboto_Mono} from 'next/font/google'

const justAnotherHand = Just_Another_Hand({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-just-another-hand',
})

const martian_mono = Martian_Mono({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--display-family',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--text-family',
})

import NavigationBar from '@/components/navigation-bar'

import {ThemeProvider} from '@/components/theme-provider'

export const metadata = {
  title: 'Ultraterrestrial',
  description: 'Tracking the State of Disclosure',
  generator: 'v0.dev',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en' suppressHydrationWarning className='dark'>
      <body
        className={`${neueHaasGrotesk.variable} ${monumentGrotesk.variable} ${monumentGroteskMono.variable} ${lukasSans.variable} ${justAnotherHand.variable} ${martian_mono.variable} dark`}
      >
        <ThemeProvider
          attribute='class'
          forcedTheme='dark'
          defaultTheme='dark'
          enableSystem={false}
          // enableSystem
          // disableTransitionOnChange
        >
          <div className="h-screen w-screen top-0 left-0 absolute opacity-30 -z-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

          <NavigationBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
