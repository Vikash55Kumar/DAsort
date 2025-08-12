import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginAsync, clearError } from '../../store/slices/authSlice';
import { validateEmail, validateRequired } from '../../utils/validators';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailError = validateRequired(formData.email, 'Email');
    if (emailError) {
      newErrors.email = emailError;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    const passwordError = validateRequired(formData.password, 'Password');
    if (passwordError) {
      newErrors.password = passwordError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await dispatch(loginAsync(formData)).unwrap();
      navigate('/dashboard');
    } catch {
      setErrors({ general: 'Invalid email or password' });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#f4f6f9', // light government portal gray
        fontFamily: '"Noto Sans", "Segoe UI", Arial, sans-serif',
      }}
    >
      <div className="max-w-md w-full bg-white border border-gray-200 shadow-lg rounded-sm p-8">
        {/* Logo & Title */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center h-14 w-14 rounded-full"
            style={{ backgroundColor: '#00295d' }}
          >
            <span className="text-white text-xl">🔐</span>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#00295d] tracking-wide">
            Government of India – NCO Portal
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#00295d] focus:ring-[#00295d] border-gray-300"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium"
              style={{ color: '#00295d' }}
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full bg-[#00295d] hover:bg-[#01408f] text-white font-medium"
            size="lg"
          >
            Sign in
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium"
              style={{ color: '#00295d' }}
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
