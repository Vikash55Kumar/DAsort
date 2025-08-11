import React from 'react';
import { formatDate } from '../../utils/formatters';

interface Activity {
  id: string;
  type: 'upload' | 'search' | 'clean' | 'export';
  description: string;
  timestamp: string;
  user: string;
}

interface ActivityLogProps {
  activities: Activity[];
  maxItems?: number;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities, maxItems = 10 }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return '📤';
      case 'search':
        return '🔍';
      case 'clean':
        return '🧹';
      case 'export':
        return '📥';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'text-blue-600';
      case 'search':
        return 'text-green-600';
      case 'clean':
        return 'text-yellow-600';
      case 'export':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {displayActivities.map((activity) => (
              <li key={activity.id} className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      by {activity.user} • {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs font-medium uppercase ${getActivityColor(activity.type)}`}>
                      {activity.type}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {activities.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
