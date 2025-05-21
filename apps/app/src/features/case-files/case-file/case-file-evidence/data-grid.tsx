"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { useState } from "react"
import EvidenceDetailSidebar from "./evidence-detail-sidebar"
import { ExclamationTriangleIcon, ArrowRightIcon } from "@radix-ui/react-icons"

interface DataEntry {
  id: string
  type: string
  status: "active" | "archived" | "pending"
  date: string
  details: string
  metadata?: {
    createdBy: string
    lastModified: string
    fileSize: string
    format: string
  }
}

interface DataGridProps {
  entries?: DataEntry[]
}

export default function DataGrid({
  entries = [
    {
      id: "7A-X119",
      type: "Surveillance Log",
      status: "active",
      date: "2077-03-15",
      details: "Orbital surveillance data from sector 7",
      metadata: {
        createdBy: "Agent Smith",
        lastModified: "2077-03-15 21:27:18",
        fileSize: "1.2 GB",
        format: "Quantum Data Stream",
      },
    },
    {
      id: "7A-X120",
      type: "Field Report",
      status: "pending",
      date: "2077-03-14",
      details: "Agent field observations - Operation Stardust",
      metadata: {
        createdBy: "Agent Johnson",
        lastModified: "2077-03-14 18:15:32",
        fileSize: "842 KB",
        format: "Encrypted Text",
      },
    },
    {
      id: "7A-X121",
      type: "Analysis Report",
      status: "archived",
      date: "2077-03-13",
      details: "Quantum signature analysis results",
      metadata: {
        createdBy: "AI System",
        lastModified: "2077-03-13 09:45:11",
        fileSize: "2.8 GB",
        format: "Neural Data Matrix",
      },
    },
  ],
}: DataGridProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<DataEntry | null>(null)

  const statusColors = {
    active: "bg-neutral-800/30 text-neutral-200",
    archived: "bg-neutral-800/30 text-neutral-400",
    pending: "bg-neutral-800/30 text-neutral-300",
  }

  return (
    <>
      <Card className="border-neutral-800/50 bg-black/20 backdrop-blur-sm">
        {/* Header */}
        <div className="border-b border-neutral-800 p-4">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-neutral-500" />
            <h2 className="font-mono text-sm font-medium text-neutral-300">Evidence Database</h2>
          </div>
        </div>

        {/* Grid */}
        <div className="divide-y divide-neutral-800">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setSelectedEvidence(entry)}
              className="group relative flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-neutral-800/10"
            >
              <div className="flex items-center gap-4">
                <FileText className="h-4 w-4 text-neutral-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-neutral-300">{entry.id}</span>
                    <Badge variant="outline" className={statusColors[entry.status]}>
                      {entry.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{entry.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <time className="font-mono text-sm text-neutral-500">{entry.date}</time>
                <ArrowRightIcon className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <AnimatePresence>
        {selectedEvidence && (
          <EvidenceDetailSidebar evidence={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

