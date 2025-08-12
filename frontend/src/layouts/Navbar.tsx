import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutAsync } from '../store/slices/authSlice';
import Button from '../components/common/Button';
import {
  HomeIcon,
  ClockIcon,
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
    { name: 'Job Search', href: '/job-search', icon: MagnifyingGlassIcon },
    { name: 'Reports', href: '/user-reports', icon: DocumentMagnifyingGlassIcon },
    { name: 'Search History', href: '/search-history', icon: ClockIcon },
    { name: 'Data Cleaning', href: '/data-cleaning', icon: DocumentCheckIcon },
    ...(user?.role === 'ADMIN' ? [{ name: 'Admin', href: '/admin', icon: Cog6ToothIcon }] : []),
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const navStyle = "px-2 py-1 text-xs font-medium tracking-wide transition-colors duration-150";

  // ======= PUBLIC NAVBAR =======
  if (!isAuthenticated) {
    return (
      <nav
        className="bg-[#00295d] border-b border-black"
        style={{ fontFamily: '"Noto Sans", "Segoe UI", Arial, sans-serif', height: '48px' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-lg font-semibold text-white tracking-wide">
              NCO AI Portal
            </span>
          </Link>

          {/* Right-side navigation */}
          <div className="flex items-center space-x-4">
            {publicNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${navStyle} ${
                  isActivePath(item.href)
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-200 hover:text-white hover:border-white'
                } border-b-2 border-transparent`}
              >
                {item.name}
              </Link>
            ))}

            {/* Buttons */}
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white border border-white hover:bg-white hover:text-[#00295d] text-xs py-1 px-2"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="primary"
                size="sm"
                className="bg-white text-[#00295d] hover:bg-gray-100 text-xs py-1 px-2"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // ======= PRIVATE NAVBAR =======
  return (
    <nav
      className="bg-[#00295d] border-b border-black"
      style={{ fontFamily: '"Noto Sans", "Segoe UI", Arial, sans-serif', height: '48px' }}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center">
          <span className="text-lg font-semibold text-white tracking-wide">
            NCO AI Portal
          </span>
        </Link>

        {/* Private Links + User Info */}
        <div className="flex items-center space-x-3">
          {privateNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${navStyle} flex items-center rounded-sm ${
                  isActivePath(item.href)
                    ? 'bg-white text-[#00295d]'
                    : 'text-gray-200 hover:text-white hover:bg-[#003b85]'
                }`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {item.name}
              </Link>
            );
          })}

          {/* User Info */}
          <div className="flex items-center space-x-1 text-white text-xs">
            <UserIcon className="h-4 w-4 text-gray-300" />
            <span>{user?.name}</span>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-white hover:text-[#00295d] text-xs py-1 px-2"
            icon={<ArrowRightOnRectangleIcon className="h-3 w-3" />}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
