import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { groupService, enrollmentService, feedbackService, progressService } from '../services/all_others.service';
import { Group, Enrollment, Feedback, ProgressReport, Notification } from '../types';

// Combinations for brevity
interface RestState {
  groups: Group[];
  enrollments: Enrollment[];
  feedbacks: Feedback[];
  progressReport: ProgressReport | null;
  notifications: Notification[];
}

// Group Slice
export const fetchGroupsByBootcamp = createAsyncThunk('groups/fetch', async (id: string) => (await groupService.getBootcampGroups(id)).data);
const groupSlice = createSlice({ name: 'groups', initialState: { groups: [], loading: false } as { groups: Group[]; loading: boolean }, reducers: {}, extraReducers: (b) => b.addCase(fetchGroupsByBootcamp.fulfilled, (s, a) => { s.groups = a.payload; }) });
export default groupSlice.reducer;
