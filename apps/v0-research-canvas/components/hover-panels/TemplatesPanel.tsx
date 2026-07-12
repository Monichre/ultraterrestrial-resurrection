"use client"

import { useState } from "react"
import { Search, Grid3X3, List, Star, Download, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PanelWrapper } from "./PanelWrapper"

const TEMPLATE_CATEGORIES = [
  {
    id: "research",
    name: "Research",
    templates: [
      { id: "1", name: "Case Study", category: "research", popular: true, downloads: 1200 },
      { id: "2", name: "Timeline Analysis", category: "research", popular: false, downloads: 890 },
      { id: "3", name: "Witness Report", category: "research", popular: true, downloads: 2100 },
      { id: "4", name: "Evidence Board", category: "research", popular: false, downloads: 650 },
    ],
  },
  {
    id: "visualization",
    name: "Visualization",
    templates: [
      { id: "5", name: "Network Graph", category: "visualization", popular: true, downloads: 980 },
      { id: "6", name: "Geographic Map", category: "visualization", popular: false, downloads: 720 },
      { id: "7", name: "Timeline View", category: "visualization", popular: true, downloads: 1450 },
    ],
  },
  {
    id: "reports",
    name: "Reports",
    templates: [
      { id: "8", name: "Summary Brief", category: "reports", popular: false, downloads: 340 },
      { id: "9", name: "Full Report", category: "reports", popular: true, downloads: 560 },
      { id: "10", name: "Presentation", category: "reports", popular: false, downloads: 280 },
    ],
  },
]

export function TemplatesPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("research")

  const currentTemplates = TEMPLATE_CATEGORIES.find((cat) => cat.id === activeCategory)?.templates || []
  const filteredTemplates = currentTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <PanelWrapper texture="paper" className="w-[380px]">
      <header className="border-b border-neutral-800/50 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Templates</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`size-7 ${viewMode === "grid" ? "bg-white/10" : ""}`}
            >
              <Grid3X3 size={14} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`size-7 ${viewMode === "list" ? "bg-white/10" : ""}`}
            >
              <List size={14} strokeWidth={2} />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 -translate-y-1/2 size-4 text-neutral-400" strokeWidth={2} />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-4 text-sm bg-white/5 border-neutral-700/50 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-0"
          />
        </div>
      </header>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
        <TabsList className="w-full bg-transparent p-2 h-auto gap-1">
          {TEMPLATE_CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-500 hover:bg-white/5 hover:text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="p-3 overflow-y-auto max-h-80">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group relative bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer border border-neutral-700/30"
                >
                  <div className="aspect-video bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-md mb-2 flex items-center justify-center">
                    <Eye size={20} className="text-white/40" strokeWidth={2} />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{template.name}</h4>
                      <p className="text-xs text-neutral-500">{template.downloads} downloads</p>
                    </div>
                    {template.popular && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                        <Star size={10} className="mr-1" strokeWidth={2} />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white border-none">
                    <Download size={14} className="mr-1" strokeWidth={2} />
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-8 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded flex items-center justify-center">
                    <Eye size={14} className="text-white/40" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white">{template.name}</h4>
                    <p className="text-xs text-neutral-500">{template.downloads} downloads</p>
                  </div>
                  {template.popular && (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Popular</Badge>
                  )}
                  <Button size="sm" variant="ghost" className="text-neutral-500 hover:text-white">
                    <Download size={14} strokeWidth={2} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </PanelWrapper>
  )
}
