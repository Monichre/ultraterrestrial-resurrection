"use client"

import { useState } from "react"
import { Monitor, Moon, Sun, Keyboard, Grid, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function SettingsPanel() {
  const [theme, setTheme] = useState("dark")
  const [autoSave, setAutoSave] = useState(true)
  const [gridVisible, setGridVisible] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [canvasZoom, setCanvasZoom] = useState([100])

  const shortcuts = [
    { action: "Undo", keys: "Ctrl + Z" },
    { action: "Redo", keys: "Ctrl + Y" },
    { action: "Copy", keys: "Ctrl + C" },
    { action: "Paste", keys: "Ctrl + V" },
    { action: "Select All", keys: "Ctrl + A" },
    { action: "Save", keys: "Ctrl + S" },
  ]

  return (
    <div className="w-[360px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <h3 className="text-sm font-medium text-white">Settings</h3>
      </header>

      <Tabs defaultValue="general" className="flex-1">
        <TabsList className="w-full bg-transparent p-2 h-auto gap-1">
          <TabsTrigger
            value="general"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="theme"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Theme
          </TabsTrigger>
          <TabsTrigger
            value="shortcuts"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Shortcuts
          </TabsTrigger>
        </TabsList>

        <div className="p-3 overflow-y-auto max-h-80">
          <TabsContent value="general" className="space-y-4 mt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Save size={16} className="text-gray-400" strokeWidth={2} />
                  <span className="text-sm">Auto Save</span>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid size={16} className="text-gray-400" strokeWidth={2} />
                  <span className="text-sm">Show Grid</span>
                </div>
                <Switch checked={gridVisible} onCheckedChange={setGridVisible} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid size={16} className="text-gray-400" strokeWidth={2} />
                  <span className="text-sm">Snap to Grid</span>
                </div>
                <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Canvas Zoom</span>
                  <span className="text-sm text-gray-400">{canvasZoom[0]}%</span>
                </div>
                <Slider
                  value={canvasZoom}
                  onValueChange={setCanvasZoom}
                  max={200}
                  min={25}
                  step={25}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Export Quality</label>
                <Select defaultValue="high">
                  <SelectTrigger className="bg-neutral-900 border-neutral-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="low">Low (72 DPI)</SelectItem>
                    <SelectItem value="medium">Medium (150 DPI)</SelectItem>
                    <SelectItem value="high">High (300 DPI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4 mt-0">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "ghost"}
                    onClick={() => setTheme("light")}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Sun size={16} strokeWidth={2} />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "ghost"}
                    onClick={() => setTheme("dark")}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Moon size={16} strokeWidth={2} />
                    <span className="text-xs">Dark</span>
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "ghost"}
                    onClick={() => setTheme("system")}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Monitor size={16} strokeWidth={2} />
                    <span className="text-xs">System</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Accent Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-lg border-2 border-white/20 hover:border-white/40 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Interface Scale</label>
                <Select defaultValue="100">
                  <SelectTrigger className="bg-neutral-900 border-neutral-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="75">75%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                    <SelectItem value="125">125%</SelectItem>
                    <SelectItem value="150">150%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-3 mt-0">
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700/30">
                  <span className="text-sm">{shortcut.action}</span>
                  <kbd className="px-2 py-1 text-xs bg-neutral-700 rounded border border-neutral-600">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="ghost">
              <Keyboard size={14} className="mr-2" strokeWidth={2} />
              Customize Shortcuts
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
