"use client"

import dynamic from "next/dynamic"
import { MenuTrigger } from "@/components/navigation/MenuTrigger"

const ZAxisTimeline = dynamic(() => import("@/components/ui/ZAxisTimeline"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400">Loading Timeline...</p>
      </div>
    </div>
  ),
})

export default function TimelineExplorerPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <MenuTrigger />
      <ZAxisTimeline />
    </div>
  )
}
