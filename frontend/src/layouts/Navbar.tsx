import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutAsync } from '../store/slices/authSlice';
import {
  HomeIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutAsync());
    navigate('/');
  }, [dispatch, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const navigationItems = useMemo(() => [
    { name: 'Home', href: '/', icon: HomeIcon, public: true },
    { name: 'About', href: '/about', public: true },
    { name: 'Contact', href: '/contact', public: true },
    ...(isAuthenticated ? [
      ...(user?.role === 'ADMIN' ? [{ name: 'Admin Dashboard', href: '/admin', icon: Cog6ToothIcon, public: false }] : [{ name: 'User Dashboard', href: '/dashboard', icon: Cog6ToothIcon, public: false }]),
    ] : [])
  ], [isAuthenticated, user?.role]);

  const isActivePath = useCallback((path: string) => location.pathname === path, [location.pathname]);

  // Memoize styles to prevent recreating objects
  const navbarStyle = useMemo(() => ({
    height: '72px',
  }), []);

  return (
    <nav className="bg-[#00295d] border-b border-black fixed top-0 left-0 right-0 z-50" style={navbarStyle}>
      <div className="w-full mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="DAsort"
            className="h-18 w-36 p-2"
          />
        </Link>

        {/* Center Navigation */}
        <div className="flex items-center space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-base font-medium transition-colors duration-150 ${
                  isActivePath(item.href)
                    ? 'border-b-2 border-white text-white'
                    : 'text-white'
                }`}
              >
                {Icon && <Icon className="h-5 w-5 mr-2" />}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side - Auth Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 text-white hover:bg-[#003b85] px-4 py-2 rounded-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-8 w-8 text-gray-300 group-hover:text-white transition-colors" />
                    <div className="text-left">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-300">{user?.email}</div>
                    </div>
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-300 transition-all duration-200 ${isUserDropdownOpen ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                          <div className="text-xs text-gray-500">{user?.email}</div>
                          <div className="text-xs text-blue-600 font-medium">{user?.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                            <Cog6ToothIcon className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Admin Panel</div>
                            <div className="text-xs text-gray-500">System administration</div>
                          </div>
                        </Link>
                      )}
                      
                      <Link
                        to="/user-reports"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 group"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                          <DocumentMagnifyingGlassIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Reports</div>
                          <div className="text-xs text-gray-500">View analytics & reports</div>
                        </div>
                      </Link>
                      
                      <Link
                        to="/search-history"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 group"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                          <ClockIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Search History</div>
                          <div className="text-xs text-gray-500">View past searches</div>
                        </div>
                      </Link>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-200">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-150 group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg mr-3 group-hover:bg-red-200 transition-colors">
                          <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <div className="text-xs text-gray-500">Logout from account</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Creative Login/Signup Buttons */}
              <Link to="/login">
                <button className="group relative flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg overflow-hidden">
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-white" />
                  <div className="text-left">
                    <div className="text-sm font-bold tracking-wide">Sign In</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
