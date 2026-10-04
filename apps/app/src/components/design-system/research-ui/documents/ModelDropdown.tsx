"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModelDropdownProps {
  isOpen: boolean
  onClose: () => void
  options: string[]
  selectedOption: string
  onSelectOption: (option: string) => void
}

export function ModelDropdown({ isOpen, onClose, options, selectedOption, onSelectOption }: ModelDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelect = (option: string) => {
    onSelectOption(option)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute left-full ml-2 top-0 z-50 w-72 bg-neutral-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, x: -20, height: 0 }}
          animate={{ opacity: 1, x: 0, height: "auto" }}
          exit={{ opacity: 0, x: -20, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-100">Select a Model</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#adf0dd]"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                    selectedOption === option ? "bg-zinc-800 text-[#adf0dd]" : "hover:bg-zinc-800 text-zinc-100",
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <span className="text-sm">{option}</span>
                  {selectedOption === option && <Check className="h-4 w-4 text-[#adf0dd]" />}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-4 text-zinc-400 text-sm">No models found matching "{searchQuery}"</div>
            )}
          </div>
          <div className="p-3 border-t border-zinc-800 flex justify-between">
            <span className="text-xs text-zinc-400">
              {filteredOptions.length} model{filteredOptions.length !== 1 ? "s" : ""}
            </span>
            <button className="text-xs text-[#adf0dd] hover:underline" onClick={onClose}>
              Done
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
