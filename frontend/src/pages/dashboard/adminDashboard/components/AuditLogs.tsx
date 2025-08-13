import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  UserIcon,
  CogIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { adminService, type AuditLog } from '../../../../services/adminService';

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('ALL');
  const [successFilter, setSuccessFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchAuditLogs();
  }, [pagination.page, pagination.limit, actionFilter, resourceTypeFilter, successFilter, dateFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (actionFilter !== 'ALL') params.action = actionFilter;
      if (resourceTypeFilter !== 'ALL') params.resourceType = resourceTypeFilter;
      if (successFilter !== 'ALL') params.success = successFilter === 'SUCCESS';
      if (dateFilter) {
        params.startDate = dateFilter;
        params.endDate = dateFilter;
      }

      const response = await adminService.getAuditLogs(params);
      setAuditLogs(response.logs);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      setError('Failed to load audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const actions = ['ALL', 'LOGIN', 'LOGOUT', 'SEARCH', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'CREATE_NCO', 'UPDATE_NCO', 'DELETE_NCO', 'UPLOAD_DATASET'];
  const resourceTypes = ['ALL', 'user', 'nco_code', 'dataset', 'search', 'authentication', 'system'];
  const statuses = ['ALL', 'SUCCESS', 'FAILED'];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      (log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.errorMessage?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    return matchesSearch;
  });

  const getStatusColor = (success: boolean): string => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getResourceTypeIcon = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case 'user': return <UserIcon className="h-5 w-5" />;
      case 'authentication': return <ShieldCheckIcon className="h-5 w-5" />;
      case 'system': return <CogIcon className="h-5 w-5" />;
      case 'nco_code': return <DocumentTextIcon className="h-5 w-5" />;
      case 'dataset': return <DocumentTextIcon className="h-5 w-5" />;
      case 'search': return <MagnifyingGlassIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
                    <label className="block text-sm font-medium text-gray-500">Action</label>
                    <div className="mt-1 text-sm text-gray-900">{selectedLog.action}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Resource Type</label>
                    <div className="mt-1 text-sm text-gray-900">{selectedLog.resourceType}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Resource ID</label>
                    <div className="mt-1 text-sm text-gray-900">{selectedLog.resourceId || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLog.success)}`}>
                        {selectedLog.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Timestamp</label>
                    <div className="mt-1 text-sm text-gray-900">{formatDate(selectedLog.createdAt)}</div>
                  </div>
                  {selectedLog.duration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Duration</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedLog.duration}ms</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Information */}
            {selectedLog.user && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">User Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Name</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedLog.user.name}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedLog.user.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">User ID</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedLog.userId}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Details */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedLog.method && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">HTTP Method</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedLog.method}</div>
                    </div>
                  )}
                  {selectedLog.endpoint && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Endpoint</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedLog.endpoint}</div>
                    </div>
                  )}
                  {selectedLog.ipAddress && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">IP Address</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedLog.ipAddress}</div>
                    </div>
                  )}
                  {selectedLog.userAgent && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-500">User Agent</label>
                      <div className="mt-1 text-sm text-gray-900 break-all">{selectedLog.userAgent}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {selectedLog.errorMessage && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Error Details</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-sm text-red-800">{selectedLog.errorMessage}</div>
                </div>
              </div>
            )}

            {/* Metadata */}
            {selectedLog.metadata && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Data</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Audit Logs</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => fetchAuditLogs()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
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
          <button 
            onClick={() => fetchAuditLogs()}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
          <div className="text-sm text-gray-600">Total Events</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {auditLogs.filter(log => log.success).length}
          </div>
          <div className="text-sm text-gray-600">Successful</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">
            {auditLogs.filter(log => !log.success).length}
          </div>
          <div className="text-sm text-gray-600">Failed</div>
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
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {actions.map(action => (
              <option key={action} value={action}>
                {action === 'ALL' ? 'All Actions' : action}
              </option>
            ))}
          </select>
          
          <select
            value={resourceTypeFilter}
            onChange={(e) => setResourceTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {resourceTypes.map(resourceType => (
              <option key={resourceType} value={resourceType}>
                {resourceType === 'ALL' ? 'All Resources' : resourceType}
              </option>
            ))}
          </select>
          
          <select
            value={successFilter}
            onChange={(e) => setSuccessFilter(e.target.value)}
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
              setActionFilter('ALL');
              setResourceTypeFilter('ALL');
              setSuccessFilter('ALL');
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
                  User & Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {getResourceTypeIcon(log.resourceType)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {log.user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">{log.action}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.resourceType}</div>
                    {log.resourceId && (
                      <div className="text-sm text-gray-500">{log.resourceId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.success)}`}>
                      {log.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedLog(log);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span> ({pagination.total} total logs)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {filteredLogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {auditLogs.length === 0 ? 'No logs available yet.' : 'Try adjusting your search or filter criteria.'}
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
