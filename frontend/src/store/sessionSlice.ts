import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sessionService } from '../services/all_others.service';
import { Session } from '../types';

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

export const fetchAllSessions = createAsyncThunk(
  'sessions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await sessionService.getSessions();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

export const fetchBootcampSessions = createAsyncThunk(
  'sessions/fetchByBootcamp',
  async (bootcampId: string, { rejectWithValue }) => {
    try {
      const data = await sessionService.getBootcampSessions(bootcampId);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

export const createSession = createAsyncThunk(
  'sessions/create',
  async (sessionData: any, { rejectWithValue }) => {
    try {
      const data = await sessionService.createSession(sessionData);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create session');
    }
  }
);

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBootcampSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBootcampSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default sessionSlice.reducer;
