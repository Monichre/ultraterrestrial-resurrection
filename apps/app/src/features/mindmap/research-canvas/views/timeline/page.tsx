"use client"

import type React from "react"
import { useState, useRef, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  X,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Info,
  Loader2,
} from "lucide-react"
import { UFO_SIGHTINGS, type UFOSighting } from "@/features/mindmap/research-canvas/data/ufo-sightings"
import { getTimelineEvents } from "@/features/timeline/get-timeline-events"

const CLASSIFICATIONS = ["all", "CE1", "CE2", "CE3", "CE4", "Radar", "Military", "Mass"] as const

const LEGEND: { cls: string; label: string }[] = [
  { cls: "CE1", label: "Close Encounter 1st Kind" },
  { cls: "CE2", label: "Close Encounter 2nd Kind" },
  { cls: "CE3", label: "Close Encounter 3rd Kind" },
  { cls: "CE4", label: "Close Encounter 4th Kind" },
  { cls: "Radar", label: "Radar Confirmed" },
  { cls: "Military", label: "Military Encounter" },
  { cls: "Mass", label: "Mass Sighting" },
]

function getNodeColor(classification: string) {
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

// Parse a fractional year (year + month/12) from an incident's date string.
// Falls back to extracting a 4-digit year if Date parsing fails.
function fractionalYear(date: string): number | null {
  const d = new Date(date)
  if (!Number.isNaN(d.getTime())) return d.getFullYear() + d.getMonth() / 12
  const m = date.match(/\b(1[89]\d{2}|20\d{2})\b/)
  return m ? Number(m[1]) : null
}

interface PlacedEvent {
  incident: UFOSighting
  year: number
  x: number
  side: "top" | "bottom"
  lane: number
}

const PX_PER_YEAR_DEFAULT = 90
const CARD_WIDTH = 200
const CARD_GAP = 16
const LANE_HEIGHT = 116
const TRACK_PAD = 160

export default function NetworkTimelineExplorer() {
  const [incidents, setIncidents] = useState<UFOSighting[]>(UFO_SIGHTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"static" | "database">("static")

  const [pxPerYear, setPxPerYear] = useState(PX_PER_YEAR_DEFAULT)
  const [selected, setSelected] = useState<UFOSighting | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [filterClassification, setFilterClassification] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load database events on mount; fall back to static data on error/empty.
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getTimelineEvents(150)
      .then((dbIncidents) => {
        if (cancelled) return
        if (dbIncidents.length > 0) {
          setIncidents(dbIncidents)
          setDataSource("database")
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(
    () =>
      filterClassification === "all"
        ? incidents
        : incidents.filter((i) => i.classification === filterClassification),
    [incidents, filterClassification],
  )

  // Lay events out along a horizontal time axis with greedy lane packing per
  // side so clustered dates don't overlap.
  const { placed, minYear, maxYear, trackWidth, decades } = useMemo(() => {
    const withYears = filtered
      .map((incident) => ({ incident, year: fractionalYear(incident.date) }))
      .filter((e): e is { incident: UFOSighting; year: number } => e.year !== null)
      .sort((a, b) => a.year - b.year)

    if (withYears.length === 0) {
      return { placed: [] as PlacedEvent[], minYear: 1947, maxYear: 2024, trackWidth: 800, decades: [] as number[] }
    }

    const min = Math.floor(withYears[0].year)
    const max = Math.ceil(withYears[withYears.length - 1].year)
    const laneEndX: Record<"top" | "bottom", number[]> = { top: [], bottom: [] }

    const placedEvents: PlacedEvent[] = withYears.map((e, i) => {
      const x = TRACK_PAD + (e.year - min) * pxPerYear
      const side: "top" | "bottom" = i % 2 === 0 ? "top" : "bottom"
      const lanes = laneEndX[side]
      let lane = lanes.findIndex((end) => x - end > CARD_GAP)
      if (lane === -1) {
        lane = lanes.length
        lanes.push(0)
      }
      lanes[lane] = x + CARD_WIDTH
      return { incident: e.incident, year: e.year, x, side, lane }
    })

    const width = TRACK_PAD * 2 + (max - min) * pxPerYear
    const firstDecade = Math.floor(min / 10) * 10
    const decadeTicks: number[] = []
    for (let d = firstDecade; d <= max; d += 10) decadeTicks.push(d)

    return { placed: placedEvents, minYear: min, maxYear: max, trackWidth: Math.max(width, 800), decades: decadeTicks }
  }, [filtered, pxPerYear])

  const connectionCount = useMemo(
    () =>
      filtered.reduce(
        (acc, i) => acc + i.relatedIncidents.filter((r) => filtered.some((f) => f.id === r)).length,
        0,
      ),
    [filtered],
  )

  const resetZoom = () => setPxPerYear(PX_PER_YEAR_DEFAULT)

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col">
      {/* Top bar — left padding clears the global ULTRATERRESTRIAL wordmark */}
      <div className="relative z-20 flex items-center justify-between gap-4 pl-56 pr-6 pt-5 pb-3 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Timeline Explorer</h1>
          <span className="text-xs text-muted-foreground font-mono">
            {minYear}–{maxYear}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading events…
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {placed.length} {dataSource === "database" ? "events" : "static events"} · {connectionCount} links
            </span>
          )}
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showFilters || filterClassification !== "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-muted"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {filterClassification === "all" ? "Filter" : filterClassification}
          </button>
        </div>
      </div>

      {/* Scrollable timeline track */}
      <div ref={scrollRef} className="relative flex-1 overflow-x-auto overflow-y-hidden">
        <div className="relative h-full" style={{ width: trackWidth }}>
          {/* Decade gridlines + labels */}
          {decades.map((decade) => {
            const x = TRACK_PAD + (decade - minYear) * pxPerYear
            return (
              <div key={decade} className="absolute top-0 bottom-0 pointer-events-none" style={{ left: x }}>
                <div className="absolute top-12 bottom-12 w-px bg-border/30" />
                <span className="absolute top-4 -translate-x-1/2 text-[11px] font-mono text-muted-foreground/70">
                  {decade}s
                </span>
              </div>
            )
          })}

          {/* Center axis */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Events */}
          {placed.map((evt) => {
            const cx = evt.x
            const isHover = hovered === evt.incident.id
            const isSelected = selected?.id === evt.incident.id
            const cardOffset = 36 + evt.lane * LANE_HEIGHT
            return (
              <div key={evt.incident.id}>
                {/* connector */}
                <div
                  className="absolute w-px bg-border/50"
                  style={{
                    left: cx,
                    ...(evt.side === "top"
                      ? { top: `calc(50% - ${cardOffset}px)`, height: cardOffset }
                      : { top: "50%", height: cardOffset }),
                  }}
                />

                {/* axis marker */}
                <button
                  onMouseEnter={() => setHovered(evt.incident.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(evt.incident)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 z-10 cursor-pointer"
                  style={{ left: cx }}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-gradient-to-br ${getNodeColor(
                      evt.incident.classification,
                    )} ring-2 ring-background transition-transform ${
                      isHover || isSelected ? "scale-150" : "scale-100"
                    }`}
                  />
                </button>

                {/* card */}
                <motion.button
                  layout
                  onMouseEnter={() => setHovered(evt.incident.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(evt.incident)}
                  className={`absolute -translate-x-1/2 w-[200px] text-left rounded-xl border p-3 transition-colors cursor-pointer backdrop-blur-sm ${
                    isHover || isSelected
                      ? "bg-card border-primary/60 shadow-xl shadow-primary/10 z-20"
                      : "bg-card/80 border-border hover:border-border z-0"
                  }`}
                  style={{
                    left: cx,
                    ...(evt.side === "top"
                      ? { top: `calc(50% - ${cardOffset}px)`, transform: "translate(-50%, -100%)" }
                      : { top: `calc(50% + ${cardOffset}px)` }),
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full bg-gradient-to-br ${getNodeColor(
                        evt.incident.classification,
                      )}`}
                    />
                    <span className="text-[11px] font-mono font-semibold text-primary">
                      {Math.floor(evt.year)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                    {evt.incident.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{evt.incident.location}</span>
                  </p>
                </motion.button>
              </div>
            )
          })}

          {/* Empty state */}
          {!isLoading && placed.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              No events match this filter.
            </div>
          )}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-3 py-1.5">
        <button onClick={() => setPxPerYear((p) => Math.max(30, p * 0.8))} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
          <ZoomOut className="w-4 h-4 text-foreground" />
        </button>
        <span className="text-xs text-muted-foreground font-mono min-w-[3.5rem] text-center">
          {Math.round((pxPerYear / PX_PER_YEAR_DEFAULT) * 100)}%
        </span>
        <button onClick={() => setPxPerYear((p) => Math.min(260, p * 1.2))} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
          <ZoomIn className="w-4 h-4 text-foreground" />
        </button>
        <div className="w-px h-5 bg-border" />
        <button onClick={resetZoom} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
          <Maximize2 className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 z-20 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-3 hidden md:block">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-1.5 text-xs">
          <Info className="w-3.5 h-3.5" />
          Legend
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          {LEGEND.map(({ cls, label }) => (
            <div key={cls} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${getNodeColor(cls)}`} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-6 top-20 z-30 bg-card border border-border rounded-xl p-4 w-60 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">Classification</h3>
              <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CLASSIFICATIONS.map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    setFilterClassification(cls)
                    setShowFilters(false)
                  }}
                  className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                    filterClassification === cls
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/40 hover:bg-muted text-foreground"
                  }`}
                >
                  {cls === "all" ? "All" : cls}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected event detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl overflow-y-auto z-50"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={selected.image || "/placeholder.svg"}
                alt={selected.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 -mt-16 relative">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-gradient-to-r ${getNodeColor(
                  selected.classification,
                )} text-white`}
              >
                {selected.classification}
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">{selected.name}</h2>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selected.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selected.location}
                </div>
                {selected.witnesses > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selected.witnesses.toLocaleString()} witnesses
                  </div>
                )}
              </div>

              <p className="text-foreground/80 leading-relaxed mb-6">{selected.description}</p>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Credibility</h4>
                <div
                  className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                    selected.credibility === "High"
                      ? "bg-green-500/20 text-green-400"
                      : selected.credibility === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {selected.credibility}
                </div>
              </div>

              {selected.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.sources.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Sources</h4>
                  <ul className="space-y-1">
                    {selected.sources.map((source, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-primary" />
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
              >
                Close
                <ExternalLink className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
