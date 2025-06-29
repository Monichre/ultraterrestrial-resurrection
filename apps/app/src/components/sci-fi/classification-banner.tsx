"use client"

import { motion } from "framer-motion"

interface ClassificationBannerProps {
  level?: "top-secret" | "classified" | "confidential"
  warning?: string
}

export default function ClassificationBanner({
  level = "top-secret",
  warning = "AUTHORIZED PERSONNEL ONLY",
}: ClassificationBannerProps) {
  const levelColors = {
    "top-secret": "text-red-400 border-red-400/50 bg-red-400/10",
    "classified": "text-yellow-400 border-yellow-400/50 bg-yellow-400/10", 
    "confidential": "text-blue-400 border-blue-400/50 bg-blue-400/10"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-lg border backdrop-blur-sm ${levelColors[level]}`}
    >
      {/* Graph paper background pattern */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

      <div className="relative flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-6">
          <div className="font-mono text-xs opacity-70">∆x → 0</div>
          <div className="font-mono text-xs opacity-70">∫ dx</div>
          <div className="font-mono text-xs opacity-70">∑ n→∞</div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs font-bold tracking-wider">
            {level.toUpperCase()}
          </span>
          <span className="font-mono text-xs opacity-70">{warning}</span>
        </div>
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      />
    </motion.div>
  )
}