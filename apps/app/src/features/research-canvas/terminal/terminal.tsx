"use client"

import { useEffect, useRef } from "react"
import "./terminal.css"

export function Terminal() {
  const terminalLinesRef = useRef<(HTMLDivElement | null)[]>([])
  const progressFillRef = useRef<HTMLDivElement>(null)
  const terminalWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
  }, [])

  // Function to animate terminal text
  const animateTerminalText = () => {
    // Make all lines visible with a staggered delay
    if (terminalLinesRef.current) {
      terminalLinesRef.current.forEach((line, index) => {
        if (line) {
          setTimeout(() => {
            line.style.opacity = "1"
            line.classList.add("visible")
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

  // Simplified terminal content for better fit
  const terminalLines = [
    "$ system.initialize()",
    "Initializing system components...",
    "<span class='success'>SUCCESS:</span> All modules loaded",
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

  return (
    <div className="terminal-container w-full p-2">
      {/* Terminal Window */}
      <div className="terminal-window w-full" ref={terminalWindowRef}>
        <div className="terminal-header">
          <span className="terminal-title">SYS_TERM_V42.EXE</span>
          <div className="terminal-controls">
            <span className="terminal-control"></span>
            <span className="terminal-control"></span>
            <span className="terminal-control"></span>
          </div>
        </div>
        <div className="terminal-content">
          {terminalLines.map((line, index) => (
            <div
              key={index}
              className="terminal-line"
              ref={(el) => setTerminalLineRef(el, index)}
              dangerouslySetInnerHTML={{ __html: line }}
            ></div>
          ))}
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="progress-container">
        <div className="progress-label">TERMINAL</div>
        <div className="progress-bar">
          <div className="progress-fill" ref={progressFillRef}></div>
        </div>
        <div className="progress-close">[X]</div>
      </div>
    </div>
  )
}
