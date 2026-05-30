"use client"

import { useState } from "react"
import { Search, Grid3X3, List, Star, Download, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TEMPLATE_CATEGORIES = [
  {
    id: "web",
    name: "Web",
    templates: [
      { id: "1", name: "Landing Page", category: "web", popular: true, downloads: 1200 },
      { id: "2", name: "Dashboard", category: "web", popular: false, downloads: 890 },
      { id: "3", name: "E-commerce", category: "web", popular: true, downloads: 2100 },
      { id: "4", name: "Portfolio", category: "web", popular: false, downloads: 650 },
    ],
  },
  {
    id: "mobile",
    name: "Mobile",
    templates: [
      { id: "5", name: "iOS App", category: "mobile", popular: true, downloads: 980 },
      { id: "6", name: "Android UI", category: "mobile", popular: false, downloads: 720 },
      { id: "7", name: "Onboarding", category: "mobile", popular: true, downloads: 1450 },
    ],
  },
  {
    id: "print",
    name: "Print",
    templates: [
      { id: "8", name: "Business Card", category: "print", popular: false, downloads: 340 },
      { id: "9", name: "Brochure", category: "print", popular: true, downloads: 560 },
      { id: "10", name: "Poster", category: "print", popular: false, downloads: 280 },
    ],
  },
]

export function TemplatesPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("web")

  const currentTemplates = TEMPLATE_CATEGORIES.find((cat) => cat.id === activeCategory)?.templates || []
  const filteredTemplates = currentTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-[380px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
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
          <Search className="absolute top-1/2 left-2.5 -translate-y-1/2 size-4 text-gray-400" strokeWidth={2} />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-4 text-sm bg-neutral-900 border-[#292f35] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
          />
        </div>
      </header>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
        <TabsList className="w-full bg-transparent p-2 h-auto gap-1">
          {TEMPLATE_CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
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
                  className="group relative bg-neutral-700/30 rounded-lg p-3 hover:bg-neutral-700/50 transition-colors cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md mb-2 flex items-center justify-center">
                    <Eye size={20} className="text-white/60" strokeWidth={2} />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{template.name}</h4>
                      <p className="text-xs text-gray-400">{template.downloads} downloads</p>
                    </div>
                    {template.popular && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
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
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700/30 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded flex items-center justify-center">
                    <Eye size={14} className="text-white/60" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white">{template.name}</h4>
                    <p className="text-xs text-gray-400">{template.downloads} downloads</p>
                  </div>
                  {template.popular && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Popular</Badge>
                  )}
                  <Button size="sm" variant="ghost" className="text-[#8c8c8c] hover:text-white">
                    <Download size={14} strokeWidth={2} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
