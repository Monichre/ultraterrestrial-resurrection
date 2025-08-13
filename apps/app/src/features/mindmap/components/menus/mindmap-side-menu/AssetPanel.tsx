"use client"

import { Circle, Square, Triangle, Star, Heart } from "lucide-react"
import { ActionChip } from "./ActionChip"

const SHAPE_ASSETS = [
  {
    id: "circle",
    icon: <Circle size={16} strokeWidth={2} />,
    label: "Circle",
  },
  {
    id: "square",
    icon: <Square size={16} strokeWidth={2} />,
    label: "Square",
  },
  {
    id: "triangle",
    icon: <Triangle size={16} strokeWidth={2} />,
    label: "Triangle",
  },
  {
    id: "star",
    icon: <Star size={16} strokeWidth={2} />,
    label: "Star",
  },
  {
    id: "heart",
    icon: <Heart size={16} strokeWidth={2} />,
    label: "Heart",
  },
]

export function AssetPanel() {
  return (
    <div className="p-4 bg-neutral-800/90 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
      <h3 className="text-white text-sm font-medium mb-3">Shapes</h3>
      <div className="grid grid-cols-2 gap-2">
        {SHAPE_ASSETS.map((shape) => (
          <ActionChip 
            key={shape.id} 
            icon={shape.icon}
            className="text-xs justify-start"
          >
            {shape.label}
          </ActionChip>
        ))}
      </div>
    </div>
  )
}