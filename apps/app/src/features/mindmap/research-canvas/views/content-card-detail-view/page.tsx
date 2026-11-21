"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Shield,
  ExternalLink,
  ChevronRight,
  Globe,
  Share2,
  Bookmark,
  AlertTriangle,
  FileText,
  Eye,
} from "lucide-react"
import { getIncidentById, getRelatedIncidents, UFO_SIGHTINGS } from "@/features/mindmap/research-canvas/data/ufo-sightings"

function IncidentDetailContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const incident = id ? getIncidentById(id) : null

  if (!incident) {
    // No id selected → show a browsable Case Files index instead of a dead-end.
    if (!id) {
      return (

        <div className="min-h-screen bg-background p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-muted-foreground" />
              <h1 className="text-2xl font-bold text-foreground">Case Files</h1>
            </div>
            <p className="text-muted-foreground mb-8">
              Select an incident to open its full case file.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {UFO_SIGHTINGS.map((sighting) => (
                <Link
                  key={sighting.id}
                  href={`?id=${sighting.id}`}
                  className="group block rounded-2xl border border-border bg-card hover:bg-accent/40 transition-colors overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {sighting.name}
                      </h2>
                      <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {sighting.classification}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {sighting.date}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{sighting.location}</span>
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{sighting.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Open case file
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      )
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Incident Not Found</h1>
          <p className="text-muted-foreground mb-6">The incident you are looking for does not exist in our database.</p>
          <Link
            href="?"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Files
          </Link>
        </div>
      </div>
    )
  }

  const relatedIncidents = getRelatedIncidents(incident.id)

  const getClassificationColor = (classification: string) => {
    // Microfilm Dark evidentiary hues — no purple/cyan SaaS gradients
    const colors: Record<string, string> = {
      CE1: "from-emerald-700 to-emerald-900",
      CE2: "from-amber-700 to-amber-900",
      CE3: "from-stone-600 to-stone-800",
      CE4: "from-red-800 to-red-950",
      Radar: "from-emerald-800 to-stone-900",
      Military: "from-amber-800 to-stone-900",
      Mass: "from-stone-500 to-stone-800",
    }
    return colors[classification] || "from-stone-600 to-stone-800"
  }

  const getClassificationDescription = (classification: string) => {
    const descriptions: Record<string, string> = {
      CE1: "Close Encounter of the First Kind - Visual sighting within 500 feet",
      CE2: "Close Encounter of the Second Kind - Physical evidence left behind",
      CE3: "Close Encounter of the Third Kind - Observation of beings",
      CE4: "Close Encounter of the Fourth Kind - Abduction or direct contact",
      Radar: "Confirmed by official radar tracking systems",
      Military: "Documented encounter by military personnel",
      Mass: "Witnessed by large groups of people simultaneously",
    }
    return descriptions[classification] || "Unclassified encounter"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] max-h-[600px]">
        <Image
          src={incident.image || "/placeholder.svg?height=600&width=1200&query=ufo mysterious night sky"}
          alt={incident.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

        {/* Back Button */}
        <Link
          href="/ufo-sightings"
          className="absolute top-24 left-6 flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm 
            border border-border rounded-lg text-foreground hover:bg-background transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Sightings</span>
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            {/* Classification Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4
                bg-gradient-to-r ${getClassificationColor(incident.classification)} text-white`}
            >
              {incident.classification}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance"
            >
              {incident.name}
            </motion.h1>

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-6 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>
                  {new Date(incident.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{incident.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>{incident.witnesses.toLocaleString()} witnesses</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                Case Summary
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-foreground/90 leading-relaxed">{incident.description}</p>
              </div>
            </motion.section>

            {/* Classification Details */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Classification Details
              </h3>
              <p className="text-muted-foreground">{getClassificationDescription(incident.classification)}</p>
            </motion.section>

            {/* Sources & Evidence */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                Sources & Evidence
              </h2>
              <div className="bg-card border border-border rounded-xl p-6">
                <ul className="space-y-3">
                  {incident.sources.map((source, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Location Map Placeholder */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                Location Data
              </h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <Image
                    src={`/vintage-world-map.png?height=400&width=800&query=map ${incident.location}`}
                    alt={`Map of ${incident.location}`}
                    fill
                    className="object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-foreground font-medium">{incident.location}</p>
                      <p className="text-sm text-muted-foreground">
                        {incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Related Incidents */}
            {relatedIncidents.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Related Incidents</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedIncidents.map((related) => (
                    <Link
                      key={related.id}
                      href={`/content-card-detail-view?id=${related.id}`}
                      className="group flex gap-4 p-4 bg-card border border-border rounded-xl 
                        hover:border-primary/50 transition-all"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={related.image || "/placeholder.svg"}
                          alt={related.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {related.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{new Date(related.date).getFullYear()}</p>
                        <p className="text-sm text-muted-foreground truncate">{related.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6 sticky top-24"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>

              <div className="space-y-4">
                {/* Credibility */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Credibility Rating</p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                      incident.credibility === "High"
                        ? "bg-green-500/20 text-green-400"
                        : incident.credibility === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    {incident.credibility} Credibility
                  </div>
                </div>

                {/* Witnesses */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Witness Count</p>
                  <p className="text-3xl font-bold text-primary">{incident.witnesses.toLocaleString()}</p>
                </div>

                {/* Sources */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Source Documents</p>
                  <p className="text-2xl font-bold text-foreground">{incident.sources.length}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {incident.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 
                    bg-primary text-primary-foreground rounded-xl font-medium 
                    hover:bg-primary/90 transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  Save to Collection
                </button>
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 
                    bg-muted text-foreground rounded-xl font-medium 
                    hover:bg-muted/80 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share Incident
                </button>
              </div>
            </motion.div>

            {/* Network Link */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Link
                href="/"
                className="block p-6 bg-gradient-to-br from-primary/10 to-accent/10 
                  border border-primary/30 rounded-xl hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">View in Network</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Explore connections with other incidents on the interactive timeline
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Open Explorer
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-card border-t border-border py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Explore More Encounters</h2>
          <p className="text-muted-foreground mb-6">
            Discover more documented UFO sightings from our comprehensive database
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/ufo-sightings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground 
                rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Sightings
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/search-and-discovery-interface"
              className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground 
                rounded-xl font-medium hover:bg-muted/80 transition-colors"
            >
              Search Database
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContentCardDetailViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading incident data...</p>
          </div>
        </div>
      }
    >
      <IncidentDetailContent />
    </Suspense>
  )
}
