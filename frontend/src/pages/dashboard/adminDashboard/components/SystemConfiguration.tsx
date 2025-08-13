import React, { useState, useEffect } from 'react';
import {
  CogIcon,
  ServerIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentTextIcon,
  BellIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface SystemConfig {
  id: string;
  category: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
  options?: string[];
  isEditable: boolean;
  lastModified: string;
  modifiedBy: string;
}

const SystemConfiguration: React.FC = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('general');
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{ [key: string]: any }>({});
  const [showBackupModal, setShowBackupModal] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      // TODO: Replace with actual API call
      const mockConfigs: SystemConfig[] = [
        // General Settings
        {
          id: '1',
          category: 'general',
          name: 'System Name',
          description: 'Display name for the system',
          value: 'NCO Classification System',
          type: 'text',
          isEditable: true,
          lastModified: '2024-01-15T10:30:00Z',
          modifiedBy: 'System Admin'
        },
        {
          id: '2',
          category: 'general',
          name: 'Maintenance Mode',
          description: 'Enable maintenance mode to prevent user access',
          value: false,
          type: 'boolean',
          isEditable: true,
          lastModified: '2024-01-10T14:20:00Z',
          modifiedBy: 'System Admin'
        },
        {
          id: '3',
          category: 'general',
          name: 'Max Concurrent Users',
          description: 'Maximum number of concurrent users allowed',
          value: 1000,
          type: 'number',
          isEditable: true,
          lastModified: '2024-01-12T09:15:00Z',
          modifiedBy: 'System Admin'
        },
        // Search Settings
        {
          id: '4',
          category: 'search',
          name: 'Default Search Results',
          description: 'Default number of search results to return',
          value: 10,
          type: 'number',
          isEditable: true,
          lastModified: '2024-01-18T16:45:00Z',
          modifiedBy: 'Data Manager'
        },
        {
          id: '5',
          category: 'search',
          name: 'Search Timeout',
          description: 'Maximum time (seconds) for search operations',
          value: 30,
          type: 'number',
          isEditable: true,
          lastModified: '2024-01-15T11:20:00Z',
          modifiedBy: 'System Admin'
        },
        {
          id: '6',
          category: 'search',
          name: 'Minimum Query Length',
          description: 'Minimum number of characters required for search',
          value: 3,
          type: 'number',
          isEditable: true,
          lastModified: '2024-01-10T08:30:00Z',
          modifiedBy: 'System Admin'
        },
        // ML Model Settings
        {
          id: '7',
          category: 'ml',
          name: 'Model Version',
          description: 'Current active ML model version',
          value: 'v2.1.5',
          type: 'text',
          isEditable: false,
          lastModified: '2024-01-20T12:00:00Z',
          modifiedBy: 'ML Engineer'
        },
        {
          id: '8',
          category: 'ml',
          name: 'Confidence Threshold',
          description: 'Minimum confidence score for search results',
          value: 0.75,
          type: 'number',
          isEditable: true,
          lastModified: '2024-01-19T14:30:00Z',
          modifiedBy: 'ML Engineer'
        },
        {
          id: '9',
          category: 'ml',
          name: 'Auto Retrain',
          description: 'Automatically retrain model with new data',
          value: true,
          type: 'boolean',
          isEditable: true,
          lastModified: '2024-01-17T10:15:00Z',
          modifiedBy: 'ML Engineer'
        },
        // Security Settings
        {
          id: '10',
          category: 'security',
          name: 'Session Timeout',
          description: 'User session timeout in minutes',
          value: 60,
          type: 'number',
          isEditable: true,
          lastModified: '2024-01-16T13:45:00Z',
          modifiedBy: 'Security Admin'
        },
        {
          id: '11',
          category: 'security',
          name: 'Max Login Attempts',
          description: 'Maximum failed login attempts before lockout',
          value: 5,
          type: 'number',
          isEditable: true,
          lastModified: '2024-01-14T09:30:00Z',
          modifiedBy: 'Security Admin'
        },
        {
          id: '12',
          category: 'security',
          name: 'Password Complexity',
          description: 'Enforce strong password requirements',
          value: true,
          type: 'boolean',
          isEditable: true,
          lastModified: '2024-01-12T15:20:00Z',
          modifiedBy: 'Security Admin'
        }
      ];
      setConfigs(mockConfigs);
    } catch (error) {
      console.error('Failed to fetch configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'search', name: 'Search', icon: WrenchScrewdriverIcon },
    { id: 'ml', name: 'ML Model', icon: ServerIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ];

  const filteredConfigs = configs.filter(config => config.category === activeCategory);

  const handleEdit = (configId: string) => {
    const config = configs.find(c => c.id === configId);
    if (config) {
      setEditingConfig(configId);
      setTempValues({ [configId]: config.value });
    }
  };

  const handleSave = async (configId: string) => {
    const newValue = tempValues[configId];
    setConfigs(configs.map(config => 
      config.id === configId 
        ? { 
            ...config, 
            value: newValue, 
            lastModified: new Date().toISOString(),
            modifiedBy: 'Current Admin'
          }
        : config
    ));
    setEditingConfig(null);
    setTempValues({});
  };

  const handleCancel = () => {
    setEditingConfig(null);
    setTempValues({});
  };

  const renderConfigValue = (config: SystemConfig) => {
    const isEditing = editingConfig === config.id;
    const currentValue = isEditing ? tempValues[config.id] : config.value;

    if (!config.isEditable && !isEditing) {
      return (
        <div className="text-sm text-gray-900">
          {config.type === 'boolean' ? (currentValue ? 'Enabled' : 'Disabled') : String(currentValue)}
        </div>
      );
    }

    if (isEditing) {
      switch (config.type) {
        case 'boolean':
          return (
            <select
              value={String(currentValue)}
              onChange={(e) => setTempValues({ ...tempValues, [config.id]: e.target.value === 'true' })}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          );
        case 'number':
          return (
            <input
              type="number"
              value={currentValue}
              onChange={(e) => setTempValues({ ...tempValues, [config.id]: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
          );
        case 'textarea':
          return (
            <textarea
              value={currentValue}
              onChange={(e) => setTempValues({ ...tempValues, [config.id]: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
          );
        case 'select':
          return (
            <select
              value={currentValue}
              onChange={(e) => setTempValues({ ...tempValues, [config.id]: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              {config.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          );
        default:
          return (
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setTempValues({ ...tempValues, [config.id]: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
          );
      }
    }

    return (
      <div className="text-sm text-gray-900">
        {config.type === 'boolean' ? (currentValue ? 'Enabled' : 'Disabled') : String(currentValue)}
      </div>
    );
  };

  const BackupModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Backup Configuration</h3>
          <button
            onClick={() => setShowBackupModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Create a backup of the current system configuration. This will include all settings and can be used to restore the system later.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Backup Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter backup name"
              defaultValue={`Config Backup ${new Date().toLocaleDateString()}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Describe this backup"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowBackupModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Create Backup
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
          <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
          <p className="text-gray-600">Manage system settings and configuration</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBackupModal(true)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Backup Config
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <BellIcon className="h-5 w-5 mr-2" />
            Test Alerts
          </button>
        </div>
      </div>

      {/* Configuration Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {filteredConfigs.map((config) => (
              <div key={config.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{config.name}</h4>
                      <div className="flex items-center space-x-2">
                        {editingConfig === config.id ? (
                          <>
                            <button
                              onClick={() => handleSave(config.id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        ) : config.isEditable ? (
                          <button
                            onClick={() => handleEdit(config.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            Read Only
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Current Value</label>
                        {renderConfigValue(config)}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Last Modified</label>
                        <div className="text-sm text-gray-600">
                          {new Date(config.lastModified).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Modified By</label>
                        <div className="text-sm text-gray-600">{config.modifiedBy}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Database</div>
              <div className="text-sm text-green-600">Connected</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <ServerIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">ML Service</div>
              <div className="text-sm text-green-600">Running</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Cache</div>
              <div className="text-sm text-yellow-600">Refreshing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Modal */}
      {showBackupModal && <BackupModal />}
    </div>
  );
};

export default SystemConfiguration;
