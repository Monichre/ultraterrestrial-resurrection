"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Database } from "lucide-react"
import AnimatedFolder from "./animated-folder"
import EvidenceDetailSidebar from "./evidence-detail-sidebar"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

interface FileItem {
  id: string
  name: string
  type: "file" | "image"
  size?: string
}

interface FolderItem {
  id: string
  name: string
  files: FileItem[]
  isSecret?: boolean
}

interface EvidenceBrowserProps {
  folders?: FolderItem[]
}

export default function EvidenceBrowser({
  folders = [
    {
      id: "f-001",
      name: "Surveillance Data",
      isSecret: true,
      files: [
        { id: "7A-X119", name: "orbital-scan-sector7.qdt", size: "1.2 GB", type: "file" },
        { id: "7A-X120", name: "temporal-anomaly-report.enc", size: "842 KB", type: "file" },
        { id: "7A-X121", name: "radiation-signature.mtx", size: "2.8 GB", type: "file" },
      ],
    },
    {
      id: "f-002",
      name: "Field Reports",
      files: [
        { id: "7B-X119", name: "agent-smith-debrief.enc", size: "318 KB", type: "file" },
        { id: "7B-X120", name: "operation-stardust-summary.enc", size: "1.4 MB", type: "file" },
      ],
    },
    {
      id: "f-003",
      name: "Mathematical Models",
      isSecret: true,
      files: [
        { id: "7C-X119", name: "eigenvalue-predictions.mtx", size: "4.2 GB", type: "file" },
        { id: "7C-X120", name: "quantum-probability-distributions.qdt", size: "2.1 GB", type: "file" },
        { id: "7C-X121", name: "wave-function-collapse-simulations.enc", size: "8.7 GB", type: "file" },
      ],
    },
  ],
}: EvidenceBrowserProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null)

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file)
    // Convert the file to evidence format
    setSelectedEvidence({
      id: file.id,
      type: file.name.split(".").pop(),
      status: "active",
      date: "2077-03-15",
      details: `Evidence file: ${file.name}`,
      metadata: {
        createdBy: "System",
        lastModified: "2077-03-15 21:27:18",
        fileSize: file.size || "Unknown",
        format: file.name.split(".").pop()?.toUpperCase() || "Unknown",
      },
    })
  }

  return (
    <>
      <Card className="border-neutral-800/50 bg-black/20 backdrop-blur-sm">
        {/* Header */}
        <div className="border-b border-neutral-800 p-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-neutral-500" />
            <h2 className="font-mono text-sm font-medium text-neutral-300">Evidence Database Explorer</h2>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-neutral-800 p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search evidence files..."
              className="w-full rounded border border-gray-200 border-neutral-800 bg-black/20 py-2 pl-10 pr-4 font-mono text-sm text-neutral-300 placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700 dark:border-gray-800"
            />
          </div>
        </div>

        {/* Folders */}
        <div className="p-4">
          <div className="space-y-2">
            {folders.map((folder) => (
              <AnimatedFolder key={folder.id} folder={folder} onFileSelect={handleFileSelect} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
              <span className="font-mono text-xs text-neutral-500">System Ready</span>
            </div>
            <motion.div
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <span className="font-mono text-xs text-neutral-500">∑ Indexing</span>
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Detail Sidebar */}
      {selectedEvidence && (
        <EvidenceDetailSidebar evidence={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
      )}
    </>
  )
}

