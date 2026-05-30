import { EmptyCanvas } from "@/components/research-canvas/EmptyCanvas"
import { FloatingToolbar } from "@/components/research-canvas/FloatingToolbar"
import { DotPattern } from "@/components/ui/dot-pattern"
import { MenuTrigger } from "@/components/navigation/MenuTrigger"
import { getLocalIncidents } from "@/lib/local-data"

export default function HomePage() {
  const { stats } = getLocalIncidents()

  return (
    <main className="h-screen w-full bg-neutral-950 relative flex items-center justify-center overflow-hidden">
      <DotPattern
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
        className="text-neutral-800/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"
      />
      <FloatingToolbar />
      <EmptyCanvas />
      <MenuTrigger />
      <div className="absolute bottom-4 left-4 z-20 rounded-full border border-white/10 bg-neutral-900/90 px-3 py-1.5 text-xs text-neutral-300 shadow-lg backdrop-blur">
        Local CSV backend connected: {stats.total.toLocaleString()} records
      </div>
    </main>
  )
}
