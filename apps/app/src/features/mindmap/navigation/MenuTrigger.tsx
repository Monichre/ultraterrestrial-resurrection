"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMindMapUiStore } from "@/features/mindmap/store/mindmap-ui-store"
import { FullScreenMenu } from "./FullScreenMenu"

interface MenuTriggerProps {
  className?: string
  variant?: "floating" | "inline"
}

export function MenuTrigger({ className, variant = "floating" }: MenuTriggerProps) {
  // Global Zustand store — the menu open state lives here so any trigger
  // (hamburger, command palette, programmatic) stays in sync.
  const { navigation, setFullScreenMenuOpen } = useMindMapUiStore()
  const isOpen = navigation.fullScreenMenuOpen

  if (variant === "inline") {
    return (
      <>
        <button
          onClick={() => setFullScreenMenuOpen(true)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg",
            "bg-neutral-800/50 hover:bg-neutral-700/50",
            "text-neutral-400 hover:text-white",
            "transition-colors duration-200",
            className
          )}
        >
          <Menu size={18} />
          <span className="text-sm font-medium">Menu</span>
        </button>
        <FullScreenMenu />
      </>
    )
  }

  return (
    <>
      {/* Project wordmark — global chrome, top-left */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-40 group pointer-events-auto"
        aria-label="Ultraterrestrial home"
      >
        <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-lg px-4 py-2 hover:bg-black/30 transition-all duration-300">
          <span className="text-white/80 group-hover:text-white text-sm font-monumentMono tracking-wider">
            ULTRATERRESTRIAL
          </span>
        </div>
      </Link>

      {/* Hamburger — global chrome, top-right */}
      <button
        onClick={() => setFullScreenMenuOpen(true)}
        className={cn(
          "fixed top-6 right-6 z-40",
          "w-12 h-12 rounded-full",
          "bg-neutral-800/90 hover:bg-neutral-700/90",
          "backdrop-blur-md",
          "flex items-center justify-center",
          "text-neutral-400 hover:text-white",
          "shadow-lg shadow-black/20",
          "transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "border border-white/5",
          className
        )}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>
      <FullScreenMenu />
    </>
  )
}
