"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Calendar, MapPin, Users, ChevronDown, ChevronUp, ExternalLink, Radar, Shield, Eye, Zap } from "lucide-react"


interface FrameRef {
  element: HTMLDivElement | null
  zValue: number
}

const PERSPECTIVE = 800
const Z_SPACING = -2000
const SCROLL_MULTIPLIER = -2 // Negative to move frames towards camera on scroll down

const getClassificationColor = (classification: string) => {
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

const getClassificationIcon = (classification: string) => {
  const icons: Record<string, React.ReactNode> = {
    CE1: <Eye className="w-4 h-4" />,
    CE2: <Zap className="w-4 h-4" />,
    CE3: <Users className="w-4 h-4" />,
    CE4: <Shield className="w-4 h-4" />,
    Radar: <Radar className="w-4 h-4" />,
    Military: <Shield className="w-4 h-4" />,
    Mass: <Users className="w-4 h-4" />,
  }
  return icons[classification] || <Eye className="w-4 h-4" />
}

interface TimelineEvent {
  name: string
  date: string
  location: string
  description: string
  classification: string
  sources?: string[]
}

export const ScrollTimeline = ({ ufoTimelineData }: { ufoTimelineData: TimelineEvent[] }) => {
  const [currentSection, setCurrentSection] = useState(0)

  const lastPosRef = useRef(0)
  const zValues = useRef<number[]>([])
  const framesRef = useRef<(HTMLDivElement | null)[]>([])

  const numSections = ufoTimelineData.length

  useEffect(() => {
    zValues.current = Array.from({ length: numSections }, (_, i) => (numSections - 1 - i) * Z_SPACING)
    framesRef.current = framesRef.current.slice(0, numSections)

    console.log("[v0] Initialized zValues:", zValues.current)
  }, [numSections])

  useEffect(() => {
    const handleScroll = () => {
      const top = document.documentElement.scrollTop || document.body.scrollTop
      const delta = lastPosRef.current - top
      lastPosRef.current = top
      setScrollY(top)

      let closestSection = 0
      let closestDistance = Number.POSITIVE_INFINITY

      for (let i = 0; i < framesRef.current.length; i++) {
        const frame = framesRef.current[i]
        if (!frame) continue

        zValues.current[i] += delta * SCROLL_MULTIPLIER

        const newZVal = zValues.current[i]

        let opacity = 1
        let display = "flex"

        if (newZVal > PERSPECTIVE) {
          display = "none"
          opacity = 0
        } else if (newZVal > 0) {
          opacity = 1 - newZVal / PERSPECTIVE
        } else if (newZVal < -PERSPECTIVE * 4) {
          opacity = Math.max(0, 1 + (newZVal + PERSPECTIVE * 4) / PERSPECTIVE)
        }

        const distance = Math.abs(newZVal)
        if (distance < closestDistance && newZVal <= 100 && newZVal > -PERSPECTIVE * 3) {
          closestDistance = distance
          closestSection = i
        }

        frame.style.transform = `translateZ(${newZVal}px)`
        frame.style.opacity = Math.max(0, Math.min(1, opacity)).toString()
        frame.style.display = display
        frame.style.zIndex = (1000 - i).toString()
      }

      setCurrentSection(closestSection)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [numSections])

  const scrollToSection = (index: number) => {
    const targetZ = 0
    const currentZ = zValues.current[index] || 0
    const scrollDelta = (currentZ - targetZ) / SCROLL_MULTIPLIER

    window.scrollBy({
      top: scrollDelta,
      behavior: "smooth",
    })
  }

  const navigateSection = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev" ? Math.max(0, currentSection - 1) : Math.min(numSections - 1, currentSection + 1)
    scrollToSection(newIndex)
  }

  return (
    <>
      <div className="relative" style={{ height: `${numSections * 100 + 100}vh` }}>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-background">
            <div className="absolute inset-0 stars-bg opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              perspective: `${PERSPECTIVE}px`,
              perspectiveOrigin: "50% 50%",
              transformStyle: "preserve-3d",
            }}
          >
            {ufoTimelineData.map((section, index) => {
              const eventData = getEventData(section.events[0]?.id || "")

              return (
                <div
                  key={section.year}
                  ref={(el) => {
                    framesRef.current[index] = el
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    transform: `translateZ(${zValues.current[index] ?? (numSections - 1 - index) * Z_SPACING}px)`,
                  }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    {section.backgroundImage && (
                      <>
                        <img
                          src={section.backgroundImage || "/placeholder.svg"}
                          alt={section.description}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0" style={{ backgroundColor: section.backgroundOverlay }} />
                      </>
                    )}
                    {!section.backgroundImage && (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: section.backgroundColor || "var(--background)" }}
                      />
                    )}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
                  </div>

                  <div className="relative z-10 max-w-lg mx-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                        <div className="relative px-6 py-2 bg-background/80 backdrop-blur-md border border-primary/50 rounded-full">
                          <span className="text-4xl font-bold text-primary font-mono">{section.year}</span>
                        </div>
                      </div>
                    </div>

                    {eventData && (
                      <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
                        <div
                          className={`px-6 py-3 bg-gradient-to-r ${getClassificationColor(eventData.classification)} flex items-center gap-2`}
                        >
                          {getClassificationIcon(eventData.classification)}
                          <span className="text-sm font-semibold text-white">{eventData.classification}</span>
                        </div>

                        <div className="p-6">
                          <h2 className="text-2xl font-bold text-foreground mb-2">{eventData.title}</h2>

                          <p className="text-muted-foreground mb-4 leading-relaxed">{eventData.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-primary" />
                              {section.events[0]?.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              {eventData.location.split(",")[0]}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-primary" />
                              {eventData.witnesses.toLocaleString()} witnesses
                            </div>
                          </div>

                          <Link
                            href={`/content-card-detail-view?id=${section.events[0]?.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 
                              text-primary rounded-lg transition-colors text-sm font-medium"
                          >
                            Explore Case
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
            {ufoTimelineData.map((section, index) => (
              <button
                key={section.year}
                onClick={() => scrollToSection(index)}
                className={`group relative flex items-center gap-3 transition-all duration-300 ${
                  index === currentSection ? "scale-110" : "opacity-50 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSection
                      ? "bg-primary shadow-lg shadow-primary/50"
                      : "bg-muted-foreground/50 group-hover:bg-muted-foreground"
                  }`}
                />
                <AnimatePresence>
                  {index === currentSection && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-mono text-primary whitespace-nowrap"
                    >
                      {section.year}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
            <button
              onClick={() => navigateSection("prev")}
              disabled={currentSection === 0}
              className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-full
                hover:bg-card transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => navigateSection("next")}
              disabled={currentSection === numSections - 1}
              className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-full
                hover:bg-card transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <AnimatePresence>
            {currentSection === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50"
              >
                <span className="text-sm text-muted-foreground">Scroll to explore</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                  <ChevronDown className="w-6 h-6 text-primary" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="fixed bottom-8 right-6 z-50">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl px-4 py-2">
              <span className="text-2xl font-bold text-primary font-mono">{currentSection + 1}</span>
              <span className="text-muted-foreground mx-1">/</span>
              <span className="text-muted-foreground font-mono">{numSections}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .stars-bg {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 230px 80px, white, transparent),
            radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 370px 200px, white, transparent),
            radial-gradient(2px 2px at 450px 50px, rgba(255,255,255,0.8), transparent);
          background-size: 500px 300px;
          animation: twinkle 8s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  )
}
