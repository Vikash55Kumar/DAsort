import React, { useState } from 'react';
import { jobService } from '../../services/jobService';
import type { SearchResult } from '../../types';
import { getConfidenceColor } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { MagnifyingGlassIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const JobSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await jobService.searchJobs(query, 10);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      // Mock results for demo
      setResults([
        {
          jobCode: {
            id: '1',
            code: '2514-0101',
            title: 'Software Developer',
            description: 'Design, develop, and maintain software applications using various programming languages and frameworks.',
            hierarchy: ['Professionals', 'Information and Communications Technology', 'Software and Applications Developers'],
          },
          confidenceScore: 0.95,
          matchType: 'exact',
        },
        {
          jobCode: {
            id: '2',
            code: '2519-0201',
            title: 'Web Developer',
            description: 'Create and maintain websites and web applications using HTML, CSS, JavaScript and other web technologies.',
            hierarchy: ['Professionals', 'Information and Communications Technology', 'Web and Multimedia Developers'],
          },
          confidenceScore: 0.87,
          matchType: 'semantic',
        },
        {
          jobCode: {
            id: '3',
            code: '2512-0101',
            title: 'Computer Programmer',
            description: 'Write, test, and maintain computer programs using various programming languages.',
            hierarchy: ['Professionals', 'Information and Communications Technology', 'Software and Applications Developers'],
          },
          confidenceScore: 0.82,
          matchType: 'semantic',
        },
      ]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const getMatchTypeBadge = (matchType: string) => {
    const colors = {
      exact: 'bg-green-100 text-green-800',
      semantic: 'bg-blue-100 text-blue-800',
      partial: 'bg-yellow-100 text-yellow-800',
    };
    return colors[matchType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Code Search</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter a job title or description to find matching NCO codes with AI-powered semantic search.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter job title or description (e.g., 'software engineer', 'data scientist', 'nurse')"
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              disabled={!query.trim()}
              icon={<MagnifyingGlassIcon className="h-4 w-4" />}
            >
              Search
            </Button>
          </div>
          
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <InformationCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Search Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use natural language - describe the job in your own words</li>
                <li>Include key responsibilities or skills for better matches</li>
                <li>Try synonyms if you don't find what you're looking for</li>
              </ul>
            </div>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Searching job codes..." />
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Search Results ({results.length} found)
            </h2>
            {results.length > 0 && (
              <p className="text-sm text-gray-500">
                Sorted by relevance and confidence score
              </p>
            )}
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-500 mb-4">
                Try rephrasing your search or using different keywords.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setSearched(false);
                }}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={result.jobCode.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-semibold text-blue-600">
                          {result.jobCode.code}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMatchTypeBadge(result.matchType)}`}>
                          {result.matchType} match
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceBadge(result.confidenceScore)}`}>
                          {(result.confidenceScore * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {result.jobCode.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {result.jobCode.description}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Hierarchy */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Classification Hierarchy:</h4>
                    <div className="flex flex-wrap items-center space-x-2">
                      {result.jobCode.hierarchy.map((level, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {level}
                          </span>
                          {i < result.jobCode.hierarchy.length - 1 && (
                            <span className="text-gray-400">›</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        Export
                      </Button>
                    </div>
                    <div className={`text-sm font-medium ${getConfidenceColor(result.confidenceScore)}`}>
                      Confidence: {(result.confidenceScore * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
