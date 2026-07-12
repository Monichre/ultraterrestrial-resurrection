"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  X,
  Search,
  Globe,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
  Command,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewItem {
  id: string
  title: string
  description: string
  path: string
  icon: React.ReactNode
  preview: string
  color: string
  stats?: { label: string; value: string }[]
}

const VIEWS: ViewItem[] = [
  {
    id: "home",
    title: "Home",
    description: "Main dashboard with guided tours and AI-assisted research interface",
    path: "/",
    icon: <Sparkles size={24} />,
    preview: "/images/abstract-disclosure.png",
    color: "from-cyan-500/20 to-blue-500/20",
    stats: [
      { label: "Tours", value: "4" },
      { label: "AI Ready", value: "Yes" },
    ],
  },
  {
    id: "research-canvas",
    title: "Research Canvas",
    description: "Interactive workspace for deep investigation with node-based visualization",
    path: "/research-canvas",
    icon: <Layers size={24} />,
    preview: "/images/22.png",
    color: "from-violet-500/20 to-purple-500/20",
    stats: [
      { label: "Active Nodes", value: "24" },
      { label: "Connections", value: "67" },
    ],
  },
  {
    id: "timeline-explorer",
    title: "Timeline Explorer",
    description: "Navigate through decades of documented encounters with immersive 3D Z-axis scrolling",
    path: "/timeline-explorer",
    icon: <Clock size={24} />,
    preview: "/images/colares.png",
    color: "from-purple-500/20 to-pink-500/20",
    stats: [
      { label: "Events", value: "156" },
      { label: "Years Covered", value: "77" },
    ],
  },
  {
    id: "network-timeline",
    title: "Network Timeline",
    description: "Explore incident connections in an interactive network graph visualization",
    path: "/timeline",
    icon: <Layers size={24} />,
    preview: "/images/abstract-disclosure.png",
    color: "from-indigo-500/20 to-blue-500/20",
    stats: [
      { label: "Nodes", value: "45" },
      { label: "Links", value: "128" },
    ],
  },
  {
    id: "globe",
    title: "Global Sightings",
    description: "Explore worldwide UFO encounters on an interactive 3D globe visualization",
    path: "/ufo-sightings",
    icon: <Globe size={24} />,
    preview: "/images/digital-mischief-group-metallic-sphere-darting-above-atlantic-ad66a4d1-55b7-448c-acee-3e4bee70eb1c-0.png",
    color: "from-emerald-500/20 to-teal-500/20",
    stats: [
      { label: "Locations", value: "89" },
      { label: "Countries", value: "34" },
    ],
  },
  {
    id: "search",
    title: "Search & Discover",
    description: "Advanced search interface with filters for classification, date, and credibility",
    path: "/search-and-discovery-interface",
    icon: <Search size={24} />,
    preview: "/images/colares-beams.png",
    color: "from-orange-500/20 to-amber-500/20",
    stats: [
      { label: "Records", value: "2.4K" },
      { label: "Categories", value: "12" },
    ],
  },
  {
    id: "detail",
    title: "Case Files",
    description: "Deep dive into individual incidents with evidence, witnesses, and analysis",
    path: "/content-card-detail-view",
    icon: <FileText size={24} />,
    preview: "/images/0-2.jpg",
    color: "from-rose-500/20 to-red-500/20",
    stats: [
      { label: "Documents", value: "892" },
      { label: "Media Files", value: "1.2K" },
    ],
  },
]

interface FullScreenMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function FullScreenMenu({ isOpen, onClose }: FullScreenMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [hoveredView, setHoveredView] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setIsAnimating(true)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleNavigate = useCallback(
    (path: string) => {
      setIsAnimating(false)
      setTimeout(() => {
        onClose()
        router.push(path)
      }, 300)
    },
    [onClose, router]
  )

  if (!isOpen) return null

  const activeView = hoveredView ? VIEWS.find((v) => v.id === hoveredView) : null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex",
        isAnimating ? "animate-in fade-in duration-300" : "animate-out fade-out duration-300"
      )}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-neutral-950/95 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Background preview image */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-out",
          activeView ? "opacity-30" : "opacity-0"
        )}
      >
        {activeView && (
          <img
            src={activeView.preview || "/placeholder.svg"}
            alt=""
            className="w-full h-full object-cover scale-110 blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">UFO Disclosure Network</h1>
              <p className="text-neutral-500 text-sm">Research Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/50 text-neutral-400 text-sm">
              <Command size={14} />
              <span>K</span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-neutral-800/50 hover:bg-neutral-700/50 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col lg:flex-row px-8 pb-8 gap-8 overflow-hidden">
          {/* Navigation list */}
          <nav className="flex-1 flex flex-col justify-center max-w-2xl">
            <div className="space-y-2">
              {VIEWS.map((view, index) => {
                const isActive = pathname === view.path
                const isHovered = hoveredView === view.id

                return (
                  <button
                    key={view.id}
                    onClick={() => handleNavigate(view.path)}
                    onMouseEnter={() => setHoveredView(view.id)}
                    onMouseLeave={() => setHoveredView(null)}
                    className={cn(
                      "w-full group flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300",
                      "hover:bg-white/5",
                      isHovered && "bg-white/5 scale-[1.02]",
                      isActive && "bg-white/10"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
                        "bg-gradient-to-br",
                        view.color,
                        isHovered ? "scale-110" : "scale-100"
                      )}
                    >
                      <div className="text-white">{view.icon}</div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2
                          className={cn(
                            "text-xl font-medium transition-colors duration-300",
                            isHovered || isActive ? "text-white" : "text-neutral-300"
                          )}
                        >
                          {view.title}
                        </h2>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm mt-0.5 transition-colors duration-300 line-clamp-1",
                          isHovered ? "text-neutral-300" : "text-neutral-500"
                        )}
                      >
                        {view.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      size={20}
                      className={cn(
                        "text-neutral-500 transition-all duration-300",
                        isHovered && "text-white translate-x-1"
                      )}
                    />
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Preview panel - hidden on mobile */}
          <aside className="hidden lg:flex flex-1 items-center justify-center max-w-xl">
            <div
              className={cn(
                "w-full aspect-[4/3] rounded-3xl overflow-hidden transition-all duration-500",
                activeView ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              {activeView && (
                <div className="relative w-full h-full">
                  <img
                    src={activeView.preview || "/placeholder.svg"}
                    alt={activeView.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

                  {/* Stats overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex gap-6">
                      {activeView.stats?.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-2xl font-bold text-white">{stat.value}</div>
                          <div className="text-sm text-neutral-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-6">
              <span>Navigate with arrow keys</span>
              <span className="hidden sm:inline">Press Enter to select</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Press</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-xs">ESC</kbd>
              <span>to close</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
