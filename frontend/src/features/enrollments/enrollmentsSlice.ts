import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Enrollment {
  _id: string;
<<<<<<< Updated upstream
  id?: string;
  user: any; // User object containing name, email etc.
  bootcamp: string | any;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'DROPPED';
  enrolledAt: string;
=======
  studentId: string | any;
  bootcampId: string | any;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'DROPPED';
  createdAt: string;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      state.loading = false;
=======
>>>>>>> Stashed changes
      state.enrollments = action.payload;
      state.loading = false;
    },
    setEnrollmentsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setEnrollmentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setEnrollmentsStart, setEnrollmentsSuccess, setEnrollmentsFailure } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
