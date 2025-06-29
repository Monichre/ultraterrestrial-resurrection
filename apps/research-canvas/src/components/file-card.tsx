"use client"

import type React from "react"
import { FileText, ImageIcon, FileAudio, FileVideo, File } from "lucide-react"

interface FileCardProps {
  file: {
    id: string
    name: string
    type: string
    size?: string
    thumbnail?: string
    classification?: "top-secret" | "classified" | "confidential"
  }
  rotation?: number
  width?: number
  height?: number
}

const FileCard: React.FC<FileCardProps> = ({ file, rotation = 0, width = 150, height = 180 }) => {
  // Determine file type icon
  const getFileIcon = () => {
    const fileType = file.type.toLowerCase()

    if (fileType.includes("image")) {
      return <ImageIcon className="h-12 w-12 text-neutral-400" />
    } else if (fileType.includes("audio")) {
      return <FileAudio className="h-12 w-12 text-neutral-400" />
    } else if (fileType.includes("video")) {
      return <FileVideo className="h-12 w-12 text-neutral-400" />
    } else if (
      fileType.includes("pdf") ||
      fileType.includes("text") ||
      fileType.includes("json") ||
      fileType.includes("xml")
    ) {
      return <FileText className="h-12 w-12 text-neutral-400" />
    } else {
      return <File className="h-12 w-12 text-neutral-400" />
    }
  }

  // Determine border color based on classification
  const getBorderColor = () => {
    switch (file.classification) {
      case "top-secret":
        return "border-red-900/50"
      case "classified":
        return "border-amber-900/50"
      case "confidential":
        return "border-blue-900/50"
      default:
        return "border-neutral-800"
    }
  }

  return (
    <div
      className={`flex flex-col bg-black/80 backdrop-blur-sm shadow-lg border ${getBorderColor()} p-3`}
      style={{
        transform: `rotate(${rotation}deg)`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="flex-1 flex items-center justify-center">
        {file.thumbnail ? (
          <div className="relative w-full h-full">
            <img
              src={file.thumbnail || "/placeholder.svg"}
              alt={file.name}
              className="object-cover w-full h-full"
              draggable={false}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">{getFileIcon()}</div>
        )}
      </div>
      <div className="mt-2 truncate text-center">
        <p className="text-xs font-mono text-neutral-300 truncate">{file.name}</p>
        {file.size && <p className="text-[10px] font-mono text-neutral-500">{file.size}</p>}
      </div>
    </div>
  )
}

export default FileCard
