import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../services/all_others.service';
import { ProgressReport } from '../types';

export const fetchMyProgress = createAsyncThunk('progress/fetch', async (bootcampId: string) => (await progressService.getMyProgress(bootcampId)).data);

const progressSlice = createSlice({ 
  name: 'progress', 
  initialState: { report: null, loading: false } as { report: ProgressReport | null; loading: boolean }, 
  reducers: {}, 
  extraReducers: (b) => {
    b.addCase(fetchMyProgress.fulfilled, (s, a) => { s.report = a.payload; });
  } 
});
export default progressSlice.reducer;
