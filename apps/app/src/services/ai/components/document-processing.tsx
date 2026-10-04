"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface DocumentProcessingProps {
  fileName: string
  action: string
  progress?: number
}

export function DocumentProcessing({ fileName, action, progress }: DocumentProcessingProps) {
  const [localProgress, setLocalProgress] = useState(0)

  useEffect(() => {
    // If an external progress value is provided, use it
    if (progress !== undefined) {
      setLocalProgress(progress)
      return
    }

    // Otherwise use an indeterminate progress indicator
    const timer = setInterval(() => {
      setLocalProgress(prev => {
        // Increase progress but never reach 100% until complete
        if (prev < 90) {
          return prev + (90 - prev) * 0.1
        }
        return prev
      })
    }, 500)

    return () => clearInterval(timer)
  }, [progress])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full max-w-md backdrop-blur-2xl bg-black/90 rounded-xl border border-white/[0.05] shadow-2xl overflow-hidden"
    >
      <div className="p-6 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/70 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-white/90 mb-1">{action}</h3>
        <p className="text-sm text-white/50 text-center">{fileName}</p>

        <div className="w-full mt-6 bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-white/30"
            style={{ width: `${localProgress}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
