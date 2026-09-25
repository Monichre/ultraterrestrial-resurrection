import type {Metadata} from 'next'
import {Caveat, IBM_Plex_Mono, Inter, Spectral} from 'next/font/google'
import '@/styles/document-panel.css'

const editorial = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-editorial-src',
  display: 'swap',
})

const iface = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-interface-src',
  display: 'swap',
})

const handwritten = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-handwritten-src',
  display: 'swap',
})

const technical = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-technical-src',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Document Panel — Component Specification',
  description:
    'Printed-style design-system specification sheet for the Document Panel right-rail workspace component.',
}

export default function DocumentPanelLayout({children}: {children: React.ReactNode}) {
  return (
    <div
      className={`dp-route-shell ${editorial.variable} ${iface.variable} ${handwritten.variable} ${technical.variable}`}
    >
      {children}
    </div>
  )
}
