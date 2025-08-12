import React, { useState, useEffect } from 'react';
import { ClockIcon, MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { DashboardService } from '../../../../services/dashboardService';
import Loader from '../../../../components/common/Loader';

interface SearchHistoryItem {
  id: string;
  query: string;
  searchedAt: string;
  totalResults: number;
  processingTime: number;
  aiServiceStatus: string;
  results: SearchResult[];
  feedback?: {
    rating: number;
    isCorrect: boolean;
  };
}

interface SearchResult {
  id: string;
  relevanceScore: number;
  confidenceScore: number;
  rank: number;
  ncoCode: {
    ncoCode: string;
    title: string;
  };
}

const RecentSearchHistory: React.FC = () => {
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const historyData = await DashboardService.getUserSearchHistory(1, 10);
        setRecentSearches(historyData.searches);
      } catch (err) {
        console.error('Error fetching search history:', err);
        setError('Failed to load search history');
        setRecentSearches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchHistory();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'no_results':
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      default:
        return 'No Results';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.8) return 'text-blue-600 bg-blue-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Loader size="sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-[#00295d] hover:text-[#01408f] text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentSearches.length === 0 ? (
        <div className="text-center py-8">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No search history found</p>
          <p className="text-gray-400 text-xs mt-1">Start searching to see your history here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentSearches.slice(0, 10).map((search) => (
            <div 
              key={search.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      "{search.query}"
                    </p>
                  </div>
                  
                  {search.results && search.results.length > 0 && search.results[0] && (
                    <div className="ml-6 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-[#00295d] bg-[#00295d]/10 px-2 py-1 rounded">
                          {search.results[0].ncoCode.ncoCode}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConfidenceColor(search.results[0].confidenceScore)}`}>
                          {Math.round(search.results[0].confidenceScore * 100)}% match
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 ml-0">
                        {search.results[0].ncoCode.title}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 ml-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(search.aiServiceStatus)}
                      <span className="text-xs text-gray-500">
                        {getStatusText(search.aiServiceStatus)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {search.totalResults > 0 && `${search.totalResults} results • `}
                      {formatDistanceToNow(new Date(search.searchedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {/* <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {recentSearches.filter(s => s.aiServiceStatus === 'success').length}
            </p>
            <p className="text-xs text-gray-500">Successful</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {recentSearches.reduce((acc, s) => acc + s.totalResults, 0)}
            </p>
            <p className="text-xs text-gray-500">Total Results</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {recentSearches.length > 0 
                ? Math.round((recentSearches.filter(s => s.aiServiceStatus === 'success').length / recentSearches.length) * 100)
                : 0}%
            </p>
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default RecentSearchHistory;
