"use client"

import { useState } from "react"
import { Undo2, Redo2, RotateCcw, Clock, Type, Move, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PanelWrapper } from "./PanelWrapper"

interface HistoryAction {
  id: string
  type: "create" | "edit" | "delete" | "move" | "style"
  description: string
  timestamp: Date
  target: string
}

const HISTORY_ACTIONS: HistoryAction[] = [
  {
    id: "1",
    type: "create",
    description: "Added text layer 'Welcome'",
    timestamp: new Date(Date.now() - 30000),
    target: "Text Layer",
  },
  {
    id: "2",
    type: "style",
    description: "Changed background color",
    timestamp: new Date(Date.now() - 120000),
    target: "Background",
  },
  {
    id: "3",
    type: "move",
    description: "Moved button to center",
    timestamp: new Date(Date.now() - 180000),
    target: "CTA Button",
  },
  {
    id: "4",
    type: "edit",
    description: "Updated heading text",
    timestamp: new Date(Date.now() - 300000),
    target: "Main Heading",
  },
  {
    id: "5",
    type: "create",
    description: "Added hero image",
    timestamp: new Date(Date.now() - 450000),
    target: "Hero Image",
  },
  {
    id: "6",
    type: "delete",
    description: "Removed old logo",
    timestamp: new Date(Date.now() - 600000),
    target: "Logo",
  },
]

const ACTION_ICONS = {
  create: <Type size={14} strokeWidth={2} />,
  edit: <Type size={14} strokeWidth={2} />,
  delete: <Type size={14} strokeWidth={2} />,
  move: <Move size={14} strokeWidth={2} />,
  style: <Palette size={14} strokeWidth={2} />,
}

const ACTION_COLORS = {
  create: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  edit: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delete: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  move: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  style: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

export function HistoryPanel() {
  const [currentIndex, setCurrentIndex] = useState(2)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < HISTORY_ACTIONS.length - 1

  const handleUndo = () => {
    if (canUndo) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleRedo = () => {
    if (canRedo) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <PanelWrapper texture="noise" className="w-[340px]">
      <header className="border-b border-neutral-800/50 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">History</h3>
          <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10">
            <RotateCcw size={14} strokeWidth={2} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex items-center gap-2 h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo2 size={14} strokeWidth={2} />
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={!canRedo}
            className="flex items-center gap-2 h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Redo2 size={14} strokeWidth={2} />
            Redo
          </Button>
        </div>
      </header>

      <div className="p-3 overflow-y-auto max-h-80">
        <div className="space-y-2">
          {HISTORY_ACTIONS.map((action, index) => (
            <div
              key={action.id}
              className={`flex items-start gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                index <= currentIndex ? "bg-white/5 hover:bg-white/10" : "bg-neutral-800/30 opacity-50"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 mt-0.5">
                {ACTION_ICONS[action.type]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`text-xs ${ACTION_COLORS[action.type]}`}>{action.type}</Badge>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Clock size={10} strokeWidth={2} />
                    {formatTime(action.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-white">{action.description}</p>
                <p className="text-xs text-neutral-500">{action.target}</p>
              </div>

              {index === currentIndex && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-3" />}
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-neutral-800/50 p-2">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>{HISTORY_ACTIONS.length} actions</span>
          <span>
            Position: {currentIndex + 1}/{HISTORY_ACTIONS.length}
          </span>
        </div>
      </footer>
    </PanelWrapper>
  )
}
