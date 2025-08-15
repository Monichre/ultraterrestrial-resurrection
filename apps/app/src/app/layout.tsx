// import "@/styles/flowith/flowith.css";
// import "@/styles/flowith/reactflow.css";

import {ThemeProvider} from '@/contexts/theme-provider'
import {ClerkProvider} from '@clerk/nextjs'
import {FullSiteNav} from '@/components/navbar/full-site-nav'
import {
  FONT_LUKAS_SANS,
  FONT_MONUMENT_GROTESK,
  FONT_MONUMENT_GROTESK_MONO,
  FONT_NEUE_HAAS_GROTESK,
  FONT_JUST_ANOTHER_HAND,
  FONT_JET_BRAINS_MONO,
  FONT_MARTIAN_MONO,
  FONT_NOTO_SANS,
  FONT_CAVEAT,
  FONT_SPECIAL_ELITE,
  FONT_ANTON,
  FONT_SPACE_GROTESK,
  FONT_LEAGUE_SPARTAN,
} from './fonts'
import {CustomCursor} from '@/components/cursor-ui/CustomCursor'
import BrowserEchoScript from '@browser-echo/next/BrowserEchoScript'

import '@xyflow/react/dist/style.css'
import './globals.css'
import './research-ui.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  // metadataBase: new URL(defaultUrl),
  title: 'Ultraterrestrial',
  description:
    'Tracking the state of Disclosure. A visually rich and collaborative effort that strives to document, explore and synthesize the past, present and future of the UFO phenomenon, not only in its own regard but particularly as it concerns the origins of humanity, the fundamental nature of reality and the relationship between the two.', // and the space between?
  // We must first understand what it is before we can understand what it means.  What tradeoffs known or unbeknownst to us may exist in attempting to answer the two questions in parallel? Is there really any other option?
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning className='dark'>
        <head>
          <head>
            {process.env.NODE_ENV === 'development' && (
              <BrowserEchoScript
                route='/api/client-logs'
                include={['warn', 'error']}
                preserveConsole={true}
                tag='[NextJS Browser]'
                stackMode='condensed'
                showSource={true}
                batch={{size: 10, interval: 500}}
              />
            )}
          </head>
        </head>
        <body
          className={`${FONT_NEUE_HAAS_GROTESK.variable} ${FONT_MONUMENT_GROTESK.variable} ${FONT_MONUMENT_GROTESK_MONO.variable} ${FONT_LUKAS_SANS.variable} ${FONT_JUST_ANOTHER_HAND.variable} ${FONT_JET_BRAINS_MONO.variable} ${FONT_MARTIAN_MONO.variable} ${FONT_NOTO_SANS.variable} ${FONT_SPACE_GROTESK.variable} ${FONT_LEAGUE_SPARTAN.variable} ${FONT_SPECIAL_ELITE.variable} ${FONT_ANTON.variable} ${FONT_CAVEAT.variable} dark`}>
          <ThemeProvider
            attribute='class'
            forcedTheme='dark'
            defaultTheme='dark'
            enableSystem={false}
            // enableSystem
            // disableTransitionOnChange
          >
            {/* <DataLayer> */}

            <FullSiteNav />
            <CustomCursor />
            <main className='min-h-[100vh] min-w-screen relative site dark'>{children}</main>
          </ThemeProvider>
        </body>
        {/* </DataLayer> */}
      </html>
    </ClerkProvider>
  )
}
