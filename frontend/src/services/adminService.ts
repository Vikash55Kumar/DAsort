import api from '../utils/baseApi';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  region?: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  phone?: string;
  lastLogin?: string;
  _count?: {
    searches: number;
    datasets: number;
  };
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalNCOCodes: number;
  verifiedNCOCodes: number;
  totalSearches: number;
  dailyActiveUsers: number;
  systemUptime: string;
  avgResponseTime: number;
  userGrowth: {
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  searchGrowth: {
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
}

interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  method?: string;
  endpoint?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: any;
  success: boolean;
  errorMessage?: string;
  duration?: number;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface NCOCode {
  id: string;
  ncoCode: string;
  title: string;
  description: string;
  majorGroup: string;
  subMajorGroup: string;
  minorGroup: string;
  unitGroup: string;
  sector?: string;
  skillLevel?: string;
  educationLevel?: string;
  version: string;
  isVerified: boolean;
  createdAt: string;
  // Optional fields that might not be returned by all endpoints
  keywords?: string[];
  synonyms?: string[];
  isActive?: boolean;
  updatedAt?: string;
}

export const adminService = {
  // Users Management
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<UsersResponse> {
    const response = await api.get('/users/get-allUsers', { params });
    return response.data.data;
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${userId}/role`, userData);
    return response.data.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await api.post('/users/register', userData);
    return response.data.data;
  },

  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  },

  // Audit Logs
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    action?: string;
    resourceType?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    success?: boolean;
  }): Promise<AuditLogsResponse> {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data.data;
  },

  // NCO Code Management
  async getAllNCOCodes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isVerified?: boolean;
    majorGroup?: string;
    sector?: string;
    skillLevel?: string;
    isActive?: boolean;
  }): Promise<{ ncoCodes: NCOCode[]; pagination: any }> {
    const response = await api.get('/jobs/nco-codes', { params });
    return response.data.data;
  },

  async createNCOCode(data: Partial<NCOCode>): Promise<NCOCode> {
    const response = await api.post('/admin/nco-codes', data);
    return response.data.data;
  },

  async updateNCOCode(id: string, data: Partial<NCOCode>): Promise<NCOCode> {
    const response = await api.put(`/admin/nco-codes/${id}`, data);
    return response.data.data;
  },

  async deleteNCOCode(id: string): Promise<void> {
    await api.delete(`/admin/nco-codes/${id}`);
  },

  // System Configuration
  async getSystemConfigs(): Promise<any> {
    const response = await api.get('/admin/system-config');
    return response.data.data;
  },

  async updateSystemConfig(config: any): Promise<any> {
    const response = await api.put('/admin/system-config', config);
    return response.data.data;
  },

  // Analytics
  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
  }): Promise<any> {
    const response = await api.get('/admin/analytics', { params });
    return response.data.data;
  }
};

export type { User, UsersResponse, DashboardStats, AuditLog, AuditLogsResponse, NCOCode };
