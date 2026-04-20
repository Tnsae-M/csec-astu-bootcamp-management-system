import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Session {
  id: string;
  title: string;
  division: string;
  instructor: string;
  time: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
}

interface SessionState {
  items: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  items: [
    { id: '1', title: 'Modular Design Patterns', division: 'Software Development', instructor: 'Iman', time: '10:00 AM - 12:00 PM', status: 'LIVE' },
    { id: '2', title: 'Neural Networks Basics', division: 'Data Science', instructor: 'Jerusalem', time: '01:00 PM - 03:00 PM', status: 'UPCOMING' },
    { id: '3', title: 'OAuth2 Implementation', division: 'Cybersecurity', instructor: 'Wogari', time: '04:00 PM - 06:00 PM', status: 'COMPLETED' },
  ],
  loading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.items = action.payload;
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.items.push(action.payload);
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const index = state.items.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    }
  },
});

export const { setSessions, addSession, updateSession } = sessionSlice.actions;
export default sessionSlice.reducer;
