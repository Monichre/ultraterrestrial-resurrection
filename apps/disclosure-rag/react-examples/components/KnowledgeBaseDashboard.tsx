// Main Dashboard Component
// Place this in your React project's components directory

import { useState } from 'react';
import { 
  useKnowledgeBaseStats, 
  useDocuments, 
  useSearch, 
  useTags, 
  useCategories 
} from '../hooks/useKnowledgeBase';
import { StatsOverview } from './StatsOverview';
import { DocumentSearch } from './DocumentSearch';
import { DocumentList } from './DocumentList';
import { FilterPanel } from './FilterPanel';

export const KnowledgeBaseDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'browse'>('overview');
  const [filters, setFilters] = useState({
    docType: '',
    tags: '',
    category: ''
  });

  const { stats, loading: statsLoading, error: statsError } = useKnowledgeBaseStats();
  const { documents, loading: docsLoading, hasMore, loadMore, refresh } = useDocuments({
    docType: filters.docType || undefined,
    tags: filters.tags || undefined
  });
  const { results, loading: searchLoading, search, clearResults } = useSearch();
  const { tags } = useTags();
  const { categories } = useCategories();

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    refresh({
      docType: newFilters.docType || undefined,
      tags: newFilters.tags || undefined
    });
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      search({
        query,
        docType: filters.docType || undefined,
        tags: filters.tags || undefined
      });
      setActiveTab('search');
    } else {
      clearResults();
    }
  };

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Failed to load knowledge base</p>
          <p className="text-gray-600">{statsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                🛸 UFO/UAP Knowledge Base
              </h1>
              {stats && (
                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {stats.total_documents.toLocaleString()} documents
                </span>
              )}
            </div>
            
            {/* Quick Search */}
            <div className="w-96">
              <DocumentSearch onSearch={handleSearch} loading={searchLoading} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFilterChange}
              tags={tags}
              categories={categories}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'search', label: 'Search Results', icon: '🔍' },
                  { id: 'browse', label: 'Browse Documents', icon: '📄' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                    {tab.id === 'search' && results && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {results.total_results}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <StatsOverview stats={stats} loading={statsLoading} />
            )}

            {activeTab === 'search' && (
              <div>
                {results ? (
                  <DocumentList 
                    documents={results.documents}
                    loading={false}
                    showLoadMore={false}
                    facets={results.facets}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Enter a search query to find documents</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'browse' && (
              <DocumentList 
                documents={documents}
                loading={docsLoading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                showLoadMore={true}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};