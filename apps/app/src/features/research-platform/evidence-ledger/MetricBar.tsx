'use client'

import type { MetricData } from './types'

export interface MetricBarProps {
  metric: MetricData
}

export function MetricBar({ metric }: MetricBarProps) {
  return (
    <div className="el-metric">
      <span>{metric.label}</span>
      <i style={{ ['--el-w' as string]: metric.width }} />
    </div>
  )
}
