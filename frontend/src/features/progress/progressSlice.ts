import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProgressReport {
  id: string;
  studentId: string;
  week: number;
  score: number;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  remarks: string;
}

interface ProgressState {
  reports: ProgressReport[];
}

const initialState: ProgressState = {
  reports: [
    { id: '1', studentId: '3', week: 1, score: 85, status: 'PASSED', remarks: 'Good grasp of modular patterns.' },
    { id: '2', studentId: '3', week: 2, score: 92, status: 'PASSED', remarks: 'Excellent project structure.' },
  ],
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addReport: (state, action: PayloadAction<ProgressReport>) => {
      state.reports.push(action.payload);
    },
  },
});

export const { addReport } = progressSlice.actions;
export default progressSlice.reducer;
