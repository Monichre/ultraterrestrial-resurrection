import type React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import NavigationBar from "@/components/navigation-bar"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "Ultraterrestrial",
  description: "Tracking the State of Disclosure",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetBrainsMono.variable} font-sans bg-neutral-950`}>
        <NavigationBar />
        {children}
      </body>
    </html>
  )
}
