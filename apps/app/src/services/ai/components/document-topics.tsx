"use client"
import { motion } from "framer-motion"
import { Tag, Copy, X } from "lucide-react"
import { toast } from "sonner"

interface DocumentTopicsProps {
  fileName: string
  topics: string[]
  onClose: () => void
}

export function DocumentTopics({ fileName, topics, onClose }: DocumentTopicsProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(topics.join(", "))
    toast.success("Topics copied to clipboard")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full max-w-2xl backdrop-blur-2xl bg-black/90 rounded-xl border border-white/[0.05] shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-center">
            <Tag className="w-4 h-4 text-white/70" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/90">Document Topics</h3>
            <p className="text-xs text-white/50">{fileName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/[0.05] text-white/80 px-3 py-1.5 rounded-full text-sm"
            >
              {topic}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/[0.05] flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-white/70 rounded-lg text-sm transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  )
}
