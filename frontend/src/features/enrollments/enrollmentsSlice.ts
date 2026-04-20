import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Enrollment {
  id: string;
  studentId: string;
  bootcampId: string;
  divisionId: string;
  enrolledAt: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'DROPPED';
}

interface EnrollmentsState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentsState = {
  enrollments: [
    { id: '1', studentId: '3', bootcampId: '1', divisionId: '1', enrolledAt: '2026-01-10', status: 'APPROVED' },
    { id: '2', studentId: '4', bootcampId: '1', divisionId: '2', enrolledAt: '2026-01-12', status: 'APPROVED' },
  ],
};

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
  },
});

export const { setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
