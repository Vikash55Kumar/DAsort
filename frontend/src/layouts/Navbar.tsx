import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutAsync } from '../store/slices/authSlice';
import Button from '../components/common/Button';
import {
  HomeIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
  DocumentCheckIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/');
  };

  const publicNavItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Help', href: '/help' },
  ];

  const privateNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Data Explorer', href: '/data-explorer', icon: ChartBarIcon },
    { name: 'Job Search', href: '/job-search', icon: MagnifyingGlassIcon },
    { name: 'Data Cleaning', href: '/data-cleaning', icon: DocumentCheckIcon },
    { name: 'Reports', href: '/reports', icon: DocumentMagnifyingGlassIcon },
    ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin', icon: Cog6ToothIcon }] : []),
  ];

  const isActivePath = (path: string) => location.pathname === path;

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">NCO AI</span>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActivePath(item.href)
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-gray-300 transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">NCO AI</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {privateNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActivePath(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
