"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Calendar, MapPin, Users, Clock, ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Sighting {
  id: string
  date: string
  location: string
  coordinates: string
  witnesses: number
  duration: string
  description: string
  classification: "verified" | "unverified" | "debunked"
  type: "light" | "craft" | "entity" | "abduction" | "other"
}

const sightings: Sighting[] = [
  {
    id: "SIGHT-001",
    date: "2077-01-15",
    location: "Phoenix, Arizona",
    coordinates: "33.4484° N, 112.0740° W",
    witnesses: 27,
    duration: "2 hours 15 minutes",
    description: "Multiple V-shaped formations of lights moving slowly across the night sky. No sound reported.",
    classification: "verified",
    type: "light",
  },
  {
    id: "SIGHT-002",
    date: "2077-02-03",
    location: "Roswell, New Mexico",
    coordinates: "33.3943° N, 104.5230° W",
    witnesses: 3,
    duration: "45 minutes",
    description: "Disc-shaped craft hovering over desert area. Emitted bright blue light before rapidly ascending.",
    classification: "unverified",
    type: "craft",
  },
  {
    id: "SIGHT-003",
    date: "2077-02-17",
    location: "Rendlesham Forest, UK",
    coordinates: "52.0964° N, 1.4359° E",
    witnesses: 12,
    duration: "3 hours",
    description:
      "Military personnel reported unusual lights and a landed triangular craft in the forest. Physical evidence collected.",
    classification: "verified",
    type: "craft",
  },
  {
    id: "SIGHT-004",
    date: "2077-03-01",
    location: "Gulf Breeze, Florida",
    coordinates: "30.3571° N, 87.1644° W",
    witnesses: 1,
    duration: "10 minutes",
    description: "Photographer captured multiple images of a glowing oval object. Later determined to be a hoax.",
    classification: "debunked",
    type: "craft",
  },
  {
    id: "SIGHT-005",
    date: "2077-03-10",
    location: "Pascagoula, Mississippi",
    coordinates: "30.3658° N, 88.5561° W",
    witnesses: 2,
    duration: "30 minutes",
    description:
      "Two fishermen claimed to be abducted by floating entities with claw-like hands. Passed polygraph tests.",
    classification: "unverified",
    type: "abduction",
  },
]

export default function SightingDatabase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSighting, setExpandedSighting] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof Sighting>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredSightings = sightings
    .filter(
      (sighting) =>
        sighting.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sighting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sighting.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortField === "witnesses") {
        return sortDirection === "asc" ? a.witnesses - b.witnesses : b.witnesses - a.witnesses
      }

      const aValue = a[sortField].toString()
      const bValue = b[sortField].toString()

      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    })

  const toggleSort = (field: keyof Sighting) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Get classification badge color
  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "verified":
        return "bg-green-900/30 text-green-400 border-green-900/50"
      case "unverified":
        return "bg-amber-900/30 text-amber-400 border-amber-900/50"
      case "debunked":
        return "bg-red-900/30 text-red-400 border-red-900/50"
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-800"
    }
  }

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "light":
        return "bg-blue-900/30 text-blue-400 border-blue-900/50"
      case "craft":
        return "bg-purple-900/30 text-purple-400 border-purple-900/50"
      case "entity":
        return "bg-teal-900/30 text-teal-400 border-teal-900/50"
      case "abduction":
        return "bg-pink-900/30 text-pink-400 border-pink-900/50"
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-800"
    }
  }

  return (
    <div className="flex flex-col h-[600px] border border-neutral-800 rounded-lg bg-black/40">
      <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search sightings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-black/20 border-neutral-800"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-black/20 border-neutral-800">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black/90 border-neutral-800">
            <DropdownMenuItem>Verified Sightings</DropdownMenuItem>
            <DropdownMenuItem>Unverified Sightings</DropdownMenuItem>
            <DropdownMenuItem>Debunked Sightings</DropdownMenuItem>
            <DropdownMenuItem>Light Phenomena</DropdownMenuItem>
            <DropdownMenuItem>Craft Sightings</DropdownMenuItem>
            <DropdownMenuItem>Entity Encounters</DropdownMenuItem>
            <DropdownMenuItem>Abduction Reports</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-900/20">
        <span className="text-xs text-neutral-400 font-mono">
          {filteredSightings.length} {filteredSightings.length === 1 ? "sighting" : "sightings"} found
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleSort("date")}>
            <Calendar className="h-3 w-3 mr-1" />
            Date
            <ArrowUpDown className={`h-3 w-3 ml-1 ${sortField === "date" ? "opacity-100" : "opacity-50"}`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleSort("witnesses")}>
            <Users className="h-3 w-3 mr-1" />
            Witnesses
            <ArrowUpDown className={`h-3 w-3 ml-1 ${sortField === "witnesses" ? "opacity-100" : "opacity-50"}`} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredSightings.map((sighting) => (
          <motion.div
            key={sighting.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-neutral-800"
          >
            <div
              className="p-4 cursor-pointer hover:bg-neutral-800/20"
              onClick={() => setExpandedSighting(expandedSighting === sighting.id ? null : sighting.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {expandedSighting === sighting.id ? (
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-neutral-500" />
                  )}
                  <h3 className="text-sm font-medium text-neutral-300">{sighting.location}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getClassificationColor(sighting.classification)}>{sighting.classification}</Badge>
                  <Badge className={getTypeColor(sighting.type)}>{sighting.type}</Badge>
                </div>
              </div>

              <div className="mt-2 ml-6 flex flex-wrap items-center text-xs text-neutral-500 gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{sighting.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{sighting.witnesses} witnesses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{sighting.duration}</span>
                </div>
              </div>
            </div>

            {expandedSighting === sighting.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-4 ml-6 border-l border-neutral-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3 w-3 text-neutral-500" />
                  <span className="text-xs text-neutral-400">{sighting.coordinates}</span>
                </div>

                <p className="text-sm text-neutral-400">{sighting.description}</p>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs bg-black/20 border-neutral-800">
                    View Full Report
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
