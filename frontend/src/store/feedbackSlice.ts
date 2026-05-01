import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedbackService } from '../services/all_others.service';
import { Feedback } from '../types';

export const fetchFeedbackByBootcamp = createAsyncThunk('feedback/fetch', async (id: string) => (await feedbackService.getBootcampFeedback(id)).data);

const feedbackSlice = createSlice({ 
  name: 'feedback', 
  initialState: { feedbacks: [], loading: false } as { feedbacks: Feedback[]; loading: boolean }, 
  reducers: {}, 
  extraReducers: (b) => {
    b.addCase(fetchFeedbackByBootcamp.fulfilled, (s, a) => { s.feedbacks = a.payload; });
  } 
});
export default feedbackSlice.reducer;
