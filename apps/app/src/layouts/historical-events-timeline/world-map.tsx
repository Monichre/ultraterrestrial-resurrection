"use client"

import { ICON_BLUE } from "@/utils/constants/colors"
import DottedMap from "dotted-map"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

interface MapProps {
  markers?: Array<{
    start: { lat: number; lng: number; label?: string }
    end: { lat: number; lng: number; label?: string }
  }>
  lineColor?: string
  activeLocation?: any
}

export function WorldMap( {
  markers = [],


  lineColor = ICON_BLUE,
  activeLocation = null,
}: MapProps ) {
  console.log( "🚀 ~ markers:", markers )
  const svgRef = useRef<SVGSVGElement>( null )
  const map = new DottedMap( { height: 100, grid: "diagonal" } )
  const chainedMarkers = markers & markers?.length ? markers.slice( 0, -1 ).map( ( marker, i ) => ( {
    start: markers[i],
    end: markers[i + 1]
  } ) ) : []


  const svgMap = map.getSVG( {
    radius: 0.12,
    color: "#a8e5ee",
    shape: "circle",
    backgroundColor: 'transparent'
  } )

  const projectPoint = ( lat: number, lng: number ) => {
    const x = ( lng + 180 ) * ( 800 / 360 )
    const y = ( 90 - lat ) * ( 400 / 180 )
    return { x, y }
  }

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = ( start.x + end.x ) / 2
    const midY = Math.min( start.y, end.y ) - 50
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
  }

  return (
    <div className="w-full object-contain h-full aspect-[2/1] p-8 relative font-monumentMono">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent( svgMap )}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {chainedMarkers?.map( ( marker, i ) => {
          const startPoint = projectPoint( marker.start.location[0], marker.start.location[1] )
          const endPoint = projectPoint( marker.end.location[0], marker.end.location[1] )
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath( startPoint, endPoint )}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              ></motion.path>
            </g>
          )
        } )}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {chainedMarkers?.map( ( marker, i ) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint( marker.start.location[0], marker.start.location[1] ).x}
                cy={projectPoint( marker.start.location[0], marker.start.location[1] ).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint( marker.start.location[0], marker.start.location[1] ).x}
                cy={projectPoint( marker.start.location[0], marker.start.location[1] ).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint( marker.end.location[0], marker.end.location[1] ).x}
                cy={projectPoint( marker.end.location[0], marker.end.location[1] ).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint( marker.end.location[0], marker.end.location[1] ).x}
                cy={projectPoint( marker.end.location[0], marker.end.location[1] ).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ) )}
      </svg>
    </div>
  )
}
