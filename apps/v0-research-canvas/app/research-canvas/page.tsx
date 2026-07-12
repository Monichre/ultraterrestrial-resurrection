import { EmptyCanvas } from "@/components/research-canvas/EmptyCanvas"

export const metadata = {
  title: "Research Canvas | UFO Disclosure Network",
  description: "AI-powered research canvas for exploring UFO phenomena and documented cases",
}

export default function ResearchCanvasPage() {
  return (
    <main className="min-h-screen bg-black">
      <EmptyCanvas />
    </main>
  )
}
