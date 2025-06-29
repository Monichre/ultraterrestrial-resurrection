"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Copy, X } from "lucide-react"
import { toast } from "sonner"
import type { TextStream } from "ai"

interface DocumentSummaryProps {
  fileName: string
  summary: string | TextStream<string> | any
  onClose: () => void
}

export function DocumentSummary({ fileName, summary, onClose }: DocumentSummaryProps) {
  const [textContent, setTextContent] = useState(
    typeof summary === 'string' ? summary : 'Processing document...'
  )

  // Handle TextStream type if present
  useEffect(() => {
    const processResponse = async () => {
      try {
        // Case 1: It's already a string
        if (typeof summary === 'string') {
          setTextContent(summary);
          return;
        }

        // Case 2: It's a TextStream from Vercel AI SDK
        if (typeof summary === 'object' && summary !== null) {
          // Check for TextStream interface
          if (typeof (summary as any).text === 'function') {
            const text = await (summary as TextStream<string>).text();
            setTextContent(text);
            return;
          }

          // Case 3: It's a Response object (from fetch)
          if (summary instanceof Response) {
            const text = await summary.text();
            setTextContent(text);
            return;
          }

          // Case 4: It has a toString method
          if (typeof summary.toString === 'function') {
            setTextContent(summary.toString());
            return;
          }
        }

        // Case 5: Fallback
        console.warn('Unrecognized summary format:', summary);
        setTextContent('Unable to display summary. Unknown format.');
      } catch (error) {
        console.error('Error processing summary:', error);
        setTextContent('Error processing document. Please try again.');
      }
    };

    processResponse();
  }, [summary])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textContent)
    toast.success("Summary copied to clipboard")
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
            <FileText className="w-4 h-4 text-white/70" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/90">Document Summary</h3>
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
        <div className="bg-white/[0.02] rounded-lg p-4 text-white/80 text-sm leading-relaxed overflow-auto max-h-[60vh]">
          {textContent}
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
