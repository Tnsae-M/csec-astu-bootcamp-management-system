import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Enrollment {
  _id: string;
  id?: string;
  user: any; // User object containing name, email etc.
  bootcamp: string | any;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'DROPPED';
  enrolledAt: string;
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
      state.loading = false;
      state.enrollments = action.payload;
    },
    setEnrollmentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setEnrollmentsStart, setEnrollmentsSuccess, setEnrollmentsFailure } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
