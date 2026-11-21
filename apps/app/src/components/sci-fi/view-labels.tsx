interface ViewLabelsProps {
  selectedTab: number
}

export function ViewLabels({selectedTab}: ViewLabelsProps) {
  return (
    <div className='absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4'>
      <span
        className={`text-xs font-mono transition-opacity duration-200 ${
          selectedTab === 0 ? 'text-cyan-500' : 'text-cyan-500/30'
        }`}>
        SINGLE VIEW
      </span>
      <span
        className={`text-xs font-mono transition-opacity duration-200 ${
          selectedTab === 1 ? 'text-cyan-500' : 'text-cyan-500/30'
        }`}>
        COMPARISON VIEW
      </span>
    </div>
  )
}
