import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthContext';
import { useAppDispatch } from './hooks/redux';
import { getCurrentUserAsync } from './store/slices/authSlice';


// Public Pages
import About from './pages/general/About';
import Contact from './pages/general/Contact';
import Help from './pages/general/Help';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Private Pages
import Dashboard from './pages/dashboard/Dashboard';
import JobSearch from './pages/dashboard/JobSearch';
import UserReports from './pages/dashboard/userDashboard/UserReports';
import SearchHistory from './pages/dashboard/userDashboard/SearchHistory';
import HomePage from './pages/home/HomePage';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(getCurrentUserAsync());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <ToastContainer 
        position="top-center"  // This will show the toast in the center of the screen
        autoClose={3000}  // Toast will disappear after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/user-reports" element={<UserReports />} />
          <Route path="/search-history" element={<SearchHistory />} />
          <Route path="/active" element={<div>frontend active</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
