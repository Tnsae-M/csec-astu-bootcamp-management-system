import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttendanceRecord {
  _id: string;
  id?: string;
  session: string | any;
  user: string | any;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'PENDING';
  timestamp?: string;
}

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAttendanceSuccess: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.loading = false;
      state.records = action.payload;
    },
    setAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    markAttendance: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex(r => (r._id || r.id) === (action.payload._id || action.payload.id));
      if (index !== -1) {
        state.records[index] = action.payload;
      } else {
        state.records.push(action.payload);
      }
    }
  },
});

export const { setAttendanceStart, setAttendanceSuccess, setAttendanceFailure, markAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
