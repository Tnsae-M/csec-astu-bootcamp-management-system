import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enrollmentService } from '../services/all_others.service';
import { Enrollment } from '../types';

export const fetchEnrollmentsByBootcamp = createAsyncThunk('enrollments/fetch', async (id: string) => (await enrollmentService.getBootcampRoster(id)).data);
export const fetchMyEnrollments = createAsyncThunk('enrollments/fetchMe', async () => (await enrollmentService.getMyEnrollments()).data);

const enrollmentSlice = createSlice({ 
  name: 'enrollments', 
  initialState: { enrollments: [], loading: false } as { enrollments: Enrollment[]; loading: boolean }, 
  reducers: {}, 
  extraReducers: (b) => {
    b.addCase(fetchEnrollmentsByBootcamp.fulfilled, (s, a) => { s.enrollments = a.payload; });
    b.addCase(fetchMyEnrollments.fulfilled, (s, a) => { s.enrollments = a.payload; });
  } 
});
export default enrollmentSlice.reducer;
