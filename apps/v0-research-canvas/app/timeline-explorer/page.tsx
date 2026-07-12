import { MenuTrigger } from "@/components/navigation/MenuTrigger"
import { TimelineClient } from "./timeline-client"

export default function TimelineExplorerPage() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <MenuTrigger />
      <TimelineClient />
    </main>
  )
}
