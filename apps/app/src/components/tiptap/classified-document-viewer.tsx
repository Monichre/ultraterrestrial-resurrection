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
import { useTextAnnotation } from "@/hooks/use-text-annotation"
import { AnnotationMenu } from "@/components/ui/annotation-menu"

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
}

interface ClassifiedDocumentViewerProps {
  document?: ClassifiedDocument
  loading?: boolean
}

// Sample document data
const sampleDocument: ClassifiedDocument = {
  id: "DOC-2023-0472",
  title: "Analysis of Anomalous Materials - Site 7-Alpha Recovery",
  classification: "top-secret",
  dateCreated: "2023-04-15T10:30:00Z",
  lastAccessed: new Date().toISOString(),
  author: "Dr. Elena Richards",
  content: {
    text: `EXECUTIVE SUMMARY

Analysis of recovered materials from Site 7-Alpha indicates anomalous quantum signatures consistent with non-terrestrial manufacturing processes. The crystalline structures exhibit self-healing properties when exposed to specific electromagnetic frequencies in the 2.4-2.6 GHz range.

MATERIAL PROPERTIES

Physical Characteristics:
- Hexagonal crystalline lattice structure
- Metallic luster with iridescent properties
- Density: 4.7 g/cm³ (lower than expected for metallic composition)
- Hardness: 9.2 on Mohs scale
- Temperature resistance: -273°C to 2000°C+

Electromagnetic Properties:
- Superconductivity at room temperature
- Anomalous magnetic field generation
- Electromagnetic pulse immunity
- Radio frequency amplification in specific bands

Self-Healing Mechanism:
Material samples demonstrate remarkable self-repair capabilities when damaged. Microscopic analysis reveals reorganization of atomic structure occurs within 3.7 seconds of damage detection. This process appears to be triggered by ambient electromagnetic fields.

TEMPORAL EFFECTS

Most significantly, material samples demonstrate temporal distortion effects localized within a 3-meter radius. Field teams reported chronometer discrepancies averaging 4.7 seconds per hour of exposure. Atomic clock synchronization tests confirm temporal dilation effects consistent with theoretical predictions of exotic matter interactions.

SAFETY PROTOCOLS

All personnel exposed to materials must undergo mandatory medical evaluation within 48 hours. Preliminary health screenings indicate no immediate adverse effects, however long-term exposure studies are ongoing.

RECOMMENDATIONS

1. Immediate implementation of Level 5 containment protocols
2. Authorization of expanded research team with Cosmic clearance
3. Coordination with theoretical physics division for quantum mechanics analysis
4. Development of specialized storage facilities with electromagnetic shielding

CONCLUSION

The recovered materials represent technology significantly beyond current human manufacturing capabilities. Their properties suggest potential applications in energy generation, propulsion systems, and quantum computing. However, the temporal effects warrant extreme caution in handling and study.

This analysis supports the hypothesis of non-terrestrial origin and recommends immediate escalation to the Director of Advanced Phenomena Research.`,
    images: [
      {
        id: "img-001",
        url: "/placeholder.svg",
        caption: "Microscopic view of crystalline structure showing hexagonal lattice formation",
        classification: "top-secret"
      },
      {
        id: "img-002", 
        url: "/placeholder.svg",
        caption: "Self-healing process captured in real-time over 3.7 second interval",
        classification: "top-secret"
      }
    ],
    videos: [
      {
        id: "vid-001",
        url: "",
        thumbnail: "/placeholder.svg",
        duration: "02:47",
        classification: "top-secret",
        name: "Material Self-Healing Demonstration"
      }
    ],
    attachments: [
      {
        id: "att-001",
        name: "Quantum Signature Analysis.pdf",
        type: "application/pdf",
        size: "2.4 MB",
        classification: "top-secret"
      },
      {
        id: "att-002",
        name: "Temporal Effects Data.xlsx",
        type: "application/xlsx", 
        size: "847 KB",
        classification: "secret"
      }
    ]
  },
  metadata: {
    tags: ["quantum-materials", "non-terrestrial", "temporal-effects", "site-7-alpha"],
    relatedDocuments: ["DOC-2023-0445", "DOC-2023-0389", "DOC-2022-1247"],
    caseFiles: ["CASE-7A-2023", "OPERATION-STARDUST"],
    locations: ["Site 7-Alpha", "Nevada Test Range", "Groom Lake Facility"],
    entities: ["Dr. Elena Richards", "Quantum Materials Division", "Advanced Research Group"]
  },
  accessHistory: [
    {
      userId: "UID-7821",
      username: "e.richards",
      timestamp: new Date().toISOString(),
      action: "viewed"
    },
    {
      userId: "UID-5392",
      username: "j.martinez",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      action: "edited"
    }
  ]
}

export default function ClassifiedDocumentViewer({ 
  document = sampleDocument, 
  loading = false 
}: ClassifiedDocumentViewerProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [searchQuery, setSearchQuery] = useState("")
  const [newAnnotation, setNewAnnotation] = useState("")
  const [showAccessWarning, setShowAccessWarning] = useState(true)

  // Text annotation functionality
  const contentRef = useRef<HTMLPreElement>(null)
  const { contextMenu, closeContextMenu, createAnnotation, clearAnnotations, annotations } = 
    useTextAnnotation({ containerRef: contentRef })

  // Add a new annotation
  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) return

    // In a real implementation, this would save to backend
    console.log('Adding annotation:', newAnnotation)
    setNewAnnotation("")
  }

  // Handle access warning dismissal
  const dismissAccessWarning = () => {
    setShowAccessWarning(false)
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
                {document.classification.replace("-", " ").toUpperCase()}
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
                label: `ANNOTATIONS (${annotations.length})`,
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
                      Clear Annotations ({annotations.length})
                    </Button>
                  </div>
                  <ScrollArea className="h-[500px] w-full pr-4">
                    <pre
                      ref={contentRef}
                      className="font-mono text-sm text-neutral-300 whitespace-pre-wrap"
                    >
                      {document.content.text}
                    </pre>

                    {/* Context Menu for Annotations */}
                    {contextMenu && (
                      <AnnotationMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={closeContextMenu}
                        onAnnotate={createAnnotation}
                      />
                    )}
                  </ScrollArea>
                </div>

                <div className="hidden md:block md:w-1/4 border-l border-neutral-800 p-4">
                  <h3 className="font-semibold mb-2 text-xs text-[#adf0dd] font-mono">SEARCH DOCUMENT</h3>
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

          {/* Annotations */}
          {activeTab === "annotations" && (
            <div className="m-0 p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  {annotations.map((annotation, index) => (
                    <Card key={index} className="bg-black border-neutral-800">
                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="font-semibold text-xs text-[#adf0dd] font-mono">system.user</div>
                            <div className="text-[10px] text-neutral-500 ml-2 font-mono">
                              {new Date(annotation.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs font-mono">
                          <span className="text-neutral-500">[{annotation.type}]</span> {annotation.text}
                        </div>
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

          {/* Other tabs would be implemented similarly */}
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