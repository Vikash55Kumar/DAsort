import type { User } from '../types';
import api from '../utils/baseApi';


// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// // Add auth token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'USER' | 'ADMIN';
  phone?: string;
  region?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/users/login', { email, password });
    return response.data.data; // Extract data from ApiResponse wrapper
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/users/register', data);
    return response.data.data; // Extract data from ApiResponse wrapper
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/profile');
    
    return response.data.data; // Extract data from ApiResponse wrapper
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/users/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/users/reset-password', { token, password });
  },
};
