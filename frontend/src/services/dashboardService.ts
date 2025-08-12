import api from '../utils/baseApi';

interface UserStats {
  totalSearches: number;
  successfulMatches: number;
  datasetsUploaded: number;
  classificationsMade: number;
  searchHistory: SearchHistoryItem[];
  userProfile: UserProfile;
  userEngagement: UserEngagement;
}

interface SearchHistoryItem {
  id: string;
  query: string;
  searchedAt: string;
  totalResults: number;
  processingTime: number;
  aiServiceStatus: string;
  results: SearchResult[];
  feedback?: {
    rating: number;
    isCorrect: boolean;
  };
}

interface SearchResult {
  id: string;
  relevanceScore: number;
  confidenceScore: number;
  rank: number;
  ncoCode: {
    ncoCode: string;
    title: string;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  region?: string;
  role: string;
  createdAt: string;
  _count: {
    searches: number;
    datasets: number;
    feedbacks: number;
  };
}

interface UserEngagement {
  searchCount: number;
  avgProcessingTime: number;
  feedbackCount: number;
  avgRating: number;
}

interface WeeklyActivity {
  date: string;
  total_searches: number;
  unique_users: number;
  avg_processing_time: number;
}

interface ActivityFeedItem {
  id: string;
  type: 'search' | 'upload' | 'system' | 'feedback' | 'update';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

export class DashboardService {
  static async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await api.get('/users/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  static async getUserSearchHistory(page: number = 1, limit: number = 10): Promise<{
    searches: SearchHistoryItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await api.get(`/users/search-history?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching search history:', error);
      throw error;
    }
  }

  static async getUserEngagement(period: string = '30d'): Promise<UserEngagement> {
    try {
      const response = await api.get(`/analytics/user-engagement?period=${period}`);
      
      // For regular users, this returns their own data
      const userEngagement = response.data.data.userEngagement[0] || {
        searchCount: 0,
        avgProcessingTime: 0,
        feedbackCount: 0,
        avgRating: 0
      };

      return userEngagement;
    } catch (error) {
      console.error('Error fetching user engagement:', error);
      throw error;
    }
  }

  static async getSearchTrends(period: string = '7d'): Promise<{
    dailyStats: WeeklyActivity[];
    topQueries: { query: string; count: number }[];
    totalSearches: number;
  }> {
    try {
      const response = await api.get(`/analytics/search-trends?period=${period}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching search trends:', error);
      throw error;
    }
  }

  static async getDashboardStats(): Promise<UserStats> {
    try {
      const [userProfile, searchHistory, userEngagement] = await Promise.all([
        this.getUserProfile(),
        this.getUserSearchHistory(1, 10),
        this.getUserEngagement('30d')
      ]);

      // Calculate stats from the data
      const totalSearches = userProfile._count.searches;
      const successfulMatches = searchHistory.searches.filter(s => s.aiServiceStatus === 'success').length;
      const datasetsUploaded = userProfile._count.datasets;
      const classificationsMade = searchHistory.searches.reduce((acc, s) => acc + s.totalResults, 0);

      return {
        totalSearches,
        successfulMatches,
        datasetsUploaded,
        classificationsMade,
        searchHistory: searchHistory.searches,
        userProfile,
        userEngagement
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  static async getActivityFeed(): Promise<ActivityFeedItem[]> {
    try {
      // Get recent search history as activity feed
      const searchHistory = await this.getUserSearchHistory(1, 5);
      
      const activities: ActivityFeedItem[] = searchHistory.searches.map(search => ({
        id: search.id,
        type: 'search' as const,
        title: 'Search Completed',
        description: `Found ${search.totalResults} NCO matches for "${search.query}"`,
        timestamp: search.searchedAt,
        status: search.aiServiceStatus === 'success' ? 'success' as const : 'error' as const
      }));

      // Add some system activities (mock for now - could be extended with audit logs)
      const systemActivities: ActivityFeedItem[] = [
        {
          id: 'sys-1',
          type: 'system',
          title: 'NCO Database Updated',
          description: 'New classification codes added to Technology sector',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'info'
        },
        {
          id: 'sys-2',
          type: 'update',
          title: 'Feature Update',
          description: 'Voice search functionality has been enhanced with better accuracy',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'info'
        }
      ];

      return [...activities, ...systemActivities].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      return [];
    }
  }
}
