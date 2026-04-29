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

export const fetchSessionAttendance = createAsyncThunk(
  "attendance/fetchSession",
  async (sessionId: string) => {
    const response = await attendanceService.getSessionAttendance(sessionId);
    return response.data;
  },
);

export const markAttendanceAsync = createAsyncThunk(
  "attendance/mark",
  async (data: any) => {
    const response = await attendanceService.markAttendance(data);
    return response.data;
  },
);

export const fetchMyAttendance = createAsyncThunk(
  "attendance/fetchMy",
  async () => {
    const response = await attendanceService.getMyAttendance();
    return response.data;
  },
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAttendanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAttendanceSuccess: (
      state,
      action: PayloadAction<AttendanceRecord[]>,
    ) => {
      state.loading = false;
      state.records = action.payload;
    },
    setAttendanceFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    markAttendance: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex(
        (r) => (r._id || r.id) === (action.payload._id || action.payload.id),
      );
      if (index !== -1) {
        state.records[index] = action.payload;
      } else {
        state.records.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message || "Failed to fetch";
      })
      .addCase(markAttendanceAsync.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r._id === action.payload._id,
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        } else {
          state.records.push(action.payload);
        }
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.records = action.payload;
      });
  },
});

export const {
  setAttendanceStart,
  setAttendanceSuccess,
  setAttendanceFailure,
  markAttendance,
} = attendanceSlice.actions;
export default attendanceSlice.reducer;
