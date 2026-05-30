"use client"

import React from "react"

import { useState } from "react"
import Typer from "./Typer"
import { ResearchTimeline } from "./ResearchTimeline"

const UFO_RESEARCH_EVENTS = [
  {
    week: "Week 1",
    marker: "filled" as const,
    title: "Initial Research Phase",
    description: "Gathered primary sources on Roswell incident",
  },
  {
    week: "Week 2",
    marker: "filled" as const,
    title: "Document Analysis",
    description: "Cross-referenced declassified FOIA documents",
  },
  {
    week: "Week 3",
    marker: "breakthrough" as const,
    title: "Pattern Discovery",
    description: "Identified correlations between sighting locations and military bases",
  },
  {
    week: "Week 4",
    marker: "filled" as const,
    title: "Witness Testimony Review",
  },
  {
    week: "Week 5",
    marker: "breakthrough" as const,
    title: "Timeline Reconstruction",
    description: "Mapped complete incident chronology with verified timestamps",
  },
  {
    week: "Week 6",
    marker: "empty" as const,
    title: "Ongoing Analysis",
  },
]

export function EmptyCanvas() {
  const [input, setInput] = useState("")
  const [showTimeline, setShowTimeline] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.toLowerCase().includes("timeline") || input.toLowerCase().includes("research")) {
      setShowTimeline(true)
    }
  }

  return (
    <div className="text-white flex flex-col justify-between items-center h-screen w-full pt-6 overflow-y-auto">
      {/* Main content area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4">
        {showTimeline ? (
          <ResearchTimeline
            title="UAP Disclosure Research"
            subtitle="Tracking the path to truth through systematic analysis"
            events={UFO_RESEARCH_EVENTS}
            sessions={47}
            exchanges={1284}
            saves={89}
            shares={34}
          />
        ) : (
          <div className="text-center max-w-2xl">
            <h1 className="text-2xl font-light text-zinc-300 mb-2">Research Canvas</h1>
            <p className="text-sm text-zinc-500">
              Start your investigation by typing a query below. Try &quot;show timeline&quot; or &quot;research progress&quot;.
            </p>
          </div>
        )}
      </div>

      {/* Typer component at the bottom */}
      <div className="w-full max-w-4xl pb-10 px-4">
        <Typer input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
      </div>
    </div>
  )
}
