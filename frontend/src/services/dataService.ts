import type { Dataset, KPIData, CleaningResult } from '../types';
import api from '../utils/baseApi';


export const dataService = {
  async getDatasets(): Promise<Dataset[]> {
    const response = await api.get('/datasets');
    return response.data;
  },

  async uploadDataset(file: File, name: string): Promise<Dataset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    
    const response = await api.post('/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getDatasetRecords(datasetId: string, page: number = 1, limit: number = 50): Promise<any> {
    const response = await api.get(`/datasets/${datasetId}/records`, {
      params: { page, limit }
    });
    return response.data;
  },

  async cleanDataset(datasetId: string): Promise<CleaningResult> {
    const response = await api.post(`/datasets/${datasetId}/clean`);
    return response.data;
  },

  async deleteDataset(datasetId: string): Promise<void> {
    await api.delete(`/datasets/${datasetId}`);
  },

  async exportDataset(datasetId: string, format: 'csv' | 'xlsx' | 'json'): Promise<Blob> {
    const response = await api.get(`/datasets/${datasetId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  async getKPIData(): Promise<KPIData> {
    const response = await api.get('/analytics/kpi');
    return response.data;
  },

  async getAnalyticsData(dateRange: { start: string; end: string }): Promise<any> {
    const response = await api.get('/analytics/data', {
      params: dateRange
    });
    return response.data;
  },
};
