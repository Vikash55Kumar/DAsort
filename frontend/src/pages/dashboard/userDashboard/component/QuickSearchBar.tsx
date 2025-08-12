import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import { jobService } from '../../../../services/jobService';

interface NCOSearchResult {
  id: string;
  ncoCode: string;
  title: string;
  description: string;
  majorGroup: string;
  subMajorGroup: string;
  minorGroup: string;
  relevanceScore: number;
  confidenceScore: number;
  rank: number;
  ncoCodeId?: string;
}

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
}

const QuickSearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NCOSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  const [resultFeedback, setResultFeedback] = useState<Record<string, 'helpful' | 'not-helpful' | null>>({});
  const [feedbackLoading, setFeedbackLoading] = useState<Record<string, boolean>>({});
  const [autoSearch, setAutoSearch] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState<{ query: string; count: number; rank: number; }[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<NCOSearchResult | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Fetch trending searches on component mount
  useEffect(() => {
    const fetchTrendingSearches = async () => {
      try {
        setTrendingLoading(true);
        const response = await jobService.getTrendingSearches('7d');
        
        // Transform backend response to include rank
        const trendsWithRank = response.topQueries
          .slice(0, 6)
          .map((item: { query: string; count: number }, index: number) => ({
            query: item.query,
            count: item.count,
            rank: index + 1
          }));
        
        setTrendingSearches(trendsWithRank);
        console.log('✅ Real trending searches loaded:', trendsWithRank);
      } catch (error) {
        console.error('❌ Error fetching trending searches:', error);
        // No fallback data - show empty state or error message
        setTrendingSearches([]);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrendingSearches();
  }, []);

  // Debounced search function to avoid excessive API calls
  const performSearch = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setShowSuggestions(true);

    try {
      const response = await jobService.searchJobs(query.trim(), 10);
      
      setSearchResults(response.results);
      setTotalResults(response.totalResults);
      setProcessingTime(response.processingTime);
      setCurrentSearchId(response.searchId);

      const historyItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date(),
        resultsCount: response.results.length
      };
      
      setSearchHistory(prev => [historyItem, ...prev.slice(0, 4)]);
    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.response?.data?.message || 'Failed to search NCO classifications');
      setSearchResults([]);
      setTotalResults(0);
      setCurrentSearchId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;
    
    await performSearch(searchQuery);
  }, [searchQuery, loading, performSearch]);

  // Handle input change with conditional debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowSuggestions(false);
      setSearchResults([]);
      setCurrentSearchId(null);
      return;
    }

    if (autoSearch) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, performSearch, autoSearch]);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    setError(null);
    setTotalResults(0);
    setProcessingTime(0);
    setCurrentSearchId(null);
    setResultFeedback({});
    setFeedbackLoading({});
    searchInputRef.current?.focus();
  }, []);

  // Handle quick search from suggestions
  const handleQuickSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    await performSearch(query);
  }, [performSearch]);

  // Handle view details modal
  const handleViewDetails = useCallback((result: NCOSearchResult) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  }, []);

  // Close details modal
  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedResult(null);
  }, []);

  // Handle feedback submission for individual results
  const handleResultFeedback = useCallback(async (
    result: NCOSearchResult, 
    isHelpful: boolean,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    
    if (!currentSearchId || !result.ncoCodeId) return;

    setFeedbackLoading(prev => ({ ...prev, [result.id]: true }));

    try {
      await jobService.submitSearchFeedback({
        searchId: currentSearchId,
        selectedCodeId: result.ncoCodeId,
        isCorrect: isHelpful,
        wasHelpful: isHelpful,
        comments: isHelpful 
          ? `User found ${result.ncoCode} helpful` 
          : `User found ${result.ncoCode} not helpful`
      });

      setResultFeedback(prev => ({
        ...prev,
        [result.id]: isHelpful ? 'helpful' : 'not-helpful'
      }));

    } catch (error) {
      console.warn('Failed to submit feedback:', error);
    } finally {
      setFeedbackLoading(prev => ({ ...prev, [result.id]: false }));
    }
  }, [currentSearchId]);

  // Voice search functionality
  const handleVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Voice search is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      performSearch(transcript);
    };

    recognition.onerror = (event: any) => {
      setError(`Voice search error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [performSearch]);

  // Handle click outside to close search results and keyboard shortcuts
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* SEARCH BAR SECTION */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MagnifyingGlassIcon className="h-6 w-6 text-[#00295d]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">AI-Powered NCO Search</h3>
                <p className="text-sm text-gray-600 mt-1">Intelligent classification with real-time matching</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Auto-search:</label>
                <button
                  onClick={() => setAutoSearch(!autoSearch)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    autoSearch ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  title={autoSearch ? 'Auto-search enabled' : 'Auto-search disabled'}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                      autoSearch ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-lg shadow-sm">
                <ClockIcon className="h-4 w-4" />
                <span className="font-medium">Real-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NCO classifications (e.g., 'Software Engineer', '2511', 'data scientist')..."
                className="block w-full pl-12 pr-36 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all duration-200 hover:border-gray-300"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e as any);
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
              />
              
              <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-3">
                {isListening && (
                  <div className="flex items-center space-x-2 mr-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-500 font-medium">Listening...</span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  disabled={loading || isListening}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50 rounded-lg hover:bg-blue-50"
                  title="Voice Search"
                >
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    title="Clear Search"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || loading}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  title="Search"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Enhanced Search Instructions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {autoSearch ? (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Auto-search enabled: Results appear automatically as you type (1.5s delay)
                </span>
              ) : (
                <span className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 text-xs mr-2">Enter</kbd>
                  Press Enter to search or click the search button
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {autoSearch ? 'AI Powered • Instant results' : 'AI Powered • Real-time search'}
            </div>
          </div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-1">Search Error</h4>
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => setError(null)} 
                  className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Loading Indicator */}
        {loading && (
          <div className="mx-6 mb-4 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200"></div>
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent absolute top-0"></div>
              </div>
              <div>
                <p className="text-base font-medium text-blue-900">Searching Classifications...</p>
                <p className="text-sm text-blue-600">Our AI is analyzing your query</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Search Results */}
        {showSuggestions && searchResults.length > 0 && (
          <div ref={resultsRef} className="mx-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-bold text-gray-900">Classification Results</h4>
                      <p className="text-sm text-gray-600">
                        {totalResults} results found in {processingTime}ms
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✨ AI Powered
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-6 py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm text-gray-500 font-medium">#{result.rank}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            result.confidenceScore >= 0.9 
                              ? 'bg-green-100 text-green-800' 
                              : result.confidenceScore >= 0.7 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {Math.round(result.confidenceScore * 100)}% match
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-1 text-lg">{result.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                        
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-mono text-white bg-gradient-to-r from-[#00295d] to-[#01408f]">
                            {result.ncoCode}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(result)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handleResultFeedback(result, true, e)}
                            disabled={feedbackLoading[result.id]}
                            className={`p-2 rounded-lg transition-colors ${
                              resultFeedback[result.id] === 'helpful'
                                ? 'bg-green-100 text-green-600'
                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title="Mark as helpful"
                          >
                            <HandThumbUpIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleResultFeedback(result, false, e)}
                            disabled={feedbackLoading[result.id]}
                            className={`p-2 rounded-lg transition-colors ${
                              resultFeedback[result.id] === 'not-helpful'
                                ? 'bg-red-100 text-red-600'
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title="Mark as not helpful"
                          >
                            <HandThumbDownIcon className="h-4 w-4" />
                          </button>
                          {feedbackLoading[result.id] && (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Search Results Found */}
        {showSuggestions && searchResults.length === 0 && !loading && (
          <div className="mx-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">No Results Found</h4>
                      <p className="text-sm text-gray-600">
                        We couldn't find any NCO classifications matching your search
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.657 2.172M12 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7.97 7.97 0 00-.064-1" />
                    </svg>
                  </div>
                  
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any NCO classifications matching "<span className="font-medium text-gray-900">{searchQuery}</span>". 
                    </p>
                    
                    <div className="text-sm text-gray-500 space-y-2">
                      <p>• Try using different keywords or terms</p>
                      <p>• Check for spelling mistakes</p>
                      <p>• Use broader search terms</p>
                      <p>• Try searching with NCO codes (e.g., "2511")</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search & Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Search History */}
        {searchHistory.length > 0 && !showSuggestions && (
          <div className="mx-6 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <ClockIcon className="h-5 w-5 text-purple-600 mr-2" />
                Recent Searches
              </h4>
              <div className="space-y-2">
                {searchHistory.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleQuickSearch(item.query)}
                    className="w-full text-left p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium group-hover:text-purple-700">
                        "{item.query}"
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {item.resultsCount} results
                        </span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TRENDING SEARCHES SECTION - COMPLETELY SEPARATE - ALWAYS VISIBLE */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-4 shadow-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 text-amber-600 mr-2" />
          🔥 Trending Searches
          {trendingLoading && (
            <div className="ml-2 w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </h4>
        
        {trendingLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-amber-100 animate-pulse">
                <div className="flex items-center justify-between mb-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-300 rounded w-8"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : trendingSearches.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {trendingSearches.map((trend, index) => (
              <button
                key={trend.query}
                onClick={() => handleQuickSearch(trend.query)}
                className="p-3 bg-white rounded-lg border border-amber-100 hover:border-amber-200 hover:shadow-sm transition-all text-left group relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-amber-700 truncate pr-2">
                    {trend.query}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded font-bold">
                      #{trend.rank}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Click to search</span>
                  <span className="text-xs text-green-600 font-medium">
                    {trend.count} searches
                  </span>
                </div>
                {/* Trending indicator for top 3 */}
                {index < 3 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-amber-100 rounded-full">
                <MagnifyingGlassIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No Trending Searches</h3>
                <p className="text-xs text-gray-500">
                  Start searching to see trending queries appear here
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-amber-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              📊 Based on last 7 days of search activity
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              Refresh trends
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#00295d] to-[#01408f]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-mono text-white bg-white/20">
                    {selectedResult.ncoCode}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedResult.confidenceScore >= 0.9 
                      ? 'bg-green-100 text-green-800' 
                      : selectedResult.confidenceScore >= 0.7 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {Math.round(selectedResult.confidenceScore * 100)}% match
                  </span>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="text-white hover:text-gray-200 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Title and Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedResult.title}</h2>
                <p className="text-gray-700 leading-relaxed">{selectedResult.description}</p>
              </div>

              {/* Classification Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Classification Hierarchy</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Major Group:</span>
                    <span className="text-sm text-gray-900">{selectedResult.majorGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Sub-Major Group:</span>
                    <span className="text-sm text-gray-900">{selectedResult.subMajorGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Minor Group:</span>
                    <span className="text-sm text-gray-900">{selectedResult.minorGroup}</span>
                  </div>
                </div>
              </div>

              {/* Match Statistics */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Match Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {Math.round(selectedResult.confidenceScore * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      #{selectedResult.rank}
                    </div>
                    <div className="text-sm text-gray-600">Search Rank</div>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Was this result helpful?</h3>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={(e) => {
                      handleResultFeedback(selectedResult, true, e);
                      closeDetailsModal();
                    }}
                    disabled={feedbackLoading[selectedResult.id]}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      resultFeedback[selectedResult.id] === 'helpful'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>Yes, Helpful</span>
                  </button>
                  <button
                    onClick={(e) => {
                      handleResultFeedback(selectedResult, false, e);
                      closeDetailsModal();
                    }}
                    disabled={feedbackLoading[selectedResult.id]}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      resultFeedback[selectedResult.id] === 'not-helpful'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <HandThumbDownIcon className="h-5 w-5" />
                    <span>Not Helpful</span>
                  </button>
                </div>
                {feedbackLoading[selectedResult.id] && (
                  <div className="flex justify-center mt-3">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleQuickSearch(selectedResult.ncoCode);
                    closeDetailsModal();
                  }}
                  className="px-6 py-2 bg-[#00295d] text-white font-medium rounded-lg hover:bg-[#01408f] transition-colors"
                >
                  Search This Code
                </button>
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickSearchBar;
