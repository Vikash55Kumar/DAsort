import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardService } from '../../../../services/dashboardService';
import Loader from '../../../../components/common/Loader';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, trend, icon, loading }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${getTrendColor()}`}>{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 p-2 bg-[#00295d] rounded-lg">
            <div className="text-white">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const PersonalStats: React.FC = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dashboardStats, searchTrends] = await Promise.all([
          DashboardService.getDashboardStats(),
          DashboardService.getSearchTrends('7d')
        ]);

        // Calculate success rate
        const successRate = dashboardStats.totalSearches > 0 
          ? Math.round((dashboardStats.successfulMatches / dashboardStats.totalSearches) * 100)
          : 0;

        // Calculate trends
        const getTrend = (current: number, baseline: number = 10) => {
          const change = ((current - baseline) / baseline) * 100;
          if (Math.abs(change) < 5) return 'neutral';
          return change > 0 ? 'up' : 'down';
        };

        const statsCards = [
          { 
            title: 'Total Searches', 
            value: dashboardStats.totalSearches, 
            subtitle: `${dashboardStats.totalSearches > 10 ? '+' : ''}${dashboardStats.totalSearches - 10} from baseline`,
            trend: getTrend(dashboardStats.totalSearches)
          },
          { 
            title: 'Successful Matches', 
            value: dashboardStats.successfulMatches, 
            subtitle: `${successRate}% success rate`,
            trend: successRate > 80 ? 'up' : successRate > 60 ? 'neutral' : 'down'
          },
          { 
            title: 'Datasets Uploaded', 
            value: dashboardStats.datasetsUploaded, 
            subtitle: dashboardStats.datasetsUploaded > 0 ? 'Recent activity' : 'Get started',
            trend: 'neutral'
          },
          { 
            title: 'Classifications Made', 
            value: dashboardStats.classificationsMade, 
            subtitle: `Across ${dashboardStats.totalSearches} searches`,
            trend: getTrend(dashboardStats.classificationsMade, 50)
          },
        ];

        setStatsData(statsCards);

        // Process weekly data from search trends
        const processedWeeklyData = searchTrends.dailyStats.slice(0, 7).reverse().map(day => ({
          day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
          searches: day.total_searches
        }));

        setWeeklyData(processedWeeklyData);

      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
        
        // Fallback to demo data
        setStatsData([
          { title: 'Total Searches', value: '--', subtitle: 'Loading...', trend: 'neutral' },
          { title: 'Successful Matches', value: '--', subtitle: 'Loading...', trend: 'neutral' },
          { title: 'Datasets Uploaded', value: '--', subtitle: 'Loading...', trend: 'neutral' },
          { title: 'Classifications Made', value: '--', subtitle: 'Loading...', trend: 'neutral' },
        ]);
        
        setWeeklyData([
          { day: 'Mon', searches: 0 },
          { day: 'Tue', searches: 0 },
          { day: 'Wed', searches: 0 },
          { day: 'Thu', searches: 0 },
          { day: 'Fri', searches: 0 },
          { day: 'Sat', searches: 0 },
          { day: 'Sun', searches: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Search method distribution (static for now - could be enhanced with real data)
  const searchMethodData = [
    { name: 'Text Search', value: 78, color: '#00295d' },
    { name: 'Voice Search', value: 15, color: '#01408f' },
    { name: 'API Search', value: 7, color: '#667eea' },
  ];

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
    <div className="space-y-6">
      
      {/* Key Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData ? statsData.map((stat: any, index: number) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            trend={stat.trend}
            loading={loading}
          />
        )) : (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <StatsCard
              key={index}
              title=""
              value=""
              loading={true}
            />
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Activity Chart */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Weekly Search Activity</h3>
          <div className="h-48">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader size="sm" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Bar 
                    dataKey="searches" 
                    fill="#00295d" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Search Method Distribution */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Search Methods Used</h3>
          <div className="h-48 flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={searchMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {searchMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-4">
              {searchMethodData.map((entry, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-[#00295d] to-[#01408f] rounded-lg p-6 text-white">
        <h3 className="text-lg text-white font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                `${statsData ? Math.round((statsData[1]?.value / statsData[0]?.value || 0) * 100) : 0}%`
              )}
            </p>
            <p className="text-sm opacity-90">Accuracy Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                '1.2s'
              )}
            </p>
            <p className="text-sm opacity-90">Avg Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold mb-1">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                '4.6/5'
              )}
            </p>
            <p className="text-sm opacity-90">User Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalStats;
