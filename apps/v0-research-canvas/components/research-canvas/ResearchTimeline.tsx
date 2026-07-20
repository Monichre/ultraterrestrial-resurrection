interface TimelineEvent {
  week: string
  marker: "empty" | "filled" | "breakthrough"
  title: string
  description?: string
}

interface ResearchTimelineProps {
  title: string
  subtitle: string
  events: TimelineEvent[]
  sessions: number
  exchanges: number
  saves: number
  shares: number
}

export function ResearchTimeline({
  title,
  subtitle,
  events,
  sessions,
  exchanges,
  saves,
  shares,
}: ResearchTimelineProps) {
  const getMarkerStyle = (marker: TimelineEvent["marker"]) => {
    switch (marker) {
      case "breakthrough":
        return "text-white"
      case "filled":
        return "text-zinc-500"
      default:
        return "text-zinc-500"
    }
  }

  const getMarkerChar = (marker: TimelineEvent["marker"]) => {
    switch (marker) {
      case "breakthrough":
        return "●"
      case "filled":
        return "○"
      default:
        return "○"
    }
  }

  return (
    <div className="mt-16 border border-zinc-800 bg-black p-8 font-mono text-xs text-zinc-400 max-w-3xl mx-auto">
      <h3 className="text-base text-white mb-1 font-sans">{title}</h3>
      <div className="text-zinc-600 mb-8">{subtitle}</div>

      {/* ASCII Timeline */}
      <div className="border border-zinc-800 p-8 bg-zinc-950">
        <div className="text-center mb-6 tracking-widest text-zinc-400">RESEARCH JOURNEY</div>

        {events.map((event, i) => (
          <div key={i} className="grid grid-cols-[80px_1fr] gap-4 mb-2">
            <div className="text-right text-zinc-500">{event.week}</div>
            <div className="flex flex-col relative">
              <div className="flex items-center">
                <span className={`mr-2 ${getMarkerStyle(event.marker)}`}>{getMarkerChar(event.marker)}</span>
                <span className={event.marker === "breakthrough" ? "text-white font-bold" : "text-zinc-300"}>
                  {event.title}
                </span>
              </div>
              {event.description && (
                <div className="ml-0.5 pl-5 border-l border-zinc-800 py-1 text-zinc-600">└ {event.description}</div>
              )}
              {i < events.length - 1 && <div className="border-l border-zinc-800 ml-[3px] h-4 border-dashed my-1" />}
            </div>
          </div>
        ))}

        <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between text-zinc-600">
          <div>Polyphonic Sessions: {sessions}</div>
          <div>Total Exchanges: {exchanges.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-6 text-zinc-500">
          <span>★ {saves} saves</span>
          <span>↗ {shares} shares</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-zinc-800 text-[10px] uppercase tracking-widest hover:bg-zinc-900 transition text-zinc-400">
            Download
          </button>
          <button className="px-4 py-2 border border-zinc-800 text-[10px] uppercase tracking-widest hover:bg-zinc-900 transition text-zinc-400">
            Collect
          </button>
          <button className="px-4 py-2 bg-zinc-800 text-white text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition">
            Mint NFT
          </button>
        </div>
      </div>
    </div>
  )
}
