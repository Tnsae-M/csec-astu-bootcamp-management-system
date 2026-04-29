import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { attendanceService } from "../../services/attendance.service";

export interface AttendanceRecord {
  _id: string;
  id?: string;
  session: string | any;
  user: string | any;
  status: "PRESENT" | "ABSENT" | "LATE" | "PENDING";
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

// ===== THUNKS =====

export const fetchSessionAttendance = createAsyncThunk(
  "attendance/fetchSession",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getSessionAttendance(sessionId);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  },
);

export const markAttendanceAsync = createAsyncThunk(
  "attendance/mark",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await attendanceService.markAttendance(data);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark attendance');
    }
  },
);

export const fetchMyAttendance = createAsyncThunk(
  "attendance/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getMyAttendance();
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my attendance');
    }
  },
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Session
      .addCase(fetchSessionAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchSessionAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark Attendance
      .addCase(markAttendanceAsync.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => (r._id || r.id) === (action.payload._id || action.payload.id),
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        } else {
          state.records.push(action.payload);
        }
      })
      // Fetch My Attendance
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.records = action.payload;
      });
  },
});

export default attendanceSlice.reducer;

