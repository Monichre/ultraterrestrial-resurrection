"use client"

import { RotateCcw, Clock, Search, Plus, Sparkles, Save, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  useMindMapUiStore,
  type SessionEventType,
} from "@/features/mindmap/store/mindmap-ui-store"

const EVENT_ICONS: Record<SessionEventType, React.ReactNode> = {
  query: <Search size={14} strokeWidth={2} />,
  nodes_added: <Plus size={14} strokeWidth={2} />,
  analysis: <Sparkles size={14} strokeWidth={2} />,
  tour: <Compass size={14} strokeWidth={2} />,
  save: <Save size={14} strokeWidth={2} />,
}

const EVENT_COLORS: Record<SessionEventType, string> = {
  query: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  nodes_added: "bg-green-500/20 text-green-400 border-green-500/30",
  analysis: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  tour: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  save: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
}

function formatTime(timestamp: number) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(timestamp).toLocaleDateString()
}

export function HistoryPanel() {
  const { sessionEvents, clearSessionEvents } = useMindMapUiStore()

  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Session History</h3>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 hover:bg-white/10"
            onClick={clearSessionEvents}
            disabled={sessionEvents.length === 0}
            title="Clear history"
          >
            <RotateCcw size={14} strokeWidth={2} />
          </Button>
        </div>
        <p className="text-xs text-neutral-400 mt-1">A live log of this research session</p>
      </header>

      <div className="p-3 overflow-y-auto max-h-80">
        {sessionEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-500">
            <Clock size={20} className="mb-2 opacity-50" strokeWidth={2} />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs">Run a query to start the log</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessionEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-2 rounded-lg bg-neutral-700/30 hover:bg-neutral-700/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-700/50 mt-0.5">
                  {EVENT_ICONS[event.type]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${EVENT_COLORS[event.type]}`}>
                      {event.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} strokeWidth={2} />
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-white">{event.label}</p>
                  {event.detail && (
                    <p className="text-xs text-gray-400 line-clamp-2">{event.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-t-[#292f35] p-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{sessionEvents.length} events</span>
        </div>
      </footer>
    </div>
  )
}
