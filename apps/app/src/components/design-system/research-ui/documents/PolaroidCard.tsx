"use client"

import { memo, useMemo } from "react"
import type { NodeProps } from "@xyflow/react"
import { Handle, Position } from "@xyflow/react"
import { FileCheckIcon, FileTextIcon, FlaskConicalIcon, UsersIcon } from "lucide-react"

import "@xyflow/react/dist/style.css"

export const PolaroidCard = ({ data, isConnectable }: NodeProps) => {
  const cardStyle = useMemo(() => {
    switch (data.type) {
      case "reference":
        return { icon: <FileTextIcon size={16} />, labelText: "REFERENCE", codeNumber: "44-18-0044" }
      case "experiment":
        return { icon: <FlaskConicalIcon size={16} />, labelText: "EXPERIMENT", codeNumber: "09C6T2" }
      case "interview":
        return { icon: <UsersIcon size={16} />, labelText: "INTERVIEW", codeNumber: "3999-0420422" }
      case "evidence":
        return { icon: <FileCheckIcon size={16} />, labelText: "EVIDENCE", codeNumber: "1-42235-2" }
      default:
        return { icon: <FileTextIcon size={16} />, labelText: "DOCUMENT", codeNumber: "099731" }
    }
  }, [data.type])

  const stableRandoms = useMemo(() => {
    const codeNumbers = [
      "44 18 0044",
      "09C6T2",
      "820 43135 42/436",
      "089 | 04 | 7-2 | T137",
      "WALK: 09C6T2",
      "E080U W525",
      "140 04",
      "19 10 121",
      "TS00K3",
    ]
    return {
      rotation: Math.floor(Math.random() * 5) - 2,
      code: codeNumbers[Math.floor(Math.random() * codeNumbers.length)],
      showTechElements: Math.random() > 0.5,
      showRedacted: Math.random() > 0.5,
      classification: Math.random() > 0.5 ? "CLASSIFIED" : "CONFIDENTIAL",
      yearSuffix: Math.floor(Math.random() * 1000),
      showSignatureLine: Math.random() > 0.7,
      showAnnotation: Math.random() > 0.5,
      annotationTop: 20 + Math.random() * 40,
      annotationLeft: 20 + Math.random() * 40,
    }
  }, [])

  const hasPhoto = data.type === "evidence" || data.photo
  const year = "'78"

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 !border-2 !bg-black z-10"
      />
      <div
        className="font-mono"
        style={{
          position: "relative",
          width: "280px",
          backgroundColor: "#e8e3d5",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          transform: `rotate(${stableRandoms.rotation}deg)`,
          backgroundImage:
            "radial-gradient(#00000020 1px, transparent 1px), linear-gradient(to right, #00000010 1px, transparent 1px), linear-gradient(to bottom, #00000010 1px, transparent 1px)",
          backgroundSize: "4px 4px, 20px 20px, 20px 20px",
          border: "1px solid #000",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-black pb-1 mb-1">
          <div className="text-xs font-bold">{stableRandoms.code}</div>
          <div className="bg-black text-white px-2 py-1 text-xs tracking-widest">{cardStyle.codeNumber}</div>
        </div>

        {/* Content Area */}
        <div
          style={{
            backgroundColor: hasPhoto ? "#000" : "#e8e3d5",
            position: "relative",
            minHeight: "160px",
            border: "1px solid #000",
            overflow: "hidden",
          }}
        >
          <div
            className="absolute inset-0 opacity-70 z-[1]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #00000020 1px, transparent 1px), linear-gradient(to bottom, #00000020 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {hasPhoto && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <img
                src={data.photo || "/textures/polaroid-photo.png"}
                alt="Evidence"
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(100%) contrast(1.2) brightness(0.8)", mixBlendMode: "screen" }}
              />
              <div
                className="absolute inset-0 mix-blend-overlay"
                style={{
                  backgroundImage: "radial-gradient(#ffffff40 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                }}
              />
              {stableRandoms.showAnnotation && (
                <div
                  className="absolute border-2 border-red-700 rounded-full z-10"
                  style={{
                    width: "60px",
                    height: "60px",
                    top: `${stableRandoms.annotationTop}%`,
                    left: `${stableRandoms.annotationLeft}%`,
                  }}
                />
              )}
            </div>
          )}
          <div
            className="relative z-10 p-3"
            style={{
              backgroundColor: hasPhoto ? "rgba(232, 227, 213, 0.9)" : "transparent",
              border: hasPhoto ? "1px solid #000" : "none",
              margin: hasPhoto ? "10px" : "0",
            }}
          >
            <div className="text-sm font-bold uppercase mb-2 border-b border-black pb-0.5 tracking-widest">
              {data.label}
            </div>
            <div className="text-xs leading-tight">{data.content}</div>
            {stableRandoms.showTechElements && (
              <div className="mt-2 flex items-center gap-1">
                <div className="h-3 w-3 bg-black" />
                <div className="h-3 w-8 bg-black" />
                <div className="text-xs">17 ⊂ 2 || ⊃ |</div>
              </div>
            )}
            {stableRandoms.showRedacted && (
              <div className="mt-2 text-xs flex flex-wrap gap-1">
                <span className="inline-block bg-black text-transparent px-1">redacted</span>
                <span className="inline-block bg-black text-transparent px-3">text</span>
                <span className="inline-block bg-black text-transparent px-2">here</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-black pt-1">
          <div className="px-2 py-1 text-xs font-bold border border-black bg-black text-[#e8e3d5] tracking-widest">
            {cardStyle.labelText}
          </div>
          <div className="text-xs font-bold text-red-700 border border-red-700 px-2 py-1 tracking-wider">
            {stableRandoms.classification}
          </div>
        </div>
        <div
          className="absolute text-[8px] opacity-70 transform -rotate-180 [writing-mode:vertical-rl]"
          style={{ bottom: "2px", right: "2px" }}
        >
          {year} {stableRandoms.yearSuffix}
        </div>
        {stableRandoms.showSignatureLine && (
          <div
            className="absolute w-10 h-px bg-red-700"
            style={{ bottom: "20px", left: "10px", boxShadow: "0 0 0 1px #b91c1c" }}
          />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 !border-2 !bg-black z-10"
      />
    </>
  )
}

export default memo(PolaroidCard)
