import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  timestamp: string;
}

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.records = action.payload;
    },
    markAttendance: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex(r => r.sessionId === action.payload.sessionId && r.studentId === action.payload.studentId);
      if (index !== -1) {
        state.records[index] = action.payload;
      } else {
        state.records.push(action.payload);
      }
    }
  },
});

export const { setRecords, markAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
