"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UFO_SIGHTINGS, type UFOSighting } from "@/features/mindmap/research-canvas/data/ufo-sightings"
import { getSightings } from "@/features/mindmap/research-canvas/actions/get-sightings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, Users, Eye, Grid3X3, List, Globe2, X, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"



type ViewMode = "grid" | "list" | "map"
type SortOption = "date-desc" | "date-asc" | "witnesses" | "name"

const CLASSIFICATIONS = ["All", "CE1", "CE2", "CE3", "CE4", "Radar", "Military", "Mass"] as const
const CREDIBILITY_LEVELS = ["All", "High", "Medium", "Low"] as const
const DECADES = ["All", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s"] as const

export default function UFOSightingsPage() {
  const [sightings, setSightings] = useState<UFOSighting[]>(UFO_SIGHTINGS)
  const [totalLoaded, setTotalLoaded] = useState(UFO_SIGHTINGS.length)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [selectedClassification, setSelectedClassification] = useState<string>("All")
  const [selectedCredibility, setSelectedCredibility] = useState<string>("All")
  const [selectedDecade, setSelectedDecade] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<UFOSighting | null>(null)

  // Fetch real sightings from Postgres on mount
  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        const data = await getSightings({ limit: 50, offset: 0 })
        if (!cancelled) {
          setSightings(data)
          setTotalLoaded(data.length)
        }
      } catch {
        // fallback already returned by server action; keep initial state
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  // Filter and sort incidents
  const filteredIncidents = useMemo(() => {
    let filtered = [...sightings]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (incident) =>
          incident.name.toLowerCase().includes(query) ||
          incident.location.toLowerCase().includes(query) ||
          incident.description.toLowerCase().includes(query) ||
          incident.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Classification filter
    if (selectedClassification !== "All") {
      filtered = filtered.filter((incident) => incident.classification === selectedClassification)
    }

    // Credibility filter
    if (selectedCredibility !== "All") {
      filtered = filtered.filter((incident) => incident.credibility === selectedCredibility)
    }

    // Decade filter
    if (selectedDecade !== "All") {
      const decadeStart = Number.parseInt(selectedDecade.replace("s", ""))
      filtered = filtered.filter((incident) => {
        const year = new Date(incident.date).getFullYear()
        return year >= decadeStart && year < decadeStart + 10
      })
    }

    // Sort
    switch (sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "witnesses":
        filtered.sort((a, b) => b.witnesses - a.witnesses)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [sightings, searchQuery, selectedClassification, selectedCredibility, selectedDecade, sortBy])

  const activeFiltersCount = [
    selectedClassification !== "All",
    selectedCredibility !== "All",
    selectedDecade !== "All",
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedClassification("All")
    setSelectedCredibility("All")
    setSelectedDecade("All")
    setSearchQuery("")
  }

  const handleIncidentClick = (incident: UFOSighting) => {
    setSelectedIncident(incident)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">UFO Sightings Database</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore documented encounters from around the world. Filter by classification, credibility, and time
              period.
            </p>
          </motion.div>

          {/* Search and Controls */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search incidents, locations, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card border-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* Filter Toggle */}
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                {activeFiltersCount > 0 && (
                  <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                    Clear all
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="witnesses">Most Witnesses</option>
                  <option value="name">Alphabetical</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-card border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`p-2 rounded ${viewMode === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Globe2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Classification Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Classification</label>
                      <div className="flex flex-wrap gap-2">
                        {CLASSIFICATIONS.map((cls) => (
                          <button
                            key={cls}
                            onClick={() => setSelectedClassification(cls)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              selectedClassification === cls
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Credibility Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Credibility</label>
                      <div className="flex flex-wrap gap-2">
                        {CREDIBILITY_LEVELS.map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelectedCredibility(level)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              selectedCredibility === level
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Decade Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Decade</label>
                      <div className="flex flex-wrap gap-2">
                        {DECADES.map((decade) => (
                          <button
                            key={decade}
                            onClick={() => setSelectedDecade(decade)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              selectedDecade === decade
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {decade}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {isLoading ? "Loading sightings..." : `Showing ${filteredIncidents.length} of ${totalLoaded} incidents`}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {viewMode === "map" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <div className="h-[600px]">
                {/* <UFOGlobe
                  incidents={filteredIncidents}
                  onIncidentClick={handleIncidentClick}
                  selectedIncident={selectedIncident}
                /> */}
              </div>

              {/* Selected Incident Panel */}
              <AnimatePresence>
                {selectedIncident && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 bg-card border border-border rounded-xl p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={selectedIncident.image || "/placeholder.svg"}
                          alt={selectedIncident.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{selectedIncident.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {selectedIncident.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(selectedIncident.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {selectedIncident.witnesses.toLocaleString()} witnesses
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedIncident(null)}
                            className="flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {selectedIncident.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline">{selectedIncident.classification}</Badge>
                          <Badge
                            variant={
                              selectedIncident.credibility === "High"
                                ? "default"
                                : selectedIncident.credibility === "Medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {selectedIncident.credibility}
                          </Badge>
                          <Link href={`/content-card-detail-view?id=${selectedIncident.id}`}>
                            <Button size="sm" className="ml-auto gap-1">
                              <Eye className="w-4 h-4" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredIncidents.map((incident, index) => (
                <IncidentCard key={incident.id} incident={incident} index={index} />
              ))}
            </motion.div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
              {filteredIncidents.map((incident, index) => (
                <IncidentListItem key={incident.id} incident={incident} index={index} />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {filteredIncidents.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No incidents found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Incident Card Component
function IncidentCard({ incident, index }: { incident: UFOSighting; index: number }) {
  const credibilityColor = {
    High: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Low: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link href={`/content-card-detail-view?id=${incident.id}`}>
        <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={incident.image || "/placeholder.svg"}
              alt={incident.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

            {/* Classification Badge */}
            <Badge className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm">{incident.classification}</Badge>

            {/* Credibility Badge */}
            <Badge className={`absolute top-3 right-3 border ${credibilityColor[incident.credibility]}`}>
              {incident.credibility}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {incident.name}
            </h3>

            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {incident.location.split(",")[0]}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(incident.date).getFullYear()}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{incident.description}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{incident.witnesses.toLocaleString()} witnesses</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                <Eye className="w-4 h-4" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Incident List Item Component
function IncidentListItem({ incident, index }: { incident: UFOSighting; index: number }) {
  const credibilityColor = {
    High: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Low: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
      <Link href={`/content-card-detail-view?id=${incident.id}`}>
        <div className="group flex gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative w-32 h-24 md:w-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={incident.image || "/placeholder.svg"}
              alt={incident.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {incident.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {incident.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(incident.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {incident.witnesses.toLocaleString()} witnesses
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline">{incident.classification}</Badge>
                <Badge className={`border ${credibilityColor[incident.credibility]}`}>{incident.credibility}</Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 md:line-clamp-3">{incident.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {incident.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
