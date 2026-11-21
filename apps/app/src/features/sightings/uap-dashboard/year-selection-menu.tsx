'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeRange } from '@/hooks/use-sightings-data'

interface YearSelectionMenuProps {
  availableYears: number[]
  selectedYear: number
  onChange: (year: number) => void
  className?: string
}

export function YearSelectionMenu({
  availableYears,
  selectedYear,
  onChange,
  className = '',
}: YearSelectionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(selectedYear)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Update highlighted year when selected year changes
  useEffect(() => {
    setHighlighted(selectedYear)
  }, [selectedYear])

  const handleSelect = (year: number) => {
    onChange(year)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Selected year display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-10 px-4 py-2 bg-black border border-white/30 text-white font-monument-mono text-xs uppercase"
      >
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          <span>Year: {selectedYear}</span>
        </div>
        <div className="w-4 h-4 flex justify-center items-center">
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto bg-black border border-white/20 backdrop-blur-sm scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            <div className="py-1">
              {availableYears.map((year) => (
                <div
                  key={year}
                  className={`px-4 py-2 font-monument-mono text-xs cursor-pointer flex items-center gap-2 transition-colors
                    ${
                      year === highlighted
                        ? 'bg-white/10 text-cyan-400'
                        : 'text-white hover:bg-white/5'
                    }`}
                  onMouseEnter={() => setHighlighted(year)}
                  onClick={() => handleSelect(year)}
                >
                  {year === selectedYear && (
                    <motion.div
                      layoutId="selectedIndicator"
                      className="h-1 w-1 rounded-full bg-cyan-500"
                    />
                  )}
                  <span>{year}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tech-style decorative elements */}
      <div className="absolute top-0 right-0 h-px w-4 bg-cyan-500/40" />
      <div className="absolute top-0 right-0 h-3 w-px bg-cyan-500/40" />
      <div className="absolute bottom-0 left-0 h-px w-4 bg-cyan-500/40" />
      <div className="absolute bottom-0 left-0 h-3 w-px bg-cyan-500/40" />
    </div>
  )
}