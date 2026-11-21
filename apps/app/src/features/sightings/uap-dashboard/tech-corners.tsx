interface TechCornersProps {
  className?: string
  size?: number
  color?: string
}

export function TechCorners({ className = "", size = 20, color = "#ffffff" }: TechCornersProps) {
  const lineWidth = 1
  const opacity = 0.8

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Top Left */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0"
      >
        <path d={`M0 ${size} L0 0 L${size} 0`} stroke={color} strokeWidth={lineWidth} strokeOpacity={opacity} />
        <path d={`M${size / 3} 0 L0 ${size / 3}`} stroke={color} strokeWidth={lineWidth} strokeOpacity={opacity} />
        <path
          d={`M${(size * 2) / 3} 0 L0 ${(size * 2) / 3}`}
          stroke={color}
          strokeWidth={lineWidth}
          strokeOpacity={opacity}
        />
      </svg>

      {/* Top Right */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 right-0"
      >
        <path d={`M0 0 L${size} 0 L${size} ${size}`} stroke={color} strokeWidth={lineWidth} strokeOpacity={opacity} />
        <path
          d={`M${(size * 2) / 3} 0 L${size} ${size / 3}`}
          stroke={color}
          strokeWidth={lineWidth}
          strokeOpacity={opacity}
        />
        <path
          d={`M${size / 3} 0 L${size} ${(size * 2) / 3}`}
          stroke={color}
          strokeWidth={lineWidth}
          strokeOpacity={opacity}
        />
      </svg>

      {/* Bottom Left */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0"
      >
        <path d={`M0 0 L0 ${size} L${size} ${size}`} stroke={color} strokeWidth={lineWidth} strokeOpacity={opacity} />
        <path
          d={`M0 ${(size * 2) / 3} L${size / 3} ${size}`}
          stroke={color}
          strokeWidth={lineWidth}
          strokeOpacity={opacity}
        />
        <path
          d={`M0 ${size / 3} L${(size * 2) / 3} ${size}`}
          stroke={color}
          strokeWidth={lineWidth}
          strokeOpacity={opacity}
        />
      </svg>

      {/* Bottom Right */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 right-0"
      >
        <path
          d={`M${size} 0 L${size} ${size} L0 ${size}`}
          stroke={color}
          strokeWidth={lineWidth}
          strokeOpacity={opacity}
        />
        <path
          d={`M${size} ${(size * 2) / 3} L${(size * 2) / 3} ${size}`}
          stroke={color}
          strokeWidth={lineWidth}
          strokeOpacity={opacity}
        />
        <path
          d={`M${size} ${size / 3} L${size / 3} ${size}`}
          stroke={color}
          strokeWidth={lineWidth}
          strokeOpacity={opacity}
        />
      </svg>
    </div>
  )
}

