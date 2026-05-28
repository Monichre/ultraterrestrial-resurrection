"use client"

import { useGSAP } from "@gsap/react"
import { Canvas, useThree } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import gsap from "gsap"
import { Suspense, useEffect, useRef } from "react"
import * as THREE from "three"
import {
  MoonOrbit,
  Planet,
  StarField,
  type MoonHandle,
  type PlanetHandle,
} from "./SceneObjects"

gsap.registerPlugin(useGSAP)

// ---------------------------------------------------------------------------
// CameraRig — exposes the camera to GSAP via a ref bridge
// ---------------------------------------------------------------------------
type CameraRigProps = {
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>
  parallax: React.MutableRefObject<{ x: number; y: number }>
}

const CameraRig: React.FC<CameraRigProps> = ({ cameraRef, parallax }) => {
  const { camera } = useThree()
  const baseTarget = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    cameraRef.current = camera as THREE.PerspectiveCamera
    camera.position.set(0, 0.4, 14)
    camera.lookAt(baseTarget.current)
  }, [camera, cameraRef])

  // Soft parallax on every frame — independent of the GSAP timeline
  useEffect(() => {
    const id = { current: 0 as number | undefined }
    const tick = () => {
      const p = parallax.current
      camera.position.x += (p.x * 0.5 - camera.position.x) * 0.04
      camera.position.y += (0.4 + p.y * 0.3 - camera.position.y) * 0.04
      camera.lookAt(baseTarget.current)
      id.current = requestAnimationFrame(tick)
    }
    id.current = requestAnimationFrame(tick)
    return () => {
      if (id.current) cancelAnimationFrame(id.current)
    }
  }, [camera, parallax])

  return null
}

// ---------------------------------------------------------------------------
// PlanetaryIntro — the canvas + master GSAP timeline + DOM title overlay
// ---------------------------------------------------------------------------
const TITLE = "ULTRATERRESTRIAL"
const SUBTITLE = "RESURRECTION"

export const PlanetaryIntro: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const planetHandleRef = useRef<PlanetHandle | null>(null)
  const moonHandleRef = useRef<MoonHandle | null>(null)
  const parallax = useRef({ x: 0, y: 0 })

  // Mouse parallax — written into a ref read by CameraRig's RAF loop
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      parallax.current.x = nx
      parallax.current.y = -ny
      if (planetHandleRef.current) {
        gsap.to(planetHandleRef.current.group.rotation, {
          x: ny * 0.08,
          z: nx * 0.04,
          duration: 1.2,
          ease: "power3.out",
          overwrite: "auto",
        })
      }
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  // Master timeline — runs once handles are populated
  useGSAP(
    () => {
      // Wait for refs to be ready
      let raf = 0
      const start = () => {
        const planet = planetHandleRef.current
        const moon = moonHandleRef.current
        const cam = cameraRef.current
        if (!planet || !moon || !cam) {
          raf = requestAnimationFrame(start)
          return
        }

        // Char-split the title into spans for stagger
        const splitChars = (el: HTMLElement | null) => {
          if (!el || el.dataset.split === "1") return [] as HTMLElement[]
          const text = el.textContent ?? ""
          el.textContent = ""
          const spans: HTMLElement[] = []
          for (const ch of text) {
            const s = document.createElement("span")
            s.textContent = ch === " " ? "\u00A0" : ch
            s.style.display = "inline-block"
            s.style.willChange = "transform, filter, opacity"
            el.appendChild(s)
            spans.push(s)
          }
          el.dataset.split = "1"
          return spans
        }

        const titleChars = splitChars(titleRef.current)
        const subtitleChars = splitChars(subtitleRef.current)

        // Initial states
        gsap.set([titleChars, subtitleChars], {
          yPercent: 120,
          opacity: 0,
          filter: "blur(18px)",
        })

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        // Camera dolly
        tl.to(
          cam.position,
          { z: 7.5, duration: 1.6, ease: "power3.inOut" },
          0
        )
          // Planet bloom in
          .to(
            planet.group.scale,
            { x: 1, y: 1, z: 1, duration: 1.8, ease: "back.out(1.4)" },
            0.2
          )
          // Atmosphere ramp
          .to(planet.atmoUniforms.uIntensity, { value: 1.0, duration: 1.6 }, 0.6)
          // Subtle accelerated spin during reveal
          .to(
            planet.mesh.rotation,
            { y: `+=${Math.PI * 0.6}`, duration: 2.0, ease: "power2.out" },
            0.4
          )
          // Camera push closer
          .to(cam.position, { z: 4.8, duration: 1.4, ease: "power2.inOut" }, 1.4)
          // Moon swings into orbit
          .fromTo(
            moon.pivot.rotation,
            { y: -Math.PI * 1.1 },
            { y: 0, duration: 2.4, ease: "power3.out" },
            1.4
          )
          .to(
            moon.material,
            { opacity: 1, duration: 1.4, ease: "power2.out" },
            1.8
          )
          // Title chars
          .to(
            titleChars,
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.0,
              stagger: 0.04,
              ease: "expo.out",
            },
            1.6
          )
          .to(
            subtitleChars,
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.9,
              stagger: 0.03,
              ease: "expo.out",
            },
            2.4
          )
          // Idle floating breath on the planet group
          .to(
            planet.group.position,
            {
              y: "+=0.08",
              duration: 4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            },
            ">-0.5"
          )
      }
      raf = requestAnimationFrame(start)
      return () => cancelAnimationFrame(raf)
    },
    { scope: rootRef }
  )

  return (
    <div
      ref={rootRef}
      className="relative h-[100vh] w-[100vw] overflow-hidden bg-black"
    >
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 200, position: [0, 0.4, 14] }}
      >
        <color attach="background" args={["#02030a"]} />
        <fog attach="fog" args={["#02030a", 18, 90]} />

        <CameraRig cameraRef={cameraRef} parallax={parallax} />

        {/* Cinematic key + rim lighting */}
        <ambientLight intensity={0.08} />
        <directionalLight
          position={[5, 2, 3]}
          intensity={2.2}
          color="#fff4e0"
        />
        <directionalLight
          position={[-6, -1, -4]}
          intensity={0.6}
          color="#3a78ff"
        />

        <Suspense fallback={null}>
          <StarField count={3500} />
          <Planet ref={planetHandleRef} />
          <MoonOrbit ref={moonHandleRef} />
        </Suspense>

        <EffectComposer enableNormalPass={false}>
          <Bloom
            mipmapBlur
            intensity={0.9}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.6}
          />
        </EffectComposer>
      </Canvas>

      {/* DOM title overlay — animated by GSAP */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="overflow-hidden">
          <div
            ref={titleRef}
            className="font-sans text-[clamp(2.2rem,7.5vw,7rem)] font-light tracking-[0.18em] text-white/95 mix-blend-screen"
            style={{
              textShadow:
                "0 0 24px rgba(120,180,255,0.45), 0 0 2px rgba(255,255,255,0.9)",
            }}
          >
            {TITLE}
          </div>
        </div>
        <div className="mt-3 overflow-hidden">
          <div
            ref={subtitleRef}
            className="font-sans text-[clamp(0.8rem,1.6vw,1.25rem)] font-light tracking-[0.5em] text-white/60"
          >
            {SUBTITLE}
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    </div>
  )
}

export default PlanetaryIntro
