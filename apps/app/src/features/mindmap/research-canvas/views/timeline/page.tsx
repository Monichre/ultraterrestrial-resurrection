"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Filter,
  X,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Info,
} from "lucide-react"
import { UFO_SIGHTINGS, type UFOSighting } from "@/features/mindmap/research-canvas/data/ufo-sightings"

interface NetworkNode {
  id: string
  x: number
  y: number
  incident: UFOSighting
}

interface Connection {
  from: string
  to: string
}

const generateNetworkLayout = (incidents: UFOSighting[]): { nodes: NetworkNode[]; connections: Connection[] } => {
  const nodes: NetworkNode[] = []
  const connections: Connection[] = []

  // Sort by date for timeline positioning
  const sortedIncidents = [...incidents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Create nodes in a spiral pattern
  const centerX = 600
  const centerY = 400
  const radiusStep = 120
  const angleStep = (2 * Math.PI) / 5

  sortedIncidents.forEach((incident, index) => {
    const ring = Math.floor(index / 5)
    const posInRing = index % 5
    const radius = 150 + ring * radiusStep
    const angle = posInRing * angleStep + ring * 0.3

    nodes.push({
      id: incident.id,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      incident,
    })
  })

  // Create connections based on related incidents
  incidents.forEach((incident) => {
    incident.relatedIncidents.forEach((relatedId) => {
      if (incidents.find((i) => i.id === relatedId)) {
        connections.push({ from: incident.id, to: relatedId })
      }
    })
  })

  return { nodes, connections }
}

export default function NetworkTimelineExplorer() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [filterClassification, setFilterClassification] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const filteredIncidents =
    filterClassification === "all"
      ? UFO_SIGHTINGS
      : UFO_SIGHTINGS.filter((i) => i.classification === filterClassification)

  const { nodes, connections } = generateNetworkLayout(filteredIncidents)

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((z) => Math.max(0.3, Math.min(3, z * delta)))
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-bg")) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      }
    },
    [pan],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node)
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getNodeColor = (classification: string) => {
    const colors: Record<string, string> = {
      CE1: "from-cyan-500 to-blue-600",
      CE2: "from-blue-500 to-indigo-600",
      CE3: "from-purple-500 to-pink-600",
      CE4: "from-pink-500 to-red-600",
      Radar: "from-green-500 to-teal-600",
      Military: "from-orange-500 to-amber-600",
      Mass: "from-yellow-500 to-orange-600",
    }
    return colors[classification] || "from-gray-500 to-gray-600"
  }

  const classifications = ["all", "CE1", "CE2", "CE3", "CE4", "Radar", "Military", "Mass"]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Main Canvas Area */}
      <div
        ref={canvasRef}
        className="relative w-full h-screen cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Network Grid Background */}
        <div className="canvas-bg absolute inset-0 network-grid opacity-30" />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />

        {/* Network Container */}
        <div
          className="absolute inset-0 transition-transform duration-100"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, index) => {
              const fromNode = nodes.find((n) => n.id === conn.from)
              const toNode = nodes.find((n) => n.id === conn.to)
              if (!fromNode || !toNode) return null

              const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to

              return (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHighlighted ? "oklch(0.75 0.18 200)" : "oklch(0.35 0.03 270)"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={isHighlighted ? "0" : "5,5"}
                  className="transition-all duration-300"
                />
              )
            })}
          </svg>

          {/* Network Nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer"
              style={{
                left: node.x - 40,
                top: node.y - 40,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.random() * 0.5, type: "spring" }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
            >
              <div
                className={`
                  relative w-20 h-20 rounded-full 
                  bg-gradient-to-br ${getNodeColor(node.incident.classification)}
                  flex items-center justify-center
                  transition-all duration-300
                  ${hoveredNode === node.id ? "scale-125 shadow-lg shadow-primary/30" : ""}
                  ${selectedNode?.id === node.id ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""}
                `}
              >
                <div className="absolute inset-1 rounded-full bg-background/90 flex items-center justify-center">
                  <span className="text-xs font-bold text-foreground text-center px-1 leading-tight">
                    {new Date(node.incident.date).getFullYear()}
                  </span>
                </div>

                {/* Pulse Effect */}
                {hoveredNode === node.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </div>

              {/* Node Label */}
              <AnimatePresence>
                {hoveredNode === node.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 
                      bg-card/95 backdrop-blur-sm border border-border rounded-lg 
                      px-3 py-2 whitespace-nowrap z-10 shadow-xl"
                  >
                    <p className="text-sm font-semibold text-foreground">{node.incident.name}</p>
                    <p className="text-xs text-muted-foreground">{node.incident.location}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Controls Panel */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2">
            <button
              onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ZoomIn className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-px h-6 bg-border" />
            <span className="text-sm text-muted-foreground font-mono min-w-[4rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <div className="w-px h-6 bg-border" />
            <button
              onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ZoomOut className="w-5 h-5 text-foreground" />
            </button>
            <div className="w-px h-6 bg-border" />
            <button onClick={resetView} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Maximize2 className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl transition-colors ${
              showFilters
                ? "bg-primary text-primary-foreground"
                : "bg-card/90 backdrop-blur-sm border border-border text-foreground hover:bg-muted"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-6 top-24 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 w-64"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Classification Filter
                </h3>
                <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {classifications.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setFilterClassification(cls)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filterClassification === cls
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {cls === "all" ? "All Classifications" : cls}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute right-6 top-24 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Legend
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { cls: "CE1", label: "Close Encounter 1st Kind" },
              { cls: "CE2", label: "Close Encounter 2nd Kind" },
              { cls: "CE3", label: "Close Encounter 3rd Kind" },
              { cls: "CE4", label: "Close Encounter 4th Kind" },
              { cls: "Radar", label: "Radar Confirmed" },
              { cls: "Military", label: "Military Encounter" },
              { cls: "Mass", label: "Mass Sighting" },
            ].map(({ cls, label }) => (
              <div key={cls} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getNodeColor(cls)}`} />
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute left-6 bottom-8 flex gap-3">
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2">
            <span className="text-2xl font-bold text-primary">{filteredIncidents.length}</span>
            <span className="text-sm text-muted-foreground ml-2">Incidents</span>
          </div>
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2">
            <span className="text-2xl font-bold text-accent">{connections.length}</span>
            <span className="text-sm text-muted-foreground ml-2">Connections</span>
          </div>
        </div>
      </div>

      {/* Selected Node Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border 
              shadow-2xl overflow-y-auto z-50"
          >
            {/* Header Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedNode.incident.image || "/placeholder.svg"}
                alt={selectedNode.incident.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 -mt-16 relative">
              {/* Classification Badge */}
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3
                bg-gradient-to-r ${getNodeColor(selectedNode.incident.classification)} text-white`}
              >
                {selectedNode.incident.classification}
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">{selectedNode.incident.name}</h2>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedNode.incident.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedNode.incident.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedNode.incident.witnesses.toLocaleString()} witnesses
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground/80 leading-relaxed mb-6">{selectedNode.incident.description}</p>

              {/* Credibility */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Credibility</h4>
                <div
                  className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                    selectedNode.incident.credibility === "High"
                      ? "bg-green-500/20 text-green-400"
                      : selectedNode.incident.credibility === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {selectedNode.incident.credibility}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.incident.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Sources</h4>
                <ul className="space-y-1">
                  {selectedNode.incident.sources.map((source, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-primary" />
                      {source}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href={`/content-card-detail-view?id=${selectedNode.incident.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground 
                  rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                View Full Details
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
