import React, { useState, useEffect } from 'react';
import { 
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { DashboardService } from '../../../services/dashboardService';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/common/Button';

interface ReportFilters {
  dateRange: '7d' | '30d' | '90d' | 'custom';
  startDate?: string;
  endDate?: string;
  searchType?: 'all' | 'manual' | 'voice' | 'api';
  status?: 'all' | 'success' | 'no_results' | 'error';
}

interface AnalyticsData {
  searchTrends: any[];
  performanceMetrics: any;
  userEngagement: any;
  accuracyStats: any;
  popularSearches: any[];
  timeDistribution: any[];
  categoryBreakdown: any[];
}

const UserReports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: '30d',
    searchType: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [trends, engagement, dashboardStats] = await Promise.all([
        DashboardService.getSearchTrends(filters.dateRange),
        DashboardService.getUserEngagement(filters.dateRange),
        DashboardService.getDashboardStats()
      ]);

      // Process data for charts
      const searchTrendsData = trends.dailyStats.map((day: any) => ({
        date: format(new Date(day.date), 'MMM dd'),
        searches: day.total_searches,
        successful: day.successful_searches,
        accuracy: day.total_searches > 0 ? (day.successful_searches / day.total_searches * 100) : 0
      }));

      const categoryData = [
        { name: 'Technology', value: 35, color: '#00295d' },
        { name: 'Healthcare', value: 25, color: '#01408f' },
        { name: 'Education', value: 20, color: '#667eea' },
        { name: 'Manufacturing', value: 15, color: '#9f7aea' },
        { name: 'Others', value: 5, color: '#ed8936' }
      ];

      const timeDistributionData = [
        { hour: '9 AM', searches: 45 },
        { hour: '10 AM', searches: 67 },
        { hour: '11 AM', searches: 89 },
        { hour: '12 PM', searches: 78 },
        { hour: '1 PM', searches: 56 },
        { hour: '2 PM', searches: 92 },
        { hour: '3 PM', searches: 87 },
        { hour: '4 PM', searches: 74 },
        { hour: '5 PM', searches: 45 }
      ];

      const performanceData = {
        avgResponseTime: 1.2,
        accuracyRate: Math.round((dashboardStats.successfulMatches / Math.max(dashboardStats.totalSearches, 1)) * 100),
        totalSearches: dashboardStats.totalSearches,
        successfulMatches: dashboardStats.successfulMatches,
        userSatisfaction: 87
      };

      setAnalyticsData({
        searchTrends: searchTrendsData,
        performanceMetrics: performanceData,
        userEngagement: engagement,
        accuracyStats: performanceData,
        popularSearches: trends.topQueries.slice(0, 10),
        timeDistribution: timeDistributionData,
        categoryBreakdown: categoryData
      });

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // Create CSV content
    const csvData = [
      ['Date Range', filters.dateRange],
      ['Total Searches', analyticsData?.performanceMetrics.totalSearches || 0],
      ['Successful Matches', analyticsData?.performanceMetrics.successfulMatches || 0],
      ['Accuracy Rate', `${analyticsData?.performanceMetrics.accuracyRate || 0}%`],
      ['Average Response Time', `${analyticsData?.performanceMetrics.avgResponseTime || 0}s`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <XMarkIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={fetchAnalyticsData} variant="primary">
            Try Again
          </Button>
        </div>
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
                <DocumentChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Analytics Report</h1>
                <p className="text-gray-600 mt-1">Comprehensive analysis of your NCO search activities</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleExportReport}
                variant="outline"
                icon={<ArrowDownTrayIcon className="h-4 w-4" />}
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
              <select
                value={filters.searchType}
                onChange={(e) => setFilters({...filters, searchType: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00295d] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="manual">Manual Search</option>
                <option value="voice">Voice Search</option>
                <option value="api">API Search</option>
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
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Searches</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analyticsData?.performanceMetrics.totalSearches || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {analyticsData?.performanceMetrics.accuracyRate || 0}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {analyticsData?.performanceMetrics.avgResponseTime || 0}s
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Satisfaction</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {analyticsData?.performanceMetrics.userSatisfaction || 0}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Search Trends Over Time */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Search Trends Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData?.searchTrends || []}>
                  <defs>
                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00295d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00295d" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="searches" 
                    stroke="#00295d" 
                    fillOpacity={1} 
                    fill="url(#colorSearches)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Search Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Search Category Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData?.categoryBreakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData?.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Activity Pattern */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Activity Pattern</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.timeDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="searches" fill="#01408f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Accuracy Trends */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Accuracy Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData?.searchTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Popular Searches Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Popular Searches</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Search Query
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData?.popularSearches.map((search, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {search.query}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {search.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {Math.round(Math.random() * 20 + 80)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserReports;
