import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import UserDashboard from './userDashboard/UserDashboard';
import AdminDashboard from './adminDashboard/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Show AdminDashboard for ADMIN role, UserDashboard for others
  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard;
