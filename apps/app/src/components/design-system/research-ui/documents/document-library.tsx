'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  data: string;
  metadata: {
    title: string;
    source: string;
    doc_type: string;
    created_at: string;
    updated_at: string;
    tags: string[];
  };
  score?: number;
}

interface DocumentLibraryProps {
  onDocumentSelect?: (doc: Document) => void;
}

export function DocumentLibrary({ onDocumentSelect }: DocumentLibraryProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search documents
  const searchDocuments = async () => {
    if (!searchQuery.trim()) {
      browseDocuments();
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '20',
        ...(selectedType && { type: selectedType }),
      });

      const response = await fetch(`/api/documents?${params}`);
      const data = await response.json();

      if (data.success) {
        setDocuments(data.results);
        setTotalPages(1); // Search doesn't paginate
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Browse all documents
  const browseDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(selectedType && { type: selectedType }),
      });

      const response = await fetch(`/api/documents/browse?${params}`);
      const data = await response.json();

      if (data.success) {
        setDocuments(data.documents);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Browse error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    browseDocuments();
  }, [page, selectedType]);

  const docTypes = [
    { value: 'case_file', label: 'Case Files', color: 'bg-blue-500' },
    { value: 'transcript', label: 'Transcripts', color: 'bg-green-500' },
    { value: 'article', label: 'Articles', color: 'bg-purple-500' },
    { value: 'research', label: 'Research', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchDocuments()}
              placeholder="Search documents..."
              className="pl-10"
            />
          </div>
          <Button onClick={searchDocuments}>Search</Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectedType(null);
              setPage(1);
            }}
          >
            All Types
          </Button>
          {docTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedType(type.value);
                setPage(1);
              }}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="text-center py-12">Loading documents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onDocumentSelect?.(doc)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <Badge
                    className={
                      docTypes.find((t) => t.value === doc.metadata.doc_type)
                        ?.color || 'bg-gray-500'
                    }
                  >
                    {doc.metadata.doc_type}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">
                  {doc.metadata.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <span className="truncate">{doc.metadata.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(doc.metadata.updated_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {doc.metadata.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-3 w-3" />
                      {doc.metadata.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.metadata.tags.length > 3 && (
                        <span className="text-xs">
                          +{doc.metadata.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  {doc.score && (
                    <div className="text-xs text-gray-500">
                      Relevance: {(doc.score * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!searchQuery && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}