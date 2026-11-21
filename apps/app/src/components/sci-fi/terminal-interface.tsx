"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TerminalInterfaceProps {
  className?: string
  lines?: string[]
  title?: string
  autoStart?: boolean
}

export function TerminalInterface({ 
  className,
  lines,
  title = "SYS_TERM_V42.EXE",
  autoStart = true
}: TerminalInterfaceProps) {
  const terminalLinesRef = useRef<(HTMLDivElement | null)[]>([])
  const progressFillRef = useRef<HTMLDivElement>(null)
  const terminalWindowRef = useRef<HTMLDivElement>(null)

  const defaultLines = [
    "$ system.initialize()",
    "Initializing system components...",
    "<span class='text-green-400'>SUCCESS:</span> All modules loaded",
    "&nbsp;",
    "$ loadSystems()",
    "- navigation: online",
    "- propulsion: online", 
    "- life_support: online",
    "- weapons: primed",
    "- shields: charged",
    "&nbsp;",
    "$ scanEnvironment()",
    "Scanning global parameters...",
    "Atmospheric analysis complete",
    "Oceanic analysis complete", 
    "Terrestrial analysis complete",
    "&nbsp;",
    "$ getStatus()",
    "System Status: ACTIVE",
    "Threat Level: LOW",
    "Data Integrity: 99.7%",
    "&nbsp;",
    "$ _",
  ]

  const terminalLines = lines || defaultLines

  useEffect(() => {
    if (!autoStart) return

    // Show the terminal window
    if (terminalWindowRef.current) {
      setTimeout(() => {
        if (terminalWindowRef.current) {
          terminalWindowRef.current.style.opacity = "1"
          terminalWindowRef.current.style.width = "100%"
        }
        animateTerminalText()
      }, 500)
    }

    // Fill the progress bar
    if (progressFillRef.current) {
      setTimeout(() => {
        if (progressFillRef.current) {
          progressFillRef.current.style.width = "100%"
        }
      }, 1000)
    }
  }, [autoStart])

  // Function to animate terminal text
  const animateTerminalText = () => {
    // Make all lines visible with a staggered delay
    if (terminalLinesRef.current) {
      terminalLinesRef.current.forEach((line, index) => {
        if (line) {
          setTimeout(() => {
            line.style.opacity = "1"
            line.classList.add("terminal-line-visible")
          }, index * 80) // 80ms delay between each line
        }
      })
    }
  }

  // Function to set terminal line refs
  const setTerminalLineRef = (el: HTMLDivElement | null, index: number) => {
    if (terminalLinesRef.current) {
      terminalLinesRef.current[index] = el
    }
  }

  return (
    <div className={cn("w-full p-2 flex flex-col", className)}>
      {/* Terminal Window */}
      <div 
        className="flex-1 bg-black/50 border border-white/20 opacity-0 transition-opacity duration-1000 flex flex-col overflow-hidden w-full"
        ref={terminalWindowRef}
      >
        <div className="border-b border-white/20 px-2 py-1 flex justify-between items-center h-5">
          <span className="text-[10px] text-white/60 font-mono">
            {title}
          </span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
          </div>
        </div>
        
        <div className="p-1.5 text-[9px] font-mono flex-1 overflow-auto text-white leading-tight max-h-[calc(100%-20px)]">
          {terminalLines.map((line, index) => (
            <div
              key={index}
              className="opacity-0 transition-opacity duration-300 mb-0.5 whitespace-pre-wrap break-all"
              ref={(el) => setTerminalLineRef(el, index)}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="px-1.5 py-0.5 flex items-center h-4 border-t border-white/20">
        <div className="text-[8px] text-white mr-1.5 font-mono">
          TERMINAL
        </div>
        <div className="h-0.5 bg-white/20 flex-grow mr-1.5">
          <div 
            className="h-full bg-white w-0 transition-all duration-2000"
            ref={progressFillRef}
          />
        </div>
        <div className="text-[8px] text-white mr-0.5">[X]</div>
      </div>
    </div>
  )
}