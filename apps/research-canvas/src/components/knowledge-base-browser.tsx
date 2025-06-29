"use client"

import { useState } from 'react'
import { Search, FileText, Video, Image, Filter, Database } from 'lucide-react'
import { useKnowledgeBaseStats, useDocuments, useSearch, useTags } from '../hooks/use-knowledge-base'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { cn } from '../lib/utils'

export default function KnowledgeBaseBrowser() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocType, setSelectedDocType] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string>('all')

  const { stats, loading: statsLoading } = useKnowledgeBaseStats()
  const { documents, loading: docsLoading, hasMore, loadMore } = useDocuments({
    docType: selectedDocType === 'all' ? undefined : selectedDocType,
    tags: selectedTags === 'all' ? undefined : selectedTags,
    limit: 12
  })
  const { results, loading: searchLoading, search, clearResults } = useSearch()
  const { tags } = useTags()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search({
        query: searchQuery,
        docType: selectedDocType === 'all' ? undefined : selectedDocType,
        tags: selectedTags === 'all' ? undefined : selectedTags,
        limit: 20
      })
    } else {
      clearResults()
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
      case 'case_file': return 'bg-red-100 text-red-800 border-red-200'
      case 'transcript': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'article': return 'bg-green-100 text-green-800 border-green-200'
      case 'research': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-20 p-12">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-800 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-neutral-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Database className="h-10 w-10 text-cyan-400" />
            Knowledge Base
          </h1>
          <p className="text-xl text-neutral-400">
            Access {stats?.total_documents.toLocaleString()} classified documents
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-cyan-400 text-sm font-medium">Total Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.total_documents.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-cyan-400 text-sm font-medium">Total Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.total_size_mb.toFixed(1)} MB
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-cyan-400 text-sm font-medium">Document Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {Object.keys(stats.documents_by_type).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-cyan-400 text-sm font-medium">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.total_tags.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-cyan-400" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <Button onClick={handleSearch} disabled={searchLoading} className="bg-cyan-600 hover:bg-cyan-700">
                {searchLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <div className="flex gap-4">
              <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                <SelectTrigger className="w-48 bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="case_file">Case Files</SelectItem>
                  <SelectItem value="transcript">Transcripts</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTags} onValueChange={setSelectedTags}>
                <SelectTrigger className="w-48 bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Filter by Tag" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.slice(0, 20).map((tag) => (
                    <SelectItem key={tag.tag} value={tag.tag}>
                      {tag.tag} ({tag.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedDocType !== 'all' || selectedTags !== 'all' || searchQuery) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedDocType('all')
                    setSelectedTags('all')
                    setSearchQuery('')
                    clearResults()
                  }}
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="bg-neutral-900 border-neutral-800">
            <TabsTrigger value="browse" className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white">
              Browse ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white">
              Search Results {results && `(${results.total_results})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => {
                const IconComponent = getFileIcon(doc.file_type)
                return (
                  <Card key={doc.id} className="bg-neutral-900 border-neutral-800 hover:border-cyan-600 transition-colors cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <IconComponent className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                        <Badge className={cn("text-xs", getClassificationColor(doc.doc_type))}>
                          {doc.doc_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-sm line-clamp-2 group-hover:text-cyan-400 transition-colors">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-neutral-500">
                        {formatDate(doc.modified)} • {formatFileSize(doc.size_kb, doc.size_mb)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-neutral-700 text-neutral-400">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs border-neutral-700 text-neutral-400">
                            +{doc.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {docsLoading && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
              </div>
            )}

            {hasMore && !docsLoading && (
              <div className="flex justify-center mt-8">
                <Button onClick={loadMore} variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800">
                  Load More Documents
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            {results ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.documents.map((doc) => {
                  const IconComponent = getFileIcon(doc.file_type)
                  return (
                    <Card key={doc.id} className="bg-neutral-900 border-neutral-800 hover:border-cyan-600 transition-colors cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <IconComponent className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                          <Badge className={cn("text-xs", getClassificationColor(doc.doc_type))}>
                            {doc.doc_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardTitle className="text-white text-sm line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {doc.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-neutral-500">
                          {formatDate(doc.modified)} • {formatFileSize(doc.size_kb, doc.size_mb)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-neutral-700 text-neutral-400">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-neutral-700 text-neutral-400">
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
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400">Enter a search query to find documents</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}