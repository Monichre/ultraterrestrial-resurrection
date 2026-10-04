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
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg border border-gray-200 border-neutral-800/50 bg-black/20 backdrop-blur-sm dark:border-gray-800"
    >
      <div className="relative flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-6">
          <div className="font-mono text-xs text-neutral-500">∆x → 0</div>
          <div className="font-mono text-xs text-neutral-500">∫ dx</div>
          <div className="font-mono text-xs text-neutral-500">∑ n→∞</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-500">{warning}</span>
        </div>
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, neutral-500 1px, transparent 0)`,
          backgroundSize: "16px",
        }}
      />
    </motion.div>
  )
}

