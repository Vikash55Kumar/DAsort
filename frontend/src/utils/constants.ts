// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Application Constants
export const APP_NAME = 'NCO Classification Portal';
export const APP_VERSION = '1.0.0';

// Pagination Constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Search Constants
export const MAX_SEARCH_QUERY_LENGTH = 500;
export const SEARCH_DEBOUNCE_DELAY = 300;

// File Upload Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv'
];

// Authentication Constants
export const TOKEN_STORAGE_KEY = 'token';
export const USER_STORAGE_KEY = 'user';

// NCO Classification Constants
export const NCO_CODE_LENGTH = 8;
export const CONFIDENCE_THRESHOLD = 0.7;

// Dashboard Refresh Intervals (in milliseconds)
export const DASHBOARD_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const ACTIVITY_FEED_REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes

// Government Portal Information
export const GOVERNMENT_INFO = {
  ministry: 'Ministry of Statistics & Programme Implementation',
  department: 'Government of India',
  supportEmail: 'support@nco.gov.in',
  supportPhone: '1800-XXX-XXXX'
};

// Chart Colors (Government Theme)
export const CHART_COLORS = {
  primary: '#00295d',
  secondary: '#01408f',
  accent: '#667eea',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

// Time Periods for Analytics
export const ANALYTICS_PERIODS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' }
];

// User Roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const;

// Search Input Methods
export const INPUT_METHODS = {
  TEXT: 'TEXT',
  VOICE: 'VOICE',
  API: 'API'
} as const;

// Dataset Status
export const DATASET_STATUS = {
  DRAFT: 'DRAFT',
  VALIDATING: 'VALIDATING',
  READY_FOR_AI: 'READY_FOR_AI',
  AI_PROCESSING: 'AI_PROCESSING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
  ARCHIVED: 'ARCHIVED'
} as const;
