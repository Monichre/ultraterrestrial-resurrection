import type React from "react"
import type { Metadata } from "next"
import {
  FONT_SPECIAL_ELITE,
  FONT_ANTON,
  FONT_CAVEAT,
  FONT_PP_NEUE_MONTREAL,
  FONT_JUST_ANOTHER_HAND,
  FONT_JET_BRAINS_MONO,
  FONT_MARTIAN_MONO,
  FONT_NOTO_SANS,
  FONT_SPACE_GROTESK,
  FONT_LEAGUE_SPARTAN,
  FONT_LUKAS_SANS,
  FONT_NEUE_HAAS_GROTESK,
  FONT_MONUMENT_GROTESK_MONO,
  FONT_MONUMENT_GROTESK,
} from "@/lib/fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "UFO Document Archive",
  description: "Classified UFO documentation and archival materials",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`
        ${FONT_SPECIAL_ELITE.variable} 
        ${FONT_ANTON.variable} 
        ${FONT_CAVEAT.variable} 
        ${FONT_PP_NEUE_MONTREAL.variable}
        ${FONT_JUST_ANOTHER_HAND.variable}
        ${FONT_JET_BRAINS_MONO.variable}
        ${FONT_MARTIAN_MONO.variable}
        ${FONT_NOTO_SANS.variable}
        ${FONT_SPACE_GROTESK.variable}
        ${FONT_LEAGUE_SPARTAN.variable}
        ${FONT_LUKAS_SANS.variable}
        ${FONT_NEUE_HAAS_GROTESK.variable}
        ${FONT_MONUMENT_GROTESK_MONO.variable}
        ${FONT_MONUMENT_GROTESK.variable}
      `}
    >
      <body className="font-mono">{children}</body>
    </html>
  )
}
