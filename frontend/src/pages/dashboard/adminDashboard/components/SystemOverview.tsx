import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  ServerIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalSearches: number;
  todaySearches: number;
  totalNCOCodes: number;
  verifiedNCOCodes: number;
  aiServiceUptime: number;
  avgResponseTime: number;
}

const SystemOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalSearches: 0,
    todaySearches: 0,
    totalNCOCodes: 0,
    verifiedNCOCodes: 0,
    aiServiceUptime: 0,
    avgResponseTime: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real metrics from API
    const fetchMetrics = async () => {
      try {
        // Simulated data - replace with actual API call
        setMetrics({
          totalUsers: 1247,
          activeUsers: 89,
          totalSearches: 15642,
          todaySearches: 234,
          totalNCOCodes: 8750,
          verifiedNCOCodes: 8234,
          aiServiceUptime: 99.8,
          avgResponseTime: 245
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const metricCards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      subtitle: `${metrics.activeUsers} active today`,
      icon: UsersIcon,
      color: 'blue',
      trend: '+12% from last month'
    },
    {
      title: 'Search Volume',
      value: metrics.totalSearches.toLocaleString(),
      subtitle: `${metrics.todaySearches} today`,
      icon: MagnifyingGlassIcon,
      color: 'green',
      trend: '+8% from yesterday'
    },
    {
      title: 'NCO Codes',
      value: metrics.totalNCOCodes.toLocaleString(),
      subtitle: `${metrics.verifiedNCOCodes} verified`,
      icon: DocumentIcon,
      color: 'purple',
      trend: `${((metrics.verifiedNCOCodes / metrics.totalNCOCodes) * 100).toFixed(1)}% verified`
    },
    {
      title: 'AI Service',
      value: `${metrics.aiServiceUptime}%`,
      subtitle: `${metrics.avgResponseTime}ms avg response`,
      icon: ServerIcon,
      color: 'emerald',
      trend: 'Excellent performance'
    }
  ];

  const recentActivity = [
    { time: '2 minutes ago', action: 'New user registration', user: 'john.doe@gov.in', type: 'user' },
    { time: '5 minutes ago', action: 'NCO code verified', details: 'Code 75310110 approved', type: 'nco' },
    { time: '12 minutes ago', action: 'Bulk dataset processed', details: '1,250 records classified', type: 'dataset' },
    { time: '23 minutes ago', action: 'System configuration updated', details: 'AI threshold adjusted', type: 'config' },
    { time: '1 hour ago', action: 'High search volume detected', details: 'Peak usage in Mumbai region', type: 'alert' }
  ];

  const systemAlerts = [
    { type: 'warning', message: 'AI service response time above 300ms threshold', time: '15 minutes ago' },
    { type: 'info', message: 'Database maintenance scheduled for tonight', time: '2 hours ago' },
    { type: 'success', message: 'Weekly backup completed successfully', time: '1 day ago' }
  ];

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
        <p className="text-gray-600">Real-time system metrics and activity monitoring</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
                <ChartBarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-sm text-gray-600 mb-2">{card.subtitle}</p>
                <p className="text-xs text-green-600 font-medium">{card.trend}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'nco' ? 'bg-green-500' :
                  activity.type === 'dataset' ? 'bg-purple-500' :
                  activity.type === 'config' ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  {activity.user && (
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  )}
                  {activity.details && (
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                'bg-green-50 border-green-400'
              }`}>
                <div className="flex items-start">
                  <ExclamationTriangleIcon className={`h-5 w-5 mt-0.5 mr-3 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'info' ? 'text-blue-600' :
                    'text-green-600'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Add NCO Code</h4>
            <p className="text-sm text-gray-600 mt-1">Create new occupation classification</p>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Export Data</h4>
            <p className="text-sm text-gray-600 mt-1">Download system reports</p>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">System Settings</h4>
            <p className="text-sm text-gray-600 mt-1">Configure system parameters</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
