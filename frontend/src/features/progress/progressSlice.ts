import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../../services/progress.service';

export interface ProgressReport {
  _id?: string;
  studentId?: any;
  bootcampId?: any;
  overallScore?: number;
  completedTasks?: number;
  totalTasks?: number;
  attendedSessions?: number;
  totalSessions?: number;
  status?: string;
}

interface ProgressState {
  reports: ProgressReport[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  reports: [],
  loading: false,
  error: null,
};

export const fetchMyProgress = createAsyncThunk(
  'progress/fetchMyProgress',
  async (bootcampId: string, { rejectWithValue }) => {
    try {
      const response = await progressService.getMyProgress(bootcampId);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProgress.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns an object with stats, so we might need to wrap it in an array or adjust component logic
        state.reports = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(fetchMyProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default progressSlice.reducer;

