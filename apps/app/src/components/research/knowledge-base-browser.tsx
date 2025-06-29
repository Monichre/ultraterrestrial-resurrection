"use client"

import { useState } from 'react'
import { Search, FileText, Video, Image, Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ragHandler } from '@/lib/rag/rag-llm-handler'

interface Document {
  id: string
  title: string
  doc_type: string
  file_type: string
  modified: string
  size_kb?: number
  size_mb?: number
  tags: string[]
  summary?: string
}

interface SearchResults {
  documents: Document[]
  total_results: number
}

interface KnowledgeBaseStats {
  total_documents: number
  total_size_mb: number
  documents_by_type: Record<string, number>
  total_tags: number
}

export function KnowledgeBaseBrowser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocType, setSelectedDocType] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  
  // Mock stats for now - in production this would come from an API
  const mockStats: KnowledgeBaseStats = {
    total_documents: 448,
    total_size_mb: 892.5,
    documents_by_type: {
      case_file: 89,
      transcript: 156,
      article: 134,
      research: 69
    },
    total_tags: 234
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    setLoading(true)
    try {
      // Use RAG handler to search documents
      const results = await ragHandler.searchDocuments(searchQuery, {
        type: selectedDocType === 'all' ? undefined : selectedDocType
      })
      
      // Transform RAG results to match our Document interface
      const documents: Document[] = results.map(result => ({
        id: result.id,
        title: result.title,
        doc_type: result.type,
        file_type: 'document',
        modified: new Date().toISOString(), // Mock date
        tags: [],
        summary: result.summary
      }))

      setSearchResults({
        documents,
        total_results: documents.length
      })
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults({
        documents: [],
        total_results: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText
    if (fileType.includes('video') || fileType.includes('mp4')) return Video
    if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png')) return Image
    return FileText
  }

  const getClassificationColor = (docType: string) => {
    switch (docType.toLowerCase()) {
      case 'case_file': 
      case 'events':
        return 'bg-red-400/20 text-red-400 border-red-400/50'
      case 'transcript':
      case 'testimonies':
        return 'bg-blue-400/20 text-blue-400 border-blue-400/50'
      case 'article':
      case 'documents':
        return 'bg-green-400/20 text-green-400 border-green-400/50'
      case 'research':
      case 'personnel':
        return 'bg-purple-400/20 text-purple-400 border-purple-400/50'
      default: 
        return 'bg-gray-400/20 text-gray-400 border-gray-400/50'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatFileSize = (sizeKb?: number, sizeMb?: number) => {
    if (sizeMb) return `${sizeMb.toFixed(1)} MB`
    if (sizeKb) return `${sizeKb.toFixed(0)} KB`
    return 'Size unknown'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-400 flex items-center justify-center gap-3">
          <Database className="h-6 w-6" />
          Knowledge Base
        </h2>
        <p className="text-green-400/70">
          Access {mockStats.total_documents.toLocaleString()} classified documents
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-green-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 text-sm">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {mockStats.total_documents.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-green-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 text-sm">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {mockStats.total_size_mb.toFixed(1)} MB
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 text-sm">Document Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {Object.keys(mockStats.documents_by_type).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 text-sm">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {mockStats.total_tags.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-900/50 border-green-400/20">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Search className="h-5 w-5" />
            RAG-Powered Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search documents using AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-gray-800 border-green-400/30 text-white"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="flex gap-4">
            <Select value={selectedDocType} onValueChange={setSelectedDocType}>
              <SelectTrigger className="w-48 bg-gray-800 border-green-400/30 text-white">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-green-400/30">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="personnel">Personnel</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="testimonies">Testimonies</SelectItem>
              </SelectContent>
            </Select>

            {(selectedDocType !== 'all' || searchQuery) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedDocType('all')
                  setSearchQuery('')
                  setSearchResults(null)
                }}
                className="border-green-400/30 text-green-400 hover:bg-green-400/10"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searchResults && (
        <Card className="bg-gray-900/50 border-green-400/20">
          <CardHeader>
            <CardTitle className="text-green-400">
              Search Results ({searchResults.total_results})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.documents.map((doc) => {
                  const IconComponent = getFileIcon(doc.file_type)
                  return (
                    <Card key={doc.id} className="bg-gray-800/50 border-gray-600/30 hover:border-green-400/50 transition-colors cursor-pointer group">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <IconComponent className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <Badge className={cn("text-xs", getClassificationColor(doc.doc_type))}>
                            {doc.doc_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardTitle className="text-white text-sm line-clamp-2 group-hover:text-green-400 transition-colors">
                          {doc.title}
                        </CardTitle>
                        {doc.summary && (
                          <CardDescription className="text-xs text-gray-400 line-clamp-2">
                            {doc.summary}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-green-400/30 text-green-400">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
                              +{doc.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-8 w-8 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No documents found for your search</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!searchResults && !loading && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-green-400/50 mx-auto mb-4" />
          <p className="text-green-400/70">Enter a search query to explore the knowledge base</p>
        </div>
      )}
    </div>
  )
}