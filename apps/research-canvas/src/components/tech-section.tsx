import type { ReactNode } from "react"

interface TechSectionProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function TechSection({ title, subtitle, children, className = "" }: TechSectionProps) {
  return (
    <div className={`relative border border-white/20 ${className}`}>
      <div className="flex items-center justify-between border-b border-white/20 bg-black/30 p-2">
        <div>
          <h2 className="text-white text-sm tracking-wider uppercase font-monument-mono">{title}</h2>
          {subtitle && <p className="text-white/60 text-xs mt-1 font-monument-mono">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-0.5 bg-white/40"></div>
          <div className="w-3 h-0.5 bg-white/40"></div>
        </div>
      </div>
      <div className="absolute inset-0  bg-black/30">{children}</div>

      {/* Grid overlay */}
      <div className="absolute inset-0 top-[32px] pointer-events-none">
        <div className="w-full h-full grid grid-cols-12 grid-rows-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`col-${i}`} className="border-r border-white/10 h-full"></div>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`row-${i}`} className="border-b border-white/10 w-full"></div>
          ))}
        </div>
      </div>

      {/* Horizontal scan line */}
      <div className="absolute left-0 right-0 h-[1px] bg-white/20 animate-[scan_3s_ease-in-out_infinite]"></div>
    </div>
  )
}
