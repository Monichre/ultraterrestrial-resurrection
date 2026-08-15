"use client"
import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { User, Settings, Search, Paperclip, ZoomIn, ZoomOut, X, FileText, Eye, Shield } from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Document interface
export interface Document {
  id: string
  title: string
  metadata: string
  image: string
  alt: string
  annotations?: string[]
  photo?: string
  status?: string
  date?: string
  classification?: string
}

// Document column props
export interface DocumentColumnProps {
  title: string
  documents: Document[]
  type: "handwritten" | "typed" | "classified"
  loading: boolean
  error: string | null
  onDocClick: (doc: Document) => void
}

// Header section props
export interface HeaderSectionProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onUserClick: () => void
  onSettingsClick: () => void
}

// Sidebar navigation props
export interface SidebarNavigationProps {
  activeFilters: string[]
  onFilterToggle: (filter: string) => void
  dateRange: {
    start: string
    end: string
  }
  onDateRangeChange: (range: { start: string; end: string }) => void
}

// Sample data
const sampleDocuments: Document[] = [
  // Handwritten documents
  {
    id: "hw-001",
    title: "NDMFHFDS 910",
    metadata: "Handwritten field notes • 1952",
    image: "/placeholder.svg?width=400&height=600",
    alt: "Aged handwritten document with faded ink and annotations",
    annotations: ["Classified markings", "Field agent notes", "Location coordinates"],
    date: "1952-03-15",
    classification: "handwritten",
    status: "declassified",
  },
  {
    id: "hw-002",
    title: "Operation Paperclip Notes",
    metadata: "Personal journal • 1947",
    image: "/placeholder.svg?width=400&height=600",
    alt: "Handwritten journal with cursive writing and sketches",
    annotations: ["Personal observations", "Technical diagrams", "Contact information"],
    date: "1947-08-22",
    classification: "handwritten",
    status: "restricted",
  },
  // Typed reports
  {
    id: "tr-001",
    title: "ERTECK Intelligence Report",
    metadata: "Typed report with photograph • 1963",
    image: "/placeholder.svg?width=400&height=600",
    alt: "Typed intelligence report with attached black and white photograph",
    photo: "/placeholder.svg?width=300&height=200",
    date: "1963-11-12",
    classification: "typed",
    status: "confidential",
  },
  {
    id: "tr-002",
    title: "Subject Interview Transcript",
    metadata: "Interrogation notes • 1958",
    image: "/placeholder.svg?width=400&height=600",
    alt: "Typed transcript with official letterhead and stamps",
    photo: "/placeholder.svg?width=300&height=200",
    date: "1958-07-03",
    classification: "typed",
    status: "declassified",
  },
  // Classified files
  {
    id: "cf-001",
    title: "UNIDENTIFIED AERIAL PHENOMENON",
    metadata: "Classified photograph • 1965",
    image: "/placeholder.svg?width=400&height=600",
    alt: "Classified document with grainy UFO photograph attached",
    photo: "/placeholder.svg?width=300&height=200",
    date: "1965-04-18",
    classification: "classified",
    status: "top-secret",
  },
  {
    id: "cf-002",
    title: "PROJECT BLUE BOOK FILE",
    metadata: "Investigation report • 1969",
    image: "/placeholder.svg?width=400&height=600",
    alt: "Top secret file with multiple witness statements and photographs",
    photo: "/placeholder.svg?width=300&height=200",
    date: "1969-12-07",
    classification: "classified",
    status: "top-secret",
  },
]

// Header Section Component
function HeaderSection({ searchQuery, onSearchChange, onUserClick, onSettingsClick }: HeaderSectionProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
            <Shield className="w-5 h-5 text-neutral-900" />
          </div>
          <h1 className="text-xl font-mono text-amber-100 tracking-wider">CLASSIFIED ARCHIVES</h1>
        </div>
        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-neutral-800 border-neutral-600 text-neutral-100 placeholder-neutral-400 font-mono"
            />
          </div>
        </div>
        {/* User Actions */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUserClick}
                  className="text-neutral-300 hover:text-amber-100 hover:bg-neutral-800"
                >
                  <User className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>User Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSettingsClick}
                  className="text-neutral-300 hover:text-amber-100 hover:bg-neutral-800"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}

// Sidebar Navigation Component
function SidebarNavigation({ activeFilters, onFilterToggle, dateRange, onDateRangeChange }: SidebarNavigationProps) {
  const filterOptions = [
    { id: "handwritten", label: "Handwritten", icon: FileText },
    { id: "typed", label: "Typed Reports", icon: Eye },
    { id: "classified", label: "Classified", icon: Shield },
    { id: "declassified", label: "Declassified", icon: FileText },
    { id: "confidential", label: "Confidential", icon: Eye },
    { id: "top-secret", label: "Top Secret", icon: Shield },
  ] as any[]
  return (
    <Sidebar className="bg-neutral-800 border-neutral-700">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-100 font-mono tracking-wider">DOCUMENT FILTERS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterOptions.map((filter) => (
                <SidebarMenuItem key={filter.id}>
                  <SidebarMenuButton
                    onClick={() => onFilterToggle(filter.id)}
                    className={cn(
                      "font-mono text-sm",
                      activeFilters.includes(filter.id)
                        ? "bg-amber-600 text-neutral-900"
                        : "text-neutral-300 hover:text-amber-100 hover:bg-neutral-700",
                    )}
                  >
                    <filter.icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="bg-neutral-700" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-100 font-mono tracking-wider">DATE RANGE</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-3 p-3">
            <div>
              <label className="text-xs text-neutral-400 font-mono">FROM</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                className="bg-neutral-700 border-neutral-600 text-neutral-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 font-mono">TO</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                className="bg-neutral-700 border-neutral-600 text-neutral-100 font-mono text-sm"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

// Document Column Component
function DocumentColumn({ title, documents, type, loading, error, onDocClick }: DocumentColumnProps) {
  const getColumnStyles = () => {
    switch (type) {
      case "handwritten":
        return "bg-gradient-to-b from-amber-50 to-amber-100"
      case "typed":
        return "bg-gradient-to-b from-neutral-50 to-neutral-100"
      case "classified":
        return "bg-gradient-to-b from-neutral-900 to-neutral-800"
      default:
        return "bg-neutral-100"
    }
  }
  const getTextStyles = () => {
    return type === "classified" ? "text-amber-100" : "text-neutral-900"
  }
  if (loading) {
    return (
      <div className={cn("flex-1 p-4", getColumnStyles())}>
        <h2 className={cn("text-lg font-mono font-bold mb-4 tracking-wider", getTextStyles())}>{title}</h2>
        <ScrollArea className="h-[80vh]">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-white/80 shadow-lg">
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }
  if (error) {
    return (
      <div className={cn("flex-1 p-4", getColumnStyles())}>
        <h2 className={cn("text-lg font-mono font-bold mb-4 tracking-wider", getTextStyles())}>{title}</h2>
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 font-mono mb-4">{error}</p>
              <Button variant="outline" className="font-mono bg-transparent">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  return (
    <div className={cn("flex-1 p-4", getColumnStyles())}>
      <h2 className={cn("text-lg font-mono font-bold mb-4 tracking-wider", getTextStyles())}>{title}</h2>
      <ScrollArea className="h-[80vh]">
        <div className="space-y-6">
          {documents.map((document) => (
            <motion.div key={document.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card
                className={cn(
                  "cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300",
                  type === "classified" ? "bg-neutral-800 border-neutral-600" : "bg-white/90",
                )}
                onClick={() => onDocClick(document)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle
                        className={cn(
                          "text-sm font-mono font-bold tracking-wider",
                          type === "classified" ? "text-amber-100" : "text-neutral-900",
                        )}
                      >
                        {document.title}
                      </CardTitle>
                      <p
                        className={cn(
                          "text-xs font-mono mt-1",
                          type === "classified" ? "text-neutral-300" : "text-neutral-600",
                        )}
                      >
                        {document.metadata}
                      </p>
                    </div>
                    {type === "classified" && <Paperclip className="w-4 h-4 text-amber-600 transform rotate-45" />}
                  </div>
                  {document.status && (
                    <Badge
                      variant={document.status === "top-secret" ? "destructive" : "secondary"}
                      className="w-fit font-mono text-xs"
                    >
                      {document.status.toUpperCase()}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="relative group">
                    <img
                      src={document.image || "/placeholder.svg"}
                      alt={document.alt}
                      className="w-full h-48 object-cover rounded border-2 border-neutral-300 shadow-md transition-transform duration-300 group-hover:scale-105"
                      style={{
                        filter: type === "classified" ? "grayscale(100%) contrast(1.2)" : "sepia(20%)",
                      }}
                    />
                    {document.photo && (
                      <div className="absolute top-2 right-2 w-16 h-12 border-2 border-white shadow-lg">
                        <img
                          src={document.photo || "/placeholder.svg"}
                          alt="Attached photograph"
                          className="w-full h-full object-cover"
                          style={{ filter: "grayscale(100%)" }}
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  {document.annotations && (
                    <div className="mt-3 space-y-1">
                      {document.annotations.slice(0, 2).map((annotation, index) => (
                        <p
                          key={index}
                          className={cn(
                            "text-xs font-mono italic",
                            type === "classified" ? "text-neutral-400" : "text-neutral-500",
                          )}
                        >
                          • {annotation}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Document Modal Component
function DocumentModal({
  document,
  isOpen,
  onClose,
}: { document: Document | null; isOpen: boolean; onClose: () => void }) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])
  if (!document) return null
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-amber-100 font-mono tracking-wider">{document.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="text-neutral-300 hover:text-amber-100"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-neutral-300 font-mono text-sm">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                className="text-neutral-300 hover:text-amber-100"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-300 hover:text-amber-100">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-neutral-400 font-mono text-sm">{document.metadata}</p>
        </DialogHeader>
        <div className="overflow-hidden rounded border border-neutral-700">
          <div className="overflow-auto max-h-[60vh] bg-neutral-800" style={{ cursor: zoom > 1 ? "grab" : "default" }}>
            <motion.img
              src={document.image}
              alt={document.alt}
              className="w-full h-auto"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                filter: document.classification === "classified" ? "grayscale(100%) contrast(1.2)" : "sepia(20%)",
              }}
              drag={zoom > 1}
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              onDrag={(_, info) => setPosition({ x: info.offset.x, y: info.offset.y })}
            />
          </div>
        </div>
        {document.annotations && (
          <div className="space-y-2">
            <h4 className="text-amber-100 font-mono text-sm font-bold">ANNOTATIONS:</h4>
            {document.annotations.map((annotation, index) => (
              <p key={index} className="text-neutral-300 font-mono text-sm">
                • {annotation}
              </p>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Main Component
export interface SpyFilesArchiveViewerProps {
  initialDocuments?: Document[]
}
export default function SpyFilesArchiveViewer({ initialDocuments = sampleDocuments }: SpyFilesArchiveViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [dateRange, setDateRange] = useState({ start: "1940-01-01", end: "1980-12-31" })
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])
  // Filter documents
  const filteredDocuments = useMemo(() => {
    return initialDocuments.filter((doc) => {
      // Search filter
      if (
        debouncedSearchQuery &&
        !doc.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
        !doc.metadata.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      ) {
        return false
      }
      // Category filters
      if (activeFilters.length > 0) {
        const hasClassificationFilter = activeFilters.includes(doc.classification || "")
        const hasStatusFilter = activeFilters.includes(doc.status || "")
        if (!hasClassificationFilter && !hasStatusFilter) {
          return false
        }
      }
      // Date range filter
      if (doc.date) {
        const docDate = new Date(doc.date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        if (docDate < startDate || docDate > endDate) {
          return false
        }
      }
      return true
    })
  }, [initialDocuments, debouncedSearchQuery, activeFilters, dateRange])
  // Categorize documents
  const handwrittenDocs = filteredDocuments.filter((doc) => doc.classification === "handwritten")
  const typedDocs = filteredDocuments.filter((doc) => doc.classification === "typed")
  const classifiedDocs = filteredDocuments.filter((doc) => doc.classification === "classified")
  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }
  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document)
    setIsModalOpen(true)
  }
  const handleUserClick = () => {
    // User profile action
  }
  const handleSettingsClick = () => {
    // Settings action
  }
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-neutral-900 font-mono">
          {/* Header */}
          <HeaderSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUserClick={handleUserClick}
            onSettingsClick={handleSettingsClick}
          />
          <div className="flex pt-20">
            {/* Sidebar */}
            <SidebarNavigation
              activeFilters={activeFilters}
              onFilterToggle={handleFilterToggle}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            {/* Main Content */}
            <main className="flex-1 flex">
              <SidebarTrigger className="fixed top-24 left-4 z-40 bg-neutral-800 text-amber-100 hover:bg-neutral-700" />
              {/* Three Column Layout */}
              <div className="flex-1 flex flex-col lg:flex-row gap-0">
                <DocumentColumn
                  title="HANDWRITTEN DOCUMENTS"
                  documents={handwrittenDocs}
                  type="handwritten"
                  loading={loading}
                  error={error}
                  onDocClick={handleDocumentClick}
                />
                <Separator orientation="vertical" className="bg-neutral-700 hidden lg:block" />
                <DocumentColumn
                  title="TYPED REPORTS"
                  documents={typedDocs}
                  type="typed"
                  loading={loading}
                  error={error}
                  onDocClick={handleDocumentClick}
                />
                <Separator orientation="vertical" className="bg-neutral-700 hidden lg:block" />
                <DocumentColumn
                  title="CLASSIFIED FILES"
                  documents={classifiedDocs}
                  type="classified"
                  loading={loading}
                  error={error}
                  onDocClick={handleDocumentClick}
                />
              </div>
            </main>
          </div>
          {/* Document Modal */}
          <DocumentModal document={selectedDocument} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
