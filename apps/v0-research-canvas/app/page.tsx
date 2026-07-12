import { EmptyCanvas } from "@/components/research-canvas/EmptyCanvas"
import { FloatingToolbar } from "@/components/research-canvas/FloatingToolbar"
import { DotPattern } from "@/components/ui/dot-pattern"
import { MenuTrigger } from "@/components/navigation/MenuTrigger"

export default function HomePage() {
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
    </main>
  )
}
