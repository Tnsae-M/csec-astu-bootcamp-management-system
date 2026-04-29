import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { divisionsService } from '../../services/divisions.service';

export interface Division {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface DivisionsState {
  divisions: Division[];
  loading: boolean;
  error: string | null;
}

const initialState: DivisionsState = {
  divisions: [],
  loading: false,
  error: null,
};

// ===== THUNKS =====

export const fetchDivisions = createAsyncThunk(
  'divisions/fetchAll',
  async (name: string | undefined, { rejectWithValue }) => {
    try {
      const response = await divisionsService.getDivisions(name);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch divisions');
    }
  }
);

export const createDivisionAsync = createAsyncThunk(
  'divisions/create',
  async (data: { name: string; description?: string }, { rejectWithValue }) => {
    try {
      const response = await divisionsService.createDivision(data);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create division');
    }
  }
);

export const deleteDivisionAsync = createAsyncThunk(
  'divisions/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await divisionsService.deleteDivision(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete division');
    }
  }
);

const divisionsSlice = createSlice({
  name: 'divisions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDivisions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDivisions.fulfilled, (state, action) => {
        state.loading = false;
        state.divisions = action.payload.data || action.payload || [];
      })

      .addCase(fetchDivisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createDivisionAsync.fulfilled, (state, action) => {
        state.divisions.push(action.payload);
      })
      // Delete
      .addCase(deleteDivisionAsync.fulfilled, (state, action) => {
        state.divisions = state.divisions.filter(d => (d._id) !== action.payload);
      });
  },
});

export default divisionsSlice.reducer;

