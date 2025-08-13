"use client"

import { useState } from "react"
import { Plus, Shapes, History, Scan, PenSquare, MessageSquare, HelpCircle } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ToolbarButton } from "./ToolbarButton"
import { AssetPanel } from "./AssetPanel"

const TOOLBAR_ITEMS = [
  {
    id: "add",
    icon: <Plus size={20} strokeWidth={2} />,
    tooltip: "Add",
  },
  {
    id: "shapes",
    icon: <Shapes size={20} strokeWidth={2} />,
    tooltip: "Shapes",
    submenu: <AssetPanel />,
  },
  {
    id: "history",
    icon: <History size={20} strokeWidth={2} />,
    tooltip: "History",
  },
  {
    id: "scan",
    icon: <Scan size={20} strokeWidth={2} />,
    tooltip: "Scan",
  },
  {
    id: "draw",
    icon: <PenSquare size={20} strokeWidth={2} />,
    tooltip: "Draw",
  },
]

export function FloatingToolbar() {
  const [activeTool, setActiveTool] = useState("add")

  return (
    <aside className="absolute top-1/2 left-4 z-10 -translate-y-1/2 flex flex-col items-center gap-2 p-2 rounded-full bg-neutral-800/90 text-white shadow-[0_0_0_0_#ffffff_inset,0_0_0_1px_#ffffff0d_inset,0_1px_0_0_#ffffff0d_inset] backdrop-blur-md">
      {TOOLBAR_ITEMS.map((item) => {
        const button = (
          <ToolbarButton
            key={item.id}
            tooltip={item.tooltip}
            isActive={activeTool === item.id}
            onClick={() => setActiveTool(item.id)}
          >
            {item.icon}
          </ToolbarButton>
        )

        if (item.submenu) {
          return (
            <HoverCard key={item.id} openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>{button}</HoverCardTrigger>
              <HoverCardContent
                side="right"
                align="start"
                sideOffset={16}
                className="bg-transparent border-none shadow-none w-auto p-0"
              >
                {item.submenu}
              </HoverCardContent>
            </HoverCard>
          )
        }

        return button
      })}

      <ToolbarButton tooltip="Comments">
        <MessageSquare size={20} strokeWidth={2} />
      </ToolbarButton>
      <ToolbarButton tooltip="Help">
        <HelpCircle size={20} strokeWidth={2} />
      </ToolbarButton>

      <div role="none" className="my-2 w-6 h-px bg-white/10 shrink-0"></div>

      <ToolbarButton tooltip="Profile" className="p-0 w-10 h-10">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://placehold.co/128x128" alt="User Avatar" />
        </Avatar>
      </ToolbarButton>
    </aside>
  )
}
