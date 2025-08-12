import React, { useState, useEffect } from 'react';
import {
  DocumentIcon,
  CloudArrowUpIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Dataset {
  id: string;
  name: string;
  description: string;
  source: string;
  format: string;
  size: number;
  recordCount: number;
  columns: string[];
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  status: 'ACTIVE' | 'PROCESSING' | 'ERROR' | 'ARCHIVED';
  tags: string[];
  downloadCount: number;
  usageStats: {
    searches: number;
    matches: number;
    accuracy: number;
  };
}

const DatasetManagement: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      // TODO: Replace with actual API call
      const mockDatasets: Dataset[] = [
        {
          id: '1',
          name: 'NCO-2015 Classification Data',
          description: 'Complete NCO-2015 occupation classification dataset with hierarchical structure',
          source: 'Ministry of Statistics',
          format: 'CSV',
          size: 2.5 * 1024 * 1024, // 2.5 MB
          recordCount: 8750,
          columns: ['NCO_Code', 'Title', 'Description', 'Major_Group', 'Sub_Major_Group', 'Minor_Group', 'Unit_Group'],
          uploadedBy: 'System Admin',
          uploadedAt: '2024-01-01T00:00:00Z',
          lastModified: '2024-01-15T10:30:00Z',
          status: 'ACTIVE',
          tags: ['official', 'nco-2015', 'classification'],
          downloadCount: 45,
          usageStats: {
            searches: 1250,
            matches: 1180,
            accuracy: 94.4
          }
        },
        {
          id: '2',
          name: 'Industry Skill Mapping',
          description: 'Skill requirements mapping for different industries and occupations',
          source: 'Industry Survey',
          format: 'JSON',
          size: 1.8 * 1024 * 1024, // 1.8 MB
          recordCount: 3240,
          columns: ['Occupation', 'Industry', 'Skills', 'Experience_Level', 'Education'],
          uploadedBy: 'Data Manager',
          uploadedAt: '2024-01-10T14:20:00Z',
          lastModified: '2024-01-18T09:15:00Z',
          status: 'ACTIVE',
          tags: ['skills', 'industry', 'mapping'],
          downloadCount: 23,
          usageStats: {
            searches: 680,
            matches: 620,
            accuracy: 91.2
          }
        },
        {
          id: '3',
          name: 'Job Market Trends 2024',
          description: 'Latest job market trends and occupation demand data',
          source: 'Job Portal Analytics',
          format: 'CSV',
          size: 5.2 * 1024 * 1024, // 5.2 MB
          recordCount: 15600,
          columns: ['Occupation', 'Demand_Index', 'Growth_Rate', 'Salary_Range', 'Location'],
          uploadedBy: 'Analytics Team',
          uploadedAt: '2024-01-20T11:45:00Z',
          lastModified: '2024-01-20T11:45:00Z',
          status: 'PROCESSING',
          tags: ['trends', 'demand', '2024'],
          downloadCount: 8,
          usageStats: {
            searches: 120,
            matches: 98,
            accuracy: 81.7
          }
        }
      ];
      setDatasets(mockDatasets);
    } catch (error) {
      console.error('Failed to fetch datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = 
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || dataset.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteDataset = async (datasetId: string) => {
    if (confirm('Are you sure you want to delete this dataset?')) {
      setDatasets(datasets.filter(dataset => dataset.id !== datasetId));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DatasetDetailsModal: React.FC = () => {
    if (!selectedDataset) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Dataset Details</h3>
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
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="text-sm text-gray-900">{selectedDataset.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source</label>
                    <div className="text-sm text-gray-900">{selectedDataset.source}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="text-sm text-gray-900">{selectedDataset.description}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Format</label>
                    <div className="text-sm text-gray-900">{selectedDataset.format}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <div className="text-sm text-gray-900">{formatFileSize(selectedDataset.size)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Records</label>
                    <div className="text-sm text-gray-900">{selectedDataset.recordCount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columns */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Columns</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {selectedDataset.columns.map((column, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Searches</label>
                    <div className="text-sm text-gray-900">{selectedDataset.usageStats.searches.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Matches</label>
                    <div className="text-sm text-gray-900">{selectedDataset.usageStats.matches.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Accuracy</label>
                    <div className="text-sm text-gray-900">{selectedDataset.usageStats.accuracy}%</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Downloads</label>
                    <div className="text-sm text-gray-900">{selectedDataset.downloadCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Tags</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {selectedDataset.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Metadata</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Uploaded By</label>
                    <div className="text-sm text-gray-900">{selectedDataset.uploadedBy}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedDataset.status)}`}>
                      {selectedDataset.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Uploaded</label>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedDataset.uploadedAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Modified</label>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedDataset.lastModified).toLocaleString()}
                    </div>
                  </div>
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

  const UploadModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Upload Dataset</h3>
          <button
            onClick={() => setShowUploadModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dataset Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter dataset name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Describe the dataset"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Data source"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="CSV">CSV</option>
                <option value="JSON">JSON</option>
                <option value="XLSX">XLSX</option>
                <option value="XML">XML</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              </label>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">CSV, JSON, XLSX up to 100MB</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowUploadModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Upload Dataset
          </button>
        </div>
      </div>
    </div>
  );

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
          <h2 className="text-2xl font-bold text-gray-900">Dataset Management</h2>
          <p className="text-gray-600">Manage and monitor training datasets</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Upload Dataset
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">{datasets.length}</div>
          <div className="text-sm text-gray-600">Total Datasets</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {formatFileSize(datasets.reduce((acc, dataset) => acc + dataset.size, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Size</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {datasets.reduce((acc, dataset) => acc + dataset.recordCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Records</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-purple-600">
            {datasets.filter(dataset => dataset.status === 'ACTIVE').length}
          </div>
          <div className="text-sm text-gray-600">Active Datasets</div>
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
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PROCESSING">Processing</option>
            <option value="ERROR">Error</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <div key={dataset.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <DocumentIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{dataset.name}</h3>
                    <p className="text-sm text-gray-600">{dataset.source}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dataset.status)}`}>
                  {dataset.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dataset.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Size:</span>
                  <span className="text-gray-900">{formatFileSize(dataset.size)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Records:</span>
                  <span className="text-gray-900">{dataset.recordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Format:</span>
                  <span className="text-gray-900">{dataset.format}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Accuracy:</span>
                  <span className="text-gray-900">{dataset.usageStats.accuracy}%</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {dataset.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {dataset.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{dataset.tags.length - 3} more</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                  {new Date(dataset.uploadedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedDataset(dataset);
                      setShowDetailsModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDataset(dataset.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No datasets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Modals */}
      {showDetailsModal && <DatasetDetailsModal />}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default DatasetManagement;
