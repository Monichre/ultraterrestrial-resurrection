"use client"

import * as React from "react"
import { useCurrentEditor } from "@tiptap/react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { useRAGCommands } from "@/hooks/use-rag-commands"
import { ChevronDown, Search, CheckCircle, Quote, FileText, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function RAGDropdown() {
  const { editor } = useCurrentEditor()
  const {
    handleRAGSearch,
    handleRAGFactCheck,
    handleRAGCite,
    handleRAGElaborate,
    handleRAGSummarize,
  } = useRAGCommands(editor)

  if (!editor) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-style="ghost" className="gap-1">
          <Sparkles className="h-4 w-4" />
          <span>AI Knowledge</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Knowledge Base Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleRAGSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search Knowledge
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleRAGFactCheck}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Fact Check Selection
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleRAGCite}>
          <Quote className="mr-2 h-4 w-4" />
          Add Citation
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleRAGElaborate}>
          <FileText className="mr-2 h-4 w-4" />
          Elaborate with Context
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleRAGSummarize}>
          <FileText className="mr-2 h-4 w-4" />
          Summarize with Sources
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}