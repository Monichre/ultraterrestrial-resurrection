"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"
import { type NodeType, useReactFlow } from "@/contexts/ReactFlowContext"
import { cn } from "@/lib/utils"

interface NodeDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const nodeTypeColors: Record<NodeType, string> = {
  topic: "bg-purple-500",
  event: "bg-blue-500",
  keyFigure: "bg-green-500",
  testimony: "bg-yellow-500",
  organization: "bg-red-500",
  caseFile: "bg-indigo-500",
  artifact: "bg-pink-500",
}

const nodeTypeIcons: Record<NodeType, string> = {
  topic: "🔍",
  event: "📅",
  keyFigure: "👤",
  testimony: "💬",
  organization: "🏢",
  caseFile: "📁",
  artifact: "🏺",
}

export function NodeDropdown({ isOpen, onClose }: NodeDropdownProps) {
  const { nodes, selectNode, deselectNode, isNodeSelected } = useReactFlow()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNodes = nodes.filter((node) => node.data.label.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleNodeClick = (nodeId: string) => {
    if (isNodeSelected(nodeId)) {
      deselectNode(nodeId)
    } else {
      selectNode(nodeId)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute left-full ml-2 top-0 z-50 w-72 bg-neutral-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, x: -20, height: 0 }}
          animate={{ opacity: 1, x: 0, height: "auto" }}
          exit={{ opacity: 0, x: -20, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-100">Knowledge Graph Nodes</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#adf0dd]"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                    isNodeSelected(node.id) ? "bg-zinc-800 text-[#adf0dd]" : "hover:bg-zinc-800 text-zinc-100",
                  )}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <div
                    className={cn("w-6 h-6 rounded-full flex items-center justify-center", nodeTypeColors[node.type])}
                  >
                    <span className="text-xs">{nodeTypeIcons[node.type]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{node.data.label}</p>
                    <p className="text-xs text-zinc-400 truncate">{node.type}</p>
                  </div>
                  {isNodeSelected(node.id) && <Check className="h-4 w-4 text-[#adf0dd]" />}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-4 text-zinc-400 text-sm">No nodes found matching "{searchQuery}"</div>
            )}
          </div>
          <div className="p-3 border-t border-zinc-800 flex justify-between">
            <span className="text-xs text-zinc-400">
              {filteredNodes.length} node{filteredNodes.length !== 1 ? "s" : ""}
            </span>
            <button className="text-xs text-[#adf0dd] hover:underline" onClick={onClose}>
              Done
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
