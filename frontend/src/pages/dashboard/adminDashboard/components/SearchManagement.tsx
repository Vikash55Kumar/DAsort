import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  CalendarDaysIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SearchRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  query: string;
  results: {
    ncoCode: string;
    title: string;
    confidence: number;
  }[];
  timestamp: string;
  executionTime: number;
  resultCount: number;
  feedback?: {
    rating: number;
    comment?: string;
  };
}

const SearchManagement: React.FC = () => {
  const [searchRecords, setSearchRecords] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<SearchRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchSearchRecords();
  }, []);

  const fetchSearchRecords = async () => {
    try {
      // TODO: Replace with actual API call
      const mockRecords: SearchRecord[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          query: 'software developer',
          results: [
            { ncoCode: '25120100', title: 'Software Developer', confidence: 0.95 },
            { ncoCode: '25120200', title: 'Systems Analyst', confidence: 0.78 },
            { ncoCode: '25120300', title: 'Web Developer', confidence: 0.72 }
          ],
          timestamp: '2024-01-20T10:30:00Z',
          executionTime: 1.2,
          resultCount: 3,
          feedback: { rating: 5, comment: 'Very accurate results' }
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          query: 'teacher primary school',
          results: [
            { ncoCode: '23410100', title: 'Primary School Teacher', confidence: 0.91 },
            { ncoCode: '23410200', title: 'Elementary Teacher', confidence: 0.85 }
          ],
          timestamp: '2024-01-20T09:15:00Z',
          executionTime: 0.8,
          resultCount: 2,
          feedback: { rating: 4 }
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Mike Johnson',
          userEmail: 'mike@example.com',
          query: 'mechanical engineer',
          results: [
            { ncoCode: '21440100', title: 'Mechanical Engineer', confidence: 0.88 }
          ],
          timestamp: '2024-01-19T16:45:00Z',
          executionTime: 1.5,
          resultCount: 1
        }
      ];
      setSearchRecords(mockRecords);
    } catch (error) {
      console.error('Failed to fetch search records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = searchRecords.filter(record => {
    const matchesSearch = 
      record.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || 
      new Date(record.timestamp).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const handleDeleteRecord = async (recordId: string) => {
    if (confirm('Are you sure you want to delete this search record?')) {
      setSearchRecords(searchRecords.filter(record => record.id !== recordId));
    }
  };

  const SearchDetailsModal: React.FC = () => {
    if (!selectedRecord) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Search Record Details</h3>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* User Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">User Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="text-sm text-gray-900">{selectedRecord.userName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="text-sm text-gray-900">{selectedRecord.userEmail}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Details */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Search Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Query</label>
                    <div className="text-sm text-gray-900 bg-white p-2 rounded border">
                      {selectedRecord.query}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedRecord.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Execution Time</label>
                    <div className="text-sm text-gray-900">{selectedRecord.executionTime}s</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Result Count</label>
                    <div className="text-sm text-gray-900">{selectedRecord.resultCount} results</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Search Results</h4>
              <div className="space-y-3">
                {selectedRecord.results.map((result, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.title}</div>
                        <div className="text-sm text-gray-600">NCO Code: {result.ncoCode}</div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-700">
                          Confidence: {(result.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${result.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Feedback */}
            {selectedRecord.feedback && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">User Feedback</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${
                              star <= selectedRecord.feedback!.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          ({selectedRecord.feedback.rating}/5)
                        </span>
                      </div>
                    </div>
                    {selectedRecord.feedback.comment && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Comment</label>
                        <div className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {selectedRecord.feedback.comment}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Search Management</h2>
          <p className="text-gray-600">Monitor and analyze user search activities</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Export Analytics
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">{searchRecords.length}</div>
          <div className="text-sm text-gray-600">Total Searches</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {(searchRecords.reduce((acc, record) => acc + record.executionTime, 0) / searchRecords.length).toFixed(2)}s
          </div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {searchRecords.filter(record => record.feedback && record.feedback.rating >= 4).length}
          </div>
          <div className="text-sm text-gray-600">Positive Feedback</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-purple-600">
            {(searchRecords.reduce((acc, record) => acc + record.resultCount, 0) / searchRecords.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Avg Results per Search</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by query, user name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setDateFilter('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Search Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Query
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <UserIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{record.userName}</div>
                        <div className="text-sm text-gray-500">{record.userEmail}</div>
                        <div className="text-sm text-gray-700 mt-1 bg-gray-100 px-2 py-1 rounded">
                          "{record.query}"
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.resultCount} results</div>
                    {record.results[0] && (
                      <div className="text-sm text-gray-500">
                        Top: {record.results[0].title}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.executionTime}s</div>
                    <div className="text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.feedback ? (
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= record.feedback!.rating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          {record.feedback.rating}/5
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No feedback</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No search records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Search Details Modal */}
      {showDetailsModal && <SearchDetailsModal />}
    </div>
  );
};

export default SearchManagement;
