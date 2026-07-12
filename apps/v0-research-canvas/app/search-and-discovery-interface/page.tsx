"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Sparkles,
  Filter,
  MapPin,
  Users,
  ChevronRight,
  Bookmark,
  History,
  Lightbulb,
  ArrowRight,
  Grid3X3,
} from "lucide-react"
import FloatingHeader from "@/components/ui/FloatingHeader"
import { MenuTrigger } from "@/components/navigation/MenuTrigger"
import { UFO_SIGHTINGS } from "@/data/ufo-sightings"

// Saved searches (simulated)
const SAVED_SEARCHES = [
  { id: 1, query: "Military encounters", count: 3 },
  { id: 2, query: "Mass sightings 1990s", count: 2 },
  { id: 3, query: "Close encounters", count: 5 },
]

// Trending topics
const TRENDING_TOPICS = [
  { label: "Tic Tac UFOs", count: 156 },
  { label: "Triangle Craft", count: 89 },
  { label: "Government Disclosure", count: 234 },
  { label: "Abduction Cases", count: 45 },
]

// Exploration suggestions based on categories
const EXPLORATION_SUGGESTIONS = [
  {
    title: "Military Encounters",
    description: "Official military personnel sightings",
    icon: "🎖️",
    query: "Military",
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Mass Sightings",
    description: "Events witnessed by thousands",
    icon: "👥",
    query: "Mass",
    color: "from-yellow-500 to-orange-600",
  },
  {
    title: "Close Encounters",
    description: "Direct contact events",
    icon: "👽",
    query: "CE",
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Radar Confirmed",
    description: "Tracked by official radar systems",
    icon: "📡",
    query: "Radar",
    color: "from-green-500 to-teal-600",
  },
]

export default function SearchAndDiscoveryInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(["Phoenix Lights", "Roswell", "Belgium triangle"])
  const [activeFilters, setActiveFilters] = useState<{
    decade: string
    classification: string
    credibility: string
  }>({
    decade: "all",
    classification: "all",
    credibility: "all",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [savedSearches, setSavedSearches] = useState(SAVED_SEARCHES)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    let results = UFO_SIGHTINGS.filter(
      (incident) =>
        incident.name.toLowerCase().includes(query) ||
        incident.description.toLowerCase().includes(query) ||
        incident.location.toLowerCase().includes(query) ||
        incident.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        incident.classification.toLowerCase().includes(query),
    )

    // Apply filters
    if (activeFilters.decade !== "all") {
      results = results.filter((incident) => {
        const year = new Date(incident.date).getFullYear()
        const decade = Math.floor(year / 10) * 10
        return decade.toString() === activeFilters.decade
      })
    }

    if (activeFilters.classification !== "all") {
      results = results.filter((i) => i.classification === activeFilters.classification)
    }

    if (activeFilters.credibility !== "all") {
      results = results.filter((i) => i.credibility === activeFilters.credibility)
    }

    return results
  }, [searchQuery, activeFilters])

  // Suggestions based on partial query
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []

    const query = searchQuery.toLowerCase()
    const allTerms = new Set<string>()

    UFO_SIGHTINGS.forEach((incident) => {
      if (incident.name.toLowerCase().includes(query)) {
        allTerms.add(incident.name)
      }
      incident.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(query)) {
          allTerms.add(tag)
        }
      })
      const location = incident.location.split(",")[0]
      if (location?.toLowerCase().includes(query)) {
        allTerms.add(location.trim())
      }
    })

    return Array.from(allTerms).slice(0, 5)
  }, [searchQuery])

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (query.trim() && !recentSearches.includes(query)) {
        setRecentSearches((prev) => [query, ...prev.slice(0, 4)])
      }
    },
    [recentSearches],
  )

  const clearSearch = () => {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }

  const clearFilters = () => {
    setActiveFilters({ decade: "all", classification: "all", credibility: "all" })
  }

  const hasActiveFilters = Object.values(activeFilters).some((v) => v !== "all")

  const decades = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]
  const classifications = ["CE1", "CE2", "CE3", "CE4", "Radar", "Military", "Mass"]
  const credibilities = ["High", "Medium", "Low"]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isSearchFocused) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === "Escape" && isSearchFocused) {
        searchInputRef.current?.blur()
        setIsSearchFocused(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSearchFocused])

  return (
    <div className="min-h-screen bg-background">
<FloatingHeader />
      <MenuTrigger />
  
  <div className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              <span className="bg-gradient-to-r from-primary via-accent to-chart-4 bg-clip-text text-transparent">
                Discover
              </span>{" "}
              the Unknown
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Search through decades of documented UFO encounters and phenomena
            </motion.p>
          </div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-8"
          >
            <div
              className={`
              relative bg-card border rounded-2xl transition-all duration-300
              ${
                isSearchFocused
                  ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }
            `}
            >
              <div className="flex items-center">
                <Search className="absolute left-5 w-5 h-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search incidents, locations, phenomena..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full pl-14 pr-32 py-4 bg-transparent text-foreground 
                    placeholder-muted-foreground focus:outline-none text-lg"
                />
                <div className="absolute right-4 flex items-center gap-2">
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors ${
                      showFilters || hasActiveFilters
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <kbd
                    className="hidden sm:block px-2 py-1 text-xs text-muted-foreground 
                    bg-muted rounded border border-border"
                  >
                    /
                  </kbd>
                </div>
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {isSearchFocused && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border 
                      rounded-xl shadow-xl overflow-hidden z-20"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors 
                          flex items-center gap-3 group"
                      >
                        <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        <span className="text-foreground">{suggestion}</span>
                        <ArrowRight
                          className="w-4 h-4 text-muted-foreground ml-auto opacity-0 
                          group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Filters</h3>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Decade Filter */}
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Decade</label>
                        <select
                          value={activeFilters.decade}
                          onChange={(e) => setActiveFilters((prev) => ({ ...prev, decade: e.target.value }))}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg 
                            text-foreground focus:ring-2 focus:ring-primary"
                        >
                          <option value="all">All Decades</option>
                          {decades.map((decade) => (
                            <option key={decade} value={decade}>
                              {decade}s
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Classification Filter */}
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Type</label>
                        <select
                          value={activeFilters.classification}
                          onChange={(e) => setActiveFilters((prev) => ({ ...prev, classification: e.target.value }))}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg 
                            text-foreground focus:ring-2 focus:ring-primary"
                        >
                          <option value="all">All Types</option>
                          {classifications.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Credibility Filter */}
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Credibility</label>
                        <select
                          value={activeFilters.credibility}
                          onChange={(e) => setActiveFilters((prev) => ({ ...prev, credibility: e.target.value }))}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg 
                            text-foreground focus:ring-2 focus:ring-primary"
                        >
                          <option value="all">All Levels</option>
                          {credibilities.map((cred) => (
                            <option key={cred} value={cred}>
                              {cred}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Search Results or Discovery Content */}
          <AnimatePresence mode="wait">
            {searchQuery.trim() ? (
              // Search Results
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                  </h2>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((incident, index) => (
                      <motion.div
                        key={incident.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/content-card-detail-view?id=${incident.id}`}
                          className="flex gap-4 p-4 bg-card border border-border rounded-xl 
                            hover:border-primary/50 transition-all group"
                        >
                          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={incident.image || "/placeholder.svg"}
                              alt={incident.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary font-medium">
                                {incident.classification}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(incident.date).getFullYear()}
                              </span>
                            </div>

                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                              {incident.name}
                            </h3>

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{incident.description}</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {incident.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {incident.witnesses} witnesses
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            className="w-5 h-5 text-muted-foreground group-hover:text-primary 
                            group-hover:translate-x-1 transition-all self-center"
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">Try different keywords or adjust your filters</p>
                    <button
                      onClick={clearSearch}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              // Discovery Content
              <motion.div
                key="discovery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-muted-foreground" />
                      <h2 className="text-lg font-semibold text-foreground">Recent Searches</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground 
                            hover:border-primary/50 hover:bg-muted transition-all flex items-center gap-2 group"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {search}
                          <ArrowRight
                            className="w-3 h-3 text-muted-foreground opacity-0 
                            group-hover:opacity-100 transition-opacity"
                          />
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* Exploration Suggestions */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Explore by Category</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {EXPLORATION_SUGGESTIONS.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSearch(suggestion.query)}
                        className="p-5 bg-card border border-border rounded-xl text-left 
                          hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 
                          transition-all group"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${suggestion.color} 
                          flex items-center justify-center text-2xl mb-3`}
                        >
                          {suggestion.icon}
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {suggestion.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </section>

                {/* Trending Topics */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Trending Topics</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {TRENDING_TOPICS.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(topic.label)}
                        className="px-4 py-2 bg-card border border-border rounded-full 
                          hover:border-primary/50 hover:bg-muted transition-all 
                          flex items-center gap-2 group"
                      >
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-foreground">{topic.label}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {topic.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Saved Searches */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Bookmark className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Saved Searches</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {savedSearches.map((saved) => (
                      <button
                        key={saved.id}
                        onClick={() => handleSearch(saved.query)}
                        className="p-4 bg-card border border-border rounded-xl text-left 
                          hover:border-primary/50 transition-all group flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {saved.query}
                          </h4>
                          <p className="text-sm text-muted-foreground">{saved.count} results</p>
                        </div>
                        <ChevronRight
                          className="w-5 h-5 text-muted-foreground group-hover:text-primary 
                          group-hover:translate-x-1 transition-all"
                        />
                      </button>
                    ))}
                  </div>
                </section>

                {/* Quick Links */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Grid3X3 className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Quick Links</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/ufo-sightings"
                      className="px-5 py-3 bg-primary text-primary-foreground rounded-xl 
                        font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      Browse All Sightings
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/"
                      className="px-5 py-3 bg-card border border-border text-foreground rounded-xl 
                        font-medium hover:border-primary/50 transition-colors flex items-center gap-2"
                    >
                      Network Timeline
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
