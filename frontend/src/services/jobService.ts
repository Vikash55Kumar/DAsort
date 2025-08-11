import axios from 'axios';
import type { JobCode, SearchResult } from '../types';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const jobService = {
  async searchJobs(query: string, limit: number = 10): Promise<SearchResult[]> {
    const response = await api.get('/jobs/search', {
      params: { query, limit }
    });
    return response.data;
  },

  async getJobDetails(code: string): Promise<JobCode> {
    const response = await api.get(`/jobs/${code}`);
    return response.data;
  },

  async getAllJobCodes(): Promise<JobCode[]> {
    const response = await api.get('/jobs');
    return response.data;
  },

  async getJobHierarchy(code: string): Promise<JobCode[]> {
    const response = await api.get(`/jobs/${code}/hierarchy`);
    return response.data;
  },

  async getSimilarJobs(code: string): Promise<JobCode[]> {
    const response = await api.get(`/jobs/${code}/similar`);
    return response.data;
  },
};
