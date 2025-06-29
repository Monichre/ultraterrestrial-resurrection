"use client"

import type React from "react"

import { useRef, useState, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  FileText,
  Database,
  LinkIcon,
  Search,
  Filter,
  Maximize,
  Minimize,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Define the types for our evidence nodes and connections
interface EvidenceNode {
  id: string
  type: "document" | "testimony" | "event" | "artifact" | "person" | "location"
  title: string
  description?: string
  classification?: "top-secret" | "classified" | "confidential"
  credibilityScore?: number
  x: number
  y: number
}

interface EvidenceConnection {
  id: string
  from: string
  to: string
  type: "references" | "confirms" | "contradicts" | "relates-to" | "part-of"
  strength: number // 0-1 value representing connection strength
  color: string
}

interface EvidenceConnectionsProps {
  initialNodes?: EvidenceNode[]
  initialConnections?: EvidenceConnection[]
  onNodeSelect?: (nodeId: string) => void
}

export default function EvidenceConnections({
  initialNodes,
  initialConnections,
  onNodeSelect,
}: EvidenceConnectionsProps) {
  // Default nodes if none provided
  const defaultNodes: EvidenceNode[] = [
    {
      id: "7A-X119",
      type: "document",
      title: "Orbital Surveillance Data",
      description: "Surveillance data from sector 7",
      classification: "top-secret",
      credibilityScore: 0.92,
      x: 100,
      y: 200,
    },
    {
      id: "7A-X120",
      type: "testimony",
      title: "Agent Field Report",
      description: "Operation Stardust observations",
      classification: "classified",
      credibilityScore: 0.78,
      x: 400,
      y: 100,
    },
    {
      id: "7A-X121",
      type: "event",
      title: "Quantum Signature Anomaly",
      description: "Detected in sector 7",
      classification: "top-secret",
      credibilityScore: 0.85,
      x: 400,
      y: 300,
    },
    {
      id: "7B-X119",
      type: "person",
      title: "Agent Smith",
      description: "Field operative",
      classification: "confidential",
      credibilityScore: 0.95,
      x: 700,
      y: 150,
    },
    {
      id: "7C-X119",
      type: "artifact",
      title: "Recovered Material",
      description: "Unknown alloy composition",
      classification: "top-secret",
      credibilityScore: 0.89,
      x: 700,
      y: 350,
    },
  ]

  // Default connections if none provided
  const defaultConnections: EvidenceConnection[] = [
    {
      id: "conn-1",
      from: "7A-X119",
      to: "7A-X121",
      type: "confirms",
      strength: 0.9,
      color: "#4FABFF",
    },
    {
      id: "conn-2",
      from: "7A-X120",
      to: "7A-X121",
      type: "references",
      strength: 0.7,
      color: "#FFB7C5",
    },
    {
      id: "conn-3",
      from: "7B-X119",
      to: "7A-X120",
      type: "part-of",
      strength: 1.0,
      color: "#B1C5FF",
    },
    {
      id: "conn-4",
      from: "7A-X121",
      to: "7C-X119",
      type: "relates-to",
      strength: 0.6,
      color: "#FFDDB7",
    },
    {
      id: "conn-5",
      from: "7B-X119",
      to: "7C-X119",
      type: "contradicts",
      strength: 0.4,
      color: "#76E5FF",
    },
  ]

  // State for nodes and connections
  const [nodes, setNodes] = useState<EvidenceNode[]>(initialNodes || defaultNodes)
  const [connections, setConnections] = useState<EvidenceConnection[]>(initialConnections || defaultConnections)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [highlightedConnections, setHighlightedConnections] = useState<string[]>([])
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Create a fixed number of path length animations
  // This ensures we always have the same number of hooks regardless of connections array length
  const pathLength1 = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const pathLength2 = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const pathLength3 = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const pathLength4 = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const pathLength5 = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  // Combine them into an array
  const pathLengths = useMemo(() => {
    return [pathLength1, pathLength2, pathLength3, pathLength4, pathLength5]
  }, [pathLength1, pathLength2, pathLength3, pathLength4, pathLength5])

  // Helper to get node by ID
  const getNodeById = (id: string) => nodes.find((node) => node.id === id)

  // Create SVG path between nodes
  const createPath = (startX: number, startY: number, endX: number, endY: number) => {
    const midX = (startX + endX) / 2
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  }

  // Handle node selection
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId)

    if (nodeId === selectedNode) {
      // Deselect node
      setHighlightedConnections([])
    } else {
      // Highlight connections for this node
      const relatedConnections = connections
        .filter((conn) => conn.from === nodeId || conn.to === nodeId)
        .map((conn) => conn.id)

      setHighlightedConnections(relatedConnections)
    }

    // Call external handler if provided
    if (onNodeSelect) {
      onNodeSelect(nodeId)
    }
  }

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  // Reset view
  const handleReset = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
    setSelectedNode(null)
    setHighlightedConnections([])
  }

  // Panning functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setIsPanning(true)
      setStartPanPos({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - startPanPos.x,
        y: e.clientY - startPanPos.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleMouseLeave = () => {
    setIsPanning(false)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Get node type icon
  const getNodeIcon = (type: EvidenceNode["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-3.5 w-3.5" />
      case "testimony":
        return <Database className="h-3.5 w-3.5" />
      case "event":
        return <LinkIcon className="h-3.5 w-3.5" />
      case "artifact":
        return <Database className="h-3.5 w-3.5" />
      case "person":
        return <Database className="h-3.5 w-3.5" />
      case "location":
        return <Database className="h-3.5 w-3.5" />
      default:
        return <FileText className="h-3.5 w-3.5" />
    }
  }

  // Get connection type label
  const getConnectionTypeLabel = (type: EvidenceConnection["type"]) => {
    switch (type) {
      case "references":
        return "References"
      case "confirms":
        return "Confirms"
      case "contradicts":
        return "Contradicts"
      case "relates-to":
        return "Relates To"
      case "part-of":
        return "Part Of"
      default:
        return "Connected"
    }
  }

  return (
    <div
      className={cn(
        "relative border border-neutral-800 bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50" : "h-[calc(100vh-200px)] min-h-[600px]",
      )}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8 bg-black/40 border-neutral-800">
          <ZoomIn className="h-4 w-4 text-neutral-400" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8 bg-black/40 border-neutral-800"
        >
          <ZoomOut className="h-4 w-4 text-neutral-400" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} className="h-8 w-8 bg-black/40 border-neutral-800">
          <RefreshCw className="h-4 w-4 text-neutral-400" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="h-8 w-8 bg-black/40 border-neutral-800"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4 text-neutral-400" />
          ) : (
            <Maximize className="h-4 w-4 text-neutral-400" />
          )}
        </Button>
      </div>

      {/* Header */}
      <div className="border-b border-neutral-800 p-4">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4 text-neutral-500" />
          <h2 className="font-mono text-sm font-medium text-neutral-300">Evidence Connection Analysis</h2>
        </div>
      </div>

      {/* Search and filter */}
      <div className="border-b border-neutral-800 p-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search evidence connections..."
            className="w-full rounded border border-neutral-800 bg-black/20 py-2 pl-10 pr-4 font-mono text-sm text-neutral-300 placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700"
          />
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9 bg-black/40 border-neutral-800">
          <Filter className="h-4 w-4 text-neutral-400" />
        </Button>
      </div>

      {/* Connection visualization */}
      <div
        ref={containerRef}
        className="relative w-full h-[calc(100%-120px)] overflow-hidden"
        style={{
          cursor: isPanning ? "grabbing" : "grab",
          height: "calc(100% - 120px)",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dot Grid background */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            backgroundImage: `radial-gradient(circle at 12px 12px, rgba(255, 255, 255, 0.15) 2px, transparent 0)`,
            backgroundSize: `12px 12px`,
          }}
        />

        {/* Connection lines */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: "center",
          }}
        >
          <svg className="absolute inset-0 size-full pointer-events-none">
            {connections.map((connection, index) => {
              const fromNode = getNodeById(connection.from)
              const toNode = getNodeById(connection.to)

              if (!fromNode || !toNode) return null

              const path = createPath(fromNode.x + 100, fromNode.y + 30, toNode.x, toNode.y + 30)

              const isHighlighted = highlightedConnections.includes(connection.id) || !highlightedConnections.length

              // Use a fixed pathLength if available, otherwise use a static value
              const animatedPathLength = index < pathLengths.length ? pathLengths[index] : 1

              return (
                <g key={connection.id}>
                  <motion.path
                    d={path}
                    stroke={connection.color}
                    strokeWidth={connection.strength * 3}
                    strokeOpacity={isHighlighted ? 0.8 : 0.2}
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                  />

                  {/* Connection type label */}
                  {isHighlighted && (
                    <text
                      x={(fromNode.x + 100 + toNode.x) / 2}
                      y={(fromNode.y + 30 + toNode.y + 30) / 2 - 10}
                      fill="#888"
                      fontSize="10"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {getConnectionTypeLabel(connection.type)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className="absolute"
              style={{ left: node.x, top: node.y }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: Number.parseInt(node.id.split("-")[1]) * 0.05 }}
              onClick={() => handleNodeClick(node.id)}
            >
              <Card
                className={cn(
                  "w-[200px] bg-black border-neutral-800 transition-all duration-200",
                  selectedNode === node.id && "ring-2 ring-neutral-400",
                  node.classification === "top-secret" && "border-red-900/50",
                  node.classification === "classified" && "border-amber-900/50",
                  node.classification === "confidential" && "border-blue-900/50",
                  !highlightedConnections.length ||
                    connections.some(
                      (conn) =>
                        (conn.from === node.id || conn.to === node.id) && highlightedConnections.includes(conn.id),
                    )
                    ? "opacity-100"
                    : "opacity-40",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={cn(
                        "size-2 rounded-full",
                        node.type === "document" && "bg-blue-500",
                        node.type === "testimony" && "bg-green-500",
                        node.type === "event" && "bg-amber-500",
                        node.type === "artifact" && "bg-purple-500",
                        node.type === "person" && "bg-pink-500",
                        node.type === "location" && "bg-cyan-500",
                      )}
                    />
                    <span className="text-sm text-neutral-300 font-mono">{node.id}</span>

                    {node.credibilityScore !== undefined && (
                      <span className="ml-auto font-mono text-xs text-neutral-500">
                        σ = {node.credibilityScore.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-medium text-neutral-200 mb-1">{node.title}</h4>

                  {node.description && <p className="text-xs text-neutral-400 break-all">{node.description}</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/60 border border-neutral-800 rounded-md p-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-neutral-400">Document</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-neutral-400">Testimony</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-xs text-neutral-400">Event</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-xs text-neutral-400">Artifact</span>
          </div>
        </div>
      </div>
    </div>
  )
}
