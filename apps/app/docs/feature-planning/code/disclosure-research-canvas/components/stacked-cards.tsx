"use client"

import { useState } from "react"
import { FileText, Globe, BarChart, CircleDollarSign, File, FileImage, FileAudio, FileVideo } from "lucide-react"

export interface EvidenceRecord {
  id: string
  name: string
  domain: string
  count: number
  prepaid: number
  type: string
  classification: "top-secret" | "classified" | "confidential"
  size?: string
  date?: string
  details?: string
}

const DEFAULT_RECORD: EvidenceRecord = {
  id: "default-001",
  name: "Unknown File",
  domain: "classified.gov",
  count: 1,
  prepaid: 0,
  type: "document",
  classification: "confidential",
}

interface StackedCardsProps {
  records?: EvidenceRecord[]
  className?: string
  onCardClick?: (record: EvidenceRecord, index: number) => void
}

export function StackedCards({ records = [DEFAULT_RECORD], className = "", onCardClick }: StackedCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleCardInteraction = (index: number) => {
    setActiveIndex(index)
    if (onCardClick && records[index]) {
      onCardClick(records[index], index)
    }
  }

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    const fileType = type.toLowerCase()

    if (fileType.includes("image")) {
      return <FileImage className="h-5 w-5" />
    } else if (fileType.includes("audio")) {
      return <FileAudio className="h-5 w-5" />
    } else if (fileType.includes("video")) {
      return <FileVideo className="h-5 w-5" />
    } else if (fileType.includes("pdf") || fileType.includes("text") || fileType.includes("document")) {
      return <FileText className="h-5 w-5" />
    } else {
      return <File className="h-5 w-5" />
    }
  }

  // Get classification badge color
  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "top-secret":
        return "bg-red-900/30 text-red-400"
      case "classified":
        return "bg-amber-900/30 text-amber-400"
      case "confidential":
        return "bg-blue-900/30 text-blue-400"
      default:
        return "bg-neutral-800 text-neutral-400"
    }
  }

  return (
    <div className={`relative h-[350px] w-full max-w-[500px] mx-auto ${className}`}>
      <div className="relative h-full w-full [perspective:1000px]">
        {records.map((record, index) => (
          <button
            key={record.id}
            type="button"
            className={`
              absolute left-0 top-0 h-full w-full text-left transition-all duration-500 ease-out
              origin-top focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-black rounded-xl
              ${index === 0 ? "z-30 hover:-translate-y-10" : ""}
              ${index === 1 ? "z-20 translate-x-6 translate-y-4 rotate-3" : ""}
              ${index === 2 ? "z-10 translate-x-12 translate-y-8 rotate-6" : ""}
              ${index === 3 ? "translate-x-16 translate-y-12 rotate-9" : ""}
              ${index > 3 ? "opacity-0" : ""}
            `}
            onClick={() => handleCardInteraction(index)}
            aria-label={`Card for ${record.name}`}
          >
            <div className="h-full w-full overflow-hidden rounded-xl border border-neutral-800 bg-black/80 backdrop-blur-sm shadow-lg">
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
                <span className="text-sm font-mono text-neutral-300">Evidence File</span>
                <span
                  className={`ml-auto rounded px-2 py-0.5 text-xs font-mono ${getClassificationColor(record.classification)}`}
                >
                  {record.classification}
                </span>
              </div>

              {/* Card Content */}
              <div className="px-4 py-3">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm font-mono text-neutral-400">File ID: {record.id}</span>
                  <div className="ml-auto">
                    <span className="text-xs text-neutral-500">{record.date || "Unknown date"}</span>
                  </div>
                </div>

                {/* Data Fields */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-8 text-neutral-500">{getFileIcon(record.type)}</span>
                    <span className="text-sm font-medium text-neutral-300">name</span>
                    <span className="ml-auto text-sm text-neutral-400">{record.name}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-8 text-neutral-500">
                      <Globe className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-neutral-300">domain</span>
                    <span className="ml-auto text-sm text-neutral-400">{record.domain}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-8 text-neutral-500">
                      <BarChart className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-neutral-300">references</span>
                    <span className="ml-auto text-sm text-neutral-400">{record.count.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="w-8 text-neutral-500">
                      <CircleDollarSign className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-neutral-300">credibility</span>
                    <span className="ml-auto text-sm text-green-500">{record.prepaid.toFixed(2)}</span>
                  </div>
                </div>

                {record.details && (
                  <div className="mt-4 border-t border-neutral-800 pt-3">
                    <p className="text-xs text-neutral-400">{record.details}</p>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default StackedCards
