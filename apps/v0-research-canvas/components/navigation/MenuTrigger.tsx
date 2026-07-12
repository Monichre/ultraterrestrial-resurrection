"use client"

import { useState, useEffect } from "react"
import { Menu, Command } from "lucide-react"
import { cn } from "@/lib/utils"
import { FullScreenMenu } from "./FullScreenMenu"

interface MenuTriggerProps {
  className?: string
  variant?: "floating" | "inline"
}

export function MenuTrigger({ className, variant = "floating" }: MenuTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (variant === "inline") {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
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
          <div className="hidden sm:flex items-center gap-1 ml-2 text-xs text-neutral-500">
            <Command size={12} />
            <span>K</span>
          </div>
        </button>
        <FullScreenMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
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
      <FullScreenMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
