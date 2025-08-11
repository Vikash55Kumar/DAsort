import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Dataset, KPIData, CleaningResult } from '../../types';
import { dataService } from '../../services/dataService';

interface DataState {
  datasets: Dataset[];
  kpiData: KPIData | null;
  analyticsData: any;
  cleaningResults: CleaningResult | null;
  loading: boolean;
  uploadLoading: boolean;
  error: string | null;
}

const initialState: DataState = {
  datasets: [],
  kpiData: null,
  analyticsData: null,
  cleaningResults: null,
  loading: false,
  uploadLoading: false,
  error: null,
};

// Async thunks
export const fetchDatasetsAsync = createAsyncThunk(
  'data/fetchDatasets',
  async () => {
    const datasets = await dataService.getDatasets();
    return datasets;
  }
);

export const uploadDatasetAsync = createAsyncThunk(
  'data/uploadDataset',
  async ({ file, name }: { file: File; name: string }) => {
    const dataset = await dataService.uploadDataset(file, name);
    return dataset;
  }
);

export const fetchKPIDataAsync = createAsyncThunk(
  'data/fetchKPIData',
  async () => {
    const kpiData = await dataService.getKPIData();
    return kpiData;
  }
);

export const fetchAnalyticsDataAsync = createAsyncThunk(
  'data/fetchAnalyticsData',
  async (dateRange: { start: string; end: string }) => {
    const analyticsData = await dataService.getAnalyticsData(dateRange);
    return analyticsData;
  }
);

export const cleanDatasetAsync = createAsyncThunk(
  'data/cleanDataset',
  async (datasetId: string) => {
    const cleaningResults = await dataService.cleanDataset(datasetId);
    return cleaningResults;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCleaningResults: (state) => {
      state.cleaningResults = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch datasets
      .addCase(fetchDatasetsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatasetsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.datasets = action.payload;
      })
      .addCase(fetchDatasetsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch datasets';
      })
      // Upload dataset
      .addCase(uploadDatasetAsync.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadDatasetAsync.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.datasets.push(action.payload);
      })
      .addCase(uploadDatasetAsync.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.error.message || 'Failed to upload dataset';
      })
      // Fetch KPI data
      .addCase(fetchKPIDataAsync.fulfilled, (state, action) => {
        state.kpiData = action.payload;
      })
      // Fetch analytics data
      .addCase(fetchAnalyticsDataAsync.fulfilled, (state, action) => {
        state.analyticsData = action.payload;
      })
      // Clean dataset
      .addCase(cleanDatasetAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cleanDatasetAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cleaningResults = action.payload;
      })
      .addCase(cleanDatasetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clean dataset';
      });
  },
});

export const { clearError, clearCleaningResults } = dataSlice.actions;
export default dataSlice.reducer;
