import { Search, List, X, SlidersHorizontal, Plus, BoxSelect } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AssetPanel() {
  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] top-0 z-10 sticky p-2">
        <div className="flex items-center gap-2">
          <div className="relative grow">
            <Search className="absolute top-1/2 left-2.5 -translate-y-1/2 size-4 text-gray-400" strokeWidth={2} />
            <Input
              placeholder="Search Assets..."
              className="w-full h-8 pl-8 pr-4 text-sm bg-neutral-900 border-[#292f35] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#8c8c8c] hover:bg-white/10 hover:text-white size-8 shrink-0"
          >
            <List size={16} strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#8c8c8c] hover:bg-white/10 hover:text-white size-8 shrink-0"
          >
            <X size={16} strokeWidth={2} />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 px-2">
          <Tabs defaultValue="my-files" className="w-full">
            <TabsList className="bg-transparent p-0 h-auto gap-1">
              <TabsTrigger
                value="my-files"
                className="text-sm font-medium h-8 px-2 data-[state=active]:bg-white/5 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
              >
                My Files
              </TabsTrigger>
              <TabsTrigger
                value="saved-blocks"
                className="text-sm font-medium h-8 px-2 data-[state=active]:bg-white/5 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
              >
                Saved Blocks
              </TabsTrigger>
              <div className="w-px h-4 bg-white/5 mx-1"></div>
              <TabsTrigger
                value="unsplash"
                className="text-sm font-medium h-8 px-2 data-[state=active]:bg-white/5 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white flex items-center gap-1.5"
              >
                <BoxSelect className="fill-[#8c8c8c]" size={12} strokeWidth={1} />
                Unsplash
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" className="text-[#8c8c8c] hover:bg-white/10 hover:text-white h-8 px-2 shrink-0">
            <SlidersHorizontal size={16} strokeWidth={2} />
          </Button>
        </div>
      </header>
      <div className="grow overflow-y-auto p-2 rounded-b-2xl">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            className="h-32 w-full flex-col gap-1 bg-white/5 shadow-[0_0_0_0_#000000_inset,0_0_0_1px_#ffffff0d_inset,0_1px_0_0_#ffffff0d_inset] backdrop-blur-md hover:bg-white/10"
          >
            <Plus size={16} strokeWidth={2} />
            <span className="text-xs font-normal">Upload</span>
          </Button>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 w-full rounded-lg bg-neutral-700/50"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
