'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Globe2, Map } from "lucide-react"
import { type ViewMode } from "./types"

interface ViewSelectorProps {
  value: ViewMode
  onChange: ( value: ViewMode ) => void
}

const views = [
  {
    value: "timeline",
    label: "Timeline",
    icon: Clock
  },
  {
    value: "worldmap",
    label: "World Map",
    icon: Map
  },
  {
    value: "journey",
    label: "3D Journey",
    icon: Globe2
  }
] as const

export function ViewSelector( { value, onChange }: ViewSelectorProps ) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-black/50 border-neutral-800 text-white">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent>
        {views.map( ( view ) => {
          const Icon = view.icon
          return (
            <SelectItem key={view.value} value={view.value}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{view.label}</span>
              </div>
            </SelectItem>
          )
        } )}
      </SelectContent>
    </Select>
  )
} 