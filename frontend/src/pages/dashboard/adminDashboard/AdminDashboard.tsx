import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentMagnifyingGlassIcon,
  FolderIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import SystemOverview from './components/SystemOverview';
import UserManagement from './components/UserManagement';
import NCOCodeManagement from './components/NCOCodeManagement';
import SearchManagement from './components/SearchManagement';
import DatasetManagement from './components/DatasetManagement';
import SystemConfiguration from './components/SystemConfiguration';
import Reports from './components/Reports';
import AuditLogs from './components/AuditLogs';

type AdminTab = 
  | 'overview' 
  | 'users' 
  | 'nco-codes' 
  | 'searches' 
  | 'datasets' 
  | 'config' 
  | 'reports' 
  | 'audit';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const adminTabs = [
    { id: 'overview', name: 'System Overview', icon: ChartBarIcon, component: SystemOverview },
    { id: 'users', name: 'User Management', icon: UsersIcon, component: UserManagement },
    { id: 'nco-codes', name: 'NCO Codes', icon: DocumentMagnifyingGlassIcon, component: NCOCodeManagement },
    { id: 'searches', name: 'Search Management', icon: FolderIcon, component: SearchManagement },
    { id: 'datasets', name: 'Datasets', icon: ClipboardDocumentListIcon, component: DatasetManagement },
    { id: 'config', name: 'System Config', icon: Cog6ToothIcon, component: SystemConfiguration },
    { id: 'reports', name: 'Reports', icon: BellIcon, component: Reports },
    { id: 'audit', name: 'Audit Logs', icon: ShieldCheckIcon, component: AuditLogs },
  ];

  const currentTab = adminTabs.find(tab => tab.id === activeTab);
  const CurrentComponent = currentTab?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor the NCO classification system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                System Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-[600px]">
            {CurrentComponent && <CurrentComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
