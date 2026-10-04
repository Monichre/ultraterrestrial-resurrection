"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Folder, FolderOpen, FileText } from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: "file" | "image"
  size?: string
}

interface FolderItem {
  id: string
  name: string
  files: FileItem[]
  isSecret?: boolean
}

interface AnimatedFolderProps {
  folder: FolderItem
  onFileSelect?: (file: FileItem) => void
}

export default function AnimatedFolder({ folder, onFileSelect }: AnimatedFolderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleFolder = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="my-1">
      {/* Folder Header */}
      <div
        className={`group flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors ${
          isOpen ? "bg-neutral-800/30" : "hover:bg-neutral-800/20"
        }`}
        onClick={toggleFolder}
      >
        <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }} className="text-neutral-400">
          {isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
        </motion.div>
        <span className="flex-1 font-mono text-sm text-neutral-300">{folder.name}</span>
        {folder.isSecret && (
          <div className="rounded bg-neutral-800/40 px-1 py-0.5">
            <span className="font-mono text-[10px] text-neutral-500">CLASSIFIED</span>
          </div>
        )}
      </div>

      {/* Files */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-1 border-l border-neutral-800 pl-5">
              {folder.files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer px-2 py-1 hover:bg-neutral-800/20"
                  onClick={() => onFileSelect && onFileSelect(file)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="font-mono text-xs text-neutral-400">{file.name}</span>
                    {file.size && <span className="ml-auto font-mono text-[10px] text-neutral-500">{file.size}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

