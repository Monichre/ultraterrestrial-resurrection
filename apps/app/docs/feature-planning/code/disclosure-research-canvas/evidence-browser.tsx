"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Database, Search, X, AlertCircle } from "lucide-react"
import AnimatedFolder from "./animated-folder"
import EvidenceDetailSidebar from "./evidence-detail-sidebar"
import { createFuzzySearch, searchFiles, type SearchableFile } from "@/utils/fuzzy-search"
import { getAllDocuments, getDocumentsByType } from "@/utils/documents-data"

interface FileItem {
  id: string
  name: string
  type: "file" | "image" | "video" | "attachment"
  size?: string
  classification?: "top-secret" | "classified" | "confidential" | "restricted" | "unclassified"
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

export default function EvidenceBrowser({ folders: propFolders }: EvidenceBrowserProps) {
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchableFile[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Create fuzzy search instance
  const fuseRef = useRef<any>(null)
  const allFiles = useRef<SearchableFile[]>([])

  // Load folders from documents.csv
  useEffect(() => {
    if (propFolders) {
      setFolders(propFolders)
      return
    }

    // Get all documents from our CSV data
    const allDocs = getAllDocuments()

    // Group documents by type to create folders
    const documentsByType = {
      documents: getDocumentsByType("document"),
      images: getDocumentsByType("image"),
      videos: getDocumentsByType("video"),
      attachments: getDocumentsByType("attachment"),
    }

    // Create folders structure
    const generatedFolders: FolderItem[] = [
      {
        id: "f-001",
        name: "Research Documents",
        isSecret: true,
        files: documentsByType.documents.map((doc) => ({
          id: doc.id,
          name: doc.title,
          type: "file",
          size: doc.fileSize || "1.2 MB",
          classification: doc.classification,
        })),
      },
      {
        id: "f-002",
        name: "Evidence Images",
        files: documentsByType.images.map((img) => ({
          id: img.id,
          name: img.title,
          type: "image",
          size: img.fileSize || "842 KB",
          classification: img.classification,
        })),
      },
      {
        id: "f-003",
        name: "Video Recordings",
        isSecret: true,
        files: documentsByType.videos.map((vid) => ({
          id: vid.id,
          name: vid.title,
          type: "video",
          size: vid.fileSize || "4.2 GB",
          classification: vid.classification,
        })),
      },
      {
        id: "f-004",
        name: "Attachments & Data",
        files: documentsByType.attachments.map((att) => ({
          id: att.id,
          name: att.title,
          type: "attachment",
          size: att.fileSize || "1.8 GB",
          classification: att.classification,
        })),
      },
    ]

    setFolders(generatedFolders)

    // Extract all files for search
    const extractedFiles = generatedFolders.flatMap((folder) =>
      folder.files.map((file) => ({
        ...file,
        folderId: folder.id,
        path: `${folder.name}/${file.name}`,
      })),
    )

    allFiles.current = extractedFiles
    fuseRef.current = createFuzzySearch(extractedFiles)
  }, [propFolders])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim()) {
      if (!isSearching) setIsSearching(true)
      const results = searchFiles(fuseRef.current, query)
      setSearchResults(results)
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
  }

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file)
    // Convert the file to evidence format
    setSelectedEvidence({
      id: file.id,
      type: file.type,
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
    setIsOpen(true)
  }

  // Handle search result click
  const handleSearchResultClick = (result: SearchableFile) => {
    const file = {
      id: result.id,
      name: result.name,
      type: result.type as "file" | "image" | "video" | "attachment",
      size: result.size,
      classification: result.classification,
    }
    handleFileSelect(file)
  }

  // Get classification color
  const getClassificationColor = (classification?: string) => {
    switch (classification) {
      case "top-secret":
        return "border-red-900/50 text-red-400"
      case "classified":
        return "border-amber-900/50 text-amber-400"
      case "confidential":
        return "border-blue-900/50 text-blue-400"
      default:
        return "border-neutral-800 text-neutral-400"
    }
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search evidence files..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded border border-neutral-800 bg-black/20 py-2 pl-10 pr-10 font-mono text-sm text-neutral-300 placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 min-h-[300px]">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="search-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-mono text-neutral-400">
                    {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`p-3 border rounded cursor-pointer hover:bg-neutral-800/20 ${getClassificationColor(result.classification)}`}
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">{result.name}</span>
                          <span className="text-xs opacity-70">{result.size}</span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">Path: {result.path}</div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-neutral-500">
                    <AlertCircle className="h-10 w-10 mb-2 opacity-30" />
                    <p>No matching files found</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="folder-structure"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {folders.map((folder) => (
                  <AnimatedFolder key={folder.id} folder={folder} onFileSelect={handleFileSelect} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
      <AnimatePresence>
        {selectedEvidence && (
          <EvidenceDetailSidebar
            evidence={selectedEvidence}
            onClose={() => {
              setSelectedEvidence(null)
              setIsOpen(false)
            }}
            isOpen={isOpen}
          />
        )}
      </AnimatePresence>
    </>
  )
}
