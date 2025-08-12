import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  UserIcon,
  CogIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details?: string;
  category: 'AUTH' | 'USER_MGMT' | 'SYSTEM_CONFIG' | 'DATA_ACCESS' | 'ADMIN' | 'SECURITY';
}

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      // TODO: Replace with actual API call
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          timestamp: '2024-01-21T14:30:00Z',
          userId: 'admin1',
          userName: 'System Admin',
          userEmail: 'admin@example.com',
          action: 'UPDATE_USER',
          resource: 'User',
          resourceId: 'user123',
          oldValue: { role: 'USER' },
          newValue: { role: 'ADMIN' },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          sessionId: 'sess_abc123',
          status: 'SUCCESS',
          details: 'User role updated from USER to ADMIN',
          category: 'USER_MGMT'
        },
        {
          id: '2',
          timestamp: '2024-01-21T14:15:00Z',
          userId: 'admin1',
          userName: 'System Admin',
          userEmail: 'admin@example.com',
          action: 'LOGIN',
          resource: 'Authentication',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          sessionId: 'sess_abc123',
          status: 'SUCCESS',
          details: 'Admin login successful',
          category: 'AUTH'
        },
        {
          id: '3',
          timestamp: '2024-01-21T13:45:00Z',
          userId: 'user456',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          action: 'SEARCH_NCO',
          resource: 'NCO Code',
          resourceId: 'search_789',
          ipAddress: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          sessionId: 'sess_def456',
          status: 'SUCCESS',
          details: 'Search query: "software developer" returned 5 results',
          category: 'DATA_ACCESS'
        },
        {
          id: '4',
          timestamp: '2024-01-21T13:30:00Z',
          userId: 'hacker1',
          userName: 'Unknown',
          userEmail: 'unknown@suspicious.com',
          action: 'LOGIN',
          resource: 'Authentication',
          ipAddress: '10.0.0.1',
          userAgent: 'curl/7.68.0',
          sessionId: '',
          status: 'FAILED',
          details: 'Multiple failed login attempts detected',
          category: 'SECURITY'
        },
        {
          id: '5',
          timestamp: '2024-01-21T12:20:00Z',
          userId: 'admin1',
          userName: 'System Admin',
          userEmail: 'admin@example.com',
          action: 'UPDATE_CONFIG',
          resource: 'System Configuration',
          resourceId: 'config_search_timeout',
          oldValue: { timeout: 30 },
          newValue: { timeout: 45 },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          sessionId: 'sess_abc123',
          status: 'SUCCESS',
          details: 'Search timeout configuration updated',
          category: 'SYSTEM_CONFIG'
        },
        {
          id: '6',
          timestamp: '2024-01-21T11:55:00Z',
          userId: 'admin2',
          userName: 'Data Manager',
          userEmail: 'data@example.com',
          action: 'DELETE_DATASET',
          resource: 'Dataset',
          resourceId: 'dataset_old_2023',
          ipAddress: '192.168.1.105',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          sessionId: 'sess_ghi789',
          status: 'WARNING',
          details: 'Old dataset deleted but referenced in active reports',
          category: 'ADMIN'
        }
      ];
      setAuditLogs(mockLogs);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'AUTH', 'USER_MGMT', 'SYSTEM_CONFIG', 'DATA_ACCESS', 'ADMIN', 'SECURITY'];
  const statuses = ['ALL', 'SUCCESS', 'FAILED', 'WARNING'];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchesDate = !dateFilter || 
      new Date(log.timestamp).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AUTH': return <ShieldCheckIcon className="h-5 w-5" />;
      case 'USER_MGMT': return <UserIcon className="h-5 w-5" />;
      case 'SYSTEM_CONFIG': return <CogIcon className="h-5 w-5" />;
      case 'DATA_ACCESS': return <DocumentTextIcon className="h-5 w-5" />;
      case 'ADMIN': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'SECURITY': return <ShieldCheckIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const AuditLogDetailsModal: React.FC = () => {
    if (!selectedLog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Audit Log Details</h3>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action</label>
                    <div className="text-sm text-gray-900">{selectedLog.action}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <div className="flex items-center text-sm text-gray-900">
                      {getCategoryIcon(selectedLog.category)}
                      <span className="ml-2">{selectedLog.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">User Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <div className="text-sm text-gray-900">{selectedLog.userId}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="text-sm text-gray-900">{selectedLog.userName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="text-sm text-gray-900">{selectedLog.userEmail}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Session ID</label>
                    <div className="text-sm text-gray-900 font-mono">{selectedLog.sessionId || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Resource Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Resource Type</label>
                    <div className="text-sm text-gray-900">{selectedLog.resource}</div>
                  </div>
                  {selectedLog.resourceId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Resource ID</label>
                      <div className="text-sm text-gray-900 font-mono">{selectedLog.resourceId}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Changes */}
            {(selectedLog.oldValue || selectedLog.newValue) && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Changes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLog.oldValue && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Old Value</label>
                        <div className="text-sm text-gray-900 bg-white p-2 rounded border font-mono">
                          {JSON.stringify(selectedLog.oldValue, null, 2)}
                        </div>
                      </div>
                    )}
                    {selectedLog.newValue && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">New Value</label>
                        <div className="text-sm text-gray-900 bg-white p-2 rounded border font-mono">
                          {JSON.stringify(selectedLog.newValue, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Technical Details */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <div className="text-sm text-gray-900 font-mono">{selectedLog.ipAddress}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Agent</label>
                    <div className="text-sm text-gray-900 font-mono break-all">{selectedLog.userAgent}</div>
                  </div>
                  {selectedLog.details && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Details</label>
                      <div className="text-sm text-gray-900 bg-white p-2 rounded border">
                        {selectedLog.details}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
          <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
          <p className="text-gray-600">Monitor system activities and user actions</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Export Logs
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">{auditLogs.length}</div>
          <div className="text-sm text-gray-600">Total Events</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {auditLogs.filter(log => log.status === 'SUCCESS').length}
          </div>
          <div className="text-sm text-gray-600">Successful</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">
            {auditLogs.filter(log => log.status === 'FAILED').length}
          </div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {auditLogs.filter(log => log.status === 'WARNING').length}
          </div>
          <div className="text-sm text-gray-600">Warnings</div>
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
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'ALL' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
          
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
              setCategoryFilter('ALL');
              setStatusFilter('ALL');
              setDateFilter('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getCategoryIcon(log.category)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                        <div className="text-sm text-gray-500">{log.action}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.resource}</div>
                    {log.resourceId && (
                      <div className="text-sm text-gray-500 font-mono">{log.resourceId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedLog(log);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Audit Log Details Modal */}
      {showDetailsModal && <AuditLogDetailsModal />}
    </div>
  );
};

export default AuditLogs;
