import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import UserDashboard from './userDashboard/UserDashboard';
// import AdminDashboard from './adminDashboard/AdminDashboard'; // TODO: Create admin dashboard

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // For now, show UserDashboard for all users
  // Later we'll add AdminDashboard for ADMIN role
  if (user?.role === 'ADMIN') {
    // TODO: Implement AdminDashboard
    return <UserDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard;
