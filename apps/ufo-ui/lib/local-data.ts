import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

export type LocalUFOSighting = {
  id: string
  name: string
  date: string
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  witnesses: number
  classification: "CE1" | "CE2" | "CE3" | "CE4" | "Radar" | "Military" | "Mass"
  credibility: "High" | "Medium" | "Low"
  image: string
  sources: string[]
  relatedIncidents: string[]
  tags: string[]
}

const DEFAULT_REPO_ROOT = "/Users/liamellis/Desktop/01_ACTIVE/ultraterrestrial-resurrection"
const REPO_ROOT = process.env.UFO_DATA_ROOT || DEFAULT_REPO_ROOT

const DATASETS = {
  governmentUap: "apps/disclosure-rag/data/government/pursue_war_gov/metadata/uap-data.csv",
  events: "packages/db/docs/exports/events.csv",
  sightings: "packages/db/docs/exports/sightings.csv",
}

const fallbackImages = [
  "/tic-tac-ufo-navy-encounter-ocean.jpg",
  "/gimbal-ufo-navy-infrared-footage.jpg",
  "/phoenix-lights-ufo-v-shape-night-sky.jpg",
  "/washington-dc-capitol-ufo-1952.jpg",
  "/rendlesham-forest-ufo-landing-mysterious-lights.jpg",
  "/belgium-ufo-triangle-craft-night.jpg",
]

function parseCsv(input: string, maxBodyRows?: number): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]
    const next = input[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      row.push(field)
      field = ""
      continue
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1
      row.push(field)
      rows.push(row)
      if (maxBodyRows && rows.length > maxBodyRows) break
      row = []
      field = ""
      continue
    }

    field += char
  }

  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }

  const [headers = [], ...body] = rows
  const cleanHeaders = headers.map((header) => header.replace(/^\uFEFF/, "").trim())

  return body
    .filter((cells) => cells.some((cell) => cell.trim()))
    .map((cells) =>
      Object.fromEntries(cleanHeaders.map((header, index) => [header, cells[index]?.trim() || ""]))
    )
}

function readCsv(relativePath: string, maxBodyRows?: number) {
  const filePath = path.join(REPO_ROOT, relativePath)
  if (!existsSync(filePath)) return []
  return parseCsv(readFileSync(filePath, "utf8"), maxBodyRows)
}

function numberFrom(value: string | undefined, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function isoDate(value: string | undefined) {
  if (!value) return "1900-01-01"
  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  const year = value.match(/\d{4}/)?.[0]
  return year ? `${year}-01-01` : "1900-01-01"
}

function tagsFrom(...values: Array<string | undefined>) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => (value || "").split(/[,;|\s]+/))
        .map((tag) => tag.toLowerCase().replace(/[^a-z0-9-]/g, ""))
        .filter((tag) => tag.length > 2)
    )
  ).slice(0, 8)
}

function inferClassification(text: string): LocalUFOSighting["classification"] {
  const lowered = text.toLowerCase()
  if (lowered.includes("radar") || lowered.includes("sensor")) return "Radar"
  if (lowered.includes("navy") || lowered.includes("air force") || lowered.includes("military")) return "Military"
  if (lowered.includes("abduct")) return "CE4"
  if (lowered.includes("beings") || lowered.includes("occupant")) return "CE3"
  if (lowered.includes("landing") || lowered.includes("debris") || lowered.includes("trace")) return "CE2"
  if (lowered.includes("wave") || lowered.includes("mass")) return "Mass"
  return "CE1"
}

function inferCredibility(text: string, official = false): LocalUFOSighting["credibility"] {
  const lowered = text.toLowerCase()
  if (lowered.includes("hoax")) return "Low"
  if (official || lowered.includes("military") || lowered.includes("radar") || lowered.includes("government")) {
    return "High"
  }
  return "Medium"
}

function imageFor(index: number) {
  return fallbackImages[index % fallbackImages.length] || "/placeholder.jpg"
}

function normalizeGovernmentUap(rows: Record<string, string>[]): LocalUFOSighting[] {
  return rows.map((row, index) => {
    const title = row.Title || row["Video Title"] || `Government UAP release ${index + 1}`
    const description = row["Description Blurb"] || title
    const text = `${title} ${description} ${row.Type} ${row.Agency}`

    return {
      id: `gov-uap-${index + 1}`,
      name: title.replace(/^DOW-UAP-[^,]+,\s*/, ""),
      date: isoDate(row["Incident Date"] || row["Release Date"]),
      location: row["Incident Location"] || "Undisclosed",
      coordinates: { lat: 0, lng: 0 },
      description,
      witnesses: 1,
      classification: inferClassification(text),
      credibility: inferCredibility(text, true),
      image: imageFor(index),
      sources: [row.Agency || "Government release", row.Type || "Record"].filter(Boolean),
      relatedIncidents: [],
      tags: tagsFrom(row.Type, row.Agency, row["Incident Location"], "government", "uap"),
    }
  })
}

function normalizeEvents(rows: Record<string, string>[]): LocalUFOSighting[] {
  return rows.map((row, index) => {
    const text = `${row.name} ${row.description} ${row.category}`
    return {
      id: row.id || `event-${index + 1}`,
      name: row.name || `UFO event ${index + 1}`,
      date: isoDate(row.date),
      location: row.location || "Unknown",
      coordinates: {
        lat: numberFrom(row.latitude),
        lng: numberFrom(row.longitude),
      },
      description: row.description || row.summary || "No description available.",
      witnesses: 1,
      classification: inferClassification(text),
      credibility: inferCredibility(text),
      image: imageFor(index + 2),
      sources: ["Xata events export"],
      relatedIncidents: [],
      tags: tagsFrom(row.category, row.location),
    }
  })
}

function normalizeSightings(rows: Record<string, string>[]): LocalUFOSighting[] {
  return rows.slice(0, 500).map((row, index) => {
    const city = row.city || "Unknown location"
    const country = row.country ? row.country.toUpperCase() : ""
    const description = row.comments || row.description || "No sighting notes available."
    const text = `${city} ${country} ${description}`

    return {
      id: row.id || `sighting-${index + 1}`,
      name: `${city}${country ? `, ${country}` : ""} sighting`,
      date: isoDate(row.date),
      location: `${city}${country ? `, ${country}` : ""}`,
      coordinates: {
        lat: numberFrom(row.latitude),
        lng: numberFrom(row.longitude),
      },
      description,
      witnesses: 1,
      classification: inferClassification(text),
      credibility: inferCredibility(text),
      image: imageFor(index + 4),
      sources: ["Local sightings export"],
      relatedIncidents: [],
      tags: tagsFrom(city, country, row.duration_hours_min),
    }
  })
}

export function getLocalIncidents() {
  const government = normalizeGovernmentUap(readCsv(DATASETS.governmentUap))
  const events = normalizeEvents(readCsv(DATASETS.events, 300))
  const sightings = normalizeSightings(readCsv(DATASETS.sightings, 400))
  const incidents = [...government, ...events, ...sightings]

  return {
    incidents,
    stats: {
      total: incidents.length,
      government: government.length,
      events: events.length,
      sightings: sightings.length,
      root: REPO_ROOT,
    },
  }
}
