"use client"

import type React from "react"
import { useRef, useState, useMemo, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, Stars, Line } from "@react-three/drei"
import * as THREE from "three"
import type { UFOSighting } from "@/data/ufo-sightings"

const GLOBE_RADIUS = 2

// Convert lat/lng to 3D position on sphere - returns tuple to avoid mutation issues
function latLngToPosition(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return [x, y, z]
}

function GridLines() {
  const lines = useMemo(() => {
    const geometry: React.JSX.Element[] = []

    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: [number, number, number][] = []
      for (let lng = 0; lng <= 360; lng += 5) {
        points.push(latLngToPosition(lat, lng - 180, GLOBE_RADIUS + 0.005))
      }
      geometry.push(<Line key={`lat-${lat}`} points={points} color="#38bdf8" opacity={0.2} transparent lineWidth={1} />)
    }

    // Longitude lines
    for (let lng = -180; lng < 180; lng += 30) {
      const points: [number, number, number][] = []
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLngToPosition(lat, lng, GLOBE_RADIUS + 0.005))
      }
      geometry.push(<Line key={`lng-${lng}`} points={points} color="#38bdf8" opacity={0.2} transparent lineWidth={1} />)
    }

    return geometry
  }, [])

  return <group>{lines}</group>
}

function ConnectionLines({
  incidents,
  hoveredId,
}: {
  incidents: UFOSighting[]
  hoveredId: string | null
}) {
  const lines = useMemo(() => {
    if (!hoveredId) return null

    const hoveredIncident = incidents.find((i) => i.id === hoveredId)
    if (!hoveredIncident || !hoveredIncident.relatedIncidents.length) return null

    return hoveredIncident.relatedIncidents.map((relatedId) => {
      const relatedIncident = incidents.find((i) => i.id === relatedId)
      if (!relatedIncident) return null

      const startPos = latLngToPosition(
        hoveredIncident.coordinates.lat,
        hoveredIncident.coordinates.lng,
        GLOBE_RADIUS + 0.02,
      )
      const endPos = latLngToPosition(
        relatedIncident.coordinates.lat,
        relatedIncident.coordinates.lng,
        GLOBE_RADIUS + 0.02,
      )

      const midX = (startPos[0] + endPos[0]) / 2
      const midY = (startPos[1] + endPos[1]) / 2
      const midZ = (startPos[2] + endPos[2]) / 2

      // Normalize and scale the midpoint for arc height
      const midLength = Math.sqrt(midX * midX + midY * midY + midZ * midZ)
      const arcRadius = GLOBE_RADIUS + 0.5
      const normalizedMid: [number, number, number] = [
        (midX / midLength) * arcRadius,
        (midY / midLength) * arcRadius,
        (midZ / midLength) * arcRadius,
      ]

      // Create curve using Vector3 instances only for the curve calculation
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...startPos),
        new THREE.Vector3(...normalizedMid),
        new THREE.Vector3(...endPos),
      )
      const curvePoints = curve.getPoints(50)
      const points: [number, number, number][] = curvePoints.map((p) => [p.x, p.y, p.z])

      return <Line key={relatedId} points={points} color="#a855f7" opacity={0.6} transparent lineWidth={2} />
    })
  }, [incidents, hoveredId])

  return <>{lines}</>
}

// Individual incident marker on globe
function IncidentMarker({
  incident,
  isSelected,
  isHovered,
  onHover,
  onClick,
}: {
  incident: UFOSighting
  isSelected: boolean
  isHovered: boolean
  onHover: (id: string | null) => void
  onClick: (incident: UFOSighting) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const position = useMemo(
    () => latLngToPosition(incident.coordinates.lat, incident.coordinates.lng, GLOBE_RADIUS + 0.02),
    [incident.coordinates],
  )

  const pulseRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (pulseRef.current && (isHovered || isSelected)) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3
      pulseRef.current.scale.setScalar(scale)
    }
  })

  const markerColor = useMemo(() => {
    switch (incident.credibility) {
      case "High":
        return "#4ade80"
      case "Medium":
        return "#fbbf24"
      case "Low":
        return "#f87171"
      default:
        return "#38bdf8"
    }
  }, [incident.credibility])

  return (
    <group position={position}>
      {/* Pulse effect */}
      {(isHovered || isSelected) && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={markerColor} transparent opacity={0.3} />
        </mesh>
      )}

      {/* Main marker */}
      <mesh
        ref={meshRef}
        onPointerEnter={(e) => {
          e.stopPropagation()
          onHover(incident.id)
          document.body.style.cursor = "pointer"
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          onHover(null)
          document.body.style.cursor = "auto"
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick(incident)
        }}
        scale={isHovered || isSelected ? 1.5 : 1}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={markerColor} />
      </mesh>

      {/* Tooltip */}
      {isHovered && (
        <Html
          position={[0, 0.15, 0]}
          center
          style={{
            pointerEvents: "none",
            transform: "translateY(-100%)",
          }}
        >
          <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            <p className="text-sm font-semibold text-foreground">{incident.name}</p>
            <p className="text-xs text-muted-foreground">{incident.location}</p>
            <p className="text-xs text-primary">{new Date(incident.date).getFullYear()}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

// Earth globe with atmosphere
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)

  // Slow auto-rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005
    }
  })

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.2}
          emissive="#0a0a15"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Grid lines on globe */}
      <GridLines />

      {/* Atmosphere glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color("#38bdf8") },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(glowColor, intensity * 0.4);
            }
          `}
        />
      </mesh>
    </group>
  )
}

// Scene with all elements
function GlobeScene({
  incidents,
  selectedIncident,
  hoveredId,
  onHover,
  onClick,
}: {
  incidents: UFOSighting[]
  selectedIncident: UFOSighting | null
  hoveredId: string | null
  onHover: (id: string | null) => void
  onClick: (incident: UFOSighting) => void
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38bdf8" />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Earth */}
      <Earth />

      {/* Connection lines */}
      <ConnectionLines incidents={incidents} hoveredId={hoveredId} />

      {/* Incident markers */}
      {incidents.map((incident) => (
        <IncidentMarker
          key={incident.id}
          incident={incident}
          isSelected={selectedIncident?.id === incident.id}
          isHovered={hoveredId === incident.id}
          onHover={onHover}
          onClick={onClick}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
    </>
  )
}

// Main component
export function UFOGlobe({
  incidents,
  onIncidentClick,
  selectedIncident,
}: {
  incidents: UFOSighting[]
  onIncidentClick: (incident: UFOSighting) => void
  selectedIncident?: UFOSighting | null
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="relative w-full h-full min-h-[500px] bg-background rounded-xl overflow-hidden border border-border">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
        <p className="text-xs font-semibold text-foreground mb-2">Credibility</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f87171]" />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
        <p className="text-xs text-muted-foreground">Drag to rotate | Scroll to zoom</p>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
        <p className="text-xs text-muted-foreground">Total Incidents</p>
        <p className="text-2xl font-bold text-primary">{incidents.length}</p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GlobeScene
            incidents={incidents}
            selectedIncident={selectedIncident || null}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onClick={onIncidentClick}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default UFOGlobe
