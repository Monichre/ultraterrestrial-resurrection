"use client"

import { useEffect, useState } from "react"
import { UFO_SIGHTINGS, type UFOSighting } from "@/data/ufo-sightings"

type LocalDataResponse = {
  incidents: UFOSighting[]
  stats?: {
    total: number
    government: number
    events: number
    sightings: number
    root: string
  }
}

export function useLocalIncidents() {
  const [incidents, setIncidents] = useState<UFOSighting[]>(UFO_SIGHTINGS)
  const [stats, setStats] = useState<LocalDataResponse["stats"]>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadIncidents() {
      try {
        const response = await fetch("/api/local-data", { cache: "no-store" })
        if (!response.ok) throw new Error(`Local data request failed: ${response.status}`)

        const payload = (await response.json()) as LocalDataResponse
        if (!isMounted) return

        if (Array.isArray(payload.incidents) && payload.incidents.length) {
          setIncidents(payload.incidents)
        }
        setStats(payload.stats)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : "Failed to load local data")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadIncidents()

    return () => {
      isMounted = false
    }
  }, [])

  return { incidents, stats, isLoading, error }
}
