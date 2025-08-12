import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CogIcon 
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { DashboardService } from '../../../../services/dashboardService';
import Loader from '../../../../components/common/Loader';

interface ActivityItem {
  id: string;
  type: 'search' | 'upload' | 'system' | 'feedback' | 'update';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info' | 'error';
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const activityData = await DashboardService.getActivityFeed();
        setActivities(activityData);
      } catch (err) {
        console.error('Error fetching activity feed:', err);
        setError('Failed to load activity feed');
        
        // Fallback to static data
        setActivities([
          {
            id: 'fallback-1',
            type: 'system',
            title: 'Unable to load activities',
            description: 'Please check your connection and try again',
            timestamp: new Date().toISOString(),
            status: 'warning'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Set up periodic refresh for activity feed
    const interval = setInterval(fetchActivities, 2 * 60 * 1000); // Refresh every 2 minutes
    
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    
    switch (type) {
      case 'search':
        return <DocumentTextIcon className={iconClass} />;
      case 'upload':
        return <DocumentTextIcon className={iconClass} />;
      case 'feedback':
        return <CheckCircleIcon className={iconClass} />;
      case 'system':
        return <CogIcon className={iconClass} />;
      case 'update':
        return <BellIcon className={iconClass} />;
      default:
        return <InformationCircleIcon className={iconClass} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    const iconClass = "h-3 w-3";
    
    switch (status) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-600`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-600`} />;
      case 'error':
        return <ExclamationTriangleIcon className={`${iconClass} text-red-600`} />;
      case 'info':
      default:
        return <InformationCircleIcon className={`${iconClass} text-blue-600`} />;
    }
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

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No recent activity</p>
          <p className="text-gray-400 text-xs mt-1">Activity will appear here as you use the system</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  {getStatusIcon(activity.status)}
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last 7 days</span>
          <button 
            className="text-[#00295d] hover:text-[#01408f] font-medium"
            onClick={() => window.location.reload()}
          >
            Refresh Activity
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">
              {activities.filter(a => a.type === 'search').length}
            </p>
            <p className="text-xs text-gray-500">Searches</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">
              {activities.filter(a => a.status === 'success').length}
            </p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-xs">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
