import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Enrollment {
  _id: string;
  id?: string;
  user?: any; // User object containing name, email etc.
  studentId?: string | any;
  bootcamp?: string | any;
  bootcampId?: string | any;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'DROPPED';
  enrolledAt?: string;
  createdAt?: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentsState = {
  enrollments: [],
  loading: false,
  error: null,
};

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    setEnrollmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setEnrollmentsSuccess: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
      state.loading = false;
    },
    setEnrollmentsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setEnrollmentsStart, setEnrollmentsSuccess, setEnrollmentsFailure } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
