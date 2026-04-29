import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { sessionsService } from '../../services/sessions.service';

export interface Session {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  bootcamp?: string | any;
  instructor?: string | any;
  date?: string;
  startTime?: string;
  endTime?: string;
  durationH?: number;
  location?: string;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | string;
}

interface SessionState {
  items: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  items: [],
  loading: false,
  error: null,
};

// ===== THUNKS =====

export const fetchSessions = createAsyncThunk(
  'sessions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sessionsService.getSessions();
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

export const fetchSessionsByBootcamp = createAsyncThunk(

  'sessions/fetchByBootcamp',
  async (bootcampId: string, { rejectWithValue }) => {
    try {
      const response = await sessionsService.getSessionsByBootcamp(bootcampId);
      // sessionsService returns axios response
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

export const createSessionAsync = createAsyncThunk(
  'sessions/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await sessionsService.createSession(data);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create session');
    }
  }
);

export const updateSessionAsync = createAsyncThunk(
  'sessions/update',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await sessionsService.updateSession(id, data);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update session');
    }
  }
);

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch By Bootcamp

      .addCase(fetchSessionsByBootcamp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionsByBootcamp.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSessionsByBootcamp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createSessionAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateSessionAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(s => (s._id || s.id) === (action.payload._id || action.payload.id));
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default sessionSlice.reducer;

