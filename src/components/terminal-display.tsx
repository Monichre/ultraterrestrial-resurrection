import { Card } from "@/components/ui/card"

export function TerminalDisplay() {
  return (
    <Card className="absolute bottom-4 right-4 bg-black/30 border-[#00ff9f]/30 backdrop-blur-sm p-4 w-80 font-mono text-sm pointer-events-auto">
      <div className="text-[#00ff9f] space-y-1">
        <div className="opacity-90">[System Status]</div>
        <div className="opacity-70">{">"} Initializing global scan...</div>
        <div className="opacity-80">{">"} Network: Connected</div>
        <div className="opacity-75">{">"} Satellites: Online</div>
        <div className="opacity-90">{">"} Data streams active:</div>
        <div className="pl-4 opacity-60">
          - Atmospheric monitoring - Oceanic sensors - Thermal imaging - Particle detection
        </div>
        <div className="opacity-80">{">"} Analysis: In progress...</div>
      </div>
    </Card>
  )
}

