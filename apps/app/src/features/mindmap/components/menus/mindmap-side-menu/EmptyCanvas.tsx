import { MousePointerClick, MessageSquare, Bot, Image, Copy, MoreHorizontal } from "lucide-react"
import { ActionChip } from "./ActionChip"

const SUGGESTED_ACTIONS = [
  {
    id: "describe",
    icon: <MessageSquare size={16} strokeWidth={2} />,
    label: "Describe an Image",
  },
  {
    id: "combine",
    icon: <Bot size={16} strokeWidth={2} />,
    label: "Combine ideas",
  },
  {
    id: "video",
    icon: <Image size={16} strokeWidth={2} />,
    label: "Make a video from an image",
  },
  {
    id: "flows",
    icon: <Copy size={16} strokeWidth={2} />,
    label: "Explore Flows",
  },
]

export function EmptyCanvas() {
  return (
    <div className="text-white flex flex-col justify-center items-center gap-6">
      <p className="text-[#8c8c8c] text-sm flex items-center gap-1.5">
        <span className="bg-white/10 text-white flex items-center py-1 px-1.5 rounded-md">
          <MousePointerClick size={14} strokeWidth={2} className="mr-1" />
          Double-click
        </span>
        anywhere to create a new Block, or start with...
      </p>
      <div className="flex flex-wrap justify-center items-center gap-2">
        {SUGGESTED_ACTIONS.map((action) => (
          <ActionChip key={action.id} icon={action.icon}>
            {action.label}
          </ActionChip>
        ))}
        <ActionChip icon={<MoreHorizontal size={16} strokeWidth={2} />} />
      </div>
    </div>
  )
}
