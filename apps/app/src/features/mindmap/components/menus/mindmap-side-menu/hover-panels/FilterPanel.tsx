'use client'

import { Filter, MapPin, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useMindMapUiStore } from '@/features/mindmap/store/mindmap-ui-store'

const ENTITY_TYPES = [
  { id: "people", name: "People", count: 1247, checked: true },
  { id: "institutions", name: "Institutions", count: 342, checked: true },
  { id: "events", name: "Events", count: 856, checked: true },
  { id: "locations", name: "Locations", count: 623, checked: true },
  { id: "documents", name: "Documents", count: 2134, checked: false },
  { id: "sightings", name: "Sightings", count: 4521, checked: true },
]

const THEMES = [
  { id: "disclosure", name: "Government Disclosure", count: 234 },
  { id: "military", name: "Military Encounters", count: 567 },
  { id: "civilian", name: "Civilian Sightings", count: 1234 },
  { id: "coverup", name: "Cover-ups", count: 123 },
  { id: "technology", name: "Technology Analysis", count: 345 },
  { id: "abduction", name: "Abduction Cases", count: 456 },
]

const LOCATIONS = [
  { id: "usa", name: "United States", count: 2341 },
  { id: "uk", name: "United Kingdom", count: 234 },
  { id: "russia", name: "Russia", count: 156 },
  { id: "china", name: "China", count: 89 },
  { id: "brazil", name: "Brazil", count: 167 },
  { id: "other", name: "Other Countries", count: 445 },
]

export function FilterPanel() {
  const {
    filters,
    toggleFilterNodeType,
    setFilterDateRange,
    setFilterSearchQuery,
    toggleFilterTheme,
    toggleFilterLocation,
    clearAllFilters,
  } = useMindMapUiStore()

  // Derive entity types checked state from store
  const entityTypes = ENTITY_TYPES.map((type) => ({
    ...type,
    checked: filters.nodeTypes.includes(type.id),
  }))
  const selectedThemes = filters.themes
  const selectedLocations = filters.locations
  const timeRange = {
    start: filters.dateRange.start || '1947',
    end: filters.dateRange.end || '2024',
  }
  const searchQuery = filters.searchQuery

  const toggleEntityType = (id: string) => {
    toggleFilterNodeType(id)
  }

  const toggleTheme = (id: string) => {
    toggleFilterTheme(id)
  }

  const toggleLocation = (id: string) => {
    toggleFilterLocation(id)
  }

  const handleClearAllFilters = () => {
    clearAllFilters()
  }

  const activeFiltersCount =
    entityTypes.filter((t) => !t.checked).length +
    selectedThemes.length +
    selectedLocations.length +
    (searchQuery ? 1 : 0)

  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-blue-400" strokeWidth={2} />
            <h3 className="text-sm font-medium text-white">Filter Panel</h3>
          </div>
          {activeFiltersCount > 0 && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 -translate-y-1/2 size-4 text-gray-400" strokeWidth={2} />
          <Input
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(e) => setFilterSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-8 text-sm bg-neutral-900 border-[#292f35] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setFilterSearchQuery('')}
              className="absolute top-1/2 right-1 -translate-y-1/2 size-6 hover:bg-white/10"
            >
              <Cross2Icon size={12} strokeWidth={2} />
            </Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="types" className="flex-1">
        <TabsList className="w-full bg-transparent p-2 h-auto gap-1">
          <TabsTrigger
            value="types"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Types
          </TabsTrigger>
          <TabsTrigger
            value="themes"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Themes
          </TabsTrigger>
          <TabsTrigger
            value="location"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Location
          </TabsTrigger>
          <TabsTrigger
            value="time"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Time
          </TabsTrigger>
        </TabsList>

        <div className="p-3 overflow-y-auto max-h-80">
          <TabsContent value="types" className="space-y-2 mt-0">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Tag size={14} strokeWidth={2} />
              Entity Types
            </h4>
            {entityTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700/30">
                <div className="flex items-center space-x-2">
                  <Checkbox id={type.id} checked={type.checked} onCheckedChange={() => toggleEntityType(type.id)} />
                  <label htmlFor={type.id} className="text-sm font-medium cursor-pointer">
                    {type.name}
                  </label>
                </div>
                <span className="text-xs text-gray-400">{type.count.toLocaleString()}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="themes" className="space-y-2 mt-0">
            <h4 className="text-sm font-medium">Thematic Categories</h4>
            {THEMES.map((theme) => (
              <div key={theme.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700/30">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={theme.id}
                    checked={selectedThemes.includes(theme.id)}
                    onCheckedChange={() => toggleTheme(theme.id)}
                  />
                  <label htmlFor={theme.id} className="text-sm font-medium cursor-pointer">
                    {theme.name}
                  </label>
                </div>
                <span className="text-xs text-gray-400">{theme.count}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="location" className="space-y-2 mt-0">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MapPin size={14} strokeWidth={2} />
              Geographic Regions
            </h4>
            {LOCATIONS.map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700/30"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={location.id}
                    checked={selectedLocations.includes(location.id)}
                    onCheckedChange={() => toggleLocation(location.id)}
                  />
                  <label htmlFor={location.id} className="text-sm font-medium cursor-pointer">
                    {location.name}
                  </label>
                </div>
                <span className="text-xs text-gray-400">{location.count}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="time" className="space-y-3 mt-0">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon size={14} strokeWidth={2} />
              Time Range
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Start Year</label>
                <Select
                  value={timeRange.start}
                  onValueChange={(value) => setFilterDateRange(value, timeRange.end)}
                >
                  <SelectTrigger className="bg-neutral-900 border-[#292f35]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-[#292f35]">
                    <SelectItem value="1600">1600</SelectItem>
                    <SelectItem value="1800">1800</SelectItem>
                    <SelectItem value="1900">1900</SelectItem>
                    <SelectItem value="1947">1947</SelectItem>
                    <SelectItem value="1990">1990</SelectItem>
                    <SelectItem value="2000">2000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">End Year</label>
                <Select
                  value={timeRange.end}
                  onValueChange={(value) => setFilterDateRange(timeRange.start, value)}
                >
                  <SelectTrigger className="bg-neutral-900 border-[#292f35]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-[#292f35]">
                    <SelectItem value="1990">1990</SelectItem>
                    <SelectItem value="2000">2000</SelectItem>
                    <SelectItem value="2010">2010</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium">Quick Ranges</h5>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: "Modern Era", start: "1947", end: "1990" },
                  { label: "Contemporary", start: "1990", end: "2024" },
                  { label: "Recent", start: "2000", end: "2024" },
                  { label: "All Time", start: "1600", end: "2024" },
                ].map((range) => (
                  <Button
                    key={range.label}
                    size="sm"
                    variant="ghost"
                    onClick={() => setFilterDateRange(range.start, range.end)}
                    className="text-xs"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <footer className="border-t border-t-[#292f35] p-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearAllFilters}
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Cross2Icon size={14} className="mr-1" strokeWidth={2} />
            Clear All Filters
          </Button>
        </footer>
      )}
    </div>
  )
}
