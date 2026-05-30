"use client"

import type React from "react"
import { PaperclipIcon, PlusIcon, BrainIcon, SearchIcon } from "lucide-react"

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function MessageInput({ value, onChange, onSubmit }: MessageInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(e)
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-[#111] bg-opacity-70 backdrop-blur-sm rounded-3xl border border-[#333] p-4 shadow-lg 
    transition-all duration-300 hover:shadow-[0_0_15px_rgba(100,100,100,0.1)] hover:border-[#444] 
    focus-within:border-[#555] focus-within:shadow-[0_0_20px_rgba(120,120,120,0.15)] group"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-gray-300 placeholder:text-gray-500 text-sm 
      outline-none border-none focus:outline-none focus:border-none focus:ring-0 
      group-hover:text-gray-200 w-full"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Add"
              className="text-gray-500 hover:text-gray-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-full p-1"
            >
              <PlusIcon size={18} />
              <span className="sr-only">Add</span>
            </button>
            <button
              type="button"
              title="AI Assist"
              className="text-gray-500 hover:text-gray-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-full p-1"
            >
              <BrainIcon size={18} />
              <span className="sr-only">AI Assist</span>
            </button>
            <button
              type="button"
              title="Search"
              className="text-gray-500 hover:text-gray-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-full p-1"
            >
              <SearchIcon size={18} />
              <span className="sr-only">Search</span>
            </button>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-300 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-full p-1"
            >
              <PaperclipIcon size={18} className="transform transition-transform hover:rotate-12" />
              <span className="sr-only">Attach file</span>
            </button>
            <button
              type="submit"
              className="ml-2 text-gray-400 hover:text-gray-200 transition-all duration-300 disabled:opacity-50 disabled:hover:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 rounded-lg px-2 py-1 hover:bg-gray-800 hover:bg-opacity-30"
              disabled={!value.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
