import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  FunnelIcon,
  CalendarIcon,
  EyeIcon,
  StarIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow, format } from 'date-fns';
import { DashboardService } from '../../../services/dashboardService';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/common/Button';

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

interface Filters {
  dateRange: '7d' | '30d' | '90d' | 'all';
  status: 'all' | 'success' | 'no_results' | 'error';
  sortBy: 'date' | 'relevance' | 'results';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}

const SearchHistory: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSearch, setSelectedSearch] = useState<SearchHistoryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    dateRange: '30d',
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    searchQuery: ''
  });

  const itemsPerPage = 20;

  useEffect(() => {
    fetchSearchHistory();
  }, [currentPage, filters]);

  useEffect(() => {
    applyFilters();
  }, [searchHistory, filters]);

  const fetchSearchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const historyData = await DashboardService.getUserSearchHistory(currentPage, itemsPerPage);
      setSearchHistory(historyData.searches);
      setTotalPages(historyData.pagination ? historyData.pagination.totalPages : Math.ceil(historyData.searches.length / itemsPerPage));
    } catch (err) {
      console.error('Error fetching search history:', err);
      setError('Failed to load search history');
      setSearchHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...searchHistory];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.aiServiceStatus === filters.status);
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.query.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange.replace('d', ''));
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(item => 
        new Date(item.searchedAt) >= cutoffDate
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(a.searchedAt).getTime();
          bValue = new Date(b.searchedAt).getTime();
          break;
        case 'relevance':
          aValue = a.results[0]?.relevanceScore || 0;
          bValue = b.results[0]?.relevanceScore || 0;
          break;
        case 'results':
          aValue = a.totalResults;
          bValue = b.totalResults;
          break;
        default:
          aValue = new Date(a.searchedAt).getTime();
          bValue = new Date(b.searchedAt).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredHistory(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'no_results':
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.8) return 'text-blue-600 bg-blue-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleViewDetails = (search: SearchHistoryItem) => {
    setSelectedSearch(search);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-[#00295d] to-[#01408f] rounded-xl">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Search History</h1>
                <p className="text-gray-600 mt-1">Complete record of your NCO classification searches</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "primary" : "outline"}
                icon={<FunnelIcon className="h-4 w-4" />}
              >
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search in History</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                    placeholder="Search your history..."
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00295d] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00295d] focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00295d] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="success">Successful</option>
                  <option value="no_results">No Results</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00295d] focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="relevance">Relevance</option>
                  <option value="results">Results Count</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({...filters, sortOrder: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00295d] focus:border-transparent"
                >
                  <option value="desc">
                    {filters.sortBy === 'date' ? 'Newest First' : 'Highest First'}
                  </option>
                  <option value="asc">
                    {filters.sortBy === 'date' ? 'Oldest First' : 'Lowest First'}
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredHistory.length}
                </p>
              </div>
              <MagnifyingGlassIcon className="h-8 w-8 text-[#00295d]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {filteredHistory.filter(s => s.aiServiceStatus === 'success').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Results</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {filteredHistory.length > 0 
                    ? Math.round(filteredHistory.reduce((acc, s) => acc + s.totalResults, 0) / filteredHistory.length)
                    : 0
                  }
                </p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {filteredHistory.length > 0 
                    ? Math.round((filteredHistory.filter(s => s.aiServiceStatus === 'success').length / filteredHistory.length) * 100)
                    : 0
                  }%
                </p>
              </div>
              <StarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search History List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <Button onClick={fetchSearchHistory} variant="primary">
                Try Again
              </Button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-8 text-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No search history found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or start searching</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredHistory.map((search) => (
                <div 
                  key={search.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      
                      {/* Search Query and Status */}
                      <div className="flex items-center space-x-3 mb-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <p className="text-lg font-medium text-gray-900 truncate">
                          "{search.query}"
                        </p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(search.aiServiceStatus)}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(search.aiServiceStatus)}`}>
                            {getStatusText(search.aiServiceStatus)}
                          </span>
                        </div>
                      </div>

                      {/* Results Summary */}
                      {search.results && search.results.length > 0 && search.results[0] && (
                        <div className="ml-8 mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-mono text-[#00295d] bg-[#00295d]/10 px-2 py-1 rounded">
                              {search.results[0].ncoCode.ncoCode}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConfidenceColor(search.results[0].confidenceScore)}`}>
                              {Math.round(search.results[0].confidenceScore * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {search.results[0].ncoCode.title}
                          </p>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="ml-8 flex items-center space-x-6 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(search.searchedAt), { addSuffix: true })}</span>
                        </div>
                        {search.totalResults > 0 && (
                          <div className="flex items-center space-x-1">
                            <DocumentTextIcon className="h-4 w-4" />
                            <span>{search.totalResults} results</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{search.processingTime}ms</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex items-center space-x-2">
                      <Button
                        onClick={() => handleViewDetails(search)}
                        variant="outline"
                        size="sm"
                        icon={<EyeIcon className="h-4 w-4" />}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                icon={<ChevronLeftIcon className="h-4 w-4" />}
              >
                Previous
              </Button>
              <span className="px-3 py-1 bg-[#00295d] text-white rounded text-sm">
                {currentPage}
              </span>
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                icon={<ChevronRightIcon className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Search Details Modal */}
      {selectedSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Search Details</h3>
                <button
                  onClick={() => setSelectedSearch(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Search Query */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Search Query</h4>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
                    "{selectedSearch.query}"
                  </p>
                </div>

                {/* Search Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Search Date</h4>
                    <p className="text-sm text-gray-900">
                      {format(new Date(selectedSearch.searchedAt), 'PPP p')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Results Count</h4>
                    <p className="text-sm text-gray-900">{selectedSearch.totalResults}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Processing Time</h4>
                    <p className="text-sm text-gray-900">{selectedSearch.processingTime}ms</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedSearch.aiServiceStatus)}
                      <span className="text-sm text-gray-900">
                        {getStatusText(selectedSearch.aiServiceStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Results */}
                {selectedSearch.results && selectedSearch.results.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Search Results</h4>
                    <div className="space-y-3">
                      {selectedSearch.results.slice(0, 5).map((result, index) => (
                        <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                                <span className="text-sm font-mono text-[#00295d] bg-[#00295d]/10 px-2 py-1 rounded">
                                  {result.ncoCode.ncoCode}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConfidenceColor(result.confidenceScore)}`}>
                                  {Math.round(result.confidenceScore * 100)}% match
                                </span>
                              </div>
                              <p className="text-sm text-gray-900 font-medium">
                                {result.ncoCode.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
