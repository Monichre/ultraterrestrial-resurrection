"use client"

import type React from "react"
import { useState } from "react"
import type { EvidenceRecord } from "./stacked-cards"
import DragElements from "./drag-elements"
import { useNotation } from "@/hooks/use-notation"

// Sample evidence records
const evidenceRecords: EvidenceRecord[] = [
  {
    id: "7A-X119",
    name: "orbital-scan-sector7.qdt",
    domain: "space-command.mil",
    count: 12,
    prepaid: 0.92,
    type: "image/png",
    classification: "top-secret",
    size: "1.2 GB",
    date: "2077-03-15",
    details: "Orbital surveillance data from sector 7 showing anomalous energy signatures.",
  },
  {
    id: "7A-X120",
    name: "temporal-anomaly-report.enc",
    domain: "research-division.gov",
    count: 8,
    prepaid: 0.78,
    type: "application/pdf",
    classification: "classified",
    size: "842 KB",
    date: "2077-03-14",
    details: "Analysis of temporal distortions detected during Operation Stardust.",
  },
  {
    id: "7A-X121",
    name: "radiation-signature.mtx",
    domain: "quantum-lab.sci",
    count: 15,
    prepaid: 0.85,
    type: "text/plain",
    classification: "top-secret",
    size: "2.8 GB",
    date: "2077-03-13",
    details: "Quantum signature analysis of recovered materials showing non-terrestrial origin.",
  },
  {
    id: "7B-X119",
    name: "agent-smith-debrief.enc",
    domain: "field-ops.int",
    count: 5,
    prepaid: 0.95,
    type: "audio/mp3",
    classification: "confidential",
    size: "318 KB",
    date: "2077-03-12",
    details: "Audio recording of Agent Smith's field report following the incident.",
  },
]

// Additional evidence records for draggable cards
const draggableRecords: EvidenceRecord[] = [
  {
    id: "7B-X120",
    name: "operation-stardust-summary.enc",
    domain: "field-ops.int",
    count: 7,
    prepaid: 0.82,
    type: "application/json",
    classification: "classified",
    size: "1.4 MB",
    date: "2077-03-11",
    details: "Summary of Operation Stardust findings and recommendations.",
  },
  {
    id: "7C-X119",
    name: "eigenvalue-predictions.mtx",
    domain: "quantum-lab.sci",
    count: 9,
    prepaid: 0.89,
    type: "text/xml",
    classification: "top-secret",
    size: "4.2 GB",
    date: "2077-03-10",
    details: "Mathematical models predicting future quantum fluctuations based on observed patterns.",
  },
]

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const DeskFiles: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const titleRef = useNotation({
    type: "highlight",
    color: "rgba(255, 215, 0, 0.3)",
    animationDelay: 500,
  })

  // Function to create a draggable card
  const DraggableCard = ({ record, index }: { record: EvidenceRecord; index: number }) => {
    // Get classification badge color
    const getClassificationColor = (classification: string) => {
      switch (classification) {
        case "top-secret":
          return "border-red-900/50"
        case "classified":
          return "border-amber-900/50"
        case "confidential":
          return "border-blue-900/50"
        default:
          return "border-neutral-800"
      }
    }

    const rotation = randomInt(-12, 12)
    const width = randomInt(280, 320)
    const height = randomInt(240, 340)

    // Use rough-notation for highlighting important elements
    const nameRef = useNotation({
      type: "underline",
      color:
        record.classification === "top-secret"
          ? "#ff4040"
          : record.classification === "classified"
            ? "#ffaa00"
            : "#4080ff",
      animationDelay: 800 + index * 200,
    })

    return (
      <div
        className={`flex flex-col bg-black/80 backdrop-blur-sm shadow-lg border ${getClassificationColor(
          record.classification,
        )} rounded-lg overflow-hidden`}
        style={{
          transform: `rotate(${rotation}deg)`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* Card Header */}
        <div className="flex items-center gap-2.5 border-b border-neutral-800 px-4 py-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-800">
            <svg
              className="h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12 2L2 19H22L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-sm font-mono text-neutral-300">Evidence #{record.id}</span>
          <span
            className={`ml-auto rounded px-2 py-0.5 text-xs font-mono ${
              record.classification === "top-secret"
                ? "bg-red-900/30 text-red-400"
                : record.classification === "classified"
                  ? "bg-amber-900/30 text-amber-400"
                  : "bg-blue-900/30 text-blue-400"
            }`}
          >
            {record.classification}
          </span>
        </div>

        {/* Card Content */}
        <div className="px-4 py-3 flex-1 overflow-auto">
          <div className="mb-2">
            <h3
              ref={nameRef as React.RefObject<HTMLHeadingElement>}
              className="text-sm font-medium text-neutral-300 inline-block"
            >
              {record.name}
            </h3>
            <p className="text-xs text-neutral-500">{record.date}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Domain:</span>
              <span className="text-xs text-neutral-300">{record.domain}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">References:</span>
              <span className="text-xs text-neutral-300">{record.count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Credibility:</span>
              <span className="text-xs text-green-500">{record.prepaid.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Size:</span>
              <span className="text-xs text-neutral-300">{record.size}</span>
            </div>
          </div>

          {record.details && (
            <div className="mt-3 border-t border-neutral-800 pt-2">
              <p className="text-xs text-neutral-400">{record.details}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative min-h-[600px] overflow-hidden">
      {/* Background with dot grid */}
      <div className="absolute inset-0 bg-black">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 6px 6px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
            backgroundSize: `12px 12px`,
          }}
        />
      </div>

      <div className="relative z-10 w-full h-full p-4">
        {/* Title with rough-notation highlight */}
        <h2
          ref={titleRef as React.RefObject<HTMLHeadingElement>}
          className="text-xl font-mono text-neutral-300 mb-4 absolute top-4 left-1/2 transform -translate-x-1/2 inline-block"
        >
          DISCLOSURE FILES
        </h2>

        {/* Stacked Cards in the center 
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <StackedCards records={evidenceRecords} />
        </div>
        */}

        {/* Draggable Cards scattered around */}
        <DragElements dragMomentum={false} dragElastic={0.1} className="w-full h-full">
          {draggableRecords.map((record, index) => (
            <DraggableCard key={record.id} record={record} index={index} />
          ))}
        </DragElements>
      </div>
    </div>
  )
}

export default DeskFiles
