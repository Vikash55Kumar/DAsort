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
import logo from '../assets/logo.png';

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

  const navStyle =
    'px-4 py-3 text-base font-medium tracking-wide transition-colors duration-150';

  // ======= PUBLIC NAVBAR =======
  if (!isAuthenticated) {
    return (
      <nav
        className="bg-[#00295d] border-b border-black"
        style={{
          fontFamily: '"Noto Sans", "Segoe UI", Arial, sans-serif',
          height: '72px', // Increased from 56px
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="DAsort"
              className="h-12 w-24 mr-2"
            />
          </Link>

          {/* Right-side navigation */}
          <div className="flex items-center space-x-6">
            {publicNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${navStyle} ${
                  isActivePath(item.href)
                    ? 'text-white border-b-2 border-[#ecf0f3]'
                    : 'text-gray-200 hover:text-white hover:border-[#ecf0f3]'
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
                className="text-white border border-white hover:bg-[#ecf0f3] hover:text-[#00295d] text-base py-2 px-4"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="primary"
                size="sm"
                className="bg-[#ecf0f3] text-[#00295d] hover:bg-[#338ed4] text-base py-2 px-4 font-medium"
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
      style={{
        fontFamily: '"Noto Sans", "Segoe UI", Arial, sans-serif',
        height: '72px', // Increased from 56px
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center">
          <img
            src={logo}
            alt="NCO AI Portal"
            className="h-10 w-10 mr-2"
          />
          <span className="text-2xl font-semibold text-white tracking-wide">
            NCO AI Portal
          </span>
        </Link>

        {/* Private Links + User Info */}
        <div className="flex items-center space-x-5">
          {privateNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${navStyle} flex items-center rounded-sm ${
                  isActivePath(item.href)
                    ? 'bg-[#ecf0f3] text-[#00295d]'
                    : 'text-gray-200 hover:text-white hover:bg-[#003b85]'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            );
          })}

          {/* User Info */}
          <div className="flex items-center space-x-2 text-white text-base">
            <UserIcon className="h-6 w-6 text-gray-300" />
            <span>{user?.name}</span>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-[#c9e7fe] hover:text-[#00295d] text-base py-2 px-4"
            icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
