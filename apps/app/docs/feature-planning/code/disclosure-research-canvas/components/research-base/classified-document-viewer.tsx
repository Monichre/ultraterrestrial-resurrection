"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  Eye,
  FileText,
  ImageIcon,
  Film,
  Paperclip,
  Search,
  Tag,
  LinkIcon,
  Clock,
  User,
  Shield,
  Download,
  Printer,
  MessageSquare,
  MapPin,
  Terminal,
  Eraser,
} from "lucide-react"
import { type DocumentFile, getDocumentById, getDocumentsByType, getDocumentContent } from "@/utils/documents-data"

// Types for our document system
interface ClassifiedDocument {
  id: string
  title: string
  classification: "top-secret" | "secret" | "confidential" | "restricted" | "unclassified"
  dateCreated: string
  lastAccessed: string
  author: string
  content: {
    text?: string
    images?: Array<{
      id: string
      url: string
      caption: string
      classification: string
    }>
    videos?: Array<{
      id: string
      url: string
      thumbnail: string
      duration: string
      classification: string
      name?: string
    }>
    attachments?: Array<{
      id: string
      name: string
      type: string
      size: string
      classification: string
    }>
  }
  metadata: {
    tags: string[]
    relatedDocuments: string[]
    caseFiles: string[]
    locations: string[]
    entities: string[]
  }
  accessHistory: Array<{
    userId: string
    username: string
    timestamp: string
    action: string
  }>
  annotations: Array<{
    id: string
    userId: string
    username: string
    timestamp: string
    text: string
    position?: {
      x: number
      y: number
    }
  }>
}

// Access history for the current session
const currentAccessHistory = [
  {
    userId: "UID-7821",
    username: "e.richards",
    timestamp: new Date().toISOString(),
    action: "viewed",
  },
  {
    userId: "UID-5392",
    username: "j.martinez",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    action: "edited",
  },
  {
    userId: "UID-9023",
    username: "d.wilson",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    action: "commented",
  },
]

// Current annotations
const currentAnnotations = [
  {
    id: "ANT-001",
    userId: "UID-9023",
    username: "d.wilson",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    text: "Compare these results with the 2019 findings from the Pacific recovery.",
  },
  {
    id: "ANT-002",
    userId: "UID-7821",
    username: "e.richards",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    text: "The self-healing properties appear to accelerate when exposed to specific radio frequencies.",
  },
]

// Convert CSV document data to our ClassifiedDocument format
function convertToClassifiedDocument(docFile: DocumentFile): ClassifiedDocument {
  // Get related documents
  const images = getDocumentsByType("image")
  const videos = getDocumentsByType("video")
  const attachments = getDocumentsByType("attachment")

  return {
    id: docFile.id,
    title: docFile.title,
    classification: docFile.classification,
    dateCreated: docFile.dateCreated,
    lastAccessed: new Date().toISOString(),
    author: docFile.author,
    content: {
      text: getDocumentContent(docFile.id),
      images: images.map((img) => ({
        id: img.id,
        url: img.url || "/placeholder.svg",
        caption: img.description,
        classification: img.classification,
      })),
      videos: videos.map((vid) => ({
        id: vid.id,
        url: vid.url || "",
        thumbnail: vid.thumbnail || "/placeholder.svg",
        duration: vid.duration || "00:00",
        classification: vid.classification,
        name: vid.title,
      })),
      attachments: attachments.map((att) => ({
        id: att.id,
        name: att.title,
        type: att.fileType || "application/octet-stream",
        size: att.fileSize || "0 KB",
        classification: att.classification,
      })),
    },
    metadata: {
      tags: docFile.tags || [],
      relatedDocuments: docFile.relatedDocuments || [],
      caseFiles: docFile.caseFiles || [],
      locations: docFile.locations || [],
      entities: docFile.entities || [],
    },
    accessHistory: currentAccessHistory,
    annotations: currentAnnotations,
  }
}

export default function ClassifiedDocumentViewer() {
  const [document, setDocument] = useState<ClassifiedDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("content")
  const [searchQuery, setSearchQuery] = useState("")
  const [newAnnotation, setNewAnnotation] = useState("")
  const [showAccessWarning, setShowAccessWarning] = useState(true)
  const [selectedText, setSelectedText] = useState("")
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null)

  // Refs for annotation functionality
  const contentRef = useRef<HTMLPreElement>(null)

  // Load document data from our CSV
  useEffect(() => {
    const timer = setTimeout(() => {
      // Get the main document (first document in our CSV)
      const mainDoc = getDocumentById("DOC-2023-0472")

      if (mainDoc) {
        setDocument(convertToClassifiedDocument(mainDoc))
      }

      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Add a new annotation
  const handleAddAnnotation = () => {
    if (!newAnnotation.trim() || !document) return

    const newAnnotationObj = {
      id: `ANT-${document.annotations.length + 1}`,
      userId: "UID-7821",
      username: "e.richards",
      timestamp: new Date().toISOString(),
      text: newAnnotation,
    }

    setDocument({
      ...document,
      annotations: [...document.annotations, newAnnotationObj],
    })

    setNewAnnotation("")
  }

  // Handle access warning dismissal
  const dismissAccessWarning = () => {
    setShowAccessWarning(false)
  }

  // Handle text selection for annotations
  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim() !== "") {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setSelectedText(selection.toString())
      setContextMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + window.scrollY,
      })
    }
  }

  // Close context menu
  const closeContextMenu = () => {
    setContextMenuPosition(null)
    setSelectedText("")
  }

  // Create annotation from selected text
  const createAnnotation = (type: string) => {
    // In a real implementation, this would create an annotation with the selected text
    console.log(`Creating ${type} annotation for: ${selectedText}`)
    closeContextMenu()
  }

  // Clear all annotations
  const clearAnnotations = () => {
    // In a real implementation, this would clear all annotations
    console.log("Clearing all annotations")
  }

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-black border border-neutral-800 rounded-sm">
        <div className="flex flex-col items-center">
          <Terminal className="h-12 w-12 text-[#adf0dd] animate-pulse" />
          <p className="mt-4 text-[#adf0dd] font-mono text-sm">Authenticating access...</p>
          <div className="mt-2 font-mono text-xs text-neutral-500">
            <span className="inline-block animate-pulse">|</span>
          </div>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-black border border-neutral-800 rounded-sm">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <p className="mt-4 text-red-500 font-mono text-sm">ACCESS DENIED</p>
          <p className="mt-2 text-neutral-500 font-mono text-xs">SECURITY CLEARANCE INSUFFICIENT</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-black border border-neutral-800 rounded-sm overflow-hidden relative">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-5 z-10"></div>

      {/* Access Warning Banner */}
      {showAccessWarning && (
        <div className="bg-red-900/30 border-y border-red-900/50 px-4 py-2 flex items-center justify-between text-red-400 text-xs font-mono">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>
              WARNING: ACCESSING THIS DOCUMENT IS LOGGED AND MONITORED. UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE.
            </span>
          </div>
          <Button onClick={dismissAccessWarning} className="h-6 text-red-400 hover:bg-red-900/50 bg-transparent">
            DISMISS
          </Button>
        </div>
      )}

      {/* Document Header */}
      <div className="border-b border-neutral-800 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-900/30 text-red-400 border-red-900/50">
                {document.classification.replace("-", " ")}
              </Badge>
              <span className="text-xs text-neutral-500 font-mono">{document.id}</span>
            </div>
            <h1 className="text-xl font-bold mt-2 font-mono text-neutral-300">{document.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Download className="h-4 w-4 mr-1" />
              EXPORT
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Printer className="h-4 w-4 mr-1" />
              PRINT
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-[#adf0dd]/20 text-[#adf0dd] border border-[#adf0dd]/30 hover:bg-[#adf0dd]/30"
            >
              <Shield className="h-4 w-4 mr-1" />
              SECURITY
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-neutral-500 font-mono">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            AUTHOR: {document.author}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            CREATED: {new Date(document.dateCreated).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            LAST ACCESSED: {new Date(document.lastAccessed).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="p-0">
        <div className="w-full">
          <div className="w-full justify-start rounded-none border-b border-neutral-800 bg-black flex">
            {[
              { id: "content", icon: <FileText className="h-4 w-4 mr-1" />, label: "CONTENT" },
              {
                id: "images",
                icon: <ImageIcon className="h-4 w-4 mr-1" />,
                label: `IMAGES (${document.content.images?.length || 0})`,
              },
              {
                id: "videos",
                icon: <Film className="h-4 w-4 mr-1" />,
                label: `VIDEOS (${document.content.videos?.length || 0})`,
              },
              {
                id: "attachments",
                icon: <Paperclip className="h-4 w-4 mr-1" />,
                label: `ATTACHMENTS (${document.content.attachments?.length || 0})`,
              },
              { id: "metadata", icon: <Tag className="h-4 w-4 mr-1" />, label: "METADATA" },
              {
                id: "annotations",
                icon: <MessageSquare className="h-4 w-4 mr-1" />,
                label: `ANNOTATIONS (${document.annotations.length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-0.5 px-4 py-2 text-xs ${
                  activeTab === tab.id ? "bg-neutral-800 text-[#adf0dd]" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Text Content */}
          {activeTab === "content" && (
            <div className="m-0">
              <div className="flex">
                <div className="w-full md:w-3/4 p-4">
                  <div className="flex justify-end mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs flex items-center"
                      onClick={clearAnnotations}
                    >
                      <Eraser className="h-3 w-3 mr-1" />
                      Clear Annotations
                    </Button>
                  </div>
                  <ScrollArea className="h-[500px] w-full pr-4">
                    <pre
                      ref={contentRef}
                      className="font-mono text-sm text-neutral-300 whitespace-pre-wrap"
                      onMouseUp={handleTextSelection}
                    >
                      {document.content.text}
                    </pre>

                    {/* Context Menu for Annotations */}
                    {contextMenuPosition && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${contextMenuPosition.x}px`,
                          top: `${contextMenuPosition.y}px`,
                          transform: "translateX(-50%)",
                          zIndex: 1000,
                        }}
                        className="bg-black border border-neutral-800 rounded-md shadow-lg p-2 flex flex-col gap-1"
                      >
                        <button
                          onClick={() => createAnnotation("highlight")}
                          className="text-xs px-3 py-1 hover:bg-[#27F1FF]/20 rounded-sm text-left"
                        >
                          Highlight
                        </button>
                        <button
                          onClick={() => createAnnotation("underline")}
                          className="text-xs px-3 py-1 hover:bg-[#27F1FF]/20 rounded-sm text-left"
                        >
                          Underline
                        </button>
                        <button
                          onClick={() => createAnnotation("circle")}
                          className="text-xs px-3 py-1 hover:bg-[#27F1FF]/20 rounded-sm text-left"
                        >
                          Circle
                        </button>
                        <button
                          onClick={closeContextMenu}
                          className="text-xs px-3 py-1 hover:bg-red-900/20 rounded-sm text-left"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </ScrollArea>
                </div>

                <div className="hidden md:block md:w-1/4 border-l border-neutral-800 p-4">
                  <h3 className="font-semibold mb-2 text-xs text-[#adf0dd] font-mono">QUICK ACCESS</h3>
                  <div className="space-y-2">
                    <div className="bg-neutral-800/30 hover:bg-neutral-800/50 px-3 py-2 rounded-sm text-xs font-mono cursor-pointer">
                      EXECUTIVE SUMMARY
                    </div>
                    <div className="bg-neutral-800/30 hover:bg-neutral-800/50 px-3 py-2 rounded-sm text-xs font-mono cursor-pointer">
                      SAMPLE DESCRIPTION
                    </div>
                    <div className="bg-neutral-800/30 hover:bg-neutral-800/50 px-3 py-2 rounded-sm text-xs font-mono cursor-pointer">
                      ANALYSIS RESULTS
                    </div>
                    <div className="bg-neutral-800/30 hover:bg-neutral-800/50 px-3 py-2 rounded-sm text-xs font-mono cursor-pointer">
                      CONCLUSIONS
                    </div>
                    <div className="bg-neutral-800/30 hover:bg-neutral-800/50 px-3 py-2 rounded-sm text-xs font-mono cursor-pointer">
                      RECOMMENDATIONS
                    </div>
                    <div className="bg-neutral-800/30 hover:bg-neutral-800/50 px-3 py-2 rounded-sm text-xs font-mono cursor-pointer">
                      APPENDICES
                    </div>
                  </div>

                  <h3 className="font-semibold mt-4 mb-2 text-xs text-[#adf0dd] font-mono">SEARCH DOCUMENT</h3>
                  <div className="flex">
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs bg-black border-neutral-800"
                    />
                    <Button
                      size="sm"
                      className="ml-2 h-9 bg-[#adf0dd]/20 text-[#adf0dd] border border-[#adf0dd]/30 hover:bg-[#adf0dd]/30"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold mb-2 text-xs text-[#adf0dd] font-mono">ANNOTATION GUIDE</h3>
                    <div className="space-y-2 text-xs text-neutral-400">
                      <p>Select text to add annotations.</p>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#adf0dd]/30"></div>
                        <span>Highlight important sections</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-b-2 border-[#adf0dd]"></div>
                        <span>Underline key findings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-[#adf0dd]"></div>
                        <span>Circle critical data</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Images */}
          {activeTab === "images" && (
            <div className="m-0 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {document.content.images?.map((image) => (
                  <Card key={image.id} className="overflow-hidden bg-black border-neutral-800">
                    <div className="relative">
                      <img src={image.url || "/placeholder.svg"} alt={image.caption} className="w-full h-auto" />
                      <Badge
                        className={
                          image.classification === "top-secret"
                            ? "bg-red-900/30 text-red-400 border-red-900/50"
                            : "bg-amber-900/30 text-amber-400 border-amber-900/50"
                        }
                        style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "0.625rem" }}
                      >
                        {image.classification}
                      </Badge>
                    </div>
                    <div className="p-3 text-xs font-mono border-t border-neutral-800">{image.caption}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {activeTab === "videos" && (
            <div className="m-0 p-4">
              <div className="grid grid-cols-1 gap-4">
                {document.content.videos?.map((video) => (
                  <Card key={video.id} className="overflow-hidden bg-black border-neutral-800">
                    <div className="relative">
                      {video.url ? (
                        <video
                          src={video.url}
                          poster={video.thumbnail || "/placeholder.svg"}
                          controls
                          className="w-full h-auto"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="relative">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt="Video thumbnail"
                            className="w-full h-auto"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/70 rounded-full p-4">
                              <Film className="h-8 w-8 text-[#adf0dd]" />
                            </div>
                          </div>
                        </div>
                      )}
                      <Badge
                        className="bg-red-900/30 text-red-400 border-red-900/50"
                        style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "0.625rem" }}
                      >
                        {video.classification}
                      </Badge>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-neutral-300 text-xs px-2 py-1 rounded-sm font-mono">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-3 flex justify-between border-t border-neutral-800">
                      <span className="text-xs font-mono">{video.name || "Video evidence of material properties"}</span>
                      <Button
                        size="sm"
                        className="text-xs bg-[#27F1FF]/20 text-[#27F1FF] border border-[#27F1FF]/30 hover:bg-[#27F1FF]/30"
                        onClick={() => {
                          const videoElement = document.querySelector(`video[src="${video.url}"]`) as HTMLVideoElement
                          if (videoElement) {
                            if (videoElement.paused) {
                              videoElement.play()
                            } else {
                              videoElement.pause()
                            }
                          }
                        }}
                      >
                        PLAY
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {activeTab === "attachments" && (
            <div className="m-0 p-4">
              <div className="space-y-2">
                {document.content.attachments?.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 border border-neutral-800 rounded-sm bg-black/50"
                  >
                    <div className="flex items-center">
                      <div className="bg-neutral-900 p-2 rounded-sm mr-3 border border-neutral-800">
                        <Paperclip className="h-5 w-5 text-neutral-400" />
                      </div>
                      <div>
                        <div className="font-medium text-xs font-mono">{attachment.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {attachment.type} • {attachment.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          attachment.classification === "top-secret"
                            ? "bg-red-900/30 text-red-400 border-red-900/50"
                            : "bg-amber-900/30 text-amber-400 border-amber-900/50"
                        }
                        style={{ fontSize: "0.625rem" }}
                      >
                        {attachment.classification}
                      </Badge>
                      <Button size="sm" variant="outline" className="h-7 text-[10px]">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {activeTab === "metadata" && (
            <div className="m-0 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black border-neutral-800">
                  <div className="p-3">
                    <h3 className="font-semibold text-xs text-neutral-400 font-mono">TAGS</h3>
                  </div>
                  <div className="p-3 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {document.metadata.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-amber-900/30 text-amber-400 border-amber-900/50"
                          style={{ fontSize: "0.625rem" }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="bg-black border-neutral-800">
                  <div className="p-3">
                    <h3 className="font-semibold text-xs text-neutral-400 font-mono">RELATED DOCUMENTS</h3>
                  </div>
                  <div className="p-3 pt-0">
                    <ul className="space-y-1">
                      {document.metadata.relatedDocuments.map((doc, index) => (
                        <li key={index} className="text-xs flex items-center font-mono">
                          <LinkIcon className="h-3 w-3 mr-2 text-[#adf0dd]" />
                          <a href="#" className="text-[#adf0dd] hover:underline">
                            {doc}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card className="bg-black border-neutral-800">
                  <div className="p-3">
                    <h3 className="font-semibold text-xs text-neutral-400 font-mono">CASE FILES</h3>
                  </div>
                  <div className="p-3 pt-0">
                    <ul className="space-y-1">
                      {document.metadata.caseFiles.map((file, index) => (
                        <li key={index} className="text-xs flex items-center font-mono">
                          <FileText className="h-3 w-3 mr-2 text-[#adf0dd]" />
                          <a href="#" className="text-[#adf0dd] hover:underline">
                            {file}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card className="bg-black border-neutral-800">
                  <div className="p-3">
                    <h3 className="font-semibold text-xs text-neutral-400 font-mono">LOCATIONS</h3>
                  </div>
                  <div className="p-3 pt-0">
                    <ul className="space-y-1">
                      {document.metadata.locations.map((location, index) => (
                        <li key={index} className="text-xs flex items-center font-mono">
                          <MapPin className="h-3 w-3 mr-2 text-[#adf0dd]" />
                          {location}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card className="md:col-span-2 bg-black border-neutral-800">
                  <div className="p-3">
                    <h3 className="font-semibold text-xs text-neutral-400 font-mono">ACCESS HISTORY</h3>
                  </div>
                  <div className="p-3 pt-0">
                    <div className="text-xs font-mono">
                      {document.accessHistory.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-1 border-b border-neutral-800 last:border-0"
                        >
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-2 text-neutral-500" />
                            <span>{entry.username}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-4 text-[#adf0dd]">{entry.action}</span>
                            <span className="text-neutral-500">{new Date(entry.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Annotations */}
          {activeTab === "annotations" && (
            <div className="m-0 p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  {document.annotations.map((annotation, index) => (
                    <Card key={index} className="bg-black border-neutral-800">
                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="font-semibold text-xs text-[#adf0dd] font-mono">{annotation.username}</div>
                            <div className="text-[10px] text-neutral-500 ml-2 font-mono">
                              {new Date(annotation.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs font-mono">{annotation.text}</div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-semibold mb-2 text-neutral-400 font-mono">ADD ANNOTATION</h3>
                  <div className="flex flex-col space-y-2">
                    <Textarea
                      placeholder="Add your notes here..."
                      value={newAnnotation}
                      onChange={(e) => setNewAnnotation(e.target.value)}
                      className="min-h-[100px] bg-black border-neutral-800 text-xs font-mono"
                    />
                    <Button
                      onClick={handleAddAnnotation}
                      className="self-end bg-[#adf0dd]/20 text-[#adf0dd] border border-[#adf0dd]/30 hover:bg-[#adf0dd]/30"
                    >
                      ADD ANNOTATION
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status footer */}
      <div className="flex justify-between items-center p-2 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono">
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-[#adf0dd] mr-2"></span>
          <span>SECURE CONNECTION</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
