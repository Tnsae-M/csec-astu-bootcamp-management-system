import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enrollmentsService } from '../../services/enrollments.service';

export interface Enrollment {
  _id: string;
  id?: string;
  user?: any;
  studentId?: string | any;
  bootcamp?: any;
  bootcampId?: string | any;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'DROPPED';
  enrolledAt?: string;
  createdAt?: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];     // admin/instructor view (by bootcamp)
  myEnrollments: Enrollment[];   // student view (GET /enrollments/me)
  loading: boolean;
  myLoading: boolean;
  error: string | null;
}

const initialState: EnrollmentsState = {
  enrollments: [],
  myEnrollments: [],
  loading: false,
  myLoading: false,
  error: null,
};

// ===== THUNKS =====

export const fetchMyEnrollments = createAsyncThunk(
  'enrollments/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const response = await enrollmentsService.getMyEnrollments();
      // Backend: { success, message, data: [...] }
      return response.data || response || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your enrollments');
    }
  }
);

export const fetchBootcampEnrollments = createAsyncThunk(
  'enrollments/fetchByBootcamp',
  async (bootcampId: string, { rejectWithValue }) => {
    try {
      const response = await enrollmentsService.getBootcampEnrollments(bootcampId);
      return response.data || response || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrollments');
    }
  }
);

export const createEnrollmentAsync = createAsyncThunk(
  'enrollments/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await enrollmentsService.createEnrollment(data);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Enrollment failed');
    }
  }
);

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch My Enrollments (student)
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.myLoading = true;
        state.error = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.myLoading = false;
        state.myEnrollments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.myLoading = false;
        state.error = action.payload as string;
      })
      // Fetch By Bootcamp (instructor/admin)
      .addCase(fetchBootcampEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBootcampEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBootcampEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create enrollment — optimistically add to myEnrollments
      .addCase(createEnrollmentAsync.fulfilled, (state, action) => {
        const enrollment = action.payload.data || action.payload;
        if (enrollment?._id) {
          state.myEnrollments.push(enrollment);
        }
      });
  },
});

export default enrollmentsSlice.reducer;
