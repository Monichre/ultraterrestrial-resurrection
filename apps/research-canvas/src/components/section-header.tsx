interface SectionHeaderProps {
  title: string
  subtitle?: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="border border-white/20 p-2 flex items-center justify-between">
      <div>
        <h2 className="text-white text-sm tracking-wider uppercase font-monument-mono">{title}</h2>
        {subtitle && <p className="text-white/60 text-xs mt-1 font-monument-mono">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-3 h-0.5 bg-white/40"></div>
        <div className="w-3 h-0.5 bg-white/40"></div>
      </div>
    </div>
  )
}
