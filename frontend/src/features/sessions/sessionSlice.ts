import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSessionsSuccess: (state, action: PayloadAction<Session[]>) => {

      state.items = action.payload;
      state.loading = false;
    },
    setSessionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.items.push(action.payload);
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const index = state.items.findIndex(s => (s._id || s.id) === (action.payload._id || action.payload.id));
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    }
  },
});

export const { setSessionsStart, setSessionsSuccess, setSessionsFailure, addSession, updateSession } = sessionSlice.actions;
export default sessionSlice.reducer;
