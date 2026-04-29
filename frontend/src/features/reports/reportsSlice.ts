import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportsService from '../../services/reports.service';

export interface Report {
  _id: string;
  title: string;
  content: string;
  author: string | any;
  createdAt: string;
}

interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk(
  'reports/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsService.getReports();
      const list = Array.isArray(response) ? response : (response?.data ?? []);
      return list;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const createReportAsync = createAsyncThunk(
  'reports/create',
  async (payload: { title: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await reportsService.createReport(payload);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createReportAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReportAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(createReportAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reportsSlice.reducer;
