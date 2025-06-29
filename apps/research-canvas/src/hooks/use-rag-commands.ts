import { Editor } from '@tiptap/react'
import { RAGLLMHandler } from '@/lib/tiptap/custom-llm-handler'
import { toast } from '@/components/ui/use-toast'
import { useState } from 'react'

export function useRAGCommands(editor: Editor | null) {
  const [loading, setLoading] = useState(false)
  const ragHandler = new RAGLLMHandler()

  const handleRAGSearch = async () => {
    if (!editor) return
    
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    
    if (!selectedText) {
      toast({
        title: "No text selected",
        description: "Please select text to search in the knowledge base.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const results = await ragHandler.searchDocuments(selectedText)
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "No relevant documents found in the knowledge base.",
        })
        return
      }
      
      // For now, insert the first result as a comment
      // In a full implementation, show a modal to select from results
      const firstResult = results[0]
      editor.chain()
        .focus()
        .insertContent(`\n\n**Related Document:** ${firstResult.title}\n${firstResult.summary}\n`)
        .run()
        
      toast({
        title: "Search complete",
        description: `Found ${results.length} related documents.`,
      })
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not search the knowledge base. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRAGFactCheck = async () => {
    if (!editor) return
    
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    
    if (!selectedText) {
      toast({
        title: "No text selected",
        description: "Please select text to fact check.",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    try {
      const factCheck = await ragHandler.factCheck(selectedText)
      
      // Apply highlight based on verification status
      editor.chain()
        .focus()
        .setMark('highlight', { 
          color: factCheck.verified ? '#10b981' : '#ef4444' 
        })
        .run()
      
      // Insert fact check result as a comment
      editor.chain()
        .focus()
        .insertContent(`\n\n**Fact Check:** ${factCheck.explanation}\n`)
        .run()
        
      toast({
        title: factCheck.verified ? "Verified" : "Unverified",
        description: factCheck.explanation,
      })
    } catch (error) {
      toast({
        title: "Fact check failed",
        description: "Could not verify the selected text.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRAGCite = async () => {
    if (!editor) return
    
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    
    if (!selectedText) {
      toast({
        title: "No text selected",
        description: "Please select text to add citations.",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    try {
      const citations = await ragHandler.searchDocuments(selectedText, {
        type: 'citation'
      })
      
      if (citations.length === 0) {
        toast({
          title: "No citations found",
          description: "No relevant citations found for the selected text.",
        })
        return
      }
      
      // Insert the first citation inline
      const citation = citations[0]
      editor.chain()
        .focus()
        .insertContent(` [${citation.title}]`)
        .run()
        
      toast({
        title: "Citation added",
        description: `Added citation: ${citation.title}`,
      })
    } catch (error) {
      toast({
        title: "Citation failed",
        description: "Could not add citation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRAGElaborate = async () => {
    if (!editor) return
    
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    
    if (!selectedText) {
      toast({
        title: "No text selected",
        description: "Please select text to elaborate on.",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    try {
      // Search for related content
      const relatedDocs = await ragHandler.searchDocuments(selectedText)
      
      // Generate elaboration based on context
      const prompt = `Elaborate on this text using information from these sources: ${
        relatedDocs.map(d => d.title).join(', ')
      }. Text: "${selectedText}"`
      
      const elaboration = await ragHandler.generateText(prompt, {
        context: relatedDocs.map(d => d.summary).join('\n'),
        maxTokens: 300
      })
      
      // Insert elaboration after selection
      editor.chain()
        .focus()
        .insertContent(`\n\n${elaboration}\n`)
        .run()
        
      toast({
        title: "Elaboration complete",
        description: "Added context from knowledge base.",
      })
    } catch (error) {
      toast({
        title: "Elaboration failed",
        description: "Could not elaborate on the selected text.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRAGSummarize = async () => {
    if (!editor) return
    
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    
    if (!selectedText) {
      // If no selection, summarize entire document
      const fullText = editor.getText()
      if (!fullText) {
        toast({
          title: "No content",
          description: "The document is empty.",
          variant: "destructive"
        })
        return
      }
    }
    
    const textToSummarize = selectedText || editor.getText()
    
    setLoading(true)
    try {
      // Search for related sources
      const sources = await ragHandler.searchDocuments(textToSummarize.slice(0, 200))
      
      // Generate summary
      const prompt = `Summarize this text and include relevant information from the knowledge base: "${textToSummarize}"`
      
      const summary = await ragHandler.generateText(prompt, {
        context: sources.map(s => s.summary).join('\n'),
        maxTokens: 200
      })
      
      // Insert summary
      editor.chain()
        .focus()
        .insertContent(`\n\n**Summary:**\n${summary}\n\n**Sources:**\n${
          sources.map(s => `- ${s.title}`).join('\n')
        }\n`)
        .run()
        
      toast({
        title: "Summary complete",
        description: `Created summary with ${sources.length} sources.`,
      })
    } catch (error) {
      toast({
        title: "Summary failed",
        description: "Could not create summary. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    handleRAGSearch,
    handleRAGFactCheck,
    handleRAGCite,
    handleRAGElaborate,
    handleRAGSummarize,
    loading
  }
}