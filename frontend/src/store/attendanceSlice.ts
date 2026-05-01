import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceService } from '../services/all_others.service';
import { Attendance } from '../types';

interface AttendanceState {
  records: Attendance[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
  error: null,
};

export const fetchSessionAttendance = createAsyncThunk(
  'attendance/fetchBySession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const data = await attendanceService.getSessionAttendance(sessionId);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionAttendance.fulfilled, (state, action) => {
        state.records = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
