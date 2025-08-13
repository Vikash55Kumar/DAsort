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
              
              {/* Classification Engine Status */}
              <div className="hidden lg:flex flex-col items-end space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 left-0 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-800">
                        AI Classification Engine
                      </div>
                      <div className="text-xs text-green-600">
                        Online & Ready
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(currentTime, 'EEEE, MMMM do, yyyy • h:mm a')}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md">
                    NCO Portal v2.1
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mobile Classification Engine Status */}
            <div className="lg:hidden mt-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 left-0 h-2 w-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-sm font-medium text-green-800">AI Engine Online</span>
                  </div>
                  <span className="text-xs text-gray-500">v2.1</span>
                </div>
              </div>
            </div>
            
            {/* Classification Engine Features */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">Intelligent Matching</h3>
                    <p className="text-xs text-blue-700">99.2% accuracy rate</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-purple-900">Real-time Processing</h3>
                    <p className="text-xs text-purple-700">&lt; 200ms response time</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="h-4 w-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900">Multi-language Support</h3>
                    <p className="text-xs text-amber-700">English & Hindi ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-blue-50/20 to-transparent">
        
        {/* Quick Actions & Search Section */}
        <div className="mb-10">
          <div className="text-center mb-6 bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Classification Search</h2>
            <p className="text-blue-700 max-w-2xl mx-auto text-lg">
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
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
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
              <div className="p-8 bg-gradient-to-b from-blue-50/30 to-white">
                <PersonalStats />
              </div>
            </div>

            {/* Search History Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 text-blue-700 mr-3" />
                    <div>
                      <h2 className="text-xl font-bold text-blue-900">Search History</h2>
                      <p className="text-sm text-blue-700">Recent classification searches and results</p>
                    </div>
                  </div>
                  <Link to="/search-history" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    View All History
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-b from-blue-50/20 to-white">
                <RecentSearchHistory />
              </div>
            </div>

          </div>

          {/* Sidebar - Activity & Guidance */}
          <div className="xl:col-span-1 space-y-8">
            
            {/* Admin Activity Feed OR User Quick Actions */}
            {user?.role === 'ADMIN' ? (
              <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-red-700 mr-2" />
                    <div>
                      <h3 className="font-bold text-red-900">System Activity</h3>
                      <p className="text-xs text-red-700">Real-time system monitoring</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-b from-red-50/20 to-white">
                  <ActivityFeed />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-blue-700 mr-2" />
                    <div>
                      <h3 className="font-bold text-blue-900">Quick Actions</h3>
                      <p className="text-xs text-blue-700">Frequently used features</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-b from-blue-50/20 to-white">
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md hover:from-blue-100 hover:to-blue-150 transition-all text-left group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                          <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-blue-900 text-sm">Advanced Search</p>
                          <p className="text-xs text-blue-700">Use filters and bulk search</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg hover:shadow-md hover:from-emerald-100 hover:to-emerald-150 transition-all text-left group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-200 rounded-lg group-hover:bg-emerald-300 transition-colors">
                          <svg className="w-4 h-4 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-emerald-900 text-sm">Upload Dataset</p>
                          <p className="text-xs text-emerald-700">Bulk classification from file</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md hover:from-purple-100 hover:to-purple-150 transition-all text-left group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-200 rounded-lg group-hover:bg-purple-300 transition-colors">
                          <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-purple-900 text-sm">Help & Tutorials</p>
                          <p className="text-xs text-purple-700">Learn NCO classification</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg hover:shadow-md hover:from-amber-100 hover:to-amber-150 transition-all text-left group">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-200 rounded-lg group-hover:bg-amber-300 transition-colors">
                          <svg className="w-4 h-4 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2v1a2 2 0 01-2-2V5zM14 5a2 2 0 012-2v1a2 2 0 012 2v6a2 2 0 01-2 2v1a2 2 0 00-2-2V5zm-6 5a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-amber-900 text-sm">Export Results</p>
                          <p className="text-xs text-amber-700">Download search history</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Start Guide */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center">
                  <InformationCircleIcon className="h-5 w-5 text-green-700 mr-2" />
                  <div>
                    <h3 className="font-bold text-green-900">Quick Start</h3>
                    <p className="text-xs text-green-700">Setup & guidance</p>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-gradient-to-b from-green-50/20 to-white">
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
