'use client'

export interface RadarChartProps {
  /** Outer pentagon points (background grid) */
  outerPoints?: string
  /** Inner data polygon points */
  dataPoints?: string
  /** Fill color for the data polygon */
  fillColor?: string
  /** Stroke color for the data polygon */
  strokeColor?: string
  /** ViewBox for the SVG */
  viewBox?: string
}

export function RadarChart({
  outerPoints = '140,25 230,70 215,150 65,150 50,70',
  dataPoints = '140,47 205,82 185,132 82,138 72,78',
  fillColor = 'rgba(201,143,70,.18)',
  strokeColor = '#c98f46',
  viewBox = '0 0 280 190',
}: RadarChartProps) {
  return (
    <div className="el-radar">
      <svg viewBox={viewBox}>
        <polygon points={outerPoints} fill="none" stroke="#394243" />
        <polygon
          points={dataPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
        />
      </svg>
    </div>
  )
}
