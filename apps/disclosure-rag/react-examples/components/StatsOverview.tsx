// Statistics Overview Component
import { KnowledgeBaseStats } from '../api';

interface StatsOverviewProps {
  stats: KnowledgeBaseStats | null;
  loading: boolean;
}

export const StatsOverview = ({ stats, loading }: StatsOverviewProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.total_documents.toLocaleString(),
      icon: '📄',
      color: 'blue'
    },
    {
      title: 'Total Size',
      value: `${stats.total_size_mb.toFixed(1)} MB`,
      icon: '💾',
      color: 'green'
    },
    {
      title: 'Document Types',
      value: Object.keys(stats.documents_by_type).length,
      icon: '📂',
      color: 'purple'
    },
    {
      title: 'Total Tags',
      value: stats.total_tags.toLocaleString(),
      icon: '🏷️',
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Types Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Types</h3>
          <div className="space-y-3">
            {Object.entries(stats.documents_by_type).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {type.replace('_', ' ')}
                </span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(count / stats.total_documents) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">
                    {count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Distribution */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.file_distribution).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{type}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ 
                        width: `${(count / stats.total_documents) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">
                    {count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {stats.popular_tags.slice(0, 20).map(([tag, count]) => (
            <span 
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
            >
              {tag}
              <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
                {count}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(stats.last_updated).toLocaleString()}
      </div>
    </div>
  );
};