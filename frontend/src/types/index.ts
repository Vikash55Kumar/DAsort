export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface JobCode {
  id: string;
  code: string;
  title: string;
  description: string;
  hierarchy: string[];
  confidenceScore?: number;
}

export interface Dataset {
  id: string;
  name: string;
  recordCount: number;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'error';
  userId: string;
}

export interface KPIData {
  totalDatasets: number;
  recordsProcessed: number;
  anomaliesFixed: number;
  jobCodesMatched: number;
}

export interface SearchResult {
  jobCode: JobCode;
  confidenceScore: number;
  matchType: 'exact' | 'semantic' | 'partial';
}

export interface CleaningResult {
  totalRecords: number;
  errorsFound: number;
  anomaliesRemoved: number;
  duplicatesRemoved: number;
  processingTime: number;
}
