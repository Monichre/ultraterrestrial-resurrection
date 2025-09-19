"use client"

import { useState } from "react"
import { Zap, Save, Share2, Download, Bookmark, History, RefreshCw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, CopyIcon, GearIcon } from "@radix-ui/react-icons"

const QUICK_ACTIONS = [
  {
    id: "upload-asset",
    name: "Upload Asset",
    description: "Add files to your library",
    icon: <Upload size={16} strokeWidth={2} />,
    shortcut: "Ctrl+U",
    category: "file",
  },
  {
    id: "save-view",
    name: "Save Current View",
    description: "Save the current network state",
    icon: <Save size={16} strokeWidth={2} />,
    shortcut: "Ctrl+S",
    category: "file",
  },
  {
    id: "export-data",
    name: "Export Data",
    description: "Download current dataset",
    icon: <Download size={16} strokeWidth={2} />,
    shortcut: "Ctrl+E",
    category: "file",
  },
  {
    id: "share-link",
    name: "Share Link",
    description: "Generate shareable link",
    icon: <Share2 size={16} strokeWidth={2} />,
    shortcut: "Ctrl+L",
    category: "file",
  },
  {
    id: "duplicate-view",
    name: "Duplicate View",
    description: "Create a copy of current view",
    icon: <CopyIcon size={16} strokeWidth={2} />,
    shortcut: "Ctrl+D",
    category: "edit",
  },
  {
    id: "bookmark",
    name: "Add Bookmark",
    description: "Bookmark current position",
    icon: <Bookmark size={16} strokeWidth={2} />,
    shortcut: "Ctrl+B",
    category: "edit",
  },
  {
    id: "reset-view",
    name: "Reset View",
    description: "Return to default state",
    icon: <RefreshCw size={16} strokeWidth={2} />,
    shortcut: "Ctrl+R",
    category: "view",
  },
  {
    id: "fit-screen",
    name: "Fit to Screen",
    description: "Adjust zoom to fit all nodes",
    icon: <PlusIcon size={16} strokeWidth={2} />,
    shortcut: "Ctrl+0",
    category: "view",
  },
  {
    id: "settings",
    name: "Quick Settings",
    description: "Access common settings",
    icon: <GearIcon size={16} strokeWidth={2} />,
    shortcut: "Ctrl+,",
    category: "system",
  },
]

const RECENT_ACTIONS = [
  { name: "Uploaded research document", time: "1 minute ago" },
  { name: "Exported network data", time: "2 minutes ago" },
  { name: "Saved view 'Government Network'", time: "5 minutes ago" },
  { name: "Shared link with team", time: "10 minutes ago" },
  { name: "Reset network layout", time: "15 minutes ago" },
]

export function QuickActionsPanel() {
  const [recentActions] = useState(RECENT_ACTIONS)

  const groupedActions = QUICK_ACTIONS.reduce(
    (acc, action) => {
      if (!acc[action.category]) {
        acc[action.category] = []
      }
      acc[action.category].push(action)
      return acc
    },
    {} as Record<string, typeof QUICK_ACTIONS>,
  )

  const categoryNames = {
    file: "File Actions",
    edit: "Edit Actions",
    view: "View Actions",
    system: "System",
  }

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "upload-asset":
        // Trigger file upload dialog
        const input = document.createElement("input")
        input.type = "file"
        input.multiple = true
        input.accept = "image/*,application/pdf,text/*,audio/*,video/*"
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files
          if (files) {
            console.log("Files selected for upload:", Array.from(files))
            // Here you would integrate with your upload system
          }
        }
        input.click()
        break
      case "save-view":
        console.log("Saving current view...")
        break
      case "export-data":
        console.log("Exporting data...")
        break
      case "share-link":
        console.log("Generating share link...")
        break
      default:
        console.log(`Action triggered: ${actionId}`)
    }
  }

  return (
    <div className="w-[380px] h-auto flex flex-col bg-neutral-900 text-white shadow-xl border border-gray-200 border-neutral-800 rounded-2xl overflow-hidden dark:border-gray-800">
      <header className="border-b border-neutral-800 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-blue-400" strokeWidth={2} />
          <h3 className="text-base font-medium text-white">Quick Actions</h3>
        </div>
        <p className="text-xs text-neutral-400">Shortcuts and common tasks</p>
      </header>

      <div className="p-4 overflow-y-auto max-h-96 space-y-4">
        {Object.entries(groupedActions).map(([category, actions]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-300">
              {categoryNames[category as keyof typeof categoryNames]}
            </h4>
            <div className="space-y-1">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  onClick={() => handleActionClick(action.id)}
                  className="w-full justify-start h-auto p-3 hover:bg-neutral-800 text-left"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-lg">
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{action.name}</span>
                        <Badge className="bg-neutral-700 text-neutral-300 text-xs font-mono">{action.shortcut}</Badge>
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{action.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}

        <Separator className="bg-neutral-800" />

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
            <History size={14} strokeWidth={2} />
            Recent Actions
          </h4>
          <div className="space-y-1">
            {recentActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <span className="text-sm text-white">{action.name}</span>
                <span className="text-xs text-neutral-400">{action.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
