"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, Unlock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon, PlusIcon } from "@radix-ui/react-icons"

interface Layer {
  id: string
  name: string
  type: "group" | "shape" | "text" | "image"
  visible: boolean
  locked: boolean
  children?: Layer[]
}

const INITIAL_LAYERS: Layer[] = [
  {
    id: "1",
    name: "Header Section",
    type: "group",
    visible: true,
    locked: false,
    children: [
      { id: "2", name: "Logo", type: "image", visible: true, locked: false },
      { id: "3", name: "Navigation", type: "text", visible: true, locked: false },
    ],
  },
  {
    id: "4",
    name: "Hero Background",
    type: "shape",
    visible: true,
    locked: false,
  },
  {
    id: "5",
    name: "Content Area",
    type: "group",
    visible: true,
    locked: false,
    children: [
      { id: "6", name: "Title Text", type: "text", visible: true, locked: false },
      { id: "7", name: "Description", type: "text", visible: false, locked: false },
      { id: "8", name: "CTA Button", type: "shape", visible: true, locked: true },
    ],
  },
]

const LAYER_TYPE_COLORS = {
  group: "bg-blue-500/20 text-blue-400",
  shape: "bg-green-500/20 text-green-400",
  text: "bg-yellow-500/20 text-yellow-400",
  image: "bg-purple-500/20 text-purple-400",
}

export function LayersPanel() {
  const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS)
  const [selectedLayer, setSelectedLayer] = useState<string | null>("3")

  const toggleVisibility = (layerId: string) => {
    const updateLayer = (layers: Layer[]): Layer[] => {
      return layers.map((layer) => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible }
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) }
        }
        return layer
      })
    }
    setLayers(updateLayer(layers))
  }

  const toggleLock = (layerId: string) => {
    const updateLayer = (layers: Layer[]): Layer[] => {
      return layers.map((layer) => {
        if (layer.id === layerId) {
          return { ...layer, locked: !layer.locked }
        }
        if (layer.children) {
          return { ...layer, children: updateLayer(layer.children) }
        }
        return layer
      })
    }
    setLayers(updateLayer(layers))
  }

  const renderLayer = (layer: Layer, depth = 0) => (
    <div key={layer.id} className="select-none">
      <div
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-700/30 transition-colors cursor-pointer ${
          selectedLayer === layer.id ? "bg-neutral-700/50" : ""
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => setSelectedLayer(layer.id)}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            toggleVisibility(layer.id)
          }}
          className="size-6 p-0 hover:bg-white/10"
        >
          {layer.visible ? (
            <Eye size={14} className="text-white" strokeWidth={2} />
          ) : (
            <EyeOff size={14} className="text-gray-500" strokeWidth={2} />
          )}
        </Button>

        <div className={`w-2 h-2 rounded-full ${LAYER_TYPE_COLORS[layer.type]}`} />

        <span className={`flex-1 text-sm ${layer.visible ? "text-white" : "text-gray-500"}`}>{layer.name}</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            toggleLock(layer.id)
          }}
          className="size-6 p-0 hover:bg-white/10"
        >
          {layer.locked ? (
            <Lock size={12} className="text-gray-400" strokeWidth={2} />
          ) : (
            <Unlock size={12} className="text-gray-600" strokeWidth={2} />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
              className="size-6 p-0 hover:bg-white/10"
            >
              <DotsHorizontalIcon size={12} className="text-gray-400" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-900 border-[#292f35]">
            <DropdownMenuItem className="text-white hover:bg-neutral-800">Duplicate Layer</DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-neutral-800">Rename Layer</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:bg-neutral-800">
              <Trash2 size={14} className="mr-2" strokeWidth={2} />
              Delete Layer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {layer.children && <div>{layer.children.map((child) => renderLayer(child, depth + 1))}</div>}
    </div>
  )

  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Layers</h3>
          <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10">
            <PlusIcon size={14} strokeWidth={2} />
          </Button>
        </div>
      </header>

      <div className="p-2 overflow-y-auto max-h-96">
        <div className="space-y-1">{layers.map((layer) => renderLayer(layer))}</div>
      </div>

      <footer className="border-t border-t-[#292f35] p-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{layers.length} layers</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500/40" />
              <span>Group</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500/40" />
              <span>Shape</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
