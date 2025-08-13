import React, { useState, useEffect } from 'react';
import {
  DocumentMagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { adminService, type NCOCode } from '../../../../services/adminService';

const NCOCodeManagement: React.FC = () => {
  const [ncoCodes, setNCOCodes] = useState<NCOCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');
  const [selectedCode, setSelectedCode] = useState<NCOCode | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchNCOCodes();
  }, [pagination.page, pagination.limit, statusFilter]);

  const fetchNCOCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (statusFilter !== 'ALL') {
        params.isVerified = statusFilter === 'VERIFIED';
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await adminService.getAllNCOCodes(params);
      
      // Ensure we have the expected structure
      if (response && response.ncoCodes && Array.isArray(response.ncoCodes)) {
        setNCOCodes(response.ncoCodes);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || response.ncoCodes.length,
          totalPages: response.pagination?.totalPages || 1
        }));
      } else {
        console.warn('Unexpected API response structure:', response);
        setNCOCodes([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalPages: 1
        }));
      }
    } catch (error) {
      console.error('Failed to fetch NCO codes:', error);
      setError('Failed to fetch NCO codes. Please try again.');
      setNCOCodes([]); // Ensure ncoCodes is always an array
    } finally {
      setLoading(false);
    }
  };

  // Search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        fetchNCOCodes();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredCodes = (ncoCodes || []).filter(code => {
    if (!searchTerm.trim()) return true;
    
    const matchesSearch = 
      code.ncoCode?.includes(searchTerm) ||
      code.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleVerifyCode = async (codeId: string) => {
    try {
      await adminService.updateNCOCode(codeId, { isVerified: true });
      setNCOCodes(prevCodes => 
        (prevCodes || []).map(code => 
          code.id === codeId ? { ...code, isVerified: true } : code
        )
      );
    } catch (error) {
      console.error('Failed to verify NCO code:', error);
      alert('Failed to verify NCO code. Please try again.');
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this NCO code?')) {
      return;
    }

    try {
      await adminService.deleteNCOCode(codeId);
      setNCOCodes(prevCodes => 
        (prevCodes || []).filter(code => code.id !== codeId)
      );
    } catch (error) {
      console.error('Failed to delete NCO code:', error);
      alert('Failed to delete NCO code. Please try again.');
    }
  };

  const NCOCodeModal: React.FC = () => {
    if (!selectedCode) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit NCO Code' : 'NCO Code Details'}
            </h3>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => {
                  setShowCodeModal(false);
                  setIsEditing(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NCO Code</label>
                  <input
                    type="text"
                    value={selectedCode.ncoCode}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={selectedCode.version}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={selectedCode.title}
                  readOnly={!isEditing}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                    isEditing ? 'bg-white' : 'bg-gray-50'
                  }`}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={selectedCode.description}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                    isEditing ? 'bg-white' : 'bg-gray-50'
                  }`}
                />
              </div>
            </div>

            {/* Hierarchical Structure */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Hierarchical Structure</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Major Group</label>
                  <input
                    type="text"
                    value={selectedCode.majorGroup}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Major Group</label>
                  <input
                    type="text"
                    value={selectedCode.subMajorGroup}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minor Group</label>
                  <input
                    type="text"
                    value={selectedCode.minorGroup}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Group</label>
                  <input
                    type="text"
                    value={selectedCode.unitGroup}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Classification Metadata */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Classification Metadata</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                  <input
                    type="text"
                    value={selectedCode.sector || ''}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                  <input
                    type="text"
                    value={selectedCode.skillLevel || ''}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <input
                    type="text"
                    value={selectedCode.educationLevel || ''}
                    readOnly={!isEditing}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Keywords and Synonyms */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Search Optimization</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[100px]">
                    {(selectedCode.keywords || []).map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                        {keyword}
                        {isEditing && (
                          <button className="ml-1 text-blue-600 hover:text-blue-800">
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {(!selectedCode.keywords || selectedCode.keywords.length === 0) && (
                      <span className="text-gray-500 text-sm">No keywords available</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Synonyms</label>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[100px]">
                    {(selectedCode.synonyms || []).map((synonym, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md">
                        {synonym}
                        {isEditing && (
                          <button className="ml-1 text-green-600 hover:text-green-800">
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {(!selectedCode.synonyms || selectedCode.synonyms.length === 0) && (
                      <span className="text-gray-500 text-sm">No synonyms available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Status</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCode.isActive !== false}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Active</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCode.isVerified === true}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Verified</label>
                </div>
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    (selectedCode.isVerified === true)
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(selectedCode.isVerified === true) ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <div className="text-sm text-gray-500">
              Created: {new Date(selectedCode.createdAt).toLocaleDateString()}
              {selectedCode.updatedAt && (
                <> | Updated: {new Date(selectedCode.updatedAt).toLocaleDateString()}</>
              )}
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowCodeModal(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              )}
            </div>
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
          <div className="text-red-600 mb-2">❌ Error</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => fetchNCOCodes()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NCO Code Management</h2>
          <p className="text-gray-600">Manage National Classification of Occupations codes</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Import CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add NCO Code
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">{ncoCodes?.length || 0}</div>
          <div className="text-sm text-gray-600">Total NCO Codes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {ncoCodes?.filter(code => code.isVerified === true).length || 0}
          </div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {ncoCodes?.filter(code => code.isVerified !== true).length || 0}
          </div>
          <div className="text-sm text-gray-600">Pending Verification</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {ncoCodes?.filter(code => code.isActive !== false).length || 0}
          </div>
          <div className="text-sm text-gray-600">Active Codes</div>
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
                placeholder="Search by code, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'VERIFIED' | 'UNVERIFIED')}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="ALL">All Status</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNVERIFIED">Unverified</option>
          </select>
        </div>
      </div>

      {/* NCO Codes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NCO Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hierarchy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCodes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{code.ncoCode}</div>
                    <div className="text-sm text-gray-500">{code.version}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{code.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {code.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.majorGroup} → {code.subMajorGroup} → {code.minorGroup} → {code.unitGroup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (code.isVerified === true)
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {(code.isVerified === true) ? 'Verified' : 'Pending'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (code.isActive !== false)
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {(code.isActive !== false) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCode(code);
                          setShowCodeModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCode(code);
                          setShowCodeModal(true);
                          setIsEditing(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {!(code.isVerified === true) && (
                        <button
                          onClick={() => handleVerifyCode(code.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCode(code.id)}
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

        {filteredCodes.length === 0 && (
          <div className="text-center py-12">
            <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No NCO codes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* NCO Code Modal */}
      {showCodeModal && <NCOCodeModal />}
    </div>
  );
};

export default NCOCodeManagement;
