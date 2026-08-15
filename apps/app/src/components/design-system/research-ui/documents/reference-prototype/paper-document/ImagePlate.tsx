"use client"

import { Emblem } from "./Emblem"
import type { PlateSpec } from "../types/paper-document"

const CANVAS_W = 900
const CANVAS_H = 1350

interface Props {
  plate: PlateSpec
  tone: "light" | "dark" | "halftone"
  enableMotion?: boolean
}

/**
 * ImagePlate — duotone scorched photographic block. Uses a real image
 * when provided (grayscale/contrast duotone + multiply blend into paper),
 * otherwise renders a generated duotone placeholder. Hosts the emblem,
 * an optional fire glow, and an optional inset portrait thumbnail.
 *
 * Wrapped in its own stacking context (isolation:isolate) so the
 * multiply/screen blends do not bleed into the frames or typography.
 */
export function ImagePlate({ plate, tone, enableMotion }: Props) {
  const { box } = plate
  const torn = plate.torn
    ? {
        WebkitMaskImage:
          "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><filter id=\"t\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.02\" numOctaves=\"3\"/><feDisplacementMap in=\"SourceGraphic\" scale=\"14\"/></filter><rect width=\"100\" height=\"100\" fill=\"white\" filter=\"url(%23t)\"/></svg>')",
        WebkitMaskSize: "cover",
        maskImage:
          "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><filter id=\"t\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.02\" numOctaves=\"3\"/><feDisplacementMap in=\"SourceGraphic\" scale=\"14\"/></filter><rect width=\"100\" height=\"100\" fill=\"white\" filter=\"url(%23t)\"/></svg>')",
        maskSize: "cover",
      }
    : undefined

  return (
    <div
      className="absolute"
      style={{
        left: `${(box.x / CANVAS_W) * 100}%`,
        top: `${(box.y / CANVAS_H) * 100}%`,
        width: `${(box.w / CANVAS_W) * 100}%`,
        height: `${(box.h / CANVAS_H) * 100}%`,
        zIndex: 10,
        isolation: "isolate",
        ...torn,
      }}
    >
      {/* photo / placeholder */}
      {plate.imageSrc ? (
        <img
          src={plate.imageSrc}
          alt={plate.alt ?? ""}
          className="h-full w-full object-cover"
          style={{
            filter:
              tone === "dark" || tone === "halftone"
                ? "grayscale(1) contrast(1.25) brightness(0.85)"
                : "grayscale(1) contrast(1.12)",
            mixBlendMode: "multiply",
          }}
        />
      ) : (
        <div
          role="img"
          aria-label={plate.alt ?? "Scorched terrain plate (placeholder)"}
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(120,120,118,0.15) 0%, rgba(20,20,18,0.85) 70%, rgba(10,10,9,0.95) 100%)",
            mixBlendMode: "multiply",
          }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">
            IMAGE&nbsp;PLATE
          </span>
        </div>
      )}

      {/* smoke haze */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${enableMotion ? "pd-smoke" : ""}`}
        style={{
          background:
            "linear-gradient(180deg, rgba(30,30,28,0.55) 0%, rgba(30,30,28,0.05) 45%, transparent 70%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* fire glow */}
      {plate.fireGlow && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 ${enableMotion ? "pd-ember" : ""}`}
          style={{
            height: "40%",
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(243,194,122,0.6) 0%, rgba(229,107,63,0.25) 35%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* emblem */}
      {plate.emblem && plate.emblem !== "none" && (
        <div className="pointer-events-none absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2">
          <Emblem kind={plate.emblem} />
        </div>
      )}

      {/* inset portrait thumbnail */}
      {plate.insetThumb && (
        <div
          aria-hidden="true"
          className="absolute right-[8%] top-[30%]"
          style={{
            width: 70,
            height: 90,
            border: "1px solid var(--pd-line)",
            background: plate.insetThumbSrc
              ? `center/cover url(${plate.insetThumbSrc})`
              : "linear-gradient(180deg, #6b6b68, #262624)",
            filter: "grayscale(1) contrast(1.2)",
          }}
        />
      )}
    </div>
  )
}
