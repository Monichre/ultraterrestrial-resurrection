export function GlobeLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-card">
      <div className="relative w-24 h-24">
        {/* Earth */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse" />

        {/* Orbit */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin" style={{ animationDuration: '3s' }} />

        {/* Satellite */}
        <div className="absolute -top-1 left-1/2 w-2 h-2 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  )
} 