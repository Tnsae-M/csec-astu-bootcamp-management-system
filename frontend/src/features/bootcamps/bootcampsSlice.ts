import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { bootcampsService } from '../../services/bootcamps.service';

export interface Bootcamp {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  division: string | any;
  status: string;
  createdAt: string;
}

interface BootcampsState {
  bootcamps: Bootcamp[];
  currentBootcamp: Bootcamp | null;
  loading: boolean;
  error: string | null;
}

const initialState: BootcampsState = {
  bootcamps: [],
  currentBootcamp: null,
  loading: false,
  error: null,
};

// ===== THUNKS =====

export const fetchBootcamps = createAsyncThunk(
  'bootcamps/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bootcampsService.getBootcamps();
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bootcamps');
    }
  }
);

export const fetchBootcampById = createAsyncThunk(
  'bootcamps/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bootcampsService.getBootcamp(id);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bootcamp');
    }
  }
);

export const createBootcamp = createAsyncThunk(
  'bootcamps/create',
  async ({ divisionId, data }: { divisionId: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await bootcampsService.createBootcamp(divisionId, data);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bootcamp');
    }
  }
);

export const fetchBootcampsByDivision = createAsyncThunk(
  'bootcamps/fetchByDivision',
  async (divisionId: string, { rejectWithValue }) => {
    try {
      const response = await bootcampsService.getBootcampsByDivision(divisionId);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch division bootcamps');
    }
  }
);

const bootcampsSlice = createSlice({
  name: 'bootcamps',
  initialState,
  reducers: {
    clearCurrentBootcamp: (state) => {
      state.currentBootcamp = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchBootcamps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBootcamps.fulfilled, (state, action) => {
        state.loading = false;
        state.bootcamps = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
      })
      .addCase(fetchBootcamps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch By Division
      .addCase(fetchBootcampsByDivision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBootcampsByDivision.fulfilled, (state, action) => {
        state.loading = false;
        state.bootcamps = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
      })
      .addCase(fetchBootcampsByDivision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch One
      .addCase(fetchBootcampById.fulfilled, (state, action) => {
        state.currentBootcamp = action.payload;
      })
      // Create
      .addCase(createBootcamp.fulfilled, (state, action) => {
        state.bootcamps.push(action.payload);
      });
  },
});

export const { clearCurrentBootcamp } = bootcampsSlice.actions;
export default bootcampsSlice.reducer;

