"use client"

import { motion } from "framer-motion"
import { FileText, Link, Clock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface EvidenceDetail {
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

interface EvidenceDetailSidebarProps {
  evidence: EvidenceDetail | null
  onClose: () => void
}

export default function EvidenceDetailSidebar({ evidence, onClose }: EvidenceDetailSidebarProps) {
  if (!evidence) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-neutral-800 bg-black/90 backdrop-blur-md"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-neutral-400" />
              <span className="font-mono text-sm font-medium text-neutral-200">Evidence #{evidence.id}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-400">
              <Cross2Icon className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              {/* Status */}
              <div className="space-y-2">
                <div className="font-mono text-xs text-neutral-500">Status</div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 items-center gap-2 rounded-md bg-neutral-800/30 px-3">
                    <ExclamationTriangleIcon className="h-4 w-4 text-neutral-400" />
                    <span className="font-mono text-sm text-neutral-200">{evidence.status}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="font-mono text-xs text-neutral-500">Details</div>
                <p className="text-sm text-neutral-300">{evidence.details}</p>
              </div>

              <Separator className="bg-neutral-800" />

              {/* Metadata */}
              {evidence.metadata && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-mono text-xs text-neutral-500">Created By</div>
                      <div className="mt-1 flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-300">{evidence.metadata.createdBy}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-neutral-500">Last Modified</div>
                      <div className="mt-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-300">{evidence.metadata.lastModified}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-mono text-xs text-neutral-500">File Size</div>
                      <div className="mt-1 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-300">{evidence.metadata.fileSize}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-neutral-500">Format</div>
                      <div className="mt-1 flex items-center gap-2">
                        <Link className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-300">{evidence.metadata.format}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Graph Placeholder */}
              <div className="space-y-2">
                <div className="font-mono text-xs text-neutral-500">Analysis</div>
                <div className="h-48 rounded-lg border border-gray-200 border-neutral-800 bg-neutral-900/50 dark:border-gray-800">
                  <div className="flex h-full items-center justify-center">
                    <motion.div
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.98, 1, 0.98],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="font-mono text-xs text-neutral-500"
                    >
                      Processing Analysis Data...
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </motion.div>
    </>
  )
}

