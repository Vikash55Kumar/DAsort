import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { JobCode, SearchResult } from '../../types';
import { jobService } from '../../services/jobService';

interface JobState {
  searchResults: SearchResult[];
  jobDetails: JobCode | null;
  allJobCodes: JobCode[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  searchResults: [],
  jobDetails: null,
  allJobCodes: [],
  searchQuery: '',
  loading: false,
  error: null,
};

// Async thunks
export const searchJobsAsync = createAsyncThunk(
  'job/searchJobs',
  async ({ query, limit = 10 }: { query: string; limit?: number }) => {
    const response = await jobService.searchJobs(query, limit);
    // Convert NCOSearchResult to SearchResult format
    const convertedResults: SearchResult[] = response.results.map(result => ({
      jobCode: {
        id: result.id,
        code: result.ncoCode,
        title: result.title,
        description: result.description,
        hierarchy: [result.majorGroup, result.subMajorGroup, result.minorGroup],
        confidenceScore: result.confidenceScore
      },
      confidenceScore: result.confidenceScore,
      matchType: result.relevanceScore > 0.8 ? 'exact' : result.relevanceScore > 0.6 ? 'semantic' : 'partial' as 'exact' | 'semantic' | 'partial'
    }));
    return { results: convertedResults, query };
  }
);

export const fetchJobDetailsAsync = createAsyncThunk(
  'job/fetchJobDetails',
  async (code: string) => {
    const jobDetails = await jobService.getJobDetails(code);
    return jobDetails;
  }
);

export const fetchAllJobCodesAsync = createAsyncThunk(
  'job/fetchAllJobCodes',
  async () => {
    const jobCodes = await jobService.getAllJobCodes();
    return jobCodes;
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search jobs
      .addCase(searchJobsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
        state.searchQuery = action.payload.query;
      })
      .addCase(searchJobsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      })
      // Fetch job details
      .addCase(fetchJobDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.jobDetails = action.payload;
      })
      .addCase(fetchJobDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch job details';
      })
      // Fetch all job codes
      .addCase(fetchAllJobCodesAsync.fulfilled, (state, action) => {
        state.allJobCodes = action.payload;
      });
  },
});

export const { clearSearchResults, clearError, setSearchQuery } = jobSlice.actions;
export default jobSlice.reducer;