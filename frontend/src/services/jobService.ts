import type { JobCode } from '../types';
import api from '../utils/baseApi';

interface NCOSearchResult {
  id: string;
  ncoCode: string;
  title: string;
  description: string;
  majorGroup: string;
  subMajorGroup: string;
  minorGroup: string;
  relevanceScore: number;
  confidenceScore: number;
  rank: number;
  ncoCodeId?: string; // Add this to track the actual NCO code ID for feedback
}

interface NCOSearchResponse {
  searchId: string;
  results: NCOSearchResult[];
  totalResults: number;
  processingTime: number;
  query: string;
  suggestions?: string[];
}

interface SearchFeedbackData {
  searchId: string;
  selectedCodeId?: string;
  rating?: number;
  isCorrect?: boolean;
  wasHelpful?: boolean;
  comments?: string;
  correctionReason?: string;
  suggestedKeywords?: string[];
  reportedIssue?: string;
}

interface TrendingSearch {
  query: string;
  count: number;
}

interface TrendingSearchResponse {
  period: string;
  topQueries: TrendingSearch[]; // Backend returns without rank, we add it in frontend
  totalSearches: number;
  dailyStats?: Array<{
    date: string;
    total_searches: number;
    unique_users: number;
    avg_processing_time: number;
    avg_results: number;
  }>;
}

interface NCOCode {
  id: string;
  ncoCode: string;
  title: string;
  description: string;
  majorGroup: string;
  subMajorGroup: string;
  minorGroup: string;
}

export const jobService = {
  async searchJobs(query: string, limit: number = 5): Promise<NCOSearchResponse> {
    const response = await api.post('/jobs/search', {
      query: query.trim(),
      limit,
      includeRecommendations: true
    });
    
    const data = response.data.data;
    
    // Transform the nested response to match frontend interface
    const transformedResults: NCOSearchResult[] = data.results.map((result: any) => ({
      id: result.id,
      ncoCodeId: result.ncoCodeId, // Store the NCO code ID for feedback
      ncoCode: result.ncoCode.ncoCode, // Extract the actual NCO code string
      title: result.ncoCode.title,
      description: result.ncoCode.description,
      majorGroup: result.ncoCode.majorGroup,
      subMajorGroup: result.ncoCode.subMajorGroup,
      minorGroup: result.ncoCode.minorGroup,
      relevanceScore: result.relevanceScore,
      confidenceScore: result.confidenceScore,
      rank: result.rank
    }));
    
    return {
      searchId: data.searchId,
      results: transformedResults,
      totalResults: data.totalResults,
      processingTime: data.processingTime,
      query: data.query,
      suggestions: data.suggestions
    };
  },

  async submitSearchFeedback(feedbackData: SearchFeedbackData): Promise<void> {
    await api.post('/jobs/feedback', feedbackData);
  },

  async getAllNCOCodes(limit?: number, search?: string): Promise<{
    ncoCodes: NCOCode[];
    total: number;
  }> {
    const response = await api.get('/jobs/nco-codes', {
      params: { limit, search }
    });
    return response.data.data; // Extract data from ApiResponse wrapper
  },

  async getNCOCodeById(id: string): Promise<NCOCode> {
    const response = await api.get(`/jobs/nco-codesId/${id}`);
    return response.data.data; // Extract data from ApiResponse wrapper
  },

  async getPopularSearches(): Promise<{
    searches: Array<{ query: string; count: number; }>;
  }> {
    const response = await api.get('/jobs/popular-searches');
    return response.data.data; // Extract data from ApiResponse wrapper
  },

  async getRecommendedNCOCodes(): Promise<{
    recommendations: NCOCode[];
  }> {
    const response = await api.get('/jobs/recommendations');
    return response.data.data; // Extract data from ApiResponse wrapper
  },

  async getTrendingSearches(period: string = '7d'): Promise<TrendingSearchResponse> {
    const response = await api.get(`/analytics/search-trends?period=${period}`);
    return response.data.data; // Extract data from ApiResponse wrapper
  },

  async markResultViewed(resultId: string): Promise<void> {
    await api.put(`/jobs/results/${resultId}/viewed`);
  },

  // Legacy methods for backward compatibility
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
