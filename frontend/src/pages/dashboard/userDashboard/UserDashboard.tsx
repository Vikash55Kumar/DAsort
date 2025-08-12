import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import { 
  ChartBarIcon, 
  ClockIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

import { format } from 'date-fns';
import QuickSearchBar from './component/QuickSearchBar';
import PersonalStats from './component/PersonalStats';
import RecentSearchHistory from './component/RecentSearchHistory';
import ActivityFeed from './component/ActivityFeed';
import GettingStartedGuide from './component/GettingStartedGuide';

const UserDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Professional Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="py-3 border-b border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(currentTime, 'EEEE, MMMM do, yyyy • h:mm a')}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  System Online
                </span>
                <span className="text-xs">NCO Portal v2.1</span>
              </div>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div
                    className="flex items-center justify-center h-16 w-16 rounded-xl shadow-lg ring-4 ring-white"
                    style={{ 
                      background: 'linear-gradient(135deg, #00295d 0%, #01408f 50%, #667eea 100%)',
                    }}
                  >
                    <UserIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Welcome back, {user?.name}
                  </h1>
                  <p className="text-gray-600 font-medium">
                    National Classification of Occupations Portal
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ministry of Statistics & Programme Implementation • Government of India
                  </p>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Classification Engine Active</span>
                  </div>
                  <p className="text-xs text-gray-500">Real-time NCO matching available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Actions & Search Section */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Classification Search</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quickly find NCO codes using our AI-powered search engine. Enter job titles, descriptions, or existing codes for instant classification.
            </p>
          </div>
          <QuickSearchBar />
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Content Area - Statistics & History */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Analytics Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00295d] to-[#01408f] px-6 py-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-6 w-6 mr-3" />
                    <div>
                      <h2 className="text-xl text-white font-bold">Analytics Dashboard</h2>
                      <p className="text-blue-100 text-sm">Your classification performance metrics</p>
                    </div>
                  </div>
                  <Link to="/user-reports" className="inline-flex items-center px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors">
                    Detailed Reports
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
              <div className="p-8">
                <PersonalStats />
              </div>
            </div>

            {/* Search History Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 text-[#00295d] mr-3" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Search History</h2>
                      <p className="text-sm text-gray-600">Recent classification searches and results</p>
                    </div>
                  </div>
                  <Link to="/search-history" className="inline-flex items-center px-4 py-2 bg-[#00295d] text-white text-sm font-medium rounded-lg hover:bg-[#01408f] transition-colors">
                    View All History
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <RecentSearchHistory />
              </div>
            </div>

          </div>

          {/* Sidebar - Activity & Guidance */}
          <div className="xl:col-span-1 space-y-8">
            
            {/* Admin Activity Feed OR User Quick Actions */}
            {user?.role === 'ADMIN' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-[#00295d] mr-2" />
                    <div>
                      <h3 className="font-bold text-gray-900">System Activity</h3>
                      <p className="text-xs text-gray-600">Real-time system monitoring</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <ActivityFeed />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-[#00295d] mr-2" />
                    <div>
                      <h3 className="font-bold text-gray-900">Quick Actions</h3>
                      <p className="text-xs text-gray-600">Frequently used features</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg hover:shadow-sm transition-all text-left group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Advanced Search</p>
                          <p className="text-xs text-gray-600">Use filters and bulk search</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg hover:shadow-sm transition-all text-left group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Upload Dataset</p>
                          <p className="text-xs text-gray-600">Bulk classification from file</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg hover:shadow-sm transition-all text-left group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Help & Tutorials</p>
                          <p className="text-xs text-gray-600">Learn NCO classification</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-lg hover:shadow-sm transition-all text-left group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2v1a2 2 0 01-2-2V5zM14 5a2 2 0 012-2v1a2 2 0 012 2v6a2 2 0 01-2 2v1a2 2 0 00-2-2V5zm-6 5a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Export Results</p>
                          <p className="text-xs text-gray-600">Download search history</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Start Guide */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center">
                  <InformationCircleIcon className="h-5 w-5 text-[#00295d] mr-2" />
                  <div>
                    <h3 className="font-bold text-gray-900">Quick Start</h3>
                    <p className="text-xs text-gray-600">Setup & guidance</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <GettingStartedGuide />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
